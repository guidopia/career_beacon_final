import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAdvancedStats } from '../services/analyticsService';
import { 
  TrendingUp,
  TrendingDown, 
  Users, 
  Clock, 
  Activity,
  ArrowLeft,
  AlertCircle,
  RefreshCw,
  CheckCircle,
  XCircle,
  Minus
} from 'lucide-react';

/**
 * Detailed Analytics Dashboard
 * Advanced metrics for CEO/management
 */
const Y8nL3kP6qW5m = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAdvancedStats(30);
      
      if (data && !data.error) {
        setStats(data);
      } else {
        setStats(data);
        if (data.error) {
          setError(data.error);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to load analytics data');
      setStats({
        weekOverWeekGrowth: { percentage: 0, lastWeek: 0, previousWeek: 0, trend: 'neutral' },
        dailyActiveUsers: { average: 0, daily: [] },
        peakUsageHours: [],
        inactiveUsers: { count: 0, percentage: 0 },
        healthScore: { score: 0, rating: 'Unknown', metrics: {} }
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadStats();
  };

  if (loading && !refreshing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg">Loading detailed analytics...</p>
        </div>
      </div>
    );
  }

  const healthScore = stats?.healthScore?.score || 0;
  const healthRating = stats?.healthScore?.rating || 'Unknown';
  const growthPercentage = stats?.weekOverWeekGrowth?.percentage || 0;
  const growthTrend = stats?.weekOverWeekGrowth?.trend || 'neutral';
  const avgDAU = stats?.dailyActiveUsers?.average || 0;
  const inactiveCount = stats?.inactiveUsers?.count || 0;
  const inactivePercentage = stats?.inactiveUsers?.percentage || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/x9mk2pl7qr4n')}
                className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg p-2 transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
                  Detailed Analytics
                </h1>
                <p className="text-gray-400">Advanced insights and performance metrics</p>
              </div>
            </div>
            
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg px-4 py-2 flex items-center gap-2 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-900/20 border border-red-500/50 rounded-xl p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-400" />
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

        {/* Overall Health Score - Hero Card */}
        <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border-2 border-purple-500/50 rounded-2xl p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Activity className="w-7 h-7 text-purple-400" />
              Platform Health Score
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center md:text-left">
                <div className="text-7xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                  {healthScore}
                </div>
                <div className="text-2xl font-semibold text-purple-300 mb-2">{healthRating}</div>
                <p className="text-gray-400 text-sm">Out of 100</p>
              </div>
              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-black/30 rounded-lg p-4">
                  <p className="text-gray-400 text-xs mb-1">Engagement</p>
                  <p className="text-2xl font-bold text-white">{stats?.healthScore?.metrics?.engagement || 0}%</p>
                </div>
                <div className="bg-black/30 rounded-lg p-4">
                  <p className="text-gray-400 text-xs mb-1">Growth</p>
                  <p className="text-2xl font-bold text-white">{stats?.healthScore?.metrics?.growth || 0}%</p>
                </div>
                <div className="bg-black/30 rounded-lg p-4">
                  <p className="text-gray-400 text-xs mb-1">Activity</p>
                  <p className="text-2xl font-bold text-white">{stats?.healthScore?.metrics?.activity || 0}/day</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Week-over-Week Growth */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                {growthTrend === 'up' ? (
                  <TrendingUp className="w-5 h-5 text-green-400" />
                ) : growthTrend === 'down' ? (
                  <TrendingDown className="w-5 h-5 text-red-400" />
                ) : (
                  <Minus className="w-5 h-5 text-gray-400" />
                )}
                Week-over-Week Growth
              </h3>
              <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                growthTrend === 'up' ? 'bg-green-500/20 text-green-400' :
                growthTrend === 'down' ? 'bg-red-500/20 text-red-400' :
                'bg-gray-500/20 text-gray-400'
              }`}>
                {growthPercentage > 0 ? '+' : ''}{growthPercentage}%
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm mb-1">Last Week</p>
                <p className="text-3xl font-bold text-white">{stats?.weekOverWeekGrowth?.lastWeek || 0}</p>
                <p className="text-xs text-gray-500">sessions</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Previous Week</p>
                <p className="text-3xl font-bold text-white">{stats?.weekOverWeekGrowth?.previousWeek || 0}</p>
                <p className="text-xs text-gray-500">sessions</p>
              </div>
            </div>
          </div>

          {/* Daily Active Users */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-blue-400" />
              Daily Active Users
            </h3>
            <div className="text-center mb-4">
              <div className="text-5xl font-bold text-blue-400 mb-2">{avgDAU}</div>
              <p className="text-gray-400 text-sm">Average per day (last 7 days)</p>
            </div>
            {stats?.dailyActiveUsers?.daily && stats.dailyActiveUsers.daily.length > 0 && (
              <div className="flex items-end justify-between gap-1 h-20">
                {stats.dailyActiveUsers.daily.map((day, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t transition-all hover:opacity-80"
                      style={{ 
                        height: `${(day.count / Math.max(...stats.dailyActiveUsers.daily.map(d => d.count))) * 100}%`,
                        minHeight: '10%'
                      }}
                    ></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Peak Usage Hours & Inactive Users */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Peak Usage Hours */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-6">
              <Clock className="w-5 h-5 text-yellow-400" />
              Peak Usage Hours
            </h3>
            <div className="space-y-4">
              {stats?.peakUsageHours && stats.peakUsageHours.length > 0 ? (
                stats.peakUsageHours.map((peak, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
                    <div>
                      <p className="text-lg font-semibold text-white">{peak.timeRange}</p>
                      <p className="text-xs text-gray-400">Peak #{idx + 1}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-yellow-400">{peak.sessions}</p>
                      <p className="text-xs text-gray-500">sessions</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-8">No peak hour data available</p>
              )}
            </div>
          </div>

          {/* Inactive Users Alert */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-6">
              <AlertCircle className="w-5 h-5 text-orange-400" />
              Inactive Users Alert
            </h3>
            <div className="text-center mb-6">
              <div className="text-6xl font-bold text-orange-400 mb-2">{inactiveCount}</div>
              <p className="text-gray-400">Users inactive for 7+ days</p>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400 text-sm">Inactive Rate</span>
                <span className="text-lg font-bold text-orange-400">{inactivePercentage}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-orange-600 to-red-600 transition-all"
                  style={{ width: `${Math.min(inactivePercentage, 100)}%` }}
                ></div>
              </div>
            </div>
            {inactiveCount > 0 && (
              <div className="mt-4 p-3 bg-orange-900/20 border border-orange-500/30 rounded-lg">
                <p className="text-xs text-orange-300">
                  💡 Consider running a re-engagement campaign for inactive users
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center">
          <button
            onClick={() => navigate('/x9mk2pl7qr4n')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Overview
          </button>
        </div>
      </div>
    </div>
  );
};

export default Y8nL3kP6qW5m;

