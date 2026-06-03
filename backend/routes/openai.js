
const express = require('express');
const axios = require('axios');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const requirePlatformAccess = require('../middleware/platformAccess');

// OpenAI API configuration
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Middleware to validate OpenAI API key
const validateOpenAIKey = (req, res, next) => {
  if (!OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY environment variable is not set');
    return res.status(500).json({
      error: 'OpenAI service configuration error',
      message: 'Service temporarily unavailable'
    });
  }
  next();
};

// Rate limiting middleware (basic implementation)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10; // 10 requests per minute per IP

const rateLimit = (req, res, next) => {
  const clientIP = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  
  if (!rateLimitMap.has(clientIP)) {
    rateLimitMap.set(clientIP, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return next();
  }
  
  const clientData = rateLimitMap.get(clientIP);
  
  if (now > clientData.resetTime) {
    clientData.count = 1;
    clientData.resetTime = now + RATE_LIMIT_WINDOW;
    return next();
  }
  
  if (clientData.count >= RATE_LIMIT_MAX_REQUESTS) {
    return res.status(429).json({
      error: 'Rate limit exceeded',
      message: 'Too many requests. Please try again later.',
      retryAfter: Math.ceil((clientData.resetTime - now) / 1000)
    });
  }
  
  clientData.count++;
  next();
};

// Error handling middleware
const handleOpenAIError = (error, req, res, next) => {
  console.error('OpenAI API Error:', error.message);
  
  if (error.response) {
    // OpenAI API returned an error
    const status = error.response.status;
    const data = error.response.data;
    
    switch (status) {
      case 401:
        return res.status(500).json({
          error: 'Authentication error',
          message: 'Service configuration error'
        });
      case 429:
        return res.status(429).json({
          error: 'Rate limit exceeded',
          message: 'OpenAI API rate limit exceeded. Please try again later.'
        });
      case 500:
        return res.status(500).json({
          error: 'OpenAI service error',
          message: 'AI service temporarily unavailable'
        });
      default:
        return res.status(500).json({
          error: 'AI service error',
          message: 'An error occurred while processing your request'
        });
    }
  }
  
  if (error.request) {
    return res.status(500).json({
      error: 'Network error',
      message: 'Unable to connect to AI service'
    });
  }
  
  return res.status(500).json({
    error: 'Internal error',
    message: 'An unexpected error occurred'
  });
};

// Generic chat completion endpoint
router.post('/chat', authenticateToken, requirePlatformAccess, validateOpenAIKey, rateLimit, async (req, res, next) => {
  try {
    console.log('📝 Request to: POST /api/openai/chat');
    console.log('📝 Origin:', req.headers.origin);
    console.log('📝 Authorization header:', req.headers.authorization ? 'Present' : 'Missing');
    console.log('📝 Admin key header:', req.headers['x-admin-key'] ? 'Present' : 'Missing');
    
    const { messages, model = 'gpt-3.5-turbo', temperature = 0.3, max_tokens = 4000 } = req.body;
    
    // Validate input
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      console.log('❌ Invalid input: messages array missing or empty');
      return res.status(400).json({
        error: 'Invalid input',
        message: 'Messages array is required and must not be empty'
      });
    }
    
    // Validate each message
    for (const message of messages) {
      if (!message.role || !message.content) {
        console.log('❌ Invalid input: message missing role or content');
        return res.status(400).json({
          error: 'Invalid input',
          message: 'Each message must have role and content'
        });
      }
    }
    
    console.log(`🤖 OpenAI API call: ${model}, ${messages.length} messages`);
    
    // Retry logic for timeout issues
    let retries = 2;
    let response;
    
    while (retries > 0) {
      try {
        response = await axios.post(
          OPENAI_API_URL,
          {
            model,
            messages,
            temperature,
            max_tokens
          },
          {
            headers: {
              'Authorization': `Bearer ${OPENAI_API_KEY}`,
              'Content-Type': 'application/json'
            },
            timeout: 60000 // Increased timeout to 60 seconds
          }
        );
        break; // Success, exit retry loop
      } catch (error) {
        retries--;
        if (retries === 0 || error.code !== 'ECONNABORTED') {
          throw error; // Re-throw if not timeout or no retries left
        }
        console.log(`⏰ Timeout occurred, retrying... (${retries} retries left)`);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retry
      }
    }
    
    const aiResponse = response.data.choices[0].message.content;
    
    res.json({
      success: true,
      content: aiResponse,
      usage: response.data.usage
    });
    
  } catch (error) {
    console.error('OpenAI API Error:', error.message);
    
    if (error.response) {
      // OpenAI API returned an error
      return res.status(error.response.status).json({
        error: 'OpenAI API Error',
        message: error.response.data?.error?.message || 'OpenAI service error',
        code: error.response.data?.error?.code
      });
    } else if (error.code === 'ECONNABORTED') {
      // Timeout error
      return res.status(408).json({
        error: 'Request Timeout',
        message: 'OpenAI API request timed out. Please try again.'
      });
    } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      // Network error
      return res.status(503).json({
        error: 'Service Unavailable',
        message: 'Unable to connect to OpenAI service. Please try again later.'
      });
    } else {
      // Generic error
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'An unexpected error occurred. Please try again.'
      });
    }
  }
});

