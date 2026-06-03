const express = require('express');
const router = express.Router();
const TimeTracking = require('../models/TimeTracking');
const User = require('../models/User');

/**
 * POST /api/analytics/track
 * Record a time tracking session
 * Body: { userId, module, sessionStart, sessionEnd, duration, route }
 * 
 * FAIL-SAFE: Returns 200 even on error to prevent disrupting user experience
 */
router.post('/track', async (req, res) => {
  try {
    const { userId, module, sessionStart, sessionEnd, duration, route } = req.body;

    // Silently accept tracking request

    // Validate required fields - but be lenient
    if (!userId || !module || !sessionStart || !sessionEnd || !duration || !route) {
      console.warn('⚠️ Missing required fields in tracking request:', req.body);
      // Return 200 to fail silently
      return res.status(200).json({ 
        success: false,
        message: 'Missing required fields, skipping tracking'
      });
    }

    // Validate module name
    const validModules = ['Sanskriti', 'Exam AI', 'Upskilling', 'College Search', 'Career Assessment', 'Future Me Card'];
    if (!validModules.includes(module)) {
      console.warn('⚠️ Invalid module name:', module);
      return res.status(200).json({ 
        success: false,
        message: 'Invalid module name, skipping tracking'
      });
    }

    // Validate duration (should be positive and reasonable - max 24 hours)
    if (duration < 0 || duration > 86400) {
      console.warn('⚠️ Invalid duration:', duration);
      return res.status(200).json({ 
        success: false,
        message: 'Invalid duration, skipping tracking'
      });
    }

    // Create time tracking record - wrapped in try-catch
    try {
      const timeTracking = new TimeTracking({
        userId: String(userId), // Ensure it's a string
        module,
        sessionStart: new Date(sessionStart),
        sessionEnd: new Date(sessionEnd),
        duration,
        route
      });

      await timeTracking.save();

      res.status(201).json({ 
        success: true,
        message: 'Time tracking recorded successfully',
        data: timeTracking
      });
    } catch (saveError) {
      // Log the error but don't fail the request
      console.error('❌ Error saving time tracking (failing silently):', saveError.message);
      
      // Return 200 to fail silently - don't disrupt user experience
      res.status(200).json({ 
        success: false,
        message: 'Failed to save tracking data, but continuing'
      });
    }
  } catch (error) {
    // Catch any unexpected errors
    console.error('❌ Unexpected error in tracking endpoint:', error);
    
    // Always return 200 - fail silently
    res.status(200).json({ 
      success: false,
      message: 'Tracking failed silently'
    });
  }
});

/**
 * GET /api/analytics/module-stats
 * Get aggregated statistics for all modules
 * Query params: days (default: 30) - number of days to look back
 */
