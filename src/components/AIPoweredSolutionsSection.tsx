import { Link } from "react-router-dom";
import { useState } from "react";
import {
    Sparkles,
    Search,
    FileText,
    BarChart3,
    Building2,
    ArrowRight,
    Users,
    CheckCircle,
    Zap,
    Globe,
    HeadphonesIcon,
    TrendingUp,
    Shield,
    ClipboardList,
    Target,
    Clock,
} from "lucide-react";
import VoiceAgentDemo from "./VoiceAgentDemo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const AIPoweredSolutionsSection = () => {
    const [activeTab, setActiveTab] = useState("ai-assistant");

    const tabs = [
        {
            id: "ai-powered-project",
            label: "AI-Powered Project Prospecting",
            icon: Sparkles,
        },
        {
            id: "ai-digital",
            label: "AI Digital Solutions",
            icon: Zap,
        },
        {
            id: "ai-assistant",
            label: "AI Assistant for Contractors",
            icon: Users,
        },
        {
            id: "web-design",
            label: "Professional Web Design",
            icon: Globe,
        },
        {
            id: "technical",
            label: "24/7 Technical Support",
            icon: HeadphonesIcon,
        },
    ];

    const services = {
        "ai-powered-project": {
            main: {
                title: "AI-Powered Project Prospecting",
                description:
                    "Discover opportunities before your competition with intelligent lead generation and automated prospecting tools that give you the edge.",
                icon: Search,
                gradient: "from-primary to-primary",
                image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1000&auto=format&fit=crop"
            },
            cards: [
                {
                    title: "Public/Private Lead Aggregator",
                    description:
                        "Advanced crawler that scrapes public planning commission records, building permits, and news reports in real-time",
                    icon: FileText,
                },
                {
                    title: "Bid Management Dashboard",
                    description:
                        "Comprehensive CRM-style interface for tracking pipelines from lead discovery to contract award",
                    icon: BarChart3,
                },
                {
                    title: "Company Tracking",
                    description:
                        "Follow specific Developers or Architects and get instant notifications for new project announcements",
                    icon: ClipboardList,
                },
            ],
        },
        "ai-digital": {
            main: {
                title: "AI Digital Solutions",
                description:
                    "Transform your digital presence with AI-powered marketing, automation, and optimization tools designed for construction professionals.",
                icon: Zap,
                gradient: "from-primary to-primary",
                image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop"
            },
            cards: [
                {
                    title: "Digital Marketing",
                    description:
                        "AI-driven campaigns that target the right audience at the right time with personalized messaging",
                    icon: Globe,
                },
                {
                    title: "SEO Optimization",
                    description:
                        "Automated SEO strategies powered by AI to improve your online visibility and search rankings",
                    icon: Search,
                },
                {
                    title: "Social Media Management",
                    description:
                        "AI-powered content creation and intelligent scheduling for maximum engagement and reach",
                    icon: Users,
                },
            ],
        },
        "ai-assistant": {
            main: {
                title: "AI Assistant for Contractors",
                description:
                    "Your intelligent 24/7 assistant that helps with project management, decision-making, and workflow optimization.",
                icon: Users,
                gradient: "from-primary to-primary",
                image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1000&auto=format&fit=crop"
            },
            cards: [
                {
                    title: "Project Planning",
                    description:
                        "AI-assisted project planning and timeline optimization for better outcomes and efficiency",
                    icon: FileText,
                },
                {
                    title: "Cost Estimation",
                    description:
                        "Intelligent cost estimation using historical data, market trends, and predictive analytics",
                    icon: TrendingUp,
                },
                {
                    title: "Document Management",
                    description:
                        "Automated document organization, retrieval, and version control for faster workflows",
                    icon: Building2,
                },
            ],
        },
        "web-design": {
            main: {
                title: "Professional Web Design",
                description:
                    "Custom websites designed to showcase your work, attract new clients, and establish your professional online presence.",
                icon: Globe,
                gradient: "from-primary to-primary",
                image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=1000&auto=format&fit=crop"
            },
            cards: [
                {
                    title: "Responsive Design",
                    description:
                        "Mobile-friendly websites that look stunning on all devices and screen sizes",
                    icon: Globe,
                },
                {
                    title: "Portfolio Showcase",
                    description:
                        "Beautiful galleries to display your completed projects and build trust with potential clients",
                    icon: Building2,
                },
                {
                    title: "Lead Generation Forms",
                    description:
                        "Optimized contact forms that capture and qualify leads automatically",
                    icon: FileText,
                },
            ],
        },
        technical: {
            main: {
                title: "24/7 Technical Support",
                description:
                    "Round-the-clock technical assistance from expert support team to keep your business running smoothly without interruption.",
                icon: HeadphonesIcon,
                gradient: "from-primary to-primary",
                image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=1000&auto=format&fit=crop"
            },
            cards: [
                {
                    title: "Remote Support",
                    description:
                        "Get instant help with technical issues from our expert support team, anytime you need it",
                    icon: HeadphonesIcon,
                },
                {
                    title: "System Maintenance",
                    description:
                        "Proactive monitoring and maintenance to prevent downtime and ensure optimal performance",
                    icon: Shield,
                },
                {
                    title: "Training & Onboarding",
                    description:
                        "Comprehensive training programs to help you maximize platform features and productivity",
                    icon: Users,
                },
            ],
        },
    };

    const currentServices = services[activeTab as keyof typeof services];

    return (
        <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-primary/10 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23fbbf24%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 shadow-sm bg-primary/10 border border-primary/20">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-xs font-bold text-gray-800 uppercase tracking-tight">
                            Next-Gen Construction Tools
                        </span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                        AI-Powered <span className="text-primary">Solutions</span>
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
                        Automate your workflow with our suite of intelligent construction management tools.
                    </p>
                </div>

                {/* Main Content Card */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100">
                    {/* Tabs */}
                    <div
                        className="flex gap-2 overflow-x-auto pb-3 mb-8 scrollbar-hide snap-x"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {tabs.map((tab) => {
                            const TabIcon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 whitespace-nowrap min-w-max border snap-start ${isActive
                                        ? "bg-black text-white shadow-md scale-105 border-black ring-2 ring-primary ring-offset-2"
                                        : "bg-gray-50 text-gray-600 hover:bg-gray-100 border-gray-200"
                                        }`}
                                >
                                    <TabIcon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-gray-500'}`} />
                                    <span className="text-xs font-bold uppercase tracking-wide">
                                        {tab.label === "AI Assistant for Contractors" ? "Morgan AI Voice Agent" : tab.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Tab Content */}
                    <div className="min-h-[350px]">
                        {activeTab === 'ai-assistant' ? (
                            /* Morgan AI Voice Agent Section */
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center animate-in fade-in duration-500">
                                {/* Left Column */}
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <Badge className="bg-primary text-black font-black px-3 py-1 rounded-full uppercase tracking-widest text-[10px]">
                                            NEW: GC VOICE TERMINAL
                                        </Badge>
                                        <h3 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight uppercase tracking-tight">
                                            MEET <span className="text-primary">MORGAN</span>: YOUR 24/7 AI General Contractor
                                        </h3>
                                        <p className="text-sm text-gray-600 font-medium leading-relaxed">
                                            <b>Call Now <a href="tel:+13212379018" className="text-primary hover:underline">+1 (321) 237 9018</a></b>
                                        </p>
                                        <p className="text-sm text-gray-600 font-medium leading-relaxed">
                                            Our advanced AI-Voice Call Agent will listen to all your incoming construction relevant calls with professional precision and answer all your queries. From estimate requests to subcontractor coordination, Morgan is always on duty.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {[
                                            { title: "Smart Estimator", desc: "Calculates material and labor costs on the fly.", icon: Zap },
                                            { title: "Lead Processor", desc: "Identifies and qualifies new project signals instantly.", icon: Target },
                                            { title: "24/7 Availability", desc: "Never miss a critical call or emergency again.", icon: Clock },
                                            { title: "CSI Divisions", desc: "Fluent in all trades from concrete to finishing.", icon: Building2 },
                                        ].map((feature, i) => (
                                            <div key={i} className="flex gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                    <feature.icon className="w-4 h-4 text-primary" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-xs text-gray-900 uppercase tracking-tight">{feature.title}</h4>
                                                    <p className="text-[11px] text-gray-500 mt-0.5">{feature.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Right Column - Voice Demo */}
                                <div className="relative flex justify-center lg:justify-end">
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 blur-[80px] rounded-full -z-10" />
                                    <VoiceAgentDemo />
                                </div>
                            </div>
                        ) : (
                            /* Other Tabs Content */
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center animate-in fade-in duration-500">
                                {/* Left Column */}
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <h3 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight uppercase tracking-tight">
                                            {currentServices.main.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 font-medium leading-relaxed">
                                            {currentServices.main.description}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3">
                                        {currentServices.cards.map((card, index) => (
                                            <div key={index} className="flex gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 transition-all hover:bg-primary/5 hover:border-primary/30">
                                                <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center flex-shrink-0 border border-gray-100">
                                                    <card.icon className="w-5 h-5 text-primary" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-sm text-gray-900 uppercase tracking-tight">{card.title}</h4>
                                                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{card.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-2">
                                        <Button className="h-11 px-6 bg-black text-white hover:bg-gray-800 font-bold uppercase tracking-widest text-xs rounded-xl group">
                                            Learn More <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Right Column - Image */}
                                <div className="relative h-full min-h-[350px] rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-gray-100 group">
                                    <div className={`absolute inset-0 bg-gradient-to-br ${currentServices.main.gradient} opacity-10`} />
                                    <img
                                        src={(currentServices.main as any).image}
                                        alt={currentServices.main.title}
                                        className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-black/10 mix-blend-multiply" />

                                    <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/50">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="p-1.5 bg-[#fce011] rounded-md">
                                                <currentServices.main.icon className="w-4 h-4 text-black" />
                                            </div>
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Featured Tool</span>
                                        </div>
                                        <h4 className="font-bold text-sm text-gray-900">
                                            {currentServices.cards[0].title}
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* CTA Section */}
                <div className="bg-gradient-to-r from-[#fce011] via-[#fce011]/90 to-[#fce011] rounded-2xl p-8 sm:p-10 shadow-xl mt-12 relative overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>

                    <div className="relative z-10 max-w-3xl mx-auto text-center">
                        <h3 className="text-2xl sm:text-3xl font-bold text-black mb-4 leading-tight">
                            Ready to Transform Your Pre-Construction Process?
                        </h3>
                        <p className="text-base text-black/95 mb-8 max-w-2xl mx-auto">
                            Join thousands of contractors using AI to discover leads, automate
                            takeoffs, and win more profitable projects.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
                            <Link
                                to="/signup"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-black font-semibold text-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
                            >
                                Start Free Trial
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link
                                to="/contact-us"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-black hover:bg-black/90 text-white font-semibold text-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
                            >
                                Schedule Demo
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        <div className="flex flex-wrap justify-center gap-4 text-sm text-black">
                            <div className="flex items-center gap-1.5">
                                <CheckCircle className="w-4 h-4 text-black" />
                                <span>No credit card required</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <CheckCircle className="w-4 h-4 text-black" />
                                <span>14-day free trial</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <CheckCircle className="w-4 h-4 text-black" />
                                <span>Cancel anytime</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AIPoweredSolutionsSection;
