import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMemo, useState } from "react";
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
  const [serviceQuery, setServiceQuery] = useState("");

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
                  <div className="bg-yellow-400 rounded-full w-10 h-10 flex items-center justify-center mb-2 shadow">
                    {step.icon}
                  </div>
                  <p className="text-sm font-small text-gray-800 max-w-[160px] leading-snug">
                    {step.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Search Section */}
            <div className="space-y-0">
              <div className="flex flex-col sm:flex-row items-stretch gap-3">
                <div className="flex-[2] w-full">
                  <Input
                    placeholder="Search Contractors in your area"
                    className="h-12 sm:h-14 rounded-full border border-yellow-400 bg-white placeholder:text-gray-400 focus:ring-0 focus:border-yellow-500"
                    value={serviceQuery}
                    onChange={(e) => setServiceQuery(e.target.value)}
                  />
                </div>
                <div className="flex-1 sm:max-w-xs w-full">
                  <Input
                    placeholder="Zip Code"
                    className="h-12 sm:h-14 rounded-full border border-yellow-400 bg-white placeholder:text-gray-400 focus:ring-0 focus:border-yellow-500"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                  />
                </div>
                <a
                  className="inline-flex items-center justify-center whitespace-nowrap bg-[#fce011] hover:bg-[#fce011]/90 text-black font-semibold px-6 sm:px-8 h-12 sm:h-14 rounded-full border border-yellow-500/40 shadow-[0_6px_14px_rgba(0,0,0,0.25)] hover:shadow-[0_8px_18px_rgba(0,0,0,0.28)] transition-shadow"
                  href={`/contractors?zip=${encodeURIComponent(zipCode)}${
                    serviceQuery
                      ? `&service=${encodeURIComponent(serviceQuery)}`
                      : ""
                  }`}
                  onClick={(e) => {
                    if (!zipCode) e.preventDefault();
                  }}
                >
                  Search
                </a>
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

export default ContractorHeroSection;
