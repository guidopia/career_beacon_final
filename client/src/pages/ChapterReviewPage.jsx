import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Import components
import RevisionContent from '../components/RevisionContent';

// Import services
import { generateChapterRevision } from '../services/aiService';
import { getChapters, getUserSetup, saveLastActivity } from '../services/storageService';

const ChapterReviewPage = () => {
    const { chapterName } = useParams();
    const navigate = useNavigate();

    // State management
    const [revisionData, setRevisionData] = useState(null);
    const [currentChapter, setCurrentChapter] = useState(null);
    const [userSetup, setUserSetup] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Load revision data on component mount
    useEffect(() => {
        loadRevisionData();
    }, [chapterName]);

    const loadRevisionData = async () => {
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

            // Get chapters to find current chapter info
            const savedChapters = getChapters();
            if (!savedChapters || savedChapters.length === 0) {
                navigate('/setup');
                return;
            }

            // Find current chapter
            const decodedChapterName = decodeURIComponent(chapterName);
            const chapter = savedChapters.find(ch => ch.chapterName === decodedChapterName);
            if (!chapter) {
                setError('Chapter not found');
                return;
            }
            setCurrentChapter(chapter);

            // Save activity
            saveLastActivity({
                page: 'revision',
                action: 'view',
                chapterName: decodedChapterName
            });

            // Load revision content for this chapter
            const revision = await generateChapterRevision(decodedChapterName, setup.examName, chapter.subject || 'Mathematics');

            if (!revision || !revision.revision) {
                throw new Error('Invalid revision content received');
            }

            setRevisionData(revision);

        } catch (err) {
            console.error('Error loading revision data:', err);
            setError(err.message || 'Failed to load revision content. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Handle back navigation
    const handleBack = () => {
        navigate('/syllabus');
    };

    // Handle start quiz from revision page
    const handleStartQuiz = () => {
        const encodedChapterName = encodeURIComponent(currentChapter.chapterName);
        navigate(`/test/${encodedChapterName}`);
    };

    // Enhanced Premium Loading State
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
                            <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-green-500 rounded-full absolute top-1 sm:top-2 left-1/2 transform -translate-x-1/2"></div>
                        </div>
                        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }}>
                            <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-orange-500 rounded-full absolute bottom-1 sm:bottom-2 left-1/2 transform -translate-x-1/2"></div>
                        </div>
                    </div>

                    {/* Main Title */}
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 animate-pulse">
                        📚 Preparing Your Revision Sheet
                    </h2>

                    {/* Subtitle */}
                    <p className="text-base sm:text-lg text-gray-300 mb-4 sm:mb-6 leading-relaxed px-2">
                        Our AI is compiling comprehensive study material and key concepts for optimal learning
                    </p>

                    {/* Progress Steps */}
                    <div className="bg-gray-950 rounded-xl p-4 sm:p-6 border border-gray-700 mb-4 sm:mb-6">
                        <div className="space-y-3 sm:space-y-4">
                            <div className="flex items-center text-sm text-gray-300">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse flex-shrink-0"></div>
                                <span className="text-left">Analyzing chapter content and exam patterns</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-300">
                                <div className="w-2 h-2 bg-orange-500 rounded-full mr-3 animate-pulse flex-shrink-0" style={{ animationDelay: '0.5s' }}></div>
                                <span className="text-left">Generating key concepts and important formulas</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-300">
                                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3 animate-pulse flex-shrink-0" style={{ animationDelay: '1s' }}></div>
                                <span className="text-left">Creating structured revision notes and examples</span>
                            </div>
                        </div>
                    </div>

                    {/* Time Estimate */}
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
                        <p className="text-green-300 text-sm font-medium">
                            ⏱️ Please wait up to 1 minute while we prepare your revision sheet
                        </p>
                    </div>

                    {/* Motivational Message */}
                    <p className="text-gray-400 text-sm leading-relaxed px-2">
                        Get ready to master key concepts with our comprehensive revision material tailored for exam success!
                    </p>
                </div>
            </div>
        );
    }

    // Premium Error State
    if (error) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-4">
                <div className="text-center max-w-md w-full">
                    <div className="w-12 sm:w-16 h-12 sm:h-16 mx-auto mb-4 sm:mb-6 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center">
                        <svg className="h-6 sm:h-8 w-6 sm:w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.96-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h2 className="text-lg sm:text-xl font-medium text-white mb-2 sm:mb-4">Error Loading Content</h2>
                    <p className="text-gray-300 mb-6 sm:mb-8 text-sm sm:text-base leading-relaxed">{error}</p>
                    <div className="space-y-3">
                        <button
                            onClick={loadRevisionData}
                            className="w-full bg-white text-black px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
                        >
                            Try Again
                        </button>
                        <button
                            onClick={handleBack}
                            className="w-full bg-gray-700 text-gray-200 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-gray-600 border border-gray-600 transition-all duration-200 text-sm sm:text-base"
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Enhanced status styling
    const getStatusStyles = () => {
        switch (currentChapter?.status) {
            case 'completed':
                return 'bg-green-600 text-white';
            case 'in-progress':
                return 'bg-blue-600 text-white';
            case 'failed':
                return 'bg-red-600 text-white';
            default:
                return 'bg-gray-600 text-white';
        }
    };

    // Premium Main Interface
    return (
        <div className="min-h-screen bg-black">
            {/* Enhanced Header */}
            <div className="border-b border-gray-700 bg-gray-950">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        {/* Left side - Back + Title */}
                        <div className="flex items-center space-x-3 sm:space-x-4 mb-4 lg:mb-0">
                            <button
                                onClick={handleBack}
                                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
                            >
                                <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <div>
                                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">{currentChapter?.chapterName}</h1>
                                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1 sm:mt-2">
                                    <span className="bg-blue-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-medium">
                                        {currentChapter?.subject}
                                    </span>
                                    <span className="text-sm text-gray-300">{userSetup?.examName}</span>
                                </div>
                            </div>
                        </div>

                        {/* Right side - Status + Button */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                            <div className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium text-center ${getStatusStyles()}`}>
                                {currentChapter?.status?.replace('-', ' ') || 'Not Started'}
                            </div>
                            <button
                                onClick={handleStartQuiz}
                                className="bg-white text-black px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                                Attempt Quiz
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 lg:py-8">
                {revisionData && (
                    <RevisionContent
                        revisionData={revisionData}
                        chapterInfo={currentChapter}
                        onStartQuiz={handleStartQuiz}
                    />
                )}
            </div>

            {/* Enhanced Mobile Quiz Button */}
            <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 lg:hidden">
                <button
                    onClick={handleStartQuiz}
                    className="bg-white text-black p-3 sm:p-4 rounded-full shadow-xl hover:bg-gray-100 transition-all duration-200 transform hover:scale-110"
                >
                    <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default ChapterReviewPage;