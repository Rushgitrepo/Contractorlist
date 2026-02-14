import { Badge } from "@/components/Subcontractor dashboard/ui/badge";
import { Button } from "@/components/Subcontractor dashboard/ui/button";
import { ScrollArea } from "@/components/Subcontractor dashboard/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/Subcontractor dashboard/ui/dropdown-menu";
import { FileImage, MoreVertical, Trash2, Loader2, GitBranch, History, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { Plan, PLAN_DISCIPLINES } from "@/hooks/Subcontractor dashboard/usePlans";

interface PlansListProps {
  plans: Plan[];
  selectedPlanId?: string;
  onSelectPlan: (plan: Plan) => void;
  onDeletePlan: (planId: string) => void;
  onUploadRevision?: (plan: Plan) => void;
  onShowVersionHistory?: (plan: Plan) => void;
  isDeleting?: boolean;
}

export default function PlansList({
  plans,
  selectedPlanId,
  onSelectPlan,
  onDeletePlan,
  onUploadRevision,
  onShowVersionHistory,
  isDeleting,
}: PlansListProps) {
  // Group plans by discipline
  const groupedPlans = plans.reduce((acc, plan) => {
    const discipline = plan.discipline || "general";
    if (!acc[discipline]) acc[discipline] = [];
    acc[discipline].push(plan);
    return acc;
  }, {} as Record<string, Plan[]>);

  const getDisciplineLabel = (value: string) => {
    return PLAN_DISCIPLINES.find((d) => d.value === value)?.label || "General";
  };

  if (plans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6">
        <FileImage className="w-12 h-12 text-muted-foreground/50 mb-3" />
        <p className="text-sm text-muted-foreground">No plans uploaded yet</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-3 space-y-4">
        {Object.entries(groupedPlans).map(([discipline, disciplinePlans]) => (
          <div key={discipline}>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
              {getDisciplineLabel(discipline)}
            </h4>
            <div className="space-y-1">
              {disciplinePlans.map((plan) => (
                <div
                  key={plan.id}
                  className={cn(
                    "group flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors",
                    selectedPlanId === plan.id
                      ? "bg-primary/10 border border-primary/30"
                      : "hover:bg-muted"
                  )}
                  onClick={() => onSelectPlan(plan)}
                >
                  <div className="w-10 h-10 rounded bg-muted flex items-center justify-center flex-shrink-0">
                    <FileImage className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{plan.name}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {plan.sheet_number && (
                        <Badge variant="outline" className="text-[10px]">
                          {plan.sheet_number}
                        </Badge>
                      )}
                      {(plan.version || 1) > 1 && (
                        <Badge variant="secondary" className="text-[10px]">
                          <GitBranch className="w-2.5 h-2.5 mr-0.5" />
                          v{plan.version}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {plan.sheet_number && (
                        <>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              onUploadRevision?.(plan);
                            }}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Upload New Revision
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              onShowVersionHistory?.(plan);
                            }}
                          >
                            <History className="w-4 h-4 mr-2" />
                            Version History
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                        </>
                      )}
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeletePlan(plan.id);
                        }}
                        disabled={isDeleting}
                      >
                        {isDeleting ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4 mr-2" />
                        )}
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
