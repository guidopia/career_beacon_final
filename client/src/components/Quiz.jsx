import { useState, useMemo } from "react";
import { generateQuiz, evaluateQuiz } from "../services/upskillingService";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  Trophy,
  AlertTriangle,
  FileText,
} from "lucide-react";

const panelClasses =
  "rounded-xl border border-white/[0.06] bg-[#0e0e10] p-5 sm:p-6 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset] text-white";

export default function Quiz({ moduleName, onComplete }) {
  const [quiz, setQuiz] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const startQuiz = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setUserAnswers({});
    try {
      const quizData = await generateQuiz(moduleName);
      setQuiz(quizData);
    } catch (err) {
      console.error("Error starting quiz:", err);
      setError("Couldn't generate the quiz. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerChange = (questionIndex, answer) => {
    setUserAnswers((prev) => ({ ...prev, [questionIndex]: answer }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!quiz?.questions || Object.keys(userAnswers).length !== quiz.questions.length) {
      setError("Please answer every question before submitting.");
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      const evaluation = await evaluateQuiz(moduleName, quiz.questions, userAnswers);
      setResult(evaluation);
      const scoreMatch = typeof evaluation === "string" ? evaluation.match(/Score:\s*(\d+)\s*\/\s*\d+/i) : null;
      const score = scoreMatch ? parseInt(scoreMatch[1], 10) : 0;
      if (typeof onComplete === "function") onComplete(score);
    } catch (err) {
      console.error("Error submitting quiz:", err);
      setError("Couldn't grade the quiz. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetQuiz = () => {
    setQuiz(null);
    setUserAnswers({});
    setResult(null);
    setError(null);
  };

  // -----------------------------------------------------------
  // STATES
  // -----------------------------------------------------------
  if (isLoading) {
    return (
      <div className={`${panelClasses} text-center`}>
        <div className="flex flex-col items-center justify-center py-10">
          <Loader2 className="h-6 w-6 text-gray-400 animate-spin" />
          <p className="text-sm text-gray-400 mt-3">Generating your quiz…</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className={panelClasses}>
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-md bg-white/[0.04] border border-white/[0.08] flex items-center justify-center flex-shrink-0">
            <FileText className="h-4 w-4 text-gray-300" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] uppercase tracking-[0.16em] text-gray-500">Module check</div>
            <h3 className="text-lg font-semibold text-white mt-0.5">{moduleName}</h3>
            <p className="text-sm text-gray-400 mt-1.5">
              10 multiple-choice questions. Score 8 or higher to complete this module and earn XP.
            </p>
            <ul className="mt-4 grid grid-cols-2 gap-2 text-xs text-gray-400">
              <RuleItem>10 questions</RuleItem>
              <RuleItem>Pass at 8/10</RuleItem>
              <RuleItem>+50 XP for 10/10</RuleItem>
              <RuleItem>+25 XP first-try bonus</RuleItem>
            </ul>
          </div>
        </div>
        {error && (
          <div className="mt-5 px-3.5 py-2.5 rounded-md border border-rose-400/20 bg-rose-400/[0.06] text-sm text-rose-200 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={startQuiz}
            className="px-4 py-2 text-sm font-medium text-white bg-white/[0.08] border border-white/[0.12] hover:bg-white/[0.12] hover:border-white/[0.20] rounded-md transition-colors inline-flex items-center gap-2"
          >
            Start quiz
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  if (result) {
    return <QuizResult result={result} totalQuestions={quiz?.questions?.length || 10} onClose={resetQuiz} onRetake={startQuiz} />;
  }

  // -----------------------------------------------------------
  // QUIZ FORM
  // -----------------------------------------------------------
  const totalQuestions = quiz.questions.length;
  const answeredCount = Object.keys(userAnswers).length;
  const progressPct = (answeredCount / totalQuestions) * 100;

  return (
    <div className={panelClasses}>
      <div className="flex items-start justify-between gap-3 mb-5">
        <div className="min-w-0">
          <div className="text-[11px] uppercase tracking-[0.16em] text-gray-500">Quiz</div>
          <h3 className="text-lg font-semibold text-white mt-0.5 truncate">{moduleName}</h3>
        </div>
        <div className="text-xs text-gray-400 flex-shrink-0">
          <span className="text-white font-semibold">{answeredCount}</span> / {totalQuestions} answered
        </div>
      </div>

      <div className="h-1 bg-white/[0.04] rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-gradient-to-r from-emerald-400 to-emerald-300 transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {quiz.questions.map((question, qIdx) => (
          <div key={qIdx} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4 sm:p-5">
            <div className="flex items-start gap-3 mb-3.5">
              <div className="h-6 w-6 rounded-md bg-white/[0.04] border border-white/[0.08] text-xs font-semibold text-gray-300 flex items-center justify-center flex-shrink-0">
                {qIdx + 1}
              </div>
              <p className="text-sm text-white font-medium leading-snug pt-0.5">{question.question}</p>
            </div>
            <div className="space-y-2 ml-9">
              {question.options && typeof question.options === "object" ? (
                Object.entries(question.options).map(([optKey, optText]) => {
                  const selected = userAnswers[qIdx] === optKey;
                  return (
                    <label
                      key={optKey}
                      className={`flex items-start gap-3 p-3 rounded-md cursor-pointer transition-colors border ${
                        selected
                          ? "bg-white/[0.06] border-white/[0.18]"
                          : "bg-transparent border-white/[0.05] hover:bg-white/[0.03] hover:border-white/[0.10]"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${qIdx}`}
                        value={optKey}
                        checked={selected}
                        onChange={() => handleAnswerChange(qIdx, optKey)}
                        className="sr-only"
                      />
                      <div className={`h-5 w-5 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                        selected ? "border-white bg-white" : "border-white/20 bg-transparent"
                      }`}>
                        {selected && <div className="h-2 w-2 rounded-full bg-black" />}
                      </div>
                      <div className="text-sm text-gray-200">
                        <span className="font-semibold mr-1.5">{optKey.toUpperCase()}.</span>
                        {optText}
                      </div>
                    </label>
                  );
                })
              ) : (
                <p className="text-xs text-amber-300">No options available.</p>
              )}
            </div>
          </div>
        ))}

        {error && (
          <div className="px-3.5 py-2.5 rounded-md border border-rose-400/20 bg-rose-400/[0.06] text-sm text-rose-200 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4 border-t border-white/[0.05]">
          <button
            type="button"
            onClick={resetQuiz}
            className="px-4 py-2 text-sm text-gray-300 border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || answeredCount !== totalQuestions}
            className="px-5 py-2 text-sm font-medium text-white bg-white/[0.08] border border-white/[0.12] hover:bg-white/[0.12] hover:border-white/[0.20] rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting…
              </>
            ) : (
              <>
                Submit answers
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

function RuleItem({ children }) {
  return (
    <li className="flex items-center gap-2 text-gray-300">
      <span className="h-1.5 w-1.5 rounded-full bg-gray-500" />
      {children}
    </li>
  );
}

function QuizResult({ result, totalQuestions, onClose, onRetake }) {
  const { score, feedback } = useMemo(() => parseEvaluation(result, totalQuestions), [result, totalQuestions]);
  const passed = score >= 8;
  const perfect = score === 10;
  const pct = Math.round((score / totalQuestions) * 100);

  return (
    <div className={panelClasses}>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className={`h-20 w-20 rounded-xl flex flex-col items-center justify-center flex-shrink-0 border ${
          perfect
            ? "border-amber-400/30 bg-amber-400/[0.08]"
            : passed
            ? "border-emerald-400/25 bg-emerald-400/[0.06]"
            : "border-rose-400/25 bg-rose-400/[0.06]"
        }`}>
          <div className={`text-2xl font-bold ${
            perfect ? "text-amber-200" : passed ? "text-emerald-200" : "text-rose-200"
          }`}>{score}</div>
          <div className={`text-[11px] uppercase tracking-wider ${
            perfect ? "text-amber-300/80" : passed ? "text-emerald-300/80" : "text-rose-300/80"
          }`}>/ {totalQuestions}</div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            {perfect ? (
              <Trophy className="h-4 w-4 text-amber-300" />
            ) : passed ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-300" />
            ) : (
              <XCircle className="h-4 w-4 text-rose-300" />
            )}
            <h3 className="text-lg font-semibold text-white">
              {perfect ? "Perfect score" : passed ? "Module passed" : "Not quite there"}
            </h3>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            {perfect
              ? "You earned the perfect bonus and the first-try bonus (if this was your first attempt)."
              : passed
              ? `${pct}% — module unlocked. Retake to chase a perfect score.`
              : `${pct}% — you need 80% (8/10) to complete this module. Review and try again.`}
          </p>
        </div>
      </div>

      {/* Feedback panel */}
      {feedback && (
        <div className="mt-5 rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
          <div className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-2">
            Feedback
          </div>
          <pre className="whitespace-pre-wrap text-[13px] text-gray-300 leading-relaxed font-sans">
            {feedback}
          </pre>
        </div>
      )}

      <div className="mt-5 flex flex-col sm:flex-row gap-3 justify-end">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm text-gray-300 border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] rounded-md transition-colors"
        >
          Close
        </button>
        <button
          type="button"
          onClick={onRetake}
          className="px-4 py-2 text-sm font-medium text-white bg-white/[0.08] border border-white/[0.12] hover:bg-white/[0.12] hover:border-white/[0.20] rounded-md transition-colors inline-flex items-center justify-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Retake quiz
        </button>
      </div>
    </div>
  );
}

function parseEvaluation(raw, total) {
  if (typeof raw !== "string") return { score: 0, feedback: "" };
  const m = raw.match(/Score:\s*(\d+)\s*\/\s*\d+/i);
  const score = m ? parseInt(m[1], 10) : 0;
  // Strip the "Score: X/Y" line from the feedback
  const feedback = raw.replace(/Score:\s*\d+\s*\/\s*\d+\s*(\(.*?\))?/i, "").trim();
  return { score: Math.max(0, Math.min(total, score)), feedback };
}
