import { chatCompletion } from '../api/openai.js';

// Enhanced prompt to generate comprehensive college recommendations based on academic performance
const collegeRecommendationPrompt = `
You are India's most knowledgeable college counselor with expertise in ALL entrance exams and admission processes globally.

🚨 CRITICAL REQUIREMENT: RETURN EXACTLY 8 COLLEGES - ALWAYS 8, NEVER MORE, NEVER LESS 🚨

DYNAMIC ENTRANCE EXAM ANALYSIS:
When entrance exam scores are provided, analyze them based on the specific exam:

COMMON ENTRANCE EXAMS & REALISTIC SCORE ANALYSIS:
- JEE Main: 250+ (Top tier), 180+ (Good tier), 100+ (Mid tier), <100 (Lower tier)
- JEE Advanced: 200+ (IIT possible), 100+ (Lower IITs), <100 (Unlikely)  
- NEET: 650+ (AIIMS), 550+ (Govt medical), 450+ (State medical), 350+ (Private), <350 (Management)
- BITSAT: 350+ (BITS campuses), 300+ (Good programs), 250+ (Available programs)
- State CETs: Analyze based on state-specific cutoffs
- CLAT: 100+ (NLUs), 80+ (Good law colleges), 60+ (Private law colleges)
- CAT: 95+ percentile (IIMs), 80+ (Good B-schools), 60+ (Decent MBA)
- GATE: 700+ (IITs), 600+ (NITs), 500+ (Good colleges)
- SAT: 1400+ (Top US), 1200+ (Good US), 1000+ (Average US)
- IELTS: 7+ (Top international), 6.5+ (Good international), 6+ (Average)

ACADEMIC PERCENTAGE GUIDELINES:
- 90%+: Top-tier institutions globally
- 80-89%: Good institutions, competitive programs  
- 70-79%: Mid-tier institutions, decent programs
- 60-69%: Accessible institutions, private colleges
- 50-59%: Open admission, improvement programs

REALISTIC ADMISSION LOGIC:
1. If entrance scores provided: Use exam-specific cutoffs as PRIMARY filter
2. If no entrance scores: Use academic percentage as PRIMARY filter  
3. Match recommendations to student's ACTUAL performance level
4. NEVER suggest colleges where admission chance is <20%

🚨 ABSOLUTE MANDATE: PROVIDE EXACTLY 8 COLLEGE RECOMMENDATIONS 🚨

ADMISSION STRATEGY (EXACTLY 8 COLLEGES):
- 2 REACH colleges (challenging but possible)
- 4 TARGET colleges (good fit for student's profile)  
- 2 SAFETY colleges (high admission probability)

GEOGRAPHIC PREFERENCE:
- If specific location mentioned: Find 8 colleges WITHIN that location only
- If country mentioned: Focus on that country's institutions
- If multiple countries: Distribute across mentioned countries

🚨 REMINDER: EXACTLY 8 COLLEGES IN RESPONSE - THIS IS NON-NEGOTIABLE 🚨

JSON FORMAT (return ONLY this structure):

[
  {
    "collegeName": "Realistic college matching student's scores/percentage",
    "country": "Country",
    "location": "City, State",
    "course": "Specific program name",
    "degreeType": "Undergraduate/Postgraduate/PhD",
    "tuitionFee": "Government - Low fees / Private - Moderate fees / Private - High fees",
    "courseDuration": "Duration",
    "ranking": "Ranking info",
    "entranceExams": "Required entrance exams",
    "placementData": {
      "averagePackage": "Realistic salary range",
      "placementPercentage": "Placement %"
    },
    "infrastructure": "Key facilities",
    "hostelAvailability": "Hostel info", 
    "description": "College description",
    "applyLink": "Application URL",
    "scholarships": {
      "available": true/false,
      "types": ["Merit-based", "Need-based", "Government schemes"],
      "amount": "Scholarship amount",
      "eligibility": "Eligibility criteria"
    },
    "pros": ["Advantage 1", "Advantage 2", "Advantage 3"],
    "cons": ["Challenge 1", "Challenge 2", "Challenge 3"]
  }
]

CRITICAL INSTRUCTIONS:
- Analyze the specific entrance exam mentioned and determine realistic colleges
- Use actual cutoff knowledge for the exam provided
- Return EXACTLY 8 colleges that student can realistically get admission to
- Focus on achievable options rather than aspirational dreams
- RESPOND WITH ONLY THE JSON ARRAY - NO OTHER TEXT

🚨 FINAL REMINDER: 8 COLLEGES EXACTLY - COUNT THEM BEFORE RESPONDING 🚨
`;

