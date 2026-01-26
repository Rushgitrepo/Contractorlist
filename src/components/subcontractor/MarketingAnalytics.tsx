import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  TrendingUp,
  Eye,
  Users,
  MapPin,
  Calendar,
  BarChart3,
  PieChart,
  Target,
  DollarSign,
  Clock,
  Star,
  ArrowUp,
  ArrowDown,
  Download,
  Share
} from 'lucide-react';

const MarketingAnalytics = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('30d');

  return (
    <div className="p-4 sm:p-6 lg:p-8 pb-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight mb-2">Marketing Analytics</h1>
            <p className="text-text-secondary-light dark:text-text-secondary-dark">
              Track your profile performance and optimize your visibility
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button className="bg-primary hover:bg-yellow-400 text-black font-semibold">
              <Share className="w-4 h-4 mr-2" />
              Share Profile
            </Button>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="flex justify-between items-center mb-6">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark">
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Profile Views</p>
                <Eye className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-2xl font-bold">1,240</p>
              <div className="flex items-center gap-1 mt-1">
                <ArrowDown className="w-4 h-4 text-red-500" />
                <p className="text-xs font-medium text-red-500">-5% vs last period</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark">
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Contact Clicks</p>
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold">89</p>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUp className="w-4 h-4 text-green-500" />
                <p className="text-xs font-medium text-green-500">+12% vs last period</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark">
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Bid Invitations</p>
                <Target className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-2xl font-bold">23</p>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUp className="w-4 h-4 text-green-500" />
                <p className="text-xs font-medium text-green-500">+8% vs last period</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark">
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Profile Rating</p>
                <Star className="w-5 h-5 text-yellow-600" />
              </div>
              <p className="text-2xl font-bold">4.9</p>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUp className="w-4 h-4 text-green-500" />
                <p className="text-xs font-medium text-green-500">+0.1 vs last period</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="traffic">Traffic</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Profile Views Chart */}
              <Card className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Profile Views Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-end justify-between gap-2">
                    {[40, 65, 45, 80, 55, 70, 60, 85, 75, 90, 65, 80, 70, 95].map((height, index) => (
                      <div
                        key={index}
                        className="bg-primary/20 hover:bg-primary transition-colors rounded-t flex-1"
                        style={{ height: `${height}%` }}
                        title={`Day ${index + 1}: ${Math.round(height * 20)} views`}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-text-secondary-light dark:text-text-secondary-dark mt-2">
                    <span>2 weeks ago</span>
                    <span>Today</span>
                  </div>
                </CardContent>
              </Card>

              {/* Top Performing Content */}
              <Card className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Top Performing Content
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <p className="font-semibold text-sm">Project Gallery</p>
                      <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">Medical Center Photos</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">342 views</p>
                      <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">+15%</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <p className="font-semibold text-sm">Company Description</p>
                      <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">About Us Section</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-600">298 views</p>
                      <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">+8%</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <p className="font-semibold text-sm">Certifications</p>
                      <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">Licenses & Awards</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-purple-600">187 views</p>
                      <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">+22%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Geographic Distribution */}
            <Card className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Geographic Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Top Cities</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Austin, TX</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                            <div className="w-4/5 h-full bg-primary rounded-full"></div>
                          </div>
                          <span className="text-sm font-semibold">456</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">San Antonio, TX</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                            <div className="w-3/5 h-full bg-primary rounded-full"></div>
                          </div>
                          <span className="text-sm font-semibold">298</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Houston, TX</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                            <div className="w-2/5 h-full bg-primary rounded-full"></div>
                          </div>
                          <span className="text-sm font-semibold">187</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="traffic" className="space-y-6">
            <Card className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark">
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="size-3 rounded-full bg-blue-500"></div>
                      <span className="font-medium">Direct Search</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">542 visits</p>
                      <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">43.7%</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="size-3 rounded-full bg-green-500"></div>
                      <span className="font-medium">Project Matching</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">398 visits</p>
                      <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">32.1%</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="size-3 rounded-full bg-yellow-500"></div>
                      <span className="font-medium">Referrals</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">187 visits</p>
                      <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">15.1%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="engagement" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark">
                <CardHeader>
                  <CardTitle>Engagement Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Avg. Time on Profile</span>
                    <span className="font-bold">2m 34s</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Bounce Rate</span>
                    <span className="font-bold text-green-600">23%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Pages per Visit</span>
                    <span className="font-bold">3.2</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark">
                <CardHeader>
                  <CardTitle>Contact Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Phone Clicks</span>
                    <span className="font-bold">45</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Email Clicks</span>
                    <span className="font-bold">32</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Website Visits</span>
                    <span className="font-bold">28</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <Card className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark">
              <CardHeader>
                <CardTitle>Performance Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-green-800 dark:text-green-300">Strong Performance</h4>
                      <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                        Your profile views are 23% higher than similar contractors in your area.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-yellow-800 dark:text-yellow-300">Opportunity</h4>
                      <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                        Consider adding more project photos to increase engagement by an estimated 15%.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start gap-3">
                    <Target className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-800 dark:text-blue-300">Recommendation</h4>
                      <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                        Update your service areas to include Round Rock and Cedar Park for 30% more visibility.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MarketingAnalytics;