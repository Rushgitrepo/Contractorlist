import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  Star,
  MessageSquare,
  Download,
  UserPlus,
  TrendingUp,
  DollarSign,
  Calendar,
  FileText,
  Eye,
  MoreVertical,
  Bot,
  Filter,
  Search,
  ArrowUpDown,
  Phone,
  Mail,
  MapPin,
  Shield,
  Award,
  Zap,
  Activity,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Timer,
  Target,
  Users
} from 'lucide-react';

const BidManagement = () => {
  const [selectedBid, setSelectedBid] = useState('elite-renovations');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');
  const [sortBy, setSortBy] = useState('cost');

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const bids = [
    {
      id: 'elite-renovations',
      contractor: 'Elite Renovations Pro',
      rating: 4.9,
      reviews: 156,
      cost: 18500,
      timeline: '2 Weeks',
      status: 'active',
      verified: true,
      premium: true,
      changeVsAvg: -8,
      changeType: 'positive',
      submittedDate: '2024-01-10',
      responseTime: '< 2 hours',
      completionRate: 98,
      location: 'San Francisco, CA',
      distance: '2.3 mi',
      yearsExperience: 12,
      projectsCompleted: 189,
      specialties: ['Kitchen Remodel', 'Luxury Finishes', 'Custom Cabinets'],
      image: '/contractor.jpg',
      phone: '+1 (555) 123-4567',
      email: 'contact@eliterenovations.com',
      licenseNumber: 'CA-LIC-123456',
      insuranceValid: true,
      bondAmount: '$50,000',
      aiScore: 95,
      aiInsight: 'Highly recommended based on similar projects in your area. Excellent track record with kitchen renovations.',
      proposal: {
        materials: 12500,
        labor: 6000,
        permits: 500,
        cleanup: 500,
        warranty: '5 years',
        startDate: '2024-02-01',
        completionDate: '2024-02-15'
      }
    },
    {
      id: 'buildright',
      contractor: 'BuildRight Construction',
      rating: 4.7,
      reviews: 89,
      cost: 15000,
      timeline: '3 Weeks',
      status: 'active',
      verified: true,
      premium: false,
      changeVsAvg: -15,
      changeType: 'positive',
      submittedDate: '2024-01-08',
      responseTime: '< 4 hours',
      completionRate: 94,
      location: 'Oakland, CA',
      distance: '8.1 mi',
      yearsExperience: 8,
      projectsCompleted: 134,
      specialties: ['General Construction', 'Budget-Friendly', 'Residential'],
      image: '/contractor-2.jpg',
      phone: '+1 (555) 987-6543',
      email: 'info@buildright.com',
      licenseNumber: 'CA-LIC-789012',
      insuranceValid: true,
      bondAmount: '$25,000',
      aiScore: 87,
      aiInsight: 'Good value option with solid reputation. Slightly longer timeline but competitive pricing.',
      proposal: {
        materials: 9500,
        labor: 5000,
        permits: 300,
        cleanup: 200,
        warranty: '3 years',
        startDate: '2024-02-05',
        completionDate: '2024-02-26'
      }
    },
    {
      id: 'premium-kitchens',
      contractor: 'Premium Kitchen Designs',
      rating: 4.8,
      reviews: 67,
      cost: 22000,
      timeline: '4 Weeks',
      status: 'reviewing',
      verified: true,
      premium: true,
      changeVsAvg: 12,
      changeType: 'negative',
      submittedDate: '2024-01-12',
      responseTime: '< 1 hour',
      completionRate: 96,
      location: 'Palo Alto, CA',
      distance: '15.2 mi',
      yearsExperience: 15,
      projectsCompleted: 78,
      specialties: ['Luxury Kitchens', 'Custom Design', 'High-End Materials'],
      image: '/contractor-3.png',
      phone: '+1 (555) 456-7890',
      email: 'design@premiumkitchens.com',
      licenseNumber: 'CA-LIC-345678',
      insuranceValid: true,
      bondAmount: '$100,000',
      aiScore: 92,
      aiInsight: 'Premium option with exceptional design capabilities. Higher cost but includes luxury finishes.',
      proposal: {
        materials: 16000,
        labor: 5500,
        permits: 300,
        cleanup: 200,
        warranty: '7 years',
        startDate: '2024-02-15',
        completionDate: '2024-03-15'
      }
    },
    {
      id: 'budget-builders',
      contractor: 'Budget Builders Inc',
      rating: 4.2,
      reviews: 34,
      cost: 12500,
      timeline: '5 Weeks',
      status: 'rejected',
      verified: false,
      premium: false,
      changeVsAvg: -25,
      changeType: 'positive',
      submittedDate: '2024-01-05',
      responseTime: '1 day',
      completionRate: 89,
      location: 'San Jose, CA',
      distance: '25.7 mi',
      yearsExperience: 5,
      projectsCompleted: 45,
      specialties: ['Budget Projects', 'Basic Renovations'],
      image: '/contractor.jpg',
      phone: '+1 (555) 111-2222',
      email: 'info@budgetbuilders.com',
      licenseNumber: 'Pending',
      insuranceValid: false,
      bondAmount: 'None',
      aiScore: 72,
      aiInsight: 'Lowest cost option but lacks proper licensing and insurance. Not recommended.',
      proposal: {
        materials: 8000,
        labor: 4000,
        permits: 200,
        cleanup: 300,
        warranty: '1 year',
        startDate: '2024-02-20',
        completionDate: '2024-03-27'
      }
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'reviewing': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'accepted': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Activity className="w-3 h-3" />;
      case 'reviewing': return <Clock className="w-3 h-3" />;
      case 'accepted': return <CheckCircle className="w-3 h-3" />;
      case 'rejected': return <AlertTriangle className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  const getAIScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 80) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const filteredBids = bids
    .filter(bid => {
      switch (activeTab) {
        case 'active': return bid.status === 'active';
        case 'reviewing': return bid.status === 'reviewing';
        case 'accepted': return bid.status === 'accepted';
        case 'rejected': return bid.status === 'rejected';
        default: return true;
      }
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'cost': return a.cost - b.cost;
        case 'rating': return b.rating - a.rating;
        case 'timeline': return parseInt(a.timeline) - parseInt(b.timeline);
        default: return 0;
      }
    });

  const selectedBidData = bids.find(b => b.id === selectedBid) || bids[0];
  const avgCost = bids.reduce((sum, bid) => sum + bid.cost, 0) / bids.length;

  return (
    <div className="p-6 space-y-8 bg-gray-50/50 dark:bg-slate-950/50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span>Projects</span>
            <span>/</span>
            <span>Kitchen Remodel</span>
            <span>/</span>
            <span className="text-orange-600 dark:text-orange-400 font-medium">Bid Management</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Bid Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Review and compare contractor proposals for your kitchen renovation
          </p>
          <div className="flex items-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Activity className="w-4 h-4 text-green-500" />
              <span>Real-time updates</span>
            </div>
            <div className="flex items-center gap-1">
              <Bot className="w-4 h-4 text-blue-500" />
              <span>AI-powered insights</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4 text-purple-500" />
              <span>Smart comparison</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 hover:bg-yellow-50 border-orange-200 text-orange-700">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
          <Button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white shadow-lg font-semibold gap-2">
            <UserPlus className="w-4 h-4" />
            Invite More Contractors
          </Button>
        </div>
      </div>

      {/* AI Market Insight */}
      <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 border-orange-200 dark:border-orange-800 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl shadow-md">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-orange-900 dark:text-orange-300 mb-2">
                AI Market Analysis
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-orange-100 dark:border-orange-900/50">
                  <p className="text-sm text-orange-700 dark:text-orange-400 font-medium">Market Average</p>
                  <p className="text-xl font-bold text-orange-900 dark:text-orange-300">${(avgCost / 1000).toFixed(1)}K</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-orange-100 dark:border-orange-900/50">
                  <p className="text-sm text-orange-700 dark:text-orange-400 font-medium">Best Value</p>
                  <p className="text-xl font-bold text-orange-900 dark:text-orange-300">Elite Renovations</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-orange-100 dark:border-orange-900/50">
                  <p className="text-sm text-orange-700 dark:text-orange-400 font-medium">Savings Potential</p>
                  <p className="text-xl font-bold text-green-600 dark:text-green-400">$3,500</p>
                </div>
              </div>
              <p className="text-sm text-orange-800 dark:text-orange-300 leading-relaxed">
                Based on 247 similar kitchen projects in San Francisco, your bids are competitive. 
                <span className="font-semibold"> Elite Renovations</span> offers the best balance of quality and value, 
                while <span className="font-semibold">BuildRight</span> provides significant cost savings with good quality.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">Total Bids</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">{bids.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-green-700 dark:text-green-400">Active</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-300">{bids.filter(b => b.status === 'active').length}</p>
              </div>
              <Activity className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-orange-700 dark:text-orange-400">Avg Cost</p>
                <p className="text-2xl font-bold text-orange-900 dark:text-orange-300">${(avgCost / 1000).toFixed(0)}K</p>
              </div>
              <DollarSign className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-purple-700 dark:text-purple-400">Avg Rating</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-300">4.7★</p>
              </div>
              <Star className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <TabsList className="grid w-full sm:w-auto grid-cols-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <TabsTrigger value="active" className="font-semibold">
              Active ({bids.filter(b => b.status === 'active').length})
            </TabsTrigger>
            <TabsTrigger value="reviewing" className="font-semibold">
              Review ({bids.filter(b => b.status === 'reviewing').length})
            </TabsTrigger>
            <TabsTrigger value="accepted" className="font-semibold">
              Accepted ({bids.filter(b => b.status === 'accepted').length})
            </TabsTrigger>
            <TabsTrigger value="rejected" className="font-semibold">
              Rejected ({bids.filter(b => b.status === 'rejected').length})
            </TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2" onClick={() => setSortBy(sortBy === 'cost' ? 'rating' : 'cost')}>
              <ArrowUpDown className="w-4 h-4" />
              Sort by {sortBy === 'cost' ? 'Rating' : 'Cost'}
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>
        </div>

        <TabsContent value={activeTab} className="space-y-6">
          {/* Bids Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
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
              ))
            ) : (
              filteredBids.map((bid) => (
                <Card 
                  key={bid.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-2xl border-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm group hover:scale-[1.02] ${
                    selectedBid === bid.id ? 'ring-2 ring-orange-400 shadow-xl bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20' : ''
                  }`}
                  onClick={() => setSelectedBid(bid.id)}
                >
                  <CardContent className="p-6">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-12 h-12 rounded-xl bg-cover bg-center shadow-md ring-2 ring-white"
                          style={{ backgroundImage: `url(${bid.image})` }}
                        />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-base text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                              {bid.contractor}
                            </h3>
                            {bid.verified && (
                              <Shield className="w-4 h-4 text-green-500" />
                            )}
                            {bid.premium && (
                              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold">
                                PRO
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              <span className="font-semibold">{bid.rating}</span>
                              <span>({bid.reviews})</span>
                            </div>
                            <span>•</span>
                            <span>{bid.distance}</span>
                          </div>
                        </div>
                      </div>
                      <Badge className={`${getStatusColor(bid.status)} font-semibold`}>
                        {getStatusIcon(bid.status)}
                        <span className="ml-1 capitalize">{bid.status}</span>
                      </Badge>
                    </div>

                    {/* AI Score */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">AI Recommendation Score</span>
                        <Badge className={`${getAIScoreColor(bid.aiScore)} font-bold`}>
                          {bid.aiScore}/100
                        </Badge>
                      </div>
                      <Progress value={bid.aiScore} className="h-2 bg-gray-100">
                        <div 
                          className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-500"
                          style={{ width: `${bid.aiScore}%` }}
                        />
                      </Progress>
                    </div>

                    {/* Cost & Timeline */}
                    <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Total Cost</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">${(bid.cost / 1000).toFixed(1)}K</p>
                        <p className={`text-xs font-semibold ${
                          bid.changeType === 'positive' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        }`}>
                          {bid.changeVsAvg > 0 ? '+' : ''}{bid.changeVsAvg}% vs avg
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Timeline</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">{bid.timeline}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {bid.responseTime} response
                        </p>
                      </div>
                    </div>

                    {/* Specialties */}
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Specialties</p>
                      <div className="flex flex-wrap gap-1">
                        {bid.specialties.slice(0, 2).map((specialty, index) => (
                          <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                            {specialty}
                          </Badge>
                        ))}
                        {bid.specialties.length > 2 && (
                          <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                            +{bid.specialties.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* AI Insight */}
                    <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-100 dark:border-blue-900/50">
                      <div className="flex items-center gap-2 mb-1">
                        <Bot className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                        <span className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wide">AI Insight</span>
                      </div>
                      <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
                        {bid.aiInsight}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold"
                      >
                        {bid.status === 'active' ? 'Review Bid' : 'View Details'}
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1 hover:bg-yellow-50">
                        <MessageSquare className="w-3 h-3" />
                        Chat
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1 hover:bg-yellow-50">
                        <Phone className="w-3 h-3" />
                        Call
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Detailed Comparison */}
          {filteredBids.length > 0 && (
            <Card className="shadow-xl border-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-yellow-50/30 dark:from-gray-800 dark:to-yellow-900/10 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                    Detailed Analysis: {selectedBidData.contractor}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Eye className="w-4 h-4" />
                      Compare All
                    </Button>
                    <Button size="sm" className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Accept Bid
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Contractor Info */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-base font-bold text-gray-900 dark:text-white mb-4">Contractor Details</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{selectedBidData.location}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{selectedBidData.phone}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Mail className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{selectedBidData.email}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Shield className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">License: {selectedBidData.licenseNumber}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Award className="w-4 h-4 text-blue-500" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{selectedBidData.yearsExperience} years experience</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-gray-900 dark:text-white mb-4">Performance Metrics</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Completion Rate</span>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">{selectedBidData.completionRate}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Projects Completed</span>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">{selectedBidData.projectsCompleted}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Response Time</span>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">{selectedBidData.responseTime}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Bond Amount</span>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">{selectedBidData.bondAmount}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cost Breakdown */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-base font-bold text-gray-900 dark:text-white mb-4">Cost Breakdown</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <span className="text-sm text-gray-700 dark:text-gray-300">Materials</span>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">${selectedBidData.proposal.materials.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <span className="text-sm text-gray-700 dark:text-gray-300">Labor</span>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">${selectedBidData.proposal.labor.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <span className="text-sm text-gray-700 dark:text-gray-300">Permits</span>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">${selectedBidData.proposal.permits.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <span className="text-sm text-gray-700 dark:text-gray-300">Cleanup</span>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">${selectedBidData.proposal.cleanup.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                          <span className="text-sm font-bold text-orange-800 dark:text-orange-300">Total</span>
                          <span className="text-lg font-bold text-orange-900 dark:text-orange-300">${selectedBidData.cost.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-gray-900 dark:text-white mb-4">Timeline</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Start Date</span>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {new Date(selectedBidData.proposal.startDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Completion Date</span>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {new Date(selectedBidData.proposal.completionDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Duration</span>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">{selectedBidData.timeline}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Warranty</span>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">{selectedBidData.proposal.warranty}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-base font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h4>
                      <div className="space-y-3">
                        <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold gap-2">
                          <ThumbsUp className="w-4 h-4" />
                          Accept This Bid
                        </Button>
                        <Button variant="outline" className="w-full gap-2 hover:bg-yellow-50 dark:hover:bg-yellow-900/20">
                          <MessageSquare className="w-4 h-4" />
                          Message Contractor
                        </Button>
                        <Button variant="outline" className="w-full gap-2 hover:bg-yellow-50 dark:hover:bg-yellow-900/20">
                          <Phone className="w-4 h-4" />
                          Schedule Call
                        </Button>
                        <Button variant="outline" className="w-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800 gap-2">
                          <ThumbsDown className="w-4 h-4" />
                          Decline Bid
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm font-bold text-blue-800 dark:text-blue-300">Smart Recommendation</span>
                      </div>
                      <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed mb-3">
                        This contractor has completed 12 similar kitchen projects in your area with an average rating of 4.9/5.
                      </p>
                      <Button size="sm" variant="outline" className="w-full text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                        View Similar Projects
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BidManagement;