// Quiz generation endpoint
router.post('/generate-quiz', authenticateToken, requirePlatformAccess, validateOpenAIKey, rateLimit, async (req, res, next) => {
  try {
    const { moduleName, quizPrompt } = req.body;
    
    if (!moduleName || !quizPrompt) {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'Module name and quiz prompt are required'
      });
    }
    
    console.log(`📝 Generating quiz for module: ${moduleName}`);
    
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: quizPrompt },
          { role: 'user', content: `Generate a quiz for the module: ${moduleName}` }
        ],
        temperature: 0.3,
        max_tokens: 4000
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 60000 // Increased timeout to 60 seconds
      }
    );
    
    const quizData = JSON.parse(response.data.choices[0].message.content);
    
    res.json({
      success: true,
      quiz: quizData,
      usage: response.data.usage
    });
    
  } catch (error) {
    if (error.message.includes('JSON')) {
      return res.status(500).json({
        error: 'Invalid response format',
        message: 'AI returned invalid quiz format'
      });
    }
    next(error);
  }
});

// Quiz evaluation endpoint
router.post('/evaluate-quiz', authenticateToken, requirePlatformAccess, validateOpenAIKey, rateLimit, async (req, res, next) => {
  try {
    const { moduleName, questions, userAnswers } = req.body;
    
    if (!moduleName || !questions || !userAnswers) {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'Module name, questions, and user answers are required'
      });
    }
    
    console.log(`📊 Evaluating quiz for module: ${moduleName}`);
    
    const evaluationPrompt = `You are a quiz evaluator. Evaluate the answers and return in this format:
Score: X/10 (X correct out of 10)

Feedback:
[For each incorrect answer, provide:
- Question number
- The user's incorrect answer
- The correct answer
- A brief explanation why]

If all answers are correct, include an encouraging message.`;
    
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: evaluationPrompt },
          {
            role: 'user',
            content: `Evaluate quiz answers for ${moduleName}:\n${JSON.stringify({
              questions,
              userAnswers
            })}`
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 60000 // Increased timeout to 60 seconds
      }
    );
    
    const evaluation = response.data.choices[0].message.content;
    
    res.json({
      success: true,
      evaluation,
      usage: response.data.usage
    });
    
  } catch (error) {
    next(error);
  }
});

// Resource recommendation endpoint
router.post('/recommend-resources', authenticateToken, requirePlatformAccess, validateOpenAIKey, rateLimit, async (req, res, next) => {
  try {
    const { skill } = req.body;
    
    if (!skill) {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'Skill parameter is required'
      });
    }
    
    console.log(`📚 Getting resources for skill: ${skill}`);
    
    const resourcePrompt = `You are a career guide specialized in helping people find learning resources. Provide a list of 5 high-quality, free resources for learning a specific skill. Include actual URLs to real resources like YouTube channels, free courses, documentation, open-source projects, etc. 

Format the response as a JSON array of objects:
[
  {
    "title": "Resource name",
    "type": "Video|Course|Documentation|Tool|Book",
    "url": "actual URL to the resource",
    "description": "Brief description of what this resource offers"
  }
]`;
    
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: resourcePrompt },
          { role: 'user', content: `Find free learning resources for: ${skill}` }
        ],
        temperature: 0.3,
        max_tokens: 2000
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 60000 // Increased timeout to 60 seconds
      }
    );
    
    const resources = JSON.parse(response.data.choices[0].message.content);
    
    res.json({
      success: true,
      resources,
      usage: response.data.usage
    });
    
  } catch (error) {
    if (error.message.includes('JSON')) {
      return res.status(500).json({
        error: 'Invalid response format',
        message: 'AI returned invalid resource format'
      });
    }
    next(error);
  }
});

