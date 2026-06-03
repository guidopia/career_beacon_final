import { chatCompletion } from '../api/openai.js';

// ===========================================
// AI PROMPTS FOR INDEPENDENT TESTS
// ===========================================

const personalityTestPrompt = `
You are an expert personality psychologist specializing in Big 5 personality traits assessment for students. Analyze the personality test responses and create a comprehensive personality profile report.

CRITICAL FORMATTING INSTRUCTIONS:
- Structure the report with exactly these 4 sections
- Each section must be separated by exactly two line breaks
- Use clear, student-friendly language

Structure the report with exactly these 4 sections:

1. Your Personality Profile

Write 2-3 detailed paragraphs analyzing their dominant personality traits based on their specific responses. Identify their strongest traits (Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism) and explain how these traits manifest in their daily life, learning style, and social interactions.

2. Your Strengths & Natural Abilities

Write detailed paragraphs about:
- Key strengths based on their personality profile
- Natural abilities and talents they possess
- How their personality traits give them advantages
- Situations where they naturally excel

3. Career Paths That Match Your Personality

Provide 4-5 specific career recommendations that align with their personality profile:
- Career 1: [Name] - Why it fits their personality and specific traits that make them suitable
- Career 2: [Name] - Why it fits their personality and specific traits that make them suitable
- Career 3: [Name] - Why it fits their personality and specific traits that make them suitable
- Career 4: [Name] - Why it fits their personality and specific traits that make them suitable

4. Personal Development Recommendations

Write specific recommendations for:
- Areas for personal growth based on their profile
- Learning strategies that work best for their personality
- Tips for managing any challenging aspects of their personality
- Activities and experiences that will help them grow

Base everything on their specific personality test responses. Provide encouraging, positive, and actionable insights.

Now analyze these personality test responses:
`;

const aptitudeTestPrompt = `
You are an educational assessment expert specializing in cognitive aptitude analysis for students. Analyze the aptitude test performance and create a comprehensive cognitive abilities report.

CRITICAL FORMATTING INSTRUCTIONS:
- Structure the report with exactly these 4 sections
- Each section must be separated by exactly two line breaks
- Provide specific, actionable recommendations

Structure the report with exactly these 4 sections:

1. Your Cognitive Abilities Assessment

Write 2-3 detailed paragraphs analyzing their test performance across different areas:
- Overall cognitive ability level based on score
- Strengths in specific areas (Logical Reasoning, Numerical Ability, Verbal Understanding, etc.)
- Areas that need improvement
- Learning capacity and problem-solving style

2. Detailed Performance Analysis

Analyze performance in each test area:
- Logical Reasoning: [Performance level and what it means]
- Numerical Ability: [Performance level and what it means]
- Verbal Understanding: [Performance level and what it means]
- General Knowledge: [Performance level and what it means]
- Problem Solving: [Overall problem-solving approach]

3. Academic & Career Recommendations

Based on cognitive strengths, recommend:
- Academic subjects where they're likely to excel
- Study methods that match their cognitive style
- Career fields that align with their cognitive abilities
- Educational paths that suit their aptitude profile

4. Improvement Strategy

Provide specific recommendations for:
- Areas needing improvement and how to strengthen them
- Study techniques and learning strategies
- Practice resources and activities
- Timeline for skill development

Base everything on their actual test score and performance pattern. Provide constructive, motivating guidance.

Test Score: [SCORE]/20
Detailed Responses: [RESPONSES]

Now analyze this aptitude test performance:
`;

const intelligenceTestPrompt = `
You are a multiple intelligence specialist based on Howard Gardner's theory. Analyze the intelligence test responses and create a comprehensive intelligence profile report.

CRITICAL FORMATTING INSTRUCTIONS:
- Structure the report with exactly these 4 sections
- Each section must be separated by exactly two line breaks
- Focus on practical applications of their intelligence types

Structure the report with exactly these 4 sections:

1. Your Intelligence Profile

Write 2-3 detailed paragraphs identifying their dominant intelligence types based on their responses:
- Primary intelligence type(s) and what this means
- Secondary intelligence strengths
- How these intelligences work together
- Their unique learning and thinking style

2. Your Natural Learning Style

Analyze how they learn best:
- Preferred learning methods based on their intelligence profile
- Study techniques that maximize their potential
- Environmental conditions that help them focus
- Ways to process and retain information effectively

3. Career & Activity Recommendations

Provide specific recommendations based on their intelligence profile:
- Career fields that align with their intelligence types
- Extracurricular activities that develop their strengths
- Hobbies and interests they should explore
- Educational specializations to consider

4. Development Plan for Your Intelligences

Create a practical development strategy:
- Ways to strengthen their dominant intelligences
- Methods to develop their weaker intelligence areas
- Activities and experiences for well-rounded growth
- Long-term goals for intelligence development

Base everything on their specific intelligence test responses. Provide practical, actionable guidance for leveraging their intelligence profile.

Now analyze these multiple intelligence test responses:
`;

// ===========================================
// SCORING & ANALYSIS FUNCTIONS
// ===========================================

// Calculate personality trait scores from responses
const calculatePersonalityScores = (answers, questions) => {
    const scores = {
        openness: 0,
        conscientiousness: 0,
        extraversion: 0,
        agreeableness: 0,
        neuroticism: 0
    };

    console.log('Calculating personality scores...'); // Debug log

    answers.forEach((answer, index) => {
        if (questions[index] && questions[index].traits && answer) {
            const question = questions[index];
            console.log(`Question ${index + 1}: "${question.question}"`); // Debug
            console.log(`Answer: "${answer}"`); // Debug
            console.log(`Available options:`, question.options); // Debug

            // Find the index of the selected answer in the options array
            const optionIndex = question.options.indexOf(answer);
            console.log(`Option index: ${optionIndex}`); // Debug

            if (optionIndex !== -1) {
                // Map index to letter (0->A, 1->B, 2->C, 3->D, 4->E)
                const selectedLetter = ['A', 'B', 'C', 'D', 'E'][optionIndex];
                console.log(`Selected letter: ${selectedLetter}`); // Debug

                // Get the trait for this letter
                const trait = question.traits[selectedLetter];
                console.log(`Trait: ${trait}`); // Debug

                if (trait && scores.hasOwnProperty(trait)) {
                    scores[trait]++;
                    console.log(`Incremented ${trait}, new score: ${scores[trait]}`); // Debug
                } else {
                    console.log(`Warning: Invalid trait "${trait}" for question ${index + 1}`);
                }
            } else {
                console.log(`Warning: Answer "${answer}" not found in options for question ${index + 1}`);
            }
        } else {
            console.log(`Warning: Missing data for question ${index + 1}`);
        }
    });

    console.log('Final personality scores:', scores); // Debug
    return scores;
};

// Calculate aptitude test score
const calculateAptitudeScore = (answers, questions) => {
    let correctAnswers = 0;
    const detailed = [];

    answers.forEach((answer, index) => {
        if (questions[index]) {
            const selectedOption = ['A', 'B', 'C', 'D'][
                questions[index].options.indexOf(answer)
            ];
            const isCorrect = selectedOption === questions[index].correctAnswer;

            if (isCorrect) correctAnswers++;

            detailed.push({
                question: index + 1,
                category: questions[index].category,
                selected: answer,
                correct: isCorrect,
                correctAnswer: questions[index].options[
                    ['A', 'B', 'C', 'D'].indexOf(questions[index].correctAnswer)
                ]
            });
        }
    });

    return {
        score: correctAnswers,
        total: questions.length,
        percentage: Math.round((correctAnswers / questions.length) * 100),
        detailed: detailed
    };
};

// Calculate intelligence type scores
const calculateIntelligenceScores = (answers, questions) => {
    const scores = {
        linguistic: 0,
        'logical-mathematical': 0,
        spatial: 0,
        musical: 0,
        interpersonal: 0,
        intrapersonal: 0,
        naturalistic: 0,
        'bodily-kinesthetic': 0
    };

    answers.forEach((answer, index) => {
        if (questions[index] && questions[index].intelligenceTypes) {
            const selectedOption = ['A', 'B', 'C', 'D'][
                questions[index].options.indexOf(answer)
            ];
            const intelligenceType = questions[index].intelligenceTypes[selectedOption];
            if (intelligenceType && scores.hasOwnProperty(intelligenceType)) {
                scores[intelligenceType]++;
            }
        }
    });

    return scores;
};

// ===========================================
// UTILITY FUNCTIONS
// ===========================================

// Format responses for AI analysis
const formatTestResponses = (answers, questions, testType) => {
    return answers
        .map((answer, index) => {
            if (index < questions.length) {
                const question = questions[index];
                return `Question ${index + 1}: ${question.question}\nAnswer: ${answer}`;
            }
            return null;
        })
        .filter(item => item !== null)
        .join("\n\n");
};

// Clean AI report content
const cleanReportContent = (content) => {
    return content
        .replace(/#/g, "")
        .replace(/\*/g, "")
        .replace(/`/g, "")
        .trim();
};

// Save test result to localStorage
const saveTestToStorage = (testType, reportData) => {
    try {
        const storageKey = `v2_${testType}Test`;
        localStorage.setItem(storageKey, JSON.stringify(reportData));
        return true;
    } catch (error) {
        console.error(`Error saving ${testType} test to storage:`, error);
        return false;
    }
};

// ===========================================
// MAIN REPORT GENERATION FUNCTIONS
// ===========================================

// Generate personality test report
export const generatePersonalityReport = async (answers, questions) => {
    try {
        // Calculate personality scores
        const personalityScores = calculatePersonalityScores(answers, questions);

        // Format responses for AI
        const formattedAnswers = formatTestResponses(answers, questions, 'personality');

        // Call OpenAI API via backend proxy
        const response = await chatCompletion([
            {
                role: "system",
                content: personalityTestPrompt,
            },
            {
                role: "user",
                content: `Personality Scores: ${JSON.stringify(personalityScores)}\n\nDetailed Responses:\n${formattedAnswers}`,
            },
        ], "gpt-3.5-turbo-16k", 0.7, 3500);

        const reportContent = cleanReportContent(response);

        // Save to localStorage
        const reportData = {
            report: reportContent,
            scores: personalityScores,
            answers: answers,
            testType: 'personality',
            timestamp: new Date().toISOString()
        };

        saveTestToStorage('personality', reportData);

        return reportContent;
    } catch (error) {
        console.error("Error generating personality report:", error);
        throw error;
    }
};

// Generate aptitude test report
export const generateAptitudeReport = async (answers, questions) => {
    try {
        // Calculate aptitude score
        const aptitudeResults = calculateAptitudeScore(answers, questions);

        // Format responses for AI
        const formattedAnswers = formatTestResponses(answers, questions, 'aptitude');

        // Call OpenAI API via backend proxy
        const response = await chatCompletion([
            {
                role: "system",
                content: aptitudeTestPrompt,
            },
            {
                role: "user",
                content: `Test Score: ${aptitudeResults.score}/20 (${aptitudeResults.percentage}%)\n\nDetailed Performance: ${JSON.stringify(aptitudeResults.detailed)}\n\nDetailed Responses:\n${formattedAnswers}`,
            },
        ], "gpt-3.5-turbo-16k", 0.7, 3500);

        const reportContent = cleanReportContent(response);

        // Save to localStorage
        const reportData = {
            report: reportContent,
            scores: aptitudeResults,
            answers: answers,
            testType: 'aptitude',
            timestamp: new Date().toISOString()
        };

        saveTestToStorage('aptitude', reportData);

        return reportContent;
    } catch (error) {
        console.error("Error generating aptitude report:", error);
        throw error;
    }
};

// Generate intelligence test report
export const generateIntelligenceReport = async (answers, questions) => {
    try {
        // Calculate intelligence scores
        const intelligenceScores = calculateIntelligenceScores(answers, questions);

        // Format responses for AI
        const formattedAnswers = formatTestResponses(answers, questions, 'intelligence');

        // Call OpenAI API via backend proxy
        const response = await chatCompletion([
            {
                role: "system",
                content: intelligenceTestPrompt,
            },
            {
                role: "user",
                content: `Intelligence Scores: ${JSON.stringify(intelligenceScores)}\n\nDetailed Responses:\n${formattedAnswers}`,
            },
        ], "gpt-3.5-turbo-16k", 0.7, 3500);

        const reportContent = cleanReportContent(response);

        // Save to localStorage
        const reportData = {
            report: reportContent,
            scores: intelligenceScores,
            answers: answers,
            testType: 'intelligence',
            timestamp: new Date().toISOString()
        };

        saveTestToStorage('intelligence', reportData);

        return reportContent;
    } catch (error) {
        console.error("Error generating intelligence report:", error);
        throw error;
    }
};

// ===========================================
// RETRIEVAL FUNCTIONS FOR SAVED TESTS
// ===========================================

// Get saved personality test
export const getSavedPersonalityTest = () => {
    try {
        const savedData = localStorage.getItem('v2_personalityTest');
        return savedData ? JSON.parse(savedData) : null;
    } catch (error) {
        console.error("Error retrieving saved personality test:", error);
        return null;
    }
};

// Get saved aptitude test
export const getSavedAptitudeTest = () => {
    try {
        const savedData = localStorage.getItem('v2_aptitudeTest');
        return savedData ? JSON.parse(savedData) : null;
    } catch (error) {
        console.error("Error retrieving saved aptitude test:", error);
        return null;
    }
};

// Get saved intelligence test
export const getSavedIntelligenceTest = () => {
    try {
        const savedData = localStorage.getItem('v2_intelligenceTest');
        return savedData ? JSON.parse(savedData) : null;
    } catch (error) {
        console.error("Error retrieving saved intelligence test:", error);
        return null;
    }
};

// ===========================================
// QUICK SCORE CALCULATION (WITHOUT AI)
// ===========================================

// Get quick personality analysis without AI
export const getQuickPersonalityAnalysis = (answers, questions) => {
    console.log('Getting quick personality analysis...'); // Debug
    console.log('Answers received:', answers); // Debug
    console.log('Questions length:', questions.length); // Debug

    const scores = calculatePersonalityScores(answers, questions);
    const dominantTrait = Object.keys(scores).reduce((a, b) =>
        scores[a] > scores[b] ? a : b
    );

    console.log('Dominant trait:', dominantTrait); // Debug

    return {
        scores,
        dominantTrait,
        analysis: `Your dominant personality trait is ${dominantTrait.replace(/([A-Z])/g, ' $1').toLowerCase()}`
    };
};

// Get quick aptitude analysis without AI
export const getQuickAptitudeAnalysis = (answers, questions) => {
    return calculateAptitudeScore(answers, questions);
};

// Get quick intelligence analysis without AI
export const getQuickIntelligenceAnalysis = (answers, questions) => {
    const scores = calculateIntelligenceScores(answers, questions);
    const dominantIntelligence = Object.keys(scores).reduce((a, b) =>
        scores[a] > scores[b] ? a : b
    );

    return {
        scores,
        dominantIntelligence,
        analysis: `Your dominant intelligence type is ${dominantIntelligence.replace(/-/g, ' ')}`
    };
};