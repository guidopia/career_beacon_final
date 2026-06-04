import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import RequirePlatformAccess from './components/RequirePlatformAccess.jsx';
import Layout from './components/Layout';
import './App.css';
import { SITE_BRAND_NAME_SENTENCE } from './constants/branding';
import LandingPage from './pages/LandingPage';
import Upskilling from './pages/Upskilling';
import Pricing from './components/LandingPage/Pricing';
import SanskritiChat from './pages/SanskritiChat';
import SchoolAssessment from './components/SchoolAssessment';
import CollegeAssessment from './components/CollegeAssessment';
import GenerateReport from './components/GenerateReport';
import GenerateSchoolReport from './components/GenerateSchoolReport';
import CareerReport from './pages/CareerReport';
import SchoolCareerReport from './pages/SchoolCareerReport';
import CareerSelection from './pages/CareerSelection';
import FutureMeStepper from './pages/FutureMeStepper';
import FutureMeCard from './pages/FutureMeCard';
import ProfilePage from './pages/ProfilePage';
import SanskritiWelcome from './pages/SanskritiWelcome';
import UpskillingWelcome from './pages/UpskillingWelcome';
import SetupPage from './pages/SetupPage';
import SyllabusPage from './pages/SyllabusPage';
import AdaptiveTestPage from './pages/AdaptiveTestPage';
import ChapterReviewPage from './pages/ChapterReviewPage';
import AnalyticsPage from './pages/AnalyticsPage';
import Home from './pages/CollegeHome'
import CollegeExplore from './pages/CollegeExplore'
import Compare from './pages/Compare'
import { hasAnyCompletedSetup, migrateOldData } from './services/storageService';
import { useEffect, useState } from 'react';
import CollegeSearchWelcome from './pages/CollegeSearchWelcome';
import ExamAIWelcome from "./pages/ExamAIWelcome"
import AboutUs from './pages/About';
import PrivacyPolicy from './pages/PrivacyPolicy';
import RefundPolicy from './pages/RefundPolicy';
import TermsConditions from './pages/TermsConditions';
// V2 Components - NEW
import PersonalityTest from './components/PersonalityTest';
import AptitudeTest from './components/AptitudeTest';
import IntelligenceTest from './components/IntelligenceTest';
import IndependentTestReport from './components/IndependentTestReport';
import AdminPrepaid from './pages/AdminPrepaid';

// V2 Pages - NEW
import SavedPersonalityTest from './pages/SavedPersonalityTest';
import SavedAptitudeTest from './pages/SavedAptitudeTest';
import SavedIntelligenceTest from './pages/SavedIntelligenceTest';
import X9mK2pL7qR4n from './pages/X9mK2pL7qR4n';
import Y8nL3kP6qW5m from './pages/Y8nL3kP6qW5m';
import { useModuleTimeTracking } from './hooks/useModuleTimeTracking';

/** When `login`, `/` redirects to `/login` (e.g. Career Beacon client). Set `VITE_PUBLIC_ROOT_ENTRY=login` in Vercel; never hardcode production URLs. */
const ROOT_ENTRY_IS_LOGIN = import.meta.env.VITE_PUBLIC_ROOT_ENTRY === 'login';

const CareerPaths = () => <div className="p-8"><h1 className="text-2xl font-bold">Career Paths Page</h1><p>This page is under construction.</p></div>;
const Assessments = () => <div className="p-8"><h1 className="text-2xl font-bold">Assessments Page</h1><p>This page is under construction.</p></div>;
const Resources = () => <div className="p-8"><h1 className="text-2xl font-bold">Resources Page</h1><p>This page is under construction.</p></div>;
const Mentors = () => <div className="p-8"><h1 className="text-2xl font-bold">Explore Mentors Page</h1><p>This page is under construction.</p></div>;

// Wrapper component to enable tracking inside Router context
function AppRoutes() {
  // Initialize time tracking for ALL routes (must be inside BrowserRouter)
  useModuleTimeTracking();
  
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check setup completion on mount and when storage changes
  useEffect(() => {
    const checkSetup = () => {
      try {
        // Migrate old single-subject data to new multi-subject structure
        const migrationSuccess = migrateOldData();
        if (migrationSuccess) {
          console.log('Successfully migrated old data to multi-subject structure');
        }

        // Check if user has any completed setups (multi-subject aware)
        const setupComplete = hasAnyCompletedSetup();
        setIsSetupComplete(setupComplete);
      } catch (e) {
        // Never allow setup detection errors to freeze the entire app.
        console.error('Setup check failed:', e);
      } finally {
        setLoading(false);
      }
    };

    checkSetup();

    // Listen for storage changes (when setup is completed or subjects are added)
    const handleStorageChange = (e) => {
      // Only check for changes related to our app
      if (e.key && (
        e.key.startsWith('examAI_') ||
        e.key === 'examAI_syllabusPlans' ||
        e.key === 'examAI_currentPlan'
      )) {
        checkSetup();
      }
    };

    // Add storage event listener
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
          <p className="text-white">{`Loading ${SITE_BRAND_NAME_SENTENCE}...`}</p>
          <p className="text-gray-400 text-sm mt-1">Initializing your study environment</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
        {/* Public routes */}
        <Route
          path="/"
          element={
            ROOT_ENTRY_IS_LOGIN ? <Navigate to="/login" replace /> : <LandingPage />
          }
        />
        <Route path="/login" element={

          <Login />

        } />
        <Route path="/about" element={

          <AboutUs />

        } />

        <Route path="/privacy-policy" element={

          <PrivacyPolicy />

        } />

        <Route path="/terms-conditions" element={

          <TermsConditions />

        } />
        <Route path="/refund-policy" element={

          <RefundPolicy />

        } />
        <Route path="/onboarding" element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        } />
        <Route path="/plans" element={
          <Pricing />
        } />
        <Route path="/college-search-welcome" element={
          <ProtectedRoute>
            <RequirePlatformAccess source="college_search">
              <Layout>
                <CollegeSearchWelcome />
              </Layout>
            </RequirePlatformAccess>
          </ProtectedRoute>
        } />
        <Route path="/exam-ai-welcome" element={
          <ProtectedRoute>
            <RequirePlatformAccess source="exam_ai">
              <Layout>
                <ExamAIWelcome />
              </Layout>
            </RequirePlatformAccess>
          </ProtectedRoute>
        } />
        <Route path="/college-search" element={
          <ProtectedRoute>
            <RequirePlatformAccess source="college_search">
              <Layout>
                <Home />
              </Layout>
            </RequirePlatformAccess>
          </ProtectedRoute>
        } />
        <Route path="/explore" element={
          <ProtectedRoute>
            <RequirePlatformAccess source="college_search">
              <Layout>
                <CollegeExplore />
              </Layout>
            </RequirePlatformAccess>
          </ProtectedRoute>
        } />
        <Route path="/compare" element={
          <ProtectedRoute>
            <RequirePlatformAccess source="college_search">
              <Layout>
                <Compare />
              </Layout>
            </RequirePlatformAccess>
          </ProtectedRoute>
        } />
        <Route path="/career-selection" element={
          <ProtectedRoute>
            <RequirePlatformAccess source="career_assessments">
              <Layout>
                <CareerSelection />
              </Layout>
            </RequirePlatformAccess>
          </ProtectedRoute>
        } />
        <Route path="/upskilling-welcome" element={
          <ProtectedRoute>
            <RequirePlatformAccess source="upskilling">
              <Layout>
                <UpskillingWelcome />
              </Layout>
            </RequirePlatformAccess>
          </ProtectedRoute>
        } />
        <Route path="/assistant" element={
          <ProtectedRoute>
            <RequirePlatformAccess source="sanskriti">
              <Layout>
                <SanskritiWelcome />
              </Layout>
            </RequirePlatformAccess>
          </ProtectedRoute>
        } />
        <Route path="/setup" element={
          <ProtectedRoute>
            <RequirePlatformAccess source="exam_ai">
              <Layout>
                <SetupPage />
              </Layout>
            </RequirePlatformAccess>
          </ProtectedRoute>
        } />
        <Route path="/syllabus" element={
          <ProtectedRoute>
            <RequirePlatformAccess source="exam_ai">
              <Layout>
                {isSetupComplete ? <SyllabusPage /> : <Navigate to="/setup" replace />}
              </Layout>
            </RequirePlatformAccess>
          </ProtectedRoute>
        } />
        <Route path="/test/:chapterName" element={
          <ProtectedRoute>
            <RequirePlatformAccess source="exam_ai">
              <Layout>
                {isSetupComplete ? <AdaptiveTestPage /> : <Navigate to="/setup" replace />}
              </Layout>
            </RequirePlatformAccess>
          </ProtectedRoute>
        } />
        <Route path="/revision/:chapterName" element={
          <ProtectedRoute>
            <RequirePlatformAccess source="exam_ai">
              <Layout>
                {isSetupComplete ? <ChapterReviewPage /> : <Navigate to="/setup" replace />}
              </Layout>
            </RequirePlatformAccess>
          </ProtectedRoute>
        } />
        <Route path="/analytics" element={
          <ProtectedRoute>
            <RequirePlatformAccess source="exam_ai">
              <Layout>
                {isSetupComplete ? <AnalyticsPage /> : <Navigate to="/setup" replace />}
              </Layout>
            </RequirePlatformAccess>
          </ProtectedRoute>
        } />
        <Route path="/exam-ai" element={
          <ProtectedRoute>
            <RequirePlatformAccess source="exam_ai">
              <Navigate to={isSetupComplete ? "/syllabus" : "/exam-ai-welcome"} replace />
            </RequirePlatformAccess>
          </ProtectedRoute>
        } />
        <Route path="/school-assessment" element={
          <ProtectedRoute>
            <RequirePlatformAccess source="career_assessments">
              <SchoolAssessment />
            </RequirePlatformAccess>
          </ProtectedRoute>
        } />
        <Route path="/college-assessment" element={
          <ProtectedRoute>
            <RequirePlatformAccess source="career_assessments">
              <CollegeAssessment />
            </RequirePlatformAccess>
          </ProtectedRoute>
        } />
        <Route path="/personality-test" element={
          <ProtectedRoute>
            <RequirePlatformAccess source="career_assessments">
              <PersonalityTest />
            </RequirePlatformAccess>
          </ProtectedRoute>
        } />
        <Route path="/aptitude-test" element={
          <ProtectedRoute>
            <RequirePlatformAccess source="career_assessments">
              <AptitudeTest />
            </RequirePlatformAccess>
          </ProtectedRoute>
        } />
        <Route path="/intelligence-test" element={
          <ProtectedRoute>
            <RequirePlatformAccess source="career_assessments">
              <IntelligenceTest />
            </RequirePlatformAccess>
          </ProtectedRoute>
        } />
        <Route path="/independent-test-report" element={
          <ProtectedRoute>
            <RequirePlatformAccess source="career_assessments">
              <IndependentTestReport />
            </RequirePlatformAccess>
          </ProtectedRoute>
        } />
        <Route path="/saved-personality-test" element={
          <ProtectedRoute>
            <RequirePlatformAccess source="career_assessments">
              <SavedPersonalityTest />
            </RequirePlatformAccess>
          </ProtectedRoute>
        } />
        <Route path="/saved-aptitude-test" element={
          <ProtectedRoute>
            <RequirePlatformAccess source="career_assessments">
              <SavedAptitudeTest />
            </RequirePlatformAccess>
          </ProtectedRoute>
        } />
        <Route path="/saved-intelligence-test" element={
          <ProtectedRoute>
            <RequirePlatformAccess source="career_assessments">
              <SavedIntelligenceTest />
            </RequirePlatformAccess>
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={

          <Layout>
            <Dashboard />
          </Layout>

        } />
        <Route path="/upskilling" element={
          <ProtectedRoute>
            <RequirePlatformAccess source="upskilling">
              <Layout>
                <Upskilling />
              </Layout>
            </RequirePlatformAccess>
          </ProtectedRoute>
        } />
        <Route path="/assistant-chat" element={
          <ProtectedRoute>
            <RequirePlatformAccess source="sanskriti">
              <Layout>
                <SanskritiChat />
              </Layout>
            </RequirePlatformAccess>
          </ProtectedRoute>
        } />
        <Route path="/assessments" element={
          <ProtectedRoute>
            <RequirePlatformAccess source="career_assessments">
              <Layout>
                <Assessments />
              </Layout>
            </RequirePlatformAccess>
          </ProtectedRoute>
        } />
        <Route path="/resources" element={
          <ProtectedRoute>
            <RequirePlatformAccess source="career_assessments">
              <Layout>
                <Resources />
              </Layout>
            </RequirePlatformAccess>
          </ProtectedRoute>
        } />
        <Route path="/mentors" element={
          <ProtectedRoute>
            <RequirePlatformAccess source="career_assessments">
              <Layout>
                <Mentors />
              </Layout>
            </RequirePlatformAccess>
          </ProtectedRoute>
        } />
        <Route path="/school-assessment" element={
          <ProtectedRoute>
            <SchoolAssessment />
          </ProtectedRoute>
        } />
        <Route path="/college-assessment" element={
          <ProtectedRoute>
            <CollegeAssessment />
          </ProtectedRoute>
        } />
        <Route path="/generate-report" element={
        
            <GenerateReport />
         
        } />
        <Route path="/school-generate-report" element={
          <ProtectedRoute>
            <GenerateSchoolReport />
          </ProtectedRoute>
        } />
        <Route path="/career-report" element={
          <ProtectedRoute>
            <RequirePlatformAccess source="career_assessments">
              <CareerReport />
            </RequirePlatformAccess>
          </ProtectedRoute>
        } />
        <Route path="/school-career-report" element={
          <ProtectedRoute>
            <RequirePlatformAccess source="career_assessments">
              <SchoolCareerReport />
            </RequirePlatformAccess>
          </ProtectedRoute>
        } />
        <Route path="/future-me" element={
          <ProtectedRoute>
            <Layout>
              <FutureMeStepper />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/future-me-card" element={
          <ProtectedRoute>
            <Layout>
              <FutureMeCard />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
        <Route path="/admin-prepaid" element={<AdminPrepaid />} />
        <Route path="/x9mk2pl7qr4n" element={<X9mK2pL7qR4n />} />
        <Route path="/y8nL3kP6qW5m" element={<Y8nL3kP6qW5m />} />
      </Routes>
  );
}

// Main App component with BrowserRouter
function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;