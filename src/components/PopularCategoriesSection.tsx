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
} from "lucide-react";

const PopularCategoriesSection = () => {
  const [activeTab, setActiveTab] = useState("ai-powered-project");

  const tabs = [
    {
      id: "ai-powered-project",
      label: "AI-Powered Project",
      icon: Sparkles,
    },
    {
      id: "ai-digital",
      label: "AI Digital",
      icon: Zap,
    },
    {
      id: "ai-assistant",
      label: "AI Assistant",
      icon: Users,
    },
    {
      id: "web-design",
      label: "Web Design",
      icon: Globe,
    },
    {
      id: "technical",
      label: "24/7 Technical",
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
        gradient: "from-orange-500 to-yellow-500",
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
          icon: Building2,
        },
      ],
    },
    "ai-digital": {
      main: {
        title: "AI Digital Solutions",
        description:
          "Transform your digital presence with AI-powered marketing, automation, and optimization tools designed for construction professionals.",
        icon: Zap,
        gradient: "from-blue-500 to-purple-500",
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
        gradient: "from-green-500 to-teal-500",
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
        gradient: "from-indigo-500 to-blue-500",
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
        gradient: "from-gray-600 to-gray-800",
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
    <div className="relative py-12 bg-gradient-to-br from-gray-50 via-white to-yellow-50 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23fbbf24%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-full mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            <span className="text-xs font-semibold text-orange-600">
              Pre-Construction & Market Intelligence
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            AI-Powered Tools to{" "}
            <span className="text-orange-600">Win More Projects</span>
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            From discovering leads to submitting bids, our intelligent platform
            streamlines every step of your pre-construction workflow.
          </p>
        </div>

        {/* Tabs Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-10 pb-4 border-b border-gray-200">
          {tabs.map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-black shadow-md"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                <TabIcon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Large Left Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 hover:shadow-xl hover:border-orange-300 transition-all duration-300 h-full">
              <div className="flex items-start gap-6">
                {/* Icon Section */}
                <div
                  className={`flex-shrink-0 bg-gradient-to-br ${currentServices.main.gradient} rounded-xl p-4 shadow-md`}
                >
                  {(() => {
                    const Icon = currentServices.main.icon;
                    return <Icon className="w-8 h-8 text-white" strokeWidth={2} />;
                  })()}
                </div>

                {/* Content Section */}
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">
                    {currentServices.main.title}
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed mb-6">
                    {currentServices.main.description}
                  </p>
                  
                  {/* Button */}
                  <Link
                    to="/products"
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-semibold text-sm rounded-full shadow-md hover:shadow-lg transition-all duration-200 group"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Three Smaller Cards */}
          <div className="lg:col-span-1 space-y-4">
            {currentServices.cards.map((card, index) => {
              const CardIcon = card.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-lg p-5 shadow-md border border-gray-200 hover:shadow-lg hover:border-orange-300 transition-all duration-300 group"
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-orange-50 rounded-lg p-2.5 flex-shrink-0 group-hover:bg-orange-100 transition-colors">
                      <CardIcon className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-gray-900 mb-1.5 group-hover:text-orange-600 transition-colors">
                        {card.title}
                      </h4>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {card.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-500 rounded-2xl p-8 sm:p-10 shadow-xl mb-12 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>

          <div className="relative z-10 max-w-3xl mx-auto text-center">
            {/* Trust Badge */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-semibold text-sm">
                Trusted by 10,000+ contractors nationwide
              </span>
            </div>

            {/* Heading */}
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 leading-tight">
              Ready to Transform Your Pre-Construction Process?
            </h3>

            {/* Description */}
            <p className="text-base text-white/95 mb-8 max-w-2xl mx-auto">
              Join thousands of contractors using AI to discover leads, automate
              takeoffs, and win more profitable projects.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-orange-600 font-semibold text-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Start Free Trial
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/contact-us"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-900/90 hover:bg-gray-900 text-white font-semibold text-sm rounded-full shadow-lg hover:shadow-xl border border-white/20 transition-all duration-200"
              >
                Schedule Demo
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Benefits */}
            <div className="flex flex-wrap justify-center gap-4 text-sm text-white">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-white" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-white" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-white" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Footer */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 pb-4">
          {[
            { number: "10,000+", label: "Verified Contractors" },
            { number: "50,000+", label: "Projects Completed" },
            { number: "98%", label: "Satisfaction Rate" },
            { number: "$2B+", label: "Project Value Managed" },
          ].map((stat, index) => (
            <div
              key={index}
              className="text-center p-4 bg-white rounded-lg border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all duration-300"
            >
              <div className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-br from-orange-600 to-yellow-500 bg-clip-text text-transparent mb-2">
                {stat.number}
              </div>
              <div className="text-gray-700 text-xs sm:text-sm font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularCategoriesSection;
