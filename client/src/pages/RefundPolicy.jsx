import React, { useEffect } from 'react';
import { CreditCard, X, AlertCircle, Brain, BookOpen, TrendingUp, Mail, HelpCircle } from 'lucide-react';
import { SITE_BRAND_NAME_SENTENCE } from '../constants/branding';

const RefundPolicy = () => {
    useEffect(() => {
        // Scroll to top when this component mounts
        window.scrollTo(0, 0);
    }, []);

    const products = [
        {
            icon: <Brain className="w-6 h-6 text-blue-400" />,
            title: "AI Career Counseling Tools",
            description: "Personalized AI-driven career guidance and recommendations"
        },
        {
            icon: <BookOpen className="w-6 h-6 text-green-400" />,
            title: "Exam & Assessment Modules",
            description: "Comprehensive testing and evaluation tools"
        },
        {
            icon: <TrendingUp className="w-6 h-6 text-purple-400" />,
            title: "Career Guidance and Upskilling Recommendations",
            description: "Tailored learning paths and skill development programs"
        }
    ];

    const noRefundReasons = [
        "User dissatisfaction with the product",
        "Accidental purchases",
        "Incomplete usage of services",
        "Change of mind"
    ];

    return (
        <div className="min-h-screen bg-black relative overflow-hidden">
            {/* Background */}
            <div className="fixed inset-0 z-0">
                {/* Grid pattern background */}
                <div className="absolute inset-0 opacity-[0.02]">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }} />
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-white py-20">

                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center py-3 px-6 mb-8 text-sm bg-white/[0.08] text-gray-300 border border-white/[0.15] rounded-full backdrop-blur-sm">
                        <CreditCard className="w-4 h-4 text-blue-400 mr-2" />
                        <span className="font-medium">Refund Policy</span>
                    </div>

                    <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[0.85] mb-8">
                        <span className="block bg-gradient-to-b from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
                            Refund
                        </span>
                        <span className="block bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent">
                            Policy
                        </span>
                    </h1>

                    <div className="space-y-4 text-gray-300">
                        <p className="text-lg font-light">Effective Date: July 07, 2025</p>
                        <div className="text-gray-300">
                            <p className="font-semibold">Company: Guidopia Edtech Private Limited</p>
                            <p>Website: www.guidopia.com</p>
                        </div>
                        <p className="text-xl leading-relaxed max-w-3xl mx-auto font-light">
                            {`At ${SITE_BRAND_NAME_SENTENCE}, we are committed to delivering high-quality educational services and digital experiences.`}
                        </p>
                    </div>
                </div>

                {/* Products Overview */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-white mb-8 text-center">Our Products</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {products.map((product, index) => (
                            <div key={index} className="bg-white/[0.05] backdrop-blur-sm border border-white/[0.15] rounded-2xl p-6 text-center">
                                <div className="flex justify-center mb-4">
                                    <div className="p-3 bg-white/[0.10] rounded-xl">
                                        {product.icon}
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">{product.title}</h3>
                                <p className="text-gray-300 text-sm font-light">{product.description}</p>
                            </div>
                        ))}
                    </div>
                    <p className="text-center text-gray-300 mt-6 font-light">
                        Please read our Refund Policy carefully before making a purchase.
                    </p>
                </div>

                {/* No Refund Policy */}
                <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 mb-12">
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="p-3 bg-red-500/20 rounded-xl">
                            <X className="w-8 h-8 text-red-400" />
                        </div>
                        <h2 className="text-3xl font-bold text-white">No Refund Policy</h2>
                    </div>
                    <div className="space-y-4">
                        <p className="text-gray-300 leading-relaxed font-light text-lg">
                            All purchases made on guidopia.com are <strong className="text-white">final and non-refundable</strong>.
                            We do not offer refunds under any circumstances, including but not limited to:
                        </p>
                        <ul className="space-y-2">
                            {noRefundReasons.map((reason, index) => (
                                <li key={index} className="flex items-center text-gray-300 font-light">
                                    <span className="w-2 h-2 bg-red-400 rounded-full mr-3 flex-shrink-0"></span>
                                    {reason}
                                </li>
                            ))}
                        </ul>
                        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 mt-6">
                            <p className="text-gray-300 font-light">
                                <strong className="text-white">Important:</strong> This policy applies to all our paid services,
                                subscriptions, assessments, and digital tools.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Why No Refunds */}
                <div className="bg-white/[0.05] backdrop-blur-sm border border-white/[0.15] rounded-2xl p-8 mb-12">
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="p-3 bg-white/[0.10] rounded-xl">
                            <HelpCircle className="w-8 h-8 text-blue-400" />
                        </div>
                        <h2 className="text-3xl font-bold text-white">Why No Refunds?</h2>
                    </div>
                    <p className="text-gray-300 leading-relaxed font-light text-lg">
                        Since our products are digital in nature and often include personalized data, AI-generated insights,
                        or instantly accessible resources, we cannot revoke access or undo delivery once the service is initiated.
                        This is in line with standard practices for digital goods.
                    </p>
                </div>

                {/* Questions Section */}
                <div className="bg-white/[0.05] backdrop-blur-sm border border-white/[0.15] rounded-2xl p-8">
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="p-3 bg-white/[0.10] rounded-xl">
                            <AlertCircle className="w-8 h-8 text-orange-400" />
                        </div>
                        <h2 className="text-3xl font-bold text-white">Questions</h2>
                    </div>
                    <div className="space-y-6">
                        <p className="text-gray-300 leading-relaxed font-light text-lg">
                            If you believe you've been charged in error or require help understanding our offerings
                            before purchasing, please contact us <strong className="text-white">before making a payment</strong>.
                        </p>

                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
                            <div className="flex items-center justify-center space-x-3">
                                <Mail className="w-6 h-6 text-blue-400" />
                                <a
                                    href="mailto:support@guidopia.com"
                                    className="text-blue-400 hover:text-blue-300 transition-colors text-lg font-medium"
                                >
                                    support@guidopia.com
                                </a>
                            </div>
                        </div>

                        <div className="text-center text-gray-300">
                            <p className="font-semibold text-white mb-2">Guidopia Edtech Private Limited</p>
                            <p className="font-light">We're here to help you make informed decisions about our services.</p>
                        </div>
                    </div>
                </div>

            </div>

            {/* Subtle decorative elements */}
            <div className="absolute bottom-20 right-20 w-4 h-4 bg-white/[0.15] rounded-full blur-sm" />
            <div className="absolute top-32 left-20 w-2 h-2 bg-white/[0.12] rounded-full blur-sm" />
            <div className="absolute top-1/2 right-32 w-3 h-3 bg-white/[0.10] rounded-full blur-sm" />
        </div>
    );
};

export default RefundPolicy;