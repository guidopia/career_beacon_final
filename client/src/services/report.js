import { chatCompletion } from '../api/openai.js';

// Enhanced career report prompts with specialized versions for school and college students
const schoolReportPrompt = `
You are an expert career counselor specializing in guiding school students (grades 8-12) in India. Your task is to analyze responses from a comprehensive career assessment and generate a detailed, personalized career report.

CRITICAL FORMATTING INSTRUCTIONS:
- Use exactly this structure and format
- Each section must be separated by exactly two line breaks
- Career options must follow the exact format shown below

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

Write specific, actionable steps they can take in the next 3-6 months:
- Immediate academic focus areas
- Extracurricular activities to join
- Skills to develop
- Resources and courses to explore
- Steps to discuss with parents

IMPORTANT: Base everything on their specific assessment responses. Avoid generic advice.

Now, based on the following career assessment responses, generate a comprehensive career report:
`;

const collegeReportPrompt = `
You are an expert career counselor specializing in guiding college students in India. Your task is to analyze responses from a comprehensive career assessment and generate a detailed, personalized career report.

CRITICAL FORMATTING INSTRUCTIONS:
- Use exactly this structure and format
- Each section must be separated by exactly two line breaks
- Career options must follow the exact format shown below

Structure the report with exactly these 5 sections:

1. Your Professional Profile Summary

Write 2-3 detailed paragraphs about their unique professional profile based on their specific responses. Analyze their educational background, technical skills, work preferences, and career motivations. Connect their current year of study to immediate opportunities.

2. Top 3 Career Pathways Recommended for You

Option 1: [Career Title]
- Alignment with Your Profile: [Why this matches their specific field of study and responses]
- Day-to-Day Responsibilities: [What they'll actually do in this role]
- Entry Path & Qualifications: [Specific steps, certifications, skills needed in India]
- Career Growth & Salary: [Realistic progression and earning potential in India]
- Market Demand: [Current opportunities and trends in Indian job market]

Option 2: [Career Title]
- Alignment with Your Profile: [Why this matches their specific field of study and responses]
- Day-to-Day Responsibilities: [What they'll actually do in this role]
- Entry Path & Qualifications: [Specific steps, certifications, skills needed in India]
- Career Growth & Salary: [Realistic progression and earning potential in India]
- Market Demand: [Current opportunities and trends in Indian job market]

Option 3: [Career Title]
- Alignment with Your Profile: [Why this matches their specific field of study and responses]
- Day-to-Day Responsibilities: [What they'll actually do in this role]
- Entry Path & Qualifications: [Specific steps, certifications, skills needed in India]
- Career Growth & Salary: [Realistic progression and earning potential in India]
- Market Demand: [Current opportunities and trends in Indian job market]

3. Personalized Skill Development Roadmap

Write detailed paragraphs about:
- Their current skill strengths based on responses
- Critical skill gaps for their target careers
- Specific Indian resources (courses, certifications, training programs)
- Practical projects and internship strategies
- Portfolio building recommendations

4. Your Career Strategy for Indian Job Market

Write detailed paragraphs about:
- Networking strategies based on their comfort level
- Company types and work environments that fit their preferences
- Location considerations (tier 2/3 cities, remote work)
- Industry events and professional communities in India
- Work-life balance in Indian corporate culture

5. Your 6-Month Action Plan

Write specific, time-bound actions organized by timeframe:
- Month 1-2: [Specific actions with deadlines]
- Month 3-4: [Specific actions with deadlines]
- Month 5-6: [Specific actions with deadlines]

Include specific courses, certifications, job applications, networking events, and skill development goals relevant to their responses.

IMPORTANT: Base everything on their specific assessment responses and Indian job market context.

Now, based on the following career assessment responses, generate a comprehensive career report:
`;

// Career Opportunities Prompts
const schoolCareerOpportunitiesPrompt = `
You are a career guidance expert for Indian school students. Analyze their assessment responses and provide detailed career opportunities insights.

Generate a structured response with these sections:

CAREER EXPLORATION
- 3-4 career fields that match their interests and strengths
- Brief description of what each field involves
- Why each field suits their personality and responses

STREAM SELECTION IMPACT
- How different streams (Science/Commerce/Arts) affect career options
- Specific career paths available in each stream relevant to their interests
- Long-term implications of stream choice

SKILL DEVELOPMENT OPPORTUNITIES
- Early skills they can develop while in school
- Online platforms and courses suitable for their age
- Extracurricular activities that build relevant skills
- Weekend workshops or camps they can attend

FUTURE SCOPE
- Growth potential in their areas of interest
- Emerging career opportunities in the next 5-10 years
- International opportunities in their preferred fields

Base everything on their specific assessment responses. Provide practical, actionable insights for Indian school students.
`;

