import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { Button } from "./ui/button";

const LocationsSection = () => {
  // Top 12 major US states/cities to display initially
  const featuredLocations = [
    "California",
    "Texas",
    "Florida",
    "New York",
    "Pennsylvania",
    "Illinois",
    "Ohio",
    "Georgia",
    "North Carolina",
    "Michigan",
    "New Jersey",
    "Virginia"
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trusted pros, coast to coast.
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Don't worry about finding a pro — we cover every county in the U.S.
          </p>
        </div>

        {/* Locations Grid - 3 columns with 4 states each */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {featuredLocations.map((location, index) => (
            <Link
              key={index}
              to={`/locations/${location.toLowerCase().replace(/\s+/g, '-')}`}
              className="flex items-center gap-3 px-6 py-4 bg-white rounded-lg hover:bg-[#fce011]/10 transition-all duration-300 border border-gray-200 hover:border-[#fce011] hover:shadow-md group"
            >
              <MapPin className="w-5 h-5 text-gray-400 group-hover:text-[#fce011] transition-colors" />
              <span className="text-base font-medium text-gray-700 group-hover:text-gray-900">
                {location}
              </span>
            </Link>
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center">
          <Link to="/locations">
            <Button className="bg-[#fce011] hover:bg-[#fce011]/90 text-black font-semibold px-8 py-6 text-base rounded-lg shadow-md hover:shadow-lg transition-all">
              View More Locations
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LocationsSection;
