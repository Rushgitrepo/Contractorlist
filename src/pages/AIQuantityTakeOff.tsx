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

      {/* Technical Specifications */}
      <section className="relative z-10 py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-4">Technical Specifications</h2>
            <p className="text-xl text-gray-600">Enterprise-grade AI infrastructure</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="border-2 border-blue-200 hover:border-blue-400 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Cpu className="w-6 h-6 text-blue-600 mr-2" />
                  AI Processing Power
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />NVIDIA A100 GPU Clusters</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />TensorFlow & PyTorch Models</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Real-time Processing</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Auto-scaling Infrastructure</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-green-200 hover:border-green-400 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="w-6 h-6 text-green-600 mr-2" />
                  Computer Vision
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />OCR Text Recognition</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />3D Model Analysis</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Blueprint Digitization</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Multi-format Support</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-purple-200 hover:border-purple-400 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-6 h-6 text-purple-600 mr-2" />
                  Security & Compliance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />SOC 2 Type II Certified</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />GDPR Compliant</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />End-to-end Encryption</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Zero Data Retention</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-4">Industry Use Cases</h2>
            <p className="text-xl text-gray-600">Trusted by leading construction companies worldwide</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Residential Construction", desc: "Single-family homes, condos, and apartment complexes", savings: "40% time reduction" },
              { title: "Commercial Buildings", desc: "Office towers, retail spaces, and mixed-use developments", savings: "60% accuracy improvement" },
              { title: "Infrastructure Projects", desc: "Roads, bridges, and public works projects", savings: "$2M average cost savings" },
              { title: "Industrial Facilities", desc: "Manufacturing plants, warehouses, and distribution centers", savings: "85% faster estimates" },
              { title: "Healthcare Facilities", desc: "Hospitals, clinics, and medical office buildings", savings: "99.8% compliance rate" },
              { title: "Educational Buildings", desc: "Schools, universities, and training facilities", savings: "50% project acceleration" }
            ].map((useCase, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-yellow-400">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-black mb-3">{useCase.title}</h3>
                  <p className="text-gray-600 mb-4">{useCase.desc}</p>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center">
                      <TrendingUp className="w-4 h-4 text-green-600 mr-2" />
                      <span className="text-sm font-semibold text-green-700">{useCase.savings}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="relative z-10 py-20 bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-300">Choose the plan that fits your project needs</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Starter",
                price: "$99",
                period: "/month",
                features: ["Up to 50 documents/month", "Basic AI analysis", "Email support", "Standard accuracy"],
                popular: false
              },
              {
                name: "Professional",
                price: "$299",
                period: "/month",
                features: ["Up to 500 documents/month", "Advanced AI models", "Priority support", "99.8% accuracy", "API access"],
                popular: true
              },
              {
                name: "Enterprise",
                price: "Custom",
                period: "",
                features: ["Unlimited documents", "Custom AI training", "24/7 dedicated support", "On-premise deployment", "SLA guarantee"],
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

      {/* CTA Section */}
      <section className="relative z-10 py-20 bg-gradient-to-r from-yellow-400 to-yellow-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-black mb-6">Ready to Transform Your Takeoff Process?</h2>
          <p className="text-xl text-black/80 mb-8">Join 10,000+ construction professionals using AI to accelerate their projects</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact-us">
              <Button size="lg" className="bg-black hover:bg-gray-800 text-white font-bold px-8 py-4">
                <Brain className="mr-2 h-5 w-5" />
                Start Free Trial
              </Button>
            </Link>
            <Link to="/contact-us">
              <Button size="lg" variant="outline" className="border-black text-black hover:bg-black hover:text-white font-bold px-8 py-4">
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

export default AIQuantityTakeOff;
