import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  HelpCircle,
  MessageSquare,
  Phone,
  Mail,
  FileText,
  Video,
  Search,
  ChevronRight,
  ExternalLink,
  Clock,
  CheckCircle,
  AlertCircle,
  Book,
  Users,
  Zap
} from 'lucide-react';

const HelpSupport = () => {
  const [activeTab, setActiveTab] = useState('faq');
  const [searchQuery, setSearchQuery] = useState('');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');

  const faqCategories = [
    {
      title: 'Getting Started',
      icon: Zap,
      questions: [
        {
          question: 'How do I create my subcontractor profile?',
          answer: 'Navigate to My Profile section and fill out all required information including company details, certifications, and project portfolio.'
        },
        {
          question: 'How do I find relevant projects?',
          answer: 'Use the Find Projects section to browse available opportunities. You can filter by location, project type, and budget range.'
        },
        {
          question: 'What information should I include in my bids?',
          answer: 'Include detailed pricing, timeline, materials list, and any relevant certifications or past project examples.'
        }
      ]
    },
    {
      title: 'Bidding Process',
      icon: FileText,
      questions: [
        {
          question: 'How do I submit a competitive bid?',
          answer: 'Research the project thoroughly, provide detailed breakdowns, include relevant experience, and submit before the deadline.'
        },
        {
          question: 'Can I modify my bid after submission?',
          answer: 'Bids can be modified until the submission deadline. After that, contact the general contractor directly.'
        },
        {
          question: 'How do I track my bid status?',
          answer: 'Check the Bid Management section for real-time updates on all your submitted bids.'
        }
      ]
    },
    {
      title: 'Account Management',
      icon: Users,
      questions: [
        {
          question: 'How do I update my company information?',
          answer: 'Go to Settings > Company Profile to update your business details, certifications, and contact information.'
        },
        {
          question: 'How do I manage my team members?',
          answer: 'In Settings > Team Management, you can add team members, assign roles, and manage permissions.'
        },
        {
          question: 'How do I change my subscription plan?',
          answer: 'Visit Settings > Billing to view and modify your subscription plan or payment methods.'
        }
      ]
    }
  ];

  const supportTickets = [
    {
      id: 'TK-2024-001',
      subject: 'Unable to upload project photos',
      status: 'open',
      priority: 'medium',
      created: '2 hours ago',
      lastUpdate: '1 hour ago'
    },
    {
      id: 'TK-2024-002',
      subject: 'Bid submission error',
      status: 'in-progress',
      priority: 'high',
      created: '1 day ago',
      lastUpdate: '4 hours ago'
    },
    {
      id: 'TK-2024-003',
      subject: 'Profile verification question',
      status: 'resolved',
      priority: 'low',
      created: '3 days ago',
      lastUpdate: '2 days ago'
    }
  ];

  const resources = [
    {
      title: 'Subcontractor Success Guide',
      description: 'Complete guide to maximizing your success on the platform',
      type: 'PDF Guide',
      icon: Book,
      link: '#'
    },
    {
      title: 'Bidding Best Practices',
      description: 'Learn how to create winning bids that stand out',
      type: 'Video Tutorial',
      icon: Video,
      link: '#'
    },
    {
      title: 'Platform Walkthrough',
      description: 'Step-by-step tour of all platform features',
      type: 'Interactive Tour',
      icon: Users,
      link: '#'
    },
    {
      title: 'API Documentation',
      description: 'Technical documentation for platform integration',
      type: 'Documentation',
      icon: FileText,
      link: '#'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">Open</Badge>;
      case 'in-progress':
        return <Badge className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">In Progress</Badge>;
      case 'resolved':
        return <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">Resolved</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">Medium</Badge>;
      case 'low':
        return <Badge className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300">Low</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  const handleSubmitTicket = () => {
    if (!ticketSubject.trim() || !ticketMessage.trim()) return;
    // Handle ticket submission
    setTicketSubject('');
    setTicketMessage('');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 pb-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight mb-2">Help & Support</h1>
            <p className="text-text-secondary-light dark:text-text-secondary-dark">
              Get help, find answers, and contact our support team
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Phone className="w-4 h-4 mr-2" />
              Call Support
            </Button>
            <Button className="bg-primary hover:bg-yellow-400 text-black font-semibold">
              <MessageSquare className="w-4 h-4 mr-2" />
              Live Chat
            </Button>
          </div>
        </div>

        {/* Quick Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="p-5 text-center">
              <Phone className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-1">Phone Support</h3>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-2">
                Mon-Fri, 8AM-6PM CST
              </p>
              <p className="font-bold text-primary">1-800-BUILD-TX</p>
            </CardContent>
          </Card>

          <Card className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="p-5 text-center">
              <Mail className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-1">Email Support</h3>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-2">
                Response within 24 hours
              </p>
              <p className="font-bold text-blue-600">support@buildtx.com</p>
            </CardContent>
          </Card>

          <Card className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="p-5 text-center">
              <MessageSquare className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-1">Live Chat</h3>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-2">
                Available 24/7
              </p>
              <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                Online Now
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="contact">Contact Us</TabsTrigger>
          </TabsList>

          <TabsContent value="faq" className="space-y-6">
            {/* Search */}
            <Card className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark">
              <CardContent className="p-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark w-5 h-5" />
                  <Input
                    placeholder="Search frequently asked questions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 text-lg h-12"
                  />
                </div>
              </CardContent>
            </Card>

            {/* FAQ Categories */}
            <div className="space-y-6">
              {faqCategories.map((category, categoryIndex) => (
                <Card key={categoryIndex} className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <category.icon className="w-6 h-6 text-primary" />
                      {category.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {category.questions.map((faq, faqIndex) => (
                      <div key={faqIndex} className="border-b border-border-light dark:border-border-dark last:border-0 pb-4 last:pb-0">
                        <button className="flex items-center justify-between w-full text-left group">
                          <h4 className="font-semibold group-hover:text-primary transition-colors">
                            {faq.question}
                          </h4>
                          <ChevronRight className="w-4 h-4 text-text-secondary-light dark:text-text-secondary-dark group-hover:text-primary transition-colors" />
                        </button>
                        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-2 pl-4">
                          {faq.answer}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tickets" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold">Your Support Tickets</h2>
                <p className="text-text-secondary-light dark:text-text-secondary-dark">
                  Track and manage your support requests
                </p>
              </div>
              <Button className="bg-primary hover:bg-yellow-400 text-black font-semibold">
                <MessageSquare className="w-4 h-4 mr-2" />
                New Ticket
              </Button>
            </div>

            <div className="space-y-4">
              {supportTickets.map((ticket) => (
                <Card key={ticket.id} className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark hover:border-primary/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{ticket.subject}</h3>
                          {getStatusBadge(ticket.status)}
                          {getPriorityBadge(ticket.priority)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                          <span>Ticket #{ticket.id}</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            Created {ticket.created}
                          </span>
                          <span>Last update: {ticket.lastUpdate}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-2">Help Resources</h2>
              <p className="text-text-secondary-light dark:text-text-secondary-dark">
                Guides, tutorials, and documentation to help you succeed
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {resources.map((resource, index) => (
                <Card key={index} className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark hover:border-primary/50 transition-colors cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <resource.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold">{resource.title}</h3>
                          <ExternalLink className="w-4 h-4 text-text-secondary-light dark:text-text-secondary-dark" />
                        </div>
                        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-3">
                          {resource.description}
                        </p>
                        <Badge className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300">
                          {resource.type}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <Card className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark">
              <CardHeader>
                <CardTitle>Submit a Support Request</CardTitle>
                <p className="text-text-secondary-light dark:text-text-secondary-dark">
                  Can't find what you're looking for? Send us a message and we'll get back to you.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Subject</label>
                  <Input
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    placeholder="Brief description of your issue"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Message</label>
                  <Textarea
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    placeholder="Please provide detailed information about your issue..."
                    className="min-h-[120px]"
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleSubmitTicket}
                    className="bg-primary hover:bg-yellow-400 text-black font-semibold"
                    disabled={!ticketSubject.trim() || !ticketMessage.trim()}
                  >
                    Submit Request
                  </Button>
                  <Button variant="outline">
                    Save Draft
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HelpSupport;