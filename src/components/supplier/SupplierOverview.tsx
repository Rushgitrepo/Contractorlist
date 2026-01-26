import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import {
  DollarSign,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
  AlertTriangle,
  Bot,
  MessageSquare,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  Activity,
  Target,
  Award,
  Truck,
  BarChart3,
  Filter,
  Plus,
  ArrowRight,
  Zap,
  Star,
  Calendar,
  Building,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  CheckCircle2
} from 'lucide-react';

// Mock Data for Charts
const revenueData = [
  { name: 'Jan', value: 125000 },
  { name: 'Feb', value: 142000 },
  { name: 'Mar', value: 138000 },
  { name: 'Apr', value: 151000 },
  { name: 'May', value: 148000 },
  { name: 'Jun', value: 165000 },
  { name: 'Jul', value: 172000 },
  { name: 'Aug', value: 189000 },
  { name: 'Sep', value: 185000 },
  { name: 'Oct', value: 198000 },
  { name: 'Nov', value: 210000 },
  { name: 'Dec', value: 225000 },
];

const orderStatusData = [
  { name: 'Delivered', value: 45, color: '#10b981' },
  { name: 'Pending', value: 18, color: '#f59e0b' },
  { name: 'Confirmed', value: 12, color: '#3b82f6' },
  { name: 'Cancelled', value: 3, color: '#ef4444' },
];

const SupplierOverview = () => {
  const [isLive, setIsLive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  
  // Real-time data state
  const [realTimeStats, setRealTimeStats] = useState({
    monthlyRevenue: 156240,
    activeProducts: 1247,
    pendingOrders: 18,
    activeContractors: 89
  });

  // Real-time updates simulation
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setRealTimeStats(prev => ({
        monthlyRevenue: prev.monthlyRevenue + Math.floor(Math.random() * 100),
        activeProducts: prev.activeProducts + (Math.random() > 0.9 ? 1 : 0),
        pendingOrders: prev.pendingOrders + (Math.random() > 0.85 ? 1 : 0) - (Math.random() > 0.9 ? 1 : 0),
        activeContractors: prev.activeContractors + (Math.random() > 0.95 ? 1 : 0)
      }));
      setLastUpdate(new Date());
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [isLive]);

  // Enhanced stats with better metrics
  const stats = [
    {
      title: 'Monthly Revenue',
      value: `$${realTimeStats.monthlyRevenue.toLocaleString()}`,
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: DollarSign,
      description: 'vs last month',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Active Products',
      value: realTimeStats.activeProducts.toLocaleString(),
      change: '+23',
      changeType: 'positive' as const,
      icon: Package,
      description: 'in catalog',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Pending Orders',
      value: realTimeStats.pendingOrders.toString(),
      change: '+5',
      changeType: 'positive' as const,
      icon: ShoppingCart,
      description: 'awaiting fulfillment',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Active Contractors',
      value: realTimeStats.activeContractors.toString(),
      change: '+7',
      changeType: 'positive' as const,
      icon: Users,
      description: 'this month',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  const recentOrders = [
    {
      id: 'ORD-001',
      contractor: 'Turner Construction',
      product: 'Portland Cement - Type I',
      quantity: '500 bags',
      value: '$12,500',
      status: 'pending',
      date: '2 hours ago',
      priority: 'high',
      location: 'Austin, TX'
    },
    {
      id: 'ORD-002',
      contractor: 'ABC Construction',
      product: 'Rebar #4 - 20ft',
      quantity: '200 pieces',
      value: '$8,400',
      status: 'confirmed',
      date: '4 hours ago',
      priority: 'medium',
      location: 'Dallas, TX'
    },
    {
      id: 'ORD-003',
      contractor: 'Metro Builders',
      product: 'Ready Mix Concrete',
      quantity: '15 cubic yards',
      value: '$3,750',
      status: 'delivered',
      date: '1 day ago',
      priority: 'low',
      location: 'Houston, TX'
    }
  ];

  const lowStockItems = [
    { name: 'Rebar #4', current: 45, minimum: 100, unit: 'pieces', category: 'Steel' },
    { name: 'Portland Cement', current: 78, minimum: 200, unit: 'bags', category: 'Cement' },
    { name: 'Steel Beams 8"', current: 12, minimum: 25, unit: 'pieces', category: 'Steel' }
  ];

  const topProducts = [
    { name: 'Ready Mix Concrete', sales: '$45,200', growth: '+15%', orders: 156 },
    { name: 'Portland Cement', sales: '$38,900', growth: '+8%', orders: 134 },
    { name: 'Rebar #4', sales: '$29,600', growth: '+22%', orders: 98 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-3 h-3" />;
      case 'confirmed': return <CheckCircle className="w-3 h-3" />;
      case 'delivered': return <CheckCircle className="w-3 h-3" />;
      default: return <XCircle className="w-3 h-3" />;
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-8 bg-slate-50/50 dark:bg-slate-950/50 min-h-screen">
      {/* Professional Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">Good morning, BuildMart Supply</h1>
            <Badge className="bg-green-100 text-green-800 font-semibold">
              <Activity className="w-3 h-3 mr-1" />
              Active
            </Badge>
          </div>
          <p className="text-gray-600 text-lg">
            You have <span className="font-semibold text-orange-600">18 pending orders</span> and <span className="font-semibold text-blue-600">3 low stock alerts</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 border-orange-200 text-orange-700 hover:bg-orange-50">
            <Filter className="w-4 h-4" />
            Filter Orders
          </Button>
          <Button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold gap-2 shadow-lg">
            <Plus className="w-5 h-5" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Enhanced Stats Grid with Real-time Updates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card 
            key={stat.title} 
            className={cn(
              "bg-white dark:bg-slate-900 hover:shadow-xl transition-all duration-300 border-0 shadow-sm",
              "group hover:scale-[1.02] cursor-pointer"
            )}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={cn(
                  "p-3 rounded-xl transition-all duration-300 group-hover:scale-110",
                  stat.bgColor,
                  "dark:bg-opacity-20"
                )}>
                  <stat.icon className={cn(
                    "w-6 h-6 transition-transform duration-300",
                    stat.color,
                    "group-hover:rotate-12"
                  )} />
                </div>
                <div className={cn(
                  "text-sm font-medium flex items-center gap-1",
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-500'
                )}>
                  {stat.changeType === 'positive' ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
                  )}
                  {stat.change}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1 transition-all duration-300">
                  {stat.value}
                  {isLive && stat.title === 'Pending Orders' && (
                    <span className="ml-2 inline-block w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                  )}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{stat.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Real-time Status Bar */}
      {isLive && (
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-green-700 dark:text-green-400">Live Updates Active</span>
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsLive(!isLive)}
            className="text-xs"
          >
            {isLive ? 'Pause Updates' : 'Resume Updates'}
          </Button>
        </div>
      )}

      {/* Revenue Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-white dark:bg-slate-900 border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold">Revenue Trend</CardTitle>
                <CardDescription>Monthly revenue over the past year</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Order Status</CardTitle>
            <CardDescription>Current order distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orderStatusData.map((item) => (
                <div key={item.name} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="font-medium text-gray-700 dark:text-gray-300">{item.name}</span>
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white">{item.value}</span>
                  </div>
                  <Progress 
                    value={(item.value / 78) * 100} 
                    className="h-2"
                    style={{
                      backgroundColor: `${item.color}20`,
                    }}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders - Enhanced */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Recent Orders</h2>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-orange-100 text-orange-800 font-semibold">
                18 Pending
              </Badge>
              <Button variant="outline" size="sm" className="text-orange-600 border-orange-200 hover:bg-orange-50">
                <Eye className="w-4 h-4 mr-2" />
                View All
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <Card 
                key={order.id} 
                className={cn(
                  "bg-white dark:bg-slate-900 hover:shadow-xl transition-all duration-300 border-l-4 group cursor-pointer",
                  getPriorityColor(order.priority),
                  "hover:scale-[1.01]"
                )}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-lg text-gray-900">{order.id}</span>
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1 capitalize">{order.status}</span>
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">{order.value}</p>
                        </div>
                      </div>
                      
                      <h3 className="font-semibold text-xl text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                        {order.contractor}
                      </h3>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-1">
                          <Package className="w-4 h-4" />
                          {order.product}
                        </div>
                        <div className="flex items-center gap-1">
                          <Target className="w-4 h-4" />
                          {order.quantity}
                        </div>
                        <div className="flex items-center gap-1">
                          <Building className="w-4 h-4" />
                          {order.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {order.date}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col justify-between gap-3">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="gap-1">
                          <Eye className="w-4 h-4" />
                          View
                        </Button>
                        {order.status === 'pending' && (
                          <Button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold gap-1">
                            <CheckCircle className="w-4 h-4" />
                            Confirm
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Enhanced Sidebar */}
        <div className="space-y-6">
          {/* Low Stock Alerts - Enhanced */}
          <Card className="bg-white shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                <span className="text-lg font-bold">Low Stock Alerts</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {lowStockItems.map((item, index) => (
                <div key={index} className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">{item.name}</span>
                    <Badge variant="outline" className="text-xs border-gray-300">
                      {item.category}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <Progress 
                      value={(item.current / item.minimum) * 100} 
                      className="h-3"
                    />
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Current: {item.current} {item.unit}</span>
                      <span>Min: {item.minimum} {item.unit}</span>
                    </div>
                  </div>
                </div>
              ))}
              <Button className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold">
                <Plus className="w-4 h-4 mr-2" />
                Reorder Items
              </Button>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card className="bg-white shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between">
                <span className="text-lg font-bold">Top Products</span>
                <Button variant="ghost" size="sm" className="text-orange-600">
                  <BarChart3 className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span>{product.sales}</span>
                      <span className="text-green-600 font-medium">{product.growth}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-blue-600">
                      <ShoppingCart className="w-3 h-3" />
                      <span className="text-sm font-medium">{product.orders}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Enhanced AI Insights Section */}
      <Card className="bg-white dark:bg-slate-900 border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                <Bot className="w-5 h-5 text-black" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">AI Supply Intelligence</CardTitle>
                <CardDescription>Smart insights powered by AI</CardDescription>
              </div>
            </div>
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold">
              Enhanced
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800 hover:shadow-md transition-all">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1.5">Demand Forecast</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    Expect 25% increase in cement demand next month due to upcoming commercial projects in Austin area.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-800 hover:shadow-md transition-all">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1.5">New Opportunities</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    3 new contractors in your area are looking for steel suppliers. Consider competitive quotes.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl border border-purple-200 dark:border-purple-800 hover:shadow-md transition-all">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <DollarSign className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1.5">Pricing Optimization</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    Adjust rebar prices by 3-5% to match market trends and maximize profit margins.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button 
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-semibold shadow-lg"
              size="lg"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Chat with AI Assistant
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupplierOverview;