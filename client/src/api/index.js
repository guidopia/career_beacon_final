import axios from "axios";

// This file is the single source of truth for the backend API base URL. Use API_BASE_URL everywhere for backend calls.

const DEFAULT_PROD_API = "https://prodigy-ai-backend.vercel.app";
const DEFAULT_DEV_API = "http://localhost:3000";

function isLocalhostUrl(url) {
  if (!url || typeof url !== "string") return false;
  try {
    const u = new URL(url);
    return u.hostname === "localhost" || u.hostname === "127.0.0.1";
  } catch {
    return /localhost|127\.0\.0\.1/i.test(url);
  }
}

/**
 * Resolve API origin for the current bundle.
 *
 * Deployment pitfall: `VITE_API_URL=http://localhost:3000` in `.env` is baked into
 * production builds. The browser then calls the user's own machine — Upskilling /
 * Exam AI / OpenAI proxy all fail with network errors. In PROD we ignore localhost
 * env values and fall back to the deployed backend.
 *
 * Set `VITE_API_BASE_URL` (preferred) or `VITE_API_URL` to your real API origin in CI,
 * e.g. https://api.yourdomain.com — without trailing slash.
 */
function resolveApiBaseUrl() {
  const raw = (
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_API_URL ||
    ""
  )
    .trim()
    .replace(/\/$/, "");

  if (import.meta.env.PROD) {
    if (!raw || isLocalhostUrl(raw)) {
      return DEFAULT_PROD_API;
    }
    return raw;
  }

  if (raw && !isLocalhostUrl(raw)) {
    return raw;
  }
  return raw || DEFAULT_DEV_API;
}

export const API_BASE_URL = resolveApiBaseUrl();

/** Default axios timeout; long OpenAI proxy calls must pass `timeout` in options (see aiService.js, api/openai.js). */
const REQUEST_TIMEOUT_MS = 15_000;

const DEBUG_AUTH = import.meta.env.VITE_DEBUG_AUTH === 'true';

// Stabilization: avoid duplicate /auth/session calls during navigation.
// NOTE: `/api/user/me` is intentionally NOT cached — it carries `hasPlatformAccess`
// which must reflect admin grants immediately; caching caused false "access pending"
// popups for up to STABLE_CACHE_TTL_MS after approval.
const STABLE_CACHE_TTL_MS = 30_000;
const stableCache = new Map(); // key -> { at, value }
const stableInFlight = new Map(); // key -> Promise

function buildUrl(endpoint) {
  return endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
}

function getAuthToken() {
  try {
    return localStorage.getItem('authToken') || '';
  } catch {
    return '';
  }
}

function stableKey({ method, url, token }) {
  return `${method.toUpperCase()}|${url}|${token}`;
}

function isStableCacheCandidate({ method, endpoint }) {
  const m = (method || 'GET').toUpperCase();
  if (m !== 'GET') return false;
  return endpoint === '/auth/session';
}

/** Clear cached auth/session responses (e.g. after logout). Optional; not required for /me. */
export function clearStableAuthCache() {
  stableCache.clear();
  stableInFlight.clear();
}

// Utility function for making authenticated API calls with JWT
export const apiFetch = async (endpoint, options = {}) => {
  const url = buildUrl(endpoint);
  
  const token = getAuthToken();
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    }
  };

  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, { ...defaultOptions, ...options, signal: controller.signal });
  } finally {
    clearTimeout(t);
  }
};

// Utility function for making authenticated axios calls with JWT
export const apiAxios = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const method = (options.method || 'GET').toUpperCase();
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    }
  };

  const url = buildUrl(endpoint);
  const isCandidate = isStableCacheCandidate({ method, endpoint: endpoint.startsWith('http') ? new URL(url).pathname : endpoint });

  if (!isCandidate) {
    return axios({
      url,
      timeout: REQUEST_TIMEOUT_MS,
      ...defaultOptions,
      ...options
    });
  }

  const key = stableKey({ method, url, token });
  const now = Date.now();
  const cached = stableCache.get(key);
  if (cached && now - cached.at < STABLE_CACHE_TTL_MS) {
    if (DEBUG_AUTH) console.debug('[auth-cache] hit', { endpoint, method });
    return cached.value;
  }

  const inflight = stableInFlight.get(key);
  if (inflight) {
    if (DEBUG_AUTH) console.debug('[auth-cache] join in-flight', { endpoint, method });
    return inflight;
  }

  if (DEBUG_AUTH) console.debug('[auth-cache] miss', { endpoint, method });
  const p = axios({
    url,
    timeout: REQUEST_TIMEOUT_MS,
    ...defaultOptions,
    ...options
  })
    .then((res) => {
      stableCache.set(key, { at: Date.now(), value: res });
      return res;
    })
    .finally(() => {
      stableInFlight.delete(key);
    });

  stableInFlight.set(key, p);
  return p;
};

// Re-export OpenAI functions from dedicated module
export { generateQuiz, evaluateQuiz, getRecommendedResources, chatCompletion } from './openai.js';