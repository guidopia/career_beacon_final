import React, { useState } from 'react';
import { Check, Star, Sparkles, Crown, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState('yearly');
  const [selectedPlan, setSelectedPlan] = useState('premium');
  const navigate = useNavigate();

  // Static data
  const plans = [
    {
      id: 'standard',
      name: 'Standard',
      price: billingCycle === 'yearly' ? 1500 : 150,
      period: billingCycle === 'yearly' ? 'year' : 'month',
      description: 'Perfect for students starting their journey',
      features: [
        'Access to all career guidance tools',
        'Skill assessment and recommendations',
        'Study materials and resources',
        'Community access and peer support',
        'Basic progress tracking',
        'Email support'
      ],
      popular: false,
      cta: 'Get Started',
      icon: Star
    },
    {
      id: 'premium',
      name: 'Premium',
      price: billingCycle === 'yearly' ? 2000 : 200,
      period: billingCycle === 'yearly' ? 'year' : 'month',
      description: 'Best value with personalized guidance',
      features: [
        'Everything in Standard plan',
        'One-on-one personalized counseling session',
        'Priority support and faster response',
        'Advanced analytics and insights',
        'Custom learning path creation',
        'Direct mentor connections',
        'Exclusive workshops and webinars'
      ],
      popular: true,
      cta: 'Start Premium',
      icon: Crown
    }
  ];

  const handleGetStarted = () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen w-full bg-black relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        {/* Gradient overlays */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-white/[0.06] via-gray-500/[0.03] to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-gradient-to-tr from-white/[0.05] via-gray-400/[0.02] to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center py-3 px-6 mb-8 text-sm bg-white/[0.08] text-gray-300 border border-white/[0.15] rounded-full backdrop-blur-sm">
            <Sparkles className="w-4 h-4 mr-2" />
            <span className="font-medium">Choose Your Plan</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight mb-6">
            <span className="block bg-gradient-to-b from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
              Choose your
            </span>
            <span className="block bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent">
              learning journey
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-8 leading-relaxed font-light">
            Unlock your potential with our comprehensive career guidance platform.
            Choose the plan that fits your goals and start building your future today.
          </p>

          {/* Billing cycle toggle */}
          <div className="flex items-center justify-center gap-4 mb-10">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                billingCycle === 'monthly'
                  ? 'bg-white text-black'
                  : 'bg-white/[0.08] text-gray-400 border border-white/[0.12] hover:bg-white/[0.12]'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                billingCycle === 'yearly'
                  ? 'bg-white text-black'
                  : 'bg-white/[0.08] text-gray-400 border border-white/[0.12] hover:bg-white/[0.12]'
              }`}
            >
              Yearly <span className="text-xs text-green-400 ml-1">Save 37%</span>
            </button>
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white/[0.05] backdrop-blur-sm border rounded-2xl p-8 transition-all duration-300 hover:scale-[1.02] overflow-hidden ${plan.popular
                ? 'border-white/[0.20] ring-2 ring-white/[0.15] hover:bg-white/[0.08] hover:shadow-2xl hover:shadow-white/10'
                : 'border-white/[0.12] hover:border-white/[0.18] hover:bg-white/[0.08]'
                }`}
            >
              {plan.popular && (
                <div className="pointer-events-none select-none">
                  <div
                    className="fixed z-40 top-10 -right-12 w-56"
                    style={{
                      transform: 'rotate(45deg)',
                    }}
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-200 via-white to-yellow-400 opacity-60 blur-md animate-pulse rounded-lg" />
                      <div className="flex items-center justify-center gap-2 py-1 px-5 text-sm font-bold uppercase tracking-wider bg-gradient-to-r from-yellow-300 via-white to-yellow-500 text-black rounded-lg shadow-lg border border-yellow-200/60"
                        style={{
                          boxShadow: '0 2px 16px 0 rgba(255,255,255,0.25), 0 0px 8px 0 rgba(255,255,0,0.10)',
                        }}
                      >
                        <Crown className="w-4 h-4 text-yellow-500 drop-shadow" />
                        Most Popular
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="relative z-10">
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${plan.popular ? 'bg-white/[0.15] border border-white/[0.20]' : 'bg-white/[0.10] border border-white/[0.15]'}`}>
                      <plan.icon className={`w-6 h-6 ${plan.popular ? 'text-white' : 'text-gray-300'}`} />
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mb-2 bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent">{plan.name}</h3>
                  <p className="text-gray-400 mb-6 font-light">{plan.description}</p>

                  <div className="mb-6">
                    <span className="text-5xl font-bold bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent">
                      ₹{plan.price.toLocaleString()}
                    </span>
                    <span className="text-gray-500 text-lg">/{plan.period}</span>
                  </div>

                  <button
                    onClick={handleGetStarted}
                    className={`w-full py-4 px-6 font-semibold text-lg rounded-xl transition-all duration-300 ${plan.popular
                      ? 'bg-white text-black hover:shadow-lg hover:shadow-white/30 hover:scale-105'
                      : 'bg-white/[0.08] backdrop-blur-sm text-white border border-white/[0.15] hover:border-white/[0.25] hover:bg-white/[0.12] hover:scale-105'
                      }`}
                  >
                    {plan.cta}
                  </button>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-lg bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent mb-4">What's included:</h4>
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-white/[0.10] border border-white/[0.15] flex items-center justify-center mt-0.5 flex-shrink-0">
                        <Check className="w-3 h-3 text-gray-300" />
                      </div>
                      <span className="text-gray-400 text-sm leading-relaxed font-light">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-white/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Subtle decorative elements */}
      <div className="absolute bottom-20 right-20 w-4 h-4 bg-white/[0.15] rounded-full blur-sm" />
      <div className="absolute top-32 left-20 w-2 h-2 bg-white/[0.12] rounded-full blur-sm" />
      <div className="absolute top-1/2 right-32 w-3 h-3 bg-white/[0.10] rounded-full blur-sm" />
      <div className="absolute bottom-1/3 left-32 w-2 h-2 bg-white/[0.08] rounded-full blur-sm" />
    </div>
  );
}
