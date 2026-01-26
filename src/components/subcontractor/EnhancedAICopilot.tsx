import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Bot,
  Zap,
  TrendingUp,
  Target,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Lightbulb,
  BarChart3,
  Brain,
  Sparkles,
  ArrowRight,
  Eye,
  Calendar,
  MapPin,
  Users,
  Clock,
  Star,
  Award,
  Rocket,
  Shield,
  Activity,
  PieChart,
  LineChart,
  Send,
  Mic,
  Image,
  FileText,
  Settings,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Share,
  Bookmark,
  Filter,
  Search,
  ChevronRight,
  ChevronDown,
  Play,
  Pause,
  Volume2,
  VolumeX
} from 'lucide-react';

interface AIInsight {
  id: string;
  type: 'optimization' | 'opportunity' | 'warning' | 'prediction' | 'recommendation';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  impact: string;
  confidence: number;
  actionable: boolean;
  actions: AIAction[];
  data: any;
  timestamp: Date;
  category: string;
  tags: string[];
}

interface AIAction {
  id: string;
  label: string;
  type: 'primary' | 'secondary' | 'link';
  action: string;
  data?: any;
}

interface AIConversation {
  id: string;
  message: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type: 'text' | 'insight' | 'chart' | 'recommendation';
  data?: any;
}

const EnhancedAICopilot = () => {
  const [activeTab, setActiveTab] = useState('insights');
  const [conversations, setConversations] = useState<AIConversation[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState<string | null>(null);

  // Mock AI insights data
  useEffect(() => {
    const mockInsights: AIInsight[] = [];

    setInsights(mockInsights);

    // Mock initial conversation
    const initialConversation: AIConversation[] = [
      {
        id: '1',
        message: 'Hello! I\'m your AI Assistant. I\'ve initialized your control panel. How can I assist you with your projects and bids today?',
        sender: 'ai',
        timestamp: new Date(),
        type: 'text'
      }
    ];

    setConversations(initialConversation);
  }, []);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'optimization': return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'opportunity': return <Target className="w-5 h-5 text-blue-600" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'prediction': return <Brain className="w-5 h-5 text-purple-600" />;
      case 'recommendation': return <Lightbulb className="w-5 h-5 text-yellow-600" />;
      default: return <Sparkles className="w-5 h-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'border-l-red-500 bg-red-50 dark:bg-red-900/10';
      case 'high': return 'border-l-orange-500 bg-orange-50 dark:bg-orange-900/10';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/10';
      case 'low': return 'border-l-green-500 bg-green-50 dark:bg-green-900/10';
      default: return 'border-l-gray-300 bg-gray-50 dark:bg-gray-900/10';
    }
  };

  const sendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: AIConversation = {
      id: Date.now().toString(),
      message: currentMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setConversations(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: AIConversation = {
        id: (Date.now() + 1).toString(),
        message: generateAIResponse(currentMessage),
        sender: 'ai',
        timestamp: new Date(),
        type: 'text'
      };
      setConversations(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const generateAIResponse = (userMessage: string) => {
    const responses = [
      "Based on your recent performance data, I can see you're excelling in commercial HVAC projects. Let me analyze your bid patterns and suggest optimizations.",
      "I've identified several high-value opportunities that match your expertise. Would you like me to prioritize them by potential ROI?",
      "Your win rate has improved significantly. I can help you replicate this success across similar project types. Shall we dive into the analysis?",
      "I notice you're asking about market trends. The commercial HVAC sector is showing strong growth, especially in energy-efficient systems. I can provide detailed insights.",
      "Let me pull up the latest market intelligence and competitor analysis for your area. This will help inform your bidding strategy."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const executeAction = (action: AIAction) => {
    console.log('Executing action:', action);
    // In a real app, this would trigger actual functionality
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return timestamp.toLocaleDateString();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 pb-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight mb-2 flex items-center gap-3">
              <div className="size-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              AI Copilot
              <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <Sparkles className="w-3 h-3 mr-1" />
                Enhanced
              </Badge>
            </h1>
            <p className="text-text-secondary-light dark:text-text-secondary-dark">
              Advanced AI assistant with predictive analytics and intelligent recommendations
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              AI Settings
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Insights
            </Button>
          </div>
        </div>

        {/* AI Performance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20 border-gray-200 dark:border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">AI Accuracy</p>
                  <p className="text-2xl font-bold dark:text-gray-200">0.0%</p>
                </div>
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-gray-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20 border-gray-200 dark:border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Insights Generated</p>
                  <p className="text-2xl font-bold dark:text-gray-200">0</p>
                </div>
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <Brain className="w-6 h-6 text-gray-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20 border-gray-200 dark:border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Revenue Impact</p>
                  <p className="text-2xl font-bold dark:text-gray-200">$0</p>
                </div>
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-gray-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20 border-gray-200 dark:border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Time Saved</p>
                  <p className="text-2xl font-bold dark:text-gray-200">0h</p>
                </div>
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-gray-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Insights & Analytics */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="insights">AI Insights</TabsTrigger>
                <TabsTrigger value="chat">AI Chat</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="predictions">Predictions</TabsTrigger>
              </TabsList>

              <TabsContent value="insights" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Smart Insights</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm">
                      <Search className="w-4 h-4 mr-2" />
                      Search
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {insights.map((insight) => (
                    <Card
                      key={insight.id}
                      className={`border-l-4 ${getPriorityColor(insight.priority)} hover:shadow-md transition-shadow cursor-pointer`}
                      onClick={() => setSelectedInsight(selectedInsight === insight.id ? null : insight.id)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            {getInsightIcon(insight.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-bold text-lg mb-1">{insight.title}</h4>
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge className={`text-xs ${insight.priority === 'critical' ? 'bg-red-100 text-red-800' :
                                      insight.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                                        insight.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                          'bg-green-100 text-green-800'
                                    }`}>
                                    {insight.priority.toUpperCase()}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {insight.category}
                                  </Badge>
                                  <span className="text-xs text-gray-500">
                                    {insight.confidence}% confidence
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-semibold text-green-600">{insight.impact}</p>
                                <p className="text-xs text-gray-500">{formatTimestamp(insight.timestamp)}</p>
                              </div>
                            </div>

                            <p className="text-gray-700 dark:text-gray-300 mb-4">{insight.description}</p>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-1 mb-4">
                              {insight.tags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>

                            {/* Confidence Bar */}
                            <div className="mb-4">
                              <div className="flex justify-between text-xs mb-1">
                                <span>AI Confidence</span>
                                <span>{insight.confidence}%</span>
                              </div>
                              <Progress value={insight.confidence} className="h-2" />
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap gap-2">
                              {insight.actions.map((action) => (
                                <Button
                                  key={action.id}
                                  size="sm"
                                  variant={action.type === 'primary' ? 'default' : 'outline'}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    executeAction(action);
                                  }}
                                  className={action.type === 'primary' ? 'bg-primary hover:bg-yellow-400 text-black' : ''}
                                >
                                  {action.label}
                                  <ArrowRight className="w-3 h-3 ml-1" />
                                </Button>
                              ))}
                            </div>

                            {/* Expanded Details */}
                            {selectedInsight === insight.id && (
                              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <h5 className="font-semibold mb-2">Detailed Analysis</h5>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  {Object.entries(insight.data).map(([key, value]) => (
                                    <div key={key} className="flex justify-between">
                                      <span className="text-gray-600 dark:text-gray-400 capitalize">
                                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                                      </span>
                                      <span className="font-medium">
                                        {typeof value === 'number' && key.includes('Value')
                                          ? `$${value.toLocaleString()}`
                                          : typeof value === 'number' && key.includes('Rate')
                                            ? `${value}%`
                                            : value?.toString()}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="chat" className="space-y-4">
                <Card className="h-[600px] flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bot className="w-5 h-5" />
                      AI Assistant Chat
                      <Badge className="bg-green-100 text-green-800">Online</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col p-0">
                    <ScrollArea className="flex-1 p-4">
                      <div className="space-y-4">
                        {conversations.map((conv) => (
                          <div
                            key={conv.id}
                            className={`flex ${conv.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[80%] rounded-lg p-3 ${conv.sender === 'user'
                                  ? 'bg-primary text-black'
                                  : 'bg-gray-100 dark:bg-gray-800'
                                }`}
                            >
                              <p className="text-sm">{conv.message}</p>
                              <p className="text-xs opacity-70 mt-1">
                                {formatTimestamp(conv.timestamp)}
                              </p>
                            </div>
                          </div>
                        ))}
                        {isTyping && (
                          <div className="flex justify-start">
                            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </ScrollArea>

                    <div className="border-t p-4">
                      <div className="flex gap-2">
                        <Input
                          value={currentMessage}
                          onChange={(e) => setCurrentMessage(e.target.value)}
                          placeholder="Ask me about bid optimization, market trends, or project insights..."
                          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                          className="flex-1"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsListening(!isListening)}
                          className={isListening ? 'bg-red-100 text-red-600' : ''}
                        >
                          {isListening ? <VolumeX className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                        </Button>
                        <Button onClick={sendMessage} className="bg-primary hover:bg-yellow-400 text-black">
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Performance Trends</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span>Win Rate</span>
                          <span className="font-bold text-green-600">68% ↑</span>
                        </div>
                        <Progress value={68} className="h-2" />

                        <div className="flex justify-between items-center">
                          <span>Bid Accuracy</span>
                          <span className="font-bold text-blue-600">84% ↑</span>
                        </div>
                        <Progress value={84} className="h-2" />

                        <div className="flex justify-between items-center">
                          <span>Response Time</span>
                          <span className="font-bold text-purple-600">2.3h ↓</span>
                        </div>
                        <Progress value={77} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">AI Recommendations Impact</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-center">
                          <p className="text-3xl font-bold text-green-600">+$1.2M</p>
                          <p className="text-sm text-gray-600">Revenue Impact</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div>
                            <p className="text-xl font-bold">47</p>
                            <p className="text-xs text-gray-600">Recommendations</p>
                          </div>
                          <div>
                            <p className="text-xl font-bold">89%</p>
                            <p className="text-xs text-gray-600">Success Rate</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="predictions" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Market Predictions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <h4 className="font-semibold text-blue-800 dark:text-blue-300">Q2 2024 Forecast</h4>
                          <p className="text-sm text-blue-700 dark:text-blue-400">
                            23% increase in commercial HVAC demand
                          </p>
                        </div>
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <h4 className="font-semibold text-green-800 dark:text-green-300">Energy Efficiency</h4>
                          <p className="text-sm text-green-700 dark:text-green-400">
                            Highest growth potential sector
                          </p>
                        </div>
                        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                          <h4 className="font-semibold text-purple-800 dark:text-purple-300">Smart Systems</h4>
                          <p className="text-sm text-purple-700 dark:text-purple-400">
                            Emerging opportunity in IoT HVAC
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Personalized Forecasts</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span>Expected Monthly Revenue</span>
                          <span className="font-bold text-green-600">$185K</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Projected Win Rate</span>
                          <span className="font-bold text-blue-600">72%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Optimal Bid Count</span>
                          <span className="font-bold text-purple-600">12-15</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Quick Actions & Status */}
          <div className="space-y-6">
            {/* AI Status */}
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="size-3 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="font-semibold">AI Copilot Active</span>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Processing Speed</span>
                    <span className="text-green-600">Real-time</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Data Sources</span>
                    <span>47 connected</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Update</span>
                    <span>2 min ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick AI Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start bg-primary hover:bg-yellow-400 text-black">
                  <Zap className="w-4 h-4 mr-2" />
                  Optimize Current Bids
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Target className="w-4 h-4 mr-2" />
                  Find Similar Opportunities
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Generate Market Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Brain className="w-4 h-4 mr-2" />
                  Analyze Competitors
                </Button>
              </CardContent>
            </Card>

            {/* Recent AI Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent AI Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="size-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Analyzed 3 new leads</p>
                      <p className="text-xs text-gray-500">5 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="size-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Updated market predictions</p>
                      <p className="text-xs text-gray-500">12 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="size-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <Brain className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Generated pricing insights</p>
                      <p className="text-xs text-gray-500">1 hour ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedAICopilot;