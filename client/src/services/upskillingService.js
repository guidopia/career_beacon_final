import { chatCompletion } from '../api/openai.js';
import { apiAxios } from '../api/index.js';

// Curriculum prompt — OpenAI handles curriculum structure (its strength).
// Resources are intentionally OMITTED here: Perplexity fills them per module
// with real, verified URLs from live web search.
const learningPathPrompt = `
You are an expert curriculum designer. Generate a learning path for any skill with exactly 6 modules that build progressively from fundamentals to advanced application.

For each module provide:
1. Title — clear, specific (avoid generic "Introduction to X")
2. Description — 2-3 sentences on what is covered and why it matters
3. Learning Objectives — exactly 3 specific, measurable outcomes
4. Duration — realistic time estimate (e.g. "5-7 hours")
5. Key Points — 4 important concepts to internalise
6. Practical Task — ONE concrete hands-on task or mini-project
7. Tips — exactly 2 pieces of advice for success

Guidelines:
- Module 1 = foundations, Module 6 = real-world application / portfolio piece
- Each module builds on the previous one
- Include practical, hands-on components throughout
- Focus on industry-relevant skills

Return ONLY a JSON object with this exact shape (no markdown, no commentary):
{
  "skill": "Skill Name",
  "totalDuration": "X weeks",
  "modules": [
    {
      "title": "Module Title",
      "description": "Detailed description",
      "objectives": ["Objective 1", "Objective 2", "Objective 3"],
      "duration": "X hours",
      "keyPoints": ["Point 1", "Point 2", "Point 3", "Point 4"],
      "practicalTask": "Specific task description",
      "tips": ["Tip 1", "Tip 2"]
    }
  ]
}
`;

const quizPrompt = `
You are an expert quiz generator for educational content. Generate a comprehensive quiz with exactly 10 multiple-choice questions.

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

Make questions progressively challenging and cover key concepts thoroughly.
`;

const validateLearningPathStructure = (data) => {
  if (!data || typeof data !== 'object') return false;
  if (!data.skill || !Array.isArray(data.modules)) return false;
  if (data.modules.length === 0) return false;
  for (const m of data.modules) {
    if (!m || typeof m !== 'object') return false;
    if (!m.title || !m.description) return false;
  }
  return true;
};

const tryParseJSON = (text) => {
  if (!text || typeof text !== 'string') return null;
  const cleaned = text.replace(/```json\s*([\s\S]*?)```/i, '$1').replace(/```\s*([\s\S]*?)```/i, '$1').trim();
  try { return JSON.parse(cleaned); } catch {}
  const match = cleaned.match(/\{[\s\S]*\}/);
  if (match) {
    try { return JSON.parse(match[0]); } catch {}
  }
  return null;
};

// Fetch real, web-searched video + articles for ONE module via Perplexity
const fetchModuleResources = async (skill, moduleTitle, moduleDescription) => {
  try {
    const response = await apiAxios('/api/perplexity/module-resources', {
      method: 'POST',
      data: { skill, moduleTitle, moduleDescription },
      timeout: 120_000,
    });
    return response?.data?.resources || { video: null, articles: [] };
  } catch (error) {
    console.error(`Failed to fetch Perplexity resources for "${moduleTitle}":`, error?.message || error);
    return { video: null, articles: [] };
  }
};

// Enrich every module in the path in parallel. Always returns the path
// (with `resources` populated where lookup succeeded).
const enrichModulesWithResources = async (skill, path) => {
  if (!path?.modules?.length) return path;
  const results = await Promise.all(
    path.modules.map((m) => fetchModuleResources(skill, m.title, m.description))
  );
  const enriched = path.modules.map((m, i) => ({
    ...m,
    resources: results[i] || { video: null, articles: [] },
  }));
  return { ...path, modules: enriched };
};

// MAIN: hybrid learning path generator
// Step 1: OpenAI returns the curriculum structure (titles, objectives, tasks, etc.)
// Step 2: Perplexity (in parallel, per module) finds real videos + articles
export const generateLearningPath = async (skill) => {
  // 1) Curriculum structure from OpenAI
  const response = await chatCompletion(
    [
      { role: 'system', content: learningPathPrompt },
      { role: 'user', content: `Generate a structured learning path for: ${skill}` },
    ],
    'gpt-4o-mini',
    0.3,
    3000
  );

  if (typeof response !== 'string' || response.trim() === '') {
    throw new Error('Empty response from curriculum API');
  }

  const parsed = tryParseJSON(response);
  if (!parsed || !validateLearningPathStructure(parsed)) {
    console.error('Invalid learning path structure:', parsed);
    throw new Error('Failed to parse learning path response');
  }

  // 2) Resource enrichment via Perplexity (parallel)
  const enriched = await enrichModulesWithResources(skill, parsed);
  return enriched;
};

export const generateQuiz = async (moduleName) => {
  const response = await chatCompletion(
    [
      { role: 'system', content: quizPrompt },
      { role: 'user', content: `Generate a quiz for the module: ${moduleName}` },
    ],
    'gpt-4o-mini',
    0.3,
    3000
  );

  if (typeof response !== 'string' || !response.trim()) {
    throw new Error('Empty response from quiz API');
  }

  const parsed = tryParseJSON(response);
  if (!parsed) throw new Error('Failed to parse quiz response');
  return parsed;
};

export const evaluateQuiz = async (moduleName, questions, userAnswers) => {
  const response = await chatCompletion(
    [
      {
        role: 'system',
        content: `You are a quiz evaluator. Evaluate the answers and return in this format:
Score: X/10 (X correct out of 10)

Feedback:
[For each incorrect answer, provide:
- Question number
- The user's incorrect answer
- The correct answer
- A brief explanation why]

If all answers are correct, include an encouraging message.`,
      },
      {
        role: 'user',
        content: `Evaluate quiz answers for ${moduleName}:\n${JSON.stringify({ questions, userAnswers })}`,
      },
    ],
    'gpt-4o-mini',
    0.3,
    1500
  );

  if (typeof response !== 'string') {
    throw new Error('Invalid response format from API');
  }
  return response;
};
