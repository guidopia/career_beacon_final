import React from 'react';
import { ArrowRight, Sparkles, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SITE_BRAND_NAME_SENTENCE } from '../../constants/branding';

const CTA = () => {
  return (
    <section id="get-started" className="relative py-24 sm:py-32 bg-black overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        {/* Grid pattern */}
       

        {/* Larger grid for depth */}
        
        {/* Gradient overlays */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-white/[0.06] via-gray-500/[0.03] to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-white/[0.05] via-gray-400/[0.02] to-transparent rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Panel wrapper */}
        <div className="bg-white/[0.05] backdrop-blur-sm border border-white/[0.12] rounded-2xl p-12 relative overflow-hidden hover:bg-white/[0.08] transition-all duration-300">
          <div className="relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center justify-center py-3 px-6 mb-8 text-sm bg-white/[0.08] text-gray-300 border border-white/[0.15] rounded-full backdrop-blur-sm">
              <Zap className="w-4 h-4 mr-2" />
              <span className="font-medium">Ready to Transform Your Career?</span>
            </div>

            {/* Main heading */}
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight mb-8">
              <span className="block bg-gradient-to-b from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
                Supercharge Your
              </span>
              <span className="block bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent">
                Career Journey
              </span>
            </h2>

            <p className="mt-6 text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-12 font-light">
              Join thousands who have discovered their perfect career path with AI-powered insights and personalized roadmaps designed for your success.
            </p>

            {/* CTA Buttons */}
           

            {/* Trust indicators */}

          </div>

          {/* Hover effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-white/[0.01] opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
        </div>

        {/* Bottom testimonial */}
        <div className="mt-12 bg-white/[0.05] backdrop-blur-sm border border-white/[0.12] rounded-2xl p-8 relative overflow-hidden hover:bg-white/[0.08] transition-all duration-300">
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-white/[0.60] text-xl">★</span>
                ))}
              </div>
              <span className="ml-3 text-gray-400 text-sm font-medium">4.9/5 from 10,000+ users</span>
            </div>
            <blockquote className="text-gray-400 italic text-lg max-w-3xl mx-auto leading-relaxed font-light">
              {`"`}
              <span className="text-white font-semibold">{`${SITE_BRAND_NAME_SENTENCE} changed my entire career trajectory.`}</span>
              {` The AI assessment was incredibly accurate, and the roadmap helped me land my dream job in just 4 months!"`}
            </blockquote>
            <div className="mt-4 text-sm text-gray-500 font-medium">
              - Sarah Chen, Software Engineer at Meta
            </div>
          </div>
        </div>
      </div>

      {/* Subtle decorative elements */}
      <div className="absolute bottom-20 right-20 w-4 h-4 bg-white/[0.15] rounded-full blur-sm" />
      <div className="absolute top-40 left-20 w-2 h-2 bg-white/[0.12] rounded-full blur-sm" />
      <div className="absolute top-1/2 right-32 w-3 h-3 bg-white/[0.10] rounded-full blur-sm" />
      <div className="absolute bottom-1/3 left-32 w-2 h-2 bg-white/[0.08] rounded-full blur-sm" />
    </section>
  );
};

export default CTA;