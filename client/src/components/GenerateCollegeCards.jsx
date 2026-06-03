import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateCollegeRecommendations } from '../services/collegeService';
import CollegeCard from './CollegeCard';

const GenerateCollegeCards = ({ userPreferences }) => {
  const navigate = useNavigate();
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedForComparison, setSelectedForComparison] = useState([]);

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check if we already have colleges stored in memory
        const savedColleges = window.generatedColleges;
        if (savedColleges && savedColleges.length > 0) {
          setColleges(savedColleges);
          setLoading(false);
          return;
        }

        // Only make API call if no saved colleges
        const recommendations = await generateCollegeRecommendations(userPreferences);
        setColleges(recommendations);

        // Store in memory for future use
        window.generatedColleges = recommendations;
      } catch (err) {
        setError(err.message);
        console.error('Error fetching colleges:', err);
      } finally {
        setLoading(false);
      }
    };

    if (userPreferences) {
      fetchColleges();
    }
  }, [userPreferences]);

  const handleAddToCompare = (college) => {
    const isAlreadySelected = selectedForComparison.find(c => c.collegeName === college.collegeName);

    if (isAlreadySelected) {
      // Remove from comparison if already selected
      handleRemoveFromCompare(college.collegeName);
      return;
    }

    if (selectedForComparison.length >= 3) {
      alert('You can compare maximum 3 colleges at a time');
      return;
    }

    const newSelection = [...selectedForComparison, college];
    setSelectedForComparison(newSelection);

    // Store in memory for comparison page
    window.selectedColleges = newSelection;
  };

  const handleRemoveFromCompare = (collegeName) => {
    const newSelection = selectedForComparison.filter(c => c.collegeName !== collegeName);
    setSelectedForComparison(newSelection);
    window.selectedColleges = newSelection;
  };

  const handleCompareSelected = () => {
    if (selectedForComparison.length < 2) {
      alert('Please select at least 2 colleges to compare');
      return;
    }

    // Navigate to compare page using React Router
    navigate('/compare');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-black">
        <div className="relative">
          {/* Outer spinning ring */}
          <div className="w-16 h-16 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
          {/* Inner spinning ring */}
          <div className="absolute top-2 left-2 w-12 h-12 border-4 border-slate-800 border-t-emerald-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          {/* Center dot */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full animate-pulse"></div>
        </div>

        <div className="text-center mt-6 space-y-2">
          <h3 className="text-xl font-semibold text-white">
            Generating Your Perfect Matches
          </h3>
          <p className="text-slate-300 text-base">
            Analyzing thousands of colleges based on your preferences...
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-500/25 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-500/25 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-emerald-500/25 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span className="text-sm text-slate-400 ml-2">This may take a few moments</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-black">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-red-400 text-4xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Oops! Something went wrong</h2>
          <p className="text-slate-300 mb-6 leading-relaxed">{error}</p>
          <button
            onClick={() => {
              // Clear stored data when starting new search
              window.userPreferences = null;
              window.selectedColleges = null;
              window.generatedColleges = null;
              navigate('/');
            }}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!colleges || colleges.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-black">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-slate-400 text-4xl">🔍</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-3">No Colleges Found</h2>
          <p className="text-slate-300 mb-6">We couldn't find colleges matching your preferences. Try adjusting your criteria.</p>
          <button
            onClick={() => window.location.href = '/college-search'}
            className="bg-black text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
          >
            Search Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen">
      {/* Comparison Bar */}
      {selectedForComparison.length > 0 && (
        <div className="bg-black border border-slate-700 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-white">
                Selected for Comparison ({selectedForComparison.length}/3)
              </h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedForComparison.map((college) => (
                  <span
                    key={college.collegeName}
                    className="bg-blue-900 text-blue-100 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {college.collegeName}
                    <button
                      onClick={() => handleRemoveFromCompare(college.collegeName)}
                      className="text-blue-300 hover:text-white transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={handleCompareSelected}
              disabled={selectedForComparison.length < 2}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transform hover:scale-105"
            >
              Compare Selected
            </button>
          </div>
        </div>
      )}

      {/* College Cards - 2x4 Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {colleges.map((college, index) => (
          <CollegeCard
            key={index}
            college={college}
            onAddToCompare={handleAddToCompare}
            isSelected={selectedForComparison.some(c => c.collegeName === college.collegeName)}
          />
        ))}
      </div>

      {/* Back to Search */}
      <div className="text-center mt-8">
        <button
          onClick={() => {
            navigate('/college-search');
          }}
          className="bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
        >
          Search Again
        </button>
      </div>
    </div>
  );
};

export default GenerateCollegeCards;