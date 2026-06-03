import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getCurrentPlan, 
  getExamPlans,
  setCurrentPlan
} from '../services/storageService';
import { 
  calculateAnalytics, 
  getStudyRecommendations, 
  isExamReady,
  getNextRecommendedChapter 
} from '../services/progressService';
import { formatTimeDuration, getStatusConfig } from '../utils/helpers';

const AnalyticsPage = () => {
  const navigate = useNavigate();
  const [currentPlan, setCurrentPlanState] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('overall');
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [switchingSubject, setSwitchingSubject] = useState(false);

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    try {
      const plan = getCurrentPlan();
      
      if (!plan) {
        navigate('/setup');
        return;
      }

      setCurrentPlanState(plan);
      setChapters(plan.chapters || []);
      
      // Calculate comprehensive analytics for current subject only
      const analyticsData = calculateAnalytics(plan.chapters || [], plan.userSetup);
      setAnalytics(analyticsData);

      // Load available subjects for the same exam
      const examPlans = getExamPlans(plan.examName);
      const subjects = Object.values(examPlans).map(p => ({
        subject: p.subject,
        planKey: p.planKey,
        chaptersCount: p.chapters?.length || 0,
        completedChapters: p.chapters?.filter(ch => ch.status === 'completed').length || 0
      }));
      setAvailableSubjects(subjects);
      
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Switch to different subject
  const handleSubjectSwitch = async (planKey) => {
    setSwitchingSubject(true);
    try {
      // Set new current plan
      setCurrentPlan(planKey);
      
      // Reload analytics data
      await new Promise(resolve => setTimeout(resolve, 100)); // Small delay for state update
      loadAnalyticsData();
    } catch (error) {
      console.error('Error switching subject:', error);
    } finally {
      setSwitchingSubject(false);
    }
  };

  const handleBack = () => {
    navigate('/syllabus');
  };

  const handleChapterClick = (chapterName) => {
    navigate(`/revision/${encodeURIComponent(chapterName)}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-700 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-medium text-white mb-2">Loading Analytics</h2>
          <p className="text-gray-400">Analyzing your performance...</p>
        </div>
      </div>
    );
  }

  if (!analytics || !currentPlan) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-medium text-white mb-2">No Data Available</h2>
          <p className="text-gray-400 mb-6">Start studying to see your analytics</p>
          <button
            onClick={() => navigate('/syllabus')}
            className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Go to Syllabus
          </button>
        </div>
      </div>
    );
  }

  const examReady = isExamReady(chapters);
  const recommendations = getStudyRecommendations(chapters);
  const nextChapter = getNextRecommendedChapter(chapters);

  return (
    <div className="min-h-screen mt-20 bg-black">
      {/* Enhanced Header with Subject Switcher */}
      <div className="border-b border-gray-700 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
            <div className="flex items-center space-x-3 mb-4 sm:mb-0">
              <button
                onClick={handleBack}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  {currentPlan.subject} Analytics
                </h1>
                <p className="text-sm text-gray-300">{currentPlan.examName} • Detailed Insights</p>
              </div>
            </div>
            
            {/* Premium Time Range Selector - Right Side */}
            <div className="bg-gray-900 p-1 rounded-lg inline-flex border border-gray-700 w-full sm:w-auto">
              {[
                { value: 'overall', label: 'Overall' },
                { value: 'week', label: 'Last Week' },
                { value: 'month', label: 'Last Month' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedTimeRange(option.value)}
                  className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 ${
                    selectedTimeRange === option.value
                      ? 'bg-white text-black shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Subject Switcher for Analytics */}
          {availableSubjects.length > 1 && (
            <div>
              <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wide">View Analytics For:</h3>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {availableSubjects.map((subjectData) => {
                  const isActive = subjectData.planKey === currentPlan.planKey;
                  const completionPercentage = subjectData.chaptersCount > 0 
                    ? Math.round((subjectData.completedChapters / subjectData.chaptersCount) * 100)
                    : 0;
                  
                  return (
                    <button
                      key={subjectData.planKey}
                      onClick={() => !isActive && handleSubjectSwitch(subjectData.planKey)}
                      disabled={switchingSubject || isActive}
                      className={`relative group px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border transition-all duration-200 transform hover:scale-105 ${
                        isActive
                          ? 'bg-white text-black border-white shadow-lg'
                          : 'bg-gray-900 text-gray-300 border-gray-700 hover:bg-gray-800 hover:border-gray-600'
                      } ${switchingSubject ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <div className="flex items-center space-x-2">
                        <div>
                          <p className={`font-medium text-sm ${isActive ? 'text-black' : 'text-white'}`}>
                            {subjectData.subject}
                          </p>
                          <p className={`text-xs ${isActive ? 'text-gray-700' : 'text-gray-400'}`}>
                            {completionPercentage}% completed
                          </p>
                        </div>
                        {isActive && (
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 lg:py-8 space-y-6 lg:space-y-8">
        {/* Overall Performance Cards - Subject Specific */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {/* Completion Rate */}
          <div className="bg-gray-950 rounded-xl p-4 sm:p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">{currentPlan.subject} Completion</h3>
              <div className="w-8 sm:w-10 h-8 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 sm:w-5 h-4 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-white mb-2">{analytics.completionPercentage}%</div>
            <div className="text-sm text-gray-300 mb-3">{analytics.completedChapters} of {analytics.totalChapters} chapters</div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${analytics.completionPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* AI Confidence Score */}
          <div className="bg-gray-950 rounded-xl p-4 sm:p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">{currentPlan.subject} AI Score</h3>
              <div className="w-8 sm:w-10 h-8 sm:h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 sm:w-5 h-4 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364-.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-white mb-2">{analytics.aiScore}/100</div>
            <div className={`text-sm mb-3 font-medium ${analytics.aiScore >= 75 ? 'text-green-400' : analytics.aiScore >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
              {analytics.aiScore >= 75 ? 'Excellent' : analytics.aiScore >= 50 ? 'Good' : 'Needs Improvement'}
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  analytics.aiScore >= 75 ? 'bg-green-500' : 
                  analytics.aiScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${analytics.aiScore}%` }}
              ></div>
            </div>
          </div>

          {/* Time Efficiency */}
          <div className="bg-gray-950 rounded-xl p-4 sm:p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Time Efficiency</h3>
              <div className="w-8 sm:w-10 h-8 sm:h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 sm:w-5 h-4 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-white mb-2">{analytics.timeTracker.efficiency}%</div>
            <div className="text-sm text-gray-300 mb-3">
              {analytics.timeTracker.actual}h / {analytics.timeTracker.estimated}h estimated
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(analytics.timeTracker.efficiency, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Subject Readiness */}
          <div className="bg-gray-950 rounded-xl p-4 sm:p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">{currentPlan.subject} Readiness</h3>
              <div className={`w-8 sm:w-10 h-8 sm:h-10 rounded-lg flex items-center justify-center ${
                examReady ? 'bg-green-600' : 'bg-orange-600'
              }`}>
                <svg className="w-4 sm:w-5 h-4 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className={`text-2xl sm:text-3xl font-bold mb-2 ${examReady ? 'text-green-400' : 'text-orange-400'}`}>
              {examReady ? 'Ready' : 'Preparing'}
            </div>
            <div className="text-sm text-gray-300">
              {examReady ? `${currentPlan.subject} ready!` : `Keep studying ${currentPlan.subject}`}
            </div>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Chapter Status Breakdown */}
          <div className="bg-gray-950 rounded-xl p-4 sm:p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4 lg:mb-6">{currentPlan.subject} Chapter Status</h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-900 rounded-lg border border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-white font-medium text-sm sm:text-base">Completed</span>
                </div>
                <div className="text-right">
                  <div className="text-white font-semibold text-sm sm:text-base">{analytics.completedChapters}</div>
                  <div className="text-xs sm:text-sm text-gray-400">
                    {Math.round((analytics.completedChapters / analytics.totalChapters) * 100)}%
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-900 rounded-lg border border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-white font-medium text-sm sm:text-base">In Progress</span>
                </div>
                <div className="text-right">
                  <div className="text-white font-semibold text-sm sm:text-base">{analytics.inProgressChapters}</div>
                  <div className="text-xs sm:text-sm text-gray-400">
                    {Math.round((analytics.inProgressChapters / analytics.totalChapters) * 100)}%
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-900 rounded-lg border border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-white font-medium text-sm sm:text-base">Failed</span>
                </div>
                <div className="text-right">
                  <div className="text-white font-semibold text-sm sm:text-base">{analytics.failedChapters}</div>
                  <div className="text-xs sm:text-sm text-gray-400">
                    {Math.round((analytics.failedChapters / analytics.totalChapters) * 100)}%
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-900 rounded-lg border border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  <span className="text-white font-medium text-sm sm:text-base">Not Started</span>
                </div>
                <div className="text-right">
                  <div className="text-white font-semibold text-sm sm:text-base">{analytics.notStartedChapters}</div>
                  <div className="text-xs sm:text-sm text-gray-400">
                    {Math.round((analytics.notStartedChapters / analytics.totalChapters) * 100)}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Study Recommendations */}
          <div className="bg-gray-950 rounded-xl p-4 sm:p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4 lg:mb-6">{currentPlan.subject} Recommendations</h3>
            <div className="space-y-3 sm:space-y-4">
              {recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 sm:p-4 bg-gray-900 rounded-lg border border-gray-700">
                  <div className="bg-blue-600 w-5 sm:w-6 h-5 sm:h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">{index + 1}</span>
                  </div>
                  <p className="text-gray-200 leading-relaxed text-sm sm:text-base">{recommendation}</p>
                </div>
              ))}
              
              {nextChapter && (
                <div className="p-3 sm:p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <h4 className="text-blue-400 font-semibold mb-2 text-sm sm:text-base">Next Recommended Chapter</h4>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <p className="text-white font-medium text-sm sm:text-base">{nextChapter.chapterName}</p>
                      <p className="text-blue-300 text-xs sm:text-sm">{nextChapter.subject} • {nextChapter.importance} Priority</p>
                    </div>
                    <button
                      onClick={() => handleChapterClick(nextChapter.chapterName)}
                      className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold hover:bg-blue-700 transition-colors w-full sm:w-auto"
                    >
                      Start
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Weak Areas & Strengths */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Weak Areas */}
          <div className="bg-gray-950 rounded-xl p-4 sm:p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4 lg:mb-6 flex items-center">
              <svg className="w-4 sm:w-5 h-4 sm:h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.96-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              {currentPlan.subject} Areas Needing Attention
            </h3>
            {analytics.weakAreas.length > 0 ? (
              <div className="space-y-3">
                {analytics.weakAreas.slice(0, 5).map((area, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-3 sm:p-4 bg-red-500/10 border border-red-500/30 rounded-lg cursor-pointer hover:bg-red-500/20 transition-colors"
                    onClick={() => handleChapterClick(area.chapterName)}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm sm:text-base truncate">{area.chapterName}</p>
                      <p className="text-red-300 text-xs sm:text-sm">{area.subject} • {area.levelsCleared}/5 levels</p>
                    </div>
                    <div className="text-red-400 text-xs sm:text-sm font-medium ml-3 flex-shrink-0">
                      {area.totalAttempts} attempts
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 sm:py-8">
                <div className="text-gray-500 mb-2">
                  <svg className="w-10 sm:w-12 h-10 sm:h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-400 text-sm sm:text-base">No weak areas in {currentPlan.subject}</p>
                <p className="text-gray-500 text-xs sm:text-sm">Great job! Keep up the good work</p>
              </div>
            )}
          </div>

          {/* Top Strengths */}
          <div className="bg-gray-950 rounded-xl p-4 sm:p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4 lg:mb-6 flex items-center">
              <svg className="w-4 sm:w-5 h-4 sm:h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Your {currentPlan.subject} Strengths
            </h3>
            {analytics.topStrengths.length > 0 ? (
              <div className="space-y-3">
                {analytics.topStrengths.slice(0, 5).map((strength, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-3 sm:p-4 bg-green-500/10 border border-green-500/30 rounded-lg cursor-pointer hover:bg-green-500/20 transition-colors"
                    onClick={() => handleChapterClick(strength.chapterName)}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm sm:text-base truncate">{strength.chapterName}</p>
                      <p className="text-green-300 text-xs sm:text-sm">{strength.subject} • Completed</p>
                    </div>
                    <div className="text-green-400 text-xs sm:text-sm font-medium ml-3 flex-shrink-0">
                      {strength.questionsCorrect} correct
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 sm:py-8">
                <div className="text-gray-500 mb-2">
                  <svg className="w-10 sm:w-12 h-10 sm:h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <p className="text-gray-400 text-sm sm:text-base">No completed {currentPlan.subject} chapters yet</p>
                <p className="text-gray-500 text-xs sm:text-sm">Start studying to build your strengths</p>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Motivation Section */}
        <div className="bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-xl p-6 sm:p-8 text-center border border-gray-700 relative overflow-hidden">
          {/* Background accent */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>
          
          <div className="relative z-10">
            <div className="w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <svg className="w-6 sm:w-8 h-6 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
              {examReady ? `${currentPlan.subject} Mastery Achieved! 🚀` : `${currentPlan.subject} Progress Looking Great! 💪`}
            </h3>
            
            <p className="text-base sm:text-lg text-gray-300 mb-2 leading-relaxed">
              {examReady 
                ? `Your ${currentPlan.subject} preparation is excellent! You've built a strong foundation and you're ready to excel.`
                : `Every ${currentPlan.subject} chapter you complete brings you closer to mastery. Consistency is the key to success.`
              }
            </p>
            
            <p className="text-gray-400 mb-6 sm:mb-8 text-sm sm:text-base leading-relaxed">
              {examReady
                ? `Continue practicing ${currentPlan.subject} to maintain your momentum and stay sharp for exam day.`
                : `Remember: Champions are made through daily practice and persistence. You've got this ${currentPlan.subject} preparation!`
              }
            </p>
            
            <button
              onClick={() => navigate('/syllabus')}
              className="bg-white text-black px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
            >
              Continue {currentPlan.subject} Study
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;