import React, { useEffect, useMemo, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Clock, X, LayoutDashboard } from 'lucide-react';
import { useAccess } from '../state/access/AccessContext.jsx';
import { DEBUG_ACCESS, readHasPlatformAccess } from '../state/access/platformAccess.js';

/**
 * Lightweight, non-blocking access gate.
 *
 * Design rules (intentional):
 *  - Never redirect. Never unmount children once they've been allowed.
 *  - Show the full-screen spinner ONLY for the very first auth resolution
 *    (when we don't yet know who the user is). After that, background
 *    refreshes are silent.
 *  - When the admin hasn't granted access, render a clean dismissible modal
 *    instead of routing to /pricing or /under-review. This keeps the URL
 *    stable and prevents redirect loops + flickers.
 *  - Access is derived from `me` loaded by AccessProvider (`/api/user/me`),
 *    refreshed on focus / visibility / interval so admin grants sync quickly.
 */
export default function RequirePlatformAccess({ children, source }) {
  const { me, hasPlatformAccess, loading } = useAccess();
  const navigate = useNavigate();
  const location = useLocation();
  const [dismissed, setDismissed] = useState(false);

  const tokenPresent = (() => {
    try {
      return Boolean(localStorage.getItem('authToken'));
    } catch {
      return false;
    }
  })();

  // Stable derived flag — no per-render fetches.
  const decision = useMemo(() => {
    // First authenticated profile load: avoid treating null `me` as "denied" while `loading` is true.
    if (loading && !me) return 'pending';
    // Not signed in (no token => `me` is null). This gate is only for signed-in users,
    // so never show the "access pending" modal while logged out.
    if (!me) return 'granted';
    if (hasPlatformAccess) return 'granted';
    return 'denied';
  }, [loading, me, hasPlatformAccess]);

  useEffect(() => {
    if (!DEBUG_ACCESS) return;
    console.info('[access] RequirePlatformAccess', {
      source: source || '(unknown)',
      path: location.pathname,
      tokenPresent,
      loading,
      hasMe: !!me,
      hasPlatformAccessRaw: me?.hasPlatformAccess,
      hasPlatformAccessCoerced: readHasPlatformAccess(me),
      decision,
      popupSource: decision === 'denied' ? 'RequirePlatformAccess: no platform access' : null,
    });
  }, [source, location.pathname, tokenPresent, loading, me, hasPlatformAccess, decision]);

  // Important: when logged out (no token), do NOT show the premium-access modal.
  // ProtectedRoute will handle the authenticated redirect, but this prevents a modal flash
  // during logout navigation or transient token clearing.
  if (!tokenPresent) {
    return <Navigate to="/login" replace />;
  }

  if (decision === 'pending') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400" />
      </div>
    );
  }

  if (decision === 'denied') {
    return (
      <AccessPendingScreen
        dismissed={dismissed}
        onDismiss={() => setDismissed(true)}
        onGoDashboard={() => navigate('/dashboard', { replace: true })}
      />
    );
  }

  return children;
}

function AccessPendingScreen({ dismissed, onDismiss, onGoDashboard }) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-950 via-black to-gray-900 flex items-center justify-center px-4 py-10">
      {!dismissed && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="access-pending-title"
          className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md shadow-2xl p-6 sm:p-7 relative"
        >
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss"
            className="absolute top-3 right-3 p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition"
          >
            <X size={16} />
          </button>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-400/25 flex items-center justify-center flex-shrink-0">
              <Clock className="text-cyan-300" />
            </div>
            <div className="min-w-0">
              <h2 id="access-pending-title" className="text-lg sm:text-xl font-bold text-white">
                Access pending approval
              </h2>
              <p className="mt-2 text-sm text-white/70 leading-relaxed">
                Your access request has been received. Access will be granted soon by the admin.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:justify-end">
            <button
              type="button"
              onClick={onDismiss}
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold transition"
            >
              Close
            </button>
            <button
              type="button"
              onClick={onGoDashboard}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black font-bold hover:shadow-lg hover:shadow-white/20 transition"
            >
              <LayoutDashboard size={18} />
              Go to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
