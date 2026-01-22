import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  MessageCircle,
  Phone,
  Mail,
  FileText,
  Video,
  Clock,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Users,
  Headphones,
  ExternalLink,
  ChevronRight,
  HelpCircle,
  ArrowRight,
  PlayCircle
} from 'lucide-react';

const HelpSupport = () => {
  const quickActions = [
    {
      name: 'Live Chat',
      description: 'Get instant help from our support team',
      icon: MessageCircle,
      color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
      status: 'Online',
      statusColor: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    },
    {
      name: 'Phone Support',
      description: 'Call us for immediate assistance',
      icon: Phone,
      color: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
      contact: '1-800-CONTRACTOR',
      statusColor: 'bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
    },
    {
      name: 'Email Support',
      description: 'Send us a detailed message',
      icon: Mail,
      color: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
      contact: 'support@contractorlist.com',
      statusColor: 'bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
    }
  ];

  const helpArticles = [
    {
      title: 'How to Place a Bid on a Project',
      category: 'Bidding',
      description: 'Step-by-step guide to submitting professional bids',
      views: '1.2k',
      updated: '2 days ago'
    },
    {
      title: 'Managing Team Members and Permissions',
      category: 'Team Management',
      description: 'Learn how to invite team members and manage access',
      views: '856',
      updated: '1 week ago'
    },
    {
      title: 'Uploading and Organizing Project Documents',
      category: 'Documents',
      description: 'Best practices for document management',
      views: '642',
      updated: '3 days ago'
    },
    {
      title: 'Finding Qualified Subcontractors',
      category: 'Directory',
      description: 'Tips for searching and filtering the contractor directory',
      views: '1.5k',
      updated: '5 days ago'
    },
    {
      title: 'Understanding Project Discovery',
      category: 'Projects',
      description: 'How to find and filter homeowner projects',
      views: '923',
      updated: '1 week ago'
    },
    {
      title: 'Account Settings and Profile Management',
      category: 'Account',
      description: 'Complete guide to managing your company profile',
      views: '734',
      updated: '4 days ago'
    }
  ];

  const videoTutorials = [
    {
      title: 'Getting Started with GC Dashboard',
      duration: '5:32',
      thumbnail: '📹'
    },
    {
      title: 'Placing Your First Bid',
      duration: '8:15',
      thumbnail: '📹'
    },
    {
      title: 'Team Collaboration Features',
      duration: '6:42',
      thumbnail: '📹'
    }
  ];

  return (
    <div className="p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-full">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Help & Support
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Get help with your account, find answers to common questions, or contact our support team. We're here to help you succeed.
          </p>
        </div>

        {/* Search */}
        <Card className="border-gray-200 dark:border-gray-800">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search for help articles, tutorials, or FAQs..."
                className="pl-12 h-14 text-lg border-gray-200 dark:border-gray-800"
              />
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <Card key={index} className="border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-4`}>
                  <action.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{action.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{action.description}</p>
                {action.status && (
                  <Badge className={action.statusColor}>
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    {action.status}
                  </Badge>
                )}
                {action.contact && (
                  <Badge variant="outline" className="text-xs">
                    {action.contact}
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Popular Help Articles */}
            <Card className="border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Popular Help Articles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {helpArticles.map((article, index) => (
                  <div
                    key={index}
                    className="flex items-start justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer group"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {article.category}
                        </Badge>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {article.views} views
                        </span>
                      </div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                        {article.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {article.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="w-3 h-3" />
                        Updated {article.updated}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors" />
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-4">
                  View All Articles
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Video Tutorials */}
            <Card className="border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PlayCircle className="w-5 h-5" />
                  Video Tutorials
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {videoTutorials.map((video, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                  >
                    <div className="w-20 h-20 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-3xl">
                      {video.thumbnail}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {video.title}
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="w-4 h-4" />
                        {video.duration}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <PlayCircle className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Support */}
            <Card className="border-gray-200 dark:border-gray-800 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-900/10">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-yellow-400 dark:bg-yellow-500 flex items-center justify-center">
                    <Headphones className="w-6 h-6 text-gray-900" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">Need More Help?</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Our team is here for you</p>
                  </div>
                </div>
                <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold">
                  Contact Support
                </Button>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card className="border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="text-lg">Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  'Getting Started Guide',
                  'Billing & Payments',
                  'Account Security',
                  'API Documentation',
                  'System Status'
                ].map((link, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start text-gray-700 dark:text-gray-300 hover:text-yellow-600 dark:hover:text-yellow-400"
                  >
                    {link}
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* System Status */}
            <Card className="border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="text-lg">System Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Platform</span>
                  <Badge className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Operational
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Bid System</span>
                  <Badge className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Online
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Document Storage</span>
                  <Badge className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Online
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;
