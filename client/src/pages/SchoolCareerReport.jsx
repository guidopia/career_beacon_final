import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getSavedSchoolCareerReport,
  getSavedSchoolMarketInsights,
  getSavedSchoolLearningPaths,
  getSavedSchoolForeignStudies,
  getSavedSchoolAptitude,
  APTITUDE_FALLBACK_RECS,
} from '../services/schoolReport';
import SchoolReportTabs from '../components/SchoolReportTabs';

const SchoolCareerReport = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reportContent, setReportContent] = useState('');
  const [marketInsights, setMarketInsights] = useState('');
  const [learningPaths, setLearningPaths] = useState('');
  const [foreignStudies, setForeignStudies] = useState('');
  const [aptitudeScores, setAptitudeScores] = useState(null);
  const [aptitudeRecs, setAptitudeRecs] = useState('');
  const [generatedAt, setGeneratedAt] = useState(null);

  useEffect(() => {
    try {
      const profile = getSavedSchoolCareerReport();
      const market = getSavedSchoolMarketInsights();
      const paths = getSavedSchoolLearningPaths();
      const foreign = getSavedSchoolForeignStudies();
      const aptitude = getSavedSchoolAptitude();

      if (!profile && !market && !paths && !foreign && !aptitude) {
        setError(
          'No saved school report found. Please complete the school assessment to generate a report.'
        );
        return;
      }

      if (profile) {
        setReportContent(profile.data);
        setGeneratedAt(profile.timestamp);
      }
      if (market) setMarketInsights(market.data);
      if (paths) setLearningPaths(paths.data);
      if (foreign) setForeignStudies(foreign.data);
      if (aptitude && aptitude.data) {
        setAptitudeScores(aptitude.data.scores || null);
        setAptitudeRecs(aptitude.data.recommendations || APTITUDE_FALLBACK_RECS);
      }
    } catch (err) {
      setError('Failed to load saved report: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 px-4 text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6" />
        <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-2">
          Loading Your Saved Report
        </h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[40vh] flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4">
        <div className="bg-white border border-red-100 text-red-600 p-6 rounded-lg shadow-xl max-w-lg text-center">
          <h2 className="text-lg md:text-xl font-semibold mb-4">No saved report</h2>
          <p className="text-sm md:text-base">{error}</p>
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={() => navigate('/school-assessment')}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition shadow-md text-sm"
            >
              Take Assessment
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition shadow-md text-sm"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const subtitle = generatedAt
    ? `School Edition · Saved on ${new Date(generatedAt).toLocaleDateString()}`
    : `School Edition · Saved Report`;

  return (
    <SchoolReportTabs
      reportContent={reportContent}
      marketInsights={marketInsights}
      learningPaths={learningPaths}
      foreignStudies={foreignStudies}
      aptitudeScores={aptitudeScores}
      aptitudeRecs={aptitudeRecs}
      allContentLoaded
      setError={setError}
      headerSubtitle={subtitle}
    />
  );
};

export default SchoolCareerReport;
