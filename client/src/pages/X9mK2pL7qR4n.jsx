import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchModuleStats, formatDuration, MODULE_NAMES } from '../services/analyticsService';
import { 
  TrendingUp, 
  Users, 
  Clock, 
  Activity, 
  BarChart3,
  RefreshCw,
  Calendar,
  ArrowRight
} from 'lucide-react';

/**
 * Module Usage Analytics Dashboard
 * Hidden page for CEO/management to view module usage statistics
 */
const X9mK2pL7qR4n = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [days, setDays] = useState(30);
  const [refreshing, setRefreshing] = useState(false);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchModuleStats(days);
      
      // Check if data fetch was successful
      if (data && !data.error) {
        setStats(data);
      } else {
        // Data fetch failed but returned empty data
        setStats(data);
        if (data.error) {
          setError(data.error);
        }
      }
    } catch (err) {
      // Unexpected error - set empty data
      setError(err.message || 'Failed to load analytics data');
      setStats({
        moduleStats: [],
        totalUsers: 0,
        dailyBreakdown: []
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, [days]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadStats();
  };

  const getModuleColor = (moduleName) => {
    const colors = {
      'Career Beacon Assistant': 'from-orange-500 to-red-500',
      'Exam AI': 'from-cyan-500 to-blue-500',
      'Upskilling': 'from-green-500 to-emerald-500',
      'College Search': 'from-blue-500 to-indigo-500',
      'Career Assessment': 'from-purple-500 to-pink-500',
      'Future Me Card': 'from-yellow-500 to-orange-500'
    };
    return colors[moduleName] || 'from-gray-500 to-gray-700';
  };

  const getModuleIcon = (moduleName) => {
    const icons = {
      'Career Beacon Assistant': '🤖',
      'Exam AI': '📚',
      'Upskilling': '⚡',
      'College Search': '🎓',
      'Career Assessment': '🧠',
      'Future Me Card': '💝'
    };
    return icons[moduleName] || '📊';
  };

  if (loading && !refreshing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg">Loading analytics...</p>
        </div>
      </div>
    );
  }

  // Don't show full-screen error - show inline error instead
  // This prevents the page from completely breaking

  // Safe data extraction with fallbacks
  const totalModules = stats?.moduleStats?.length || 0;
  const totalTimeSec = stats?.moduleStats?.reduce((acc, stat) => acc + (stat?.totalTime || 0), 0) || 0;
  const totalSessions = stats?.moduleStats?.reduce((acc, stat) => acc + (stat?.totalSessions || 0), 0) || 0;
  const totalUniqueUsers = stats?.totalUsers || 0;

  // Calculate total hours for display - with safety checks
  const totalHours = totalTimeSec ? Math.floor(totalTimeSec / 3600) : 0;
  const totalMinutes = totalTimeSec ? Math.floor((totalTimeSec % 3600) / 60) : 0;

  // Calculate insights
  const avgSessionDuration = totalSessions > 0 ? Math.round(totalTimeSec / totalSessions) : 0;
  const mostPopularModule = stats?.moduleStats?.[0]?.module || 'N/A';
  const totalActiveUsers = stats?.moduleStats?.reduce((acc, stat) => {
    return acc + (stat?.uniqueUsers || 0);
  }, 0) || 0;
  const avgTimePerUser = totalActiveUsers > 0 ? Math.round(totalTimeSec / totalActiveUsers) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
                Module Usage Analytics
              </h1>
              <p className="text-gray-400">Real-time insights into student engagement</p>
            </div>
            
            <div className="flex items-center gap-3 flex-wrap">
              {/* Time Period Selector */}
              <select
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value={7}>Last 7 days</option>
                <option value={30}>Last 30 days</option>
                <option value={90}>Last 90 days</option>
                <option value={365}>Last year</option>
              </select>

              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg px-4 py-2 flex items-center gap-2 transition disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>

              {/* Detailed Stats Button */}
              <button
                onClick={() => navigate('/y8nL3kP6qW5m')}
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-lg px-4 py-2 flex items-center gap-2 transition font-semibold shadow-lg"
              >
                Detailed Stats
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <SummaryCard
            icon={<BarChart3 className="w-6 h-6" />}
            title="Active Modules"
            value={totalModules}
            subtitle="Modules tracked"
            color="from-cyan-500 to-blue-600"
          />
          <SummaryCard
            icon={<Clock className="w-6 h-6" />}
            title="Total Time"
            value={`${totalHours}h ${totalMinutes}m`}
            subtitle="Across all modules"
            color="from-green-500 to-emerald-600"
          />
          <SummaryCard
            icon={<Activity className="w-6 h-6" />}
            title="Total Sessions"
            value={totalSessions.toLocaleString()}
            subtitle="Learning sessions"
            color="from-purple-500 to-pink-600"
          />
          <SummaryCard
            icon={<Users className="w-6 h-6" />}
            title="Total Users"
            value={totalUniqueUsers.toLocaleString()}
            subtitle="Registered students"
            color="from-orange-500 to-red-600"
          />
        </div>

        {/* Insights Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border border-purple-500/30 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-purple-500/20 p-2 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="text-sm font-semibold text-purple-300">Most Popular</h3>
            </div>
            <p className="text-2xl font-bold text-white mb-1">{mostPopularModule}</p>
            <p className="text-xs text-gray-400">Top performing module</p>
          </div>

          <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-500/30 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-blue-500/20 p-2 rounded-lg">
                <Clock className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-sm font-semibold text-blue-300">Avg Session</h3>
            </div>
            <p className="text-2xl font-bold text-white mb-1">{formatDuration(avgSessionDuration)}</p>
            <p className="text-xs text-gray-400">Per learning session</p>
          </div>

          <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-500/30 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-green-500/20 p-2 rounded-lg">
                <Users className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="text-sm font-semibold text-green-300">Avg per User</h3>
            </div>
            <p className="text-2xl font-bold text-white mb-1">{formatDuration(avgTimePerUser)}</p>
            <p className="text-xs text-gray-400">Total time per student</p>
          </div>
        </div>

        {/* Error Banner - Inline */}
        {error && (
          <div className="bg-red-900/20 border border-red-500/50 rounded-xl p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="text-red-400 font-semibold">Unable to load some data</p>
                <p className="text-gray-400 text-sm">{error}</p>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition text-sm"
            >
              Retry
            </button>
          </div>
        )}

        {/* Module Statistics */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-cyan-400" />
            Module Performance
          </h2>
          
          <div className="space-y-4">
            {stats?.moduleStats?.map((stat, index) => (
              <ModuleStatCard 
                key={stat.module} 
                stat={stat} 
                index={index}
                totalUsers={totalUniqueUsers}
                color={getModuleColor(stat.module)}
                icon={getModuleIcon(stat.module)}
              />
            ))}
            
            {(!stats?.moduleStats || stats.moduleStats.length === 0) && !loading && (
              <div className="text-center py-12 text-gray-400">
                <Activity className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No usage data available for the selected period</p>
                <p className="text-sm mt-2">Students need to use the modules first to generate analytics</p>
              </div>
            )}
          </div>
        </div>

        {/* Period Info */}
        <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-4 flex items-center gap-3 text-sm text-gray-400">
          <Calendar className="w-5 h-5" />
          <span>
            Data from <strong className="text-white">{new Date(stats?.period?.startDate).toLocaleDateString()}</strong> to <strong className="text-white">{new Date(stats?.period?.endDate).toLocaleDateString()}</strong>
          </span>
        </div>
      </div>
    </div>
  );
};

