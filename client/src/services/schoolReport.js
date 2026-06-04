import { chatCompletion } from '../api/openai.js';
import expandedSchoolQuestions from '../data/expandedSchoolQuestions-Updated';

// ─── Storage keys (school-only — never collide with college keys) ────────────
const STORAGE_KEYS = {
  CAREER_REPORT: 'schoolCareerReport',
  MARKET_INSIGHTS: 'schoolMarketInsights',
  LEARNING_PATHS: 'schoolLearningPaths',
  FOREIGN_STUDIES: 'schoolForeignStudies',
  APTITUDE: 'schoolAptitude',
};

// ─── Aptitude scoring (deterministic, instant) ────────────────────────────────
// Maps the updated aptitude block (Q61–Q90) into 9 display categories.
// Some questions are intentionally reused across buckets so the report can show
// richer coverage without changing the underlying generation flow.
const APTITUDE_BUCKETS = [
  { key: 'attention', name: 'Attention to Details', ids: [64, 65, 73, 74, 79] },
  { key: 'problem', name: 'Problem Solving', ids: [62, 63, 67, 72, 77] },
  { key: 'spatial', name: 'Spatial Reasoning', ids: [65, 85, 88, 90] },
  { key: 'numerical', name: 'Numerical Reasoning', ids: [61, 64, 67, 68, 69, 70] },
  { key: 'logical', name: 'Logical Thinking', ids: [71, 73, 76, 78, 79, 80] },
  { key: 'verbal', name: 'Verbal Reasoning', ids: [71, 72, 74, 76, 77] },
  { key: 'abstract', name: 'Abstract Reasoning', ids: [81, 82, 83, 84, 86, 87] },
  { key: 'mechanical', name: 'Mechanical Reasoning', ids: [61, 62, 63, 67, 70] },
  { key: 'speed', name: 'Speed and Accuracy', ids: [64, 66, 68, 69, 82, 84, 89] },
];

// Quick lookup: question id → answer index in `answers` array (id is 1-based, index is 0-based).
const idToIndex = (id) => id - 1;

const cleanReportContent = (content = '') =>
  content.replace(/#/g, '').replace(/\*/g, '').replace(/`/g, '');

const looksLikeValidCareerProfile = (text = '') => {
  const t = (text || '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const hasSections =
    /^\s*1\.\s+/m.test(t) &&
    /^\s*2\.\s+/m.test(t) &&
    /^\s*3\.\s+/m.test(t) &&
    /^\s*4\.\s+/m.test(t) &&
    /^\s*5\.\s+/m.test(t);

  const hasOptions =
    /Option\s*1\s*:/i.test(t) && /Option\s*2\s*:/i.test(t) && /Option\s*3\s*:/i.test(t);

  // Next steps should include 1–5 lines INSIDE section 5, not necessarily globally unique.
  const hasNextStepsLines =
    /^\s*1\.\s*Immediate academic focus areas\s*:/im.test(t) &&
    /^\s*2\.\s*Extracurricular activities to join\s*:/im.test(t) &&
    /^\s*3\.\s*Skills to develop\s*:/im.test(t) &&
    /^\s*4\.\s*Resources and courses to explore\s*:/im.test(t) &&
    /^\s*5\.\s*Steps to discuss with parents\s*:/im.test(t);

  return hasSections && hasOptions && hasNextStepsLines;
};

/**
 * Compute deterministic aptitude scores from the user's answer array.
 * Returns score buckets (0..10), top 3 strengths, and totals.
 */
export const computeAptitudeScores = (answers) => {
  const buckets = APTITUDE_BUCKETS.map((bucket) => {
    let correct = 0;
    bucket.ids.forEach((qid) => {
      const idx = idToIndex(qid);
      const userAnswer = answers?.[idx];
      const question = expandedSchoolQuestions.find((q) => q.id === qid);
      if (!question || !question.answer) return;
      if (typeof userAnswer === 'string' && userAnswer.trim() === question.answer.trim()) {
        correct += 1;
      }
    });
    const total = bucket.ids.length;
    const score = total === 0 ? 0 : Math.round((correct / total) * 10);
    return { key: bucket.key, name: bucket.name, score, correct, total };
  });

  // Overall aptitude score should reflect the 30 real aptitude questions,
  // not the overlapping bucket mappings used for display.
  const uniqueQuestionIds = [...new Set(APTITUDE_BUCKETS.flatMap((bucket) => bucket.ids))];
  const totalCorrect = uniqueQuestionIds.reduce((acc, qid) => {
    const idx = idToIndex(qid);
    const userAnswer = answers?.[idx];
    const question = expandedSchoolQuestions.find((q) => q.id === qid);
    if (!question || !question.answer) return acc;
    return typeof userAnswer === 'string' && userAnswer.trim() === question.answer.trim()
      ? acc + 1
      : acc;
  }, 0);
  const totalQuestions = uniqueQuestionIds.length;

  const topThree = [...buckets]
    .sort((a, b) => b.score - a.score || b.correct - a.correct)
    .slice(0, 3);

  return { buckets, topThree, totalCorrect, totalQuestions };
};

// ─── Helpers to format question/answer pairs for the AI ──────────────────────
// Feed only the relevant question subset to each prompt to keep input small.
const formatAnswersForRange = (answers, idRanges) => {
  const ids = new Set();
  idRanges.forEach(([start, end]) => {
    for (let i = start; i <= end; i += 1) ids.add(i);
  });

  return expandedSchoolQuestions
    .filter((q) => ids.has(q.id))
    .map((q) => {
      const idx = idToIndex(q.id);
      const answer = answers?.[idx] ?? '';
      return `Q${q.id} (${q.category}): ${q.question}\nAnswer: ${answer}`;
    })
    .join('\n\n');
};

// Career profile needs the full context (except aptitude Q61–Q90).
// Too much trimming makes the output feel generic/short.
const PROFILE_RANGES = [[1, 60]];
// Career-specific situational + preferences (Q51–Q60) + academics
const MARKET_RANGES = [[1, 25], [51, 60]];
const PATHWAYS_RANGES = [[1, 25], [51, 60]];
const FOREIGN_RANGES = [[1, 25], [51, 60]];

// ─── Prompts ──────────────────────────────────────────────────────────────────

// Keep this prompt closely aligned to the proven v1 school prompt style,
// so the Career Profile tab stays rich and structured like before.
const careerProfilePrompt = `
You are an expert career counselor specializing in guiding school students (grades 8-12) in India. Your task is to analyze responses from a comprehensive career assessment and generate a detailed, personalized career report.

CRITICAL FORMATTING INSTRUCTIONS:
- Use exactly this structure and format
- Each section must be separated by exactly two line breaks
- Career options must follow the exact format shown below
 - Avoid repeating content that belongs in other tabs:
   - Do NOT list Indian colleges in detail (that is handled in Learning Paths)
   - Do NOT do market trend deep-dives (that is handled in Market Insights)
   - Keep stream/exam mentions brief and personalized

Structure the report with exactly these 5 sections:

1. Your Personal Career Profile

Write 2-3 detailed paragraphs about their unique profile based on their specific responses. Analyze their interests, strengths, personality traits, and academic preferences. Connect their current grade to immediate educational decisions.

2. Top 3 Career Matches for You

Option 1: [Career Title]
- Alignment with Your Profile: [Explain why this matches their specific responses]
- Day-to-Day Activities: [What they'll actually do in this career]
- Educational Path: [Specific stream, subjects, entrance exams for India]
- Growth Opportunities: [Career progression and scope in India]
- Why It's Perfect for You: [Personal connection to their goals and interests]

Option 2: [Career Title]
- Alignment with Your Profile: [Explain why this matches their specific responses]
- Day-to-Day Activities: [What they'll actually do in this career]
- Educational Path: [Specific stream, subjects, entrance exams for India]
- Growth Opportunities: [Career progression and scope in India]
- Why It's Perfect for You: [Personal connection to their goals and interests]

Option 3: [Career Title]
- Alignment with Your Profile: [Explain why this matches their specific responses]
- Day-to-Day Activities: [What they'll actually do in this career]
- Educational Path: [Specific stream, subjects, entrance exams for India]
- Growth Opportunities: [Career progression and scope in India]
- Why It's Perfect for You: [Personal connection to their goals and interests]

3. Your Academic Action Plan

Write detailed paragraphs about:
- Analysis of their favorite and challenging subjects
- Specific strategies to improve in areas critical to their career goals
- Recommended extracurricular activities based on their interests
- Skill development opportunities for Indian students

4. Educational Pathway Tailored for You

Write detailed paragraphs about:
- Recommended stream (Science/Commerce/Arts) based on their responses
- Specific subject combinations for their career goals
- Timeline of important academic decisions
- Relevant entrance exams and preparation strategies for India

5. Your Next Steps (Immediate Actions)

Write specific, actionable steps they can take in the next 3-6 months.

CRITICAL (do not skip):
- Include EXACTLY 5 numbered lines inside this section, numbered 1. through 5.
- Each line must be 1–2 sentences, specific and personalized.
- Use this template:
  1. Immediate academic focus areas: ...
  2. Extracurricular activities to join: ...
  3. Skills to develop: ...
  4. Resources and courses to explore: ...
  5. Steps to discuss with parents: ...

IMPORTANT: Base everything on their specific assessment responses. Avoid generic advice.

Now, based on the following career assessment responses, generate a comprehensive career report:
`;

const marketInsightsPrompt = `
You are a career guidance expert for Indian school students. Analyze the student's responses and provide career opportunities insights.

Generate a structured response with these UPPERCASE section headers (no markdown):

CAREER EXPLORATION
- 3–4 career fields that match their interests and strengths (numbered)
- Brief description of what each field involves
- Why each field suits their personality

STREAM SELECTION IMPACT
- How Science / Commerce / Arts affects career options
- Specific career paths in each stream relevant to their interests
- Long-term implications of stream choice

SKILL DEVELOPMENT OPPORTUNITIES
- Early skills they can develop in school
- Online platforms and courses suitable for their age
- Extracurriculars that build relevant skills
- Weekend workshops or camps they can attend

FUTURE SCOPE
- Growth potential in their areas of interest
- Emerging career opportunities in the next 5–10 years
- International opportunities in their preferred fields

Base everything on their specific responses.
`;

const learningPathsPrompt = `
You are an education counselor for Indian school students. Provide detailed educational guidance focused primarily on India.

Generate a structured response with these UPPERCASE section headers (no markdown):

COLLEGE RECOMMENDATIONS
- 8–10 top Indian colleges/universities for their career interests (numbered "1.", "2.", ...)
- Mix of government and private (government / private label in parentheses)
- 1-line "why this fits" per college

ENTRANCE EXAM GUIDANCE
- Relevant Indian entrance exams (JEE, NEET, CLAT, CUET, etc.)
- Pattern + preparation timeline
- Recommended prep strategies and resources
- Backup options

SUBJECT COMBINATIONS
- Optimal subject combinations for their stream
- How subject choices affect college and career options
- Electives that give an edge
- Subjects to focus on for entrance exams

PREPARATION ROADMAP
- Year-wise plan from current grade to college
- Important milestones and deadlines
- Study schedule suggestions
- Resources for self-study and coaching

Base everything on their grade, interests, and goals.
`;

const foreignStudiesPrompt = `
You are an experienced international education counselor for Indian school students (grades 8–12) who want to study abroad. Your job is to give a SUBTLE but practical foreign-study plan that fits THIS student. No hype. No generic lists. Tailor everything to their interests and grade.

OUTPUT FORMAT (very important):
- Use ONLY these UPPERCASE section headers (no markdown, no asterisks, no hashes):
  COUNTRIES TO CONSIDER
  UNIVERSITIES
  SCHOLARSHIPS
  TESTS
  APPLICATION TIPS
  ACTION PLAN

For each section follow these rules exactly:

COUNTRIES TO CONSIDER
- 4–6 country names separated by " · " on a single line (e.g., "USA · UK · Canada · Germany · Australia · Singapore")
- Then 1 short paragraph (2–3 sentences) on why these fit the student.

UNIVERSITIES
- 6–8 universities, numbered "1.", "2.", ... — each on its own block
- Format: "1. University Name (Country) - 1-line why-fit + suggested course"
- Mix elite (MIT, Stanford, Oxford, Cambridge etc.) and high-quality but more attainable options.

SCHOLARSHIPS
- 4–6 scholarships, numbered "1.", "2.", ...
- Format: "1. Scholarship Name - eligibility + indicative amount/coverage"

TESTS
- 4–5 standardized tests, numbered "1.", "2.", ...
- Format: "1. Test Name - 1-line tip on when/why to take it (IELTS, TOEFL, SAT, ACT, Duolingo, etc.)"

APPLICATION TIPS
- 4–6 short bullet lines starting with "- " on practical things this student should do (SOP, LOR, profile building, projects, language tests, deadlines, common mistakes).

ACTION PLAN
- Numbered 1., 2., 3. — exactly three steps mapped to short, specific timelines (e.g., "1. In the next 3 months: ...").

Be specific to their grade and interests. Keep total under ~700 words. NO markdown formatting characters.
`;

const aptitudeRecsPrompt = `
You are a learning coach for Indian school students. The student just completed an aptitude assessment with 9 skill buckets, each scored from 0 to 10. Based on their TOP 3 strongest buckets and their WEAKEST bucket, generate practical, age-appropriate suggestions.

OUTPUT FORMAT (very important):
- Use ONLY these UPPERCASE section headers (no markdown, no asterisks, no hashes):
  BOOKS
  APPS AND GAMES
  TECHNIQUES

For each section provide 4–6 short bullet lines starting with "- ".
- BOOKS: name + 1-line why (mix of beginner-friendly + slightly stretching).
- APPS AND GAMES: name + 1-line why (free or freemium preferred; include Indian and global options).
- TECHNIQUES: short habit/technique + 1-line why (e.g., spaced repetition, error log, timed drills).

BRANDING + CONSTRAINTS (important):
- Include 1 bullet that recommends using Guidopia / Career Beacon resources (as the home base).
- Prefer smaller, high-signal tools and platforms; avoid big coaching/edtech giants and overly commercial brands (e.g., Byju’s).
- If you mention tools like Photomath, position them as "for checking steps + learning", not as a crutch.

Tailor at least half the suggestions to STRENGTHEN the WEAKEST bucket and the rest to LEVEL UP the TOP 3. Keep total under ~250 words. NO markdown.
`;

// ─── Storage helpers ─────────────────────────────────────────────────────────
const saveTo = (key, payload) => {
  try {
    localStorage.setItem(
      key,
      JSON.stringify({ data: payload, timestamp: new Date().toISOString() })
    );
  } catch (err) {
    console.error('Error saving to localStorage:', key, err);
  }
};

const readFrom = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.error('Error reading localStorage:', key, err);
    return null;
  }
};

// ─── Generators ──────────────────────────────────────────────────────────────

export const generateSchoolCareerProfile = async (answers) => {
  const formatted = formatAnswersForRange(answers, PROFILE_RANGES);
  const baseMessages = [
    { role: 'system', content: careerProfilePrompt },
    {
      role: 'user',
      content: `Student responses:\n\n${formatted}\n\nReturn the report in the exact 5-section format above.`,
    },
  ];

  // gpt-4o-mini supports up to 16k completion tokens, so we never hit the 4096 cap.
  let response = await chatCompletion(baseMessages, 'gpt-4o-mini', 0.7, 5000);
  let cleaned = cleanReportContent(response);

  // Attempt 2 (repair) — if titles/structure are missing, rewrite the draft into the exact format.
  if (!looksLikeValidCareerProfile(cleaned)) {
    const repairSystem = `
You are a strict formatter. Rewrite the draft into the EXACT required format.
Non-negotiable:
- Must include sections 1–5 with "1. ...", "2. ...", etc.
- Must include Option 1/2/3 with a clear Career Title in each.
- Section 5 must include the 5 numbered Next Steps lines 1–5 using the exact template labels.
- Do NOT add markdown or extra headings.
`;
    response = await chatCompletion(
      [
        { role: 'system', content: `${careerProfilePrompt}\n\n${repairSystem}` },
        { role: 'user', content: `Draft to repair:\n\n${cleaned}\n\nRewrite now.` },
      ],
      'gpt-4o-mini',
      0.3,
      5000
    );
    cleaned = cleanReportContent(response);
  }

  saveTo(STORAGE_KEYS.CAREER_REPORT, cleaned);
  return cleaned;
};

