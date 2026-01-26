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
  BookOpen,
  Headphones,
  ChevronRight,
  ArrowRight,
  PlayCircle
} from 'lucide-react';

const HelpSupport = () => {
  const quickActions = [
    {
      name: 'Live Chat',
      description: 'Get instant help from our support team',
      icon: MessageCircle,
      color: 'bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400',
      status: 'Online',
      statusColor: 'bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/20'
    },
    {
      name: 'Phone Support',
      description: 'Call us for immediate assistance',
      icon: Phone,
      color: 'bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400',
      contact: '1-800-CONTRACTOR',
      statusColor: 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-300 border-gray-200 dark:border-white/10'
    },
    {
      name: 'Email Support',
      description: 'Send us a detailed message',
      icon: Mail,
      color: 'bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400',
      contact: 'support@contractorlist.com',
      statusColor: 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-300 border-gray-200 dark:border-white/10'
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
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 dark:bg-[#0f1115] min-h-screen text-gray-900 dark:text-white font-sans relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-6 relative z-10">
        {/* Background Ambience */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[20%] right-[30%] w-[40%] h-[40%] rounded-full bg-yellow-400/5 dark:bg-yellow-600/5 blur-[120px]" />
        </div>

        {/* Header */}
        <div className="space-y-1.5">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
            Help & Support
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Get help with your account, find answers to common questions, or contact our support team. We're here to help you succeed.
          </p>
        </div>

        {/* Search */}
        <Card className="border-gray-200 dark:border-white/5 bg-white dark:bg-[#1c1e24] shadow-sm">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search for help articles, tutorials, or FAQs..."
                className="pl-12 h-14 text-lg border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 text-gray-900 dark:text-white focus:border-yellow-500/50 rounded-xl"
              />
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <Card key={index} className="border-gray-200 dark:border-white/5 bg-white dark:bg-[#1c1e24] hover:shadow-lg hover:border-yellow-400 dark:hover:border-yellow-500/20 transition-all duration-300 cursor-pointer group">
              <CardContent className="p-5">
                <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300`}>
                  <action.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">{action.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{action.description}</p>
                {action.status && (
                  <Badge className={action.statusColor}>
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 shadow-[0_0_5px_rgba(34,197,94,0.5)] animate-pulse"></div>
                    {action.status}
                  </Badge>
                )}
                {action.contact && (
                  <Badge variant="outline" className="text-xs border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400">
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
            <Card className="border-gray-200 dark:border-white/5 bg-white dark:bg-[#1c1e24] shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <BookOpen className="w-5 h-5 text-yellow-500" />
                  Popular Help Articles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {helpArticles.map((article, index) => (
                  <div
                    key={index}
                    className="flex items-start justify-between p-4 border border-gray-200 dark:border-white/5 rounded-xl bg-gray-50 dark:bg-black/20 hover:bg-gray-100 dark:hover:bg-white/5 hover:border-yellow-400 dark:hover:border-yellow-500/20 transition-all cursor-pointer group"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400">
                          {article.category}
                        </Badge>
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          {article.views} views
                        </span>
                      </div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                        {article.title}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        {article.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                        <Clock className="w-3 h-3" />
                        Updated {article.updated}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors" />
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-4 border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 bg-transparent">
                  View All Articles
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Video Tutorials */}
            <Card className="border-gray-200 dark:border-white/5 bg-white dark:bg-[#1c1e24] shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <PlayCircle className="w-5 h-5 text-red-500" />
                  Video Tutorials
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {videoTutorials.map((video, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 border border-gray-200 dark:border-white/5 rounded-xl bg-gray-50 dark:bg-black/20 hover:bg-gray-100 dark:hover:bg-white/5 hover:border-yellow-400 dark:hover:border-yellow-500/20 transition-all cursor-pointer group"
                  >
                    <div className="w-20 h-20 rounded-lg bg-gray-200 dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 flex items-center justify-center text-3xl border border-gray-300 dark:border-white/5 group-hover:border-yellow-400 dark:group-hover:border-yellow-500/30 transition-colors">
                      {video.thumbnail}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                        {video.title}
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="w-4 h-4" />
                        {video.duration}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-gray-400 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5">
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
            <Card className="border-yellow-200 dark:border-yellow-500/20 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-500/10 dark:to-yellow-600/10 hover:from-yellow-100 hover:to-yellow-200 dark:hover:from-yellow-500/20 dark:hover:to-yellow-600/20 transition-colors shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-yellow-500 flex items-center justify-center shadow-lg shadow-yellow-500/20">
                    <Headphones className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">Need More Help?</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Our team is here for you</p>
                  </div>
                </div>
                <Button className="w-full bg-yellow-400 hover:bg-yellow-500 dark:bg-yellow-500 dark:hover:bg-yellow-400 text-black font-semibold shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                  Contact Support
                </Button>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card className="border-gray-200 dark:border-white/5 bg-white dark:bg-[#1c1e24] shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900 dark:text-white">Quick Links</CardTitle>
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
                    className="w-full justify-start text-gray-500 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 hover:bg-gray-100 dark:hover:bg-white/5"
                  >
                    {link}
                    <ChevronRight className="w-4 h-4 ml-auto opacity-50" />
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* System Status */}
            <Card className="border-gray-200 dark:border-white/5 bg-white dark:bg-[#1c1e24] shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900 dark:text-white">System Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Platform</span>
                  <Badge className="bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/20">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Operational
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Bid System</span>
                  <Badge className="bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/20">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Online
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Document Storage</span>
                  <Badge className="bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/20">
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
