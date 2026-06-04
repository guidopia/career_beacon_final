import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SITE_BRAND_NAME_SENTENCE } from '../../constants/branding';

interface FAQData {
  question: string;
  answer: string;
}

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="group bg-white/[0.05] backdrop-blur-sm border border-white/[0.12] rounded-2xl overflow-hidden hover:bg-white/[0.08] transition-all duration-300 relative">
      <button
        className="flex justify-between items-center w-full p-6 text-left focus:outline-none focus:ring-2 focus:ring-white/[0.20] focus:ring-inset relative z-10"
        onClick={onClick}
        aria-expanded={isOpen}
      >
        <span className="text-lg font-semibold bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent group-hover:from-white group-hover:to-gray-200 transition-all duration-300 pr-8">
          {question}
        </span>
        <ChevronDown
          className={`flex-shrink-0 w-6 h-6 text-gray-400 group-hover:text-white transform transition-all duration-300 ${isOpen ? 'rotate-180 text-white' : 'rotate-0'
            }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out relative z-10 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
      >
        <div className="px-6 pb-6">
          <div className="text-gray-400 leading-relaxed border-t border-white/[0.10] pt-4 font-light">
            {answer}
          </div>
        </div>
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-white/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
    </div>
  );
};

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs: FAQData[] = [
    {
      question: `What is ${SITE_BRAND_NAME_SENTENCE}?`,
      answer: `${SITE_BRAND_NAME_SENTENCE} is an AI-powered platform designed to help students between the ages of 14–26 explore careers, prepare for exams, upskill, connect with mentors, and plan their academic journey.`
    },
    {
      question: `Who should use ${SITE_BRAND_NAME_SENTENCE}?`,
      answer: `School students (Class 9–12), college students, freshers, and anyone unsure about their career or college path can benefit from ${SITE_BRAND_NAME_SENTENCE}.`
    },
    {
      question: "What is the pricing?",
      answer: `${SITE_BRAND_NAME_SENTENCE} offers flexible plans starting from ₹500. The most popular plans are ₹1500/year (all modules) and ₹2000/year (all modules + 1:1 counseling session).`
    },
    {
      question: `Is 1:1 counseling available on ${SITE_BRAND_NAME_SENTENCE}?`,
      answer: "Yes, we offer one-on-one career counseling sessions with experienced experts as part of the ₹2000 Premium Plan."
    },
    {
      question: "What is the Career Assessment module?",
      answer: "A fun, personalized quiz that helps you discover your strengths, personality, and ideal career options based on your responses."
    },
    {
      question: "Can I retake the career assessment later?",
      answer: "Yes, you can retake the test whenever your preferences or interests change."
    },
    {
      question: "What do I get in the Upskilling module?",
      answer: "AI-powered micro-courses, interactive lessons, and real-world projects to help you build valuable skills and track your growth."
    },
    {
      question: "How does Exam AI work?",
      answer: "It creates personalized study plans, shares smart practice questions, and offers exam strategies to prepare for exams like JEE, CUET, and others."
    },
    {
      question: "What can I do with the College Search module?",
      answer: "You can find colleges that match your goals based on location, course, cutoffs, and more—all in one place."
    },
    {
      question: "Who are the mentors in Mentor Connect?",
      answer: "Real professionals and industry experts who answer your questions and guide you based on their experience."
    },
    {
      question: "What is the Future Me Card?",
      answer: "A creative digital space to define your future goals, the person you want to become, and track your progress toward that vision."
    },
    {
      question: "What is Career Beacon Assistant?",
      answer: `Career Beacon Assistant is the AI chatbot on ${SITE_BRAND_NAME_SENTENCE} that helps you with personalized guidance, solves doubts, and supports your academic and career needs.`
    },
    {
      question: "How long does a subscription last?",
      answer: "All plans are valid for 365 days from the date of activation."
    },
    {
      question: "Can I upgrade from a lower plan to a higher one later?",
      answer: "Yes, you can upgrade anytime by paying the difference amount."
    },
    {
      question: "Do you offer refunds?",
      answer: `No. ${SITE_BRAND_NAME_SENTENCE} follows a strict no-refund policy once a subscription is activated.`
    },
    {
      question: "How can I get help or support?",
      answer: "Use the in-app support feature or email us at support@guidopia.com for any issues or questions."
    }
  ];

  return (
    <section id="faq" className="py-20 lg:py-28 bg-black relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0">


        {/* Gradient overlays */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-white/[0.06] via-gray-500/[0.03] to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tr from-white/[0.05] via-gray-400/[0.02] to-transparent rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16 lg:mb-20">
          <div className="inline-flex items-center justify-center py-3 px-6 mb-8 text-sm bg-white/[0.08] text-gray-300 border border-white/[0.15] rounded-full backdrop-blur-sm">
            <HelpCircle className="w-4 h-4 mr-2" />
            <span className="font-medium">Got Questions?</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-6">
            <span className="block bg-gradient-to-b from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
              Frequently Asked
            </span>
            <span className="block bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-400 leading-relaxed font-light max-w-3xl mx-auto">
            {`Find answers to common questions about ${SITE_BRAND_NAME_SENTENCE}, its AI-powered career guidance, and how it can transform your professional journey.`}
          </p>
        </div>

        <div className="space-y-6 mb-16">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onClick={() => handleToggle(index)}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <div className="bg-white/[0.05] backdrop-blur-sm border border-white/[0.12] rounded-2xl p-8 relative overflow-hidden hover:bg-white/[0.08] transition-all duration-300 max-w-2xl mx-auto">
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-6">
                <div className="w-12 h-12 bg-white/[0.10] border border-white/[0.15] rounded-2xl flex items-center justify-center mr-4">
                  <MessageSquare className="w-6 h-6 text-gray-300" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent">Still have questions?</h3>
              </div>
              <p className="text-gray-400 mb-8 max-w-md mx-auto font-light leading-relaxed">
                Our support team is here to help you succeed. Get personalized assistance with your career journey.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/about" className="group relative px-8 py-3 bg-white text-black font-semibold rounded-2xl hover:scale-105 hover:shadow-2xl hover:shadow-white/20 border border-white/20 transition-all duration-300">
                  <span className="relative z-10">Contact Support</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-white opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300" />
                </Link>
                <Link to="/login" className="group relative px-8 py-3 bg-white/[0.08] backdrop-blur-sm text-white border border-white/[0.15] font-semibold rounded-2xl hover:bg-white/[0.12] hover:scale-105 transition-all duration-300">
                  <span className="relative z-10">Try Free Assessment</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/[0.05] to-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                </Link >
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle decorative elements */}
      <div className="absolute bottom-32 left-20 w-3 h-3 bg-white/[0.12] rounded-full blur-sm" />
      <div className="absolute top-40 right-24 w-2 h-2 bg-white/[0.10] rounded-full blur-sm" />
      <div className="absolute top-2/3 left-32 w-4 h-4 bg-white/[0.08] rounded-full blur-sm" />
      <div className="absolute bottom-1/4 right-16 w-2 h-2 bg-white/[0.15] rounded-full blur-sm" />
    </section>
  );
};

export default FAQ;