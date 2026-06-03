import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import { API_BASE_URL } from '../api/index';
import {
    GraduationCap,
    Search,
    MapPin,
    Star,
    TrendingUp,
    Award,
    Users,
    ArrowRight,
    ChevronRight,
    Target,
    BookOpen,
    DollarSign,
    Building,
    Calendar,
    CheckCircle,
    Globe,
    Lightbulb,
    BarChart3,
    Shield,
    Zap,
    Sparkles,
    Brain,
    Trophy,
    Clock,
} from "lucide-react";

// Faded, dark, shiny color palette
const palette = {
    blue: "text-blue-300",
    green: "text-green-300",
    purple: "text-purple-300",
    cyan: "text-cyan-300",
    yellow: "text-yellow-300",
    borderBlue: "border-blue-800/40",
    borderGreen: "border-green-800/40",
    borderPurple: "border-purple-800/40",
    borderCyan: "border-cyan-800/40",
    bgBlue: "bg-blue-900/40",
    bgGreen: "bg-green-900/40",
    bgPurple: "bg-purple-900/40",
    bgCyan: "bg-cyan-900/40",
    fadedText: "text-gray-400",
    fadedTextStrong: "text-gray-200",
    fadedBg: "bg-gray-900/80",
    fadedBorder: "border-gray-800/60",
    fadedHighlight: "bg-gradient-to-r from-gray-800/80 to-gray-900/80",
};

