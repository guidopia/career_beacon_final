import { API_BASE_URL } from '../api/index.js';

// Module tracking state
let currentTracking = null;

/**
 * Module name mappings for consistent tracking
 */
export const MODULE_NAMES = {
  ASSISTANT: 'Career Beacon Assistant',
  EXAM_AI: 'Exam AI',
  UPSKILLING: 'Upskilling',
  COLLEGE_SEARCH: 'College Search',
  CAREER_ASSESSMENT: 'Career Assessment',
  FUTURE_ME_CARD: 'Future Me Card'
};

/**
 * Determine module from route path
 */
export const getModuleFromRoute = (pathname) => {
  // Career Beacon Assistant
  if (pathname.includes('/assistant')) {
    return MODULE_NAMES.ASSISTANT;
  }
  
  // Exam AI
  if (pathname.includes('/exam-ai') || 
      pathname.includes('/setup') || 
      pathname.includes('/syllabus') || 
      pathname.includes('/test/') || 
      pathname.includes('/revision/') ||
      pathname.includes('/analytics')) {
    return MODULE_NAMES.EXAM_AI;
  }
  
  // Upskilling
  if (pathname.includes('/upskilling')) {
    return MODULE_NAMES.UPSKILLING;
  }
  
  // College Search
  if (pathname.includes('/college-search') || 
      pathname.includes('/explore') || 
      pathname.includes('/compare')) {
    return MODULE_NAMES.COLLEGE_SEARCH;
  }
  
  // Career Assessment
  if (pathname.includes('/career-selection') || 
      pathname.includes('-assessment') || 
      pathname.includes('-test') ||
      pathname.includes('/personality-test') ||
      pathname.includes('/aptitude-test') ||
      pathname.includes('/intelligence-test')) {
    return MODULE_NAMES.CAREER_ASSESSMENT;
  }
  
  // Future Me Card
  if (pathname.includes('/future-me')) {
    return MODULE_NAMES.FUTURE_ME_CARD;
  }
  
  return null;
};

/**
 * Start tracking time for a module
 */
export const startTracking = (module, route) => {
  // If already tracking the SAME module and route, don't restart
  if (currentTracking && currentTracking.module === module && currentTracking.route === route) {
    return; // Continue existing tracking session
  }
  
  // If tracking a DIFFERENT module, stop it first
  if (currentTracking) {
    stopTracking();
  }
  
  currentTracking = {
    module,
    route,
    sessionStart: new Date().toISOString(),
    startTime: Date.now()
  };
};

/**
 * Stop tracking and send data to backend
 * FAIL-SAFE: All errors are caught and logged, never throw
 */
export const stopTracking = async () => {
  if (!currentTracking) {
    return;
  }
  
  try {
    const sessionEnd = new Date().toISOString();
    const duration = Math.round((Date.now() - currentTracking.startTime) / 1000); // Convert to seconds
    
    // Only track if session is at least 5 seconds and less than 24 hours
    if (duration < 5 || duration > 86400) {
      currentTracking = null;
      return;
    }
    
    const trackingData = {
      userId: getUserId(),
      module: currentTracking.module,
      sessionStart: currentTracking.sessionStart,
      sessionEnd,
      duration,
      route: currentTracking.route
    };
    
    // Clear current tracking BEFORE sending to avoid duplicate tracking
    currentTracking = null;
    
    // Send to backend - wrapped in try-catch
    try {
      await sendTrackingData(trackingData);
    } catch (error) {
      console.error('❌ Failed to send tracking data (failing silently):', error.message);
      // Fail silently - we don't want tracking to disrupt user experience
    }
  } catch (error) {
    // Catch any unexpected errors in stopTracking
    console.error('❌ Unexpected error in stopTracking:', error.message);
    currentTracking = null; // Reset state
  }
};

/**
 * Get user ID - uses consistent identifier across devices
 * Priority: _id > email > googleId > anonymous (device-specific)
 */
const getUserId = () => {
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      // Use _id first, then email (consistent across devices), then googleId
      return user._id || user.id || user.email || user.googleId;
    }
  } catch (error) {
    // Silently handle error
  }
  
  // Fallback: use or create anonymous user ID (device-specific)
  let anonymousId = localStorage.getItem('anonymousUserId');
  if (!anonymousId) {
    anonymousId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('anonymousUserId', anonymousId);
  }
  return anonymousId;
};

/**
 * Send tracking data to backend
 * FAIL-SAFE: Catches all errors, never throws
 */
export const sendTrackingData = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/analytics/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
      // Add timeout to prevent hanging
      signal: AbortSignal.timeout(5000) // 5 second timeout
    });
    
    // Accept any 2xx response as success
    if (response.ok) {
      const result = await response.json();
      return result;
    } else {
      // Fail silently
      return { success: false, message: 'Non-OK response' };
    }
  } catch (error) {
    // Catch network errors, timeouts, etc. - fail silently
    return { success: false, error: error.message };
  }
};

/**
 * Fetch module statistics from backend
 * Returns empty data on error instead of throwing
 */
export const fetchModuleStats = async (days = 30) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/analytics/module-stats?days=${days}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });
    
    if (!response.ok) {
      // Return empty data structure instead of throwing
      return {
        success: false,
        moduleStats: [],
        totalUsers: 0,
        dailyBreakdown: []
      };
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    // Return empty data structure instead of throwing
    return {
      success: false,
      moduleStats: [],
      totalUsers: 0,
      dailyBreakdown: [],
      error: error.message
    };
  }
};

/**
 * Fetch user activity from backend
 * Returns empty data on error instead of throwing
 */
export const fetchUserActivity = async (userId, days = 30) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/analytics/user-activity/${userId}?days=${days}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });
    
    if (!response.ok) {
      return {
        success: false,
        activity: []
      };
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    return {
      success: false,
      activity: [],
      error: error.message
    };
  }
};

/**
 * Fetch advanced statistics from backend
 * Returns empty data on error instead of throwing
 */
export const fetchAdvancedStats = async (days = 30) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/analytics/advanced-stats?days=${days}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });
    
    if (!response.ok) {
      return {
        success: false,
        weekOverWeekGrowth: { percentage: 0, lastWeek: 0, previousWeek: 0, trend: 'neutral' },
        dailyActiveUsers: { average: 0, daily: [] },
        peakUsageHours: [],
        inactiveUsers: { count: 0, percentage: 0 },
        healthScore: { score: 0, rating: 'Unknown', metrics: {} }
      };
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    return {
      success: false,
      weekOverWeekGrowth: { percentage: 0, lastWeek: 0, previousWeek: 0, trend: 'neutral' },
      dailyActiveUsers: { average: 0, daily: [] },
      peakUsageHours: [],
      inactiveUsers: { count: 0, percentage: 0 },
      healthScore: { score: 0, rating: 'Unknown', metrics: {} },
      error: error.message
    };
  }
};

/**
 * Get current tracking state (for debugging)
 */
export const getCurrentTracking = () => currentTracking;

/**
 * Format duration in seconds to human-readable format
 */
export const formatDuration = (seconds) => {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  
  return `${minutes}m`;
};

