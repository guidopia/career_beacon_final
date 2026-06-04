import React, { useMemo, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import { API_BASE_URL } from '../api/index';
import {
    GraduationCap,
    Lightbulb,
    ScrollText,
    School,
    BookOpen,
    Globe,
    Building,
    Briefcase,
    Award,
    Code,
    PenTool,
    MessageCircle,
    ArrowRight,
    Brain,
    Star,
    ChevronRight,
} from "lucide-react";

const SanskritiWelcome = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    // Navigation to /assistant-chat is instant — premium access is enforced
    // there via the RequirePlatformAccess modal.
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
        // Update once per minute (UI shows only hours/minutes).
        const timer = setInterval(() => setCurrentTime(new Date()), 60 * 1000);
        return () => clearInterval(timer);
    }, []);

    const formattedDate = useMemo(() => {
        return currentTime.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }, [currentTime]);

    const formattedTime = useMemo(() => {
        return currentTime.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }, [currentTime]);

    const startChat = (initialMessage = null) => {
        if (initialMessage) {
            navigate('/assistant-chat', { state: { initialMessage } });
        } else {
            navigate('/assistant-chat');
        }
    };

    const suggestions = [
        {
            icon: <School className="w-5 h-5 text-blue-400" />,
            title: "Stream Selection After 10th",
            question: "I've just completed 10th grade and I'm confused about which stream to choose (Science, Commerce, or Arts). I'm interested in computer science but also enjoy economics. Can you guide me?",
            category: "Academic Planning"
        },
        {
            icon: <BookOpen className="w-5 h-5 text-blue-400" />,
            title: "Engineering vs Medical",
            question: "I'm in 12th PCB. My parents want me to prepare for NEET, but I'm more interested in biotechnology. What career options do I have that combine both biology and technology?",
            category: "Career Choice"
        },
        {
            icon: <Building className="w-5 h-5 text-blue-400" />,
            title: "College Selection",
            question: "I got 94% in 12th Commerce and want to pursue BBA. Which colleges in India should I target and what entrance exams should I prepare for?",
            category: "Higher Education"
        },
        {
            icon: <Briefcase className="w-5 h-5 text-blue-400" />,
            title: "Career After Graduation",
            question: "I'm completing my B.Tech in Computer Science next year. Should I look for a job, prepare for GATE/CAT, or consider studying abroad? What are the pros and cons?",
            category: "Professional Path"
        },
        {
            icon: <Globe className="w-5 h-5 text-blue-400" />,
            title: "Study Abroad",
            question: "I want to pursue Masters in Data Science abroad after my B.Tech. Which countries offer the best opportunities, and what preparations should I start now?",
            category: "International Education"
        },
        {
            icon: <Globe className="w-5 h-5 text-blue-400" />,
            title: "Scholarships & Funding",
            question: "I want to study abroad but cost is a concern. What scholarship options should I look at (USA/UK/Canada/Europe) and what profile do I need to improve my chances?",
            category: "International Education"
        },
        {
            icon: <Globe className="w-5 h-5 text-blue-400" />,
            title: "SOP, LOR & Applications",
            question: "Can you help me plan my study abroad applications—shortlist universities, build my resume, write an SOP/LOR outline, and decide which exams (IELTS/TOEFL/GRE) I should take?",
            category: "International Education"
        },
        {
            icon: <Award className="w-5 h-5 text-blue-400" />,
            title: "Certifications & Skills",
            question: "I'm a second year B.Com student. What certifications or skills should I develop alongside my degree to improve my job prospects?",
            category: "Skill Development"
        },
        {
            icon: <Code className="w-5 h-5 text-blue-400" />,
            title: "Tech Career Paths",
            question: "I'm interested in a tech career but I'm not sure if I want to be a programmer. What other tech roles exist and what skills do they require?",
            category: "Technology"
        },
        {
            icon: <PenTool className="w-5 h-5 text-blue-400" />,
            title: "Creative Careers",
            question: "I'm passionate about design and animation. What career paths are available in India, and which institutions offer the best education for this field?",
            category: "Creative Arts"
        },
    ];

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Subtle background texture */}
            <div className="fixed inset-0 opacity-[0.02]">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }} />
            </div>

            {/* Header */}
            <header className="relative mt-20 z-10 border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                <GraduationCap className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <h1 className="text-xl font-semibold text-white">Career Beacon Assistant</h1>
                                <p className="text-xs text-white/50">Career Counselor</p>
                            </div>
                        </div>

                        <div className="text-right">
                            <div className="text-sm text-white/60">
                                {formattedDate}
                            </div>
                            <div className="text-xs text-white/40">
                                {formattedTime}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10">
                {/* Hero Section */}
                <section className="max-w-7xl mx-auto px-6 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Left Side - Hero Content (7 columns) */}
                        <div className="lg:col-span-7">
                            {/* Floating Badge */}
                            <div className="mb-6">
                                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-full px-4 py-2 backdrop-blur-sm">
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                                    <span className="text-blue-400 text-sm font-medium">AI-Powered Career Guidance</span>
                                </div>
                            </div>

                            {/* Main Hero Text */}
                            <div>
                                <h2 className="text-5xl md:text-6xl font-bold leading-[0.9] mb-6 tracking-tight">
                                    <span className="text-white">Unlock Your</span>
                                    <br />
                                    <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
                                        Dream Career
                                    </span>
                                    <br />
                                    <span className="text-white/80">With Expert AI Guidance</span>
                                </h2>

                                <p className="text-lg text-white/70 leading-relaxed max-w-xl mb-6">
                                    Your AI career counselor with 15+ years of guidance experience—built for practical, step-by-step clarity.
                                    It can also help with study-abroad planning when that’s a fit for your goals.
                                </p>

                                {/* Stats Row */}
                                <div className="flex items-center space-x-6 mb-8">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-white mb-1">10K+</div>
                                        <div className="text-xs text-white/50 uppercase tracking-wider">Students Guided</div>
                                    </div>
                                    <div className="w-px h-10 bg-white/10"></div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-blue-400 mb-1">15+</div>
                                        <div className="text-xs text-white/50 uppercase tracking-wider">Years Experience</div>
                                    </div>
                                    <div className="w-px h-10 bg-white/10"></div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-white mb-1">98%</div>
                                        <div className="text-xs text-white/50 uppercase tracking-wider">Success Rate</div>
                                    </div>
                                </div>

                                {/* CTA Section */}
                                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                                    <button
                                        onClick={() => startChat()}
                                        disabled={accessLoading}
                                        className={`group relative cursor-pointer inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-600/25 ${accessLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <MessageCircle className="w-5 h-5 mr-3" />
                                        <span>{accessLoading ? 'Checking Access...' : 'Get Career Guidance'}</span>
                                        {!accessLoading && <ArrowRight className="w-4 h-4 ml-3 transition-transform group-hover:translate-x-1" />}
                                    </button>

                                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-white/60">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                            <span>Available 24/7</span>
                                        </div>
                                        <span>•</span>
                                        <span>Free Consultation</span>
                                    <span>•</span>
                                    <span>Study Abroad support</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Live Demo Preview (5 columns) */}
                        <div className="lg:col-span-5 space-y-4 -mt-6">
                            {/* Live Demo */}
                            <div className="relative bg-gradient-to-br from-slate-900/90 to-black/90 rounded-2xl p-5 backdrop-blur-sm overflow-hidden group">
                                {/* Animated Border Effect */}
                                <div className="absolute inset-0 rounded-2xl">
                                    <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-blue-500/0 via-blue-400/60 to-blue-500/0 animate-pulse"></div>
                                    <div className="absolute inset-0 rounded-2xl border border-blue-400/30"></div>
                                </div>

                                {/* Floating Particles */}
                                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                                    <div className="absolute top-4 left-4 w-1 h-1 bg-blue-400 rounded-full animate-ping"></div>
                                    <div className="absolute top-8 right-6 w-0.5 h-0.5 bg-cyan-300 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                                    <div className="absolute bottom-6 left-8 w-0.5 h-0.5 bg-blue-300 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
                                    <div className="absolute bottom-4 right-4 w-1 h-1 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                                </div>

                                {/* Subtle Scan Line Effect */}
                                <div className="absolute inset-0 rounded-2xl">
                                    <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent animate-pulse" style={{ top: '30%', animationDuration: '3s' }}></div>
                                    <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-cyan-300/30 to-transparent animate-pulse" style={{ top: '70%', animationDuration: '4s', animationDelay: '1s' }}></div>
                                </div>

                                {/* Content Container */}
                                <div className="relative z-10">
                                    {/* Demo Header */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-7 h-7 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-400/40 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                                                <MessageCircle className="w-4 h-4 text-blue-300" />
                                            </div>
                                            <div>
                                                <h4 className="text-white font-medium text-sm">Live Demo</h4>
                                                <p className="text-xs text-blue-200/60">See how it works</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <div className="w-2 h-2 bg-green-400 rounded-full shadow-sm shadow-green-400/50"></div>
                                            <div className="w-2 h-2 bg-yellow-400 rounded-full shadow-sm shadow-yellow-400/50"></div>
                                            <div className="w-2 h-2 bg-red-400 rounded-full shadow-sm shadow-red-400/50"></div>
                                        </div>
                                    </div>

                                    {/* Chat Interface */}
                                    <div className="space-y-3 h-60 overflow-hidden">
                                        {/* User Message */}
                                        <div className="flex justify-end">
                                            <div className="bg-gradient-to-r from-blue-600/90 to-blue-700/90 text-white px-3 py-2 rounded-xl rounded-br-md max-w-xs border border-blue-400/30 shadow-lg shadow-blue-500/20">
                                                <p className="text-sm">I'm confused about choosing between engineering and medical. Can you help?</p>
                                            </div>
                                        </div>

                                        {/* AI Response */}
                                        <div className="flex items-start space-x-2">
                                            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-lg shadow-blue-400/40">
                                                <Brain className="w-3 h-3 text-white" />
                                            </div>
                                            <div className="bg-gradient-to-r from-slate-800/70 to-slate-900/70 border border-blue-400/20 px-3 py-2 rounded-xl rounded-tl-md max-w-sm shadow-lg shadow-blue-400/10">
                                                <p className="text-sm text-white/90 mb-2">
                                                    Great question! Let me help you explore both paths. First, tell me:
                                                </p>
                                                <ul className="text-xs text-blue-100/80 space-y-1">
                                                    <li>• What subjects do you enjoy most?</li>
                                                    <li>• Do you prefer hands-on problem solving?</li>
                                                    <li>• How do you feel about patient interaction?</li>
                                                </ul>
                                            </div>
                                        </div>

                                        {/* Typing Indicator */}
                                        <div className="flex items-center space-x-2">
                                            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-400/40">
                                                <Brain className="w-3 h-3 text-white" />
                                            </div>
                                            <div className="bg-gradient-to-r from-slate-800/70 to-slate-900/70 border border-blue-400/20 px-3 py-2 rounded-xl rounded-tl-md shadow-lg shadow-blue-400/10">
                                                <div className="flex space-x-1">
                                                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                                                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                                    <div className="w-1.5 h-1.5 bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Demo Footer */}
                                    <div className="mt-4 pt-4 border-t border-blue-400/20">
                                        <div className="flex items-center justify-center">
                                            <button
                                                onClick={() => startChat()}
                                                disabled={accessLoading}
                                                className={`inline-flex items-center cursor-pointer bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-5 py-2.5 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-600/30 text-sm border border-blue-400/20 ${accessLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                <MessageCircle className="w-4 h-4 mr-2" />
                                                {accessLoading ? 'Checking Access...' : 'Try it yourself'}
                                                {!accessLoading && <ArrowRight className="w-4 h-4 ml-2" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Start Section */}
                            <div className="relative bg-gradient-to-br from-slate-900/90 to-black/90 rounded-2xl p-5 backdrop-blur-sm overflow-hidden group">
                                {/* Animated Border Effect */}
                                <div className="absolute inset-0 rounded-2xl">
                                    <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-emerald-500/0 via-emerald-400/50 to-emerald-500/0 animate-pulse" style={{ animationDuration: '4s' }}></div>
                                    <div className="absolute inset-0 rounded-2xl border border-emerald-400/30"></div>
                                </div>

                                {/* Floating Particles */}
                                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                                    <div className="absolute top-3 left-6 w-0.5 h-0.5 bg-emerald-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                                    <div className="absolute top-6 right-4 w-1 h-1 bg-teal-300 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
                                    <div className="absolute bottom-4 left-4 w-0.5 h-0.5 bg-emerald-300 rounded-full animate-ping" style={{ animationDelay: '1.5s' }}></div>
                                    <div className="absolute bottom-6 right-8 w-1 h-1 bg-teal-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                                </div>

                                {/* Subtle Scan Line Effect */}
                                <div className="absolute inset-0 rounded-2xl">
                                    <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent animate-pulse" style={{ top: '25%', animationDuration: '5s' }}></div>
                                    <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-teal-300/25 to-transparent animate-pulse" style={{ top: '75%', animationDuration: '6s', animationDelay: '2s' }}></div>
                                </div>

                                {/* Content Container */}
                                <div className="relative z-10">
                                    <div className="text-center mb-4">
                                        <h4 className="text-white font-medium text-sm mb-1">Quick Start - Browse few common career queries</h4>

                                    </div>

                                    <div className="space-y-2">
                                        {suggestions.slice(0, 2).map((suggestion, index) => (
                                            <button
                                                key={index}
                                                onClick={() => {
                                                    document.querySelector('#popular-questions').scrollIntoView({
                                                        behavior: 'smooth'
                                                    });
                                                }}
                                                disabled={accessLoading}
                                                className={`group w-full text-left p-3 border border-emerald-400/20 hover:border-emerald-400/40 bg-gradient-to-r from-slate-800/30 to-slate-900/30 hover:from-slate-700/40 hover:to-slate-800/40 rounded-lg transition-all duration-200 shadow-lg hover:shadow-emerald-400/10 ${accessLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <div className="p-1.5 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-400/30 rounded shadow-sm shadow-emerald-400/20">
                                                        {React.cloneElement(suggestion.icon, { className: "w-3 h-3 text-emerald-300" })}
                                                    </div>
                                                    <span className="text-xs font-medium text-white group-hover:text-emerald-200 transition-colors flex-1">
                                                        {suggestion.title}
                                                    </span>
                                                    <ChevronRight className="w-3 h-3 text-emerald-300/50 group-hover:text-emerald-300 transition-colors" />
                                                </div>
                                            </button>
                                        ))}
                                    </div>

                                    <div className="mt-4 pt-3 border-t border-emerald-400/20 text-center">
                                        <button
                                            onClick={() => {
                                                document.querySelector('#popular-questions').scrollIntoView({
                                                    behavior: 'smooth'
                                                });
                                            }}
                                            disabled={accessLoading}
                                            className={`text-xs text-emerald-300 hover:text-emerald-200 font-medium transition-colors ${accessLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            View all questions below ↓
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Popular Questions Section */}
                <section id="popular-questions" className="border-t border-white/5">
                    <div className="max-w-7xl mx-auto px-6 py-20">
                        <div className="mb-12">
                            <h3 className="text-3xl font-light text-white mb-4">Popular Questions</h3>
                            <p className="text-white/60">Select any question below to start your personalized consultation</p>
                        </div>

                        {/* Study Abroad / International Education - highlighted but not dominant */}
                        <div className="mb-10">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-sm font-semibold text-white/80 tracking-wide uppercase">
                                    Study Abroad & Global Admissions
                                </h4>
                                <span className="text-xs text-white/40">Plus</span>
                            </div>
                            <div className="space-y-2">
                                {suggestions
                                    .filter((s) => s.category === "International Education")
                                    .slice(0, 3)
                                    .map((suggestion, index) => (
                                        <button
                                            key={`intl-${index}`}
                                            onClick={() => startChat(suggestion.question)}
                                            disabled={accessLoading}
                                            className={`group w-full text-left border border-blue-400/15 hover:border-blue-400/30 bg-gradient-to-r from-blue-500/[0.04] to-cyan-500/[0.03] hover:from-blue-500/[0.06] hover:to-cyan-500/[0.05] transition-all duration-200 p-6 ${accessLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start space-x-4 flex-1">
                                                    <div className="p-2 bg-blue-500/10 border border-blue-500/20 mt-1">
                                                        {suggestion.icon}
                                                    </div>

                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-3 mb-2">
                                                            <h4 className="text-lg font-medium text-white group-hover:text-blue-300 transition-colors">
                                                                {suggestion.title}
                                                            </h4>
                                                            <span className="px-2 py-1 text-xs text-blue-200/70 border border-blue-400/20 bg-blue-500/[0.04]">
                                                                {suggestion.category}
                                                            </span>
                                                        </div>
                                                        <p className="text-white/60 text-sm leading-relaxed">
                                                            {suggestion.question}
                                                        </p>
                                                    </div>
                                                </div>

                                                <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-blue-300 transition-colors flex-shrink-0 ml-4" />
                                            </div>
                                        </button>
                                    ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            {suggestions
                                .filter((s) => s.category !== "International Education")
                                .map((suggestion, index) => (
                                <button
                                    key={index}
                                    onClick={() => startChat(suggestion.question)}
                                    disabled={accessLoading}
                                    className={`group w-full text-left border border-white/5 hover:border-white/10 bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-200 p-6 ${accessLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start space-x-4 flex-1">
                                            <div className="p-2 bg-blue-500/10 border border-blue-500/20 mt-1">
                                                {suggestion.icon}
                                            </div>

                                            <div className="flex-1">
                                                <div className="flex items-center space-x-3 mb-2">
                                                    <h4 className="text-lg font-medium text-white group-hover:text-blue-400 transition-colors">
                                                        {suggestion.title}
                                                    </h4>
                                                    <span className="px-2 py-1 text-xs text-white/50 border border-white/10 bg-white/[0.02]">
                                                        {suggestion.category}
                                                    </span>
                                                </div>
                                                <p className="text-white/60 text-sm leading-relaxed">
                                                    {suggestion.question}
                                                </p>
                                            </div>
                                        </div>

                                        <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-blue-400 transition-colors flex-shrink-0 ml-4" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="flex items-center justify-between text-sm text-white/40">
                        <div>© 2025 Career Beacon Assistant • Your Trusted Career Guide</div>
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

export default SanskritiWelcome;