const collegeCareerOpportunitiesPrompt = `
You are a career placement expert for Indian college students. Analyze their assessment responses and provide current job market insights.

Generate a structured response with these sections:

JOB MARKET ANALYSIS
- Current demand for their field of study in India
- Top recruiting companies in their domain
- Emerging roles and opportunities in their industry
- Market trends affecting their career prospects

SALARY INSIGHTS
- Entry-level salary ranges in their field (by city: Mumbai, Bangalore, Delhi, etc.)
- Growth trajectory: 2-year, 5-year salary expectations
- Factors that influence salary (skills, company type, location)
- Comparison with other related fields

TOP COMPANIES HIRING
- List of 8-10 companies actively hiring in their field
- Brief description of what each company offers
- Application process and requirements
- Company culture and work environment

IMMEDIATE OPPORTUNITIES
- Current internship openings relevant to their field
- Freelancing opportunities for students
- Part-time work options
- Competition and hackathons they can participate in

Base everything on their specific field of study and assessment responses. Provide current, actionable insights for Indian college students.
`;

// Educational Pathways Prompts
const schoolEducationalPathwaysPrompt = `
You are an education counselor for Indian school students. Analyze their assessment responses and provide detailed educational guidance.

Generate a structured response with these sections:

COLLEGE RECOMMENDATIONS
- 8-10 top colleges/universities for their career interests
- Include both government and private institutions
- Consider their location preferences and academic level
- Brief description of why each college suits their goals

ENTRANCE EXAM GUIDANCE
- Relevant entrance exams for their career path (JEE, NEET, CLAT, etc.)
- Exam pattern and preparation timeline
- Recommended preparation strategies and resources
- Backup options if primary exams don't work out

SUBJECT COMBINATIONS
- Optimal subject combinations for their stream
- How subject choices affect college and career options
- Elective subjects that can give them an advantage
- Subjects to focus on for entrance exam preparation

PREPARATION ROADMAP
- Year-wise academic planning from current grade to college
- Important milestones and deadlines
- Study schedule suggestions
- Resources for self-study and coaching

Base everything on their current grade, interests, and career goals from assessment responses.
`;

const collegeEducationalPathwaysPrompt = `
You are a higher education counselor for Indian college students. Analyze their assessment responses and provide advanced educational guidance.

Generate a structured response with these sections:

HIGHER EDUCATION OPTIONS
- Masters programs relevant to their field (in India and abroad)
- MBA options if applicable to their career goals
- Specialized certification programs
- Research opportunities and PhD prospects

SKILL ENHANCEMENT COURSES
- Industry-relevant certifications (Google, Microsoft, AWS, etc.)
- Online courses that add value to their profile
- Hands-on training programs and bootcamps
- Professional development workshops

INTERNATIONAL OPPORTUNITIES
- Study abroad options in their field
- Exchange programs and scholarships
- Global certifications that enhance employability
- Countries/universities known for their field

IMMEDIATE LEARNING PATH
- Courses to take in final year to improve employability
- Skills to develop during remaining college time
- Projects and portfolio building guidance
- Networking and professional development activities

Base everything on their current field of study, year of study, and career aspirations from assessment responses.
`;

// Function to determine if student is from school or college
const determineStudentLevel = (answers) => {
  if (answers[1].includes("Year") || answers[1].includes("Graduate")) {
    return "college";
  } else {
    return "school";
  }
};

// Enhanced function to format assessment responses based on student level
const formatResponses = (answers, questions) => {
  return answers
    .map((answer, index) => {
      if (index < questions.length) {
        const question = questions[index];
        return `Question: ${question}\nAnswer: ${answer}`;
      }
      return null;
    })
    .filter(item => item !== null)
    .join("\n\n");
};

