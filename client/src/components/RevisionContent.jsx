import React, { useState } from 'react';

const RevisionContent = ({ revisionData, chapterInfo, onStartQuiz }) => {
    const [expandedSections, setExpandedSections] = useState({
        introduction: true,
        theory: true,
        formulas: true,
        quick: false
    });

    const revision = revisionData.revision;

    // Toggle section expansion
    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    // Enhanced Section Header
    const SectionHeader = ({ title, section, icon, isExpanded }) => (
        <button
            onClick={() => toggleSection(section)}
            className="w-full flex items-center justify-between p-3 sm:p-4 bg-gray-950 hover:bg-gray-900 rounded-lg border border-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
            <div className="flex items-center">
                <span className="text-base sm:text-lg mr-2 sm:mr-3">{icon}</span>
                <h3 className="text-base sm:text-lg font-bold text-white">{title}</h3>
            </div>
            <svg
                className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform text-gray-400 ${isExpanded ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        </button>
    );

    return (
        <div className="space-y-4 sm:space-y-6 px-4">
            {/* Enhanced Chapter Overview */}
            <div className="bg-gray-950 rounded-xl p-4 sm:p-6 border border-gray-700 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
                    <h2 className="text-xl sm:text-2xl font-bold text-white">
                        {revisionData.chapterName}
                    </h2>
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-medium self-start sm:self-auto">
                        {revisionData.examName}
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-center">
                    <div className="p-3 sm:p-4 bg-gray-900 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
                        <p className="text-xs text-gray-400 mb-1 sm:mb-2 uppercase tracking-wide">Difficulty</p>
                        <p className="text-sm sm:text-base font-semibold text-white capitalize">{chapterInfo?.difficulty}</p>
                    </div>
                    <div className="p-3 sm:p-4 bg-gray-900 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
                        <p className="text-xs text-gray-400 mb-1 sm:mb-2 uppercase tracking-wide">Importance</p>
                        <div className="flex items-center justify-center">
                            <div className={`w-2 h-2 rounded-full mr-2 ${chapterInfo?.importance === 'High' ? 'bg-red-400' :
                                    chapterInfo?.importance === 'Medium' ? 'bg-orange-400' :
                                        'bg-green-400'
                                }`}></div>
                            <p className={`text-sm sm:text-base font-semibold ${chapterInfo?.importance === 'High' ? 'text-red-400' :
                                    chapterInfo?.importance === 'Medium' ? 'text-orange-400' :
                                        'text-green-400'
                                }`}>
                                {chapterInfo?.importance}
                            </p>
                        </div>
                    </div>
                    <div className="p-3 sm:p-4 bg-gray-900 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
                        <p className="text-xs text-gray-400 mb-1 sm:mb-2 uppercase tracking-wide">Weightage</p>
                        <p className="text-sm sm:text-base font-semibold text-white">{chapterInfo?.weightage}</p>
                    </div>
                </div>
            </div>

            {/* Introduction */}
            <div className="space-y-2 sm:space-y-3">
                <SectionHeader
                    title="Introduction"
                    section="introduction"
                    icon="📚"
                    isExpanded={expandedSections.introduction}
                />

                {expandedSections.introduction && (
                    <div className="bg-gray-950 rounded-lg border border-gray-700 shadow-lg">
                        <div className="p-4 sm:p-6">
                            <p className="text-sm sm:text-base text-gray-200 leading-relaxed mb-4 sm:mb-6">
                                {revision.introduction?.overview}
                            </p>

                            {revision.introduction?.examImportance && (
                                <div className="bg-gray-900 p-3 sm:p-4 rounded-lg border border-gray-700 border-l-4 border-l-blue-500">
                                    <h4 className="text-sm sm:text-base font-semibold text-white mb-2">Why This Chapter Matters</h4>
                                    <p className="text-sm sm:text-base text-gray-200 leading-relaxed">
                                        {revision.introduction?.examImportance}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Core Concepts */}
            <div className="space-y-2 sm:space-y-3">
                <SectionHeader
                    title="Core Concepts"
                    section="theory"
                    icon="🎯"
                    isExpanded={expandedSections.theory}
                />

                {expandedSections.theory && (
                    <div className="bg-gray-950 rounded-lg p-4 sm:p-6 border border-gray-700 shadow-lg">
                        <div className="space-y-4 sm:space-y-6">
                            {revision.coreTheory?.map((topic, index) => (
                                <div key={index} className="border-b border-gray-800 last:border-b-0 pb-4 sm:pb-6 last:pb-0">
                                    <div className="flex items-start mb-3 sm:mb-4">
                                        <span className="bg-white text-black w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold mr-3 sm:mr-4 mt-1 flex-shrink-0">
                                            {index + 1}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3">
                                                {topic.topic}
                                            </h3>

                                            <div className="bg-gray-900 p-3 sm:p-4 rounded-lg border border-gray-700 mb-3 sm:mb-4">
                                                <p className="text-sm sm:text-base text-gray-200 font-medium">
                                                    {topic.definition || topic.explanation}
                                                </p>
                                            </div>

                                            {topic.definition && topic.explanation && (
                                                <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-3 sm:mb-4">
                                                    {topic.explanation}
                                                </p>
                                            )}

                                            {topic.keyPoints && topic.keyPoints.length > 0 && (
                                                <div className="space-y-2 mb-3 sm:mb-4">
                                                    {topic.keyPoints.map((point, idx) => (
                                                        <div key={idx} className="flex items-start">
                                                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-2 sm:mr-3 flex-shrink-0"></div>
                                                            <p className="text-sm sm:text-base text-gray-200">{point}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {topic.examples && topic.examples.length > 0 && (
                                                <div className="bg-gray-900 p-3 sm:p-4 rounded-lg border border-gray-700">
                                                    <h5 className="text-sm sm:text-base font-semibold text-white mb-2">Examples:</h5>
                                                    <div className="space-y-1">
                                                        {topic.examples.map((example, idx) => (
                                                            <p key={idx} className="text-sm sm:text-base text-gray-300">
                                                                • {example}
                                                            </p>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Important Formulas */}
            <div className="space-y-2 sm:space-y-3">
                <SectionHeader
                    title="Important Formulas"
                    section="formulas"
                    icon="⚡"
                    isExpanded={expandedSections.formulas}
                />

                {expandedSections.formulas && (
                    <div className="bg-gray-950 rounded-lg p-4 sm:p-6 border border-gray-700 shadow-lg">
                        <div className="space-y-4 sm:space-y-6">
                            {revision.importantFormulas?.map((item, index) => (
                                <div key={index} className="border-b border-gray-800 last:border-b-0 pb-4 sm:pb-6 last:pb-0">
                                    <div className="flex items-start mb-3 sm:mb-4">
                                        <span className="bg-blue-600 text-white w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold mr-3 sm:mr-4 mt-1 flex-shrink-0">
                                            {index + 1}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">
                                                {item.name}
                                            </h3>

                                            {item.formula && (
                                                <div className="bg-gray-900 border border-gray-600 p-3 sm:p-5 rounded-lg font-mono text-base sm:text-xl text-center text-white font-semibold mb-3 sm:mb-4 shadow-lg overflow-x-auto">
                                                    {item.formula}
                                                </div>
                                            )}

                                            {item.keyPoint && !item.formula && (
                                                <div className="bg-green-600 text-white p-3 sm:p-4 rounded-lg text-center font-semibold mb-3 sm:mb-4 text-sm sm:text-base">
                                                    {item.keyPoint}
                                                </div>
                                            )}

                                            <p className="text-sm sm:text-base text-gray-200 leading-relaxed">
                                                {item.explanation}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Quick Reference */}
            <div className="space-y-2 sm:space-y-3">
                <SectionHeader
                    title="Quick Reference"
                    section="quick"
                    icon="⚡"
                    isExpanded={expandedSections.quick}
                />

                {expandedSections.quick && (
                    <div className="bg-gray-950 rounded-lg p-4 sm:p-6 border border-gray-700 shadow-lg">

                        {/* Quick Formulas */}
                        {revision.quickReference?.quickFormulas && revision.quickReference.quickFormulas.length > 0 && (
                            <div className="mb-4 sm:mb-6">
                                <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Quick Formulas</h3>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                                    {revision.quickReference.quickFormulas.map((item, index) => (
                                        <div key={index} className="bg-gray-900 p-3 sm:p-4 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
                                            {item.formula ? (
                                                <div className="bg-gray-700 text-white p-2 sm:p-3 rounded-lg font-mono text-center font-semibold mb-2 text-sm sm:text-base overflow-x-auto">
                                                    {item.formula}
                                                </div>
                                            ) : (
                                                <div className="bg-gray-700 text-white p-2 sm:p-3 rounded-lg text-center font-semibold mb-2 text-sm sm:text-base">
                                                    {item.point}
                                                </div>
                                            )}
                                            <p className="text-xs sm:text-sm text-gray-300">{item.use}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Summary Points */}
                        {revision.quickReference?.summaryPoints && revision.quickReference.summaryPoints.length > 0 && (
                            <div>
                                <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Key Takeaways</h3>
                                <div className="space-y-2 sm:space-y-3">
                                    {revision.quickReference.summaryPoints.map((point, index) => (
                                        <div key={index} className="flex items-start p-3 sm:p-4 bg-gray-900 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
                                            <span className="bg-blue-600 text-white w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs font-bold mr-2 sm:mr-3 mt-0.5 flex-shrink-0">
                                                {index + 1}
                                            </span>
                                            <p className="text-sm sm:text-base text-gray-200 font-medium">{point}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RevisionContent;