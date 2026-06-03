// ===============================
// ENHANCED PROGRESS SERVICE FOR MULTI-SUBJECT SUPPORT
// ===============================

import { updatePlanChapters, getCurrentPlan } from './storageService';

// Update chapter status after quiz completion
export const updateChapterStatus = (chapters, chapterName, status, additionalData = {}, incrementAttempts = true) => {
  const updatedChapters = chapters.map(chapter => {
    if (chapter.chapterName === chapterName) {
      return {
        ...chapter,
        status: status, // not-started | in-progress | completed | failed
        levelsCleared: additionalData.levelsCleared !== undefined ? additionalData.levelsCleared : chapter.levelsCleared,
        questionsCorrect: additionalData.questionsCorrect !== undefined ? additionalData.questionsCorrect : chapter.questionsCorrect,
        totalAttempts: incrementAttempts ? (chapter.totalAttempts || 0) + 1 : (chapter.totalAttempts || 0),
        timeSpent: (chapter.timeSpent || 0) + (additionalData.timeSpent || 0),
        lastAttempted: new Date().toISOString()
      };
    }
    return chapter;
  });

  // Auto-save to the current plan
  const currentPlan = getCurrentPlan();
  if (currentPlan) {
    updatePlanChapters(currentPlan.examName, currentPlan.subject, updatedChapters);
  }

  return updatedChapters;
};

// Calculate completion percentage
export const getCompletionPercentage = (chapters) => {
  if (!chapters || chapters.length === 0) return 0;

  const completedChapters = chapters.filter(chapter => chapter.status === 'completed');
  return Math.round((completedChapters.length / chapters.length) * 100);
};

// Get weak areas (failed chapters)
export const getWeakAreas = (chapters) => {
  if (!chapters || chapters.length === 0) return [];

  return chapters
    .filter(chapter => chapter.status === 'failed')
    .map(chapter => ({
      chapterName: chapter.chapterName,
      subject: chapter.subject,
      levelsCleared: chapter.levelsCleared,
      totalAttempts: chapter.totalAttempts || 0
    }));
};

// Get top strengths (completed chapters)
export const getTopStrengths = (chapters) => {
  if (!chapters || chapters.length === 0) return [];

  return chapters
    .filter(chapter => chapter.status === 'completed')
    .map(chapter => ({
      chapterName: chapter.chapterName,
      subject: chapter.subject,
      levelsCleared: chapter.levelsCleared,
      questionsCorrect: chapter.questionsCorrect || 0
    }));
};

// Calculate AI confidence score (0-100)
export const calculateAIScore = (chapters) => {
  if (!chapters || chapters.length === 0) return 0;

  let totalScore = 0;
  let totalChapters = chapters.length;

  chapters.forEach(chapter => {
    let chapterScore = 0;

    // Score based on status
    switch (chapter.status) {
      case 'completed':
        chapterScore = 100;
        break;
      case 'in-progress':
        chapterScore = (chapter.levelsCleared || 0) * 20; // 20 points per level
        break;
      case 'failed':
        chapterScore = (chapter.levelsCleared || 0) * 10; // 10 points per level for failed
        break;
      default:
        chapterScore = 0;
    }

    totalScore += chapterScore;
  });

  return Math.round(totalScore / totalChapters);
};

// Calculate time tracking metrics
export const getTimeTracker = (chapters, userSetup) => {
  if (!chapters || chapters.length === 0) return { estimated: 0, actual: 0, efficiency: 0 };

  // Calculate total estimated time for all chapters (1 hour per chapter for quiz completion)
  const totalEstimatedHours = chapters.reduce((total, chapter) => {
    const hours = parseInt(chapter.estimatedHours?.split('-')[0] || '1'); // Changed from 8 to 1 hour
    return total + hours;
  }, 0);

  // Calculate total actual time spent (all chapters)
  const totalActualHours = chapters.reduce((total, chapter) => {
    return total + ((chapter.timeSpent || 0) / 60); // Convert minutes to hours
  }, 0);

  // Calculate efficiency ONLY for completed chapters
  const completedChapters = chapters.filter(chapter => chapter.status === 'completed');
  let efficiency = 0;

  if (completedChapters.length > 0) {
    // Sum estimated time for completed chapters only (1 hour each)
    const completedEstimatedHours = completedChapters.reduce((total, chapter) => {
      const hours = parseInt(chapter.estimatedHours?.split('-')[0] || '1'); // Changed from 8 to 1 hour
      return total + hours;
    }, 0);

    // Sum actual time for completed chapters only
    const completedActualHours = completedChapters.reduce((total, chapter) => {
      return total + ((chapter.timeSpent || 0) / 60);
    }, 0);

    // Calculate efficiency: if actual < estimated = good efficiency (>100%)
    if (completedActualHours > 0) {
      efficiency = Math.round((completedEstimatedHours / completedActualHours) * 100);
    }
  }

  return {
    estimated: totalEstimatedHours,
    actual: Math.round(totalActualHours * 10) / 10, // Round to 1 decimal
    efficiency: efficiency
  };
};

// Calculate complete analytics for AnalyticsPage
export const calculateAnalytics = (chapters, userSetup) => {
  if (!chapters || chapters.length === 0) {
    return {
      completionPercentage: 0,
      weakAreas: [],
      topStrengths: [],
      aiScore: 0,
      timeTracker: { estimated: 0, actual: 0, efficiency: 0 },
      totalChapters: 0,
      completedChapters: 0,
      failedChapters: 0,
      inProgressChapters: 0
    };
  }

  const completedChapters = chapters.filter(ch => ch.status === 'completed').length;
  const failedChapters = chapters.filter(ch => ch.status === 'failed').length;
  const inProgressChapters = chapters.filter(ch => ch.status === 'in-progress').length;

  return {
    completionPercentage: getCompletionPercentage(chapters),
    weakAreas: getWeakAreas(chapters),
    topStrengths: getTopStrengths(chapters),
    aiScore: calculateAIScore(chapters),
    timeTracker: getTimeTracker(chapters, userSetup),
    totalChapters: chapters.length,
    completedChapters,
    failedChapters,
    inProgressChapters,
    notStartedChapters: chapters.length - completedChapters - failedChapters - inProgressChapters
  };
};

// Update chapter when quiz is started (set to in-progress) - ONLY increments attempts if not already in progress
export const markChapterInProgress = (chapters, chapterName) => {
  const currentChapter = chapters.find(chapter => chapter.chapterName === chapterName);
  const shouldIncrementAttempts = !currentChapter || currentChapter.status !== 'in-progress';
  return updateChapterStatus(chapters, chapterName, 'in-progress', {}, shouldIncrementAttempts);
};

// Update chapter when quiz is completed successfully - DOES NOT increment attempts (already counted when started)
export const markChapterCompleted = (chapters, chapterName, quizResults) => {
  return updateChapterStatus(chapters, chapterName, 'completed', {
    levelsCleared: 5, // All levels cleared
    questionsCorrect: quizResults.correctAnswers || 0,
    timeSpent: quizResults.timeSpent || 0
  }, false);
};

// Update chapter when quiz is failed - DOES NOT increment attempts (already counted when started)
export const markChapterFailed = (chapters, chapterName, quizResults) => {
  return updateChapterStatus(chapters, chapterName, 'failed', {
    levelsCleared: quizResults.levelsCleared || 0,
    questionsCorrect: quizResults.correctAnswers || 0,
    timeSpent: quizResults.timeSpent || 0
  }, false);
};

// Get chapters by status
export const getChaptersByStatus = (chapters, status) => {
  if (!chapters || chapters.length === 0) return [];
  return chapters.filter(chapter => chapter.status === status);
};

// Get next recommended chapter (highest importance, not started)
export const getNextRecommendedChapter = (chapters) => {
  if (!chapters || chapters.length === 0) return null;

  const notStartedChapters = chapters.filter(chapter => chapter.status === 'not-started');
  if (notStartedChapters.length === 0) return null;

  // Sort by importance (High > Medium > Low) and return first
  const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };

  return notStartedChapters.sort((a, b) => {
    return (priorityOrder[b.importance] || 0) - (priorityOrder[a.importance] || 0);
  })[0];
};

// Check if user is ready for exam (completion criteria) - Subject specific
export const isExamReady = (chapters) => {
  if (!chapters || chapters.length === 0) return false;

  const completionPercentage = getCompletionPercentage(chapters);
  const aiScore = calculateAIScore(chapters);

  // Consider exam-ready if 80%+ completion and 75+ AI score
  return completionPercentage >= 80 && aiScore >= 75;
};

// Get study recommendations based on current progress - Subject specific
export const getStudyRecommendations = (chapters) => {
  if (!chapters || chapters.length === 0) return [];

  const recommendations = [];
  const analytics = calculateAnalytics(chapters);

  // Recommendation based on completion percentage
  if (analytics.completionPercentage < 30) {
    recommendations.push("Focus on completing more chapters to build foundation");
  } else if (analytics.completionPercentage < 60) {
    recommendations.push("Good progress! Continue with consistent practice");
  } else {
    recommendations.push("Excellent progress! Focus on weak areas for improvement");
  }

  // Recommendation based on weak areas
  if (analytics.weakAreas.length > 0) {
    recommendations.push(`Revisit failed chapters: ${analytics.weakAreas.map(w => w.chapterName).join(', ')}`);
  }

  // Recommendation based on AI score
  if (analytics.aiScore < 50) {
    recommendations.push("Consider more practice and revision before attempting new chapters");
  } else if (analytics.aiScore >= 75) {
    recommendations.push("Strong performance! You're on track for exam success");
  }

  return recommendations;
};

// ===============================
// NEW MULTI-SUBJECT ANALYTICS FUNCTIONS
// ===============================

// Calculate combined analytics across all subjects for an exam
export const calculateCombinedAnalytics = (examPlans) => {
  if (!examPlans || Object.keys(examPlans).length === 0) {
    return {
      totalSubjects: 0,
      subjectAnalytics: {},
      combinedStats: {
        totalChapters: 0,
        completedChapters: 0,
        failedChapters: 0,
        inProgressChapters: 0,
        overallCompletion: 0,
        averageAIScore: 0,
        totalTimeSpent: 0
      }
    };
  }

  const subjectAnalytics = {};
  let totalChapters = 0;
  let totalCompleted = 0;
  let totalFailed = 0;
  let totalInProgress = 0;
  let totalAIScore = 0;
  let totalTimeSpent = 0;
  let validSubjects = 0;

  // Calculate analytics for each subject
  Object.values(examPlans).forEach(plan => {
    if (plan.chapters && plan.chapters.length > 0) {
      const analytics = calculateAnalytics(plan.chapters, plan.userSetup);
      subjectAnalytics[plan.subject] = {
        ...analytics,
        examReady: isExamReady(plan.chapters),
        lastUpdated: plan.lastUpdated
      };

      totalChapters += analytics.totalChapters;
      totalCompleted += analytics.completedChapters;
      totalFailed += analytics.failedChapters;
      totalInProgress += analytics.inProgressChapters;
      totalAIScore += analytics.aiScore;
      totalTimeSpent += analytics.timeTracker.actual;
      validSubjects++;
    }
  });

  return {
    totalSubjects: validSubjects,
    subjectAnalytics,
    combinedStats: {
      totalChapters,
      completedChapters: totalCompleted,
      failedChapters: totalFailed,
      inProgressChapters: totalInProgress,
      overallCompletion: totalChapters > 0 ? Math.round((totalCompleted / totalChapters) * 100) : 0,
      averageAIScore: validSubjects > 0 ? Math.round(totalAIScore / validSubjects) : 0,
      totalTimeSpent: Math.round(totalTimeSpent * 10) / 10
    }
  };
};

// Get subject-wise progress comparison
export const getSubjectComparison = (examPlans) => {
  if (!examPlans || Object.keys(examPlans).length === 0) return [];

  return Object.values(examPlans)
    .filter(plan => plan.chapters && plan.chapters.length > 0)
    .map(plan => {
      const analytics = calculateAnalytics(plan.chapters, plan.userSetup);
      return {
        subject: plan.subject,
        completionPercentage: analytics.completionPercentage,
        aiScore: analytics.aiScore,
        chaptersCompleted: analytics.completedChapters,
        totalChapters: analytics.totalChapters,
        timeSpent: analytics.timeTracker.actual,
        examReady: isExamReady(plan.chapters),
        lastActivity: plan.lastUpdated
      };
    })
    .sort((a, b) => b.completionPercentage - a.completionPercentage);
};

