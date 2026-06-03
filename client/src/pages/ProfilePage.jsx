import React, { useState, useEffect } from 'react';
import {
  User,
  Award,
  BookOpen,
  Target,
  TrendingUp,
  Calendar,
  Phone,
  Mail,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  Briefcase,
  GraduationCap,
  FileText,
  Brain,
} from 'lucide-react';
import { apiFetch, apiAxios } from '../api/index';
import { useLocation, useNavigate } from 'react-router-dom';
import SavedAptitudeTest from './SavedAptitudeTest';
import SavedIntelligenceTest from './SavedIntelligenceTest';
import SavedPersonalityTest from './SavedPersonalityTest';
import CareerReport from './CareerReport';
import SchoolCareerReport from './SchoolCareerReport';

// Add this at the top of the ProfilePage component, after useState declarations
const SOCIAL_PLATFORMS = [
  { name: 'LinkedIn', icon: <svg className='w-5 h-5 text-blue-500' fill='currentColor' viewBox='0 0 24 24'><path d='M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.29c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm15.5 10.29h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.89v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z'/></svg> },
  { name: 'GitHub', icon: <svg className='w-5 h-5 text-gray-300' fill='currentColor' viewBox='0 0 24 24'><path d='M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.3-1.7-1.7-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.73 1.27 3.4.97.11-.75.41-1.27.74-1.56-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .98-.31 3.2 1.18a11.1 11.1 0 012.92-.39c.99.01 1.99.13 2.92.39 2.22-1.49 3.2-1.18 3.2-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.41-5.27 5.7.42.36.79 1.09.79 2.2 0 1.59-.01 2.87-.01 3.26 0 .31.21.68.8.56C20.71 21.39 24 17.08 24 12c0-6.27-5.23-11.5-12-11.5z'/></svg> },
  { name: 'Twitter', icon: <svg className='w-5 h-5 text-sky-400' fill='currentColor' viewBox='0 0 24 24'><path d='M24 4.56c-.89.39-1.85.65-2.86.77a4.93 4.93 0 002.16-2.72c-.95.56-2 .97-3.13 1.19a4.92 4.92 0 00-8.39 4.48A13.97 13.97 0 013.15 3.15a4.92 4.92 0 001.52 6.57c-.8-.02-1.56-.25-2.22-.62v.06a4.93 4.93 0 003.95 4.83c-.39.11-.8.17-1.22.17-.3 0-.58-.03-.86-.08a4.93 4.93 0 004.6 3.42A9.87 9.87 0 012 19.54a13.94 13.94 0 007.56 2.22c9.05 0 14-7.5 14-14 0-.21 0-.42-.02-.63A9.93 9.93 0 0024 4.56z'/></svg> },
  { name: 'Facebook', icon: <svg className='w-5 h-5 text-blue-600' fill='currentColor' viewBox='0 0 24 24'><path d='M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.405 24 24 23.408 24 22.674V1.326C24 .592 23.405 0 22.675 0'/></svg> },
  { name: 'Instagram', icon: <svg className='w-5 h-5 text-pink-400' fill='currentColor' viewBox='0 0 24 24'><path d='M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.974 2.241-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.771.131 4.659.425 3.678 1.406c-.98.98-1.274 2.092-1.334 3.374C2.013 8.332 2 8.741 2 12c0 3.259.013 3.668.072 4.948.06 1.282.354 2.394 1.334 3.374.98.98 2.092 1.274 3.374 1.334C8.332 23.987 8.741 24 12 24s3.668-.013 4.948-.072c1.282-.06 2.394-.354 3.374-1.334.98-.98 1.274-2.092 1.334-3.374.059-1.28.072-1.689.072-4.948 0-3.259-.013-3.668-.072-4.948-.06-1.282-.354-2.394-1.334-3.374-.98-.98-2.092-1.274-3.374-1.334C15.668.013 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a3.999 3.999 0 110-7.998 3.999 3.999 0 010 7.998zm6.406-11.845a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z'/></svg> },
];

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [editingAbout, setEditingAbout] = useState(false);
  const [aboutDraft, setAboutDraft] = useState('');
  const [editingProfilePic, setEditingProfilePic] = useState(false);
  const [profilePicDraft, setProfilePicDraft] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [editingSocialLinks, setEditingSocialLinks] = useState(false);
  const [socialLinksDraft, setSocialLinksDraft] = useState([]);
  const [editingFutureRole, setEditingFutureRole] = useState(false);
  const [futureRoleDraft, setFutureRoleDraft] = useState('');
  const [editingExperience, setEditingExperience] = useState(false);
  const [experienceDraft, setExperienceDraft] = useState([]);
  const fileInputRef = React.useRef(null);
  const [addPlatform, setAddPlatform] = useState('');
  const [addUrl, setAddUrl] = useState('');
  const [personalityData, setPersonalityData] = useState(null);
  const [aptitudeData, setAptitudeData] = useState(null);
  const [intelligenceData, setIntelligenceData] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedReport, setExpandedReport] = useState(null);
  const [careerReportAvailable, setCareerReportAvailable] = useState(false);
  const [aptitudeReportAvailable, setAptitudeReportAvailable] = useState(false);
  const [personalityReportAvailable, setPersonalityReportAvailable] = useState(false);
  const [intelligenceReportAvailable, setIntelligenceReportAvailable] = useState(false);
  const [careerReportSummary, setCareerReportSummary] = useState(null);
  const [careerReportType, setCareerReportType] = useState(null); // 'school' | 'college'
  const [aptitudeReportSummary, setAptitudeReportSummary] = useState(null);
  const [personalityReportSummary, setPersonalityReportSummary] = useState(null);
  const [intelligenceReportSummary, setIntelligenceReportSummary] = useState(null);
  const [modalReport, setModalReport] = useState(null);

  // Auto-detect platform from URL
  useEffect(() => {
    if (!addUrl) return;
    const url = addUrl.toLowerCase();
    const found = SOCIAL_PLATFORMS.find(p => url.includes(p.name.toLowerCase()));
    if (found && (!addPlatform || addPlatform.toLowerCase() === found.name.toLowerCase())) {
      setAddPlatform(found.name);
    }
  }, [addUrl]);

  // Get personality data from localStorage
  useEffect(() => {
    const personalityScores = localStorage.getItem('personalityScores');
    const personalityType = localStorage.getItem('personalityType');
    const testCompleted = localStorage.getItem('personalityTestCompleted');
    
    if (personalityScores && testCompleted === 'true') {
      setPersonalityData({
        scores: JSON.parse(personalityScores),
        type: personalityType
      });
    }
  }, []);

  // Get aptitude data from localStorage
  useEffect(() => {
    const savedAptitudeTest = localStorage.getItem('v2_aptitudeTest');
    if (savedAptitudeTest) {
      try {
        const aptitudeTestData = JSON.parse(savedAptitudeTest);
        if (aptitudeTestData.scores) {
          setAptitudeData(aptitudeTestData.scores);
        }
      } catch (error) {
        console.error('Error parsing aptitude test data:', error);
      }
    }
  }, []);

  // Get intelligence data from localStorage
  useEffect(() => {
    const savedIntelligenceTest = localStorage.getItem('v2_intelligenceTest');
    if (savedIntelligenceTest) {
      try {
        const intelligenceTestData = JSON.parse(savedIntelligenceTest);
        if (intelligenceTestData.scores) {
          setIntelligenceData(intelligenceTestData.scores);
        }
      } catch (error) {
        console.error('Error parsing intelligence test data:', error);
      }
    }
  }, []);

  const panelClasses =
    "relative rounded-xl border border-white/[0.06] bg-[#0e0e10] p-4 sm:p-6 lg:p-7 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset]";

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      await handleImageFile(file);
    }
  };

  const handleImageFile = async (file) => {
    setUploadError('');
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size should be less than 5MB');
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = ev => setProfilePicDraft(ev.target.result);
      reader.readAsDataURL(file);
    } catch (err) {
      setUploadError('Failed to read image file');
    }
  };

  const handleSaveProfilePic = async () => {
    if (!profilePicDraft) return;
    setIsUploading(true);
    setUploadError('');
    try {
      const res = await apiAxios('/api/user/profile', {
        method: 'PUT',
        data: { profilePic: profilePicDraft }
      });
      // If the request succeeds, update state
      setProfile(prev => ({ ...prev, profilePic: profilePicDraft }));
      setEditingProfilePic(false);
      setProfilePicDraft(profilePicDraft);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      setUploadError('Failed to update profile picture. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Social Links Management
  const handleAddSocialLink = () => {
    if (socialLinksDraft.length < 5) {
      setSocialLinksDraft([...socialLinksDraft, { platform: '', url: '' }]);
    }
  };

  const handleRemoveSocialLink = (index) => {
    setSocialLinksDraft(socialLinksDraft.filter((_, i) => i !== index));
  };

  const handleUpdateSocialLink = (index, field, value) => {
    const updated = [...socialLinksDraft];
    updated[index] = { ...updated[index], [field]: value };
    setSocialLinksDraft(updated);
  };

  const handleSaveSocialLinks = async () => {
    try {
      const res = await apiAxios('/api/user/profile', {
        method: 'PUT',
        data: { socialLinks: socialLinksDraft }
      });
      if (!res.ok) throw new Error('Failed to update social links');
      setProfile(prev => ({ ...prev, socialLinks: socialLinksDraft }));
      setEditingSocialLinks(false);
    } catch (err) {
      alert('Failed to update social links. Please try again.');
    }
  };

  // Future Role Management
  const handleSaveFutureRole = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const res = await apiFetch('/api/futureme/role', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ futureRole: futureRoleDraft })
      });
      if (!res.ok) throw new Error('Failed to update future role');
      setProfile(prev => ({
        ...prev,
        futureMeCard: { ...prev.futureMeCard, futureRole: futureRoleDraft }
      }));
      setEditingFutureRole(false);
    } catch (err) {
      alert('Failed to update future role. Please try again.');
    }
  };

  // Experience Management
  const handleAddExperience = () => {
    if (experienceDraft.length < 3) {
      setExperienceDraft([...experienceDraft, {
        title: '',
        company: '',
        description: '',
        startDate: '',
        endDate: '',
        current: false
      }]);
    }
  };

  const handleRemoveExperience = (index) => {
    setExperienceDraft(experienceDraft.filter((_, i) => i !== index));
  };

  const handleUpdateExperience = (index, field, value) => {
    const updated = [...experienceDraft];
    updated[index] = { ...updated[index], [field]: value };
    setExperienceDraft(updated);
  };

  const handleSaveExperience = async () => {
    try {
      await apiAxios('/api/user/profile', {
        method: 'PUT',
        data: { experience: experienceDraft }
      });
      setProfile(prev => ({ ...prev, experience: experienceDraft }));
      setEditingExperience(false);
    } catch (err) {
      alert('Failed to update experience. Please try again.');
    }
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Fetch user profile with populated onboarding and futureMeCard
        const userResponse = await apiAxios('/api/user/profile', {
          method: 'GET'
        });
        
        const userData = userResponse.data;

        // Combine all data
        const profileData = {
          ...userData
        };

        setProfile(profileData);
        if (profileData.about) setAboutDraft(profileData.about);
        if (profileData.profilePic !== undefined) setProfilePicDraft(profileData.profilePic);
        if (profileData.socialLinks) setSocialLinksDraft([...profileData.socialLinks]);
        if (profileData.experience) setExperienceDraft([...profileData.experience]);
        if (profileData.futureMeCard?.futureRole) setFutureRoleDraft(profileData.futureMeCard.futureRole);

      } catch (err) {
        setError(`Failed to fetch profile data: ${err.message}`);
        console.error('Profile fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  // Helper to detect platform from URL
  const detectPlatform = (url) => {
    if (!url) return null;
    const lower = url.toLowerCase();
    const found = SOCIAL_PLATFORMS.find(p => lower.includes(p.name.toLowerCase()));
    return found ? found.name : null;
  };

  const handleExpandReport = (type) => {
    setExpandedReport(expandedReport === type ? null : type);
  };

  // Add useEffect to check for report availability and summaries:
  useEffect(() => {
    // Career Report — prefer the new School Edition if it exists, otherwise fall back to the College Edition.
    try {
      const schoolRaw = localStorage.getItem('schoolCareerReport');
      const collegeRaw = localStorage.getItem('careerReport');

      let schoolPayload = null;
      let collegePayload = null;
      try { schoolPayload = schoolRaw ? JSON.parse(schoolRaw) : null; } catch (e) { /* ignore parse error */ }
      try { collegePayload = collegeRaw ? JSON.parse(collegeRaw) : null; } catch (e) { /* ignore parse error */ }

      const schoolHasContent = !!(schoolPayload && (schoolPayload.data || schoolPayload.report));
      const collegeHasContent = !!(collegePayload && (collegePayload.report || collegePayload.data));

      if (schoolHasContent) {
        setCareerReportAvailable(true);
        setCareerReportType('school');
        setCareerReportSummary({
          date: schoolPayload.timestamp ? new Date(schoolPayload.timestamp).toLocaleDateString() : '',
          edition: 'School Edition',
        });
      } else if (collegeHasContent) {
        setCareerReportAvailable(true);
        setCareerReportType('college');
        setCareerReportSummary({
          date: collegePayload.timestamp ? new Date(collegePayload.timestamp).toLocaleDateString() : '',
          edition: 'College Edition',
        });
      }
    } catch {}
    // Aptitude
    try {
      const data = JSON.parse(localStorage.getItem('v2_aptitudeTest'));
      if (data && data.scores) {
        setAptitudeReportAvailable(true);
        setAptitudeReportSummary({ score: data.scores.score, total: data.scores.total, date: data.timestamp ? new Date(data.timestamp).toLocaleDateString() : '', });
      }
    } catch {}
    // Personality
    try {
      const scores = localStorage.getItem('personalityScores');
      const completed = localStorage.getItem('personalityTestCompleted');
      if (scores && completed === 'true') {
        setPersonalityReportAvailable(true);
        setPersonalityReportSummary({ date: '', });
      }
    } catch {}
    // Intelligence
    try {
      const data = JSON.parse(localStorage.getItem('v2_intelligenceTest'));
      if (data && data.scores) {
        setIntelligenceReportAvailable(true);
        setIntelligenceReportSummary({ date: data.timestamp ? new Date(data.timestamp).toLocaleDateString() : '', });
      }
    } catch {}
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-600/20 border border-red-600/30 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-400 mb-2">Error Loading Profile</h2>
            <p className="text-gray-300">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="bg-yellow-600/20 border border-yellow-600/30 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-yellow-400 mb-2">No Profile Data</h2>
            <p className="text-gray-300">Unable to load profile information.</p>
          </div>
        </div>
      </div>
    );
  }

  // Extract data from the fetched profile
  const onboardingData = profile.onboarding || {};
  const futureMeCardData = profile.futureMeCard || {};
  const purchaseData = profile.purchases || [];

  // Calculate profile completion based on actual schema fields
  const calculateProfileCompletion = (profile) => {
    let completedFields = 0;
    const totalFields = 15; // Adjusted total fields after removing sections

    // User schema fields
    if (profile.name) completedFields++;
    if (profile.email) completedFields++;
    if (profile.about) completedFields++;
    if (profile.age) completedFields++;
    if (profile.gender) completedFields++;
    if (profile.phone) completedFields++;
    
    // User profile activity fields
    if (profile.socialLinks?.length > 0) completedFields++;
    if (profile.personalityType) completedFields++;
    if (profile.onboardingComplete) completedFields++;
    
    // Onboarding fields
    if (onboardingData.phoneNumber) completedFields++;
    if (onboardingData.studentType) completedFields++;
    if (onboardingData.joiningReason) completedFields++;
    if (onboardingData.motivation) completedFields++;
    
    // Student type specific fields
    if (onboardingData.studentType === 'school') {
      if (onboardingData.schoolClass) completedFields++;
      if (onboardingData.strongestAreas?.length > 0) completedFields++;
      if (onboardingData.futureExcitement) completedFields++;
    } else if (onboardingData.studentType === 'college') {
      if (onboardingData.collegeDegree) completedFields++;
      if (onboardingData.strengths?.length > 0) completedFields++;
      if (onboardingData.lifestyle) completedFields++;
    }

    return Math.round((completedFields / totalFields) * 100);
  };

  const profileCompletionPercentage = calculateProfileCompletion(profile);

  // Helper Components
  const ProgressBar = ({ progress, className = "" }) => (
    <div className={`w-full bg-gray-700/50 rounded-full h-2.5 ${className}`}>
      <div
        className="h-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );

  const StatCard = ({ icon: Icon, label, value, color = "cyan" }) => (
    <div className="bg-gray-800/40 p-4 rounded-lg border border-gray-700/50">
      <div className="flex items-center mb-2">
        <Icon className={`h-5 w-5 text-${color}-400 mr-2`} />
        <span className="text-gray-400 text-sm">{label}</span>
      </div>
      <p className="text-white text-lg font-semibold">{value}</p>
    </div>
  );

  // Get education details based on schema
  const getEducationDetails = () => {
    if (onboardingData.studentType === 'college') {
      const degree = onboardingData.collegeDegree || 'Degree';
      const year = onboardingData.collegeYear || '';
      return {
        level: 'College',
        details: year ? `${degree} - ${year} Year` : degree,
        specialization: onboardingData.otherDegree || ''
      };
    } else if (onboardingData.studentType === 'school') {
      const schoolClass = onboardingData.schoolClass || '';
      const stream = onboardingData.schoolStream || '';
      return {
        level: 'School',
        details: stream ? `Class ${schoolClass} - ${stream}` : `Class ${schoolClass}`,
        specialization: ''
      };
    }
    return { level: '', details: 'Student', specialization: '' };
  };

  const education = getEducationDetails();

  // Get active subscriptions based on Purchase schema
  const activeSubscriptions = purchaseData.filter(purchase => {
    return purchase.status === 'completed' && new Date(purchase.expiresAt) > new Date();
  });

  // Handle navigation back to dashboard
  const handleBackToDashboard = () => {
    // In a real app, this would use React Router
    window.history.back();
  };

  const ReportCard = ({
    title,
    description,
    icon: Icon,
    accent,
    summary,
    isAvailable,
    onView,
    ctaLabel,
    onCta,
  }) => {
    const accentColor = {
      blue: 'text-blue-400',
      orange: 'text-orange-400',
      emerald: 'text-emerald-400',
      pink: 'text-pink-400',
    }[accent || 'blue'];

    return (
      <div className="group relative rounded-xl border border-white/[0.06] bg-[#0e0e10] p-5 sm:p-6 transition-colors hover:border-white/[0.12]">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
            <Icon className={`w-5 h-5 ${accentColor}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 flex-wrap mb-1">
              <h3 className="text-[15px] font-semibold text-white leading-tight">
                {title}
              </h3>
              {isAvailable ? (
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[11px] font-medium text-emerald-400">
                  <span className="w-1 h-1 rounded-full bg-emerald-400" />
                  Ready
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-md bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 text-[11px] font-medium text-gray-500">
                  <Clock className="w-3 h-3" />
                  Not taken
                </span>
              )}
            </div>
            {description && (
              <p className="text-gray-400 text-[13px] leading-relaxed mb-4">
                {description}
              </p>
            )}

            {isAvailable && summary && (summary.date || summary.edition || summary.score !== undefined) && (
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-4 text-[12px] text-gray-500">
                {summary.edition && (
                  <span className="inline-flex items-center gap-1.5 text-gray-300">
                    <span className="w-1 h-1 rounded-full bg-gray-500" />
                    {summary.edition}
                  </span>
                )}
                {summary.date && (
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="w-3 h-3" />
                    {summary.date}
                  </span>
                )}
                {summary.score !== undefined && summary.total !== undefined && (
                  <span>
                    Score: <span className="text-gray-300">{summary.score}/{summary.total}</span>
                  </span>
                )}
              </div>
            )}

            <div>
              {isAvailable ? (
                <button
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-white hover:text-gray-200 transition-colors"
                  onClick={onView}
                >
                  View report
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              ) : (
                <button
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-white transition-colors"
                  onClick={onCta}
                >
                  {ctaLabel}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-6xl mx-auto">
        {/* Header bar */}
        <div className="flex justify-between items-center mb-6 sm:mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-gray-500 mb-1.5">
              Account
            </p>
            <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
              Profile
            </h1>
          </div>
          <button
            onClick={handleBackToDashboard}
            className="inline-flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] px-3.5 py-2 text-sm font-medium text-gray-200 hover:text-white transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
            </svg>
            Dashboard
          </button>
        </div>

      {/* Profile Header */}
      <div className={`${panelClasses} mb-6`}>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="relative">
            {editingProfilePic ? (
              <div className="w-full max-w-md mx-auto">
                {/* Preview Section */}
                <div className="mb-4 relative">
                  <img
                    src={profilePicDraft || profile.profilePic || 'https://via.placeholder.com/120'}
                    alt="Profile Preview"
                    className="w-32 h-32 rounded-full mx-auto border-4 border-gray-700 shadow-lg object-cover"
                  />
                  {profilePicDraft && (
                    <button
                      aria-label="Remove selected image"
                      onClick={() => {
                        setProfilePicDraft('');
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="absolute top-0 right-1/2 translate-x-16 -translate-y-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
                      title="Remove image"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Upload Section */}
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center mb-4 transition-colors ${
                    isDragging
                      ? 'border-cyan-500 bg-cyan-500/10'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                  onDragEnter={handleDragEnter}
                  onDragOver={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="space-y-2">
                    <svg
                      className={`w-10 h-10 mx-auto mb-2 transition-colors ${
                        isDragging ? 'text-cyan-500' : 'text-gray-400'
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-gray-300">Drag and drop your image here, or</p>
                    <button
                      aria-label="Browse to choose a file"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-cyan-400 hover:text-cyan-300 font-medium"
                    >
                      Browse to choose a file
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) handleImageFile(file);
                      }}
                    />
                    <p className="text-gray-400 text-sm">
                      Supported formats: JPG, PNG, GIF (max 5MB)
                    </p>
                  </div>
                </div>

                {/* Error Message */}
                {uploadError && (
                  <div className="mb-4 text-red-400 text-sm text-center">
                    {uploadError}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-center space-x-3">
                  <button
                    aria-label="Save profile picture"
                    className={`px-4 py-2 rounded-md font-semibold transition-all duration-200 ${
                      isUploading || !profilePicDraft
                        ? 'bg-cyan-600/50 cursor-not-allowed'
                        : 'bg-cyan-600 hover:bg-cyan-700'
                    } text-white min-w-[80px]`}
                    onClick={handleSaveProfilePic}
                    disabled={isUploading || !profilePicDraft}
                  >
                    {isUploading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      </div>
                    ) : (
                      'Save'
                    )}
                  </button>
                  <button
                    aria-label="Cancel profile picture editing"
                    className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md font-medium transition-colors"
                    onClick={() => {
                      setProfilePicDraft(profile.profilePic || '');
                      setEditingProfilePic(false);
                      setUploadError('');
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="relative p-[2px] rounded-full bg-white/[0.08]">
                  <img
                    src={profile.profilePic || 'https://via.placeholder.com/120'}
                    alt="Profile"
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover"
                  />
                </div>
                <button
                  className="absolute bottom-1 right-1 bg-white/10 hover:bg-white/15 backdrop-blur border border-white/[0.08] text-white text-[11px] px-2.5 py-0.5 rounded-full font-medium transition"
                  onClick={() => setEditingProfilePic(true)}
                >
                  Edit
                </button>
              </>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                {profile.name || 'User'}
              </h2>
              <span className="inline-flex items-center gap-1.5 rounded-md bg-white/[0.04] border border-white/[0.08] px-2 py-0.5 text-[11px] font-medium text-gray-300">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                {profileCompletionPercentage}% complete
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              {education.details}
            </p>

            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-400 mb-4">
              {profile.age && (
                <span className="inline-flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-gray-500" /> {profile.age} years
                </span>
              )}
              {profile.gender && (
                <span className="inline-flex items-center gap-1.5 capitalize">
                  <span className="w-1 h-1 rounded-full bg-gray-600" />
                  {profile.gender}
                </span>
              )}
              {onboardingData.phoneNumber && (
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-gray-500" /> {onboardingData.phoneNumber}
                </span>
              )}
              {profile.email && (
                <span className="inline-flex items-center gap-1.5 max-w-full truncate">
                  <Mail className="h-3.5 w-3.5 text-gray-500" /> {profile.email}
                </span>
              )}
            </div>

            {/* Profile completion progress bar */}
            <div className="max-w-md">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] uppercase tracking-wider text-gray-500 font-medium">
                  Profile completion
                </span>
                <span className="text-[11px] text-gray-400 font-medium">
                  {profileCompletionPercentage}%
                </span>
              </div>
              <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  className="h-full bg-white/40 rounded-full transition-all duration-500"
                  style={{ width: `${profileCompletionPercentage}%` }}
                />
              </div>
            </div>

            {futureMeCardData.tagline && (
              <p className="text-gray-300 italic text-sm mt-4 max-w-2xl">
                "{futureMeCardData.tagline}"
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-6 border-b border-white/[0.06]">
        <div className="flex overflow-x-auto whitespace-nowrap gap-1 -mb-px">
          {[
            { id: 'overview', label: 'Overview', icon: User },
            { id: 'preferences', label: 'Preferences', icon: Target },
            { id: 'career', label: 'Career', icon: Briefcase },
            { id: 'experience', label: 'Experience', icon: GraduationCap },
            { id: 'reports', label: 'Reports', icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative inline-flex items-center gap-2 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                  isActive
                    ? 'border-white text-white'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          {/* About Me Section - Top left */}
          <div className={panelClasses}>
            <h3 className="text-xl font-semibold mb-4 text-white">About Me</h3>
            {editingAbout ? (
              <>
                <textarea
                  className="w-full bg-gray-800/40 border border-gray-700 rounded-lg p-3 text-white mb-2"
                  rows={4}
                  value={aboutDraft}
                  onChange={e => setAboutDraft(e.target.value)}
                  placeholder="Write something about yourself..."
                />
                <div className="flex gap-2">
                  <button
                    className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-md font-semibold"
                    onClick={async () => {
                      try {
                        const res = await apiAxios('/api/user/profile', {
                          method: 'PUT',
                          data: { about: aboutDraft }
                        });
                        const data = res.data;
                        setProfile(prev => ({ ...prev, about: aboutDraft }));
                        setEditingAbout(false);
                      } catch (err) {
                        alert('Failed to update About Me.');
                      }
                    }}
                  >
                    Save
                  </button>
                  <button
                    className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                    onClick={() => {
                      setAboutDraft(profile.about || '');
                      setEditingAbout(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-start justify-between gap-2">
                <p className="text-gray-300 mb-4 flex-1">
              {profile.about || 'Add a description about yourself to let others know more about you.'}
            </p>
                <button
                  className="ml-2 bg-cyan-700 hover:bg-cyan-800 text-white px-3 py-1 rounded-md text-xs font-semibold h-fit"
                  onClick={() => setEditingAbout(true)}
                >
                  {profile.about ? 'Edit' : 'Add'}
                </button>
              </div>
            )}
            
            {futureMeCardData.mindset && (
              <>
                <h4 className="font-semibold text-lg mb-2 text-white">Mindset</h4>
                <p className="text-gray-300 mb-4">{futureMeCardData.mindset}</p>
              </>
            )}

            {onboardingData.motivation && (
              <>
                <h4 className="font-semibold text-lg mb-2 text-white">Motivation</h4>
                <p className="text-gray-300 mb-4">{onboardingData.motivation}</p>
              </>
            )}

            {onboardingData.futureExcitement && (
              <>
                <h4 className="font-semibold text-lg mb-2 text-white">What Excites Me About the Future</h4>
                <p className="text-gray-300 mb-4">{onboardingData.futureExcitement}</p>
              </>
            )}

            {onboardingData.joiningReason && (
              <>
                <h4 className="font-semibold text-lg mb-2 text-white">Why I Joined</h4>
                <p className="text-gray-300 mb-2">{onboardingData.joiningReason}</p>
                {onboardingData.otherReason && (
                  <p className="text-gray-400 text-sm mb-4 italic">Additional reason: {onboardingData.otherReason}</p>
                )}
              </>
            )}

            {/* Social Links Section */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-lg text-white">Social Links</h4>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {profile.socialLinks && profile.socialLinks.length > 0 ? (
                  profile.socialLinks.map((link, idx) => {
                    const platformName = link.platform || detectPlatform(link.url);
                    const platformOption = SOCIAL_PLATFORMS.find(p => p.name === platformName);
                    const icon = platformOption ? platformOption.icon : null;
                    return (
                      <span key={idx} className="inline-flex items-center bg-gray-800 text-white rounded-full px-3 py-1 text-sm font-medium shadow-sm">
                        {icon && <span className="mr-1">{icon}</span>}
                        {platformName ? (
                          <>
                            {platformName}
                            <span className="mx-1 text-gray-400">|</span>
                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline max-w-[120px] truncate">{link.url}</a>
                          </>
                        ) : (
                          <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline max-w-[160px] truncate">{link.url}</a>
                        )}
                        <button
                          onClick={async () => {
                            const updated = profile.socialLinks.filter((_, i) => i !== idx);
                            setProfile(prev => ({ ...prev, socialLinks: updated }));
                            await apiAxios('/api/user/profile', {
                              method: 'PUT',
                              data: { socialLinks: updated }
                            });
                          }}
                          className="ml-2 text-gray-400 hover:text-red-500 focus:outline-none"
                          title="Remove"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </span>
                    );
                  })
                ) : (
                  <span className="text-gray-400 text-sm">No social links added yet</span>
                )}
              </div>
              <div className="border-t border-gray-800 my-3"></div>
              <form
                className="flex flex-col sm:flex-row items-center gap-2"
                onSubmit={async e => {
                  e.preventDefault();
                  if (!/^https?:\/\//.test(addUrl)) return;
                  const platform = detectPlatform(addUrl);
                  const newLink = platform ? { url: addUrl, platform } : { url: addUrl };
                  const newLinks = [...(profile.socialLinks || []), newLink];
                  setProfile(prev => ({ ...prev, socialLinks: newLinks }));
                  setAddUrl('');
                  await apiAxios('/api/user/profile', {
                    method: 'PUT',
                    data: { socialLinks: newLinks }
                  });
                }}
              >
                <input
                  type="url"
                  placeholder="Paste your profile URL (e.g. https://linkedin.com/in/...)"
                  value={addUrl}
                  onChange={e => setAddUrl(e.target.value)}
                  className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                />
                <button
                  type="submit"
                  className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded font-semibold disabled:opacity-60"
                  disabled={!/^https?:\/\//.test(addUrl)}
                >
                  Add
                </button>
              </form>
              {addUrl && !/^https?:\/\//.test(addUrl) && (
                <div className="text-xs text-red-400 mt-1 ml-1">Enter a valid URL (must start with http:// or https://)</div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'preferences' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Student Profile & Preferences */}
          <div className={panelClasses}>
            <h3 className="text-xl font-semibold mb-4 text-white">Student Profile & Preferences</h3>
            
            <div className="space-y-4">
              {/* Basic Student Information */}
              <div className="bg-gray-800/30 p-4 rounded-lg">
                <h4 className="font-semibold text-white mb-3">Basic Information</h4>
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Student Type:</span>
                    <span className="text-gray-300 capitalize">{onboardingData.studentType || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Phone Number:</span>
                    <span className="text-gray-300">{onboardingData.phoneNumber || 'Not provided'}</span>
                  </div>
                  
                  {/* School specific basic info */}
                  {onboardingData.studentType === 'school' && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Class:</span>
                        <span className="text-gray-300">{onboardingData.schoolClass || 'Not specified'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Stream:</span>
                        <span className="text-gray-300">{onboardingData.schoolStream || 'Not specified'}</span>
                      </div>
                    </>
                  )}
                  
                  {/* College specific basic info */}
                  {onboardingData.studentType === 'college' && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Degree:</span>
                        <span className="text-gray-300">{onboardingData.collegeDegree || 'Not specified'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Year:</span>
                        <span className="text-gray-300">{onboardingData.collegeYear || 'Not specified'}</span>
                      </div>
                      {onboardingData.otherDegree && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Additional Degree:</span>
                          <span className="text-gray-300">{onboardingData.otherDegree}</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* School Student Specific Data */}
              {onboardingData.studentType === 'school' && (
                <>
                  <div className="bg-gray-800/30 p-4 rounded-lg">
                    <h4 className="font-semibold text-white mb-3">Academic Strengths</h4>
                    {onboardingData.strongestAreas && onboardingData.strongestAreas.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {onboardingData.strongestAreas.map((area, index) => (
                          <span
                            key={index}
                            className="bg-green-600/30 text-green-300 px-3 py-1 rounded-full text-sm font-medium"
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm">No academic strengths specified yet</p>
                    )}
                  </div>

                  <div className="bg-gray-800/30 p-4 rounded-lg">
                    <h4 className="font-semibold text-white mb-3">Preferred Learning Formats</h4>
                    {onboardingData.learningFormats && onboardingData.learningFormats.length > 0 ? (
                      <div className="space-y-2">
                        {onboardingData.learningFormats.map((format, index) => (
                          <div key={index} className="flex items-center">
                            <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                            <span className="text-gray-300">{format}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm">No learning formats specified yet</p>
                    )}
                  </div>
                </>
              )}

              {/* College Student Specific Data */}
              {onboardingData.studentType === 'college' && (
                <>
                  <div className="bg-gray-800/30 p-4 rounded-lg">
                    <h4 className="font-semibold text-white mb-3">Personal Strengths</h4>
                    {onboardingData.strengths && onboardingData.strengths.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {onboardingData.strengths.map((strength, index) => (
                          <span
                            key={index}
                            className="bg-orange-600/30 text-orange-300 px-3 py-1 rounded-full text-sm font-medium"
                          >
                            {strength}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm">No personal strengths specified yet</p>
                    )}
                  </div>

                  <div className="bg-gray-800/30 p-4 rounded-lg">
                    <h4 className="font-semibold text-white mb-3">Learning Preferences</h4>
                    {onboardingData.learningPreference && onboardingData.learningPreference.length > 0 ? (
                      <div className="space-y-2">
                        {onboardingData.learningPreference.map((pref, index) => (
                          <div key={index} className="flex items-center">
                            <div className="w-2 h-2 bg-teal-400 rounded-full mr-3"></div>
                            <span className="text-gray-300">{pref}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm">No learning preferences specified yet</p>
                    )}
                  </div>

                  <div className="bg-gray-800/30 p-4 rounded-lg">
                    <h4 className="font-semibold text-white mb-2">Lifestyle Preference</h4>
                    <p className="text-gray-300">{onboardingData.lifestyle || 'No lifestyle preference specified yet'}</p>
                  </div>
                </>
              )}

            

              <div className="bg-gray-800/30 p-4 rounded-lg">
                <h4 className="font-semibold text-white mb-3">Industry Interests</h4>
                {onboardingData.industries && onboardingData.industries.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {onboardingData.industries.map((industry, index) => (
                      <span
                        key={index}
                        className="bg-blue-600/30 text-blue-300 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {industry}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">No industry interests specified yet</p>
                )}
              </div>
            </div>
          </div>

          {/* Motivations & Journey */}
          <div className={panelClasses}>
            <h3 className="text-xl font-semibold mb-4 text-white">Motivations & Journey</h3>
            
            <div className="space-y-4">
              {/* Joining Reason */}
              <div className="bg-gray-800/30 p-4 rounded-lg">
                <h4 className="font-semibold text-white mb-2 flex items-center">
                  <Target className="h-5 w-5 mr-2 text-cyan-400" />
                  Why I Joined
                </h4>
                {onboardingData.joiningReason ? (
                  <>
                    <p className="text-gray-300 mb-2">{onboardingData.joiningReason}</p>
                    {onboardingData.otherReason && (
                      <p className="text-gray-400 text-sm italic">Additional: {onboardingData.otherReason}</p>
                    )}
                  </>
                ) : (
                  <p className="text-gray-400 text-sm">No joining reason specified yet</p>
                )}
              </div>

              {/* Motivation */}
              <div className="bg-gray-800/30 p-4 rounded-lg">
                <h4 className="font-semibold text-white mb-2 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-400" />
                  My Motivation
                </h4>
                {onboardingData.motivation ? (
                  <p className="text-gray-300">{onboardingData.motivation}</p>
                ) : (
                  <p className="text-gray-400 text-sm">No motivation specified yet</p>
                )}
              </div>

              {/* Future Excitement - Only for school students */}
              {onboardingData.studentType === 'school' && (
                <div className="bg-gray-800/30 p-4 rounded-lg">
                  <h4 className="font-semibold text-white mb-2 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-purple-400" />
                    Future Excitement
                  </h4>
                  {onboardingData.futureExcitement ? (
                    <p className="text-gray-300">{onboardingData.futureExcitement}</p>
                  ) : (
                    <p className="text-gray-400 text-sm">No future excitement specified yet</p>
                  )}
                </div>
              )}

              {/* Onboarding Completion Status */}
              <div className="bg-gray-800/30 p-4 rounded-lg">
                <h4 className="font-semibold text-white mb-3">Onboarding Journey</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Onboarding Complete:</span>
                    <span className={`px-2 py-1 rounded text-sm ${
                      profile.onboardingComplete 
                        ? 'bg-green-600/30 text-green-300' 
                        : 'bg-yellow-600/30 text-yellow-300'
                    }`}>
                      {profile.onboardingComplete ? 'Complete' : 'In Progress'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Completed On:</span>
                    <span className="text-gray-300">
                      {onboardingData.completedAt 
                        ? new Date(onboardingData.completedAt).toLocaleDateString()
                        : 'Not completed'
                      }
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Member Since:</span>
                    <span className="text-gray-300">
                      {new Date(profile.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Student Type:</span>
                    <span className="text-gray-300 capitalize">{onboardingData.studentType || 'Not specified'}</span>
                  </div>
                </div>
              </div>

              {/* Profile Enhancement Tips - Dynamic based on missing data */}
              <div className="bg-blue-600/10 border border-blue-600/30 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-300 mb-2">Profile Enhancement Tips</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  {!profile.about && <li>• Add an "About Me" section to tell others about yourself</li>}
                  {!futureMeCardData.personalityType && <li>• Complete personality assessment for better recommendations</li>}
                  {(!profile.socialLinks || profile.socialLinks.length === 0) && <li>• Add social media links to connect with others</li>}
                  {!onboardingData.motivation && <li>• Share your motivation to inspire others</li>}
                  {!onboardingData.joiningReason && <li>• Tell us why you joined our platform</li>}
                  {onboardingData.studentType === 'school' && !onboardingData.futureExcitement && <li>• Share what excites you about the future</li>}
                  {onboardingData.studentType === 'school' && (!onboardingData.strongestAreas || onboardingData.strongestAreas.length === 0) && <li>• Add your strongest academic areas</li>}
                  {onboardingData.studentType === 'college' && !onboardingData.lifestyle && <li>• Add your lifestyle preferences</li>}
                  {onboardingData.studentType === 'college' && (!onboardingData.strengths || onboardingData.strengths.length === 0) && <li>• Add your personal strengths</li>}
                </ul>
              </div>

              {/* Data Summary */}
              <div className="bg-gray-700/30 p-4 rounded-lg">
                <h4 className="font-semibold text-white mb-3">Profile Data Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Fields Completed:</span>
                    <p className="text-gray-300">{profileCompletionPercentage}%</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Last Updated:</span>
                    <p className="text-gray-300">
                      {onboardingData.completedAt 
                        ? new Date(onboardingData.completedAt).toLocaleDateString()
                        : 'Not available'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'career' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Future Role & Personality */}
          <div className={panelClasses}>
            <h3 className="text-xl font-semibold mb-4 text-white">Career Profile</h3>
            {(!futureMeCardData || Object.keys(futureMeCardData).length === 0) ? (
              <div className="flex flex-col items-center justify-center h-full py-8">
                <p className="text-gray-400 mb-4 text-center">No career profile found. Generate your Future Me Card to see personalized career insights!</p>
                <button
                  className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-md font-semibold transition-colors"
                  onClick={async () => {
                    try {
                      const token = localStorage.getItem('authToken');
                      const res = await fetch('https://guidopia-server.vercel.app/api/futureme/generate', {
                        method: 'POST',
                        headers: {
                          'Authorization': `Bearer ${token}`,
                          'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(onboardingData)
                      });
                      
                      if (!res.ok) {
                        throw new Error('Failed to generate Future Me Card');
                      }
                      
                      const data = await res.json();
                      if (data.success && data.user) {
                        // Update the entire profile state with the new user data
                        setProfile(data.user);
                      } else {
                        throw new Error('Invalid response format');
                      }
                    } catch (err) {
                      console.error('Error:', err);
                      alert('Failed to generate Future Me Card. Please try again.');
                    }
                  }}
                >
                  Generate My Future Me Card
                </button>
              </div>
            ) : (
              <>
                {/* Editable Future Role */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-lg text-white">Future Target Role</h4>
                    <button
                      onClick={() => setEditingFutureRole(true)}
                      className="bg-cyan-700 hover:bg-cyan-800 text-white px-3 py-1 rounded-md text-xs font-semibold"
                    >
                      Edit
                    </button>
                  </div>
                  
                  {editingFutureRole ? (
                    <div className="bg-gray-800/30 p-4 rounded-lg">
                      <input
                        type="text"
                        value={futureRoleDraft}
                        onChange={(e) => setFutureRoleDraft(e.target.value)}
                        placeholder="Enter your future role..."
                        className="w-full bg-gray-700/50 border border-gray-600 rounded px-3 py-2 text-white mb-3"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveFutureRole}
                          className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded text-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setFutureRoleDraft(futureMeCardData.futureRole || '');
                            setEditingFutureRole(false);
                          }}
                          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-cyan-400 text-lg">{futureMeCardData.futureRole || 'No future role set'}</p>
                  )}
                </div>

                {futureMeCardData.personalityType && (
              <div className="mb-4">
                <h4 className="font-semibold text-lg mb-2 text-white">Personality Type</h4>
                    <p className="text-gray-300">{futureMeCardData.personalityType}</p>
              </div>
            )}
            {futureMeCardData.salary && (
              <div className="mb-4">
                <h4 className="font-semibold text-lg mb-2 text-white">Expected Salary</h4>
                <p className="text-green-400">{futureMeCardData.salary}</p>
              </div>
            )}
                {futureMeCardData.keySkills && futureMeCardData.keySkills.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold text-lg mb-2 text-white">Key Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {futureMeCardData.keySkills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-cyan-600/30 text-cyan-300 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
                {futureMeCardData.tags && futureMeCardData.tags.length > 0 && (
              <div>
                <h4 className="font-semibold text-lg mb-2 text-white">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {futureMeCardData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-purple-600/30 text-purple-300 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
                )}
                {futureMeCardData.tagline && (
                  <div className="mt-4">
                    <p className="text-cyan-400 italic">"{futureMeCardData.tagline}"</p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Recommendations */}
          <div className={panelClasses}>
            <h3 className="text-xl font-semibold mb-4 text-white">Recommendations</h3>
            {(!futureMeCardData || Object.keys(futureMeCardData).length === 0) ? (
              <p className="text-gray-400 text-center">No recommendations available. Generate your Future Me Card to get personalized suggestions!</p>
            ) : (
              <>
                {futureMeCardData.careerRecommendations && futureMeCardData.careerRecommendations.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold text-lg mb-2 text-white">Career Recommendations</h4>
                <ul className="space-y-2">
                      {futureMeCardData.careerRecommendations.map((rec, index) => (
                    <li key={index} className="text-gray-300 flex items-start">
                      <span className="text-green-400 mr-2">✓</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
                {futureMeCardData.skillRecommendations && futureMeCardData.skillRecommendations.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold text-lg mb-2 text-white">Skill Recommendations</h4>
                <ul className="space-y-2">
                      {futureMeCardData.skillRecommendations.map((rec, index) => (
                    <li key={index} className="text-gray-300 flex items-start">
                      <span className="text-blue-400 mr-2">→</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
                {futureMeCardData.mentors && futureMeCardData.mentors.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold text-lg mb-2 text-white">Recommended Mentors</h4>
                <ul className="space-y-1">
                  {futureMeCardData.mentors.map((mentor, index) => (
                    <li key={index} className="text-gray-300">{mentor}</li>
                  ))}
                </ul>
              </div>
            )}
            {futureMeCardData.cta && (
              <div className="bg-cyan-600/10 border border-cyan-600/30 p-4 rounded-lg">
                <h4 className="font-semibold text-cyan-300 mb-2">Call to Action</h4>
                <p className="text-gray-300">{futureMeCardData.cta}</p>
              </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {activeTab === 'experience' && (
        <div className="grid grid-cols-1 gap-6">
          <div className={panelClasses}>
            <h3 className="text-xl font-semibold mb-4 text-white">Experience</h3>
            {editingExperience ? (
              <>
                {experienceDraft.map((exp, idx) => (
                  <div key={idx} className="mb-6 p-4 bg-gray-800/30 rounded-lg border border-gray-700/40">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                      <input
                        type="text"
                        className="w-full md:w-1/3 bg-gray-700/40 border border-gray-600 rounded px-3 py-2 text-white mb-2 md:mb-0"
                        placeholder="Title (e.g. Software Engineer)"
                        value={exp.title}
                        onChange={e => handleUpdateExperience(idx, 'title', e.target.value)}
                      />
                      <input
                        type="text"
                        className="w-full md:w-1/3 bg-gray-700/40 border border-gray-600 rounded px-3 py-2 text-white mb-2 md:mb-0"
                        placeholder="Company"
                        value={exp.company}
                        onChange={e => handleUpdateExperience(idx, 'company', e.target.value)}
                      />
                      <input
                        type="text"
                        className="w-full md:w-1/3 bg-gray-700/40 border border-gray-600 rounded px-3 py-2 text-white mb-2 md:mb-0"
                        placeholder="Start Date (e.g. 2022-01)"
                        value={exp.startDate}
                        onChange={e => handleUpdateExperience(idx, 'startDate', e.target.value)}
                      />
                      <input
                        type="text"
                        className="w-full md:w-1/3 bg-gray-700/40 border border-gray-600 rounded px-3 py-2 text-white mb-2 md:mb-0"
                        placeholder="End Date (or Present)"
                        value={exp.endDate}
                        onChange={e => handleUpdateExperience(idx, 'endDate', e.target.value)}
                        disabled={exp.current}
                      />
                      <label className="flex items-center text-xs text-gray-400 ml-2">
                        <input
                          type="checkbox"
                          checked={exp.current}
                          onChange={e => handleUpdateExperience(idx, 'current', e.target.checked)}
                          className="mr-1"
                        />
                        Current
                      </label>
                    </div>
                    <textarea
                      className="w-full bg-gray-700/40 border border-gray-600 rounded px-3 py-2 text-white mb-2"
                      placeholder="Description (what did you do?)"
                      value={exp.description}
                      onChange={e => handleUpdateExperience(idx, 'description', e.target.value)}
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <button
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
                        onClick={() => handleRemoveExperience(idx)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {experienceDraft.length < 3 && (
                  <button
                    className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-md font-semibold mb-4"
                    onClick={handleAddExperience}
                  >
                    Add Experience
                  </button>
                )}
                <div className="flex gap-2">
                  <button
                    className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-md font-semibold"
                    onClick={handleSaveExperience}
                  >
                    Save
                  </button>
                  <button
                    className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                    onClick={() => {
                      setEditingExperience(false);
                      setExperienceDraft(profile.experience || []);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                {profile.experience && profile.experience.length > 0 ? (
                  <div className="space-y-6">
                    {profile.experience.map((exp, idx) => (
                      <div key={idx} className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/40">
                        <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                          <span className="font-semibold text-cyan-400 text-base md:text-lg">{exp.title}</span>
                          <span className="text-gray-300">@ {exp.company}</span>
                          <span className="text-gray-400 text-xs ml-auto">
                            {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                          </span>
                        </div>
                        <div className="text-gray-300 text-sm mb-2">{exp.description}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-400 text-sm mb-4">No experience added yet.</div>
                )}
                <button
                  className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-md font-semibold mt-4"
                  onClick={() => setEditingExperience(true)}
                >
                  {profile.experience && profile.experience.length > 0 ? 'Edit Experience' : 'Add Experience'}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="space-y-5">
          <div className="mb-2">
            <h2 className="text-lg sm:text-xl font-semibold text-white">
              Reports
            </h2>
            <p className="text-gray-500 text-sm mt-0.5">
              Personalized reports generated from your assessments.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <ReportCard
              title="Career Report"
              description={
                careerReportType === 'school'
                  ? 'School Edition career report with foreign studies, aptitude and learning paths.'
                  : 'Your personalized career profile and learning paths.'
              }
              icon={Award}
              accent="blue"
              summary={careerReportSummary}
              isAvailable={!!careerReportAvailable}
              onView={() => {
                if (careerReportType === 'school') {
                  navigate('/school-career-report');
                } else {
                  setModalReport('career');
                }
              }}
              ctaLabel="Generate Career Report"
              onCta={() => (window.location.href = '/career-selection')}
            />
            <ReportCard
              title="Aptitude Test Report"
              description="Diagnostic of your reasoning, problem-solving and pattern skills."
              icon={TrendingUp}
              accent="orange"
              summary={aptitudeReportSummary}
              isAvailable={!!aptitudeReportAvailable}
              onView={() => setModalReport('aptitude')}
              ctaLabel="Take Aptitude Test"
              onCta={() => (window.location.href = '/aptitude-test')}
            />
            <ReportCard
              title="Personality Test Report"
              description="Your personality profile to guide career and learning choices."
              icon={User}
              accent="emerald"
              summary={personalityReportSummary}
              isAvailable={!!personalityReportAvailable}
              onView={() => setModalReport('personality')}
              ctaLabel="Take Personality Test"
              onCta={() => (window.location.href = '/personality-test')}
            />
            <ReportCard
              title="Intelligence Test Report"
              description="Multi-intelligence profile across cognitive strengths."
              icon={Brain}
              accent="pink"
              summary={intelligenceReportSummary}
              isAvailable={!!intelligenceReportAvailable}
              onView={() => setModalReport('intelligence')}
              ctaLabel="Take Intelligence Test"
              onCta={() => (window.location.href = '/intelligence-test')}
            />
          </div>
        </div>
      )}

      {/* Fullscreen Report Modal */}
      {modalReport && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center w-full h-full overflow-y-auto">
          <div className="w-full max-w-5xl mx-auto bg-black rounded-2xl shadow-2xl relative p-0 sm:p-2 min-h-[80vh] flex flex-col border border-white/10">
            <button
              className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 backdrop-blur text-white rounded-full p-2 shadow-lg transition"
              onClick={() => setModalReport(null)}
              aria-label="Close report"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="flex-1 overflow-y-auto">
              {modalReport === 'career' &&
                (careerReportType === 'school' ? (
                  <SchoolCareerReport />
                ) : (
                  <CareerReport />
                ))}
              {modalReport === 'aptitude' && <SavedAptitudeTest />}
              {modalReport === 'personality' && <SavedPersonalityTest />}
              {modalReport === 'intelligence' && <SavedIntelligenceTest />}
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default ProfilePage;
