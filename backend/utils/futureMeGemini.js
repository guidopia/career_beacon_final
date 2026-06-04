const { generateFutureMeFromPrompt } = require('./futureMeOpenai');

async function generateFutureMeFromStepper(stepperData) {
  try {
    const { answers } = stepperData;

    if (!answers || typeof answers !== 'object') {
      throw new Error('Invalid stepper data format');
    }

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

    return await generateFutureMeFromPrompt(prompt, { strictArrays: true });
  } catch (error) {
    throw new Error(`Failed to generate Future Me card from stepper: ${error.message}`);
  }
}

module.exports = { generateFutureMeFromStepper };
