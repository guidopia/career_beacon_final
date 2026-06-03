import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSavedAptitudeTest } from '../services/independentTests';
import { Download, Home, Target, Calendar, TrendingUp, ArrowRight } from 'lucide-react';

const SavedAptitudeTest = () => {
    const navigate = useNavigate();
    const [testData, setTestData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadSavedTest();
    }, []);

    const loadSavedTest = () => {
        setLoading(true);
        try {
            const savedData = getSavedAptitudeTest();
            if (savedData) {
                setTestData(savedData);
            } else {
                setError('No saved aptitude test found. Please complete the aptitude test first.');
            }
        } catch (err) {
            setError('Failed to load saved test: ' + (err.message || 'Unknown error'));
        } finally {
            setLoading(false);
        }
    };

    // Helper function to clean up content and remove stray numbered items
    const cleanupContent = (content) => {
        if (!content) return '';

        // Remove any career-related numbered items that should stay as content
        const cleanedContent = content
            .replace(/^\d+\.\s*(Project Manager:|Event Planner:|Educational Administrator:|Marketing Specialist:|Public Relations Officer:|Event Coordinator:|Accountant:|Career \d+:|Teacher:|Sales Representative:|Human Resources:|Social Worker:|Counselor:|Manager:|Coordinator:|Specialist:|Officer:|Planner:|Administrator:)/gm, '$1')
            .replace(/^\d+\.\s*([A-Z][a-zA-Z\s]*:)/gm, '$1')
            .trim();

        return cleanedContent;
    };

    // Enhanced helper function to format content beautifully
    const formatContentText = (content) => {
        if (!content) return '';

        // Clean up the content first
        let cleanedContent = cleanupContent(content);

        // Split into paragraphs for better formatting
        const paragraphs = cleanedContent.split('\n').filter(p => p.trim());

        return paragraphs.map((paragraph, index) => {
            const trimmedParagraph = paragraph.trim();

            // Skip empty paragraphs
            if (!trimmedParagraph) return null;

            // Check if it's a career item (Job Title: Description format)
            const careerMatch = trimmedParagraph.match(/^([^:]+):\s*(.+)$/);
            if (careerMatch) {
                const [, jobTitle, description] = careerMatch;

                return (
                    <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg border-l-3 border-l-orange-500">
                        <h4 className="font-semibold text-gray-800 mb-1">
                            {jobTitle.trim()}
                        </h4>
                        <p className="text-gray-600 leading-relaxed text-sm">{description.trim()}</p>
                    </div>
                );
            }

            // Check if it's a bulleted item (starts with -, •, or similar)
            if (/^[-•*]\s/.test(trimmedParagraph)) {
                const bulletContent = trimmedParagraph.replace(/^[-•*]\s/, '').trim();
                const bulletMatch = bulletContent.match(/^([^:]+):\s*(.+)$/);

                if (bulletMatch) {
                    const [, title, desc] = bulletMatch;
                    return (
                        <div key={index} className="mb-3 pl-4 border-l-2 border-l-orange-500">
                            <span className="font-medium text-gray-800">{title.trim()}:</span>
                            <span className="text-gray-600 ml-1">{desc.trim()}</span>
                        </div>
                    );
                } else {
                    return (
                        <div key={index} className="mb-2 pl-4 border-l-2 border-l-orange-500">
                            <p className="text-gray-600 leading-relaxed">{bulletContent}</p>
                        </div>
                    );
                }
            }

            // Regular paragraph
            return (
                <p key={index} className="text-gray-700 leading-relaxed mb-3">
                    {trimmedParagraph}
                </p>
            );
        }).filter(item => item !== null);
    };

    const formatReportContent = (content) => {
        if (!content) return null;

        // Split content into sections
        const sections = content.split('\n\n').filter(section => section.trim());
        let sectionCounter = 0;

        return (
            <div className="space-y-6">
                {sections.map((section, index) => {
                    const trimmedSection = section.trim();

                    // Check if section starts with a number (main section) - for cases where AI includes numbers
                    if (/^\d+\.\s+/.test(trimmedSection)) {
                        const sectionMatch = trimmedSection.match(/^(\d+)\.\s+(.+)/s);
                        if (sectionMatch) {
                            const [, number, content] = sectionMatch;
                            const title = content.split('\n')[0];
                            const body = content.split('\n').slice(1).join('\n').trim();

                            return (
                                <div key={index} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 p-8">
                                    <div className="flex items-start">
                                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-white font-bold text-lg mr-6 shadow-sm flex-shrink-0">
                                            {number}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-gray-800 leading-tight mb-2">{title}</h3>
                                            <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full mb-4"></div>
                                            <div className="space-y-2">
                                                {formatContentText(body)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                    }

                    // Define exact section titles from the backend prompts
                    const aptitudeSections = [
                        'Your Cognitive Abilities Assessment',
                        'Detailed Performance Analysis',
                        'Academic & Career Recommendations',
                        'Improvement Strategy'
                    ];

                    // Check if this section matches any of the expected main sections
                    let isMainSection = false;

                    // STRICT CHECK: Only exact matches for main sections
                    for (let expectedTitle of aptitudeSections) {
                        if (trimmedSection.startsWith(expectedTitle)) {
                            isMainSection = true;
                            break;
                        }
                    }

                    if (isMainSection) {
                        // Increment counter for numbered sections
                        sectionCounter++;

                        // Extract the title and content
                        const lines = trimmedSection.split('\n');
                        const title = lines[0];
                        const body = lines.slice(1).join('\n').trim();

                        return (
                            <div key={index} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 p-8">
                                <div className="flex items-start">
                                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-white font-bold text-lg mr-6 shadow-sm flex-shrink-0">
                                        {sectionCounter}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-800 leading-tight mb-2">{title}</h3>
                                        <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full mb-4"></div>
                                        <div className="text-gray-700 leading-relaxed whitespace-pre-line prose prose-gray max-w-none">
                                            {cleanupContent(body)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    }

                    // Regular content - also improved styling
                    return (
                        <div key={index} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                            <div className="space-y-2">
                                {formatContentText(trimmedSection)}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    const getScoreLevel = (score, total) => {
        const percentage = (score / total) * 100;
        if (percentage >= 85) return { level: 'Excellent', color: 'emerald' };
        if (percentage >= 65) return { level: 'Good', color: 'blue' };
        if (percentage >= 45) return { level: 'Average', color: 'yellow' };
        return { level: 'Needs Improvement', color: 'red' };
    };

    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full mb-6">
                        <Target className="h-10 w-10 text-orange-600" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-2">Loading Your Aptitude Analysis</h2>
                    <p className="text-gray-500 text-sm sm:text-base mb-8">Retrieving your saved results...</p>

                    <div className="bg-white rounded-lg p-8 shadow-sm border max-w-md mx-auto">
                        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
                        <p className="text-gray-600">Loading your aptitude data...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error && !testData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="max-w-4xl mx-auto px-6 py-12">
                    <div className="text-center">
                        <div className="bg-white border border-red-100 text-red-600 p-8 rounded-lg shadow-xl max-w-lg mx-auto">
                            <Target className="h-16 w-16 text-red-500 mx-auto mb-4" />
                            <h2 className="text-xl font-semibold mb-4">Test Not Found</h2>
                            <p className="mb-6 text-sm sm:text-base">{error}</p>
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-center">
                                <button
                                    onClick={() => navigate('/aptitude-test')}
                                    className="bg-orange-600 text-white px-4 sm:px-6 py-2 rounded-md hover:bg-orange-700 transition text-sm sm:text-base"
                                >
                                    Take Aptitude Test
                                </button>
                                <button
                                    onClick={() => navigate('/')}
                                    className="bg-gray-600 text-white px-4 sm:px-6 py-2 rounded-md hover:bg-gray-700 transition text-sm sm:text-base"
                                >
                                    Return Home
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const scoreLevel = testData?.scores ? getScoreLevel(testData.scores.score, testData.scores.total) : null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 sm:p-8 mb-6 sm:mb-8 text-white">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                        <div className="flex flex-col sm:flex-row sm:items-center">
                            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 sm:p-4 mb-4 sm:mb-0 sm:mr-4 lg:mr-6 w-fit">
                                <Target className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold mb-2">Your Saved Aptitude Analysis</h1>
                                <p className="text-orange-100 text-sm sm:text-base">
                                    {testData && testData.timestamp && (
                                        `Completed on ${formatDate(testData.timestamp)}`
                                    )}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                            <button
                                onClick={() => navigate('/aptitude-test')}
                                className="bg-white/10 backdrop-blur-sm text-white px-3 sm:px-4 py-2 rounded-md hover:bg-white/20 transition border border-white/20 flex items-center justify-center text-sm sm:text-base"
                            >
                                <ArrowRight className="h-4 w-4 mr-2" />
                                Retake Test
                            </button>
                            <button
                                onClick={() => navigate('/')}
                                className="bg-white text-orange-700 px-3 sm:px-4 py-2 rounded-md hover:bg-orange-50 transition flex items-center justify-center text-sm sm:text-base"
                            >
                                <Home className="h-4 w-4 mr-2" />
                                Home
                            </button>
                        </div>
                    </div>
                </div>

                {/* Score Summary */}
                {testData && testData.scores && (
                    <div className="bg-white rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 border shadow-sm">
                        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center">
                            <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-orange-500 mr-3" />
                            Test Score Summary
                        </h2>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                            <div className="bg-orange-50 p-4 sm:p-6 rounded-lg text-center border border-orange-100">
                                <h3 className="font-semibold text-orange-800 text-xs sm:text-sm mb-2">Total Score</h3>
                                <p className="text-2xl sm:text-3xl font-bold text-orange-600">
                                    {testData.scores.score}/{testData.scores.total}
                                </p>
                                <p className="text-orange-700 text-xs sm:text-sm mt-1">
                                    {testData.scores.percentage}%
                                </p>
                            </div>

                            <div className={`bg-${scoreLevel?.color}-50 p-4 sm:p-6 rounded-lg text-center border border-${scoreLevel?.color}-100`}>
                                <h3 className={`font-semibold text-${scoreLevel?.color}-800 text-xs sm:text-sm mb-2`}>Performance Level</h3>
                                <p className={`text-sm sm:text-lg font-bold text-${scoreLevel?.color}-600`}>
                                    {scoreLevel?.level}
                                </p>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                                    <div
                                        className={`bg-${scoreLevel?.color}-500 h-2 rounded-full transition-all duration-500`}
                                        style={{ width: `${testData.scores.percentage}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="bg-blue-50 p-4 sm:p-6 rounded-lg text-center border border-blue-100">
                                <h3 className="font-semibold text-blue-800 text-xs sm:text-sm mb-2">Questions Completed</h3>
                                <p className="text-2xl sm:text-3xl font-bold text-blue-600">{testData.scores.total}</p>
                                <p className="text-blue-700 text-xs sm:text-sm mt-1">All answered</p>
                            </div>

                            <div className="bg-purple-50 p-4 sm:p-6 rounded-lg text-center border border-purple-100">
                                <h3 className="font-semibold text-purple-800 text-xs sm:text-sm mb-2">Test Areas</h3>
                                <p className="text-sm sm:text-lg font-bold text-purple-600">5 Areas</p>
                                <p className="text-purple-700 text-xs sm:text-sm mt-1">Comprehensive</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Report Content */}
                <div className="bg-white rounded-xl p-4 sm:p-8 shadow-sm border">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center">
                            <Target className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600 mr-3" />
                            Detailed Aptitude Analysis
                        </h2>
                        <div className="flex items-center text-gray-500 text-xs sm:text-sm">
                            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                            {testData && testData.timestamp && formatDate(testData.timestamp)}
                        </div>
                    </div>

                    {testData && testData.report ? (
                        formatReportContent(testData.report)
                    ) : (
                        <p className="text-gray-500 text-center py-8 sm:py-12 text-sm sm:text-base">
                            No report content available.
                        </p>
                    )}
                </div>

                {/* Footer */}
                <div className="text-center mt-6 sm:mt-8">
                    <p className="text-gray-500 text-xs sm:text-sm px-4">
                        This aptitude analysis assesses cognitive abilities and is intended as guidance for academic and career planning.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SavedAptitudeTest;