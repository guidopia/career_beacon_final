import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LayoutDashboard, Brain, MessageSquare, BookOpen, Zap, GraduationCap, Heart, User } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../api';

export default function Dashboard() {
  const [activeApp, setActiveApp] = useState(null);
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loadingSub, setLoadingSub] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('authToken', token);
      params.delete('token');
      navigate({
        pathname: location.pathname,
        search: params.toString(),
      }, { replace: true });
    }
  }, [location, navigate]);

  // Fetch user
  useEffect(() => {
    const getUser = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) return;
        const response = await axios.get(`${API_BASE_URL}/api/user/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    getUser();
  }, []);

  // Fetch subscription
  useEffect(() => {
    const getSubs = async () => {
      try {
        if (!user) return;
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`${API_BASE_URL}/api/purchases/active-subscriptions/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.subscriptions?.length > 0) {
          setSubscription(response.data.subscriptions[0]);
        }
      } catch (error) {
        console.error('Error fetching subscription:', error);
      } finally {
        setLoadingSub(false);
      }
    };
    getSubs();
  }, [user]);

  const handleAppClick = (appName) => {
    setActiveApp(appName);
  };

  const careerApps = [
    {
      name: "Career Assessment",
      description: "Discover your strengths and find your perfect career match",
      route: "/career-selection",
      icon: Brain,
      color: "#60A5FA"
    },
    {
      name: "Prodigy AI Assistant",
      description: "AI-powered counselor for your journey",
      route: "/assistant",
      icon: MessageSquare,
      color: "#F97316"
    },
    {
      name: "Exam AI",
      description: "Master exams with personalized prep",
      route: "/exam-ai",
      icon: BookOpen,
      color: "#EC4899"
    },
    {
      name: "College Search",
      description: "Find colleges that match your dreams",
      route: "/college-search-welcome",
      icon: GraduationCap,
      color: "#10B981"
    },
    {
      name: "Upskilling",
      description: "Level up with AI-driven micro-courses",
      route: "/upskilling-welcome",
      icon: Zap,
      color: "#8B5CF6"
    },
    {
      name: "Future Me Card",
      description: "Visualize your future self",
      route: "/future-me",
      icon: Heart,
      color: "#FBBF24"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white px-3 sm:px-4 md:px-6 lg:px-8 pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-8">
      {/* Header Section - Stack vertically on mobile */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8 sm:mb-12 lg:mb-16 flex flex-col lg:flex-row justify-between items-start gap-6 md:gap-8 lg:gap-12"
      >
        <div className="flex-1 w-full">
          <div className="mb-4 sm:mb-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-2 sm:mb-3">
              <span className="bg-gradient-to-r from-green-400 via-cyan-400 to-green-400 bg-clip-text text-transparent">
                Career Dashboard
              </span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed max-w-2xl">
              Welcome back! Explore personalized career paths, master new skills, and connect with opportunities designed just for you. Your journey to success starts here.
            </p>
          </div>
          
          {/* Quick Stats */}
          <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-6 flex-wrap">
            <div className="px-3 sm:px-4 py-2 bg-green-600/10 border border-green-500/30 rounded-lg">
              <p className="text-xs sm:text-sm text-green-400 font-semibold">🚀 Career Ready</p>
            </div>
            <div className="px-3 sm:px-4 py-2 bg-blue-600/10 border border-blue-500/30 rounded-lg">
              <p className="text-xs sm:text-sm text-blue-400 font-semibold">📚 Always Learning</p>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Profile & Subscription - Full width on mobile, fixed width on larger screens */}
        <div className="w-full lg:w-80 flex flex-col gap-3 sm:gap-4 flex-shrink-0">
          {/* Profile Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-green-600/15 to-green-500/5 border border-green-500/40 rounded-xl p-3 sm:p-4 hover:border-green-500/60 transition-all duration-300"
          >
            <Link
              to="/profile"
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-green-500/30 to-green-500/10 flex items-center justify-center flex-shrink-0 group-hover:shadow-lg group-hover:shadow-green-500/20 transition-all">
                <User size={20} className="sm:w-6 sm:h-6 text-green-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 font-medium">Account</p>
                <p className="text-xs sm:text-sm font-bold text-white truncate">My Profile</p>
              </div>
              <svg className="w-4 h-4 text-green-400 group-hover:translate-x-1 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>

          {/* Subscription Status Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-purple-600/15 to-purple-500/5 border border-purple-500/40 rounded-xl p-3 sm:p-4 hover:border-purple-500/60 transition-all duration-300"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-purple-500/30 to-purple-500/10 flex items-center justify-center flex-shrink-0">
                <Zap size={20} className="sm:w-6 sm:h-6 text-purple-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 font-medium">Subscription</p>
                {loadingSub ? (
                  <div className="h-8 flex items-center">
                    <div className="w-3 h-3 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin"></div>
                  </div>
                ) : subscription ? (
                  <>
                    <p className="text-xs sm:text-sm font-bold text-white mb-2">Premium Active</p>
                    <div className="w-full bg-gray-700/30 rounded-full h-1.5">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((subscription.daysRemaining / 365) * 100, 100)}%` }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                    <p className="text-xs text-purple-300 mt-1 font-medium">
                      {subscription.daysRemaining} days left
                    </p>
                  </>
                ) : (
                  <p className="text-xs text-gray-400 mt-1">No active subscription</p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Career Apps Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="mb-8 sm:mb-12"
      >
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-6 sm:mb-8">
          <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Your Learning Tools
          </span>
        </h2>
        
        {/* Cards Grid - Responsive columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
          {careerApps.map((app, idx) => {
            const IconComponent = app.icon;
            const isActive = activeApp === app.name;
            
            return (
              <motion.div
                key={app.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.3 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to={app.route}
                  onClick={() => handleAppClick(app.name)}
                  className={`
                    group relative flex flex-col p-3 sm:p-4 md:p-5 rounded-xl
                    transition-all duration-400 cursor-pointer overflow-hidden
                    h-full min-h-[140px] sm:min-h-[160px]
                    ${isActive
                      ? 'bg-gray-900/50 border-2 border-green-500/60 shadow-lg shadow-green-500/30'
                      : 'bg-gray-900/40 border border-gray-700/40 hover:border-2 hover:border-purple-500/80 hover:shadow-lg hover:shadow-purple-500/20'
                    }
                  `}
                  style={{ textDecoration: 'none' }}
                >
                  {/* Icon Container */}
                  <div
                    className="flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-lg mb-2 sm:mb-3 transition-all duration-400 relative flex-shrink-0"
                    style={{
                      background: isActive
                        ? `linear-gradient(135deg, ${app.color}40, ${app.color}20)`
                        : `linear-gradient(135deg, ${app.color}20, ${app.color}10)`,
                      color: app.color,
                      boxShadow: isActive ? `0 8px 20px ${app.color}30` : `0 4px 12px ${app.color}15`
                    }}
                  >
                    <IconComponent size={20} className="sm:w-6 sm:h-6" strokeWidth={2} />
                  </div>
    
                  {/* Content */}
                  <h3 className="font-bold text-white mb-1 sm:mb-1.5 text-xs sm:text-sm">
                    {app.name}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed flex-grow">
                    {app.description}
                  </p>
    
                  {/* Active Indicator */}
                  {isActive && (
                    <motion.div 
                      className="mt-2 sm:mt-3 w-2 h-2 rounded-full bg-green-500"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Subscription Status */}
    </div>
  );
}