import React from 'react';
import { Star, Quote } from 'lucide-react';
import { SITE_BRAND_NAME_SENTENCE } from '../../constants/branding';

const testimonialsData = [
  {
    quote: `Prodigy AI Assistant on ${SITE_BRAND_NAME_SENTENCE} helped me craft a compelling profile. Within a month, I was shortlisted for three internships!`,
    name: 'Aisha Khan',
    title: 'Final-Year B.Com Student',

    rating: 5,
    skills: ['Profile Building', 'Internship Prep', 'Career Guidance']
  },
  {
    quote: `Thanks to ${SITE_BRAND_NAME_SENTENCE}, I secured my first internship at a leading automotive company. Their platform truly connects students with top employers.`,
    name: 'Harpreet Singh',
    title: 'Third-Year Mechanical Engineering Student',

    rating: 5,
    skills: ['Engineering', 'Internship', 'Career Matching']
  },
  {
    quote: `The Upskill feature on ${SITE_BRAND_NAME_SENTENCE} recommended free courses that enhanced my skills. I now feel confident applying for internships.`,
    name: 'Anjali Patel',
    title: 'Second-Year BBA Student',

    rating: 5,
    skills: ['Business', 'Skill Development', 'Online Learning']
  },
  {
    quote: `The Career Test from ${SITE_BRAND_NAME_SENTENCE} provided clarity on my future path. I'm now focused on pursuing engineering with a clear goal in mind.`,
    name: 'Ravi Kumar',
    title: 'Class 12 Science Student',

    rating: 5,
    skills: ['Career Test', 'Engineering', 'Goal Setting']
  },
  {
    quote: `Prodigy AI Assistant on ${SITE_BRAND_NAME_SENTENCE} guided me in building a profile that stands out. I've received multiple internship offers in the mental health sector.`,
    name: 'Simran Kaur',
    title: 'First-Year BA Psychology Student',

    rating: 5,
    skills: ['Psychology', 'Profile Building', 'Internship']
  },
  {
    quote: `Using the Career Test on ${SITE_BRAND_NAME_SENTENCE}, I discovered my passion for computer science. I'm now taking free coding courses to prepare for the future.`,
    name: 'Aarav Menon',
    title: 'Class 10 Student',
    rating: 5,
    skills: ['Career Test', 'Computer Science', 'Early Learning']
  }
];

const Testimonials = () => {
  return (
    <section id="success-stories" className="py-20 lg:py-28 bg-black relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0">


        {/* Grid lines on black background */}
        <div className="absolute inset-0 bg-black">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[length:50px_50px]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[length:50px_50px]" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16 lg:mb-20">
          <div className="inline-flex items-center justify-center py-3 px-6 mb-8 text-sm bg-white/[0.08] text-gray-300 border border-white/[0.15] rounded-full backdrop-blur-sm">
            <span className="font-medium">Success Stories</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-6">
            <span className="block bg-gradient-to-b from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
              Real People,
            </span>
            <span className="block bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent">
              Real Results
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-400 leading-relaxed font-light max-w-3xl mx-auto">
            {`Discover how ${SITE_BRAND_NAME_SENTENCE} has empowered thousands of students and professionals to transform their careers and achieve their goals.`}
          </p>
        </div>

        {/* Testimonial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {testimonialsData.map((testimonial, index) => (
            <div
              key={index}
              className="group relative bg-white/[0.05] backdrop-blur-sm border border-white/[0.12] p-8 rounded-2xl hover:scale-105 transition-all duration-300 ease-out overflow-hidden hover:bg-white/[0.08] hover:shadow-2xl hover:shadow-white/10"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Quote icon */}
              <Quote className="w-8 h-8 text-white/[0.20] mb-6 transform scale-x-[-1]" />

              {/* Rating */}
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-white/[0.60] fill-current" />
                ))}
              </div>

              {/* Testimonial content */}
              <blockquote className="text-gray-400 leading-relaxed mb-6 group-hover:text-gray-300 transition-colors duration-300 font-light">
                <p>"{testimonial.quote}"</p>
              </blockquote>

              {/* Skills tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {testimonial.skills.map((skill, skillIndex) => (
                  <span
                    key={skillIndex}
                    className="px-3 py-1 text-xs font-medium bg-white/[0.08] text-gray-400 border border-white/[0.15] rounded-full backdrop-blur-sm group-hover:bg-white/[0.12] group-hover:text-gray-300 transition-all duration-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Author info */}
              <div className="flex items-center pt-6 border-t border-white/[0.10]">
                <div className="relative">

                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white/[0.60] rounded-full border-2 border-black"></div>
                </div>
                <div className="ml-4">
                  <div className="font-semibold bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent group-hover:from-white group-hover:to-gray-200 transition-all duration-300">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-500 group-hover:text-gray-400 transition-colors duration-300">
                    {testimonial.title}
                  </div>
                </div>
              </div>

              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-white/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            </div>
          ))}
        </div>

        {/* Bottom stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16 border-t border-white/[0.10]">
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent">
              94%
            </div>
            <div className="text-sm text-gray-500 mt-1">Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent">
              10K+
            </div>
            <div className="text-sm text-gray-500 mt-1">Lives Changed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent">
              6 Months
            </div>
            <div className="text-sm text-gray-500 mt-1">Avg. Time to Success</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent">
              40%
            </div>
            <div className="text-sm text-gray-500 mt-1">Avg. Salary Increase</div>
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

export default Testimonials;