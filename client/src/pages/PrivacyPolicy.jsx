import React, { useEffect } from 'react';
import { Shield, Eye, Users, Lock, Mail, Phone, FileText, Globe } from 'lucide-react';

const PrivacyPolicy = () => {
    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'auto' });
    }, []);

    const sections = [
        {
            title: "What Information We Collect",
            icon: <Eye className="w-6 h-6 text-blue-400" />,
            content: [
                "Personal Data: Name, email, contact info, age, education details, and assessment results.",
                "Usage Data: Browser type, pages visited, device info, IP address, and referral sources.",
                "Cookies: To personalize experience and analyze traffic."
            ]
        },
        {
            title: "How We Use Your Information",
            icon: <Users className="w-6 h-6 text-green-400" />,
            content: [
                "Provide career counseling and personalized suggestions",
                "Enable social learning and peer support",
                "Improve our services",
                "Send updates, newsletters, or alerts (you can opt out)",
                "Ensure legal compliance"
            ]
        },
        {
            title: "Data Sharing and Disclosure",
            icon: <Globe className="w-6 h-6 text-purple-400" />,
            content: [
                "We do not sell your data. We may share it:",
                "With trusted service providers under confidentiality",
                "If legally required (e.g., law enforcement, court order)",
                "In case of company acquisition or merger (you'll be notified)"
            ]
        },
        {
            title: "Data Security",
            icon: <Lock className="w-6 h-6 text-orange-400" />,
            content: [
                "We employ industry-standard practices to safeguard data, including:",
                "SSL encryption",
                "Limited access controls",
                "Regular security reviews",
                "Despite best efforts, no system is 100% secure."
            ]
        },
        {
            title: "Your Rights",
            icon: <FileText className="w-6 h-6 text-cyan-400" />,
            content: [
                "Depending on your region, you may have rights to:",
                "Access your personal data",
                "Correct inaccurate information",
                "Delete your data",
                "Withdraw consent for marketing",
                "Contact us at privacy@guidopia.com for requests."
            ]
        }
    ];

    const additionalSections = [
        {
            title: "Data Retention",
            content: "We retain your data as long as your account is active or as needed for business/legal reasons."
        },
        {
            title: "Children's Privacy",
            content: "We do not knowingly collect personal data from users under 13. If you're a parent/guardian and believe your child has provided data, contact us."
        },
        {
            title: "Third-Party Links",
            content: "Our platform may contain links to third-party websites or services. We are not responsible for their privacy practices."
        },
        {
            title: "Updates to this Policy",
            content: "We may update this Privacy Policy. Changes will be posted here with a new effective date."
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
                        <Shield className="w-4 h-4 text-blue-400 mr-2" />
                        <span className="font-medium">Privacy Policy</span>
                    </div>

                    <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.1] mb-8">
                        <span className="block bg-gradient-to-b from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
                            Privacy
                        </span>
                        <span className="block bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent">
                            Policy
                        </span>
                    </h1>

                    <div className="space-y-4 text-gray-300">
                        <p className="text-lg font-light">Effective Date: July 07, 2025</p>
                        <p className="text-xl leading-relaxed max-w-3xl mx-auto font-light">
                            At Guidopia Edtech Private Limited, we value your privacy and are committed to protecting your personal data.
                            This Privacy Policy explains how we collect, use, and safeguard your information when you use Prodigy AI on guidopia.com.
                        </p>
                    </div>
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
                                        {item.startsWith('•') || item.startsWith('-') ? item : `• ${item}`}
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
                            <p className="text-gray-300 leading-relaxed font-light">{section.content}</p>
                        </div>
                    ))}
                </div>

                {/* Contact Section */}
                <div className="bg-white/[0.05] backdrop-blur-sm border border-white/[0.15] rounded-2xl p-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-6">Contact Us</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-center space-x-3">
                            <Mail className="w-5 h-5 text-blue-400" />
                            <a href="mailto:privacy@guidopia.com" className="text-blue-400 hover:text-blue-300 transition-colors">
                                privacy@guidopia.com
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

export default PrivacyPolicy;