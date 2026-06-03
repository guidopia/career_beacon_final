/**
 * Normalize admin-granted platform access from /api/user/me (or similar) payloads.
 * Handles strict boolean, legacy string/number values, and missing fields.
 */
export function readHasPlatformAccess(user) {
  if (!user || typeof user !== 'object') return false;
  const v = user.hasPlatformAccess;
  if (v === true) return true;
  if (v === false || v === null || v === undefined) return false;
  if (typeof v === 'number') return v === 1;
  if (typeof v === 'string') {
    const s = v.trim().toLowerCase();
    return s === 'true' || s === '1' || s === 'yes';
  }
  return Boolean(v);
}

export const DEBUG_ACCESS =
  typeof import.meta !== 'undefined' && import.meta.env?.VITE_DEBUG_ACCESS === 'true';
