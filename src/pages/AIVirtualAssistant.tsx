import { Bot, CheckCircle, ArrowLeft, Cpu, Brain, Calendar, Clock, Zap, Shield, Network, Play, BarChart3, CheckSquare, Users, FileText, Mic, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReduxHeader from "@/components/ReduxHeader";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";

const AIVirtualAssistant = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Schedule contractor meeting', status: 'completed', time: '09:00 AM' },
    { id: 2, title: 'Generate project report', status: 'in-progress', time: '10:30 AM' },
    { id: 3, title: 'Send client updates', status: 'pending', time: '02:00 PM' }
  ]);
  const [productivity, setProductivity] = useState(87.5);
  const [automatedTasks, setAutomatedTasks] = useState(342);
  const [isProcessing, setIsProcessing] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProductivity(prev => Math.min(99, prev + Math.random() * 0.5));
      setAutomatedTasks(prev => prev + Math.floor(Math.random() * 2));
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const aiCapabilities = [
    { icon: Cpu, title: "Smart Automation", desc: "Learns your workflow patterns and automates repetitive tasks" },
    { icon: Brain, title: "Intelligent Scheduling", desc: "Optimizes calendars and resource allocation using ML algorithms" },
    { icon: Calendar, title: "Project Orchestration", desc: "Coordinates complex multi-phase construction projects" },
    { icon: Mic, title: "Voice Commands", desc: "Natural language processing for hands-free operation" },
    { icon: Network, title: "System Integration", desc: "Connects with 100+ construction and business tools" },
    { icon: Shield, title: "Secure Processing", desc: "Enterprise-grade security with encrypted data handling" }
  ];

  const simulateWorkflow = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setTasks(prev => prev.map(task => 
        task.status === 'pending' ? { ...task, status: 'in-progress' } :
        task.status === 'in-progress' ? { ...task, status: 'completed' } : task
      ));
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23fbbf24%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse"></div>
      
      <ReduxHeader />
      
      {/* Hero Section */}
      <section className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-bold mb-6">
                <Cpu className="w-4 h-4 mr-2" />
                Automation + Workflow Intelligence
              </div>
              
              <div className="flex items-center mb-6">
                <div className="p-4 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl mr-6 shadow-lg">
                  <Bot className="h-12 w-12 text-white" />
                  <Cpu className="h-6 w-6 text-white/70 absolute -mt-2 ml-8" />
                </div>
                <div>
                  <h1 className="text-5xl md:text-6xl font-bold text-black leading-tight">AI Virtual Assistant</h1>
                  <p className="text-xl text-gray-600 mt-2">Automation + Workflow Intelligence</p>
                </div>
              </div>
              
              <p className="text-xl text-gray-700 leading-relaxed mb-8">
                Comprehensive AI assistant that learns your workflow patterns and automates complex project management tasks with intelligent decision-making and 5x productivity gains.
              </p>
              
              <div className="flex items-center space-x-6 mb-8">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse mr-2"></div>
                  <span className="text-sm font-medium text-gray-600">AI Learning Active</span>
                </div>
                <div className="flex items-center">
                  <Settings className="w-4 h-4 text-orange-500 mr-2 animate-spin" />
                  <span className="text-sm font-medium text-gray-600">Auto-optimizing</span>
                </div>
              </div>
            </div>
            
            {/* Workflow Dashboard */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500 to-red-600 p-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Bot className="w-6 h-6 mr-2" />
                    <span className="font-semibold">AI Workflow Manager</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm opacity-75">Active</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-black">Today's Automated Tasks</h3>
                    <span className="text-sm text-gray-500">{automatedTasks} completed</span>
                  </div>
                  
                  <div className="space-y-3">
                    {tasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            task.status === 'completed' ? 'bg-green-400' :
                            task.status === 'in-progress' ? 'bg-blue-400 animate-pulse' :
                            'bg-gray-300'
                          }`}></div>
                          <span className="text-sm font-medium text-gray-800">{task.title}</span>
                        </div>
                        <span className="text-xs text-gray-500">{task.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Productivity Score</span>
                    <span className="text-sm font-bold text-orange-600">{productivity.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-orange-400 to-red-500 h-2 rounded-full transition-all duration-1000" style={{width: `${productivity}%`}}></div>
                  </div>
                </div>
                
                <Button 
                  onClick={simulateWorkflow}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-[#fce011] to-yellow-400 hover:from-yellow-400 hover:to-[#fce011] text-black font-bold py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Play className="mr-2 h-5 w-5" />
                  {isProcessing ? 'Processing Workflow...' : 'Optimize Workflow'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Performance Metrics */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-4">AI Automation Analytics</h2>
            <p className="text-xl text-gray-600">Real-time workflow optimization metrics</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <Zap className="w-8 h-8 text-orange-500" />
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div className="text-3xl font-bold text-black mb-2">5x</div>
              <div className="text-sm text-gray-600 mb-4">Productivity Increase</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-orange-500 h-2 rounded-full w-full"></div>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <CheckSquare className="w-8 h-8 text-blue-500" />
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              </div>
              <div className="text-3xl font-bold text-black mb-2">{automatedTasks}</div>
              <div className="text-sm text-gray-600 mb-4">Tasks Automated Today</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full w-4/5 animate-pulse"></div>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <Clock className="w-8 h-8 text-green-500" />
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div className="text-3xl font-bold text-black mb-2">50%</div>
              <div className="text-sm text-gray-600 mb-4">Time Saved Weekly</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full w-1/2"></div>
              </div>
            </div>
          </div>

          {/* AI Capabilities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-3xl font-bold text-black mb-8 flex items-center">
                <Brain className="w-8 h-8 text-orange-500 mr-3" />
                Intelligent Automation Engine
              </h3>
              <div className="space-y-6">
                {aiCapabilities.map((capability, index) => {
                  const IconComponent = capability.icon;
                  return (
                    <div key={index} className="flex items-start p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300">
                      <div className="p-3 bg-orange-100 rounded-lg mr-4 flex-shrink-0">
                        <IconComponent className="w-6 h-6 text-orange-600" />
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
            
            {/* Enterprise Automation */}
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 text-white shadow-2xl">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-[#fce011] rounded-xl mr-4">
                  <Settings className="w-8 h-8 text-black" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Enterprise Automation</h3>
                  <p className="text-gray-300">Advanced workflow intelligence</p>
                </div>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-[#fce011] mr-3" />
                  <span>Custom workflow templates</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-[#fce011] mr-3" />
                  <span>Multi-team orchestration</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-[#fce011] mr-3" />
                  <span>Advanced AI learning models</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-[#fce011] mr-3" />
                  <span>Real-time optimization</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <Button className="w-full bg-gradient-to-r from-[#fce011] to-yellow-400 hover:from-yellow-400 hover:to-[#fce011] text-black font-bold py-3 rounded-xl" size="lg">
                  <Bot className="mr-2 h-5 w-5" />
                  Deploy AI Assistant
                </Button>
                <Button variant="outline" className="w-full border-white/30 text-white hover:bg-white hover:text-black py-3 rounded-xl" size="lg">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Workflow Analytics
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

export default AIVirtualAssistant;
