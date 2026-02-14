import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { 
  HelpCircle, 
  MessageSquare, 
  Phone, 
  Mail, 
  FileText, 
  Video,
  Search,
  ChevronRight,
  Clock,
  CheckCircle,
  Bot,
  Star,
  Shield,
  Zap,
  Users,
  Send,
  BookOpen,
  Headphones,
  AlertCircle,
  TrendingUp,
  Download
} from "lucide-react";

const HelpSupport = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    {
      question: "How do I post a new project?",
      answer: "Click the 'New Project' button in your dashboard, fill out the project details including title, description, budget, and timeline. You'll start receiving bids from qualified contractors within 24 hours.",
      category: "Getting Started",
      helpful: 245
    },
    {
      question: "How do I verify a contractor is legitimate?",
      answer: "Look for the verified badge on their profile, check their license status, read reviews from other homeowners, and request references. All contractors on our platform undergo thorough background checks and license verification.",
      category: "Contractor Verification",
      helpful: 189
    },
    {
      question: "What payment methods are accepted?",
      answer: "We accept all major credit cards (Visa, Mastercard, American Express), bank transfers, and digital wallets. All payments are processed securely through our encrypted payment system with escrow protection.",
      category: "Payments",
      helpful: 156
    },
    {
      question: "How does the escrow system work?",
      answer: "Funds are held securely in escrow until project milestones are completed and approved by you. This protects both you and the contractor. You review and approve each phase before payment is released.",
      category: "Payments",
      helpful: 203
    },
    {
      question: "Can I cancel a project after accepting a bid?",
      answer: "Yes, but cancellation terms depend on the project stage. Review our cancellation policy in your project agreement or contact support for specific situations. Early cancellations may incur minimal fees.",
      category: "Project Management",
      helpful: 134
    },
    {
      question: "How do I compare multiple bids?",
      answer: "Use our bid comparison tool in the Bid Management section. Compare pricing, timelines, contractor ratings, and proposal details side-by-side to make an informed decision.",
      category: "Bidding",
      helpful: 178
    }
  ];

  const supportTickets = [
    {
      id: "HO-2024-001",
      subject: "Question about bid comparison feature",
      status: "Open",
      priority: "Medium",
      created: "2 hours ago",
      lastUpdate: "2 hours ago"
    },
    {
      id: "HO-2024-002", 
      subject: "Payment processing issue resolved",
      status: "Resolved",
      priority: "High",
      created: "1 day ago",
      lastUpdate: "5 hours ago"
    },
    {
      id: "HO-2024-003",
      subject: "Contractor communication problem",
      status: "In Progress",
      priority: "High",
      created: "3 days ago",
      lastUpdate: "1 day ago"
    }
  ];

  const guides = [
    {
      title: "First-Time Homeowner's Complete Guide",
      description: "Everything you need to know about hiring contractors, managing home projects, and getting the best value for your investment.",
      category: "Getting Started",
      readTime: "8 min read",
      views: "12.5K",
      image: "/home1.jpeg"
    },
    {
      title: "Understanding Project Bids & Proposals",
      description: "Learn how to compare quotes effectively, spot red flags, negotiate pricing, and choose the right contractor for your budget and timeline.",
      category: "Bidding",
      readTime: "5 min read",
      views: "9.8K",
      image: "/home2.jpeg"
    },
    {
      title: "Project Management Best Practices",
      description: "Expert tips for staying on schedule, managing budgets, communicating effectively with contractors, and ensuring quality work.",
      category: "Project Management",
      readTime: "12 min read",
      views: "15.2K",
      image: "/home3.jpeg"
    },
    {
      title: "Contractor Verification Checklist",
      description: "Step-by-step guide to verifying contractor credentials, checking licenses, reading reviews, and protecting yourself from fraud.",
      category: "Safety",
      readTime: "6 min read",
      views: "11.3K",
      image: "/home4.jpeg"
    },
    {
      title: "Payment & Escrow Protection",
      description: "Understanding how our escrow system works, payment milestones, dispute resolution, and keeping your money safe.",
      category: "Payments",
      readTime: "7 min read",
      views: "8.9K",
      image: "/home5.jpeg"
    },
    {
      title: "Maximizing Your Project Success",
      description: "Advanced strategies for getting the best results, building contractor relationships, and managing multiple projects efficiently.",
      category: "Advanced",
      readTime: "10 min read",
      views: "6.7K",
      image: "/home1.jpeg"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'In Progress': return 'bg-accent/20 text-accent border-accent/30';
      case 'Resolved': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Low': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <div className="p-6 bg-gray-50/50 dark:bg-slate-950/50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Help & Support
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Get help with your projects and find answers to common questions
          </p>
          <div className="flex items-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Headphones className="w-4 h-4 text-accent" />
              <span>24/7 support</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-accent" />
              <span>Avg response: 2 hours</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-accent" />
              <span>4.9/5 satisfaction</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <Card className="shadow-lg bg-gradient-to-r from-accent/10 to-accent/5 border-accent/20">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              How can we help you today?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Search for articles, guides, or troubleshooting help
            </p>
          </div>
          <div className="relative max-w-3xl mx-auto">
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
            <Input
              placeholder="e.g. How to verify a contractor or payment milestones"
              className="pl-14 h-14 text-base shadow-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-accent hover:bg-accent/90 text-accent-foreground h-10 px-6 font-semibold">
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20 hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-accent">Articles</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">150+</p>
              </div>
              <div className="p-3 bg-accent/20 rounded-full">
                <BookOpen className="w-6 h-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Video Guides</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">45+</p>
              </div>
              <div className="p-3 bg-gray-200 dark:bg-gray-800 rounded-full">
                <Video className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Active Tickets</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">2</p>
              </div>
              <div className="p-3 bg-gray-200 dark:bg-gray-800 rounded-full">
                <MessageSquare className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Satisfaction</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">4.9</p>
              </div>
              <div className="p-3 bg-gray-200 dark:bg-gray-800 rounded-full">
                <Star className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="faq" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-gray-100 dark:bg-gray-800 h-12">
          <TabsTrigger value="faq" className="font-semibold text-sm">FAQ</TabsTrigger>
          <TabsTrigger value="guides" className="font-semibold text-sm">Guides</TabsTrigger>
          <TabsTrigger value="contact" className="font-semibold text-sm">Contact Support</TabsTrigger>
          <TabsTrigger value="tickets" className="font-semibold text-sm">My Tickets</TabsTrigger>
        </TabsList>

        <TabsContent value="faq" className="space-y-6">
          {/* Popular Topics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: HelpCircle, title: 'Getting Started', desc: 'Basic platform usage', color: 'blue' },
              { icon: Shield, title: 'Verification', desc: 'Contractor vetting', color: 'green' },
              { icon: Zap, title: 'Payments', desc: 'Billing & escrow', color: 'purple' },
              { icon: Users, title: 'Projects', desc: 'Managing work', color: 'orange' }
            ].map((topic, index) => (
              <Card key={index} className="hover:shadow-lg transition-all cursor-pointer group border-gray-200 dark:border-gray-800">
                <CardContent className="p-6 text-center">
                  <div className={`w-14 h-14 bg-${topic.color}-100 dark:bg-${topic.color}-900/30 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-accent group-hover:scale-110 transition-all`}>
                    <topic.icon className={`w-7 h-7 text-${topic.color}-600 dark:text-${topic.color}-400 group-hover:text-accent-foreground`} />
                  </div>
                  <h3 className="font-bold text-base mb-1 text-gray-900 dark:text-white">{topic.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {topic.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* FAQ List */}
          <Card className="shadow-lg border-gray-200 dark:border-gray-800">
            <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
              <CardTitle className="flex items-center gap-2 text-lg">
                <HelpCircle className="h-5 w-5 text-accent" />
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {faqs.map((faq, index) => (
                  <details key={index} className="group rounded-xl border border-gray-200 dark:border-gray-800 p-5 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors [&_summary::-webkit-details-marker]:hidden">
                    <summary className="flex cursor-pointer items-center justify-between gap-3">
                      <div className="flex items-center gap-3 flex-1">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white">{faq.question}</h3>
                        <Badge variant="secondary" className="text-xs">{faq.category}</Badge>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-500 transition-transform group-open:rotate-90" />
                    </summary>
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                      <p className="leading-relaxed text-gray-700 dark:text-gray-300 text-sm mb-4">
                        {faq.answer}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <button className="flex items-center gap-1 hover:text-accent transition-colors">
                          <TrendingUp className="w-4 h-4" />
                          <span>{faq.helpful} found this helpful</span>
                        </button>
                      </div>
                    </div>
                  </details>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guides" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((guide, index) => (
              <Card key={index} className="hover:shadow-xl transition-all cursor-pointer overflow-hidden group border-gray-200 dark:border-gray-800">
                <div 
                  className="h-48 bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                  style={{ backgroundImage: `url(${guide.image})` }}
                />
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary" className="text-xs">{guide.category}</Badge>
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {guide.readTime}
                    </span>
                  </div>
                  <h3 className="font-bold text-base mb-2 text-gray-900 dark:text-white group-hover:text-accent transition-colors">
                    {guide.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                    {guide.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">{guide.views} views</span>
                    <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                      Read Guide
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Information */}
            <Card className="shadow-lg border-gray-200 dark:border-gray-800">
              <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {[
                  { 
                    icon: Phone, 
                    title: 'Phone Support', 
                    detail: '1-800-HOMEOWNER', 
                    subtext: 'Mon-Fri, 9AM-6PM EST',
                    color: 'blue',
                    action: 'Call Now'
                  },
                  { 
                    icon: Mail, 
                    title: 'Email Support', 
                    detail: 'support@contractorslist.com', 
                    subtext: 'Response within 24 hours',
                    color: 'green',
                    action: 'Send Email'
                  },
                  { 
                    icon: MessageSquare, 
                    title: 'Live Chat', 
                    detail: 'Available 24/7', 
                    subtext: 'Average wait time: 2 minutes',
                    color: 'purple',
                    action: 'Start Chat'
                  },
                  { 
                    icon: Bot, 
                    title: 'AI Assistant', 
                    detail: 'Instant help', 
                    subtext: 'Common questions answered instantly',
                    color: 'indigo',
                    action: 'Ask AI'
                  }
                ].map((contact, index) => (
                  <div key={index} className="flex items-center gap-4 p-5 bg-gray-50 dark:bg-gray-900 rounded-xl hover:shadow-md transition-shadow">
                    <div className={`p-3 bg-${contact.color}-100 dark:bg-${contact.color}-900/30 rounded-xl`}>
                      <contact.icon className={`h-6 w-6 text-${contact.color}-600 dark:text-${contact.color}-400`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white">{contact.title}</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{contact.detail}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{contact.subtext}</p>
                    </div>
                    <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                      {contact.action}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Submit Ticket */}
            <Card className="shadow-lg border-gray-200 dark:border-gray-800">
              <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                <CardTitle className="text-lg">Submit a Support Ticket</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-sm font-semibold">Subject</Label>
                  <Input id="subject" placeholder="Brief description of your issue" className="h-11" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-semibold">Category</Label>
                  <select id="category" className="w-full h-11 px-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950">
                    <option>General Question</option>
                    <option>Technical Issue</option>
                    <option>Billing Problem</option>
                    <option>Contractor Dispute</option>
                    <option>Account Issue</option>
                    <option>Feature Request</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority" className="text-sm font-semibold">Priority</Label>
                  <select id="priority" className="w-full h-11 px-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950">
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Urgent</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-semibold">Description</Label>
                  <Textarea 
                    id="description"
                    placeholder="Please provide detailed information about your issue..."
                    rows={5}
                  />
                </div>

                <Button className="w-full h-11 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold gap-2">
                  <Send className="w-4 h-4" />
                  Submit Ticket
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tickets" className="space-y-6">
          <Card className="shadow-lg border-gray-200 dark:border-gray-800">
            <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">My Support Tickets</CardTitle>
                <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2">
                  <Send className="w-4 h-4" />
                  New Ticket
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {supportTickets.map((ticket) => (
                  <Card key={ticket.id} className="border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-mono text-sm font-semibold text-accent">{ticket.id}</span>
                            <Badge className={`text-xs ${getStatusColor(ticket.status)}`}>
                              {ticket.status === 'Resolved' && <CheckCircle className="h-3 w-3 mr-1" />}
                              {ticket.status === 'In Progress' && <Clock className="h-3 w-3 mr-1" />}
                              {ticket.status === 'Open' && <AlertCircle className="h-3 w-3 mr-1" />}
                              {ticket.status}
                            </Badge>
                            <Badge className={`text-xs ${getPriorityColor(ticket.priority)}`}>
                              {ticket.priority}
                            </Badge>
                          </div>
                          <h3 className="font-bold text-base text-gray-900 dark:text-white mb-2">{ticket.subject}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              Created {ticket.created}
                            </span>
                            <span>•</span>
                            <span>Last update {ticket.lastUpdate}</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="hover:bg-accent/10 border-accent/20 text-accent">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Resource Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { 
            icon: FileText, 
            title: 'User Guide', 
            desc: 'Complete homeowner platform guide',
            action: 'Download PDF',
            color: 'blue'
          },
          { 
            icon: Video, 
            title: 'Video Tutorials', 
            desc: 'Step-by-step video guides',
            action: 'Watch Videos',
            color: 'green'
          },
          { 
            icon: Star, 
            title: 'Best Practices', 
            desc: 'Tips for successful projects',
            action: 'View Tips',
            color: 'purple'
          }
        ].map((resource, index) => (
          <Card key={index} className="hover:shadow-xl transition-all cursor-pointer group border-gray-200 dark:border-gray-800">
            <CardContent className="p-6 text-center">
              <div className={`w-16 h-16 bg-${resource.color}-100 dark:bg-${resource.color}-900/30 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-accent group-hover:scale-110 transition-all`}>
                <resource.icon className={`w-8 h-8 text-${resource.color}-600 dark:text-${resource.color}-400 group-hover:text-accent-foreground`} />
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">{resource.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {resource.desc}
              </p>
              <Button variant="outline" size="sm" className="w-full hover:bg-accent/10 border-accent/20 text-accent gap-2">
                <Download className="w-4 h-4" />
                {resource.action}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottom Info */}
      <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
        <Shield className="w-4 h-4 text-accent" />
        <span>Need urgent help? Call our 24/7 emergency line: 1-800-URGENT-HELP</span>
      </div>
      </div>
    </div>
  );
};

export default HelpSupport;
