import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GenerateCollegeCards from '../components/GenerateCollegeCards';

const CollegeExplore = () => {
    const navigate = useNavigate();
    const [userPreferences, setUserPreferences] = useState(null);

    useEffect(() => {
        // Get user preferences from memory (set in Home page)
        const preferences = window.userPreferences;

        if (!preferences) {
            // If no preferences found, redirect to home
            navigate('/college-home');
            return;
        }

        setUserPreferences(preferences);
    }, [navigate]);

    // Show loading while getting preferences
    if (!userPreferences) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <div className="w-12 h-12 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
                        <div className="absolute top-1 left-1 w-10 h-10 border-4 border-slate-800 border-t-emerald-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                    </div>
                    <p className="text-slate-300 mt-4 text-base">Loading your preferences...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                {/* Header - simplified and clean */}
                <div className="mb-6 sm:mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                        {/* Left side - Text + Application Tips box (takes ~65% width) */}
                        <div className="flex-1 lg:flex-[2]">
                            {/* Main heading */}
                            <div className="mb-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-800 to-emerald-800 rounded-xl flex items-center justify-center">
                                        <span className="text-white text-lg">🎯</span>
                                    </div>
                                    <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                                        Your Tailored College Recommendations
                                    </h1>
                                </div>
                            </div>

                            {/* Application Tips box */}
                            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4 sm:p-5">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-8 h-8 bg-emerald-800 rounded-lg flex items-center justify-center">
                                        <span className="text-emerald-100 text-sm font-bold">📝</span>
                                    </div>
                                    <h3 className="font-semibold text-white">Application Tips</h3>
                                </div>

                                <div className="space-y-3 text-sm">
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <span className="text-slate-300">These are <strong className="text-white">top-ranked colleges</strong> you can apply to directly from here</span>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <span className="text-slate-300">Click <strong className="text-white">"Apply Now"</strong> on any card to start your application process</span>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <span className="text-slate-300">Review <strong className="text-white">entrance exams, fees, and placements</strong> before applying</span>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <span className="text-slate-300">Check <strong className="text-white">scholarship eligibility</strong> to reduce your education costs</span>
                                    </div>
                                </div>

                                <div className="mt-4 pt-3 border-t border-slate-900/50">
                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                        <span className="text-emerald-400">💡</span>
                                        <span><strong className="text-slate-300">Tip:</strong> Apply to multiple colleges to increase your chances</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right side - Comparison guide box (takes ~35% width) */}
                        <div className="lg:flex-[1] lg:max-w-sm mt-15">
                            <div className="bg-slate-900/40 border border-slate-700 rounded-xl p-4 sm:p-5 h-full">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-8 h-8 bg-blue-800 rounded-lg flex items-center justify-center">
                                        <span className="text-blue-100 text-sm font-bold">⚡</span>
                                    </div>
                                    <h3 className="font-semibold text-white">Quick Compare Guide</h3>
                                </div>

                                <div className="space-y-2.5 text-sm">
                                    <div className="flex items-start gap-3">
                                        <div className="w-5 h-5 bg-blue-700 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                                            <span className="text-white text-xs">1</span>
                                        </div>
                                        <span className="text-slate-300">Click <strong className="text-white">"Compare"</strong> on any college card</span>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-5 h-5 bg-blue-700 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                                            <span className="text-white text-xs">2</span>
                                        </div>
                                        <span className="text-slate-300">Select up to <strong className="text-white">3 colleges</strong> maximum</span>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-5 h-5 bg-blue-700 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                                            <span className="text-white text-xs">3</span>
                                        </div>
                                        <span className="text-slate-300">Hit <strong className="text-white">"Compare Selected"</strong> button</span>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-5 h-5 bg-emerald-700 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                                            <span className="text-white text-xs">✓</span>
                                        </div>
                                        <span className="text-slate-300">View detailed <strong className="text-white">side-by-side analysis</strong></span>
                                    </div>
                                </div>

                                <div className="mt-4 pt-3 border-t border-slate-700">
                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                        <span className="text-yellow-400">💡</span>
                                        <span><strong className="text-slate-300">Pro tip:</strong> Compare fees, rankings, and placements easily</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* College Cards Component */}
                <GenerateCollegeCards userPreferences={userPreferences} />
            </div>
        </div>
    );
};

export default CollegeExplore;