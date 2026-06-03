import React from 'react';
import { getStatusConfig } from '../utils/helpers';
import { CHAPTER_STATUS } from '../utils/constants';

const GoalCard = ({ chapter, onStartGoal, onRevision }) => {
    // Get status configuration for styling
    const statusConfig = getStatusConfig(chapter.status);

    // Calculate progress percentage for levels cleared
    const progressPercentage = (chapter.levelsCleared / 5) * 100;

    // Format time spent
    const formatTimeSpent = (minutes) => {
        if (!minutes || minutes === 0) return '0m';
        if (minutes < 60) return `${minutes}m`;
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    };

    // Get button states based on chapter status
    const getButtonConfig = () => {
        switch (chapter.status) {
            case CHAPTER_STATUS.NOT_STARTED:
                return {
                    primaryButton: { text: 'Start Goal', action: onStartGoal, style: 'primary' },
                    secondaryButton: { text: 'Revise Chapter', action: onRevision, style: 'secondary' }
                };
            case CHAPTER_STATUS.IN_PROGRESS:
                return {
                    primaryButton: { text: 'Continue Goal', action: onStartGoal, style: 'primary' },
                    secondaryButton: { text: 'Revise Chapter', action: onRevision, style: 'secondary' }
                };
            case CHAPTER_STATUS.COMPLETED:
                return {
                    primaryButton: { text: 'Retake Goal', action: onStartGoal, style: 'success' },
                    secondaryButton: { text: 'Review Chapter', action: onRevision, style: 'secondary' }
                };
            case CHAPTER_STATUS.FAILED:
                return {
                    primaryButton: { text: 'Retry Goal', action: onStartGoal, style: 'danger' },
                    secondaryButton: { text: 'Revise Chapter', action: onRevision, style: 'primary' }
                };
            default:
                return {
                    primaryButton: { text: 'Start Goal', action: onStartGoal, style: 'primary' },
                    secondaryButton: { text: 'Revise Chapter', action: onRevision, style: 'secondary' }
                };
        }
    };

    const { primaryButton, secondaryButton } = getButtonConfig();

    // Enhanced button styling with premium Google-like design
    const getButtonStyles = (style) => {
        const baseStyles = "px-6 py-3 rounded-lg font-semibold transition-all duration-200 text-sm shadow-lg hover:shadow-xl transform hover:scale-105";

        switch (style) {
            case 'primary':
                return `${baseStyles} bg-white text-black hover:bg-gray-100`;
            case 'secondary':
                return `${baseStyles} bg-gray-700 text-gray-200 hover:bg-gray-600 border border-gray-600`;
            case 'success':
                return `${baseStyles} bg-green-600 text-white hover:bg-green-700`;
            case 'danger':
                return `${baseStyles} bg-red-600 text-white hover:bg-red-700`;
            default:
                return `${baseStyles} bg-white text-black hover:bg-gray-100`;
        }
    };

    // Enhanced status styling
    const getStatusStyles = () => {
        switch (chapter.status) {
            case CHAPTER_STATUS.COMPLETED:
                return 'bg-green-600 text-white';
            case CHAPTER_STATUS.FAILED:
                return 'bg-red-600 text-white';
            case CHAPTER_STATUS.IN_PROGRESS:
                return 'bg-blue-600 text-white';
            default:
                return 'bg-gray-600 text-white';
        }
    };

    // Enhanced subject badge styling
    const getSubjectBadgeStyle = () => {
        return 'bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium';
    };

    return (
        <div className="bg-gray-950 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors duration-200">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-white">
                            {chapter.chapterName}
                        </h3>
                        <span className={getSubjectBadgeStyle()}>
                            {chapter.subject}
                        </span>
                    </div>
                    {chapter.description && (
                        <p className="text-sm text-gray-400 leading-relaxed">
                            {chapter.description}
                        </p>
                    )}
                </div>

                {/* Enhanced Status Badge */}
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyles()}`}>
                    {statusConfig.label}
                </div>
            </div>

            {/* Content Grid - Fixed alignment */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Progress Section */}
                <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-white uppercase tracking-wide">Progress</h4>

                    {/* Levels Progress */}
                    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm text-gray-300">Levels Cleared</span>
                            <span className="text-lg font-semibold text-white">
                                {chapter.levelsCleared}/5
                            </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                                className="bg-white h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progressPercentage}%` }}
                            ></div>
                        </div>
                        <div className="text-xs text-gray-400 mt-2">
                            {progressPercentage}% Complete
                        </div>
                    </div>

                    {/* Last Attempted */}
                    {chapter.lastAttempted && (
                        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                            <div className="text-xs text-gray-400 mb-1">Last Attempted</div>
                            <div className="text-sm text-white">
                                {new Date(chapter.lastAttempted).toLocaleDateString()}
                            </div>
                        </div>
                    )}
                </div>

                {/* Details Section - Fixed alignment */}
                <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-white uppercase tracking-wide">Details</h4>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                            <div className="text-xs text-gray-400 mb-1">Difficulty</div>
                            <div className="text-sm font-medium text-white capitalize">
                                {chapter.difficulty}
                            </div>
                        </div>

                        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                            <div className="text-xs text-gray-400 mb-1">Importance</div>
                            <div className={`text-sm font-medium ${chapter.importance === 'High' ? 'text-red-400' :
                                    chapter.importance === 'Medium' ? 'text-yellow-400' :
                                        'text-green-400'
                                }`}>
                                {chapter.importance}
                            </div>
                        </div>

                        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                            <div className="text-xs text-gray-400 mb-1">Time Spent</div>
                            <div className="text-sm font-medium text-white">
                                {formatTimeSpent(chapter.timeSpent)}
                            </div>
                        </div>

                        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                            <div className="text-xs text-gray-400 mb-1">Attempts</div>
                            <div className="text-sm font-medium text-white">
                                {chapter.totalAttempts || 0}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions Section */}
                <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-white uppercase tracking-wide">Actions</h4>

                    <div className="space-y-3">
                        <button
                            onClick={primaryButton.action}
                            className={`w-full ${getButtonStyles(primaryButton.style)}`}
                        >
                            {primaryButton.text}
                        </button>

                        <button
                            onClick={secondaryButton.action}
                            className={`w-full ${getButtonStyles(secondaryButton.style)}`}
                        >
                            {secondaryButton.text}
                        </button>

                        {/* Enhanced Status Indicator - Much more prominent */}
                        {(chapter.status === CHAPTER_STATUS.COMPLETED || chapter.status === CHAPTER_STATUS.FAILED) && (
                            <div className="mt-4">
                                {chapter.status === CHAPTER_STATUS.COMPLETED && (
                                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-center">
                                        <div className="flex items-center justify-center mb-1">
                                            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-2">
                                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <p className="text-sm text-green-400 font-semibold">
                                                All levels completed
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {chapter.status === CHAPTER_STATUS.FAILED && (
                                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-center">
                                        <div className="flex items-center justify-center mb-1">
                                            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mr-2">
                                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.96-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                                                </svg>
                                            </div>
                                            <p className="text-sm text-red-400 font-semibold">
                                                Review before retry
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GoalCard;