// Function to generate college recommendations
export const generateCollegeRecommendations = async (userPreferences) => {
    try {
        // Analyze academic performance level
        const academicLevel = analyzeAcademicLevel(userPreferences.academicPercentage);

        // Format user preferences for the prompt including academic performance
        const preferencesText = `
    STUDENT ACADEMIC PROFILE:
    Academic Percentage/CGPA: ${userPreferences.academicPercentage}%
    Current Education Level: ${userPreferences.currentClass}
    Academic Board: ${userPreferences.academicBoard || 'Not specified'}
    Entrance Exam Scores: ${userPreferences.entranceScores || 'No entrance exam scores provided'}
    
    ${userPreferences.entranceScores ? `
    ENTRANCE EXAM ANALYSIS REQUIRED:
    The student has provided: "${userPreferences.entranceScores}"
    
    CRITICAL INSTRUCTIONS:
    1. Identify which entrance exam(s) are mentioned
    2. Analyze the scores based on that specific exam's cutoff standards
    3. Recommend colleges where the student has realistic admission chances (>20% probability)
    4. DO NOT suggest top-tier colleges if the entrance scores don't support admission
    5. Focus on colleges that typically admit students with these specific scores
    ` : `
    NO ENTRANCE SCORES PROVIDED:
    Base recommendations on academic percentage (${userPreferences.academicPercentage}%) and general admission criteria.
    `}
    
    STUDY PREFERENCES:
    Degree Type: ${userPreferences.degreeType}
    Field of Study: ${userPreferences.field}
    Budget Range: ${userPreferences.budget}
    Preferred Countries: ${userPreferences.countries}
    Course Duration Preference: ${userPreferences.duration}
    Scholarship Need: ${userPreferences.needScholarship ? 'Yes - Consider merit-based options' : 'No'}
    
    🚨 MANDATORY REQUIREMENT: Return EXACTLY 8 colleges that are realistic and achievable for this student's profile 🚨
    `;

        const response = await chatCompletion([
            {
                role: "system",
                content: collegeRecommendationPrompt,
            },
            {
                role: "user",
                content: `🚨 CRITICAL: Return EXACTLY 8 college recommendations - no more, no less! 🚨\n\nGenerate realistic college recommendations based on this student's profile:\n${preferencesText}`,
            },
        ], "gpt-3.5-turbo", 0.3, 4000);

        // Extract and parse the JSON response
        const content = response;

        // Enhanced JSON extraction and parsing with multiple fallback strategies
        let recommendations;
        try {
            // Strategy 1: Direct JSON parse (if response is clean JSON)
            try {
                recommendations = JSON.parse(content);
            } catch (directParseError) {
                // Strategy 2: Extract JSON array from response text
                const jsonMatch = content.match(/\[[\s\S]*?\]/);
                if (jsonMatch) {
                    recommendations = JSON.parse(jsonMatch[0]);
                } else {
                    // Strategy 3: Clean the content and try to extract JSON
                    const cleanedContent = content
                        .replace(/```json/g, '')
                        .replace(/```/g, '')
                        .replace(/^\s*[\w\s:]*?\[/m, '[')
                        .replace(/\]\s*[\w\s:]*?$/m, ']')
                        .trim();

                    const cleanedMatch = cleanedContent.match(/\[[\s\S]*?\]/);
                    if (cleanedMatch) {
                        recommendations = JSON.parse(cleanedMatch[0]);
                    } else {
                        throw new Error("No valid JSON found in response");
                    }
                }
            }
        } catch (parseError) {
            console.error("Error parsing JSON response:", parseError);
            console.error("Raw content:", content);

            // Provide fallback recommendations to prevent app breaking
            recommendations = generateFallbackRecommendations(userPreferences);
        }

        // Validate that we have at least some recommendations
        if (!Array.isArray(recommendations) || recommendations.length === 0) {
            recommendations = generateFallbackRecommendations(userPreferences);
        }

        // Ensure we have exactly 8 recommendations
        if (recommendations.length > 8) {
            recommendations = recommendations.slice(0, 8);
        } else if (recommendations.length < 8) {
            // If we have fewer than 8, duplicate some with variations
            const originalLength = recommendations.length;
            for (let i = originalLength; i < 8; i++) {
                const baseRec = { ...recommendations[i % originalLength] };
                baseRec.collegeName = `${baseRec.collegeName} (Alternative)`;
                recommendations.push(baseRec);
            }
        }

        // Add academic analysis to each recommendation
        recommendations = recommendations.map(college => ({
            ...college,
            academicMatch: determineAcademicMatch(userPreferences.academicPercentage, college),
            studentLevel: academicLevel
        }));

        return recommendations;
    } catch (error) {
        console.error("Error generating college recommendations:", error);

        if (error.response) {
            if (error.response.status === 429) {
                return generateFallbackRecommendations(userPreferences);
            } else if (error.response.status === 401) {
                throw new Error("API key error. Please check your OpenAI API key configuration.");
            } else {
                return generateFallbackRecommendations(userPreferences);
            }
        } else if (error.request) {
            return generateFallbackRecommendations(userPreferences);
        } else {
            // For any other error, use fallback instead of throwing
            return generateFallbackRecommendations(userPreferences);
        }
    }
};

