import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Search,
  MapPin,
  Filter,
  Building2,
  Calendar,
  ArrowUpRight,
  DollarSign,
  Briefcase,
  Star,
  Zap,
  List as ListIcon,
  Gavel,
  Clock,
  FileText,
  Users,
  Grid3x3,
  X,
  Phone,
  Mail,
  Square,
  Ruler,
  HardHat,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ProjectDiscovery = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('austin');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedBudgetRange, setSelectedBudgetRange] = useState<string[]>([]);
  const [selectedTrade, setSelectedTrade] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showBidModal, setShowBidModal] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [bidDuration, setBidDuration] = useState('');
  const [bidProposal, setBidProposal] = useState('');

  const projects = [
    {
      id: 1,
      name: 'Downtown Commercial Plaza Renovation',
      location: 'Austin, TX',
      zipCode: '78701',
      distance: '2.4 mi',
      budget: '$2.4M - $3.1M',
      budgetMin: 2400000,
      budgetMax: 3100000,
      type: 'Commercial',
      posted: '2 days ago',
      deadline: 'Oct 30, 2024',
      matchScore: 94,
      isHot: true,
      tags: ['Renovation', 'Electrical', 'HVAC'],
      trade: ['Electrical', 'HVAC', 'General Construction'],
      description: 'Complete renovation of 3-story commercial plaza including new electrical systems, HVAC overhaul, and exterior facade updates. Project requires GC with experience in commercial renovations.',
      owner: 'Metro Properties LLC',
      ownerEmail: 'contact@metrop properties.com',
      ownerPhone: '(512) 555-0100',
      sqft: '45,000',
      duration: '12-18 months',
      status: 'Bidding',
      requirements: ['Commercial license', '5+ years experience', 'Bonding capacity $3M+'],
      documents: ['Project Plans.pdf', 'Specifications.pdf', 'Bid Package.zip']
    },
    {
      id: 2,
      name: 'Oak Ridge Medical Center Annex',
      location: 'Round Rock, TX',
      zipCode: '78681',
      distance: '15 mi',
      budget: '$8.5M - $10M',
      budgetMin: 8500000,
      budgetMax: 10000000,
      type: 'Healthcare',
      posted: '5 hours ago',
      deadline: 'Nov 14, 2024',
      matchScore: 88,
      isHot: false,
      tags: ['New Construction', 'Medical', 'Concrete'],
      trade: ['Concrete', 'MEP', 'Medical Gas'],
      description: 'Ground-up construction of a 12,000 sq ft medical annex. Requires specialized medical gas systems and clean room standards. Must have healthcare construction experience.',
      owner: 'Austin Healthcare Systems',
      ownerEmail: 'projects@austinhealthcare.com',
      ownerPhone: '(512) 555-0200',
      sqft: '12,000',
      duration: '18-24 months',
      status: 'Bidding',
      requirements: ['Healthcare license', 'Medical gas certification', '10+ years experience'],
      documents: ['Architectural Plans.pdf', 'MEP Drawings.pdf']
    },
    {
      id: 3,
      name: 'Skyline Heights Apartments Phase 2',
      location: 'Austin, TX',
      zipCode: '78702',
      distance: '5 mi',
      budget: '$15M+',
      budgetMin: 15000000,
      budgetMax: 20000000,
      type: 'Residential',
      posted: '1 day ago',
      deadline: 'Nov 01, 2024',
      matchScore: 76,
      isHot: true,
      tags: ['Multi-family', 'Framing', 'Plumbing'],
      trade: ['Framing', 'Plumbing', 'Drywall'],
      description: 'Phase 2 of Skyline Heights luxury apartments. 200 units. Bidding for framing, plumbing, and drywall packages. Experience with multi-family projects required.',
      owner: 'Riverside Development',
      ownerEmail: 'bids@riversidedev.com',
      ownerPhone: '(512) 555-0300',
      sqft: '180,000',
      duration: '24-30 months',
      status: 'Bidding',
      requirements: ['Multi-family experience', 'Bonding capacity $15M+'],
      documents: ['Site Plans.pdf', 'Unit Plans.pdf', 'Bid Package.zip']
    },
    {
      id: 4,
      name: 'TechPark Data Center Upgrade',
      location: 'San Marcos, TX',
      zipCode: '78666',
      distance: '32 mi',
      budget: '$4.2M',
      budgetMin: 4200000,
      budgetMax: 4200000,
      type: 'Industrial',
      posted: '3 days ago',
      deadline: 'Oct 25, 2024',
      matchScore: 65,
      isHot: false,
      tags: ['Industrial', 'Cooling', 'Security'],
      trade: ['HVAC', 'Electrical', 'Security Systems'],
      description: 'Upgrade of cooling infrastructure and security systems for Tier 3 data center. Requires specialized knowledge of data center construction and MEP systems.',
      owner: 'TechPark Infrastructure',
      ownerEmail: 'projects@techpark.com',
      ownerPhone: '(512) 555-0400',
      sqft: '25,000',
      duration: '8-12 months',
      status: 'Bidding',
      requirements: ['Data center experience', 'MEP expertise'],
      documents: ['MEP Plans.pdf', 'Security Specs.pdf']
    }
  ];

  const projectTypes = ['Commercial', 'Residential', 'Industrial', 'Healthcare', 'Education', 'Government'];
  const budgetRanges = [
    { label: '$0 - $1M', value: '0-1M', min: 0, max: 1000000 },
    { label: '$1M - $5M', value: '1M-5M', min: 1000000, max: 5000000 },
    { label: '$5M - $10M', value: '5M-10M', min: 5000000, max: 10000000 },
    { label: '$10M - $25M', value: '10M-25M', min: 10000000, max: 25000000 },
    { label: '$25M+', value: '25M+', min: 25000000, max: Infinity }
  ];
  const tradeCategories = ['Electrical', 'Plumbing', 'HVAC', 'Framing', 'Drywall', 'Concrete', 'Roofing', 'General Construction', 'MEP', 'Medical Gas'];
  const projectStatuses = ['Bidding', 'Planning', 'Pre-Construction', 'Active'];

  const handleViewDetails = (project: any) => {
    setSelectedProject(project);
    setShowDetailsModal(true);
  };

  const handleAddBid = (project: any) => {
    setSelectedProject(project);
    setShowBidModal(true);
  };

  const handleSubmitBid = () => {
    if (!bidAmount || !bidDuration || !bidProposal) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    toast({
      title: "Bid Submitted Successfully",
      description: `Your bid of $${parseFloat(bidAmount).toLocaleString()} has been submitted for ${selectedProject?.name}.`,
    });
    setShowBidModal(false);
    setBidAmount('');
    setBidDuration('');
    setBidProposal('');
  };

  return (
    <div className="flex h-full w-full flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 px-6 py-6 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Project Discovery
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Discover new construction opportunities posted by homeowners and property owners. Filter by location, project type, and budget to find projects that match your expertise.
              </p>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search projects by keyword, owner, or project name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="City, State or ZIP Code"
                  value={locationSearch}
                  onChange={(e) => setLocationSearch(e.target.value)}
                  className="pl-10 w-[200px] h-12 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
                />
              </div>
              <Button 
                className="h-12 px-6 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold"
                onClick={() => {
                  toast({
                    title: "Search Applied",
                    description: `Searching for projects matching "${searchQuery}" in ${locationSearch || selectedLocation}`,
                  });
                }}
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-4 gap-0 min-h-[calc(100vh-200px)]">
          {/* Filters Sidebar */}
          <div className="hidden xl:block col-span-1 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-200px)]">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filter Projects
              </h3>
              <div className="space-y-6">
                {/* Location Filter */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
                    Location
                  </Label>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger className="w-full border-gray-200 dark:border-gray-800">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="austin">Austin, TX (+50mi)</SelectItem>
                      <SelectItem value="dallas">Dallas, TX</SelectItem>
                      <SelectItem value="houston">Houston, TX</SelectItem>
                      <SelectItem value="sa">San Antonio, TX</SelectItem>
                      <SelectItem value="all">All Locations</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="mt-2">
                    <Input
                      placeholder="ZIP Code"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      className="w-full border-gray-200 dark:border-gray-800"
                    />
                  </div>
                </div>

                {/* Project Type */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
                    Project Type
                  </Label>
                  <div className="space-y-2">
                    {projectTypes.map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox 
                          id={type}
                          checked={selectedTypes.includes(type)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedTypes([...selectedTypes, type]);
                            } else {
                              setSelectedTypes(selectedTypes.filter(t => t !== type));
                            }
                          }}
                        />
                        <Label htmlFor={type} className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                          {type}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Budget Range */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
                    Budget Range
                  </Label>
                  <div className="space-y-2">
                    {budgetRanges.map((range) => (
                      <div key={range.value} className="flex items-center space-x-2">
                        <Checkbox 
                          id={range.value}
                          checked={selectedBudgetRange.includes(range.value)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedBudgetRange([...selectedBudgetRange, range.value]);
                            } else {
                              setSelectedBudgetRange(selectedBudgetRange.filter(b => b !== range.value));
                            }
                          }}
                        />
                        <Label htmlFor={range.value} className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                          {range.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trade Categories */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
                    Trade / Category
                  </Label>
                  <div className="space-y-2">
                    {tradeCategories.map((trade) => (
                      <div key={trade} className="flex items-center space-x-2">
                        <Checkbox 
                          id={trade}
                          checked={selectedTrade.includes(trade)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedTrade([...selectedTrade, trade]);
                            } else {
                              setSelectedTrade(selectedTrade.filter(t => t !== trade));
                            }
                          }}
                        />
                        <Label htmlFor={trade} className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                          {trade}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Project Status */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
                    Project Status
                  </Label>
                  <div className="space-y-2">
                    {projectStatuses.map((status) => (
                      <div key={status} className="flex items-center space-x-2">
                        <Checkbox 
                          id={status}
                          checked={selectedStatus.includes(status)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedStatus([...selectedStatus, status]);
                            } else {
                              setSelectedStatus(selectedStatus.filter(s => s !== status));
                            }
                          }}
                        />
                        <Label htmlFor={status} className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                          {status}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => {
                    setSelectedTypes([]);
                    setSelectedBudgetRange([]);
                    setSelectedTrade([]);
                    setSelectedStatus([]);
                    setZipCode('');
                  }}
                >
                  Clear All Filters
                </Button>
              </div>
            </div>
          </div>

          {/* Results List */}
          <div className="col-span-1 xl:col-span-3 bg-gray-50 dark:bg-gray-900 p-6">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing <span className="font-semibold text-gray-900 dark:text-white">248</span> projects near {selectedLocation === 'austin' ? 'Austin, TX' : selectedLocation}
              </p>
              <div className="flex items-center gap-2">
                <div className="flex items-center border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
                  <Button
                    variant={viewMode === 'table' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('table')}
                    className={`h-9 px-3 ${viewMode === 'table' ? 'bg-yellow-400 hover:bg-yellow-500 text-gray-900' : ''}`}
                  >
                    <ListIcon className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'card' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('card')}
                    className={`h-9 px-3 ${viewMode === 'card' ? 'bg-yellow-400 hover:bg-yellow-500 text-gray-900' : ''}`}
                  >
                    <Grid3x3 className="w-4 h-4" />
                  </Button>
                </div>
                <Select defaultValue="match">
                  <SelectTrigger className="w-[180px] border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="match">Best Match</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="budget">Highest Budget</SelectItem>
                    <SelectItem value="deadline">Deadline Soonest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Table View (Default) */}
            {viewMode === 'table' ? (
              <Card className="border-gray-200 dark:border-gray-800">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Project</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Location</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Type</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Budget</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Match</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Deadline</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                        {projects.map((project) => (
                          <tr key={project.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex flex-col">
                                <div className="flex items-center gap-2 mb-1">
                                  {project.isHot && (
                                    <Badge className="bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800 text-xs">
                                      <Zap className="w-3 h-3 mr-1" />
                                      Hot
                                    </Badge>
                                  )}
                                  <div className="text-sm font-semibold text-gray-900 dark:text-white">{project.name}</div>
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{project.owner}</div>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {project.tags.slice(0, 2).map((tag) => (
                                    <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                                  ))}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 dark:text-white">{project.location}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">{project.distance}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge className="bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                                {project.type}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-base font-bold text-gray-900 dark:text-white">{project.budget}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{project.sqft} sq ft</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">{project.matchScore}%</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 dark:text-white">{project.deadline}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">Posted {project.posted}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <Button 
                                  onClick={() => handleAddBid(project)}
                                  className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold h-8 text-xs" 
                                  size="sm"
                                >
                                  <Gavel className="w-3 h-3 mr-1" />
                                  Add Bid
                                </Button>
                                <Button 
                                  onClick={() => handleViewDetails(project)}
                                  variant="outline" 
                                  size="sm" 
                                  className="h-8 text-xs"
                                >
                                  <FileText className="w-3 h-3 mr-1" />
                                  View Details
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            ) : (
              /* Card View */
              <div className="space-y-4">
                {projects.map((project) => (
                <Card key={project.id} className="border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Project Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {project.isHot && (
                                <Badge className="bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800">
                                  <Zap className="w-3 h-3 mr-1" />
                                  Hot Opportunity
                                </Badge>
                              )}
                              <Badge className="bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                                {project.type}
                              </Badge>
                              <div className="flex items-center gap-1 text-sm text-yellow-600 dark:text-yellow-400">
                                <Star className="w-4 h-4 fill-current" />
                                <span className="font-semibold">{project.matchScore}% Match</span>
                              </div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                              {project.name}
                            </h3>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {project.location} <span className="text-gray-400">({project.distance})</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Building2 className="w-4 h-4" />
                                {project.sqft} sq ft
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {project.duration}
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                {project.owner}
                              </div>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                              {project.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {project.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                Posted {project.posted}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                Bid Deadline: {project.deadline}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Panel */}
                      <div className="lg:w-64 flex flex-col gap-4">
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Estimated Budget</div>
                          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            {project.budget}
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-600 dark:text-gray-400">Match Score</span>
                              <span className="font-semibold text-green-600 dark:text-green-400">
                                {project.matchScore}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full"
                                style={{ width: `${project.matchScore}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button 
                            onClick={() => handleAddBid(project)}
                            className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold"
                          >
                            <Gavel className="w-4 h-4 mr-2" />
                            Add Bid
                          </Button>
                          <Button 
                            onClick={() => handleViewDetails(project)}
                            variant="outline" 
                            className="w-full"
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Project Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Building2 className="w-6 h-6" />
              {selectedProject?.name}
            </DialogTitle>
            <DialogDescription>
              Complete project details and specifications
            </DialogDescription>
          </DialogHeader>
          
          {selectedProject && (
            <div className="space-y-6">
              {/* Project Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    {selectedProject.isHot && (
                      <Badge className="bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                        <Zap className="w-3 h-3 mr-1" />
                        Hot Opportunity
                      </Badge>
                    )}
                    <Badge className="bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                      {selectedProject.type}
                    </Badge>
                    <Badge variant="outline">{selectedProject.status}</Badge>
                    <div className="flex items-center gap-1 text-sm text-yellow-600 dark:text-yellow-400">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="font-semibold">{selectedProject.matchScore}% Match</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Project Overview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Budget</div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">{selectedProject.budget}</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Square Footage</div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">{selectedProject.sqft} sq ft</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Duration</div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">{selectedProject.duration}</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Deadline</div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">{selectedProject.deadline}</div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Project Description</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{selectedProject.description}</p>
              </div>

              {/* Location & Contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Location
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="text-gray-900 dark:text-white">{selectedProject.location}</div>
                    {selectedProject.zipCode && (
                      <div className="text-gray-600 dark:text-gray-400">ZIP: {selectedProject.zipCode}</div>
                    )}
                    <div className="text-gray-600 dark:text-gray-400">Distance: {selectedProject.distance}</div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Project Owner
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="text-gray-900 dark:text-white font-medium">{selectedProject.owner}</div>
                    {selectedProject.ownerEmail && (
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Mail className="w-4 h-4" />
                        {selectedProject.ownerEmail}
                      </div>
                    )}
                    {selectedProject.ownerPhone && (
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Phone className="w-4 h-4" />
                        {selectedProject.ownerPhone}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Trade Categories */}
              {selectedProject.trade && selectedProject.trade.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <HardHat className="w-5 h-5" />
                    Required Trades
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.trade.map((trade: string) => (
                      <Badge key={trade} variant="outline">{trade}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Requirements */}
              {selectedProject.requirements && selectedProject.requirements.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Requirements
                  </h3>
                  <ul className="space-y-2">
                    {selectedProject.requirements.map((req: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Documents */}
              {selectedProject.documents && selectedProject.documents.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Available Documents
                  </h3>
                  <div className="space-y-2">
                    {selectedProject.documents.map((doc: string, index: number) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tags.map((tag: string) => (
                    <Badge key={tag} variant="outline">{tag}</Badge>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                <Button 
                  onClick={() => {
                    setShowDetailsModal(false);
                    handleAddBid(selectedProject);
                  }}
                  className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold"
                >
                  <Gavel className="w-4 h-4 mr-2" />
                  Add Bid
                </Button>
                <Button variant="outline" onClick={() => setShowDetailsModal(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Bid Modal */}
      <Dialog open={showBidModal} onOpenChange={setShowBidModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Place Bid</DialogTitle>
            <DialogDescription>
              Submit your professional bid for <span className="font-semibold">{selectedProject?.name}</span>
            </DialogDescription>
          </DialogHeader>
          {selectedProject && (
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Project Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Owner:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">{selectedProject.owner}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Location:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">{selectedProject.location}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Budget Range:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">{selectedProject.budget}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Deadline:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">{selectedProject.deadline}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Bid Amount ($) *</Label>
                    <Input 
                      type="number" 
                      placeholder="0.00"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Estimated Duration (weeks) *</Label>
                    <Input 
                      type="number" 
                      placeholder="0"
                      value={bidDuration}
                      onChange={(e) => setBidDuration(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                </div>
                <div>
                  <Label>Bid Proposal & Approach *</Label>
                  <Textarea 
                    placeholder="Describe your approach, methodology, timeline..."
                    value={bidProposal}
                    onChange={(e) => setBidProposal(e.target.value)}
                    className="mt-2 min-h-[150px]"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                <Button 
                  onClick={handleSubmitBid}
                  className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold"
                >
                  <Gavel className="w-4 h-4 mr-2" />
                  Submit Bid
                </Button>
                <Button variant="outline" onClick={() => setShowBidModal(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectDiscovery;