// Get recommendations across all subjects
export const getCombinedRecommendations = (examPlans) => {
  if (!examPlans || Object.keys(examPlans).length === 0) return [];

  const recommendations = [];
  const subjectComparison = getSubjectComparison(examPlans);

  if (subjectComparison.length === 0) return recommendations;

  // Find weakest subject
  const weakestSubject = subjectComparison[subjectComparison.length - 1];
  if (weakestSubject.completionPercentage < 30) {
    recommendations.push(`Focus more on ${weakestSubject.subject} - currently at ${weakestSubject.completionPercentage}% completion`);
  }

  // Find strongest subject
  const strongestSubject = subjectComparison[0];
  if (strongestSubject.examReady) {
    recommendations.push(`${strongestSubject.subject} looks exam-ready! Consider maintaining with revision`);
  }

  // Overall balance recommendation
  const completionGap = strongestSubject.completionPercentage - weakestSubject.completionPercentage;
  if (completionGap > 40) {
    recommendations.push("Try to balance your preparation across all subjects for comprehensive coverage");
  }

  // Time distribution recommendation
  const totalTime = subjectComparison.reduce((sum, subject) => sum + subject.timeSpent, 0);
  if (totalTime > 0) {
    const timeDistribution = subjectComparison.map(s => ({
      subject: s.subject,
      timePercentage: (s.timeSpent / totalTime) * 100
    }));

    const imbalanced = timeDistribution.find(s => s.timePercentage > 60);
    if (imbalanced) {
      recommendations.push(`Consider spending more time on other subjects - ${imbalanced.subject} has ${Math.round(imbalanced.timePercentage)}% of your study time`);
    }
  }

  return recommendations;
};

// Get next best action across all subjects
export const getNextBestAction = (examPlans) => {
  if (!examPlans || Object.keys(examPlans).length === 0) return null;

  const subjectComparison = getSubjectComparison(examPlans);
  if (subjectComparison.length === 0) return null;

  // Prioritize: 1) Failed chapters, 2) Lowest completion, 3) Highest importance
  let bestAction = null;
  let highestPriority = 0;

  Object.values(examPlans).forEach(plan => {
    if (plan.chapters && plan.chapters.length > 0) {
      const analytics = calculateAnalytics(plan.chapters, plan.userSetup);

      // Check for failed chapters first (highest priority)
      const failedChapters = plan.chapters.filter(ch => ch.status === 'failed');
      if (failedChapters.length > 0 && highestPriority < 3) {
        bestAction = {
          type: 'retry_failed',
          subject: plan.subject,
          chapter: failedChapters[0],
          priority: 3,
          reason: `Retry failed ${plan.subject} chapter to improve understanding`
        };
        highestPriority = 3;
      }

      // Check for not-started high importance chapters
      const highImportanceChapters = plan.chapters.filter(ch =>
        ch.status === 'not-started' && ch.importance === 'High'
      );
      if (highImportanceChapters.length > 0 && highestPriority < 2) {
        bestAction = {
          type: 'start_high_importance',
          subject: plan.subject,
          chapter: highImportanceChapters[0],
          priority: 2,
          reason: `Start high-importance ${plan.subject} chapter for maximum impact`
        };
        highestPriority = 2;
      }

      // Check for any not-started chapters in lowest completion subject
      const notStartedChapters = plan.chapters.filter(ch => ch.status === 'not-started');
      if (notStartedChapters.length > 0 && analytics.completionPercentage < 50 && highestPriority < 1) {
        bestAction = {
          type: 'continue_weakest',
          subject: plan.subject,
          chapter: notStartedChapters[0],
          priority: 1,
          reason: `Continue with ${plan.subject} to balance your preparation`
        };
        highestPriority = 1;
      }
    }
  });

  return bestAction;
};