import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { apiAxios, clearStableAuthCache } from '../../api/index.js';
import { DEBUG_ACCESS, readHasPlatformAccess } from './platformAccess.js';

const AccessContext = createContext(null);

function getStoredToken() {
  try {
    return localStorage.getItem('authToken') || '';
  } catch {
    return '';
  }
}

// Background revalidation — frequent enough to pick up admin grants without spamming the API.
const BACKGROUND_REFRESH_MS = 45_000;

export function AccessProvider({ children }) {
  const [me, setMe] = useState(null);
  // `loading` is ONLY true during the very first authenticated fetch. Background
  // refreshes (focus / interval) must never flip this to true again — otherwise
  // every consumer that reads `loading` will toggle their UI and remount their
  // children, which is exactly what was causing global flickers and chat resets.
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const initializedRef = useRef(false);
  const inFlightRef = useRef(null);
  const lastFetchId = useRef(0);

  const refreshMe = useCallback(async ({ silent = false } = {}) => {
    const token = getStoredToken();
    if (!token) {
      setMe(null);
      setError('');
      clearStableAuthCache();
      if (!initializedRef.current) {
        initializedRef.current = true;
        setLoading(false);
      }
      return null;
    }

    // Single-flight: collapse concurrent calls into one network request.
    if (inFlightRef.current) return inFlightRef.current;

    const fetchId = ++lastFetchId.current;
    if (!silent && !initializedRef.current) {
      setLoading(true);
    }

    const promise = (async () => {
      try {
        const res = await apiAxios('/api/user/me', { method: 'GET' });
        if (fetchId !== lastFetchId.current) return null;
        const data = res?.data || null;
        setMe(data);
        setError('');
        if (DEBUG_ACCESS && data) {
          console.info('[access] /api/user/me payload', {
            userId: data._id,
            email: data.email,
            hasPlatformAccessRaw: data.hasPlatformAccess,
            hasPlatformAccessCoerced: readHasPlatformAccess(data),
          });
        }
        return data;
      } catch (e) {
        if (fetchId !== lastFetchId.current) return null;
        const status = e?.response?.status;
        setError(e?.response?.data?.message || e?.message || 'Failed to load user');
        // Auth failure: drop profile. Transient errors: keep last good `me` (no stale `me` from closure).
        if (status === 401 || status === 403) {
          setMe(null);
          clearStableAuthCache();
        }
        return null;
      } finally {
        inFlightRef.current = null;
        if (!initializedRef.current) {
          initializedRef.current = true;
          setLoading(false);
        }
      }
    })();

    inFlightRef.current = promise;
    return promise;
  }, []);

  // Initial load — runs exactly once.
  useEffect(() => {
    refreshMe();
  }, [refreshMe]);

  // Silent background revalidation. Never flips `loading`, never remounts children.
  useEffect(() => {
    const runSilent = () => refreshMe({ silent: true });
    const onFocus = () => runSilent();
    const onVisible = () => {
      if (typeof document !== 'undefined' && !document.hidden) runSilent();
    };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisible);
    const t = setInterval(runSilent, BACKGROUND_REFRESH_MS);
    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisible);
      clearInterval(t);
    };
  }, [refreshMe]);

  const hasPlatformAccess = readHasPlatformAccess(me);

  const value = useMemo(
    () => ({
      me,
      hasPlatformAccess,
      loading,
      error,
      refreshMe,
    }),
    [me, hasPlatformAccess, loading, error, refreshMe]
  );

  return <AccessContext.Provider value={value}>{children}</AccessContext.Provider>;
}

export function useAccess() {
  const ctx = useContext(AccessContext);
  if (!ctx) throw new Error('useAccess must be used within AccessProvider');
  return ctx;
}
