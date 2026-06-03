import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Import components
import GoalCard from '../components/GoalCard';

// Import services
import {
  getCurrentPlan,
  updatePlanChapters,
  setCurrentPlan,
  getExamPlans,
  clearAllData,
  hasAnyCompletedSetup
} from '../services/storageService';
import { calculateAnalytics } from '../services/progressService';
import { clearAllCache } from '../services/aiService';

const SyllabusPage = () => {
  const navigate = useNavigate();

  // State management
  const [currentPlan, setCurrentPlanState] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [switchingSubject, setSwitchingSubject] = useState(false);

  // Load data on component mount
  useEffect(() => {
    loadCurrentPlan();
  }, []);

  // Recalculate analytics when chapters change
  useEffect(() => {
    if (chapters.length > 0 && currentPlan) {
      const calculatedAnalytics = calculateAnalytics(chapters, currentPlan.userSetup);
      setAnalytics(calculatedAnalytics);
    }
  }, [chapters, currentPlan]);

  const loadCurrentPlan = () => {
    try {
      // Check if user has any completed setup
      if (!hasAnyCompletedSetup()) {
        navigate('/setup');
        return;
      }

      // Get current plan
      const plan = getCurrentPlan();
      if (!plan) {
        navigate('/setup');
        return;
      }

      setCurrentPlanState(plan);
      setChapters(plan.chapters || []);

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
      console.error('Error loading current plan:', error);
      navigate('/setup');
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

      // Reload data
      await new Promise(resolve => setTimeout(resolve, 100)); // Small delay for state update
      loadCurrentPlan();
    } catch (error) {
      console.error('Error switching subject:', error);
    } finally {
      setSwitchingSubject(false);
    }
  };

  // Handle chapter status updates
  const updateChapterStatus = (updatedChapters) => {
    setChapters(updatedChapters);
    // Update the specific plan
    if (currentPlan) {
      updatePlanChapters(currentPlan.examName, currentPlan.subject, updatedChapters);
    }
  };

  // Handle "Start Goal" button click
  const handleStartGoal = (chapterName) => {
    navigate(`/test/${encodeURIComponent(chapterName)}`);
  };

  // Handle "Revise Chapter" button click
  const handleReviseChapter = (chapterName) => {
    navigate(`/revision/${encodeURIComponent(chapterName)}`);
  };

  // Handle "View Analytics" button click
  const handleViewAnalytics = () => {
    navigate('/analytics');
  };

  // Handle "Add Subject" button click
  const handleAddSubject = () => {
    navigate('/setup');
  };

  // Handle "Change Plan" button click
  const handleResetSetup = () => {
    setShowResetConfirmation(true);
  };

  // Handle reset confirmation
  const confirmResetSetup = () => {
    // Clear all data
    clearAllData();
    clearAllCache();

    // Navigate to setup
    navigate('/setup');
  };

  // Clean loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-700 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-medium text-white mb-2">Loading your study plan</h2>
          <p className="text-gray-400">Please wait...</p>
        </div>
      </div>
    );
  }

  if (!currentPlan) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-medium text-white mb-2">No study plan found</h2>
          <p className="text-gray-400 mb-6">Create your first study plan to get started</p>
          <button
            onClick={() => navigate('/setup')}
            className="bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-100 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Create Study Plan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-20 bg-black">
      {/* Enhanced Header with Subject Switcher */}
      <div className="bg-gray-950 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6 lg:py-8">
            {/* Title and Info */}
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-4 lg:mb-6">
              <div className="mb-4 lg:mb-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                  {currentPlan.examName} Preparation
                </h1>
                <div className="flex flex-wrap items-center gap-3 sm:gap-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-300">Level {currentPlan.userSetup.prepLevel}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-300">{currentPlan.userSetup.timeAvailable}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-300">{chapters.length} chapters</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={handleAddSubject}
                  className="bg-blue-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Add Subject
                </button>
                <button
                  onClick={handleViewAnalytics}
                  className="bg-white text-black px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-gray-100 transition-all duration-200 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  View Analytics
                </button>
                <button
                  onClick={handleResetSetup}
                  className="bg-gray-700 text-gray-200 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-gray-600 transition-all duration-200 text-sm font-semibold border border-gray-600"
                >
                  Reset All
                </button>
              </div>
            </div>

            {/* Subject Switcher - NEW FEATURE */}
            {availableSubjects.length > 1 && (
              <div className="mb-4 lg:mb-6">
                <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wide">Available Subjects:</h3>
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
                        className={`relative group px-3 sm:px-6 py-3 sm:py-4 rounded-xl border transition-all duration-200 transform hover:scale-105 ${isActive
                            ? 'bg-white text-black border-white shadow-lg'
                            : 'bg-gray-900 text-gray-300 border-gray-700 hover:bg-gray-800 hover:border-gray-600'
                          } ${switchingSubject ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <div>
                            <p className={`font-semibold text-sm sm:text-base ${isActive ? 'text-black' : 'text-white'}`}>
                              {subjectData.subject}
                            </p>
                            <p className={`text-xs ${isActive ? 'text-gray-700' : 'text-gray-400'}`}>
                              {subjectData.completedChapters}/{subjectData.chaptersCount} completed ({completionPercentage}%)
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
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">

        {/* Progress Section - Subject Specific */}
        {analytics && (
          <div className="bg-gray-950 border border-gray-700 rounded-xl p-4 sm:p-6 mb-6 lg:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <h2 className="text-lg font-semibold text-white mb-2 sm:mb-0">
                {currentPlan.subject} Progress
              </h2>
              <span className="text-sm text-gray-300">
                {analytics.completedChapters} of {analytics.totalChapters} completed
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-700 rounded-full h-3 mb-3">
              <div
                className="bg-white h-3 rounded-full transition-all duration-300"
                style={{ width: `${analytics.completionPercentage}%` }}
              ></div>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between text-sm text-gray-300">
              <span>{analytics.completionPercentage}% completed</span>
              <div className="flex flex-wrap gap-4 mt-1 sm:mt-0">
                {analytics.failedChapters > 0 && (
                  <span className="text-red-400">
                    {analytics.failedChapters} failed
                  </span>
                )}
                {analytics.inProgressChapters > 0 && (
                  <span className="text-yellow-400">
                    {analytics.inProgressChapters} in progress
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards - Subject Specific */}
        {analytics && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 lg:mb-8">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-3 sm:p-4">
              <div className="flex items-center">
                <div className="w-8 sm:w-10 h-8 sm:h-10 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
                  <span className="text-green-400 font-semibold text-xs sm:text-sm">✓</span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Completed</p>
                  <p className="text-lg sm:text-xl font-semibold text-white">{analytics.completedChapters}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-3 sm:p-4">
              <div className="flex items-center">
                <div className="w-8 sm:w-10 h-8 sm:h-10 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
                  <span className="text-red-400 font-semibold text-xs sm:text-sm">✕</span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Failed</p>
                  <p className="text-lg sm:text-xl font-semibold text-white">{analytics.failedChapters}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-3 sm:p-4">
              <div className="flex items-center">
                <div className="w-8 sm:w-10 h-8 sm:h-10 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
                  <span className="text-blue-400 font-semibold text-xs">AI</span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">AI Score</p>
                  <p className="text-lg sm:text-xl font-semibold text-white">{analytics.aiScore}/100</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-3 sm:p-4">
              <div className="flex items-center">
                <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gray-500/10 border border-gray-500/20 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
                  <span className="text-gray-400 font-semibold text-xs sm:text-sm">⏱</span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Time Spent</p>
                  <p className="text-lg sm:text-xl font-semibold text-white">{analytics.timeTracker.actual}h</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Chapters Section */}
        <div className="mb-6 lg:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 lg:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-0">
              {currentPlan.subject} Chapters
            </h2>
          </div>

          {/* Enhanced Instructions Card */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 sm:p-4 mb-4 lg:mb-6 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row sm:items-center">
              <div className="w-6 sm:w-8 h-6 sm:h-8 bg-blue-500 rounded-full flex items-center justify-center mb-2 sm:mb-0 sm:mr-3 flex-shrink-0">
                <svg className="w-3 sm:w-4 h-3 sm:h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-blue-200 text-sm font-medium leading-relaxed">
                Master each {currentPlan.subject} topic: Choose <span className="bg-blue-500/20 px-2 py-1 rounded text-blue-100 font-semibold">"Start Goal"</span> for personalized testing or <span className="bg-blue-500/20 px-2 py-1 rounded text-blue-100 font-semibold">"Revise Chapter"</span> to strengthen your foundation
              </p>
            </div>
          </div>

          {chapters.length > 0 ? (
            <div className="space-y-4 lg:space-y-6">
              {chapters.map((chapter, index) => (
                <GoalCard
                  key={`${chapter.chapterName}-${index}`}
                  chapter={chapter}
                  onStartGoal={() => handleStartGoal(chapter.chapterName)}
                  onRevision={() => handleReviseChapter(chapter.chapterName)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12 bg-gray-950 border border-gray-700 rounded-xl">
              <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-5 sm:w-6 h-5 sm:h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No chapters found</h3>
              <p className="text-gray-300 mb-4 lg:mb-6 px-4">
                Your {currentPlan.subject} study plan hasn't been generated yet.
              </p>
              <button
                onClick={() => navigate('/setup')}
                className="bg-white text-black px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-gray-100 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Regenerate Plan
              </button>
            </div>
          )}
        </div>

        {/* Subject-Specific Recommendations */}
        {analytics && analytics.completionPercentage > 0 && (
          <div className="bg-gray-950 border border-gray-700 rounded-xl p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              {currentPlan.subject} Study Recommendations
            </h3>
            <div className="space-y-3">
              {analytics.completionPercentage < 30 && (
                <div className="flex items-start p-3 bg-gray-900 border border-gray-700 rounded-lg">
                  <span className="text-lg mr-3 flex-shrink-0">🎯</span>
                  <p className="text-gray-200 text-sm leading-relaxed">
                    Focus on completing more {currentPlan.subject} chapters to build a strong foundation
                  </p>
                </div>
              )}
              {analytics.failedChapters > 0 && (
                <div className="flex items-start p-3 bg-gray-900 border border-gray-700 rounded-lg">
                  <span className="text-lg mr-3 flex-shrink-0">📚</span>
                  <p className="text-gray-200 text-sm leading-relaxed">
                    Consider revising failed {currentPlan.subject} chapters before attempting new ones
                  </p>
                </div>
              )}
              {analytics.aiScore >= 75 && (
                <div className="flex items-start p-3 bg-gray-900 border border-gray-700 rounded-lg">
                  <span className="text-lg mr-3 flex-shrink-0">🏆</span>
                  <p className="text-gray-200 text-sm leading-relaxed">
                    Excellent {currentPlan.subject} progress! You're on track for exam success
                  </p>
                </div>
              )}
              {analytics.completionPercentage >= 80 && analytics.aiScore >= 75 && (
                <div className="flex items-start p-3 bg-gray-900 border border-gray-700 rounded-lg">
                  <span className="text-lg mr-3 flex-shrink-0">🎉</span>
                  <p className="text-gray-200 text-sm leading-relaxed">
                    Congratulations! You appear to be {currentPlan.subject} exam-ready!
                  </p>
                </div>
              )}
              {availableSubjects.length === 1 && (
                <div className="flex items-start p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <span className="text-lg mr-3 flex-shrink-0">➕</span>
                  <p className="text-blue-200 text-sm leading-relaxed">
                    Consider adding more subjects to your {currentPlan.examName} preparation for comprehensive coverage
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Custom Reset Confirmation Modal */}
      {showResetConfirmation && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-950 border border-gray-800 rounded-xl p-4 sm:p-6 max-w-lg w-full mx-4">
            {/* Header */}
            <div className="flex items-center mb-4 sm:mb-6">
              <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gray-900 border border-gray-700 rounded-lg flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                <svg className="w-4 sm:w-5 h-4 sm:h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.96-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-white">Reset All Study Plans</h3>
                <p className="text-sm text-gray-400">This will delete ALL your progress</p>
              </div>
            </div>

            {/* Content */}
            <div className="mb-4 sm:mb-6">
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                Resetting will permanently delete all your study plans and progress data. You'll lose:
              </p>

              <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 sm:p-4 space-y-3">
                <div className="flex items-center text-sm text-gray-300">
                  <div className="w-2 h-2 bg-red-400 rounded-full mr-3 flex-shrink-0"></div>
                  All subjects and chapter progress ({availableSubjects.length} subjects)
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <div className="w-2 h-2 bg-red-400 rounded-full mr-3 flex-shrink-0"></div>
                  Quiz scores and attempt history for all subjects
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <div className="w-2 h-2 bg-red-400 rounded-full mr-3 flex-shrink-0"></div>
                  Time tracking and analytics data for all subjects
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <div className="w-2 h-2 bg-red-400 rounded-full mr-3 flex-shrink-0"></div>
                  Personalized AI content and recommendations
                </div>
              </div>

              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mt-4">
                <p className="text-red-300 text-sm font-medium text-center">
                  This action cannot be undone
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowResetConfirmation(false)}
                className="flex-1 bg-gray-700 text-gray-200 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-gray-600 transition-all duration-200 text-sm font-semibold border border-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={confirmResetSetup}
                className="flex-1 bg-red-500 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-red-600 transition-all duration-200 text-sm font-semibold"
              >
                Reset Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SyllabusPage;