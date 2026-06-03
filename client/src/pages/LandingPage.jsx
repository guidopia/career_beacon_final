import React from 'react';
import Navbar from '../components/LandingPage/Navbar';
import Hero from '../components/LandingPage/Hero';
import StatsBar from '../components/LandingPage/StatsBar';
import Features from '../components/LandingPage/Features';
import HowItWorks from '../components/LandingPage/HowItWorks';
import Testimonials from '../components/LandingPage/Testimonials';
import FAQ from '../components/LandingPage/FAQ';
import CTA from '../components/LandingPage/CTA';
import Footer from '../components/LandingPage/Footer';
import Pricing from '../components/LandingPage/Pricing';
import { SITE_BRAND_NAME, SITE_BRAND_NAME_SENTENCE } from '../constants/branding';

const LandingPage = () => {
  // Set page metadata for SEO
  React.useEffect(() => {
    document.title = `${SITE_BRAND_NAME} - India's AI-Powered Career Guidance & Assessment Platform`;
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        `${SITE_BRAND_NAME_SENTENCE} is an AI-powered career guidance and assessment platform designed for students aged 14-26. Explore careers, prepare for exams, connect with mentors, and get personalized college recommendations.`
      );
    }
    
    // Update OG tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', `${SITE_BRAND_NAME} - India's AI-Powered Career Guidance Platform`);
    }
    
    let ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', 
        'Help students explore careers, prepare for exams, upskill, and discover colleges through AI-powered guidance and personalized assessments.'
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-dark text-white">
      <Navbar />
      <main>
        <Hero />
        <StatsBar />
        <Features />
        <HowItWorks />
        <Testimonials />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;