// Syllabus generation endpoint
router.post('/generate-syllabus', authenticateToken, requirePlatformAccess, validateOpenAIKey, rateLimit, async (req, res, next) => {
  try {
    const { examName, subjectFocus, timeAvailable, prepLevel, syllabusPrompt } = req.body;
    
    if (!examName || !subjectFocus || !timeAvailable || !prepLevel || !syllabusPrompt) {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'All syllabus generation parameters are required'
      });
    }
    
    console.log(`📖 Generating syllabus for: ${examName} - ${subjectFocus}`);
    
    const setupText = `
STUDENT SETUP PROFILE:
Exam Name: ${examName}
Preparation Level: Level ${prepLevel}
Time Available: ${timeAvailable}
Selected Subject: ${subjectFocus}

CRITICAL ANALYSIS REQUIRED:
1. Identify the specific exam syllabus for "${examName}"
2. STRICTLY generate chapters for ONLY this subject: ${subjectFocus}
3. Based on time available "${timeAvailable}" determine chapter count:
   - "2 weeks" OR "1 month" OR "2 months": Return 10-15 MOST SCORING chapters
   - "3 months" OR "4 months" OR "5 months": Return 20-25 IMPORTANT chapters
   - "6 months" OR "1 year": Return 25-35 chapters (COMPLETE COMPREHENSIVE SYLLABUS)
4. Consider preparation level for chapter ordering and difficulty

🚨 MANDATORY: Return appropriate number of chapters for ${subjectFocus} ONLY 🚨
`;
    // Force a JSON object wrapper to reduce parse failures.
    // (Arrays are more likely to be wrapped in prose/markdown by the model.)
    const jsonOnlyInstruction = `

OUTPUT FORMAT (STRICT):
- Return ONLY valid JSON (no markdown, no backticks, no extra text).
- Return a JSON object with this shape:
  {"chapters":[ ... ]}
- "chapters" must be a non-empty array of chapter objects.
`;
    
    // Retry logic for timeout issues
    let retries = 2;
    let response;
    
    while (retries > 0) {
      try {
        response = await axios.post(
          OPENAI_API_URL,
          {
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: `${syllabusPrompt}\n${jsonOnlyInstruction}` },
              { role: 'user', content: `Generate syllabus chapters based on this setup:\n${setupText}\n\nReturn ONLY JSON in the exact format: {"chapters":[...]} (no extra text).` }
            ],
            temperature: 0.3,
            max_tokens: 6000,
            response_format: { type: 'json_object' }
          },
          {
            headers: {
              'Authorization': `Bearer ${OPENAI_API_KEY}`,
              'Content-Type': 'application/json'
            },
            timeout: 60000 // Increased timeout to 60 seconds
          }
        );
        break; // Success, exit retry loop
      } catch (error) {
        retries--;
        if (retries === 0 || error.code !== 'ECONNABORTED') {
          throw error; // Re-throw if not timeout or no retries left
        }
        console.log(`⏰ Timeout occurred, retrying... (${retries} retries left)`);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retry
      }
    }
    
    const content = response.data.choices[0].message.content;
    let parsed;
    let chapters;
    
    try {
      parsed = JSON.parse(content);
    } catch (parseError) {
      // Try to clean and parse the content
      const cleanedContent = content
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .replace(/^[^{[]*/, '')
        .replace(/[^}\]]*$/, '')
        .trim();
      
      parsed = JSON.parse(cleanedContent);
    }

    // Support both the new object wrapper and older array responses (fallback).
    if (Array.isArray(parsed)) {
      chapters = parsed;
    } else if (parsed && Array.isArray(parsed.chapters)) {
      chapters = parsed.chapters;
    }
    
    if (!Array.isArray(chapters) || chapters.length === 0) {
      throw new Error('Invalid response format from API');
    }
    
    res.json({
      success: true,
      chapters,
      usage: response.data.usage
    });
    
  } catch (error) {
    if (error.message.includes('JSON') || error.message.includes('Invalid response format')) {
      return res.status(500).json({
        error: 'Invalid response format',
        message: 'AI returned invalid syllabus format'
      });
    }
    next(error);
  }
});

// -----------------------------------------------------------------------------
// Chapter questions: generate 5×5 MCQs via 5 parallel OpenAI calls (one per level).
// Much faster and more reliable than one giant 25-question completion — fits Vercel
// time limits and avoids JSON truncation / timeouts on deployed backends.
// -----------------------------------------------------------------------------

