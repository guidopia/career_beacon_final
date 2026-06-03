import { useState, useEffect, useRef } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { apiAxios, clearStableAuthCache } from '../api/index';
import { Menu, X, LogOut, Compass, LayoutDashboard, Brain, MessageSquare, BookOpen, Zap, GraduationCap, Heart } from 'lucide-react';
import { SITE_BRAND_NAME } from '../constants/branding';

export default function Layout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeApp, setActiveApp] = useState(null);
  const mobileMenuRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await apiAxios('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem('authToken');
      clearStableAuthCache();
      navigate("/login");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const handleAppClick = (appName) => {
    setActiveApp(appName);
  };

  const careerApps = [
    {
      name: "Dashboard",
      route: "/dashboard",
      icon: LayoutDashboard,
      color: "#60A5FA"
    },
    {
      name: "Career Assessment",
      route: "/career-selection",
      icon: Brain,
      color: "#06B6D4"
    },
    {
      name: "Prodigy AI Assistant",
      route: "/assistant",
      icon: MessageSquare,
      color: "#F97316"
    },
    {
      name: "Exam AI",
      route: "/exam-ai",
      icon: BookOpen,
      color: "#06E3E3"
    },
    {
      name: "Upskilling",
      route: "/upskilling-welcome",
      icon: Zap,
      color: "#4ADE80"
    },
    {
      name: "College Search",
      route: "/college-search-welcome",
      icon: GraduationCap,
      color: "#60A5FA"
    },
    {
      name: "Future Me Card",
      route: "/future-me",
      icon: Heart,
      color: "#FBBF24"
    }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // App Card Component
  function AppCard({ app, active, onClick }) {
    const IconComponent = app.icon;
    return (
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Link
          to={app.route}
          onClick={() => onClick(app.name)}
          className={`
            group relative flex items-center gap-3 px-4 py-3 rounded-lg
            transition-all duration-400 cursor-pointer overflow-hidden
            ${active
              ? 'bg-gray-900/50 border-2 border-green-500/60 shadow-lg shadow-green-500/30'
              : 'bg-gray-900/40 border border-gray-700/40 hover:border-2 hover:border-purple-500/80 hover:shadow-lg hover:shadow-purple-500/20'
            }
          `}
          style={{ textDecoration: 'none' }}
        >
          {/* Icon Background */}
          <div
            className="flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0 transition-all duration-400 relative"
            style={{
              background: active
                ? `linear-gradient(135deg, ${app.color}40, ${app.color}20)`
                : `linear-gradient(135deg, ${app.color}20, ${app.color}10)`,
              color: app.color,
              boxShadow: active ? `0 8px 20px ${app.color}30` : `0 4px 12px ${app.color}15`
            }}
          >
            <IconComponent size={20} strokeWidth={2} />
          </div>

          {/* Text Content */}
          <span className={`font-medium text-sm transition-all duration-400 relative z-10 ${active ? 'text-white' : 'text-gray-300 group-hover:text-purple-300'}`}>
            {app.name}
          </span>

          {/* Active Indicator Dot */}
          {active && (
            <motion.div 
              className="ml-auto w-2 h-2 rounded-full bg-green-500"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </Link>
      </motion.div>
    );
  }

  // Mobile App Card Component
  function AppCardMobile({ app, active, onClick }) {
    const IconComponent = app.icon;
    return (
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Link
          to={app.route}
          onClick={() => {
            onClick(app.name);
            setIsMobileMenuOpen(false);
          }}
          className={`
            group relative flex items-center gap-3 px-4 py-3 rounded-lg
            transition-all duration-400 cursor-pointer overflow-hidden
            ${active
              ? 'bg-gray-900/50 border-2 border-green-500/60 shadow-lg shadow-green-500/30'
              : 'bg-gray-900/40 border border-gray-700/40 hover:border-2 hover:border-purple-500/80 hover:shadow-lg hover:shadow-purple-500/20'
            }
          `}
          style={{ textDecoration: 'none' }}
        >
          {/* Icon Background */}
          <div
            className="flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0 transition-all duration-400 relative"
            style={{
              background: active
                ? `linear-gradient(135deg, ${app.color}40, ${app.color}20)`
                : `linear-gradient(135deg, ${app.color}20, ${app.color}10)`,
              color: app.color,
              boxShadow: active ? `0 8px 20px ${app.color}30` : `0 4px 12px ${app.color}15`
            }}
          >
            <IconComponent size={20} strokeWidth={2} />
          </div>

          {/* Text Content */}
          <span className={`font-medium text-sm transition-all duration-400 relative z-10 ${active ? 'text-white' : 'text-gray-300 group-hover:text-purple-300'}`}>
            {app.name}
          </span>

          {/* Active Indicator */}
          {active && (
            <motion.div 
              className="ml-auto w-2 h-2 rounded-full bg-green-500"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="bg-black/40 backdrop-blur-xl border-b border-gray-700/40 px-4 md:px-8 py-4 flex items-center justify-between fixed top-0 left-0 right-0 z-30 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-purple-500/5 pointer-events-none"></div>

        {/* Mobile Menu Button */}
        <div className="md:hidden relative z-10">
          <motion.button
            onClick={toggleMobileMenu}
            className="p-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>

        {/* Logo - Matches Navbar.tsx */}
        <Link to="/dashboard" className="flex items-center relative z-10 group">
          <motion.div className="flex items-center gap-3" whileHover={{ scale: 1.05 }}>
            <div className="w-10 h-10 flex items-center justify-center relative hover:rotate-180 transition-transform duration-700">
              <div className="absolute inset-0 bg-gradient-to-r from-[#22c55e] to-[#4ade80] rounded-full" />
              <Compass className="text-black w-6 h-6 relative z-10" />
            </div>
            <div className="leading-tight tracking-tight max-w-[min(100vw-10rem,16rem)] sm:max-w-none">
              <h1 className="text-xs sm:text-sm md:text-lg lg:text-2xl xl:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {SITE_BRAND_NAME}
              </h1>
            </div>
          </motion.div>
        </Link>

        {/* Logout Button */}
        <motion.button
          onClick={handleLogout}
          className="relative z-10 flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 hover:text-red-200 border border-red-500/30 hover:border-red-500/50 rounded-lg transition-all duration-300 font-medium text-sm"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <LogOut size={18} />
          <span className="hidden sm:inline">Logout</span>
        </motion.button>
      </header>

      <div className="flex flex-1 relative">
        {/* Sidebar - Desktop */}
        <motion.aside
          className="hidden md:block w-80 bg-black/30 backdrop-blur-xl border-r border-gray-700/40 fixed left-0 top-16 h-[calc(100vh-64px)] z-20 overflow-y-auto"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <nav className="p-6 space-y-2">
            {/* Section Header */}
            <div className="mb-4">
              <h3 className="text-xs font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent uppercase tracking-widest px-2 mb-3">
                Career Hub
              </h3>
            </div>

            {/* Apps Stack */}
            <div className="space-y-2">
              {careerApps.map((app, idx) => (
                <motion.div
                  key={app.route}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <AppCard
                    app={app}
                    active={activeApp === app.name || app.route === window.location.pathname}
                    onClick={handleAppClick}
                  />
                </motion.div>
              ))}
            </div>

          </nav>
        </motion.aside>

        {/* Mobile Sidebar */}
        <motion.div
          ref={mobileMenuRef}
          className={`md:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-40 transition-all ${
            isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <motion.div
            className="bg-black/95 backdrop-blur-xl w-72 h-full shadow-2xl border-r border-gray-700/40 flex flex-col"
            initial={{ x: '-100%' }}
            animate={{ x: isMobileMenuOpen ? '0%' : '-100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="p-6 space-y-2 flex-1 overflow-y-auto">
              {/* Section Header */}
              <div className="mb-4">
                <h3 className="text-xs font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent uppercase tracking-widest px-2 mb-3">
                  Career Hub
                </h3>
              </div>

              {/* Apps Stack */}
              <div className="space-y-2">
                {careerApps.map((app, idx) => (
                  <motion.div
                    key={app.route}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <AppCardMobile
                      app={app}
                      active={activeApp === app.name || app.route === window.location.pathname}
                      onClick={handleAppClick}
                    />
                  </motion.div>
                ))}
              </div>
            </nav>
          </motion.div>
        </motion.div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto text-white relative md:ml-80 pt-4 pb-4 px-4 md:px-8">
          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* Custom Scrollbar */}
      <style>{`
        ::-webkit-scrollbar {
          width: 6px;
        }

        ::-webkit-scrollbar-track {
          background: transparent;
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(96, 165, 250, 0.2);
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(96, 165, 250, 0.4);
        }
      `}</style>
    </div>
  );
}