const CollegeSearchWelcome = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    // Navigation is instant — RequirePlatformAccess on /college-search enforces the gate.
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
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const startCollegeSearch = (searchType = null) => {
        if (searchType) {
            navigate('/college-search', { state: { searchType } });
        } else {
            navigate('/college-search');
        }
    };

    const collegeCategories = [
        {
            icon: <Building className={`w-5 h-5 ${palette.blue}`} />,
            title: "Engineering & Technology",
            colleges: ["IIT Delhi", "NIT Trichy", "BITS Pilani", "VIT Vellore"],
            color: "blue",
            description: "Engineering programs at top Indian institutes."
        },
        {
            icon: <BarChart3 className={`w-5 h-5 ${palette.green}`} />,
            title: "Business & Management",
            colleges: ["IIM Ahmedabad", "XLRI Jamshedpur", "FMS Delhi", "SPJIMR Mumbai"],
            color: "green",
            description: "Business schools with strong placement records."
        },
        {
            icon: <Brain className={`w-5 h-5 ${palette.purple}`} />,
            title: "Medical & Healthcare",
            colleges: ["AIIMS Delhi", "CMC Vellore", "JIPMER", "King George Medical"],
            color: "purple",
            description: "Medical colleges with solid reputations."
        },
        {
            icon: <Globe className={`w-5 h-5 ${palette.cyan}`} />,
            title: "Arts & Liberal Studies",
            colleges: ["JNU Delhi", "Jadavpur University", "BHU Varanasi", "Presidency Kolkata"],
            color: "cyan",
            description: "Notable universities for arts and humanities."
        }
    ];

    const searchFeatures = [
        {
            icon: <Target className={`w-6 h-6 ${palette.blue}`} />,
            title: "Personalized Search",
            description: "Get college suggestions based on your profile."
        },
        {
            icon: <BarChart3 className={`w-6 h-6 ${palette.green}`} />,
            title: "Compare Colleges",
            description: "See colleges side-by-side with key stats."
        },
        {
            icon: <Shield className={`w-6 h-6 ${palette.purple}`} />,
            title: "Reliable Data",
            description: "Access up-to-date info on rankings and fees."
        },
        {
            icon: <Zap className={`w-6 h-6 ${palette.yellow}`} />,
            title: "Apply Directly",
            description: "Apply to colleges from one place."
        }
    ];

    const sampleColleges = [
        {
            name: "IIT Delhi",
            course: "Computer Science",
            ranking: "#2 Engineering",
            fee: "₹2.5L/year",
            placement: "₹18.5L avg",
            location: "New Delhi"
        },
        {
            name: "IIM Bangalore",
            course: "MBA",
            ranking: "#3 Management",
            fee: "₹24L total",
            placement: "₹33.8L avg",
            location: "Bangalore"
        },
        {
            name: "AIIMS Delhi",
            course: "MBBS",
            ranking: "#1 Medical",
            fee: "₹5,856/year",
            placement: "100% placement",
            location: "New Delhi"
        }
    ];

    return (
        <div className="min-h-screen mt-20 bg-gradient-to-br from-black via-gray-950 to-gray-900 text-gray-200">
            {/* Subtle background texture */}
            <div className="fixed inset-0 opacity-[0.04] pointer-events-none">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23666' fill-opacity='0.5'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }} />
            </div>

            {/* Faded floating background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-24 left-10 w-64 h-64 bg-blue-900/30 rounded-full blur-3xl"></div>
                <div className="absolute bottom-24 right-10 w-80 h-80 bg-green-900/30 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-900/20 rounded-full blur-3xl"></div>
            </div>

            {/* Header */}
            <header className="relative z-10 border-b border-gray-800/60">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="p-2 rounded-lg bg-gradient-to-r from-gray-800/80 to-gray-900/80 border border-gray-700/60">
                                <GraduationCap className="w-6 h-6 text-gray-400" />
                            </div>
                            <div>
                                <h1 className="text-xl font-semibold text-gray-100">CollegeFinder</h1>
                                <p className="text-xs text-gray-500">College search made simple</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-gray-400">
                                {currentTime.toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                })}
                            </div>
                            <div className="text-xs text-gray-600">
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
                            {/* Floating Badge */}
                            <div className="mb-6">
                                <div className="inline-flex items-center space-x-2 bg-gray-800/60 border border-gray-700/60 rounded-full px-4 py-2 backdrop-blur-sm">
                                    <div className="w-2 h-2 bg-green-700 rounded-full animate-pulse"></div>
                                    <span className="text-green-300 text-sm font-medium">AI College Search</span>
                                </div>
                            </div>

                            {/* Main Hero Text */}
                            <div>
                                <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6 tracking-tight text-gray-100">
                                    <span>Find a College</span>
                                    <br />
                                    <span className="bg-gradient-to-r from-blue-300 via-green-300 to-purple-300 bg-clip-text text-transparent">
                                        That Fits You
                                    </span>
                                </h2>

                                <p className="text-base text-gray-400 leading-relaxed max-w-xl mb-6">
                                    Search and compare colleges in India. Get data, compare, and apply—all in one place.
                                </p>

                                {/* Stats Row */}
                                <div className="flex items-center space-x-6 mb-8">
                                    <div className="text-center">
                                        <div className="text-xl font-bold text-gray-100 mb-1">5000+</div>
                                        <div className="text-xs text-gray-500 uppercase tracking-wider">Colleges</div>
                                    </div>
                                    <div className="w-px h-8 bg-gray-700"></div>
                                    <div className="text-center">
                                        <div className="text-xl font-bold text-green-300 mb-1">98%</div>
                                        <div className="text-xs text-gray-500 uppercase tracking-wider">Match Rate</div>
                                    </div>
                                    <div className="w-px h-8 bg-gray-700"></div>
                                    <div className="text-center">
                                        <div className="text-xl font-bold text-gray-100 mb-1">Live Data</div>
                                        <div className="text-xs text-gray-500 uppercase tracking-wider">Updated</div>
                                    </div>
                                </div>

                                {/* CTA Section */}
                                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                                    <button
                                        onClick={() => startCollegeSearch()}
                                        disabled={accessLoading}
                                        className={`group relative inline-flex items-center bg-gradient-to-r from-gray-800/80 to-gray-900/80 hover:from-gray-700 hover:to-gray-800 text-gray-100 px-8 py-4 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-900/20 ${accessLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <Search className="w-5 h-5 mr-3" />
                                        <span>{accessLoading ? 'Checking Access...' : 'Start Search'}</span>
                                        {!accessLoading && <ArrowRight className="w-4 h-4 ml-3 transition-transform group-hover:translate-x-1" />}
                                    </button>

                                    <div className="flex items-center space-x-3 text-sm text-gray-500">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-2 h-2 bg-green-700 rounded-full animate-pulse"></div>
                                            <span>No signup needed</span>
                                        </div>
                                        <span>•</span>
                                        <span>Fast results</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Interactive Demo */}
                        <div className="lg:col-span-5 space-y-4">
                            {/* College Search Demo */}
                            <div className="relative bg-gray-900/80 rounded-2xl p-6 backdrop-blur-sm overflow-hidden group border border-gray-800/60">
                                {/* Faint Border Effect */}
                                <div className="absolute inset-0 rounded-2xl pointer-events-none">
                                    <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-blue-900/0 via-blue-800/30 to-blue-900/0"></div>
                                    <div className="absolute inset-0 rounded-2xl border border-blue-900/30"></div>
                                </div>

                                {/* Content Container */}
                                <div className="relative z-10">
                                    {/* Demo Header */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-7 h-7 bg-blue-900/40 border border-blue-800/40 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/20">
                                                <Search className="w-4 h-4 text-blue-300" />
                                            </div>
                                            <div>
                                                <h4 className="text-gray-100 font-medium text-sm">Search Demo</h4>
                                                <p className="text-xs text-gray-400">Sample results</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Search Results */}
                                    <div className="space-y-3">
                                        {sampleColleges.map((college, index) => (
                                            <div key={index} className="p-3 bg-gray-800/60 border border-gray-700/60 rounded-lg hover:border-blue-400/30 transition-colors">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-2 mb-1">
                                                            <h5 className="text-sm font-medium text-gray-100">{college.name}</h5>
                                                            <span className="px-2 py-0.5 bg-blue-900/40 text-blue-300 text-xs rounded border border-blue-800/40">
                                                                {college.ranking}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-gray-500 mb-2">{college.course} • {college.location}</p>
                                                        <div className="flex items-center space-x-3 text-xs">
                                                            <span className="text-green-300">{college.fee}</span>
                                                            <span className="text-purple-300">{college.placement}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex space-x-1">
                                                        <button className="p-1.5 bg-gray-900/60 border border-gray-700/60 rounded text-blue-300 hover:bg-blue-900/30 transition-colors">
                                                            <Star className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Demo Footer */}
                                    <div className="mt-4 pt-4 border-t border-blue-900/30">
                                        <div className="flex items-center justify-center">
                                            <button
                                                onClick={() => startCollegeSearch("Engineering")}
                                                disabled={accessLoading}
                                                className={`inline-flex items-center bg-gradient-to-r from-blue-900/80 to-gray-900/80 hover:from-blue-800 hover:to-gray-800 text-gray-100 px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 text-xs border border-blue-900/30 ${accessLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                <Search className="w-3 h-3 mr-1" />
                                                {accessLoading ? 'Checking...' : 'Try Search'}
                                                {!accessLoading && <ArrowRight className="w-3 h-3 ml-1" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Comparison Tool Preview */}
                            <div className="relative bg-gray-900/80 rounded-2xl p-5 backdrop-blur-sm overflow-hidden group border border-gray-800/60">
                                {/* Faint Border Effect */}
                                <div className="absolute inset-0 rounded-2xl pointer-events-none">
                                    <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-purple-900/0 via-purple-800/30 to-purple-900/0"></div>
                                    <div className="absolute inset-0 rounded-2xl border border-purple-900/30"></div>
                                </div>

                                {/* Content Container */}
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-7 h-7 bg-purple-900/40 border border-purple-800/40 rounded-lg flex items-center justify-center shadow-lg shadow-purple-900/20">
                                                <BarChart3 className="w-4 h-4 text-purple-300" />
                                            </div>
                                            <div>
                                                <h4 className="text-gray-100 font-medium text-sm">Compare Demo</h4>
                                                <p className="text-xs text-gray-400">Side-by-side</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="grid grid-cols-3 gap-2 text-xs">
                                            <div className="text-center p-2 bg-purple-900/40 border border-purple-800/40 rounded">
                                                <div className="text-gray-100 font-medium">IIT Delhi</div>
                                                <div className="text-purple-300">₹2.5L/yr</div>
                                            </div>
                                            <div className="text-center p-2 bg-blue-900/40 border border-blue-800/40 rounded">
                                                <div className="text-gray-100 font-medium">NIT Trichy</div>
                                                <div className="text-blue-300">₹1.8L/yr</div>
                                            </div>
                                            <div className="text-center p-2 bg-green-900/40 border border-green-800/40 rounded">
                                                <div className="text-gray-100 font-medium">BITS Pilani</div>
                                                <div className="text-green-300">₹4.2L/yr</div>
                                            </div>
                                        </div>

                                        <div className="text-center">
                                            <button
                                                onClick={() => startCollegeSearch("Compare")}
                                                disabled={accessLoading}
                                                className={`inline-flex items-center bg-gradient-to-r from-purple-900/80 to-blue-900/80 hover:from-purple-800 hover:to-blue-800 text-gray-100 px-3 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 text-xs ${accessLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                <BarChart3 className="w-3 h-3 mr-1" />
                                                {accessLoading ? 'Checking...' : 'Compare'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* College Categories Section */}
                <section className="border-t border-gray-800/60">
                    <div className="max-w-7xl mx-auto px-6 py-20">
                        <div className="mb-12">
                            <h3 className="text-2xl font-light text-gray-100 mb-4">Browse by Category</h3>
                            <p className="text-gray-500">Explore colleges by field</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {collegeCategories.map((category, index) => (
                                <button
                                    key={index}
                                    onClick={() => startCollegeSearch(category.title)}
                                    disabled={accessLoading}
                                    className={`group w-full text-left border border-gray-800/60 hover:border-gray-700/80 bg-gray-900/60 hover:bg-gray-900/80 transition-all duration-300 p-6 rounded-xl hover:scale-[1.01] ${accessLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center space-x-4">
                                            <div className={`p-3 rounded-lg group-hover:scale-105 transition-transform duration-300 ${category.color === 'blue' ? 'bg-blue-900/40 border border-blue-800/40' :
                                                category.color === 'green' ? 'bg-green-900/40 border border-green-800/40' :
                                                    category.color === 'purple' ? 'bg-purple-900/40 border border-purple-800/40' :
                                                        'bg-cyan-900/40 border border-cyan-800/40'
                                                }`}>
                                                {category.icon}
                                            </div>
                                            <div>
                                                <h4 className="text-base font-medium text-gray-100 group-hover:text-blue-300 transition-colors">
                                                    {category.title}
                                                </h4>
                                                <p className="text-gray-400 text-sm mt-1">
                                                    {category.description}
                                                </p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-blue-300 transition-colors flex-shrink-0" />
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {category.colleges.map((college, collegeIndex) => (
                                            <span
                                                key={collegeIndex}
                                                className={`px-3 py-1 text-xs rounded-full ${category.color === 'blue' ? 'border border-blue-800/40 bg-blue-900/40 text-blue-300' :
                                                    category.color === 'green' ? 'border border-green-800/40 bg-green-900/40 text-green-300' :
                                                        category.color === 'purple' ? 'border border-purple-800/40 bg-purple-900/40 text-purple-300' :
                                                            'border border-cyan-800/40 bg-cyan-900/40 text-cyan-300'
                                                    }`}
                                            >
                                                {college}
                                            </span>
                                        ))}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="border-t border-gray-800/60">
                    <div className="max-w-7xl mx-auto px-6 py-20">
                        <div className="mb-12 text-center">
                            <h3 className="text-2xl font-light text-gray-100 mb-4">Features</h3>
                            <p className="text-gray-500">What you can do here</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {searchFeatures.map((feature, index) => (
                                <div
                                    key={index}
                                    className="p-6 border border-gray-800/60 bg-gray-900/60 rounded-xl hover:border-gray-700/80 transition-all duration-300 hover:scale-105"
                                >
                                    <div className="mb-4">
                                        {feature.icon}
                                    </div>
                                    <h4 className="text-base font-medium text-gray-100 mb-2">{feature.title}</h4>
                                    <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="border-t border-gray-800/60">
                    <div className="max-w-7xl mx-auto px-6 py-20">
                        <div className="bg-gray-900/80 border border-gray-800/60 rounded-2xl p-12 text-center backdrop-blur-sm">
                            <div className="mb-6">
                                <Sparkles className="w-10 h-10 text-blue-300 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-gray-100 mb-4">
                                    Start your search
                                </h3>
                                <p className="text-gray-400 text-base max-w-2xl mx-auto">
                                    Find colleges that match your interests and goals. No fuss, just data.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                                <button
                                    onClick={() => startCollegeSearch()}
                                    disabled={accessLoading}
                                    className={`group inline-flex items-center bg-gradient-to-r from-blue-900/80 to-gray-900/80 hover:from-blue-800 hover:to-gray-800 text-gray-100 px-8 py-4 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-900/20 ${accessLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <Search className="w-5 h-5 mr-3" />
                                    <span>{accessLoading ? 'Checking Access...' : 'Start Search'}</span>
                                    {!accessLoading && <ArrowRight className="w-4 h-4 ml-3 transition-transform group-hover:translate-x-1" />}
                                </button>

                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                    <div className="flex items-center space-x-1">
                                        <Star className="w-4 h-4 text-yellow-300 fill-current" />
                                        <span>4.8/5</span>
                                    </div>
                                    <span>•</span>
                                    <div className="flex items-center space-x-1">
                                        <Users className="w-4 h-4" />
                                        <span>100K+ users</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-800/60">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                        <div>© 2025 CollegeFinder</div>
                        <div className="flex items-center space-x-6">
                            <a href="#" className="hover:text-gray-400 transition-colors">Privacy</a>
                            <a href="#" className="hover:text-gray-400 transition-colors">Terms</a>
                            <a href="#" className="hover:text-gray-400 transition-colors">Support</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default CollegeSearchWelcome;