import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppSelector } from "@/store/hooks";
import { Plus, MessageSquare, FileText, CreditCard, HelpCircle, Users, Calendar, DollarSign, Download, TrendingUp, Clock, CheckCircle2, AlertCircle, Star, ArrowUpRight, Briefcase, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

const ClientDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { user } = useAppSelector((state) => state.auth);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Post Project form state
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectBudget, setProjectBudget] = useState("");
  const [projectTimeline, setProjectTimeline] = useState("");
  const [isSubmittingProject, setIsSubmittingProject] = useState(false);

  // Messages composer
  const [messageText, setMessageText] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  // Persist active tab
  useEffect(() => {
    const saved = window.localStorage.getItem("clientDashboard.activeTab");
    if (saved) {
      setActiveTab(saved);
    }
  }, []);
  useEffect(() => {
    window.localStorage.setItem("clientDashboard.activeTab", activeTab);
  }, [activeTab]);

  const handleSubmitProject = async () => {
    if (!projectTitle.trim() || !projectDescription.trim() || !projectBudget || !projectTimeline) {
      toast({
        title: "Missing information",
        description: "Please fill in the title, description, budget, and timeline.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmittingProject(true);
      // Simulate request latency (replace with real API call)
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Reset form
      setProjectTitle("");
      setProjectDescription("");
      setProjectBudget("");
      setProjectTimeline("");

      toast({
        title: "Project submitted",
        description: "We’ll match you with the best contractors shortly.",
      });
    } catch (e) {
      toast({
        title: "Submission failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingProject(false);
    }
  };

  const handleViewProfile = (contractorName: string) => {
    const contractor = matchedContractors.find((c) => c.name === contractorName);
    if (contractor) {
      navigate(`/contractors/${contractor.id}`);
    } else {
      toast({
        title: "Profile not found",
        description: "Unable to open contractor profile.",
        variant: "destructive",
      });
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim()) {
      toast({
        title: "Write a message",
        description: "Message cannot be empty.",
        variant: "destructive",
      });
      return;
    }
    try {
      setIsSendingMessage(true);
      await new Promise((r) => setTimeout(r, 500));
      setMessageText("");
      toast({
        title: "Message sent",
        description: "Your message has been delivered to the contractor.",
      });
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleDownloadReceipt = (title: string, amount: string) => {
    // Placeholder action; wire to real file download later
    toast({
      title: "Downloading receipt",
      description: `${title} • ${amount}`,
    });
  };

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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Welcome back, {user?.name || 'User'}!
              </h1>
              <p className="text-gray-600 mt-2 text-lg">
                Manage your projects and connect with top contractors
              </p>
            </div>
            <Button 
              size="lg" 
              style={{ backgroundColor: '#fce328', color: '#000' }}
              className="hover:opacity-90"
              onClick={() => setActiveTab("post-project")}
            >
              <Plus className="mr-2 h-5 w-5" />
              New Project
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Tab Navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 h-auto p-1 bg-white shadow rounded-lg">
              <TabsTrigger value="overview" className="data-[state=active]:text-black" style={{ '--tw-bg-opacity': activeTab === 'overview' ? '1' : '0' } as React.CSSProperties} data-active={activeTab === 'overview'}>
                <Home className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="post-project" className="data-[state=active]:text-black">
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Post Project</span>
              </TabsTrigger>
              <TabsTrigger value="contractors" className="data-[state=active]:text-black">
                <Users className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Contractors</span>
              </TabsTrigger>
              <TabsTrigger value="tracking" className="data-[state=active]:text-black">
                <Briefcase className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Tracking</span>
              </TabsTrigger>
              <TabsTrigger value="messages" className="data-[state=active]:text-black">
                <MessageSquare className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Messages</span>
              </TabsTrigger>
              <TabsTrigger value="payments" className="data-[state=active]:text-black">
                <CreditCard className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Payments</span>
              </TabsTrigger>
            </TabsList>
            <style jsx>{`
              [data-state="active"] {
                background-color: #fce328 !important;
              }
            `}</style>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">Active Projects</CardTitle>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">2</div>
                  <p className="text-xs text-gray-600 mt-1">1 in progress, 1 completed</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">Total Spent</CardTitle>
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">$40,000</div>
                  <p className="text-xs text-gray-600 mt-1">Across all projects</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">Matched Contractors</CardTitle>
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">5</div>
                  <p className="text-xs text-gray-600 mt-1">Available for new projects</p>
                </CardContent>
              </Card>

              <Card className="bg-white shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">Avg. Rating</CardTitle>
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Star className="h-5 w-5 text-yellow-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">4.9</div>
                  <p className="text-xs text-gray-600 mt-1">From completed projects</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Projects */}
            <Card className="bg-white shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Recent Projects</CardTitle>
                    <CardDescription className="mt-1">Overview of your ongoing and past projects</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2">
                    View All <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projects.length === 0 ? (
                    <div className="p-12 text-center border-2 border-dashed rounded-lg bg-gray-50">
                      <Briefcase className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600 font-medium">No projects yet</p>
                      <p className="text-sm text-gray-500 mt-1">Post your first project to get started</p>
                      <Button className="mt-4 hover:opacity-90" style={{ backgroundColor: '#fce328', color: '#000' }} onClick={() => setActiveTab("post-project")}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Project
                      </Button>
                    </div>
                  ) : (
                    projects.map((project) => (
                      <div key={project.id} className="p-5 border rounded-lg bg-white hover:border-blue-300">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className="p-3 bg-blue-100 rounded-lg">
                              <Briefcase className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg text-gray-900">{project.title}</h3>
                              <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                Contractor: {project.contractor}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <Badge 
                              variant={project.status === "Completed" ? "default" : "secondary"}
                              className={project.status === "Completed" ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"}
                            >
                              {project.status === "Completed" ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}
                              {project.status}
                            </Badge>
                            <span className="font-bold text-lg text-gray-900">{project.budget}</span>
                            <Button size="sm" variant="ghost">
                              <ArrowUpRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white shadow">
              <CardHeader>
                <CardTitle className="text-xl">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" onClick={() => setActiveTab("post-project")}>
                    <Plus className="h-6 w-6" />
                    <span className="text-sm">New Project</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" onClick={() => setActiveTab("contractors")}>
                    <Users className="h-6 w-6" />
                    <span className="text-sm">Find Contractors</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" onClick={() => setActiveTab("messages")}>
                    <MessageSquare className="h-6 w-6" />
                    <span className="text-sm">Messages</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" onClick={() => setActiveTab("payments")}>
                    <CreditCard className="h-6 w-6" />
                    <span className="text-sm">Payments</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="post-project">
            <Card className="bg-white shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Plus className="h-6 w-6" />
                  Post a New Project
                </CardTitle>
                <CardDescription>Submit project details for AI-powered contractor matching</CardDescription>
              </CardHeader>
              <CardContent className="p-6 md:p-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">Project Title *</label>
                    <input
                      className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="e.g., Kitchen Renovation"
                      value={projectTitle}
                      onChange={(e) => setProjectTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">Project Description *</label>
                    <textarea
                      className="w-full p-3 border-2 rounded-lg h-40 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                      placeholder="Describe your project in detail... Include materials, scope, and any specific requirements."
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                    />
                    <p className="text-xs text-slate-500">Be as detailed as possible for better contractor matches</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Budget Range *
                      </label>
                      <select
                        className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        value={projectBudget}
                        onChange={(e) => setProjectBudget(e.target.value)}
                      >
                        <option value="">Select budget range...</option>
                        <option value="$5,000 - $15,000">$5,000 - $15,000</option>
                        <option value="$15,000 - $30,000">$15,000 - $30,000</option>
                        <option value="$30,000 - $50,000">$30,000 - $50,000</option>
                        <option value="$50,000+">$50,000+</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Timeline *
                      </label>
                      <select
                        className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        value={projectTimeline}
                        onChange={(e) => setProjectTimeline(e.target.value)}
                      >
                        <option value="">Select timeline...</option>
                        <option value="1-2 weeks">1-2 weeks</option>
                        <option value="1 month">1 month</option>
                        <option value="2-3 months">2-3 months</option>
                        <option value="3+ months">3+ months</option>
                      </select>
                    </div>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex gap-3">
                      <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-1">AI-Powered Matching</h4>
                        <p className="text-sm text-blue-700">Our AI will analyze your project and match you with the most qualified contractors based on expertise, ratings, and availability.</p>
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full h-12 text-lg hover:opacity-90"
                    style={{ backgroundColor: '#fce328', color: '#000' }}
                    onClick={handleSubmitProject}
                    disabled={isSubmittingProject}
                  >
                    {isSubmittingProject ? (
                      <>
                        <Clock className="mr-2 h-5 w-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-5 w-5" />
                        Submit Project for Matching
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contractors">
            <Card className="bg-white shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <Users className="h-6 w-6 text-blue-600" />
                      Matched Contractors
                    </CardTitle>
                    <CardDescription className="text-base mt-1">AI-recommended contractors for your projects</CardDescription>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700">
                    {matchedContractors.length} Available
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {matchedContractors.length === 0 ? (
                    <div className="p-12 text-center border-2 border-dashed rounded-lg bg-gray-50">
                      <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600 font-medium">No matches yet</p>
                      <p className="text-sm text-gray-500 mt-1">Submit a project to get matched with contractors</p>
                      <Button className="mt-4 hover:opacity-90" style={{ backgroundColor: '#fce328', color: '#000' }} onClick={() => setActiveTab("post-project")}>
                        <Plus className="mr-2 h-4 w-4" />
                        Post Project
                      </Button>
                    </div>
                  ) : (
                    matchedContractors.map((contractor) => (
                      <div key={contractor.id} className="p-6 border rounded-lg bg-white hover:border-blue-300">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <Avatar className="h-16 w-16 border-2 border-blue-200">
                              <AvatarImage src={`/contractor-${contractor.id}.jpg`} />
                              <AvatarFallback className="text-lg font-bold bg-blue-600 text-white">
                                {contractor.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <h3 className="font-bold text-xl text-gray-900">{contractor.name}</h3>
                              <div className="flex items-center gap-2 mt-2">
                                <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-md">
                                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                  <span className="text-sm font-semibold text-yellow-700">{contractor.rating}/5</span>
                                </div>
                                <Separator orientation="vertical" className="h-4" />
                                <div className="flex flex-wrap gap-1">
                                  {contractor.specialties.map((specialty, idx) => (
                                    <Badge key={idx} variant="secondary" className="text-xs">
                                      {specialty}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 mt-2">
                                Verified contractor with 50+ completed projects
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 md:items-end">
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-200 text-base px-3 py-1">
                              {contractor.price}
                            </Badge>
                            <Button 
                              className="hover:opacity-90"
                              style={{ backgroundColor: '#fce328', color: '#000' }}
                              onClick={() => handleViewProfile(contractor.name)} 
                              aria-label={`View ${contractor.name} profile`}
                            >
                              View Profile
                              <ArrowUpRight className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tracking">
            <Card className="bg-white shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Briefcase className="h-6 w-6 text-blue-600" />
                  Project Tracking
                </CardTitle>
                <CardDescription className="text-base mt-1">Real-time status, progress updates, and shared documents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-6 border rounded-lg bg-white">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-xl text-slate-900">Kitchen Renovation</h3>
                        <p className="text-sm text-slate-600 mt-1">ABC Construction • Started Oct 15, 2025</p>
                      </div>
                      <Badge className="bg-blue-500 hover:bg-blue-600">
                        <Clock className="h-3 w-3 mr-1" />
                        In Progress
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-slate-700">Overall Progress</span>
                        <span className="text-2xl font-bold text-blue-600">65%</span>
                      </div>
                      <Progress value={65} className="h-3" />
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <div className="p-4 bg-white rounded-lg border">
                          <div className="flex items-center gap-2 text-green-600 mb-2">
                            <CheckCircle2 className="h-5 w-5" />
                            <span className="font-semibold">Completed</span>
                          </div>
                          <p className="text-sm text-slate-600">Demolition, Plumbing, Electrical</p>
                        </div>
                        <div className="p-4 bg-white rounded-lg border border-blue-300">
                          <div className="flex items-center gap-2 text-blue-600 mb-2">
                            <Clock className="h-5 w-5" />
                            <span className="font-semibold">In Progress</span>
                          </div>
                          <p className="text-sm text-slate-600">Cabinet Installation, Countertops</p>
                        </div>
                        <div className="p-4 bg-white rounded-lg border">
                          <div className="flex items-center gap-2 text-slate-400 mb-2">
                            <AlertCircle className="h-5 w-5" />
                            <span className="font-semibold">Pending</span>
                          </div>
                          <p className="text-sm text-slate-600">Backsplash, Final Inspection</p>
                        </div>
                      </div>

                      <Separator className="my-4" />

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <FileText className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-blue-900">Latest Update</p>
                            <p className="text-sm text-blue-700 mt-1">Cabinets installed successfully. Working on countertop measurements. Expected completion: Nov 20, 2025</p>
                            <p className="text-xs text-blue-600 mt-2">Updated 2 hours ago</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" className="flex-1">
                          <FileText className="mr-2 h-4 w-4" />
                          View Documents
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Contact Contractor
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="p-6 border rounded-lg bg-white">
                    <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      Project Timeline
                    </h4>
                    <div className="space-y-4">
                      {[
                        { date: "Oct 15", title: "Project Started", status: "completed" },
                        { date: "Oct 18", title: "Demolition Complete", status: "completed" },
                        { date: "Oct 25", title: "Plumbing & Electrical", status: "completed" },
                        { date: "Nov 5", title: "Cabinet Installation", status: "current" },
                        { date: "Nov 15", title: "Countertops & Backsplash", status: "pending" },
                        { date: "Nov 20", title: "Final Inspection", status: "pending" },
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4">
                          <div className={`w-3 h-3 rounded-full ${
                            item.status === "completed" ? "bg-green-500" :
                            item.status === "current" ? "bg-blue-500 animate-pulse" :
                            "bg-slate-300"
                          }`} />
                          <div className="flex-1">
                            <p className={`font-semibold ${item.status === "current" ? "text-blue-600" : ""}`}>
                              {item.title}
                            </p>
                            <p className="text-sm text-slate-500">{item.date}</p>
                          </div>
                          {item.status === "completed" && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                          {item.status === "current" && <Clock className="h-5 w-5 text-blue-500" />}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Conversations List */}
              <Card className="bg-white shadow lg:col-span-1">
                <CardHeader>
                  <CardTitle className="text-lg">Conversations</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-1">
                    {[
                      { name: "ABC Construction", message: "The countertops will be delivered...", time: "2h ago", unread: 2, avatar: "AC", color: "#3b82f6" },
                      { name: "XYZ Builders", message: "Project completed! Please review...", time: "1d ago", unread: 0, avatar: "XB", color: "#8b5cf6" },
                    ].map((conv, idx) => (
                      <div key={idx} className={`p-4 hover:bg-blue-50 cursor-pointer transition-colors border-l-4 ${idx === 0 ? "border-l-blue-600 bg-blue-50" : "border-l-transparent"}`}>
                        <div className="flex items-start gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="text-white font-bold" style={{ backgroundColor: conv.color }}>
                              {conv.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-semibold text-sm truncate">{conv.name}</p>
                              {conv.unread > 0 && (
                                <Badge className="bg-red-500 hover:bg-red-600 h-5 w-5 p-0 flex items-center justify-center text-xs">
                                  {conv.unread}
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-slate-600 truncate mt-1">{conv.message}</p>
                            <p className="text-xs text-slate-400 mt-1">{conv.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Active Conversation */}
              <Card className="bg-white shadow lg:col-span-2">
                <CardHeader className="bg-gray-100">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="text-white font-bold" style={{ backgroundColor: '#3b82f6' }}>
                        AC
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-xl">ABC Construction</CardTitle>
                      <CardDescription>Kitchen Renovation Project</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                    {/* Received Message */}
                    <div className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-white text-xs font-bold" style={{ backgroundColor: '#3b82f6' }}>
                          AC
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="bg-slate-100 rounded-2xl rounded-tl-none p-4 max-w-md">
                          <p className="text-sm">The countertops will be delivered tomorrow morning. We'll start installation right away.</p>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 ml-2">2 hours ago</p>
                      </div>
                    </div>

                    {/* Sent Message */}
                    <div className="flex gap-3 justify-end">
                      <div className="flex-1 flex flex-col items-end">
                        <div className="rounded-2xl rounded-tr-none p-4 max-w-md" style={{ backgroundColor: '#fce328', color: '#000' }}>
                          <p className="text-sm">Great! Will someone be there to supervise the installation?</p>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 mr-2">1 hour ago</p>
                      </div>
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs font-bold" style={{ backgroundColor: '#fce328', color: '#000' }}>
                          {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    {/* Received Message */}
                    <div className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-white text-xs font-bold" style={{ backgroundColor: '#3b82f6' }}>
                          AC
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="bg-slate-100 rounded-2xl rounded-tl-none p-4 max-w-md">
                          <p className="text-sm">Yes, our project manager will be on-site from 8 AM to oversee everything.</p>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 ml-2">30 minutes ago</p>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  {/* Message Input */}
                  <div className="space-y-3">
                    <label htmlFor="message" className="block text-sm font-semibold text-slate-700">New Message</label>
                    <div className="flex gap-2">
                      <textarea
                        id="message"
                        className="flex-1 p-3 border-2 rounded-xl h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                        placeholder="Type your message..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-slate-500">Press Enter to send</p>
                      <Button 
                        className="hover:opacity-90"
                        style={{ backgroundColor: '#fce328', color: '#000' }}
                        onClick={handleSendMessage} 
                        disabled={isSendingMessage}
                      >
                        {isSendingMessage ? (
                          <>
                            <Clock className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            {/* Payment Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white shadow">
                <CardHeader>
                  <CardTitle className="text-sm font-medium flex items-center gap-2 text-gray-700">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </div>
                    Total Paid
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">$27,500</div>
                  <p className="text-xs text-gray-600 mt-1">2 transactions</p>
                </CardContent>
              </Card>

              <Card className="bg-white shadow">
                <CardHeader>
                  <CardTitle className="text-sm font-medium flex items-center gap-2 text-gray-700">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Clock className="h-4 w-4 text-orange-600" />
                    </div>
                    Pending
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">$12,500</div>
                  <p className="text-xs text-gray-600 mt-1">Due Nov 20, 2025</p>
                </CardContent>
              </Card>

              <Card className="bg-white shadow">
                <CardHeader>
                  <CardTitle className="text-sm font-medium flex items-center gap-2 text-gray-700">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <DollarSign className="h-4 w-4 text-blue-600" />
                    </div>
                    Total Budget
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">$40,000</div>
                  <p className="text-xs text-gray-600 mt-1">Across all projects</p>
                </CardContent>
              </Card>
            </div>

            {/* Payment History */}
            <Card className="bg-white shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <CreditCard className="h-6 w-6 text-blue-600" />
                      Payments & Invoices
                    </CardTitle>
                    <CardDescription className="text-base mt-1">View payment schedule and download receipts</CardDescription>
                  </div>
                  <Button variant="outline" className="gap-2">
                    <FileText className="h-4 w-4" />
                    Export All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { 
                      title: "Kitchen Renovation - Progress Payment", 
                      contractor: "ABC Construction", 
                      amount: "$12,500", 
                      status: "Paid", 
                      date: "Nov 1, 2025",
                      invoice: "INV-2025-001"
                    },
                    { 
                      title: "Bathroom Remodel - Final Payment", 
                      contractor: "XYZ Builders", 
                      amount: "$15,000", 
                      status: "Paid", 
                      date: "Oct 28, 2025",
                      invoice: "INV-2025-002"
                    },
                    { 
                      title: "Kitchen Renovation - Final Payment", 
                      contractor: "ABC Construction", 
                      amount: "$12,500", 
                      status: "Pending", 
                      date: "Due Nov 20, 2025",
                      invoice: "INV-2025-003"
                    },
                  ].map((payment, idx) => (
                    <div key={idx} className="p-6 border rounded-lg bg-white hover:border-blue-300">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className={`p-3 rounded-lg ${
                            payment.status === "Paid" ? "bg-green-100" : "bg-orange-100"
                          }`}>
                            {payment.status === "Paid" ? (
                              <CheckCircle2 className="h-6 w-6 text-green-600" />
                            ) : (
                              <Clock className="h-6 w-6 text-orange-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-lg text-gray-900">{payment.title}</h3>
                            <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-slate-600">
                              <span className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {payment.contractor}
                              </span>
                              <Separator orientation="vertical" className="h-4" />
                              <span className="flex items-center gap-1">
                                <FileText className="h-4 w-4" />
                                {payment.invoice}
                              </span>
                              <Separator orientation="vertical" className="h-4" />
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {payment.date}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-2xl font-bold text-slate-900">{payment.amount}</p>
                            <Badge 
                              className={payment.status === "Paid" 
                                ? "bg-green-500 hover:bg-green-600" 
                                : "bg-orange-500 hover:bg-orange-600"
                              }
                            >
                              {payment.status === "Paid" ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}
                              {payment.status}
                            </Badge>
                          </div>
                          {payment.status === "Paid" && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="gap-2"
                              onClick={() => handleDownloadReceipt(payment.title, payment.amount)} 
                              aria-label={`Download receipt for ${payment.title}`}
                            >
                              <Download className="h-4 w-4" />
                              Receipt
                            </Button>
                          )}
                          {payment.status === "Pending" && (
                            <Button 
                              size="sm" 
                              className="gap-2 hover:opacity-90"
                              style={{ backgroundColor: '#fce328', color: '#000' }}
                            >
                              <CreditCard className="h-4 w-4" />
                              Pay Now
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Support & Help Center - Always visible */}
        <Card className="mt-6 bg-white shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <HelpCircle className="h-6 w-6 text-blue-600" />
              Support & Help Center
            </CardTitle>
            <CardDescription>We're here to help you 24/7</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="h-auto p-6 flex flex-col items-center gap-3"
              >
                <div className="p-3 bg-blue-100 rounded-full">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <span className="font-semibold">Documentation</span>
                <span className="text-xs text-gray-500 text-center">Browse guides and tutorials</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto p-6 flex flex-col items-center gap-3"
              >
                <div className="p-3 bg-green-100 rounded-full">
                  <MessageSquare className="h-6 w-6 text-green-600" />
                </div>
                <span className="font-semibold">Live Chat</span>
                <span className="text-xs text-gray-500 text-center">Chat with our support team</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto p-6 flex flex-col items-center gap-3"
              >
                <div className="p-3 bg-purple-100 rounded-full">
                  <HelpCircle className="h-6 w-6 text-purple-600" />
                </div>
                <span className="font-semibold">FAQ</span>
                <span className="text-xs text-gray-500 text-center">Find quick answers</span>
              </Button>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;