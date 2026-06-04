const { generateFutureMeFromPrompt } = require('./futureMeOpenai');

async function generateFutureMeCard(data) {
  try {
    const inputData = data.onboardingData || data.answers || data;

    if (!inputData || typeof inputData !== 'object') {
      throw new Error('Invalid input data format');
    }

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

    return await generateFutureMeFromPrompt(prompt, { mapSkillsToTags: true });
  } catch (error) {
    throw new Error(`Failed to generate Future Me card: ${error.message}`);
  }
}

module.exports = { generateFutureMeCard };
