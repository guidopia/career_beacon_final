const express = require('express');
const axios = require('axios');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const requirePlatformAccess = require('../middleware/platformAccess');

const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

// Simple in-memory cache for module-level resource lookups.
// Key: `${skill}::${moduleTitle}` (lowercased, trimmed)
// Value: { resources, expiresAt }
// TTL: 7 days. Saves repeated Perplexity calls when users revisit the same skill.
const resourceCache = new Map();
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const cacheKey = (skill, moduleTitle) =>
  `${String(skill || '').toLowerCase().trim()}::${String(moduleTitle || '').toLowerCase().trim()}`;

const getCached = (key) => {
  const entry = resourceCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    resourceCache.delete(key);
    return null;
  }
  return entry.resources;
};

const setCached = (key, resources) => {
  resourceCache.set(key, { resources, expiresAt: Date.now() + CACHE_TTL_MS });
};

const validatePerplexityKey = (req, res, next) => {
  if (!PERPLEXITY_API_KEY) {
    console.error('❌ PERPLEXITY_API_KEY environment variable is not set');
    return res.status(500).json({
      error: 'Perplexity service configuration error',
      message: 'Service temporarily unavailable',
    });
  }
  next();
};

// Per-IP rate limit: 30 requests / minute (we expect ~6 per skill so this is generous)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000;
const RATE_LIMIT_MAX = 30;

const rateLimit = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return next();
  }
  if (entry.count >= RATE_LIMIT_MAX) {
    return res.status(429).json({
      error: 'Rate limit exceeded',
      message: 'Too many requests. Please try again in a minute.',
    });
  }
  entry.count++;
  next();
};

// Extract a clean domain from a URL (e.g., https://developer.mozilla.org/path -> developer.mozilla.org)
const domainOf = (url) => {
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
};

// ---------- URL validation helpers ----------

// YouTube oEmbed returns 200 + metadata for live videos/playlists, 401/404 for unavailable.
// This is the cheapest reliable "is this video actually playable?" check.
// Also enriches the resource with the real title/channel/thumbnail when we can.
const validateYouTubeUrl = async (url) => {
  if (!url) return null;
  try {
    const oembed = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
    const r = await axios.get(oembed, { timeout: 5000, validateStatus: (s) => s >= 200 && s < 500 });
    if (r.status !== 200 || !r.data) return null;
    return {
      title: r.data.title || '',
      channel: r.data.author_name || '',
      thumbnail: r.data.thumbnail_url || '',
    };
  } catch {
    return null;
  }
};

// Lightweight liveness check for an article URL. Tries HEAD first, falls back to GET
// (some servers reject HEAD). Accepts 2xx and 3xx; treats 4xx/5xx as dead.
const validateArticleUrl = async (url) => {
  if (!url || typeof url !== 'string') return false;
  const config = {
    timeout: 6000,
    maxRedirects: 5,
    validateStatus: (s) => s >= 200 && s < 600,
    headers: {
      // Some sites (e.g., Medium, Cloudflare) block default node clients
      'User-Agent':
        'Mozilla/5.0 (compatible; CareerBeacon-LinkValidator/1.0; +https://career-beacon)',
      Accept: 'text/html,application/xhtml+xml',
    },
  };
  try {
    let r = await axios.head(url, config);
    if (r.status === 405 || r.status === 403 || r.status === 501) {
      // HEAD not allowed — retry as a GET (don't download body fully — server still
      // returns the status code on response start; axios will buffer but it's a small
      // article so this is acceptable).
      r = await axios.get(url, config);
    }
    return r.status >= 200 && r.status < 400;
  } catch {
    return false;
  }
};

// Pull the first JSON object from a string. Perplexity sometimes prefixes/suffixes prose.
const extractJSON = (raw) => {
  if (!raw || typeof raw !== 'string') return null;
  // Remove fenced code blocks if present
  const cleaned = raw.replace(/```json\s*([\s\S]*?)```/i, '$1').replace(/```\s*([\s\S]*?)```/i, '$1').trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      try { return JSON.parse(match[0]); } catch { return null; }
    }
    return null;
  }
};

const isYouTubeUrl = (url) =>
  typeof url === 'string' && /(?:youtube\.com|youtu\.be)/i.test(url);

const buildPrompt = (skill, moduleTitle, moduleDescription) => `
You are a learning resource curator. Find the BEST currently-available free learning resources online for someone learning the topic below.

Topic: "${moduleTitle}"
Part of skill: "${skill}"
Module summary: ${moduleDescription || '(none)'}

Return a single JSON object with this exact shape (no extra prose, no markdown):
{
  "video": {
    "url": "https://www.youtube.com/watch?v=... or https://www.youtube.com/playlist?list=...",
    "title": "Video or playlist title",
    "channel": "Channel name",
    "kind": "video" or "playlist",
    "duration": "e.g. 1h 20m or 12 videos (optional)"
  },
  "articles": [
    { "url": "https://...", "title": "Article title", "source": "domain.com" },
    { "url": "https://...", "title": "Article title", "source": "domain.com" }
  ]
}

Strict rules:
- video.url MUST be a real, currently-accessible YouTube watch URL or YouTube playlist URL. NEVER invent IDs. ALWAYS include a video — search YouTube specifically.
- Prefer long-form (>30 min) videos or full playlists from reputable channels (freeCodeCamp, Fireship, Traversy Media, Net Ninja, MIT OCW, Stanford, official channels, etc.) that comprehensively cover the topic.
- articles MUST be from authoritative sources: official documentation, MDN, freeCodeCamp.org, dev.to (with high engagement), Smashing Magazine, CSS-Tricks, Real Python, Towards Data Science, university sites, official blogs. NEVER paywalled content.
- Provide exactly 1 video and 2 articles.
- All URLs must be real URLs you found via web search. If a URL was retrieved as a citation, use it as-is.
- Do NOT include affiliate links, paid courses, Udemy, Coursera (paid tier), or generic homepages when a topic-specific page exists.
`.trim();

// Fallback prompt — used only when the first call returned no YouTube video.
// Hard-restricts search to youtube.com so Sonar MUST return a video URL.
const buildVideoOnlyPrompt = (skill, moduleTitle) => `
Find the single best YouTube video or YouTube playlist that comprehensively teaches "${moduleTitle}" (part of learning "${skill}").

Return ONLY a JSON object:
{
  "video": {
    "url": "https://www.youtube.com/watch?v=... or https://www.youtube.com/playlist?list=...",
    "title": "Video or playlist title",
    "channel": "Channel name",
    "kind": "video" or "playlist",
    "duration": "optional"
  }
}

Rules:
- video.url MUST be a real YouTube watch URL or playlist URL retrieved via web search. NEVER fabricate IDs.
- Prefer long videos (>30 min) or full playlists from reputable channels (freeCodeCamp, Fireship, Traversy Media, Net Ninja, MIT OCW, Stanford, official channels).
`.trim();

const callPerplexity = async (messages, opts = {}) => {
  const body = {
    model: 'sonar',
    messages,
    temperature: 0.2,
    max_tokens: 700,
    ...opts,
  };
  return axios.post(PERPLEXITY_API_URL, body, {
    headers: {
      Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
      'Content-Type': 'application/json',
    },
    timeout: 25000,
  });
};