// Summary Card Component
const SummaryCard = ({ icon, title, value, subtitle, color }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition">
      <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${color} mb-4`}>
        {icon}
      </div>
      <h3 className="text-gray-400 text-sm mb-1">{title}</h3>
      <p className="text-3xl font-bold mb-1">{value}</p>
      <p className="text-gray-500 text-xs">{subtitle}</p>
    </div>
  );
};

// Module Stat Card Component - with null safety
const ModuleStatCard = ({ stat, index, totalUsers, color, icon }) => {
  // Safe calculations with fallbacks
  const uniqueUsers = stat?.uniqueUsers || 0;
  const totalTime = stat?.totalTime || 0;
  const totalSessions = stat?.totalSessions || 0;
  
  const avgTimePerUserSec = uniqueUsers > 0 ? Math.round(totalTime / uniqueUsers) : 0;
  const engagementRate = totalUsers > 0 ? ((uniqueUsers / totalUsers) * 100).toFixed(1) : 0;
  
  // Calculate percentage for visual bar
  const maxTime = 100; // Assume max for scaling
  const timePercentage = Math.min((avgTimePerUserSec / 3600) * 10, 100); // Scale to 0-100%

  return (
    <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-2xl`}>
            {icon}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{stat?.module || 'Unknown Module'}</h3>
            <p className="text-gray-400 text-sm">{totalSessions.toLocaleString()} sessions</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-cyan-400">
            {Math.floor(totalTime / 3600)}h {Math.floor((totalTime % 3600) / 60)}m
          </div>
          <p className="text-xs text-gray-500">total time</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <p className="text-2xl font-bold text-white">{uniqueUsers}</p>
          <p className="text-xs text-gray-400">Active Users</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-white">{formatDuration(avgTimePerUserSec)}</p>
          <p className="text-xs text-gray-400">Avg per User</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-white">{engagementRate}%</p>
          <p className="text-xs text-gray-400">Engagement</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
        <div 
          className={`absolute top-0 left-0 h-full bg-gradient-to-r ${color} transition-all duration-500`}
          style={{ width: `${engagementRate}%` }}
        />
      </div>
      <p className="text-xs text-gray-500 mt-2">User engagement rate</p>
    </div>
  );
};

export default X9mK2pL7qR4n;

