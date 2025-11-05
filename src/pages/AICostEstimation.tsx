import { DollarSign, CheckCircle, ArrowLeft, TrendingUp, Database, Brain, Shield, BarChart3, LineChart, Calculator, Zap, Clock, Target, Network, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReduxHeader from "@/components/ReduxHeader";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";

const AICostEstimation = () => {
  const [marketData, setMarketData] = useState({ lumber: 245, steel: 892, concrete: 156 });
  const [accuracy, setAccuracy] = useState(94.7);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData(prev => ({
        lumber: Math.max(200, prev.lumber + (Math.random() - 0.5) * 10),
        steel: Math.max(800, prev.steel + (Math.random() - 0.5) * 20),
        concrete: Math.max(120, prev.concrete + (Math.random() - 0.5) * 8)
      }));
      setAccuracy(prev => Math.min(99.5, prev + Math.random() * 0.3));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const aiCapabilities = [
    { icon: Database, title: "Big Data Analytics", desc: "Processes millions of historical project data points for accurate predictions" },
    { icon: TrendingUp, title: "Market Intelligence", desc: "Real-time analysis of material costs, labor rates, and market trends" },
    { icon: Brain, title: "Predictive Modeling", desc: "Advanced ML algorithms predict cost variations and potential overruns" },
    { icon: Shield, title: "Risk Assessment", desc: "Identifies and quantifies financial risks with probability modeling" },
    { icon: Network, title: "API Integration", desc: "Seamlessly connects with procurement and project management systems" },
    { icon: BarChart3, title: "Dynamic Pricing", desc: "Adjusts estimates based on location, season, and market conditions" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23fbbf24%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse"></div>
      
      <ReduxHeader />
      
      {/* Hero Section */}
      <section className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-bold mb-6">
                <TrendingUp className="w-4 h-4 mr-2" />
                Predictive Analytics AI
              </div>
              
              <div className="flex items-center mb-6">
                <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mr-6 shadow-lg">
                  <DollarSign className="h-12 w-12 text-white" />
                  <TrendingUp className="h-6 w-6 text-white/70 absolute -mt-2 ml-8" />
                </div>
                <div>
                  <h1 className="text-5xl md:text-6xl font-bold text-black leading-tight">AI Cost Estimation</h1>
                  <p className="text-xl text-gray-600 mt-2">Predictive Analytics + Real-time Data</p>
                </div>
              </div>
              
              <p className="text-xl text-gray-700 leading-relaxed mb-8">
                Intelligent cost prediction engine that analyzes market trends, historical data, and real-time pricing to deliver precise project estimates with 95%+ accuracy.
              </p>
              
              <div className="flex items-center space-x-6 mb-8">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse mr-2"></div>
                  <span className="text-sm font-medium text-gray-600">Market Data Live</span>
                </div>
                <div className="flex items-center">
                  <Database className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm font-medium text-gray-600">ML Processing</span>
                </div>
              </div>
            </div>
            
            {/* Live Market Data */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-black">Live Market Data</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-500">Real-time</span>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Lumber (per board ft)</span>
                    <div className="text-2xl font-bold text-black">${marketData.lumber.toFixed(0)}</div>
                  </div>
                  <TrendingUp className="w-6 h-6 text-green-500" />
                </div>
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Steel (per ton)</span>
                    <div className="text-2xl font-bold text-black">${marketData.steel.toFixed(0)}</div>
                  </div>
                  <LineChart className="w-6 h-6 text-blue-500" />
                </div>
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Concrete (per yard)</span>
                    <div className="text-2xl font-bold text-black">${marketData.concrete.toFixed(0)}</div>
                  </div>
                  <BarChart3 className="w-6 h-6 text-purple-500" />
                </div>
              </div>
              
              <Button 
                onClick={() => setIsAnalyzing(!isAnalyzing)}
                className="w-full bg-gradient-to-r from-[#fce011] to-yellow-400 hover:from-yellow-400 hover:to-[#fce011] text-black font-bold py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                <Calculator className="mr-2 h-5 w-5" />
                {isAnalyzing ? 'Analyzing Market...' : 'Generate AI Estimate'}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* AI Performance Metrics */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-4">AI Performance Metrics</h2>
            <p className="text-xl text-gray-600">Real-time accuracy and processing statistics</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <Target className="w-8 h-8 text-green-500" />
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div className="text-3xl font-bold text-black mb-2">{accuracy.toFixed(1)}%</div>
              <div className="text-sm text-gray-600 mb-4">Prediction Accuracy</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full transition-all duration-1000" style={{width: `${accuracy}%`}}></div>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <Zap className="w-8 h-8 text-blue-500" />
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              </div>
              <div className="text-3xl font-bold text-black mb-2">2.3s</div>
              <div className="text-sm text-gray-600 mb-4">Average Response Time</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full w-4/5"></div>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="w-8 h-8 text-purple-500" />
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              </div>
              <div className="text-3xl font-bold text-black mb-2">42%</div>
              <div className="text-sm text-gray-600 mb-4">Cost Reduction</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full w-2/5"></div>
              </div>
            </div>
          </div>

          {/* AI Capabilities Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-3xl font-bold text-black mb-8 flex items-center">
                <Brain className="w-8 h-8 text-green-500 mr-3" />
                AI Intelligence Engine
              </h3>
              <div className="space-y-6">
                {aiCapabilities.map((capability, index) => {
                  const IconComponent = capability.icon;
                  return (
                    <div key={index} className="flex items-start p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300">
                      <div className="p-3 bg-green-100 rounded-lg mr-4 flex-shrink-0">
                        <IconComponent className="w-6 h-6 text-green-600" />
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
            
            {/* Enterprise Solution */}
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 text-white shadow-2xl">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-[#fce011] rounded-xl mr-4">
                  <BarChart3 className="w-8 h-8 text-black" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Enterprise Cost Intelligence</h3>
                  <p className="text-gray-300">Advanced predictive modeling</p>
                </div>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-[#fce011] mr-3" />
                  <span>Multi-project portfolio analysis</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-[#fce011] mr-3" />
                  <span>Custom ML model training</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-[#fce011] mr-3" />
                  <span>Real-time market integration</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-[#fce011] mr-3" />
                  <span>Advanced risk modeling</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <Button className="w-full bg-gradient-to-r from-[#fce011] to-yellow-400 hover:from-yellow-400 hover:to-[#fce011] text-black font-bold py-3 rounded-xl" size="lg">
                  <Play className="mr-2 h-5 w-5" />
                  Start AI Analysis
                </Button>
                <Button variant="outline" className="w-full border-white/30 text-white hover:bg-white hover:text-black py-3 rounded-xl" size="lg">
                  <Calculator className="mr-2 h-5 w-5" />
                  ROI Calculator
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Market Intelligence */}
      <section className="relative z-10 py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-4">Market Intelligence Dashboard</h2>
            <p className="text-xl text-gray-600">Real-time construction market analytics</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="p-8">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <TrendingUp className="w-6 h-6 text-green-600 mr-3" />
                  Cost Trend Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                    <span className="font-medium">Labor Costs</span>
                    <div className="flex items-center">
                      <TrendingUp className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-green-600 font-bold">+3.2%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                    <span className="font-medium">Material Prices</span>
                    <div className="flex items-center">
                      <TrendingUp className="w-4 h-4 text-blue-500 mr-2" />
                      <span className="text-blue-600 font-bold">+1.8%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                    <span className="font-medium">Equipment Rental</span>
                    <div className="flex items-center">
                      <TrendingUp className="w-4 h-4 text-purple-500 mr-2" />
                      <span className="text-purple-600 font-bold">+2.1%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="p-8">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <BarChart3 className="w-6 h-6 text-blue-600 mr-3" />
                  Regional Variations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { region: "Northeast", multiplier: "1.15x", color: "bg-red-100 text-red-700" },
                    { region: "West Coast", multiplier: "1.22x", color: "bg-orange-100 text-orange-700" },
                    { region: "Southeast", multiplier: "0.92x", color: "bg-green-100 text-green-700" },
                    { region: "Midwest", multiplier: "0.88x", color: "bg-blue-100 text-blue-700" },
                    { region: "Southwest", multiplier: "1.05x", color: "bg-purple-100 text-purple-700" }
                  ].map((region, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">{region.region}</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${region.color}`}>
                        {region.multiplier}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Integration & API */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-4">Seamless Integration</h2>
            <p className="text-xl text-gray-600">Connect with your existing tools and workflows</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Procore", desc: "Project management integration", logo: "🏗️" },
              { name: "Autodesk", desc: "BIM and design software", logo: "📐" },
              { name: "QuickBooks", desc: "Financial management", logo: "💰" },
              { name: "Sage", desc: "Construction ERP", logo: "📊" },
              { name: "PlanGrid", desc: "Field collaboration", logo: "📱" },
              { name: "Buildertrend", desc: "Project scheduling", logo: "📅" },
              { name: "CoConstruct", desc: "Custom home building", logo: "🏠" },
              { name: "REST API", desc: "Custom integrations", logo: "⚡" }
            ].map((integration, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-all duration-300">
                <div className="text-4xl mb-4">{integration.logo}</div>
                <h3 className="font-bold text-lg mb-2">{integration.name}</h3>
                <p className="text-gray-600 text-sm">{integration.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="relative z-10 py-20 bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Flexible Pricing Plans</h2>
            <p className="text-xl text-gray-300">Choose the right plan for your business size</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Basic",
                price: "$149",
                period: "/month",
                features: ["Up to 100 estimates/month", "Basic market data", "Email support", "Standard accuracy (90%)", "PDF reports"],
                popular: false
              },
              {
                name: "Professional",
                price: "$399",
                period: "/month",
                features: ["Up to 1000 estimates/month", "Real-time market data", "Priority support", "Advanced accuracy (95%)", "API access", "Custom reports"],
                popular: true
              },
              {
                name: "Enterprise",
                price: "Custom",
                period: "",
                features: ["Unlimited estimates", "Custom ML models", "24/7 dedicated support", "Premium accuracy (98%)", "White-label solution", "On-premise deployment"],
                popular: false
              }
            ].map((plan, index) => (
              <Card key={index} className={`${plan.popular ? 'border-2 border-yellow-400 scale-105' : 'border border-gray-700'} bg-gray-800/50 backdrop-blur-sm`}>
                {plan.popular && (
                  <div className="bg-yellow-400 text-black text-center py-2 text-sm font-bold rounded-t-lg">
                    MOST POPULAR
                  </div>
                )}
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold text-white mb-4">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-400">{plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-300">
                        <CheckCircle className="w-4 h-4 text-green-400 mr-3" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className={`w-full ${plan.popular ? 'bg-yellow-400 hover:bg-yellow-500 text-black' : 'bg-white hover:bg-gray-100 text-black'} font-bold py-3`}>
                    {plan.name === 'Enterprise' ? 'Contact Sales' : 'Start Free Trial'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="relative z-10 py-20 bg-gradient-to-r from-green-400 to-emerald-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Calculate Your ROI</h2>
          <p className="text-xl text-white/90 mb-8">See how much you can save with AI-powered cost estimation</p>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
              <div>
                <div className="text-3xl font-bold mb-2">42%</div>
                <div className="text-sm opacity-90">Average Cost Reduction</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">85%</div>
                <div className="text-sm opacity-90">Time Savings</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">$2.3M</div>
                <div className="text-sm opacity-90">Average Annual Savings</div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact-us">
              <Button size="lg" className="bg-white hover:bg-gray-100 text-green-600 font-bold px-8 py-4">
                <Calculator className="mr-2 h-5 w-5" />
                Calculate My ROI
              </Button>
            </Link>
            <Link to="/contact-us">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600 font-bold px-8 py-4">
                Schedule Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AICostEstimation;
