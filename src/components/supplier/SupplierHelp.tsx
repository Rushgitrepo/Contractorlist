import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  CheckCircle
} from "lucide-react";

const SupplierHelp = () => {
  const faqs = [
    {
      question: "How do I add products to my catalog?",
      answer: "Navigate to the Product Catalog section and click 'Add New Product'. Fill in the required details including specifications, pricing, and images.",
      category: "Product Management"
    },
    {
      question: "How can I respond to RFQs?",
      answer: "Go to Orders & RFQs section, find the RFQ you want to respond to, and click 'Submit Quote'. Provide your pricing and delivery timeline.",
      category: "Orders & RFQs"
    },
    {
      question: "How do I track my order status?",
      answer: "In the Orders & RFQs section, you can view all your orders with real-time status updates including pending, confirmed, in-progress, and delivered.",
      category: "Order Tracking"
    },
    {
      question: "Can I set up automated pricing for bulk orders?",
      answer: "Yes, in your Product Catalog, you can set up tiered pricing based on quantity ranges for automatic bulk discounts.",
      category: "Pricing"
    }
  ];

  const supportTickets = [
    {
      id: "SUP-001",
      subject: "Product catalog sync issue",
      status: "In Progress",
      priority: "High",
      created: "2 hours ago"
    },
    {
      id: "SUP-002", 
      subject: "Payment processing question",
      status: "Resolved",
      priority: "Medium",
      created: "1 day ago"
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Help & Support</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Get help with your supplier dashboard and find answers to common questions
          </p>
        </div>
      </div>

      <Tabs defaultValue="faq" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="contact">Contact Support</TabsTrigger>
          <TabsTrigger value="tickets">My Tickets</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="faq" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Find quick answers to common questions about using the supplier dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative mb-6">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search FAQs..."
                  className="pl-10"
                />
              </div>
              
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{faq.question}</h3>
                          <Badge variant="secondary" className="text-xs">{faq.category}</Badge>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{faq.answer}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400 ml-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Get in touch with our support team</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Phone Support</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">1-800-SUPPLIER</p>
                    <p className="text-xs text-gray-500">Mon-Fri, 9AM-6PM EST</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Mail className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">Email Support</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">supplier-support@company.com</p>
                    <p className="text-xs text-gray-500">Response within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium">Live Chat</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Available 24/7</p>
                    <Button size="sm" className="mt-2">Start Chat</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Submit a Support Ticket</CardTitle>
                <CardDescription>Describe your issue and we'll help you resolve it</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Subject</label>
                  <Input placeholder="Brief description of your issue" />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Priority</label>
                  <select className="w-full p-2 border rounded-md bg-background">
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <Textarea 
                    placeholder="Please provide detailed information about your issue..."
                    rows={4}
                  />
                </div>

                <Button className="w-full">Submit Ticket</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tickets" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>My Support Tickets</CardTitle>
              <CardDescription>Track the status of your support requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {supportTickets.map((ticket) => (
                  <div key={ticket.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-mono text-sm text-gray-500">{ticket.id}</span>
                          <Badge 
                            variant={ticket.status === 'Resolved' ? 'default' : 'secondary'}
                            className="text-xs"
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
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{ticket.subject}</h3>
                        <p className="text-sm text-gray-500">Created {ticket.created}</p>
                      </div>
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="h-8 w-8 text-blue-600" />
                  <div>
                    <h3 className="font-semibold">User Guide</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Complete supplier dashboard guide</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Download PDF
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Video className="h-8 w-8 text-green-600" />
                  <div>
                    <h3 className="font-semibold">Video Tutorials</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Step-by-step video guides</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Watch Videos
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <HelpCircle className="h-8 w-8 text-purple-600" />
                  <div>
                    <h3 className="font-semibold">API Documentation</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Integration and API reference</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  View Docs
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SupplierHelp;