import { Link } from "react-router-dom";
import { MapPin, Building2, DollarSign, Calendar, Clock, ExternalLink, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const FeaturedProjectsSection = () => {
    const projects = [
        {
            id: "CC-2024-15847",
            title: "Downtown Medical Center Expansion - Phase 2",
            status: "Bidding",
            visibility: "Private",
            isNew: true,
            isAddenda: true,
            rating: 5,
            location: "Austin, TX",
            category: "Healthcare",
            budget: "$45M - $6...",
            bidDate: "Bid: Feb 15...",
            description: "Major expansion of existing medical center including new surgical wing, patient rooms, and parking structure. Seeking qualified gener...",
            tags: ["General Construction", "Electrical", "HVAC", "Plumbing"],
            extraTags: 2,
            postedAgo: "2 days ago",
        },
        {
            id: "CC-2024-15892",
            title: "Riverside Commercial Office Complex",
            status: "Planning",
            visibility: "Private",
            isDocs: true,
            rating: 5,
            location: "San Antonio...",
            category: "Commercial...",
            budget: "$25M - $3...",
            bidDate: "",
            description: "New 12-story Class A office building with underground parking, retail space on ground floor, and rooftop amenities. LEED Gold...",
            tags: ["General Construction", "Structural Steel", "Curtain Wall", "Electrical"],
            extraTags: 0,
            postedAgo: "6 days ago",
        },
        {
            id: "CC-2024-15847",
            title: "Downtown Medical Center Expansion - Phase 2",
            status: "Bidding",
            visibility: "Private",
            isNew: true,
            isAddenda: true,
            rating: 5,
            location: "Austin, TX",
            category: "Healthcare",
            budget: "$45M - $6...",
            bidDate: "Bid: Feb 15...",
            description: "Major expansion of existing medical center including new surgical wing, patient rooms, and parking structure. Seeking qualified gener...",
            tags: ["General Construction", "Electrical", "HVAC", "Plumbing"],
            extraTags: 2,
            postedAgo: "2 days ago",
        },
        {
            id: "CC-2024-15892",
            title: "Riverside Commercial Office Complex",
            status: "Planning",
            visibility: "Private",
            isDocs: false,
            rating: 5,
            location: "San Antonio...",
            category: "Commercial...",
            budget: "$25M - $3...",
            bidDate: "",
            description: "New 12-story Class A office building with underground parking, retail space on ground floor, and rooftop amenities. LEED Gold...",
            tags: ["General Construction", "Structural Steel", "Curtain Wall", "Electrical"],
            extraTags: 1,
            postedAgo: "6 days ago",
        },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Bidding":
                return "bg-primary text-black";
            case "Planning":
                return "bg-green-100 text-green-700 border-green-200";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <section className="py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
                    Popular Projects in your <span className="text-primary">Area</span>
                </h2>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    {projects.map((project, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg hover:border-primary/30 transition-all duration-300 group"
                        >
                            {/* Header Badges */}
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                    <Badge className={`${getStatusColor(project.status)} text-[10px] font-semibold px-2 py-0.5 rounded`}>
                                        {project.status}
                                    </Badge>
                                    <Badge variant="outline" className="text-[10px] font-medium px-2 py-0.5 rounded border-gray-300 text-gray-600">
                                        {project.visibility}
                                    </Badge>
                                    {project.isNew && (
                                        <Badge className="bg-blue-100 text-blue-700 text-[10px] font-medium px-2 py-0.5 rounded">
                                            New
                                        </Badge>
                                    )}
                                    {project.isAddenda && (
                                        <Badge className="bg-orange-100 text-orange-700 text-[10px] font-medium px-2 py-0.5 rounded">
                                            Addenda
                                        </Badge>
                                    )}
                                    {project.isDocs && (
                                        <Badge className="bg-purple-100 text-purple-700 text-[10px] font-medium px-2 py-0.5 rounded">
                                            Docs
                                        </Badge>
                                    )}
                                </div>
                                <div className="flex items-center gap-0.5">
                                    {[...Array(project.rating)].map((_, i) => (
                                        <Star key={i} className="w-3 h-3 fill-primary text-primary" />
                                    ))}
                                </div>
                            </div>

                            {/* Title */}
                            <h3 className="font-bold text-sm text-gray-900 mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                                {project.title}
                            </h3>

                            {/* ID */}
                            <p className="text-[10px] text-gray-400 mb-3">ID: {project.id}</p>

                            {/* Meta Info */}
                            <div className="flex flex-wrap items-center gap-2 text-[10px] text-gray-500 mb-3">
                                <div className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    <span>{project.location}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Building2 className="w-3 h-3" />
                                    <span>{project.category}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <DollarSign className="w-3 h-3" />
                                    <span>{project.budget}</span>
                                </div>
                                {project.bidDate && (
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        <span>{project.bidDate}</span>
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            <p className="text-[11px] text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                                {project.description}
                            </p>

                            {/* Tags */}
                            <div className="flex flex-wrap items-center gap-1.5 mb-4">
                                {project.tags.map((tag, tagIndex) => (
                                    <span
                                        key={tagIndex}
                                        className="text-[9px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full"
                                    >
                                        {tag}
                                    </span>
                                ))}
                                {project.extraTags > 0 && (
                                    <span className="text-[9px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                                        +{project.extraTags} more
                                    </span>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                <div className="flex items-center gap-1 text-[10px] text-gray-400">
                                    <Clock className="w-3 h-3" />
                                    <span>Posted {project.postedAgo}</span>
                                </div>
                                <Link
                                    to={`/projects/${project.id}`}
                                    className="flex items-center gap-1 text-[11px] font-semibold text-gray-700 hover:text-primary transition-colors"
                                >
                                    View Details
                                    <ExternalLink className="w-3 h-3" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedProjectsSection;
