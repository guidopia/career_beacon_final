import { apiAxios } from '../api/index.js';

/** OpenAI proxy can take a long time on cold starts / large completions — avoid short client timeouts in deployment. */
const OPENAI_PROXY_TIMEOUT_MS = 120_000;

// Quiz generation prompt - moved from index.js
const quizPrompt = `You are an expert quiz generator for educational content. Generate a comprehensive quiz with exactly 10 multiple-choice questions.

For each question, provide:
- Clear, concise question text
- 4 answer options (A, B, C, D)
- Correct answer
- Brief explanation

Format your response as valid JSON:
{
  "questions": [
    {
      "id": 1,
      "question": "Question text here?",
      "options": {
        "A": "Option A",
        "B": "Option B", 
        "C": "Option C",
        "D": "Option D"
      },
      "correctAnswer": "A",
      "explanation": "Brief explanation of why this is correct"
    }
  ]
}

Make questions progressively challenging and cover key concepts thoroughly.`;

// OpenAI API proxy functions
export const generateQuiz = async (moduleName) => {
  try {
    const response = await apiAxios('/api/openai/generate-quiz', {
      method: 'POST',
      data: {
        moduleName,
        quizPrompt
      },
      timeout: OPENAI_PROXY_TIMEOUT_MS,
    });

    return response.data.quiz;
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw error;
  }
};

export const evaluateQuiz = async (moduleName, questions, userAnswers) => {
  try {
    const response = await apiAxios('/api/openai/evaluate-quiz', {
      method: 'POST',
      data: {
        moduleName,
        questions,
        userAnswers
      },
      timeout: OPENAI_PROXY_TIMEOUT_MS,
    });

    return response.data.evaluation;
  } catch (error) {
    console.error("Error evaluating quiz:", error);
    throw error;
  }
};

export const getRecommendedResources = async (skill) => {
  try {
    const response = await apiAxios('/api/openai/recommend-resources', {
      method: 'POST',
      data: {
        skill
      },
      timeout: OPENAI_PROXY_TIMEOUT_MS,
    });

    return response.data.resources;
  } catch (error) {
    console.error("Error getting resources:", error);
    throw error;
  }
};

// Generic chat completion function
export const chatCompletion = async (messages, model = 'gpt-3.5-turbo', temperature = 0.3, max_tokens = 4000) => {
  try {
    const response = await apiAxios('/api/openai/chat', {
      method: 'POST',
      data: {
        messages,
        model,
        temperature,
        max_tokens
      },
      timeout: OPENAI_PROXY_TIMEOUT_MS,
    });

    // Check if response has the expected structure
    if (!response.data || typeof response.data.content !== 'string') {
      console.error("Invalid response structure:", response.data);
      throw new Error("Invalid response format from backend");
    }

    return response.data.content;
  } catch (error) {
    console.error("Error in chat completion:", error);
    
    // If it's an axios error, provide more specific error information
    if (error.response) {
      console.error("Backend error response:", error.response.data);
      throw new Error(`Backend error: ${error.response.data.message || error.response.data.error || 'Unknown error'}`);
    } else if (error.request) {
      console.error("Network error:", error.request);
      throw new Error("Network error: Unable to connect to backend");
    } else {
      console.error("Request setup error:", error.message);
      throw new Error(`Request error: ${error.message}`);
    }
  }
};