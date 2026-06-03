import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    generatePersonalityReport,
    generateAptitudeReport,
    generateIntelligenceReport,
    getQuickPersonalityAnalysis,
    getQuickAptitudeAnalysis,
    getQuickIntelligenceAnalysis
} from '../services/independentTests';
import { Download, Home, Brain, Target, Lightbulb, CheckCircle, TrendingUp, Clock } from 'lucide-react';
import personalityQuestions from '../data/personalityQuestions';
import aptitudeQuestions from '../data/aptitudeQuestions';
import intelligenceQuestions from '../data/intelligenceQuestions';

const IndependentTestReport = () => {
    const navigate = useNavigate();
    const [reportContent, setReportContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [testData, setTestData] = useState(null);
    const [quickAnalysis, setQuickAnalysis] = useState(null);

    useEffect(() => {
        // Get test answers from sessionStorage
        const answers = JSON.parse(sessionStorage.getItem('independentTestAnswers') || 'null');
        const testType = sessionStorage.getItem('independentTestType');

        if (answers && testType) {
            const questions = getQuestionsForTestType(testType);
            setTestData({ answers, type: testType, questions });

            // Generate quick analysis immediately
            generateQuickAnalysis(answers, testType, questions);

            // Auto-generate AI report
            generateAIReport(answers, testType, questions);
        } else {
            setError('No test data found. Please complete a test first.');
            setTimeout(() => navigate('/'), 3000);
        }
    }, [navigate]);

    const getQuestionsForTestType = (testType) => {
        switch (testType) {
            case 'personality': return personalityQuestions;
            case 'aptitude': return aptitudeQuestions;
            case 'intelligence': return intelligenceQuestions;
            default: return [];
        }
    };

    const generateQuickAnalysis = (answers, testType, questions) => {
        try {
            let analysis;
            switch (testType) {
                case 'personality':
                    analysis = getQuickPersonalityAnalysis(answers, questions);
                    break;
                case 'aptitude':
                    analysis = getQuickAptitudeAnalysis(answers, questions);
                    break;
                case 'intelligence':
                    analysis = getQuickIntelligenceAnalysis(answers, questions);
                    break;
                default:
                    return;
            }
            setQuickAnalysis(analysis);
        } catch (err) {
            // Silent error handling
        }
    };

    const generateAIReport = async (answers, testType, questions) => {
        setLoading(true);
        setError('');

        try {
            let reportResult;

            switch (testType) {
                case 'personality':
                    reportResult = await generatePersonalityReport(answers, questions);
                    break;
                case 'aptitude':
                    reportResult = await generateAptitudeReport(answers, questions);
                    break;
                case 'intelligence':
                    reportResult = await generateIntelligenceReport(answers, questions);
                    break;
                default:
                    throw new Error('Invalid test type');
            }

            setReportContent(reportResult);
        } catch (err) {
            setError(err.message || 'An error occurred while generating the report. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getTestConfig = (testType) => {
        switch (testType) {
            case 'personality':
                return {
                    title: 'Personality Profile',
                    icon: Brain,
                    color: 'emerald',
                    description: 'Based on Big 5 personality traits',
                    savedRoute: '/saved-personality-test'
                };
            case 'aptitude':
                return {
                    title: 'Aptitude Analysis',
                    icon: Target,
                    color: 'orange',
                    description: 'Cognitive abilities assessment',
                    savedRoute: '/saved-aptitude-test'
                };
            case 'intelligence':
                return {
                    title: 'Intelligence Profile',
                    icon: Lightbulb,
                    color: 'pink',
                    description: 'Multiple intelligence analysis',
                    savedRoute: '/saved-intelligence-test'
                };
            default:
                return {
                    title: 'Test Report',
                    icon: Brain,
                    color: 'blue',
                    description: 'Assessment results',
                    savedRoute: '/'
                };
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
                const accentColor = getTestAccentColor(testData?.type);

                return (
                    <div key={index} className="mb-4 p-3 sm:p-4 bg-gray-50 rounded-lg border-l-3" style={{ borderLeftColor: accentColor }}>
                        <h4 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">
                            {jobTitle.trim()}
                        </h4>
                        <p className="text-gray-600 leading-relaxed text-xs sm:text-sm">{description.trim()}</p>
                    </div>
                );
            }

            // Check if it's a bulleted item (starts with -, •, or similar)
            if (/^[-•*]\s/.test(trimmedParagraph)) {
                const bulletContent = trimmedParagraph.replace(/^[-•*]\s/, '').trim();
                const bulletMatch = bulletContent.match(/^([^:]+):\s*(.+)$/);
                const accentColor = getTestAccentColor(testData?.type);

                if (bulletMatch) {
                    const [, title, desc] = bulletMatch;
                    return (
                        <div key={index} className="mb-3 pl-3 sm:pl-4 border-l-2" style={{ borderLeftColor: accentColor }}>
                            <span className="font-medium text-gray-800 text-sm sm:text-base">{title.trim()}:</span>
                            <span className="text-gray-600 ml-1 text-sm sm:text-base">{desc.trim()}</span>
                        </div>
                    );
                } else {
                    return (
                        <div key={index} className="mb-2 pl-3 sm:pl-4 border-l-2" style={{ borderLeftColor: accentColor }}>
                            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{bulletContent}</p>
                        </div>
                    );
                }
            }

            // Regular paragraph
            return (
                <p key={index} className="text-gray-700 leading-relaxed mb-3 text-sm sm:text-base">
                    {trimmedParagraph}
                </p>
            );
        }).filter(item => item !== null);
    };

    // Helper function to get accent color for each test type
    const getTestAccentColor = (testType) => {
        switch (testType) {
            case 'personality': return '#10b981'; // emerald-500
            case 'aptitude': return '#f97316'; // orange-500
            case 'intelligence': return '#ec4899'; // pink-500
            default: return '#6b7280'; // gray-500
        }
    };

    const formatReportContent = (content) => {
        if (!content) return null;

        // Split content into sections
        const sections = content.split('\n\n').filter(section => section.trim());
        let sectionCounter = 0;

        return (
            <div className="space-y-4 sm:space-y-6">
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
                                <div key={index} className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 p-4 sm:p-8">
                                    <div className="flex flex-col sm:flex-row items-start">
                                        <div className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br ${getAccentGradient(testData?.type)} text-white font-bold text-base sm:text-lg mb-4 sm:mb-0 sm:mr-6 shadow-sm flex-shrink-0`}>
                                            {number}
                                        </div>
                                        <div className="flex-1 w-full">
                                            <h3 className="text-lg sm:text-xl font-bold text-gray-800 leading-tight mb-2">{title}</h3>
                                            <div className={`w-12 sm:w-16 h-1 bg-gradient-to-r ${getAccentGradient(testData?.type)} rounded-full mb-4`}></div>
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
                    const personalitySections = [
                        'Your Personality Profile',
                        'Your Strengths & Natural Abilities',
                        'Career Paths That Match Your Personality',
                        'Personal Development Recommendations'
                    ];

                    const aptitudeSections = [
                        'Your Cognitive Abilities Assessment',
                        'Detailed Performance Analysis',
                        'Academic & Career Recommendations',
                        'Improvement Strategy'
                    ];

                    const intelligenceSections = [
                        'Your Intelligence Profile',
                        'Your Natural Learning Style',
                        'Career & Activity Recommendations',
                        'Development Plan for Your Intelligences'
                    ];

                    // Check if this section matches any of the expected main sections
                    let isMainSection = false;
                    let expectedSections = [];

                    if (testData?.type === 'personality') {
                        expectedSections = personalitySections;
                    } else if (testData?.type === 'aptitude') {
                        expectedSections = aptitudeSections;
                    } else if (testData?.type === 'intelligence') {
                        expectedSections = intelligenceSections;
                    }

                    // STRICT CHECK: Only exact matches for main sections
                    for (let expectedTitle of expectedSections) {
                        if (trimmedSection.startsWith(expectedTitle)) {
                            // For personality tests, be extra strict - must be EXACTLY these titles
                            if (testData?.type === 'personality') {
                                // Extract just the first line to check if it's exactly the expected title
                                const firstLine = trimmedSection.split('\n')[0].trim();
                                if (firstLine === expectedTitle) {
                                    isMainSection = true;
                                    break;
                                }
                            } else {
                                // For aptitude and intelligence, use the existing logic
                                isMainSection = true;
                                break;
                            }
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
                            <div key={index} className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 p-4 sm:p-8">
                                <div className="flex flex-col sm:flex-row items-start">
                                    <div className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br ${getAccentGradient(testData?.type)} text-white font-bold text-base sm:text-lg mb-4 sm:mb-0 sm:mr-6 shadow-sm flex-shrink-0`}>
                                        {sectionCounter}
                                    </div>
                                    <div className="flex-1 w-full">
                                        <h3 className="text-lg sm:text-xl font-bold text-gray-800 leading-tight mb-2">{title}</h3>
                                        <div className={`w-12 sm:w-16 h-1 bg-gradient-to-r ${getAccentGradient(testData?.type)} rounded-full mb-4`}></div>
                                        <div className="text-gray-700 leading-relaxed whitespace-pre-line prose prose-gray max-w-none text-sm sm:text-base">
                                            {cleanupContent(body)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    }

                    // Regular content - also improved styling
                    return (
                        <div key={index} className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                            <div className="space-y-2">
                                {formatContentText(trimmedSection)}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    const getGradientColors = (testType) => {
        switch (testType) {
            case 'personality': return 'from-emerald-500 to-emerald-600';
            case 'aptitude': return 'from-orange-500 to-orange-600';
            case 'intelligence': return 'from-pink-500 to-pink-600';
            default: return 'from-blue-500 to-blue-600';
        }
    };

    const getAccentGradient = (testType) => {
        switch (testType) {
            case 'personality': return 'from-emerald-500 to-emerald-600';
            case 'aptitude': return 'from-orange-500 to-orange-600';
            case 'intelligence': return 'from-pink-500 to-pink-600';
            default: return 'from-blue-500 to-blue-600';
        }
    };

    const getColorClasses = (testType) => {
        switch (testType) {
            case 'personality': return { bg: 'emerald', text: 'emerald' };
            case 'aptitude': return { bg: 'orange', text: 'orange' };
            case 'intelligence': return { bg: 'pink', text: 'pink' };
            default: return { bg: 'blue', text: 'blue' };
        }
    };

    if (!testData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="text-center">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-4">Loading test data...</h2>
                </div>
            </div>
        );
    }

    const config = getTestConfig(testData.type);
    const colors = getColorClasses(testData.type);
    const IconComponent = config.icon;

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                    <div className="text-center">
                        <div className={`inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-${colors.bg}-100 rounded-full mb-6`}>
                            <IconComponent className={`h-8 w-8 sm:h-10 sm:w-10 text-${colors.text}-600`} />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">Generating Your {config.title}</h1>
                        <p className="text-gray-600 mb-8 text-sm sm:text-base px-4">Our AI is analyzing your responses to create personalized insights...</p>

                        <div className="bg-white rounded-lg p-6 sm:p-8 shadow-sm border max-w-md mx-auto">
                            <div className={`w-10 h-10 sm:w-12 sm:h-12 border-4 border-${colors.text}-500 border-t-transparent rounded-full animate-spin mb-4 mx-auto`}></div>
                            <p className="text-gray-600 text-sm sm:text-base">Processing your {testData.questions.length} responses</p>

                            {quickAnalysis && (
                                <div className="mt-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
                                    <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Quick Insight</h3>
                                    <p className="text-xs sm:text-sm text-gray-600">{quickAnalysis.analysis}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                    <div className="text-center">
                        <div className="bg-white border border-red-100 text-red-600 p-6 sm:p-8 rounded-lg shadow-xl max-w-lg mx-auto">
                            <svg className="h-12 w-12 sm:h-16 sm:w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h2 className="text-lg sm:text-xl font-semibold mb-4">Something went wrong</h2>
                            <p className="mb-6 text-sm sm:text-base">{error}</p>
                            <button
                                onClick={() => navigate('/')}
                                className="bg-red-600 text-white px-4 sm:px-6 py-2 rounded-md hover:bg-red-700 transition text-sm sm:text-base"
                            >
                                Return Home
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Report display
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                {/* Header */}
                <div className={`bg-gradient-to-r ${getGradientColors(testData.type)} rounded-lg sm:rounded-xl p-6 sm:p-8 mb-6 sm:mb-8 text-white`}>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center w-full sm:w-auto">
                            <div className="bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-0 sm:mr-6">
                                <IconComponent className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold mb-2">Your {config.title}</h1>
                                <p className="text-white/90 text-sm sm:text-base">{config.description}</p>
                            </div>
                        </div>
                        <div className="flex space-x-3 w-full sm:w-auto">
                            <button
                                onClick={() => navigate('/career-selection')}
                                className="bg-white text-gray-800 px-3 sm:px-4 py-2 rounded-md hover:bg-gray-100 transition flex items-center text-sm sm:text-base flex-1 sm:flex-none justify-center cursor-pointer"
                            >
                                <Home className="h-4 w-4 mr-2" />
                                Home
                            </button>
                        </div>
                    </div>
                </div>

                {/* Quick Analysis Summary */}
                {quickAnalysis && (
                    <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 border shadow-sm">
                        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center">
                            <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-500 mr-3" />
                            Quick Analysis Summary
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                                <h3 className="font-semibold text-gray-700 mb-2 text-sm sm:text-base">Test Completed</h3>
                                <p className={`text-xl sm:text-2xl font-bold text-${colors.text}-600`}>{testData.questions.length} Questions</p>
                            </div>
                            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                                <h3 className="font-semibold text-gray-700 mb-2 text-sm sm:text-base">Analysis Ready</h3>
                                <p className="text-xl sm:text-2xl font-bold text-green-600">✓ Complete</p>
                            </div>
                            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                                <h3 className="font-semibold text-gray-700 mb-2 text-sm sm:text-base">Generated</h3>
                                <p className="text-xl sm:text-2xl font-bold text-blue-600">{new Date().toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="mt-4 p-3 sm:p-4 bg-blue-50 rounded-lg">
                            <p className="text-gray-700 text-sm sm:text-base">{quickAnalysis.analysis}</p>
                        </div>
                    </div>
                )}

                {/* Personality Trait Summary - Only for Personality Tests */}
                {testData?.type === 'personality' && quickAnalysis?.scores && (
                    <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 border shadow-sm">
                        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center">
                            <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-500 mr-3" />
                            Personality Trait Summary
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                            {Object.entries(quickAnalysis.scores).map(([trait, score]) => (
                                <div key={trait} className="bg-emerald-50 p-3 sm:p-4 rounded-lg text-center border border-emerald-100">
                                    <h3 className="font-semibold text-emerald-800 text-xs sm:text-sm mb-1 capitalize">
                                        {trait.replace(/([A-Z])/g, ' $1').trim()}
                                    </h3>
                                    <p className="text-xl sm:text-2xl font-bold text-emerald-600">{score}</p>
                                    <div className="w-full bg-emerald-200 rounded-full h-2 mt-2">
                                        <div
                                            className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${Math.min((score / 15) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Aptitude Score Summary - Only for Aptitude Tests */}
                {testData?.type === 'aptitude' && quickAnalysis?.score !== undefined && (
                    <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 border shadow-sm">
                        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center">
                            <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-orange-500 mr-3" />
                            Aptitude Test Score
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                            <div className="bg-orange-50 p-4 sm:p-6 rounded-lg text-center border border-orange-100">
                                <h3 className="font-semibold text-orange-800 text-xs sm:text-sm mb-2">Total Score</h3>
                                <p className="text-2xl sm:text-3xl font-bold text-orange-600">
                                    {quickAnalysis.score}/{quickAnalysis.total}
                                </p>
                                <p className="text-orange-700 text-xs sm:text-sm mt-1">
                                    {quickAnalysis.percentage}%
                                </p>
                            </div>

                            <div className="bg-blue-50 p-4 sm:p-6 rounded-lg text-center border border-blue-100">
                                <h3 className="font-semibold text-blue-800 text-xs sm:text-sm mb-2">Performance Level</h3>
                                <p className="text-base sm:text-lg font-bold text-blue-600">
                                    {quickAnalysis.percentage >= 85 ? 'Excellent' :
                                        quickAnalysis.percentage >= 65 ? 'Good' :
                                            quickAnalysis.percentage >= 45 ? 'Average' : 'Needs Improvement'}
                                </p>
                            </div>

                            <div className="bg-purple-50 p-4 sm:p-6 rounded-lg text-center border border-purple-100">
                                <h3 className="font-semibold text-purple-800 text-xs sm:text-sm mb-2">Correct Answers</h3>
                                <p className="text-2xl sm:text-3xl font-bold text-purple-600">{quickAnalysis.score}</p>
                                <p className="text-purple-700 text-xs sm:text-sm mt-1">out of {quickAnalysis.total}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Intelligence Types Summary - Only for Intelligence Tests */}
                {testData?.type === 'intelligence' && quickAnalysis?.scores && (
                    <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 border shadow-sm">
                        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center">
                            <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-pink-500 mr-3" />
                            Intelligence Types Summary
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                            {Object.entries(quickAnalysis.scores)
                                .sort(([, a], [, b]) => b - a)
                                .map(([type, score]) => (
                                    <div key={type} className="bg-pink-50 p-3 sm:p-4 rounded-lg text-center border border-pink-100">
                                        <h3 className="font-semibold text-pink-800 text-xs mb-1">
                                            {type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                        </h3>
                                        <p className="text-lg sm:text-xl font-bold text-pink-600">{score}</p>
                                        <div className="w-full bg-pink-200 rounded-full h-2 mt-2">
                                            <div
                                                className="bg-pink-500 h-2 rounded-full transition-all duration-500"
                                                style={{ width: `${Math.min((score / 15) * 100, 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                        <div className="mt-4 p-3 sm:p-4 bg-gradient-to-r from-pink-100 to-rose-100 rounded-lg">
                            <h3 className="font-semibold text-pink-800 mb-2 text-sm sm:text-base">Your Top 3 Intelligence Types</h3>
                            <div className="flex flex-wrap gap-2">
                                {Object.entries(quickAnalysis.scores)
                                    .sort(([, a], [, b]) => b - a)
                                    .slice(0, 3)
                                    .map(([type, score]) => (
                                        <span key={type} className="bg-pink-200 text-pink-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                                            {type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} ({score})
                                        </span>
                                    ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Full AI Report */}
                <div className="bg-white rounded-lg sm:rounded-xl p-6 sm:p-8 shadow-sm border">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 flex items-center">
                        <IconComponent className={`h-5 w-5 sm:h-6 sm:w-6 text-${colors.text}-600 mr-3`} />
                        Detailed {config.title} Report
                    </h2>
                    {formatReportContent(reportContent)}
                </div>

                {/* Footer */}
                <div className="text-center mt-6 sm:mt-8">
                    <p className="text-gray-500 text-xs sm:text-sm px-4">
                        Report generated on {new Date().toLocaleDateString()} •
                        This analysis is based on your test responses and is intended as guidance.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default IndependentTestReport;