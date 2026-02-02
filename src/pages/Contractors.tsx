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
  DollarSign,
  Languages,
  Sparkles,
  Briefcase,
  Verified,
} from "lucide-react";
import CompanyCard from "@/components/CompanyCard";
import ProjectTypeSelector from "@/components/ProjectTypeSelector";
import HeroSection from "@/components/HeroSection";
import ContractorHeroSection from "@/components/ContractorHeroSection";
import ReduxHeader from "@/components/ReduxHeader";
import companyService, { CompanySearchFilters } from "@/api/companyService";
import { normalizeCompanyData } from "@/utils/normalizeCompany";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

// Top 50 US Cities + States
const USLocations = [
  "New York, NY", "Los Angeles, CA", "Chicago, IL", "Houston, TX", "Phoenix, AZ",
  "Philadelphia, PA", "San Antonio, TX", "San Diego, CA", "Dallas, TX", "San Jose, CA",
  "Austin, TX", "Jacksonville, FL", "Fort Worth, TX", "Columbus, OH", "Charlotte, NC",
  "San Francisco, CA", "Indianapolis, IN", "Seattle, WA", "Denver, CO", "Washington, DC",
  "Boston, MA", "El Paso, TX", "Nashville, TN", "Detroit, MI", "Oklahoma City, OK",
  "Portland, OR", "Las Vegas, NV", "Memphis, TN", "Louisville, KY", "Baltimore, MD",
  "Milwaukee, WI", "Albuquerque, NM", "Tucson, AZ", "Fresno, CA", "Mesa, AZ",
  "Sacramento, CA", "Atlanta, GA", "Kansas City, MO", "Colorado Springs, CO", "Miami, FL",
  "Raleigh, NC", "Omaha, NE", "Long Beach, CA", "Virginia Beach, VA", "Oakland, CA",
  "Minneapolis, MN", "Tulsa, OK", "Arlington, TX", "Tampa, FL", "New Orleans, LA",
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
  "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
  "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
  "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
  "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
  "Wisconsin", "Wyoming"
].sort();

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
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("");
  const [selectedContractor, setSelectedContractor] = useState<any>(null);
  const [showProfilePreview, setShowProfilePreview] = useState(false);
  const [search, setSearch] = useState("");

  // Company API state
  const [companies, setCompanies] = useState<any[]>([]);
  const [companiesLoading, setCompaniesLoading] = useState(false);
  const [companiesError, setCompaniesError] = useState<string | null>(null);
  const [companiesCurrentPage, setCompaniesCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [companiesPagination, setCompaniesPagination] = useState<any | null>(null);

  // Filter state
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [verifiedLicense, setVerifiedLicense] = useState(false);
  const [respondsQuickly, setRespondsQuickly] = useState(false);
  const [hiredOnPlatform, setHiredOnPlatform] = useState(false);
  const [professionalCategory, setProfessionalCategory] = useState<string>("");
  const [budget, setBudget] = useState<string>("");
  const [provides3d, setProvides3d] = useState(false);
  const [ecoFriendly, setEcoFriendly] = useState(false);
  const [familyOwned, setFamilyOwned] = useState(false);
  const [locallyOwned, setLocallyOwned] = useState(false);
  const [offersCustomWork, setOffersCustomWork] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [selectedRating, setSelectedRating] = useState<string>("");

  // Helper to toggle filters
  const toggleFilter = (filter: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );

    // Update actual filter state based on filter name
    if (filter === "Verified License") {
      setVerifiedLicense(!verifiedLicense);
    } else if (filter === "Responds Quickly") {
      setRespondsQuickly(!respondsQuickly);
    } else if (filter === "Hired on Houzz" || filter === "Hired on Platform") {
      setHiredOnPlatform(!hiredOnPlatform);
    } else if (filter === "Provides 3D Visualization") {
      setProvides3d(!provides3d);
    } else if (filter === "Eco-friendly") {
      setEcoFriendly(!ecoFriendly);
    } else if (filter === "Family owned") {
      setFamilyOwned(!familyOwned);
    } else if (filter === "Locally owned") {
      setLocallyOwned(!locallyOwned);
    } else if (filter === "Offers Custom Work") {
      setOffersCustomWork(!offersCustomWork);
    } else if (filter.includes("$$$$") || filter.includes("$$$") || filter.includes("$$") || filter === "$ - I want to minimize costs") {
      setBudget(filter);
    } else if (filter.includes("Architects") || filter.includes("Design-Build") || filter.includes("General Contractors") || filter.includes("Home Builders") || filter.includes("Interior Designers")) {
      setProfessionalCategory(filter);
    } else if (filter.includes("Spanish") || filter.includes("Russian") || filter.includes("Italian") || filter === "All Languages") {
      setSelectedLanguage(filter);
    } else if (filter.includes("stars")) {
      setSelectedRating(filter);
    }
  };

  // Remove filter when "×" clicked
  const handleRemoveFilter = (filter: string) => {
    setSelectedFilters((prev) => prev.filter((f) => f !== filter));

    // Clear actual filter state
    if (filter === "Verified License") {
      setVerifiedLicense(false);
    } else if (filter === "Responds Quickly") {
      setRespondsQuickly(false);
    } else if (filter === "Hired on Houzz" || filter === "Hired on Platform") {
      setHiredOnPlatform(false);
    } else if (filter === "Provides 3D Visualization") {
      setProvides3d(false);
    } else if (filter === "Eco-friendly") {
      setEcoFriendly(false);
    } else if (filter === "Family owned") {
      setFamilyOwned(false);
    } else if (filter === "Locally owned") {
      setLocallyOwned(false);
    } else if (filter === "Offers Custom Work") {
      setOffersCustomWork(false);
    } else if (filter.includes("$$$$") || filter.includes("$$$") || filter.includes("$$") || filter === "$ - I want to minimize costs") {
      setBudget("");
    } else if (filter.includes("Architects") || filter.includes("Design-Build") || filter.includes("General Contractors") || filter.includes("Home Builders") || filter.includes("Interior Designers")) {
      setProfessionalCategory("");
    } else if (filter.includes("Spanish") || filter.includes("Russian") || filter.includes("Italian") || filter === "All Languages") {
      setSelectedLanguage("");
    } else if (filter.includes("stars")) {
      setSelectedRating("");
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedFilters([]);
    setVerifiedLicense(false);
    setRespondsQuickly(false);
    setHiredOnPlatform(false);
    setProfessionalCategory("");
    setBudget("");
    setProvides3d(false);
    setEcoFriendly(false);
    setFamilyOwned(false);
    setLocallyOwned(false);
    setOffersCustomWork(false);
    setSelectedLanguage("");
    setSelectedRating("");
  };

  // Count active filters
  const activeFiltersCount = [
    verifiedLicense,
    respondsQuickly,
    hiredOnPlatform,
    professionalCategory,
    budget,
    provides3d,
    ecoFriendly,
    familyOwned,
    locallyOwned,
    offersCustomWork,
    selectedLanguage && selectedLanguage !== "All Languages",
    selectedRating && selectedRating !== "Any Rating",
  ].filter(Boolean).length;

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

  // Default images for companies (fallback)
  const defaultImages = ["/home1.jpeg", "/home2.jpeg", "/home3.jpeg"];
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
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const res = await fetch(
          `${API_URL}/contractors/meta/services`
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

  // Fetch companies from API (server-side pagination: 10 per page)
  const fetchCompanies = async (pageNum = 1, limit = itemsPerPage) => {
    setCompaniesLoading(true);
    setCompaniesError(null);

    try {
      const apiFilters: CompanySearchFilters = {
        page: pageNum,
        limit,
        zip: zip || undefined,
        service: serviceRaw || undefined,
      };

      // Map local state to API filters
      if (verifiedLicense) apiFilters.verified_license = true;
      if (respondsQuickly) apiFilters.responds_quickly = true;
      if (hiredOnPlatform) apiFilters.hired_on_platform = true;
      if (provides3d) apiFilters.provides_3d_visualization = true;
      if (ecoFriendly) apiFilters.eco_friendly = true;
      if (familyOwned) apiFilters.family_owned = true;
      if (locallyOwned) apiFilters.locally_owned = true;
      if (offersCustomWork) apiFilters.offers_custom_work = true;

      if (professionalCategory) {
        apiFilters.professional_category = professionalCategory;
      }

      if (budget) {
        const budgetMap: Record<string, '$' | '$$' | '$$$' | '$$$$'> = {
          "$ - I want to minimize costs": "$",
          "$$ - Low-to-mid price": "$$",
          "$$$ - Mid-to-high price": "$$$",
          "$$$$ - I want the best results": "$$$$",
        };
        if (budgetMap[budget]) {
          apiFilters.budget = budgetMap[budget];
        }
      }

      if (selectedLanguage && selectedLanguage !== "All Languages") {
        apiFilters.language = selectedLanguage.replace("Speaks ", "");
      }

      if (selectedRating && selectedRating !== "Any Rating") {
        if (selectedRating === "5 stars only") apiFilters.rating = 5;
        else if (selectedRating === "4 stars & up") apiFilters.rating = 4;
        else if (selectedRating === "3 stars & up") apiFilters.rating = 3;
      }

      // Pass location as city if applicable, though backend support varies
      // For now, we rely on zip and other filters primarily.

      const response = await companyService.searchCompanies(apiFilters);

      if (response.success) {
        const mappedCompanies = response.data.map((item: any) =>
          normalizeCompanyData(item)
        );

        setCompanies(mappedCompanies);
        setCompaniesPagination(response.pagination || {
          currentPage: pageNum,
          totalPages: Math.ceil((response.pagination?.totalItems || 0) / limit) || 1,
          totalItems: response.pagination?.totalItems || 0,
          itemsPerPage: limit
        });
        setCompaniesCurrentPage(pageNum);
      } else {
        throw new Error(response.message || "Failed to fetch companies");
      }
    } catch (e: any) {
      console.error("Fetch companies error:", e);
      setCompaniesError(e.message || "Failed to load companies");
      setCompanies([]);
      setCompaniesPagination(null);
    } finally {
      setCompaniesLoading(false);
    }
  };



  // Run on mount and when URL params or filters change
  useEffect(() => {
    fetchCompanies(1);
    setCompaniesCurrentPage(1); // Reset to first page when filters change
  }, [
    zip,
    serviceRaw,
    location,
    verifiedLicense,
    respondsQuickly,
    hiredOnPlatform,
    professionalCategory,
    budget,
    provides3d,
    ecoFriendly,
    familyOwned,
    locallyOwned,
    offersCustomWork,
    selectedLanguage,
    selectedRating,
    search,
  ]);

  // Use API results instead of filtered data
  // const visibleContractors = results; (Legacy removed)

  // Calculate pagination for companies (from backend)
  const totalCompaniesPages = companiesPagination?.totalPages || 1;
  const totalCompanies = companiesPagination?.totalItems ?? companies.length;
  const paginatedCompanies = companies;

  // Pagination handlers for companies
  const goToCompaniesPage = (page: number) => {
    if (page < 1 || (companiesPagination && page > companiesPagination.totalPages)) {
      return;
    }
    fetchCompanies(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  // Pagination handlers (Legacy removed)

  const AccordionSection = ({ title, children, icon: Icon }: any) => {
    const [open, setOpen] = useState(true);
    return (
      <div className="border-b border-gray-200 pb-3 mb-3 last:border-b-0">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center justify-between w-full text-sm font-bold text-gray-900 mb-2 hover:text-yellow-600 transition-colors"
        >
          <div className="flex items-center gap-2">
            {Icon && <Icon className="w-4 h-4 text-primary" />}
            <span>{title}</span>
          </div>
          {open ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>
        {open && <div className="space-y-1.5">{children}</div>}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ReduxHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div>
          <h1 className="text-2xl sm:text-2xl lg:text-2xl font-bold text-black leading-tight text-center">
            General Contractors Near {location || "You"}
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar - Wider, no scroll */}
          <div className="lg:col-span-3 bg-white rounded-xl shadow-lg border border-gray-200 p-6 h-fit">
            {/* Header with Clear All */}
            {activeFiltersCount > 0 && (
              <div className="mb-4 pb-4 border-b border-gray-200">
                <button
                  onClick={clearAllFilters}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                  Clear All Filters ({activeFiltersCount})
                </button>
              </div>
            )}

            {/* Location Section */}
            <div className="mb-4 pb-3 border-b border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-bold text-gray-900">
                  Location
                </h3>
              </div>
              <div className="space-y-2">
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger className="w-full h-9 bg-white border-gray-300">
                    <SelectValue placeholder="Select Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <ScrollArea className="h-[200px]">
                      {USLocations.map((loc) => (
                        <SelectItem key={loc} value={loc}>
                          {loc}
                        </SelectItem>
                      ))}
                    </ScrollArea>
                  </SelectContent>
                </Select>

                <Select value={radius} onValueChange={setRadius}>
                  <SelectTrigger className="w-full h-9 bg-white border-gray-300">
                    <SelectValue placeholder="Radius" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10 mi">10 mi</SelectItem>
                    <SelectItem value="25 mi">25 mi</SelectItem>
                    <SelectItem value="50 mi">50 mi</SelectItem>
                    <SelectItem value="100 mi">100 mi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <AccordionSection title="Suggested Filters" icon={Filter}>
              <label className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-2 border-gray-300 text-primary focus:ring-2 focus:ring-primary focus:ring-offset-0 cursor-pointer transition-all checked:bg-primary checked:border-primary"
                    checked={verifiedLicense}
                    onChange={(e) => {
                      setVerifiedLicense(e.target.checked);
                      toggleFilter("Verified License");
                    }}
                  />
                </div>
                <div className="flex items-center gap-2 flex-1">
                  <Shield className="w-4 h-4 text-gray-500 group-hover:text-yellow-600 transition-colors" />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Verified License</span>
                </div>
              </label>
              <label className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-2 border-gray-300 text-primary focus:ring-2 focus:ring-primary focus:ring-offset-0 cursor-pointer transition-all checked:bg-primary checked:border-primary"
                    checked={respondsQuickly}
                    onChange={(e) => {
                      setRespondsQuickly(e.target.checked);
                      toggleFilter("Responds Quickly");
                    }}
                  />
                </div>
                <div className="flex items-center gap-2 flex-1">
                  <Clock className="w-4 h-4 text-gray-500 group-hover:text-yellow-600 transition-colors" />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Responds Quickly</span>
                </div>
              </label>
              <label className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-2 border-gray-300 text-primary focus:ring-2 focus:ring-primary focus:ring-offset-0 cursor-pointer transition-all checked:bg-primary checked:border-primary"
                    checked={hiredOnPlatform}
                    onChange={(e) => {
                      setHiredOnPlatform(e.target.checked);
                      toggleFilter("Hired on Houzz");
                    }}
                  />
                </div>
                <div className="flex items-center gap-2 flex-1">
                  <Verified className="w-4 h-4 text-gray-500 group-hover:text-yellow-600 transition-colors" />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Hired on Houzz</span>
                </div>
              </label>
            </AccordionSection>

            {/* Professional Category */}
            <AccordionSection title="Professional Category" icon={Briefcase}>
              <div className="mb-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search Professional Category"
                    className="w-full border-2 border-gray-200 rounded-lg px-3 pl-10 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                {[
                  "Architects & Building Designers",
                  "Design-Build Firms",
                  "General Contractors",
                  "Home Builders",
                  "Interior Designers & Decorators",
                ].map((item, i) => (
                  <label
                    key={i}
                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
                  >
                    <input
                      type="radio"
                      name="category"
                      className="w-4 h-4 border-2 border-gray-300 text-primary focus:ring-2 focus:ring-primary focus:ring-offset-0 cursor-pointer flex-shrink-0"
                      checked={professionalCategory === item}
                      onChange={() => {
                        setProfessionalCategory(item);
                        toggleFilter(item);
                      }}
                    />
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 flex-1 whitespace-nowrap overflow-hidden text-ellipsis">{item}</span>
                    {professionalCategory === item && (
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                    )}
                  </label>
                ))}
              </div>
            </AccordionSection>

            {/* Budget */}
            <AccordionSection title="Budget" icon={DollarSign}>
              {[
                { value: "$$$$ - I want the best results", label: "Premium", color: "purple" },
                { value: "$$$ - Mid-to-high price", label: "Mid-to-High", color: "blue" },
                { value: "$$ - Low-to-mid price", label: "Low-to-Mid", color: "green" },
                { value: "$ - I want to minimize costs", label: "Budget-Friendly", color: "gray" },
              ].map((item, i) => (
                <label
                  key={i}
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all cursor-pointer group ${budget === item.value
                    ? "bg-primary/5 border-primary shadow-sm"
                    : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                >
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded border-2 border-gray-300 text-primary focus:ring-2 focus:ring-primary focus:ring-offset-0 cursor-pointer transition-all checked:bg-primary checked:border-primary"
                      checked={budget === item.value}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setBudget(item.value);
                          toggleFilter(item.value);
                        } else {
                          setBudget("");
                          handleRemoveFilter(item.value);
                        }
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-lg font-bold text-gray-900">{item.value.split(" -")[0]}</span>
                      <span className="text-xs font-semibold text-gray-500 uppercase">{item.label}</span>
                    </div>
                    <p className="text-xs text-gray-600">{item.value.split(" - ")[1]}</p>
                  </div>
                  {budget === item.value && (
                    <CheckCircle className="w-5 h-5 text-primary" />
                  )}
                </label>
              ))}
            </AccordionSection>

            {/* Business Highlights */}
            <AccordionSection title="Business Highlights" icon={Award}>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { label: "Hired on Houzz", checked: hiredOnPlatform, setter: setHiredOnPlatform, filter: "Hired on Houzz", icon: Verified },
                  { label: "Responds Quickly", checked: respondsQuickly, setter: setRespondsQuickly, filter: "Responds Quickly", icon: Clock },
                  { label: "Provides 3D Visualization", checked: provides3d, setter: setProvides3d, filter: "Provides 3D Visualization", icon: Sparkles },
                  { label: "Eco-friendly", checked: ecoFriendly, setter: setEcoFriendly, filter: "Eco-friendly", icon: CheckCircle },
                  { label: "Family owned", checked: familyOwned, setter: setFamilyOwned, filter: "Family owned", icon: Users },
                  { label: "Locally owned", checked: locallyOwned, setter: setLocallyOwned, filter: "Locally owned", icon: MapPin },
                  { label: "Offers Custom Work", checked: offersCustomWork, setter: setOffersCustomWork, filter: "Offers Custom Work", icon: Wrench },
                ].map((item, i) => (
                  <label
                    key={i}
                    className={`flex items-center gap-3 p-2.5 rounded-lg transition-all cursor-pointer group ${item.checked
                      ? "bg-primary/5 border border-primary/20"
                      : "hover:bg-gray-50"
                      }`}
                  >
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        className="w-5 h-5 rounded border-2 border-gray-300 text-primary focus:ring-2 focus:ring-primary focus:ring-offset-0 cursor-pointer transition-all checked:bg-primary checked:border-primary"
                        checked={item.checked}
                        onChange={(e) => {
                          item.setter(e.target.checked);
                          toggleFilter(item.filter);
                        }}
                      />
                    </div>
                    <item.icon className={`w-4 h-4 transition-colors ${item.checked ? "text-primary" : "text-gray-400 group-hover:text-gray-600"
                      }`} />
                    <span className={`text-sm font-medium flex-1 transition-colors ${item.checked ? "text-gray-900" : "text-gray-700 group-hover:text-gray-900"
                      }`}>
                      {item.label}
                    </span>
                    {item.checked && (
                      <CheckCircle className="w-4 h-4 text-primary" />
                    )}
                  </label>
                ))}
              </div>
            </AccordionSection>

            {/* Languages */}
            <AccordionSection title="Languages" icon={Languages}>
              <div className="space-y-1.5">
                {[
                  "All Languages",
                  "Speaks Spanish",
                  "Speaks Russian",
                  "Speaks Italian",
                ].map((item, i) => (
                  <label
                    key={i}
                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
                  >
                    <input
                      type="radio"
                      name="language"
                      className="w-4 h-4 border-2 border-gray-300 text-primary focus:ring-2 focus:ring-primary focus:ring-offset-0 cursor-pointer"
                      checked={selectedLanguage === item}
                      onChange={() => {
                        setSelectedLanguage(item);
                        toggleFilter(item);
                      }}
                    />
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 flex-1">{item}</span>
                    {selectedLanguage === item && (
                      <CheckCircle className="w-4 h-4 text-primary" />
                    )}
                  </label>
                ))}
              </div>
            </AccordionSection>

            {/* Rating */}
            <AccordionSection title="Rating" icon={Star}>
              <div className="space-y-1.5">
                {[
                  { value: "Any Rating", stars: 0 },
                  { value: "5 stars only", stars: 5 },
                  { value: "4 stars & up", stars: 4 },
                  { value: "3 stars & up", stars: 3 },
                ].map((item, i) => (
                  <label
                    key={i}
                    className={`flex items-center gap-3 p-2.5 rounded-lg transition-all cursor-pointer group ${selectedRating === item.value
                      ? "bg-primary/5 border border-primary/20"
                      : "hover:bg-gray-50"
                      }`}
                  >
                    <input
                      type="radio"
                      name="rating"
                      className="w-4 h-4 border-2 border-gray-300 text-primary focus:ring-2 focus:ring-primary focus:ring-offset-0 cursor-pointer"
                      checked={selectedRating === item.value}
                      onChange={() => {
                        setSelectedRating(item.value);
                        setSelectedFilters((prev) => [
                          ...prev.filter((f) => !f.includes("stars") && f !== "Any Rating"),
                          item.value,
                        ]);
                      }}
                    />
                    <div className="flex items-center gap-2 flex-1">
                      {item.stars > 0 && (
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, idx) => (
                            <Star
                              key={idx}
                              className={`w-4 h-4 ${idx < item.stars
                                ? "text-primary fill-primary"
                                : "text-gray-300"
                                }`}
                            />
                          ))}
                        </div>
                      )}
                      <span className={`text-sm font-medium flex-1 ${selectedRating === item.value ? "text-gray-900" : "text-gray-700 group-hover:text-gray-900"
                        }`}>
                        {item.value}
                      </span>
                    </div>
                    {selectedRating === item.value && (
                      <CheckCircle className="w-4 h-4 text-primary" />
                    )}
                  </label>
                ))}
              </div>
            </AccordionSection>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
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
                      <Award className="w-4 h-4 text-primary" />
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
            {companiesLoading && (
              <div className="bg-white rounded-lg shadow-sm border p-8 text-center mb-4">
                <div className="text-gray-500 mb-4">
                  <Search className="w-12 h-12 mx-auto mb-4 text-gray-300 animate-pulse" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Loading companies...
                  </h3>
                </div>
              </div>
            )}

            {companiesError && (
              <div className="bg-white rounded-lg shadow-sm border p-8 text-center mb-4">
                <div className="text-red-500 mb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Error loading companies
                  </h3>
                  <p className="text-gray-600">{companiesError}</p>
                </div>
              </div>
            )}

            {!companiesLoading && !companiesError && companies.length === 0 && (
              <div className="bg-white rounded-lg shadow-sm border p-8 text-center mb-4">
                <div className="text-gray-500 mb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No companies found
                  </h3>
                  <p className="text-gray-600">
                    Try adjusting your filters or search criteria.
                  </p>
                </div>
              </div>
            )}

            {paginatedCompanies?.map((c) => (
              <CompanyCard
                key={c?.id}
                id={c?.id}
                name={c?.name}
                rating={c?.rating}
                reviewsCount={c?.reviewsCount}
                verifiedHires={c?.verifiedHires}
                tagline={c?.tagline}
                featuredReview={c?.featuredReview}
                address={c?.address}
                verifiedBusiness={c?.verifiedBusiness}
                description={c?.description}
                yearsInBusiness={c?.yearsInBusiness}
                licenseNumber={c?.licenseNumber}
                certifications={c?.certifications}
                awards={c?.awards}
                servicesOffered={c?.servicesOffered}
                specialties={c?.specialties}
                serviceAreas={c?.serviceAreas}
                respondsQuickly={c?.respondsQuickly}
                hiredOnPlatform={c?.hiredOnPlatform}
                provides3d={c?.provides3d}
                ecoFriendly={c?.ecoFriendly}
                familyOwned={c?.familyOwned}
                locallyOwned={c?.locallyOwned}
                offersCustomWork={c?.offersCustomWork}
                languages={c?.languages}
                budgetRange={c?.budgetRange}
                professionalCategory={c?.professionalCategory}
                images={c?.images || defaultImages}
                bannerText={c?.bannerText}
                sponsored={c?.sponsored}
                email={c?.email}
                phone={c?.phone}
                website={c?.website}
              />
            ))}

            {/* Companies Pagination */}
            {!companiesLoading && !companiesError && companies.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between mt-8 mb-6 gap-4">
                {/* Items per page selector */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Show:</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      const newLimit = Number(e.target.value);
                      setItemsPerPage(newLimit);
                      setCompaniesCurrentPage(1);
                      fetchCompanies(1, newLimit);
                    }}
                    className="border border-gray-300 rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                  <span>per page</span>
                </div>

                {totalCompaniesPages > 1 && (
                  <div className="flex items-center gap-2">
                    {/* First Page */}
                    <Button
                      variant="outline"
                      size="icon"
                      className="w-8 h-8"
                      disabled={companiesCurrentPage <= 1}
                      onClick={() => goToCompaniesPage(1)}
                      title="First Page"
                    >
                      <span className="sr-only">First Page</span>
                      &laquo;
                    </Button>

                    {/* Previous Page */}
                    <Button
                      variant="outline"
                      size="icon"
                      className="w-8 h-8"
                      disabled={companiesCurrentPage <= 1}
                      onClick={() => goToCompaniesPage(companiesCurrentPage - 1)}
                      title="Previous Page"
                    >
                      <span className="sr-only">Previous Page</span>
                      &lsaquo;
                    </Button>

                    <div className="flex items-center gap-1">
                      {(() => {
                        const windowSize = 10;
                        let startPage = Math.max(1, companiesCurrentPage - Math.floor(windowSize / 2));
                        let endPage = Math.min(totalCompaniesPages, startPage + windowSize - 1);

                        if (endPage - startPage + 1 < windowSize) {
                          startPage = Math.max(1, endPage - windowSize + 1);
                        }

                        // Generate page numbers
                        const pages = [];
                        for (let i = startPage; i <= endPage; i++) {
                          pages.push(i);
                        }

                        return pages.map((page) => (
                          <button
                            key={page}
                            onClick={() => goToCompaniesPage(page)}
                            className={`w-8 h-8 flex items-center justify-center text-sm font-medium rounded-md transition-colors ${companiesCurrentPage === page
                              ? "bg-primary text-black hover:bg-primary/90"
                              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                              }`}
                          >
                            {page}
                          </button>
                        ));
                      })()}
                    </div>

                    {/* Next Page */}
                    <Button
                      variant="outline"
                      size="icon"
                      className="w-8 h-8"
                      disabled={companiesCurrentPage >= totalCompaniesPages}
                      onClick={() => goToCompaniesPage(companiesCurrentPage + 1)}
                      title="Next Page"
                    >
                      <span className="sr-only">Next Page</span>
                      &rsaquo;
                    </Button>

                    {/* Last Page */}
                    <Button
                      variant="outline"
                      size="icon"
                      className="w-8 h-8"
                      disabled={companiesCurrentPage >= totalCompaniesPages}
                      onClick={() => goToCompaniesPage(totalCompaniesPages)}
                      title="Last Page"
                    >
                      <span className="sr-only">Last Page</span>
                      &raquo;
                    </Button>
                  </div>
                )}
              </div>
            )}
            {/* Contractors List - Legacy Removed, using CompanyCard above */}
            {/* <div className="space-y-6">
              {visibleContractors.map((contractor, index) => {
                 // Legacy rendering removed to prefer CompanyCard
                 return null;
              })}
            </div> */}


          </div>
        </div>
      </div>

      {/* Contractor Profile Preview Modal */}
      <ContractorProfilePreview
        contractor={selectedContractor}
        isOpen={showProfilePreview}
        onClose={closeProfilePreview}
      />

      {/* <NewsletterSection /> */}
      <CTASection />
      <Footer />
    </div>
  );
};

export default Contractors;
