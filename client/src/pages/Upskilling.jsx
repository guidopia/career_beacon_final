import { useState, useEffect } from "react";
import { generateLearningPath } from "../services/upskillingService";
import LearningPath from "../components/LearningPath";
import { ArrowLeft, MessageCircle, Search, Sparkles, Loader2, Compass } from "lucide-react";
import { API_BASE_URL } from "../api/index";

export default function Upskilling() {
  const [selectedSkill, setSelectedSkill] = useState(() => {
    const saved = localStorage.getItem("selectedSkill");
    if (saved) {
      try { return JSON.parse(saved); } catch { localStorage.removeItem("selectedSkill"); return null; }
    }
    return null;
  });

  const [learningPathData, setLearningPathData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [browseFilter, setBrowseFilter] = useState("");
  const [profile, setProfile] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");

  // Curated, focused skill catalogue. Kept tight: Pinterest-style overload felt cheap.
  const popularSkills = [
    // Frontend
    { name: "React Development", category: "Frontend" },
    { name: "Vue.js Development", category: "Frontend" },
    { name: "Next.js Development", category: "Frontend" },
    { name: "TypeScript Development", category: "Frontend" },
    { name: "JavaScript ES6+", category: "Frontend" },
    { name: "Tailwind CSS", category: "Frontend" },
    { name: "Web Performance Optimization", category: "Frontend" },
    { name: "Web Accessibility", category: "Frontend" },
    // Backend
    { name: "Node.js Development", category: "Backend" },
    { name: "Express.js Framework", category: "Backend" },
    { name: "Python Django", category: "Backend" },
    { name: "FastAPI Development", category: "Backend" },
    { name: "Java Spring Boot", category: "Backend" },
    { name: "Go Programming", category: "Backend" },
    { name: "GraphQL Development", category: "Backend" },
    { name: "Microservices Architecture", category: "Backend" },
    // Mobile
    { name: "React Native Development", category: "Mobile" },
    { name: "Flutter Development", category: "Mobile" },
    { name: "iOS Swift Development", category: "Mobile" },
    { name: "Android Kotlin Development", category: "Mobile" },
    // Database
    { name: "SQL Database Design", category: "Database" },
    { name: "PostgreSQL Administration", category: "Database" },
    { name: "MongoDB Development", category: "Database" },
    { name: "Redis Caching", category: "Database" },
    // Cloud / DevOps
    { name: "Amazon Web Services (AWS)", category: "Cloud" },
    { name: "Google Cloud Platform (GCP)", category: "Cloud" },
    { name: "Microsoft Azure", category: "Cloud" },
    { name: "Docker Containerization", category: "DevOps" },
    { name: "Kubernetes Orchestration", category: "DevOps" },
    { name: "GitHub Actions", category: "DevOps" },
    { name: "Terraform", category: "DevOps" },
    { name: "Linux System Administration", category: "DevOps" },
    // AI / ML
    { name: "Python for AI/ML", category: "AI/ML" },
    { name: "Prompt Engineering", category: "AI/ML" },
    { name: "Large Language Models (LLMs)", category: "AI/ML" },
    { name: "TensorFlow Development", category: "AI/ML" },
    { name: "PyTorch Development", category: "AI/ML" },
    { name: "Deep Learning", category: "AI/ML" },
    { name: "Computer Vision", category: "AI/ML" },
    { name: "Natural Language Processing", category: "AI/ML" },
    // Data
    { name: "Data Analysis", category: "Data" },
    { name: "SQL for Analytics", category: "Data" },
    { name: "Pandas Data Analysis", category: "Data" },
    { name: "Tableau Development", category: "Data" },
    { name: "Power BI", category: "Data" },
    { name: "A/B Testing", category: "Data" },
    // Security
    { name: "Ethical Hacking", category: "Security" },
    { name: "Penetration Testing", category: "Security" },
    { name: "Web Application Security", category: "Security" },
    { name: "Cloud Security", category: "Security" },
    // Design
    { name: "User Experience (UX) Design", category: "Design" },
    { name: "User Interface (UI) Design", category: "Design" },
    { name: "Figma Design", category: "Design" },
    { name: "Design Systems", category: "Design" },
    { name: "Webflow Design", category: "Design" },
    // Product / Management
    { name: "Product Management", category: "Product" },
    { name: "Agile & Scrum", category: "Product" },
    { name: "Project Management", category: "Product" },
    { name: "Strategic Planning", category: "Product" },
    // Marketing
    { name: "Search Engine Optimization (SEO)", category: "Marketing" },
    { name: "Google Ads", category: "Marketing" },
    { name: "Content Marketing", category: "Marketing" },
    { name: "Email Marketing", category: "Marketing" },
    { name: "Growth Hacking", category: "Marketing" },
    // Programming Languages
    { name: "Python Programming", category: "Languages" },
    { name: "Rust Programming", category: "Languages" },
    { name: "C++ Programming", category: "Languages" },
    { name: "Swift Programming", category: "Languages" },
  ];

  const categories = ["All", ...Array.from(new Set(popularSkills.map((s) => s.category)))];

  useEffect(() => {
    if (selectedSkill) localStorage.setItem("selectedSkill", JSON.stringify(selectedSkill));
    else localStorage.removeItem("selectedSkill");
  }, [selectedSkill]);

  useEffect(() => {
    if (!selectedSkill) {
      setLearningPathData(null);
      setIsLoading(false);
      return;
    }

    setLearningPathData(null);

    // Cached learning path includes per-module video + articles already
    const cached = localStorage.getItem(`learningPath_${selectedSkill}`);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        // Trust the cache only if:
        //  1. It uses the new object-shaped `resources` (not legacy array)
        //  2. At least HALF of the modules actually have a video — otherwise
        //     it was generated when Perplexity was failing/silent and is junk.
        const modules = Array.isArray(parsed?.modules) ? parsed.modules : [];
        const hasNewResources = modules.some(
          (m) => m?.resources && typeof m.resources === "object" && !Array.isArray(m.resources)
        );
        const modulesWithVideo = modules.filter((m) => m?.resources?.video?.url).length;
        const enoughVideos = modules.length === 0 ? false : modulesWithVideo >= Math.ceil(modules.length / 2);

        if (parsed && hasNewResources && enoughVideos) {
          setLearningPathData(parsed);
          return;
        }
        // Stale / under-populated cache → drop and refetch
        localStorage.removeItem(`learningPath_${selectedSkill}`);
      } catch (e) {
        localStorage.removeItem(`learningPath_${selectedSkill}`);
      }
    }

    let cancelled = false;
    const run = async () => {
      setIsLoading(true);
      try {
        const data = await generateLearningPath(selectedSkill);
        if (cancelled) return;
        if (data) {
          setLearningPathData(data);
          localStorage.setItem(`learningPath_${selectedSkill}`, JSON.stringify(data));
        }
      } catch (error) {
        console.error(`Error fetching learning path for '${selectedSkill}':`, error);
        if (!cancelled) setLearningPathData(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    run();
    return () => { cancelled = true; };
  }, [selectedSkill]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/user/profile`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json'
          }
        });
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        }
      } catch (error) {
        console.error("Failed to fetch user profile", error);
      }
    };
    fetchProfile();
  }, []);

  const handleSkillSelect = async (skillName) => {
    if (selectedSkill === skillName) return;

    if (profile && Array.isArray(profile.skillsInProgress) && !profile.skillsInProgress.some(s => s.name === skillName)) {
      const updatedSkills = [...profile.skillsInProgress, { name: skillName, progress: 0 }];
      try {
        await fetch(`${API_BASE_URL}/api/user/profile`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ skillsInProgress: updatedSkills })
        });
        setProfile(prev => ({ ...prev, skillsInProgress: updatedSkills }));
      } catch (error) {
        console.error("Failed to update profile with new skill", error);
      }
    }

    setSelectedSkill(skillName);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setSelectedSkill(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchSubmit = (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (searchTerm.trim()) {
      handleSkillSelect(searchTerm.trim());
      setSearchTerm("");
    }
  };

  // Filter
  let displaySkills = popularSkills;
  if (activeCategory !== "All") {
    displaySkills = displaySkills.filter((s) => s.category === activeCategory);
  }
  if (browseFilter.trim()) {
    const q = browseFilter.toLowerCase().trim();
    displaySkills = displaySkills.filter((s) => s.name.toLowerCase().includes(q));
  }

  const inProgressSkills = profile?.skillsInProgress || [];

  // Reusable styles
  const panel = "rounded-xl border border-white/[0.06] bg-[#0e0e10] shadow-[0_1px_0_rgba(255,255,255,0.04)_inset]";

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-16 bg-[#0a0a0c] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {!selectedSkill ? (
          <div className="space-y-6">
            {/* HEADER */}
            <div className={`${panel} p-6 sm:p-8`}>
              <div className="text-[11px] uppercase tracking-[0.18em] text-gray-500 mb-1.5">
                Upskilling
              </div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                Build any skill, end-to-end
              </h1>
              <p className="text-sm sm:text-[15px] text-gray-400 mt-2 max-w-2xl">
                Pick a skill or describe one. Prodigy AI builds a 6-module path with real videos and reference articles, then quizzes you to lock it in.
              </p>

              {/* Custom skill input + browse filter (single calm form) */}
              <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-3">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <Sparkles className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Generate any skill — e.g. Prompt Engineering, Solidity, Music Production"
                    className="w-full pl-10 pr-32 py-3 bg-white/[0.03] border border-white/[0.08] text-white placeholder-gray-500 rounded-lg text-sm focus:bg-white/[0.05] focus:border-white/[0.18] focus:outline-none focus:ring-1 focus:ring-white/[0.12] transition-all"
                  />
                  <button
                    type="submit"
                    disabled={!searchTerm.trim()}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3.5 py-2 bg-white/[0.08] border border-white/[0.10] hover:bg-white/[0.12] text-white text-xs font-medium rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Generate path
                  </button>
                </form>

                <div className="relative lg:w-72">
                  <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    value={browseFilter}
                    onChange={(e) => setBrowseFilter(e.target.value)}
                    placeholder="Filter catalogue"
                    className="w-full pl-10 pr-3 py-3 bg-white/[0.02] border border-white/[0.06] text-white placeholder-gray-500 rounded-lg text-sm focus:bg-white/[0.04] focus:border-white/[0.12] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Continue learning */}
              {Array.isArray(inProgressSkills) && inProgressSkills.length > 0 && (
                <div className="mt-7 pt-6 border-t border-white/[0.05]">
                  <div className="text-[11px] uppercase tracking-[0.16em] text-gray-500 mb-3">
                    Continue learning
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {inProgressSkills.slice(0, 8).map((s) => (
                      <button
                        key={s.name}
                        onClick={() => handleSkillSelect(s.name)}
                        className="px-3 py-1.5 text-xs rounded-md bg-white/[0.03] border border-white/[0.08] text-gray-200 hover:bg-white/[0.06] hover:border-white/[0.14] transition-colors"
                      >
                        {s.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* CATEGORY TABS */}
            <div className={`${panel} px-3 sm:px-4 py-2.5`}>
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`flex-shrink-0 px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
                      activeCategory === cat
                        ? "bg-white/[0.10] text-white border border-white/[0.14]"
                        : "text-gray-400 hover:text-gray-200 hover:bg-white/[0.04] border border-transparent"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* SKILL GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
              {displaySkills.map((skill) => (
                <button
                  key={skill.name}
                  onClick={() => handleSkillSelect(skill.name)}
                  className="group text-left p-4 rounded-lg border border-white/[0.06] bg-[#0e0e10] hover:border-white/[0.14] hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2">
                      {skill.name}
                    </h3>
                    <Compass className="h-4 w-4 text-gray-600 group-hover:text-gray-400 flex-shrink-0 mt-0.5 transition-colors" />
                  </div>
                  <div className="text-[11px] text-gray-500 uppercase tracking-wider">
                    {skill.category}
                  </div>
                </button>
              ))}

              {displaySkills.length === 0 && (
                <div className="col-span-full text-center py-12 text-sm text-gray-500">
                  No skills match "{browseFilter}". Type it into the generator above to create a custom path.
                </div>
              )}
            </div>

            {/* MENTORSHIP CTA */}
            <div className={`${panel} p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between`}>
              <div className="flex items-start gap-3 min-w-0">
                <div className="h-10 w-10 rounded-md bg-white/[0.04] border border-white/[0.08] flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="h-4 w-4 text-gray-300" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-white">Need a human guide?</div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    Talk to a Prodigy AI counsellor for a custom roadmap and mentor matching.
                  </div>
                </div>
              </div>
              <button className="px-4 py-2 text-sm font-medium text-white bg-white/[0.06] border border-white/[0.10] hover:bg-white/[0.10] hover:border-white/[0.18] rounded-md transition-colors flex-shrink-0 inline-flex items-center gap-2">
                Schedule counselling
                <MessageCircle className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <button
                onClick={handleBack}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-gray-300 border border-white/[0.10] bg-white/[0.03] rounded-md hover:bg-white/[0.06] hover:border-white/[0.16] transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                All skills
              </button>
            </div>

            {isLoading && !learningPathData ? (
              <div className={`${panel} px-6 py-16`}>
                <div className="flex flex-col items-center justify-center text-center">
                  <Loader2 className="h-6 w-6 text-gray-400 animate-spin" />
                  <h3 className="text-base font-semibold text-white mt-4">
                    Building your learning path
                  </h3>
                  <p className="text-sm text-gray-500 mt-1.5 max-w-md">
                    Designing modules, finding the best videos and articles for each topic. This usually takes 15–25 seconds.
                  </p>
                  <div className="mt-6 space-y-2 text-xs text-gray-400 text-left">
                    <LoadingStep label="Designing 6-module curriculum" />
                    <LoadingStep label="Searching for top videos & playlists" />
                    <LoadingStep label="Finding authoritative articles & docs" />
                  </div>
                </div>
              </div>
            ) : learningPathData ? (
              <LearningPath skill={selectedSkill} data={learningPathData} />
            ) : (
              <div className={`${panel} px-6 py-12 text-center`}>
                <div className="text-sm text-gray-400">
                  Could not load learning path for {selectedSkill}.
                </div>
                <button
                  onClick={handleBack}
                  className="mt-4 px-4 py-2 text-sm text-white bg-white/[0.06] border border-white/[0.10] hover:bg-white/[0.10] rounded-md transition-colors"
                >
                  Pick another skill
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function LoadingStep({ label }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="h-1.5 w-1.5 rounded-full bg-gray-500 animate-pulse" />
      <span>{label}</span>
    </div>
  );
}
