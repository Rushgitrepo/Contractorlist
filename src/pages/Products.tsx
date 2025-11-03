import { Link } from "react-router-dom";
import { Calculator, DollarSign, MessageCircle, Bot, ArrowRight, Sparkles, Brain, Zap, Target, Clock, Shield, TrendingUp, Eye, Cpu, Database, Network } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ReduxHeader from "@/components/ReduxHeader";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";

const Products = () => {
  const [activeDemo, setActiveDemo] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiStats, setAiStats] = useState({ accuracy: 97, speed: 85, savings: 42 });

  useEffect(() => {
    const interval = setInterval(() => {
      setAiStats(prev => ({
        accuracy: Math.min(99.9, prev.accuracy + Math.random() * 0.5),
        speed: Math.min(100, prev.speed + Math.random() * 2),
        savings: Math.min(65, prev.savings + Math.random() * 1)
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const products = [
    {
      id: 1,
      title: "AI Quantity Take Off",
      subtitle: "Computer Vision + Machine Learning",
      description: "Revolutionary AI that analyzes blueprints and 3D models using advanced computer vision to automatically calculate material quantities with 99.8% accuracy.",
      icon: Calculator,
      aiIcon: Eye,
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      glowColor: "shadow-blue-500/25",
      features: [
        { icon: Brain, text: "Neural Network Analysis", desc: "Deep learning algorithms" },
        { icon: Target, text: "99.8% Accuracy", desc: "Industry-leading precision" },
        { icon: Zap, text: "10x Faster", desc: "Instant calculations" },
        { icon: Database, text: "Cloud Processing", desc: "Scalable AI infrastructure" }
      ],
      metrics: { accuracy: "99.8%", speed: "10x faster", savings: "60% time saved" },
      link: "/products/ai-quantity-takeoff"
    },
    {
      id: 2,
      title: "AI Cost Estimation",
      subtitle: "Predictive Analytics + Real-time Data",
      description: "Intelligent cost prediction engine that analyzes market trends, historical data, and real-time pricing to deliver precise project estimates.",
      icon: DollarSign,
      aiIcon: TrendingUp,
      color: "bg-gradient-to-br from-green-500 to-emerald-600",
      glowColor: "shadow-green-500/25",
      features: [
        { icon: Database, text: "Big Data Analysis", desc: "Millions of data points" },
        { icon: TrendingUp, text: "Market Intelligence", desc: "Real-time pricing" },
        { icon: Shield, text: "Risk Assessment", desc: "Predictive modeling" },
        { icon: Network, text: "API Integration", desc: "Seamless connectivity" }
      ],
      metrics: { accuracy: "95% accurate", speed: "Instant quotes", savings: "40% cost reduction" },
      link: "/products/ai-cost-estimation"
    },
    {
      id: 3,
      title: "AI Chat Bot",
      subtitle: "Natural Language Processing + GPT-4",
      description: "Advanced conversational AI powered by GPT-4 technology, providing human-like interactions and intelligent responses 24/7.",
      icon: MessageCircle,
      aiIcon: Brain,
      color: "bg-gradient-to-br from-purple-500 to-violet-600",
      glowColor: "shadow-purple-500/25",
      features: [
        { icon: Brain, text: "GPT-4 Powered", desc: "Latest AI technology" },
        { icon: Clock, text: "24/7 Availability", desc: "Always online" },
        { icon: Network, text: "Multi-language", desc: "Global support" },
        { icon: Zap, text: "Instant Response", desc: "Sub-second replies" }
      ],
      metrics: { accuracy: "98% satisfaction", speed: "<1s response", savings: "80% support costs" },
      link: "/products/ai-chatbot"
    },
    {
      id: 4,
      title: "AI Virtual Assistant",
      subtitle: "Automation + Workflow Intelligence",
      description: "Comprehensive AI assistant that learns your workflow patterns and automates complex project management tasks with intelligent decision-making.",
      icon: Bot,
      aiIcon: Cpu,
      color: "bg-gradient-to-br from-orange-500 to-red-600",
      glowColor: "shadow-orange-500/25",
      features: [
        { icon: Cpu, text: "Smart Automation", desc: "Intelligent workflows" },
        { icon: Brain, text: "Learning Algorithm", desc: "Adapts to your style" },
        { icon: Clock, text: "Schedule Optimization", desc: "Perfect timing" },
        { icon: Shield, text: "Secure Processing", desc: "Enterprise-grade security" }
      ],
      metrics: { accuracy: "92% task success", speed: "5x productivity", savings: "50% time saved" },
      link: "/products/ai-virtual-assistant"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-yellow-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23fbbf24%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse"></div>
      
      <ReduxHeader />
      
      {/* Hero Section */}
      <section className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#fce011] to-yellow-400 text-black rounded-full text-sm font-bold mb-8 shadow-xl animate-bounce">
              <Brain className="w-5 h-5 mr-2" />
              AI-Powered Solutions
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-black mb-6 leading-tight">
              Next-Gen AI Products
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              Experience the future of construction with our revolutionary AI-powered tools that learn, adapt, and optimize your workflow
            </p>
          </div>

          {/* Live AI Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <Target className="w-8 h-8 text-blue-500" />
                <span className="text-sm font-medium text-gray-600">AI Accuracy</span>
              </div>
              <div className="text-3xl font-bold text-black">{aiStats.accuracy.toFixed(1)}%</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-blue-500 h-2 rounded-full transition-all duration-1000" style={{width: `${aiStats.accuracy}%`}}></div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <Zap className="w-8 h-8 text-green-500" />
                <span className="text-sm font-medium text-gray-600">Processing Speed</span>
              </div>
              <div className="text-3xl font-bold text-black">{aiStats.speed.toFixed(0)}%</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-green-500 h-2 rounded-full transition-all duration-1000" style={{width: `${aiStats.speed}%`}}></div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="w-8 h-8 text-purple-500" />
                <span className="text-sm font-medium text-gray-600">Cost Savings</span>
              </div>
              <div className="text-3xl font-bold text-black">{aiStats.savings.toFixed(0)}%</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-purple-500 h-2 rounded-full transition-all duration-1000" style={{width: `${aiStats.savings}%`}}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Products Grid */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-4">Revolutionary AI Solutions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Each product powered by cutting-edge machine learning and neural networks</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {products.map((product, index) => {
              const IconComponent = product.icon;
              const AiIconComponent = product.aiIcon;
              return (
                <Card key={product.id} className={`group hover:shadow-2xl ${product.glowColor} transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 border-0 shadow-xl overflow-hidden bg-white/90 backdrop-blur-sm`}>
                  <CardHeader className="pb-6 relative">
                    {/* AI Processing Indicator */}
                    <div className="absolute top-4 right-4 flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-gray-500 font-medium">AI Active</span>
                    </div>
                    
                    <div className="flex items-start space-x-4 mb-6">
                      <div className={`relative p-4 rounded-2xl ${product.color} group-hover:scale-110 transform duration-500 shadow-lg`}>
                        <IconComponent className="h-10 w-10 text-white relative z-10" />
                        <AiIconComponent className="h-5 w-5 text-white/70 absolute -top-1 -right-1 animate-pulse" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-2xl font-bold text-black group-hover:text-[#fce011] transition-colors mb-2">
                          {product.title}
                        </CardTitle>
                        <p className="text-sm font-medium text-gray-500 mb-3">{product.subtitle}</p>
                        <CardDescription className="text-gray-600 leading-relaxed">
                          {product.description}
                        </CardDescription>
                      </div>
                    </div>

                    {/* AI Metrics */}
                    <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
                      {Object.entries(product.metrics).map(([key, value]) => (
                        <div key={key} className="text-center">
                          <div className="text-lg font-bold text-black">{value}</div>
                          <div className="text-xs text-gray-500 capitalize">{key}</div>
                        </div>
                      ))}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="mb-8">
                      <h4 className="font-bold text-black mb-4 flex items-center">
                        <Brain className="w-4 h-4 mr-2 text-[#fce011]" />
                        AI Capabilities
                      </h4>
                      <div className="grid grid-cols-1 gap-3">
                        {product.features.map((feature, featureIndex) => {
                          const FeatureIcon = feature.icon;
                          return (
                            <div key={featureIndex} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                              <FeatureIcon className="w-5 h-5 text-[#fce011] mr-3 flex-shrink-0" />
                              <div>
                                <div className="font-semibold text-black text-sm">{feature.text}</div>
                                <div className="text-xs text-gray-500">{feature.desc}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    <Button 
                      asChild 
                      className="w-full bg-gradient-to-r from-[#fce011] to-yellow-400 hover:from-yellow-400 hover:to-[#fce011] text-black font-bold py-4 rounded-xl transition-all duration-300 group-hover:shadow-2xl border-0 transform hover:scale-105"
                    >
                      <Link to={product.link} className="flex items-center justify-center">
                        <Brain className="mr-2 h-5 w-5" />
                        Experience AI Demo
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* AI Demo Section */}
      <section className="relative z-10 py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23fbbf24%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-16">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#fce011] to-yellow-400 text-black rounded-full text-sm font-bold mb-8 animate-pulse">
              <Cpu className="w-5 h-5 mr-2" />
              AI Processing Active
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Ready to Experience
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fce011] to-yellow-400"> AI Power?</span>
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join thousands of contractors already using our AI solutions to revolutionize their business operations and increase profitability.
            </p>
          </div>

          {/* Interactive Demo Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <button 
              onClick={() => setIsProcessing(!isProcessing)}
              className="group p-8 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:border-[#fce011] transition-all duration-300 transform hover:scale-105"
            >
              <div className="flex items-center justify-center mb-4">
                <div className={`p-4 rounded-full bg-gradient-to-r from-[#fce011] to-yellow-400 ${isProcessing ? 'animate-spin' : ''}`}>
                  <Brain className="w-8 h-8 text-black" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Try AI Demo</h3>
              <p className="text-gray-300 text-sm">{isProcessing ? 'AI Processing...' : 'Click to simulate AI processing'}</p>
            </button>
            
            <div className="p-8 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <div className="flex items-center justify-center mb-4">
                <div className="p-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-600">
                  <Shield className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Enterprise Ready</h3>
              <p className="text-gray-300 text-sm">Bank-level security & 99.9% uptime</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              asChild 
              size="lg" 
              className="bg-gradient-to-r from-[#fce011] to-yellow-400 hover:from-yellow-400 hover:to-[#fce011] text-black font-bold px-10 py-4 rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <Link to="/join-network" className="flex items-center">
                <Zap className="mr-2 h-5 w-5" />
                Start AI Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button 
              asChild 
              variant="outline" 
              size="lg" 
              className="border-2 border-white/30 text-white hover:bg-white hover:text-black px-10 py-4 rounded-xl backdrop-blur-sm transform hover:scale-105 transition-all duration-300"
            >
              <Link to="/about-us" className="flex items-center">
                <Eye className="mr-2 h-5 w-5" />
                Watch Demo
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Products;