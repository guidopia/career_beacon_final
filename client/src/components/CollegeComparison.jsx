import React, { useState } from 'react';

const CollegeComparison = ({ colleges }) => {
    const [showApplyInfo, setShowApplyInfo] = useState({});

    const handleApplyClick = (collegeIndex) => {
        setShowApplyInfo(prev => ({
            ...prev,
            [collegeIndex]: true
        }));
    };

    const hideApplyInfo = (collegeIndex) => {
        setShowApplyInfo(prev => ({
            ...prev,
            [collegeIndex]: false
        }));
    };

    if (!colleges || colleges.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-slate-400">No colleges selected for comparison</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto bg-black rounded-2xl shadow-xl p-2 sm:p-6">
            <table className="w-full bg-black rounded-2xl border border-slate-800 shadow-lg overflow-hidden">
                <thead>
                    <tr className="bg-gradient-to-r from-slate-900 via-black to-slate-900">
                        <th className="px-6 py-4 text-left text-base font-semibold text-white border-b border-slate-800 tracking-wide rounded-tl-2xl">
                            <span className="opacity-80">Comparison Factors</span>
                        </th>
                        {colleges.map((college, index) => (
                            <th
                                key={index}
                                className="px-6 py-4 text-left text-base font-semibold text-white border-b border-slate-800 min-w-64"
                            >
                                <div className="flex flex-col gap-1">
                                    <span className="font-bold text-lg text-white drop-shadow">{college.collegeName}</span>
                                    <span className="font-normal text-slate-400 text-xs">{college.location}, {college.country}</span>
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {/* Course */}
                    <tr className="border-b border-slate-800 hover:bg-slate-900/70 transition-colors">
                        <td className="px-6 py-4 font-medium text-white">Course</td>
                        {colleges.map((college, index) => (
                            <td key={index} className="px-6 py-4 text-slate-200">{college.course}</td>
                        ))}
                    </tr>

                    {/* Degree Type */}
                    <tr className="border-b border-slate-800 hover:bg-slate-900/70 transition-colors">
                        <td className="px-6 py-4 font-medium text-white">Degree Type</td>
                        {colleges.map((college, index) => (
                            <td key={index} className="px-6 py-4 text-slate-200">{college.degreeType}</td>
                        ))}
                    </tr>

                    {/* Tuition Fee */}
                    <tr className="border-b border-slate-800 hover:bg-slate-900/70 transition-colors">
                        <td className="px-6 py-4 font-medium text-white">Fee Category</td>
                        {colleges.map((college, index) => (
                            <td key={index} className="px-6 py-4">
                                <div className="text-emerald-400 font-semibold text-base">{college.tuitionFee}</div>
                                <div className="text-xs text-slate-500 mt-1">Check college website for exact amounts</div>
                            </td>
                        ))}
                    </tr>

                    {/* Duration */}
                    <tr className="border-b border-slate-800 hover:bg-slate-900/70 transition-colors">
                        <td className="px-6 py-4 font-medium text-white">Course Duration</td>
                        {colleges.map((college, index) => (
                            <td key={index} className="px-6 py-4 text-slate-200">{college.courseDuration}</td>
                        ))}
                    </tr>

                    {/* Ranking */}
                    <tr className="border-b border-slate-800 hover:bg-slate-900/70 transition-colors">
                        <td className="px-6 py-4 font-medium text-white">Ranking</td>
                        {colleges.map((college, index) => (
                            <td key={index} className="px-6 py-4">
                                <span className="bg-gradient-to-r from-indigo-700 to-blue-700 text-white text-xs px-4 py-1.5 rounded-lg font-semibold shadow-md border border-indigo-500/30 tracking-wide">
                                    {college.ranking}
                                </span>
                            </td>
                        ))}
                    </tr>

                    {/* Entrance Exams */}
                    <tr className="border-b border-slate-800 hover:bg-slate-900/70 transition-colors">
                        <td className="px-6 py-4 font-medium text-white">Entrance Exams</td>
                        {colleges.map((college, index) => (
                            <td key={index} className="px-6 py-4 text-blue-400 font-semibold">{college.entranceExams}</td>
                        ))}
                    </tr>

                    {/* Placement Package */}
                    <tr className="border-b border-slate-800 hover:bg-slate-900/70 transition-colors">
                        <td className="px-6 py-4 font-medium text-white">Avg. Placement Package</td>
                        {colleges.map((college, index) => (
                            <td key={index} className="px-6 py-4 text-purple-400 font-semibold">{college.placementData.averagePackage}</td>
                        ))}
                    </tr>

                    {/* Placement Percentage */}
                    <tr className="border-b border-slate-800 hover:bg-slate-900/70 transition-colors">
                        <td className="px-6 py-4 font-medium text-white">Placement Rate</td>
                        {colleges.map((college, index) => (
                            <td key={index} className="px-6 py-4 text-purple-400 font-semibold">{college.placementData.placementPercentage}</td>
                        ))}
                    </tr>

                    {/* Infrastructure */}
                    <tr className="border-b border-slate-800 hover:bg-slate-900/70 transition-colors">
                        <td className="px-6 py-4 font-medium text-white">Infrastructure</td>
                        {colleges.map((college, index) => (
                            <td key={index} className="px-6 py-4 text-slate-200">{college.infrastructure}</td>
                        ))}
                    </tr>

                    {/* Hostel Availability */}
                    <tr className="border-b border-slate-800 hover:bg-slate-900/70 transition-colors">
                        <td className="px-6 py-4 font-medium text-white">Hostel Facility</td>
                        {colleges.map((college, index) => (
                            <td key={index} className="px-6 py-4 text-slate-200">{college.hostelAvailability}</td>
                        ))}
                    </tr>

                    {/* Scholarships Available */}
                    <tr className="border-b border-slate-800 hover:bg-slate-900/70 transition-colors">
                        <td className="px-6 py-4 font-medium text-white">Scholarships</td>
                        {colleges.map((college, index) => (
                            <td key={index} className="px-6 py-4">
                                {college.scholarships.available ? (
                                    <div>
                                        <span className="text-emerald-400 font-semibold">✓ Available</span>
                                        <div className="text-sm text-slate-400 mt-1">
                                            <div>Amount: {college.scholarships.amount}</div>
                                            <div>Types: {college.scholarships.types.join(', ')}</div>
                                        </div>
                                    </div>
                                ) : (
                                    <span className="text-red-400 font-semibold">✗ Not Available</span>
                                )}
                            </td>
                        ))}
                    </tr>

                    {/* Pros */}
                    <tr className="border-b border-slate-800 hover:bg-slate-900/70 transition-colors">
                        <td className="px-6 py-4 font-medium text-white">Advantages</td>
                        {colleges.map((college, index) => (
                            <td key={index} className="px-6 py-4">
                                <ul className="space-y-1">
                                    {college.pros.map((pro, proIndex) => (
                                        <li key={proIndex} className="text-emerald-400 text-sm">
                                            ✓ {pro}
                                        </li>
                                    ))}
                                </ul>
                            </td>
                        ))}
                    </tr>

                    {/* Cons */}
                    <tr className="border-b border-slate-800 hover:bg-slate-900/70 transition-colors">
                        <td className="px-6 py-4 font-medium text-white">Disadvantages</td>
                        {colleges.map((college, index) => (
                            <td key={index} className="px-6 py-4">
                                <ul className="space-y-1">
                                    {college.cons.map((con, conIndex) => (
                                        <li key={conIndex} className="text-red-400 text-sm">
                                            ✗ {con}
                                        </li>
                                    ))}
                                </ul>
                            </td>
                        ))}
                    </tr>

                    {/* Apply Links */}
                    <tr className="hover:bg-slate-900/70 transition-colors">
                        <td className="px-6 py-4 font-medium text-white rounded-bl-2xl">Apply</td>
                        {colleges.map((college, index) => (
                            <td key={index} className="px-6 py-4 rounded-br-2xl">
                                <div className="space-y-2">
                                    <button
                                        onClick={() => handleApplyClick(index)}
                                        className="bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-800 hover:to-blue-950 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 transform hover:scale-105 w-full shadow"
                                    >
                                        Apply Now — We'll Guide You!
                                    </button>

                                    {/* Inline Apply Info */}
                                    {showApplyInfo[index] && (
                                        <div className="bg-black border border-slate-700 rounded-xl p-4 text-xs shadow-lg mt-2">
                                            <div className="flex justify-between items-start mb-2">
                                                <strong className="text-blue-300">How to Apply:</strong>
                                                <button
                                                    onClick={() => hideApplyInfo(index)}
                                                    className="text-slate-400 hover:text-white font-bold text-lg"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                            <p className="text-slate-300 mb-2">
                                                Visit <strong className="text-white">{college.collegeName}</strong>'s website
                                            </p>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        window.open('https://www.google.com/search?q=' + encodeURIComponent(college.collegeName + ' ' + college.course + ' application'), '_blank');
                                                    }}
                                                    className="bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-800 hover:to-blue-950 text-white px-3 py-1 rounded text-xs font-semibold transition-all duration-200 shadow"
                                                >
                                                    🔍 Search
                                                </button>
                                                <button
                                                    onClick={() => hideApplyInfo(index)}
                                                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1 rounded text-xs transition-all duration-200"
                                                >
                                                    Got it
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </td>
                        ))}
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default CollegeComparison;