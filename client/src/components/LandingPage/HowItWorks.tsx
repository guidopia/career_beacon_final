import React from 'react';
import { Search, Bot, FileEdit, Briefcase, ArrowRight } from 'lucide-react';

const steps = [
  {
    id: 1,
    icon: Search,
    name: 'Take Your Assessment',
    description: 'Complete our comprehensive AI-driven career assessment and cultural intelligence analysis. We evaluate your skills, interests, values, and personality to understand your unique profile.',
    features: ['15-minute smart assessment', 'Cultural fit analysis', 'Skills evaluation', 'Interest mapping']
  },
  {
    id: 2,
    icon: Bot,
    name: 'Discover Perfect Matches',
    description: 'Our advanced AI algorithms analyze your profile against thousands of career paths and current market data to suggest personalized opportunities you might never have considered.',
    features: ['AI-powered matching', 'Market trend analysis', 'Hidden opportunities', 'Compatibility scoring']
  },
  {
    id: 3,
    icon: FileEdit,
    name: 'Get Your Roadmap',
    description: 'Receive a detailed, actionable roadmap with specific courses, certifications, skills to develop, and experiences needed to successfully transition into your chosen career path.',
    features: ['Step-by-step plan', 'Timeline guidance', 'Resource recommendations', 'Milestone tracking']
  },
  {
    id: 4,
    icon: Briefcase,
    name: 'Achieve Success',
    description: 'Execute your plan with curated learning resources, progress tracking, expert mentorship, and continuous support. Build confidence and skills to excel in your chosen field.',
    features: ['Expert mentorship', 'Progress tracking', 'Skill building', 'Network access']
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-black relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0">
      
        {/* Gradient overlays */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-white/[0.06] via-gray-500/[0.03] to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tr from-white/[0.05] via-gray-400/[0.02] to-transparent rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16 lg:mb-20">
          <div className="inline-flex items-center justify-center py-3 px-6 mb-8 text-sm bg-white/[0.08] text-gray-300 border border-white/[0.15] rounded-full backdrop-blur-sm">
            <span className="font-medium">Simple Process</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-6">
            <span className="block bg-gradient-to-b from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
              Your Path to
            </span>
            <span className="block bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent">
              Career Clarity
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-400 leading-relaxed font-light max-w-3xl mx-auto">
            Follow our intelligent, data-driven process to discover your ideal career path and create a roadmap for success in just four simple steps.
          </p>
        </div>

        {/* Steps Container */}
        <div className="relative">
          {/* Progress Line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-white/[0.20] via-white/[0.15] to-white/[0.20] transform -translate-x-1/2"></div>

          <div className="space-y-16 lg:space-y-24">
            {steps.map((step, index) => (
              <div key={step.id} className={`relative flex flex-col lg:flex-row items-center gap-8 lg:gap-16 ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                {/* Step Number Background */}
                <div className={`absolute ${index % 2 !== 0 ? 'lg:right-full lg:-mr-20' : 'lg:left-full lg:-ml-20'} hidden lg:block text-[8rem] font-black text-white/[0.03] -z-10 select-none leading-none`}>
                  0{step.id}
                </div>

                {/* Content */}
                <div className="lg:w-1/2 space-y-6 text-center lg:text-left relative z-10">
                  {/* Step indicator */}
                  <div className="flex items-center justify-center lg:justify-start space-x-4 mb-6">
                    <div className="text-sm font-semibold text-gray-500 bg-white/[0.08] px-3 py-1 rounded-full border border-white/[0.15]">
                      Step {step.id}
                    </div>
                  </div>

                  <h3 className="text-2xl lg:text-3xl font-bold bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent leading-tight">
                    {step.name}
                  </h3>

                  <p className="text-lg text-gray-400 leading-relaxed max-w-lg mx-auto lg:mx-0 font-light">
                    {step.description}
                  </p>

                  {/* Features list */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto lg:mx-0">
                    {step.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center text-sm text-gray-500">
                        <div className="w-1.5 h-1.5 rounded-full bg-white/[0.40] mr-3 flex-shrink-0"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Visual Representation */}
                <div className="lg:w-1/2 relative flex items-center justify-center">
                  {/* Main Circle with Icon */}
                  <div className="relative">
                    <div className="w-48 h-48 bg-white/[0.05] backdrop-blur-sm border border-white/[0.12] rounded-full flex items-center justify-center group hover:bg-white/[0.08] transition-all duration-500">
                      <div className="w-32 h-32 bg-white/[0.10] rounded-full flex items-center justify-center group-hover:bg-white/[0.15] transition-all duration-300">
                        <step.icon className="h-16 w-16 text-gray-300 group-hover:text-white transition-colors duration-300" strokeWidth={1} />
                      </div>
                    </div>

                    {/* Step Number */}
                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-white text-black rounded-full flex items-center justify-center text-lg font-bold shadow-2xl shadow-white/20">
                      {step.id}
                    </div>

                    {/* Floating Elements */}
                    <div className="absolute -top-8 -left-8 w-4 h-4 bg-white/[0.15] rounded-full blur-sm"></div>
                    <div className="absolute -bottom-6 -right-8 w-3 h-3 bg-white/[0.12] rounded-full blur-sm"></div>
                    <div className="absolute -bottom-8 left-6 w-2 h-2 bg-white/[0.10] rounded-full blur-sm"></div>

                    {/* Orbital rings */}
                    <div className="absolute inset-0 border border-white/[0.05] rounded-full animate-pulse" style={{ width: '120%', height: '120%', top: '-10%', left: '-10%' }}></div>
                    <div className="absolute inset-0 border border-white/[0.03] rounded-full animate-pulse" style={{ width: '140%', height: '140%', top: '-20%', left: '-20%', animationDelay: '1s' }}></div>
                  </div>
                </div>

                {/* Connection Line for Mobile */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center mt-8">
                    <div className="flex flex-col items-center space-y-2">
                      <ArrowRight className="w-5 h-5 text-gray-500 rotate-90" />
                      <div className="w-px h-8 bg-gradient-to-b from-white/[0.20] to-transparent"></div>
                    </div>
                  </div>
                )}

                {/* Progress Line Node */}
                <div className="hidden lg:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white/[0.20] rounded-full border-4 border-black"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
       
      </div>

      {/* Subtle decorative elements */}
      <div className="absolute bottom-32 left-20 w-3 h-3 bg-white/[0.12] rounded-full blur-sm" />
      <div className="absolute top-40 right-24 w-2 h-2 bg-white/[0.10] rounded-full blur-sm" />
      <div className="absolute top-1/2 left-32 w-4 h-4 bg-white/[0.08] rounded-full blur-sm" />
      <div className="absolute bottom-1/4 right-16 w-2 h-2 bg-white/[0.15] rounded-full blur-sm" />
    </section>
  );
};

export default HowItWorks;