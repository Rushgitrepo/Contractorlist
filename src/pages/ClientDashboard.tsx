import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppSelector } from "@/store/hooks";
import { Plus, MessageSquare, FileText, CreditCard, HelpCircle, Users, Calendar, DollarSign } from "lucide-react";

const ClientDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { user } = useAppSelector((state) => state.auth);

  // Mock data - replace with actual data from your API
  const projects = [
    { id: 1, title: "Kitchen Renovation", status: "In Progress", budget: "$25,000", contractor: "ABC Construction" },
    { id: 2, title: "Bathroom Remodel", status: "Completed", budget: "$15,000", contractor: "XYZ Builders" },
  ];

  const matchedContractors = [
    { id: 1, name: "ABC Construction", rating: 4.8, specialties: ["Kitchen", "Bathroom"], price: "$$$" },
    { id: 2, name: "Elite Builders", rating: 4.9, specialties: ["Full Renovation"], price: "$$$$" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Client Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back, {user?.name || 'User'}! (Client) - Manage your projects and connect with contractors
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex flex-wrap gap-2 p-1 bg-gray-100 rounded-lg">
            <Button 
              variant={activeTab === "overview" ? "default" : "ghost"} 
              size="sm" 
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </Button>
            <Button 
              variant={activeTab === "post-project" ? "default" : "ghost"} 
              size="sm" 
              onClick={() => setActiveTab("post-project")}
            >
              Post Project
            </Button>
            <Button 
              variant={activeTab === "contractors" ? "default" : "ghost"} 
              size="sm" 
              onClick={() => setActiveTab("contractors")}
            >
              Contractors
            </Button>
            <Button 
              variant={activeTab === "tracking" ? "default" : "ghost"} 
              size="sm" 
              onClick={() => setActiveTab("tracking")}
            >
              Tracking
            </Button>
            <Button 
              variant={activeTab === "messages" ? "default" : "ghost"} 
              size="sm" 
              onClick={() => setActiveTab("messages")}
            >
              Messages
            </Button>
            <Button 
              variant={activeTab === "payments" ? "default" : "ghost"} 
              size="sm" 
              onClick={() => setActiveTab("payments")}
            >
              Payments
            </Button>
          </div>

          {activeTab === "overview" && (
            <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2</div>
                  <p className="text-xs text-muted-foreground">1 in progress, 1 completed</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$40,000</div>
                  <p className="text-xs text-muted-foreground">Across all projects</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Matched Contractors</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5</div>
                  <p className="text-xs text-muted-foreground">Available for new projects</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Projects</CardTitle>
                <CardDescription>Overview of your ongoing and past projects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{project.title}</h3>
                        <p className="text-sm text-gray-600">Contractor: {project.contractor}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant={project.status === "Completed" ? "default" : "secondary"}>
                          {project.status}
                        </Badge>
                        <span className="font-semibold">{project.budget}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            </div>
          )}

          {activeTab === "post-project" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Post a New Project
                </CardTitle>
                <CardDescription>Submit project details for contractor matching</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Project Title</label>
                    <input className="w-full p-2 border rounded-md" placeholder="e.g., Kitchen Renovation" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Project Description</label>
                    <textarea className="w-full p-2 border rounded-md h-32" placeholder="Describe your project in detail..." />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Budget Range</label>
                      <select className="w-full p-2 border rounded-md">
                        <option>$5,000 - $15,000</option>
                        <option>$15,000 - $30,000</option>
                        <option>$30,000 - $50,000</option>
                        <option>$50,000+</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Timeline</label>
                      <select className="w-full p-2 border rounded-md">
                        <option>1-2 weeks</option>
                        <option>1 month</option>
                        <option>2-3 months</option>
                        <option>3+ months</option>
                      </select>
                    </div>
                  </div>
                  <Button className="w-full">Submit Project for Matching</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "contractors" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Matched Contractors
                </CardTitle>
                <CardDescription>AI-recommended contractors for your projects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {matchedContractors.map((contractor) => (
                    <div key={contractor.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{contractor.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm">Rating: {contractor.rating}/5</span>
                          <span className="text-sm">•</span>
                          <span className="text-sm">{contractor.specialties.join(", ")}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge>{contractor.price}</Badge>
                        <Button size="sm">View Profile</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "tracking" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Project Tracking
                </CardTitle>
                <CardDescription>Status, progress updates, and shared documents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Kitchen Renovation</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Progress</span>
                        <span>65%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: "65%" }}></div>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">Last update: Cabinets installed, working on countertops</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "messages" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Messages
                </CardTitle>
                <CardDescription>Direct communication with assigned contractors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">ABC Construction</h3>
                      <span className="text-sm text-gray-500">2 hours ago</span>
                    </div>
                    <p className="text-sm">The countertops will be delivered tomorrow morning. We'll start installation right away.</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">XYZ Builders</h3>
                      <span className="text-sm text-gray-500">1 day ago</span>
                    </div>
                    <p className="text-sm">Project completed! Please review and let us know if you need any adjustments.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "payments" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payments & Invoices
                </CardTitle>
                <CardDescription>View payment schedule and receipts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">Kitchen Renovation - Progress Payment</h3>
                        <p className="text-sm text-gray-600">ABC Construction</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">$12,500</p>
                        <Badge variant="default">Paid</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">Bathroom Remodel - Final Payment</h3>
                        <p className="text-sm text-gray-600">XYZ Builders</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">$15,000</p>
                        <Badge variant="default">Paid</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Support & Help Center - Always visible */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Support & Help Center
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                <FileText className="h-6 w-6" />
                <span>Documentation</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                <MessageSquare className="h-6 w-6" />
                <span>Live Chat</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                <HelpCircle className="h-6 w-6" />
                <span>FAQ</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientDashboard;