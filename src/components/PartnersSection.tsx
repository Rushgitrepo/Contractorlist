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
  ChevronRight,
  ChevronLeft,
  Hammer,
  Paintbrush,
  HardHat,
  Zap,
  Wind,
  Car,
  TreePine,
  Sprout,
  Palette,
  Layers,
  Gauge,
  FileText,
  Settings,
  Box,
  Scissors,
  Package,
} from "lucide-react";

const PartnersSection = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>("Plumbers");
  
  const scrollRight = (rowId: string) => {
    const container = document.getElementById(`category-scroll-container-${rowId}`);
    if (container) {
      container.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  const scrollLeft = (rowId: string) => {
    const container = document.getElementById(`category-scroll-container-${rowId}`);
    if (container) {
      container.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  // All 30 categories for 2 rows (15 each)
  const allCategories = [
    {
      name: "Cleaners",
      icon: Sparkles,
      color: "text-gray-700",
    },
    {
      name: "Handymen",
      icon: Wrench,
      color: "text-gray-700",
    },
    {
      name: "Landscapers",
      icon: TreePine,
      color: "text-gray-700",
    },
    {
      name: "Movers",
      icon: Package,
      color: "text-gray-700",
    },
    {
      name: "Plumbers",
      icon: Droplets,
      color: "text-gray-700",
    },
    {
      name: "Electrical pros",
      icon: Zap,
      color: "text-gray-700",
    },
    {
      name: "Painters",
      icon: Paintbrush,
      color: "text-gray-700",
    },
    {
      name: "HVA",
      icon: Wind,
      color: "text-gray-700",    
    },
    {
      name: "Roofing",
      icon: Home,
      color: "text-gray-700",
    },
    {
      name: "Carpentry",
      icon: Hammer,
      color: "text-gray-700",
    },
    {
      name: "Flooring",
      icon: Layers,
      color: "text-gray-700",
    },
    {
      name: "Drywall",
      icon: Building2,
      color: "text-gray-700",
    },
    {
      name: "Concrete",
      icon: Shield,
      color: "text-gray-700",
    },
    {
      name: "Masonry",
      icon: HardHat,
      color: "text-gray-700",
    },
    {
      name: "Insulation",
      icon: Box,
      color: "text-gray-700",
    },
    {
      name: "Windows",
      icon: Home,
      color: "text-gray-700",
    },
    {
      name: "Doors",
      icon: Car,
      color: "text-gray-700",
    },
    {
      name: "Siding",
      icon: Gauge,
      color: "text-gray-700",
    },
    {
      name: "Gutters",
      icon: Droplets,
      color: "text-gray-700",
    },
    {
      name: "Decking",
      icon: Building2,
      color: "text-gray-700",
    },
    {
      name: "Fencing",
      icon: TreePine,
      color: "text-gray-700",
    },
    {
      name: "Paving",
      icon: Car,
      color: "text-gray-700",
    },
    {
      name: "Demolition",
      icon: Hammer,
      color: "text-gray-700",
    },
    {
      name: "Excavation",
      icon: HardHat,
      color: "text-gray-700",
    },
    {
      name: "Foundation",
      icon: Building2,
      color: "text-gray-700",
    },
    {
      name: "Welding",
      icon: Zap,
      color: "text-gray-700",
    },
    {
      name: "Tiling",
      icon: Layers,
      color: "text-gray-700",
    },
    {
      name: "Countertops",
      icon: Settings,
      color: "text-gray-700",
    },
    {
      name: "Cabinetry",
      icon: Box,
      color: "text-gray-700",
    },
    {
      name: "Appliances",
      icon: Power,
      color: "text-gray-700",
    },
  ];

  // Split into 2 rows of 15 each
  const firstRowCategories = allCategories.slice(0, 15);
  const secondRowCategories = allCategories.slice(15, 30);

  const categories = [
    {
      name: "roofing contractors",
      icon: Home,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop",
    },
    {
      name: "asbestos abatement",
      icon: Shield,
      color: "text-red-600",
      bgColor: "bg-red-50",
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop",
    },
    {
      name: "basement leak repair",
      icon: Droplets,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      image: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800&h=600&fit=crop",
    },
    {
      name: "basement waterproofing",
      icon: Layers,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      image: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800&h=600&fit=crop",
    },
    {
      name: "new roofing installation",
      icon: Hammer,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop",
    },
    {
      name: "garage remodeling",
      icon: Building2,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
    },
    {
      name: "awning contractors",
      icon: Car,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop",
    },
    {
      name: "repair home audio",
      icon: Radio,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      image: "https://images.unsplash.com/photo-1563297007-0686b8b4a8c7?w=800&h=600&fit=crop",
    },
    {
      name: "repair patio furniture",
      icon: Sofa,
      color: "text-green-600",
      bgColor: "bg-green-50",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
    },
    {
      name: "plumbing contractor",
      icon: Wrench,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      image: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800&h=600&fit=crop",
    },
    {
      name: "power washing",
      icon: Power,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&h=600&fit=crop",
    },
    {
      name: "recliner repair",
      icon: Settings,
      color: "text-green-600",
      bgColor: "bg-green-50",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
    },
    {
      name: "basement remodeling",
      icon: HardHat,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
    },
    {
      name: "roof siding",
      icon: Gauge,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop",
    },
    {
      name: "facade repair",
      icon: Paintbrush,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
    },
    {
      name: "electrical contractors",
      icon: Zap,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&h=600&fit=crop",
    },
    {
      name: "HVAC contractors",
      icon: Wind,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&h=600&fit=crop",
    },
    {
      name: "painting contractors",
      icon: Palette,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&h=600&fit=crop",
    },
  ];

  const additionalServices = [
    { name: "concrete contractors near me", icon: Building2, color: "text-gray-600", bgColor: "bg-gray-50", image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&h=600&fit=crop" },
    { name: "drywall repair near me", icon: Building2, color: "text-gray-600", bgColor: "bg-gray-50", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop" },
    { name: "electrical contractors near me", icon: Power, color: "text-yellow-600", bgColor: "bg-yellow-50", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&h=600&fit=crop" },
    { name: "fence installation near me", icon: Building2, color: "text-gray-600", bgColor: "bg-gray-50", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop" },
    { name: "flooring contractors near me", icon: Building2, color: "text-gray-600", bgColor: "bg-gray-50", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop" },
    { name: "gutter cleaning near me", icon: Droplets, color: "text-blue-600", bgColor: "bg-blue-50", image: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800&h=600&fit=crop" },
    { name: "handyman services near me", icon: Wrench, color: "text-blue-600", bgColor: "bg-blue-50", image: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800&h=600&fit=crop" },
    { name: "insulation contractors near me", icon: Building2, color: "text-gray-600", bgColor: "bg-gray-50", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop" },
    { name: "kitchen remodeling near me", icon: Home, color: "text-orange-600", bgColor: "bg-orange-50", image: "https://images.unsplash.com/photo-1556912172-45b7abe8b7e4?w=800&h=600&fit=crop" },
    { name: "landscaping contractors near me", icon: Building2, color: "text-green-600", bgColor: "bg-green-50", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop" },
    { name: "painting contractors near me", icon: Home, color: "text-orange-600", bgColor: "bg-orange-50", image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&h=600&fit=crop" },
    { name: "tile installation near me", icon: Building2, color: "text-gray-600", bgColor: "bg-gray-50", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop" },
    { name: "window replacement near me", icon: Home, color: "text-orange-600", bgColor: "bg-orange-50", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop" },
    { name: "deck builders near me", icon: Building2, color: "text-gray-600", bgColor: "bg-gray-50", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop" },
    { name: "pool contractors near me", icon: Droplets, color: "text-blue-600", bgColor: "bg-blue-50", image: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800&h=600&fit=crop" },
    { name: "solar panel installation near me", icon: Power, color: "text-yellow-600", bgColor: "bg-yellow-50", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&h=600&fit=crop" },
    { name: "HVAC contractors near me", icon: Power, color: "text-yellow-600", bgColor: "bg-yellow-50", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&h=600&fit=crop" },
    { name: "carpet installation near me", icon: Building2, color: "text-gray-600", bgColor: "bg-gray-50", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop" },
    { name: "cabinet installation near me", icon: Building2, color: "text-gray-600", bgColor: "bg-gray-50", image: "https://images.unsplash.com/photo-1556912172-45b7abe8b7e4?w=800&h=600&fit=crop" },
    { name: "countertop installation near me", icon: Building2, color: "text-gray-600", bgColor: "bg-gray-50", image: "https://images.unsplash.com/photo-1556912172-45b7abe8b7e4?w=800&h=600&fit=crop" },
  ];

  const displayedCategories = [...categories, ...additionalServices];

  // Get related services based on active category
  const getRelatedServices = () => {
    if (!activeCategory) {
      return categories.slice(0, 4);
    }
    
    const activeIndex = categories.findIndex(cat => cat.name === activeCategory);
    if (activeIndex === -1) return categories.slice(0, 4);
    
    // Get 4 related services starting from the active one
    const related = [];
    for (let i = 0; i < 4; i++) {
      const index = (activeIndex + i) % categories.length;
      related.push(categories[index]);
    }
    return related;
  };

  const featuredServices = getRelatedServices();

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
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">
            <span className="text-gray-900">Popular Construction </span>
            <span className="text-orange-600">Professional Categories</span>
          </h2>
        </div>

        {/* Beige Container with Categories - 2 Rows */}
        <div className="bg-[#f5f5f0] rounded-2xl p-6 sm:p-8 shadow-md mb-8">
          <style>{`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          
          {/* First Row */}
          <div className="relative mb-4">
            <div 
              id="category-scroll-container-row1"
              className="flex items-center gap-6 sm:gap-8 overflow-x-auto pb-4 scrollbar-hide scroll-smooth pr-12" 
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {firstRowCategories.map((category, index) => {
                const IconComponent = category.icon;
                const isActive = activeCategory === category.name;
                return (
                  <button
                    key={`row1-${index}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveCategory(category.name);
                    }}
                    className="flex flex-col items-center gap-3 min-w-[80px] flex-shrink-0 transition-all duration-200"
                  >
                    <IconComponent
                      className={`w-8 h-8 ${isActive ? "text-orange-600" : "text-gray-700"}`}
                      strokeWidth={2}
                    />
                    <span
                      className={`text-sm text-center leading-tight ${
                        isActive
                          ? "text-orange-600 font-bold"
                          : "text-gray-700 font-medium"
                      }`}
                    >
                      {category.name}
                    </span>
                    {isActive && (
                      <div className="w-full h-1 bg-orange-600 rounded-full mt-1"></div>
                    )}
                  </button>
                );
              })}
            </div>
            <button 
              onClick={() => scrollRight('row1')}
              className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors z-10"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* Second Row */}
          <div className="relative">
            <div 
              id="category-scroll-container-row2"
              className="flex items-center gap-6 sm:gap-8 overflow-x-auto pb-4 scrollbar-hide scroll-smooth pr-12" 
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {secondRowCategories.map((category, index) => {
                const IconComponent = category.icon;
                const isActive = activeCategory === category.name;
                return (
                  <button
                    key={`row2-${index}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveCategory(category.name);
                    }}
                    className="flex flex-col items-center gap-3 min-w-[80px] flex-shrink-0 transition-all duration-200"
                  >
                    <IconComponent
                      className={`w-8 h-8 ${isActive ? "text-orange-600" : "text-gray-700"}`}
                      strokeWidth={2}
                    />
                    <span
                      className={`text-sm text-center leading-tight ${
                        isActive
                          ? "text-orange-600 font-bold"
                          : "text-gray-700 font-medium"
                      }`}
                    >
                      {category.name}
                    </span>
                    {isActive && (
                      <div className="w-full h-1 bg-orange-600 rounded-full mt-1"></div>
                    )}
                  </button>
                );
              })}
            </div>
            <button 
              onClick={() => scrollRight('row2')}
              className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors z-10"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PartnersSection;
