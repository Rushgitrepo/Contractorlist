import { Calculator, CheckCircle, ArrowLeft, Brain, Eye, Target, Zap, Database, Network, Play, BarChart3, FileImage, Cpu, Shield, Clock, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReduxHeader from "@/components/ReduxHeader";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";

const AIQuantityTakeOff = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [accuracy, setAccuracy] = useState(99.8);
  const [processedFiles, setProcessedFiles] = useState(1247);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setAccuracy(prev => Math.min(99.9, prev + Math.random() * 0.05));
      setProcessedFiles(prev => prev + Math.floor(Math.random() * 3));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const aiFeatures = [
    { icon: Eye, title: "Computer Vision", desc: "Advanced image recognition analyzes blueprints and 3D models" },
    { icon: Brain, title: "Neural Networks", desc: "Deep learning algorithms trained on millions of construction documents" },
    { icon: Target, title: "99.8% Accuracy", desc: "Industry-leading precision validated by 10,000+ projects" },
    { icon: Zap, title: "Real-time Processing", desc: "Instant calculations with cloud-based AI infrastructure" },
    { icon: Database, title: "Smart Learning", desc: "Continuously improves from every processed document" },
    { icon: Network, title: "API Integration", desc: "Seamlessly connects with your existing workflow tools" }
  ];

  const metrics = [
    { label: "Processing Speed", value: "10x Faster", icon: Zap, color: "text-green-500" },
    { label: "Accuracy Rate", value: `${accuracy.toFixed(1)}%`, icon: Target, color: "text-blue-500" },
    { label: "Files Processed", value: processedFiles.toLocaleString(), icon: FileImage, color: "text-purple-500" },
    { label: "Time Saved", value: "85% Average", icon: Clock, color: "text-orange-500" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23fbbf24%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse"></div>
      
      <ReduxHeader />
      
      {/* Hero Section */}
      <section className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-bold mb-6">
                <Brain className="w-4 h-4 mr-2" />
                Computer Vision AI
              </div>
              
              <div className="flex items-center mb-6">
                <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mr-6 shadow-lg">
                  <Calculator className="h-12 w-12 text-white" />
                  <Eye className="h-6 w-6 text-white/70 absolute -mt-2 ml-8" />
                </div>
                <div>
                  <h1 className="text-5xl md:text-6xl font-bold text-black leading-tight">AI Quantity Take Off</h1>
                  <p className="text-xl text-gray-600 mt-2">Computer Vision + Machine Learning</p>
                </div>
              </div>
              
              <p className="text-xl text-gray-700 leading-relaxed mb-8">
                Revolutionary AI system that analyzes blueprints and 3D models using advanced computer vision to automatically calculate material quantities with unprecedented accuracy.
              </p>
              
              <div className="flex items-center space-x-6 mb-8">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse mr-2"></div>
                  <span className="text-sm font-medium text-gray-600">AI Processing Active</span>
                </div>
                <div className="flex items-center">
                  <Shield className="w-4 h-4 text-blue-500 mr-2" />
                  <span className="text-sm font-medium text-gray-600">Enterprise Security</span>
                </div>
              </div>
            </div>
            
            {/* Live Demo Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-black">Live AI Demo</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-500">Processing</span>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Blueprint Analysis</span>
                  <span className="text-sm text-green-600 font-bold">Complete</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Material Detection</span>
                  <span className="text-sm text-green-600 font-bold">99.8% Accuracy</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium">Quantity Calculation</span>
                  <div className="w-16 h-2 bg-blue-200 rounded-full overflow-hidden">
                    <div className="w-full h-full bg-blue-500 animate-pulse"></div>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={() => setIsProcessing(!isProcessing)}
                className="w-full bg-gradient-to-r from-[#fce011] to-yellow-400 hover:from-yellow-400 hover:to-[#fce011] text-black font-bold py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                <Play className="mr-2 h-5 w-5" />
                {isProcessing ? 'Processing...' : 'Start AI Analysis'}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* AI Metrics Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-4">Real-time AI Performance</h2>
            <p className="text-xl text-gray-600">Live metrics from our neural network processing</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {metrics.map((metric, index) => {
              const IconComponent = metric.icon;
              return (
                <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <IconComponent className={`w-8 h-8 ${metric.color}`} />
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                  <div className="text-3xl font-bold text-black mb-2">{metric.value}</div>
                  <div className="text-sm text-gray-600">{metric.label}</div>
                </div>
              );
            })}
          </div>

          {/* AI Capabilities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-3xl font-bold text-black mb-8 flex items-center">
                <Brain className="w-8 h-8 text-blue-500 mr-3" />
                AI Capabilities
              </h3>
              <div className="space-y-6">
                {aiFeatures.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <div key={index} className="flex items-start p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300">
                      <div className="p-3 bg-blue-100 rounded-lg mr-4 flex-shrink-0">
                        <IconComponent className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-black mb-2">{feature.title}</h4>
                        <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Enterprise CTA */}
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 text-white shadow-2xl">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-[#fce011] rounded-xl mr-4">
                  <Cpu className="w-8 h-8 text-black" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Enterprise AI Solution</h3>
                  <p className="text-gray-300">Scalable, secure, and intelligent</p>
                </div>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-[#fce011] mr-3" />
                  <span>99.9% Uptime SLA</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-[#fce011] mr-3" />
                  <span>SOC 2 Type II Certified</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-[#fce011] mr-3" />
                  <span>24/7 AI Monitoring</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-[#fce011] mr-3" />
                  <span>Custom AI Training</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <Button className="w-full bg-gradient-to-r from-[#fce011] to-yellow-400 hover:from-yellow-400 hover:to-[#fce011] text-black font-bold py-3 rounded-xl" size="lg">
                  <Brain className="mr-2 h-5 w-5" />
                  Start AI Trial
                </Button>
                <Button variant="outline" className="w-full border-white/30 text-white hover:bg-white hover:text-black py-3 rounded-xl" size="lg">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  View ROI Calculator
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

export default AIQuantityTakeOff;
