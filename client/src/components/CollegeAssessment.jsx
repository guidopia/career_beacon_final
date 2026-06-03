import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import collegeQuestions from '../data/collegeQuestions';
import { ArrowRight, ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';
import { SITE_BRAND_NAME } from '../constants/branding';

const CollegeAssessment = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(collegeQuestions.length).fill(''));
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    // Calculate progress percentage
    const completed = answers.filter(answer => answer !== '').length;
    const total = collegeQuestions.length;
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

  const handleTextInputChange = (value) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
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
      const question = collegeQuestions[currentQuestion];
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
    if (!answers[currentQuestion] || answers[currentQuestion].trim() === '') {
      setValidationError('Please provide an answer to continue');
      return;
    }

    if (currentQuestion < collegeQuestions.length - 1) {
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
                assessmentType: 'college',
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
        sessionStorage.setItem('assessmentType', 'college');

        // Navigate to the report generation page
        navigate('/generate-report');
      } catch (error) {
        setValidationError(error.message || 'Error generating report. Please try again.');
      }
    } else {
      setValidationError('Please complete all questions before generating a report');
    }
  };

  const currentQuestionData = collegeQuestions[currentQuestion];

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden w-full">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-black"></div>
        <div className="absolute w-full h-full">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-blue-600 blur-[120px]"
              style={{
                width: `${Math.random() * 600 + 200}px`,
                height: `${Math.random() * 600 + 200}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: 0.05,
              }}
            />
          ))}
        </div>
      </div>

      {/* Top Navigation Bar */}
      <div className="w-full px-4 sm:px-6 py-5 border-b border-white/10">
        <div className="flex flex-col sm:flex-row justify-between items-center max-w-7xl mx-auto gap-4">
          <div className="flex items-center">
            <div className="text-sm sm:text-xl md:text-2xl lg:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600 relative leading-snug text-center sm:text-left">
              {SITE_BRAND_NAME}
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-transparent"></span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm py-2 px-4 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30">
              College Assessment
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex mb-4">
            <span className="text-xs font-semibold tracking-wider bg-blue-500/10 border border-blue-500/20 py-1.5 px-4 rounded-full text-blue-400">
              STEP 1 OF 3: ASSESSMENT
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-white">
              College  Assessment
            </span>
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            Answer the following questions to help us understand your interests, skills, and preferences.
            This will help us create a personalized career recommendation for you.
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-white/5 rounded-full mb-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="text-right text-sm text-white/50 mb-8">{progress}% Complete</div>

        {/* Question display */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500 to-blue-600 rounded-xl opacity-20 blur-sm"></div>
          <div className="relative p-[1.5px] rounded-xl bg-gradient-to-b from-blue-500 via-blue-400 to-blue-600">
            <div className="bg-black/95 p-8 rounded-xl border border-white/10 backdrop-blur-xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-white/80">Question {currentQuestion + 1} of {collegeQuestions.length}</h3>
                <span className="text-xs py-1.5 px-3 bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20">
                  {currentQuestionData.type === 'radio' ? 'Select one' :
                    currentQuestionData.type === 'checkbox' ? 'Select multiple' : 'Type your answer'}
                </span>
              </div>

              <p className="text-2xl font-medium text-white mb-8">{currentQuestionData.question}</p>

              {/* Answer options */}
              <div className="space-y-4 mb-8">
                {currentQuestionData.type === 'text' ? (
                  // Text input
                  <div className="relative">
                    <input
                      type="text"
                      value={answers[currentQuestion] || ''}
                      onChange={(e) => handleTextInputChange(e.target.value)}
                      placeholder="Type your answer here..."
                      className="w-full p-4 bg-white/5 border border-white/10 rounded-lg text-white text-lg placeholder-white/40 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>
                ) : currentQuestionData.type === 'radio' ? (
                  // Single-select options
                  currentQuestionData.options.map((option, index) => (
                    <div
                      key={index}
                      className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all
                        ${answers[currentQuestion] === option
                          ? 'border-blue-500 bg-blue-900/20'
                          : 'border-white/10 hover:border-blue-500/50 hover:bg-blue-900/10'}`}
                      onClick={() => handleSingleOptionChange(option)}
                    >
                      <div className={`w-5 h-5 rounded-full border flex-shrink-0 mr-4 flex items-center justify-center
                        ${answers[currentQuestion] === option
                          ? 'border-blue-500'
                          : 'border-white/30'}`}
                      >
                        {answers[currentQuestion] === option && (
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        )}
                      </div>
                      <label className="flex-grow cursor-pointer text-white/90 text-lg">{option}</label>
                    </div>
                  ))
                ) : (
                  // Multi-select options
                  currentQuestionData.options.map((option, index) => (
                    <div
                      key={index}
                      className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all
                        ${isOptionSelected(option)
                          ? 'border-blue-500 bg-blue-900/20'
                          : 'border-white/10 hover:border-blue-500/50 hover:bg-blue-900/10'}`}
                      onClick={() => handleMultiOptionChange(option)}
                    >
                      <div className={`w-5 h-5 rounded border flex-shrink-0 mr-4 flex items-center justify-center
                        ${isOptionSelected(option)
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-white/30'}`}
                      >
                        {isOptionSelected(option) && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <label className="flex-grow cursor-pointer text-white/90 text-lg">{option}</label>
                    </div>
                  ))
                )}
              </div>

              {/* Error message */}
              {validationError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg mb-6 flex items-center">
                  <AlertTriangle size={20} className="mr-2 flex-shrink-0" />
                  <p>{validationError}</p>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex justify-between pt-6 border-t border-white/10">
                <button
                  onClick={goToPreviousQuestion}
                  disabled={currentQuestion === 0}
                  className={`group relative inline-flex items-center justify-center py-3 px-6 overflow-hidden rounded-full text-white font-medium transition-all
                    ${currentQuestion === 0
                      ? 'bg-white/5 text-white/40 cursor-not-allowed'
                      : 'bg-white/10 hover:bg-white/15 border border-white/20'}`}
                >
                  <span className="relative z-10 flex items-center">
                    <ArrowLeft size={16} className="mr-2" />
                    Previous
                  </span>
                </button>

                {currentQuestion < collegeQuestions.length - 1 ? (
                  <button
                    onClick={goToNextQuestion}
                    disabled={!answers[currentQuestion] || answers[currentQuestion].trim() === ''}
                    className={`group relative inline-flex items-center justify-center py-3 px-6 overflow-hidden rounded-full font-medium transition-all
                      ${!answers[currentQuestion] || answers[currentQuestion].trim() === ''
                        ? 'bg-blue-600/50 text-white/70 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                  >
                    <span className="relative z-10 flex items-center">
                      Next
                      <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={handleGenerateReport}
                    disabled={!isComplete}
                    className={`group relative inline-flex items-center justify-center py-3 px-6 overflow-hidden rounded-full font-medium transition-all
                      ${!isComplete
                        ? 'bg-blue-600/50 text-white/70 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                  >
                    <span className="relative z-10 flex items-center">
                      Generate Career Report
                      <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Complete all questions message */}
        {!isComplete && currentQuestion === collegeQuestions.length - 1 && (
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-b from-amber-500 to-amber-600 rounded-xl opacity-20 blur-sm"></div>
              <div className="relative p-[1.5px] rounded-xl bg-gradient-to-b from-amber-500 via-amber-400 to-amber-600">
                <div className="bg-black/95 p-6 rounded-xl border border-white/10 backdrop-blur-xl flex items-center">
                  <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 mr-4">
                    <AlertTriangle size={24} className="text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-amber-400 font-medium mb-2">
                      You still have {collegeQuestions.length - answers.filter(a => a !== '' && a.trim() !== '').length} questions to complete.
                    </p>
                    <button
                      onClick={() => setCurrentQuestion(answers.findIndex(a => a === '' || a.trim() === ''))}
                      className="group inline-flex items-center text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors"
                    >
                      Go to first unanswered question
                      <ArrowRight size={14} className="ml-1.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="w-full px-8 py-6 border-t border-white/5 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-white/40 text-center sm:text-left">{`© 2025 ${SITE_BRAND_NAME} • Guiding Futures with Precision`}</p>
          <div className="flex space-x-6 text-sm mt-4 sm:mt-0">
            <a href="#" className="text-white/40 hover:text-blue-400 transition-colors">Privacy</a>
            <a href="#" className="text-white/40 hover:text-blue-400 transition-colors">Terms</a>
            <a href="#" className="text-white/40 hover:text-blue-400 transition-colors">Support</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeAssessment; 