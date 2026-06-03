import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  generateSchoolCareerProfile,
  generateSchoolMarketInsights,
  generateSchoolLearningPaths,
  generateSchoolForeignStudies,
  generateAptitudeRecommendations,
  computeAptitudeScores,
  saveSchoolAptitude,
  APTITUDE_FALLBACK_RECS,
} from '../services/schoolReport';
import SchoolReportTabs from './SchoolReportTabs';

const GenerateSchoolReport = () => {
  const navigate = useNavigate();
  const hasGeneratedRef = useRef(false);
  const [reportContent, setReportContent] = useState('');
  const [marketInsights, setMarketInsights] = useState('');
  const [learningPaths, setLearningPaths] = useState('');
  const [foreignStudies, setForeignStudies] = useState('');
  const [aptitudeRecs, setAptitudeRecs] = useState('');
  const [aptitudeScores, setAptitudeScores] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [allContentLoaded, setAllContentLoaded] = useState(false);

  useEffect(() => {
    const answers = JSON.parse(sessionStorage.getItem('assessmentAnswers') || 'null');
    const assessmentType = sessionStorage.getItem('assessmentType');

    if (answers && assessmentType) {
      // React StrictMode in dev can run effects twice; guard to prevent
      // a second (possibly failing) run from overwriting good content.
      if (hasGeneratedRef.current) return;
      hasGeneratedRef.current = true;
      generateAllContent(answers);
    } else {
      setError('No assessment data found. Please complete an assessment first.');
      setTimeout(() => navigate('/'), 3000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const generateAllContent = async (answers) => {
    if (!answers) {
      setError('No assessment data available. Please complete an assessment first.');
      return;
    }

    setLoading(true);
    setError('');

    // Aptitude scores are deterministic and instant — no AI needed.
    const scores = computeAptitudeScores(answers);
    setAptitudeScores(scores);

    // Wrap each call so a single failure does not break the whole report.
    const safe = (promise, fallback = '') =>
      promise.catch((err) => {
        console.error('School report sub-call failed:', err);
        return fallback;
      });

    try {
      const [profile, market, paths, foreign, aptiRecs] = await Promise.all([
        safe(generateSchoolCareerProfile(answers)),
        safe(generateSchoolMarketInsights(answers)),
        safe(generateSchoolLearningPaths(answers)),
        safe(generateSchoolForeignStudies(answers)),
        safe(generateAptitudeRecommendations(scores), APTITUDE_FALLBACK_RECS),
      ]);

      // Never overwrite already-rendered content with empty strings (e.g. from a partial failure).
      if (profile) setReportContent(profile);
      if (market) setMarketInsights(market);
      if (paths) setLearningPaths(paths);
      if (foreign) setForeignStudies(foreign);
      setAptitudeRecs(aptiRecs || APTITUDE_FALLBACK_RECS);

      saveSchoolAptitude({
        scores,
        recommendations: aptiRecs || APTITUDE_FALLBACK_RECS,
      });

      setAllContentLoaded(true);
    } catch (err) {
      setError(err.message || 'An error occurred while generating the report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md text-center">
          <div className="w-12 h-12 border-[3px] border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6" />
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
            Building your personalized report
          </h2>
          <p className="text-gray-500 text-sm md:text-base mb-8">
            This usually takes under 30 seconds.
          </p>
          <ul className="text-left space-y-3 text-sm text-gray-600">
            <li className="flex items-start gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse flex-shrink-0" />
              Analysing your assessment responses
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse flex-shrink-0" />
              Matching career and study paths for you
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse flex-shrink-0" />
              Curating foreign study and aptitude insights
            </li>
          </ul>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm max-w-md w-full text-center">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
            Something went wrong
          </h2>
          <p className="text-sm text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center justify-center bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-md text-sm font-medium transition"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <SchoolReportTabs
      reportContent={reportContent}
      marketInsights={marketInsights}
      learningPaths={learningPaths}
      foreignStudies={foreignStudies}
      aptitudeScores={aptitudeScores}
      aptitudeRecs={aptitudeRecs}
      allContentLoaded={allContentLoaded}
      setError={setError}
    />
  );
};

export default GenerateSchoolReport;
