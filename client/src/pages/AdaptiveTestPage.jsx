import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Import components
import AdaptiveQuiz from '../components/AdaptiveQuiz';

// Import services
import { generateChapterQuestions } from '../services/aiService';
import { getChapters, saveChapters, getUserSetup } from '../services/storageService';
import { markChapterInProgress, markChapterCompleted, markChapterFailed } from '../services/progressService';

function normalizeChapterTitle(s) {
    return String(s ?? '')
        .trim()
        .replace(/\s+/g, ' ');
}

const AdaptiveTestPage = () => {
    const { chapterName } = useParams();
    const navigate = useNavigate();

    // Utility function to shuffle array
    const shuffleArray = (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    // State management
    const [questions, setQuestions] = useState(null);
    const [chapters, setChapters] = useState([]);
    const [userSetup, setUserSetup] = useState(null);
    const [currentChapter, setCurrentChapter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Load data on component mount
    useEffect(() => {
        loadQuizData();
    }, [chapterName]);

    const loadQuizData = async () => {
        try {
            setLoading(true);
            setError('');

            // Get user setup
            const setup = getUserSetup();
            if (!setup) {
                navigate('/setup');
                return;
            }
            setUserSetup(setup);

            // Get chapters
            const savedChapters = getChapters();
            if (!savedChapters || savedChapters.length === 0) {
                navigate('/setup');
                return;
            }
            setChapters(savedChapters);

            // Find current chapter (normalize whitespace so URL vs stored syllabus always match)
            const decodedChapterName = normalizeChapterTitle(decodeURIComponent(chapterName));
            const chapter = savedChapters.find(
                (ch) => normalizeChapterTitle(ch.chapterName) === decodedChapterName
            );
            if (!chapter) {
                setError('Chapter not found');
                return;
            }
            setCurrentChapter(chapter);

            // Mark chapter as in progress (use canonical name from syllabus — progress store matches exactly)
            const updatedChapters = markChapterInProgress(savedChapters, chapter.chapterName);
            setChapters(updatedChapters);
            saveChapters(updatedChapters);

            // Load questions for this chapter
            let chapterQuestions = await generateChapterQuestions(
                chapter.chapterName,
                setup.examName,
                chapter.subject || 'Mathematics'
            );

            if (!chapterQuestions || !chapterQuestions.levels || chapterQuestions.levels.length !== 5) {
                throw new Error('Invalid questions format received');
            }

            // Shuffle questions within each level for variety (especially for retakes)
            chapterQuestions.levels = chapterQuestions.levels.map(level => ({
                ...level,
                questions: shuffleArray([...level.questions])
            }));

            setQuestions(chapterQuestions);

        } catch (err) {
            console.error('Error loading quiz data:', err);
            setError(err.message || 'Failed to load quiz. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Handle quiz completion
    const handleQuizComplete = (results) => {
        try {
            const progressKey = currentChapter?.chapterName;
            if (!progressKey) {
                setError('Could not save quiz results');
                return;
            }
            let updatedChapters;

            if (results.success) {
                // Quiz completed successfully
                updatedChapters = markChapterCompleted(chapters, progressKey, {
                    levelsCleared: 5,
                    correctAnswers: results.totalCorrect,
                    timeSpent: results.timeSpent
                });
            } else {
                // Quiz failed
                updatedChapters = markChapterFailed(chapters, progressKey, {
                    levelsCleared: results.levelsCleared,
                    correctAnswers: results.totalCorrect,
                    timeSpent: results.timeSpent
                });
            }

            // Save updated chapters
            saveChapters(updatedChapters);

            // Navigate back to syllabus after a short delay
            setTimeout(() => {
                navigate('/syllabus');
            }, 2000);

        } catch (err) {
            console.error('Error handling quiz completion:', err);
            setError('Failed to save quiz results');
        }
    };

    // Handle back navigation
    const handleBack = () => {
        navigate('/syllabus');
    };

    // Enhanced Premium Loading state
    if (loading) {
        return (
            <div className="min-h-screen mt-20 bg-black flex items-center justify-center relative overflow-hidden px-4">
                {/* Background Elements */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-1/4 left-1/4 w-16 sm:w-24 lg:w-32 h-16 sm:h-24 lg:h-32 bg-white rounded-full blur-xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-12 sm:w-18 lg:w-24 h-12 sm:h-18 lg:h-24 bg-white rounded-full blur-xl animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 left-1/2 w-8 sm:w-12 lg:w-16 h-8 sm:h-12 lg:h-16 bg-white rounded-full blur-lg animate-pulse delay-2000"></div>
                </div>

                <div className="text-center relative z-10 max-w-md mx-auto px-4 sm:px-6">
                    {/* Enhanced Spinner */}
                    <div className="relative mb-6 sm:mb-8">
                        {/* Outer rotating ring */}
                        <div className="w-16 sm:w-20 h-16 sm:h-20 border-4 border-gray-700 rounded-full animate-spin mx-auto relative">
                            <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-white rounded-full animate-spin"></div>
                        </div>

                        {/* Inner pulsing dot */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <div className="w-2.5 sm:w-3 h-2.5 sm:h-3 bg-white rounded-full animate-pulse"></div>
                        </div>

                        {/* Orbiting dots */}
                        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
                            <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-blue-500 rounded-full absolute top-1 sm:top-2 left-1/2 transform -translate-x-1/2"></div>
                        </div>
                        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }}>
                            <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-purple-500 rounded-full absolute bottom-1 sm:bottom-2 left-1/2 transform -translate-x-1/2"></div>
                        </div>
                    </div>

                    {/* Main Title */}
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 animate-pulse">
                        🧠 Preparing Your Adaptive Test
                    </h2>

                    {/* Subtitle */}
                    <p className="text-base sm:text-lg text-gray-300 mb-4 sm:mb-6 leading-relaxed px-2">
                        Our AI is crafting personalized questions tailored to your learning level
                    </p>

                    {/* Progress Steps */}
                    <div className="bg-gray-950 rounded-xl p-4 sm:p-6 border border-gray-700 mb-4 sm:mb-6">
                        <div className="space-y-3 sm:space-y-4">
                            <div className="flex items-center text-sm text-gray-300">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse flex-shrink-0"></div>
                                <span className="text-left">Analyzing chapter difficulty and your progress</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-300">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 animate-pulse flex-shrink-0" style={{ animationDelay: '0.5s' }}></div>
                                <span className="text-left">Generating 25 adaptive questions across 5 levels</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-300">
                                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3 animate-pulse flex-shrink-0" style={{ animationDelay: '1s' }}></div>
                                <span className="text-left">Customizing content for optimal learning</span>
                            </div>
                        </div>
                    </div>

                    {/* Time Estimate */}
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
                        <p className="text-blue-300 text-sm font-medium">
                            ⏱️ Please wait up to 1 minute while we prepare your test
                        </p>
                    </div>

                    {/* Motivational Message */}
                    <p className="text-gray-400 text-sm leading-relaxed px-2">
                        Get ready to challenge yourself and track your progress with our intelligent assessment system!
                    </p>
                </div>
            </div>
        );
    }

    // Premium Error state
    if (error) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-4">
                <div className="text-center max-w-md w-full">
                    <div className="w-12 sm:w-16 h-12 sm:h-16 mx-auto mb-4 sm:mb-6 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center">
                        <svg className="h-6 sm:h-8 w-6 sm:w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.96-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h2 className="text-lg sm:text-xl font-medium text-white mb-2">Quiz Error</h2>
                    <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed">{error}</p>
                    <div className="space-y-3">
                        <button
                            onClick={loadQuizData}
                            className="w-full bg-white text-black px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
                        >
                            Try Again
                        </button>
                        <button
                            onClick={handleBack}
                            className="w-full bg-gray-700 text-gray-200 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-gray-600 border border-gray-600 transition-all duration-200 text-sm sm:text-base"
                        >
                            Back to Syllabus
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Main quiz interface
    return (
        <div className="min-h-screen bg-black">
            {/* Enhanced Header */}
            <div className="bg-gray-950 shadow-lg border-b border-gray-700">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 sm:py-6">
                        <div className="flex items-center mb-3 sm:mb-0">
                            <button
                                onClick={handleBack}
                                className="mr-3 sm:mr-4 p-2 text-gray-400 hover:text-white transition-colors hover:bg-gray-800 rounded-lg"
                            >
                                <svg className="w-5 sm:w-6 h-5 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </button>
                            <div>
                                <h1 className="text-lg sm:text-xl font-bold text-white">
                                    {currentChapter?.chapterName}
                                </h1>
                                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1">
                                    <span className="bg-blue-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-medium">
                                        {currentChapter?.subject}
                                    </span>
                                    <span className="text-sm text-gray-300">{userSetup?.examName}</span>
                                    <span className="text-sm text-gray-500 hidden sm:inline">•</span>
                                    <span className="text-sm text-gray-300">Adaptive Test</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-center sm:text-right">
                            <p className="text-sm text-gray-400">Total Questions</p>
                            <p className="text-lg font-semibold text-white">25</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quiz Content */}
            <div className="max-w-4xl  mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                {questions && (
                    <AdaptiveQuiz
                        questions={questions}
                        chapterName={currentChapter?.chapterName}
                        onComplete={handleQuizComplete}
                    />
                )}
            </div>
        </div>
    );
};

export default AdaptiveTestPage;