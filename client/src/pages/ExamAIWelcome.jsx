import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import { API_BASE_URL } from '../api/index';
import {
    Brain,
    Target,
    BarChart3,
    Clock,
    BookOpen,
    Zap,
    ArrowRight,
    ChevronRight,
    TrendingUp,
    Award,
    CheckCircle,
    Users,
    Star,
    Activity,
    Shield,
} from "lucide-react";

const ExamAIWelcome = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    // Navigation is instant — RequirePlatformAccess on /setup enforces the gate.
    const accessLoading = false;

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        if (token) {
            localStorage.setItem('authToken', token);
            // Remove token from URL for cleanliness
            params.delete('token');
            navigate({
                pathname: location.pathname,
                search: params.toString()
            }, { replace: true });
        }
    }, [location, navigate]);

    useEffect(() => {
        const getUserData = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    console.log('❌ No auth token found');
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

    const startExamPrep = (_examType = null) => {
        navigate('/setup');
    };

    const examCategories = [
        {
            icon: <Target className="w-5 h-5 text-slate-400" />,
            title: "Engineering Entrance",
            exams: ["JEE Main", "JEE Advanced", "GATE", "State CETs"],
            subjects: "Physics, Chemistry, Mathematics",
            color: "slate",
            description: "Advanced technical preparation with adaptive problem solving"
        },
        {
            icon: <BookOpen className="w-5 h-5 text-slate-500" />,
            title: "Medical Entrance",
            exams: ["NEET UG", "NEET PG", "AIIMS", "JIPMER"],
            subjects: "Physics, Chemistry, Biology",
            color: "slate",
            description: "Comprehensive medical science preparation with clinical focus"
        },
        {
            icon: <TrendingUp className="w-5 h-5 text-slate-400" />,
            title: "Management & Law",
            exams: ["CAT", "XAT", "CLAT", "CUET"],
            subjects: "Quantitative, Verbal, Logical Reasoning",
            color: "slate",
            description: "Strategic preparation for competitive management programs"
        },
        {
            icon: <Award className="w-5 h-5 text-slate-500" />,
            title: "Olympiads & Competitions",
            exams: ["IMO", "NSO", "KVPY", "NTSE"],
            subjects: "Advanced Mathematics, Science",
            color: "slate",
            description: "Elite preparation for academic competitions"
        }
    ];

    const aiFeatures = [
        {
            icon: <Brain className="w-6 h-6 text-slate-400" />,
            title: "Adaptive AI Engine",
            description: "Questions evolve based on your performance patterns and knowledge gaps."
        },
        {
            icon: <Target className="w-6 h-6 text-slate-400" />,
            title: "Precision Analytics",
            description: "Real-time insights into strengths, weaknesses, and exam readiness."
        },
        {
            icon: <BarChart3 className="w-6 h-6 text-slate-400" />,
            title: "Multi-Subject Sync",
            description: "Seamless switching between subjects with zero progress loss."
        },
        {
            icon: <Shield className="w-6 h-6 text-slate-400" />,
            title: "Data Persistence",
            description: "Advanced storage ensures your preparation data is always secure."
        }
    ];

    const mockData = {
        currentChapter: "Thermodynamics",
        questionsCompleted: 847,
        aiConfidence: 78,
        subjects: [
            { name: "Physics", progress: 68, status: "active" },
            { name: "Chemistry", progress: 45, status: "pending" },
            { name: "Mathematics", progress: 82, status: "completed" }
        ]
    };

    return (
        <div className="min-h-screen mt-20 bg-black text-white">
            {/* Subtle background texture */}
            <div className="fixed inset-0 opacity-[0.01]">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='0.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }} />
            </div>

            {/* Minimal floating background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-96 h-96 bg-slate-800/3 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-80 h-80 bg-slate-700/3 rounded-full blur-3xl"></div>
            </div>

            {/* Header */}
            <header className="relative z-10 border-b border-slate-800/50">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="p-2 rounded-lg bg-slate-800/40 border border-slate-700/50">
                                <Brain className="w-6 h-6 text-slate-400" />
                            </div>
                            <div>
                                <h1 className="text-xl font-semibold text-slate-200">EXAM AI</h1>
                                <p className="text-xs text-slate-500">Intelligent Preparation System</p>
                            </div>
                        </div>

                        <div className="text-right">
                            <div className="text-sm text-slate-400">
                                {currentTime.toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </div>
                            <div className="text-xs text-slate-500">
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
                <section className="max-w-7xl mx-auto px-6 py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                        {/* Left Side - Hero Content */}
                        <div className="lg:col-span-7">
                            {/* Floating Badge */}
                            <div className="mb-8">
                                <div className="inline-flex items-center space-x-2 bg-slate-800/30 border border-slate-700/50 rounded-full px-4 py-2 backdrop-blur-sm">
                                    <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                                    <span className="text-slate-400 text-sm font-medium">Advanced AI Learning Engine</span>
                                </div>
                            </div>

                            {/* Main Hero Text */}
                            <div>
                                <h2 className="text-5xl md:text-6xl font-bold leading-[0.9] mb-8 tracking-tight">
                                    <span className="text-slate-200">Intelligent</span>
                                    <br />
                                    <span className="bg-gradient-to-r from-slate-400 via-slate-300 to-slate-400 bg-clip-text text-transparent">
                                        Exam Preparation
                                    </span>
                                    <br />
                                    <span className="text-slate-400">System</span>
                                </h2>

                                <p className="text-lg text-slate-400 leading-relaxed max-w-xl mb-8">
                                    AI-driven adaptive learning that evolves with your performance.
                                    Multi-subject preparation with real-time analytics and personalized study paths.
                                </p>

                                {/* Stats Row */}
                                <div className="flex items-center space-x-8 mb-10">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-slate-300 mb-1">15+</div>
                                        <div className="text-xs text-slate-500 uppercase tracking-wider">Competitive Exams</div>
                                    </div>
                                    <div className="w-px h-10 bg-slate-700/50"></div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-slate-400 mb-1">AI</div>
                                        <div className="text-xs text-slate-500 uppercase tracking-wider">Adaptive Engine</div>
                                    </div>
                                    <div className="w-px h-10 bg-slate-700/50"></div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-slate-300 mb-1">Zero</div>
                                        <div className="text-xs text-slate-500 uppercase tracking-wider">Data Loss</div>
                                    </div>
                                </div>

                                {/* CTA Section */}
                                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                                    <button
                                        onClick={() => startExamPrep()}
                                        disabled={accessLoading}
                                        className={`group inline-flex items-center bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-slate-500 text-slate-200 px-8 py-4 rounded-lg font-medium transition-all duration-300 ${accessLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <Brain className="w-5 h-5 mr-3" />
                                        <span>{accessLoading ? 'Checking Access...' : 'Initialize Preparation'}</span>
                                        {!accessLoading && <ArrowRight className="w-4 h-4 ml-3 transition-transform group-hover:translate-x-1" />}
                                    </button>

                                    <div className="flex items-center space-x-3 text-sm text-slate-500">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
                                            <span>Multi-device sync</span>
                                        </div>
                                        <span>•</span>
                                        <span>Offline capable</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Dashboard Preview */}
                        <div className="lg:col-span-5 space-y-4">
                            {/* Analytics Dashboard */}
                            <div className="relative bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6 backdrop-blur-sm overflow-hidden">
                                {/* Subtle Border Effect */}
                                <div className="absolute inset-0 rounded-2xl border border-slate-700/30"></div>

                                {/* Content Container */}
                                <div className="relative z-10">
                                    {/* Demo Header */}
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-7 h-7 bg-slate-800/60 border border-slate-700/60 rounded-lg flex items-center justify-center">
                                                <BarChart3 className="w-4 h-4 text-slate-400" />
                                            </div>
                                            <div>
                                                <h4 className="text-slate-200 font-medium text-sm">Performance Analytics</h4>
                                                <p className="text-xs text-slate-500">Real-time insights</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
                                            <div className="w-2 h-2 bg-slate-700 rounded-full"></div>
                                            <div className="w-2 h-2 bg-slate-800 rounded-full"></div>
                                        </div>
                                    </div>

                                    {/* Analytics Content */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-3 bg-slate-800/40 border border-slate-700/50 rounded-lg">
                                            <div>
                                                <div className="text-sm font-medium text-slate-300">Current Chapter</div>
                                                <div className="text-xs text-slate-500">{mockData.currentChapter}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-medium text-slate-400">{mockData.aiConfidence}%</div>
                                                <div className="text-xs text-slate-500">AI Confidence</div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            {mockData.subjects.map((subject, index) => (
                                                <div key={index} className="flex items-center justify-between p-3 bg-slate-800/30 border border-slate-700/40 rounded-lg">
                                                    <div className="flex items-center space-x-3">
                                                        <div className={`w-2 h-2 rounded-full ${subject.status === 'completed' ? 'bg-slate-400' :
                                                            subject.status === 'active' ? 'bg-slate-500' : 'bg-slate-700'
                                                            }`}></div>
                                                        <span className="text-sm text-slate-300">{subject.name}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-16 bg-slate-700/50 rounded-full h-1.5">
                                                            <div
                                                                className="bg-slate-400 h-1.5 rounded-full transition-all duration-300"
                                                                style={{ width: `${subject.progress}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className="text-xs text-slate-500 w-8">{subject.progress}%</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Demo Footer */}
                                    <div className="mt-6 pt-4 border-t border-slate-700/50">
                                        <div className="flex items-center justify-center">
                                            <button
                                                onClick={() => startExamPrep("JEE Main")}
                                                disabled={accessLoading}
                                                className={`inline-flex items-center bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 px-4 py-2 rounded-lg font-medium transition-all duration-300 text-xs ${accessLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                <Activity className="w-3 h-3 mr-2" />
                                                {accessLoading ? 'Checking...' : 'View Full Analytics'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* AI Engine Preview */}
                            <div className="relative bg-slate-900/40 border border-slate-800/60 rounded-2xl p-5 backdrop-blur-sm overflow-hidden">
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-7 h-7 bg-slate-800/60 border border-slate-700/60 rounded-lg flex items-center justify-center">
                                                <Zap className="w-4 h-4 text-slate-400" />
                                            </div>
                                            <div>
                                                <h4 className="text-slate-200 font-medium text-sm">AI Engine Status</h4>
                                                <p className="text-xs text-slate-500">Adaptive learning active</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-slate-400">Questions Generated</span>
                                            <span className="text-slate-300 font-medium">{mockData.questionsCompleted.toLocaleString()}</span>
                                        </div>

                                        <div className="w-full bg-slate-800/50 rounded-full h-2">
                                            <div className="bg-slate-500 h-2 rounded-full transition-all duration-500" style={{ width: '73%' }}></div>
                                        </div>

                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-slate-500">Difficulty adaptation</span>
                                            <span className="text-slate-500">Active learning mode</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Exam Categories Section */}
                <section className="border-t border-slate-800/50">
                    <div className="max-w-7xl mx-auto px-6 py-20">
                        <div className="mb-12">
                            <h3 className="text-3xl font-light text-slate-200 mb-4">Supported Examinations</h3>
                            <p className="text-slate-400">Comprehensive preparation across major competitive exams</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {examCategories.map((category, index) => (
                                <button
                                    key={index}
                                    onClick={() => startExamPrep(category.title)}
                                    disabled={accessLoading}
                                    className={`group w-full text-left border border-slate-800/60 hover:border-slate-700/80 bg-slate-900/20 hover:bg-slate-900/40 transition-all duration-300 p-6 rounded-xl ${accessLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center space-x-4">
                                            <div className="p-3 bg-slate-800/40 border border-slate-700/50 rounded-lg group-hover:bg-slate-800/60 transition-all duration-300">
                                                {category.icon}
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-medium text-slate-200 group-hover:text-slate-100 transition-colors">
                                                    {category.title}
                                                </h4>
                                                <p className="text-slate-500 text-sm mt-1">
                                                    {category.description}
                                                </p>
                                                <p className="text-slate-600 text-xs mt-1">
                                                    {category.subjects}
                                                </p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-slate-400 transition-colors flex-shrink-0" />
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {category.exams.map((exam, examIndex) => (
                                            <span
                                                key={examIndex}
                                                className="px-3 py-1 text-xs border border-slate-700/50 bg-slate-800/30 text-slate-400 rounded-full"
                                            >
                                                {exam}
                                            </span>
                                        ))}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="border-t border-slate-800/50">
                    <div className="max-w-7xl mx-auto px-6 py-20">
                        <div className="mb-12 text-center">
                            <h3 className="text-3xl font-light text-slate-200 mb-4">System Architecture</h3>
                            <p className="text-slate-400">Advanced AI-powered learning infrastructure</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {aiFeatures.map((feature, index) => (
                                <div
                                    key={index}
                                    className="p-6 border border-slate-800/60 bg-slate-900/20 rounded-xl hover:border-slate-700/80 hover:bg-slate-900/40 transition-all duration-300"
                                >
                                    <div className="mb-4">
                                        {feature.icon}
                                    </div>
                                    <h4 className="text-lg font-medium text-slate-200 mb-2">{feature.title}</h4>
                                    <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="border-t border-slate-800/50">
                    <div className="max-w-7xl mx-auto px-6 py-20">
                        <div className="bg-slate-900/30 border border-slate-800/60 rounded-2xl p-12 text-center backdrop-blur-sm">
                            <div className="mb-6">
                                <Brain className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                                <h3 className="text-3xl font-bold text-slate-200 mb-4">
                                    Initialize Your Preparation System
                                </h3>
                                <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                                    Advanced AI-driven exam preparation with adaptive learning algorithms,
                                    multi-subject synchronization, and comprehensive performance analytics.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                                <button
                                    onClick={() => startExamPrep()}
                                    disabled={accessLoading}
                                    className={`group inline-flex items-center bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-slate-500 text-slate-200 px-8 py-4 rounded-lg font-medium transition-all duration-300 ${accessLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <Brain className="w-5 h-5 mr-3" />
                                    <span>{accessLoading ? 'Checking Access...' : 'Begin Preparation'}</span>
                                    {!accessLoading && <ArrowRight className="w-4 h-4 ml-3 transition-transform group-hover:translate-x-1" />}
                                </button>

                                <div className="flex items-center space-x-4 text-sm text-slate-500">
                                    <div className="flex items-center space-x-1">
                                        <CheckCircle className="w-4 h-4" />
                                        <span>Zero data loss</span>
                                    </div>
                                    <span>•</span>
                                    <div className="flex items-center space-x-1">
                                        <Shield className="w-4 h-4" />
                                        <span>Secure storage</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-800/50">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="flex items-center justify-between text-sm text-slate-500">
                        <div>© 2025 EXAM AI • Intelligent Learning Systems</div>
                        <div className="flex items-center space-x-6">
                            <a href="#" className="hover:text-slate-400 transition-colors">Documentation</a>
                            <a href="#" className="hover:text-slate-400 transition-colors">System Status</a>
                            <a href="#" className="hover:text-slate-400 transition-colors">Support</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default ExamAIWelcome;