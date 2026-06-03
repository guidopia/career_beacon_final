// ===============================
// ENHANCED STORAGE SERVICE FOR MULTI-SUBJECT SUPPORT
// ===============================

const STORAGE_KEYS = {
    SYLLABUS_PLANS: 'examAI_syllabusPlans', // NEW: Store multiple subject plans
    CURRENT_PLAN: 'examAI_currentPlan',     // NEW: Current active subject plan
    USER_SETUP: 'examAI_userSetup',         // Keep for backward compatibility
    LAST_ACTIVITY: 'examAI_lastActivity'
};

// ===============================
// MULTI-SUBJECT PLAN MANAGEMENT
// ===============================

// Generate unique plan key for subject combination (must stay stable — used in localStorage keys)
export const generatePlanKey = (examName, subject) => {
    return `${examName}_${subject}`;
};

// Save a subject plan (NEET_Physics, NEET_Chemistry, etc.)
export const saveSyllabusPlan = (examName, subject, chaptersData, userSetup) => {
    try {
        const planKey = generatePlanKey(examName, subject);
        const existingPlans = getAllSyllabusPlans();

        const planData = {
            planKey,
            examName,
            subject,
            chapters: chaptersData,
            userSetup: {
                ...userSetup,
                subjectFocus: [subject] // Ensure single subject
            },
            timestamp: new Date().toISOString(),
            lastUpdated: new Date().toISOString()
        };

        // Update plans object
        const updatedPlans = {
            ...existingPlans,
            [planKey]: planData
        };

        localStorage.setItem(STORAGE_KEYS.SYLLABUS_PLANS, JSON.stringify(updatedPlans));

        // Set as current plan
        setCurrentPlan(planKey);

        return true;
    } catch (error) {
        console.error("Error saving syllabus plan:", error);
        return false;
    }
};

// Get all saved syllabus plans
export const getAllSyllabusPlans = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.SYLLABUS_PLANS);
        return data ? JSON.parse(data) : {};
    } catch (error) {
        console.error("Error retrieving syllabus plans:", error);
        return {};
    }
};

// Get specific subject plan
export const getSyllabusPlan = (examName, subject) => {
    try {
        const planKey = generatePlanKey(examName, subject);
        const allPlans = getAllSyllabusPlans();
        return allPlans[planKey] || null;
    } catch (error) {
        console.error("Error retrieving syllabus plan:", error);
        return null;
    }
};

// Check if plan exists for exam + subject
export const planExists = (examName, subject) => {
    const plan = getSyllabusPlan(examName, subject);
    return plan !== null;
};

// Get plans for specific exam (all subjects)
export const getExamPlans = (examName) => {
    try {
        const allPlans = getAllSyllabusPlans();
        const examPlans = {};

        Object.keys(allPlans).forEach(planKey => {
            if (allPlans[planKey].examName === examName) {
                examPlans[planKey] = allPlans[planKey];
            }
        });

        return examPlans;
    } catch (error) {
        console.error("Error retrieving exam plans:", error);
        return {};
    }
};

// ===============================
// CURRENT PLAN MANAGEMENT
// ===============================

// Set current active plan
export const setCurrentPlan = (planKey) => {
    try {
        localStorage.setItem(STORAGE_KEYS.CURRENT_PLAN, planKey);
        return true;
    } catch (error) {
        console.error("Error setting current plan:", error);
        return false;
    }
};

// Get current active plan key
export const getCurrentPlanKey = () => {
    try {
        return localStorage.getItem(STORAGE_KEYS.CURRENT_PLAN);
    } catch (error) {
        console.error("Error getting current plan key:", error);
        return null;
    }
};

// Get current active plan data
export const getCurrentPlan = () => {
    try {
        let currentPlanKey = getCurrentPlanKey();
        const allPlans = getAllSyllabusPlans();
        const planKeys = Object.keys(allPlans);

        // Invalid / corrupted pointer (e.g. literal "undefined", or stale deleted key)
        if (
            !currentPlanKey ||
            currentPlanKey === 'undefined' ||
            currentPlanKey === 'null' ||
            !allPlans[currentPlanKey]
        ) {
            if (planKeys.length === 0) {
                try {
                    localStorage.removeItem(STORAGE_KEYS.CURRENT_PLAN);
                } catch {
                    /* ignore */
                }
                return null;
            }
            const fallbackKey = planKeys[0];
            localStorage.setItem(STORAGE_KEYS.CURRENT_PLAN, fallbackKey);
            currentPlanKey = fallbackKey;
        }

        return allPlans[currentPlanKey] || null;
    } catch (error) {
        console.error("Error getting current plan:", error);
        return null;
    }
};

// ===============================
// CHAPTER PROGRESS MANAGEMENT
// ===============================

// Update chapters for specific plan
export const updatePlanChapters = (examName, subject, chaptersData) => {
    try {
        const planKey = generatePlanKey(examName, subject);
        const allPlans = getAllSyllabusPlans();

        if (allPlans[planKey]) {
            allPlans[planKey].chapters = chaptersData;
            allPlans[planKey].lastUpdated = new Date().toISOString();

            localStorage.setItem(STORAGE_KEYS.SYLLABUS_PLANS, JSON.stringify(allPlans));
            return true;
        }

        return false;
    } catch (error) {
        console.error("Error updating plan chapters:", error);
        return false;
    }
};

