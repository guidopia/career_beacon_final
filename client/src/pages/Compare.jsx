import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CollegeComparison from '../components/CollegeComparison';

const Compare = () => {
    const navigate = useNavigate();
    const [selectedColleges, setSelectedColleges] = useState([]);

    useEffect(() => {
        const colleges = window.selectedColleges;
        if (!colleges || colleges.length === 0) {
            navigate('/explore');
            return;
        }
        setSelectedColleges(colleges);
    }, [navigate]);

    const handleRemoveCollege = (collegeName) => {
        const updatedColleges = selectedColleges.filter(c => c.collegeName !== collegeName);
        setSelectedColleges(updatedColleges);
        window.selectedColleges = updatedColleges;
        if (updatedColleges.length === 0) {
            navigate('/explore');
        }
    };

    const handleBackToExplore = () => {
        navigate('/explore');
    };

    const handleStartNewSearch = () => {
        window.userPreferences = null;
        window.selectedColleges = null;
        window.generatedColleges = null;
        navigate('/college-search');
    };

    if (selectedColleges.length === 0) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <div className="w-12 h-12 border-4 border-slate-800 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
                        <div className="absolute top-1 left-1 w-10 h-10 border-4 border-slate-900 border-t-emerald-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                    </div>
                    <p className="text-slate-400 mt-4 text-base">Loading comparison...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black">
            <div className="max-w-7xl mx-auto px-4 py-10">
              

                {/* Selected Colleges & Tips Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Selected Colleges Management */}
                    <div className="bg-black/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-7 h-7 bg-blue-900 rounded-lg flex items-center justify-center">
                                <span className="text-blue-100 text-base font-bold">📋</span>
                            </div>
                            <h2 className="font-semibold text-white text-base">
                                Selected Colleges <span className="text-blue-400">({selectedColleges.length})</span>
                            </h2>
                        </div>
                        <div className="flex flex-col gap-2">
                            {selectedColleges.map((college) => (
                                <div
                                    key={college.collegeName}
                                    className="bg-gradient-to-r from-slate-900/80 to-slate-800/80 border border-slate-700 rounded-lg px-4 py-2 flex items-center gap-3 hover:border-blue-700 transition-colors group"
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-white text-sm truncate">{college.collegeName}</div>
                                        <div className="text-xs text-slate-400 mt-0.5 truncate">{college.location}, {college.country}</div>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveCollege(college.collegeName)}
                                        className="w-7 h-7 bg-red-900/80 hover:bg-red-800 text-red-300 hover:text-white rounded-md flex items-center justify-center font-bold text-base transition-all duration-200 group-hover:scale-110 flex-shrink-0"
                                        title="Remove from comparison"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Comparison Tips */}
                    <div className="bg-black/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-7 h-7 bg-yellow-900 rounded-lg flex items-center justify-center">
                                <span className="text-yellow-100 text-base font-bold">💡</span>
                            </div>
                            <h3 className="font-semibold text-white text-base">Key Comparison Tips</h3>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span className="text-slate-300 text-sm">Compare <strong className="text-white">total educational costs</strong> including tuition, accommodation, and scholarships</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span className="text-slate-300 text-sm">Check <strong className="text-white">placement stats</strong> and average packages</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span className="text-slate-300 text-sm">Evaluate <strong className="text-white">faculty quality</strong> and campus infrastructure</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span className="text-slate-300 text-sm">Consider <strong className="text-white">location & industry connections</strong> for internships</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span className="text-slate-300 text-sm">Review <strong className="text-white">curriculum & specializations</strong> for your goals</span>
                            </div>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-800">
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <span className="text-blue-400">🎯</span>
                                <span><strong className="text-slate-300">Tip:</strong> Weight factors based on your priorities</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Comparison Table */}
                <div className="bg-black/80 border border-slate-800 rounded-2xl p-8 mb-10 shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-9 h-9 bg-emerald-900 rounded-lg flex items-center justify-center">
                            <span className="text-emerald-100 text-lg font-bold">📊</span>
                        </div>
                        <h2 className="font-bold text-white text-xl">Detailed Comparison</h2>
                    </div>
                    <CollegeComparison colleges={selectedColleges} />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-center gap-5">
                    <button
                        onClick={handleBackToExplore}
                        className="bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 shadow"
                    >
                        <span>←</span>
                        Back to College List
                    </button>
                    <button
                        onClick={handleStartNewSearch}
                        className="bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-800 hover:to-blue-950 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 shadow"
                    >
                        <span>🔍</span>
                        New Search
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Compare;