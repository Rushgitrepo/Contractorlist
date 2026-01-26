import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Building2,
  MapPin,
  Calendar,
  DollarSign,
  Search,
  X,
  User,
  MessageCircle,
  Plus,
  Minus,
  Clock,
  Gavel,
  FileText,
  Eye,
  Phone,
  Mail,
  Users,
  HardHat,
  CheckCircle2,
  Ruler,
  Globe,
  Shield,
} from "lucide-react";

interface Lead {
  id: number;
  title: string;
  location: string;
  locationFull: string;
  projectId: string;
  bidDue: string;
  bidDueTime: string;
  tags: { label: string; color: string }[];
  coordinates: [number, number]; // [lng, lat]
  description: string;
  budget: string;
  sqft: string;
  owner: string;
  ownerEmail?: string;
  ownerPhone?: string;
  status: string;
  documents?: string[];
  type: "public" | "private";
  projectType: string;
  bids: number;
  views: number;
  postedDate: string;
}

const Projects = () => {
  const [activeTab, setActiveTab] = useState<"all" | "my">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [mapZoom, setMapZoom] = useState(7);

  // Enhanced leads data with coordinates and tags
  const leads: Lead[] = [
    {
      id: 1,
      title: "Longwood CSD - Miscellaneous Alterations at Longwood Middle School - Bid No.022626-1",
      location: "Middle Island, New York",
      locationFull: "Middle Island, New York, United States",
      projectId: "LGSD2431 SED-7, 18",
      bidDue: "2/26/26",
      bidDueTime: "11:00am",
      tags: [
        { label: "E", color: "bg-red-500" },
        { label: "GC", color: "bg-blue-500" },
        { label: "M", color: "bg-green-500" },
        { label: "P", color: "bg-purple-500" },
        { label: "S", color: "bg-blue-500" },
      ],
      coordinates: [-72.9394, 40.8844],
      description: "Miscellaneous alterations and renovations at Longwood Middle School including electrical, general construction, mechanical, plumbing, and site work.",
      budget: "$2.5M - $3.5M",
      sqft: "85,000",
      owner: "Longwood Central School District",
      ownerEmail: "bids@longwoodcsd.org",
      ownerPhone: "(631) 345-2700",
      status: "Bidding Open",
      documents: ["Bid Package.pdf", "Specifications.pdf", "Drawings.zip"],
      type: "public",
      projectType: "Education",
      bids: 12,
      views: 245,
      postedDate: "2024-02-15",
    },
    {
      id: 2,
      title: "Syosset CSD - Locker Room Renovations at South Woods Middle School",
      location: "Syosset, New York",
      locationFull: "Syosset, New York, United States",
      projectId: "SYSD2413 SED15",
      bidDue: "2/19/26",
      bidDueTime: "11:00am",
      tags: [
        { label: "E", color: "bg-red-500" },
        { label: "GC", color: "bg-blue-500" },
        { label: "M", color: "bg-green-500" },
        { label: "P", color: "bg-purple-500" },
      ],
      coordinates: [-73.5021, 40.8262],
      description: "Complete locker room renovations including new fixtures, plumbing, electrical, and mechanical systems at South Woods Middle School.",
      budget: "$1.8M - $2.2M",
      sqft: "12,000",
      owner: "Syosset Central School District",
      ownerEmail: "projects@syossetcsd.org",
      ownerPhone: "(516) 364-5700",
      status: "Bidding Open",
      documents: ["Renovation Plans.pdf", "Specifications.pdf"],
      type: "public",
      projectType: "Education",
      bids: 8,
      views: 189,
      postedDate: "2024-02-10",
    },
    {
      id: 3,
      title: "Rotterdam-Mohonasen CSD 2023 Capital Project - Package 04",
      location: "Schenectady, New York",
      locationFull: "Schenectady, New York, United States",
      projectId: "109-2301.04",
      bidDue: "2/12/26",
      bidDueTime: "3:30pm",
      tags: [
        { label: "E", color: "bg-red-500" },
        { label: "GC", color: "bg-blue-500" },
        { label: "M", color: "bg-green-500" },
        { label: "P", color: "bg-purple-500" },
        { label: "R", color: "bg-yellow-500" },
      ],
      coordinates: [-73.9396, 42.8142],
      description: "Capital project package 04 including electrical, general construction, mechanical, plumbing, and roofing work for the Rotterdam-Mohonasen Central School District.",
      budget: "$3.2M - $4.0M",
      sqft: "125,000",
      owner: "Rotterdam-Mohonasen Central School District",
      ownerEmail: "bids@rmcsd.org",
      ownerPhone: "(518) 356-8200",
      status: "Bidding Open",
      documents: ["Capital Project Plans.pdf", "Package 04 Specs.pdf", "Bid Documents.zip"],
      type: "public",
      projectType: "Education",
      bids: 15,
      views: 312,
      postedDate: "2024-02-12",
    },
    {
      id: 4,
      title: "Commercial Office Building - Downtown Austin",
      location: "Austin, TX",
      locationFull: "Austin, Texas, United States",
      projectId: "AUS-2024-001",
      bidDue: "3/15/26",
      bidDueTime: "5:00pm",
      tags: [
        { label: "GC", color: "bg-blue-500" },
        { label: "E", color: "bg-red-500" },
        { label: "M", color: "bg-green-500" },
      ],
      coordinates: [-97.7431, 30.2672],
      description: "New 5-story office building construction in downtown area. Includes parking garage and retail space.",
      budget: "$2.5M - $5M",
      sqft: "125,000",
      owner: "ABC Development LLC",
      ownerEmail: "projects@abcdev.com",
      ownerPhone: "(512) 555-0100",
      status: "Bidding Open",
      documents: ["Architectural Plans.pdf", "MEP Drawings.pdf", "Bid Package.zip"],
      type: "private",
      projectType: "Commercial",
      bids: 12,
      views: 245,
      postedDate: "2024-02-15",
    },
    {
      id: 5,
      title: "Residential Complex - Phase 2 Development",
      location: "Dallas, TX",
      locationFull: "Dallas, Texas, United States",
      projectId: "DAL-2024-042",
      bidDue: "2/28/26",
      bidDueTime: "2:00pm",
      tags: [
        { label: "GC", color: "bg-blue-500" },
        { label: "P", color: "bg-purple-500" },
        { label: "E", color: "bg-red-500" },
      ],
      coordinates: [-96.797, 32.7767],
      description: "Multi-family residential development with 200+ units. Includes amenities and landscaping.",
      budget: "$10M - $15M",
      sqft: "450,000",
      owner: "Luxury Homes Group",
      ownerEmail: "bids@luxuryhomes.com",
      ownerPhone: "(214) 555-0200",
      status: "Pre-Construction",
      documents: ["Site Plans.pdf", "Unit Plans.pdf"],
      type: "private",
      projectType: "Residential",
      bids: 8,
      views: 189,
      postedDate: "2024-02-10",
    },
    {
      id: 6,
      title: "Hospital Renovation Project - Main Wing",
      location: "Houston, TX",
      locationFull: "Houston, Texas, United States",
      projectId: "HOU-2024-089",
      bidDue: "3/15/26",
      bidDueTime: "11:00am",
      tags: [
        { label: "GC", color: "bg-blue-500" },
        { label: "M", color: "bg-green-500" },
        { label: "E", color: "bg-red-500" },
      ],
      coordinates: [-95.3698, 29.7604],
      description: "Major renovation of existing hospital facility. Requires working around active operations.",
      budget: "$8M - $12M",
      sqft: "200,000",
      owner: "City Health System",
      ownerEmail: "projects@cityhealth.org",
      ownerPhone: "(713) 555-0300",
      status: "Bidding Open",
      documents: ["Renovation Plans.pdf", "MEP Specs.pdf"],
      type: "public",
      projectType: "Healthcare",
      bids: 15,
      views: 312,
      postedDate: "2024-02-12",
    },
  ];

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.projectId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead);
    setShowDetailsModal(true);
  };


  const handleZoomIn = () => {
    setMapZoom((prev) => Math.min(prev + 1, 18));
  };

  const handleZoomOut = () => {
    setMapZoom((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="flex h-screen w-full bg-white dark:bg-gray-900 overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-1/2 flex flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-md">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">BIDDY PROJECTS</h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">Construction Leads</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
          <div className="flex flex-col gap-1.5">
            <Button
              variant="ghost"
              className="justify-start bg-yellow-50 dark:bg-yellow-900/20 text-gray-900 dark:text-white hover:bg-yellow-100 dark:hover:bg-yellow-900/30 font-medium h-10"
            >
              <Building2 className="w-4 h-4 mr-2" />
              Projects
            </Button>
            <Button variant="ghost" className="justify-start text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 h-10">
              <Calendar className="w-4 h-4 mr-2" />
              Calendar
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-4 pb-3">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "all" | "my")}>
            <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-800 p-1">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm font-medium"
              >
                All projects
              </TabsTrigger>
              <TabsTrigger
                value="my"
                className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm font-medium"
              >
                My projects
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Filters */}
        <div className="px-6 pt-4 space-y-3 border-b border-gray-200 dark:border-gray-800 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-800"
            />
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            <Select defaultValue="latest">
              <SelectTrigger className="w-full h-10 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800">
                <SelectValue placeholder="Bid Date Latest" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Bid Date Latest</SelectItem>
                <SelectItem value="earliest">Bid Date Earliest</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="budget-high">Budget: High to Low</SelectItem>
                <SelectItem value="budget-low">Budget: Low to High</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all">
              <SelectTrigger className="w-full h-10 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800">
                <SelectValue placeholder="All Projects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                <SelectItem value="active">Active Projects</SelectItem>
                <SelectItem value="bidding">Bidding Open</SelectItem>
                <SelectItem value="awarded">Awarded</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all">
              <SelectTrigger className="w-full h-10 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800">
                <SelectValue placeholder="All Contracts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Contracts</SelectItem>
                <SelectItem value="electrical">Electrical (E)</SelectItem>
                <SelectItem value="plumbing">Plumbing (P)</SelectItem>
                <SelectItem value="mechanical">Mechanical (M)</SelectItem>
                <SelectItem value="general">General Construction (GC)</SelectItem>
                <SelectItem value="site">Site Work (S)</SelectItem>
                <SelectItem value="roofing">Roofing (R)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Leads List */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-3">
            {filteredLeads.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No projects found</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Try adjusting your search or filters</p>
              </div>
            ) : (
              filteredLeads.map((lead) => (
                <Card
                  key={lead.id}
                  className="cursor-pointer transition-all duration-200 hover:shadow-xl hover:border-yellow-400/50 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 group"
                  onClick={() => handleLeadClick(lead)}
                >
                  <CardContent className="p-5">
                    {/* Header with Type Badge */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          {lead.type === "public" ? (
                            <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs px-2 py-0.5">
                              <Globe className="w-3 h-3 mr-1" />
                              Public
                            </Badge>
                          ) : (
                            <Badge className="bg-orange-100 text-orange-700 border-orange-200 text-xs px-2 py-0.5">
                              <Shield className="w-3 h-3 mr-1" />
                              Private
                            </Badge>
                          )}
                          <Badge
                            variant="outline"
                            className={`text-xs ${lead.status === "Bidding Open"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : lead.status === "Pre-Construction"
                                  ? "bg-blue-50 text-blue-700 border-blue-200"
                                  : "bg-yellow-50 text-yellow-700 border-yellow-200"
                              }`}
                          >
                            {lead.status}
                          </Badge>
                        </div>
                        <h3 className="font-bold text-sm text-gray-900 dark:text-white line-clamp-2 leading-snug group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                          {lead.title}
                        </h3>
                      </div>
                    </div>

                    {/* Key Information */}
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1.5 min-w-0 flex-1">
                          <Calendar className="w-3.5 h-3.5 flex-shrink-0 text-gray-500" />
                          <span className="font-medium">Bids due:</span>
                          <span className="text-gray-900 dark:text-white font-semibold">
                            {lead.bidDue} {lead.bidDueTime}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-gray-500" />
                        <span className="truncate font-medium">{lead.location}</span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                        <FileText className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="font-mono">ID: {lead.projectId}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {lead.tags.map((tag, idx) => (
                        <Badge
                          key={idx}
                          className={`${tag.color} text-white text-xs w-7 h-7 p-0 flex items-center justify-center rounded-full font-bold shadow-sm hover:scale-110 transition-transform`}
                          title={tag.label}
                        >
                          {tag.label}
                        </Badge>
                      ))}
                    </div>

                    {/* Footer Stats */}
                    <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1.5 font-medium">
                          <Users className="w-3.5 h-3.5 text-blue-500" />
                          <span className="text-gray-900 dark:text-white font-semibold">{lead.bids}</span>
                          <span>bids</span>
                        </span>
                        <span className="flex items-center gap-1.5 font-medium">
                          <Eye className="w-3.5 h-3.5 text-purple-500" />
                          <span className="text-gray-900 dark:text-white font-semibold">{lead.views}</span>
                          <span>views</span>
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500">
                        <DollarSign className="w-3 h-3 inline mr-0.5" />
                        {lead.budget}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Record Count */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
            <p className="text-xs text-gray-500 dark:text-gray-500 text-center">
              Displaying all {filteredLeads.length} records
            </p>
          </div>
        </div>

        {/* User Info */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center">
              <User className="w-5 h-5 text-gray-900" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">John Wood (SDV...)</p>
              <p className="text-xs text-gray-500 dark:text-gray-500">Bidder</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Map Panel */}
      <div className="flex-1 relative">
        {/* Map Container */}
        <div className="w-full h-full relative bg-gray-100 dark:bg-gray-800">
          {/* Map iframe - Using OpenStreetMap */}
          <iframe
            src={`https://www.openstreetmap.org/export/embed.html?bbox=-100%2C28%2C-70%2C45&layer=mapnik&zoom=${mapZoom}`}
            className="w-full h-full border-0"
            title="Project Map"
            allowFullScreen
          />



          {/* Zoom Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-1 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 rounded-none"
              onClick={handleZoomIn}
            >
              <Plus className="w-4 h-4" />
            </Button>
            <div className="h-px bg-gray-200 dark:bg-gray-800"></div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 rounded-none"
              onClick={handleZoomOut}
            >
              <Minus className="w-4 h-4" />
            </Button>
          </div>

          {/* Mapbox Attribution */}
          <div className="absolute bottom-4 left-4">
            <div className="bg-white/90 dark:bg-gray-900/90 px-2 py-1 rounded text-xs text-gray-600 dark:text-gray-400">
              mapbox
            </div>
          </div>

          {/* Chat Icon */}
          <div className="absolute bottom-4 right-4">
            <Button
              size="lg"
              className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg"
            >
              <MessageCircle className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Lead Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedLead?.title}</DialogTitle>
            <DialogDescription>Complete project details and specifications</DialogDescription>
          </DialogHeader>

          {selectedLead && (
            <div className="space-y-6 mt-4">
              {/* Lead Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge
                      variant="outline"
                      className={
                        selectedLead.type === "public"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-orange-50 text-orange-700 border-orange-200"
                      }
                    >
                      {selectedLead.type === "public" ? (
                        <Globe className="w-3 h-3 mr-1" />
                      ) : (
                        <Shield className="w-3 h-3 mr-1" />
                      )}
                      {selectedLead.type === "public" ? "Public" : "Private"}
                    </Badge>
                    <Badge variant="outline">{selectedLead.status}</Badge>
                    <Badge variant="outline">{selectedLead.projectType}</Badge>
                    <div className="flex gap-1">
                      {selectedLead.tags.map((tag, idx) => (
                        <Badge
                          key={idx}
                          className={`${tag.color} text-white text-xs w-6 h-6 p-0 flex items-center justify-center rounded-full font-semibold`}
                        >
                          {tag.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Lead Overview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Budget</div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {selectedLead.budget}
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Square Footage</div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {selectedLead.sqft} sq ft
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Bid Due Date</div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {selectedLead.bidDue} {selectedLead.bidDueTime}
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Project ID</div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {selectedLead.projectId}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Project Description</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {selectedLead.description}
                </p>
              </div>

              {/* Location & Contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Location
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="text-gray-900 dark:text-white">{selectedLead.locationFull}</div>
                  </div>
                </div>
                {selectedLead.owner && (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Project Owner
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="text-gray-900 dark:text-white font-medium">{selectedLead.owner}</div>
                      {selectedLead.ownerEmail && (
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <Mail className="w-4 h-4" />
                          {selectedLead.ownerEmail}
                        </div>
                      )}
                      {selectedLead.ownerPhone && (
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <Phone className="w-4 h-4" />
                          {selectedLead.ownerPhone}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Bids Submitted</div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {selectedLead.bids}
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Views</div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {selectedLead.views}
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Posted Date</div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {new Date(selectedLead.postedDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </div>

              {/* Documents */}
              {selectedLead.documents && selectedLead.documents.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Available Documents
                  </h3>
                  <div className="space-y-2">
                    {selectedLead.documents.map((doc, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{doc}</span>
                        <Button variant="ghost" size="sm" className="ml-auto">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                <Button
                  className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold"
                  onClick={() => {
                    setShowDetailsModal(false);
                  }}
                >
                  <Gavel className="w-4 h-4 mr-2" />
                  Submit Bid
                </Button>
                <Button variant="outline" onClick={() => setShowDetailsModal(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Projects;
