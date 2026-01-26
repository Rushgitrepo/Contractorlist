import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Bot,
  Zap,
  X,
  Send,
  Minimize2,
  Maximize2,
  TrendingUp,
  Target,
  DollarSign,
  AlertCircle,
  Lightbulb,
  Sparkles,
  ArrowRight,
  MessageSquare,
  BarChart3,
  Brain,
  Mic,
  VolumeX,
  Settings,
  Star,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';

interface QuickInsight {
  id: string;
  type: 'tip' | 'opportunity' | 'warning' | 'success';
  title: string;
  message: string;
  action?: string;
  actionLabel?: string;
}

interface ChatMessage {
  id: string;
  message: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type: 'text' | 'insight' | 'action';
}

const FloatingAICopilot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [hasNewInsight, setHasNewInsight] = useState(true);
  const [quickInsights, setQuickInsights] = useState<QuickInsight[]>([]);
  const [isListening, setIsListening] = useState(false);

  // Initialize with quick insights
  useEffect(() => {
    const insights: QuickInsight[] = [
      {
        id: '1',
        type: 'opportunity',
        title: 'High-Value Lead Alert',
        message: 'New $2.3M medical facility HVAC project - 87% match!',
        action: 'view_project',
        actionLabel: 'View Details'
      },
      {
        id: '2',
        type: 'success',
        title: 'Win Rate Boost',
        message: 'Your Austin commercial HVAC win rate is up 15%',
        action: 'view_analysis',
        actionLabel: 'See Analysis'
      },
      {
        id: '3',
        type: 'warning',
        title: 'Deadline Alert',
        message: 'Hospital bid due in 18 hours - 73% complete',
        action: 'complete_bid',
        actionLabel: 'Complete Now'
      }
    ];

    setQuickInsights(insights);

    // Initial AI greeting
    const initialMessage: ChatMessage = {
      id: '1',
      message: 'Hi! I\'m your AI Copilot. I\'ve found some exciting opportunities for you. Your commercial HVAC win rate in Austin is up 15%! 🚀',
      sender: 'ai',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages([initialMessage]);
  }, []);

  const sendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: currentMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: generateQuickResponse(currentMessage),
        sender: 'ai',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateQuickResponse = (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('bid') || lowerMessage.includes('project')) {
      return "I can help optimize your bids! I've analyzed your recent wins and found patterns that could increase your success rate by 12%. Want me to show you?";
    }
    if (lowerMessage.includes('lead') || lowerMessage.includes('opportunity')) {
      return "Great timing! I've identified 3 high-value leads that match your expertise perfectly. The top one is a $2.3M medical facility project with 87% compatibility.";
    }
    if (lowerMessage.includes('market') || lowerMessage.includes('trend')) {
      return "Market intelligence shows 23% growth in commercial HVAC demand for Q2 2024. Energy efficiency projects are leading the surge. I can provide detailed insights.";
    }
    if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
      return "I've analyzed your pricing strategy. Your residential bids are 8% higher than winning competitors. Adjusting could boost your win rate by 12%.";
    }
    
    return "I'm here to help with bid optimization, lead qualification, market analysis, and project insights. What would you like to explore?";
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return <Target className="w-4 h-4 text-blue-600" />;
      case 'success': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'tip': return <Lightbulb className="w-4 h-4 text-yellow-600" />;
      default: return <Sparkles className="w-4 h-4 text-purple-600" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'opportunity': return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      case 'success': return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'warning': return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'tip': return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      default: return 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800';
    }
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="size-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 relative"
        >
          <Bot className="w-6 h-6" />
          {hasNewInsight && (
            <div className="absolute -top-1 -right-1 size-4 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">!</span>
            </div>
          )}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 animate-pulse opacity-75"></div>
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={`bg-white dark:bg-gray-900 shadow-2xl border-0 transition-all duration-300 ${
        isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            <span className="font-semibold">AI Copilot</span>
            <Badge className="bg-white/20 text-white text-xs">
              <Sparkles className="w-3 h-3 mr-1" />
              Smart
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-white hover:bg-white/20 p-1"
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 p-1"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-[calc(600px-64px)]">
            {/* Quick Insights */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                Smart Insights
              </h4>
              <div className="space-y-2">
                {quickInsights.slice(0, 2).map((insight) => (
                  <div
                    key={insight.id}
                    className={`p-3 rounded-lg border ${getInsightColor(insight.type)} cursor-pointer hover:shadow-sm transition-shadow`}
                  >
                    <div className="flex items-start gap-2">
                      {getInsightIcon(insight.type)}
                      <div className="flex-1 min-w-0">
                        <h5 className="text-sm font-semibold mb-1">{insight.title}</h5>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{insight.message}</p>
                        {insight.actionLabel && (
                          <Button size="sm" variant="outline" className="text-xs h-6">
                            {insight.actionLabel}
                            <ArrowRight className="w-3 h-3 ml-1" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg p-3 ${
                        message.sender === 'user'
                          ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-800'
                      }`}
                    >
                      <p className="text-sm">{message.message}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-white/70' : 'text-gray-500'
                      }`}>
                        {formatTime(message.timestamp)}
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

            {/* Quick Actions */}
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="flex gap-2 mb-3">
                <Button size="sm" variant="outline" className="text-xs flex-1">
                  <Target className="w-3 h-3 mr-1" />
                  Find Leads
                </Button>
                <Button size="sm" variant="outline" className="text-xs flex-1">
                  <BarChart3 className="w-3 h-3 mr-1" />
                  Analyze Bids
                </Button>
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-2">
                <Input
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  placeholder="Ask me anything..."
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  className="flex-1 text-sm"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsListening(!isListening)}
                  className={`p-2 ${isListening ? 'bg-red-100 text-red-600' : ''}`}
                >
                  {isListening ? <VolumeX className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
                <Button 
                  onClick={sendMessage} 
                  size="sm"
                  className="bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white p-2"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        )}

        {isMinimized && (
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="size-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">AI Copilot Active</span>
            </div>
            <Badge className="bg-red-500 text-white text-xs">3</Badge>
          </div>
        )}
      </Card>
    </div>
  );
};

export default FloatingAICopilot;