import { MessageCircle, CheckCircle, ArrowLeft, Brain, Zap, Globe, Clock, Send, User, Bot, Languages, Shield, Network, Play, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReduxHeader from "@/components/ReduxHeader";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";

const AIChatBot = () => {
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Hello! I\'m your AI construction assistant. How can I help you today?' },
    { type: 'user', text: 'I need a quote for bathroom renovation' },
    { type: 'bot', text: 'I\'d be happy to help! Based on your location and requirements, I can connect you with verified contractors. What\'s your zip code?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [responseTime, setResponseTime] = useState(0.8);
  const [satisfaction, setSatisfaction] = useState(98.2);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setResponseTime(prev => Math.max(0.3, prev + (Math.random() - 0.5) * 0.2));
      setSatisfaction(prev => Math.min(99.9, prev + Math.random() * 0.1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const aiCapabilities = [
    { icon: Brain, title: "GPT-4 Powered", desc: "Latest natural language processing with human-like understanding" },
    { icon: Clock, title: "Sub-second Response", desc: "Average response time under 1 second for instant support" },
    { icon: Languages, title: "Multi-language", desc: "Supports 25+ languages with cultural context awareness" },
    { icon: Network, title: "Smart Routing", desc: "Intelligently routes complex queries to human specialists" },
    { icon: Shield, title: "Privacy First", desc: "End-to-end encryption with GDPR compliance" },
    { icon: BarChart3, title: "Learning AI", desc: "Continuously improves from every conversation" }
  ];

  const addMessage = (text: string, type: 'user' | 'bot') => {
    setMessages(prev => [...prev, { type, text }]);
  };

  const simulateChat = () => {
    setIsTyping(true);
    setTimeout(() => {
      addMessage('What\'s the average cost for a bathroom renovation?', 'user');
      setTimeout(() => {
        setIsTyping(false);
        addMessage('Based on current market data, bathroom renovations typically range from $8,000-$25,000. I can provide a detailed estimate and connect you with 3 pre-screened contractors in your area. Would you like me to start the process?', 'bot');
      }, 1500);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23fbbf24%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse"></div>
      
      <ReduxHeader />
      
      {/* Hero Section */}
      <section className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-bold mb-6">
                <Brain className="w-4 h-4 mr-2" />
                GPT-4 Powered AI
              </div>
              
              <div className="flex items-center mb-6">
                <div className="p-4 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl mr-6 shadow-lg">
                  <MessageCircle className="h-12 w-12 text-white" />
                  <Brain className="h-6 w-6 text-white/70 absolute -mt-2 ml-8" />
                </div>
                <div>
                  <h1 className="text-5xl md:text-6xl font-bold text-black leading-tight">AI Chat Bot</h1>
                  <p className="text-xl text-gray-600 mt-2">Natural Language Processing + GPT-4</p>
                </div>
              </div>
              
              <p className="text-xl text-gray-700 leading-relaxed mb-8">
                Advanced conversational AI powered by GPT-4 technology, providing human-like interactions and intelligent responses 24/7 with 98%+ customer satisfaction.
              </p>
              
              <div className="flex items-center space-x-6 mb-8">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse mr-2"></div>
                  <span className="text-sm font-medium text-gray-600">AI Online</span>
                </div>
                <div className="flex items-center">
                  <Zap className="w-4 h-4 text-purple-500 mr-2" />
                  <span className="text-sm font-medium text-gray-600">{responseTime.toFixed(1)}s Response</span>
                </div>
              </div>
            </div>
            
            {/* Interactive Chat Demo */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-violet-600 p-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                    <span className="font-semibold">AI Assistant</span>
                  </div>
                  <span className="text-sm opacity-75">Online</span>
                </div>
              </div>
              
              <div className="h-80 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                      message.type === 'user' 
                        ? 'bg-[#fce011] text-black' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      <div className="flex items-start space-x-2">
                        {message.type === 'bot' && <Bot className="w-4 h-4 mt-1 text-purple-500 flex-shrink-0" />}
                        <span className="text-sm">{message.text}</span>
                        {message.type === 'user' && <User className="w-4 h-4 mt-1 text-gray-600 flex-shrink-0" />}
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 px-4 py-2 rounded-2xl">
                      <div className="flex items-center space-x-1">
                        <Bot className="w-4 h-4 text-purple-500" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-4 border-t border-gray-200">
                <Button 
                  onClick={simulateChat}
                  className="w-full bg-gradient-to-r from-[#fce011] to-yellow-400 hover:from-yellow-400 hover:to-[#fce011] text-black font-bold py-3 rounded-xl transition-all duration-300"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Try Interactive Demo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Performance Stats */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-4">AI Performance Analytics</h2>
            <p className="text-xl text-gray-600">Real-time conversation intelligence metrics</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <MessageCircle className="w-8 h-8 text-purple-500" />
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div className="text-3xl font-bold text-black mb-2">{satisfaction.toFixed(1)}%</div>
              <div className="text-sm text-gray-600 mb-4">Customer Satisfaction</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full transition-all duration-1000" style={{width: `${satisfaction}%`}}></div>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <Zap className="w-8 h-8 text-blue-500" />
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              </div>
              <div className="text-3xl font-bold text-black mb-2">{responseTime.toFixed(1)}s</div>
              <div className="text-sm text-gray-600 mb-4">Response Time</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full w-4/5"></div>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <Globe className="w-8 h-8 text-green-500" />
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div className="text-3xl font-bold text-black mb-2">25+</div>
              <div className="text-sm text-gray-600 mb-4">Languages Supported</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full w-full"></div>
              </div>
            </div>
          </div>

          {/* AI Capabilities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-3xl font-bold text-black mb-8 flex items-center">
                <Brain className="w-8 h-8 text-purple-500 mr-3" />
                Conversational AI Engine
              </h3>
              <div className="space-y-6">
                {aiCapabilities.map((capability, index) => {
                  const IconComponent = capability.icon;
                  return (
                    <div key={index} className="flex items-start p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300">
                      <div className="p-3 bg-purple-100 rounded-lg mr-4 flex-shrink-0">
                        <IconComponent className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-black mb-2">{capability.title}</h4>
                        <p className="text-gray-600 text-sm leading-relaxed">{capability.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Enterprise Integration */}
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 text-white shadow-2xl">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-[#fce011] rounded-xl mr-4">
                  <Network className="w-8 h-8 text-black" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Enterprise Chat AI</h3>
                  <p className="text-gray-300">Advanced conversation intelligence</p>
                </div>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-[#fce011] mr-3" />
                  <span>Custom knowledge base training</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-[#fce011] mr-3" />
                  <span>CRM & helpdesk integration</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-[#fce011] mr-3" />
                  <span>Advanced analytics dashboard</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-[#fce011] mr-3" />
                  <span>White-label customization</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <Button className="w-full bg-gradient-to-r from-[#fce011] to-yellow-400 hover:from-yellow-400 hover:to-[#fce011] text-black font-bold py-3 rounded-xl" size="lg">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Deploy AI Assistant
                </Button>
                <Button variant="outline" className="w-full border-white/30 text-white hover:bg-white hover:text-black py-3 rounded-xl" size="lg">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  View Analytics
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AIChatBot;
