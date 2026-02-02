import { Link } from "react-router-dom";
import { MapPin, ArrowLeft } from "lucide-react";
import ReduxHeader from "@/components/ReduxHeader";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const Locations = () => {
  // All 50 US States
  const allStates = [
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming"
  ];

  return (
    <div className="min-h-screen bg-background">
      <ReduxHeader />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/">
            <Button variant="ghost" className="mb-6 hover:bg-white/50">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Find Contractors Across America
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We connect you with trusted, verified contractors in all 50 states. 
              Select your state to find local professionals ready to help with your project.
            </p>
          </div>
        </div>
      </section>

      {/* All States Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              All 50 States
            </h2>
            <p className="text-gray-600">
              Click on any state to find contractors in your area
            </p>
          </div>

          {/* States Grid - 4 columns on desktop, responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {allStates.map((state, index) => (
              <Link
                key={index}
                to={`/locations/${state.toLowerCase().replace(/\s+/g, '-')}`}
                className="flex items-center gap-3 px-5 py-4 bg-gray-50 rounded-lg hover:bg-[#fce011]/10 transition-all duration-300 border border-gray-200 hover:border-[#fce011] hover:shadow-md group"
              >
                <MapPin className="w-5 h-5 text-gray-400 group-hover:text-[#fce011] transition-colors flex-shrink-0" />
                <span className="text-base font-medium text-gray-700 group-hover:text-gray-900">
                  {state}
                </span>
              </Link>
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-16 bg-gradient-to-r from-[#fce011]/10 to-[#fce011]/5 rounded-2xl p-8 border border-[#fce011]/20">
            <div className="text-center max-w-3xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Can't find your location?
              </h3>
              <p className="text-gray-600 mb-6">
                We're constantly expanding our network of contractors. If you don't see your specific city or county listed, 
                we can still help you find the right professional for your project.
              </p>
              <Link to="/contact-us">
                <Button className="bg-[#fce011] hover:bg-[#fce011]/90 text-black font-semibold px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-all">
                  Contact Us for Help
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Locations;
