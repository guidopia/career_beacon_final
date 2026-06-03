// Multiple Intelligence Test Questions for Students (Based on Howard Gardner's Theory)
const intelligenceQuestions = [
    {
        id: 1,
        question: "What do you enjoy the most?",
        type: "radio",
        options: [
            "Reading stories or writing essays",
            "Solving math puzzles",
            "Drawing or designing things",
            "Listening to music or singing"
        ],
        category: "intelligence-type",
        intelligenceTypes: {
            A: "linguistic",
            B: "logical-mathematical",
            C: "spatial",
            D: "musical"
        }
    },
    {
        id: 2,
        question: "In your free time, you prefer to:",
        type: "radio",
        options: [
            "Talk or write about your ideas",
            "Solve riddles or logic games",
            "Make drawings or models",
            "Play an instrument or listen to songs"
        ],
        category: "intelligence-type",
        intelligenceTypes: {
            A: "linguistic",
            B: "logical-mathematical",
            C: "spatial",
            D: "musical"
        }
    },
    {
        id: 3,
        question: "You find it easiest to:",
        type: "radio",
        options: [
            "Express yourself with words",
            "Find solutions to tricky problems",
            "Imagine how things look in your head",
            "Remember songs or rhythms"
        ],
        category: "intelligence-type",
        intelligenceTypes: {
            A: "linguistic",
            B: "logical-mathematical",
            C: "spatial",
            D: "musical"
        }
    },
    {
        id: 4,
        question: "Your favourite school activity is:",
        type: "radio",
        options: [
            "Debating or reading aloud",
            "Math or science experiments",
            "Art or craft projects",
            "Music or dance practice"
        ],
        category: "intelligence-type",
        intelligenceTypes: {
            A: "linguistic",
            B: "logical-mathematical",
            C: "spatial",
            D: "musical"
        }
    },
    {
        id: 5,
        question: "When working with friends, you:",
        type: "radio",
        options: [
            "Do the talking or explaining",
            "Solve problems or organise tasks",
            "Handle the creative design",
            "Add music, rhythm, or performance"
        ],
        category: "intelligence-type",
        intelligenceTypes: {
            A: "linguistic",
            B: "logical-mathematical",
            C: "spatial",
            D: "musical"
        }
    },
    {
        id: 6,
        question: "You feel happiest when:",
        type: "radio",
        options: [
            "Writing stories or poems",
            "Solving puzzles or challenges",
            "Drawing or creating models",
            "Singing, dancing, or playing instruments"
        ],
        category: "intelligence-type",
        intelligenceTypes: {
            A: "linguistic",
            B: "logical-mathematical",
            C: "spatial",
            D: "musical"
        }
    },
    {
        id: 7,
        question: "You often:",
        type: "radio",
        options: [
            "Think about your feelings and goals",
            "Help friends solve their problems",
            "Enjoy exploring nature or animals",
            "Love building or making things with your hands"
        ],
        category: "intelligence-type",
        intelligenceTypes: {
            A: "intrapersonal",
            B: "interpersonal",
            C: "naturalistic",
            D: "bodily-kinesthetic"
        }
    },
    {
        id: 8,
        question: "People say you are:",
        type: "radio",
        options: [
            "Good with words",
            "Logical and smart with numbers",
            "Creative with designs",
            "Talented in music"
        ],
        category: "intelligence-type",
        intelligenceTypes: {
            A: "linguistic",
            B: "logical-mathematical",
            C: "spatial",
            D: "musical"
        }
    },
    {
        id: 9,
        question: "You enjoy:",
        type: "radio",
        options: [
            "Reading books or writing stories",
            "Math puzzles or brain teasers",
            "Art, designing or visualising spaces",
            "Music, songs or composing rhythms"
        ],
        category: "intelligence-type",
        intelligenceTypes: {
            A: "linguistic",
            B: "logical-mathematical",
            C: "spatial",
            D: "musical"
        }
    },
    {
        id: 10,
        question: "You remember things best by:",
        type: "radio",
        options: [
            "Talking or writing them down",
            "Finding patterns or logic behind them",
            "Drawing diagrams or using visuals",
            "Singing them or adding rhythm"
        ],
        category: "intelligence-type",
        intelligenceTypes: {
            A: "linguistic",
            B: "logical-mathematical",
            C: "spatial",
            D: "musical"
        }
    },
    {
        id: 11,
        question: "You prefer to:",
        type: "radio",
        options: [
            "Express your ideas through speaking or writing",
            "Solve problems using logic",
            "Visualise how things will look before doing them",
            "Express emotions through music or performance"
        ],
        category: "intelligence-type",
        intelligenceTypes: {
            A: "linguistic",
            B: "logical-mathematical",
            C: "spatial",
            D: "musical"
        }
    },
    {
        id: 12,
        question: "Your dream job would be:",
        type: "radio",
        options: [
            "Writer, journalist, teacher",
            "Engineer, scientist, mathematician",
            "Architect, artist, designer",
            "Musician, singer, music producer"
        ],
        category: "intelligence-type",
        intelligenceTypes: {
            A: "linguistic",
            B: "logical-mathematical",
            C: "spatial",
            D: "musical"
        }
    },
    {
        id: 13,
        question: "You enjoy spending time:",
        type: "radio",
        options: [
            "Reading, writing, or storytelling",
            "Solving tricky problems or experiments",
            "Creating art, drawings or models",
            "Listening to or making music"
        ],
        category: "intelligence-type",
        intelligenceTypes: {
            A: "linguistic",
            B: "logical-mathematical",
            C: "spatial",
            D: "musical"
        }
    },
    {
        id: 14,
        question: "You feel more connected to:",
        type: "radio",
        options: [
            "Books and words",
            "Numbers and patterns",
            "Shapes, colours, and images",
            "Sounds, beats, and songs"
        ],
        category: "intelligence-type",
        intelligenceTypes: {
            A: "linguistic",
            B: "logical-mathematical",
            C: "spatial",
            D: "musical"
        }
    },
    {
        id: 15,
        question: "You love to:",
        type: "radio",
        options: [
            "Share stories or ideas with others",
            "Figure out how things work",
            "Imagine and create new designs",
            "Play instruments or enjoy musical performances"
        ],
        category: "intelligence-type",
        intelligenceTypes: {
            A: "linguistic",
            B: "logical-mathematical",
            C: "spatial",
            D: "musical"
        }
    }
];

// Intelligence type descriptions for interpretation
export const intelligenceTypes = {
    linguistic: {
        name: "Linguistic Intelligence",
        description: "Strong with words, language, reading, writing, and communication",
        strengths: ["Reading", "Writing", "Speaking", "Learning languages", "Storytelling"],
        careers: ["Writer", "Journalist", "Teacher", "Lawyer", "Translator", "Poet", "Editor"],
        learningStyle: "Learn best through reading, writing, discussions, and verbal instructions"
    },
    "logical-mathematical": {
        name: "Logical-Mathematical Intelligence",
        description: "Strong with numbers, logic, patterns, and scientific reasoning",
        strengths: ["Math", "Logic puzzles", "Scientific reasoning", "Pattern recognition", "Problem solving"],
        careers: ["Engineer", "Scientist", "Mathematician", "Computer Programmer", "Accountant", "Researcher"],
        learningStyle: "Learn best through logical sequences, patterns, experiments, and structured problems"
    },
    spatial: {
        name: "Spatial Intelligence",
        description: "Strong with visual-spatial processing, imagination, and design",
        strengths: ["Drawing", "Design", "3D visualization", "Navigation", "Art", "Architecture"],
        careers: ["Architect", "Artist", "Designer", "Pilot", "Engineer", "Sculptor", "Photographer"],
        learningStyle: "Learn best through visual aids, diagrams, maps, charts, and hands-on activities"
    },
    musical: {
        name: "Musical Intelligence",
        description: "Strong with music, rhythm, sound, and musical patterns",
        strengths: ["Playing instruments", "Singing", "Rhythm", "Sound recognition", "Musical composition"],
        careers: ["Musician", "Singer", "Music Teacher", "Sound Engineer", "Music Producer", "Composer"],
        learningStyle: "Learn best through songs, rhythm, music, and audio materials"
    },
    interpersonal: {
        name: "Interpersonal Intelligence",
        description: "Strong with understanding and working with other people",
        strengths: ["Leadership", "Communication", "Empathy", "Teamwork", "Social skills"],
        careers: ["Teacher", "Counselor", "Salesperson", "Manager", "Politician", "Social Worker"],
        learningStyle: "Learn best through group work, discussions, and social interaction"
    },
    intrapersonal: {
        name: "Intrapersonal Intelligence",
        description: "Strong with self-awareness, reflection, and understanding your own emotions",
        strengths: ["Self-reflection", "Goal setting", "Independent work", "Personal planning"],
        careers: ["Psychologist", "Writer", "Philosopher", "Researcher", "Entrepreneur", "Therapist"],
        learningStyle: "Learn best through independent study, self-paced learning, and reflection"
    },
    naturalistic: {
        name: "Naturalistic Intelligence",
        description: "Strong with nature, animals, plants, and environmental awareness",
        strengths: ["Nature observation", "Animal care", "Environmental awareness", "Outdoor activities"],
        careers: ["Biologist", "Veterinarian", "Farmer", "Park Ranger", "Environmental Scientist", "Botanist"],
        learningStyle: "Learn best through outdoor activities, nature exploration, and hands-on experiences"
    },
    "bodily-kinesthetic": {
        name: "Bodily-Kinesthetic Intelligence",
        description: "Strong with body movement, physical skills, and hands-on learning",
        strengths: ["Sports", "Dancing", "Building", "Physical coordination", "Hands-on activities"],
        careers: ["Athlete", "Dancer", "Surgeon", "Mechanic", "Physical Therapist", "Actor", "Builder"],
        learningStyle: "Learn best through movement, hands-on activities, and physical practice"
    }
};

export default intelligenceQuestions;