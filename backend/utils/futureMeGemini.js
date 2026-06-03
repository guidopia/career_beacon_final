const { GoogleGenerativeAI } = require('@google/generative-ai');

// Validate API key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY is not configured in environment variables');
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

async function generateFutureMeFromStepper(stepperData) {
  try {
    const { answers } = stepperData;

    if (!answers || typeof answers !== 'object') {
      throw new Error('Invalid stepper data format');
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    });

    // Create a detailed prompt based on stepper answers
    const prompt = `
You are a career guidance expert specializing in helping students discover their future career paths. 
Based on the following student preferences from the Future Me Stepper assessment:

1. What excites them most: ${answers.excitement}
   - This reveals their core motivation and passion
   - Consider how this excitement can translate into a career

2. Favorite subject: ${answers.subject}
   - This indicates their academic strengths
   - Think about careers that leverage this subject knowledge

3. Preferred work style: ${answers.workStyle}
   - This shows their ideal work environment
   - Consider roles that match this work style

4. Dream impact: ${answers.impact}
   - This reveals their values and goals
   - Think about careers that can achieve this impact

5. Skill they want to master: ${answers.skill}
   - This indicates their desired expertise
   - Consider roles that require and value this skill

Create a personalized "Future Me" career card that:
1. Aligns with their interests and preferences
2. Is realistic and achievable
3. Has growth potential
4. Is relevant to the Indian job market
5. Combines their different preferences into a cohesive career path

Required output format (JSON):
{
  "futureRole": "string (specific job title)",
  "tagline": "string (inspiring 2-3 word phrase)",
  "skills": ["skill1", "skill2", "skill3", "skill4", "skill5"],
  "mentors": ["mentor1", "mentor2", "mentor3"],
  "mindset": "string (2-3 word motivational mindset)",
  "salary": "string (realistic salary range in INR)",
  "keySkills": ["skill1", "skill2", "skill3", "skill4"],
  "cta": "string (specific next steps)"
}

Guidelines for each field:
- futureRole: Be specific (e.g., "Senior UX Designer" not just "Designer")
- tagline: Make it inspiring and memorable
- skills: Mix of technical and soft skills
- mentors: Include both industry leaders and practical mentors
- mindset: Reflect their personality and goals
- salary: Realistic for Indian market with growth potential
- keySkills: Core competencies for their chosen field
- cta: Actionable next steps they can take now

Make the response inspiring yet practical, focusing on how their preferences can lead to a fulfilling career.`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });

    const response = await result.response;
    let text = response.text();

    // Clean the response
    text = text.replace(/```json\n?|\n?```/g, '').trim();

    try {
      const parsedResponse = JSON.parse(text);

      // Validate required fields
      const requiredFields = ['futureRole', 'tagline', 'skills', 'mentors', 'mindset', 'salary', 'keySkills', 'cta'];
      const missingFields = requiredFields.filter(field => !parsedResponse[field]);

      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Add additional validation for array fields
      if (!Array.isArray(parsedResponse.skills) || parsedResponse.skills.length < 4) {
        throw new Error('Skills must be an array with at least 4 items');
      }
      if (!Array.isArray(parsedResponse.mentors) || parsedResponse.mentors.length < 2) {
        throw new Error('Mentors must be an array with at least 2 items');
      }
      if (!Array.isArray(parsedResponse.keySkills) || parsedResponse.keySkills.length < 3) {
        throw new Error('Key skills must be an array with at least 3 items');
      }

      return parsedResponse;
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', text);
      throw new Error('Invalid JSON response from Gemini API');
    }
  } catch (error) {
    console.error('Future Me Stepper Gemini API error:', error);
    throw new Error(`Failed to generate Future Me card from stepper: ${error.message}`);
  }
}

module.exports = { generateFutureMeFromStepper }; 