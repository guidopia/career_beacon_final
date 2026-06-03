import {
    CHAPTER_STATUS,
    STATUS_CONFIG,
    EXAM_OPTIONS,
    PREP_LEVELS,
    CHAPTER_COUNT_LOGIC
} from './constants.js';


// Parse time string to months
export const parseTimeToMonths = (timeString) => {
    if (!timeString) return 3;

    const lowerTime = timeString.toLowerCase();

    if (lowerTime.includes('week')) {
        const weeks = parseInt(lowerTime.match(/\d+/)?.[0] || '4');
        return Math.max(1, Math.round(weeks / 4));
    } else if (lowerTime.includes('month')) {
        const months = parseInt(lowerTime.match(/\d+/)?.[0] || '3');
        return Math.max(1, months);
    } else if (lowerTime.includes('year')) {
        const years = parseInt(lowerTime.match(/\d+/)?.[0] || '1');
        return years * 12;
    }

    return 3; // Default to 3 months
};

// Parse time string to weeks
export const parseTimeToWeeks = (timeString) => {
    const months = parseTimeToMonths(timeString);
    return months * 4;
};

// Format time duration for display
export const formatTimeDuration = (minutes) => {
    if (minutes < 60) {
        return `${minutes}m`;
    } else if (minutes < 1440) { // Less than 24 hours
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    } else {
        const days = Math.floor(minutes / 1440);
        const remainingHours = Math.floor((minutes % 1440) / 60);
        return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
    }
};

// Get chapter count based on time available
export const getChapterCountByTime = (timeString) => {
    const months = parseTimeToMonths(timeString);

    if (months <= 1) return CHAPTER_COUNT_LOGIC[1]; // 10 chapters
    if (months <= 2) return CHAPTER_COUNT_LOGIC[2]; // 15 chapters
    return CHAPTER_COUNT_LOGIC[3]; // 25 chapters
};


// Get status configuration
export const getStatusConfig = (status) => {
    return STATUS_CONFIG[status] || STATUS_CONFIG[CHAPTER_STATUS.NOT_STARTED];
};

// Get status badge props
export const getStatusBadge = (status) => {
    const config = getStatusConfig(status);
    return {
        text: config.label,
        icon: config.icon,
        className: `${config.bgColor} ${config.textColor}`,
        color: config.color
    };
};

// Check if chapter is completed
export const isChapterCompleted = (chapter) => {
    return chapter.status === CHAPTER_STATUS.COMPLETED;
};

// Check if chapter is failed
export const isChapterFailed = (chapter) => {
    return chapter.status === CHAPTER_STATUS.FAILED;
};

// Check if chapter is in progress
export const isChapterInProgress = (chapter) => {
    return chapter.status === CHAPTER_STATUS.IN_PROGRESS;
};

// Check if chapter is not started
export const isChapterNotStarted = (chapter) => {
    return chapter.status === CHAPTER_STATUS.NOT_STARTED;
};


// Calculate progress percentage
export const calculateProgress = (current, total) => {
    if (total === 0) return 0;
    return Math.round((current / total) * 100);
};

// Get progress bar color based on percentage
export const getProgressBarColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-blue-500';
    if (percentage >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
};

// Format progress text
export const formatProgressText = (current, total, showPercentage = true) => {
    const percentage = calculateProgress(current, total);
    return showPercentage
        ? `${current}/${total} (${percentage}%)`
        : `${current}/${total}`;
};

// Get completion status text
export const getCompletionStatusText = (completedCount, totalCount) => {
    if (completedCount === 0) return 'Not started';
    if (completedCount === totalCount) return 'Completed';
    return 'In progress';
};

// Get exam subjects
export const getExamSubjects = (examName) => {
    const exam = EXAM_OPTIONS.find(exam => exam.value === examName);
    return exam ? exam.subjects : ['Mathematics', 'Physics', 'Chemistry'];
};

// Get subject color
export const getSubjectColor = (subject) => {
    return SUBJECT_COLORS[subject] || 'gray';
};

// Get subject color classes for Tailwind
export const getSubjectColorClasses = (subject) => {
    const color = getSubjectColor(subject);
    return {
        bg: `bg-${color}-100`,
        text: `text-${color}-600`,
        border: `border-${color}-300`
    };
};

// Get prep level description
export const getPrepLevelDescription = (level) => {
    const prepLevel = PREP_LEVELS.find(prep => prep.value === level);
    return prepLevel ? prepLevel.description : 'Unknown level';
};


// Validate email format
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Validate prep level
export const isValidPrepLevel = (level) => {
    return level >= 1 && level <= 5;
};

// Validate exam name
export const isValidExamName = (examName) => {
    return EXAM_OPTIONS.some(exam => exam.value === examName);
};

// Validate time available
export const isValidTimeAvailable = (timeString) => {
    if (!timeString) return false;
    const months = parseTimeToMonths(timeString);
    return months >= 1 && months <= 24;
};


// Capitalize first letter
export const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
};

// Format chapter name for display
export const formatChapterName = (chapterName) => {
    return chapterName.split('_').map(word => capitalize(word)).join(' ');
};

// Format percentage
export const formatPercentage = (value, decimals = 0) => {
    return `${value.toFixed(decimals)}%`;
};

// Format number with commas
export const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};


// Shuffle array
export const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

// Group array by property
export const groupBy = (array, key) => {
    return array.reduce((groups, item) => {
        const group = item[key];
        if (!groups[group]) {
            groups[group] = [];
        }
        groups[group].push(item);
        return groups;
    }, {});
};

// Sort chapters by priority
export const sortChaptersByPriority = (chapters) => {
    const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
    return [...chapters].sort((a, b) => {
        return (priorityOrder[b.importance] || 0) - (priorityOrder[a.importance] || 0);
    });
};


// Format date for display
export const formatDate = (dateString) => {
    if (!dateString) return 'Never';

    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;

    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

// Check if date is today
export const isToday = (dateString) => {
    if (!dateString) return false;

    const date = new Date(dateString);
    const today = new Date();

    return date.toDateString() === today.toDateString();
};

// Get relative time string
export const getRelativeTime = (dateString) => {
    if (!dateString) return 'Never';

    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now - date;
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return formatDate(dateString);
};


// Calculate quiz score
export const calculateQuizScore = (correctAnswers, totalQuestions) => {
    if (totalQuestions === 0) return 0;
    return Math.round((correctAnswers / totalQuestions) * 100);
};

// Get quiz grade based on score
export const getQuizGrade = (score) => {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    return 'F';
};

// Check if quiz is passed
export const isQuizPassed = (correctAnswers, totalQuestions) => {
    const score = calculateQuizScore(correctAnswers, totalQuestions);
    return score >= 60; // 60% passing score
};


// Generate unique ID
export const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Debounce function
export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Deep clone object
export const deepClone = (obj) => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj);
    if (obj instanceof Array) return obj.map(item => deepClone(item));
    if (typeof obj === 'object') {
        const clonedObj = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                clonedObj[key] = deepClone(obj[key]);
            }
        }
        return clonedObj;
    }
};

// Check if object is empty
export const isEmpty = (obj) => {
    if (obj == null) return true;
    if (Array.isArray(obj) || typeof obj === 'string') return obj.length === 0;
    return Object.keys(obj).length === 0;
};

// Safe JSON parse
export const safeJsonParse = (str, defaultValue = null) => {
    try {
        return JSON.parse(str);
    } catch (error) {
        return defaultValue;
    }
};