// Get chapters for current plan
export const getCurrentPlanChapters = () => {
    try {
        const currentPlan = getCurrentPlan();
        return currentPlan ? currentPlan.chapters : [];
    } catch (error) {
        console.error("Error getting current plan chapters:", error);
        return [];
    }
};

// ===============================
// BACKWARD COMPATIBILITY
// ===============================

// Migrate old single-subject data to new multi-subject structure
export const migrateOldData = () => {
    try {
        // Check if old data exists
        const oldChapters = localStorage.getItem('examAI_chapters');
        const oldSetup = localStorage.getItem(STORAGE_KEYS.USER_SETUP);

        if (oldChapters && oldSetup) {
            const chaptersData = JSON.parse(oldChapters);
            const setupData = JSON.parse(oldSetup);

            if (setupData.examName && setupData.subjectFocus && setupData.subjectFocus.length > 0) {
                const subject = setupData.subjectFocus[0];

                // Save as new plan
                saveSyllabusPlan(setupData.examName, subject, chaptersData.chapters || chaptersData, setupData);

                // Remove old data
                localStorage.removeItem('examAI_chapters');
                localStorage.removeItem('examAI_currentSyllabus');

                console.log("Successfully migrated old data to new structure");
                return true;
            }
        }

        return false;
    } catch (error) {
        console.error("Error migrating old data:", error);
        return false;
    }
};

// ===============================
// UTILITY FUNCTIONS
// ===============================

// Get available subjects for current exam
export const getAvailableSubjects = () => {
    try {
        const currentPlan = getCurrentPlan();
        if (!currentPlan) return [];

        const examPlans = getExamPlans(currentPlan.examName);
        return Object.values(examPlans).map(plan => plan.subject);
    } catch (error) {
        console.error("Error getting available subjects:", error);
        return [];
    }
};

// Check if user has completed any setup
export const hasAnyCompletedSetup = () => {
    const plans = getAllSyllabusPlans();
    return Object.keys(plans).length > 0;
};

// Get setup completion status for backward compatibility
export const hasCompletedSetup = () => {
    return hasAnyCompletedSetup() || getCurrentPlan() !== null;
};

// Clear specific plan
export const clearSyllabusPlan = (examName, subject) => {
    try {
        const planKey = generatePlanKey(examName, subject);
        const allPlans = getAllSyllabusPlans();

        delete allPlans[planKey];

        localStorage.setItem(STORAGE_KEYS.SYLLABUS_PLANS, JSON.stringify(allPlans));

        // If this was current plan, clear current plan
        if (getCurrentPlanKey() === planKey) {
            localStorage.removeItem(STORAGE_KEYS.CURRENT_PLAN);
        }

        return true;
    } catch (error) {
        console.error("Error clearing syllabus plan:", error);
        return false;
    }
};

// ===============================
// LEGACY COMPATIBILITY FUNCTIONS
// ===============================

// For backward compatibility with existing code
export const getChapters = () => {
    return getCurrentPlanChapters();
};

export const saveChapters = (chaptersData) => {
    const currentPlan = getCurrentPlan();
    if (currentPlan) {
        return updatePlanChapters(currentPlan.examName, currentPlan.subject, chaptersData);
    }
    return false;
};

export const getUserSetup = () => {
    const currentPlan = getCurrentPlan();
    return currentPlan ? currentPlan.userSetup : null;
};

export const saveUserSetup = (setupData) => {
    // This will be handled by saveSyllabusPlan instead
    console.warn("saveUserSetup is deprecated. Use saveSyllabusPlan instead.");
    return true;
};

// Clear all data
export const clearAllData = () => {
    try {
        Object.values(STORAGE_KEYS).forEach(key => {
            localStorage.removeItem(key);
        });

        // Clear AI service cache
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('questions_') ||
                key.startsWith('revision_') ||
                key.startsWith('syllabus_') ||
                key.startsWith('examAI_')) {
                localStorage.removeItem(key);
            }
        });

        return true;
    } catch (error) {
        console.error("Error clearing all data:", error);
        return false;
    }
};

// ===============================
// ACTIVITY TRACKING
// ===============================

export const saveLastActivity = (activityData = {}) => {
    try {
        const currentPlan = getCurrentPlan();
        const dataToSave = {
            timestamp: new Date().toISOString(),
            page: activityData.page || 'unknown',
            action: activityData.action || 'visit',
            chapterName: activityData.chapterName || null,
            planKey: currentPlan ? currentPlan.planKey : null,
            examName: currentPlan ? currentPlan.examName : null,
            subject: currentPlan ? currentPlan.subject : null
        };

        localStorage.setItem(STORAGE_KEYS.LAST_ACTIVITY, JSON.stringify(dataToSave));
        return true;
    } catch (error) {
        console.error("Error saving last activity:", error);
        return false;
    }
};

export const getLastActivity = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.LAST_ACTIVITY);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error("Error retrieving last activity:", error);
        return null;
    }
};