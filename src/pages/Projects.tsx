import { useState } from "react";
import { Link } from "react-router-dom";
import ReduxHeader from "@/components/ReduxHeader";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  MapPin,
  Calendar,
  DollarSign,
  Lock,
  Search,
  Filter,
  Sparkles,
  ArrowRight,
  Shield,
  Globe,
  Clock,
  Users,
  FileText,
  TrendingUp,
  Award,
  Eye,
  CheckCircle,
} from "lucide-react";

const Projects = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "public" | "private">("all");

  // Mock leads data with more industry details
  const leads = [
    {
      id: 1,
      title: "Commercial Office Building - Downtown",
      type: "public",
      location: "Austin, TX",
      budget: "$2.5M - $5M",
      postedDate: "2024-02-15",
      deadline: "2024-03-01",
      description: "New 5-story office building construction in downtown area. Includes parking garage and retail space.",
      status: "Bidding Open",
      projectType: "Commercial",
      sqft: "125,000",
      bids: 12,
      views: 245,
      owner: "ABC Development LLC",
    },
    {
      id: 2,
      title: "Residential Complex - Phase 2",
      type: "private",
      location: "Dallas, TX",
      budget: "$10M - $15M",
      postedDate: "2024-02-10",
      deadline: "2024-02-28",
      description: "Multi-family residential development with 200+ units. Includes amenities and landscaping.",
      status: "Pre-Construction",
      projectType: "Residential",
      sqft: "450,000",
      bids: 8,
      views: 189,
      owner: "Luxury Homes Group",
    },
    {
      id: 3,
      title: "Hospital Renovation Project",
      type: "public",
      location: "Houston, TX",
      budget: "$8M - $12M",
      postedDate: "2024-02-12",
      deadline: "2024-03-15",
      description: "Major renovation of existing hospital facility. Requires working around active operations.",
      status: "Bidding Open",
      projectType: "Healthcare",
      sqft: "200,000",
      bids: 15,
      views: 312,
      owner: "City Health System",
    },
    {
      id: 4,
      title: "Shopping Mall Expansion",
      type: "private",
      location: "San Antonio, TX",
      budget: "$20M - $30M",
      postedDate: "2024-02-08",
      deadline: "2024-03-20",
      description: "Expansion of existing shopping center with new anchor stores and parking facilities.",
      status: "Planning",
      projectType: "Retail",
      sqft: "350,000",
      bids: 6,
      views: 156,
      owner: "Retail Partners Inc",
    },
    {
      id: 5,
      title: "School District - New Elementary",
      type: "public",
      location: "Fort Worth, TX",
      budget: "$15M - $20M",
      postedDate: "2024-02-14",
      deadline: "2024-04-01",
      description: "Construction of new elementary school with modern facilities and technology integration.",
      status: "Bidding Open",
      projectType: "Education",
      sqft: "180,000",
      bids: 22,
      views: 428,
      owner: "Fort Worth ISD",
    },
    {
      id: 6,
      title: "Luxury Condo Development",
      type: "private",
      location: "Austin, TX",
      budget: "$25M - $35M",
      postedDate: "2024-02-11",
      deadline: "2024-03-10",
      description: "High-end residential condominium project with premium finishes and amenities.",
      status: "Pre-Construction",
      projectType: "Residential",
      sqft: "280,000",
      bids: 9,
      views: 201,
      owner: "Elite Properties",
    },
  ];

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.projectType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterType === "all" || lead.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const publicLeadsCount = leads.filter((l) => l.type === "public").length;
  const privateLeadsCount = leads.filter((l) => l.type === "private").length;
  const totalBudget = leads.reduce((sum, lead) => {
    const min = parseFloat(lead.budget.split(" - ")[0].replace("$", "").replace("M", ""));
    return sum + min;
  }, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Bidding Open":
        return "bg-green-100 text-green-800 border-green-200";
      case "Pre-Construction":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Planning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <ReduxHeader />
      
      <div className="bg-gradient-to-br from-gray-50 via-white to-yellow-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-full mb-5 shadow-sm border border-orange-100">
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              <span className="text-xs font-semibold text-orange-600">
                Pre-Construction Leads Database
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 leading-tight">
              Find <span className="text-orange-600">Construction Projects</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Browse public construction leads for free. Subscribe to access exclusive private leads with full project details and contact information.
            </p>
          </div>

          {/* Premium Access Banner - Only show when viewing private leads */}
          {filterType === "private" || filterType === "all" ? (
            <Card className="bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-500 border-0 shadow-md mb-6">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-lg">
                      <Lock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white mb-0.5">
                        Premium Access Required for Private Leads
                      </h3>
                      <p className="text-xs text-white/90">
                        Subscribe to unlock full project details, owner contacts, and bid documents
                      </p>
                    </div>
                  </div>
                  <Link to="/subscription">
                    <Button className="bg-white hover:bg-gray-50 text-orange-600 font-semibold shadow-sm text-sm px-4 py-2 h-auto">
                      Subscribe
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : null}

          {/* Stats Dashboard */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-orange-700 uppercase tracking-wide mb-1">
                      Total Leads
                    </p>
                    <p className="text-3xl font-bold text-orange-900">{leads.length}</p>
                  </div>
                  <div className="p-3 bg-orange-200 rounded-xl">
                    <Building2 className="w-6 h-6 text-orange-700" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-orange-700 uppercase tracking-wide mb-1">
                      Public Leads
                    </p>
                    <p className="text-3xl font-bold text-orange-900">{publicLeadsCount}</p>
                  </div>
                  <div className="p-3 bg-orange-200 rounded-xl">
                    <Globe className="w-6 h-6 text-orange-700" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-orange-700 uppercase tracking-wide mb-1">
                      Private Leads
                    </p>
                    <p className="text-3xl font-bold text-orange-900">{privateLeadsCount}</p>
                  </div>
                  <div className="p-3 bg-orange-200 rounded-xl">
                    <Shield className="w-6 h-6 text-orange-700" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">
                      Total Value
                    </p>
                    <p className="text-3xl font-bold text-green-900">${totalBudget.toFixed(1)}M</p>
                  </div>
                  <div className="p-3 bg-green-200 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-green-700" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter Bar */}
          <Card className="mb-6 border border-gray-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search by project name, location, or type..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm bg-white"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={filterType === "all" ? "default" : "outline"}
                    onClick={() => setFilterType("all")}
                    className={`text-sm font-medium px-4 py-2.5 h-auto ${
                      filterType === "all"
                        ? "bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black border-0 shadow-sm"
                        : "border border-gray-300 bg-white hover:bg-gray-50"
                    }`}
                  >
                    All Leads
                  </Button>
                  <Button
                    variant={filterType === "public" ? "default" : "outline"}
                    onClick={() => setFilterType("public")}
                    className={`text-sm font-medium px-4 py-2.5 h-auto ${
                      filterType === "public"
                        ? "bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black border-0 shadow-sm"
                        : "border border-gray-300 bg-white hover:bg-gray-50"
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5 mr-1.5" />
                    Public
                  </Button>
                  <Button
                    variant={filterType === "private" ? "default" : "outline"}
                    onClick={() => setFilterType("private")}
                    className={`text-sm font-medium px-4 py-2.5 h-auto ${
                      filterType === "private"
                        ? "bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black border-0 shadow-sm"
                        : "border border-gray-300 bg-white hover:bg-gray-50"
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5 mr-1.5" />
                    Private
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lead Types Visual Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Public Leads Card */}
            <Card className="bg-white border-2 border-gray-200 shadow-lg hover:shadow-xl hover:border-orange-300 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-4 bg-orange-100 rounded-xl shadow-md">
                    <Globe className="w-8 h-8 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">Public Leads</h3>
                      <Badge className="bg-orange-100 text-orange-700 border-orange-200 font-semibold">
                        {publicLeadsCount} Available
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-4">
                      Government and publicly announced projects. <strong className="text-green-600">Free access</strong> to all project details, open bidding opportunities from municipalities, schools, and public institutions.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Free access - No subscription required</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Open bidding process</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Full project details available</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Private Leads Card */}
            <Card className="bg-white border-2 border-gray-200 shadow-lg hover:shadow-xl hover:border-orange-300 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-4 bg-orange-100 rounded-xl shadow-md">
                    <Shield className="w-8 h-8 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">Private Leads</h3>
                      <Badge className="bg-orange-100 text-orange-700 border-orange-200 font-semibold">
                        {privateLeadsCount} Available
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-4">
                      Exclusive private sector projects. Commercial, residential, and institutional projects from private developers and companies.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <CheckCircle className="w-4 h-4 text-orange-500" />
                        <span>Exclusive opportunities</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <CheckCircle className="w-4 h-4 text-orange-500" />
                        <span>Private developer projects</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <CheckCircle className="w-4 h-4 text-orange-500" />
                        <span>Higher value contracts</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Leads Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredLeads.map((lead) => (
              <Card
                key={lead.id}
                className={`bg-white border ${
                  lead.type === "public"
                    ? "border-blue-200 hover:border-blue-400 shadow-md hover:shadow-xl"
                    : "border-gray-200 hover:border-orange-400 shadow-md hover:shadow-xl"
                } transition-all duration-300 relative overflow-hidden group h-full flex flex-col`}
              >
                {/* Lead Type Indicator Bar */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1.5 ${
                    lead.type === "public"
                      ? "bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500"
                      : "bg-gradient-to-r from-orange-500 via-yellow-400 to-orange-500"
                  }`}
                ></div>
                
                {/* Premium Lock Overlay - Only for Private Leads */}
                {lead.type === "private" && (
                  <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-10 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="text-center p-6 max-w-xs">
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <Lock className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="text-base font-bold text-gray-900 mb-2">
                        Premium Content
                      </h4>
                      <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                        Subscribe to view complete project details and contact information
                      </p>
                      <Link to="/subscription">
                        <Button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-semibold shadow-md w-full text-sm">
                          Unlock Access
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}

                <CardHeader className="pb-3 border-b border-gray-100 pt-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <Badge
                          className={`${
                            lead.type === "public"
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : "bg-orange-50 text-orange-700 border border-orange-200"
                          } font-medium text-xs px-2.5 py-0.5`}
                        >
                          {lead.type === "public" ? (
                            <Globe className="w-3 h-3 mr-1.5" />
                          ) : (
                            <Shield className="w-3 h-3 mr-1.5" />
                          )}
                          {lead.type === "public" ? "Public" : "Private"}
                        </Badge>
                        <Badge className="bg-gray-50 text-gray-700 border border-gray-200 font-medium text-xs px-2.5 py-0.5">
                          {lead.projectType}
                        </Badge>
                        <Badge className={`${getStatusColor(lead.status)} font-medium text-xs px-2.5 py-0.5`}>
                          {lead.status}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg font-bold text-gray-900 leading-snug">
                        {lead.title}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-5 pb-5 flex-1 flex flex-col">
                  {/* Key Information Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2.5 p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                      <div className={`p-1.5 rounded-md ${
                        lead.type === "public" ? "bg-blue-100" : "bg-orange-100"
                      }`}>
                        <MapPin className={`w-3.5 h-3.5 ${
                          lead.type === "public" ? "text-blue-600" : "text-orange-600"
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5 font-medium">
                          Location
                        </p>
                        <p className="text-xs font-semibold text-gray-900 truncate">{lead.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="p-1.5 bg-green-100 rounded-md">
                        <DollarSign className="w-3.5 h-3.5 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5 font-medium">
                          Budget
                        </p>
                        <p className="text-xs font-semibold text-gray-900 truncate">{lead.budget}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="p-1.5 bg-blue-100 rounded-md">
                        <Building2 className="w-3.5 h-3.5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5 font-medium">
                          Square Footage
                        </p>
                        <p className="text-xs font-semibold text-gray-900 truncate">{lead.sqft} sq ft</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="p-1.5 bg-purple-100 rounded-md">
                        <Calendar className="w-3.5 h-3.5 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5 font-medium">
                          Deadline
                        </p>
                        <p className="text-xs font-semibold text-gray-900 truncate">
                          {new Date(lead.deadline).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-4 flex-1">
                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                      {lead.description}
                    </p>
                  </div>

                  {/* Stats Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
                    <div className="flex items-center gap-3 text-[11px] text-gray-500">
                      <div className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        <span className="font-semibold">{lead.bids}</span>
                        <span>Bids</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        <span className="font-semibold">{lead.views}</span>
                        <span>Views</span>
                      </div>
                    </div>
                    <div className="text-[11px] text-gray-400">
                      {new Date(lead.postedDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredLeads.length === 0 && (
            <Card className="border-2 border-dashed border-gray-300">
              <CardContent className="p-12 text-center">
                <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No projects found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search or filter criteria
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setFilterType("all");
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Projects;