// Per-level call must finish reliably; chapter generation runs multiple calls.
// Keep individual calls bounded so retries/backoff can still fit in serverless limits.
const CHAPTER_LEVEL_OPENAI_TIMEOUT_MS = 45000;

const CHAPTER_LEVEL_SPECS = [
  { level: 1, difficulty: 'Basic', focus: 'definitions, terminology, simple recall' },
  { level: 2, difficulty: 'Elementary', focus: 'short applications and straightforward scenarios' },
  { level: 3, difficulty: 'Intermediate', focus: 'concepts, comparisons, typical exam traps' },
  { level: 4, difficulty: 'Advanced', focus: 'multi-step reasoning and mixed concepts' },
  { level: 5, difficulty: 'Expert', focus: 'exam-hard questions, edge cases, strict timing style' }
];

function extractQuestionsJsonObject(content) {
  if (!content) return null;
  if (typeof content === 'object') return content;
  if (typeof content !== 'string') return null;
  const trimmed = content.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    try {
      const cleaned = trimmed
        .replace(/^\uFEFF/, '')
        .replace(/^```json\s*/i, '')
        .replace(/```\s*$/g, '')
        .trim();
      return JSON.parse(cleaned);
    } catch {
      // Some models wrap in an array of objects or add leading/trailing text.
      const fenced = trimmed.replace(/^```[\w-]*\s*/i, '').replace(/```\s*$/g, '').trim();
      try {
        return JSON.parse(fenced);
      } catch {}
      const m = trimmed.match(/\{[\s\S]*\}/);
      if (m) {
        try {
          return JSON.parse(m[0]);
        } catch {
          return null;
        }
      }
      return null;
    }
  }
}

function extractJsonObject(content) {
  const parsed = extractQuestionsJsonObject(content);
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null;
  return parsed;
}

/** Normalizes common model wrappers so we always read a `{ questions: [...] }` shape. */
function unwrapQuestionsPayload(parsed) {
  if (!parsed || typeof parsed !== 'object') return null;
  if (Array.isArray(parsed.questions)) return parsed;
  const inner = parsed.data || parsed.result || parsed.response || parsed.output || parsed.body;
  if (inner && typeof inner === 'object' && Array.isArray(inner.questions)) {
    return {
      level: inner.level ?? parsed.level,
      difficulty: inner.difficulty ?? parsed.difficulty,
      questions: inner.questions
    };
  }
  return null;
}

function normalizeMcqAnswer(ans) {
  const u = String(ans ?? '')
    .trim()
    .toUpperCase()
    .replace(/[^ABCD]/g, '');
  if (['A', 'B', 'C', 'D'].includes(u)) return u;
  const first = String(ans ?? '')
    .trim()
    .charAt(0)
    .toUpperCase();
  return ['A', 'B', 'C', 'D'].includes(first) ? first : 'A';
}

function normalizeLevelQuestions(parsed, spec) {
  const base = unwrapQuestionsPayload(parsed) || parsed;
  if (!base) return null;

  // Coerce common shapes into an array.
  let qs = base.questions;
  if (typeof qs === 'string') {
    const maybe = extractQuestionsJsonObject(qs);
    if (maybe && Array.isArray(maybe)) qs = maybe;
    else if (maybe && Array.isArray(maybe.questions)) qs = maybe.questions;
  }
  if (qs && typeof qs === 'object' && !Array.isArray(qs)) {
    // Handle { "0": {...}, "1": {...} } shapes.
    const vals = Object.values(qs);
    if (vals.length) qs = vals;
  }
  if (!Array.isArray(qs)) return null;

  const raw = qs.slice(0, 5);
  if (raw.length < 5) return null;

  const baseId = (spec.level - 1) * 5 + 1;
  const questions = raw.map((q, i) => {
    const opts = q.options && typeof q.options === 'object' ? q.options : {};
    const A = String(opts.A ?? opts.a ?? '').trim();
    const B = String(opts.B ?? opts.b ?? '').trim();
    const C = String(opts.C ?? opts.c ?? '').trim();
    const D = String(opts.D ?? opts.d ?? '').trim();
    return {
      id: typeof q.id === 'number' && Number.isFinite(q.id) ? q.id : baseId + i,
      question: String(q.question || '').trim() || `Practice question ${baseId + i}`,
      options: {
        A: A || 'Option A',
        B: B || 'Option B',
        C: C || 'Option C',
        D: D || 'Option D'
      },
      correctAnswer: normalizeMcqAnswer(q.correctAnswer),
      explanation: String(q.explanation || 'Review this concept before continuing.').trim()
    };
  });

  return {
    level: spec.level,
    difficulty: base.difficulty || spec.difficulty,
    questions
  };
}

async function fetchOpenAiOneLevel(spec, chapterName, examName, subject, curriculumHint) {
  const hintBlock =
    curriculumHint && curriculumHint.length > 0
      ? `\n\nCurriculum / style hints (truncated):\n${curriculumHint.slice(0, 700)}`
      : '';

  const systemContent = `You write exam-style multiple-choice questions. Output ONE JSON object only — no markdown, no prose outside JSON.${hintBlock}

Required JSON shape:
{"level":${spec.level},"difficulty":"${spec.difficulty}","questions":[ ... exactly 5 question objects ... ]}

Each question object MUST have:
"id" (number), "question" (string), "options" with keys "A","B","C","D" (strings), "correctAnswer" ("A"|"B"|"C"|"D"), "explanation" (short string).

Rules:
- Exactly 5 objects in "questions".
- Use ids ${(spec.level - 1) * 5 + 1} through ${spec.level * 5} (integers).
- Chapter: "${chapterName}". Exam: "${examName}". Subject: "${subject}".
- Emphasis for this batch: ${spec.focus}.
- Every option A–D must be meaningful and distinct (no placeholders like "N/A").`;

  const userContent = `Generate level ${spec.level} (${spec.difficulty}) — exactly 5 questions for this chapter and exam.\n\nReturn JSON ONLY.`;

  const payload = {
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemContent },
      { role: 'user', content: userContent }
    ],
    temperature: 0.2,
    max_tokens: 3400,
    response_format: { type: 'json_object' }
  };

  const requestHeaders = {
    Authorization: `Bearer ${OPENAI_API_KEY}`,
    'Content-Type': 'application/json'
  };

  let lastErr;
  for (let burst = 0; burst < 3; burst++) {
    try {
      const response = await axios.post(OPENAI_API_URL, payload, {
        headers: requestHeaders,
        timeout: CHAPTER_LEVEL_OPENAI_TIMEOUT_MS
      });

      const msg = response?.data?.choices?.[0]?.message || {};
      if (msg.refusal) {
        throw new Error(`OpenAI refused: ${msg.refusal}`);
      }

      const content = msg.content;
      let parsed = extractQuestionsJsonObject(content);
      const normalized = normalizeLevelQuestions(parsed, spec);
      if (!normalized) {
        // One repair attempt: ask the model to rewrite into the exact JSON shape.
        const repairPayload = {
          ...payload,
          temperature: 0,
          messages: [
            payload.messages[0],
            {
              role: 'user',
              content:
                `Rewrite the previous output into the required JSON shape exactly.\n\n` +
                `Do NOT add any text.\n` +
                `If you cannot, output: {"level":${spec.level},"difficulty":"${spec.difficulty}","questions":[]}`
            }
          ]
        };
        const repairResp = await axios.post(OPENAI_API_URL, repairPayload, {
          headers: requestHeaders,
          timeout: CHAPTER_LEVEL_OPENAI_TIMEOUT_MS
        });
        const repairMsg = repairResp?.data?.choices?.[0]?.message || {};
        parsed = extractQuestionsJsonObject(repairMsg.content);
        const repaired = normalizeLevelQuestions(parsed, spec);
        if (!repaired) throw new Error(`Could not parse level ${spec.level} questions`);
        return repaired;
      }
      return normalized;
    } catch (e) {
      lastErr = e;
      const status = e.response?.status;
      if (status === 429) {
        const ra = e.response?.headers?.['retry-after'];
        const waitMs = ra ? Math.min(parseInt(ra, 10) * 1000, 12_000) : 2500 + burst * 2000;
        console.warn(`⏳ Level ${spec.level} rate limited; waiting ${waitMs}ms`);
        await new Promise((r) => setTimeout(r, waitMs));
        continue;
      }
      // Retry on transient OpenAI/server errors.
      if ((status >= 500 && status <= 599) || e.code === 'ECONNRESET' || e.code === 'ETIMEDOUT') {
        const waitMs = 1200 + burst * 1400;
        console.warn(`⏳ Level ${spec.level} transient error; retrying in ${waitMs}ms`);
        await new Promise((r) => setTimeout(r, waitMs));
        continue;
      }
      throw e;
    }
  }
  throw lastErr || new Error(`OpenAI request failed for level ${spec.level}`);
}

