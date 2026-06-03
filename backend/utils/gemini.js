const { GoogleGenerativeAI } = require('@google/generative-ai');

// Validate API key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY is not configured in environment variables');
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

async function generateFutureMeCard(data) {
  try {
    // Handle both old format (answers) and new format (onboardingData)
    const inputData = data.onboardingData || data.answers || data;

    if (!inputData || typeof inputData !== 'object') {
      throw new Error('Invalid input data format');
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

    // Create a comprehensive prompt based on onboarding data
    const prompt = `
Based on the following student profile from onboarding:

Student Type: ${inputData.studentType}
Academic Level: ${inputData.schoolClass || inputData.collegeYear || 'Not specified'}
Field of Study: ${inputData.schoolStream || inputData.collegeDegree || inputData.otherDegree || 'Not specified'}
Strongest Areas/Strengths: ${JSON.stringify(inputData.strongestAreas || inputData.strengths || [])}
Learning Preferences: ${JSON.stringify(inputData.learningFormats || inputData.learningPreference || [])}
Motivation: ${inputData.motivation || 'Not specified'}
Future Excitement/Lifestyle: ${inputData.futureExcitement || inputData.lifestyle || 'Not specified'}
Career Goals: ${JSON.stringify(inputData.careerGoals || [])}
Industries of Interest: ${JSON.stringify(inputData.industries || [])}
Joining Reason: ${inputData.joiningReason} ${inputData.otherReason ? '- ' + inputData.otherReason : ''}

Create a personalized "Future Me" career card with:
- Future Role: A specific job title that matches their interests and field (e.g., "Senior UX Designer", "Data Scientist", "Product Manager")
- Tagline: A 2-3 words An inspiring one-liner about their future career
- Skills: A list of 4-5 relevant technical and soft skills they should develop
- Mentors: 2-3 realistic mentor types or role models they should connect with
- Mindset: A 2-3 words A motivational mindset description that reflects their personality and goals
- Salary: A realistic salary range for their target role and location (in INR or USD)
- Key Skills: 3-4 core competencies for their chosen field
- CTA (Call to Action): Specific next steps they should take to achieve this future

Make it inspiring, realistic, and tailored to Indian students. Output as JSON only.
Required format:
{
  "futureRole": "string",
  "tagline": "string", 
  "skills": ["skill1", "skill2", "skill3", "skill4"],
  "mentors": ["mentor1", "mentor2", "mentor3"],
  "mindset": "string",
  "salary": "string",
  "keySkills": ["skill1", "skill2", "skill3"],
  "cta": "string"
}`;

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

      // Map skills to tags for consistency with frontend
      const mappedResponse = {
        ...parsedResponse,
        tags: parsedResponse.skills || parsedResponse.tags || []
      };
      
      return mappedResponse;
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', text);
      throw new Error('Invalid JSON response from Gemini API');
    }
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error(`Failed to generate Future Me card: ${error.message}`);
  }
}

module.exports = { generateFutureMeCard };
//whats error
