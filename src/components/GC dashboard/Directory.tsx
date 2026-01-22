import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Search,
  MapPin,
  Star,
  Filter,
  Phone,
  Mail,
  Building2,
  ShieldCheck,
  Trophy,
  CheckCircle2,
  Clock,
  Users,
  FileText
} from 'lucide-react';

const Directory = () => {
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState('austin');

  const contractors = [
    {
      id: 1,
      name: 'VoltMaster Electrical Services',
      location: 'Austin, TX',
      distance: '1.2 mi',
      rating: 4.9,
      reviews: 128,
      verified: true,
      tier: 'Gold',
      specialties: ['Electrical', 'Fire Alarm', 'Lighting'],
      status: 'Available',
      projects: 45,
      avatar: 'VM',
      phone: '(512) 555-0123',
      email: 'info@voltmaster.com',
      yearsExperience: 15,
      bonded: true,
      insured: true
    },
    {
      id: 2,
      name: 'Apex Wiring & Power',
      location: 'San Antonio, TX',
      distance: '45 mi',
      rating: 4.5,
      reviews: 42,
      verified: true,
      tier: 'Silver',
      specialties: ['Electrical', 'Low Voltage'],
      status: 'Busy',
      projects: 12,
      avatar: 'AW',
      phone: '(210) 555-0145',
      email: 'contact@apexwiring.com',
      yearsExperience: 8,
      bonded: true,
      insured: true
    },
    {
      id: 3,
      name: 'Bright Future Solar',
      location: 'Austin, TX',
      distance: '8 mi',
      rating: 4.8,
      reviews: 8,
      verified: true,
      tier: 'Bronze',
      specialties: ['Solar', 'Green Energy'],
      status: 'Available',
      projects: 5,
      avatar: 'BF',
      phone: '(512) 555-0167',
      email: 'hello@brightfuture.com',
      yearsExperience: 5,
      bonded: true,
      insured: true
    },
    {
      id: 4,
      name: 'Titan Concrete Pros',
      location: 'Dallas, TX',
      distance: '120 mi',
      rating: 4.7,
      reviews: 215,
      verified: true,
      tier: 'Platinum',
      specialties: ['Concrete', 'Foundation'],
      status: 'Available',
      projects: 89,
      avatar: 'TC',
      phone: '(214) 555-0189',
      email: 'info@titanconcrete.com',
      yearsExperience: 25,
      bonded: true,
      insured: true
    }
  ];

  const categories = ['Electrical', 'Plumbing', 'HVAC', 'Concrete', 'Masonry', 'Drywall', 'Roofing', 'Painting', 'Flooring'];

  return (
    <div className="flex h-full w-full flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 px-6 py-6 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Sub Contractor Directory
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Find qualified subcontractors for your projects. Search by trade, location, and category. All contractors are verified and insured.
              </p>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search by trade, company name, or CSI code..."
                  className="pl-10 h-12 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950"
                />
              </div>
              <div className="w-full md:w-[250px] relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Location"
                  defaultValue="Austin, TX"
                  className="pl-10 h-12 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950"
                />
              </div>
              <Select defaultValue="best">
                <SelectTrigger className="w-full md:w-[180px] h-12 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="best">Best Match</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="distance">Nearest First</SelectItem>
                  <SelectItem value="projects">Most Projects</SelectItem>
                </SelectContent>
              </Select>
              <Button className="h-12 px-6 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold">
                Find Pros
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="hidden lg:block space-y-6">
            <Card className="border-gray-200 dark:border-gray-800">
              <CardContent className="p-6">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                  <Filter className="h-4 w-4" />
                  Filter Results
                </h3>

                <div className="space-y-6">
                  <div>
                    <Label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3 block">
                      Category / Trade
                    </Label>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox 
                            id={category}
                            checked={selectedCategory.includes(category)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedCategory([...selectedCategory, category]);
                              } else {
                                setSelectedCategory(selectedCategory.filter(c => c !== category));
                              }
                            }}
                          />
                          <Label htmlFor={category} className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                            {category}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                    <Label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3 block">
                      Availability Status
                    </Label>
                    <div className="space-y-2">
                      {['Available Now', 'Accepting Bids', 'Busy'].map((status) => (
                        <div key={status} className="flex items-center space-x-2">
                          <Checkbox id={status} />
                          <Label htmlFor={status} className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                            {status}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                    <Label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3 block">
                      Membership Tier
                    </Label>
                    <div className="space-y-2">
                      {['Platinum', 'Gold', 'Silver', 'Verified'].map((tier) => (
                        <div key={tier} className="flex items-center space-x-2">
                          <Checkbox id={tier} />
                          <Label htmlFor={tier} className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                            {tier}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full mt-6">
                  Reset Filters
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results List */}
          <div className="lg:col-span-3 space-y-4">
            {contractors.map((contractor) => (
              <Card key={contractor.id} className="border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Avatar Section */}
                    <div className="shrink-0 relative">
                      <div className="h-20 w-20 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-2xl font-bold text-gray-900 dark:text-white border-2 border-yellow-200 dark:border-yellow-800">
                        {contractor.avatar}
                      </div>
                      {contractor.verified && (
                        <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-950 rounded-full p-1 border-2 border-gray-200 dark:border-gray-800">
                          <ShieldCheck className="h-5 w-5 text-blue-500" />
                        </div>
                      )}
                    </div>

                    {/* Main Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold text-xl text-gray-900 dark:text-white">
                              {contractor.name}
                            </h3>
                            {contractor.tier === 'Platinum' && (
                              <Badge className="bg-gray-900 text-white border-0 text-xs">
                                <Trophy className="w-3 h-3 mr-1" />
                                Platinum
                              </Badge>
                            )}
                            {contractor.tier === 'Gold' && (
                              <Badge className="bg-yellow-100 text-yellow-800 border-0 text-xs">
                                Gold
                              </Badge>
                            )}
                            {contractor.tier === 'Silver' && (
                              <Badge className="bg-gray-100 text-gray-800 border-0 text-xs">
                                Silver
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-1 mb-2">
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                            <span className="font-bold text-gray-900 dark:text-white">{contractor.rating}</span>
                            <span className="text-gray-500 dark:text-gray-400 text-sm">({contractor.reviews} reviews)</span>
                          </div>
                        </div>
                        <Badge className={`${
                          contractor.status === 'Available' 
                            ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                          {contractor.status}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-4 w-4" />
                          {contractor.location} <span className="text-gray-400">({contractor.distance})</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Building2 className="h-4 w-4" />
                          {contractor.projects} Completed Projects
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          {contractor.yearsExperience} Years Experience
                        </div>
                        {contractor.bonded && (
                          <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            Bonded & Insured
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {contractor.specialties.map((specialty) => (
                          <Badge key={specialty} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                        <Button variant="outline" size="sm">
                          <Phone className="w-4 h-4 mr-2" />
                          {contractor.phone}
                        </Button>
                        <Button variant="outline" size="sm">
                          <Mail className="w-4 h-4 mr-2" />
                          Email
                        </Button>
                        <Button className="ml-auto bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold">
                          <Users className="w-4 h-4 mr-2" />
                          Invite to Bid
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Directory;
