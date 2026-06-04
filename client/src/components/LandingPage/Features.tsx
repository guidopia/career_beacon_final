import React from 'react';
import { BrainCircuit, Target, CheckSquare, FileText, Zap, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SITE_BRAND_NAME_SENTENCE } from '../../constants/branding';

const featuresData = [
  {
    icon: BrainCircuit,
    title: 'AI Career Matching',
    description: 'Advanced machine learning algorithms analyze your skills, interests, personality, and values to identify optimal career paths tailored specifically for you.',
    benefits: ['Personalized recommendations', 'Market-aligned suggestions', 'Cultural fit analysis']
  },
  {
    icon: Target,
    title: 'Personalized Learning Roadmaps',
    description: 'Get customized step-by-step plans including courses, certifications, skills development, and key milestones to achieve your career goals.',
    benefits: ['Skills gap analysis', 'Timeline planning', 'Resource recommendations']
  },
  {
    icon: CheckSquare,
    title: 'Skill Assessment & Gap Analysis',
    description: 'Comprehensive evaluation of your current abilities and identification of skills needed for your target careers with resources to bridge the gaps.',
    benefits: ['Current skill mapping', 'Industry benchmarking', 'Learning path optimization']
  },
  {
    icon: FileText,
    title: 'Career Beacon Assistant™ Cultural Intelligence',
    description: 'Unique cultural intelligence module that understands how your background and values influence career fit and workplace compatibility.',
    benefits: ['Cultural alignment', 'Work environment matching', 'Value-based guidance']
  },
  {
    icon: Users,
    title: 'Expert Mentorship Network',
    description: 'Connect with industry professionals and career experts who provide personalized guidance, insights, and support throughout your journey.',
    benefits: ['1-on-1 sessions', 'Industry insights', 'Network building']
  },
  {
    icon: Zap,
    title: 'Real-time Market Intelligence',
    description: 'Stay updated with the latest industry trends, job market demands, and emerging opportunities to make informed career decisions.',
    benefits: ['Market trends', 'Salary insights', 'Growth opportunities']
  },
];

const Features = () => {
  return (
    <section id="features" className="py-20 lg:py-28 bg-black relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0">
      

        {/* Gradient overlays */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-white/[0.06] via-gray-500/[0.03] to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-white/[0.05] via-gray-400/[0.02] to-transparent rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16 lg:mb-20">
          <div className="inline-flex items-center justify-center py-3 px-6 mb-8 text-sm bg-white/[0.08] text-gray-300 border border-white/[0.15] rounded-full backdrop-blur-sm">
            <span className="font-medium">Your Success Toolkit</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-6">
            <span className="block bg-gradient-to-b from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
              Everything You Need to Navigate
            </span>
            <span className="block bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent">
              Your Career Path
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-400 leading-relaxed font-light max-w-3xl mx-auto">
            {`${SITE_BRAND_NAME_SENTENCE} combines powerful AI tools with expert insights and actionable guidance to accelerate your academic and professional journey toward success.`}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {featuresData.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative bg-white/[0.05] backdrop-blur-sm border border-white/[0.12] p-8 rounded-2xl hover:scale-105 transition-all duration-300 ease-out overflow-hidden hover:bg-white/[0.08] hover:shadow-2xl hover:shadow-white/10"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Feature icon */}
              <div className="relative w-16 h-16 bg-white/[0.10] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white/[0.15] transition-all duration-300">
                <feature.icon className="h-8 w-8 text-gray-300 group-hover:text-white transition-colors duration-300" strokeWidth={1.5} />
              </div>

              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-xl font-bold bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent mb-4 group-hover:from-white group-hover:to-gray-200 transition-all duration-300">
                  {feature.title}
                </h3>

                <p className="text-gray-400 leading-relaxed mb-6 group-hover:text-gray-300 transition-colors duration-300 font-light">
                  {feature.description}
                </p>

                {/* Benefits list */}
                <ul className="space-y-3">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-center text-sm text-gray-500 group-hover:text-gray-400 transition-colors duration-300">
                      <div className="w-2 h-2 rounded-full bg-white/[0.30] group-hover:bg-white/[0.50] mr-3 flex-shrink-0 transition-all duration-300"></div>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-white/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <div className="bg-white/[0.05] backdrop-blur-sm border border-white/[0.12] rounded-2xl p-8 relative overflow-hidden hover:bg-white/[0.08] transition-all duration-300 max-w-2xl mx-auto">
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent mb-4">
                Ready to unlock your potential?
              </h3>
              <p className="text-gray-400 mb-8 text-lg font-light leading-relaxed">
                Start your journey with our comprehensive career assessment
              </p>
              <Link to="/login" className="group relative px-12 py-4 bg-white text-black text-lg font-bold rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-white/20 border border-white/20 inline-flex items-center">
                <span className="relative z-10">Get Started Free</span>
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-white opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle decorative elements */}
      <div className="absolute bottom-40 right-20 w-3 h-3 bg-white/[0.12] rounded-full blur-sm" />
      <div className="absolute top-32 left-24 w-2 h-2 bg-white/[0.10] rounded-full blur-sm" />
      <div className="absolute top-2/3 right-32 w-4 h-4 bg-white/[0.08] rounded-full blur-sm" />
      <div className="absolute bottom-1/3 left-16 w-2 h-2 bg-white/[0.15] rounded-full blur-sm" />
    </section>
  );
};

export default Features;