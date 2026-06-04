import { useEffect, useRef, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { apiAxios, clearStableAuthCache } from '../api/index';

// Module-level session cache so multiple ProtectedRoute mounts (one per route)
// share a single decision and a single in-flight call. This is what stops the
// "every navigation triggers a spinner" flicker.
const SESSION_CACHE_TTL_MS = 60_000;
let sessionCache = { token: '', authenticated: false, at: 0 };
let inFlight = null;

export default function ProtectedRoute({ children }) {
  // Initial state: if we already have a fresh decision in module cache, start
  // resolved. This avoids the spinner-on-every-route-change behavior.
  const initial = (() => {
    try {
      const t = localStorage.getItem('authToken') || '';
      const fresh =
        t && sessionCache.token === t && Date.now() - sessionCache.at < SESSION_CACHE_TTL_MS;
      if (fresh) return { loading: false, authenticated: Boolean(sessionCache.authenticated) };
    } catch {
      // ignore — fall through to loading state
    }
    return { loading: true, authenticated: false };
  })();

  const [loading, setLoading] = useState(initial.loading);
  const [authenticated, setAuthenticated] = useState(initial.authenticated);
  const [verifyError, setVerifyError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const tokenHandled = useRef(false);

  useEffect(() => {
    let alive = true;

    // Step 1: capture ?token=... once per session, then strip it from URL.
    const params = new URLSearchParams(location.search);
    const tokenInUrl = params.get('token');
    if (tokenInUrl && !tokenHandled.current) {
      tokenHandled.current = true;
      try {
        localStorage.setItem('authToken', tokenInUrl);
      } catch {
        // ignore — non-blocking
      }
      params.delete('token');
      navigate(
        { pathname: location.pathname, search: params.toString() },
        { replace: true }
      );
      // Must not return here: pathname is unchanged, so this effect will not run
      // again on search-only updates — we would never call checkAuth and loading
      // would stay true forever (common after OAuth → /onboarding?token=...).
    }

    const storedToken = (() => {
      try {
        return localStorage.getItem('authToken') || '';
      } catch {
        return '';
      }
    })();

    if (!storedToken) {
      setAuthenticated(false);
      setLoading(false);
      return () => {
        alive = false;
      };
    }

    // Cache hit fast-path — never show a spinner on subsequent navigations.
    const now = Date.now();
    if (
      sessionCache.token === storedToken &&
      now - sessionCache.at < SESSION_CACHE_TTL_MS
    ) {
      setVerifyError('');
      setAuthenticated(Boolean(sessionCache.authenticated));
      setLoading(false);
      return () => {
        alive = false;
      };
    }

    const checkAuth = async () => {
      try {
        if (!inFlight) {
          inFlight = apiAxios('/auth/session', { method: 'GET' })
            .then((response) => {
              const ok = Boolean(response?.data?.authenticated);
              sessionCache = { token: storedToken, authenticated: ok, at: Date.now() };
              return ok;
            })
            .finally(() => {
              inFlight = null;
            });
        }

        const ok = await inFlight;
        if (!alive) return;
        setVerifyError('');
        setAuthenticated(ok);
        if (!ok) {
          try {
            localStorage.removeItem('authToken');
            clearStableAuthCache();
          } catch {
            // ignore
          }
        }
      } catch (error) {
        // Don't force logout on network/CORS hiccups; only clear token on real auth failures.
        const status = error?.response?.status;
        if (!alive) return;
        if (status === 401 || status === 403) {
          try {
            localStorage.removeItem('authToken');
            clearStableAuthCache();
          } catch {
            // ignore
          }
          setAuthenticated(false);
          setVerifyError('');
        } else {
          const isNetwork =
            !error?.response &&
            (error?.code === 'ERR_NETWORK' || error?.message === 'Network Error');
          if (status === 500 || isNetwork) {
            setVerifyError(
              'Cannot reach the authentication server (often a CORS or API URL mismatch). Retry in a moment; if it persists, redeploy the backend with the latest CORS settings.'
            );
          } else {
            setVerifyError('Unable to verify session. Please check your connection and try again.');
          }
          // Keep last known authenticated state intact for transient errors so the
          // UI doesn't redirect to /login on every flaky network blip.
        }
      } finally {
        if (alive) setLoading(false);
      }
    };

    checkAuth();
    return () => {
      alive = false;
    };
    // We deliberately depend ONLY on pathname (not the whole `location`) to
    // avoid running this effect on hash/search changes that don't affect auth.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400" />
      </div>
    );
  }

  if (!authenticated) {
    if (verifyError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-black px-6">
          <div className="text-center max-w-md">
            <p className="text-white/80 text-sm">{verifyError}</p>
            <button
              type="button"
              className="mt-4 px-4 py-2 text-sm text-black bg-cyan-400 rounded-md hover:bg-cyan-300 transition-colors"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        </div>
      );
    }
    return <Navigate to="/login" replace />;
  }

  return children;
}
