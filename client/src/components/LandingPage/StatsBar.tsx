import React from 'react';
import { TrendingUp, Users, Target, Award, Star, Clock } from 'lucide-react';
import { SITE_BRAND_NAME_SENTENCE } from '../../constants/branding';

const StatsSection = () => {
  const stats = [
    {
      icon: TrendingUp,
      value: "94%",
      label: "Success Rate",
      description: "Career satisfaction improvement"
    },
    {
      icon: Users,
      value: "50K+",
      label: "Active Users",
      description: "Professionals guided to success"
    },
    {
      icon: Target,
      value: "89%",
      label: "Goal Achievement",
      description: "Within first 6 months"
    },
    {
      icon: Award,
      value: "4.9/5",
      label: "User Rating",
      description: "Based on 10,000+ reviews"
    },
    {
      icon: Clock,
      value: "3.2x",
      label: "Faster Results",
      description: "Compared to traditional methods"
    },
    {
      icon: Star,
      value: "95%",
      label: "Recommend",
      description: "Would recommend to others"
    }
  ];

  return (
    <section className="py-16 bg-black relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0">
      
        {/* Gradient overlays */}
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-gradient-to-br from-white/[0.06] via-gray-500/[0.03] to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-gradient-to-tr from-white/[0.05] via-gray-400/[0.02] to-transparent rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center py-3 px-6 mb-6 text-sm bg-white/[0.08] text-gray-300 border border-white/[0.15] rounded-full backdrop-blur-sm">
            <span className="font-medium">Trusted by Thousands</span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight mb-6">
            <span className="block bg-gradient-to-b from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
              Proven Track Record of
            </span>
            <span className="block bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent">
              Career Success
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-light">
            {`Join a thriving community of professionals who have transformed their careers with the intelligent guidance of ${SITE_BRAND_NAME_SENTENCE} and our proven methodology.`}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group relative bg-white/[0.05] backdrop-blur-sm border border-white/[0.12] p-6 rounded-2xl hover:scale-105 transition-all duration-300 ease-out overflow-hidden text-center hover:bg-white/[0.08] hover:shadow-2xl hover:shadow-white/10"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Icon */}
              <div className="relative w-12 h-12 bg-white/[0.10] rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-white/[0.15] transition-all duration-300">
                <stat.icon className="h-6 w-6 text-gray-300 group-hover:text-white transition-colors duration-300" strokeWidth={1.5} />
              </div>

              {/* Value */}
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent mb-2 group-hover:from-white group-hover:to-gray-200 transition-all duration-300">
                {stat.value}
              </div>

              {/* Label */}
              <div className="text-sm font-semibold text-gray-300 mb-2 group-hover:text-white transition-colors duration-300">
                {stat.label}
              </div>

              {/* Description */}
              <div className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors duration-300 leading-relaxed">
                {stat.description}
              </div>

              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-white/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            </div>
          ))}
        </div>

        {/* Bottom testimonial snippet */}
        <div className="text-center">
          <div className="max-w-4xl mx-auto bg-white/[0.05] backdrop-blur-sm border border-white/[0.12] rounded-2xl p-8 hover:bg-white/[0.08] transition-all duration-300">
            <div className="flex items-center justify-center mb-6">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-white fill-current opacity-80" />
                ))}
              </div>
              <span className="ml-3 text-gray-400 font-medium">Average rating from 10,000+ users</span>
            </div>
            <blockquote className="text-xl md:text-2xl text-gray-300 font-light leading-relaxed mb-4">
              <span className="text-white font-semibold">"These numbers speak for themselves.</span> {`${SITE_BRAND_NAME_SENTENCE} doesn't just provide assessments - `}<span className="text-gray-100 font-medium italic">they deliver real career transformations."</span>
            </blockquote>
            <div className="text-sm text-gray-500 font-medium">
              - Career Success Report 2024
            </div>
          </div>
        </div>
      </div>

      {/* Subtle decorative elements */}
      <div className="absolute bottom-32 left-20 w-3 h-3 bg-white/[0.12] rounded-full blur-sm" />
      <div className="absolute top-40 right-24 w-2 h-2 bg-white/[0.10] rounded-full blur-sm" />
      <div className="absolute bottom-1/2 left-32 w-4 h-4 bg-white/[0.08] rounded-full blur-sm" />
    </section>
  );
};

export default StatsSection;