import { useParams, Link } from "react-router-dom";
import { MapPin, ArrowLeft, Building2 } from "lucide-react";
import ReduxHeader from "@/components/ReduxHeader";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { US_STATE_CITIES } from "../data/usCities";

const StateDetail = () => {
  const { state } = useParams<{ state: string }>();

  // Convert URL slug back to proper state name
  const stateName = state
    ?.split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ') || '';

  const cities = US_STATE_CITIES[stateName] || [];

  return (
    <div className="min-h-screen bg-background">
      <ReduxHeader />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/locations">
            <Button variant="ghost" className="mb-6 hover:bg-white/50">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to All States
            </Button>
          </Link>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <MapPin className="w-10 h-10 text-[#fce011]" />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                {stateName}
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find trusted, verified contractors in cities across {stateName}. 
              Select your city to connect with local professionals.
            </p>
          </div>
        </div>
      </section>

      {/* Cities Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Cities in {stateName}
            </h2>
            <p className="text-gray-600">
              {cities.length} cities available - Click on any city to find contractors
            </p>
          </div>

          {cities.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {cities.map((city, index) => {
                // Convert city name to URL slug
                const citySlug = city.toLowerCase().replace(/\s+/g, '-');
                const stateSlug = state; // Already in slug format from URL
                
                return (
                  <Link
                    key={index}
                    to={`/locations/${stateSlug}/${citySlug}`}
                    className="flex items-center gap-3 px-5 py-4 bg-gray-50 rounded-lg hover:bg-[#fce011]/10 transition-all duration-300 border border-gray-200 hover:border-[#fce011] hover:shadow-md group"
                  >
                    <Building2 className="w-5 h-5 text-gray-400 group-hover:text-[#fce011] transition-colors flex-shrink-0" />
                    <span className="text-base font-medium text-gray-700 group-hover:text-gray-900">
                      {city}
                    </span>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No cities available for this state yet.</p>
              <Link to="/contact-us">
                <Button className="bg-[#fce011] hover:bg-[#fce011]/90 text-black font-semibold">
                  Contact Us for Help
                </Button>
              </Link>
            </div>
          )}

          {/* Additional Info */}
          <div className="mt-16 bg-gradient-to-r from-[#fce011]/10 to-[#fce011]/5 rounded-2xl p-8 border border-[#fce011]/20">
            <div className="text-center max-w-3xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Don't see your city?
              </h3>
              <p className="text-gray-600 mb-6">
                We're constantly expanding our network of contractors across {stateName}. 
                If you don't see your specific city listed, we can still help you find the right professional for your project.
              </p>
              <Link to="/contact-us">
                <Button className="bg-[#fce011] hover:bg-[#fce011]/90 text-black font-semibold px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-all">
                  Contact Us for Assistance
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

export default StateDetail;
