export const EXAM_OPTIONS = [
    { value: 'JEE Main', label: 'JEE Main', subjects: ['Physics', 'Chemistry', 'Mathematics'] },
    { value: 'JEE Advanced', label: 'JEE Advanced', subjects: ['Physics', 'Chemistry', 'Mathematics'] },
    { value: 'NEET', label: 'NEET', subjects: ['Physics', 'Chemistry', 'Biology'] },
    { value: 'CUET', label: 'CUET', subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English'] },
    { value: 'CLAT', label: 'CLAT', subjects: ['Legal Reasoning', 'Logical Reasoning', 'English', 'General Knowledge'] },
    { value: 'CAT', label: 'CAT', subjects: ['Quantitative Aptitude', 'VARC', 'DILR'] },
    { value: 'GATE', label: 'GATE', subjects: ['Engineering Mathematics', 'General Aptitude', 'Technical Subject'] },
    { value: 'BITSAT', label: 'BITSAT', subjects: ['Physics', 'Chemistry', 'Mathematics', 'English'] },
    { value: 'VITEEE', label: 'VITEEE', subjects: ['Physics', 'Chemistry', 'Mathematics'] },
    { value: 'COMEDK', label: 'COMEDK', subjects: ['Physics', 'Chemistry', 'Mathematics'] },
    { value: 'GRE', label: 'GRE – Graduate Record Examination', subjects: ['Quantitative Reasoning', 'Verbal Reasoning', 'Analytical Writing'] },
    { value: 'GMAT', label: 'GMAT – Graduate Management Admission Test', subjects: ['Quantitative', 'Verbal', 'Integrated Reasoning', 'Analytical Writing'] },
    { value: 'SAT', label: 'SAT – Scholastic Assessment Test', subjects: ['Math', 'Reading & Writing'] },
    { value: 'TOEFL', label: 'TOEFL – Test of English as a Foreign Language', subjects: ['Reading', 'Listening', 'Speaking', 'Writing'] },
    { value: 'IELTS', label: 'IELTS – International English Language Testing System', subjects: ['Listening', 'Reading', 'Writing', 'Speaking'] },
    { value: 'IMO', label: 'IMO – International Mathematics Olympiad', subjects: ['Mathematics'] },
    { value: 'NSO', label: 'NSO – National Science Olympiad', subjects: ['Physics', 'Chemistry', 'Biology'] },
    { value: 'IOQM', label: 'IOQM – Indian Olympiad Qualifier in Mathematics', subjects: ['Mathematics'] },
    { value: 'NSEJS', label: 'NSEJS – Junior Science Olympiad', subjects: ['Physics', 'Chemistry', 'Biology'] },
    { value: 'IBPS PO', label: 'IBPS PO – Banking (Probationary Officer)', subjects: ['Quantitative Aptitude', 'Reasoning Ability', 'English Language', 'General Awareness'] },
    { value: 'NDA', label: 'NDA – Defence Services Entrance', subjects: ['Mathematics', 'General Ability Test', 'English'] }
];

// Preparation levels with descriptions
export const PREP_LEVELS = [
    { value: 1, label: 'Level 1', description: 'Just started preparation' },
    { value: 2, label: 'Level 2', description: 'Basic concepts covered' },
    { value: 3, label: 'Level 3', description: 'Intermediate level preparation' },
    { value: 4, label: 'Level 4', description: 'Advanced preparation' },
    { value: 5, label: 'Level 5', description: 'Exam ready' }
];

// Time options for preparation
export const TIME_OPTIONS = [
    { value: '2 weeks', label: '2 weeks' },
    { value: '1 month', label: '1 month' },
    { value: '2 months', label: '2 months' },
    { value: '3 months', label: '3 months' },
    { value: '4 months', label: '4 months' },
    { value: '5 months', label: '5 months' },
    { value: '6 months', label: '6 months' },
    { value: '1 year', label: '1 year' }
];

// Chapter status options
export const CHAPTER_STATUS = {
    NOT_STARTED: 'not-started',
    IN_PROGRESS: 'in-progress',
    COMPLETED: 'completed',
    FAILED: 'failed'
};

// Status labels and colors
export const STATUS_CONFIG = {
    [CHAPTER_STATUS.NOT_STARTED]: {
        label: 'Not Started',
        color: 'gray',
        icon: '🔄',
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-600'
    },
    [CHAPTER_STATUS.IN_PROGRESS]: {
        label: 'In Progress',
        color: 'blue',
        icon: '⏳',
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-600'
    },
    [CHAPTER_STATUS.COMPLETED]: {
        label: 'Completed',
        color: 'green',
        icon: '✅',
        bgColor: 'bg-green-100',
        textColor: 'text-green-600'
    },
    [CHAPTER_STATUS.FAILED]: {
        label: 'Failed',
        color: 'red',
        icon: '❌',
        bgColor: 'bg-red-100',
        textColor: 'text-red-600'
    }
};

// Quiz difficulty levels
export const QUIZ_LEVELS = {
    1: { name: 'Basic', description: 'Definitions and direct formula application' },
    2: { name: 'Intermediate', description: 'Basic numerical problems and concept application' },
    3: { name: 'Moderate', description: 'Conceptual trick questions and formula manipulation' },
    4: { name: 'Advanced', description: 'Mixed concepts + multi-step calculations' },
    5: { name: 'Expert', description: 'Previous year exam-style complex questions' }
};

// Chapter difficulty levels
export const DIFFICULTY_LEVELS = {
    BASIC: 'Basic',
    INTERMEDIATE: 'Intermediate',
    ADVANCED: 'Advanced'
};

// Chapter importance levels
export const IMPORTANCE_LEVELS = {
    HIGH: 'High',
    MEDIUM: 'Medium',
    LOW: 'Low'
};

// API configuration - OpenAI calls now go through backend proxy
export const API_CONFIG = {
    MODEL: 'gpt-3.5-turbo',
    MAX_TOKENS: {
        SYLLABUS: 3000,
        QUESTIONS: 4000,
        REVISION: 2000
    },
    TEMPERATURE: {
        SYLLABUS: 0.3,
        QUESTIONS: 0.4,
        REVISION: 0.3
    }
};

// Application routes
export const ROUTES = {
    SETUP: '/setup',
    SYLLABUS: '/syllabus',
    TEST: '/test',
    REVISION: '/revision',
    ANALYTICS: '/analytics'
};

// Application metadata
export const APP_CONFIG = {
    NAME: 'EXAM-AI',
    VERSION: '1.0.0',
    DESCRIPTION: 'AI-powered adaptive exam preparation platform',
    AUTHOR: 'EXAM-AI Team'
};

// Analytics metrics configuration
export const ANALYTICS_CONFIG = {
    EXAM_READY_THRESHOLD: {
        COMPLETION_PERCENTAGE: 80,
        AI_SCORE: 75
    },
    SCORE_WEIGHTS: {
        COMPLETED: 100,
        IN_PROGRESS: 20, // per level cleared
        FAILED: 10 // per level cleared
    }
};

// Time-based chapter count logic
export const CHAPTER_COUNT_LOGIC = {
    1: 10, // 1 month or less
    2: 15, // 2 months
    3: 25  // 3+ months (complete syllabus)
};

//   // Subject-specific colors for UI
//   export const SUBJECT_COLORS = {
//     'Physics': 'blue',
//     'Chemistry': 'green',
//     'Mathematics': 'purple',
//     'Biology': 'red',
//     'English': 'indigo',
//     'Legal Reasoning': 'yellow',
//     'Logical Reasoning': 'pink',
//     'General Knowledge': 'gray',
//     'Quantitative Aptitude': 'orange',
//     'VARC': 'teal',
//     'DILR': 'cyan',
//     'Engineering Mathematics': 'violet',
//     'General Aptitude': 'lime',
//     'Technical Subject': 'emerald',
//     'Reasoning Ability': 'rose',
//     'English Language': 'sky',
//     'General Awareness': 'slate',
//     'General Ability Test': 'amber'
//   };

// Default values
export const DEFAULTS = {
    EXAM_NAME: 'JEE Main',
    PREP_LEVEL: 3,
    TIME_AVAILABLE: '3 months',
    ESTIMATED_HOURS: '8-12 hours',
    QUESTIONS_PER_LEVEL: 5,
    TOTAL_LEVELS: 5,
    TOTAL_QUESTIONS: 25
};

// Error messages
export const ERROR_MESSAGES = {
    API_KEY_MISSING: 'OpenAI API key is not configured',
    API_CALL_FAILED: 'Failed to generate content. Please try again.',
    INVALID_RESPONSE: 'Invalid response format from AI service',
    NETWORK_ERROR: 'Network error. Please check your connection.',
    STORAGE_ERROR: 'Failed to save data. Please try again.',
    VALIDATION_ERROR: 'Invalid data format. Please check your input.'
};

// Success messages
export const SUCCESS_MESSAGES = {
    SETUP_COMPLETE: 'Setup completed successfully!',
    CHAPTER_COMPLETED: 'Chapter completed successfully!',
    PROGRESS_SAVED: 'Progress saved successfully!',
    DATA_CLEARED: 'All data cleared successfully!'
};

// Loading messages
export const LOADING_MESSAGES = {
    GENERATING_SYLLABUS: 'Generating personalized syllabus...',
    LOADING_QUESTIONS: 'Loading questions...',
    LOADING_REVISION: 'Loading revision content...',
    SAVING_PROGRESS: 'Saving progress...',
    PROCESSING: 'Processing...'
};

// Validation rules
export const VALIDATION_RULES = {
    PREP_LEVEL: {
        MIN: 1,
        MAX: 5
    },
    CHAPTER_NAME: {
        MIN_LENGTH: 2,
        MAX_LENGTH: 100
    },
    TIME_AVAILABLE: {
        MIN_WEEKS: 1,
        MAX_MONTHS: 24
    }
};