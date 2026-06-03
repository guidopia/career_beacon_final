import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Linkedin, Instagram, Mail, Phone, Heart } from 'lucide-react';
import { SITE_BRAND_NAME } from '../../constants/branding';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerNav = {
    platform: [
      { name: 'Dashboard', href: 'login' },
      { name: 'Career Assessment', href: 'login' },
      { name: 'Prodigy AI Assistant', href: 'login' },
      { name: 'Exam AI', href: 'login' },
    ],
    features: [
      { name: 'Upskilling', href: 'login' },
      { name: 'College Search', href: 'login' },
      { name: 'Future Me Card', href: 'login' },
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Privacy Policy', href: '/privacy-policy' },
      { name: 'Terms & Conditions', href: '/terms-conditions' },
      { name: 'Refund Policy', href: '/refund-policy' },
    ],
  };

  const socialLinks = [
    {
      name: 'Twitter',
      href: 'https://x.com/GuidopiaIndia?t=yZtO4WHjeaS6P1ZDs48Ytw&s=09',
      icon: Twitter,
    },
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/company/spotlightsolutions/',
      icon: Linkedin,
    },
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/guidopiacareer?igsh=cjQyZzQ3NjRnY2xm',
      icon: Instagram,
    },
    {
      name: 'Facebook',
      href: 'https://www.facebook.com/share/1JzaMZditr/',
      icon: (props: any) => (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3.28l.72-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      ),
    },
    {
      name: 'Email',
      href: 'mailto:support@guidopia.com',
      icon: Mail,
    },
    {
      name: 'Phone',
      href: 'https://api.whatsapp.com/send?phone=919958807926&text=Hey%20!!%20I%20would%20like%20to%20know%20how%20spotlight%20solutions%20can%20help%20me%20in%20my%20career%20growth.%20Please%20connect%20with%20me.',
      icon: Phone,
    },
  ];

  return (
    <footer className="bg-black border-t border-white/[0.10] relative overflow-hidden" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>

      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-white/[0.04] via-gray-500/[0.02] to-transparent rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8 relative z-10">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12 mb-16">
          {/* Company info */}
          <div className="md:col-span-2 lg:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black">
                  <path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z"></path>
                  <circle cx="12" cy="12" r="10"></circle>
                </svg>
              </div>
              <h3 className="text-sm sm:text-base md:text-lg lg:text-2xl font-bold bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent leading-snug">
                {SITE_BRAND_NAME}
              </h3>
            </Link>
            <p className="text-gray-400 leading-relaxed mb-6 max-w-md font-light mt-6">
              Empowering careers through AI-driven guidance. Discover your perfect path with personalized career counseling and skill development roadmaps.
            </p>

            {/* Social links */}
            <div className="flex space-x-4">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="group p-3 bg-white/[0.08] backdrop-blur-sm border border-white/[0.15] rounded-xl hover:bg-white/[0.12] hover:scale-110 transition-all duration-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-5 w-5 text-[#FFF] group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerNav).map(([category, links]) => (
            <div key={category} className="lg:col-span-1">
              <h4 className="text-sm font-semibold leading-6 bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent mb-6 uppercase tracking-wider">
                {category.replace(/([A-Z])/g, ' $1').trim()}
              </h4>
              <ul role="list" className="space-y-4">
                {links.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className="text-sm leading-6 text-gray-500 hover:text-gray-300 transition-colors duration-300 group flex items-center font-light"
                    >
                      <span className="w-0 h-0.5 bg-white group-hover:w-4 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom section */}
        <div className="border-t border-white/[0.10] pt-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center text-sm text-gray-500 order-1 lg:order-2">
              <span className="flex items-center">
                Made with <Heart className="w-4 h-4 text-[#FFF] mx-2" /> by the Guidopia Team
              </span>
            </div>
            <div className="text-sm text-gray-500 order-2 lg:order-1">
              © {currentYear} Guidopia Edtech Private Limited. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;