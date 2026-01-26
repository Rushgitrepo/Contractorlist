import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  DollarSign,
  Building,
  Users,
  Clock,
  Star,
  ArrowRight
} from 'lucide-react';

const ProjectLeads = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const leads = [
    {
      id: 1,
      title: 'Medical Center HVAC System',
      location: 'Austin, TX',
      budget: '$250,000 - $300,000',
      deadline: '2024-02-15',
      company: 'Austin Medical Group',
      status: 'Active',
      priority: 'High',
      description: 'Complete HVAC system installation for new medical facility',
      requirements: ['Licensed HVAC contractor', 'Medical facility experience', 'Emergency service capability']
    },
    {
      id: 2,
      title: 'Office Building Renovation',
      location: 'Dallas, TX',
      budget: '$150,000 - $200,000',
      deadline: '2024-03-01',
      company: 'Corporate Properties LLC',
      status: 'Active',
      priority: 'Medium',
      description: 'HVAC system upgrade for 50,000 sq ft office building',
      requirements: ['Commercial HVAC experience', 'Energy efficiency certification', 'Project management']
    },
    {
      id: 3,
      title: 'School District HVAC Maintenance',
      location: 'Houston, TX',
      budget: '$75,000 - $100,000',
      deadline: '2024-02-28',
      company: 'Houston ISD',
      status: 'New',
      priority: 'Medium',
      description: 'Annual maintenance contract for 12 school buildings',
      requirements: ['Public sector experience', 'Background checks', 'Preventive maintenance program']
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      case 'Medium': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'Low': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      default: return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'New': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case 'Closed': return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300';
      default: return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 pb-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight mb-2">Project Leads</h1>
            <p className="text-text-secondary-light dark:text-text-secondary-dark">
              Discover new project opportunities and connect with potential clients
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button className="bg-primary hover:bg-yellow-400 text-black">
              View All Leads
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search project leads..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Location</Button>
                <Button variant="outline" size="sm">Budget Range</Button>
                <Button variant="outline" size="sm">Industry</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Project Leads Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {leads.map((lead) => (
            <Card key={lead.id} className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{lead.title}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-text-secondary-light dark:text-text-secondary-dark mb-3">
                      <div className="flex items-center gap-1">
                        <Building className="w-4 h-4" />
                        {lead.company}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {lead.location}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Badge className={getPriorityColor(lead.priority)}>
                      {lead.priority}
                    </Badge>
                    <Badge className={getStatusColor(lead.status)}>
                      {lead.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-text-secondary-light dark:text-text-secondary-dark">
                  {lead.description}
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium">{lead.budget}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">{lead.deadline}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Requirements:</h4>
                  <div className="flex flex-wrap gap-2">
                    {lead.requirements.map((req, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {req}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button className="flex-1 bg-primary hover:bg-yellow-400 text-black">
                    View Details
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Save Lead
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <Button variant="outline" size="lg">
            Load More Leads
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectLeads;