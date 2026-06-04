const axios = require('axios');

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const FUTURE_ME_MODEL = process.env.FUTURE_ME_OPENAI_MODEL || 'gpt-4o-mini';

const REQUIRED_FIELDS = [
  'futureRole',
  'tagline',
  'skills',
  'mentors',
  'mindset',
  'salary',
  'keySkills',
  'cta',
];

async function callOpenAIForFutureMe(prompt) {
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured in environment variables');
  }

  const response = await axios.post(
    OPENAI_API_URL,
    {
      model: FUTURE_ME_MODEL,
      messages: [
        {
          role: 'system',
          content:
            'You are a career guidance expert for Indian students. Return only valid JSON matching the requested schema. No markdown or extra text.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 1024,
      response_format: { type: 'json_object' },
    },
    {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      timeout: 60000,
    }
  );

  const text = response.data?.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error('Empty response from OpenAI API');
  }
  return text;
}

function parseFutureMeResponse(text, { strictArrays = false, mapSkillsToTags = false } = {}) {
  const cleaned = text.replace(/```json\n?|\n?```/g, '').trim();

  let parsedResponse;
  try {
    parsedResponse = JSON.parse(cleaned);
  } catch (parseError) {
    console.error('Failed to parse OpenAI response:', cleaned);
    throw new Error('Invalid JSON response from OpenAI API');
  }

  const missingFields = REQUIRED_FIELDS.filter((field) => !parsedResponse[field]);
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }

  if (strictArrays) {
    if (!Array.isArray(parsedResponse.skills) || parsedResponse.skills.length < 4) {
      throw new Error('Skills must be an array with at least 4 items');
    }
    if (!Array.isArray(parsedResponse.mentors) || parsedResponse.mentors.length < 2) {
      throw new Error('Mentors must be an array with at least 2 items');
    }
    if (!Array.isArray(parsedResponse.keySkills) || parsedResponse.keySkills.length < 3) {
      throw new Error('Key skills must be an array with at least 3 items');
    }
  }

  if (mapSkillsToTags) {
    return {
      ...parsedResponse,
      tags: parsedResponse.skills || parsedResponse.tags || [],
    };
  }

  return parsedResponse;
}

async function generateFutureMeFromPrompt(prompt, options) {
  try {
    const text = await callOpenAIForFutureMe(prompt);
    return parseFutureMeResponse(text, options);
  } catch (error) {
    console.error('OpenAI Future Me error:', error.message);
    throw error;
  }
}

module.exports = {
  generateFutureMeFromPrompt,
  parseFutureMeResponse,
};
