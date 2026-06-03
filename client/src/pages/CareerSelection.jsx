import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../api/index';
import { SITE_BRAND_NAME } from '../constants/branding';
import { ArrowRight, BookOpen, GraduationCap, Brain, Target, Lightbulb, Users, FileText } from 'lucide-react';

const CareerSelection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  // Navigation is instant — destination routes handle access via the
  // RequirePlatformAccess modal, so there is no "checking access" state here.
  const accessLoading = false;

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

  // Direct navigation — premium access is enforced by RequirePlatformAccess
  // on the destination route via an in-page modal. No redirect chains, no
  // pre-flight network calls, no loading flickers.
  const goToAssessment = (route) => {
    sessionStorage.removeItem('assessmentAnswers');
    sessionStorage.removeItem('assessmentType');
    sessionStorage.removeItem('independentTestAnswers');
    sessionStorage.removeItem('independentTestType');
    navigate(route);
  };

  const handleSchoolAssessment = () => goToAssessment('/school-assessment');
  const handleCollegeAssessment = () => goToAssessment('/college-assessment');

  const handleViewSavedReport = () => {
    const hasSchoolReport = !!localStorage.getItem('schoolCareerReport');
    const target = hasSchoolReport ? '/school-career-report' : '/career-report';
    goToAssessment(target);
  };

  const handlePersonalityTest = () => goToAssessment('/personality-test');

  const handleAptitudeTest = () => goToAssessment('/aptitude-test');
  const handleIntelligenceTest = () => goToAssessment('/intelligence-test');

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden w-full">
      {/* Animated Background - UNCHANGED */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-black"></div>
        <div className="absolute w-full h-full">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-blue-600 blur-[120px]"
              style={{
                width: `${Math.random() * 600 + 200}px`,
                height: `${Math.random() * 600 + 200}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: 0.05,
              }}
            />
          ))}
        </div>
      </div>

      {/* Top Navigation Bar - MADE MOBILE RESPONSIVE */}


      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header Section - MADE MOBILE RESPONSIVE */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex mb-4 sm:mb-6">
            <span className="text-xs font-semibold tracking-wider bg-blue-500/10 border border-blue-500/20 py-2 px-4 sm:px-6 rounded-full text-blue-400">
              AI-POWERED CAREER GUIDANCE
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 sm:mb-6 px-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-white">
              Discover Your Perfect Path
            </span>
          </h1>
          <p className="text-white/70 max-w-3xl mx-auto text-base sm:text-lg leading-relaxed px-4">
            Our cutting-edge AI assessment combines psychology, education science, and industry insights to create your personalized career roadmap.
          </p>
        </div>

        {/* Main Content Grid - MADE MOBILE RESPONSIVE */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 mb-12 sm:mb-16">

          {/* LEFT SIDE - V1 COMPREHENSIVE ASSESSMENTS (MOBILE RESPONSIVE) */}
          <div className="space-y-6 sm:space-y-8">
            <div className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Comprehensive College Assessments</h2>
              <p className="text-white/60 text-sm sm:text-base">Deep dive into your career potential with our detailed assessments</p>
            </div>

            {/* School Assessment Card - MOBILE RESPONSIVE */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500 to-blue-600 rounded-xl opacity-20 blur-sm group-hover:opacity-30 transition-opacity"></div>
              <div className="relative p-[1.5px] rounded-xl bg-gradient-to-b from-blue-500 via-blue-400 to-blue-600">
                <div className="bg-black/95 p-6 sm:p-8 rounded-xl border border-white/10 backdrop-blur-xl hover:border-blue-500/50 transition-all group-hover:bg-black/90">
                  <div className="flex flex-col sm:flex-row sm:items-center mb-4 sm:mb-6">
                    <div className="p-2.5 sm:p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 mb-3 sm:mb-0 sm:mr-4 w-fit">
                      <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-1">Student Edition</h3>
                      <p className="text-white/60 text-xs sm:text-sm">Navigate academic choices with clarity</p>
                    </div>
                  </div>

                  <div className="space-y-2 sm:space-y-3 mb-5 sm:mb-6">
                    <div className="flex items-center text-xs sm:text-sm text-white/70">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 flex-shrink-0"></span>
                      Discover aligned educational paths
                    </div>
                    <div className="flex items-center text-xs sm:text-sm text-white/70">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 flex-shrink-0"></span>
                      Uncover hidden talents
                    </div>
                    <div className="flex items-center text-xs sm:text-sm text-white/70">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 flex-shrink-0"></span>
                      Get subject recommendations
                    </div>
                  </div>

                  <button
                    onClick={handleSchoolAssessment}
                    disabled={accessLoading}
                    className={`group w-full bg-blue-600 text-white py-3 px-4 sm:px-6 rounded-lg font-medium hover:bg-blue-700 transition-all flex items-center justify-center text-sm sm:text-base ${accessLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {accessLoading ? 'Checking Access...' : 'Start School Assessment'}
                    {!accessLoading && <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />}
                  </button>
                </div>
              </div>
            </div>

            {/* College Assessment Card - MOBILE RESPONSIVE */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-b from-purple-500 to-purple-600 rounded-xl opacity-20 blur-sm group-hover:opacity-30 transition-opacity"></div>
              <div className="relative p-[1.5px] rounded-xl bg-gradient-to-b from-purple-500 via-purple-400 to-purple-600">
                <div className="bg-black/95 p-6 sm:p-8 rounded-xl border border-white/10 backdrop-blur-xl hover:border-purple-500/50 transition-all group-hover:bg-black/90">
                  <div className="flex flex-col sm:flex-row sm:items-center mb-4 sm:mb-6">
                    <div className="p-2.5 sm:p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 mb-3 sm:mb-0 sm:mr-4 w-fit">
                      <GraduationCap className="h-6 w-6 sm:h-8 sm:w-8 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-1">College Edition</h3>
                      <p className="text-white/60 text-xs sm:text-sm">Transform knowledge into career success</p>
                    </div>
                  </div>

                  <div className="space-y-2 sm:space-y-3 mb-5 sm:mb-6">
                    <div className="flex items-center text-xs sm:text-sm text-white/70">
                      <span className="w-2 h-2 bg-purple-400 rounded-full mr-3 flex-shrink-0"></span>
                      Map trends to your skills
                    </div>
                    <div className="flex items-center text-xs sm:text-sm text-white/70">
                      <span className="w-2 h-2 bg-purple-400 rounded-full mr-3 flex-shrink-0"></span>
                      Find your perfect career fit
                    </div>
                    <div className="flex items-center text-xs sm:text-sm text-white/70">
                      <span className="w-2 h-2 bg-purple-400 rounded-full mr-3 flex-shrink-0"></span>
                      Get study recommendations
                    </div>
                  </div>

                  <button
                    onClick={handleCollegeAssessment}
                    disabled={accessLoading}
                    className={`group w-full bg-purple-600 text-white py-3 px-4 sm:px-6 rounded-lg font-medium hover:bg-purple-700 transition-all flex items-center justify-center text-sm sm:text-base ${accessLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {accessLoading ? 'Checking Access...' : 'Start College Assessment'}
                    {!accessLoading && <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - V2 QUICK DISCOVERY TESTS (MOBILE RESPONSIVE) */}
          <div className="space-y-6 sm:space-y-8">
            <div className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Quick Discovery Tests</h2>
              <p className="text-white/60 text-sm sm:text-base">Fast insights into your personality, abilities, and intelligence</p>
            </div>

            {/* Personality Test Card - MOBILE RESPONSIVE */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-xl opacity-20 blur-sm group-hover:opacity-30 transition-opacity"></div>
              <div className="relative p-[1.5px] rounded-xl bg-gradient-to-b from-emerald-500 via-emerald-400 to-emerald-600">
                <div className="bg-black/95 p-5 sm:p-6 rounded-xl border border-white/10 backdrop-blur-xl hover:border-emerald-500/50 transition-all group-hover:bg-black/90">
                  <div className="flex items-center mb-3 sm:mb-4">
                    <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 mr-3">
                      <Brain className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-white">Personality Test</h3>
                      <p className="text-white/60 text-xs">Discover your unique traits</p>
                    </div>
                  </div>

                  <p className="text-white/70 text-xs sm:text-sm mb-3 sm:mb-4">
                    Uncover your Big 5 personality traits and how they shape your ideal career path
                  </p>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 space-y-1 sm:space-y-0">
                    <span className="text-xs text-emerald-400 font-medium">15 Questions • 5 Minutes</span>
                    <span className="text-xs text-white/50">Big 5 Model</span>
                  </div>

                  <button
                    onClick={handlePersonalityTest}
                    disabled={accessLoading}
                    className={`group w-full bg-emerald-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-emerald-700 transition-all flex items-center justify-center text-sm ${accessLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {accessLoading ? 'Checking Access...' : 'Start Test'}
                    {!accessLoading && <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Aptitude Test Card - MOBILE RESPONSIVE */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-b from-orange-500 to-orange-600 rounded-xl opacity-20 blur-sm group-hover:opacity-30 transition-opacity"></div>
              <div className="relative p-[1.5px] rounded-xl bg-gradient-to-b from-orange-500 via-orange-400 to-orange-600">
                <div className="bg-black/95 p-5 sm:p-6 rounded-xl border border-white/10 backdrop-blur-xl hover:border-orange-500/50 transition-all group-hover:bg-black/90">
                  <div className="flex items-center mb-3 sm:mb-4">
                    <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20 mr-3">
                      <Target className="h-5 w-5 sm:h-6 sm:w-6 text-orange-400" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-white">Aptitude Test</h3>
                      <p className="text-white/60 text-xs">Measure cognitive abilities</p>
                    </div>
                  </div>

                  <p className="text-white/70 text-xs sm:text-sm mb-3 sm:mb-4">
                    Test your logical reasoning, numerical ability, and problem-solving skills
                  </p>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 space-y-1 sm:space-y-0">
                    <span className="text-xs text-orange-400 font-medium">20 Questions • 10 Minutes</span>
                    <span className="text-xs text-white/50">Cognitive Skills</span>
                  </div>

                  <button
                    onClick={handleAptitudeTest}
                    disabled={accessLoading}
                    className={`group w-full bg-orange-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-orange-700 transition-all flex items-center justify-center text-sm ${accessLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {accessLoading ? 'Checking Access...' : 'Start Test'}
                    {!accessLoading && <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Intelligence Test Card - MOBILE RESPONSIVE */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-b from-pink-500 to-pink-600 rounded-xl opacity-20 blur-sm group-hover:opacity-30 transition-opacity"></div>
              <div className="relative p-[1.5px] rounded-xl bg-gradient-to-b from-pink-500 via-pink-400 to-pink-600">
                <div className="bg-black/95 p-5 sm:p-6 rounded-xl border border-white/10 backdrop-blur-xl hover:border-pink-500/50 transition-all group-hover:bg-black/90">
                  <div className="flex items-center mb-3 sm:mb-4">
                    <div className="p-2 rounded-lg bg-pink-500/10 border border-pink-500/20 mr-3">
                      <Lightbulb className="h-5 w-5 sm:h-6 sm:w-6 text-pink-400" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-white">Intelligence Test</h3>
                      <p className="text-white/60 text-xs">Find your learning style</p>
                    </div>
                  </div>

                  <p className="text-white/70 text-xs sm:text-sm mb-3 sm:mb-4">
                    Discover your multiple intelligence types and optimal learning approaches
                  </p>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 space-y-1 sm:space-y-0">
                    <span className="text-xs text-pink-400 font-medium">15 Questions • 7 Minutes</span>
                    <span className="text-xs text-white/50">Gardner's Theory</span>
                  </div>

                  <button
                    onClick={handleIntelligenceTest}
                    disabled={accessLoading}
                    className={`group w-full bg-pink-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-pink-700 transition-all flex items-center justify-center text-sm ${accessLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {accessLoading ? 'Checking Access...' : 'Start Test'}
                    {!accessLoading && <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA Section - MOBILE RESPONSIVE */}
        <div className="text-center">
          <div className="inline-flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 bg-white/5 border border-white/10 rounded-full py-3 px-4 sm:px-6">
            <div className="flex -space-x-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-full border-2 border-black"></div>
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-500 rounded-full border-2 border-black"></div>
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-emerald-500 rounded-full border-2 border-black"></div>
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-500 rounded-full border-2 border-black"></div>
            </div>
            <span className="text-white/80 font-medium text-sm sm:text-base text-center">50,000+ students have found their path</span>
          </div>
        </div>
      </div>

      {/* Footer - MOBILE RESPONSIVE */}
      <div className="w-full px-4 sm:px-8 py-6 border-t border-white/5 mt-8 sm:mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <p className="text-xs sm:text-sm text-white/40 text-center sm:text-left">{`© 2025 ${SITE_BRAND_NAME} • Guiding Futures with Precision`}</p>
          <div className="flex space-x-4 sm:space-x-6 text-xs sm:text-sm">
            <a href="#" className="text-white/40 hover:text-blue-400 transition-colors">Privacy</a>
            <a href="#" className="text-white/40 hover:text-blue-400 transition-colors">Terms</a>
            <a href="#" className="text-white/40 hover:text-blue-400 transition-colors">Support</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerSelection;