import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Bot,
  Lightbulb,
  FileText,
  TrendingUp,
  Users,
  Calendar,
  BarChart3,
  ArrowRight,
  Sparkles,
  Target,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Send
} from 'lucide-react';

const AIAssistant = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      type: 'ai',
      message: 'Hello! I\'m your AI assistant. I can help you with bid optimization, project analysis, and finding the best opportunities. What would you like to work on today?',
      timestamp: '10:30 AM'
    }
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    setChatHistory(prev => [...prev, {
      type: 'user',
      message: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);

    // Simulate AI response
    setTimeout(() => {
      setChatHistory(prev => [...prev, {
        type: 'ai',
        message: 'I understand you want help with that. Let me analyze your data and provide recommendations...',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1000);

    setMessage('');
  };

  const insights: any[] = [];

  const quickActions = [
    { icon: FileText, label: 'Analyze Spec', description: 'Upload project specs for AI analysis' },
    { icon: BarChart3, label: 'Optimize Bid', description: 'Get pricing recommendations' },
    { icon: Users, label: 'Find Partners', description: 'Discover potential subcontractors' },
    { icon: Calendar, label: 'Schedule Review', description: 'Plan project timeline' }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 pb-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight mb-2 flex items-center gap-3">
              <div className="size-10 rounded-lg bg-primary flex items-center justify-center">
                <Bot className="w-6 h-6 text-black" />
              </div>
              AI Assistant
            </h1>
            <p className="text-text-secondary-light dark:text-text-secondary-dark">
              Your intelligent partner for smarter bidding and project management
            </p>
          </div>
          <Badge className="bg-primary/10 text-primary border border-primary/20 px-3 py-1">
            <Sparkles className="w-4 h-4 mr-2" />
            Beta Version
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chat Interface */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="chat">AI Chat</TabsTrigger>
                <TabsTrigger value="insights">Insights</TabsTrigger>
                <TabsTrigger value="tools">Tools</TabsTrigger>
              </TabsList>

              <TabsContent value="chat" className="space-y-4">
                <Card className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark">
                  <CardContent className="p-0">
                    {/* Chat Messages */}
                    <div className="h-96 overflow-y-auto p-4 space-y-4">
                      {chatHistory.map((chat, index) => (
                        <div key={index} className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] rounded-lg p-3 ${chat.type === 'user'
                              ? 'bg-primary text-black ml-4'
                              : 'bg-gray-100 dark:bg-gray-800 mr-4'
                            }`}>
                            <p className="text-sm">{chat.message}</p>
                            <p className={`text-xs mt-1 ${chat.type === 'user'
                                ? 'text-black/70'
                                : 'text-text-secondary-light dark:text-text-secondary-dark'
                              }`}>
                              {chat.timestamp}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Chat Input */}
                    <div className="border-t border-border-light dark:border-border-dark p-4">
                      <div className="flex gap-2">
                        <Input
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Ask me about bid optimization, project analysis, or anything else..."
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          className="flex-1"
                        />
                        <Button
                          onClick={handleSendMessage}
                          className="bg-primary hover:bg-yellow-400 text-black"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="insights" className="space-y-4">
                {insights.map((insight, index) => (
                  <Card key={index} className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark hover:border-primary/50 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`size-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center`}>
                          <insight.icon className={`w-6 h-6 ${insight.color}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-1">{insight.title}</h3>
                          <p className="text-text-secondary-light dark:text-text-secondary-dark mb-3">
                            {insight.description}
                          </p>
                          <Button variant="outline" size="sm">
                            {insight.action}
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="tools" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <Card key={index} className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark hover:border-primary/50 transition-colors cursor-pointer group">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <action.icon className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-bold mb-1 group-hover:text-primary transition-colors">
                              {action.label}
                            </h3>
                            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                              {action.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark">
                  <CardHeader>
                    <CardTitle>Upload Document for Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-semibold mb-2">Drop files here or click to upload</p>
                      <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                        Supported formats: PDF, DOC, DOCX, XLS, XLSX
                      </p>
                    </div>
                    <Button className="w-full bg-primary hover:bg-yellow-400 text-black">
                      Select Files
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Status */}
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-black dark:to-gray-900 text-white border border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="size-3 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="font-semibold">AI Assistant Online</span>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Response Time</span>
                    <span className="text-green-400">{"< 2 seconds"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Accuracy Rate</span>
                    <span className="text-green-400">94.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Queries Today</span>
                    <span className="text-white">23</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark">
              <CardHeader>
                <CardTitle className="text-lg">Recent AI Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-4 text-gray-500 text-sm">
                  No recent AI activity logged.
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark">
              <CardHeader>
                <CardTitle className="text-lg">AI Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Bids Optimized</span>
                  <span className="font-bold">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Win Rate Improvement</span>
                  <span className="font-bold text-gray-400">0%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Time Saved</span>
                  <span className="font-bold">0 hours</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Projects Analyzed</span>
                  <span className="font-bold">0</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;