import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Calendar,
  DollarSign,
  Clock,
  Star,
  MessageSquare,
  CheckCircle,
  Award,
  Eye,
  TrendingUp,
  Users,
  FileText,
  MapPin,
  Briefcase,
  Activity,
  Filter,
  Search,
  AlertCircle,
  ThumbsUp,
  Send
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

const BidManagement = () => {
  const [selectedProject, setSelectedProject] = useState('kitchen');
  const [selectedBid, setSelectedBid] = useState<string | null>(null);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [awardDialogOpen, setAwardDialogOpen] = useState(false);
  const [viewBidDialogOpen, setViewBidDialogOpen] = useState(false);
  const [currentBidData, setCurrentBidData] = useState<any>(null);
  const [messageText, setMessageText] = useState('');

  const postedProjects = [
    {
      id: 'kitchen',
      title: 'Kitchen Renovation',
      description: 'Complete kitchen remodel with new cabinets, countertops, and appliances',
      category: 'Renovation',
      budget: '$20,000 - $30,000',
      timeline: '2-3 months',
      location: '123 Maple Dr, Austin, TX',
      postedDate: '2024-02-01',
      status: 'Active',
      bidsCount: 8,
      viewsCount: 45,
      image: '/home1.jpeg'
    },
    {
      id: 'bathroom',
      title: 'Master Bathroom Remodel',
      description: 'Luxury bathroom renovation with walk-in shower and modern fixtures',
      category: 'Renovation',
      budget: '$15,000 - $20,000',
      timeline: '1-2 months',
      location: '123 Maple Dr, Austin, TX',
      postedDate: '2024-02-05',
      status: 'Active',
      bidsCount: 5,
      viewsCount: 32,
      image: '/home2.jpeg'
    },
    {
      id: 'deck',
      title: 'Backyard Deck Construction',
      description: 'Build a 400 sq ft composite deck with railing',
      category: 'Construction',
      budget: '$10,000 - $15,000',
      timeline: '3-4 weeks',
      location: '123 Maple Dr, Austin, TX',
      postedDate: '2024-01-28',
      status: 'Awarded',
      bidsCount: 12,
      viewsCount: 67,
      image: '/home3.jpeg'
    }
  ];

  const bidsData: Record<string, any[]> = {
    kitchen: [
      {
        id: 'bid1',
        contractor: {
          name: 'Elite Builders',
          company: 'Elite Construction LLC',
          rating: 4.9,
          reviewsCount: 127,
          completedProjects: 89,
          avatar: '/home1.jpeg'
        },
        bidAmount: 25500,
        timeline: '10 weeks',
        submittedDate: '2024-02-03',
        status: 'pending',
        proposal: 'We specialize in high-end kitchen renovations. Our team will handle everything from demolition to final touches. We use premium materials and provide a 5-year warranty on all work.',
        experience: '15+ years in kitchen renovations',
        availability: 'Can start within 2 weeks',
        warranty: '5 years',
        insurance: 'Fully insured',
        portfolio: ['Kitchen remodel in West Lake', 'Modern kitchen in Downtown', 'Luxury kitchen in Tarrytown']
      },
      {
        id: 'bid2',
        contractor: {
          name: 'Metro Builders',
          company: 'Metro Construction Inc',
          rating: 4.7,
          reviewsCount: 98,
          completedProjects: 67,
          avatar: '/home2.jpeg'
        },
        bidAmount: 23800,
        timeline: '12 weeks',
        submittedDate: '2024-02-04',
        status: 'pending',
        proposal: 'Experienced team ready to transform your kitchen. We focus on quality craftsmanship and timely delivery. Free design consultation included.',
        experience: '12+ years',
        availability: 'Can start in 3 weeks',
        warranty: '3 years',
        insurance: 'Fully insured',
        portfolio: ['Kitchen renovation in Hyde Park', 'Contemporary kitchen in South Austin']
      },
      {
        id: 'bid3',
        contractor: {
          name: 'Austin Home Pros',
          company: 'Austin Home Professionals',
          rating: 4.8,
          reviewsCount: 156,
          completedProjects: 112,
          avatar: '/home3.jpeg'
        },
        bidAmount: 27200,
        timeline: '9 weeks',
        submittedDate: '2024-02-02',
        status: 'shortlisted',
        proposal: 'Premium kitchen renovation service with personalized design. We work closely with clients to bring their vision to life.',
        experience: '18+ years',
        availability: 'Can start immediately',
        warranty: '7 years',
        insurance: 'Fully insured + Bonded',
        portfolio: ['Luxury kitchen in Westlake Hills', 'Modern farmhouse kitchen', 'Chef-grade kitchen remodel']
      }
    ],
    bathroom: [
      {
        id: 'bid4',
        contractor: {
          name: 'Luxury Bath Co',
          company: 'Luxury Bathroom Company',
          rating: 4.9,
          reviewsCount: 84,
          completedProjects: 56,
          avatar: '/home4.jpeg'
        },
        bidAmount: 17500,
        timeline: '6 weeks',
        submittedDate: '2024-02-06',
        status: 'pending',
        proposal: 'Specializing in luxury bathroom renovations. We create spa-like experiences in your home.',
        experience: '10+ years',
        availability: 'Can start in 2 weeks',
        warranty: '5 years',
        insurance: 'Fully insured'
      },
      {
        id: 'bid5',
        contractor: {
          name: 'Modern Spaces',
          company: 'Modern Spaces LLC',
          rating: 4.6,
          reviewsCount: 72,
          completedProjects: 48,
          avatar: '/home5.jpeg'
        },
        bidAmount: 16200,
        timeline: '7 weeks',
        submittedDate: '2024-02-07',
        status: 'pending',
        proposal: 'Contemporary bathroom designs with focus on functionality and aesthetics.',
        experience: '8+ years',
        availability: 'Can start in 3 weeks',
        warranty: '3 years',
        insurance: 'Fully insured'
      }
    ],
    deck: [
      {
        id: 'bid6',
        contractor: {
          name: 'Deck Masters',
          company: 'Deck Masters Austin',
          rating: 5.0,
          reviewsCount: 143,
          completedProjects: 98,
          avatar: '/home1.jpeg'
        },
        bidAmount: 12500,
        timeline: '4 weeks',
        submittedDate: '2024-01-30',
        status: 'awarded',
        proposal: 'Expert deck builders with 20 years experience. Premium composite materials with lifetime warranty.',
        experience: '20+ years',
        availability: 'Started on Feb 15',
        warranty: 'Lifetime on materials',
        insurance: 'Fully insured + Bonded'
      }
    ]
  };

  const selectedProjectData = postedProjects.find(p => p.id === selectedProject) || postedProjects[0];
  const projectBids = bidsData[selectedProject] || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-accent/20 text-accent border-accent/30';
      case 'Awarded': return 'bg-green-100 text-green-800 border-green-200';
      case 'Closed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getBidStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'shortlisted': return 'bg-accent/20 text-accent border-accent/30';
      case 'awarded': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleViewBid = (bid: any) => {
    setCurrentBidData(bid);
    setViewBidDialogOpen(true);
  };

  const handleMessage = (bid: any) => {
    setCurrentBidData(bid);
    setMessageDialogOpen(true);
  };

  const handleAward = (bid: any) => {
    setCurrentBidData(bid);
    setAwardDialogOpen(true);
  };

  const handleSendMessage = () => {
    alert(`Message sent to ${currentBidData?.contractor.name}!`);
    setMessageText('');
    setMessageDialogOpen(false);
  };

  const handleConfirmAward = () => {
    alert(`Project awarded to ${currentBidData?.contractor.name}!`);
    setAwardDialogOpen(false);
  };

  const handleShortlist = (bidId: string) => {
    alert('Bid added to shortlist!');
  };

  return (
    <div className="p-6 space-y-8 bg-gray-50/50 dark:bg-slate-950/50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Bid Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Review proposals, communicate with contractors, and award projects
          </p>
          <div className="flex items-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Activity className="w-4 h-4 text-accent" />
              <span>Real-time bids</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4 text-accent" />
              <span>Contractor profiles</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4 text-accent" />
              <span>Direct messaging</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 hover:bg-accent/10 border-accent/20 text-accent">
            <Filter className="w-4 h-4" />
            Filter Bids
          </Button>
          <Button variant="outline" className="gap-2 hover:bg-accent/10 border-accent/20 text-accent">
            <Search className="w-4 h-4" />
            Search
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-accent">Active Projects</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">2</p>
              </div>
              <div className="p-3 bg-accent/20 rounded-full">
                <Briefcase className="w-6 h-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 border-gray-200 dark:border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Total Bids</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">25</p>
              </div>
              <div className="p-3 bg-gray-200 dark:bg-gray-800 rounded-full">
                <FileText className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 border-gray-200 dark:border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Avg Bid</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">$22K</p>
              </div>
              <div className="p-3 bg-gray-200 dark:bg-gray-800 rounded-full">
                <DollarSign className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 border-gray-200 dark:border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Response Rate</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">94%</p>
              </div>
              <div className="p-3 bg-gray-200 dark:bg-gray-800 rounded-full">
                <TrendingUp className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Posted Projects List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Posted Projects</h2>
          </div>
          
          {postedProjects.map((project) => (
            <Card 
              key={project.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-xl ${
                selectedProject === project.id 
                  ? 'ring-2 ring-accent shadow-lg bg-gradient-to-r from-accent/5 to-yellow-50/30 dark:from-accent/10 dark:to-yellow-900/10' 
                  : 'hover:shadow-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm'
              }`}
              onClick={() => setSelectedProject(project.id)}
            >
              <CardContent className="p-5">
                <div className="flex gap-4 mb-4">
                  <div 
                    className="w-16 h-16 rounded-xl bg-cover bg-center flex-shrink-0 shadow-md ring-2 ring-white"
                    style={{ backgroundImage: `url(${project.image})` }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-base text-gray-900 dark:text-white truncate pr-2">
                        {project.title}
                      </h3>
                      <Badge className={`${getStatusColor(project.status)} text-xs font-semibold`}>
                        {project.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                      {project.description}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        <span>{project.bidsCount} bids</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{project.viewsCount} views</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 dark:text-gray-400">Budget</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{project.budget}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 dark:text-gray-400">Timeline</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{project.timeline}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 dark:text-gray-400">Posted</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {new Date(project.postedDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bids Details */}
        <div className="lg:col-span-8">
          <Card className="h-full shadow-xl border-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
            <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-accent/5 dark:from-gray-800 dark:to-accent/10">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-20 h-20 rounded-xl bg-cover bg-center shadow-lg ring-4 ring-white dark:ring-gray-800"
                    style={{ backgroundImage: `url(${selectedProjectData.image})` }}
                  />
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {selectedProjectData.title}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <span className="flex items-center gap-1 font-medium">
                        <MapPin className="w-4 h-4" />
                        {selectedProjectData.location}
                      </span>
                      <span>•</span>
                      <span className="font-medium">{selectedProjectData.category}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={`${getStatusColor(selectedProjectData.status)} font-semibold`}>
                        {selectedProjectData.status}
                      </Badge>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {projectBids.length} {projectBids.length === 1 ? 'bid' : 'bids'} received
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              {projectBids.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 dark:text-gray-400">No bids received yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {projectBids.map((bid) => (
                    <Card key={bid.id} className="border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          {/* Contractor Avatar */}
                          <Avatar className="w-16 h-16 ring-2 ring-white dark:ring-gray-800 shadow-md">
                            <AvatarImage src={bid.contractor.avatar} />
                            <AvatarFallback>{bid.contractor.name.charAt(0)}</AvatarFallback>
                          </Avatar>

                          <div className="flex-1">
                            {/* Contractor Info */}
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                                  {bid.contractor.name}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                  {bid.contractor.company}
                                </p>
                                <div className="flex items-center gap-4 text-sm">
                                  <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 fill-accent text-accent" />
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                      {bid.contractor.rating}
                                    </span>
                                    <span className="text-gray-500 dark:text-gray-400">
                                      ({bid.contractor.reviewsCount} reviews)
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                    <CheckCircle className="w-4 h-4" />
                                    <span>{bid.contractor.completedProjects} projects</span>
                                  </div>
                                </div>
                              </div>
                              <Badge className={`${getBidStatusColor(bid.status)} font-semibold`}>
                                {bid.status === 'pending' && 'Pending Review'}
                                {bid.status === 'shortlisted' && 'Shortlisted'}
                                {bid.status === 'awarded' && 'Awarded'}
                                {bid.status === 'rejected' && 'Rejected'}
                              </Badge>
                            </div>

                            {/* Bid Details */}
                            <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Bid Amount</p>
                                <p className="text-xl font-bold text-accent">
                                  ${bid.bidAmount.toLocaleString()}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Timeline</p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                  {bid.timeline}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Submitted</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {new Date(bid.submittedDate).toLocaleDateString()}
                                </p>
                              </div>
                            </div>

                            {/* Proposal Preview */}
                            <div className="mb-4">
                              <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                                {bid.proposal}
                              </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-3">
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-2"
                                onClick={() => handleViewBid(bid)}
                              >
                                <Eye className="w-4 h-4" />
                                View Details
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-2"
                                onClick={() => handleMessage(bid)}
                              >
                                <MessageSquare className="w-4 h-4" />
                                Message
                              </Button>
                              {bid.status === 'pending' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="gap-2 hover:bg-accent/10 border-accent/20 text-accent"
                                  onClick={() => handleShortlist(bid.id)}
                                >
                                  <ThumbsUp className="w-4 h-4" />
                                  Shortlist
                                </Button>
                              )}
                              {(bid.status === 'pending' || bid.status === 'shortlisted') && (
                                <Button
                                  size="sm"
                                  className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground ml-auto"
                                  onClick={() => handleAward(bid)}
                                >
                                  <Award className="w-4 h-4" />
                                  Award Project
                                </Button>
                              )}
                              {bid.status === 'awarded' && (
                                <Badge className="ml-auto bg-green-100 text-green-800 border-green-200 px-3 py-1">
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Project Awarded
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* View Bid Details Dialog */}
      <Dialog open={viewBidDialogOpen} onOpenChange={setViewBidDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Bid Details</DialogTitle>
            <DialogDescription>
              Complete proposal from {currentBidData?.contractor.name}
            </DialogDescription>
          </DialogHeader>

          {currentBidData && (
            <div className="space-y-6 mt-4">
              {/* Contractor Profile */}
              <Card className="bg-gradient-to-r from-gray-50 to-accent/5 dark:from-gray-900 dark:to-accent/10 border-accent/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="w-20 h-20 ring-4 ring-white dark:ring-gray-800 shadow-lg">
                      <AvatarImage src={currentBidData.contractor.avatar} />
                      <AvatarFallback>{currentBidData.contractor.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {currentBidData.contractor.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">{currentBidData.contractor.company}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-accent text-accent" />
                          <span className="font-semibold">{currentBidData.contractor.rating}</span>
                        </div>
                        <span className="text-gray-500">•</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {currentBidData.contractor.reviewsCount} reviews
                        </span>
                        <span className="text-gray-500">•</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {currentBidData.contractor.completedProjects} completed projects
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Bid Summary */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Bid Amount</p>
                    <p className="text-2xl font-bold text-accent">
                      ${currentBidData.bidAmount.toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Timeline</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {currentBidData.timeline}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Proposal */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Proposal</h4>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {currentBidData.proposal}
                </p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Experience</h4>
                  <p className="text-gray-700 dark:text-gray-300">{currentBidData.experience}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Availability</h4>
                  <p className="text-gray-700 dark:text-gray-300">{currentBidData.availability}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Warranty</h4>
                  <p className="text-gray-700 dark:text-gray-300">{currentBidData.warranty}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Insurance</h4>
                  <p className="text-gray-700 dark:text-gray-300">{currentBidData.insurance}</p>
                </div>
              </div>

              {/* Portfolio */}
              {currentBidData.portfolio && (
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Portfolio</h4>
                  <div className="space-y-2">
                    {currentBidData.portfolio.map((item: string, index: number) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <CheckCircle className="w-4 h-4 text-accent" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="gap-2 mt-6">
            <Button variant="outline" onClick={() => setViewBidDialogOpen(false)}>
              Close
            </Button>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => {
                setViewBidDialogOpen(false);
                handleMessage(currentBidData);
              }}
            >
              <MessageSquare className="w-4 h-4" />
              Message
            </Button>
            {currentBidData?.status !== 'awarded' && (
              <Button
                className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground"
                onClick={() => {
                  setViewBidDialogOpen(false);
                  handleAward(currentBidData);
                }}
              >
                <Award className="w-4 h-4" />
                Award Project
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Message Dialog */}
      <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Send Message</DialogTitle>
            <DialogDescription>
              Send a message to {currentBidData?.contractor.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <Avatar className="w-12 h-12">
                <AvatarImage src={currentBidData?.contractor.avatar} />
                <AvatarFallback>{currentBidData?.contractor.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {currentBidData?.contractor.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {currentBidData?.contractor.company}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Type your message here..."
                rows={6}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 mt-6">
            <Button variant="outline" onClick={() => setMessageDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground"
              onClick={handleSendMessage}
              disabled={!messageText.trim()}
            >
              <Send className="w-4 h-4" />
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Award Project Dialog */}
      <Dialog open={awardDialogOpen} onOpenChange={setAwardDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Award Project</DialogTitle>
            <DialogDescription>
              Confirm awarding this project to {currentBidData?.contractor.name}
            </DialogDescription>
          </DialogHeader>

          {currentBidData && (
            <div className="space-y-4 mt-4">
              <Card className="bg-gradient-to-r from-accent/10 to-accent/5 border-accent/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="w-16 h-16 ring-2 ring-white dark:ring-gray-800">
                      <AvatarImage src={currentBidData.contractor.avatar} />
                      <AvatarFallback>{currentBidData.contractor.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold text-lg text-gray-900 dark:text-white">
                        {currentBidData.contractor.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {currentBidData.contractor.company}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-4 h-4 fill-accent text-accent" />
                        <span className="text-sm font-semibold">{currentBidData.contractor.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Bid Amount</p>
                      <p className="text-lg font-bold text-accent">
                        ${currentBidData.bidAmount.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Timeline</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {currentBidData.timeline}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-yellow-900 dark:text-yellow-200 mb-1">
                      Important
                    </p>
                    <p className="text-sm text-yellow-800 dark:text-yellow-300">
                      Once you award this project, the contractor will be notified and other bids will be automatically declined. This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 mt-6">
            <Button variant="outline" onClick={() => setAwardDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground"
              onClick={handleConfirmAward}
            >
              <Award className="w-4 h-4" />
              Confirm Award
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BidManagement;
