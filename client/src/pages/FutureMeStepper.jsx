import { useState } from "react";
import { useNavigate } from "react-router-dom";

const questions = [
  {
    key: "excitement",
    label: "What excites you most?",
    subtitle: "Choose the option that resonates with you most",
    options: [
      "Building things", "Solving puzzles", "Helping people", "Creating art", "Leading teams"
    ]
  },
  {
    key: "subject",
    label: "Pick your favorite subject:",
    subtitle: "Choose one option",
    options: [
      "Math", "Science", "Literature", "Art/Design", "Social Studies"
    ]
  },
  {
    key: "workStyle",
    label: "How do you like to work?",
    subtitle: "Choose the option that best describes you",
    options: [
      "Alone, deep focus", "In a team, collaborating", "Leading and organizing", "Teaching/explaining"
    ]
  },
  {
    key: "impact",
    label: "What's your dream impact?",
    subtitle: "What kind of difference do you want to make?",
    options: [
      "Invent something new", "Inspire others", "Make the world fairer", "Entertain and delight", "Build a successful business"
    ]
  },
  {
    key: "skill",
    label: "Which skill do you want to master?",
    subtitle: "Pick one you'd love to master",
    options: [
      "Coding/Tech", "Communication", "Creativity", "Analysis/Logic", "Empathy"
    ]
  }
];

export default function FutureMeStepper() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSelect = (option) => {
    setAnswers(a => ({ ...a, [questions[step].key]: option }));
    setTimeout(() => {
      if (step < questions.length - 1) setStep(step + 1);
      else handleSubmit({ ...answers, [questions[step].key]: option });
    }, 180);
  };

  const handleSubmit = async (finalAnswers) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch('https://guidopia-server.vercel.app/api/futureme-stepper/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ answers: finalAnswers })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.details || 'Failed to generate Future Me card');
      }

      const response = await res.json();

      if (!response.data) {
        throw new Error('Invalid response format from server');
      }

      setLoading(false);
      navigate('/future-me-card', {
        state: {
          card: response.data,
          fromStepper: true
        }
      });
    } catch (error) {
      setLoading(false);
      console.error('Error generating Future Me card:', error);
      // Show error to user
      alert('Sorry, we couldn\'t generate your Future Me card. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-cyan-400 text-xl font-semibold animate-pulse">Generating your Future Me...</div>
      </div>
    );
  }

  const q = questions[step];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen mt-20 items-center justify-center lg:gap-32 bg-black px-4 py-8 lg:py-0">
      <div className="mb-8 lg:mb-0 text-center lg:text-left">
        <h1 className="text-3xl sm:text-4xl font-semibold mb-3 text-white">
          Future Me Card
        </h1>
        <p className="text-gray-400 text-base sm:text-lg">
          Visualize and plan your future career
        </p>
      </div>
      <div className="w-full max-w-md bg-black/70 border border-gray-800 rounded-2xl p-6 sm:p-8 shadow-lg backdrop-blur-sm">
        {/* Step Indicator */}
        <div className="flex justify-center mb-3">
          <span className="px-3 py-0.5 rounded-full bg-cyan-400/10 text-cyan-300 text-xs font-medium">
            Step {step + 1} of {questions.length}
          </span>
        </div>
        {/* Question */}
        <h2 className="text-xl font-bold text-white text-center mb-1">{q.label}</h2>
        {/* Subtitle */}
        <p className="text-gray-400 text-center text-sm mb-6">{q.subtitle}</p>
        {/* Options */}
        <div className="flex flex-col gap-3 mb-8">
          {q.options.map(option => (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              className="
                flex items-center justify-between w-full px-5 py-3
                bg-black/40 border border-gray-800 rounded-lg
                text-white text-base font-normal
                hover:border-cyan-400 hover:bg-cyan-400/10
                transition-all group
              "
            >
              <span>{option}</span>
              <svg
                className="ml-2 text-cyan-400 group-hover:translate-x-1 transition-transform"
                width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
              >
                <path d="M5 9h8M11 5l4 4-4 4" />
              </svg>
            </button>
          ))}
        </div>
        {/* Progress bar */}
        <div className="flex justify-center gap-2">
          {Array.from({ length: questions.length }).map((_, i) => (
            <span
              key={i}
              className={`w-2.5 h-2.5 rounded-full
                ${i === step ? 'bg-cyan-400' : 'bg-gray-700'}
                transition-all`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
