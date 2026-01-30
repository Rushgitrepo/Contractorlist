import { useParams, Link } from "react-router-dom";
import { MapPin, ArrowLeft, Search } from "lucide-react";
import ReduxHeader from "@/components/ReduxHeader";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { allServices } from "@/data/allServices";

const CityDetail = () => {
  const { state, city } = useParams<{ state: string; city: string }>();
  
  const [serviceSearchQuery, setServiceSearchQuery] = useState("");
  
  // Convert URL slugs back to proper names
  const stateName = state
    ?.split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ') || '';
    
  const cityName = city
    ?.split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ') || '';

  // Filter services based on search
  const filteredServices = useMemo(() => {
    if (!serviceSearchQuery) return allServices;
    return allServices.filter(service =>
      service.toLowerCase().includes(serviceSearchQuery.toLowerCase())
    );
  }, [serviceSearchQuery]);

  return (
    <div className="min-h-screen bg-background">
      <ReduxHeader />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#fce011]/10 via-gray-50 to-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link to={`/locations/${state}`}>
              <Button variant="ghost" className="hover:bg-white/50">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to {stateName}
              </Button>
            </Link>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#fce011] rounded-full flex items-center justify-center">
                <MapPin className="w-6 h-6 text-black" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Services in {cityName}, {stateName}
                </h1>
                <p className="text-gray-600 mt-1">
                  {allServices.length}+ services available from verified contractors
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All Services Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            {/* Service Search */}
            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search from 600+ services..."
                value={serviceSearchQuery}
                onChange={(e) => setServiceSearchQuery(e.target.value)}
                className="pl-12 py-6 text-lg"
              />
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredServices.map((service, index) => (
                <Link
                  key={index}
                  to={`/services/${service.toLowerCase().replace(/\s+/g, '-')}`}
                  className="p-3 bg-gray-50 rounded-lg hover:bg-[#fce011]/10 hover:border-[#fce011] border border-gray-200 transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#fce011] rounded-full group-hover:scale-125 transition-transform"></div>
                    <span className="text-sm text-gray-700 group-hover:text-gray-900 font-medium">
                      {service}
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {filteredServices.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">No services found matching "{serviceSearchQuery}"</p>
                <Button
                  onClick={() => setServiceSearchQuery("")}
                  className="bg-[#fce011] hover:bg-[#fce011]/90 text-black"
                >
                  Clear Search
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CityDetail;
