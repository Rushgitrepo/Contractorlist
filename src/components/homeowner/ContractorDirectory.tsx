import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Search,
  Star,
  MapPin,
  CheckCircle,
  MessageSquare,
  Heart,
  Filter,
  Users,
  Clock,
  Bot,
  Phone,
  Shield,
  Eye,
  SortAsc,
  Timer,
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  User,
  Wrench,
  Home,
  Zap,
  Paintbrush,
  Hammer,
  Settings,
  TreePine,
  Car,
  Droplets,
  Wind,
  Sun,
  Building,
  Award,
  TrendingUp,
  Activity,
  Mail,
  Calendar,
  DollarSign,
  Target,
  Briefcase,
  Send,
  UserPlus
} from 'lucide-react';

interface Contractor {
  id: number;
  name: string;
  trade: string;
  category: string;
  location: string;
  distance: string;
  rating: number;
  reviews: number;
  verified: boolean;
  premium: boolean;
  responseTime: string;
  projectsCompleted: number;
  yearsExperience: number;
  specialties: string[];
  priceRange: string;
  availability: string;
  nextAvailable: string;
  image: string;
  phone: string;
  email: string;
  licenseNumber: string;
  insuranceValid: boolean;
  bondAmount: string;
  aiScore: number;
  aiInsight: string;
  completionRate: number;
  onTimeRate: number;
  budgetAccuracy: number;
  recentProjects: string[];
  certifications: string[];
}