router.post(
  '/module-resources',
  authenticateToken,
  requirePlatformAccess,
  validatePerplexityKey,
  rateLimit,
  async (req, res) => {
    try {
      const { skill, moduleTitle, moduleDescription } = req.body || {};

      if (!skill || !moduleTitle) {
        return res.status(400).json({
          error: 'Bad request',
          message: 'skill and moduleTitle are required',
        });
      }

      const key = cacheKey(skill, moduleTitle);
      const cached = getCached(key);
      if (cached) {
        return res.json({ resources: cached, cached: true });
      }

      // ---------- PRIMARY CALL: video + articles in one shot ----------
      const prompt = buildPrompt(skill, moduleTitle, moduleDescription);
      const response = await callPerplexity([
        {
          role: 'system',
          content:
            'You return only valid JSON. Never include explanatory prose, markdown, or commentary outside the JSON object. All URLs must come from your live web search results.',
        },
        { role: 'user', content: prompt },
      ]);

      const raw = response?.data?.choices?.[0]?.message?.content || '';
      const citations = Array.isArray(response?.data?.citations) ? response.data.citations : [];
      const parsed = extractJSON(raw) || {};

      // ---------- BUILD CANDIDATE VIDEO LIST ----------
      // Order: model's primary pick → any YouTube URLs in citations.
      // We'll validate them in order and use the first one that's actually live.
      const videoCandidates = [];
      if (parsed.video && isYouTubeUrl(parsed.video.url)) {
        videoCandidates.push({
          url: parsed.video.url,
          title: String(parsed.video.title || '').slice(0, 200),
          channel: String(parsed.video.channel || '').slice(0, 100),
          kind: parsed.video.kind === 'playlist' ? 'playlist' : 'video',
          duration: parsed.video.duration ? String(parsed.video.duration).slice(0, 40) : '',
        });
      }
      for (const c of citations) {
        if (isYouTubeUrl(c) && !videoCandidates.some((v) => v.url === c)) {
          videoCandidates.push({
            url: c,
            title: '',
            channel: '',
            kind: /playlist\?list=/i.test(c) ? 'playlist' : 'video',
            duration: '',
          });
        }
      }

      // ---------- VALIDATE VIDEO + ARTICLES IN PARALLEL ----------
      const rawArticles = Array.isArray(parsed.articles)
        ? parsed.articles
            .filter((a) => a && typeof a.url === 'string' && /^https?:\/\//i.test(a.url) && !isYouTubeUrl(a.url))
            .slice(0, 4)
            .map((a) => ({
              url: a.url,
              title: String(a.title || '').slice(0, 200),
              source: String(a.source || domainOf(a.url) || '').slice(0, 80),
            }))
        : [];

      // Add citation-based article fallbacks (extra options, will only be kept if live)
      for (const c of citations) {
        if (typeof c === 'string' && /^https?:\/\//i.test(c) && !isYouTubeUrl(c)) {
          if (!rawArticles.some((a) => a.url === c)) {
            rawArticles.push({ url: c, title: '', source: domainOf(c) });
            if (rawArticles.length >= 6) break;
          }
        }
      }

      const [videoValidations, articleValidations] = await Promise.all([
        Promise.all(videoCandidates.map((v) => validateYouTubeUrl(v.url))),
        Promise.all(rawArticles.map((a) => validateArticleUrl(a.url))),
      ]);

      // ---------- VIDEO: pick the first validated candidate ----------
      let video = null;
      for (let i = 0; i < videoCandidates.length; i++) {
        const meta = videoValidations[i];
        if (meta) {
          const cand = videoCandidates[i];
          video = {
            url: cand.url,
            title: cand.title || meta.title || 'Recommended video',
            channel: cand.channel || meta.channel || '',
            kind: cand.kind,
            duration: cand.duration || '',
          };
          break;
        }
      }

      // ---------- VIDEO FALLBACK: dedicated YouTube-only Perplexity call ----------
      if (!video) {
        try {
          const videoOnlyResp = await callPerplexity(
            [
              {
                role: 'system',
                content:
                  'You return only valid JSON. The "video.url" field must be a real YouTube URL retrieved from web search. Never invent video IDs.',
              },
              { role: 'user', content: buildVideoOnlyPrompt(skill, moduleTitle) },
            ],
            { max_tokens: 400, search_domain_filter: ['youtube.com'] }
          );

          const vRaw = videoOnlyResp?.data?.choices?.[0]?.message?.content || '';
          const vCitations = Array.isArray(videoOnlyResp?.data?.citations) ? videoOnlyResp.data.citations : [];
          const vParsed = extractJSON(vRaw) || {};

          const fallbackCandidates = [];
          if (vParsed.video && isYouTubeUrl(vParsed.video.url)) {
            fallbackCandidates.push({
              url: vParsed.video.url,
              title: String(vParsed.video.title || '').slice(0, 200),
              channel: String(vParsed.video.channel || '').slice(0, 100),
              kind: vParsed.video.kind === 'playlist' ? 'playlist' : 'video',
              duration: vParsed.video.duration ? String(vParsed.video.duration).slice(0, 40) : '',
            });
          }
          for (const c of vCitations) {
            if (isYouTubeUrl(c) && !fallbackCandidates.some((f) => f.url === c)) {
              fallbackCandidates.push({
                url: c, title: '', channel: '',
                kind: /playlist\?list=/i.test(c) ? 'playlist' : 'video',
                duration: '',
              });
            }
          }

          const fallbackValidations = await Promise.all(
            fallbackCandidates.map((f) => validateYouTubeUrl(f.url))
          );
          for (let i = 0; i < fallbackCandidates.length; i++) {
            const meta = fallbackValidations[i];
            if (meta) {
              const cand = fallbackCandidates[i];
              video = {
                url: cand.url,
                title: cand.title || meta.title || 'Recommended video',
                channel: cand.channel || meta.channel || '',
                kind: cand.kind,
                duration: cand.duration || '',
              };
              break;
            }
          }
        } catch (fallbackErr) {
          console.warn('Perplexity video-only fallback failed:', fallbackErr?.response?.data || fallbackErr.message);
        }
      }

      // ---------- ARTICLES: keep only validated, take top 2 ----------
      const articles = rawArticles
        .map((a, i) => ({ ...a, alive: articleValidations[i] }))
        .filter((a) => a.alive)
        .slice(0, 2)
        .map(({ alive, ...rest }) => ({
          ...rest,
          title: rest.title || rest.source || 'Helpful article',
          source: rest.source || domainOf(rest.url),
        }));

      const resources = { video, articles };
      // Only cache if we actually got something useful — avoid caching empty results
      if (video || articles.length > 0) {
        setCached(key, resources);
      }

      return res.json({ resources, cached: false });
    } catch (err) {
      console.error('Perplexity resource error:', err?.response?.data || err.message);
      // Return graceful empty result so the client can still render the module
      return res.json({
        resources: { video: null, articles: [] },
        error: 'Failed to fetch resources',
        cached: false,
      });
    }
  }
);

module.exports = router;
