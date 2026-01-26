import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Users
} from "lucide-react";

const HelpSupport = () => {
  const faqs = [
    {
      question: "How do I post a new project?",
      answer: "Click the 'Post Project' button in the top navigation, fill out the project details form, and submit. You'll start receiving bids within 24 hours.",
      category: "Getting Started"
    },
    {
      question: "How do I verify a contractor is legitimate?",
      answer: "Look for the verified badge, check their license status, read reviews, and request references. All contractors on our platform undergo background checks.",
      category: "Contractor Verification"
    },
    {
      question: "What payment methods are accepted?",
      answer: "We accept all major credit cards, bank transfers, and digital wallets. Payments are processed securely through our escrow system.",
      category: "Payments"
    },
    {
      question: "How does the escrow system work?",
      answer: "Funds are held securely until project milestones are completed. You approve each phase before payment is released to the contractor.",
      category: "Payments"
    },
    {
      question: "Can I cancel a project after accepting a bid?",
      answer: "Yes, but cancellation terms depend on the project stage. Review our cancellation policy or contact support for specific situations.",
      category: "Project Management"
    }
  ];

  const supportTickets = [
    {
      id: "HO-001",
      subject: "Question about bid comparison",
      status: "Open",
      priority: "Medium",
      created: "2 hours ago"
    },
    {
      id: "HO-002", 
      subject: "Payment processing issue",
      status: "Resolved",
      priority: "High",
      created: "1 day ago"
    },
    {
      id: "HO-003",
      subject: "Contractor communication problem",
      status: "In Progress",
      priority: "High",
      created: "3 days ago"
    }
  ];

  const guides = [
    {
      title: "First-Time Homeowner's Guide",
      description: "Everything you need to know about hiring contractors and managing home projects.",
      category: "Getting Started",
      readTime: "8 min read",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCQub6A5Gfs4FK1gro1_kQZ_io6ltfvSXlHAMa4nsNUfG0k4PIvg4tHQWCnVWYRILwjk0fZUnlimfkpy2tO_8NyjH1GOlIcCwSlMwF6x_qPDZbLCdVH_cAx0KIQkBXpw6JgQUDD3QspBejV-RGF33I7zu4ZkonAebCv7t0hlPN_JVvN3WO5DQvXwV_alXX86BZvlrRwKsQFX9uaqtDxO10vSete-BH5_KpKL8H3ZHa1bRECg7ArAEnhuoQsJDK2gCoVrTjJw3bdLB3h"
    },
    {
      title: "Understanding Project Bids",
      description: "How to compare quotes, spot red flags, and choose the right contractor for your budget.",
      category: "Bidding",
      readTime: "5 min read",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAjCohTvMFAxfTSqkLC7BbdkGSFTgfPZxFSvzNfkxfz8perh7mmaQm4gico4ItU2eQ0cULibv7SsNOL31KjkCjCmU6jEE5RcD111ErWB8qhBvDbGsBCu7Ra_rVb7AnW22O_GCkkL0IGIN3NM3jw3c6SElwwIZZ5ZkvhDnfpHqkAvJFkR5sYOp9CdAdvZ6jjnEjeMkNhdNRWSTTLT8kRWPCiixtQGkd6VB0jB3VcgA8eylLsK6ZotT6-j-KeZtqrGpHoxB3NuHNQPSsR"
    },
    {
      title: "Project Management Best Practices",
      description: "Tips for staying on schedule, managing budgets, and communicating effectively with contractors.",
      category: "Project Management",
      readTime: "12 min read",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDdfvwqd5q85N0BkUuYkE-TmXeGgJqpm3CsNZaxUXAqp_n2XOQZ38zRI0w7aWCv3LuMEh947kooH-aZa9NMygn-uW8TJRgnlFnoA6TT9lWHXuxLF00FNxXFqV_gH-DE8A6uALiDK11CAc7rmdqk4K7FTp1EwI39X7LAk56o3a0U8juoMUXZO4GXnoEcx2Ia9oWTcoirAPyhjHYLapdOol0o0C-OkP2CyKM1I8JXtwGUU0OwNf3PlOf4AX4b4ZTnXKXFqXmbysPU2tsx"
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">Help & Support</h1>
          <p className="text-text-secondary-light dark:text-text-secondary-dark mt-2">
            Get help with your projects and find answers to common questions
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <Card className="bg-gradient-to-r from-primary/5 to-blue-500/5 border-primary/20">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-text-primary-light dark:text-white mb-2">
              How can we help you today?
            </h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark">
              Search for articles, guides, or troubleshooting help
            </p>
          </div>
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="e.g. How to verify a contractor or payment milestones"
              className="pl-12 h-12 text-base"
            />
            <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary hover:bg-blue-600 text-white">
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="faq" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="guides">Guides</TabsTrigger>
          <TabsTrigger value="contact">Contact Support</TabsTrigger>
          <TabsTrigger value="tickets">My Tickets</TabsTrigger>
        </TabsList>

        <TabsContent value="faq" className="space-y-6">
          {/* Popular Topics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-primary group-hover:text-white transition-colors">
                  <HelpCircle className="w-6 h-6 text-blue-600 dark:text-blue-400 group-hover:text-white" />
                </div>
                <h3 className="font-semibold text-sm mb-1">Getting Started</h3>
                <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                  Basic platform usage
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-primary group-hover:text-white transition-colors">
                  <Shield className="w-6 h-6 text-green-600 dark:text-green-400 group-hover:text-white" />
                </div>
                <h3 className="font-semibold text-sm mb-1">Verification</h3>
                <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                  Contractor vetting
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-primary group-hover:text-white transition-colors">
                  <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400 group-hover:text-white" />
                </div>
                <h3 className="font-semibold text-sm mb-1">Payments</h3>
                <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                  Billing & escrow
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-primary group-hover:text-white transition-colors">
                  <Users className="w-6 h-6 text-orange-600 dark:text-orange-400 group-hover:text-white" />
                </div>
                <h3 className="font-semibold text-sm mb-1">Projects</h3>
                <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                  Managing work
                </p>
              </CardContent>
            </Card>
          </div>

          {/* FAQ List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <details key={index} className="group rounded-lg border border-border-light dark:border-border-dark p-4 [&_summary::-webkit-details-marker]:hidden">
                    <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-text-primary-light dark:text-white font-medium">
                      <div className="flex items-center gap-3">
                        <h3 className="text-base">{faq.question}</h3>
                        <Badge variant="secondary" className="text-xs">{faq.category}</Badge>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-500 transition group-open:rotate-90" />
                    </summary>
                    <p className="mt-4 leading-relaxed text-text-secondary-light dark:text-text-secondary-dark text-sm">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guides" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((guide, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
                <div 
                  className="h-48 bg-cover bg-center"
                  style={{ backgroundImage: `url(${guide.image})` }}
                />
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="text-xs">{guide.category}</Badge>
                    <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                      {guide.readTime}
                    </span>
                  </div>
                  <h3 className="font-bold text-base mb-2 text-text-primary-light dark:text-white">
                    {guide.title}
                  </h3>
                  <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark line-clamp-2">
                    {guide.description}
                  </p>
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    Read Guide
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="font-medium">Phone Support</p>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">1-800-HOMEOWNER</p>
                    <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">Mon-Fri, 9AM-6PM EST</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <Mail className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="font-medium">Email Support</p>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">homeowner-support@contractorslist.com</p>
                    <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">Response within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <div className="flex-1">
                    <p className="font-medium">Live Chat</p>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Available 24/7</p>
                  </div>
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                    Start Chat
                  </Button>
                </div>

                <div className="flex items-center gap-3 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                  <Bot className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  <div className="flex-1">
                    <p className="font-medium">AI Assistant</p>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Instant help with common questions</p>
                  </div>
                  <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                    Ask AI
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Submit Ticket */}
            <Card>
              <CardHeader>
                <CardTitle>Submit a Support Ticket</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject</label>
                  <Input placeholder="Brief description of your issue" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <select className="w-full p-2 border border-border-light dark:border-border-dark rounded-md bg-background-light dark:bg-background-dark">
                    <option>General Question</option>
                    <option>Technical Issue</option>
                    <option>Billing Problem</option>
                    <option>Contractor Dispute</option>
                    <option>Account Issue</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Priority</label>
                  <select className="w-full p-2 border border-border-light dark:border-border-dark rounded-md bg-background-light dark:bg-background-dark">
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Urgent</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea 
                    placeholder="Please provide detailed information about your issue..."
                    rows={4}
                  />
                </div>

                <Button className="w-full bg-primary hover:bg-blue-600 text-white">
                  Submit Ticket
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tickets" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>My Support Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {supportTickets.map((ticket) => (
                  <div key={ticket.id} className="border border-border-light dark:border-border-dark rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-mono text-sm text-text-secondary-light dark:text-text-secondary-dark">{ticket.id}</span>
                          <Badge 
                            className={`text-xs ${
                              ticket.status === 'Resolved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                              ticket.status === 'In Progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                              'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                            }`}
                          >
                            {ticket.status === 'Resolved' ? (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            ) : (
                              <Clock className="h-3 w-3 mr-1" />
                            )}
                            {ticket.status}
                          </Badge>
                          <Badge 
                            variant={ticket.priority === 'High' ? 'destructive' : 'outline'}
                            className="text-xs"
                          >
                            {ticket.priority}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-text-primary-light dark:text-white mb-1">{ticket.subject}</h3>
                        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Created {ticket.created}</p>
                      </div>
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Resource Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold mb-2">User Guide</h3>
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-4">
              Complete homeowner platform guide
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Download PDF
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Video className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold mb-2">Video Tutorials</h3>
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-4">
              Step-by-step video guides
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Watch Videos
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Star className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold mb-2">Best Practices</h3>
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-4">
              Tips for successful projects
            </p>
            <Button variant="outline" size="sm" className="w-full">
              View Tips
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HelpSupport;