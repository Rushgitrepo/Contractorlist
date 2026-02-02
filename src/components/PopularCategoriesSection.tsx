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
  Wrench,
  TreePine,
  Package,
  Droplets,
  Paintbrush,
  Wind,
  Home,
  Hammer,
  Layers,
  HardHat,
  Gauge,
  Power,
  Settings,
  Box,
  ChevronRight,
  ChevronLeft,
  Phone,
  Target,
  Clock,
} from "lucide-react";
import VoiceAgentDemo from "./VoiceAgentDemo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const PopularCategoriesSection = () => {
  const [activeTab, setActiveTab] = useState("ai-assistant");
  const [activeCategory, setActiveCategory] = useState<string | null>("Plumbers");

  const scrollRight = (rowId: string) => {
    const container = document.getElementById(`category-scroll-container-${rowId}`);
    if (container) {
      container.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  // All 30 categories for 2 rows (15 each) - including Welding
  const allCategories = [
    { name: "Cleaners", icon: Sparkles, color: "text-gray-700" },
    { name: "Handymen", icon: Wrench, color: "text-gray-700" },
    { name: "Landscapers", icon: TreePine, color: "text-gray-700" },
    { name: "Movers", icon: Package, color: "text-gray-700" },
    { name: "Plumbers", icon: Droplets, color: "text-gray-700" },
    { name: "Electrical pros", icon: Zap, color: "text-gray-700" },
    { name: "Painters", icon: Paintbrush, color: "text-gray-700" },
    { name: "HVAC", icon: Wind, color: "text-gray-700" },
    { name: "Roofing", icon: Home, color: "text-gray-700" },
    { name: "Carpentry", icon: Hammer, color: "text-gray-700" },
    { name: "Flooring", icon: Layers, color: "text-gray-700" },
    { name: "Drywall", icon: Building2, color: "text-gray-700" },
    { name: "Concrete", icon: Shield, color: "text-gray-700" },
    { name: "Masonry", icon: HardHat, color: "text-gray-700" },
    { name: "Insulation", icon: Box, color: "text-gray-700" },
    { name: "Windows", icon: Home, color: "text-gray-700" },
    { name: "Doors", icon: Building2, color: "text-gray-700" },
    { name: "Siding", icon: Gauge, color: "text-gray-700" },
    { name: "Gutters", icon: Droplets, color: "text-gray-700" },
    { name: "Decking", icon: Building2, color: "text-gray-700" },
    { name: "Fencing", icon: TreePine, color: "text-gray-700" },
    { name: "Paving", icon: Building2, color: "text-gray-700" },
    { name: "Demolition", icon: Hammer, color: "text-gray-700" },
    { name: "Excavation", icon: HardHat, color: "text-gray-700" },
    { name: "Foundation", icon: Building2, color: "text-gray-700" },
    { name: "Welding", icon: Zap, color: "text-gray-700" },
    { name: "Tiling", icon: Layers, color: "text-gray-700" },
    { name: "Countertops", icon: Settings, color: "text-gray-700" },
    { name: "Cabinetry", icon: Box, color: "text-gray-700" },
    { name: "Appliances", icon: Power, color: "text-gray-700" },
  ];

  // Split into 2 rows of 15 each
  const firstRowCategories = allCategories.slice(0, 15);
  const secondRowCategories = allCategories.slice(15, 30);

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
    <div className="relative py-8 bg-gradient-to-br from-gray-50 via-white to-primary/20 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23fbbf24%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Categories Section */}
        <div className="mb-12">
          {/* Consolidated Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-4 shadow-sm bg-primary">
              <Sparkles className="w-4 h-4 text-black" />
              <span className="text-xs font-bold text-black uppercase tracking-tight">
                All-in-One Construction Intelligence Platform
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
              Explore <span className="text-primary">Professional Categories</span>
            </h2>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">
              Find reliable subcontractors and use AI-powered insights to win more projects and scale your business.
            </p>
          </div>

          {/* Single Unified Container */}
          <div className="bg-[#f5f5f0] rounded-3xl p-5 sm:p-7 shadow-lg border border-gray-200/50">
            <style>{`
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
            `}</style>

            {/* Top Part: Categories - Now more compact */}
            <div className="mb-6 border-b border-gray-300/30">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Popular Trade Categories in Construction</h3>
              </div>

              {/* Single Row of Categories */}
              <div className="relative mb-3">
                <button
                  onClick={() => {
                    const container = document.getElementById('category-scroll-container');
                    if (container) {
                      container.scrollBy({ left: -200, behavior: 'smooth' });
                    }
                  }}
                  className="absolute left-0 top-[18px] flex items-center justify-center w-6 h-6 rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:bg-white transition-colors z-10"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-700" />
                </button>
                <div
                  id="category-scroll-container"
                  className="flex items-center gap-5 overflow-x-auto pb-2 scrollbar-hide scroll-smooth px-10"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {allCategories.map((category, index) => {
                    const IconComponent = category.icon;
                    const isActive = activeCategory === category.name;
                    return (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.preventDefault();
                          setActiveCategory(category.name);
                        }}
                        className="flex flex-col items-center gap-2 min-w-[70px] flex-shrink-0 transition-all duration-200 group"
                      >
                        <div className={`p-2 rounded-xl transition-colors ${isActive ? 'bg-[#fce011]' : 'bg-white group-hover:bg-yellow-50 shadow-sm'}`}>
                          <IconComponent
                            className={`w-5 h-5 ${isActive ? 'text-black' : 'text-gray-700'}`}
                            strokeWidth={2}
                          />
                        </div>
                        <span className={`text-[10px] text-center leading-tight whitespace-nowrap ${isActive ? "text-gray-900 font-bold" : "text-gray-600 font-medium"}`}>
                          {category.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => {
                    const container = document.getElementById('category-scroll-container');
                    if (container) {
                      container.scrollBy({ left: 200, behavior: 'smooth' });
                    }
                  }}
                  className="absolute right-0 top-[18px] flex items-center justify-center w-6 h-6 rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:bg-white transition-colors z-10"
                >
                  <ChevronRight className="w-4 h-4 text-gray-700" />
                </button>
              </div>
            </div>

            {/* Sub-Trades Grid - Dynamically populated based on activeCategory */}
            {activeCategory && (
              <div className="mt-8 animate-in fade-in slide-in-from-top-4 duration-500 border-t border-gray-200/50 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-primary rounded-full inline-block"></span>
                    {activeCategory} Services
                  </h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {(() => {
                    // Helper to generate sub-categories based on the active one
                    const getSubData = (cat: string) => {
                      // Image mappings for categories
                      const imageMap: Record<string, string[]> = {
                        "Plumbers": [
                          "https://images.unsplash.com/photo-1581244277943-fe0ef9d47b5f?auto=format&fit=crop&q=80&w=400", // Pipes
                          "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&q=80&w=400", // Fix
                          "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=400", // Water
                          "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400"  // Bath
                        ],
                        "Electrical pros": [
                          "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=400", // Wires
                          "https://images.unsplash.com/photo-1544724569-5f546fd6dd2d?auto=format&fit=crop&q=80&w=400", // Light
                          "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&q=80&w=400", // Panel
                          "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=400"  // Smart
                        ],
                        "Landscapers": [
                          "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80&w=400", // Lawn
                          "https://images.unsplash.com/photo-1599824426001-c88f615372c0?auto=format&fit=crop&q=80&w=400", // Tree
                          "https://images.unsplash.com/photo-1621960248888-29cca2535a29?auto=format&fit=crop&q=80&w=400", // Hedge
                          "https://images.unsplash.com/photo-1592595896551-12b371d546d5?auto=format&fit=crop&q=80&w=400"  // Design
                        ],
                        "Cleaners": [
                          "https://images.unsplash.com/photo-1581578731117-10d52143b0e8?auto=format&fit=crop&q=80&w=400", // Deep
                          "https://images.unsplash.com/photo-1527515673516-756372da8015?auto=format&fit=crop&q=80&w=400", // Window
                          "https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&q=80&w=400", // Carpet
                          "https://images.unsplash.com/photo-1528740561666-dc24705f08a7?auto=format&fit=crop&q=80&w=400"  // Move
                        ],
                        "Painters": [
                          "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=400", // Roll
                          "https://images.unsplash.com/photo-1562259920-47afc305f369?auto=format&fit=crop&q=80&w=400", // Wall
                          "https://images.unsplash.com/photo-1595111867116-291583d47c4e?auto=format&fit=crop&q=80&w=400", // Exterior
                          "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=400"  // Detail
                        ],
                        "Roofing": [
                          "https://images.unsplash.com/photo-1632759145351-1d592919f522?auto=format&fit=crop&q=80&w=400", // Shingles
                          "https://images.unsplash.com/photo-1598177579736-231cb4892c5a?auto=format&fit=crop&q=80&w=400", // Metal
                          "https://images.unsplash.com/photo-1595814467389-91ee7491cf49?auto=format&fit=crop&q=80&w=400", // Solar
                          "https://images.unsplash.com/photo-1595420377045-8c08cb4d2719?auto=format&fit=crop&q=80&w=400"  // Repair
                        ],
                        "Handymen": [
                          "https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&q=80&w=400",
                          "https://images.unsplash.com/photo-1505798577917-a651a5d40320?auto=format&fit=crop&q=80&w=400",
                          "https://images.unsplash.com/photo-1581092921461-eab62e97a782?auto=format&fit=crop&q=80&w=400",
                          "https://images.unsplash.com/photo-1454692173233-f4f34c12adad?auto=format&fit=crop&q=80&w=400"
                        ],
                        "Movers": [
                          "https://images.unsplash.com/photo-1504958043606-d560c5a7114b?auto=format&fit=crop&q=80&w=400",
                          "https://images.unsplash.com/photo-1625906230917-26e5fc503250?auto=format&fit=crop&q=80&w=400",
                          "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?auto=format&fit=crop&q=80&w=400",
                          "https://images.unsplash.com/photo-1603517452654-e0b65670868a?auto=format&fit=crop&q=80&w=400"
                        ],
                        "HVAC": [
                          "https://images.unsplash.com/photo-1520114878144-6123749968dd?auto=format&fit=crop&q=80&w=400",
                          "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=400",
                          "https://images.unsplash.com/photo-1516937941348-c0331b32d9df?auto=format&fit=crop&q=80&w=400",
                          "https://images.unsplash.com/photo-1616423640778-28d1b53229bd?auto=format&fit=crop&q=80&w=400"
                        ],
                        "Carpentry": [
                          "https://images.unsplash.com/photo-1503708928676-1cb796a0891e?auto=format&fit=crop&q=80&w=400",
                          "https://images.unsplash.com/photo-1533560737976-78e874945d81?auto=format&fit=crop&q=80&w=400",
                          "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=400",
                          "https://images.unsplash.com/photo-1588667631376-70e93cc15ce9?auto=format&fit=crop&q=80&w=400"
                        ],
                        "Flooring": [
                          "https://images.unsplash.com/photo-1581858726768-fd1192e27e8d?auto=format&fit=crop&q=80&w=400",
                          "https://images.unsplash.com/photo-1516455590571-0f735d4615a9?auto=format&fit=crop&q=80&w=400",
                          "https://images.unsplash.com/photo-1594235372071-7d12f451f478?auto=format&fit=crop&q=80&w=400",
                          "https://images.unsplash.com/photo-1584622277026-6a978f1f5107?auto=format&fit=crop&q=80&w=400"
                        ],
                        "Drywall": [
                          "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=400",
                          "https://images.unsplash.com/photo-1590483005527-dc5328224522?auto=format&fit=crop&q=80&w=400",
                          "https://images.unsplash.com/photo-1595111867116-291583d47c4e?auto=format&fit=crop&q=80&w=400",
                          "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=400"
                        ],
                        "Concrete": [
                          "https://images.unsplash.com/photo-1518640165980-d3e0e2aa2bf2?auto=format&fit=crop&q=80&w=400",
                          "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=400",
                          "https://images.unsplash.com/photo-1549488497-29cf9787e9c2?auto=format&fit=crop&q=80&w=400",
                          "https://images.unsplash.com/photo-1517581177697-a06a18481210?auto=format&fit=crop&q=80&w=400"
                        ],
                        "Masonry": [
                          "https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?auto=format&fit=crop&q=80&w=400",
                          "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=400",
                          "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&q=80&w=400",
                          "https://images.unsplash.com/photo-1534237710431-e2fc698436d0?auto=format&fit=crop&q=80&w=400"
                        ],
                        "Insulation": [
                          "https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&q=80&w=400",
                          "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=400",
                          "https://images.unsplash.com/photo-1518458028785-8fbcd101ebb9?auto=format&fit=crop&q=80&w=400",
                          "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&q=80&w=400"
                        ],
                        "Windows": [
                          "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=400",
                          "https://images.unsplash.com/photo-1594818379496-da1e345b0ded?auto=format&fit=crop&q=80&w=400",
                          "https://images.unsplash.com/photo-1506473551532-602058b7367c?auto=format&fit=crop&q=80&w=400",
                          "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=400"
                        ],
                        "Doors": [
                          "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=400",
                          "https://images.unsplash.com/photo-1516455590571-0f735d4615a9?auto=format&fit=crop&q=80&w=400",
                          "https://images.unsplash.com/photo-1549408226-4066ea196ce3?auto=format&fit=crop&q=80&w=400",
                          "https://images.unsplash.com/photo-1489171078254-c3365d6e359f?auto=format&fit=crop&q=80&w=400"
                        ],
                        "Siding": [
                          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=400",
                          "https://images.unsplash.com/photo-1590483005527-dc5328224522?auto=format&fit=crop&q=80&w=400",
                          "https://images.unsplash.com/photo-1595111867116-291583d47c4e?auto=format&fit=crop&q=80&w=400",
                          "https://images.unsplash.com/photo-1595814467389-91ee7491cf49?auto=format&fit=crop&q=80&w=400"
                        ],
                        "Gutters": [
                          "https://images.unsplash.com/photo-1632759145351-1d592919f522?auto=format&fit=crop&q=80&w=400",
                          "https://images.unsplash.com/photo-1598177579736-231cb4892c5a?auto=format&fit=crop&q=80&w=400",
                          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=400",
                          "https://images.unsplash.com/photo-1595420377045-8c08cb4d2719?auto=format&fit=crop&q=80&w=400"
                        ],
                        "Decking": [
                          "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&q=80&w=400",
                          "https://images.unsplash.com/photo-1595111867116-291583d47c4e?auto=format&fit=crop&q=80&w=400",
                          "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&q=80&w=400",
                          "https://images.unsplash.com/photo-1558442074-3c19266e89e7?auto=format&fit=crop&q=80&w=400"
                        ],
                        "Fencing": [
                          "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?auto=format&fit=crop&q=80&w=400",
                          "https://images.unsplash.com/photo-1574360773950-7042a92a54fb?auto=format&fit=crop&q=80&w=400",
                          "https://images.unsplash.com/photo-1563825867375-385002b8529f?auto=format&fit=crop&q=80&w=400",
                          "https://images.unsplash.com/photo-1598520106830-8c45c2035460?auto=format&fit=crop&q=80&w=400"
                        ],
                        "Paving": [
                          "https://images.unsplash.com/photo-1590483005527-dc5328224522?auto=format&fit=crop&q=80&w=400",
                          "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=400",
                          "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=400",
                          "https://images.unsplash.com/photo-1518779607149-de244a04d603?auto=format&fit=crop&q=80&w=400"
                        ],
                        "Demolition": [
                          "https://images.unsplash.com/photo-1518640165980-d3e0e2aa2bf2?auto=format&fit=crop&q=80&w=400",
                          "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=400",
                          "https://images.unsplash.com/photo-1549488497-29cf9787e9c2?auto=format&fit=crop&q=80&w=400",
                          "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=400"
                        ],
                        "Excavation": [
                          "https://images.unsplash.com/photo-1503708928676-1cb796a0891e?auto=format&fit=crop&q=80&w=400",
                          "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=400",
                          "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=400",
                          "https://images.unsplash.com/photo-1615811361263-14902157c7fc?auto=format&fit=crop&q=80&w=400"
                        ],
                        "Foundation": [
                          "https://images.unsplash.com/photo-1518779607149-de244a04d603?auto=format&fit=crop&q=80&w=400",
                          "https://images.unsplash.com/photo-1590483005527-dc5328224522?auto=format&fit=crop&q=80&w=400",
                          "https://images.unsplash.com/photo-1549488497-29cf9787e9c2?auto=format&fit=crop&q=80&w=400",
                          "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=400"
                        ],
                        "Welding": [
                          "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=400",
                          "https://images.unsplash.com/photo-1518709779341-56cf4535e94b?auto=format&fit=crop&q=80&w=400",
                          "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&q=80&w=400",
                          "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=400"
                        ],
                        "Tiling": [
                          "https://images.unsplash.com/photo-1584622277026-6a978f1f5107?auto=format&fit=crop&q=80&w=400",
                          "https://images.unsplash.com/photo-1516455590571-0f735d4615a9?auto=format&fit=crop&q=80&w=400",
                          "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=400",
                          "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=400"
                        ],
                        "Countertops": [
                          "https://images.unsplash.com/photo-1584622277026-6a978f1f5107?auto=format&fit=crop&q=80&w=400",
                          "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&q=80&w=400",
                          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=400",
                          "https://images.unsplash.com/photo-1590483005527-dc5328224522?auto=format&fit=crop&q=80&w=400"
                        ],
                        "Cabinetry": [
                          "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&q=80&w=400",
                          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=400",
                          "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=400",
                          "https://images.unsplash.com/photo-1590483005527-dc5328224522?auto=format&fit=crop&q=80&w=400"
                        ],
                        "Appliances": [
                          "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&q=80&w=400",
                          "https://images.unsplash.com/photo-1584622277026-6a978f1f5107?auto=format&fit=crop&q=80&w=400",
                          "https://images.unsplash.com/photo-1574966744033-d897507eb2e2?auto=format&fit=crop&q=80&w=400",
                          "https://images.unsplash.com/photo-1492139031021-d4ba1134045c?auto=format&fit=crop&q=80&w=400"
                        ]
                      };

                      const subLabels: Record<string, string[]> = {
                        "Plumbers": ["Emergency Repair", "Drain Cleaning", "Water Heaters", "Pipe Installation"],
                        "Electrical pros": ["Full Rewiring", "Smart Home", "Panel Upgrades", "Lighting Install"],
                        "Landscapers": ["Lawn Care", "Tree Service", "Hardscaping", "Irrigation"],
                        "Cleaners": ["Deep Cleaning", "Move-In/Out", "Carpet Cleaning", "Window Washing"],
                        "Painters": ["Interior Painting", "Exterior Painting", "Cabinet Refinishing", "Drywall Repair"],
                        "Roofing": ["Roof Replacement", "Leak Repair", "Gutter Install", "Solar Integration"],
                        "Handymen": ["Furniture Assembly", "TV Mounting", "Minor Repairs", "Fixture Updates"],
                        "Movers": ["Local Moves", "Long Distance", "Packing Services", "Furniture Moving"],
                        "HVAC": ["AC Repair", "Furnace Install", "Duct Cleaning", "System Tuning"],
                        "Carpentry": ["Custom Trim", "Framing", "Deck Building", "Cabinet Install"],
                        "Flooring": ["Hardwood Install", "Carpet Fitting", "Tile Work", "Floor Refinishing"],
                        "Drywall": ["Sheetrock Hang", "Taping & Mud", "Texture Match", "Patch Repair"],
                        "Concrete": ["Driveway Pour", "Patio Stamping", "Foundation Work", "Walkway Paving"],
                        "Masonry": ["Brick Laying", "Stone Veneer", "Chimney Repair", "Retaining Walls"],
                        "Insulation": ["Spray Foam", "Fiberglass", "Attic Sealing", "Wall Injection"],
                        "Windows": ["Window Replacement", "Glass Repair", "Seal Restoration", "Frame Fixes"],
                        "Doors": ["Entry Doors", "Garage Doors", "Interior Hang", "Locksmithing"],
                        "Siding": ["Vinyl Siding", "Fiber Cement", "Wood Siding", "Siding Repair"],
                        "Gutters": ["Gutter Install", "Gutter Cleaning", "Guards Setup", "Downspouts"],
                        "Decking": ["New Build", "Deck Resurfacing", "Railing Install", "Stair Repair"],
                        "Fencing": ["Wood Fencing", "Vinyl Fencing", "Chain Link", "Gate Repair"],
                        "Paving": ["Asphalt Paving", "Sealcoating", "Driveway Resurface", "Striping"],
                        "Demolition": ["Full Gut", "Debris Removal", "Wall Removal", "Site Clearing"],
                        "Excavation": ["Grading", "Trenching", "Land Clearing", "Pool Digging"],
                        "Foundation": ["Crack Repair", "Waterproofing", "Leveling", "New Pour"],
                        "Welding": ["Structural", "Ornamental", "Gate Repair", "Custom Fab"],
                        "Tiling": ["Bathroom Tile", "Kitchen Splash", "Floor Tiling", "Grout Seal"],
                        "Countertops": ["Granite Install", "Quartz Fitting", "Marble Repair", "Edge Chip Fix"],
                        "Cabinetry": ["Custom Build", "Refacing", "Hardware Swap", "Installation"],
                        "Appliances": ["Refrigerator Fix", "Washer/Dryer", "Dishwasher Install", "Oven Repair"]
                      };

                      // Fallback generator for other categories
                      const labels = subLabels[cat] || [
                        `Residential ${cat}`,
                        `Commercial ${cat}`,
                        `${cat} Repair`,
                        `${cat} Installation`
                      ];

                      const images = imageMap[cat] || [
                        "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=400", // Generic Build
                        "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=400", // Generic Site
                        "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=400", // Generic Hardhat
                        "https://images.unsplash.com/photo-1535732820275-9ffd998cac22?auto=format&fit=crop&q=80&w=400"  // Generic Tools
                      ];

                      return labels.map((label, i) => ({
                        name: label,
                        img: images[i % images.length]
                      }));
                    };

                    return getSubData(activeCategory).map((sub, idx) => (
                      <div
                        key={idx}
                        className="group relative h-36 sm:h-48 rounded-xl overflow-hidden shadow-sm border border-gray-100 cursor-default"
                      >
                        <img
                          src={sub.img}
                          alt={sub.name}
                          className="absolute inset-0 w-full h-full object-cover opacity-90"
                          onError={(e) => {
                            e.currentTarget.src = "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=400"; // Fallback
                            e.currentTarget.onerror = null;
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3 flex flex-col justify-end">
                          <h4 className="text-white text-[10px] sm:text-xs font-bold uppercase tracking-wide leading-tight group-hover:text-primary transition-colors">{sub.name}</h4>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div >
  );
};

export default PopularCategoriesSection;