// Function to prepare assessment questions based on student level
const getQuestions = (level) => {
  if (level === "school") {
    return [
      "Gender:",
      "Current Class/Grade:",
      "I like to work with my hands and build things.",
      "I enjoy solving mathematical or scientific problems.",
      "I enjoy expressing myself through art, music, or writing.",
      "I like helping others and solving social problems.",
      "I enjoy leading and persuading others.",
      "I prefer organizing tasks and working with details.",
      "I am open to new experiences and learning new things.",
      "I pay attention to detail and complete tasks efficiently.",
      "I enjoy being the center of attention and interacting with others.",
      "I am compassionate and care about others' well-being.",
      "I tend to worry or feel anxious about things easily.",
      "What do you like doing in your free time? (Select up to 2):",
      "Are you involved in any extracurricular activities?",
      "Favorite subjects (Select up to 2):",
      "Subjects you find challenging (Select up to 2):",
      "Which career fields interest you? (Select up to 3):",
      "What motivates you most in a career? (Select up to 2):",
      "Which stream are you most interested in?",
      "Do your parents influence your stream/career choice?",
      "Do you like to work independently or as part of a team?",
      "Do you prefer a structured routine or flexibility in tasks?",
      "How important is creativity in your future career?",
      "What is your main goal in life?",
    ];
  } else {
    return [
      "Gender:",
      "Current Year of Study:",
      "Your current field of study:",
      "I enjoy tasks that require analytical and logical thinking.",
      "I prefer creative problem-solving over following established procedures.",
      "I enjoy working directly with people more than working with data or things.",
      "I prefer taking leadership roles in group projects.",
      "What skills are you most confident in? (Select up to 3):",
      "What skills would you like to develop further? (Select up to 3):",
      "Which professional development activities have you participated in? (Select all that apply):",
      "What type of work environment do you prefer?",
      "What are your post-graduation plans?",
      "What sectors interest you most for employment? (Select up to 3):",
      "What factors are most important to you in a job? (Select up to 3):",
      "How prepared do you feel for your career after graduation?",
      "How important is building a personal brand/online presence to your career goals?",
      "How do you prefer to learn new skills?",
      "How comfortable are you with adapting to rapidly changing technologies?",
      "How willing are you to work in tier 2/3 cities in India?",
      "How important is working for a socially responsible organization?",
      "How do you handle feedback and criticism?",
      "How do you approach networking and building professional connections?",
      "Which emerging technologies or trends are you most interested in? (Select up to 2):",
      "How likely are you to pursue an unconventional career path?",
      "How important is having a mentor for your career development?",
    ];
  }
};

// Function to clean and format the report content
const cleanReportContent = (content) => {
  let cleanedContent = content
    .replace(/#/g, "") // Remove any hashtags
    .replace(/\*/g, "") // Remove any asterisks
    .replace(/`/g, ""); // Remove any backticks

  return cleanedContent;
};

// Function to save report to localStorage for persistence
const saveReportToStorage = (report, answers) => {
  try {
    const reportData = {
      report: report,
      answers: answers,
      timestamp: new Date().toISOString()
    };

    localStorage.setItem('careerReport', JSON.stringify(reportData));
    return true;
  } catch (error) {
    console.error("Error saving report to storage:", error);
    return false;
  }
};

// Function to save career opportunities to localStorage
const saveCareerOpportunitiesToStorage = (data, answers) => {
  try {
    const careerOpportunitiesData = {
      data: data,
      answers: answers,
      timestamp: new Date().toISOString()
    };

    localStorage.setItem('careerOpportunities', JSON.stringify(careerOpportunitiesData));
    return true;
  } catch (error) {
    console.error("Error saving career opportunities to storage:", error);
    return false;
  }
};

// Function to save educational pathways to localStorage
const saveEducationalPathwaysToStorage = (data, answers) => {
  try {
    const educationalPathwaysData = {
      data: data,
      answers: answers,
      timestamp: new Date().toISOString()
    };

    localStorage.setItem('educationalPathways', JSON.stringify(educationalPathwaysData));
    return true;
  } catch (error) {
    console.error("Error saving educational pathways to storage:", error);
    return false;
  }
};

// Main function to generate career report
export const generateReport = async (answers) => {
  try {
    // Determine if user is a school or college student
    const studentLevel = determineStudentLevel(answers);

    // Get appropriate questions based on student level
    const questions = getQuestions(studentLevel);

    // Format answers with questions
    const formattedAnswers = formatResponses(answers, questions);

    // Select appropriate prompt based on student level
    const promptTemplate = studentLevel === "school" ? schoolReportPrompt : collegeReportPrompt;

    // Call OpenAI API with the formatted data
    const response = await chatCompletion([
      {
        role: "system",
        content: promptTemplate,
      },
      {
        role: "user",
        content: `Generate a detailed and personalized career report for this ${studentLevel} student based on these assessment responses:\n\n${formattedAnswers}`,
      },
    ], "gpt-3.5-turbo-16k", 0.7, 4000);

    // Extract and clean the response content
    const reportContent = cleanReportContent(response);

    // Save report to localStorage for persistence
    saveReportToStorage(reportContent, answers);

    return reportContent;
  } catch (error) {
    console.error("Error generating career report:", error);

    // Provide a more user-friendly error message
    if (error.response) {
      // OpenAI API error
      if (error.response.status === 429) {
        throw new Error("API rate limit exceeded. Please try again in a few minutes.");
      } else if (error.response.status === 401) {
        throw new Error("API key error. Please contact support.");
      } else {
        throw new Error(`API error: ${error.response.status} - ${error.response.data.error?.message || "Unknown error"}`);
      }
    } else if (error.request) {
      // Network error
      throw new Error("Network error. Please check your internet connection and try again.");
    } else {
      throw error; // Rethrow original error for unexpected cases
    }
  }
};

// Function to generate career opportunities
export const generateCareerOpportunities = async (answers) => {
  try {
    // Determine student level
    const studentLevel = determineStudentLevel(answers);

    // Get appropriate questions and format responses
    const questions = getQuestions(studentLevel);
    const formattedAnswers = formatResponses(answers, questions);

    // Select appropriate prompt based on student level
    const promptTemplate = studentLevel === "school" ? schoolCareerOpportunitiesPrompt : collegeCareerOpportunitiesPrompt;

    // Call OpenAI API
    const response = await chatCompletion([
      {
        role: "system",
        content: promptTemplate,
      },
      {
        role: "user",
        content: `Generate detailed career opportunities insights for this ${studentLevel} student based on these assessment responses:\n\n${formattedAnswers}`,
      },
    ], "gpt-3.5-turbo-16k", 0.7, 3000);

    const careerOpportunitiesContent = cleanReportContent(response);

    // Save to localStorage
    saveCareerOpportunitiesToStorage(careerOpportunitiesContent, answers);

    return careerOpportunitiesContent;
  } catch (error) {
    console.error("Error generating career opportunities:", error);
    throw error;
  }
};

// Function to generate educational pathways
export const generateEducationalPathways = async (answers) => {
  try {
    // Determine student level
    const studentLevel = determineStudentLevel(answers);

    // Get appropriate questions and format responses
    const questions = getQuestions(studentLevel);
    const formattedAnswers = formatResponses(answers, questions);

    // Select appropriate prompt based on student level
    const promptTemplate = studentLevel === "school" ? schoolEducationalPathwaysPrompt : collegeEducationalPathwaysPrompt;

    // Call OpenAI API
    const response = await chatCompletion([
      {
        role: "system",
        content: promptTemplate,
      },
      {
        role: "user",
        content: `Generate detailed educational pathways guidance for this ${studentLevel} student based on these assessment responses:\n\n${formattedAnswers}`,
      },
    ], "gpt-3.5-turbo-16k", 0.7, 3000);

    const educationalPathwaysContent = cleanReportContent(response);

    // Save to localStorage
    saveEducationalPathwaysToStorage(educationalPathwaysContent, answers);

    return educationalPathwaysContent;
  } catch (error) {
    console.error("Error generating educational pathways:", error);
    throw error;
  }
};

// Function to retrieve saved report from storage
export const getSavedReport = () => {
  try {
    const savedData = localStorage.getItem('careerReport');
    if (savedData) {
      return JSON.parse(savedData);
    }
    return null;
  } catch (error) {
    console.error("Error retrieving saved report:", error);
    return null;
  }
};

// Function to retrieve saved career opportunities from storage
export const getSavedCareerOpportunities = () => {
  try {
    const savedData = localStorage.getItem('careerOpportunities');
    if (savedData) {
      return JSON.parse(savedData);
    }
    return null;
  } catch (error) {
    console.error("Error retrieving saved career opportunities:", error);
    return null;
  }
};

// Function to retrieve saved educational pathways from storage
export const getSavedEducationalPathways = () => {
  try {
    const savedData = localStorage.getItem('educationalPathways');
    if (savedData) {
      return JSON.parse(savedData);
    }
    return null;
  } catch (error) {
    console.error("Error retrieving saved educational pathways:", error);
    return null;
  }
};