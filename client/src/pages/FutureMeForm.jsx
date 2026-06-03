import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from '../api/index';

const questions = [
  { key: "name", label: "What's your name?" },
  { key: "age", label: "How old are you?" },
  { key: "interests", label: "What are your top 2 interests?" },
  { key: "skills", label: "What skills do you want to develop?" },
  { key: "roleModel", label: "Who is your role model?" }
];

export default function FutureMeForm() {
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (key, value) => setAnswers(a => ({ ...a, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`${API_BASE_URL}/api/futureme/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers })
    });
    const card = await res.json();
    setLoading(false);
    navigate('/future-me-card', { state: { card } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <form onSubmit={handleSubmit} className="max-w-lg w-full bg-gray-900/80 border border-gray-800/40 rounded-3xl shadow-2xl p-10">
        <h2 className="text-3xl font-bold mb-8 text-center text-cyan-300">Let's build your Future Me Card!</h2>
        {questions.map(q => (
          <div key={q.key} className="mb-6">
            <label className="block text-lg text-white mb-2">{q.label}</label>
            <input
              type="text"
              required
              className="w-full p-3 rounded-xl bg-gray-800/50 border border-cyan-400/30 text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-600 outline-none transition"
              value={answers[q.key] || ""}
              onChange={e => handleChange(q.key, e.target.value)}
            />
          </div>
        ))}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 mt-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-xl text-lg shadow-lg hover:from-cyan-400 hover:to-blue-400 transition-all duration-200"
        >
          {loading ? "Generating..." : "See My Future Me Card"}
        </button>
      </form>
    </div>
  );
}
