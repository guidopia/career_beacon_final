import React, { useState, useEffect, useRef } from 'react';

/** Match backend MCQ letters; compare keys case-insensitively (cached / API quirks). */
function normalizeAnswerKey(raw, options) {
    const s = String(raw ?? '').trim();
    if (!s) return '';
    const upper = s.toUpperCase();
    if (/^[ABCD]$/.test(upper)) return upper;
    if (options && typeof options === 'object') {
        for (const k of Object.keys(options)) {
            if (String(k).toUpperCase() === upper) {
                const ku = String(k).toUpperCase();
                if (/^[ABCD]$/.test(ku)) return ku;
            }
        }
    }
    const stripped = upper.replace(/[^ABCD]/g, '');
    if (stripped.length > 0 && /^[ABCD]$/.test(stripped[0])) return stripped[0];
    const c = upper.charAt(0);
    return /^[ABCD]$/.test(c) ? c : '';
}

const AdaptiveQuiz = ({ questions, chapterName, onComplete }) => {
    // Quiz state
    const [currentLevel, setCurrentLevel] = useState(1);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [questionsAskedInLevel, setQuestionsAskedInLevel] = useState(0);
    const [totalQuestionsAsked, setTotalQuestionsAsked] = useState(0);
    const [levelResults, setLevelResults] = useState({}); // Track results per level
    const [userAnswer, setUserAnswer] = useState('');
    const [showExplanation, setShowExplanation] = useState(false);
    const [quizComplete, setQuizComplete] = useState(false);
    const [quizResults, setQuizResults] = useState(null);
    const [startTime] = useState(Date.now());
    /** Latest selected option key — always in sync (avoids submit before state flush). */
    const selectedAnswerRef = useRef('');

    // Get current question
    const getCurrentQuestion = () => {
        const levelData = questions.levels.find(level => level.level === currentLevel);
        if (!levelData || !levelData.questions[currentQuestionIndex]) {
            return null;
        }
        return levelData.questions[currentQuestionIndex];
    };

    const currentQuestion = getCurrentQuestion();

    const correctLetterForUi = currentQuestion
        ? normalizeAnswerKey(currentQuestion.correctAnswer, currentQuestion.options)
        : '';
    const userLetterForUi =
        currentQuestion && userAnswer
            ? normalizeAnswerKey(userAnswer, currentQuestion.options)
            : '';

    // Initialize level results
    useEffect(() => {
        const initialResults = {};
        for (let i = 1; i <= 5; i++) {
            initialResults[i] = {
                questionsAsked: 0,
                correctAnswers: 0,
                wrongAnswers: 0,
                completed: false,
                failed: false
            };
        }
        setLevelResults(initialResults);
    }, []);

    // New question: clear selection so nothing leaks across questions
    useEffect(() => {
        selectedAnswerRef.current = '';
        setUserAnswer('');
    }, [currentLevel, currentQuestionIndex]);

    // Handle answer selection
    const handleAnswerSelect = (selectedAnswer) => {
        if (showExplanation || !currentQuestion) return;
        selectedAnswerRef.current = selectedAnswer;
        setUserAnswer(selectedAnswer);
    };

    // Submit answer and show explanation
    const handleSubmitAnswer = () => {
        if (!currentQuestion) return;
        const choiceRaw = selectedAnswerRef.current || userAnswer;
        if (!choiceRaw) return;

        const userLetter = normalizeAnswerKey(choiceRaw, currentQuestion.options);
        const correctLetter = normalizeAnswerKey(currentQuestion.correctAnswer, currentQuestion.options);
        const isCorrect = userLetter !== '' && userLetter === correctLetter;

        // Update level results
        setLevelResults(prev => ({
            ...prev,
            [currentLevel]: {
                ...prev[currentLevel],
                questionsAsked: prev[currentLevel].questionsAsked + 1,
                correctAnswers: prev[currentLevel].correctAnswers + (isCorrect ? 1 : 0),
                wrongAnswers: prev[currentLevel].wrongAnswers + (isCorrect ? 0 : 1)
            }
        }));

        setQuestionsAskedInLevel(prev => prev + 1);
        setTotalQuestionsAsked(prev => prev + 1);
        setShowExplanation(true);
    };

    // Continue to next question or apply adaptive logic
    const handleContinue = () => {
        setShowExplanation(false);
        setUserAnswer('');
        selectedAnswerRef.current = '';

        // Apply adaptive logic
        applyAdaptiveLogic();
    };

    // Core adaptive logic
    const applyAdaptiveLogic = () => {
        const currentLevelResult = levelResults[currentLevel];
        const questionsAsked = currentLevelResult.questionsAsked;
        const correctAnswers = currentLevelResult.correctAnswers;
        const wrongAnswers = currentLevelResult.wrongAnswers;

        

        // Check if level should fail (3+ wrong answers)
        if (wrongAnswers >= 3) {
           
            failQuiz(currentLevel - 1);
            return;
        }

        // Check if we've asked 2 questions
        if (questionsAsked >= 2) {
            if (correctAnswers === 2) {
                // Both correct - move to next level
                completeLevel();
                return;
            } else if (wrongAnswers === 2) {
                // Both wrong - ask 2 more questions
                if (questionsAsked >= 4) {
                    // Already asked 4 questions, check if still failing
                    failQuiz(currentLevel - 1);
                    return;
                }
                // Continue with more questions in same level
                moveToNextQuestion();
                return;
            }
        }

        // Continue with next question in same level
        moveToNextQuestion();
    };

    // Move to next question in same level
    const moveToNextQuestion = () => {
        const levelData = questions.levels.find(level => level.level === currentLevel);
        if (currentQuestionIndex + 1 < levelData.questions.length) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            // No more questions in this level - this shouldn't happen with proper logic
            failQuiz(currentLevel - 1);
        }
    };

    // Complete current level and move to next
    const completeLevel = () => {

        // Mark current level as completed
        setLevelResults(prev => ({
            ...prev,
            [currentLevel]: {
                ...prev[currentLevel],
                completed: true
            }
        }));

        // Check if all levels completed
        if (currentLevel === 5) {
            completeQuiz();
            return;
        }

        // Move to next level
        setCurrentLevel(prev => prev + 1);
        setCurrentQuestionIndex(0);
        setQuestionsAskedInLevel(0);
    };

    // Complete entire quiz successfully
    const completeQuiz = () => {
        const endTime = Date.now();
        const timeSpent = Math.round((endTime - startTime) / 1000 / 60); // minutes

        const totalCorrect = Object.values(levelResults).reduce((sum, level) => {
            return sum + level.correctAnswers;
        }, 0);

        const results = {
            success: true,
            levelsCleared: 5,
            totalCorrect: totalCorrect,
            totalQuestions: totalQuestionsAsked,
            timeSpent: timeSpent,
            message: "🎉 Congratulations! You've successfully completed all 5 levels!"
        };

        setQuizResults(results);
        setQuizComplete(true);

        // Call parent completion handler
        setTimeout(() => {
            onComplete(results);
        }, 2000);
    };

    // Fail quiz
    const failQuiz = (levelsCleared) => {
        const endTime = Date.now();
        const timeSpent = Math.round((endTime - startTime) / 1000 / 60); // minutes

        const totalCorrect = Object.values(levelResults).reduce((sum, level) => {
            return sum + level.correctAnswers;
        }, 0);

        const results = {
            success: false,
            levelsCleared: levelsCleared,
            totalCorrect: totalCorrect,
            totalQuestions: totalQuestionsAsked,
            timeSpent: timeSpent,
            message: `📚 You need to revise this chapter before proceeding. You cleared ${levelsCleared} out of 5 levels.`
        };

        setQuizResults(results);
        setQuizComplete(true);

        // Call parent completion handler
        setTimeout(() => {
            onComplete(results);
        }, 3000);
    };

    // Get total questions asked so far
    const getTotalQuestionsAsked = () => {
        return totalQuestionsAsked;
    };

    // Get progress percentage
    const getProgressPercentage = () => {
        // Progress is based on levels completed + partial progress in current level
        const completedLevels = currentLevel - 1;
        const progressFromCompletedLevels = (completedLevels / 5) * 100;

        // Add partial progress for current level (each level can have max 4 questions)
        const currentLevelProgress = Math.min(questionsAskedInLevel / 4, 1) * (100 / 5);

        return Math.min(progressFromCompletedLevels + currentLevelProgress, 100);
    };

    // Quiz completion screen
    if (quizComplete && quizResults) {
        return (
            <div className="text-center mt-40 py-8 px-4 sm:py-12">
                <div className={`mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mb-6 ${quizResults.success ? 'bg-green-500/20 border border-green-500/30' : 'bg-orange-500/20 border border-orange-500/30'
                    }`}>
                    <span className="text-2xl sm:text-3xl">
                        {quizResults.success ? '🎉' : '📚'}
                    </span>
                </div>

                <h2 className={`text-xl sm:text-2xl font-bold mb-4 ${quizResults.success ? 'text-green-400' : 'text-orange-400'
                    }`}>
                    {quizResults.success ? 'Quiz Completed!' : 'Quiz Incomplete'}
                </h2>

                <p className="text-gray-300 mb-6 max-w-md mx-auto text-sm sm:text-base px-4">
                    {quizResults.message}
                </p>

                <div className="bg-gray-950 rounded-xl shadow-lg p-4 sm:p-6 max-w-sm mx-auto border border-gray-700">
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm sm:text-base">
                            <span className="text-gray-400">Levels Cleared:</span>
                            <span className="font-semibold text-white">{quizResults.levelsCleared}/5</span>
                        </div>
                        <div className="flex justify-between text-sm sm:text-base">
                            <span className="text-gray-400">Correct Answers:</span>
                            <span className="font-semibold text-white">{quizResults.totalCorrect}/{quizResults.totalQuestions}</span>
                        </div>
                        <div className="flex justify-between text-sm sm:text-base">
                            <span className="text-gray-400">Time Spent:</span>
                            <span className="font-semibold text-white">{quizResults.timeSpent}m</span>
                        </div>
                        <div className="flex justify-between text-sm sm:text-base">
                            <span className="text-gray-400">Accuracy:</span>
                            <span className="font-semibold text-white">
                                {quizResults.totalQuestions > 0 ? Math.round((quizResults.totalCorrect / quizResults.totalQuestions) * 100) : 0}%
                            </span>
                        </div>
                    </div>
                </div>

                <p className="text-xs sm:text-sm text-gray-500 mt-6">
                    Redirecting to syllabus...
                </p>
            </div>
        );
    }

    // Loading state
    if (!currentQuestion) {
        return (
            <div className="text-center py-8 px-4 sm:py-12">
                <div className="w-8 h-8 border-2 border-gray-700 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-400 text-sm sm:text-base">Loading question...</p>
            </div>
        );
    }

    // Main quiz interface
    return (
        <div className="max-w-5xl mx-auto px-4">
            {/* Compact Progress Header */}
            <div className="bg-gray-950 rounded-xl shadow-lg p-4 sm:p-5 mb-4 sm:mb-5 border border-gray-700">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 space-y-2 sm:space-y-0">
                    <div>
                        <h2 className="text-base sm:text-lg font-bold text-white">
                            Level {currentLevel} - {questions.levels.find(l => l.level === currentLevel)?.difficulty}
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-400">
                            Question {totalQuestionsAsked + 1} overall • Question {questionsAskedInLevel + 1} in this level
                        </p>
                    </div>
                    <div className="text-left sm:text-right">
                        <p className="text-xs sm:text-sm text-gray-500">Overall Progress</p>
                        <p className="text-base sm:text-lg font-semibold text-blue-400">
                            {Math.round(getProgressPercentage())}%
                        </p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getProgressPercentage()}%` }}
                    ></div>
                </div>
            </div>

            {/* Enhanced Question Card */}
            <div className="bg-gray-950 rounded-xl shadow-lg p-4 sm:p-6 border border-gray-700">
                <div className="mb-4 sm:mb-5">
                    <div className="flex items-center mb-3 sm:mb-4">
                        <span className="bg-blue-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                            Question {totalQuestionsAsked + 1}
                        </span>
                    </div>
                    <h3 className="text-lg sm:text-xl text-white leading-relaxed">
                        {currentQuestion.question}
                    </h3>
                </div>

                {/* Answer Options */}
                <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-5">
                    {Object.entries(currentQuestion.options).map(([key, value]) => {
                        const keyNorm = normalizeAnswerKey(key, currentQuestion.options);
                        const isThisCorrect = keyNorm !== '' && keyNorm === correctLetterForUi;
                        const isThisUserPick =
                            userLetterForUi !== '' && keyNorm === userLetterForUi;
                        return (
                        <button
                            key={key}
                            onClick={() => handleAnswerSelect(key)}
                            disabled={showExplanation}
                            className={`w-full text-left p-3 sm:p-4 rounded-lg border transition-colors text-sm sm:text-base ${showExplanation
                                ? isThisCorrect
                                    ? 'bg-green-500/20 border-green-500/30 text-green-300'
                                    : isThisUserPick && !isThisCorrect
                                        ? 'bg-red-500/20 border-red-500/30 text-red-300'
                                        : 'bg-gray-900 border-gray-700 text-gray-400'
                                : userLetterForUi !== '' && keyNorm === userLetterForUi
                                    ? 'bg-blue-500/20 border-blue-500/30 text-blue-300'
                                    : 'bg-gray-900 border-gray-700 text-gray-200 hover:bg-gray-800'
                                }`}
                        >
                            <span className="font-medium mr-2 sm:mr-3">{key}.</span>
                            {value}
                            {showExplanation && isThisCorrect && (
                                <span className="ml-2 text-green-400">✓</span>
                            )}
                            {showExplanation && isThisUserPick && !isThisCorrect && (
                                <span className="ml-2 text-red-400">✗</span>
                            )}
                        </button>
                    );
                    })}
                </div>

                {/* Explanation */}
                {showExplanation && (
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 sm:p-4 mb-4 sm:mb-5">
                        <h4 className="font-semibold text-blue-400 mb-2 text-sm sm:text-base">Explanation:</h4>
                        <p className="text-blue-200 text-sm sm:text-base">
                            {currentQuestion.explanation}
                        </p>
                    </div>
                )}

                {/* Action Button and Level Progress Combined */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
                    <div className="flex items-center justify-center sm:justify-start">
                        {/* Enhanced Level Progress Indicator */}
                        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3">
                            <span className="text-xs sm:text-sm text-gray-400 font-medium">Level Progress:</span>
                            <div className="flex space-x-1 sm:space-x-2">
                                {Array.from({ length: 5 }, (_, i) => (
                                    <div
                                        key={i + 1}
                                        className={`w-6 h-6 sm:w-4 sm:h-4 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${i + 1 < currentLevel
                                            ? 'bg-green-500 text-white'
                                            : i + 1 === currentLevel
                                                ? 'bg-blue-500 text-white animate-pulse'
                                                : 'bg-gray-600 text-gray-400'
                                            }`}
                                    >
                                        {i + 1 < currentLevel ? '✓' : i + 1}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex justify-center sm:justify-end">
                        {!showExplanation ? (
                            <button
                                onClick={handleSubmitAnswer}
                                disabled={!(selectedAnswerRef.current || userAnswer)}
                                className={`px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold transition-all duration-200 text-sm sm:text-base ${selectedAnswerRef.current || userAnswer
                                    ? 'bg-white text-black hover:bg-gray-100 shadow-lg hover:shadow-xl transform hover:scale-105'
                                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                Submit Answer
                            </button>
                        ) : (
                            <button
                                onClick={handleContinue}
                                className="px-6 sm:px-8 py-2 sm:py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
                            >
                                Continue
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdaptiveQuiz;