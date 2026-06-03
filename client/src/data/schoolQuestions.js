// Questions for school students (8th-12th grade)
const schoolQuestions = [
  {
    id: 1,
    question: "Gender:",
    type: "radio",
    options: ["Male", "Female", "Other"],
    category: "demographics"
  },
  {
    id: 2,
    question: "Current Class/Grade:",
    type: "radio",
    options: ["8th", "9th", "10th", "11th", "12th"],
    category: "demographics"
  },
  {
    id: 3,
    question: "I like to work with my hands and build things.",
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
    id: 4,
    question: "I enjoy solving mathematical or scientific problems.",
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
    id: 5,
    question: "I enjoy expressing myself through art, music, or writing.",
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
    question: "I like helping others and solving social problems.",
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
    id: 7,
    question: "I enjoy leading and persuading others.",
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
    question: "I prefer organizing tasks and working with details.",
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
    id: 9,
    question: "What do you like doing in your free time? (Select up to 2):",
    type: "checkbox",
    options: [
      "Playing Sports",
      "Watching Movies/TV Shows",
      "Drawing/Painting",
      "Listening to Music",
      "Socializing with Friends",
      "Playing Video Games",
      "Reading Books",
    ],
    max: 2,
    category: "lifestyle"
  },
  {
    id: 10,
    question: "Are you involved in any extracurricular activities?",
    type: "radio",
    options: ["Yes", "No"],
    category: "lifestyle"
  },
  {
    id: 11,
    question: "Favorite subjects (Select up to 2):",
    type: "checkbox",
    options: [
      "Mathematics",
      "Physics",
      "Chemistry",
      "Biology",
      "English",
      "History",
      "Geography",
      "Economics",
      "Computer Science",
    ],
    max: 2,
    category: "academics"
  },
  {
    id: 12,
    question: "Subjects you find challenging (Select up to 2):",
    type: "checkbox",
    options: [
      "Mathematics",
      "Physics",
      "Chemistry",
      "Biology",
      "English",
      "History",
      "Geography",
      "Economics",
      "Computer Science",
    ],
    max: 2,
    category: "academics"
  },
  {
    id: 13,
    question: "Which career fields interest you? (Select up to 3):",
    type: "checkbox",
    options: [
      "Engineering/Technology",
      "Medicine/Healthcare",
      "Business/Management",
      "Law/Politics",
      "Arts/Design",
      "Education/Teaching",
      "Hospitality/Tourism",
      "Media/Communication",
      "IT/Programming",
      "Science/Research",
    ],
    max: 3,
    category: "career"
  },
  {
    id: 14,
    question: "What motivates you most in a career? (Select up to 2):",
    type: "checkbox",
    options: [
      "High Income",
      "Job Satisfaction",
      "Work-Life Balance",
      "Passion/Interest",
      "Social Impact/Helping Others",
    ],
    max: 2,
    category: "career"
  },
  {
    id: 15,
    question: "Which stream are you most interested in?",
    type: "radio",
    options: [
      "Science (PCM - Physics, Chemistry, Mathematics)",
      "Science (PCB - Physics, Chemistry, Biology)",
      "Commerce",
      "Arts/Humanities",
      "Undecided",
    ],
    category: "academics"
  },
  {
    id: 16,
    question: "Do your parents influence your stream/career choice?",
    type: "radio",
    options: [
      "Yes, strongly",
      "Yes, but they support my choice",
      "No, I make my own decisions",
    ],
    category: "influences"
  },
  {
    id: 17,
    question: "Do you like to work independently or as part of a team?",
    type: "radio",
    options: ["Independently", "In a team", "Both"],
    category: "work-style"
  },
  {
    id: 18,
    question: "Do you prefer a structured routine or flexibility in tasks?",
    type: "radio",
    options: ["Structured", "Flexible"],
    category: "work-style"
  },
  {
    id: 19,
    question: "How important is creativity in your future career?",
    type: "radio",
    options: ["Very Important", "Somewhat Important", "Not Important"],
    category: "career"
  },
  {
    id: 20,
    question: "What is your main goal in life?",
    type: "radio",
    options: [
      "Achieving Financial Success",
      "Having Work-Life Balance",
      "Pursuing Your Passion",
      "Making a Social Impact",
    ],
    category: "personal"
  },
  {
    id: 21,
    question: "How comfortable are you with technology?",
    type: "radio",
    options: [
      "Very Comfortable",
      "Comfortable",
      "Neutral",
      "Uncomfortable",
      "Very Uncomfortable"
    ],
    category: "skills"
  },
  {
    id: 22,
    question: "How do you handle stress and pressure?",
    type: "radio",
    options: [
      "Very Well",
      "Well",
      "Average",
      "Not Well",
      "Poorly"
    ],
    category: "personal"
  },
  {
    id: 23,
    question: "What kind of work environment do you prefer?",
    type: "radio",
    options: [
      "Office-based",
      "Field Work",
      "Remote/Work from Home",
      "Mixed/Hybrid"
    ],
    category: "work-style"
  },
  {
    id: 24,
    question: "Are you willing to relocate for education or career opportunities?",
    type: "radio",
    options: [
      "Yes, anywhere",
      "Yes, but within India only",
      "Yes, but within my state only",
      "No, I prefer to stay in my hometown"
    ],
    category: "lifestyle"
  },
  {
    id: 25,
    question: "How important is family approval in your career decisions?",
    type: "radio",
    options: [
      "Extremely Important",
      "Very Important",
      "Somewhat Important",
      "Not Important"
    ],
    category: "influences"
  }
];

export default schoolQuestions;