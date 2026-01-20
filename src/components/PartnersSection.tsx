import { Link } from "react-router-dom";
import { useState } from "react";
import {
  Home,
  Shield,
  Droplets,
  Building2,
  Radio,
  Sofa,
  Wrench,
  Power,
  Sparkles,
  Users,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const PartnersSection = () => {
  const [showAllServices, setShowAllServices] = useState(false);

  const categories = [
    {
      name: "roofing contractors near me",
      icon: Home,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      name: "asbestos abatement near me",
      icon: Shield,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      name: "basement leak repair near me",
      icon: Droplets,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      name: "basement waterproofing near me",
      icon: Droplets,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      name: "new roofing installation near me",
      icon: Home,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      name: "garage remodeling near me",
      icon: Building2,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
    },
    {
      name: "awning contractors near me",
      icon: Home,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      name: "repair home audio near me",
      icon: Radio,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      name: "repair patio furniture near me",
      icon: Sofa,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      name: "plumbing contractor near me",
      icon: Wrench,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      name: "power washing near me",
      icon: Power,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      name: "recliner repair near me",
      icon: Sofa,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      name: "basement remodeling near me",
      icon: Building2,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
    },
    {
      name: "roof siding near me",
      icon: Home,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      name: "facade repair near me",
      icon: Building2,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
    },
  ];

  const additionalServices = [
    { name: "concrete contractors near me", icon: Building2, color: "text-gray-600", bgColor: "bg-gray-50" },
    { name: "drywall repair near me", icon: Building2, color: "text-gray-600", bgColor: "bg-gray-50" },
    { name: "electrical contractors near me", icon: Power, color: "text-yellow-600", bgColor: "bg-yellow-50" },
    { name: "fence installation near me", icon: Building2, color: "text-gray-600", bgColor: "bg-gray-50" },
    { name: "flooring contractors near me", icon: Building2, color: "text-gray-600", bgColor: "bg-gray-50" },
    { name: "gutter cleaning near me", icon: Droplets, color: "text-blue-600", bgColor: "bg-blue-50" },
    { name: "handyman services near me", icon: Wrench, color: "text-blue-600", bgColor: "bg-blue-50" },
    { name: "insulation contractors near me", icon: Building2, color: "text-gray-600", bgColor: "bg-gray-50" },
    { name: "kitchen remodeling near me", icon: Home, color: "text-orange-600", bgColor: "bg-orange-50" },
    { name: "landscaping contractors near me", icon: Building2, color: "text-green-600", bgColor: "bg-green-50" },
    { name: "painting contractors near me", icon: Home, color: "text-orange-600", bgColor: "bg-orange-50" },
    { name: "tile installation near me", icon: Building2, color: "text-gray-600", bgColor: "bg-gray-50" },
    { name: "window replacement near me", icon: Home, color: "text-orange-600", bgColor: "bg-orange-50" },
    { name: "deck builders near me", icon: Building2, color: "text-gray-600", bgColor: "bg-gray-50" },
    { name: "pool contractors near me", icon: Droplets, color: "text-blue-600", bgColor: "bg-blue-50" },
    { name: "solar panel installation near me", icon: Power, color: "text-yellow-600", bgColor: "bg-yellow-50" },
    { name: "HVAC contractors near me", icon: Power, color: "text-yellow-600", bgColor: "bg-yellow-50" },
    { name: "carpet installation near me", icon: Building2, color: "text-gray-600", bgColor: "bg-gray-50" },
    { name: "cabinet installation near me", icon: Building2, color: "text-gray-600", bgColor: "bg-gray-50" },
    { name: "countertop installation near me", icon: Building2, color: "text-gray-600", bgColor: "bg-gray-50" },
  ];

  const displayedCategories = showAllServices
    ? [...categories, ...additionalServices]
    : categories;

  return (
    <div className="relative py-20 bg-gradient-to-br from-gray-50 via-white to-yellow-50 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23fbbf24%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-50 rounded-full mb-6 shadow-sm">
            <Users className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-semibold text-orange-600">
              Join Over 1M+ Network of Construction Professionals!
            </span>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Best place for General Contractors to find suitable, reliable &
            economical sub-contractors
          </p>
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
            <span className="text-black">Popular </span>
            <span className="text-yellow-500">Construction Professional </span>
            <span className="text-black">Categories</span>
          </h2>
          <p className="text-gray-600 text-lg">
            Explore our comprehensive directory of verified construction
            professionals
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
          {displayedCategories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Link
                key={index}
                to={`/contractors?service=${encodeURIComponent(
                  category.name.replace(" near me", "")
                )}`}
                className="group"
              >
                <div className="bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 hover:border-orange-300 h-full flex flex-col">
                  <div
                    className={`${category.bgColor} w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <IconComponent
                      className={`w-6 h-6 ${category.color}`}
                      strokeWidth={2}
                    />
                  </div>
                  <p className="text-sm font-medium text-gray-800 group-hover:text-orange-600 transition-colors leading-tight flex-grow">
                    {category.name}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Show More/Less Button */}
        <div className="text-center mt-8">
          <button
            onClick={() => setShowAllServices(!showAllServices)}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            {showAllServices ? (
              <>
                <span>Show Less Categories</span>
                <ChevronUp className="w-5 h-5" />
              </>
            ) : (
              <>
                <span>View All Categories</span>
                <ChevronDown className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

        {/* Bottom divider */}
        <div className="mt-16 border-t-2 border-gray-200" />
      </div>
    </div>
  );
};

export default PartnersSection;
