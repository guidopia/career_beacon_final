import React, { useState, useEffect } from "react";
import {
    Brain,
    Code,
    Palette,
    TrendingUp,
    Award,
    Clock,
    Users,
    Star,
    ArrowRight,
    ChevronRight,
    Zap,
    Target,
    BookOpen,
    Trophy,
    Sparkles,
    Play,
    CheckCircle,
    Globe,
    Lightbulb,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import { API_BASE_URL } from '../api/index';
import { useAccess } from '../state/access/AccessContext.jsx';

const UpskillingWelcome = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [user, setUser] = useState(null);
    // Navigation is instant — RequirePlatformAccess on /upskilling enforces the gate.
    const accessLoading = false;
    const { hasPlatformAccess: hasAccess } = useAccess();

    useEffect(() => {
        const getUserData = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const response = await axios.get(`${API_BASE_URL}/api/user/me`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setUser(response.data);
            } catch (error) {
                console.error('❌ User not logged in:', error);
                navigate('/login');
            }
        };
        getUserData();
    }, [navigate]);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        if (token) {
            localStorage.setItem('authToken', token);
            params.delete('token');
            navigate({
                pathname: location.pathname,
                search: params.toString()
            }, { replace: true });
        }
    }, [location, navigate]);

    const startUpskilling = (initialSkill = null) => {
        if (initialSkill) {
            navigate('/upskilling', { state: { initialSkill } });
        } else {
            navigate('/upskilling');
        }
    };

    const skillCategories = [
        {
            icon: <Code className="w-5 h-5 text-blue-400" />,
            title: "Technology & Development",
            skills: ["Web Development", "AI/ML", "Mobile Apps", "Cloud Computing"],
            color: "blue",
            description: "Master cutting-edge tech skills that drive innovation"
        },
        {
            icon: <Palette className="w-5 h-5 text-purple-400" />,
            title: "Design & Creative",
            skills: ["UI/UX Design", "Graphic Design", "Video Editing", "3D Modeling"],
            color: "purple",
            description: "Unleash your creativity with professional design skills"
        },
        {
            icon: <TrendingUp className="w-5 h-5 text-green-400" />,
            title: "Business & Marketing",
            skills: ["Digital Marketing", "Project Management", "Data Analytics", "Sales"],
            color: "green",
            description: "Build business acumen that accelerates your career"
        },
        {
            icon: <Brain className="w-5 h-5 text-cyan-400" />,
            title: "Emerging Technologies",
            skills: ["Blockchain", "IoT", "AR/VR", "Quantum Computing"],
            color: "cyan",
            description: "Stay ahead with tomorrow's breakthrough technologies"
        }
    ];

    const learningFeatures = [
        {
            icon: <Target className="w-6 h-6 text-blue-400" />,
            title: "AI-Curated Learning Paths",
            description: "Get personalized curricula designed by AI, tailored to your goals and current skill level."
        },
        {
            icon: <Trophy className="w-6 h-6 text-yellow-400" />,
            title: "Gamified Progress System",
            description: "Earn XP, unlock achievements, and track your journey with our engaging reward system."
        },
        {
            icon: <Globe className="w-6 h-6 text-green-400" />,
            title: "Real-time Industry Resources",
            description: "Access the latest tutorials, articles, and tools curated from across the internet."
        },
        {
            icon: <CheckCircle className="w-6 h-6 text-purple-400" />,
            title: "Interactive Assessments",
            description: "Test your knowledge with adaptive quizzes that help reinforce your learning."
        }
    ];

    return (
        <div className="min-h-screen mt-20 bg-black text-white">
            {/* Subtle background texture */}
            <div className="fixed inset-0 opacity-[0.02]">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }} />
            </div>

            {/* Floating background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
            </div>

            {/* Header */}
            <header className="relative z-10 border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                                <Zap className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <h1 className="text-xl font-semibold text-white">SkillForge AI</h1>
                                <p className="text-xs text-white/50">Intelligent Upskilling Platform</p>
                            </div>
                        </div>

                        <div className="text-right">
                            <div className="text-sm text-white/60">
                                {currentTime.toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </div>
                            <div className="text-xs text-white/40">
                                {currentTime.toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10">
                {/* Hero Section */}
                <section className="max-w-7xl mx-auto px-6 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Left Side - Hero Content */}
                        <div className="lg:col-span-7">
                            {/* ✅ Success Badge - Show user has access */}
                            <div className="mb-6">
                                {hasAccess ? (
                                    <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/20 rounded-full px-4 py-2 backdrop-blur-sm">
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                        <span className="text-green-400 text-sm font-medium">✅ Premium Access Active</span>
                                    </div>
                                ) : (
                                    <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-full px-4 py-2 backdrop-blur-sm">
                                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                                        <span className="text-blue-400 text-sm font-medium">🔒 Upgrade to Premium</span>
                                    </div>
                                )}
                            </div>

                            {/* Main Hero Text */}
                            <div>
                                <h2 className="text-5xl md:text-6xl font-bold leading-[0.9] mb-6 tracking-tight">
                                    <span className="text-white">Master Any</span>
                                    <br />
                                    <span className="bg-gradient-to-r from-purple-400 via-blue-500 to-cyan-600 bg-clip-text text-transparent">
                                        Skill in Record
                                    </span>
                                    <br />
                                    <span className="text-white/80">Time</span>
                                </h2>

                                <p className="text-lg text-white/70 leading-relaxed max-w-xl mb-6">
                                    Transform your career with AI-curated learning paths, interactive quizzes,
                                    and real-time industry insights. From coding to creativity, we've got you covered.
                                </p>

                                {/* Stats Row */}
                                <div className="flex items-center space-x-6 mb-8">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-white mb-1">650+</div>
                                        <div className="text-xs text-white/50 uppercase tracking-wider">Skills Available</div>
                                    </div>
                                    <div className="w-px h-10 bg-white/10"></div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-purple-400 mb-1">24/7</div>
                                        <div className="text-xs text-white/50 uppercase tracking-wider">AI-Powered Learning</div>
                                    </div>
                                    <div className="w-px h-10 bg-white/10"></div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-white mb-1">Adaptive</div>
                                        <div className="text-xs text-white/50 uppercase tracking-wider">Learning Paths</div>
                                    </div>
                                </div>

                                {/* CTA Section */}
                                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                                    {/* ✅ MAIN CTA BUTTON - Direct call to startUpskilling */}
                                    <button
                                        onClick={() => startUpskilling()}
                                        className="group relative inline-flex cursor-pointer items-center bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-600/25"
                                    >
                                        <Zap className="w-5 h-5 mr-3" />
                                        <span>Start Learning Now</span>
                                        <ArrowRight className="w-4 h-4 ml-3 transition-transform group-hover:translate-x-1" />
                                    </button>

                                    <div className="flex items-center space-x-3 text-sm text-white/60">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                            <span>Premium Access</span>
                                        </div>
                                        <span>•</span>
                                        <span>Unlimited Learning</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Interactive Demo */}
                        <div className="lg:col-span-5 space-y-4">
                            {/* Learning Path Preview */}
                            <div className="relative bg-gradient-to-br from-slate-900/90 to-black/90 rounded-2xl p-6 backdrop-blur-sm overflow-hidden group">
                                {/* Animated Border Effect */}
                                <div className="absolute inset-0 rounded-2xl">
                                    <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-purple-500/0 via-purple-400/60 to-purple-500/0 animate-pulse"></div>
                                    <div className="absolute inset-0 rounded-2xl border border-purple-400/30"></div>
                                </div>

                                {/* Floating Particles */}
                                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                                    <div className="absolute top-4 left-4 w-1 h-1 bg-purple-400 rounded-full animate-ping"></div>
                                    <div className="absolute top-8 right-6 w-0.5 h-0.5 bg-blue-300 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                                    <div className="absolute bottom-6 left-8 w-0.5 h-0.5 bg-cyan-300 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
                                    <div className="absolute bottom-4 right-4 w-1 h-1 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                                </div>

                                {/* Content Container */}
                                <div className="relative z-10">
                                    {/* Demo Header */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-7 h-7 bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-400/40 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/20">
                                                <Brain className="w-4 h-4 text-purple-300" />
                                            </div>
                                            <div>
                                                <h4 className="text-white font-medium text-sm">Learning Path</h4>
                                                <p className="text-xs text-purple-200/60">AI-Generated Curriculum</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <div className="w-2 h-2 bg-green-400 rounded-full shadow-sm shadow-green-400/50"></div>
                                            <div className="w-2 h-2 bg-yellow-400 rounded-full shadow-sm shadow-yellow-400/50"></div>
                                            <div className="w-2 h-2 bg-red-400 rounded-full shadow-sm shadow-red-400/50"></div>
                                        </div>
                                    </div>

                                    {/* Learning Modules */}
                                    <div className="space-y-3">
                                        {/* Module 1 - Completed */}
                                        <div className="flex items-center space-x-3 p-3 bg-green-500/10 border border-green-400/30 rounded-lg">
                                            <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                                                <CheckCircle className="w-3 h-3 text-green-400" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-sm font-medium text-white">Introduction to React</div>
                                                <div className="text-xs text-green-400">+160 XP earned</div>
                                            </div>
                                        </div>

                                        {/* Module 2 - In Progress */}
                                        <div className="flex items-center space-x-3 p-3 bg-blue-500/10 border border-blue-400/30 rounded-lg">
                                            <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center">
                                                <Play className="w-3 h-3 text-blue-400" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-sm font-medium text-white">State Management</div>
                                                <div className="text-xs text-blue-400">Quiz in progress...</div>
                                            </div>
                                        </div>

                                        {/* Module 3 - Locked */}
                                        <div className="flex items-center space-x-3 p-3 bg-gray-700/20 border border-gray-600/30 rounded-lg opacity-60">
                                            <div className="w-6 h-6 bg-gray-600/20 rounded-full flex items-center justify-center">
                                                <span className="text-xs text-gray-400">3</span>
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-sm font-medium text-gray-300">Advanced Hooks</div>
                                                <div className="text-xs text-gray-500">Locked until quiz completion</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Demo Footer */}
                                    <div className="mt-4 pt-4 border-t border-purple-400/20">
                                        <div className="flex items-center justify-between">
                                            <div className="text-xs text-purple-200/60">Progress: 33% complete</div>
                                            <button
                                                onClick={() => startUpskilling("React Development")}
                                                className="inline-flex items-center bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 text-xs border border-purple-400/20"
                                            >
                                                Try React Course
                                                <ArrowRight className="w-3 h-3 ml-1" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* XP Tracker */}
                            <div className="relative bg-gradient-to-br from-slate-900/90 to-black/90 rounded-2xl p-5 backdrop-blur-sm overflow-hidden group">
                                {/* Animated Border Effect */}
                                <div className="absolute inset-0 rounded-2xl">
                                    <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-yellow-500/0 via-yellow-400/50 to-yellow-500/0 animate-pulse" style={{ animationDuration: '4s' }}></div>
                                    <div className="absolute inset-0 rounded-2xl border border-yellow-400/30"></div>
                                </div>

                                {/* Content Container */}
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-7 h-7 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-400/40 rounded-lg flex items-center justify-center shadow-lg shadow-yellow-500/20">
                                                <Trophy className="w-4 h-4 text-yellow-300" />
                                            </div>
                                            <div>
                                                <h4 className="text-white font-medium text-sm">Achievement System</h4>
                                                <p className="text-xs text-yellow-200/60">Gamified Learning</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-white">Total XP Earned</span>
                                            <span className="text-lg font-bold text-yellow-400">2,840 XP</span>
                                        </div>

                                        <div className="w-full bg-gray-700/50 rounded-full h-2">
                                            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full" style={{ width: '68%' }}></div>
                                        </div>

                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-gray-400">Level 7</span>
                                            <span className="text-gray-400">320 XP to Level 8</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Skill Categories Section */}
                <section className="border-t border-white/5">
                    <div className="max-w-7xl mx-auto px-6 py-20">
                        <div className="mb-12">
                            <h3 className="text-3xl font-light text-white mb-4">Popular Skill Categories</h3>
                            <p className="text-white/60">Explore trending skills across different domains</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {skillCategories.map((category, index) => (
                                <button
                                    key={index}
                                    onClick={() => startUpskilling()}
                                    className="group w-full cursor-pointer text-left border border-white/10 hover:border-white/20 bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-300 p-6 rounded-xl hover:scale-[1.02]"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center space-x-4">
                                            <div className={`p-3 rounded-lg group-hover:scale-110 transition-transform duration-300 ${category.color === 'blue' ? 'bg-blue-500/10 border border-blue-500/20' :
                                                category.color === 'purple' ? 'bg-purple-500/10 border border-purple-500/20' :
                                                    category.color === 'green' ? 'bg-green-500/10 border border-green-500/20' :
                                                        'bg-cyan-500/10 border border-cyan-500/20'
                                                }`}>
                                                {category.icon}
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-medium text-white group-hover:text-purple-400 transition-colors">
                                                    {category.title}
                                                </h4>
                                                <p className="text-white/60 text-sm mt-1">
                                                    {category.description}
                                                </p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-purple-400 transition-colors flex-shrink-0" />
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {category.skills.map((skill, skillIndex) => (
                                            <span
                                                key={skillIndex}
                                                className={`px-3 py-1 text-xs rounded-full ${category.color === 'blue' ? 'border border-blue-400/30 bg-blue-500/10 text-blue-300' :
                                                    category.color === 'purple' ? 'border border-purple-400/30 bg-purple-500/10 text-purple-300' :
                                                        category.color === 'green' ? 'border border-green-400/30 bg-green-500/10 text-green-300' :
                                                            'border border-cyan-400/30 bg-cyan-500/10 text-cyan-300'
                                                    }`}
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="border-t border-white/5">
                    <div className="max-w-7xl mx-auto px-6 py-20">
                        <div className="mb-12 text-center">
                            <h3 className="text-3xl font-light text-white mb-4">Why Choose SkillForge AI?</h3>
                            <p className="text-white/60">Experience the future of personalized learning</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {learningFeatures.map((feature, index) => (
                                <div
                                    key={index}
                                    className="p-6 border border-white/10 bg-white/[0.02] rounded-xl hover:border-white/20 transition-all duration-300 hover:scale-105"
                                >
                                    <div className="mb-4">
                                        {feature.icon}
                                    </div>
                                    <h4 className="text-lg font-medium text-white mb-2">{feature.title}</h4>
                                    <p className="text-white/60 text-sm leading-relaxed">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="border-t border-white/5">
                    <div className="max-w-7xl mx-auto px-6 py-20">
                        <div className="bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10 border border-purple-500/20 rounded-2xl p-12 text-center backdrop-blur-sm">
                            <div className="mb-6">
                                <Sparkles className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                                <h3 className="text-3xl font-bold text-white mb-4">
                                    Ready to Transform Your Skills?
                                </h3>
                                <p className="text-white/70 text-lg max-w-2xl mx-auto">
                                    Join thousands of learners who are already mastering new skills with our AI-powered platform.
                                    Start your learning journey today and unlock your potential.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                                <button
                                    onClick={() => startUpskilling()}
                                    className="group inline-flex items-center bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-600/25"
                                >
                                    <Zap className="w-5 h-5 mr-3" />
                                    <span>Start Learning Free</span>
                                    <ArrowRight className="w-4 h-4 ml-3 transition-transform group-hover:translate-x-1" />
                                </button>

                                <div className="flex items-center space-x-4 text-sm text-white/60">
                                    <div className="flex items-center space-x-1">
                                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                        <span>4.9/5 Rating</span>
                                    </div>
                                    <span>•</span>
                                    <div className="flex items-center space-x-1">
                                        <Users className="w-4 h-4" />
                                        <span>50K+ Active Learners</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="flex items-center justify-between text-sm text-white/40">
                        <div>© 2025 SkillForge AI • Empowering Lifelong Learning</div>
                        <div className="flex items-center space-x-6">
                            <a href="#" className="hover:text-white/60 transition-colors">Privacy</a>
                            <a href="#" className="hover:text-white/60 transition-colors">Terms</a>
                            <a href="#" className="hover:text-white/60 transition-colors">Support</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default UpskillingWelcome;