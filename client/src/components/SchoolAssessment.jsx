import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import schoolQuestions from '../data/expandedSchoolQuestions-Updated';
import { ArrowRight, ArrowLeft, CheckCircle, AlertTriangle, GraduationCap } from 'lucide-react';

const SchoolAssessment = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(schoolQuestions.length).fill(''));
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    // Calculate progress percentage
    const completed = answers.filter(answer => answer !== '').length;
    const total = schoolQuestions.length;
    setProgress(Math.floor((completed / total) * 100));

    // Check if assessment is complete
    setIsComplete(completed === total);
  }, [answers]);

  const handleSingleOptionChange = (option) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = option;
    setAnswers(newAnswers);
    setValidationError('');
  };

  const handleMultiOptionChange = (option) => {
    const currentAnswer = answers[currentQuestion] ? answers[currentQuestion].split(', ') : [];
    let newAnswer;

    if (currentAnswer.includes(option)) {
      // Remove option if already selected
      newAnswer = currentAnswer.filter(item => item !== option);
    } else {
      // Add option if not at max limit
      const question = schoolQuestions[currentQuestion];
      if (currentAnswer.length < (question.max || Infinity)) {
        newAnswer = [...currentAnswer, option];
      } else {
        setValidationError(`You can only select up to ${question.max} options`);
        return;
      }
    }

    const newAnswers = [...answers];
    newAnswers[currentQuestion] = newAnswer.join(', ');
    setAnswers(newAnswers);
    setValidationError('');
  };

  const isOptionSelected = (option) => {
    if (answers[currentQuestion]) {
      return answers[currentQuestion].split(', ').includes(option);
    }
    return false;
  };

  const goToNextQuestion = () => {
    if (!answers[currentQuestion]) {
      setValidationError('Please select an answer to continue');
      return;
    }

    if (currentQuestion < schoolQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setValidationError('');
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setValidationError('');
    }
  };

  const handleGenerateReport = async () => {
    if (isComplete) {
      try {
        // Try to save answers to backend if user is authenticated
        const token = localStorage.getItem('authToken');
        if (token) {
          try {
            const response = await fetch('https://guidopia-server.vercel.app/api/assessment/save', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                assessmentType: 'school',
                answers
              })
            });

            const data = await response.json();
            if (!data.success) {
              console.warn('Failed to save to backend:', data.message);
            }
          } catch (backendError) {
            console.warn('Backend save failed, continuing with local storage:', backendError);
          }
        }

        // Store answers in sessionStorage for the report page (always do this)
        sessionStorage.setItem('assessmentAnswers', JSON.stringify(answers));
        sessionStorage.setItem('assessmentType', 'school-v2');

        // Navigate to the school-specific report generation page
        navigate('/school-generate-report');
      } catch (error) {
        setValidationError(error.message || 'Error generating report. Please try again.');
      }
    } else {
      setValidationError('Please complete all questions before generating a report');
    }
  };

  const currentQuestionData = schoolQuestions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white overflow-x-hidden w-full">
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-black to-gray-900"></div>
        <div className="absolute w-full h-full">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-cyan-500/10 blur-[120px]"
              style={{
                width: `${Math.random() * 600 + 200}px`,
                height: `${Math.random() * 600 + 200}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: 0.03,
              }}
            />
          ))}
        </div>
        {/* Additional background decorations */}
        <div className="absolute bottom-20 right-20 w-16 h-16 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 left-20 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-2xl"></div>
      </div>

      {/* Enhanced Navigation Bar */}


      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Enhanced Header */}
        <div className="text-center mb-10">
          <div className="inline-flex mb-6">
            <span className="text-xs font-semibold tracking-wider bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border border-cyan-400/30 py-2 px-4 rounded-full backdrop-blur-sm">
              STEP 1 OF 3: ASSESSMENT
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            <span className="bg-gradient-to-r from-cyan-400 via-cyan-300 to-white bg-clip-text text-transparent">
              School Student Career Assessment
            </span>
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Answer the following questions to help us understand your interests, skills, and preferences.
            This will help us create a personalized career recommendation for you.
          </p>
        </div>

        {/* Enhanced Progress bar */}
        <div className="w-full h-3 bg-gray-800/50 rounded-full mb-3 overflow-hidden border border-gray-700/30">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full transition-all duration-500 ease-out shadow-lg shadow-cyan-500/30"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="text-right text-sm text-gray-400 mb-8">{progress}% Complete</div>

        {/* Enhanced Question display */}
        <div className="relative mb-8">
          <div className="bg-gradient-to-br from-gray-900/70 to-gray-800/50 backdrop-blur-sm border border-gray-700/50 p-8 rounded-xl shadow-lg shadow-gray-900/20 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/3 via-transparent to-purple-500/3 rounded-xl"></div>

            <div className="relative z-10">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-white">Question {currentQuestion + 1} of {schoolQuestions.length}</h3>
                <span className="text-xs py-2 px-3 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 rounded-full border border-cyan-400/30 backdrop-blur-sm">
                  {currentQuestionData.type === 'radio' ? 'Select one' : 'Select multiple'}
                </span>
              </div>

              <p className="text-2xl font-medium text-white mb-8 leading-relaxed">{currentQuestionData.question}</p>

              {/* Enhanced Answer options */}
              <div className="space-y-4 mb-8">
                {currentQuestionData.type === 'radio' ? (
                  // Single-select options
                  currentQuestionData.options.map((option, index) => (
                    <div
                      key={index}
                      className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.02]
                        ${answers[currentQuestion] === option
                          ? 'border-cyan-400/50 bg-gradient-to-r from-cyan-500/10 to-cyan-600/10 shadow-lg shadow-cyan-500/20'
                          : 'border-gray-700/50 hover:border-cyan-400/30 hover:bg-gradient-to-r hover:from-gray-800/50 hover:to-gray-700/30'}`}
                      onClick={() => handleSingleOptionChange(option)}
                    >
                      <div className={`w-5 h-5 rounded-full border flex-shrink-0 mr-4 flex items-center justify-center transition-all duration-300
                        ${answers[currentQuestion] === option
                          ? 'border-cyan-400 bg-cyan-500/20'
                          : 'border-gray-400'}`}
                      >
                        {answers[currentQuestion] === option && (
                          <div className="w-3 h-3 rounded-full bg-cyan-400"></div>
                        )}
                      </div>
                      <label className="flex-grow cursor-pointer text-gray-200 text-lg">{option}</label>
                    </div>
                  ))
                ) : (
                  // Multi-select options
                  currentQuestionData.options.map((option, index) => (
                    <div
                      key={index}
                      className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.02]
                        ${isOptionSelected(option)
                          ? 'border-cyan-400/50 bg-gradient-to-r from-cyan-500/10 to-cyan-600/10 shadow-lg shadow-cyan-500/20'
                          : 'border-gray-700/50 hover:border-cyan-400/30 hover:bg-gradient-to-r hover:from-gray-800/50 hover:to-gray-700/30'}`}
                      onClick={() => handleMultiOptionChange(option)}
                    >
                      <div className={`w-5 h-5 rounded border flex-shrink-0 mr-4 flex items-center justify-center transition-all duration-300
                        ${isOptionSelected(option)
                          ? 'border-cyan-400 bg-cyan-400'
                          : 'border-gray-400'}`}
                      >
                        {isOptionSelected(option) && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <label className="flex-grow cursor-pointer text-gray-200 text-lg">{option}</label>
                    </div>
                  ))
                )}
              </div>

              {/* Enhanced Error message */}
              {validationError && (
                <div className="bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-400/30 text-red-300 p-4 rounded-xl mb-6 flex items-center backdrop-blur-sm">
                  <AlertTriangle size={20} className="mr-3 flex-shrink-0" />
                  <p>{validationError}</p>
                </div>
              )}

              {/* Enhanced Navigation buttons */}
              <div className="flex justify-between pt-6 border-t border-gray-700/30">
                <button
                  onClick={goToPreviousQuestion}
                  disabled={currentQuestion === 0}
                  className={`group relative inline-flex items-center justify-center py-3 px-6 overflow-hidden rounded-xl text-white font-medium transition-all duration-300
                    ${currentQuestion === 0
                      ? 'bg-gray-800/30 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-br from-gray-800/60 to-gray-700/40 backdrop-blur-sm border border-gray-600/50 hover:border-cyan-400/60 hover:text-cyan-300 hover:scale-105'}`}
                >
                  <span className="relative z-10 flex items-center">
                    <ArrowLeft size={16} className="mr-2" />
                    Previous
                  </span>
                  {currentQuestion > 0 && (
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                  )}
                </button>

                {currentQuestion < schoolQuestions.length - 1 ? (
                  <button
                    onClick={goToNextQuestion}
                    disabled={!answers[currentQuestion]}
                    className={`group relative inline-flex items-center justify-center py-3 px-6 overflow-hidden rounded-xl font-medium transition-all duration-300
                      ${!answers[currentQuestion]
                        ? 'bg-cyan-600/30 text-cyan-300/70 cursor-not-allowed'
                        : 'bg-gradient-to-r from-cyan-500 to-cyan-400 text-black hover:shadow-lg hover:shadow-cyan-500/30 hover:scale-105'}`}
                  >
                    <span className="relative z-10 flex items-center">
                      Next
                      <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
                    </span>
                    {answers[currentQuestion] && (
                      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleGenerateReport}
                    disabled={!isComplete}
                    className={`group relative inline-flex items-center justify-center py-3 px-6 overflow-hidden rounded-xl font-medium transition-all duration-300
                      ${!isComplete
                        ? 'bg-cyan-600/30 text-cyan-300/70 cursor-not-allowed'
                        : 'bg-gradient-to-r from-cyan-500 to-cyan-400 text-black hover:shadow-lg hover:shadow-cyan-500/30 hover:scale-105'}`}
                  >
                    <span className="relative z-10 flex items-center">
                      Generate Career Report
                      <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
                    </span>
                    {isComplete && (
                      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Complete all questions message */}
        {!isComplete && currentQuestion === schoolQuestions.length - 1 && (
          <div className="mt-8">
            <div className="bg-gradient-to-br from-gray-900/70 to-gray-800/50 backdrop-blur-sm border border-orange-400/30 p-6 rounded-xl shadow-lg shadow-orange-500/20 flex items-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-orange-500/5 rounded-xl"></div>
              <div className="relative z-10 flex items-center w-full">
                <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500/20 to-orange-600/20 border border-orange-400/30 mr-4">
                  <AlertTriangle size={24} className="text-orange-400" />
                </div>
                <div className="flex-1">
                  <p className="text-orange-300 font-medium mb-2">
                    You still have {schoolQuestions.length - answers.filter(a => a !== '').length} questions to complete.
                  </p>
                  <button
                    onClick={() => setCurrentQuestion(answers.findIndex(a => a === ''))}
                    className="group inline-flex items-center text-sm font-medium text-orange-400 hover:text-orange-300 transition-colors"
                  >
                    Go to first unanswered question
                    <ArrowRight size={14} className="ml-1.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchoolAssessment;