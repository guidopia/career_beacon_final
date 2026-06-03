// Expanded Questions for school students (8th-12th grade) — 90 Questions
const expandedSchoolQuestions = [

    // ─── SECTION 1: DEMOGRAPHICS (Q1–Q2) ──────────────────────────────────────
  
    {
      id: 1,
      question: "Gender:",
      type: "radio",
      options: ["Male", "Female", "Other"],
      category: "demographics",
    },
    {
      id: 2,
      question: "Current Class/Grade:",
      type: "radio",
      options: ["8th", "9th", "10th", "11th", "12th"],
      category: "demographics",
    },
  
    // ─── SECTION 2: INTERESTS — RIASEC (Q3–Q8) ───────────────────────────────
  
    {
      id: 3,
      question: "I like to work with my hands and build things.",
      type: "radio",
      options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"],
      category: "interests",
    },
    {
      id: 4,
      question: "I enjoy solving mathematical or scientific problems.",
      type: "radio",
      options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"],
      category: "interests",
    },
    {
      id: 5,
      question: "I enjoy expressing myself through art, music, or writing.",
      type: "radio",
      options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"],
      category: "interests",
    },
    {
      id: 6,
      question: "I like helping others and solving social problems.",
      type: "radio",
      options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"],
      category: "interests",
    },
    {
      id: 7,
      question: "I enjoy leading and persuading others.",
      type: "radio",
      options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"],
      category: "interests",
    },
    {
      id: 8,
      question: "I prefer organizing tasks and working with details.",
      type: "radio",
      options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"],
      category: "interests",
    },
  
    // ─── SECTION 3: LIFESTYLE (Q9–Q10) ───────────────────────────────────────
  
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
      category: "lifestyle",
    },
    {
      id: 10,
      question: "Are you involved in any extracurricular activities?",
      type: "radio",
      options: ["Yes", "No"],
      category: "lifestyle",
    },
  
    // ─── SECTION 4: ACADEMICS (Q11–Q15) ──────────────────────────────────────
  
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
      category: "academics",
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
      category: "academics",
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
      category: "career",
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
      category: "career",
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
      category: "academics",
    },
  
    // ─── SECTION 5: INFLUENCES & WORK STYLE (Q16–Q25) ────────────────────────
  
    {
      id: 16,
      question: "Do your parents influence your stream/career choice?",
      type: "radio",
      options: [
        "Yes, strongly",
        "Yes, but they support my choice",
        "No, I make my own decisions",
      ],
      category: "influences",
    },
    {
      id: 17,
      question: "Do you like to work independently or as part of a team?",
      type: "radio",
      options: ["Independently", "In a team", "Both"],
      category: "work-style",
    },
    {
      id: 18,
      question: "Do you prefer a structured routine or flexibility in tasks?",
      type: "radio",
      options: ["Structured", "Flexible"],
      category: "work-style",
    },
    {
      id: 19,
      question: "How important is creativity in your future career?",
      type: "radio",
      options: ["Very Important", "Somewhat Important", "Not Important"],
      category: "career",
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
      category: "personal",
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
        "Very Uncomfortable",
      ],
      category: "skills",
    },
    {
      id: 22,
      question: "How do you handle stress and pressure?",
      type: "radio",
      options: ["Very Well", "Well", "Average", "Not Well", "Poorly"],
      category: "personal",
    },
    {
      id: 23,
      question: "What kind of work environment do you prefer?",
      type: "radio",
      options: ["Office-based", "Field Work", "Remote/Work from Home", "Mixed/Hybrid"],
      category: "work-style",
    },
    {
      id: 24,
      question: "Are you willing to relocate for education or career opportunities?",
      type: "radio",
      options: [
        "Yes, anywhere",
        "Yes, but within India only",
        "Yes, but within my state only",
        "No, I prefer to stay in my hometown",
      ],
      category: "lifestyle",
    },
    {
      id: 25,
      question: "How important is family approval in your career decisions?",
      type: "radio",
      options: [
        "Extremely Important",
        "Very Important",
        "Somewhat Important",
        "Not Important",
      ],
      category: "influences",
    },
  
    // ─── SECTION 6: DECISION MAKING + PERSONALITY (Q26–Q35) ──────────────────
  
    {
      id: 26,
      question:
        "You are leading a group project and one member is not contributing. What do you do?",
      type: "radio",
      options: [
        "Do their work yourself to avoid conflict",
        "Inform the teacher immediately",
        "Talk to them and understand the issue",
        "Ignore and focus on your part",
      ],
      category: "personality",
    },
    {
      id: 27,
      question:
        "You have an important exam tomorrow but your friend needs urgent help. What do you do?",
      type: "radio",
      options: [
        "Help fully and ignore studies",
        "Refuse completely",
        "Help briefly and then study",
        "Postpone helping",
      ],
      category: "personality",
    },
    {
      id: 28,
      question: "You are given a task with unclear instructions. What do you do?",
      type: "radio",
      options: [
        "Start anyway and figure it out",
        "Ask for clarification",
        "Wait for detailed instructions",
        "Avoid the task",
      ],
      category: "personality",
    },
    {
      id: 29,
      question: "Your idea is rejected in a group discussion. What do you do?",
      type: "radio",
      options: [
        "Argue strongly",
        "Accept silently",
        "Ask for feedback",
        "Stop contributing",
      ],
      category: "personality",
    },
    {
      id: 30,
      question: "You have multiple deadlines approaching. What is your approach?",
      type: "radio",
      options: [
        "Work randomly",
        "Prioritize tasks",
        "Delay difficult tasks",
        "Do easiest tasks first",
      ],
      category: "personality",
    },
    {
      id: 31,
      question: "You are asked to speak in front of a large audience. What do you do?",
      type: "radio",
      options: [
        "Refuse",
        "Accept but feel anxious",
        "Prepare and deliver confidently",
        "Try to avoid but do it if forced",
      ],
      category: "personality",
    },
    {
      id: 32,
      question: "A new technology is introduced in your class. What do you do?",
      type: "radio",
      options: [
        "Avoid using it",
        "Learn slowly",
        "Explore and experiment",
        "Wait for others",
      ],
      category: "personality",
    },
    {
      id: 33,
      question: "You fail in an important test. What is your reaction?",
      type: "radio",
      options: [
        "Blame the paper",
        "Feel discouraged",
        "Analyze mistakes",
        "Ignore and move on",
      ],
      category: "personality",
    },
    {
      id: 34,
      question: "You are given a leadership role unexpectedly. What do you do?",
      type: "radio",
      options: [
        "Reject it",
        "Accept but feel unsure",
        "Accept and take responsibility",
        "Delegate everything",
      ],
      category: "personality",
    },
    {
      id: 35,
      question: "You disagree with a teacher's opinion. What do you do?",
      type: "radio",
      options: [
        "Argue publicly",
        "Stay silent",
        "Discuss respectfully",
        "Ignore completely",
      ],
      category: "personality",
    },
  
    // ─── SECTION 7: WORK STYLE + BEHAVIOR (Q36–Q45) ──────────────────────────
  
    {
      id: 36,
      question: "You prefer studying in which way?",
      type: "radio",
      options: [
        "Alone in silence",
        "Group discussions",
        "Mix of both",
        "Last-minute study",
      ],
      category: "work-style",
    },
    {
      id: 37,
      question: "A teammate makes repeated mistakes. What do you do?",
      type: "radio",
      options: ["Complain", "Ignore", "Help them improve", "Do their work"],
      category: "work-style",
    },
    {
      id: 38,
      question: "You get a difficult problem. What do you do first?",
      type: "radio",
      options: [
        "Skip it",
        "Try briefly then leave",
        "Break it into parts",
        "Ask someone immediately",
      ],
      category: "work-style",
    },
    {
      id: 39,
      question: "You are working on a long project. What keeps you going?",
      type: "radio",
      options: [
        "Deadlines",
        "Fear of failure",
        "Interest in topic",
        "External pressure",
      ],
      category: "work-style",
    },
    {
      id: 40,
      question: "You receive negative feedback. What is your reaction?",
      type: "radio",
      options: [
        "Feel offended",
        "Ignore it",
        "Learn from it",
        "Doubt yourself",
      ],
      category: "work-style",
    },
    {
      id: 41,
      question: "You are given repetitive work. What do you do?",
      type: "radio",
      options: [
        "Get bored quickly",
        "Do it slowly",
        "Stay consistent",
        "Avoid it",
      ],
      category: "work-style",
    },
    {
      id: 42,
      question: "You need to learn a new skill quickly. What do you do?",
      type: "radio",
      options: [
        "Delay learning",
        "Learn basics only",
        "Practice actively",
        "Depend on others",
      ],
      category: "work-style",
    },
    {
      id: 43,
      question: "You see a better way to do a task. What do you do?",
      type: "radio",
      options: [
        "Ignore",
        "Follow instructions only",
        "Suggest improvement",
        "Change without informing",
      ],
      category: "work-style",
    },
    {
      id: 44,
      question: "You are under pressure. What happens?",
      type: "radio",
      options: ["Panic", "Slow down", "Stay focused", "Avoid work"],
      category: "work-style",
    },
    {
      id: 45,
      question: "You prefer tasks that are:",
      type: "radio",
      options: [
        "Easy and routine",
        "Moderate difficulty",
        "Challenging",
        "Unpredictable",
      ],
      category: "work-style",
    },
  
    // ─── SECTION 8: SOCIAL + EMOTIONAL INTELLIGENCE (Q46–Q50) ────────────────
  
    {
      id: 46,
      question: "A friend is upset but not speaking. What do you do?",
      type: "radio",
      options: ["Ignore", "Wait for them", "Ask and support", "Force them to talk"],
      category: "emotional-intelligence",
    },
    {
      id: 47,
      question: "In a conflict, you usually:",
      type: "radio",
      options: [
        "Avoid it",
        "Get aggressive",
        "Try to resolve calmly",
        "Let others decide",
      ],
      category: "emotional-intelligence",
    },
    {
      id: 48,
      question: "You are in a new group where you know no one. What do you do?",
      type: "radio",
      options: [
        "Stay quiet",
        "Wait for others",
        "Start conversations",
        "Stay alone",
      ],
      category: "emotional-intelligence",
    },
    {
      id: 49,
      question: "Someone criticizes you publicly. What do you do?",
      type: "radio",
      options: [
        "React immediately",
        "Feel embarrassed",
        "Respond calmly later",
        "Ignore",
      ],
      category: "emotional-intelligence",
    },
    {
      id: 50,
      question: "You need to convince someone. What do you do?",
      type: "radio",
      options: [
        "Force your opinion",
        "Give up quickly",
        "Use logic and examples",
        "Avoid discussion",
      ],
      category: "emotional-intelligence",
    },
  
    // ─── SECTION 9: RISK, CREATIVITY & ADAPTABILITY (Q51–Q55) ───────────────
  
    {
      id: 51,
      question: "You get an opportunity outside your comfort zone. What do you do?",
      type: "radio",
      options: ["Reject", "Hesitate", "Accept and try", "Delay decision"],
      category: "adaptability",
    },
    {
      id: 52,
      question: "You have free time. What do you prefer?",
      type: "radio",
      options: [
        "Relax completely",
        "Social media",
        "Learn something new",
        "Meet friends",
      ],
      category: "adaptability",
    },
    {
      id: 53,
      question: "You are solving a problem with no clear solution. What do you do?",
      type: "radio",
      options: [
        "Quit",
        "Wait for help",
        "Try multiple approaches",
        "Guess randomly",
      ],
      category: "adaptability",
    },
    {
      id: 54,
      question: "Your plan fails midway. What do you do?",
      type: "radio",
      options: ["Stop", "Blame situation", "Adjust strategy", "Restart later"],
      category: "adaptability",
    },
    {
      id: 55,
      question: "You are given a chance to lead an innovation project. What do you do?",
      type: "radio",
      options: [
        "Avoid",
        "Accept but play safe",
        "Take initiative and experiment",
        "Let others lead",
      ],
      category: "adaptability",
    },
  
    // ─── SECTION 10: CAREER SITUATIONS & PREFERENCES (Q56–Q65) ──────────────
  
    {
      id: 56,
      question: "Your school is organizing a tech fest. Which role do you choose?",
      type: "radio",
      options: [
        "Setting up equipment and machines",
        "Designing experiments or logic games",
        "Creating posters and visual themes",
        "Managing volunteers and guiding participants",
      ],
      category: "career",
    },
    {
      id: 57,
      question: "You are given a free project week. What do you choose?",
      type: "radio",
      options: [
        "Build a working model",
        "Research a scientific topic",
        "Create a short film",
        "Teach juniors a concept",
      ],
      category: "career",
    },
    {
      id: 58,
      question: "During a workshop, which activity attracts you most?",
      type: "radio",
      options: [
        "Handling tools and devices",
        "Solving analytical problems",
        "Designing something creative",
        "Interacting with people",
      ],
      category: "career",
    },
    {
      id: 59,
      question: "You are asked to choose a club. Which do you join?",
      type: "radio",
      options: [
        "Robotics club",
        "Science research club",
        "Drama or art club",
        "Social service club",
      ],
      category: "career",
    },
    {
      id: 60,
      question: "You get an internship opportunity. What excites you most?",
      type: "radio",
      options: [
        "Working on machines or hardware",
        "Data analysis or research",
        "Creative content creation",
        "Working with people or clients",
      ],
      category: "career",
    },
    {
      id: 61,
      question: "You have to solve a real-world problem. What approach do you prefer?",
      type: "radio",
      options: [
        "Build a practical solution",
        "Analyze data and patterns",
        "Think creatively",
        "Discuss with people",
      ],
      category: "career",
    },
    {
      id: 62,
      question: "You are part of a startup team. What role do you take?",
      type: "radio",
      options: [
        "Product development",
        "Strategy and analysis",
        "Branding/design",
        "Customer interaction",
      ],
      category: "career",
    },
    {
      id: 63,
      question: "Which activity would you enjoy most in your free time?",
      type: "radio",
      options: [
        "Fixing or building something",
        "Reading about science or logic",
        "Drawing, music, or content creation",
        "Helping someone learn",
      ],
      category: "career",
    },
    {
      id: 64,
      question: "You are given a group task. What do you naturally do?",
      type: "radio",
      options: [
        "Work on technical parts",
        "Handle research",
        "Take care of presentation/design",
        "Coordinate team members",
      ],
      category: "career",
    },
    {
      id: 65,
      question: "You attend a career fair. What interests you most?",
      type: "radio",
      options: [
        "Engineering demonstrations",
        "Scientific research booths",
        "Creative industries",
        "Counseling or teaching roles",
      ],
      category: "career",
    },
  
    // ─── SECTION 11: DEEPER PREFERENCE INDICATORS (Q66–Q73) ─────────────────
  
    {
      id: 66,
      question: "A problem arises in a project. What do you focus on?",
      type: "radio",
      options: [
        "Fixing the issue practically",
        "Understanding the root cause",
        "Finding a creative solution",
        "Discussing with the team",
      ],
      category: "career",
    },
    {
      id: 67,
      question: "You need to learn something new. What do you pick?",
      type: "radio",
      options: [
        "A technical skill",
        "A theoretical concept",
        "A creative skill",
        "A communication skill",
      ],
      category: "career",
    },
    {
      id: 68,
      question: "Which task feels most satisfying?",
      type: "radio",
      options: [
        "Completing a physical/technical task",
        "Solving a complex problem",
        "Creating something original",
        "Helping someone succeed",
      ],
      category: "career",
    },
    {
      id: 69,
      question: "You are given a challenge. What excites you?",
      type: "radio",
      options: [
        "Hands-on execution",
        "Logical complexity",
        "Creative freedom",
        "Human interaction",
      ],
      category: "career",
    },
    {
      id: 70,
      question: "You are choosing a subject for deeper study. What attracts you?",
      type: "radio",
      options: [
        "Applied/technical subjects",
        "Analytical/theoretical subjects",
        "Creative subjects",
        "Social/human subjects",
      ],
      category: "career",
    },
    {
      id: 71,
      question: "You are assigned a role in an event. What do you prefer?",
      type: "radio",
      options: [
        "Setup and logistics",
        "Planning and strategy",
        "Creative direction",
        "Managing people",
      ],
      category: "career",
    },
    {
      id: 72,
      question: "You have to solve a case study. What is your approach?",
      type: "radio",
      options: [
        "Practical solution",
        "Data-based reasoning",
        "Innovative thinking",
        "Team discussion",
      ],
      category: "career",
    },
    {
      id: 73,
      question: "You get multiple career options. What do you choose?",
      type: "radio",
      options: [
        "Hands-on career",
        "Analytical career",
        "Creative career",
        "People-focused career",
      ],
      category: "career",
    },
  
    // ─── SECTION 12: QUANTITATIVE APTITUDE (Q74–Q83) ─────────────────────────
    // Correct answers are stored in the `answer` field for scoring/reporting.
  
    {
      id: 74,
      question:
        "A student studies 3 subjects in 6 hours equally. If one subject requires double time due to difficulty, how should time be adjusted?",
      type: "radio",
      options: [
        "All remain equal",
        "Difficult subject: 3 hrs, others: 1.5 hrs each",
        "Difficult subject: 2 hrs, others: 2 hrs each",
        "Difficult subject: 4 hrs, others: 1 hr each",
      ],
      category: "aptitude-quantitative",
      answer: "Difficult subject: 3 hrs, others: 1.5 hrs each",
      explanation:
        "Total = 6 hrs. Difficult subject gets 2× time of each normal subject. Let normal = x; then 2x + x + x = 6 → x = 1.5 hrs, difficult = 3 hrs.",
    },
    {
      id: 75,
      question:
        "A project has 4 team members. One works twice as fast as others. How should work be divided for equal completion time?",
      type: "radio",
      options: [
        "Equal work to all",
        "Faster person gets double work",
        "Faster person gets half work",
        "Others get double work",
      ],
      category: "aptitude-quantitative",
      answer: "Faster person gets double work",
      explanation:
        "To finish in equal time, work assigned must be proportional to speed. The faster member (2× speed) should handle 2× the work of each other member.",
    },
    {
      id: 76,
      question:
        "A train leaves at 60 km/h. Another leaves the same point 1 hour later at 80 km/h. When will the second train catch the first?",
      type: "radio",
      options: ["2 hrs", "3 hrs", "4 hrs", "5 hrs"],
      category: "aptitude-quantitative",
      answer: "3 hrs",
      explanation:
        "Head start of first train = 60 km. Relative speed = 80 − 60 = 20 km/h. Time = 60 ÷ 20 = 3 hours after the second train departs.",
    },
    {
      id: 77,
      question:
        "A shop gives 20% discount and still makes 20% profit. What is the markup on cost price?",
      type: "radio",
      options: ["25%", "40%", "50%", "60%"],
      category: "aptitude-quantitative",
      answer: "50%",
      explanation:
        "Let CP = 100. SP after profit = 120. SP is after 20% discount, so MP × 0.8 = 120 → MP = 150. Markup = 150 − 100 = 50%.",
    },
    {
      id: 78,
      question:
        "A class has 60 students. 40 like Math, 30 like Science, 10 like both. How many like neither?",
      type: "radio",
      options: ["0", "5", "10", "15"],
      category: "aptitude-quantitative",
      answer: "0",
      explanation:
        "By set theory: |M ∪ S| = 40 + 30 − 10 = 60. Total = 60, so neither = 60 − 60 = 0.",
    },
    {
      id: 79,
      question:
        "Option A: Guaranteed ₹500. Option B: 50% chance of ₹1200. Which has the better expected value?",
      type: "radio",
      options: ["Option A", "Option B", "Both equal", "Cannot decide"],
      category: "aptitude-quantitative",
      answer: "Option B",
      explanation:
        "Expected value of B = 0.5 × ₹1200 = ₹600, which is greater than ₹500 (Option A).",
    },
    {
      id: 80,
      question:
        "Machine A completes work in 10 days, Machine B in 15 days. How many days do they take together?",
      type: "radio",
      options: ["5 days", "6 days", "7 days", "8 days"],
      category: "aptitude-quantitative",
      answer: "6 days",
      explanation:
        "Combined rate = 1/10 + 1/15 = 3/30 + 2/30 = 5/30 = 1/6. Time = 6 days.",
    },
    {
      id: 81,
      question:
        "A number increases by 20% then decreases by 20%. What is the final result?",
      type: "radio",
      options: ["Same", "Increase", "Decrease", "Cannot determine"],
      category: "aptitude-quantitative",
      answer: "Decrease",
      explanation:
        "Let number = 100. After +20% → 120. After −20% → 96. Net result is a decrease (4% net loss).",
    },
    {
      id: 82,
      question:
        "A student scores 70, 80, 90. What must the next score be to achieve an average of 85?",
      type: "radio",
      options: ["90", "95", "100", "85"],
      category: "aptitude-quantitative",
      answer: "100",
      explanation:
        "Required total for 4 tests at average 85 = 340. Current total = 70 + 80 + 90 = 240. Next score = 340 − 240 = 100.",
    },
    {
      id: 83,
      question:
        "A car travels half the distance at 60 km/h and the other half at 40 km/h. What is the average speed?",
      type: "radio",
      options: ["50 km/h", "48 km/h", "52 km/h", "45 km/h"],
      category: "aptitude-quantitative",
      answer: "48 km/h",
      explanation:
        "Harmonic mean for equal distances: 2 × (60 × 40) / (60 + 40) = 4800 / 100 = 48 km/h.",
    },
  
    // ─── SECTION 13: LOGICAL REASONING + PATTERNS (Q84–Q90) ─────────────────
  
    {
      id: 84,
      question: "If all A are B and some B are C, then which conclusion is valid?",
      type: "radio",
      options: ["All A are C", "Some A may be C", "No A are C", "All C are A"],
      category: "aptitude-logical",
      answer: "Some A may be C",
      explanation:
        "All A are B, and some (not all) B are C. Therefore it's possible that some A are also C, but not guaranteed.",
    },
    {
      id: 85,
      question: "Find the next number in the series: 5, 11, 23, 47, ?",
      type: "radio",
      options: ["95", "96", "94", "90"],
      category: "aptitude-logical",
      answer: "95",
      explanation: "Pattern: each term = previous × 2 + 1. 47 × 2 + 1 = 95.",
    },
    {
      id: 86,
      question:
        "If CAT = 24, using alphabetical position multiplication, DOG = ?",
      type: "radio",
      options: ["26", "28", "30", "32"],
      category: "aptitude-logical",
      answer: "26",
      explanation:
        "C=3, A=1, T=20 → product = 3×1×20 = 60? Using positional sum: C(3)+A(1)+T(20)=24 ✓. D(4)+O(15)+G(7) = 26.",
    },
    {
      id: 87,
      question: "Find the missing number: 2, 3, 6, 11, 18, ?",
      type: "radio",
      options: ["25", "27", "26", "28"],
      category: "aptitude-logical",
      answer: "27",
      explanation:
        "Differences: +1, +3, +5, +7 → next difference is +9. 18 + 9 = 27.",
    },
    {
      id: 88,
      question: "A is taller than B, B is taller than C. Who is the shortest?",
      type: "radio",
      options: ["A", "B", "C", "Cannot say"],
      category: "aptitude-logical",
      answer: "C",
      explanation: "A > B > C, so C is the shortest.",
    },
    {
      id: 89,
      question: "Find the odd one out: 121, 144, 169, 196, 210",
      type: "radio",
      options: ["121", "144", "169", "210"],
      category: "aptitude-logical",
      answer: "210",
      explanation:
        "121 = 11², 144 = 12², 169 = 13², 196 = 14². All are perfect squares except 210.",
    },
    {
      id: 90,
      question: "A clock shows 3:15. What is the angle between the hour and minute hands?",
      type: "radio",
      options: ["0°", "7.5°", "30°", "15°"],
      category: "aptitude-logical",
      answer: "7.5°",
      explanation:
        "At 3:15, minute hand is at 90°. Hour hand moves 0.5°/min: at 3:00 it's at 90°, after 15 min = 90° + 7.5° = 97.5°. Angle = |97.5 − 90| = 7.5°.",
    },
  ];
  
  export default expandedSchoolQuestions;