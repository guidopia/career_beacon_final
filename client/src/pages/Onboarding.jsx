import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_BASE_URL } from '../api/index';
import { SITE_BRAND_NAME, SITE_BRAND_NAME_SENTENCE } from '../constants/branding';

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    phoneNumber: '',
    studentType: '',
    schoolClass: '',
    schoolStream: '',
    collegeYear: '',
    collegeDegree: '',
    otherDegree: '',
    strongestAreas: [],
    learningFormats: [],
    motivation: '',
    futureExcitement: '',
    joiningReason: '',
    otherReason: '',
    strengths: [],
    careerGoals: [],
    industries: [],
    lifestyle: '',
    learningPreference: []
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle token from URL on component mount
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMultiSelect = (field, value, maxSelections = 2) => {
    const currentSelections = formData[field];
    let updatedSelections;
    
    if (currentSelections.includes(value)) {
      updatedSelections = currentSelections.filter(item => item !== value);
    } else if (currentSelections.length < maxSelections) {
      updatedSelections = [...currentSelections, value];
    } else {
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: updatedSelections
    }));
  };

  const handleNext = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    
    try {
      // Get token from localStorage (or wherever you store it after login)
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        console.error('No authentication token found');
        alert('Please log in first');
        return;
      }
      
      // Debug: Check authentication status first
      try {
        const authCheck = await axios.get(`${API_BASE_URL}/auth/session`, { 
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch (authError) {
      }
      
      // Save onboarding data
      const onboardingResponse = await axios.post(`${API_BASE_URL}/api/onboarding/save`, formData, { 
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (onboardingResponse.data.success) {
        
        // Generate Future Me Card based on onboarding data
        const cardResponse = await axios.post(`${API_BASE_URL}/api/futureme/generate`, {
          onboardingData: formData
        }, { 
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        
        if (cardResponse.data.success) {
          // Navigate to Future Me Card with the generated data
          // The backend returns user object with populated futureMeCard
          const cardData = cardResponse.data.user.futureMeCard;
          
          // Validate that we have the required card data
          if (!cardData || !cardData.futureRole) {
            console.error('Invalid card data received:', cardData);
            throw new Error('Generated card data is incomplete');
          }
          
          navigate('/future-me-card', { 
            state: { 
              card: cardData,
              onboardingAnswers: formData,
              fromOnboarding: true 
            } 
          });
        } else {
          throw new Error('Failed to generate Future Me Card');
        }
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
      setIsGenerating(false);
      // Show more specific error message to user
      if (error.response?.data?.error) {
        alert(`Error: ${error.response.data.error}`);
      } else if (error.message) {
        alert(`Error: ${error.message}`);
      } else {
        alert('Something went wrong. Please try again.');
      }
    }
  };
  const getTotalSteps = () => {
    return formData.studentType === 'school' ? 9 : 10;
  };

  const isNextDisabled = () => {
    switch (currentStep) {
      case 1:
        return !formData.phoneNumber.trim();
      case 2:
        return !formData.studentType;
      case 3:
        return formData.studentType === 'school' 
          ? !formData.schoolClass 
          : !formData.collegeYear;
      case 4:
        return formData.studentType === 'school' 
          ? !formData.schoolStream 
          : !formData.collegeDegree || (formData.collegeDegree === 'Other' && !formData.otherDegree);
      case 5:
        return formData.studentType === 'school'
          ? formData.strongestAreas.length !== 2
          : formData.strengths.length !== 2;
      case 6:
        return formData.studentType === 'school'
          ? formData.learningFormats.length !== 2
          : formData.careerGoals.length === 0 || formData.careerGoals.length > 2;
      case 7:
        return formData.studentType === 'school'
          ? !formData.motivation
          : formData.industries.length !== 2;
      case 8:
        if (formData.studentType === 'school') {
          return !formData.futureExcitement;
        } else {
          return !formData.lifestyle;
        }
      case 9:
        if (formData.studentType === 'school') {
          return !formData.joiningReason || (formData.joiningReason === 'Other' && !formData.otherReason);
        } else {
          return formData.learningPreference.length !== 2;
        }
      case 10:
        return formData.studentType === 'college' 
          ? (!formData.joiningReason || (formData.joiningReason === 'Other' && !formData.otherReason))
          : false;
      default:
        return false;
    }
  };

  const baseOptionClasses = "group relative p-5 border cursor-pointer bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm transition-all duration-300 ease-out flex items-center text-white hover:border-cyan-400/60 hover:shadow-lg hover:shadow-cyan-500/10 border-gray-700/50 hover:scale-[1.02] hover:bg-gradient-to-br hover:from-gray-800/60 hover:to-gray-700/40 rounded-lg";
  const selectedClasses = "border-cyan-400 ring-2 ring-cyan-400/30 bg-gradient-to-br from-cyan-950/30 to-gray-800/50 shadow-lg shadow-cyan-500/20 scale-[1.02]";
  const unselectedClasses = "border-gray-700/50";

  const inputClasses = "w-full py-4 px-5 border border-gray-700/50 text-base mt-3 bg-gradient-to-br from-gray-900/70 to-gray-800/50 backdrop-blur-sm text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 focus:shadow-lg focus:shadow-cyan-500/10 outline-none transition-all duration-300 rounded-lg";
  
  const continueButtonClasses = "relative overflow-hidden py-4 px-8 bg-gradient-to-r from-cyan-500 to-cyan-400 text-black border-none text-base font-semibold cursor-pointer transition-all duration-300 ease-out min-w-[120px] rounded-lg hover:enabled:shadow-lg hover:enabled:shadow-cyan-500/30 hover:enabled:scale-105 hover:enabled:from-cyan-400 hover:enabled:to-cyan-300 disabled:bg-gradient-to-r disabled:from-gray-700 disabled:to-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none";
  const backButtonClasses = "py-4 px-8 bg-gradient-to-br from-gray-800/60 to-gray-700/40 backdrop-blur-sm text-white border border-gray-600/50 text-base font-semibold cursor-pointer transition-all duration-300 ease-out hover:border-cyan-400/60 hover:text-cyan-300 hover:shadow-lg hover:shadow-gray-900/20 hover:scale-105 rounded-lg";

  const getStepTitle = () => {
    const titles = {
      1: "Contact Information",
      2: "Tell us about yourself",
      3: "Academic details",
      4: "Field of study",
      5: formData.studentType === 'school' ? "Your strongest areas" : "Your strengths",
      6: formData.studentType === 'school' ? "Learning preferences" : "Career goals",
      7: formData.studentType === 'school' ? "What motivates you" : "Industry interests",
      8: formData.studentType === 'school' ? "Future vision" : "Lifestyle preferences",
      9: formData.studentType === 'school' ? "Your goals" : "Learning preferences",
      10: "Your goals"
    };
    return titles[currentStep] || "";
  };

  const renderQuestion = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="mb-10 animate-in fade-in duration-500">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-3 text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Enter your phone number
              </h3>
              <p className="text-gray-400 text-sm">This will be used to send your "Future You" snapshot</p>
            </div>
            <div className="max-w-md mx-auto">
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
                className={inputClasses}
                required
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="mb-10 animate-in fade-in duration-500">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-3 text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Are you a school student or a college student?
              </h3>
              <p className="text-gray-400 text-sm">This helps us personalize your experience</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
              <div 
                className={`${baseOptionClasses} ${formData.studentType === 'school' ? selectedClasses : unselectedClasses}`}
                onClick={() => setFormData(prev => ({...prev, studentType: 'school'}))}
              >
                <div className="flex flex-col items-center text-center w-full">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl">🎓</span>
                  </div>
                  <span className="font-semibold">School Student</span>
                  <span className="text-xs text-gray-400 mt-1">Classes 8-12</span>
                </div>
              </div>
              <div 
                className={`${baseOptionClasses} ${formData.studentType === 'college' ? selectedClasses : unselectedClasses}`}
                onClick={() => setFormData(prev => ({...prev, studentType: 'college'}))}
              >
                <div className="flex flex-col items-center text-center w-full">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl">🏛️</span>
                  </div>
                  <span className="font-semibold">College Student</span>
                  <span className="text-xs text-gray-400 mt-1">Undergraduate</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        if (formData.studentType === 'school') {
          return (
            <div className="mb-10 animate-in fade-in duration-500">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-3 text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  What is your current class?
                </h3>
                <p className="text-gray-400 text-sm">Select your current academic year</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl mx-auto">
                {['Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'].map((cls) => (
                  <div 
                    key={cls}
                    className={`${baseOptionClasses} ${formData.schoolClass === cls ? selectedClasses : unselectedClasses}`}
                    onClick={() => setFormData(prev => ({...prev, schoolClass: cls}))}
                  >
                    <span className="font-semibold mx-auto">{cls}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        } else {
          return (
            <div className="mb-10 animate-in fade-in duration-500">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-3 text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  What year are you currently in?
                </h3>
                <p className="text-gray-400 text-sm">Tell us about your current academic status</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                {['1st Year UG', '2nd Year UG', '3rd Year UG', 'Final Year UG', 'Gap year / Dropped out'].map((year) => (
                  <div 
                    key={year}
                    className={`${baseOptionClasses} ${formData.collegeYear === year ? selectedClasses : unselectedClasses}`}
                    onClick={() => setFormData(prev => ({...prev, collegeYear: year}))}
                  >
                    <span className="font-semibold mx-auto text-center">{year}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        }

      case 4:
        if (formData.studentType === 'school') {
          return (
            <div className="mb-10 animate-in fade-in duration-500">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-3 text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Which stream are you planning to pursue (if known)?
                </h3>
                <p className="text-gray-400 text-sm">Don't worry if you're not sure yet</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                {['Science', 'Commerce', 'Humanities / Arts', 'Not decided yet'].map((stream) => (
                  <div 
                    key={stream}
                    className={`${baseOptionClasses} ${formData.schoolStream === stream ? selectedClasses : unselectedClasses}`}
                    onClick={() => setFormData(prev => ({...prev, schoolStream: stream}))}
                  >
                    <span className="font-semibold mx-auto text-center">{stream}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        } else {
          const degrees = [
            'B.Tech / B.E', 'B.Sc', 'B.Com', 'B.A', 'BBA / BBM', 'BCA', 
            'MBBS / BDS / Allied Health', 'B.Des / B.Arch', 'LLB', 
            'Diploma / Certification', 'Not decided yet', 'Other'
          ];
          
          return (
            <div className="mb-10 animate-in fade-in duration-500">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-3 text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  What degree are you pursuing?
                </h3>
                <p className="text-gray-400 text-sm">Select your current degree program</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-w-4xl mx-auto">
                {degrees.map((degree) => (
                  <div 
                    key={degree}
                    className={`${baseOptionClasses} ${formData.collegeDegree === degree ? selectedClasses : unselectedClasses}`}
                    onClick={() => setFormData(prev => ({...prev, collegeDegree: degree, otherDegree: degree !== 'Other' ? '' : prev.otherDegree}))}
                  >
                    <span className="font-semibold mx-auto text-center text-sm">{degree}</span>
                  </div>
                ))}
              </div>
              {formData.collegeDegree === 'Other' && (
                <div className="mt-6 max-w-md mx-auto animate-in fade-in duration-300">
                  <input
                    type="text"
                    name="otherDegree"
                    value={formData.otherDegree}
                    onChange={handleInputChange}
                    placeholder="Please specify your degree"
                    className={inputClasses}
                  />
                </div>
              )}
            </div>
          );
        }

      case 5:
        if (formData.studentType === 'school') {
          const areas = ['Logical thinking', 'Creativity & imagination', 'Communication', 'Tech or gadgets', 'Leadership', 'Curiosity and asking questions'];
          return (
            <div className="mb-10 animate-in fade-in duration-500">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-3 text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  What are your strongest areas? (Pick 2)
                </h3>
                <p className="text-gray-400 text-sm">Selected: {formData.strongestAreas.length}/2</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-3xl mx-auto">
                {areas.map((area) => (
                  <div 
                    key={area}
                    className={`${baseOptionClasses} ${formData.strongestAreas.includes(area) ? selectedClasses : unselectedClasses}`}
                    onClick={() => handleMultiSelect('strongestAreas', area, 2)}
                  >
                    <span className="font-semibold mx-auto text-center text-sm">{area}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        } else {
          const strengths = ['Technical/problem-solving skills', 'Public speaking or communication', 'Design or visual skills', 'Analytical thinking', 'Team leadership', 'Self-learning'];
          return (
            <div className="mb-10 animate-in fade-in duration-500">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-3 text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  What are your top 2 strengths?
                </h3>
                <p className="text-gray-400 text-sm">Selected: {formData.strengths.length}/2</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-3xl mx-auto">
                {strengths.map((strength) => (
                  <div 
                    key={strength}
                    className={`${baseOptionClasses} ${formData.strengths.includes(strength) ? selectedClasses : unselectedClasses}`}
                    onClick={() => handleMultiSelect('strengths', strength, 2)}
                  >
                    <span className="font-semibold mx-auto text-center text-sm">{strength}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        }

      case 6:
        if (formData.studentType === 'school') {
          const formats = ['Watching YouTube videos', 'Playing interactive games or quizzes', 'Doing small projects', 'Talking to mentors/seniors', 'Reading'];
          return (
            <div className="mb-10 animate-in fade-in duration-500">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-3 text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  What are your favorite learning formats? (Pick 2)
                </h3>
                <p className="text-gray-400 text-sm">Selected: {formData.learningFormats.length}/2</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-3xl mx-auto">
                {formats.map((format) => (
                  <div 
                    key={format}
                    className={`${baseOptionClasses} ${formData.learningFormats.includes(format) ? selectedClasses : unselectedClasses}`}
                    onClick={() => handleMultiSelect('learningFormats', format, 2)}
                  >
                    <span className="font-semibold mx-auto text-center text-sm">{format}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        } else {
          const goals = ['Build a strong resume', 'Get internships/projects', 'Learn in-demand skills', 'Crack a government or private job', 'Start my own business', 'Still exploring'];
          return (
            <div className="mb-10 animate-in fade-in duration-500">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-3 text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  What are your current career goals? (Pick up to 2)
                </h3>
                <p className="text-gray-400 text-sm">Selected: {formData.careerGoals.length}/2</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-3xl mx-auto">
                {goals.map((goal) => (
                  <div 
                    key={goal}
                    className={`${baseOptionClasses} ${formData.careerGoals.includes(goal) ? selectedClasses : unselectedClasses}`}
                    onClick={() => handleMultiSelect('careerGoals', goal, 2)}
                  >
                    <span className="font-semibold mx-auto text-center text-sm">{goal}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        }

      case 7:
        if (formData.studentType === 'school') {
          const motivations = ['Achieving success and recognition', 'Solving real-world problems', 'Building or creating things', 'Helping others', 'Exploring new things'];
          return (
            <div className="mb-10 animate-in fade-in duration-500">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-3 text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  What motivates you the most?
                </h3>
                <p className="text-gray-400 text-sm">Choose what drives you</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-3xl mx-auto">
                {motivations.map((motivation) => (
                  <div 
                    key={motivation}
                    className={`${baseOptionClasses} ${formData.motivation === motivation ? selectedClasses : unselectedClasses}`}
                    onClick={() => setFormData(prev => ({...prev, motivation}))}
                  >
                    <span className="font-semibold mx-auto text-center text-sm">{motivation}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        } else {
          const industries = ['Tech / Software / AI', 'Finance / Consulting', 'Design / Media / Content', 'Government / Law / Policy', 'Healthcare / Psychology', 'Education / NGOs / Social Impact'];
          return (
            <div className="mb-10 animate-in fade-in duration-500">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-3 text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Which industries excite you the most? (Pick 2)
                </h3>
                <p className="text-gray-400 text-sm">Selected: {formData.industries.length}/2</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-3xl mx-auto">
                {industries.map((industry) => (
                  <div 
                    key={industry}
                    className={`${baseOptionClasses} ${formData.industries.includes(industry) ? selectedClasses : unselectedClasses}`}
                    onClick={() => handleMultiSelect('industries', industry, 2)}
                  >
                    <span className="font-semibold mx-auto text-center text-sm">{industry}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        }

      case 8:
        if (formData.studentType === 'school') {
          const futures = ['Building apps or working in tech', 'Becoming a doctor, lawyer, or civil servant', 'Running my own business', 'Creating content or designing', 'Still figuring it out'];
          return (
            <div className="mb-10 animate-in fade-in duration-500">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-3 text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  What kind of future excites you the most?
                </h3>
                <p className="text-gray-400 text-sm">Think about your ideal career path</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-3xl mx-auto">
                {futures.map((future) => (
                  <div 
                    key={future}
                    className={`${baseOptionClasses} ${formData.futureExcitement === future ? selectedClasses : unselectedClasses}`}
                    onClick={() => setFormData(prev => ({...prev, futureExcitement: future}))}
                  >
                    <span className="font-semibold mx-auto text-center text-sm">{future}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        } else {
          const lifestyles = ['Corporate success with good salary', 'Entrepreneurial freedom', 'Balanced and meaningful life', 'Global exposure and travel', 'Creative and expressive life'];
          return (
            <div className="mb-10 animate-in fade-in duration-500">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-3 text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  What kind of lifestyle do you want in the future?
                </h3>
                <p className="text-gray-400 text-sm">Choose your ideal work-life balance</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-3xl mx-auto">
                {lifestyles.map((lifestyle) => (
                  <div 
                    key={lifestyle}
                    className={`${baseOptionClasses} ${formData.lifestyle === lifestyle ? selectedClasses : unselectedClasses}`}
                    onClick={() => setFormData(prev => ({...prev, lifestyle}))}
                  >
                    <span className="font-semibold mx-auto text-center text-sm">{lifestyle}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        }

      case 9:
        if (formData.studentType === 'college') {
          const learningPrefs = ['YouTube tutorials or reels', 'Online courses', 'Real-life projects', 'Talking to seniors/mentors', 'Books & blogs'];
          return (
            <div className="mb-10 animate-in fade-in duration-500">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-3 text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  How do you prefer to learn new skills? (Pick 2)
                </h3>
                <p className="text-gray-400 text-sm">Selected: {formData.learningPreference.length}/2</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-3xl mx-auto">
                {learningPrefs.map((pref) => (
                  <div 
                    key={pref}
                    className={`${baseOptionClasses} ${formData.learningPreference.includes(pref) ? selectedClasses : unselectedClasses}`}
                    onClick={() => handleMultiSelect('learningPreference', pref, 2)}
                  >
                    <span className="font-semibold mx-auto text-center text-sm">{pref}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        }
        break;

      case 10:
        // Final question for college students only
        if (formData.studentType === 'college') {
          const reasons = ['Build resume/profile', 'Get internships or freelance work', 'Learn job-ready skills', 'Get career guidance', 'Just exploring', 'Other'];
          
          return (
            <div className="mb-10 animate-in fade-in duration-500">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-3 text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  {`Why are you joining ${SITE_BRAND_NAME_SENTENCE}?`}
                </h3>
                <p className="text-gray-400 text-sm">Help us understand your goals better</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-3xl mx-auto">
                {reasons.map((reason) => (
                  <div 
                    key={reason}
                    className={`${baseOptionClasses} ${formData.joiningReason === reason ? selectedClasses : unselectedClasses}`}
                    onClick={() => setFormData(prev => ({...prev, joiningReason: reason, otherReason: reason !== 'Other' ? '' : prev.otherReason}))}
                  >
                    <span className="font-semibold text-center mx-auto text-sm leading-relaxed">{reason}</span>
                  </div>
                ))}
              </div>
              {formData.joiningReason === 'Other' && (
                <div className="mt-6 max-w-md mx-auto animate-in fade-in duration-300">
                  <input
                    type="text"
                    name="otherReason"
                    value={formData.otherReason}
                    onChange={handleInputChange}
                    placeholder="Tell us more about your goals"
                    className={inputClasses}
                  />
                </div>
              )}
            </div>
          );
        }
        break;

      default:
        return null;
    }

    // Final question for school students only (step 9)
    if (formData.studentType === 'school' && currentStep === 9) {
      const reasons = ['Discover the right stream or career', 'Prepare for exams', 'Build skills early', 'Connect with mentors/seniors', 'Just exploring', 'Other'];
      
      return (
        <div className="mb-10 animate-in fade-in duration-500">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-3 text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {`Why are you joining ${SITE_BRAND_NAME_SENTENCE}?`}
            </h3>
            <p className="text-gray-400 text-sm">Help us understand your goals better</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-3xl mx-auto">
            {reasons.map((reason) => (
              <div 
                key={reason}
                className={`${baseOptionClasses} ${formData.joiningReason === reason ? selectedClasses : unselectedClasses}`}
                onClick={() => setFormData(prev => ({...prev, joiningReason: reason, otherReason: reason !== 'Other' ? '' : prev.otherReason}))}
              >
                <span className="font-semibold text-center mx-auto text-sm leading-relaxed">{reason}</span>
              </div>
            ))}
          </div>
          {formData.joiningReason === 'Other' && (
            <div className="mt-6 max-w-md mx-auto animate-in fade-in duration-300">
              <input
                type="text"
                name="otherReason"
                value={formData.otherReason}
                onChange={handleInputChange}
                placeholder="Tell us more about your goals"
                className={inputClasses}
              />
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  // Show generating screen when creating Future Me Card
  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center animate-pulse">
            <span className="text-2xl">🚀</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Generating Your Future Me Card...</h2>
          <p className="text-gray-400 text-lg">Creating your personalized career vision based on your preferences</p>
          <div className="mt-6 flex justify-center">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce delay-100"></div>
              <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full bg-gradient-to-br from-gray-950 via-black to-gray-900">
      
      {/* Enhanced Sidebar */}
      <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/50 backdrop-blur-xl text-white w-full p-8 flex flex-col justify-between border-b border-gray-700/30 lg:border-b-0 lg:w-[38%] lg:h-full lg:p-12 lg:border-r lg:border-gray-700/30 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-500/10 to-transparent blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-500/10 to-transparent blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 font-bold text-xl mb-2">
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-cyan-300 rounded-full flex items-center justify-center">
              <span className="text-black font-bold">G</span>
            </div>
            <span className="bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text text-transparent text-[10px] sm:text-xs leading-tight">{SITE_BRAND_NAME}</span>
          </div>
          
          <div className="mt-12 lg:mt-20">
            <h1 className="text-2xl lg:text-4xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                Welcome to your
              </span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                personalized journey
              </span>
            </h1>
            <div className="space-y-3 text-gray-300">
              <p className="flex items-center text-base">
                <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3 animate-pulse"></span>
                Tell us about yourself
              </p>
              <p className="flex items-center text-base">
                <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3 animate-pulse delay-100"></span>
                We'll customize your experience
              </p>
              <p className="flex items-center text-base">
                <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3 animate-pulse delay-200"></span>
                Get your Future Me Card
              </p>
            </div>
          </div>
        </div>
       
        <div className="mt-8 lg:mt-0 relative z-10">
          <div className="flex justify-end items-center text-sm">
            <span className="text-gray-400 mr-3">Need assistance?</span>
            <button className="px-4 py-2 text-cyan-400 bg-cyan-400/10 font-semibold border border-cyan-400/30 rounded-lg hover:bg-cyan-400/20 hover:border-cyan-400/50 transition-all duration-300 backdrop-blur-sm">
              Get Help
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Main Content */}
      <div className="w-full bg-gradient-to-br from-black via-gray-950 to-gray-900 p-6 flex flex-col min-h-[60vh] overflow-y-auto lg:w-[62%] lg:h-full lg:p-12 relative">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/3 via-transparent to-transparent"></div>
        
        <div className="max-w-4xl mx-auto w-full relative z-10">
          {/* Enhanced Progress Section */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-white mb-1">{getStepTitle()}</h2>
                <p className="text-sm text-gray-400">Step {currentStep} of {getTotalSteps()}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text text-transparent">
                  {Math.round((currentStep / getTotalSteps()) * 100)}%
                </div>
                <div className="text-xs text-gray-400">Complete</div>
              </div>
            </div>
            
            <div className="relative h-2 bg-gray-800/50 rounded-full overflow-hidden backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-800/30 to-gray-700/30 rounded-full"></div>
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 via-cyan-400 to-cyan-300 transition-all duration-700 ease-out rounded-full relative overflow-hidden"
                style={{width: `${(currentStep / getTotalSteps()) * 100}%`}}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {renderQuestion()}
            
            {/* Enhanced Navigation */}
            <div className={`flex items-center pt-8 border-t border-gray-800/50 ${currentStep > 1 ? 'justify-between' : 'justify-end'}`}>
              {currentStep > 1 && (
                <button 
                  type="button"
                  onClick={handleBack}
                  className={backButtonClasses}
                  disabled={isGenerating}
                >
                  ← Back
                </button>
              )}
              
              {currentStep < getTotalSteps() ? (
                <button 
                  type="button"
                  onClick={handleNext}
                  className={continueButtonClasses}
                  disabled={isNextDisabled() || isGenerating}
                >
                  <span className="relative z-10">Next →</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                </button>
              ) : (
                <button 
                  type="submit" 
                  className={`${continueButtonClasses} relative group`}
                  disabled={isNextDisabled() || isGenerating}
                >
                  <span className="relative z-10 flex items-center">
                    {isGenerating ? 'Generating...' : 'Create My Future Me Card'}
                    <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">
                      {isGenerating ? '⏳' : '🚀'}
                    </span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                </button>
              )}
            </div>
          </form>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-20 right-20 w-8 h-8 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-lg animate-bounce" style={{animationDelay: '1s'}}></div>
      </div>
    </div>
  );
}
