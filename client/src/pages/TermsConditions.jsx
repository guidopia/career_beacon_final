import React, { useEffect } from 'react';
import { FileText, Users, Shield, Briefcase, Mail, Globe, AlertTriangle, Scale } from 'lucide-react';
import { SITE_BRAND_NAME_SENTENCE } from '../constants/branding';

const TermsConditions = () => {
    // Scroll to top on mount (when navigated to this page)
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, []);

    const sections = [
        {
            title: "Eligibility",
            icon: <Users className="w-6 h-6 text-blue-400" />,
            content: [
                "You are at least 13 years of age, or the legal age of majority in your jurisdiction.",
                "If under 18, you have parental or guardian consent to use the platform.",
                "You are legally competent to enter into a binding agreement."
            ]
        },
        {
            title: "Services Overview",
            icon: <Briefcase className="w-6 h-6 text-green-400" />,
            content: [
                "AI-based career counseling",
                "Career assessments and exam tools",
                "Peer-to-peer learning opportunities",
                "Upskilling recommendations",
                "Social student networking features (in development)",
                "We may update or modify features without prior notice."
            ]
        },
        {
            title: "Account Responsibility",
            icon: <Shield className="w-6 h-6 text-purple-400" />,
            content: [
                "You must register an account to access certain features.",
                "You are responsible for maintaining the confidentiality of your credentials.",
                "You agree to provide accurate and updated information."
            ]
        },
        {
            title: "Acceptable Use",
            icon: <AlertTriangle className="w-6 h-6 text-orange-400" />,
            content: [
                "You agree not to:",
                "Use the platform for unlawful or malicious purposes.",
                "Post misleading, harmful, or inappropriate content.",
                "Interfere with system integrity or security.",
                "Attempt to gain unauthorized access to other accounts."
            ]
        },
        {
            title: "Intellectual Property",
            icon: <FileText className="w-6 h-6 text-cyan-400" />,
            content: [
                "All content, design, logos, trademarks, and code on guidopia.com are the intellectual property of Guidopia Edtech Private Limited, unless stated otherwise.",
                "You may not copy, reuse, or distribute any part without written consent."
            ]
        },
        {
            title: "User Content",
            icon: <Globe className="w-6 h-6 text-pink-400" />,
            content: [
                "When you upload content (such as profile info, posts, messages):",
                "You retain ownership.",
                "You grant us a royalty-free, worldwide, non-exclusive license to use, display, and distribute the content for platform-related purposes."
            ]
        }
    ];

    const additionalSections = [
        {
            title: "Termination",
            content: [
                "We reserve the right to suspend or terminate your account:",
                "• If you violate these Terms",
                "• For inactivity",
                "• Or at our discretion, with or without notice"
            ]
        },
        {
            title: "Disclaimer and Limitation of Liability",
            content: [
                "• Services are provided \"as is\" and \"as available\".",
                "• We do not guarantee accuracy, completeness, or availability at all times.",
                "• We are not liable for any loss, damage, or inconvenience resulting from your use of the Website."
            ]
        },
        {
            title: "Modifications",
            content: [
                "We may update these Terms at any time. Continued use after changes constitutes acceptance."
            ]
        },
        {
            title: "Governing Law",
            content: [
                "These Terms are governed by the laws of India. Disputes shall be subject to the exclusive jurisdiction of the courts in New Delhi."
            ]
        }
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
                        <Scale className="w-4 h-4 text-blue-400 mr-2" />
                        <span className="font-medium">Terms & Conditions</span>
                    </div>

                    <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[0.85] mb-8">
                        <span className="block bg-gradient-to-b from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
                            Terms &
                        </span>
                        <span className="block bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent">
                            Conditions
                        </span>
                    </h1>

                    <div className="space-y-4 text-gray-300">
                        <p className="text-lg font-light">Effective Date: July 07, 2025</p>
                        <p className="text-xl leading-relaxed max-w-3xl mx-auto font-light">
                            {`Welcome to ${SITE_BRAND_NAME_SENTENCE} — an educational platform operated by Guidopia Edtech Private Limited.`}
                            By accessing or using our Website, services, or content, you agree to be bound by these Terms and Conditions.
                        </p>
                    </div>
                </div>

                {/* Introduction */}
                <div className="bg-white/[0.05] backdrop-blur-sm border border-white/[0.15] rounded-2xl p-8 mb-12">
                    <h2 className="text-2xl font-bold text-white mb-4">Agreement Overview</h2>
                    <p className="text-gray-300 leading-relaxed font-light">
                        These Terms and Conditions ("Terms") govern your use of www.guidopia.com ("Website") operated by
                        Guidopia Edtech Private Limited ("Company", "we", "our", or "us"). By using our Website,
                        you confirm that you agree to be legally bound by these Terms.
                    </p>
                </div>

                {/* Main Sections */}
                <div className="space-y-12 mb-16">
                    {sections.map((section, index) => (
                        <div key={index} className="bg-white/[0.05] backdrop-blur-sm border border-white/[0.15] rounded-2xl p-8">
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="p-3 bg-white/[0.10] rounded-xl">
                                    {section.icon}
                                </div>
                                <h2 className="text-2xl font-bold text-white">{section.title}</h2>
                            </div>
                            <div className="space-y-3">
                                {section.content.map((item, itemIndex) => (
                                    <p key={itemIndex} className="text-gray-300 leading-relaxed font-light">
                                        {item.startsWith('•') || item.startsWith('-') || item.includes(':') ? item : `• ${item}`}
                                    </p>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Additional Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    {additionalSections.map((section, index) => (
                        <div key={index} className="bg-white/[0.05] backdrop-blur-sm border border-white/[0.15] rounded-2xl p-6">
                            <h3 className="text-xl font-bold text-white mb-4">{section.title}</h3>
                            <div className="space-y-2">
                                {section.content.map((item, itemIndex) => (
                                    <p key={itemIndex} className="text-gray-300 leading-relaxed font-light">{item}</p>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Contact Section */}
                <div className="bg-white/[0.05] backdrop-blur-sm border border-white/[0.15] rounded-2xl p-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-6">Questions?</h2>
                    <p className="text-gray-300 mb-6 font-light">Reach us at:</p>
                    <div className="space-y-4">
                        <div className="flex items-center justify-center space-x-3">
                            <Mail className="w-5 h-5 text-blue-400" />
                            <a href="mailto:support@guidopia.com" className="text-blue-400 hover:text-blue-300 transition-colors">
                                support@guidopia.com
                            </a>
                        </div>
                        <div className="text-gray-300">
                            <p className="font-semibold">Guidopia Edtech Private Limited</p>
                            <p>www.guidopia.com</p>
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

export default TermsConditions;