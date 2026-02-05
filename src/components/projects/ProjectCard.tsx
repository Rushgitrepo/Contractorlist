import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    MapPin,
    Calendar,
    DollarSign,
    Building2,
    FileText,
    Clock,
    Star,
    Bookmark,
    ExternalLink
} from "lucide-react";

export interface Project {
    id: string;
    title: string;
    projectId: string;
    location: string;
    city: string;
    state: string;
    category: string;
    subcategory: string;
    stage: "Planning" | "Bidding" | "Post-Bid" | "Under Construction";
    bidDate?: string;
    estimatedValue: string;
    description: string;
    owner: string;
    trades: string[];
    documentsAvailable: boolean;
    addendaAvailable: boolean;
    privatelyFunded: boolean;
    matchScore?: number;
    postedDate: string;
    sector?: string;                // Added
    constructionType?: string;      // Added
    laborRequirements?: string;     // Added
    country?: string;               // Added
    county?: string;                // Added
    materials?: string[];           // Added
    experienceRequired?: string;    // Added
    bondedRequired?: boolean;       // Added
    insuredRequired?: boolean;      // Added
    status?: string;                // Added
    source?: string;                // Added
    nigpCode?: string;              // Added
}

interface ProjectCardProps {
    project: Project;
    onSave?: (id: string) => void;
    isSaved?: boolean;
}

const stageColors: Record<Project["stage"], string> = {
    "Planning": "bg-blue-500/10 text-blue-600 border-blue-500/20",
    "Bidding": "bg-green-500/10 text-green-600 border-green-500/20",
    "Post-Bid": "bg-amber-500/10 text-amber-600 border-amber-500/20",
    "Under Construction": "bg-purple-500/10 text-purple-600 border-purple-500/20",
};

const ProjectCard = ({ project, onSave, isSaved = false }: ProjectCardProps) => {
    return (
        <Card className="p-5 hover:shadow-lg transition-all duration-200 border-border/50 hover:border-accent/30 group">
            <div className="flex flex-col gap-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className={stageColors[project.stage]}>
                                {project.stage}
                            </Badge>
                            {project.privatelyFunded && (
                                <Badge variant="secondary" className="text-xs">
                                    Private
                                </Badge>
                            )}
                            {project.documentsAvailable && (
                                <Badge variant="outline" className="text-xs bg-accent/5 text-accent border-accent/20">
                                    <FileText className="w-3 h-3 mr-1" />
                                    Docs
                                </Badge>
                            )}
                            {project.addendaAvailable && (
                                <Badge variant="outline" className="text-xs bg-primary/5 text-primary border-primary/20">
                                    Addenda
                                </Badge>
                            )}
                        </div>
                        <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-2 text-lg">
                            {project.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            ID: {project.projectId}
                        </p>
                    </div>

                    {/* Match Score */}
                    {project.matchScore && (
                        <div className="flex flex-col items-center justify-center bg-accent/10 rounded-lg p-2 min-w-[60px]">
                            <div className="flex items-center gap-0.5">
                                {[...Array(7)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-2.5 h-2.5 ${i < project.matchScore! ? "fill-accent text-accent" : "text-muted-foreground/30"}`}
                                    />
                                ))}
                            </div>
                            <span className="text-xs font-medium text-accent mt-1">
                                {project.matchScore}/7 Match
                            </span>
                        </div>
                    )}
                </div>

                {/* Meta Information */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{project.city}, {project.state}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Building2 className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{project.category}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <DollarSign className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{project.estimatedValue}</span>
                    </div>
                    {project.bidDate && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">Bid: {project.bidDate}</span>
                        </div>
                    )}
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground line-clamp-2">
                    {project.description}
                </p>

                {/* Trades */}
                <div className="flex flex-wrap gap-1.5">
                    {project.trades.slice(0, 4).map((trade) => (
                        <Badge key={trade} variant="secondary" className="text-xs font-normal">
                            {trade}
                        </Badge>
                    ))}
                    {project.trades.length > 4 && (
                        <Badge variant="secondary" className="text-xs font-normal">
                            +{project.trades.length - 4} more
                        </Badge>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-border/50">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Posted {project.postedDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onSave?.(project.id)}
                            className={isSaved ? "text-accent" : "text-muted-foreground"}
                        >
                            <Bookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
                        </Button>
                        <Button variant="outline" size="sm" className="gap-1.5" asChild>
                            <Link to={`/projects/${project.id}`}>
                                View Details
                                <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default ProjectCard;
