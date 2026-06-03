import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Import services
import { generateSyllabusChapters } from '../services/aiService';
import {
  hasAnyCompletedSetup,
  getAllSyllabusPlans,
  getExamPlans,
  planExists,
  migrateOldData,
  setCurrentPlan,
  generatePlanKey,
} from '../services/storageService';

// Import constants
import { EXAM_OPTIONS, PREP_LEVELS, TIME_OPTIONS } from '../utils/constants';
import { SITE_BRAND_NAME } from '../constants/branding';
import { getExamSubjects } from '../utils/helpers';

const SetupPage = () => {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    examName: '',
    prepLevel: 3,
    timeAvailable: '',
    subjectFocus: []
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [existingPlans, setExistingPlans] = useState({});
  const [isAddingToExisting, setIsAddingToExisting] = useState(false);

  // Check for existing data on component mount
  useEffect(() => {
    // Migrate old data if exists
    migrateOldData();

    // Check if user has existing plans
    if (hasAnyCompletedSetup()) {
      const allPlans = getAllSyllabusPlans();
      setExistingPlans(allPlans);

      // If user has plans but navigated to setup, show them existing plans
      if (Object.keys(allPlans).length > 0) {
        // Don't auto-redirect, let them choose to add new subject or go to existing
      }
    }
  }, []);

  // Update available subjects when exam changes
  useEffect(() => {
    if (formData.examName) {
      const subjects = getExamSubjects(formData.examName);
      setAvailableSubjects(subjects);

      // Check existing plans for this exam
      const examPlans = getExamPlans(formData.examName);

      // Clear subject focus when exam changes
      setFormData(prev => ({ ...prev, subjectFocus: [] }));

      // Set flag if adding to existing exam
      setIsAddingToExisting(Object.keys(examPlans).length > 0);
    }
  }, [formData.examName]);

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  // Handle subject selection (single select only)
  const handleSubjectSelect = (subject) => {
    setFormData(prev => ({
      ...prev,
      subjectFocus: [subject]
    }));
  };

  // Open an existing study plan on the syllabus route.
  // Always derive the storage key from exam + subject so clicks work even if plan.planKey was missing or stale.
  const goToExistingPlan = (plan) => {
    if (!plan?.examName || !plan?.subject) return;
    const canonicalKey = generatePlanKey(plan.examName, plan.subject);
    const ok = setCurrentPlan(canonicalKey);
    if (!ok) {
      setError('Could not open this study plan (browser storage may be full).');
      return;
    }
    navigate('/syllabus');
  };

  // Validate form
  const validateForm = () => {
    if (!formData.examName) {
      setError('Please select an exam');
      return false;
    }
    if (!formData.prepLevel || formData.prepLevel < 1 || formData.prepLevel > 5) {
      setError('Please select a valid preparation level');
      return false;
    }
    if (!formData.timeAvailable) {
      setError('Please select time available for preparation');
      return false;
    }
    if (!formData.subjectFocus || formData.subjectFocus.length === 0) {
      setError('Please select a subject to focus on');
      return false;
    }

    // Check if plan already exists
    const subject = formData.subjectFocus[0];
    if (planExists(formData.examName, subject)) {
      setError(`You already have a study plan for ${formData.examName} - ${subject}. Use the syllabus page to access it.`);
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      // Generate syllabus chapters using AI (this will auto-save as new plan)
      const chapters = await generateSyllabusChapters(formData);

      if (!chapters || chapters.length === 0) {
        throw new Error('Failed to generate syllabus. Please try again.');
      }

      // Success - redirect to syllabus page
      navigate('/syllabus');

    } catch (err) {
      console.error('Setup error:', err);
      setError(err.message || 'Failed to generate syllabus. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get existing plans for current exam
  const getCurrentExamPlans = () => {
    if (!formData.examName) return [];
    return Object.values(getExamPlans(formData.examName));
  };

  // Get subjects already covered for current exam
  const getCoveredSubjects = () => {
    return getCurrentExamPlans().map(plan => plan.subject);
  };

  return (
    <div className="min-h-screen mt-10 bg-black flex flex-col lg:flex-row">
      {/* Left Side - Enhanced Hero (50% on desktop, full width on mobile) */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 lg:py-12 relative min-h-screen lg:min-h-auto">
        {/* Subtle background elements with enhanced effects */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-16 sm:w-24 lg:w-32 h-16 sm:h-24 lg:h-32 bg-white rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-12 sm:w-18 lg:w-24 h-12 sm:h-18 lg:h-24 bg-white rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-8 sm:w-12 lg:w-16 h-8 sm:h-12 lg:h-16 bg-white rounded-full blur-lg animate-pulse delay-2000"></div>
        </div>

        <div className="relative z-10 max-w-lg w-full text-center lg:text-left">
          {/* Enhanced Logo with subtle glow */}
          <div className="flex items-center justify-center lg:justify-start mb-6 lg:mb-8 group">
            <div className="relative">
              <div className="absolute -inset-1 bg-gray-600 rounded-3xl blur opacity-15 group-hover:opacity-25 transition duration-500"></div>
              <div className="relative w-12 sm:w-14 lg:w-16 h-12 sm:h-14 lg:h-16 bg-white rounded-2xl flex items-center justify-center mr-3 lg:mr-4 shadow-2xl border-2 border-gray-800 hover:border-gray-600 transition-all duration-300 cursor-pointer">
                <svg className="w-6 sm:w-7 lg:w-8 h-6 sm:h-7 lg:h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364-.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
            </div>
            <h1 className="text-sm sm:text-xl md:text-2xl lg:text-4xl font-bold text-white drop-shadow-lg leading-snug text-center sm:text-left">{SITE_BRAND_NAME}</h1>
          </div>

          {/* Main Headlines */}
          <h2 className="text-2xl sm:text-3xl lg:text-3xl font-bold text-white mb-4 lg:mb-6 leading-tight drop-shadow-md">
            {isAddingToExisting ? 'Add New Subject' : 'AI-Powered Exam Preparation Platform'}
          </h2>

          <p className="text-base sm:text-lg text-gray-300 mb-6 lg:mb-8 leading-relaxed px-4 lg:px-0">
            {isAddingToExisting
              ? `Expand your ${formData.examName} preparation by adding another subject. Your existing progress will be preserved.`
              : 'Experience intelligent adaptive testing that adjusts to your knowledge level. Get personalized study plans and detailed analytics to maximize your exam success.'
            }
          </p>

          {/* Study Plans Section */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gray-600 rounded-xl blur opacity-5 group-hover:opacity-15 transition duration-500"></div>
            <div className="relative bg-gray-950 rounded-xl shadow-2xl p-6 border border-gray-700 hover:border-gray-500 transition-all duration-300">
              <h4 className="text-xl font-semibold text-white mb-4">Your Study Plans:</h4>

              {Object.keys(existingPlans).length > 0 ? (
                <div className="space-y-3">
                  {Object.values(existingPlans).map((plan) => {
                    const rowKey =
                      plan.planKey ||
                      (plan.examName && plan.subject
                        ? generatePlanKey(plan.examName, plan.subject)
                        : `${plan.examName}-${plan.subject}-${plan.timestamp || ''}`);
                    const chapterCount = Array.isArray(plan.chapters) ? plan.chapters.length : 0;
                    return (
                    <div
                      key={rowKey}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          goToExistingPlan(plan);
                        }
                      }}
                      className="flex items-center justify-between p-3 bg-gray-900 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer"
                      onClick={() => goToExistingPlan(plan)}
                    >
                      <div>
                        <p className="text-white font-medium">{plan.examName} - {plan.subject}</p>
                        <p className="text-gray-400 text-sm">
                          {chapterCount} chapters • Level {plan.userSetup?.prepLevel ?? '—'}
                        </p>
                      </div>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  );
                  })}
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h5 className="text-white font-medium mb-2">No study plans yet</h5>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Create your first personalized study plan to get started with AI-powered exam preparation.
                    You can add multiple subjects for the same exam later.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form (50% on desktop, full width on mobile) */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-6 min-h-screen lg:min-h-auto">
        <div className="w-full max-w-md">
          {/* Enhanced Form Container */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gray-600 rounded-xl blur opacity-5 group-hover:opacity-15 transition duration-500"></div>
            <div className="relative bg-gray-950 rounded-xl shadow-2xl p-4 sm:p-6 border border-gray-700 hover:border-gray-500 transition-all duration-300">
              <div className="text-center mb-4 sm:mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  {isAddingToExisting ? 'Add New Subject' : 'Get Started'}
                </h3>
                <p className="text-sm sm:text-base text-gray-400">
                  {isAddingToExisting
                    ? 'Create another study plan for the same exam'
                    : 'Create your personalized study plan'
                  }
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-4">
                {/* Exam Selection */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Select Your Exam *
                  </label>
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gray-600 rounded-lg blur opacity-0 group-hover:opacity-15 transition duration-300"></div>
                    <div className="relative">
                      <select
                        value={formData.examName}
                        onChange={(e) => handleInputChange('examName', e.target.value)}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent appearance-none pr-10 hover:border-gray-500 transition-all duration-300 cursor-pointer text-sm sm:text-base"
                        required
                      >
                        <option value="">Choose your exam</option>
                        {EXAM_OPTIONS.map(exam => (
                          <option key={exam.value} value={exam.value}>
                            {exam.label}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Show existing subjects for selected exam */}
                {isAddingToExisting && getCurrentExamPlans().length > 0 && (
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 sm:p-4">
                    <h5 className="text-blue-400 font-medium mb-2 text-sm sm:text-base">Existing subjects for {formData.examName}:</h5>
                    <div className="flex flex-wrap gap-2">
                      {getCoveredSubjects().map(subject => (
                        <span key={subject} className="bg-blue-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs">
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Preparation Level */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Preparation Level *
                  </label>
                  <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                    {PREP_LEVELS.map(level => (
                      <div key={level.value} className="relative group">
                        <div className={`absolute -inset-0.5 rounded-lg blur transition duration-300 ${formData.prepLevel === level.value
                            ? 'bg-gray-400 opacity-25'
                            : 'bg-gray-600 opacity-0 group-hover:opacity-15'
                          }`}></div>
                        <button
                          type="button"
                          onClick={() => handleInputChange('prepLevel', level.value)}
                          className={`relative w-full px-2 sm:px-3 py-2 sm:py-3 text-sm font-semibold rounded-lg border transition-all duration-300 transform hover:scale-105 cursor-pointer ${formData.prepLevel === level.value
                              ? 'bg-white text-black border-white shadow-lg'
                              : 'bg-gray-900 text-gray-300 border-gray-700 hover:bg-gray-800 hover:border-gray-600'
                            }`}
                        >
                          {level.value}
                        </button>
                      </div>
                    ))}
                  </div>
                  {formData.prepLevel && (
                    <p className="text-xs text-gray-400 mt-2 animate-fade-in">
                      {PREP_LEVELS.find(l => l.value === formData.prepLevel)?.description}
                    </p>
                  )}
                </div>

                {/* Time Available */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Time Available *
                  </label>
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gray-600 rounded-lg blur opacity-0 group-hover:opacity-15 transition duration-300"></div>
                    <div className="relative">
                      <select
                        value={formData.timeAvailable}
                        onChange={(e) => handleInputChange('timeAvailable', e.target.value)}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent appearance-none pr-10 hover:border-gray-500 transition-all duration-300 cursor-pointer text-sm sm:text-base"
                        required
                      >
                        <option value="">Select time available</option>
                        {TIME_OPTIONS.map(time => (
                          <option key={time.value} value={time.value}>
                            {time.label}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subject Focus */}
                {availableSubjects.length > 0 && (
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Choose Your Subject Focus *
                    </label>
                    <p className="text-xs text-gray-400 mb-3">
                      {isAddingToExisting
                        ? 'Select a new subject to add to your study plan'
                        : 'Select one subject to master deeply. You can create plans for other subjects later.'
                      }
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                      {availableSubjects.map(subject => {
                        const isAlreadyCovered = getCoveredSubjects().includes(subject);
                        return (
                          <div key={subject} className="relative group">
                            <div className={`absolute -inset-0.5 rounded-lg blur transition duration-300 ${formData.subjectFocus.includes(subject)
                                ? 'bg-gray-400 opacity-25'
                                : isAlreadyCovered
                                  ? 'bg-green-400 opacity-15'
                                  : 'bg-gray-600 opacity-0 group-hover:opacity-15'
                              }`}></div>
                            <button
                              type="button"
                              onClick={() => !isAlreadyCovered && handleSubjectSelect(subject)}
                              disabled={isAlreadyCovered}
                              className={`relative w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-medium rounded-lg border transition-all duration-300 transform hover:scale-105 cursor-pointer text-left ${formData.subjectFocus.includes(subject)
                                  ? 'bg-white text-black border-white shadow-lg'
                                  : isAlreadyCovered
                                    ? 'bg-green-500/10 text-green-400 border-green-500/30 cursor-not-allowed'
                                    : 'bg-gray-900 text-gray-300 border-gray-700 hover:bg-gray-800 hover:border-gray-600'
                                }`}
                            >
                              <div className="flex items-center justify-between">
                                <span>{subject}</span>
                                {formData.subjectFocus.includes(subject) && (
                                  <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                                {isAlreadyCovered && (
                                  <span className="text-xs bg-green-500/20 px-2 py-1 rounded">
                                    Already added
                                  </span>
                                )}
                              </div>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="relative animate-shake">
                    <div className="absolute -inset-0.5 bg-red-500 rounded-lg blur opacity-20"></div>
                    <div className="relative bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                      <p className="text-sm text-red-400">{error}</p>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="relative group">
                  <div className={`absolute -inset-1 rounded-lg blur transition duration-300 ${loading
                      ? 'bg-gray-600 opacity-10'
                      : 'bg-gray-400 opacity-15 group-hover:opacity-30'
                    }`}></div>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`relative w-full py-2.5 sm:py-3 px-4 rounded-lg font-semibold transition-all duration-300 transform text-sm sm:text-base ${loading
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-black hover:bg-gray-100 shadow-lg hover:shadow-xl hover:scale-105 cursor-pointer'
                      }`}
                  >
                    {loading ? (
                      <div className="flex flex-col items-center justify-center py-1 sm:py-2">
                        <div className="w-4 sm:w-5 h-4 sm:h-5 border-2 border-gray-400 border-t-gray-600 rounded-full animate-spin mb-2"></div>
                        <div className="text-center">
                          <div className="font-semibold text-sm sm:text-base">Creating Your AI Study Plan</div>
                          <div className="text-xs text-gray-500 mt-1">This may take 30-60 seconds...</div>
                        </div>
                      </div>
                    ) : (
                      isAddingToExisting ? 'Add Subject Plan' : 'Create My Study Plan'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SetupPage;