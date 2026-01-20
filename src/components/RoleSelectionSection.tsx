import { Link } from "react-router-dom";
import {
  Home,
  Building2,
  CheckCircle,
  FileText,
  MessageCircle,
  Zap,
  Brain,
  Network,
  Globe,
  ArrowRight,
  Package,
  Truck,
  ShoppingCart,
} from "lucide-react";

const RoleSelectionSection = () => {
  const roles = [
    {
      title: "I'm a Homeowner",
      description:
        "Find trusted, verified contractors for your home improvement projects. Get free quotes and connect with professionals who meet the highest standards.",
      icon: Home,
      bgColor: "bg-white",
      textColor: "text-gray-900",
      descColor: "text-gray-600",
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
      features: [
        { icon: CheckCircle, text: "Verified Contractors" },
        { icon: FileText, text: "Free Project Posting" },
        { icon: MessageCircle, text: "Direct Messaging" },
      ],
      buttonText: "Get Started",
      buttonClass:
        "bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black",
      subtitle: null,
    },
    {
      title: "I'm a Contractor",
      description:
        "Grow your business with AI-powered tools, priority leads, and commercial bid opportunities. Everything you need to scale.",
      icon: Building2,
      bgColor: "bg-gradient-to-br from-slate-800 to-slate-900",
      textColor: "text-white",
      descColor: "text-gray-300",
      iconBg: "bg-slate-700",
      iconColor: "text-orange-500",
      features: [
        { icon: Zap, text: "Priority Lead Access" },
        { icon: Brain, text: "AI Takeoff Tool" },
        { icon: Network, text: "ITB Network" },
        { icon: Globe, text: "Instant Website" },
      ],
      buttonText: "Join as Contractor",
      buttonClass:
        "bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black",
      subtitle: "GC OR SUB",
    },
    {
      title: "I'm a Supplier",
      description:
        "Connect with contractors and grow your network. Access commercial projects, manage bids efficiently, and expand your business reach.",
      icon: Package,
      bgColor: "bg-gradient-to-br from-orange-50 to-yellow-50",
      textColor: "text-gray-900",
      descColor: "text-gray-700",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      features: [
        { icon: ShoppingCart, text: "Project Opportunities" },
        { icon: Truck, text: "Supply Chain Network" },
        { icon: Network, text: "Business Connections" },
        { icon: FileText, text: "Bid Management" },
      ],
      buttonText: "Get Started",
      buttonClass:
        "bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black",
      subtitle: null,
    },
  ];

  return (
    <div className="relative py-16 bg-gradient-to-br from-gray-50 via-white to-yellow-50 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23fbbf24%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Choose Your Path
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands of professionals and homeowners building better
            together
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {roles.map((role, index) => {
            const IconComponent = role.icon;
            return (
              <div
                key={index}
                className={`${role.bgColor} rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200`}
              >
                {/* Icon */}
                <div className="flex justify-center mb-6">
                  <div
                    className={`${role.iconBg} w-16 h-16 rounded-full flex items-center justify-center shadow-md`}
                  >
                    <IconComponent
                      className={`w-8 h-8 ${role.iconColor}`}
                      strokeWidth={2}
                    />
                  </div>
                </div>

                {/* Title */}
                <h3
                  className={`text-2xl font-bold ${role.textColor} mb-2 text-center`}
                >
                  {role.title}
                </h3>

                {/* Subtitle for Contractor */}
                {role.subtitle && (
                  <p className={`text-sm font-semibold ${role.iconColor} mb-4 text-center`}>
                    {role.subtitle}
                  </p>
                )}

                {/* Description */}
                <p className={`${role.descColor} text-sm mb-6 leading-relaxed text-center`}>
                  {role.description}
                </p>

                {/* Features */}
                <div
                  className={`mb-8 ${
                    role.features.length > 3
                      ? "grid grid-cols-2 gap-3"
                      : "space-y-3"
                  }`}
                >
                  {role.features.map((feature, featureIndex) => {
                    const FeatureIcon = feature.icon;
                    return (
                      <div
                        key={featureIndex}
                        className="flex items-center gap-2"
                      >
                        <FeatureIcon
                          className={`w-5 h-5 ${role.iconColor} flex-shrink-0`}
                          strokeWidth={2}
                        />
                        <span
                          className={`text-sm ${role.textColor} font-medium`}
                        >
                          {feature.text}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Button */}
                <Link
                  to="/signup"
                  className={`${role.buttonClass} w-full flex items-center justify-center gap-2 font-bold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105`}
                >
                  {role.buttonText}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionSection;