router.get('/module-stats', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Wrap aggregation in try-catch
    let stats = [];
    try {
      stats = await TimeTracking.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: '$module',
            totalTime: { $sum: '$duration' }, // Total seconds
            totalSessions: { $sum: 1 },
            uniqueUsers: { $addToSet: '$userId' },
            avgSessionDuration: { $avg: '$duration' }
          }
        },
        {
          $project: {
            module: '$_id',
            totalTime: 1,
            totalTimeFormatted: {
              hours: { $floor: { $divide: ['$totalTime', 3600] } },
              minutes: { $floor: { $divide: [{ $mod: ['$totalTime', 3600] }, 60] } }
            },
            totalSessions: 1,
            uniqueUsers: { $size: '$uniqueUsers' },
            avgSessionDuration: { $round: ['$avgSessionDuration', 0] },
            avgSessionFormatted: {
              hours: { $floor: { $divide: ['$avgSessionDuration', 3600] } },
              minutes: { $floor: { $divide: [{ $mod: ['$avgSessionDuration', 3600] }, 60] } }
            },
            _id: 0
          }
        },
        {
          $sort: { totalTime: -1 }
        }
      ]);
    } catch (aggError) {
      console.error('❌ Error in aggregation:', aggError.message);
      stats = []; // Return empty array on error
    }

    // Get total users count for context - with error handling
    let totalUsers = 0;
    try {
      totalUsers = await User.countDocuments();
    } catch (userCountError) {
      console.warn('⚠️ Error counting users:', userCountError.message);
    }

    // Calculate average time per user for each module
    const enrichedStats = stats.map(stat => ({
      ...stat,
      avgTimePerUser: stat.uniqueUsers > 0 ? Math.round(stat.totalTime / stat.uniqueUsers) : 0,
      userEngagementRate: totalUsers > 0 ? ((stat.uniqueUsers / totalUsers) * 100).toFixed(2) : 0
    }));

    // Get daily breakdown for the last N days - with error handling
    let dailyBreakdown = [];
    try {
      dailyBreakdown = await TimeTracking.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: {
              date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
              module: '$module'
            },
            totalTime: { $sum: '$duration' },
            sessions: { $sum: 1 }
          }
        },
        {
          $sort: { '_id.date': 1 }
        }
      ]);
    } catch (dailyError) {
      console.warn('⚠️ Error fetching daily breakdown:', dailyError.message);
    }

    // Format daily breakdown
    const formattedDailyBreakdown = dailyBreakdown.map(item => ({
      date: item._id.date,
      module: item._id.module,
      totalTime: item.totalTime,
      sessions: item.sessions
    }));

    res.json({
      success: true,
      period: {
        days,
        startDate,
        endDate: new Date()
      },
      totalUsers,
      moduleStats: enrichedStats,
      dailyBreakdown: formattedDailyBreakdown
    });
  } catch (error) {
    console.error('❌ Error fetching module stats:', error);
    
    // Return empty data instead of error
    res.json({
      success: false,
      period: {
        days: parseInt(req.query.days) || 30,
        startDate: new Date(),
        endDate: new Date()
      },
      totalUsers: 0,
      moduleStats: [],
      dailyBreakdown: [],
      error: 'Failed to fetch statistics'
    });
  }
});

/**
 * GET /api/analytics/user-activity/:userId
 * Get time tracking data for a specific user
 * Query params: days (default: 30)
 * 
 * FIXED: Now handles string userIds properly (no ObjectId conversion)
 */
router.get('/user-activity/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const days = parseInt(req.query.days) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // No ObjectId conversion - use userId as string
    const userActivity = await TimeTracking.aggregate([
      {
        $match: {
          userId: String(userId), // Match as string, not ObjectId
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$module',
          totalTime: { $sum: '$duration' },
          sessions: { $sum: 1 }
        }
      },
      {
        $project: {
          module: '$_id',
          totalTime: 1,
          sessions: 1,
          _id: 0
        }
      },
      {
        $sort: { totalTime: -1 }
      }
    ]);

    res.json({
      success: true,
      userId,
      period: { days, startDate, endDate: new Date() },
      activity: userActivity
    });
  } catch (error) {
    console.error('❌ Error fetching user activity:', error);
    
    // Return empty data instead of error
    res.json({
      success: false,
      userId: req.params.userId,
      period: { 
        days: parseInt(req.query.days) || 30, 
        startDate: new Date(), 
        endDate: new Date() 
      },
      activity: [],
      error: 'Failed to fetch user activity'
    });
  }
});

/**
 * GET /api/analytics/advanced-stats
 * Get advanced analytics: growth, DAU, health score, peak hours, inactive users
 * Query params: days (default: 30)
 */
