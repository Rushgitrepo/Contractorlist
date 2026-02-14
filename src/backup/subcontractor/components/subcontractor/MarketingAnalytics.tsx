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
            <h1 className="text-3xl font-bold tracking-tight mb-2 text-gray-900 dark:text-white">Marketing Analytics</h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">
              Track your profile performance and optimize your visibility
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="font-semibold text-xs h-9">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-xs h-9">
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
                <p className="text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark">Profile Views</p>
                <Eye className="w-5 h-5 text-accent" />
              </div>
              <p className="text-2xl font-semibold">1,240</p>
              <div className="flex items-center gap-1 mt-1">
                <ArrowDown className="w-4 h-4 text-red-500" />
                <p className="text-xs font-medium text-red-500">-5% vs last period</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark">
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark">Contact Clicks</p>
                <Users className="w-5 h-5 text-accent" />
              </div>
              <p className="text-2xl font-semibold">89</p>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUp className="w-4 h-4 text-yellow-500" />
                <p className="text-xs font-medium text-yellow-500">+12% vs last period</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark">
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark">Bid Invitations</p>
                <Target className="w-5 h-5 text-accent" />
              </div>
              <p className="text-2xl font-semibold">23</p>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUp className="w-4 h-4 text-yellow-500" />
                <p className="text-xs font-medium text-yellow-500">+8% vs last period</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark">
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark">Profile Rating</p>
                <Star className="w-5 h-5 text-accent" />
              </div>
              <p className="text-2xl font-semibold">4.9</p>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUp className="w-4 h-4 text-yellow-500" />
                <p className="text-xs font-medium text-yellow-500">+0.1 vs last period</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-100 dark:bg-white/5 p-1 rounded-xl h-auto">
            <TabsTrigger value="overview" className="rounded-lg font-semibold text-xs py-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">Overview</TabsTrigger>
            <TabsTrigger value="traffic" className="rounded-lg font-semibold text-xs py-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">Traffic</TabsTrigger>
            <TabsTrigger value="engagement" className="rounded-lg font-semibold text-xs py-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">Engagement</TabsTrigger>
            <TabsTrigger value="performance" className="rounded-lg font-semibold text-xs py-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">Performance</TabsTrigger>
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
                        className="bg-accent/20 hover:bg-accent transition-colors rounded-t flex-1"
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
                      <p className="font-semibold text-accent">342 views</p>
                      <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">+15%</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <p className="font-semibold text-sm">Company Description</p>
                      <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">About Us Section</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-accent">298 views</p>
                      <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">+8%</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <p className="font-semibold text-sm">Certifications</p>
                      <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">Licenses & Awards</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-accent">187 views</p>
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
                            <div className="w-4/5 h-full bg-accent rounded-full"></div>
                          </div>
                          <span className="text-sm font-semibold">456</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">San Antonio, TX</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                            <div className="w-3/5 h-full bg-accent rounded-full"></div>
                          </div>
                          <span className="text-sm font-semibold">298</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Houston, TX</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                            <div className="w-2/5 h-full bg-accent rounded-full"></div>
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
                      <div className="size-3 rounded-full bg-yellow-400"></div>
                      <span className="font-medium">Direct Search</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">542 visits</p>
                      <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">43.7%</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="size-3 rounded-full bg-yellow-500"></div>
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
                    <span className="font-bold text-yellow-600">23%</span>
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
                <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
                  <div className="flex items-start gap-3">
                    <div className="size-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Strong Performance</h4>
                      <p className="text-xs text-gray-500 mt-1">
                        Your profile views are 23% higher than similar contractors in your area.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
                  <div className="flex items-start gap-3">
                    <div className="size-8 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Clock className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Opportunity</h4>
                      <p className="text-xs text-gray-500 mt-1">
                        Consider adding more project photos to increase engagement by an estimated 15%.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
                  <div className="flex items-start gap-3">
                    <div className="size-8 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Target className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Recommendation</h4>
                      <p className="text-xs text-gray-500 mt-1">
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
