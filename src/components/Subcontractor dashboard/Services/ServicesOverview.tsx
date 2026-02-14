import { useState } from 'react';
import { LayoutDashboard, TrendingUp, Users, FileText, ArrowRight, CheckCircle2, Star } from 'lucide-react';
import { Button } from '@/components/Subcontractor dashboard/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/Subcontractor dashboard/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/Subcontractor dashboard/ui/tabs';

const ServicesOverview = () => {
    const [activeTab, setActiveTab] = useState("overview");

    const services = [
        {
            id: "website-dev",
            title: "Website Development",
            description: "Custom-built, high-converting websites designed specifically for construction professionals.",
            icon: LayoutDashboard,
            color: "text-purple-500",
            bg: "bg-purple-100 dark:bg-purple-900/20",
            features: ["Custom UI/UX Design", "SEO Optimized Architecture", "Lead Generation Forms", "Project Portfolio Gallery"]
        },
        {
            id: "marketing",
            title: "Growth Packages",
            description: "Comprehensive marketing, SEO, and GMB optimization to dominate your local market.",
            icon: TrendingUp,
            color: "text-green-500",
            bg: "bg-green-100 dark:bg-green-900/20",
            status: "Recommended",
            features: ["Google Maps Ranking", "Local SEO Domination", "Social Media Management", "Review Reputation System"]
        },
        {
            id: "augmentation",
            title: "Augmentation",
            description: "Scale your team instantly with dedicated estimators, architects, and project managers.",
            icon: Users,
            color: "text-blue-500",
            bg: "bg-blue-100 dark:bg-blue-900/20",
            features: ["Vetted Industry Experts", "Flexible Hiring Models", "Instant Onboarding", "Dedicated Project Managers"]
        },
        {
            id: "estimating",
            title: "Paradise Estimating",
            description: "Professional estimating and takeoff services to help you win more bids with less effort.",
            icon: FileText,
            color: "text-rose-500",
            bg: "bg-rose-100 dark:bg-rose-900/20",
            status: "Hot",
            features: ["Detailed Material Lists", "Labor Cost Analysis", "Bid Proposal Prep", "24-Hour Turnaround Available"]
        }
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 min-h-screen flex flex-col">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">Professional Services</h1>
                <p className="text-gray-500 dark:text-gray-400 font-medium">
                    Expert services to help you scale, manage, and grow your construction business.
                </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="w-full overflow-x-auto pb-4">
                    <TabsList className="inline-flex min-w-full md:min-w-0 md:grid md:w-full md:grid-cols-5 h-12 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                        <TabsTrigger value="overview" className="rounded-lg font-bold text-xs uppercase tracking-wider data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm">Overview</TabsTrigger>
                        {services.map(s => (
                            <TabsTrigger key={s.id} value={s.id} className="rounded-lg font-bold text-xs uppercase tracking-wider data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm whitespace-nowrap px-4 md:px-0">
                                {s.title.split(' ')[0]}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                <TabsContent value="overview" className="space-y-6 animate-in fade-in-50 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {services.map((service) => (
                            <Card
                                key={service.title}
                                className="group border-gray-200 dark:border-white/10 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
                                onClick={() => setActiveTab(service.id)}
                            >
                                <CardHeader className="p-6 pb-0">
                                    <div className="flex justify-between items-start">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${service.bg} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                            <service.icon className={`w-6 h-6 ${service.color}`} />
                                        </div>
                                        {service.status && (
                                            <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                                                {service.status}
                                            </span>
                                        )}
                                    </div>
                                    <CardTitle className="text-xl font-bold">{service.title}</CardTitle>
                                    <CardDescription className="text-sm font-medium pt-2">{service.description}</CardDescription>
                                </CardHeader>
                                <CardFooter className="p-6 pt-8">
                                    <Button className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-yellow-500 dark:hover:bg-yellow-400 hover:text-black font-bold group-hover:translate-x-1 transition-all duration-300 flex items-center justify-between">
                                        View Service
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {services.map(service => (
                    <TabsContent key={service.id} value={service.id} className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                        <div className="bg-white dark:bg-[#111318] border border-gray-200 dark:border-white/10 rounded-3xl p-8 lg:p-12 overflow-hidden relative">
                            {/* Background decoration */}
                            <div className={`absolute top-0 right-0 w-[500px] h-[500px] ${service.bg} opacity-20 blur-[100px] rounded-full pointer-events-none`} />

                            <div className="relative z-10">
                                <div className="flex flex-col lg:flex-row lg:items-center gap-6 mb-12">
                                    <div className={`w-20 h-20 rounded-2xl flex items-center justify-center ${service.bg} shrink-0`}>
                                        <service.icon className={`w-10 h-10 ${service.color}`} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">{service.title}</h2>
                                            {service.status && (
                                                <span className="bg-black text-white text-[10px] font-bold uppercase px-2 py-1 rounded border border-gray-800">
                                                    {service.status}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl font-medium">{service.description}</p>
                                    </div>
                                    <div className="flex gap-3 shrink-0">
                                        <Button className="h-12 px-8 bg-black dark:bg-yellow-500 text-white dark:text-black font-black uppercase text-xs tracking-widest rounded-xl hover:scale-105 transition-transform shadow-xl">
                                            Request Consultation
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {service.features.map((feature, idx) => (
                                            <div key={idx} className="group p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/20 transition-colors">
                                                <div className="flex items-start gap-4">
                                                    <div className="mt-1">
                                                        <CheckCircle2 className={`w-5 h-5 ${service.color}`} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-gray-900 dark:text-white mb-1">{feature}</h4>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                                                            Premium capability enabled for your account level.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="bg-gray-900 dark:bg-black rounded-2xl p-6 text-white relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-3">
                                            <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                                        </div>
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Why Choose Us</span>
                                        <h3 className="text-2xl font-bold mt-2 mb-4">Dedicated Support Team</h3>
                                        <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                                            Get priority access to our team of experts who work as an extension of your own business to ensure success.
                                        </p>
                                        <div className="flex items-center gap-3">
                                            <div className="flex -space-x-3">
                                                {[1, 2, 3].map(i => (
                                                    <div key={i} className="w-8 h-8 rounded-full bg-gray-700 border-2 border-gray-900" />
                                                ))}
                                            </div>
                                            <span className="text-xs font-bold text-gray-400">+12 Experts Online</span>
                                        </div>
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

export default ServicesOverview;
