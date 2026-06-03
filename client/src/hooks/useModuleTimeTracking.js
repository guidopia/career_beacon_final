import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  startTracking, 
  stopTracking, 
  getModuleFromRoute 
} from '../services/analyticsService';

/**
 * Custom hook to automatically track time spent on modules
 * Handles route changes, page visibility, and cleanup
 * 
 * OPTIMIZATIONS:
 * - Only tracks actual module pages (ignores landing, login, etc.)
 * - Minimum 5-second duration enforced in stopTracking
 * - All errors caught and handled silently
 */
export const useModuleTimeTracking = () => {
  const location = useLocation();
  const isTrackingRef = useRef(false);
  const currentModuleRef = useRef(null);
  const visibilityTimeRef = useRef(Date.now());

  useEffect(() => {
    try {
      const module = getModuleFromRoute(location.pathname);
      
      // Only track if we're on a module page (not landing, login, etc.)
      if (module) {
        // Start tracking this module
        startTracking(module, location.pathname);
        isTrackingRef.current = true;
        currentModuleRef.current = module;
      } else {
        // Non-module page - ensure tracking is stopped
        if (isTrackingRef.current) {
          stopTracking();
          isTrackingRef.current = false;
          currentModuleRef.current = null;
        }
      }
    } catch (error) {
      // Silently handle errors
    }

    // Cleanup: stop tracking when component unmounts or route changes
    return () => {
      try {
        if (isTrackingRef.current) {
          stopTracking();
          isTrackingRef.current = false;
          currentModuleRef.current = null;
        }
      } catch (error) {
        // Silently handle errors
      }
    };
  }, [location.pathname]);

  // Handle page visibility changes (user switches tabs, minimizes window, etc.)
  useEffect(() => {
    const handleVisibilityChange = () => {
      try {
        if (document.hidden) {
          // User left the page/tab - stop tracking
          if (isTrackingRef.current) {
            stopTracking();
            isTrackingRef.current = false;
            visibilityTimeRef.current = Date.now();
          }
        } else {
          // User returned to the page/tab - resume tracking
          const timeAway = Date.now() - visibilityTimeRef.current;
          
          // Only resume if they were away for less than 5 minutes
          // (otherwise assume they left and came back later)
          if (timeAway < 5 * 60 * 1000 && currentModuleRef.current) {
            const module = getModuleFromRoute(location.pathname);
            if (module) {
              startTracking(module, location.pathname);
              isTrackingRef.current = true;
            }
          }
        }
      } catch (error) {
        // Silently handle errors
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [location.pathname]);

  return {
    isTracking: isTrackingRef.current,
    currentModule: currentModuleRef.current
  };
};

export default useModuleTimeTracking;