async function generateOneLevelWithRetry(spec, chapterName, examName, subject, curriculumHint) {
  let lastErr;
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const levelObj = await fetchOpenAiOneLevel(spec, chapterName, examName, subject, curriculumHint);
      if (levelObj && levelObj.questions && levelObj.questions.length === 5) {
        return levelObj;
      }
    } catch (e) {
      lastErr = e;
      console.warn(`⚠️ Level ${spec.level} attempt ${attempt + 1} failed:`, e.message);
    }
    await new Promise((r) => setTimeout(r, 500 + attempt * 600));
  }
  throw lastErr || new Error(`Failed to generate level ${spec.level}`);
}

/**
 * Run all levels in parallel without fail-fast: Promise.all aborts when any level throws,
 * which wasted successful work and caused flaky timeouts.
 */
async function generateAllChapterLevels(chapterName, examName, subject, curriculumHint) {
  const specs = CHAPTER_LEVEL_SPECS.slice();

  // IMPORTANT: avoid firing 5 OpenAI requests at once (rate limits → all levels fail).
  // Concurrency=2 keeps wall time reasonable while staying under rate limits.
  const CONCURRENCY = 2;
  const results = new Array(specs.length);

  let idx = 0;
  async function worker() {
    while (idx < specs.length) {
      const my = idx;
      idx += 1;
      const spec = specs[my];
      results[my] = await generateOneLevelWithRetry(spec, chapterName, examName, subject, curriculumHint);
    }
  }

  const workers = [];
  for (let i = 0; i < Math.min(CONCURRENCY, specs.length); i++) workers.push(worker());

  const settled = await Promise.allSettled(workers);
  for (const s of settled) {
    if (s.status === 'rejected') {
      // Worker-level reject indicates an unhandled exception; surface it.
      throw s.reason;
    }
  }

  // Validate all results present and correctly shaped.
  const levelBlocks = results.filter(Boolean);
  if (levelBlocks.length !== 5 || levelBlocks.some((l) => !l?.questions || l.questions.length !== 5)) {
    throw new Error('Adaptive quiz generation incomplete: one or more levels failed');
  }
  return levelBlocks;
}

// Chapter questions generation endpoint
router.post('/generate-chapter-questions', authenticateToken, requirePlatformAccess, validateOpenAIKey, rateLimit, async (req, res, next) => {
  try {
    const { chapterName, examName, subject, questionsPrompt } = req.body;

    console.log('📝 POST /api/openai/generate-chapter-questions', {
      chapterName,
      examName,
      subject,
      hasPrompt: Boolean(questionsPrompt)
    });

    // `questionsPrompt` is optional — backend can generate without client prompt.
    if (!chapterName || !examName || !subject) {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'Chapter name, exam name, and subject are required'
      });
    }

    const curriculumHint = String(questionsPrompt || '')
      .replace(/\[CHAPTER_NAME\]/g, chapterName)
      .replace(/\[EXAM_NAME\]/g, examName);

    console.log(`❓ Parallel chapter questions for: ${chapterName} | ${examName} | ${subject}`);

    const levelBlocks = await generateAllChapterLevels(
      chapterName,
      examName,
      subject,
      curriculumHint
    );

    levelBlocks.sort((a, b) => a.level - b.level);

    const questions = {
      chapterName,
      examName,
      totalQuestions: 25,
      levels: levelBlocks
    };

    if (!questions.levels || questions.levels.length !== 5) {
      throw new Error('AI returned invalid question format');
    }
    for (let i = 0; i < questions.levels.length; i++) {
      const level = questions.levels[i];
      if (!level.questions || level.questions.length !== 5) {
        throw new Error(`Level ${i + 1} has incorrect number of questions`);
      }
    }

    res.json({
      success: true,
      questions
    });
  } catch (error) {
    console.error('Chapter questions generation error:', error.message);

    if (error.message.includes('invalid question format') || error.message.includes('incorrect number of questions')) {
      return res.status(500).json({
        error: 'Invalid response format',
        message: 'AI returned invalid question format'
      });
    }

    if (error.response) {
      return res.status(error.response.status >= 400 ? error.response.status : 500).json({
        error: 'OpenAI API Error',
        message: error.response.data?.error?.message || 'OpenAI service error',
        code: error.response.data?.error?.code
      });
    } else if (error.code === 'ECONNABORTED') {
      return res.status(408).json({
        error: 'Request Timeout',
        message: 'Question generation timed out. Please try again.'
      });
    } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        error: 'Service Unavailable',
        message: 'Unable to connect to OpenAI service. Please try again later.'
      });
    } else {
      return res.status(500).json({
        error: 'Internal Server Error',
        message: error.message || 'An unexpected error occurred. Please try again.'
      });
    }
  }
});

