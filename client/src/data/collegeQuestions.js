// Questions for college students
const collegeQuestions = [
  {
    id: 1,
    question: "Gender:",
    type: "radio",
    options: ["Male", "Female", "Other"],
    category: "demographics"
  },
  {
    id: 2,
    question: "Current Year of Study:",
    type: "radio",
    options: ["First Year", "Second Year", "Third Year", "Final Year", "Post Graduate"],
    category: "demographics"
  },
  {
    id: 3,
    question: "Which degree are you currently pursuing?",
    type: "text",
    category: "academics"
  },
  {
    id: 4,
    question: "Your current field of study:",
    type: "radio",
    options: [
      "Engineering",
      "Medicine",
      "Commerce/Business",
      "Arts/Humanities",
      "Science",
      "Law",
      "Design",
      "Other"
    ],
    category: "academics"
  },
  {
    id: 5,
    question: "I enjoy tasks that require analytical and logical thinking.",
    type: "radio",
    options: [
      "Strongly Agree",
      "Agree",
      "Neutral",
      "Disagree",
      "Strongly Disagree",
    ],
    category: "interests"
  },
  {
    id: 6,
    question: "I prefer creative problem-solving over following established procedures.",
    type: "radio",
    options: [
      "Strongly Agree",
      "Agree",
      "Neutral",
      "Disagree",
      "Strongly Disagree",
    ],
    category: "work-style"
  },
  {
    id: 7,
    question: "I enjoy working directly with people more than working with data or things.",
    type: "radio",
    options: [
      "Strongly Agree",
      "Agree",
      "Neutral",
      "Disagree",
      "Strongly Disagree",
    ],
    category: "interests"
  },
  {
    id: 8,
    question: "How do you typically organize your study or work time?",
    type: "radio",
    options: [
      "Using detailed schedules and plans",
      "Going with the flow day by day",
      "Setting short, achievable goals",
      "Working in focused bursts with breaks",
      "Preferring group study sessions"
    ],
    category: "work-style"
  },
  {
    id: 9,
    question: "I prefer taking leadership roles in group projects.",
    type: "radio",
    options: [
      "Strongly Agree",
      "Agree",
      "Neutral",
      "Disagree",
      "Strongly Disagree",
    ],
    category: "work-style"
  },
  {
    id: 10,
    question: "Which activity energizes you the most?",
    type: "radio",
    options: [
      "Solving puzzles or brain teasers",
      "Participating in team sports",
      "Writing stories or poems",
      "Leading a group project",
      "Exploring new technologies"
    ],
    category: "interests"
  },
  {
    id: 11,
    question: "What skills are you most confident in? (Select up to 3):",
    type: "checkbox",
    options: [
      "Technical/Programming",
      "Research & Analysis",
      "Communication",
      "Leadership",
      "Creativity",
      "Problem-solving",
      "Interpersonal Skills",
      "Organizational Skills",
      "Critical Thinking"
    ],
    max: 3,
    category: "skills"
  },
  {
    id: 12,
    question: "What skills would you like to develop further? (Select up to 3):",
    type: "checkbox",
    options: [
      "Technical/Programming",
      "Research & Analysis",
      "Communication",
      "Leadership",
      "Creativity",
      "Problem-solving",
      "Interpersonal Skills",
      "Organizational Skills",
      "Critical Thinking"
    ],
    max: 3,
    category: "skills"
  },
  {
    id: 13,
    question: "When learning a new skill, what helps you the most?",
    type: "radio",
    options: [
      "Watching videos or demonstrations",
      "Reading instructions or manuals",
      "Trying it out hands-on",
      "Discussing with peers or mentors",
      "Using trial and error"
    ],
    category: "learning"
  },
  {
    id: 14,
    question: "Which professional development activities have you participated in? (Select all that apply):",
    type: "checkbox",
    options: [
      "Internships",
      "Research Projects",
      "Workshops/Seminars",
      "Competitions",
      "Student Organizations/Clubs",
      "Volunteer Work",
      "Part-time Jobs",
      "Online Courses",
      "None of the above"
    ],
    max: 4,
    category: "experience"
  },
  {
    id: 15,
    question: "Which of these best describes how you prefer to solve problems?",
    type: "radio",
    options: [
      "Analyzing data and facts",
      "Brainstorming creative ideas",
      "Consulting others for opinions",
      "Following tried-and-true methods",
      "Experimenting with new approaches"
    ],
    category: "problem-solving"
  },
  {
    id: 16,
    question: "What type of work environment do you prefer?",
    type: "radio",
    options: [
      "Corporate/Structured",
      "Startup/Flexible",
      "Government/Public Sector",
      "Academia/Research",
      "Entrepreneurial/Self-employed"
    ],
    category: "work-style"
  },
  {
    id: 17,
    question: "Which environment helps you focus best?",
    type: "radio",
    options: [
      "Quiet and isolated",
      "Background music or noise",
      "Group setting with collaboration",
      "Outdoors or natural spaces",
      "Flexible and changing environments"
    ],
    category: "work-style"
  },
  {
    id: 18,
    question: "What are your post-graduation plans?",
    type: "radio",
    options: [
      "Pursue Higher Education in India",
      "Pursue Higher Education Abroad",
      "Seek Employment in India",
      "Seek Employment Abroad",
      "Start a Business/Freelance",
      "Prepare for Competitive Exams",
      "Undecided"
    ],
    category: "career"
  },
  {
    id: 19,
    question: "How do you prefer to contribute in group projects?",
    type: "radio",
    options: [
      "Taking the lead and organizing",
      "Researching and providing information",
      "Designing or creating materials",
      "Supporting and encouraging teammates",
      "Handling technical or practical tasks"
    ],
    category: "teamwork"
  },
  {
    id: 20,
    question: "What sectors interest you most for employment? (Select up to 3):",
    type: "checkbox",
    options: [
      "Information Technology",
      "Finance/Banking",
      "Healthcare",
      "Education",
      "Manufacturing",
      "Consulting",
      "E-commerce",
      "Media & Entertainment",
      "Public Service/Government",
      "Non-profit/NGO",
      "Research & Development"
    ],
    max: 3,
    category: "career"
  },
  {
    id: 21,
    question: "What factors are most important to you in a job? (Select up to 3):",
    type: "checkbox",
    options: [
      "Salary & Benefits",
      "Work-Life Balance",
      "Career Growth Opportunities",
      "Job Security",
      "Learning & Development",
      "Company Culture",
      "Social Impact",
      "Location",
      "International Exposure"
    ],
    max: 3,
    category: "career"
  },
  {
    id: 22,
    question: "How prepared do you feel for your career after graduation?",
    type: "radio",
    options: [
      "Very Prepared",
      "Somewhat Prepared",
      "Neutral",
      "Somewhat Unprepared",
      "Very Unprepared"
    ],
    category: "career"
  },
  {
    id: 23,
    question: "How important is building a personal brand/online presence to your career goals?",
    type: "radio",
    options: [
      "Extremely Important",
      "Very Important",
      "Moderately Important",
      "Slightly Important",
      "Not Important"
    ],
    category: "career"
  },
  {
    id: 24,
    question: "How do you prefer to receive feedback on your work?",
    type: "radio",
    options: [
      "Written comments",
      "One-on-one discussions",
      "Peer reviews",
      "Automated feedback tools",
      "Group feedback sessions"
    ],
    category: "learning"
  },
  {
    id: 25,
    question: "How do you prefer to learn new skills?",
    type: "radio",
    options: [
      "Formal Education/Courses",
      "Self-study/Online Resources",
      "Practical Experience/Learning by Doing",
      "Mentorship/Guidance",
      "Group Learning/Collaborative Projects"
    ],
    category: "learning"
  },
  {
    id: 26,
    question: "How comfortable are you with adapting to rapidly changing technologies?",
    type: "radio",
    options: [
      "Very Comfortable",
      "Comfortable",
      "Neutral",
      "Uncomfortable",
      "Very Uncomfortable"
    ],
    category: "adaptability"
  },
  {
    id: 27,
    question: "How willing are you to work in tier 2/3 cities in India?",
    type: "radio",
    options: [
      "Very Willing",
      "Willing",
      "Neutral",
      "Unwilling",
      "Very Unwilling"
    ],
    category: "location"
  },
  {
    id: 28,
    question: "How important is working for a socially responsible organization?",
    type: "radio",
    options: [
      "Extremely Important",
      "Very Important",
      "Moderately Important",
      "Slightly Important",
      "Not Important"
    ],
    category: "values"
  },
  {
    id: 29,
    question: "Which of these best describes your decision-making style?",
    type: "radio",
    options: [
      "Quick and intuitive",
      "Careful and deliberate",
      "Consultative and collaborative",
      "Flexible and adaptable",
      "Risk-taking and experimental"
    ],
    category: "personal"
  },
  {
    id: 30,
    question: "How do you handle feedback and criticism?",
    type: "radio",
    options: [
      "Very Well - I actively seek it out",
      "Well - I appreciate constructive feedback",
      "Neutral",
      "Not Well - I tend to take it personally",
      "Poorly - I avoid feedback situations"
    ],
    category: "personal"
  },
  {
    id: 31,
    question: "How do you approach networking and building professional connections?",
    type: "radio",
    options: [
      "Very Actively - I regularly attend events and reach out",
      "Actively - I make an effort when opportunities arise",
      "Moderately - I maintain connections but don't seek new ones",
      "Minimally - I network only when necessary",
      "Rarely - I prefer to focus on my work rather than networking"
    ],
    category: "career"
  },
  {
    id: 32,
    question: "Which emerging technologies or trends are you most interested in? (Select up to 2):",
    type: "checkbox",
    options: [
      "Artificial Intelligence/Machine Learning",
      "Blockchain/Cryptocurrency",
      "Sustainability/Green Technology",
      "Metaverse/Virtual Reality",
      "Biotechnology/Healthcare Innovation",
      "Remote Work Technologies",
      "IoT/Smart Devices",
      "Cybersecurity",
      "Financial Technology"
    ],
    max: 2,
    category: "interests"
  },
  {
    id: 33,
    question: "How likely are you to pursue an unconventional career path?",
    type: "radio",
    options: [
      "Very Likely",
      "Likely",
      "Neutral",
      "Unlikely",
      "Very Unlikely"
    ],
    category: "career"
  },
  {
    id: 34,
    question: "How important is having a mentor for your career development?",
    type: "radio",
    options: [
      "Extremely Important",
      "Very Important",
      "Moderately Important",
      "Slightly Important",
      "Not Important"
    ],
    category: "development"
  },
  {
    id: 35,
    question: "How do you like to recharge or relax after intense work?",
    type: "radio",
    options: [
      "Physical activities or exercise",
      "Creative hobbies or arts",
      "Socializing with friends",
      "Quiet time alone",
      "Exploring new interests or learning"
    ],
    category: "personal"
  }
];

export default collegeQuestions;