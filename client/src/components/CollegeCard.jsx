import React, { useState } from 'react';
import { GraduationCap } from 'lucide-react';

const CollegeCard = ({ college, onAddToCompare, isSelected }) => {
    const [showApplyInfo, setShowApplyInfo] = useState(false);

    const handleAddToCompare = () => {
        onAddToCompare(college);
    };

    const handleApplyClick = () => {
        setShowApplyInfo(true);
    };

    return (
        <div className="bg-black border border-slate-800 rounded-2xl hover:border-blue-700 transition-all duration-300 p-6 hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.45)] group relative overflow-hidden h-full flex flex-col shadow-lg">
            {/* Subtle glassy shine effect */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-1/2 h-1/3 bg-gradient-to-br from-white/10 via-transparent to-transparent blur-2xl opacity-30 group-hover:opacity-60 transition-opacity duration-700" />
                <div className="absolute bottom-0 right-0 w-1/3 h-1/4 bg-gradient-to-tr from-blue-700/10 via-transparent to-transparent blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-700" />
            </div>

            {/* Header - Clean Vertical Layout */}
            <div className="mb-5 relative z-10">
                {/* Top Right Icon */}
                <div className="absolute top-0 right-0">
                    <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl flex items-center justify-center shadow-xl border-2 border-slate-900">
                        <GraduationCap className="w-5 h-5 text-white drop-shadow" />
                    </div>
                </div>

                {/* College Info - Clean Left Alignment */}
                <div className="pr-14">
                    <h3 className="text-xl font-extrabold text-white tracking-tight leading-tight break-words mb-1.5 drop-shadow">
                        {college.collegeName}
                    </h3>
                    <p className="text-slate-400 text-sm mb-0.5">{college.location}, {college.country}</p>
                    <p className="text-blue-400 font-semibold text-sm mb-2">{college.course}</p>
                </div>

                {/* Ranking Badge */}
                <div className="flex justify-start">
                    <div className="bg-gradient-to-r from-indigo-700 to-blue-700 text-white text-xs px-4 py-1.5 rounded-lg font-semibold shadow-md border border-indigo-500/30 tracking-wide">
                        {college.ranking}
                    </div>
                </div>
            </div>

            {/* Key Info Grid */}
            <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="bg-black/70 border border-slate-700 rounded-xl p-4 hover:border-blue-500/60 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 group/card">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-slate-800 rounded-md flex items-center justify-center group-hover/card:bg-blue-500/20 transition-colors">
                            <span className="text-slate-400 text-base group-hover/card:text-blue-400">📚</span>
                        </div>
                        <span className="text-slate-400 text-xs font-medium">Degree • Duration</span>
                    </div>
                    <p className="text-white text-sm font-semibold">{college.degreeType} • {college.courseDuration}</p>
                </div>
                <div className="bg-black/70 border border-slate-700 rounded-xl p-4 hover:border-emerald-500/60 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 group/card">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-slate-800 rounded-md flex items-center justify-center group-hover/card:bg-emerald-500/20 transition-colors">
                            <span className="text-slate-400 text-base group-hover/card:text-emerald-400">💳</span>
                        </div>
                        <span className="text-slate-400 text-xs font-medium">Fee Category</span>
                    </div>
                    <p className="text-emerald-400 text-sm font-semibold">{college.tuitionFee}</p>
                </div>
            </div>

            {/* Placement & Entrance */}
            <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="bg-black/70 border border-slate-700 rounded-xl p-3 text-center hover:border-blue-500/60 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
                    <span className="text-slate-400 text-xs font-medium block mb-2">Entrance</span>
                    <p className="text-blue-400 text-sm font-semibold">{college.entranceExams}</p>
                </div>
                <div className="bg-black/70 border border-slate-700 rounded-xl p-3 text-center hover:border-purple-500/60 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
                    <span className="text-slate-400 text-xs font-medium block mb-2">Avg Package</span>
                    <p className="text-purple-400 text-sm font-semibold">{college.placementData.averagePackage}</p>
                </div>
                <div className="bg-black/70 border border-slate-700 rounded-xl p-3 text-center hover:border-purple-500/60 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
                    <span className="text-slate-400 text-xs font-medium block mb-2">Placement</span>
                    <p className="text-purple-400 text-sm font-semibold">{college.placementData.placementPercentage}</p>
                </div>
            </div>

            {/* Scholarships */}
            {college.scholarships.available && (
                <div className="bg-black/70 border border-emerald-600/60 rounded-lg p-3 mb-4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent pointer-events-none"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-5 h-5 bg-emerald-500 rounded-md flex items-center justify-center">
                                <span className="text-white text-xs">💰</span>
                            </div>
                            <span className="text-emerald-300 text-sm font-semibold">Scholarships Available</span>
                        </div>
                        <div className="text-xs text-slate-300 space-y-1">
                            <p><span className="text-emerald-400 font-medium">Types:</span> {college.scholarships.types.join(', ')}</p>
                            <p><span className="text-emerald-400 font-medium">Amount:</span> {college.scholarships.amount}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Description */}
            <div className="mb-5 relative z-10">
                <div className="bg-black/60 border border-slate-700 rounded-xl p-4">
                    <p className="text-slate-300 text-sm leading-relaxed">{college.description}</p>
                </div>
            </div>

            {/* Pros and Cons */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-black/70 border border-emerald-600/50 rounded-lg p-3 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent pointer-events-none"></div>
                    <div className="relative z-10">
                        <h4 className="text-emerald-300 text-sm font-semibold mb-2 flex items-center gap-2">
                            <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs">✓</span>
                            </div>
                            Pros
                        </h4>
                        <ul className="space-y-1">
                            {college.pros.slice(0, 3).map((pro, index) => (
                                <li key={index} className="text-slate-300 text-xs flex items-start gap-1">
                                    <span className="text-emerald-400 mt-0.5">•</span>
                                    <span>{pro}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="bg-black/70 border border-red-600/50 rounded-lg p-3 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent pointer-events-none"></div>
                    <div className="relative z-10">
                        <h4 className="text-red-300 text-sm font-semibold mb-2 flex items-center gap-2">
                            <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs">✗</span>
                            </div>
                            Cons
                        </h4>
                        <ul className="space-y-1">
                            {college.cons.slice(0, 3).map((con, index) => (
                                <li key={index} className="text-slate-300 text-xs flex items-start gap-1">
                                    <span className="text-red-400 mt-0.5">•</span>
                                    <span>{con}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Apply Info */}
            {showApplyInfo && (
                <div className="bg-black/80 border border-blue-600/60 rounded-lg p-3 mb-4 relative overflow-hidden shadow-lg">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent pointer-events-none"></div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-blue-300 text-sm font-semibold">How to Apply</span>
                            <button
                                onClick={() => setShowApplyInfo(false)}
                                className="text-slate-400 hover:text-white transition-colors"
                            >
                                ×
                            </button>
                        </div>
                        <p className="text-slate-300 text-xs mb-3">
                            Visit <strong className="text-white">{college.collegeName}</strong> website for {college.course}
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    window.open('https://www.google.com/search?q=' + encodeURIComponent(college.collegeName + ' ' + college.course + ' application'), '_blank');
                                }}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 shadow-lg"
                            >
                                🔍 Search
                            </button>
                            <button
                                onClick={() => setShowApplyInfo(false)}
                                className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-xs transition-all duration-200"
                            >
                                Got it
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Premium Action Buttons */}
            <div className="flex gap-4 relative z-10">
                <button
                    onClick={handleApplyClick}
                    className="flex-1 bg-gradient-to-r from-blue-800 via-blue-900 to-indigo-900 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 text-white py-3 px-6 rounded-xl text-sm font-bold transition-all duration-300 transform hover:scale-[1.03] hover:shadow-2xl hover:shadow-blue-700/30 active:scale-[0.98] relative overflow-hidden group/btn"
                >
                    <span className="relative z-10">Apply Now — We'll Guide You!</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                </button>
                <button
                    onClick={handleAddToCompare}
                    className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.98] relative overflow-hidden border ${
                        isSelected
                            ? 'bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl border-emerald-700'
                            : 'bg-black/70 hover:bg-slate-800 text-slate-300 hover:text-white shadow-lg border-slate-700 hover:border-blue-500'
                    }`}
                >
                    <span className="relative z-10">{isSelected ? 'Remove' : 'Compare'}</span>
                </button>
            </div>
        </div>
    );
};

export default CollegeCard;