export const generateSchoolMarketInsights = async (answers) => {
  const formatted = formatAnswersForRange(answers, MARKET_RANGES);
  const response = await chatCompletion(
    [
      { role: 'system', content: marketInsightsPrompt },
      {
        role: 'user',
        content: `Generate market insights for this school student. Responses:\n\n${formatted}`,
      },
    ],
    'gpt-4o-mini',
    0.7,
    3000
  );
  const cleaned = cleanReportContent(response);
  saveTo(STORAGE_KEYS.MARKET_INSIGHTS, cleaned);
  return cleaned;
};

export const generateSchoolLearningPaths = async (answers) => {
  const formatted = formatAnswersForRange(answers, PATHWAYS_RANGES);
  const response = await chatCompletion(
    [
      { role: 'system', content: learningPathsPrompt },
      {
        role: 'user',
        content: `Generate Indian-focused learning pathways for this school student. Responses:\n\n${formatted}`,
      },
    ],
    'gpt-4o-mini',
    0.7,
    3000
  );
  const cleaned = cleanReportContent(response);
  saveTo(STORAGE_KEYS.LEARNING_PATHS, cleaned);
  return cleaned;
};

export const generateSchoolForeignStudies = async (answers) => {
  const formatted = formatAnswersForRange(answers, FOREIGN_RANGES);
  const response = await chatCompletion(
    [
      { role: 'system', content: foreignStudiesPrompt },
      {
        role: 'user',
        content: `Generate a tailored foreign-study plan for this school student. Responses:\n\n${formatted}`,
      },
    ],
    'gpt-4o-mini',
    0.7,
    3000
  );
  const cleaned = cleanReportContent(response);
  saveTo(STORAGE_KEYS.FOREIGN_STUDIES, cleaned);
  return cleaned;
};

/**
 * Tiny prompt — fed only the computed score summary, not the raw answers.
 * Tight max_tokens keeps this call the fastest of the five.
 */
export const generateAptitudeRecommendations = async (scoreSummary) => {
  const summary = scoreSummary.buckets
    .map((b) => `${b.name}: ${b.score}/10`)
    .join('\n');
  const top = scoreSummary.topThree.map((b) => b.name).join(', ');
  const weakest = [...scoreSummary.buckets].sort((a, b) => a.score - b.score)[0]?.name;

  const response = await chatCompletion(
    [
      { role: 'system', content: aptitudeRecsPrompt },
      {
        role: 'user',
        content: `Aptitude scores (0–10):\n${summary}\n\nTop 3 strengths: ${top}\nWeakest bucket: ${weakest}\n\nGenerate the BOOKS / APPS AND GAMES / TECHNIQUES sections.`,
      },
    ],
    'gpt-4o-mini',
    0.6,
    1500
  );
  return cleanReportContent(response);
};

// ─── Static fallback for aptitude recs (used if AI call fails) ────────────────
export const APTITUDE_FALLBACK_RECS = `BOOKS
- "How to Solve It" by G. Polya - timeless problem-solving frameworks for students
- "Quantitative Aptitude" by R.S. Aggarwal - strong drill book for numerical practice
- "A Mind for Numbers" by Barbara Oakley - practical learning techniques for math/STEM
- "Thinking, Fast and Slow" by Daniel Kahneman - improves logical decision-making

APPS AND GAMES
- Guidopia / Career Beacon - use as your home base for guidance + next-step planning
- Brilliant - bite-sized lessons in math, logic, and reasoning
- Khan Academy - free, structured practice across school subjects
- Photomath - check steps to learn patterns (use after you attempt on your own)
- Sudoku and chess apps - low-effort consistent pattern + strategy practice

TECHNIQUES
- Spaced repetition (Anki) - revisit weak concepts 1, 3, 7, 14 days apart
- Error log - keep a notebook of every mistake and re-attempt weekly
- Timed drills - 10 questions in 10 minutes to build speed + accuracy
- Teach-back method - explain a concept aloud as if teaching a friend
`;

// ─── Saved-view getters ─────────────────────────────────────────────────────
export const getSavedSchoolCareerReport = () => readFrom(STORAGE_KEYS.CAREER_REPORT);
export const getSavedSchoolMarketInsights = () => readFrom(STORAGE_KEYS.MARKET_INSIGHTS);
export const getSavedSchoolLearningPaths = () => readFrom(STORAGE_KEYS.LEARNING_PATHS);
export const getSavedSchoolForeignStudies = () => readFrom(STORAGE_KEYS.FOREIGN_STUDIES);
export const getSavedSchoolAptitude = () => readFrom(STORAGE_KEYS.APTITUDE);

export const saveSchoolAptitude = (payload) => saveTo(STORAGE_KEYS.APTITUDE, payload);

export { STORAGE_KEYS as SCHOOL_REPORT_KEYS };
