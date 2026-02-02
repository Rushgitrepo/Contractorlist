import { Link } from "react-router-dom";
import { Check, Smartphone, Users, Shield, Clock, ArrowRight } from "lucide-react";

const GuideAndValueSection = () => {
    const guides = [
        {
            image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=600&auto=format&fit=crop",
            author: "Robert Tschudi",
            role: "Author/Reviewer",
            date: "Apr 30, 2025",
            title: "Remodel a Kitchen",
            description: "Budget for kitchen remodel costs based on factors like scope, appliances, kitchen size, location, flooring and countertop materials, labor, and more.",
        },
        {
            image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=600&auto=format&fit=crop",
            author: "Jeff Botelho",
            role: "Author/Reviewer",
            date: "Nov 4, 2025",
            title: "Repair a Water Heater",
            description: "Use this guide to budget for water heater repair costs based on factors such as heater type, repair issue, parts, labor, and more.",
        },
        {
            image: "https://images.unsplash.com/photo-1632759145351-1d592919f522?q=80&w=600&auto=format&fit=crop",
            author: "ContractorsList Team",
            role: "Editorial",
            date: "Dec 11, 2025",
            title: "How Much Does Roof Repair Cost in 2025?",
            description: "Use this guide to budget for roof repair costs based on factors such as roof condition, materials, size, repair type and severity, and more.",
        },
    ];

    const valueProps = [
        {
            icon: Clock,
            title: "Get to a hire faster.",
            description: "Share details about your project in your own words, so we can find your best fit.",
        },
        {
            icon: Users,
            title: "Only see local, trusted pros.",
            description: "We'll only show you pros we're confident can do the job.",
        },
        {
            icon: Shield,
            title: "A job done right—guaranteed.",
            description: "If the job isn't done as agreed you could get up to $2,500 back.",
            link: { text: "Terms apply.", href: "/terms" },
        },
    ];

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Guide to Homeowners & Contractors */}
                <div className="mb-20">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
                        Guide to Homeowners <span className="text-primary">&amp; Contractors</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {guides.map((guide, index) => (
                            <div
                                key={index}
                                className="group block"
                            >
                                {/* Image */}
                                <div className="aspect-[16/10] rounded-xl overflow-hidden mb-4">
                                    <img
                                        src={guide.image}
                                        alt={guide.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>

                                {/* Author & Date */}
                                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                                    <span className="font-semibold text-gray-700">{guide.author}</span>
                                    {" - "}
                                    <span>{guide.role}</span>
                                    {" · "}
                                    <span>{guide.date}</span>
                                </p>

                                {/* Title */}
                                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                                    {guide.title}
                                </h3>

                                {/* Description */}
                                <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                                    {guide.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* What ContractorsList.com is Actually! */}
                <div className="bg-gradient-to-br from-orange-50 via-amber-50/50 to-yellow-50/30 rounded-3xl p-8 sm:p-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                        {/* Left Column - Text Content */}
                        <div>
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                                What <span className="text-primary italic">Contractorslist.com</span> is Actually!
                            </h2>
                            <p className="text-gray-600 mb-10 text-base leading-relaxed">
                                Every day, millions of customers like you rely on Contractorslist to care for their residential, commercial and govt. projects—and we've got your back if things don't go as planned.
                            </p>

                            <div className="space-y-8">
                                {valueProps.map((prop, index) => (
                                    <div key={index} className="flex gap-4">
                                        <div className="flex-shrink-0 w-1 bg-primary/30 rounded-full"></div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 mb-1">
                                                {prop.title}
                                            </h3>
                                            <p className="text-sm text-gray-600 leading-relaxed">
                                                {prop.description}
                                                {prop.link && (
                                                    <Link to={prop.link.href} className="text-gray-900 underline ml-1 hover:text-primary">
                                                        {prop.link.text}
                                                    </Link>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Column - Phone Mockup */}
                        <div className="flex justify-center lg:justify-end">
                            <div className="relative">
                                {/* Phone Frame */}
                                {/* Phone Frame - AI Tools Style */}
                                <div className="w-[280px] sm:w-[320px] bg-white dark:bg-[#1a1c21] rounded-[3rem] p-3 shadow-2xl border-[6px] border-gray-900 dark:border-gray-800 relative overflow-hidden">
                                    {/* Notch */}
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 dark:bg-gray-800 rounded-b-xl z-20" />

                                    {/* Screen Content */}
                                    <div className="h-full min-h-[500px] w-full rounded-[2.5rem] bg-gradient-to-b from-gray-50 to-white overflow-hidden flex flex-col relative">

                                        {/* Header Area */}
                                        <div className="pt-12 px-6 pb-4 bg-white shadow-sm z-10">
                                            <div className="flex justify-between items-center">
                                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                                    <span className="text-gray-400 text-lg">×</span>
                                                </div>
                                                <span className="text-sm font-bold text-gray-900">Project Details</span>
                                                <div className="w-8" /> {/* Spacer */}
                                            </div>
                                        </div>

                                        {/* Main Scrollable Content */}
                                        <div className="p-6 flex-1 overflow-y-auto hide-scrollbar">
                                            {/* Avatar Group */}
                                            <div className="flex justify-center mb-6">
                                                <div className="flex -space-x-4">
                                                    {[
                                                        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60",
                                                        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=60",
                                                        "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&auto=format&fit=crop&q=60",
                                                    ].map((src, i) => (
                                                        <div key={i} className="w-12 h-12 rounded-full border-[3px] border-white shadow-md overflow-hidden">
                                                            <img src={src} alt="User" className="w-full h-full object-cover" />
                                                        </div>
                                                    ))}
                                                    <div className="w-12 h-12 rounded-full bg-primary border-[3px] border-white flex items-center justify-center text-black font-bold shadow-md text-xs">
                                                        30+
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Title */}
                                            <div className="text-center mb-8">
                                                <h4 className="text-2xl font-black text-gray-900 mb-2 leading-tight">
                                                    Finding top rated<br /><span className="text-primary">pros</span> for you
                                                </h4>
                                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                                                    Matching your project
                                                </p>
                                            </div>

                                            {/* Cards Stack */}
                                            <div className="space-y-3 relative">
                                                {/* Card 1 */}
                                                <div className="bg-white p-4 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100 flex items-center gap-4 transform scale-100 z-30 relative">
                                                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                                        <Check className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <h5 className="font-bold text-gray-900 text-sm">Lawn & Garden</h5>
                                                        <p className="text-xs text-gray-500">Service Category</p>
                                                    </div>
                                                </div>

                                                {/* Card 2 */}
                                                <div className="bg-white p-4 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100 flex items-center gap-4 transform scale-95 opacity-90 -mt-2 z-20 relative">
                                                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                                        <Check className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <h5 className="font-bold text-gray-900 text-sm">Sprinkler Repair</h5>
                                                        <p className="text-xs text-gray-500">Project Type</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bottom Action Area */}
                                        <div className="p-6 bg-white border-t border-gray-50">
                                            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-2">
                                                <div className="h-full w-3/4 bg-primary rounded-full animate-pulse"></div>
                                            </div>
                                            <p className="text-center text-[10px] text-gray-400 font-medium uppercase tracking-widest">
                                                Analyzing 30+ Pros
                                            </p>
                                        </div>

                                        {/* Home Indicator */}
                                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-300 rounded-full" />
                                    </div>
                                </div>

                                {/* Decorative Elements */}
                                <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>
                                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-orange-200/30 rounded-full blur-2xl"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default GuideAndValueSection;
