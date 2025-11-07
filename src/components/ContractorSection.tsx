import React, { useState } from "react";

const ContractorSection = () => {
  const [selectedTab, setSelectedTab] = useState(
    "Subcontractor & Service Provider"
  );

  const tabs = [
    "Subcontractor & Service Provider",
    "General Contractor",
    "BPM & Supplier",
    "Architect",
    "Property Manager/ Owner",
  ];

  return (
    <div className="font-sans bg-white py-10">
      {/* ===== Header Tabs ===== */}
      <div className="flex justify-center space-x-8 pb-4 mb-10">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`pb-2 text-sm sm:text-base font-medium transition-colors ${
              selectedTab === tab
                ? "text-black border-b-2 border-yellow-400 font-semibold"
                : "text-gray-500 hover:text-black border-b-2 border-transparent"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ===== Main Section ===== */}
      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-stretch shadow-xl rounded-2xl overflow-hidden h-[420px]">
        {/* Left Image - 40% */}
        <div className="lg:w-[40%] flex items-center justify-center">
          <img
            src="cont.png"
            alt="Helmet"
            className="w-full h-full object-cover rounded-l-2xl"
          />
        </div>

        {/* Right Info - 60% */}
        <div className="lg:w-[60%] relative overflow-hidden py-6">
          {/* Blurred, faded background layer */}
          <div className="absolute inset-0 bg-[url('/line.jpg')] bg-cover bg-no-repeat opacity-10 blur-[2px]"></div>

          {/* Foreground content */}
          <div className="relative flex flex-col h-full justify-start px-10">
            <h2 className="text-xl font-bold mb-3 text-black">
              Subcontractors and Service Providers
            </h2>
            <p className="text-gray-700 mb-6">
              Increase your visibility and find more projects
            </p>

            <ul className="text-gray-700 space-y-3 mb-8 list-disc pl-4">
              <li className="font-light text-sm">
                Create a profile to showcase your specialties, qualifications,
                and previous project experience
              </li>
              <li className="font-light text-sm">
                Search our database to find project opportunities in the bidding
                stage
              </li>
              <li className="font-light text-sm">
                Receive ITBs directly from general contractors and manage all
                bids in one place
              </li>
            </ul>

            {/* Buttons */}
            <div className="flex space-x-4 justify-center mt-[10%]">
              <button className="w-[40%] bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold px-6 py-3 rounded-full text-sm shadow-[4px_6px_0px_#000000] transform hover:scale-105 transition-all duration-200">
                Join Now
              </button>
              <button className="w-[40%] bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold px-6 py-3 rounded-full text-sm shadow-[4px_6px_0px_#000000] transform hover:scale-105 transition-all duration-200">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Bottom Text Section ===== */}
      <div className="max-w-5xl mx-auto text-center mt-20 px-6">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
          What Contractorslist.com is Actually!
        </h2>
        <p className="text-gray-700 leading-relaxed text-lg">
          With a legacy spanning 110 years, The Blue Book is an indispensable
          resource within the construction industry, facilitating connections
          between project decision-makers, subcontractors and other service
          providers nationwide. As part of Dodge Construction Network, The Blue
          Book empowers businesses across all specialties and trades to secure
          additional project work, enhance company visibility, and broaden their
          professional network.
        </p>
      </div>
    </div>
  );
};

export default ContractorSection;