const ContractorDirectory = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All Contractors');
  const [expandedFolders, setExpandedFolders] = useState<string[]>(['construction', 'home-services']);
  const [savedContractors, setSavedContractors] = useState<number[]>([1, 3, 7]);
  const [sortBy, setSortBy] = useState('rating');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [selectedContractor, setSelectedContractor] = useState<Contractor | null>(null);
  const [inviteMessage, setInviteMessage] = useState('');
  const [selectedProject, setSelectedProject] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Professional folder structure for contractor categories
  const categoryStructure = [
    {
      id: 'all',
      name: 'All Contractors',
      icon: Users,
      count: 247,
      color: 'text-blue-600'
    },
    {
      id: 'construction',
      name: 'Construction & Building',
      icon: Building,
      count: 89,
      color: 'text-orange-600',
      expanded: true,
      subcategories: [
        { id: 'general-contractor', name: 'General Contractors', icon: Hammer, count: 34 },
        { id: 'framing', name: 'Framing & Structure', icon: Home, count: 18 },
        { id: 'foundation', name: 'Foundation & Concrete', icon: Building, count: 12 },
        { id: 'roofing', name: 'Roofing Specialists', icon: Home, count: 25 }
      ]
    },
    {
      id: 'home-services',
      name: 'Home Services',
      icon: Wrench,
      count: 78,
      color: 'text-green-600',
      expanded: true,
      subcategories: [
        { id: 'plumbing', name: 'Plumbing', icon: Droplets, count: 23 },
        { id: 'electrical', name: 'Electrical', icon: Zap, count: 19 },
        { id: 'hvac', name: 'HVAC & Climate', icon: Wind, count: 16 },
        { id: 'appliance', name: 'Appliance Repair', icon: Settings, count: 20 }
      ]
    },
    {
      id: 'remodeling',
      name: 'Remodeling & Design',
      icon: Paintbrush,
      count: 45,
      color: 'text-purple-600',
      subcategories: [
        { id: 'kitchen', name: 'Kitchen Remodeling', icon: Home, count: 18 },
        { id: 'bathroom', name: 'Bathroom Remodeling', icon: Droplets, count: 15 },
        { id: 'interior', name: 'Interior Design', icon: Paintbrush, count: 12 }
      ]
    },
    {
      id: 'outdoor',
      name: 'Outdoor & Landscaping',
      icon: TreePine,
      count: 35,
      color: 'text-emerald-600',
      subcategories: [
        { id: 'landscaping', name: 'Landscaping', icon: TreePine, count: 20 },
        { id: 'hardscaping', name: 'Hardscaping & Patios', icon: Home, count: 15 }
      ]
    }
  ];

  const contractors: Contractor[] = [
    {
      id: 1,
      name: 'Elite Construction Pro',
      trade: 'General Contractor',
      category: 'general-contractor',
      location: 'San Francisco, CA',
      distance: '2.3 mi',
      rating: 4.9,
      reviews: 247,
      verified: true,
      premium: true,
      responseTime: '< 1 Hour',
      projectsCompleted: 189,
      yearsExperience: 12,
      specialties: ['Kitchen Remodel', 'Bathroom Renovation', 'Home Addition'],
      priceRange: '$$$',
      availability: 'Available Now',
      nextAvailable: 'Today',
      image: '/contractor.jpg',
      phone: '+1 (555) 123-4567',
      email: 'contact@eliteconstruction.com',
      licenseNumber: 'CA-LIC-123456',
      insuranceValid: true,
      bondAmount: '$100,000',
      aiScore: 95,
      aiInsight: 'Top-rated contractor with exceptional track record in luxury renovations. Consistently delivers projects on time and under budget.',
      completionRate: 98,
      onTimeRate: 96,
      budgetAccuracy: 94,
      recentProjects: ['$85K Kitchen Remodel', '$45K Bathroom Renovation', '$120K Home Addition'],
      certifications: ['Licensed', 'Bonded', 'Insured', 'EPA Certified']
    },
    {
      id: 2,
      name: 'Summit Roofing Experts',
      trade: 'Roofing Specialist',
      category: 'roofing',
      location: 'Oakland, CA',
      distance: '8.1 mi',
      rating: 4.8,
      reviews: 156,
      verified: true,
      premium: false,
      responseTime: '< 2 Hours',
      projectsCompleted: 134,
      yearsExperience: 8,
      specialties: ['Residential Roofing', 'Commercial Roofing', 'Emergency Repairs'],
      priceRange: '$$',
      availability: 'Available This Week',
      nextAvailable: 'Tomorrow',
      image: '/contractor-2.jpg',
      phone: '+1 (555) 987-6543',
      email: 'info@summitroofing.com',
      licenseNumber: 'CA-LIC-789012',
      insuranceValid: true,
      bondAmount: '$50,000',
      aiScore: 89,
      aiInsight: 'Reliable roofing specialist with 24/7 emergency service. Known for quality workmanship and competitive pricing.',
      completionRate: 94,
      onTimeRate: 97,
      budgetAccuracy: 91,
      recentProjects: ['$18K Roof Replacement', '$5K Emergency Repair', '$25K Commercial Roof'],
      certifications: ['Licensed', 'Insured', 'GAF Certified', 'OSHA Trained']
    },
    {
      id: 3,
      name: 'Modern Electric Solutions',
      trade: 'Electrical Contractor',
      category: 'electrical',
      location: 'San Jose, CA',
      distance: '15.2 mi',
      rating: 4.7,
      reviews: 89,
      verified: true,
      premium: true,
      responseTime: '< 30 Minutes',
      projectsCompleted: 78,
      yearsExperience: 6,
      specialties: ['Smart Home Installation', 'Panel Upgrades', 'EV Charging'],
      priceRange: '$$',
      availability: 'Available Now',
      nextAvailable: 'Today',
      image: '/contractor-3.png',
      phone: '+1 (555) 456-7890',
      email: 'service@modernelectric.com',
      licenseNumber: 'CA-LIC-345678',
      insuranceValid: true,
      bondAmount: '$75,000',
      aiScore: 92,
      aiInsight: 'Leading expert in smart home technology with fastest response time in the area. Specializes in modern electrical solutions.',
      completionRate: 96,
      onTimeRate: 99,
      budgetAccuracy: 93,
      recentProjects: ['$12K Smart Home Setup', '$6K Panel Upgrade', '$3K EV Charger Install'],
      certifications: ['Licensed', 'Bonded', 'Tesla Certified', 'Nest Pro']
    },
    {
      id: 4,
      name: 'Premium Kitchen Designs',
      trade: 'Kitchen Specialist',
      category: 'kitchen',
      location: 'Palo Alto, CA',
      distance: '12.7 mi',
      rating: 4.6,
      reviews: 67,
      verified: true,
      premium: false,
      responseTime: '< 4 Hours',
      projectsCompleted: 45,
      yearsExperience: 15,
      specialties: ['Custom Cabinets', 'Luxury Kitchens', 'Design Consultation'],
      priceRange: '$$$$',
      availability: 'Booked 3 Weeks',
      nextAvailable: 'Feb 15',
      image: '/contractor.jpg',
      phone: '+1 (555) 111-2222',
      email: 'design@premiumkitchens.com',
      licenseNumber: 'CA-LIC-901234',
      insuranceValid: true,
      bondAmount: '$25,000',
      aiScore: 88,
      aiInsight: 'Premium kitchen specialist with 15 years experience. Higher cost but exceptional quality and custom design capabilities.',
      completionRate: 91,
      onTimeRate: 89,
      budgetAccuracy: 87,
      recentProjects: ['$95K Luxury Kitchen', '$65K Custom Cabinets', '$45K Kitchen Remodel'],
      certifications: ['Licensed', 'NKBA Certified', 'Insured']
    },
    {
      id: 5,
      name: 'AquaFlow Plumbing',
      trade: 'Plumbing Contractor',
      category: 'plumbing',
      location: 'Berkeley, CA',
      distance: '6.8 mi',
      rating: 4.5,
      reviews: 123,
      verified: true,
      premium: false,
      responseTime: '< 3 Hours',
      projectsCompleted: 156,
      yearsExperience: 10,
      specialties: ['Emergency Plumbing', 'Pipe Replacement', 'Water Heaters'],
      priceRange: '$$',
      availability: 'Available Now',
      nextAvailable: 'Today',
      image: '/contractor-2.jpg',
      phone: '+1 (555) 333-4444',
      email: 'service@aquaflow.com',
      licenseNumber: 'CA-LIC-567890',
      insuranceValid: true,
      bondAmount: '$30,000',
      aiScore: 85,
      aiInsight: 'Reliable plumbing service with 24/7 emergency availability. Known for fair pricing and quality workmanship.',
      completionRate: 93,
      onTimeRate: 95,
      budgetAccuracy: 92,
      recentProjects: ['$8K Pipe Replacement', '$3K Water Heater Install', '$2K Emergency Repair'],
      certifications: ['Licensed', 'Insured', 'Green Plumber Certified']
    },
    {
      id: 6,
      name: 'Climate Control HVAC',
      trade: 'HVAC Specialist',
      category: 'hvac',
      location: 'Fremont, CA',
      distance: '18.5 mi',
      rating: 4.4,
      reviews: 98,
      verified: true,
      premium: false,
      responseTime: '< 6 Hours',
      projectsCompleted: 87,
      yearsExperience: 9,
      specialties: ['AC Installation', 'Heating Systems', 'Duct Cleaning'],
      priceRange: '$$',
      availability: 'Available This Week',
      nextAvailable: 'Wednesday',
      image: '/contractor-3.png',
      phone: '+1 (555) 555-6666',
      email: 'info@climatecontrol.com',
      licenseNumber: 'CA-LIC-678901',
      insuranceValid: true,
      bondAmount: '$40,000',
      aiScore: 82,
      aiInsight: 'Experienced HVAC contractor with expertise in energy-efficient systems. Good value for residential installations.',
      completionRate: 90,
      onTimeRate: 92,
      budgetAccuracy: 89,
      recentProjects: ['$15K AC Installation', '$8K Heating System', '$4K Duct Cleaning'],
      certifications: ['Licensed', 'Insured', 'NATE Certified']
    },
    {
      id: 7,
      name: 'GreenScape Landscaping',
      trade: 'Landscaping Contractor',
      category: 'landscaping',
      location: 'Mountain View, CA',
      distance: '11.3 mi',
      rating: 4.7,
      reviews: 134,
      verified: true,
      premium: true,
      responseTime: '< 2 Hours',
      projectsCompleted: 112,
      yearsExperience: 11,
      specialties: ['Garden Design', 'Irrigation Systems', 'Sustainable Landscaping'],
      priceRange: '$$$',
      availability: 'Available Next Week',
      nextAvailable: 'Next Monday',
      image: '/contractor.jpg',
      phone: '+1 (555) 777-8888',
      email: 'design@greenscape.com',
      licenseNumber: 'CA-LIC-789012',
      insuranceValid: true,
      bondAmount: '$60,000',
      aiScore: 90,
      aiInsight: 'Award-winning landscaping contractor specializing in sustainable and drought-resistant designs. Premium service with excellent results.',
      completionRate: 95,
      onTimeRate: 94,
      budgetAccuracy: 91,
      recentProjects: ['$35K Garden Redesign', '$20K Irrigation System', '$15K Drought-Resistant Landscape'],
      certifications: ['Licensed', 'Insured', 'Sustainable Landscape Certified', 'Irrigation Association Member']
    },
    {
      id: 8,
      name: 'Artisan Bathroom Designs',
      trade: 'Bathroom Specialist',
      category: 'bathroom',
      location: 'Redwood City, CA',
      distance: '9.7 mi',
      rating: 4.8,
      reviews: 76,
      verified: true,
      premium: false,
      responseTime: '< 5 Hours',
      projectsCompleted: 63,
      yearsExperience: 13,
      specialties: ['Luxury Bathrooms', 'Tile Work', 'Accessibility Modifications'],
      priceRange: '$$$',
      availability: 'Available in 2 Weeks',
      nextAvailable: 'Feb 8',
      image: '/contractor-2.jpg',
      phone: '+1 (555) 999-0000',
      email: 'info@artisanbathrooms.com',
      licenseNumber: 'CA-LIC-890123',
      insuranceValid: true,
      bondAmount: '$35,000',
      aiScore: 87,
      aiInsight: 'Specialized bathroom contractor with expertise in luxury renovations and accessibility modifications. High-quality craftsmanship.',
      completionRate: 92,
      onTimeRate: 90,
      budgetAccuracy: 88,
      recentProjects: ['$42K Master Bath Remodel', '$28K Accessible Bathroom', '$18K Guest Bath Renovation'],
      certifications: ['Licensed', 'Insured', 'ADA Compliance Certified']
    }
  ];

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev =>
      prev.includes(folderId)
        ? prev.filter(id => id !== folderId)
        : [...prev, folderId]
    );
  };

  const toggleSaved = (contractorId: number) => {
    setSavedContractors(prev =>
      prev.includes(contractorId)
        ? prev.filter(id => id !== contractorId)
        : [...prev, contractorId]
    );
  };

  const handleInviteToBid = (contractor: Contractor) => {
    setSelectedContractor(contractor);
    setInviteDialogOpen(true);
    setInviteMessage(`Hi ${contractor.name},\n\nI'm interested in getting a bid for my project. Please review the details and let me know if you're available.\n\nLooking forward to hearing from you!`);
  };

  const handleSendInvite = () => {
    if (!selectedProject) {
      alert('Please select a project');
      return;
    }
    alert(`Invitation sent to ${selectedContractor?.name} for project: ${selectedProject}`);
    setInviteDialogOpen(false);
    setInviteMessage('');
    setSelectedProject('');
    setSelectedContractor(null);
  };

  const filteredContractors = contractors
    .filter(contractor => {
      const matchesSearch = contractor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contractor.trade.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contractor.specialties.some(specialty =>
          specialty.toLowerCase().includes(searchQuery.toLowerCase())
        );
      
      const matchesCategory = selectedCategory === 'All Contractors' || contractor.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating': return b.rating - a.rating;
        case 'distance': return parseFloat(a.distance) - parseFloat(b.distance);
        case 'price': return a.priceRange.length - b.priceRange.length;
        case 'experience': return b.yearsExperience - a.yearsExperience;
        default: return 0;
      }
    });

  const getPriceColor = (range: string) => {
    switch (range) {
      case '$': return 'text-green-600 bg-green-50 border-green-200';
      case '$$': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case '$$$': return 'text-orange-600 bg-orange-50 border-orange-200';
      case '$$$$': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getAvailabilityColor = (availability: string) => {
    if (availability.includes('Available Now')) return 'text-green-700 bg-green-100 border-green-200';
    if (availability.includes('Available')) return 'text-yellow-700 bg-yellow-100 border-yellow-200';
    return 'text-red-700 bg-red-100 border-red-200';
  };

  const getAIScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 80) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <div className="flex h-screen bg-gray-50/50 dark:bg-slate-950/50">
      {/* Professional Sidebar - Folder Structure */}
      <div className="w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-lg flex flex-col">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Contractor Directory</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Browse by category</p>
        </div>

        {/* Search in Sidebar */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
            <Input
              placeholder="Search contractors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 text-sm border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-orange-300 dark:focus:border-orange-600 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900/50"
            />
          </div>
        </div>

        {/* Category Folders */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {categoryStructure.map((category) => (
              <div key={category.id}>
                {/* Main Category */}
                <div
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedCategory === category.name || selectedCategory === category.id
                      ? 'bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 border border-orange-200 dark:border-orange-800 shadow-sm'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => {
                    if (category.subcategories) {
                      toggleFolder(category.id);
                    } else {
                      setSelectedCategory(category.name);
                    }
                  }}
                >
                  {category.subcategories ? (
                    expandedFolders.includes(category.id) ? (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    )
                  ) : (
                    <div className="w-4" />
                  )}
                  
                  {category.subcategories ? (
                    expandedFolders.includes(category.id) ? (
                      <FolderOpen className={`w-5 h-5 ${category.color}`} />
                    ) : (
                      <Folder className={`w-5 h-5 ${category.color}`} />
                    )
                  ) : (
                    <category.icon className={`w-5 h-5 ${category.color}`} />
                  )}
                  
                  <span className={`flex-1 font-medium ${
                    selectedCategory === category.name || selectedCategory === category.id
                      ? 'text-orange-700 dark:text-orange-400'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {category.name}
                  </span>
                  
                  <Badge className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-semibold">
                    {category.count}
                  </Badge>
                </div>

                {/* Subcategories */}
                {category.subcategories && expandedFolders.includes(category.id) && (
                  <div className="ml-6 mt-2 space-y-1">
                    {category.subcategories.map((subcategory) => (
                      <div
                        key={subcategory.id}
                        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all duration-200 ${
                          selectedCategory === subcategory.id
                            ? 'bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 border border-orange-200 dark:border-orange-800 shadow-sm'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                        onClick={() => setSelectedCategory(subcategory.id)}
                      >
                        <subcategory.icon className={`w-4 h-4 ${
                          selectedCategory === subcategory.id ? 'text-orange-600 dark:text-orange-400' : 'text-gray-500 dark:text-gray-400'
                        }`} />
                        <span className={`flex-1 text-sm ${
                          selectedCategory === subcategory.id ? 'text-orange-700 dark:text-orange-400 font-medium' : 'text-gray-600 dark:text-gray-400'
                        }`}>
                          {subcategory.name}
                        </span>
                        <Badge className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs">
                          {subcategory.count}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
            <Heart className="w-4 h-4 text-red-500" />
            <span>Saved Contractors: {savedContractors.length}</span>
          </div>
          <Button variant="outline" size="sm" className="w-full text-xs hover:bg-yellow-50 dark:hover:bg-yellow-900/20 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-400">
            View Saved List
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Main Header */}
        <div className="p-6 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {selectedCategory === 'All Contractors' ? 'All Contractors' : 
                 categoryStructure.find(cat => cat.id === selectedCategory)?.name ||
                 categoryStructure.flatMap(cat => cat.subcategories || []).find(sub => sub.id === selectedCategory)?.name ||
                 selectedCategory}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {filteredContractors.length} verified professionals found
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live updates</span>
              </div>
              
              <Button variant="outline" size="sm" className="gap-2" onClick={() => setSortBy(sortBy === 'rating' ? 'distance' : 'rating')}>
                <SortAsc className="w-4 h-4" />
                Sort: {sortBy === 'rating' ? 'Rating' : sortBy === 'distance' ? 'Distance' : 'Price'}
              </Button>
              
              <Button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white shadow-lg font-semibold gap-2">
                <Users className="w-4 h-4" />
                Post Project
              </Button>
            </div>
          </div>
        </div>

        {/* Contractors Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-12 w-12 rounded-lg" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                    <Skeleton className="h-20 w-full" />
                    <div className="flex gap-2">
                      <Skeleton className="h-8 flex-1" />
                      <Skeleton className="h-8 w-12" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : filteredContractors.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No contractors found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Try adjusting your search or browse different categories
              </p>
              <Button variant="outline" onClick={() => {setSearchQuery(''); setSelectedCategory('All Contractors');}} className="dark:border-gray-700 dark:text-gray-300">
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredContractors.map((contractor) => (
                <Card 
                  key={contractor.id}
                  className="hover:shadow-2xl transition-all duration-300 border-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm group hover:scale-[1.02] cursor-pointer"
                >
                  <CardContent className="p-6">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-12 h-12 rounded-xl bg-cover bg-center shadow-md ring-2 ring-white"
                          style={{ backgroundImage: `url(${contractor.image})` }}
                        />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-base text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                              {contractor.name}
                            </h3>
                            {contractor.verified && (
                              <Shield className="w-4 h-4 text-green-500" />
                            )}
                            {contractor.premium && (
                              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold">
                                PRO
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                            {contractor.trade} • {contractor.yearsExperience} years
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                            <MapPin className="w-3 h-3" />
                            <span>{contractor.distance}</span>
                            <span>•</span>
                            <Timer className="w-3 h-3" />
                            <span>{contractor.responseTime}</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`${
                          savedContractors.includes(contractor.id)
                            ? 'text-red-500 hover:bg-red-50'
                            : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSaved(contractor.id);
                        }}
                      >
                        <Heart className={`w-4 h-4 ${savedContractors.includes(contractor.id) ? 'fill-current' : ''}`} />
                      </Button>
                    </div>

                    {/* Rating & Price */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1.5 rounded-lg">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="font-bold text-sm text-gray-900">{contractor.rating}</span>
                        <span className="text-xs text-gray-600">({contractor.reviews})</span>
                      </div>
                      <Badge className={`${getPriceColor(contractor.priceRange)} font-semibold`}>
                        {contractor.priceRange}
                      </Badge>
                    </div>

                    {/* AI Score */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">AI Match Score</span>
                        <Badge className={`${getAIScoreColor(contractor.aiScore)} font-bold`}>
                          {contractor.aiScore}/100
                        </Badge>
                      </div>
                      <Progress value={contractor.aiScore} className="h-2 bg-gray-100">
                        <div 
                          className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-500"
                          style={{ width: `${contractor.aiScore}%` }}
                        />
                      </Progress>
                    </div>

                    {/* Performance Metrics */}
                    <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-center">
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{contractor.completionRate}%</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Completion</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{contractor.onTimeRate}%</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">On Time</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{contractor.projectsCompleted}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Projects</p>
                      </div>
                    </div>

                    {/* Specialties */}
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Specialties</p>
                      <div className="flex flex-wrap gap-1">
                        {contractor.specialties.slice(0, 2).map((specialty, index) => (
                          <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                            {specialty}
                          </Badge>
                        ))}
                        {contractor.specialties.length > 2 && (
                          <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                            +{contractor.specialties.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Availability */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between">
                        <Badge className={`${getAvailabilityColor(contractor.availability)} font-semibold`}>
                          {contractor.availability}
                        </Badge>
                        <span className="text-xs text-gray-600">Next: {contractor.nextAvailable}</span>
                      </div>
                    </div>

                    {/* AI Insight */}
                    <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-100 dark:border-blue-900/50">
                      <div className="flex items-center gap-2 mb-1">
                        <Bot className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                        <span className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wide">AI Insight</span>
                      </div>
                      <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
                        {contractor.aiInsight}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2">
                      <Button 
                        size="sm" 
                        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold gap-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleInviteToBid(contractor);
                        }}
                      >
                        <UserPlus className="w-4 h-4" />
                        Invite to Bid
                      </Button>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="flex-1 hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          View Profile
                        </Button>
                        <Button variant="outline" size="sm" className="gap-1 hover:bg-gray-50 dark:hover:bg-gray-800">
                          <MessageSquare className="w-3 h-3" />
                        </Button>
                        <Button variant="outline" size="sm" className="gap-1 hover:bg-gray-50 dark:hover:bg-gray-800">
                          <Phone className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Invite to Bid Dialog */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Invite to Bid</DialogTitle>
            <DialogDescription>
              Send an invitation to {selectedContractor?.name} to bid on your project
            </DialogDescription>
          </DialogHeader>

          {selectedContractor && (
            <div className="space-y-6 mt-4">
              {/* Contractor Info */}
              <Card className="bg-gradient-to-r from-accent/10 to-accent/5 border-accent/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-16 h-16 rounded-xl bg-cover bg-center shadow-md ring-2 ring-white"
                      style={{ backgroundImage: `url(${selectedContractor.image})` }}
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                        {selectedContractor.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedContractor.trade} • {selectedContractor.yearsExperience} years experience
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-semibold">{selectedContractor.rating}</span>
                        <span className="text-sm text-gray-500">({selectedContractor.reviews} reviews)</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Select Project */}
              <div className="space-y-2">
                <Label htmlFor="project" className="text-sm font-semibold">Select Project</Label>
                <select
                  id="project"
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="w-full h-11 px-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950"
                >
                  <option value="">Choose a project...</option>
                  <option value="Kitchen Renovation">Kitchen Renovation - $25,000</option>
                  <option value="Backyard ADU Construction">Backyard ADU Construction - $45,000</option>
                  <option value="Master Bathroom Remodel">Master Bathroom Remodel - $18,000</option>
                </select>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label htmlFor="message" className="text-sm font-semibold">Message (Optional)</Label>
                <Textarea
                  id="message"
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  rows={6}
                  placeholder="Add a personal message to your invitation..."
                />
              </div>

              {/* Info Box */}
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex gap-3">
                  <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-blue-900 dark:text-blue-200 mb-1">
                      What happens next?
                    </p>
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                      The contractor will receive your invitation via email and SMS. They can review your project details and submit a bid within 48 hours.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 mt-6">
            <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold gap-2"
              onClick={handleSendInvite}
            >
              <Send className="w-4 h-4" />
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContractorDirectory;
