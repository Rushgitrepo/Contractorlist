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
  CheckCircle,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import CompanyCard from "@/components/CompanyCard";
import ProjectTypeSelector from "@/components/ProjectTypeSelector";
import HeroSection from "@/components/HeroSection";
import ContractorHeroSection from "@/components/ContractorHeroSection";
import ReduxHeader from "@/components/ReduxHeader";

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
  const [location, setLocation] = useState("New York, NY");
  const [radius, setRadius] = useState("50 mi");

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
  const [filters, setFilters] = useState([
    "New York / 50 mi",
    "General Contractors",
  ]);
  const [search, setSearch] = useState("");

  // Add at the top (near your other state variables)
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  // Helper to toggle filters
  const toggleFilter = (filter: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  // Remove filter when "×" clicked
  const handleRemoveFilter = (filter: string) => {
    setSelectedFilters((prev) => prev.filter((f) => f !== filter));
  };

  // Sidebar services: fetch real counts from backend with fallback icons
  const [servicesMeta, setServicesMeta] = useState<any[]>([]);
  const serviceIconMap: Record<string, any> = {
    "Bathroom Remodel": Bath,
    "Kitchen Remodel": DoorOpen,
    "Roofing & Gutters": Home,
    "Masonry & Concrete": Building,
    Plumbing: Wrench,
    Electrician: Zap,
    HVAC: Thermometer,
    "HVAC Services": Thermometer,
    Carpentry: Hammer,
    Landscaping: TreePine,
    Painting: Palette,
    Flooring: Drill,
    "Windows & Doors": Building,
  };

  const companies = [
    {
      id: "grandeur-hills-group",
      name: "Grandeur Hills Group, Inc.",
      rating: 5.0,
      reviews: 54,
      verifiedHires: 1,
      tagline:
        "Manhattan's Premium Choice For Luxury Living | 5X Best of Houzz Winner",
      testimonial:
        "The results were truly mind-blowing, the moment I saw the finished house. The entire Grandeur Hills Group team went above and beyond!",
      reviewer: "Daniel",
      location: "New York",
      projects: 31,
      images: ["/home1.jpeg", "/home2.jpeg", "/home3.jpeg"],
      bannerText: "Complimentary Initial Consultations!",
      sponsored: true,
    },
    {
      id: "monks-home-improvements",
      name: "Monk's Home Improvements",
      rating: 4.9,
      reviews: 24,
      verifiedHires: 2,
      tagline:
        "Transforming Homes with Precision and Care | NJ’s Trusted Remodel Experts",
      testimonial:
        "Monk's delivered exactly what we envisioned — a modern kitchen that feels warm and functional. The craftsmanship is unmatched.",
      reviewer: "Sarah",
      location: "New Jersey",
      projects: 45,
      images: ["/home5.jpeg", "/home3.jpeg", "/home2.jpeg"],
      bannerText: "Free In-Home Design Consultation!",
      sponsored: true,
    },
    {
      id: "skyline-interiors",
      name: "Skyline Interiors",
      rating: 4.8,
      reviews: 32,
      verifiedHires: 3,
      tagline: "Elegant Interior Designs That Reflect Your Personality",
      testimonial:
        "Every corner of our new home speaks of style and comfort. Skyline’s team was extremely professional and creative!",
      reviewer: "Michael",
      location: "Los Angeles",
      projects: 28,
      images: ["/home3.jpeg", "/home2.jpeg", "/home1.jpeg"],
      bannerText: "Book Your Free Design Consultation!",
      sponsored: false,
    },
    {
      id: "evergreen-landscaping",
      name: "EverGreen Landscaping Co.",
      rating: 5.0,
      reviews: 41,
      verifiedHires: 4,
      tagline: "Turning Lawns Into Luxurious Green Spaces",
      testimonial:
        "The transformation was unbelievable — our backyard is now a peaceful paradise. Couldn’t be happier with EverGreen!",
      reviewer: "Jessica",
      location: "Chicago",
      projects: 50,
      images: ["/home5.jpeg", "/home1.jpeg", "/home4.jpeg"],
      bannerText: "Spring Discount: 20% Off Lawn Makeovers!",
      sponsored: true,
    },
    {
      id: "brightbuild-construction",
      name: "BrightBuild Construction",
      rating: 4.7,
      reviews: 20,
      verifiedHires: 2,
      tagline: "Sustainable Construction for Modern Living",
      testimonial:
        "BrightBuild used eco-friendly materials without compromising on design. Our new home feels futuristic yet warm.",
      reviewer: "Ethan",
      location: "San Francisco",
      projects: 35,
      images: ["/home3.jpeg", "/home2.jpeg", "/home1.jpeg"],
      bannerText: "Eco-Conscious Building Solutions!",
      sponsored: false,
    },
  ];
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
    { icon: Building, name: "Windows & Doors", contractor_count: 22 },
  ];
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/contractors/meta/services"
        );
        const json = await res.json();
        if (json?.success) {
          setServicesMeta(
            Array.isArray(json.data?.services) ? json.data.services : []
          );
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
        limit: "20",
        sortBy: "rating",
        sortOrder: "DESC",
      });

      if (onlyMyZip && zip) {
        searchParams.append("zipCode", zip);
      }

      if (serviceRaw) {
        searchParams.append("service", serviceRaw);
      }

      const res = await fetch(
        `http://localhost:5000/api/contractors?${searchParams.toString()}`
      );
      const json = await res.json();

      if (!json.success) {
        throw new Error(json.message || "Request failed");
      }

      setResults(json.data.contractors || []);
      setPagination(json.data.pagination);
      setPage(json.data.pagination.currentPage);
    } catch (e: any) {
      setError(e.message || "Failed to load contractors");
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

  const AccordionSection = ({ title, children }: any) => {
    const [open, setOpen] = useState(true);
    return (
      <div className="border-b border-gray-200 pb-4 mb-4">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center justify-between w-full text-sm font-semibold text-gray-800 mb-2"
        >
          {title}
          {open ? (
            <ChevronUp className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-600" />
          )}
        </button>
        {open && <div className="space-y-2">{children}</div>}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ReduxHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div>
          <h1 className="text-2xl sm:text-2xl lg:text-2xl font-bold text-black leading-tight text-center">
            General Contractors Near New York
          </h1>
          <p className="text-center sm:text-lg text-gray-700 mb-5">
            Don’t know how to begin? See our Hiring Guide for more information
          </p>
        </div>
        <div className=" border-t border-gray-400" />
        <ContractorHeroSection />
        <div className=" border-t border-gray-400" />
        <ProjectTypeSelector />
        <div className="my-1 border-t border-gray-200" />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="rounded-lg  p-6 sticky top-6 w-full max-w-xs">
            {/* Location Section */}
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Location (1)
            </h3>
            <div className="space-y-4 mb-6">
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full h-10 rounded-md border border-gray-300 bg-white px-4 text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              >
                <option>New York, NY</option>
                <option>California, CA</option>
                <option>New Jersey, NJ</option>
              </select>

              <select
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
                className="w-full h-10 rounded-md border border-gray-300 bg-white px-4 text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              >
                <option>50 mi</option>
                <option>100 mi</option>
                <option>120 mi</option>
              </select>
            </div>

            <AccordionSection title="Suggested Filters">
              {["Verified License", "Responds Quickly", "Hired on Houzz"].map(
                (item, i) => (
                  <label
                    key={i}
                    className="flex items-center gap-2 text-sm text-gray-700"
                  >
                    <input
                      type="checkbox"
                      className="accent-yellow-500"
                      checked={selectedFilters.includes(item)}
                      onChange={() => toggleFilter(item)}
                    />
                    {item}
                  </label>
                )
              )}
            </AccordionSection>

            {/* Professional Category */}
            <AccordionSection title="Professional Category (1)">
              <input
                type="text"
                placeholder="Search Professional Category"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-500 mb-2"
              />
              {[
                "Architects & Building Designers",
                "Design-Build Firms",
                "General Contractors",
                "Home Builders",
                "Interior Designers & Decorators",
              ].map((item, i) => (
                <label
                  key={i}
                  className="flex items-center gap-2 text-sm text-gray-700"
                >
                  <input
                    type="radio"
                    name="category"
                    defaultChecked={item === "General Contractors"}
                    className="accent-yellow-500"
                    checked={selectedFilters.includes(item)}
                    onChange={() => toggleFilter(item)}
                  />
                  {item}
                </label>
              ))}
            </AccordionSection>

            {/* Project Type */}
            <AccordionSection title="Project Type">
              <p className="text-gray-500 text-sm">Select project type...</p>
            </AccordionSection>

            {/* Budget */}
            <AccordionSection title="Budget">
              {[
                "$$$$ - I want the best results",
                "$$$ - Mid-to-high price",
                "$$ - Low-to-mid price",
                "$ - I want to minimize costs",
              ].map((item, i) => (
                <label
                  key={i}
                  className="flex items-center gap-2 text-sm text-gray-700"
                >
                  <input
                    type="checkbox"
                    className="accent-yellow-500"
                    checked={selectedFilters.includes(item)}
                    onChange={() => toggleFilter(item)}
                  />
                  {item}
                </label>
              ))}
            </AccordionSection>

            {/* Business Highlights */}
            <AccordionSection title="Business Highlights">
              {[
                "Hired on Houzz",
                "Responds Quickly",
                "Provides 3D Visualization",
                "Eco-friendly",
                "Family owned",
                "Locally owned",
                "Offers Custom Work",
              ].map((item, i) => (
                <label
                  key={i}
                  className="flex items-center gap-2 text-sm text-gray-700"
                >
                  <input
                    type="checkbox"
                    className="accent-yellow-500"
                    checked={selectedFilters.includes(item)}
                    onChange={() => toggleFilter(item)}
                  />
                  {item}
                </label>
              ))}
            </AccordionSection>

            {/* Languages */}
            <AccordionSection title="Languages (1)">
              {[
                "All Languages",
                "Speaks Spanish",
                "Speaks Russian",
                "Speaks Italian",
              ].map((item, i) => (
                <label
                  key={i}
                  className="flex items-center gap-2 text-sm text-gray-700"
                >
                  <input
                    type="radio"
                    name="language"
                    defaultChecked={item === "All Languages"}
                    className="accent-yellow-500"
                    checked={selectedFilters.includes(item)}
                    onChange={() => toggleFilter(item)}
                  />
                  {item}
                </label>
              ))}
            </AccordionSection>

            {/* Rating */}
            <AccordionSection title="Rating (1)">
              {[
                "Any Rating",
                "5 stars only",
                "4 stars & up",
                "3 stars & up",
              ].map((item, i) => (
                <label
                  key={i}
                  className="flex items-center gap-2 text-sm text-gray-700"
                >
                  <input
                    type="radio"
                    name="rating"
                    className="accent-yellow-500"
                    checked={selectedFilters.includes(item)}
                    onChange={() => {
                      // Remove all rating filters first, then add the new one
                      setSelectedFilters((prev) => [
                        ...prev.filter((f) => !f.includes("stars")),
                        item,
                      ]);
                    }}
                  />
                  {item}
                </label>
              ))}
            </AccordionSection>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            {/* <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
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
                    {showFilters ? "Hide" : "Show"} Filters
                  </Button>
                </div>
              </div>
            </div> */}

            {loading && (
              <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                <div className="text-gray-500 mb-4">
                  <Search className="w-12 h-12 mx-auto mb-4 text-gray-300 animate-pulse" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Loading contractors...
                  </h3>
                  <p className="text-gray-600">
                    Please wait while we find contractors in your area.
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-white rounded-lg shadow-sm border p-8 text-center mt-2">
                <div className="text-red-500 mb-4">
                  <Search className="w-12 h-12 mx-auto mb-4 text-red-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Error loading contractors
                  </h3>
                  <p className="text-gray-600">{error}</p>
                </div>
              </div>
            )}

            {zip && !loading && !error && visibleContractors.length === 0 && (
              <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                <div className="text-gray-500 mb-4">
                  <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No contractors found
                  </h3>
                  <p className="text-gray-600">
                    Try adjusting your search or check nearby areas.
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center w-full py-2 font-sans">
              {/* Left: Active Filters */}
              <div className="flex flex-wrap items-center gap-2">
                {selectedFilters.map((filter) => (
                  <div
                    key={filter}
                    className="flex items-center bg-[#e7e4da] text-gray-800 rounded-full px-3 py-1 text-sm"
                  >
                    {filter}
                    <button
                      className="ml-2 text-gray-600 hover:text-black"
                      onClick={() => handleRemoveFilter(filter)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              {/* Right: Search box */}
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Search by Keyword"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-1 text-sm w-52 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400"
                />
              </div>
            </div>
            {companies?.map((c) => (
              <CompanyCard
                key={c?.id}
                id={c?.id}
                name={c?.name}
                images={c?.images}
                testimonial={c?.testimonial}
                bannerText={c?.bannerText}
                location={c?.location}
                projects={c?.projects}
                rating={c?.rating}
                reviewer={c?.reviewer}
                reviews={c?.reviews}
                sponsored={c?.sponsored}
                tagline={c?.tagline}
                verifiedHires={c?.verifiedHires}
              />
            ))}
            {/* Contractors List */}
            <div className="space-y-6">
              {visibleContractors.map((contractor, index) => {
                const email =
                  contractor?.contact?.email ||
                  contractor?.email ||
                  "contact@contractor.com";
                const phone =
                  contractor?.contact?.phone ||
                  contractor?.phone ||
                  "(555) 123-4567";
                const website =
                  contractor?.website || contractor?.contact?.website || "";

                return (
                  <ContractorCard
                    key={contractor.id}
                    contractor={contractor}
                    featured={index < 2} // Mark first 2 as featured
                    onViewProfile={handleProfilePreview}
                    onCall={(phone) => (window.location.href = `tel:${phone}`)}
                    onEmail={(email) =>
                      (window.location.href = `mailto:${email}`)
                    }
                    onWebsite={(website) => window.open(website, "_blank")}
                  />
                );
              })}
            </div>

            {/* Pagination */}
            {pagination && (
              <div className="flex items-center justify-center gap-3 mt-6">
                <Button variant="outline" disabled={page <= 1} onClick={goPrev}>
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
