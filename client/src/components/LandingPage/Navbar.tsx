import React, { useState, useEffect } from 'react';
import { Menu, X, Compass } from 'lucide-react';
import { SITE_BRAND_NAME } from '../../constants/branding';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleGetStarted = () => {
    window.location.href = '/login';
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // Add smooth scrolling behavior
      window.scrollTo({
        top: element.offsetTop - 80, // Account for navbar height
        behavior: 'smooth'
      });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled || isMobileMenuOpen
        ? 'bg-black/95 backdrop-blur-xl border-b border-white/[0.08] shadow-xl'
        : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center space-x-3 group">
              <div className="flex items-center gap-3 font-bold text-2xl">
                <div className="w-10 h-10 flex items-center justify-center relative hover:rotate-180 transition-transform duration-700">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#22c55e] to-[#4ade80] rounded-full" />
                  <Compass className="text-black w-6 h-6 relative z-10" />
                </div>
                <span className="leading-tight tracking-tight max-w-[min(100vw-8rem,14rem)] sm:max-w-none">
                  <span className="block bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent text-sm sm:text-base md:text-lg lg:text-xl font-bold">
                    {SITE_BRAND_NAME}
                  </span>
                </span>
              </div>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            {['Features', 'How It Works', 'Success Stories', 'FAQ', 'Pricing'].map((item) => {
              const id = item === 'How It Works' ? 'how-it-works' : item.toLowerCase().replace(' ', '-');
              return (
                <button
                  key={item}
                  onClick={() => {
                    if (item === 'Pricing') {
                      window.location.href = '/plans';
                    } else if (item === 'How It Works') {
                      scrollToSection('how-it-works');
                    } else {
                      scrollToSection(id);
                    }
                  }}
                  className="relative text-gray-400 hover:text-white transition-all duration-300 group py-2 px-4 font-medium"
                >
                  <span className="relative z-10">{item}</span>
                  <div className="absolute inset-0 bg-white/[0.05] border border-white/[0.08] rounded-lg opacity-0 group-hover:opacity-100 backdrop-blur-sm transition-all duration-300" />
                </button>
              );
            })}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center">
            <button
              onClick={handleGetStarted}
              className="relative overflow-hidden px-6 py-2.5 bg-[#22c55e] text-black font-bold rounded-lg transition-all duration-300 border border-[#4ade80]/40 hover:bg-[#16a34a] hover:shadow-lg hover:shadow-[#22c55e]/20"
            >
              <span className="relative z-10">Get Started</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-3 text-gray-400 hover:text-white hover:bg-white/[0.08] rounded-lg transition-all duration-300"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-black/98 backdrop-blur-xl border-b border-white/[0.08]">
          <div className="px-4 py-6 space-y-3">
            {['Features', 'How It Works', 'Success Stories', 'FAQ', 'Pricing'].map((item) => {
              const id = item === 'How It Works' ? 'how-it-works' : item.toLowerCase().replace(' ', '-');
              return (
                <button
                  key={item}
                  onClick={() => {
                    closeMobileMenu();
                    if (item === 'Pricing') {
                      window.location.href = '/plans';
                    } else {
                      scrollToSection(id);
                    }
                  }}
                  className="block w-full text-left py-3 px-5 text-gray-300 hover:bg-white/[0.05] hover:text-white border border-white/[0.08] rounded-lg transition-all duration-300"
                >
                  {item}
                </button>
              );
            })}

            <div className="border-t border-white/[0.08] pt-4 mt-4">
              <button
                onClick={() => {
                  closeMobileMenu();
                  handleGetStarted();
                }}
                className="block w-full text-center px-6 py-3 bg-[#22c55e] text-black font-bold rounded-lg transition-all duration-300 hover:bg-[#16a34a]"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;