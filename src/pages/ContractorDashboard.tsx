import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAppSelector } from "@/store/hooks";
import { useToast } from "@/hooks/use-toast";
import {
  BarChart3, Users, Briefcase, DollarSign, TrendingUp, Calendar,
  MessageSquare, Settings, FileText, Calculator, ShoppingCart, CreditCard,
  HelpCircle, Bell, Star, Clock, Target, Upload, Eye, CheckCircle,
  AlertCircle, Phone, Mail, MapPin, Edit, Trash2, Download, Send,
  Filter, Search, Plus, X, ArrowUpRight, ArrowDownRight, Package,
  Zap, TrendingDown, Activity, Award, Building
} from "lucide-react";

const ContractorDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { user } = useAppSelector((state) => state.auth);
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const stats = [
    { title: "New Leads", value: "12", change: "+3", trend: "up", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Active Projects", value: "8", change: "+2", trend: "up", icon: Briefcase, color: "text-green-600", bg: "bg-green-50" },
    { title: "Monthly Revenue", value: "$45,200", change: "+15%", trend: "up", icon: DollarSign, color: "text-yellow-600", bg: "bg-yellow-50" },
    { title: "Conversion Rate", value: "68%", change: "+5%", trend: "up", icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" }
  ];

  const recentLeads = [
    { id: 1, name: "Kitchen Renovation", client: "Sarah Johnson", email: "sarah.j@email.com", phone: "(555) 123-4567", budget: "$25,000", score: 95, status: "Hot", date: "2024-11-08", location: "Downtown, NY" },
    { id: 2, name: "Bathroom Remodel", client: "Mike Chen", email: "mike.c@email.com", phone: "(555) 234-5678", budget: "$15,000", score: 82, status: "Warm", date: "2024-11-07", location: "Brooklyn, NY" },
    { id: 3, name: "Deck Installation", client: "Lisa Brown", email: "lisa.b@email.com", phone: "(555) 345-6789", budget: "$8,000", score: 71, status: "Cold", date: "2024-11-06", location: "Queens, NY" },
    { id: 4, name: "Full Home Renovation", client: "David Wilson", email: "david.w@email.com", phone: "(555) 456-7890", budget: "$85,000", score: 98, status: "Hot", date: "2024-11-09", location: "Manhattan, NY" },
    { id: 5, name: "Basement Finishing", client: "Emma Davis", email: "emma.d@email.com", phone: "(555) 567-8901", budget: "$32,000", score: 88, status: "Warm", date: "2024-11-05", location: "Bronx, NY" }
  ];

  const activeProjects = [
    { id: 1, name: "Modern Kitchen Remodel", client: "Johnson Residence", progress: 75, deadline: "Dec 15, 2024", budget: "$25,000", spent: "$18,750", status: "On Track", team: 4 },
    { id: 2, name: "Master Bath Renovation", client: "Chen Family", progress: 45, deadline: "Jan 20, 2025", budget: "$15,000", spent: "$6,750", status: "On Track", team: 3 },
    { id: 3, name: "Outdoor Deck Build", client: "Brown House", progress: 90, deadline: "Dec 10, 2024", budget: "$8,000", spent: "$7,200", status: "Ahead", team: 2 },
    { id: 4, name: "Full Home Renovation", client: "Wilson Estate", progress: 30, deadline: "Mar 15, 2025", budget: "$85,000", spent: "$25,500", status: "On Track", team: 8 },
    { id: 5, name: "Basement Finishing", client: "Davis Home", progress: 60, deadline: "Feb 28, 2025", budget: "$32,000", spent: "$19,200", status: "On Track", team: 5 }
  ];

  const messages = [
    { id: 1, from: "Sarah Johnson", subject: "Kitchen Design Approval", preview: "I love the new design! Can we proceed with...", time: "2 hours ago", unread: true, avatar: "SJ" },
    { id: 2, from: "Mike Chen", subject: "Material Selection", preview: "I've reviewed the tile options and I prefer...", time: "5 hours ago", unread: true, avatar: "MC" },
    { id: 3, from: "Lisa Brown", subject: "Project Timeline", preview: "When can we schedule the final walkthrough?", time: "1 day ago", unread: false, avatar: "LB" },
    { id: 4, from: "David Wilson", subject: "Budget Discussion", preview: "I'd like to discuss some additional features...", time: "2 days ago", unread: false, avatar: "DW" }
  ];

  const materials = [
    { id: 1, name: "Premium Hardwood Flooring", category: "Flooring", supplier: "BuildMart", price: "$8.50/sqft", stock: "In Stock", rating: 4.8 },
    { id: 2, name: "Granite Countertop", category: "Kitchen", supplier: "Stone World", price: "$65/sqft", stock: "In Stock", rating: 4.9 },
    { id: 3, name: "Ceramic Tile - Porcelain", category: "Bathroom", supplier: "Tile Pro", price: "$4.25/sqft", stock: "Limited", rating: 4.7 },
    { id: 4, name: "Composite Decking", category: "Outdoor", supplier: "Deck Supply Co", price: "$12/sqft", stock: "In Stock", rating: 4.6 },
    { id: 5, name: "LED Recessed Lighting", category: "Electrical", supplier: "Light House", price: "$45/unit", stock: "In Stock", rating: 4.8 }
  ];

  const menuItems = [
    { id: "overview", label: "Dashboard", icon: BarChart3 },
    { id: "leads", label: "Leads Management", icon: Users },
    { id: "projects", label: "Projects", icon: Briefcase },
    { id: "takeoff", label: "AI Takeoff & Estimation", icon: Calculator },
    { id: "materials", label: "Material Pricing", icon: ShoppingCart },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "analytics", label: "Analytics & Reports", icon: BarChart3 },
    { id: "profile", label: "Profile Settings", icon: Settings },
    { id: "billing", label: "Subscription & Billing", icon: CreditCard },
    { id: "support", label: "Support", icon: HelpCircle }
  ];

  const handleAction = (action: string, item?: any) => {
    toast({
      title: "Action Performed",
      description: `${action} ${item ? `for ${item.name || item.client}` : 'successfully'}`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg fixed h-full overflow-y-auto">
        <div className="p-6 border-b bg-gradient-to-r from-yellow-400 to-yellow-500">
          <h2 className="text-xl font-bold text-gray-900">Contractor Portal</h2>
          <p className="text-sm text-gray-800 mt-1">Welcome, {user?.name || 'User'}!</p>
        </div>
        
        <nav className="mt-6 pb-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 transition-colors ${
                  activeTab === item.id ? 'bg-yellow-50 border-r-4 border-yellow-500 text-yellow-700 font-semibold' : 'text-gray-700'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8">
        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-gray-600 mt-1">Track your business performance and manage projects</p>
              </div>
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                <Bell className="w-4 h-4 mr-2" />
                Notifications (3)
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                const TrendIcon = stat.trend === "up" ? ArrowUpRight : ArrowDownRight;
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm text-gray-600 font-medium">{stat.title}</p>
                          <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                          <div className="flex items-center mt-2">
                            <TrendIcon className={`w-4 h-4 mr-1 ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`} />
                            <p className={`text-sm font-semibold ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                              {stat.change} this month
                            </p>
                          </div>
                        </div>
                        <div className={`${stat.bg} p-4 rounded-full`}>
                          <Icon className={`w-8 h-8 ${stat.color}`} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-blue-100">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Target className="w-5 h-5 mr-2 text-blue-600" />
                      Recent Leads (AI Scored)
                    </div>
                    <Badge variant="secondary">{recentLeads.length} Active</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {recentLeads.slice(0, 3).map((lead) => (
                      <div key={lead.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{lead.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{lead.client} • {lead.budget}</p>
                          <p className="text-xs text-gray-500 mt-1 flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {lead.location}
                          </p>
                        </div>
                        <div className="text-right ml-4">
                          <Badge variant={lead.status === 'Hot' ? 'default' : lead.status === 'Warm' ? 'secondary' : 'outline'} className="mb-2">
                            {lead.score}% Match
                          </Badge>
                          <p className="text-xs font-semibold text-gray-700">{lead.status} Lead</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4 font-semibold" onClick={() => setActiveTab("leads")}>
                    View All Leads →
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="border-b bg-gradient-to-r from-green-50 to-green-100">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Briefcase className="w-5 h-5 mr-2 text-green-600" />
                      Active Projects
                    </div>
                    <Badge variant="secondary">{activeProjects.length} Running</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {activeProjects.slice(0, 3).map((project) => (
                      <div key={project.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{project.name}</h4>
                          <Badge variant={project.status === "Ahead" ? "default" : "secondary"}>
                            {project.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{project.client} • Due: {project.deadline}</p>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                          <div 
                            className={`h-2.5 rounded-full ${project.progress >= 75 ? 'bg-green-500' : project.progress >= 50 ? 'bg-blue-500' : 'bg-yellow-500'}`}
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600 font-medium">{project.progress}% Complete</span>
                          <span className="text-gray-500">{project.spent} / {project.budget}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4 font-semibold" onClick={() => setActiveTab("projects")}>
                    View All Projects →
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-yellow-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-24 flex-col hover:bg-yellow-50 hover:border-yellow-500 transition-all" onClick={() => setActiveTab("takeoff")}>
                    <Upload className="w-6 h-6 mb-2 text-blue-600" />
                    <span className="font-semibold">Upload Drawings</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex-col hover:bg-yellow-50 hover:border-yellow-500 transition-all" onClick={() => setActiveTab("takeoff")}>
                    <Calculator className="w-6 h-6 mb-2 text-green-600" />
                    <span className="font-semibold">Create Estimate</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex-col hover:bg-yellow-50 hover:border-yellow-500 transition-all" onClick={() => setActiveTab("messages")}>
                    <MessageSquare className="w-6 h-6 mb-2 text-purple-600" />
                    <span className="font-semibold">Message Client</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex-col hover:bg-yellow-50 hover:border-yellow-500 transition-all" onClick={() => setActiveTab("analytics")}>
                    <FileText className="w-6 h-6 mb-2 text-orange-600" />
                    <span className="font-semibold">Generate Report</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* LEADS MANAGEMENT TAB */}
        {activeTab === "leads" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Leads Management</h1>
                <p className="text-gray-600 mt-1">AI-powered lead scoring and management</p>
              </div>
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                <Plus className="w-4 h-4 mr-2" />
                Add New Lead
              </Button>
            </div>

            <Card>
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <CardTitle>All Leads ({recentLeads.length})</CardTitle>
                  <div className="flex gap-3">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                      <Input 
                        placeholder="Search leads..." 
                        className="pl-10 w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Button variant="outline">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Project</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Client</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Contact</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Budget</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">AI Score</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {recentLeads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-semibold text-gray-900">{lead.name}</p>
                              <p className="text-sm text-gray-500 flex items-center mt-1">
                                <MapPin className="w-3 h-3 mr-1" />
                                {lead.location}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-medium text-gray-900">{lead.client}</p>
                            <p className="text-sm text-gray-500">{lead.date}</p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <p className="text-sm text-gray-600 flex items-center">
                                <Mail className="w-3 h-3 mr-1" />
                                {lead.email}
                              </p>
                              <p className="text-sm text-gray-600 flex items-center">
                                <Phone className="w-3 h-3 mr-1" />
                                {lead.phone}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-semibold text-gray-900">{lead.budget}</p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                <div 
                                  className={`h-2 rounded-full ${lead.score >= 90 ? 'bg-green-500' : lead.score >= 75 ? 'bg-blue-500' : 'bg-yellow-500'}`}
                                  style={{ width: `${lead.score}%` }}
                                ></div>
                              </div>
                              <span className="font-semibold text-sm">{lead.score}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant={lead.status === 'Hot' ? 'default' : lead.status === 'Warm' ? 'secondary' : 'outline'}>
                              {lead.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => handleAction("View", lead)}>
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleAction("Contact", lead)}>
                                <Send className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* PROJECTS TAB */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Active Projects</h1>
                <p className="text-gray-600 mt-1">Manage and track all your construction projects</p>
              </div>
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {activeProjects.map((project) => (
                <Card key={project.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-gray-100">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <Badge variant={project.status === "Ahead" ? "default" : "secondary"}>
                        {project.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{project.client}</p>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Budget</p>
                        <p className="text-lg font-bold text-gray-900">{project.budget}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Spent</p>
                        <p className="text-lg font-bold text-gray-900">{project.spent}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Deadline</p>
                        <p className="text-sm font-semibold text-gray-700 flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {project.deadline}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Team Size</p>
                        <p className="text-sm font-semibold text-gray-700 flex items-center">
                          <Users className="w-3 h-3 mr-1" />
                          {project.team} Members
                        </p>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-gray-700">Progress</p>
                        <p className="text-sm font-bold text-gray-900">{project.progress}%</p>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all ${
                            project.progress >= 75 ? 'bg-green-500' : 
                            project.progress >= 50 ? 'bg-blue-500' : 'bg-yellow-500'
                          }`}
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" className="flex-1" onClick={() => handleAction("View Details", project)}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      <Button variant="outline" className="flex-1" onClick={() => handleAction("Update", project)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Update
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* AI TAKEOFF & ESTIMATION TAB */}
        {activeTab === "takeoff" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI Takeoff & Estimation</h1>
              <p className="text-gray-600 mt-1">Upload drawings and get instant AI-powered quantity takeoffs and cost estimates</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader className="border-b">
                  <CardTitle className="flex items-center">
                    <Upload className="w-5 h-5 mr-2 text-blue-600" />
                    Upload Project Drawings
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-yellow-500 transition-colors cursor-pointer">
                    <Upload className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Drop your files here</h3>
                    <p className="text-sm text-gray-600 mb-4">or click to browse</p>
                    <p className="text-xs text-gray-500">Supports: PDF, DWG, DXF, PNG, JPG (Max 50MB)</p>
                    <Button className="mt-6 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                      Select Files
                    </Button>
                  </div>

                  <div className="mt-6 space-y-3">
                    <h4 className="font-semibold text-gray-900">Recent Uploads</h4>
                    {[
                      { name: "Kitchen-Floor-Plan.pdf", size: "2.4 MB", date: "Nov 8, 2024", status: "Processed" },
                      { name: "Bathroom-Layout.dwg", size: "1.8 MB", date: "Nov 7, 2024", status: "Processed" },
                      { name: "Deck-Design.pdf", size: "3.1 MB", date: "Nov 6, 2024", status: "Processing" }
                    ].map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center flex-1">
                          <FileText className="w-8 h-8 text-blue-600 mr-3" />
                          <div>
                            <p className="font-semibold text-gray-900">{file.name}</p>
                            <p className="text-sm text-gray-500">{file.size} • {file.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={file.status === "Processed" ? "default" : "secondary"}>
                            {file.status}
                          </Badge>
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="border-b bg-gradient-to-r from-green-50 to-green-100">
                  <CardTitle className="flex items-center">
                    <Calculator className="w-5 h-5 mr-2 text-green-600" />
                    Quick Estimate
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <Label htmlFor="project-type">Project Type</Label>
                    <select id="project-type" className="w-full mt-1 p-2 border rounded-md">
                      <option>Kitchen Remodel</option>
                      <option>Bathroom Renovation</option>
                      <option>Deck Installation</option>
                      <option>Full Home Renovation</option>
                      <option>Basement Finishing</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="square-footage">Square Footage</Label>
                    <Input id="square-footage" type="number" placeholder="Enter sq ft" className="mt-1" />
                  </div>

                  <div>
                    <Label htmlFor="quality-level">Quality Level</Label>
                    <select id="quality-level" className="w-full mt-1 p-2 border rounded-md">
                      <option>Standard</option>
                      <option>Premium</option>
                      <option>Luxury</option>
                    </select>
                  </div>

                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold">
                    <Calculator className="w-4 h-4 mr-2" />
                    Generate Estimate
                  </Button>

                  <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-gray-600 mb-2">Estimated Cost Range</p>
                    <p className="text-2xl font-bold text-green-700">$18,500 - $24,000</p>
                    <p className="text-xs text-gray-500 mt-2">Based on AI analysis and market data</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* MATERIAL PRICING TAB */}
        {activeTab === "materials" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Material Pricing Database</h1>
                <p className="text-gray-600 mt-1">Real-time pricing from trusted suppliers</p>
              </div>
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                <Plus className="w-4 h-4 mr-2" />
                Add Material
              </Button>
            </div>

            <Card>
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <CardTitle>Material Catalog</CardTitle>
                  <div className="flex gap-3">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                      <Input placeholder="Search materials..." className="pl-10 w-64" />
                    </div>
                    <select className="p-2 border rounded-md">
                      <option>All Categories</option>
                      <option>Flooring</option>
                      <option>Kitchen</option>
                      <option>Bathroom</option>
                      <option>Outdoor</option>
                      <option>Electrical</option>
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Material</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Category</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Supplier</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Price</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Stock</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Rating</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {materials.map((material) => (
                        <tr key={material.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <Package className="w-8 h-8 text-gray-400 mr-3" />
                              <p className="font-semibold text-gray-900">{material.name}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant="outline">{material.category}</Badge>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-gray-700">{material.supplier}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-bold text-gray-900">{material.price}</p>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant={material.stock === "In Stock" ? "default" : "secondary"}>
                              {material.stock}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
                              <span className="font-semibold">{material.rating}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => handleAction("Add to Quote", material)}>
                                <Plus className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleAction("View Details", material)}>
                                <Eye className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* MESSAGES TAB */}
        {activeTab === "messages" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
              <p className="text-gray-600 mt-1">Communicate with clients and team members</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-1">
                <CardHeader className="border-b">
                  <CardTitle>Conversations</CardTitle>
                  <div className="relative mt-3">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <Input placeholder="Search messages..." className="pl-10" />
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y max-h-[600px] overflow-y-auto">
                    {messages.map((message) => (
                      <div 
                        key={message.id} 
                        className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${message.unread ? 'bg-blue-50' : ''}`}
                        onClick={() => setSelectedItem(message)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold">
                            {message.avatar}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-semibold text-gray-900 truncate">{message.from}</p>
                              {message.unread && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                            </div>
                            <p className="text-sm font-medium text-gray-700 truncate">{message.subject}</p>
                            <p className="text-sm text-gray-500 truncate">{message.preview}</p>
                            <p className="text-xs text-gray-400 mt-1">{message.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold">
                        SJ
                      </div>
                      <div>
                        <CardTitle className="text-lg">Sarah Johnson</CardTitle>
                        <p className="text-sm text-gray-500">Kitchen Design Approval</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Mail className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold text-sm">
                        SJ
                      </div>
                      <div className="flex-1">
                        <div className="bg-gray-100 rounded-lg p-4">
                          <p className="text-sm text-gray-900">Hi! I love the new kitchen design you sent over. The layout looks perfect for our space. Can we proceed with the installation?</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                      </div>
                    </div>

                    <div className="flex gap-3 justify-end">
                      <div className="flex-1 max-w-md">
                        <div className="bg-yellow-500 rounded-lg p-4">
                          <p className="text-sm text-gray-900">That's great to hear! Yes, we can start the installation next week. I'll send over the final contract and timeline today.</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 text-right">1 hour ago</p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                        ME
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex gap-3">
                      <Textarea 
                        placeholder="Type your message..." 
                        className="flex-1 min-h-[80px]"
                        value={formData.message || ''}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                      />
                      <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold h-[80px]" onClick={() => handleAction("Send Message")}>
                        <Send className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* ANALYTICS & REPORTS TAB */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
                <p className="text-gray-600 mt-1">Track performance metrics and generate reports</p>
              </div>
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Total Revenue", value: "$542,300", change: "+18.2%", icon: DollarSign, color: "text-green-600", bg: "bg-green-50" },
                { title: "Projects Completed", value: "47", change: "+12", icon: CheckCircle, color: "text-blue-600", bg: "bg-blue-50" },
                { title: "Client Satisfaction", value: "4.8/5", change: "+0.3", icon: Star, color: "text-yellow-600", bg: "bg-yellow-50" },
                { title: "Avg. Project Time", value: "42 days", change: "-5 days", icon: Clock, color: "text-purple-600", bg: "bg-purple-50" }
              ].map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <Card key={idx} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm text-gray-600 font-medium">{stat.title}</p>
                          <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                          <p className="text-sm text-green-600 font-semibold mt-1">{stat.change}</p>
                        </div>
                        <div className={`${stat.bg} p-3 rounded-full`}>
                          <Icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="border-b">
                  <CardTitle className="flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-blue-600" />
                    Revenue Trend (Last 6 Months)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {[
                      { month: "June", revenue: 72000, projects: 8 },
                      { month: "July", revenue: 85000, projects: 9 },
                      { month: "August", revenue: 78000, projects: 7 },
                      { month: "September", revenue: 92000, projects: 10 },
                      { month: "October", revenue: 88000, projects: 9 },
                      { month: "November", revenue: 95000, projects: 11 }
                    ].map((data, idx) => (
                      <div key={idx} className="flex items-center gap-4">
                        <p className="text-sm font-medium text-gray-700 w-24">{data.month}</p>
                        <div className="flex-1">
                          <div className="w-full bg-gray-200 rounded-full h-8 relative">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-blue-600 h-8 rounded-full flex items-center justify-end pr-3"
                              style={{ width: `${(data.revenue / 100000) * 100}%` }}
                            >
                              <span className="text-xs font-bold text-white">${(data.revenue / 1000).toFixed(0)}k</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 w-20">{data.projects} projects</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="border-b">
                  <CardTitle className="flex items-center">
                    <Award className="w-5 h-5 mr-2 text-yellow-600" />
                    Top Performing Projects
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {[
                      { name: "Luxury Kitchen Remodel", profit: "$12,500", margin: "28%", rating: 5.0 },
                      { name: "Master Suite Addition", profit: "$18,200", margin: "32%", rating: 4.9 },
                      { name: "Modern Bathroom", profit: "$8,900", margin: "25%", rating: 4.8 },
                      { name: "Outdoor Living Space", profit: "$15,600", margin: "30%", rating: 4.9 },
                      { name: "Home Office Build", profit: "$6,800", margin: "22%", rating: 4.7 }
                    ].map((project, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{project.name}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <p className="text-sm text-gray-600">Profit: <span className="font-bold text-green-600">{project.profit}</span></p>
                            <p className="text-sm text-gray-600">Margin: <span className="font-bold">{project.margin}</span></p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="font-bold text-sm">{project.rating}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* PROFILE SETTINGS TAB */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
              <p className="text-gray-600 mt-1">Manage your contractor profile and business information</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader className="border-b">
                  <CardTitle>Business Information</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="company-name">Company Name</Label>
                      <Input id="company-name" defaultValue="Elite Construction Co." className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="license-number">License Number</Label>
                      <Input id="license-number" defaultValue="LC-2024-12345" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" defaultValue="(555) 123-4567" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" defaultValue="contact@eliteconstruction.com" className="mt-1" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Business Address</Label>
                    <Input id="address" defaultValue="123 Construction Ave, New York, NY 10001" className="mt-1" />
                  </div>

                  <div>
                    <Label htmlFor="bio">Company Bio</Label>
                    <Textarea 
                      id="bio" 
                      className="mt-1 min-h-[120px]"
                      defaultValue="Elite Construction Co. has been serving the New York area for over 15 years. We specialize in residential renovations, kitchen and bathroom remodels, and custom home builds. Our team of certified professionals is committed to delivering exceptional quality and customer satisfaction."
                    />
                  </div>

                  <div>
                    <Label>Specializations</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                      {["Kitchen Remodeling", "Bathroom Renovation", "Deck Building", "Home Additions", "Basement Finishing", "Custom Homes"].map((spec) => (
                        <div key={spec} className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked className="rounded" />
                          <label className="text-sm text-gray-700">{spec}</label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold" onClick={() => handleAction("Save Profile")}>
                      Save Changes
                    </Button>
                    <Button variant="outline">Cancel</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="border-b">
                  <CardTitle>Profile Photo</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 flex items-center justify-center text-white text-4xl font-bold mb-4">
                      EC
                    </div>
                    <Button variant="outline" className="w-full">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Photo
                    </Button>
                  </div>

                  <div className="border-t pt-4 space-y-3">
                    <h4 className="font-semibold text-gray-900">Quick Stats</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Member Since</span>
                        <span className="text-sm font-semibold">Jan 2020</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Projects Completed</span>
                        <span className="text-sm font-semibold">47</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Client Rating</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-sm font-semibold">4.8</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Response Time</span>
                        <span className="text-sm font-semibold">2 hours</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Certifications</h4>
                    <div className="space-y-2">
                      {["Licensed Contractor", "Insured & Bonded", "EPA Lead-Safe Certified"].map((cert) => (
                        <div key={cert} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-gray-700">{cert}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* BILLING TAB */}
        {activeTab === "billing" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Subscription & Billing</h1>
              <p className="text-gray-600 mt-1">Manage your subscription plan and payment methods</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader className="border-b bg-gradient-to-r from-yellow-50 to-yellow-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">Professional Plan</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">Your current subscription</p>
                    </div>
                    <Badge className="bg-green-600 text-white">Active</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-sm text-gray-600">Monthly Cost</p>
                      <p className="text-3xl font-bold text-gray-900 mt-1">$99</p>
                      <p className="text-xs text-gray-500 mt-1">per month</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Next Billing Date</p>
                      <p className="text-lg font-semibold text-gray-900 mt-1">Dec 10, 2024</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Payment Method</p>
                      <p className="text-lg font-semibold text-gray-900 mt-1">•••• 4242</p>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Plan Features</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        "Unlimited AI Takeoffs",
                        "Advanced Cost Estimation",
                        "Lead Scoring & Management",
                        "Material Price Database",
                        "Project Management Tools",
                        "Client Communication Portal",
                        "Analytics & Reporting",
                        "Priority Support"
                      ].map((feature) => (
                        <div key={feature} className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button variant="outline" onClick={() => handleAction("Upgrade Plan")}>
                      Upgrade Plan
                    </Button>
                    <Button variant="outline" onClick={() => handleAction("Change Payment Method")}>
                      Change Payment Method
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="border-b">
                  <CardTitle>Billing History</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {[
                      { date: "Nov 10, 2024", amount: "$99.00", status: "Paid" },
                      { date: "Oct 10, 2024", amount: "$99.00", status: "Paid" },
                      { date: "Sep 10, 2024", amount: "$99.00", status: "Paid" },
                      { date: "Aug 10, 2024", amount: "$99.00", status: "Paid" }
                    ].map((invoice, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-semibold text-gray-900">{invoice.amount}</p>
                          <p className="text-xs text-gray-500">{invoice.date}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            {invoice.status}
                          </Badge>
                          <Button size="sm" variant="ghost">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    View All Invoices
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="border-b">
                <CardTitle>Available Plans</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { name: "Starter", price: "$49", features: ["10 AI Takeoffs/month", "Basic Estimation", "Lead Management", "Email Support"] },
                    { name: "Professional", price: "$99", features: ["Unlimited AI Takeoffs", "Advanced Estimation", "Lead Scoring", "Priority Support"], current: true },
                    { name: "Enterprise", price: "$199", features: ["Everything in Pro", "Custom Integrations", "Dedicated Account Manager", "24/7 Phone Support"] }
                  ].map((plan) => (
                    <Card key={plan.name} className={`${plan.current ? 'border-2 border-yellow-500' : ''}`}>
                      <CardHeader className={`${plan.current ? 'bg-yellow-50' : ''}`}>
                        <CardTitle className="text-xl">{plan.name}</CardTitle>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{plan.price}<span className="text-sm font-normal text-gray-600">/month</span></p>
                      </CardHeader>
                      <CardContent className="p-6">
                        <ul className="space-y-3 mb-6">
                          {plan.features.map((feature) => (
                            <li key={feature} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700">{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <Button 
                          className={`w-full ${plan.current ? 'bg-yellow-500 hover:bg-yellow-600 text-black' : ''}`}
                          variant={plan.current ? 'default' : 'outline'}
                          disabled={plan.current}
                        >
                          {plan.current ? 'Current Plan' : 'Upgrade'}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* SUPPORT TAB */}
        {activeTab === "support" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Support Center</h1>
              <p className="text-gray-600 mt-1">Get help and find answers to your questions</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader className="border-b">
                  <CardTitle>Submit a Support Ticket</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <Label htmlFor="ticket-subject">Subject</Label>
                    <Input 
                      id="ticket-subject" 
                      placeholder="Brief description of your issue" 
                      className="mt-1"
                      value={formData.subject || ''}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="ticket-category">Category</Label>
                    <select 
                      id="ticket-category" 
                      className="w-full mt-1 p-2 border rounded-md"
                      value={formData.category || ''}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                    >
                      <option value="">Select a category</option>
                      <option>Technical Issue</option>
                      <option>Billing Question</option>
                      <option>Feature Request</option>
                      <option>Account Management</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="ticket-priority">Priority</Label>
                    <select 
                      id="ticket-priority" 
                      className="w-full mt-1 p-2 border rounded-md"
                      value={formData.priority || ''}
                      onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    >
                      <option value="">Select priority</option>
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                      <option>Urgent</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="ticket-description">Description</Label>
                    <Textarea 
                      id="ticket-description" 
                      placeholder="Please provide detailed information about your issue..." 
                      className="mt-1 min-h-[150px]"
                      value={formData.description || ''}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label>Attachments (Optional)</Label>
                    <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-yellow-500 transition-colors cursor-pointer">
                      <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">Click to upload screenshots or files</p>
                      <p className="text-xs text-gray-500 mt-1">Max file size: 10MB</p>
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold" 
                    onClick={() => {
                      handleAction("Submit Ticket");
                      setFormData({});
                    }}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Submit Ticket
                  </Button>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card>
                  <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-blue-100">
                    <CardTitle className="flex items-center">
                      <HelpCircle className="w-5 h-5 mr-2 text-blue-600" />
                      Quick Help
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Contact Options</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm">
                          <Mail className="w-4 h-4 text-gray-600" />
                          <div>
                            <p className="font-medium text-gray-900">Email Support</p>
                            <p className="text-gray-600">support@platform.com</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <Phone className="w-4 h-4 text-gray-600" />
                          <div>
                            <p className="font-medium text-gray-900">Phone Support</p>
                            <p className="text-gray-600">(555) 999-8888</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <Clock className="w-4 h-4 text-gray-600" />
                          <div>
                            <p className="font-medium text-gray-900">Business Hours</p>
                            <p className="text-gray-600">Mon-Fri, 9AM-6PM EST</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Response Times</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Urgent:</span>
                          <span className="font-semibold">1-2 hours</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">High:</span>
                          <span className="font-semibold">4-6 hours</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Medium:</span>
                          <span className="font-semibold">24 hours</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Low:</span>
                          <span className="font-semibold">48 hours</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="border-b">
                    <CardTitle>Popular Resources</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      {[
                        "Getting Started Guide",
                        "AI Takeoff Tutorial",
                        "Lead Management Tips",
                        "Billing & Payments FAQ",
                        "Video Tutorials"
                      ].map((resource) => (
                        <button 
                          key={resource}
                          className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-between group"
                          onClick={() => handleAction("View Resource", { name: resource })}
                        >
                          <span className="text-sm font-medium text-gray-900">{resource}</span>
                          <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-yellow-600" />
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Card>
              <CardHeader className="border-b">
                <CardTitle>Recent Tickets</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Ticket ID</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Subject</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Category</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Priority</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {[
                        { id: "#TK-1234", subject: "AI Takeoff not processing", category: "Technical", priority: "High", status: "In Progress", date: "Nov 9, 2024" },
                        { id: "#TK-1233", subject: "Billing question about upgrade", category: "Billing", priority: "Medium", status: "Resolved", date: "Nov 7, 2024" },
                        { id: "#TK-1232", subject: "Feature request: Export to Excel", category: "Feature Request", priority: "Low", status: "Under Review", date: "Nov 5, 2024" }
                      ].map((ticket) => (
                        <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-semibold text-blue-600">{ticket.id}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-medium text-gray-900">{ticket.subject}</p>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant="outline">{ticket.category}</Badge>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant={ticket.priority === "High" ? "default" : "secondary"}>
                              {ticket.priority}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant={ticket.status === "Resolved" ? "default" : "secondary"}>
                              {ticket.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-gray-600">{ticket.date}</p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractorDashboard;
