import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppSelector } from "@/store/hooks";
import {
  BarChart3,
  Users,
  Briefcase,
  DollarSign,
  TrendingUp,
  Calendar,
  MessageSquare,
  Settings,
  FileText,
  Calculator,
  ShoppingCart,
  CreditCard,
  HelpCircle,
  Bell,
  Star,
  Clock,
  Target,
  Upload,
  Eye,
  CheckCircle,
  AlertCircle
} from "lucide-react";

const ContractorDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { user } = useAppSelector((state) => state.auth);

  const stats = [
    { title: "New Leads", value: "12", change: "+3", icon: Users, color: "text-blue-600" },
    { title: "Active Projects", value: "8", change: "+2", icon: Briefcase, color: "text-green-600" },
    { title: "Monthly Revenue", value: "$45,200", change: "+15%", icon: DollarSign, color: "text-yellow-600" },
    { title: "Conversion Rate", value: "68%", change: "+5%", icon: TrendingUp, color: "text-purple-600" }
  ];

  const recentLeads = [
    { id: 1, name: "Kitchen Renovation", client: "Sarah Johnson", budget: "$25,000", score: 95, status: "Hot" },
    { id: 2, name: "Bathroom Remodel", client: "Mike Chen", budget: "$15,000", score: 82, status: "Warm" },
    { id: 3, name: "Deck Installation", client: "Lisa Brown", budget: "$8,000", score: 71, status: "Cold" }
  ];

  const activeProjects = [
    { id: 1, name: "Modern Kitchen", client: "Johnson Residence", progress: 75, deadline: "Dec 15" },
    { id: 2, name: "Master Bath", client: "Chen Family", progress: 45, deadline: "Jan 20" },
    { id: 3, name: "Outdoor Deck", client: "Brown House", progress: 90, deadline: "Dec 10" }
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

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            {user?.role === 'contractor' ? 'Contractor Portal' : 'Client Portal'}
          </h2>
          <p className="text-sm text-gray-600">
            Welcome back, {user?.name || 'User'}! ({user?.role === 'contractor' ? 'Contractor' : 'Client'})
          </p>
        </div>
        
        <nav className="mt-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 transition-colors ${
                  activeTab === item.id ? 'bg-yellow-50 border-r-2 border-yellow-500 text-yellow-700' : 'text-gray-700'
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
      <div className="flex-1 p-8">
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-gray-600">Track your business performance and manage projects</p>
              </div>
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                <Bell className="w-4 h-4 mr-2" />
                Notifications (3)
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">{stat.title}</p>
                          <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                          <p className="text-sm text-green-600">{stat.change} this month</p>
                        </div>
                        <Icon className={`w-8 h-8 ${stat.color}`} />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* New Leads */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="w-5 h-5 mr-2 text-blue-600" />
                    Recent Leads (AI Scored)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentLeads.map((lead) => (
                      <div key={lead.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-semibold">{lead.name}</h4>
                          <p className="text-sm text-gray-600">{lead.client} • {lead.budget}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={lead.status === 'Hot' ? 'default' : lead.status === 'Warm' ? 'secondary' : 'outline'}>
                            {lead.score}% Score
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">{lead.status} Lead</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    View All Leads
                  </Button>
                </CardContent>
              </Card>

              {/* Active Projects */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Briefcase className="w-5 h-5 mr-2 text-green-600" />
                    Active Projects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activeProjects.map((project) => (
                      <div key={project.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{project.name}</h4>
                          <span className="text-sm text-gray-600">Due: {project.deadline}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{project.client}</p>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{project.progress}% Complete</p>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    View All Projects
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-20 flex-col">
                    <Upload className="w-6 h-6 mb-2" />
                    Upload Drawings
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Calculator className="w-6 h-6 mb-2" />
                    Create Estimate
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <MessageSquare className="w-6 h-6 mb-2" />
                    Message Client
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <FileText className="w-6 h-6 mb-2" />
                    Generate Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Other Tab Contents */}
        {activeTab !== "overview" && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🚧</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {menuItems.find(item => item.id === activeTab)?.label}
            </h2>
            <p className="text-gray-600">This section is under development</p>
            <Button className="mt-4" onClick={() => setActiveTab("overview")}>
              Back to Dashboard
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractorDashboard;