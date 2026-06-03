// Personality Test Questions for Students (Big 5 Personality Traits)
const personalityQuestions = [
    {
      id: 1,
      question: "What do you enjoy most?",
      type: "radio",
      options: [
        "Trying new activities or learning new things",
        "Making sure everything is neat and organized", 
        "Talking to new people or making new friends",
        "Helping others solve their problems",
        "Reflecting on worries or concerns"
      ],
      category: "personality",
      traits: {
        A: "openness",
        B: "conscientiousness", 
        C: "extraversion",
        D: "agreeableness",
        E: "neuroticism"
      }
    },
    {
      id: 2,
      question: "If your teacher asks you to work on a new project, you:",
      type: "radio",
      options: [
        "Feel excited to do something different",
        "Plan how to finish it step by step",
        "Like working with others to finish it", 
        "Make sure everyone feels included",
        "Worry if you'll be able to do it well"
      ],
      category: "personality",
      traits: {
        A: "openness",
        B: "conscientiousness",
        C: "extraversion", 
        D: "agreeableness",
        E: "neuroticism"
      }
    },
    {
      id: 3,
      question: "Your friends would say you:",
      type: "radio",
      options: [
        "Are creative and full of ideas",
        "Are responsible and organized",
        "Are outgoing and friendly",
        "Are caring and helpful", 
        "Get stressed sometimes"
      ],
      category: "personality",
      traits: {
        A: "openness",
        B: "conscientiousness",
        C: "extraversion",
        D: "agreeableness",
        E: "neuroticism"
      }
    },
    {
      id: 4,
      question: "If something unexpected happens in school, you:",
      type: "radio",
      options: [
        "See it as a fun challenge",
        "Try to organize things quickly",
        "Talk to friends to figure it out",
        "Make sure no one feels left out",
        "Feel nervous about what will happen"
      ],
      category: "personality",
      traits: {
        A: "openness",
        B: "conscientiousness", 
        C: "extraversion",
        D: "agreeableness",
        E: "neuroticism"
      }
    },
    {
      id: 5,
      question: "During a group activity, you prefer to:",
      type: "radio",
      options: [
        "Share new and interesting ideas",
        "Keep track of tasks and deadlines",
        "Be the one who talks the most",
        "Make sure everyone feels good",
        "Stay quiet if you feel unsure"
      ],
      category: "personality",
      traits: {
        A: "openness",
        B: "conscientiousness",
        C: "extraversion",
        D: "agreeableness", 
        E: "neuroticism"
      }
    },
    {
      id: 6,
      question: "On weekends, you mostly like to:",
      type: "radio",
      options: [
        "Try new hobbies or explore new topics",
        "Finish homework and stay organized",
        "Hang out with friends or meet new people",
        "Help at home or with friends' work",
        "Relax but worry about school sometimes"
      ],
      category: "personality",
      traits: {
        A: "openness",
        B: "conscientiousness",
        C: "extraversion",
        D: "agreeableness",
        E: "neuroticism"
      }
    },
    {
      id: 7,
      question: "How do you feel when you meet someone new?",
      type: "radio",
      options: [
        "Curious to learn about them",
        "Think about how to act properly",
        "Confident and enjoy talking",
        "Try to make them feel comfortable",
        "Feel shy or nervous"
      ],
      category: "personality",
      traits: {
        A: "openness",
        B: "conscientiousness",
        C: "extraversion",
        D: "agreeableness",
        E: "neuroticism"
      }
    },
    {
      id: 8,
      question: "You like:",
      type: "radio",
      options: [
        "Finding new ways to solve problems",
        "Making sure your things are in order",
        "Being part of group chats or hangouts",
        "Helping when someone is upset",
        "Thinking a lot about what could go wrong"
      ],
      category: "personality",
      traits: {
        A: "openness",
        B: "conscientiousness",
        C: "extraversion",
        D: "agreeableness",
        E: "neuroticism"
      }
    },
    {
      id: 9,
      question: "Your perfect classroom group would be:",
      type: "radio",
      options: [
        "Full of people with creative ideas",
        "Everyone is responsible and organized",
        "People who like to talk and work together",
        "People who care for each other",
        "Calm so you don't feel stressed"
      ],
      category: "personality",
      traits: {
        A: "openness",
        B: "conscientiousness", 
        C: "extraversion",
        D: "agreeableness",
        E: "neuroticism"
      }
    },
    {
      id: 10,
      question: "If your plans suddenly change, you:",
      type: "radio",
      options: [
        "Get excited to try something new",
        "Feel uneasy but adjust your plan",
        "Go along with it and stay positive",
        "Think about how others feel",
        "Feel stressed or uncomfortable"
      ],
      category: "personality",
      traits: {
        A: "openness",
        B: "conscientiousness",
        C: "extraversion",
        D: "agreeableness",
        E: "neuroticism"
      }
    },
    {
      id: 11,
      question: "When solving a tough homework problem, you:",
      type: "radio",
      options: [
        "Try a creative or new approach",
        "Break it down into smaller parts",
        "Discuss it with friends",
        "Make sure everyone understands it",
        "Worry you might make a mistake"
      ],
      category: "personality",
      traits: {
        A: "openness",
        B: "conscientiousness",
        C: "extraversion",
        D: "agreeableness",
        E: "neuroticism"
      }
    },
    {
      id: 12,
      question: "You feel happiest when:",
      type: "radio",
      options: [
        "You explore new things",
        "You complete all your work neatly",
        "You are chatting or playing with friends",
        "You help someone feel better",
        "Everything is calm and under control"
      ],
      category: "personality",
      traits: {
        A: "openness",
        B: "conscientiousness",
        C: "extraversion",
        D: "agreeableness",
        E: "neuroticism"
      }
    },
    {
      id: 13,
      question: "How do you handle your daily routine?",
      type: "radio",
      options: [
        "Add new activities to make it fun",
        "Follow a clear schedule",
        "Prefer talking and being social",
        "Make time for friends and family",
        "Worry if things change suddenly"
      ],
      category: "personality",
      traits: {
        A: "openness",
        B: "conscientiousness",
        C: "extraversion",
        D: "agreeableness",
        E: "neuroticism"
      }
    },
    {
      id: 14,
      question: "Your desk or study space is usually:",
      type: "radio",
      options: [
        "Filled with interesting or creative items",
        "Clean and well-organized",
        "A place where friends sometimes come over",
        "Comfortable for everyone",
        "Shows if you're stressed or worried"
      ],
      category: "personality",
      traits: {
        A: "openness",
        B: "conscientiousness",
        C: "extraversion",
        D: "agreeableness",
        E: "neuroticism"
      }
    },
    {
      id: 15,
      question: "During school events, you:",
      type: "radio",
      options: [
        "Try new things like competitions or performances",
        "Help organize and manage things",
        "Talk to lots of people and make new friends",
        "Help others feel included and happy",
        "Stay quiet if you feel nervous"
      ],
      category: "personality",
      traits: {
        A: "openness",
        B: "conscientiousness",
        C: "extraversion",
        D: "agreeableness",
        E: "neuroticism"
      }
    }
  ];
  
  // Personality trait descriptions for interpretation
  export const personalityTraits = {
    openness: {
      name: "Openness to Experience",
      description: "Curious, creative, loves new experiences and learning",
      careers: ["Artist", "Writer", "Scientist", "Entrepreneur", "Designer"]
    },
    conscientiousness: {
      name: "Conscientiousness", 
      description: "Organized, reliable, focused on tasks and responsibilities",
      careers: ["Manager", "Accountant", "Engineer", "Doctor", "Lawyer"]
    },
    extraversion: {
      name: "Extraversion",
      description: "Outgoing, sociable, enjoys group settings and interaction",
      careers: ["Teacher", "Salesperson", "Politician", "Event Manager", "Counselor"]
    },
    agreeableness: {
      name: "Agreeableness",
      description: "Caring, supportive, values others' feelings and cooperation", 
      careers: ["Nurse", "Social Worker", "Therapist", "HR Manager", "Non-profit Worker"]
    },
    neuroticism: {
      name: "Emotional Sensitivity",
      description: "Thoughtful, sensitive, may worry but also deeply caring",
      careers: ["Researcher", "Quality Control", "Safety Officer", "Editor", "Analyst"]
    }
  };
  
  export default personalityQuestions;