router.get('/advanced-stats', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - days);
    
    // Get previous period for comparison
    const prevStartDate = new Date(startDate);
    prevStartDate.setDate(prevStartDate.getDate() - days);

    // 1. Week-over-Week Growth
    const lastWeekStart = new Date(now);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);
    const prevWeekStart = new Date(lastWeekStart);
    prevWeekStart.setDate(prevWeekStart.getDate() - 7);

    const lastWeekSessions = await TimeTracking.countDocuments({
      createdAt: { $gte: lastWeekStart, $lte: now }
    });
    const prevWeekSessions = await TimeTracking.countDocuments({
      createdAt: { $gte: prevWeekStart, $lt: lastWeekStart }
    });
    
    const weekGrowth = prevWeekSessions > 0 
      ? ((lastWeekSessions - prevWeekSessions) / prevWeekSessions * 100).toFixed(1)
      : 0;

    // 2. Daily Active Users (last 7 days)
    const dailyActiveUsers = await TimeTracking.aggregate([
      {
        $match: { createdAt: { $gte: lastWeekStart } }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          uniqueUsers: { $addToSet: '$userId' }
        }
      },
      {
        $project: {
          date: '$_id',
          count: { $size: '$uniqueUsers' },
          _id: 0
        }
      },
      { $sort: { date: 1 } }
    ]);

    const avgDAU = dailyActiveUsers.length > 0
      ? Math.round(dailyActiveUsers.reduce((sum, day) => sum + day.count, 0) / dailyActiveUsers.length)
      : 0;

    // 3. Peak Usage Hours
    const hourlyUsage = await TimeTracking.aggregate([
      {
        $match: { createdAt: { $gte: startDate } }
      },
      {
        $group: {
          _id: { $hour: '$createdAt' },
          sessions: { $sum: 1 }
        }
      },
      { $sort: { sessions: -1 } },
      { $limit: 3 }
    ]);

    const peakHours = hourlyUsage.map(h => ({
      hour: h._id,
      sessions: h.sessions,
      timeRange: `${h._id}:00 - ${h._id + 1}:00`
    }));

    // 4. Inactive Users (users who haven't used platform in 7+ days)
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentActiveUsers = await TimeTracking.distinct('userId', {
      createdAt: { $gte: sevenDaysAgo }
    });
    
    const totalUsers = await User.countDocuments();
    const inactiveUsers = Math.max(0, totalUsers - recentActiveUsers.length);

    // 5. Overall Health Score (0-100)
    const totalSessions = await TimeTracking.countDocuments({ createdAt: { $gte: startDate } });
    const avgSessionsPerDay = totalSessions / days;
    const engagementRate = totalUsers > 0 ? (recentActiveUsers.length / totalUsers * 100) : 0;
    const growthScore = Math.min(100, Math.max(0, parseFloat(weekGrowth) + 50));
    
    const healthScore = Math.round(
      (engagementRate * 0.4) + // 40% weight on engagement
      (growthScore * 0.3) + // 30% weight on growth
      (Math.min(100, avgSessionsPerDay * 2) * 0.3) // 30% weight on activity
    );

    res.json({
      success: true,
      period: { days, startDate, endDate: now },
      weekOverWeekGrowth: {
        percentage: parseFloat(weekGrowth),
        lastWeek: lastWeekSessions,
        previousWeek: prevWeekSessions,
        trend: weekGrowth >= 0 ? 'up' : 'down'
      },
      dailyActiveUsers: {
        average: avgDAU,
        daily: dailyActiveUsers
      },
      peakUsageHours: peakHours,
      inactiveUsers: {
        count: inactiveUsers,
        percentage: totalUsers > 0 ? ((inactiveUsers / totalUsers) * 100).toFixed(1) : 0
      },
      healthScore: {
        score: healthScore,
        rating: healthScore >= 80 ? 'Excellent' : healthScore >= 60 ? 'Good' : healthScore >= 40 ? 'Fair' : 'Needs Attention',
        metrics: {
          engagement: engagementRate.toFixed(1),
          growth: weekGrowth,
          activity: avgSessionsPerDay.toFixed(1)
        }
      }
    });
  } catch (error) {
    console.error('❌ Error fetching advanced stats:', error);
    res.json({
      success: false,
      weekOverWeekGrowth: { percentage: 0, lastWeek: 0, previousWeek: 0, trend: 'neutral' },
      dailyActiveUsers: { average: 0, daily: [] },
      peakUsageHours: [],
      inactiveUsers: { count: 0, percentage: 0 },
      healthScore: { score: 0, rating: 'Unknown', metrics: {} },
      error: 'Failed to fetch advanced statistics'
    });
  }
});

module.exports = router;
