import React from "react";
import ReduxHeader from "@/components/ReduxHeader";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import {
  Users,
  Award,
  Target,
  TrendingUp,
  CheckCircle,
  Star,
  Building2,
  Globe,
  Shield,
  Clock,
  Heart,
  Lightbulb,
  Trophy,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

const AboutUs = () => {
  const milestones = [
    {
      year: "2015",
      title: "Company Founded",
      description:
        "Started with a vision to revolutionize construction management",
    },
    {
      year: "2017",
      title: "First Major Project",
      description: "Completed our first $10M+ commercial development",
    },
    {
      year: "2019",
      title: "Technology Integration",
      description: "Launched our proprietary project management platform",
    },
    {
      year: "2021",
      title: "National Expansion",
      description: "Extended operations to 25+ major cities across the country",
    },
    {
      year: "2023",
      title: "Industry Recognition",
      description:
        "Awarded 'Construction Company of the Year' by Industry Leaders",
    },
    {
      year: "2024",
      title: "Sustainability Focus",
      description: "Achieved carbon-neutral operations and LEED certification",
    },
  ];

  const leadership = [
    {
      name: "John Smith",
      position: "CEO & Founder",
      experience: "25+ years",
      education: "MBA, Harvard Business School",
      specialization: "Strategic Leadership & Business Development",
      image: "boy1.jpg",
      bio: "John founded Contractorlist with a vision to transform the construction industry through technology and innovation. His extensive background in both construction and technology has been instrumental in the company's growth.",
    },
    {
      name: "Sarah Johnson",
      position: "Chief Technology Officer",
      experience: "20+ years",
      education: "MS Computer Science, MIT",
      specialization: "Construction Technology & Digital Innovation",
      image: "girl.jpg",
      bio: "Sarah leads our technology initiatives, developing cutting-edge solutions that streamline construction processes. Her expertise in both software development and construction workflows drives our digital transformation.",
    },
    {
      name: "Mike Davis",
      position: "Head of Operations",
      experience: "22+ years",
      education: "BS Civil Engineering, Stanford",
      specialization: "Project Management & Operations Excellence",
      image: "boy2.jpg",
      bio: "Mike oversees all operational aspects of our projects, ensuring quality delivery and client satisfaction. His field experience and operational expertise ensure seamless project execution.",
    },
    {
      name: "Lisa Chen",
      position: "Chief Financial Officer",
      experience: "18+ years",
      education: "CPA, MBA Finance, Wharton",
      specialization: "Financial Strategy & Risk Management",
      image: "girl2.jpg",
      bio: "Lisa manages our financial strategy and ensures sustainable growth. Her expertise in construction finance and risk management has been crucial to our expansion and profitability.",
    },
  ];

  const achievements = [
    {
      icon: Trophy,
      title: "Industry Awards",
      count: "25+",
      description: "Recognition for excellence and innovation",
    },
    {
      icon: Star,
      title: "Client Satisfaction",
      count: "98%",
      description: "Consistently high client satisfaction ratings",
    },
    {
      icon: Building2,
      title: "Projects Completed",
      count: "500+",
      description: "Successfully delivered projects of all sizes",
    },
    {
      icon: Globe,
      title: "Cities Served",
      count: "50+",
      description: "Nationwide presence and local expertise",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-yellow-50">
      <ReduxHeader />

      {/* Hero Section with Background Image */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/constructionAboutUs.jpg"
            alt="Construction team"
            className="w-full h-full sm:w-half sm:h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <div className="inline-flex items-center px-6 py-3 bg-yellow-500/20 backdrop-blur-sm rounded-full text-yellow-300 text-sm font-medium mb-8 max-md:text-xs">
            🏗️ Building Excellence Since 2015
          </div>
          <h1 className="text-6xl max-md:text-4xl font-bold mb-8 leading-tight">
            Transforming Construction
            <span className="block text-yellow-400">Through Innovation</span>
          </h1>
          <p className="text-2xl max-md:text-base mb-12 max-w-4xl mx-auto leading-relaxed opacity-90">
            We are more than just a construction company. We are visionaries,
            innovators, and builders who are reshaping the future of
            construction.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              to="/services"
              className="inline-flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-black px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 text-center max-md:text-sm max-md:px-8"
            >
              Explore Our Services
            </Link>
            <Link
              to="/case-studies"
              className="inline-flex items-center justify-center border-2 border-white text-white hover:bg-white hover:text-black px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 text-center max-md:text-sm max-md:px-8"
            >
              View Our Work
            </Link>
          </div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-24 bg-white max-md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 max-md:gap-10 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium mb-8 max-md:mb-4">
                Our Story
              </div>
              <h2 className="text-5xl max-md:text-3xl font-bold text-gray-900 mb-8 leading-tight">
                Building Tomorrow's
                <span className="text-yellow-500"> Infrastructure Today</span>
              </h2>
              <p className="text-xl max-md:text-base text-gray-600 mb-8 leading-relaxed">
                Founded in 2015 with a revolutionary vision, Contractorlist has
                grown from a small team to an industry leader.
              </p>
              <p className="text-lg max-md:text-base text-gray-600 mb-10 leading-relaxed">
                Our commitment goes beyond structures – we build relationships,
                communities, and a sustainable future.
              </p>
              <div className="grid grid-cols-2 gap-8 max-md:gap-4">
                <div>
                  <div className="text-4xl max-md:text-2xl font-bold text-yellow-500 mb-2">
                    $2.5B+
                  </div>
                  <div className="text-gray-600 font-medium">
                    Total Project Value
                  </div>
                </div>
                <div>
                  <div className="text-4xl max-md:text-2xl font-bold text-yellow-500 mb-2">
                    1000+
                  </div>
                  <div className="text-gray-600 font-medium">Team Members</div>
                </div>
              </div>
            </div>
            <div className="relative max-md:order-first">
              <img
                src="/modern.jpg"
                alt="Modern construction site"
                className="rounded-3xl shadow-2xl w-full"
              />
              <div className="absolute -bottom-8 -left-8 bg-yellow-500 text-black p-8 rounded-2xl shadow-xl max-md:p-4 max-md:-bottom-4 max-md:-left-4">
                <div className="text-3xl max-md:text-xl font-bold mb-2">
                  9 Years
                </div>
                <div className="font-medium text-sm max-md:text-xs">
                  of Excellence
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-24 bg-gray-50 max-md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 max-md:mb-10">
            <h2 className="text-5xl max-md:text-3xl font-bold text-gray-900 mb-6">
              Our Foundation
            </h2>
            <p className="text-xl max-md:text-base text-gray-600 max-w-3xl mx-auto">
              Built on strong principles that guide every project.
            </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-12 max-md:grid-cols-1">
            {/* Each card remains same but scales nicely */}
            {[Target, Lightbulb, Heart].map((Icon, i) => (
              <div
                key={i}
                className="bg-white p-10 max-md:p-6 rounded-3xl shadow-xl border border-gray-100"
              >
                <div className="w-16 h-16 max-md:w-12 max-md:h-12 bg-yellow-100 rounded-2xl flex items-center justify-center mb-8">
                  <Icon className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="text-2xl max-md:text-xl font-bold text-gray-900 mb-6">
                  {i === 0
                    ? "Our Mission"
                    : i === 1
                    ? "Our Vision"
                    : "Our Values"}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-8 max-md:text-sm">
                  {i === 0
                    ? "Deliver innovative, sustainable, and high-quality solutions."
                    : i === 1
                    ? "Set new standards for quality and sustainability globally."
                    : "Integrity, teamwork, and excellence in all we do."}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-white max-md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 max-md:mb-10">
            <h2 className="text-5xl max-md:text-3xl font-bold text-gray-900 mb-6">
              Our Journey
            </h2>
            <p className="text-xl max-md:text-base text-gray-600 max-w-3xl mx-auto">
              From humble beginnings to leadership.
            </p>
          </div>
          <div className="relative max-md:space-y-10">
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-yellow-200"></div>
            <div className="space-y-16 max-md:space-y-10">
              {milestones.map((m, i) => (
                <div
                  key={i}
                  className={`flex max-md:flex-col items-center ${
                    i % 2 === 0 ? "flex-row" : "flex-row-reverse"
                  }`}
                >
                  <div
                    className={`w-1/2 max-md:w-full ${
                      i % 2 === 0
                        ? "pr-12 text-right max-md:pr-0 max-md:text-left"
                        : "pl-12 text-left max-md:pl-0"
                    }`}
                  >
                    <div className="bg-white p-8 max-md:p-6 rounded-2xl shadow-lg border border-gray-100">
                      <div className="text-3xl font-bold text-yellow-500 mb-2">
                        {m.year}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {m.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {m.description}
                      </p>
                    </div>
                  </div>
                  <div className="relative z-10 w-6 h-6 bg-yellow-500 rounded-full border-4 border-white shadow-lg max-md:hidden"></div>
                  <div className="w-1/2 max-md:hidden"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-24 bg-gray-50 max-md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 max-md:mb-10">
            <h2 className="text-5xl max-md:text-3xl font-bold text-gray-900 mb-6">
              Leadership Excellence
            </h2>
            <p className="text-xl max-md:text-base text-gray-600 max-w-3xl mx-auto">
              Meet the visionary leaders shaping our success.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-md:grid-cols-1">
            {leadership.map((leader, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
              >
                <div className="p-10 max-md:p-6">
                  <div className="flex items-start space-x-6 max-md:flex-col max-md:space-x-0 max-md:space-y-4">
                    <img
                      src={leader.image}
                      alt={leader.name}
                      className="w-24 h-24 rounded-2xl object-cover mx-auto max-md:w-20 max-md:h-20"
                    />
                    <div className="flex-1 w-[100%] text-left max-md:text-center">
                      <h3 className="text-2xl max-md:text-xl font-bold text-gray-900 mb-2 max-md:mx-auto">
                        {leader.name}
                      </h3>
                      <p className="text-yellow-600 font-bold mb-2 max-md:mx-auto">
                        {leader.position}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-4 justify-start max-md:justify-center">
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {leader.experience}
                        </span>
                        <span>{leader.education}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 text-left max-md:text-center">
                    <div className="inline-flex px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium mb-4">
                      {leader.specialization}
                    </div>
                    <p className="text-gray-600 leading-relaxed max-md:text-sm">
                      {leader.bio}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-24 bg-white max-md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl max-md:text-3xl font-bold text-gray-900 mb-6">
            Our Achievements
          </h2>
          <p className="text-xl max-md:text-base text-gray-600 max-w-3xl mx-auto mb-16">
            Recognition that demonstrates our commitment to excellence.
          </p>
          <div className="grid md:grid-cols-4 max-md:grid-cols-2 gap-8">
            {achievements.map((a, i) => {
              const Icon = a.icon;
              return (
                <div
                  key={i}
                  className="text-center p-8 max-md:p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-3xl border border-yellow-200"
                >
                  <div className="inline-flex p-4 bg-yellow-500 rounded-2xl mb-6">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-4xl max-md:text-2xl font-bold text-gray-900 mb-3">
                    {a.count}
                  </div>
                  <h3 className="text-xl max-md:text-base font-bold text-gray-900 mb-2">
                    {a.title}
                  </h3>
                  <p className="text-gray-600 max-md:text-sm">
                    {a.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-24 max-md:py-16 bg-gradient-to-r from-gray-900 via-black to-gray-900 text-center">
        <h2 className="text-5xl max-md:text-3xl font-bold text-white mb-8">
          Ready to Build Something Amazing?
        </h2>
        <p className="text-2xl max-md:text-base text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
          Partner with industry leaders who bring vision, expertise, and
          innovation to every project.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
          <Link
            to="/join-network"
            className="inline-flex items-center bg-yellow-500 hover:bg-yellow-600 text-black px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 max-md:text-sm max-md:px-6"
          >
            Join Our Network
          </Link>
          <Link
            to="/case-studies"
            className="inline-flex items-center border-2 border-white text-white hover:bg-white hover:text-black px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 max-md:text-sm max-md:px-6"
          >
            View Our Projects
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto text-gray-300 max-md:grid-cols-1 max-md:gap-4">
          <div className="flex items-center justify-center space-x-3">
            <MapPin className="w-6 h-6 text-yellow-500" />
            <span>Nationwide Coverage</span>
          </div>
          <div className="flex items-center justify-center space-x-3">
            <Phone className="w-6 h-6 text-yellow-500" />
            <span>1-800-CONTRACTOR</span>
          </div>
          <div className="flex items-center justify-center space-x-3">
            <Mail className="w-6 h-6 text-yellow-500" />
            <span>info@contractorlist.com</span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;
