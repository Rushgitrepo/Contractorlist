import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMemo, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
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
} from "lucide-react";
import { FaClipboardList, FaMapMarkerAlt, FaHandshake } from "react-icons/fa";

const ContractorHeroSection = () => {
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [zipCode, setZipCode] = useState("");
  const { toast } = useToast();

  const [serviceQuery, setServiceQuery] = useState("");

  useEffect(() => {
    const fetchGeoLocation = async () => {
      try {
        const response = await fetch('https://ipwho.is/');
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

  const steps = [
    {
      icon: <FaClipboardList className="text-2xl text-black" />,
      text: "Answer questions about project",
    },
    {
      icon: <FaMapMarkerAlt className="text-2xl text-black" />,
      text: "Get connected with pros for free",
    },
    {
      icon: <FaHandshake className="text-2xl text-black" />,
      text: "Hire the right pro with confidence",
    },
  ];

  return (
    <div className="relative   overflow-hidden">
      {/* Background decoration */}

      <div className="relative z-10 max-w-7xl  px-4 sm:px-6 lg:px-8 ">
        <div className="grid lg:grid-cols-3 gap-8 items-center">
          {/* Left content */}
          <div className="lg:col-span-2 space-y-8 text-center lg:text-left">
            <div>
              <h1 className="text-3xl sm:text-3xl lg:text-4xl font-bold text-black leading-tight text-center">
                Get matched with Local Professionals
              </h1>
              <p className="text-center sm:text-lg text-gray-700">
                Find verified & certified pros in your area
              </p>
            </div>

            <div className="relative flex justify-between items-start w-[70%] max-w-3xl mx-auto py-8">
              {/* Connector Line */}
              <div className="absolute top-14 left-[12.5%] right-[12.5%] h-[1px] bg-gray-300 z-0"></div>

              {/* Steps */}
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center z-10 w-[25%]"
                >
                  <div className="bg-[#fce011] rounded-full w-10 h-10 flex items-center justify-center mb-2 shadow">
                    {step.icon}
                  </div>
                  <p className="text-sm font-small text-gray-800 max-w-[160px] leading-snug">
                    {step.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Search Section */}
            <div className="space-y-4">
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
          </div>

          {/* Right content - Hero image */}
          <div className="lg:col-span-1 flex justify-end -mr-24 lg:-mr-32 overflow-hidden lg:flex">
            <div className="relative z-10">
              <img
                src="/contractors-hero.png"
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

export default ContractorHeroSection;