// Chapter revision generation endpoint
router.post('/generate-chapter-revision', authenticateToken, requirePlatformAccess, validateOpenAIKey, rateLimit, async (req, res, next) => {
  try {
    const { chapterName, examName, subject, revisionPrompt } = req.body;
    
    // `revisionPrompt` is optional — backend contains a safe default prompt.
    if (!chapterName || !examName || !subject) {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'Chapter name, exam name, and subject are required'
      });
    }
    
    console.log(`📚 Generating revision for chapter: ${chapterName}`);
    
    const processedPrompt = String(revisionPrompt || '')
      .replace(/\[CHAPTER_NAME\]/g, chapterName)
      .replace(/\[EXAM_NAME\]/g, examName);

    const systemPrompt = `You are an exam preparation tutor. Output ONE JSON object only (no markdown, no extra text).

Required JSON shape:
{
  "revision": {
    "introduction": {"overview":"string","examImportance":"string"},
    "coreConcepts": [{"title":"string","explanation":"string"}], // exactly 8
    "keyFormulasOrPoints": [{"title":"string","formulaOrPoint":"string","explanation":"string"}], // exactly 6
    "quickReference": {
      "quickFormulas": [{"formula":"string","use":"string"}], // exactly 4
      "summaryPoints": ["string"] // exactly 6
    }
  }
}

Rules:
- EXACTLY 8 coreConcepts and EXACTLY 6 keyFormulasOrPoints.
- EXACTLY 4 quickFormulas and EXACTLY 6 summaryPoints.
- Keep explanations concise and exam-focused.
- Chapter: "${chapterName}", Exam: "${examName}", Subject: "${subject}".`;
    
    const payload = {
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt + (processedPrompt ? `\n\nExtra style hints:\n${processedPrompt.slice(0, 600)}` : '') },
        {
          role: 'user',
          content:
            `Create the chapter revision now. Ensure EXACT counts and valid JSON only.`
        }
      ],
      temperature: 0.2,
      max_tokens: 2200,
      response_format: { type: 'json_object' }
    };

    const requestConfig = {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 45000
    };

    // Retry on transient errors and do a single "repair" pass on parse/shape issues.
    let response;
    let lastErr;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        response = await axios.post(OPENAI_API_URL, payload, requestConfig);
        break;
      } catch (e) {
        lastErr = e;
        const status = e.response?.status;
        if (status === 429) {
          const ra = e.response?.headers?.['retry-after'];
          const waitMs = ra ? Math.min(parseInt(ra, 10) * 1000, 12_000) : 2500 + attempt * 2000;
          console.warn(`⏳ Revision rate limited; waiting ${waitMs}ms`);
          await new Promise((r) => setTimeout(r, waitMs));
          continue;
        }
        if ((status >= 500 && status <= 599) || e.code === 'ECONNRESET' || e.code === 'ETIMEDOUT') {
          const waitMs = 1200 + attempt * 1400;
          console.warn(`⏳ Revision transient error; retrying in ${waitMs}ms`);
          await new Promise((r) => setTimeout(r, waitMs));
          continue;
        }
        throw e;
      }
    }
    if (!response) throw lastErr || new Error('OpenAI revision request failed');
    
    const msg = response?.data?.choices?.[0]?.message || {};
    if (msg.refusal) {
      throw new Error(`OpenAI refused: ${msg.refusal}`);
    }

    let revision = extractJsonObject(msg.content);
    if (!revision) {
      // Repair pass: ask to rewrite into the exact JSON shape.
      const repairPayload = {
        ...payload,
        temperature: 0,
        messages: [
          payload.messages[0],
          {
            role: 'user',
            content:
              `Rewrite into the required JSON shape exactly with correct counts. Output JSON ONLY.`
          }
        ]
      };
      const repairResp = await axios.post(OPENAI_API_URL, repairPayload, requestConfig);
      const repairMsg = repairResp?.data?.choices?.[0]?.message || {};
      revision = extractJsonObject(repairMsg.content);
    }
    
    if (!revision || !revision.revision || !revision.revision.introduction) {
      throw new Error('Invalid revision format from API');
    }

    // Enforce counts (repair prompt should already ensure this).
    // Backward-compatible shaping for existing UI (`RevisionContent.jsx` expects
    // introduction.overview/examImportance + coreTheory + importantFormulas, etc.).
    // Also ensure top-level chapterName/examName exist for display.
    revision.chapterName = revision.chapterName || chapterName;
    revision.examName = revision.examName || examName;

    const rev = revision.revision || {};
    if (typeof rev.introduction === 'string') {
      rev.introduction = { overview: rev.introduction, examImportance: '' };
    } else if (rev.introduction && typeof rev.introduction === 'object') {
      rev.introduction = {
        overview: String(rev.introduction.overview ?? ''),
        examImportance: String(rev.introduction.examImportance ?? '')
      };
    }

    // Map new schema -> old UI schema.
    if (Array.isArray(rev.coreConcepts) && !Array.isArray(rev.coreTheory)) {
      rev.coreTheory = rev.coreConcepts.map((c) => ({
        topic: String(c.title ?? ''),
        explanation: String(c.explanation ?? ''),
        keyPoints: []
      }));
    }
    if (Array.isArray(rev.keyFormulasOrPoints) && !Array.isArray(rev.importantFormulas)) {
      rev.importantFormulas = rev.keyFormulasOrPoints.map((f) => ({
        name: String(f.title ?? ''),
        formula: String(f.formulaOrPoint ?? ''),
        explanation: String(f.explanation ?? '')
      }));
    }

    // Provide quickReference defaults so UI sections don't crash or show blank blocks.
    if (!rev.quickReference || typeof rev.quickReference !== 'object') {
      rev.quickReference = {};
    }
    if (!Array.isArray(rev.quickReference.quickFormulas)) rev.quickReference.quickFormulas = [];
    if (!Array.isArray(rev.quickReference.summaryPoints)) rev.quickReference.summaryPoints = [];

    // If the model didn't populate quickReference, derive it from the generated sections.
    // This guarantees the UI always has something useful to render.
    if (rev.quickReference.quickFormulas.length === 0 && Array.isArray(rev.importantFormulas)) {
      rev.quickReference.quickFormulas = rev.importantFormulas
        .filter((f) => String(f.formula || f.keyPoint || '').trim().length > 0)
        .slice(0, 4)
        .map((f) => ({
          formula: String(f.formula || f.keyPoint || '').trim(),
          use: String(f.name || '').trim() || 'Use in relevant questions'
        }));
    }
    if (rev.quickReference.summaryPoints.length === 0 && Array.isArray(rev.coreTheory)) {
      rev.quickReference.summaryPoints = rev.coreTheory
        .slice(0, 6)
        .map((t) => String(t.topic || '').trim())
        .filter(Boolean);
    }

    revision.revision = rev;

    // Keep strict counts on the source arrays when present.
    if (Array.isArray(rev.coreConcepts) && rev.coreConcepts.length !== 8) {
      throw new Error('Invalid revision format from API');
    }
    if (Array.isArray(rev.keyFormulasOrPoints) && rev.keyFormulasOrPoints.length !== 6) {
      throw new Error('Invalid revision format from API');
    }
    
    res.json({
      success: true,
      revision,
      usage: response.data.usage
    });
    
  } catch (error) {
    console.error('Chapter revision generation error:', error.message);
    
    if (error.message.includes('Invalid revision format')) {
      return res.status(500).json({
        error: 'Invalid response format',
        message: 'AI returned invalid revision format'
      });
    }
    
    if (error.response) {
      // OpenAI API returned an error
      return res.status(error.response.status).json({
        error: 'OpenAI API Error',
        message: error.response.data?.error?.message || 'OpenAI service error',
        code: error.response.data?.error?.code
      });
    } else if (error.code === 'ECONNABORTED') {
      // Timeout error
      return res.status(408).json({
        error: 'Request Timeout',
        message: 'OpenAI API request timed out. Please try again.'
      });
    } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      // Network error
      return res.status(503).json({
        error: 'Service Unavailable',
        message: 'Unable to connect to OpenAI service. Please try again later.'
      });
    } else {
      // Generic error
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'An unexpected error occurred. Please try again.'
      });
    }
  }
});

// Apply error handling middleware
router.use(handleOpenAIError);

module.exports = router;
