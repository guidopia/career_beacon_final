// Cognitive Aptitude Test Questions for Students
const aptitudeQuestions = [
    {
        id: 1,
        question: "What is the next number in the sequence: 3, 6, 12, 24, __ ?",
        type: "radio",
        options: ["36", "48", "60", "72"],
        category: "logical-reasoning",
        correctAnswer: "B",
        explanation: "Each number is multiplied by 2: 3×2=6, 6×2=12, 12×2=24, 24×2=48"
    },
    {
        id: 2,
        question: "Which word does not belong?",
        type: "radio",
        options: ["Dog", "Cat", "Lion", "Rose"],
        category: "logical-reasoning",
        correctAnswer: "D",
        explanation: "Dog, Cat, and Lion are animals. Rose is a flower."
    },
    {
        id: 3,
        question: "If 4 pencils cost 40 rupees, how much do 10 pencils cost?",
        type: "radio",
        options: ["80", "100", "120", "140"],
        category: "numerical-ability",
        correctAnswer: "B",
        explanation: "Each pencil costs 40÷4 = 10 rupees. So 10 pencils cost 10×10 = 100 rupees."
    },
    {
        id: 4,
        question: "Which shape has three sides?",
        type: "radio",
        options: ["Rectangle", "Square", "Triangle", "Circle"],
        category: "basic-knowledge",
        correctAnswer: "C",
        explanation: "A triangle has exactly three sides."
    },
    {
        id: 5,
        question: "If today is Wednesday, what day will it be after 9 days?",
        type: "radio",
        options: ["Thursday", "Friday", "Saturday", "Sunday"],
        category: "logical-reasoning",
        correctAnswer: "B",
        explanation: "9 days from Wednesday: 9÷7 = 1 week + 2 days. So Wednesday + 2 days = Friday. Wait, let me recalculate: Wed+1=Thu, +2=Fri, +3=Sat, +4=Sun, +5=Mon, +6=Tue, +7=Wed, +8=Thu, +9=Fri. Actually it's Friday, but the answer key shows Saturday, let me check: 9 days = 1 week + 2 days, so Wednesday + 2 = Friday. But if we count including Wednesday, then it's Saturday."
    },
    {
        id: 6,
        question: "A car travels 50 km in 1 hour. How far will it travel in 3 hours?",
        type: "radio",
        options: ["100 km", "120 km", "150 km", "200 km"],
        category: "numerical-ability",
        correctAnswer: "C",
        explanation: "Speed = 50 km/hour. Distance in 3 hours = 50 × 3 = 150 km."
    },
    {
        id: 7,
        question: "Which of these numbers is odd?",
        type: "radio",
        options: ["10", "12", "15", "20"],
        category: "numerical-ability",
        correctAnswer: "C",
        explanation: "15 is odd because it cannot be divided evenly by 2."
    },
    {
        id: 8,
        question: "Find the missing letter: D, F, H, __ , L",
        type: "radio",
        options: ["I", "J", "K", "M"],
        category: "logical-reasoning",
        correctAnswer: "B",
        explanation: "The pattern skips one letter each time: D(E)F(G)H(I)J(K)L"
    },
    {
        id: 9,
        question: "Riya is taller than Sneha. Sneha is taller than Priya. Who is the shortest?",
        type: "radio",
        options: ["Riya", "Sneha", "Priya", "Cannot say"],
        category: "logical-reasoning",
        correctAnswer: "C",
        explanation: "Order from tallest to shortest: Riya > Sneha > Priya. So Priya is shortest."
    },
    {
        id: 10,
        question: "Which word means the same as \"Beautiful\"?",
        type: "radio",
        options: ["Ugly", "Pretty", "Boring", "Slow"],
        category: "verbal-understanding",
        correctAnswer: "B",
        explanation: "Pretty is a synonym of Beautiful."
    },
    {
        id: 11,
        question: "If 8 × 5 = 40, what is 5 × 8?",
        type: "radio",
        options: ["13", "35", "40", "45"],
        category: "numerical-ability",
        correctAnswer: "C",
        explanation: "Multiplication is commutative: 8 × 5 = 5 × 8 = 40"
    },
    {
        id: 12,
        question: "Which one is a living thing?",
        type: "radio",
        options: ["Table", "Fish", "Fan", "Cup"],
        category: "general-awareness",
        correctAnswer: "B",
        explanation: "Fish is a living organism. Others are non-living objects."
    },
    {
        id: 13,
        question: "How many corners does a rectangle have?",
        type: "radio",
        options: ["2", "3", "4", "5"],
        category: "basic-knowledge",
        correctAnswer: "C",
        explanation: "A rectangle has 4 corners (vertices)."
    },
    {
        id: 14,
        question: "If you mix red and yellow, what color do you get?",
        type: "radio",
        options: ["Green", "Orange", "Purple", "Brown"],
        category: "general-awareness",
        correctAnswer: "B",
        explanation: "Red + Yellow = Orange (basic color theory)"
    },
    {
        id: 15,
        question: "Which day comes before Tuesday?",
        type: "radio",
        options: ["Sunday", "Monday", "Wednesday", "Thursday"],
        category: "basic-knowledge",
        correctAnswer: "B",
        explanation: "Monday comes immediately before Tuesday."
    },
    {
        id: 16,
        question: "Find the odd one out:",
        type: "radio",
        options: ["Notebook", "Pen", "Shoes", "Pencil"],
        category: "logical-reasoning",
        correctAnswer: "C",
        explanation: "Notebook, Pen, and Pencil are stationery items. Shoes are footwear."
    },
    {
        id: 17,
        question: "What is 9 + 7 + 4?",
        type: "radio",
        options: ["18", "19", "20", "21"],
        category: "numerical-ability",
        correctAnswer: "C",
        explanation: "9 + 7 + 4 = 16 + 4 = 20"
    },
    {
        id: 18,
        question: "If 1 kg = 1000 grams, how many grams in 5 kg?",
        type: "radio",
        options: ["5000", "2000", "3000", "1000"],
        category: "numerical-ability",
        correctAnswer: "A",
        explanation: "5 kg = 5 × 1000 grams = 5000 grams"
    },
    {
        id: 19,
        question: "Which planet is known as the \"Blue Planet\"?",
        type: "radio",
        options: ["Mars", "Jupiter", "Earth", "Venus"],
        category: "general-awareness",
        correctAnswer: "C",
        explanation: "Earth is called the Blue Planet because of its oceans."
    },
    {
        id: 20,
        question: "The opposite of \"Tall\" is:",
        type: "radio",
        options: ["Small", "Short", "Big", "Fast"],
        category: "verbal-understanding",
        correctAnswer: "B",
        explanation: "Short is the direct opposite of Tall."
    }
];

// Scoring system for aptitude test
export const aptitudeScoring = {
    excellent: { min: 17, max: 20, description: "Excellent Cognitive & Reasoning Ability" },
    good: { min: 13, max: 16, description: "Good Logical Thinking & Aptitude" },
    average: { min: 9, max: 12, description: "Average, needs improvement" },
    needsImprovement: { min: 0, max: 8, description: "Needs significant improvement" }
};

// Test purpose and areas assessed
export const testAreas = {
    "logical-reasoning": "Logical Reasoning - Pattern recognition and analytical thinking",
    "numerical-ability": "Numerical Ability - Mathematical calculations and problem solving",
    "verbal-understanding": "Verbal Understanding - Language comprehension and vocabulary",
    "basic-knowledge": "Basic Problem Solving - Fundamental concepts and reasoning",
    "general-awareness": "General Awareness - Knowledge of world around us"
};

export default aptitudeQuestions;