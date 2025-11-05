import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  MapPin,
  Filter,
  X,
  Star,
  DollarSign,
  Clock,
  Shield,
  Zap,
  Wrench,
  Home,
  Bath,
  Palette,
  TreePine,
  Hammer,
  Building
} from "lucide-react";

interface AdvancedSearchBarProps {
  onSearch: (filters: SearchFilters) => void;
  initialFilters?: Partial<SearchFilters>;
}

interface SearchFilters {
  query: string;
  location: string;
  service: string;
  minRating: number;
  maxPrice: number;
  availability: string;
  licensed: boolean;
  verified: boolean;
}

const AdvancedSearchBar = ({ onSearch, initialFilters = {} }: AdvancedSearchBarProps) => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    location: "",
    service: "",
    minRating: 0,
    maxPrice: 0,
    availability: "",
    licensed: false,
    verified: false,
    ...initialFilters
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [serviceSuggestions, setServiceSuggestions] = useState<string[]>([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [showServiceSuggestions, setShowServiceSuggestions] = useState(false);

  const locationRef = useRef<HTMLInputElement>(null);
  const serviceRef = useRef<HTMLInputElement>(null);

  // Mock data for suggestions
  const mockLocations = [
    "New York, NY", "Los Angeles, CA", "Chicago, IL", "Houston, TX", 
    "Phoenix, AZ", "Philadelphia, PA", "San Antonio, TX", "San Diego, CA",
    "Dallas, TX", "San Jose, CA", "Austin, TX", "Jacksonville, FL"
  ];

  const services = [
    { name: "Plumbing", icon: Wrench, color: "blue" },
    { name: "Electrical", icon: Zap, color: "yellow" },
    { name: "HVAC", icon: Home, color: "green" },
    { name: "Roofing", icon: Building, color: "gray" },
    { name: "Bathroom Remodel", icon: Bath, color: "cyan" },
    { name: "Kitchen Remodel", icon: Home, color: "orange" },
    { name: "Painting", icon: Palette, color: "purple" },
    { name: "Landscaping", icon: TreePine, color: "emerald" },
    { name: "Carpentry", icon: Hammer, color: "amber" },
    { name: "Flooring", icon: Building, color: "stone" }
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setShowLocationSuggestions(false);
      }
      if (serviceRef.current && !serviceRef.current.contains(event.target as Node)) {
        setShowServiceSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLocationChange = (value: string) => {
    setFilters(prev => ({ ...prev, location: value }));
    if (value.length > 0) {
      const filtered = mockLocations.filter(loc => 
        loc.toLowerCase().includes(value.toLowerCase())
      );
      setLocationSuggestions(filtered);
      setShowLocationSuggestions(true);
    } else {
      setShowLocationSuggestions(false);
    }
  };

  const handleServiceChange = (value: string) => {
    setFilters(prev => ({ ...prev, service: value }));
    if (value.length > 0) {
      const filtered = services.filter(service => 
        service.name.toLowerCase().includes(value.toLowerCase())
      );
      setServiceSuggestions(filtered.map(s => s.name));
      setShowServiceSuggestions(true);
    } else {
      setShowServiceSuggestions(false);
    }
  };

  const handleSearch = () => {
    onSearch(filters);
    setShowAdvanced(false);
  };

  const clearFilters = () => {
    const clearedFilters = {
      query: "",
      location: "",
      service: "",
      minRating: 0,
      maxPrice: 0,
      availability: "",
      licensed: false,
      verified: false
    };
    setFilters(clearedFilters);
    onSearch(clearedFilters);
  };

  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== "" && value !== 0 && value !== false
  ).length;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      {/* Main Search Bar */}
      <div className="flex gap-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="What service do you need?"
            className="pl-10 h-12 text-lg border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
            value={filters.query}
            onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
          />
        </div>
        
        <div className="w-80 relative" ref={locationRef}>
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Enter location (city, state, or zip)"
            className="pl-10 h-12 text-lg border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
            value={filters.location}
            onChange={(e) => handleLocationChange(e.target.value)}
            onFocus={() => filters.location.length > 0 && setShowLocationSuggestions(true)}
          />
          
          {/* Location Suggestions */}
          {showLocationSuggestions && locationSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 mt-1">
              {locationSuggestions.slice(0, 5).map((location, index) => (
                <button
                  key={index}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
                  onClick={() => {
                    setFilters(prev => ({ ...prev, location }));
                    setShowLocationSuggestions(false);
                  }}
                >
                  <MapPin className="w-4 h-4 text-gray-400" />
                  {location}
                </button>
              ))}
            </div>
          )}
        </div>

        <Button 
          onClick={handleSearch}
          className="h-12 px-8 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
        >
          Search
        </Button>
        
        <Button
          variant="outline"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="h-12 px-4 border-gray-300"
        >
          <Filter className="w-5 h-5 mr-2" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2 bg-yellow-100 text-yellow-800">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Popular Services */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="text-sm text-gray-600 mr-2">Popular:</span>
        {services.slice(0, 6).map((service) => {
          const Icon = service.icon;
          return (
            <button
              key={service.name}
              onClick={() => setFilters(prev => ({ ...prev, service: service.name }))}
              className="flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
            >
              <Icon className="w-3 h-3" />
              {service.name}
            </button>
          );
        })}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="border-t pt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Service Category */}
            <div className="relative" ref={serviceRef}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Category
              </label>
              <Input
                placeholder="Select or type service"
                value={filters.service}
                onChange={(e) => handleServiceChange(e.target.value)}
                onFocus={() => setShowServiceSuggestions(true)}
              />
              
              {showServiceSuggestions && serviceSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 mt-1">
                  {serviceSuggestions.slice(0, 5).map((service, index) => (
                    <button
                      key={index}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50"
                      onClick={() => {
                        setFilters(prev => ({ ...prev, service }));
                        setShowServiceSuggestions(false);
                      }}
                    >
                      {service}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Minimum Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Rating
              </label>
              <select
                value={filters.minRating}
                onChange={(e) => setFilters(prev => ({ ...prev, minRating: Number(e.target.value) }))}
                className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              >
                <option value={0}>Any Rating</option>
                <option value={3}>3+ Stars</option>
                <option value={4}>4+ Stars</option>
                <option value={4.5}>4.5+ Stars</option>
              </select>
            </div>

            {/* Max Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Hourly Rate
              </label>
              <select
                value={filters.maxPrice}
                onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
                className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              >
                <option value={0}>Any Price</option>
                <option value={50}>Under $50/hr</option>
                <option value={100}>Under $100/hr</option>
                <option value={150}>Under $150/hr</option>
                <option value={200}>Under $200/hr</option>
              </select>
            </div>

            {/* Availability */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Availability
              </label>
              <select
                value={filters.availability}
                onChange={(e) => setFilters(prev => ({ ...prev, availability: e.target.value }))}
                className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              >
                <option value="">Any Time</option>
                <option value="today">Available Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.licensed}
                onChange={(e) => setFilters(prev => ({ ...prev, licensed: e.target.checked }))}
                className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
              />
              <Shield className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-gray-700">Licensed Only</span>
            </label>
            
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.verified}
                onChange={(e) => setFilters(prev => ({ ...prev, verified: e.target.checked }))}
                className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
              />
              <Star className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-700">Verified Contractors</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="text-gray-600 hover:text-gray-800"
            >
              <X className="w-4 h-4 mr-2" />
              Clear All Filters
            </Button>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowAdvanced(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSearch}
                className="bg-yellow-500 hover:bg-yellow-600 text-black"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 pt-4 border-t">
          <span className="text-sm text-gray-600 mr-2">Active filters:</span>
          {filters.query && (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              Query: {filters.query}
              <button
                onClick={() => setFilters(prev => ({ ...prev, query: "" }))}
                className="ml-1 hover:text-yellow-900"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {filters.location && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Location: {filters.location}
              <button
                onClick={() => setFilters(prev => ({ ...prev, location: "" }))}
                className="ml-1 hover:text-blue-900"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {filters.service && (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Service: {filters.service}
              <button
                onClick={() => setFilters(prev => ({ ...prev, service: "" }))}
                className="ml-1 hover:text-green-900"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {filters.minRating > 0 && (
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              {filters.minRating}+ Stars
              <button
                onClick={() => setFilters(prev => ({ ...prev, minRating: 0 }))}
                className="ml-1 hover:text-purple-900"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedSearchBar;