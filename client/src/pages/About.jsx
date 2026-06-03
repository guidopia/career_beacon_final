
import {
    Target,
    Eye,
    Users,
    Award,
    Brain,
    TrendingUp,
    Briefcase,
    Star,
    CheckCircle,
    ArrowRight,
    Heart,
    Zap,
    Globe,
    BookOpen,
    Mail,
    Phone
} from 'lucide-react';
import { useEffect } from 'react';
import { SITE_BRAND_NAME, SITE_BRAND_NAME_SENTENCE } from '../constants/branding';

const AboutUs = () => {
    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }, []);

    const offerings = [
        {
            icon: <Award className="w-6 h-6 text-blue-400" />,
            title: "Career Assessment Tests",
            description: "Scientifically validated tools to identify your strengths"
        },
        {
            icon: <Brain className="w-6 h-6 text-purple-400" />,
            title: "AI Career Counselor",
            description: "A 24/7 intelligent advisor offering personalized guidance"
        },
        {
            icon: <TrendingUp className="w-6 h-6 text-green-400" />,
            title: "Upskilling Guidance",
            description: "Tailored recommendations for skill development"
        },
        {
            icon: <Briefcase className="w-6 h-6 text-orange-400" />,
            title: "Internship Opportunities",
            description: "Connect with top companies and land your first internship"
        }
    ];

    const teamMembers = [
        {
            name: "Ankur Sharma",
            role: "Founder & CEO",
            description: "A visionary leader with 12 years of experience in the EdTech industry. His deep understanding of education and technology fuels our mission to revolutionize career guidance.",
            avatar: "AS"
        },
        {
            name: "Jinal Rathva",
            role: "Tech Founder",
            description: `Tech founder who has been with ${SITE_BRAND_NAME_SENTENCE} from the very beginning, playing a crucial role in shaping the platform's technical vision and development.`,
            avatar: "JR"
        },
        {
            name: "Tulip Jani",
            role: "Frontend Developer",
            description: `Skilled frontend developer who joined us in the initial days and has been contributing to the development and enhancement of the ${SITE_BRAND_NAME_SENTENCE} platform experience.`,
            avatar: "TJ"
        },
        {
            name: "Aakanksha Bosmiya",
            role: "Backend Developer",
            description: `The backbone of our backend infrastructure, expert in database management and server architecture who has built the robust APIs that power the ${SITE_BRAND_NAME_SENTENCE} platform.`,
            avatar: "AB"
        }
    ];

    const whyChooseUs = [
        {
            icon: <Users className="w-8 h-8 text-blue-400" />,
            title: "Student-Driven Community",
            description: "Built by students, for students, creating an authentic learning environment"
        },
        {
            icon: <Zap className="w-8 h-8 text-purple-400" />,
            title: "Leading EdTech Tools",
            description: "Powered by the best educational technology resources available"
        },
        {
            icon: <Globe className="w-8 h-8 text-green-400" />,
            title: "Breaking Barriers",
            description: "Opening doors and removing obstacles for every learner"
        },
        {
            icon: <BookOpen className="w-8 h-8 text-orange-400" />,
            title: "Transforming Education",
            description: "Converting educational experiences into real career opportunities"
        }
    ];

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden">
            {/* Fixed Navigation Bar */}
            <div className="fixed top-6 right-6 z-50">
                <a
                    href="/"
                    className="group relative px-6 py-3 bg-white text-black text-sm font-bold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-white/20 border border-white/20 inline-flex items-center backdrop-blur-sm"
                >
                    <span className="relative z-10">Explore Prodigy AI</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </a>
            </div>

            {/* Background Elements */}
            <div className="fixed inset-0 z-0">
                {/* Gradient overlays */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-white/[0.08] via-gray-500/[0.04] to-transparent rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-white/[0.06] via-gray-400/[0.03] to-transparent rounded-full blur-3xl" />
            </div>

            {/* Hero Section */}
            <section className="relative pt-24 pb-16 z-10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center justify-center py-3 px-6 mb-8 text-sm bg-white/[0.08] text-gray-300 border border-white/[0.15] rounded-full backdrop-blur-sm">
                            <Heart className="w-4 h-4 text-red-400 mr-2" />
                            <span className="font-medium">{`About ${SITE_BRAND_NAME}`}</span>
                        </div>

                        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.2] mb-8">
                            <span className="block bg-gradient-to-b from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
                                Empowering Student
                            </span>
                            <span className="block bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent">
                                Futures
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-4xl mx-auto font-light">
                            A transformative platform designed to empower students to take charge of their futures
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission & Vision Section */}
            <section className="py-20 border-t border-white/[0.10] relative z-10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        {/* Mission */}
                        <div className="relative">
                            <div className="relative p-8 bg-white/[0.05] backdrop-blur-sm border border-white/[0.12] rounded-2xl hover:bg-white/[0.08] transition-all duration-300 overflow-hidden">
                                <div className="flex items-center space-x-4 mb-6">
                                    <div className="p-3 bg-white/[0.10] rounded-xl">
                                        <Target className="w-8 h-8 text-blue-400" />
                                    </div>
                                    <h2 className="text-3xl font-bold bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent">Our Mission</h2>
                                </div>
                                <p className="text-gray-400 leading-relaxed text-lg font-light">
                                    Our mission is to create a free, accessible, and inclusive platform where students can find guidance, build skills, and connect with opportunities to achieve their career aspirations.
                                </p>
                            </div>
                        </div>

                        {/* Vision */}
                        <div className="relative">
                            <div className="relative p-8 bg-white/[0.05] backdrop-blur-sm border border-white/[0.12] rounded-2xl hover:bg-white/[0.08] transition-all duration-300 overflow-hidden">
                                <div className="flex items-center space-x-4 mb-6">
                                    <div className="p-3 bg-white/[0.10] rounded-xl">
                                        <Eye className="w-8 h-8 text-purple-400" />
                                    </div>
                                    <h2 className="text-3xl font-bold bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent">Our Vision</h2>
                                </div>
                                <p className="text-gray-400 leading-relaxed text-lg font-light">
                                    We envision building the ultimate student-only platform, driven by students and powered by the best EdTech tools, to create a thriving ecosystem for career growth and success.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* What We Offer Section */}
            <section className="py-20 border-t border-white/[0.10] relative z-10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center justify-center py-3 px-6 mb-8 text-sm bg-white/[0.08] text-gray-300 border border-white/[0.15] rounded-full backdrop-blur-sm">
                            <span className="font-medium">Our Offerings</span>
                        </div>
                        <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight mb-6">
                            <span className="bg-gradient-to-b from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
                                What We Offer
                            </span>
                        </h2>
                        <p className="text-gray-400 text-lg font-light max-w-2xl mx-auto">Comprehensive tools and guidance for your career journey</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {offerings.map((item, index) => (
                            <div key={index} className="group p-6 bg-white/[0.05] backdrop-blur-sm border border-white/[0.12] rounded-2xl hover:bg-white/[0.08] transition-all duration-300 hover:scale-105 overflow-hidden">
                                <div className="mb-4">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-semibold bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent mb-3">{item.title}</h3>
                                <p className="text-gray-400 leading-relaxed font-light">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-20 border-t border-white/[0.10] relative z-10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center justify-center py-3 px-6 mb-8 text-sm bg-white/[0.08] text-gray-300 border border-white/[0.15] rounded-full backdrop-blur-sm">
                            <span className="font-medium">Our Team</span>
                        </div>
                        <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight mb-6">
                            <span className="bg-gradient-to-b from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
                                Meet the Team
                            </span>
                        </h2>
                        <p className="text-gray-400 text-lg font-light max-w-2xl mx-auto">{`The passionate minds behind ${SITE_BRAND_NAME_SENTENCE}`}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {teamMembers.map((member, index) => (
                            <div key={index} className="group p-8 bg-white/[0.05] backdrop-blur-sm border border-white/[0.12] rounded-2xl hover:bg-white/[0.08] transition-all duration-300 hover:scale-105 text-center overflow-hidden">
                                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                    {member.avatar}
                                </div>
                                <h3 className="text-2xl font-semibold text-white mb-2">{member.name}</h3>
                                <p className="text-blue-400 font-medium mb-4">{member.role}</p>
                                <p className="text-gray-400 leading-relaxed">{member.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Prodigy AI Section */}
            <section className="py-20 border-t border-white/[0.10] relative z-10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center justify-center py-3 px-6 mb-8 text-sm bg-white/[0.08] text-gray-300 border border-white/[0.15] rounded-full backdrop-blur-sm">
                            <span className="font-medium">Why Choose Us</span>
                        </div>
                        <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight mb-6">
                            <span className="bg-gradient-to-b from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
                                Why Prodigy AI?
                            </span>
                        </h2>
                        <p className="text-gray-400 text-lg font-light max-w-3xl mx-auto">
                            {`At ${SITE_BRAND_NAME_SENTENCE}, we believe in the power of students to shape their own futures. By combining the energy of a student-driven community with the expertise of leading EdTech resources, we're breaking down barriers and opening doors for every learner.`}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                        {whyChooseUs.map((item, index) => (
                            <div key={index} className="text-center p-6 bg-white/[0.05] backdrop-blur-sm border border-white/[0.12] rounded-2xl hover:bg-white/[0.08] transition-all duration-300 hover:scale-105">
                                <div className="flex justify-center mb-4">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-semibold bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent mb-3">{item.title}</h3>
                                <p className="text-gray-400 leading-relaxed font-light">{item.description}</p>
                            </div>
                        ))}
                    </div>

                    {/* Call to Action */}
                    <div className="bg-white/[0.05] backdrop-blur-sm border border-white/[0.12] rounded-2xl p-12 text-center overflow-hidden hover:bg-white/[0.08] transition-all duration-300">
                        <h3 className="text-3xl sm:text-4xl font-bold bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent mb-4">
                            Join the Movement
                        </h3>
                        <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto font-light">
                            {`Join ${SITE_BRAND_NAME_SENTENCE} today and be part of a movement that's transforming education into opportunity.`}
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                            <a
                                href="/"
                                className="group relative px-8 py-3 bg-white text-black text-lg font-bold rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-white/20 border border-white/20 inline-flex items-center"
                            >
                                <span className="relative z-10">Explore Prodigy AI</span>
                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-white opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300" />
                            </a>
                            <div className="text-gray-500 text-sm">
                                <span className="font-semibold text-white">{`${SITE_BRAND_NAME}:`}</span> For Students. By Students. With Students.
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-20 border-t border-white/[0.10]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center justify-center py-3 px-6 mb-8 text-sm bg-white/[0.08] text-gray-300 border border-white/[0.15] rounded-full backdrop-blur-sm">
                            <span className="font-medium">Get in Touch</span>
                        </div>
                        <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight mb-6">
                            <span className="bg-gradient-to-b from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
                                Send Us an Email
                            </span>
                        </h2>
                        <p className="text-white/70 text-lg max-w-2xl mx-auto">
                            {`Have questions about ${SITE_BRAND_NAME_SENTENCE}? Want to learn more about our platform? We'd love to hear from you.`}
                        </p>
                    </div>
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white/[0.05] backdrop-blur-sm border border-white/[0.12] rounded-2xl p-12 hover:bg-white/[0.08] transition-all duration-300">
                            <div className="text-center mb-12">
                                <div className="inline-flex items-center justify-center p-4 bg-white/[0.10] rounded-2xl mb-6 mx-auto">
                                    <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                                <h3 className="text-4xl font-bold bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent mb-8">Contact Information</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="flex flex-col items-center text-center p-6 bg-white/[0.08] rounded-xl hover:bg-white/[0.12] transition-all duration-300">
                                    <div className="p-4 bg-white/[0.10] rounded-xl mb-4">
                                        <Mail className="w-10 h-10 text-blue-400" />
                                    </div>
                                    <p className="text-white/60 text-lg mb-2">Email us</p>
                                    <a href="mailto:support@guidopia.com" className="text-xl text-white hover:text-blue-400 transition-colors">
                                      support@guidopia.com
                                    </a>
                                </div>

                                <div className="flex flex-col items-center text-center p-6 bg-white/[0.08] rounded-xl hover:bg-white/[0.12] transition-all duration-300">
                                    <div className="p-4 bg-white/[0.10] rounded-xl mb-4">
                                        <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                    </div>
                                    <p className="text-white/60 text-lg mb-2">WhatsApp us</p>
                                    <a
                                        href="https://api.whatsapp.com/send?phone=919958807926&text=Hey%20!!%20I%20would%20like%20to%20know%20how%20spotlight%20solutions%20can%20help%20me%20in%20my%20career%20growth.%20Please%20connect%20with%20me."
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xl text-white hover:text-green-400 transition-colors"
                                    >
                                        +91 99588 07926
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 border-t border-white/[0.10] relative z-10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="text-4xl sm:text-5xl font-black bg-gradient-to-b from-white via-gray-100 to-gray-400 bg-clip-text text-transparent mb-2">
                                10K+
                            </div>
                            <div className="text-gray-400 font-light">Students Guided</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl sm:text-5xl font-black bg-gradient-to-b from-white via-gray-100 to-gray-400 bg-clip-text text-transparent mb-2">
                                95%
                            </div>
                            <div className="text-gray-400 font-light">Success Rate</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl sm:text-5xl font-black bg-gradient-to-b from-white via-gray-100 to-gray-400 bg-clip-text text-transparent mb-2">
                                24/7
                            </div>
                            <div className="text-gray-400 font-light">AI Support</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl sm:text-5xl font-black bg-gradient-to-b from-white via-gray-100 to-gray-400 bg-clip-text text-transparent mb-2">
                                100+
                            </div>
                            <div className="text-gray-400 font-light">Career Paths</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Subtle decorative elements */}
            <div className="absolute bottom-32 left-20 w-3 h-3 bg-white/[0.12] rounded-full blur-sm" />
            <div className="absolute top-40 right-24 w-2 h-2 bg-white/[0.10] rounded-full blur-sm" />
            <div className="absolute top-1/2 left-32 w-4 h-4 bg-white/[0.08] rounded-full blur-sm" />
            <div className="absolute bottom-1/4 right-16 w-2 h-2 bg-white/[0.15] rounded-full blur-sm" />
        </div>
    );
};

export default AboutUs;