import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Building,
  Hammer,
  Home,
  Wrench,
  ArrowRight,
  DoorOpen,
  Bath,
  Search,
  MapPin,
  Zap,
  Palette,
  Wind,
  Layers,
  Square,
  Thermometer,
} from "lucide-react";

const HeroSection = () => {
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [zipCode, setZipCode] = useState("");
  const { toast } = useToast();

  const [serviceQuery, setServiceQuery] = useState("");

  useEffect(() => {
    const fetchGeoLocation = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        if (data.postal) {
          setZipCode(data.postal);
        }
      } catch (error) {
        console.error("Error fetching geo location:", error);
      }
    };
    fetchGeoLocation();
  }, []);

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 5) {
      setZipCode(value);
    }
  };

  const validateSearch = (e: React.MouseEvent) => {
    if (!zipCode) {
      e.preventDefault();
      toast({
        title: "ZIP Code Required",
        description: "Please enter a ZIP code to search for contractors.",
        variant: "destructive",
      });
      return;
    }
    if (zipCode.length !== 5) {
      e.preventDefault();
      toast({
        title: "Invalid ZIP Code",
        description: "Please enter a valid 5-digit US ZIP code.",
        variant: "destructive",
      });
    }
  };

  const categories = [
    { icon: Bath, label: "Bathroom Remodel", service: "Bathroom Remodel" },
    { icon: Square, label: "Windows & Doors", service: "Windows & Doors" },
    { icon: Home, label: "Roofing & Gutters", service: "Roofing & Gutters" },
    { icon: Building, label: "Masonry & Concrete", service: "Masonry & Concrete" },
    { icon: Wrench, label: "Plumbing", service: "Plumbing" },
    { icon: Palette, label: "Painting", service: "Painting" },
    { icon: Building, label: "Building Remodeling", service: "Building Remodeling" },
    { icon: Zap, label: "Electrician", service: "Electrician" },
    { icon: Thermometer, label: "HVAC Services", service: "HVAC Services" },
    { icon: Hammer, label: "Carpentry", service: "Carpentry" },
    { icon: Layers, label: "Flooring", service: "Flooring" },
    { icon: DoorOpen, label: "Kitchen Remodel", service: "Kitchen Remodel" },
  ];

  return (
    <div className="relative bg-gradient-to-br from-gray-50 via-white to-yellow-50 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23fbbf24%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
        <div className="grid lg:grid-cols-3 gap-8 items-center">
          {/* Left content */}
          <div className="lg:col-span-2 space-y-8 text-center lg:text-left">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black leading-tight">
                One Platform. Multiple Solutions.
              </h1>
            </div>

            {/* Search Section */}
            <div className="space-y-4">
              <p className="text-base sm:text-lg text-gray-700">
                Find Verified & Certified Pros in Your Area
              </p>

              {/* Description Box with Editable Zip Code */}
              <div className="max-w-4xl mx-auto lg:mx-0">
                <div className="flex items-center gap-3 bg-white border-2 border-gray-200 rounded-xl p-4 shadow-sm">
                  <Input
                    placeholder="Describe your project or problem — be as detailed as you'd like."
                    className="flex-1 border-0 bg-transparent placeholder:text-gray-400 focus:ring-0 text-base"
                    value={serviceQuery}
                    onChange={(e) => setServiceQuery(e.target.value)}
                  />
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <Input
                      placeholder="10118"
                      className="w-24 border-0 bg-transparent text-gray-700 font-semibold focus:ring-0 text-base"
                      value={zipCode}
                      onChange={handleZipCodeChange}
                      maxLength={5}
                    />
                  </div>
                  <a
                    href={`/contractors?zip=${encodeURIComponent(zipCode)}${serviceQuery
                      ? `&service=${encodeURIComponent(serviceQuery)}`
                      : ""
                      }`}
                    onClick={validateSearch}
                  >
                    <Button className="bg-[#fce011] hover:bg-[#fce011]/90 text-black font-bold px-6 rounded-lg shadow-md">
                      Search
                    </Button>
                  </a>
                </div>
                <p className="text-center text-gray-500 text-xs mt-3">
                  Trusted by 4.5M+ people • 4.9/5 ⭐ with over 300k reviews on the App Store
                </p>
              </div>
            </div>
            {/* Categories */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-6">
                <p className="text-sm sm:text-base lg:text-lg text-black font-bold underline underline-offset-4 text-center sm:text-left">
                  Explore Our Most Popular Visited Construction Pro Categories
                </p>
                <Link
                  to="/services"
                  className="text-black hover:text-black font-extrabold text-xs sm:text-sm mt-1"
                >
                  + 37 more
                </Link>
              </div>

              {/* Icons grid responsive */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 justify-items-center lg:justify-items-start">
                {categories.map((category, index) => {
                  const IconComponent = category.icon;
                  return (
                    <Link
                      key={index}
                      to={`/contractors?service=${encodeURIComponent(category.service)}`}
                      className="flex flex-col items-center justify-center w-[85px] h-[85px] border border-gray-300 rounded-lg bg-gray-300 hover:bg-[#fce011] hover:border-[#fce011] transition-all duration-300 cursor-pointer group"
                    >
                      <IconComponent className="w-6 h-6 text-black group-hover:text-yellow-900 mb-1 transition-colors duration-300" />
                      <span className="text-[10px] sm:text-xs font-medium text-gray-900 group-hover:text-yellow-900 text-center px-1 leading-tight transition-colors duration-300">
                        {category.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right content - Hero image */}
          <div className="lg:col-span-1 flex justify-end -mr-32 lg:-mr-96 overflow-hidden lg:flex">
            <div className="relative z-10">
              <img
                src="/lovable-uploads/b9965203-96b6-4c77-92c6-2a3bbd331d98.png"
                alt="Professional contractor with tools"
                className="w-auto h-auto max-w-none lg:max-w-4xl transform hover:scale-105 transition-transform duration-500"
                style={{ maxHeight: "500px" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
