import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Users,
  ShoppingCart,
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart,
  LineChart,
  Target
} from 'lucide-react';

const SupplierAnalytics = () => {
  const performanceMetrics = [
    {
      title: 'Revenue Growth',
      value: '+24.5%',
      trend: 'up',
      period: 'vs last quarter',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      title: 'Order Fulfillment Rate',
      value: '96.8%',
      trend: 'up',
      period: 'this month',
      icon: Target,
      color: 'text-blue-600'
    },
    {
      title: 'Customer Retention',
      value: '89.2%',
      trend: 'up',
      period: 'vs last year',
      icon: Users,
      color: 'text-purple-600'
    },
    {
      title: 'Average Order Value',
      value: '$8,450',
      trend: 'down',
      period: 'vs last month',
      icon: DollarSign,
      color: 'text-orange-600'
    }
  ];

  const topProducts = [
    { name: 'Portland Cement Type I', revenue: '$45,200', orders: 156, growth: '+18%' },
    { name: 'Rebar #4 - 20ft', revenue: '$38,900', orders: 89, growth: '+12%' },
    { name: 'Ready Mix Concrete', revenue: '$32,100', orders: 67, growth: '+25%' },
    { name: 'Steel Beams 8"', revenue: '$28,750', orders: 34, growth: '+8%' },
    { name: 'Aggregate Stone', revenue: '$24,300', orders: 78, growth: '+15%' }
  ];

  const customerSegments = [
    { segment: 'Large Contractors', percentage: 45, revenue: '$125,400', color: 'bg-blue-500' },
    { segment: 'Medium Contractors', percentage: 35, revenue: '$89,200', color: 'bg-green-500' },
    { segment: 'Small Contractors', percentage: 20, revenue: '$45,800', color: 'bg-yellow-500' }
  ];

  const monthlyData = [
    { month: 'Jan', revenue: 85000, orders: 145 },
    { month: 'Feb', revenue: 92000, orders: 167 },
    { month: 'Mar', revenue: 78000, orders: 134 },
    { month: 'Apr', revenue: 105000, orders: 189 },
    { month: 'May', revenue: 118000, orders: 203 },
    { month: 'Jun', revenue: 134000, orders: 234 }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
            Analytics & Reports
          </h1>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">
            Track your business performance and identify growth opportunities
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Date Range
          </Button>
          <Button className="bg-primary hover:bg-yellow-400 text-black">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceMetrics.map((metric) => (
          <Card key={metric.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                    {metric.title}
                  </p>
                  <p className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                    {metric.value}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {metric.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                    <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                      {metric.period}
                    </span>
                  </div>
                </div>
                <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <metric.icon className={`w-6 h-6 ${metric.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="w-5 h-5" />
              Revenue Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyData.map((data, index) => (
                <div key={data.month} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium w-8">{data.month}</span>
                    <div className="flex-1">
                      <Progress 
                        value={(data.revenue / 140000) * 100} 
                        className="h-2 w-32"
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">${(data.revenue / 1000).toFixed(0)}K</p>
                    <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                      {data.orders} orders
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Customer Segments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Customer Segments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {customerSegments.map((segment, index) => (
                <div key={segment.segment} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{segment.segment}</span>
                    <span className="text-sm font-semibold">{segment.percentage}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress 
                      value={segment.percentage} 
                      className="flex-1 h-2"
                    />
                    <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                      {segment.revenue}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Top Performing Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center justify-between p-4 border border-border-light dark:border-border-dark rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Package className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-text-primary-light dark:text-text-primary-dark">
                      {product.name}
                    </p>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                      {product.orders} orders this month
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-green-600">{product.revenue}</p>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    {product.growth}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card className="bg-gradient-to-r from-primary/5 to-blue-500/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            AI-Powered Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
              <h4 className="font-semibold mb-2">📈 Growth Opportunity</h4>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                Ready Mix Concrete shows 25% growth potential. Consider expanding inventory and targeting commercial projects.
              </p>
            </div>
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
              <h4 className="font-semibold mb-2">⚠️ Risk Alert</h4>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                Steel beam orders declining 8%. Market analysis suggests temporary dip due to seasonal factors.
              </p>
            </div>
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
              <h4 className="font-semibold mb-2">💡 Optimization</h4>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                Adjust cement pricing by 2-3% to maximize profit margins while maintaining competitive edge.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupplierAnalytics;