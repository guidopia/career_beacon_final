import React, { useState, useEffect, useMemo } from "react";
import Quiz from "./Quiz";
import {
  ChevronDown,
  Check,
  Clock,
  ArrowLeft,
  ExternalLink,
  ClipboardList,
  Lightbulb,
  FileText,
  CheckCircle2,
  Play,
  BookOpen,
  Trophy,
  Flame,
  Sparkles,
  Target,
  Award,
  Zap,
} from "lucide-react";

// =============================================================================
// XP / SCORING SYSTEM
// =============================================================================
// Per module:
//   - Base XP        = score * 10                  (10/10 = 100 XP)
//   - Perfect bonus  = +50 if score === 10
//   - First-try bonus = +25 if score >= 8 on first attempt
// Per skill:
//   - Course bonus   = +200 when ALL modules are completed (>= 8/10)
//
// Pass threshold: 8/10 (80%)
// =============================================================================

const PASS_THRESHOLD = 8;
const COURSE_COMPLETION_BONUS = 200;

const computeModuleXP = (score, attempts) => {
  const safeScore = Math.max(0, Math.min(10, Number(score) || 0));
  const base = safeScore * 10;
  const perfectBonus = safeScore === 10 ? 50 : 0;
  const firstTryBonus = (attempts || 1) === 1 && safeScore >= PASS_THRESHOLD ? 25 : 0;
  return { total: base + perfectBonus + firstTryBonus, base, perfectBonus, firstTryBonus };
};

const LEVELS = [
  { name: "Novice",      min: 0,    color: "text-slate-300", ring: "ring-slate-400/30" },
  { name: "Apprentice",  min: 250,  color: "text-sky-300",   ring: "ring-sky-400/30" },
  { name: "Adept",       min: 500,  color: "text-indigo-300",ring: "ring-indigo-400/30" },
  { name: "Expert",      min: 800,  color: "text-violet-300",ring: "ring-violet-400/30" },
  { name: "Master",      min: 1100, color: "text-amber-300", ring: "ring-amber-400/30" },
];

const getLevel = (xp) => {
  let current = LEVELS[0];
  for (const l of LEVELS) if (xp >= l.min) current = l;
  const next = LEVELS.find((l) => l.min > xp);
  return { current, next, progress: next ? ((xp - current.min) / (next.min - current.min)) * 100 : 100 };
};

// =============================================================================
// YOUTUBE HELPERS
// =============================================================================
const extractYouTubeId = (url) => {
  if (!url || typeof url !== "string") return null;
  // Watch URL: https://www.youtube.com/watch?v=VIDEOID
  const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch) return { kind: "video", id: watchMatch[1] };
  // Short URL: https://youtu.be/VIDEOID
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return { kind: "video", id: shortMatch[1] };
  // Playlist URL: https://www.youtube.com/playlist?list=PLxxxx
  const listMatch = url.match(/[?&]list=([a-zA-Z0-9_-]+)/);
  if (listMatch) return { kind: "playlist", id: listMatch[1] };
  return null;
};

const youTubeThumbnail = (id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

const domainOf = (url) => {
  try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return ""; }
};

// =============================================================================
// STYLES
// =============================================================================
const panelClasses =
  "rounded-xl border border-white/[0.06] bg-[#0e0e10] p-5 sm:p-6 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset] text-white";

const subtleCard =
  "rounded-lg border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.10] transition-colors duration-200";

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function LearningPath({ skill, data }) {
  const [expandedModule, setExpandedModule] = useState(null);

  const [completedModules, setCompletedModules] = useState(() => {
    const saved = localStorage.getItem(`completedModules_${skill}`);
    if (saved) { try { return JSON.parse(saved); } catch { return {}; } }
    return {};
  });

  const [moduleScores, setModuleScores] = useState(() => {
    const saved = localStorage.getItem(`moduleScores_${skill}`);
    if (saved) { try { return JSON.parse(saved); } catch { return {}; } }
    return {};
  });

  // Track quiz attempts per module — used for first-try bonus
  const [attempts, setAttempts] = useState(() => {
    const saved = localStorage.getItem(`moduleAttempts_${skill}`);
    if (saved) { try { return JSON.parse(saved); } catch { return {}; } }
    return {};
  });

  // Raw quiz scores out of 10 (for average score display)
  const [rawScores, setRawScores] = useState(() => {
    const saved = localStorage.getItem(`moduleRawScores_${skill}`);
    if (saved) { try { return JSON.parse(saved); } catch { return {}; } }
    return {};
  });

  const [quizModule, setQuizModule] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    localStorage.setItem(`completedModules_${skill}`, JSON.stringify(completedModules));
    localStorage.setItem(`moduleScores_${skill}`, JSON.stringify(moduleScores));
    localStorage.setItem(`moduleAttempts_${skill}`, JSON.stringify(attempts));
    localStorage.setItem(`moduleRawScores_${skill}`, JSON.stringify(rawScores));
  }, [completedModules, moduleScores, attempts, rawScores, skill]);

  const totalModules = data?.modules?.length || 0;
  const completedCount = Object.values(completedModules).filter(Boolean).length;
  const allComplete = totalModules > 0 && completedCount === totalModules;

  const totalXP = useMemo(() => {
    const base = Object.values(moduleScores).reduce((s, v) => s + (Number(v) || 0), 0);
    const courseBonus = allComplete ? COURSE_COMPLETION_BONUS : 0;
    return base + courseBonus;
  }, [moduleScores, allComplete]);

  const levelInfo = useMemo(() => getLevel(totalXP), [totalXP]);

  // Streak: how many CONSECUTIVE modules from index 0 are completed
  const streak = useMemo(() => {
    let count = 0;
    for (let i = 0; i < totalModules; i++) {
      if (completedModules[i]) count++; else break;
    }
    return count;
  }, [completedModules, totalModules]);

  const progressPct = totalModules > 0 ? (completedCount / totalModules) * 100 : 0;

  const toggleModule = (index) => setExpandedModule(expandedModule === index ? null : index);

  const handleQuizComplete = (moduleIndex, score) => {
    const currentAttempts = (attempts[moduleIndex] || 0) + 1;
    const xpBreakdown = computeModuleXP(score, currentAttempts);

    setAttempts((prev) => ({ ...prev, [moduleIndex]: currentAttempts }));
    setModuleScores((prev) => ({ ...prev, [moduleIndex]: xpBreakdown.total }));
    setRawScores((prev) => ({ ...prev, [moduleIndex]: Math.max(0, Math.min(10, Number(score) || 0)) }));

    if (score >= PASS_THRESHOLD) {
      setCompletedModules((prev) => {
        const next = { ...prev, [moduleIndex]: true };
        // Detect "just finished the course"
        const willFinishCourse =
          totalModules > 0 && Object.values(next).filter(Boolean).length === totalModules;
        if (willFinishCourse) {
          setShowCelebration(true);
          setTimeout(() => setShowCelebration(false), 4000);
        }
        return next;
      });
    }

    setQuizModule(null);
  };

  const startQuiz = (moduleIndex) => setQuizModule(moduleIndex);

  const resetModule = (moduleIndex) => {
    if (!completedModules[moduleIndex]) return;
    setModuleScores((prev) => { const n = { ...prev }; delete n[moduleIndex]; return n; });
    setCompletedModules((prev) => { const n = { ...prev }; delete n[moduleIndex]; return n; });
    setAttempts((prev) => { const n = { ...prev }; delete n[moduleIndex]; return n; });
    setRawScores((prev) => { const n = { ...prev }; delete n[moduleIndex]; return n; });
  };

  // -----------------------------------------------------------------------
  // GUARDS
  // -----------------------------------------------------------------------
  if (!data || !data.modules) {
    return (
      <div className={panelClasses}>
        <p className="text-gray-400 text-center">Learning path data is not available for "{skill}".</p>
      </div>
    );
  }

  if (quizModule !== null && data.modules[quizModule]) {
    return (
      <div className={panelClasses}>
        <button
          onClick={() => setQuizModule(null)}
          className="inline-flex items-center px-3 py-1.5 mb-6 text-gray-300 border border-white/[0.10] bg-white/[0.03] rounded-lg hover:bg-white/[0.06] transition-colors duration-200 text-sm"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Learning Path
        </button>

        <Quiz
          moduleName={data.modules[quizModule].title}
          onComplete={(score) => handleQuizComplete(quizModule, score)}
        />
      </div>
    );
  }

  // -----------------------------------------------------------------------
  // RENDER
  // -----------------------------------------------------------------------
  return (
    <div className="space-y-5">
      {/* HEADER PANEL — skill summary + level + XP */}
      <div className={panelClasses}>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="min-w-0">
              <div className="text-[11px] uppercase tracking-[0.18em] text-gray-500 mb-1.5">
                Learning path
              </div>
              <h2 className="text-2xl sm:text-[28px] font-semibold text-white leading-tight">
                {skill}
              </h2>
              {data.totalDuration && (
                <p className="text-sm text-gray-400 mt-1.5 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  Estimated total · {data.totalDuration}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <div className={`px-3 py-1.5 rounded-md bg-white/[0.04] border border-white/[0.08] ring-1 ${levelInfo.current.ring}`}>
                <div className="text-[10px] uppercase tracking-[0.16em] text-gray-500">Level</div>
                <div className={`text-sm font-semibold ${levelInfo.current.color}`}>{levelInfo.current.name}</div>
              </div>
              <div className="px-3 py-1.5 rounded-md bg-white/[0.04] border border-white/[0.08]">
                <div className="text-[10px] uppercase tracking-[0.16em] text-gray-500">Total XP</div>
                <div className="text-sm font-semibold text-white">{totalXP.toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* Progress + level bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
              <div className="flex items-center justify-between mb-2.5">
                <div className="text-xs text-gray-400">Course progress</div>
                <div className="text-xs text-gray-300">
                  <span className="text-white font-semibold">{completedCount}</span>
                  <span className="text-gray-500"> / {totalModules} modules</span>
                </div>
              </div>
              <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-emerald-300 rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div className="text-[11px] text-gray-500 mt-2">
                {progressPct === 100 ? "Course mastered" : `${Math.round(progressPct)}% complete`}
              </div>
            </div>

            <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
              <div className="flex items-center justify-between mb-2.5">
                <div className="text-xs text-gray-400">
                  Progress to {levelInfo.next ? levelInfo.next.name : "Master"}
                </div>
                <div className="text-xs text-gray-300">
                  {levelInfo.next ? (
                    <>
                      <span className="text-white font-semibold">{totalXP - levelInfo.current.min}</span>
                      <span className="text-gray-500"> / {levelInfo.next.min - levelInfo.current.min} XP</span>
                    </>
                  ) : (
                    <span className="text-amber-300 font-semibold">Max level</span>
                  )}
                </div>
              </div>
              <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-400 to-amber-300 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, levelInfo.progress)}%` }}
                />
              </div>
              <div className="text-[11px] text-gray-500 mt-2">
                Level up by completing modules and scoring 10/10
              </div>
            </div>
          </div>

          {/* Achievement strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <Stat icon={<Flame className="h-4 w-4" />} label="Streak" value={`${streak} module${streak === 1 ? "" : "s"}`} active={streak > 0} accent="text-orange-300" />
            <Stat icon={<Trophy className="h-4 w-4" />} label="Perfects" value={String(Object.values(rawScores).filter((s) => s === 10).length)} active={Object.values(rawScores).some((s) => s === 10)} accent="text-amber-300" />
            <Stat icon={<Target className="h-4 w-4" />} label="Avg score" value={`${avgScore(rawScores)}/10`} active={completedCount > 0} accent="text-sky-300" />
            <Stat icon={<Award className="h-4 w-4" />} label="Bonus XP" value={allComplete ? `+${COURSE_COMPLETION_BONUS}` : "—"} active={allComplete} accent="text-emerald-300" />
          </div>

          {showCelebration && (
            <div className="rounded-lg border border-emerald-400/30 bg-emerald-400/[0.06] px-4 py-3 flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-emerald-400/20 flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-4 w-4 text-emerald-300" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-emerald-200">Course complete</div>
                <div className="text-xs text-emerald-100/80">You earned a +{COURSE_COMPLETION_BONUS} XP completion bonus.</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODULE LIST */}
      <div className="space-y-3">
        {data.modules.map((module, index) => {
          if (!module || typeof module !== "object") return null;

          const isCompleted = !!completedModules[index];
          const isExpanded = expandedModule === index;
          const xpEarned = Number(moduleScores[index]) || 0;
          const isLocked = index > 0 && !completedModules[index - 1] && !isCompleted && !isExpanded;

          return (
            <div
              key={index}
              className={`rounded-xl border transition-colors duration-200 ${
                isCompleted
                  ? "border-emerald-400/20 bg-emerald-400/[0.03]"
                  : "border-white/[0.06] bg-[#0e0e10]"
              }`}
            >
              {/* Header row */}
              <button
                type="button"
                onClick={() => toggleModule(index)}
                className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors rounded-xl"
              >
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  <div
                    className={`flex-shrink-0 h-9 w-9 sm:h-10 sm:w-10 rounded-lg flex items-center justify-center text-sm font-semibold ${
                      isCompleted
                        ? "bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-400/30"
                        : "bg-white/[0.04] text-gray-300 ring-1 ring-white/[0.06]"
                    }`}
                  >
                    {isCompleted ? <Check className="h-4 w-4" /> : <span>{index + 1}</span>}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-[15px] sm:text-base font-semibold text-white truncate">
                        {module.title}
                      </h3>
                      {isCompleted && (
                        <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-400/15 text-emerald-300 border border-emerald-400/20">
                          Done
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-3 flex-wrap">
                      {module.duration && (
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {module.duration}
                        </span>
                      )}
                      {xpEarned > 0 && (
                        <span className="inline-flex items-center gap-1 text-emerald-300/90">
                          <Zap className="h-3 w-3" />
                          +{xpEarned} XP
                        </span>
                      )}
                      {isLocked && (
                        <span className="text-amber-300/80">Complete previous module first</span>
                      )}
                    </div>
                  </div>
                </div>
                <ChevronDown
                  className={`h-5 w-5 text-gray-500 transition-transform duration-200 flex-shrink-0 ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Expanded content */}
              {isExpanded && (
                <div className="px-4 sm:px-5 pb-5 border-t border-white/[0.05]">
                  {module.description && (
                    <div className="pt-5 mb-5">
                      <p className="text-sm text-gray-300 leading-relaxed">{module.description}</p>
                    </div>
                  )}

                  {/* Objectives + key points */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                    {Array.isArray(module.objectives) && module.objectives.length > 0 && (
                      <SubPanel
                        icon={<Target className="h-3.5 w-3.5 text-sky-300" />}
                        label="Learning objectives"
                      >
                        <ul className="space-y-1.5">
                          {module.objectives.map((o, i) => (
                            <li key={i} className="text-sm text-gray-300 flex gap-2">
                              <span className="text-gray-600 mt-0.5">•</span>
                              <span>{o}</span>
                            </li>
                          ))}
                        </ul>
                      </SubPanel>
                    )}

                    {Array.isArray(module.keyPoints) && module.keyPoints.length > 0 && (
                      <SubPanel
                        icon={<BookOpen className="h-3.5 w-3.5 text-violet-300" />}
                        label="Key concepts"
                      >
                        <ul className="space-y-1.5">
                          {module.keyPoints.map((p, i) => (
                            <li key={i} className="text-sm text-gray-300 flex gap-2">
                              <span className="text-gray-600 mt-0.5">•</span>
                              <span>{p}</span>
                            </li>
                          ))}
                        </ul>
                      </SubPanel>
                    )}
                  </div>

                  {/* Practical task */}
                  {module.practicalTask && (
                    <div className="mb-5 rounded-lg border border-amber-400/20 bg-amber-400/[0.04] p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <ClipboardList className="h-3.5 w-3.5 text-amber-300" />
                        <div className="text-[11px] uppercase tracking-wider text-amber-300 font-semibold">
                          Build this
                        </div>
                      </div>
                      <p className="text-sm text-amber-100/90 leading-relaxed">
                        {module.practicalTask}
                      </p>
                    </div>
                  )}

                  {/* Watch & Learn — Perplexity-sourced video */}
                  <ResourceVideo resource={module.resources?.video} />

                  {/* Read & Reference — Perplexity-sourced articles */}
                  <ResourceArticles articles={module.resources?.articles} />

                  {/* Tips */}
                  {Array.isArray(module.tips) && module.tips.length > 0 && (
                    <div className="mb-5 rounded-lg border border-sky-400/15 bg-sky-400/[0.03] p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="h-3.5 w-3.5 text-sky-300" />
                        <div className="text-[11px] uppercase tracking-wider text-sky-300 font-semibold">
                          Pro tips
                        </div>
                      </div>
                      <ul className="space-y-1.5">
                        {module.tips.map((tip, i) => (
                          <li key={i} className="text-sm text-sky-100/90 flex gap-2">
                            <span className="text-sky-400/60 mt-0.5">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Action row */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between pt-4 border-t border-white/[0.05]">
                    <div className="text-xs">
                      {isCompleted ? (
                        <div className="flex items-center gap-2 text-emerald-300">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>
                            Module passed
                            {xpEarned > 0 && <span className="text-emerald-200/80"> · +{xpEarned} XP earned</span>}
                          </span>
                        </div>
                      ) : (
                        <div className="text-gray-400">
                          Score 8/10 or higher on the quiz to complete this module
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {isCompleted && (
                        <button
                          type="button"
                          onClick={() => resetModule(index)}
                          className="px-3 py-2 text-xs text-gray-300 border border-white/[0.08] bg-white/[0.02] rounded-md hover:bg-white/[0.05] transition-colors"
                        >
                          Reset
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => startQuiz(index)}
                        className="px-4 py-2 text-sm font-medium text-white bg-white/[0.06] border border-white/[0.10] rounded-md hover:bg-white/[0.10] hover:border-white/[0.18] transition-colors inline-flex items-center gap-2"
                      >
                        <FileText className="h-4 w-4" />
                        {isCompleted ? "Retake quiz" : "Take quiz"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

function Stat({ icon, label, value, active, accent }) {
  return (
    <div className="rounded-md border border-white/[0.06] bg-white/[0.02] p-3 flex items-start gap-2.5">
      <div className={`flex-shrink-0 mt-[2px] ${active ? accent : "text-gray-600"}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-[10px] uppercase tracking-[0.16em] text-gray-500">{label}</div>
        <div className={`text-sm font-semibold mt-0.5 ${active ? "text-white" : "text-gray-500"}`}>
          {value}
        </div>
      </div>
    </div>
  );
}

function SubPanel({ icon, label, children }) {
  return (
    <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
      <div className="flex items-center gap-2 mb-2.5">
        {icon}
        <div className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">
          {label}
        </div>
      </div>
      {children}
    </div>
  );
}

function ResourceVideo({ resource }) {
  if (!resource || !resource.url) return null;
  const yt = extractYouTubeId(resource.url);

  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-3">
        <Play className="h-3.5 w-3.5 text-rose-300" />
        <div className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">
          Watch &amp; learn
        </div>
      </div>
      <a
        href={resource.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex flex-col sm:flex-row gap-0 ${subtleCard} overflow-hidden group`}
      >
        <div className="relative w-full sm:w-56 flex-shrink-0 aspect-video sm:aspect-auto bg-black/40">
          {yt && yt.kind === "video" ? (
            <img
              src={youTubeThumbnail(yt.id)}
              alt={resource.title}
              className="w-full h-full object-cover sm:h-full"
              loading="lazy"
              onError={(e) => { e.currentTarget.style.display = "none"; }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-rose-500/20 to-rose-500/5">
              <Play className="h-10 w-10 text-rose-300/80" />
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="h-12 w-12 rounded-full bg-white/90 flex items-center justify-center">
              <Play className="h-5 w-5 text-black ml-0.5" fill="currentColor" />
            </div>
          </div>
          <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/70 text-[10px] uppercase tracking-wider text-white font-semibold">
            {resource.kind === "playlist" ? "Playlist" : "Video"}
          </div>
        </div>
        <div className="flex-1 p-4 min-w-0">
          <div className="text-xs text-gray-500 mb-1">YouTube{resource.channel ? ` · ${resource.channel}` : ""}</div>
          <div className="text-[15px] font-semibold text-white group-hover:text-white leading-snug line-clamp-2">
            {resource.title || "Recommended video"}
          </div>
          <div className="text-xs text-gray-400 mt-2 flex items-center gap-3 flex-wrap">
            {resource.duration && <span>{resource.duration}</span>}
            <span className="inline-flex items-center gap-1 text-gray-500 group-hover:text-gray-300 transition-colors">
              Watch on YouTube
              <ExternalLink className="h-3 w-3" />
            </span>
          </div>
        </div>
      </a>
    </div>
  );
}

function ResourceArticles({ articles }) {
  if (!Array.isArray(articles) || articles.length === 0) return null;
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-3">
        <BookOpen className="h-3.5 w-3.5 text-emerald-300" />
        <div className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">
          Read &amp; reference
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {articles.map((a, i) => {
          const source = a.source || domainOf(a.url);
          return (
            <a
              key={i}
              href={a.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-3.5 ${subtleCard} group block`}
            >
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-md bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <BookOpen className="h-3.5 w-3.5 text-emerald-300" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-medium text-white leading-snug line-clamp-2 group-hover:text-white">
                    {a.title || source || "Article"}
                  </div>
                  <div className="text-xs text-gray-500 mt-1.5 flex items-center gap-1.5">
                    <span className="truncate">{source || "external"}</span>
                    <ExternalLink className="h-3 w-3 flex-shrink-0 text-gray-600 group-hover:text-gray-400" />
                  </div>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}

// =============================================================================
// PURE HELPERS
// =============================================================================
function avgScore(rawScores) {
  const vals = Object.values(rawScores).map((v) => Number(v) || 0);
  if (!vals.length) return 0;
  const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
  return Math.round(avg * 10) / 10;
}
