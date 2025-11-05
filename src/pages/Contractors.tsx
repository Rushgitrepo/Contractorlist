import { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppSelector } from "@/store/hooks";
import ContractorProfilePreview from "@/components/ContractorProfilePreview";
import AdvancedSearchBar from "@/components/AdvancedSearchBar";
import ContractorCard from "@/components/ContractorCard";
import {
  MapPin,
  Phone,
  Star,
  Search,
  Filter,
  ArrowLeft,
  Bath,
  DoorOpen,
  Home,
  Building,
  Wrench,
  Hammer,
  Zap,
  Thermometer,
  TreePine,
  Palette,
  Drill,
  Mail,
  Globe,
  BadgeCheck,
  Calendar,
  SlidersHorizontal,
  X,
  Eye,
  Award,
  Users,
  Clock,
  Shield,
  CheckCircle
} from "lucide-react";

const Contractors = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const zip = (params.get("zip") || "").trim();
  const serviceRaw = (params.get("service") || "").trim();

  const [searchQuery, setSearchQuery] = useState(serviceRaw);
  const [sortBy, setSortBy] = useState<"best" | "rating" | "name">("best");
  const [priceRange, setPriceRange] = useState<string>("");
  const [rating, setRating] = useState<string>("");
  const [onlyMyZip, setOnlyMyZip] = useState<boolean>(true);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState<string>("");
  const [licenseFilter, setLicenseFilter] = useState<string>("");
  const [experienceFilter, setExperienceFilter] = useState<string>("");
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("");
  const [selectedContractor, setSelectedContractor] = useState<any>(null);
  const [showProfilePreview, setShowProfilePreview] = useState(false);

  // API state
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any | null>(null);

  // Sidebar services: fetch real counts from backend with fallback icons
  const [servicesMeta, setServicesMeta] = useState<any[]>([]);
  const serviceIconMap: Record<string, any> = {
    'Bathroom Remodel': Bath,
    'Kitchen Remodel': DoorOpen,
    'Roofing & Gutters': Home,
    'Masonry & Concrete': Building,
    'Plumbing': Wrench,
    'Electrician': Zap,
    'HVAC': Thermometer,
    'HVAC Services': Thermometer,
    'Carpentry': Hammer,
    'Landscaping': TreePine,
    'Painting': Palette,
    'Flooring': Drill,
    'Windows & Doors': Building,
  };
  // fallback list if meta is unavailable
  const fallbackServices = [
    { icon: Bath, name: "Bathroom Remodel", contractor_count: 45 },
    { icon: DoorOpen, name: "Kitchen Remodel", contractor_count: 38 },
    { icon: Home, name: "Roofing & Gutters", contractor_count: 52 },
    { icon: Building, name: "Masonry & Concrete", contractor_count: 29 },
    { icon: Wrench, name: "Plumbing", contractor_count: 67 },
    { icon: Zap, name: "Electrician", contractor_count: 43 },
    { icon: Thermometer, name: "HVAC Services", contractor_count: 31 },
    { icon: Hammer, name: "Carpentry", contractor_count: 25 },
    { icon: TreePine, name: "Landscaping", contractor_count: 34 },
    { icon: Palette, name: "Painting", contractor_count: 41 },
    { icon: Drill, name: "Flooring", contractor_count: 28 },
    { icon: Building, name: "Windows & Doors", contractor_count: 22 }
  ];
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('http://localhost:5000/api/contractors/meta/services');
        const json = await res.json();
        if (json?.success) {
          setServicesMeta(Array.isArray(json.data?.services) ? json.data.services : []);
        } else {
          setServicesMeta([]);
        }
      } catch {
        setServicesMeta([]);
      }
    })();
  }, []);

  // Fetch contractors from backend
  const fetchContractors = async (pageNum = 1) => {
    if (!zip && !serviceRaw) {
      setResults([]);
      setPagination(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const searchParams = new URLSearchParams({
        page: String(pageNum),
        limit: '20',
        sortBy: 'rating',
        sortOrder: 'DESC'
      });

      if (onlyMyZip && zip) {
        searchParams.append('zipCode', zip);
      }

      if (serviceRaw) {
        searchParams.append('service', serviceRaw);
      }

      const res = await fetch(`http://localhost:5000/api/contractors?${searchParams.toString()}`);
      const json = await res.json();

      if (!json.success) {
        throw new Error(json.message || 'Request failed');
      }

      setResults(json.data.contractors || []);
      setPagination(json.data.pagination);
      setPage(json.data.pagination.currentPage);
    } catch (e: any) {
      setError(e.message || 'Failed to load contractors');
      setResults([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  // Run on mount and when URL params change
  useEffect(() => {
    fetchContractors(1);
  }, [zip, serviceRaw, onlyMyZip]);

  // Use API results instead of filtered data
  const visibleContractors = results;

  const handleContractorClick = (contractorId: string) => {
    navigate(`/contractors/${contractorId}`);
  };

  const handleProfilePreview = (contractor: any) => {
    setSelectedContractor(contractor);
    setShowProfilePreview(true);
  };

  const closeProfilePreview = () => {
    setShowProfilePreview(false);
    setSelectedContractor(null);
  };

  

  // Pagination handlers
  const goPrev = () => fetchContractors(page - 1);
  const goNext = () => fetchContractors(page + 1);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <Link to="/">
                <img src="/main-logo.png" alt="Contractorlist Logo" className="h-8 w-auto" />
              </Link>
            </div>

            {/* Search bar */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search contractors, services, location..."
                    className="pl-10 h-10 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="h-10 px-3 border-gray-300 hover:bg-gray-50"
                >
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <span className="text-sm text-gray-600">Welcome, {user.name}</span>
              ) : (
                <Link to="/login" className="text-sm text-yellow-600 hover:text-yellow-700 font-medium">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Advanced Search Bar */}
        <AdvancedSearchBar
          onSearch={(filters) => {
            console.log('Search filters:', filters);
            // Handle search with filters
            fetchContractors(1);
          }}
          initialFilters={{
            query: searchQuery,
            location: zip,
            service: serviceRaw
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Our Services</h3>

              {/* Filters */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort by
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  >
                    <option value="best">Best Match</option>
                    <option value="rating">Highest Rating</option>
                    <option value="name">Name A-Z</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Rating
                  </label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  >
                    <option value="">Any Rating</option>
                    <option value="4.5">4.5+ Stars</option>
                    <option value="4.0">4.0+ Stars</option>
                    <option value="3.5">3.5+ Stars</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    id="onlyMyZip"
                    type="checkbox"
                    className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                    checked={onlyMyZip}
                    onChange={(e) => setOnlyMyZip(e.target.checked)}
                  />
                  <label htmlFor="onlyMyZip" className="text-sm text-gray-700">
                    Limit to my ZIP
                  </label>
                </div>
              </div>

              {/* Services List */}
              <div className="space-y-2">
                {(servicesMeta.length ? servicesMeta : fallbackServices).map((service: any, index: number) => {
                  const label = service.name || service.label;
                  const count = service.contractor_count ?? service.count ?? 0;
                  const IconComponent = service.icon || serviceIconMap[label] || Wrench;
                  return (
                    <Link
                      key={index}
                      to={`/contractors?service=${encodeURIComponent(label)}`}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-yellow-100 rounded-lg group-hover:bg-yellow-200 transition-colors">
                          <IconComponent className="w-4 h-4 text-yellow-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                          {label}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {count}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Professional Contractors in {zip || "Your Area"}
                  </h1>
                  <p className="text-gray-600 mt-1">
                    {visibleContractors.length} verified professionals available
                    {serviceRaw && ` for "${serviceRaw}"`}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span>Licensed & Insured</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                      <span>Background Verified</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="w-4 h-4 text-yellow-600" />
                      <span>Top Rated</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Filter className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {visibleContractors.length} results
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    {showFilters ? 'Hide' : 'Show'} Filters
                  </Button>
                </div>
              </div>
            </div>

            {/* No Results */}
            {!zip && (
              <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                <div className="text-gray-500 mb-4">
                  <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Enter a zip code to find contractors</h3>
                  <p className="text-gray-600">Please go back and enter your zip code to see available contractors in your area.</p>
                </div>
                <Link to="/" className="inline-flex items-center px-4 py-2 bg-yellow-500 text-black font-medium rounded-lg hover:bg-yellow-600 transition-colors">
                  Go Back to Search
                </Link>
              </div>
            )}

            {loading && (
              <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                <div className="text-gray-500 mb-4">
                  <Search className="w-12 h-12 mx-auto mb-4 text-gray-300 animate-pulse" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Loading contractors...</h3>
                  <p className="text-gray-600">Please wait while we find contractors in your area.</p>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                <div className="text-red-500 mb-4">
                  <Search className="w-12 h-12 mx-auto mb-4 text-red-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading contractors</h3>
                  <p className="text-gray-600">{error}</p>
                </div>
              </div>
            )}

            {zip && !loading && !error && visibleContractors.length === 0 && (
              <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                <div className="text-gray-500 mb-4">
                  <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No contractors found</h3>
                  <p className="text-gray-600">Try adjusting your search or check nearby areas.</p>
                </div>
              </div>
            )}

            {/* Contractors List */}
            <div className="space-y-6">
              {visibleContractors.map((contractor, index) => {
                const email = contractor?.contact?.email || contractor?.email || 'contact@contractor.com';
                const phone = contractor?.contact?.phone || contractor?.phone || '(555) 123-4567';
                const website = contractor?.website || contractor?.contact?.website || '';

                return (
                  <ContractorCard
                    key={contractor.id}
                    contractor={contractor}
                    featured={index < 2} // Mark first 2 as featured
                    onViewProfile={handleProfilePreview}
                    onCall={(phone) => window.location.href = `tel:${phone}`}
                    onEmail={(email) => window.location.href = `mailto:${email}`}
                    onWebsite={(website) => window.open(website, '_blank')}
                  />
                );
              })}
            </div>

            {/* Pagination */}
            {pagination && (
              <div className="flex items-center justify-center gap-3 mt-6">
                <Button
                  variant="outline"
                  disabled={page <= 1}
                  onClick={goPrev}
                >
                  Prev
                </Button>
                <span className="text-sm text-gray-600">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={!pagination.hasNextPage}
                  onClick={goNext}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contractor Profile Preview Modal */}
      <ContractorProfilePreview
        contractor={selectedContractor}
        isOpen={showProfilePreview}
        onClose={closeProfilePreview}
      />
    </div>
  );
};

export default Contractors;


