import React, { useEffect, useState } from 'react';
import { Compass } from 'lucide-react';
import GoogleLoginButton from '../components/GoogleLoginButton';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SITE_BRAND_NAME } from '../constants/branding';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const error = params.get('error');
    
    if (error) {
      switch (error) {
        case 'auth_failed':
          setError('Authentication failed. Please try again.');
          break;
        case 'callback_error':
          setError('Login callback error. Please try again.');
          break;
        case 'oauth_denied':
          setError('OAuth access was denied. Please try again.');
          break;
        case 'user_not_found':
          setError('User account could not be created. Please try again.');
          break;
        default:
          setError('Login error. Please try again.');
      }
    }
    
    if (token) {
      localStorage.setItem('authToken', token);
      params.delete('token');
      params.delete('error');
      navigate({
        pathname: location.pathname,
        search: params.toString(),
      }, { replace: true });
    }
  }, [location, navigate]);

  // Check if user is already logged in
  useEffect(() => {
    const existingToken = localStorage.getItem('authToken');
    if (existingToken && !location.search.includes('token')) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate, location]);

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-gray-950 via-black to-gray-900">
      {/* Logo */}
      <div className="fixed top-0 left-0 w-full z-50 px-4 sm:px-6 lg:px-8 pt-4">
        <div className="max-w-7xl mx-auto">
          <Link to="/login" className="flex items-center space-x-3 group w-fit">
            <div className="flex items-center gap-3 font-bold text-2xl">
              <div className="w-10 h-10 flex items-center justify-center relative hover:rotate-180 transition-transform duration-700">
                <div className="absolute inset-0 bg-gradient-to-r from-[#22c55e] to-[#4ade80] rounded-full" />
                <Compass className="text-black w-6 h-6 relative z-10" aria-hidden />
              </div>
              <span className="leading-tight tracking-tight max-w-[min(100vw-8rem,14rem)] sm:max-w-none">
                <span className="block bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent text-sm sm:text-base md:text-lg lg:text-xl font-bold">
                  {SITE_BRAND_NAME}
                </span>
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-row-reverse min-h-screen w-full pt-20">
        {/* Left Panel */}
        <div className="hidden md:flex md:w-[42%] bg-gradient-to-br from-gray-900/90 to-gray-800/50 backdrop-blur-xl text-white flex-col justify-center px-12 lg:px-16 border-r border-gray-700/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#22c55e]/5 via-transparent to-emerald-900/10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#22c55e]/10 to-transparent blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-[#4ade80]/10 to-transparent blur-3xl"></div>
          
          <div className="relative z-10">
            <p className="text-gray-400 mb-3 text-sm font-medium tracking-wide uppercase">Welcome</p>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                Kickstart Your
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#4ade80] via-[#22c55e] to-emerald-600 bg-clip-text text-transparent">
                Career Journey
              </span>
            </h1>
            <div className="space-y-3 text-gray-300">
              <p className="flex items-center text-base">
                <span className="w-2 h-2 bg-[#22c55e] mr-3 animate-pulse"></span>
                Find your perfect career path
              </p>
              <p className="flex items-center text-base">
                <span className="w-2 h-2 bg-[#22c55e] mr-3 animate-pulse delay-100"></span>
                Get your first internship
              </p>
              <p className="flex items-center text-base">
                <span className="w-2 h-2 bg-[#22c55e] mr-3 animate-pulse delay-200"></span>
                Transform your future
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-[58%] bg-gradient-to-br from-black via-gray-950 to-gray-900 flex items-center justify-center p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tl from-[#22c55e]/5 via-transparent to-transparent"></div>
          <div className="absolute top-20 right-20 w-8 h-8 bg-gradient-to-r from-[#22c55e]/25 to-[#4ade80]/20 blur-lg animate-bounce" style={{animationDelay: '1s'}}></div>
          
          <div className="max-w-md w-full relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Welcome Back
                </span>
              </h2>
              <p className="text-gray-400">Sign in to continue your journey towards success.</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-8">
              <div className="w-full">
                <div className="p-1 bg-gradient-to-r from-[#22c55e]/25 to-emerald-600/20 rounded-lg">
                  <div className="bg-gradient-to-br from-gray-900/70 to-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50">
                    <GoogleLoginButton />
                  </div>
                </div>
              </div>

              <div className="text-center pt-4">
                <p className="text-xs text-gray-500 mb-3">Need help getting started?</p>
                <button type="button" className="text-xs text-[#4ade80] hover:text-[#22c55e] transition-colors duration-300 font-medium">
                  Contact Support →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}