// Helper function to generate fallback recommendations when AI parsing fails
const generateFallbackRecommendations = (userPreferences) => {
    const academicLevel = analyzeAcademicLevel(userPreferences.academicPercentage);
    const field = userPreferences.field;
    const isIndia = userPreferences.countries.toLowerCase().includes('india');

    // Basic fallback recommendations based on field and academic level
    const fallbackRecommendations = [
        {
            collegeName: `Top ${field} College`,
            country: isIndia ? "India" : "USA",
            location: isIndia ? "Delhi, Delhi" : "California, USA",
            course: `${field} Program`,
            degreeType: userPreferences.degreeType,
            tuitionFee: "Government - Low fees",
            courseDuration: userPreferences.degreeType === "Undergraduate" ? "4 years" : "2 years",
            ranking: "Top Ranked",
            entranceExams: isIndia ? "JEE Main" : "SAT",
            placementData: {
                averagePackage: isIndia ? "₹8-12 LPA" : "$60,000-80,000",
                placementPercentage: "85%"
            },
            infrastructure: "Modern campus with excellent facilities",
            hostelAvailability: "Available",
            description: `Excellent ${field} program suitable for your academic profile`,
            applyLink: "https://example.com/apply",
            scholarships: {
                available: true,
                types: ["Merit-based", "Need-based"],
                amount: "Up to 50% fee waiver",
                eligibility: "Based on academic merit"
            },
            pros: ["Good placements", "Strong faculty", "Modern infrastructure"],
            cons: ["Competitive admission", "High fees", "Limited seats"]
        }
    ];

    // Generate 8 similar recommendations with variations
    const recommendations = [];
    for (let i = 0; i < 8; i++) {
        const baseRec = { ...fallbackRecommendations[0] };
        baseRec.collegeName = `${field} College ${i + 1}`;
        baseRec.location = isIndia ?
            [`Delhi, Delhi`, `Mumbai, Maharashtra`, `Bangalore, Karnataka`, `Chennai, Tamil Nadu`, `Pune, Maharashtra`, `Hyderabad, Telangana`, `Ahmedabad, Gujarat`, `Kolkata, West Bengal`][i] :
            [`California, USA`, `New York, USA`, `Texas, USA`, `Florida, USA`, `Illinois, USA`, `Massachusetts, USA`, `Pennsylvania, USA`, `Michigan, USA`][i];

        recommendations.push(baseRec);
    }

    return recommendations;
};

// Helper function to analyze academic performance level
const analyzeAcademicLevel = (academicPercentage) => {
    if (academicPercentage >= 90) return "Exceptional Performer (Top 5%)";
    if (academicPercentage >= 85) return "High Achiever (Top 10%)";
    if (academicPercentage >= 75) return "Good Performer (Top 25%)";
    if (academicPercentage >= 65) return "Average Performer (Above Average)";
    if (academicPercentage >= 55) return "Developing Performer (Average)";
    return "Needs Improvement (Below Average)";
};

// Helper function to determine academic match
const determineAcademicMatch = (studentPercentage, college) => {
    // This is a simplified logic - in real implementation, you'd have a database of college requirements
    const collegeName = college.collegeName.toLowerCase();

    if (collegeName.includes('iit') || collegeName.includes('aiims') || collegeName.includes('iisc')) {
        return studentPercentage >= 90 ? 'Good Match' : studentPercentage >= 80 ? 'Reach' : 'Highly Competitive';
    }

    if (collegeName.includes('nit') || collegeName.includes('iiit') || collegeName.includes('bits')) {
        return studentPercentage >= 80 ? 'Good Match' : studentPercentage >= 70 ? 'Reach' : 'Competitive';
    }

    if (collegeName.includes('state') || collegeName.includes('government')) {
        return studentPercentage >= 60 ? 'Good Match' : 'Competitive';
    }

    return 'Good Match'; // Default for private colleges
};

// Function to save recommendations to storage (optional - for persistence)
export const saveRecommendations = (recommendations, userPreferences) => {
    try {
        const data = {
            recommendations,
            userPreferences,
            academicLevel: analyzeAcademicLevel(userPreferences.academicPercentage),
            timestamp: new Date().toISOString()
        };

        // Use in-memory storage since localStorage isn't available in artifacts
        window.collegeRecommendations = data;
        return true;
    } catch (error) {
        console.error("Error saving recommendations:", error);
        return false;
    }
};

// Function to get saved recommendations
export const getSavedRecommendations = () => {
    try {
        return window.collegeRecommendations || null;
    } catch (error) {
        console.error("Error retrieving saved recommendations:", error);
        return null;
    }
};

// Function to get academic insights for the student
export const getAcademicInsights = (academicPercentage) => {
    const level = analyzeAcademicLevel(academicPercentage);

    const insights = {
        level,
        percentage: academicPercentage,
        recommendations: [],
        eligibleExams: [],
        improvementTips: []
    };

    if (academicPercentage >= 90) {
        insights.recommendations.push("You're in the top tier! Apply to IITs, AIIMS, and top international universities.");
        insights.eligibleExams.push("JEE Advanced", "NEET All India", "SAT/ACT for top US universities");
    } else if (academicPercentage >= 80) {
        insights.recommendations.push("Great academic performance! Target NITs, IIITs, and good international options.");
        insights.eligibleExams.push("JEE Main", "NEET", "State entrance exams");
    } else if (academicPercentage >= 70) {
        insights.recommendations.push("Good performance! Focus on state universities and reputable private colleges.");
        insights.eligibleExams.push("State CETs", "Private university entrances");
    } else if (academicPercentage >= 60) {
        insights.recommendations.push("Consider improving your performance alongside applying to accessible institutions.");
        insights.eligibleExams.push("Management quota admissions", "Private university direct admissions");
        insights.improvementTips.push("Consider additional coaching", "Focus on improvement programs");
    } else {
        insights.recommendations.push("Focus on improvement first, then consider open universities and foundation programs.");
        insights.improvementTips.push("Join improvement/bridge courses", "Consider distance learning options", "Focus on skill development");
    }

    return insights;
};