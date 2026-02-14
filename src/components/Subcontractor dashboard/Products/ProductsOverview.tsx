import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, MessageSquare, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/Subcontractor dashboard/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/Subcontractor dashboard/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/Subcontractor dashboard/ui/tabs';

const ProductsOverview = () => {
    const [activeTab, setActiveTab] = useState("overview");

    const products = [
        {
            id: "ai-takeoff",
            title: "AI Auto Takeoff",
            description: "Automate your quantity takeoffs with 99% accuracy using our advanced AI engine.",
            icon: Zap,
            color: "text-amber-500",
            bg: "bg-amber-100 dark:bg-amber-900/20",
            status: "New",
            features: [
                " Instant Blueprints Processing",
                "99% Accuracy Guarantee",
                "Export to Excel/CSV",
                "Material Cost Integration"
            ]
        },
        {
            id: "ai-assistant",
            title: "Contractor AI Assistant",
            description: "Your 24/7 virtual project manager for scheduling, reminders, and communication.",
            icon: MessageSquare,
            color: "text-blue-500",
            bg: "bg-blue-100 dark:bg-blue-900/20",
            status: "Popular",
            features: [
                "Automated Client Follow-ups",
                "Smart Scheduling",
                "Voice-to-Task Commands",
                "Project Timeline Optimization"
            ]
        }
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 min-h-screen flex flex-col">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">Products Suite</h1>
                <p className="text-gray-500 dark:text-gray-400 font-medium">
                    Exclusive AI-driven tools available for our partners.
                </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 max-w-md mb-8 h-12 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                    <TabsTrigger value="overview" className="rounded-lg font-bold text-xs uppercase tracking-wider data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm">Overview</TabsTrigger>
                    {products.map(p => (
                        <TabsTrigger key={p.id} value={p.id} className="rounded-lg font-bold text-xs uppercase tracking-wider data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm">
                            {p.title.split(' ')[0]} AI
                        </TabsTrigger>
                    ))}
                </TabsList>

                <TabsContent value="overview" className="space-y-6 animate-in fade-in-50 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {products.map((product) => (
                            <Card
                                key={product.title}
                                className="group border-gray-200 dark:border-white/10 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
                                onClick={() => setActiveTab(product.id)}
                            >
                                <CardHeader className="p-6 pb-0">
                                    <div className="flex justify-between items-start">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${product.bg} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                            <product.icon className={`w-6 h-6 ${product.color}`} />
                                        </div>
                                        {product.status && (
                                            <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                                                {product.status}
                                            </span>
                                        )}
                                    </div>
                                    <CardTitle className="text-xl font-bold">{product.title}</CardTitle>
                                    <CardDescription className="text-sm font-medium pt-2">{product.description}</CardDescription>
                                </CardHeader>
                                <CardFooter className="p-6 pt-8">
                                    <Button className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-yellow-500 dark:hover:bg-yellow-400 hover:text-black font-bold group-hover:translate-x-1 transition-all duration-300 flex items-center justify-between">
                                        Launch Tool
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {products.map(product => (
                    <TabsContent key={product.id} value={product.id} className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                        <div className="bg-white dark:bg-[#111318] border border-gray-200 dark:border-white/10 rounded-3xl p-8 lg:p-12 overflow-hidden relative">
                            {/* Background decoration */}
                            <div className={`absolute top-0 right-0 w-[500px] h-[500px] ${product.bg} opacity-20 blur-[100px] rounded-full pointer-events-none`} />

                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${product.bg}`}>
                                        <product.icon className={`w-8 h-8 ${product.color}`} />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{product.title}</h2>
                                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Exclusive Partner Tool</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                    <div className="space-y-8">
                                        <p className="text-lg text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
                                            This serves as the exclusive portal for {product.title}. As a valued partner, you have direct access to our enterprise-grade AI Engine designed to streamline your operations.
                                        </p>

                                        <div className="space-y-4">
                                            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Core Capabilities</h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {product.features.map((feature, idx) => (
                                                    <div key={idx} className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                                                        <CheckCircle2 className={`w-4 h-4 ${product.color}`} />
                                                        <span className="text-xs font-bold text-gray-700 dark:text-gray-200">{feature}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="pt-4 flex gap-4">
                                            <Button className="h-12 px-8 bg-black dark:bg-yellow-500 text-white dark:text-black font-black uppercase text-xs tracking-widest rounded-xl hover:scale-105 transition-transform">
                                                Initialize Tool
                                            </Button>
                                            <Button variant="outline" className="h-12 px-8 font-black uppercase text-xs tracking-widest rounded-xl border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5">
                                                View Documentation
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Placeholder for tool UI preview */}
                                    <div className="rounded-2xl bg-gray-100 dark:bg-black/40 border border-gray-200 dark:border-white/5 aspect-video flex items-center justify-center relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/5 dark:to-white/5 group-hover:opacity-100 transition-opacity" />
                                        <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">Interactive Tool Interface</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
};

export default ProductsOverview;
