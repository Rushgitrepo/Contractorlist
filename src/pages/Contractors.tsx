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
import companyService, { CompanySearchFilters } from "@/services/companyService";

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

  // Company API state
  const [companies, setCompanies] = useState<any[]>([]);
  const [companiesLoading, setCompaniesLoading] = useState(false);
  const [companiesError, setCompaniesError] = useState<string | null>(null);
  const [companiesCurrentPage, setCompaniesCurrentPage] = useState(1);
  const companiesPerPage = 5;

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

  // Fetch companies from API
  const fetchCompanies = async () => {
    setCompaniesLoading(true);
    setCompaniesError(null);

    try {
      const filters: CompanySearchFilters = {};

      // Location filters
      if (zip) {
        filters.zip = zip;
      }
      if (location && location !== "New York, NY") {
        const [city, state] = location.split(", ");
        if (city) filters.city = city;
        if (state) filters.location = state;
      }

      // Service filter
      if (serviceRaw) {
        filters.service = serviceRaw;
      }

      // Business feature filters
      if (verifiedLicense) filters.verified_license = true;
      if (respondsQuickly) filters.responds_quickly = true;
      if (hiredOnPlatform) filters.hired_on_platform = true;
      if (provides3d) filters.provides_3d = true;
      if (ecoFriendly) filters.eco_friendly = true;
      if (familyOwned) filters.family_owned = true;
      if (locallyOwned) filters.locally_owned = true;
      if (offersCustomWork) filters.offers_custom_work = true;

      // Category filter
      if (professionalCategory) {
        filters.professional_category = professionalCategory;
      }

      // Budget filter
      if (budget) {
        const budgetMap: Record<string, "$" | "$$" | "$$$" | "$$$$"> = {
          "$ - I want to minimize costs": "$",
          "$$ - Low-to-mid price": "$$",
          "$$$ - Mid-to-high price": "$$$",
          "$$$$ - I want the best results": "$$$$",
        };
        if (budgetMap[budget]) {
          filters.budget = budgetMap[budget];
        }
      }

      // Language filter
      if (selectedLanguage && selectedLanguage !== "All Languages") {
        const languageMap: Record<string, string> = {
          "Speaks Spanish": "Spanish",
          "Speaks Russian": "Russian",
          "Speaks Italian": "Italian",
        };
        if (languageMap[selectedLanguage]) {
          filters.language = languageMap[selectedLanguage];
        }
      }

      // Rating filter
      if (selectedRating && selectedRating !== "Any Rating") {
        if (selectedRating === "5 stars only") {
          filters.rating = 5;
        } else if (selectedRating === "4 stars & up") {
          filters.rating = 4;
        } else if (selectedRating === "3 stars & up") {
          filters.rating = 3;
        }
      }

      const response = await companyService.searchCompanies(filters);
      
      if (response.success) {
        // Map API response to CompanyCard format
        const mappedCompanies = response.data.map((item: any) => {
          const company = item.company || item;
          const details = company.details || {};
          
          return {
            id: company.id || company.name?.toLowerCase().replace(/\s+/g, "-"),
            name: company.name || "Unknown Company",
            rating: company.rating || 0,
            reviewsCount: company.reviews_count || company.reviews || company.reviewCount || 0,
            verifiedHires: company.verified_hires || company.verifiedHires || 0,
            tagline: company.tagline || "",
            featuredReview: company.featured_review ? {
              reviewer: company.featured_review.reviewer,
              reviewText: company.featured_review.review_text || company.featured_review.reviewText,
            } : undefined,
            address: details.address || company.address || company.location || "",
            verifiedBusiness: details.verified_business || company.verified_business || false,
            description: details.description || company.description || "",
            yearsInBusiness: details.years_in_business || company.years_in_business || company.yearsInBusiness || null,
            licenseNumber: details.license_number || company.license_number || company.licenseNumber || "",
            certifications: details.certifications || company.certifications || [],
            awards: details.awards || company.awards || [],
            servicesOffered: details.services_offered || company.services_offered || company.services || [],
            specialties: details.specialties || company.specialties || [],
            serviceAreas: details.service_areas || company.service_areas || [],
            respondsQuickly: details.responds_quickly || company.responds_quickly || false,
            hiredOnPlatform: details.hired_on_platform || company.hired_on_platform || false,
            provides3d: details.provides_3d_visualization || company.provides_3d_visualization || company.provides_3d || false,
            ecoFriendly: details.eco_friendly || company.eco_friendly || false,
            familyOwned: details.family_owned || company.family_owned || false,
            locallyOwned: details.locally_owned || company.locally_owned || false,
            offersCustomWork: details.offers_custom_work || company.offers_custom_work || false,
            languages: details.languages || company.languages || (company.language ? [company.language] : []),
            budgetRange: details.budget_range || company.budget_range || company.budget || "",
            professionalCategory: details.professional_category || company.professional_category || company.category || "",
            images: company.images && company.images.length > 0 
              ? company.images 
              : defaultImages,
            bannerText: company.bannerText || company.banner_text || "",
            sponsored: company.sponsored || false,
            email: company.email || company.contact?.email || details.email || "",
            phone: company.phone || company.contact?.phone || details.phone || "",
            website: company.website || company.contact?.website || details.website || "",
          };
        });
        setCompanies(mappedCompanies);
      } else {
        throw new Error(response.message || "Failed to fetch companies");
      }
    } catch (e: any) {
      setCompaniesError(e.message || "Failed to load companies");
      setCompanies([]);
    } finally {
      setCompaniesLoading(false);
    }
  };

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

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(
        `${API_URL}/contractors?${searchParams.toString()}`
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

  // Run on mount and when URL params or filters change
  useEffect(() => {
    fetchCompanies();
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
  ]);

  useEffect(() => {
    fetchContractors(1);
  }, [zip, serviceRaw, onlyMyZip]);

  // Use API results instead of filtered data
  const visibleContractors = results;

  // Calculate pagination for companies
  const totalCompaniesPages = Math.ceil(companies.length / companiesPerPage);
  const startIndex = (companiesCurrentPage - 1) * companiesPerPage;
  const endIndex = startIndex + companiesPerPage;
  const paginatedCompanies = companies.slice(startIndex, endIndex);

  // Pagination handlers for companies
  const goToCompaniesPage = (page: number) => {
    setCompaniesCurrentPage(page);
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

  // Pagination handlers
  const goPrev = () => fetchContractors(page - 1);
  const goNext = () => fetchContractors(page + 1);

  const AccordionSection = ({ title, children, icon: Icon }: any) => {
    const [open, setOpen] = useState(true);
    return (
      <div className="border-b border-gray-200 pb-3 mb-3 last:border-b-0">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center justify-between w-full text-sm font-bold text-gray-900 mb-2 hover:text-yellow-600 transition-colors"
        >
          <div className="flex items-center gap-2">
            {Icon && <Icon className="w-4 h-4 text-yellow-600" />}
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
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sticky top-6 w-full max-w-4xl h-fit max-h-[calc(100vh-100px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
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
                <MapPin className="w-4 h-4 text-yellow-600" />
                <h3 className="text-sm font-bold text-gray-900">
                  Location
                </h3>
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <select
                    value={location}
                    onChange={(e) => {
                      setLocation(e.target.value);
                    }}
                    className="w-full h-9 rounded-lg border border-gray-300 bg-white px-3 pr-8 text-sm text-gray-700 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all hover:border-gray-400 appearance-none cursor-pointer"
                  >
                    <option>New York, NY</option>
                    <option>California, CA</option>
                    <option>New Jersey, NJ</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                <div className="relative">
                  <select
                    value={radius}
                    onChange={(e) => setRadius(e.target.value)}
                    className="w-full h-9 rounded-lg border border-gray-300 bg-white px-3 pr-8 text-sm text-gray-700 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all hover:border-gray-400 appearance-none cursor-pointer"
                  >
                    <option>50 mi</option>
                    <option>100 mi</option>
                    <option>120 mi</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <AccordionSection title="Suggested Filters" icon={Filter}>
              <label className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-2 border-gray-300 text-yellow-600 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-0 cursor-pointer transition-all checked:bg-yellow-500 checked:border-yellow-500"
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
                    className="w-5 h-5 rounded border-2 border-gray-300 text-yellow-600 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-0 cursor-pointer transition-all checked:bg-yellow-500 checked:border-yellow-500"
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
                    className="w-5 h-5 rounded border-2 border-gray-300 text-yellow-600 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-0 cursor-pointer transition-all checked:bg-yellow-500 checked:border-yellow-500"
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
                    className="w-full border-2 border-gray-200 rounded-lg px-3 pl-10 py-2.5 text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
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
                      className="w-4 h-4 border-2 border-gray-300 text-yellow-600 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-0 cursor-pointer flex-shrink-0"
                      checked={professionalCategory === item}
                      onChange={() => {
                        setProfessionalCategory(item);
                        toggleFilter(item);
                      }}
                    />
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 flex-1 whitespace-nowrap overflow-hidden text-ellipsis">{item}</span>
                    {professionalCategory === item && (
                      <CheckCircle className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                    )}
                  </label>
                ))}
              </div>
            </AccordionSection>

            {/* Project Type */}
            <AccordionSection title="Project Type" icon={Home}>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-500 text-sm font-medium">Select project type...</p>
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
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all cursor-pointer group ${
                    budget === item.value
                      ? "bg-yellow-50 border-yellow-400 shadow-sm"
                      : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded border-2 border-gray-300 text-yellow-600 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-0 cursor-pointer transition-all checked:bg-yellow-500 checked:border-yellow-500"
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
                    <CheckCircle className="w-5 h-5 text-yellow-600" />
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
                    className={`flex items-center gap-3 p-2.5 rounded-lg transition-all cursor-pointer group ${
                      item.checked
                        ? "bg-yellow-50 border border-yellow-200"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        className="w-5 h-5 rounded border-2 border-gray-300 text-yellow-600 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-0 cursor-pointer transition-all checked:bg-yellow-500 checked:border-yellow-500"
                        checked={item.checked}
                        onChange={(e) => {
                          item.setter(e.target.checked);
                          toggleFilter(item.filter);
                        }}
                      />
                    </div>
                    <item.icon className={`w-4 h-4 transition-colors ${
                      item.checked ? "text-yellow-600" : "text-gray-400 group-hover:text-gray-600"
                    }`} />
                    <span className={`text-sm font-medium flex-1 transition-colors ${
                      item.checked ? "text-gray-900" : "text-gray-700 group-hover:text-gray-900"
                    }`}>
                      {item.label}
                    </span>
                    {item.checked && (
                      <CheckCircle className="w-4 h-4 text-yellow-600" />
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
                      className="w-4 h-4 border-2 border-gray-300 text-yellow-600 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-0 cursor-pointer"
                      checked={selectedLanguage === item}
                      onChange={() => {
                        setSelectedLanguage(item);
                        toggleFilter(item);
                      }}
                    />
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 flex-1">{item}</span>
                    {selectedLanguage === item && (
                      <CheckCircle className="w-4 h-4 text-yellow-600" />
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
                    className={`flex items-center gap-3 p-2.5 rounded-lg transition-all cursor-pointer group ${
                      selectedRating === item.value
                        ? "bg-yellow-50 border border-yellow-200"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="rating"
                      className="w-4 h-4 border-2 border-gray-300 text-yellow-600 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-0 cursor-pointer"
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
                              className={`w-4 h-4 ${
                                idx < item.stars
                                  ? "text-yellow-500 fill-yellow-500"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                      <span className={`text-sm font-medium flex-1 ${
                        selectedRating === item.value ? "text-gray-900" : "text-gray-700 group-hover:text-gray-900"
                      }`}>
                        {item.value}
                      </span>
                    </div>
                    {selectedRating === item.value && (
                      <CheckCircle className="w-4 h-4 text-yellow-600" />
                    )}
                  </label>
                ))}
              </div>
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
            {!companiesLoading && !companiesError && companies.length > 0 && totalCompaniesPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-8 mb-6">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={companiesCurrentPage <= 1}
                  onClick={() => goToCompaniesPage(companiesCurrentPage - 1)}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-2">
                  {[...Array(totalCompaniesPages)].map((_, idx) => {
                    const page = idx + 1;
                    // Show first page, last page, current page, and pages around current
                    if (
                      page === 1 ||
                      page === totalCompaniesPages ||
                      (page >= companiesCurrentPage - 1 && page <= companiesCurrentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => goToCompaniesPage(page)}
                          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                            companiesCurrentPage === page
                              ? "bg-yellow-500 text-white hover:bg-yellow-600"
                              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (
                      page === companiesCurrentPage - 2 ||
                      page === companiesCurrentPage + 2
                    ) {
                      return (
                        <span key={page} className="px-2 text-gray-500">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={companiesCurrentPage >= totalCompaniesPages}
                  onClick={() => goToCompaniesPage(companiesCurrentPage + 1)}
                >
                  Next
                </Button>
                <span className="text-sm text-gray-600 ml-2">
                  Page {companiesCurrentPage} of {totalCompaniesPages} ({companies.length} total)
                </span>
              </div>
            )}
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
