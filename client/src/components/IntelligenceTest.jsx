import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import intelligenceQuestions from '../data/intelligenceQuestions';
import { ArrowRight, ArrowLeft, CheckCircle, AlertTriangle, Lightbulb } from 'lucide-react';
import { SITE_BRAND_NAME } from '../constants/branding';

const IntelligenceTest = () => {
    const navigate = useNavigate();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState(Array(intelligenceQuestions.length).fill(''));
    const [progress, setProgress] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [validationError, setValidationError] = useState('');

    useEffect(() => {
        // Calculate progress percentage
        const completed = answers.filter(answer => answer !== '').length;
        const total = intelligenceQuestions.length;
        setProgress(Math.floor((completed / total) * 100));

        // Check if assessment is complete
        setIsComplete(completed === total);
    }, [answers]);

    const handleOptionChange = (option) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestion] = option;
        setAnswers(newAnswers);
        setValidationError('');
    };

    const goToNextQuestion = () => {
        if (!answers[currentQuestion] || answers[currentQuestion].trim() === '') {
            setValidationError('Please select an answer to continue');
            return;
        }

        if (currentQuestion < intelligenceQuestions.length - 1) {
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

    const handleGenerateReport = () => {
        if (isComplete) {
            // Store answers in sessionStorage for the report page
            sessionStorage.setItem('independentTestAnswers', JSON.stringify(answers));
            sessionStorage.setItem('independentTestType', 'intelligence');

            // Navigate to the report generation page
            navigate('/independent-test-report');
        } else {
            setValidationError('Please complete all questions before generating your intelligence profile');
        }
    };

    const currentQuestionData = intelligenceQuestions[currentQuestion];

    return (
        <div className="min-h-screen bg-black text-white overflow-x-hidden w-full">
            {/* Animated Background */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute inset-0 bg-black"></div>
                <div className="absolute w-full h-full">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div
                            key={i}
                            className="absolute rounded-full bg-pink-600 blur-[120px]"
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
            <div className="w-full px-4 sm:px-6 py-4 sm:py-5 border-b border-white/10">
                <div className="flex flex-col sm:flex-row justify-between items-center max-w-7xl mx-auto gap-4 sm:gap-0">
                    <div className="flex items-center">
                        <div className="text-xs sm:text-lg md:text-2xl lg:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-pink-600 relative leading-snug text-center sm:text-left">
                            {SITE_BRAND_NAME}
                            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-pink-500 to-transparent"></span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <span className="text-xs sm:text-sm py-2 px-3 sm:px-4 rounded-full bg-pink-600/20 text-pink-400 border border-pink-500/30 text-center">
                            Multiple Intelligence Test
                        </span>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                {/* Header */}
                <div className="text-center mb-8 sm:mb-10">
                    <div className="inline-flex mb-4">
                        <span className="text-xs font-semibold tracking-wider bg-pink-500/10 border border-pink-500/20 py-1.5 px-3 sm:px-4 rounded-full text-pink-400">
                            QUICK DISCOVERY TEST
                        </span>
                    </div>
                    <h1 className="text-2xl sm:text-4xl font-bold tracking-tight mb-4">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-white">
                            Intelligence Test
                        </span>
                    </h1>
                    <p className="text-sm sm:text-base text-white/70 max-w-2xl mx-auto px-4">
                        Discover your multiple intelligence types based on Howard Gardner's theory.
                        This assessment will help you understand your natural learning style and optimal career paths.
                    </p>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-white/5 rounded-full mb-2 overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-pink-500 to-pink-400 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
                <div className="text-right text-sm text-white/50 mb-6 sm:mb-8">{progress}% Complete</div>

                {/* Question display */}
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-pink-500 to-pink-600 rounded-xl opacity-20 blur-sm"></div>
                    <div className="relative p-[1.5px] rounded-xl bg-gradient-to-b from-pink-500 via-pink-400 to-pink-600">
                        <div className="bg-black/95 p-4 sm:p-8 rounded-xl border border-white/10 backdrop-blur-xl">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3 sm:gap-0">
                                <h3 className="text-base sm:text-lg font-medium text-white/80">Question {currentQuestion + 1} of {intelligenceQuestions.length}</h3>
                                <span className="text-xs py-1.5 px-3 bg-pink-500/10 text-pink-400 rounded-full border border-pink-500/20 flex items-center self-start sm:self-center">
                                    <Lightbulb className="h-3 w-3 mr-1.5" />
                                    Intelligence Type
                                </span>
                            </div>

                            <p className="text-lg sm:text-2xl font-medium text-white mb-6 sm:mb-8 leading-relaxed">{currentQuestionData.question}</p>

                            {/* Answer options */}
                            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                                {currentQuestionData.options.map((option, index) => (
                                    <div
                                        key={index}
                                        className={`flex items-center p-3 sm:p-4 border rounded-lg cursor-pointer transition-all
                      ${answers[currentQuestion] === option
                                                ? 'border-pink-500 bg-pink-900/20'
                                                : 'border-white/10 hover:border-pink-500/50 hover:bg-pink-900/10'}`}
                                        onClick={() => handleOptionChange(option)}
                                    >
                                        <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border flex-shrink-0 mr-3 sm:mr-4 flex items-center justify-center
                      ${answers[currentQuestion] === option
                                                ? 'border-pink-500'
                                                : 'border-white/30'}`}
                                        >
                                            {answers[currentQuestion] === option && (
                                                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-pink-500"></div>
                                            )}
                                        </div>
                                        <label className="flex-grow cursor-pointer text-white/90 text-sm sm:text-lg leading-relaxed">{option}</label>
                                    </div>
                                ))}
                            </div>

                            {/* Error message */}
                            {validationError && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 sm:p-4 rounded-lg mb-6 flex items-start">
                                    <AlertTriangle size={18} className="mr-2 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm sm:text-base">{validationError}</p>
                                </div>
                            )}

                            {/* Navigation buttons */}
                            <div className="flex flex-col sm:flex-row justify-between pt-6 border-t border-white/10 gap-3 sm:gap-0">
                                <button
                                    onClick={goToPreviousQuestion}
                                    disabled={currentQuestion === 0}
                                    className={`group relative inline-flex items-center justify-center py-3 px-4 sm:px-6 overflow-hidden rounded-full text-white font-medium transition-all order-2 sm:order-1
                    ${currentQuestion === 0
                                            ? 'bg-white/5 text-white/40 cursor-not-allowed'
                                            : 'bg-white/10 hover:bg-white/15 border border-white/20'}`}
                                >
                                    <span className="relative z-10 flex items-center text-sm sm:text-base">
                                        <ArrowLeft size={16} className="mr-2" />
                                        Previous
                                    </span>
                                </button>

                                {currentQuestion < intelligenceQuestions.length - 1 ? (
                                    <button
                                        onClick={goToNextQuestion}
                                        disabled={!answers[currentQuestion] || answers[currentQuestion].trim() === ''}
                                        className={`group relative inline-flex items-center justify-center py-3 px-4 sm:px-6 overflow-hidden rounded-full font-medium transition-all order-1 sm:order-2
                      ${!answers[currentQuestion] || answers[currentQuestion].trim() === ''
                                                ? 'bg-pink-600/50 text-white/70 cursor-not-allowed'
                                                : 'bg-pink-600 text-white hover:bg-pink-700'}`}
                                    >
                                        <span className="relative z-10 flex items-center text-sm sm:text-base">
                                            Next
                                            <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
                                        </span>
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleGenerateReport}
                                        disabled={!isComplete}
                                        className={`group relative inline-flex items-center justify-center py-3 px-4 sm:px-6 overflow-hidden rounded-full font-medium transition-all order-1 sm:order-2
                      ${!isComplete
                                                ? 'bg-pink-600/50 text-white/70 cursor-not-allowed'
                                                : 'bg-pink-600 text-white hover:bg-pink-700'}`}
                                    >
                                        <span className="relative z-10 flex items-center text-sm sm:text-base">
                                            <span className="hidden sm:inline">Generate Intelligence Profile</span>
                                            <span className="sm:hidden">Generate Profile</span>
                                            <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
                                        </span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Complete all questions message */}
                {!isComplete && currentQuestion === intelligenceQuestions.length - 1 && (
                    <div className="mt-6 sm:mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-b from-amber-500 to-amber-600 rounded-xl opacity-20 blur-sm"></div>
                            <div className="relative p-[1.5px] rounded-xl bg-gradient-to-b from-amber-500 via-amber-400 to-amber-600">
                                <div className="bg-black/95 p-4 sm:p-6 rounded-xl border border-white/10 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                    <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 flex-shrink-0">
                                        <AlertTriangle size={20} className="text-amber-400" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-amber-400 font-medium mb-2 text-sm sm:text-base">
                                            You still have {intelligenceQuestions.length - answers.filter(a => a !== '' && a.trim() !== '').length} questions to complete.
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
            <div className="w-full px-4 sm:px-8 py-6 border-t border-white/5 mt-8 sm:mt-12">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-xs sm:text-sm text-white/40 text-center sm:text-left">{`© 2025 ${SITE_BRAND_NAME} • Guiding Futures with Precision`}</p>
                    <div className="flex space-x-4 sm:space-x-6 text-xs sm:text-sm">
                        <a href="#" className="text-white/40 hover:text-pink-400 transition-colors">Privacy</a>
                        <a href="#" className="text-white/40 hover:text-pink-400 transition-colors">Terms</a>
                        <a href="#" className="text-white/40 hover:text-pink-400 transition-colors">Support</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IntelligenceTest;