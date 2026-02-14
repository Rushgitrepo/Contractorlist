import { ScrollArea } from "@/components/Subcontractor dashboard/ui/scroll-area";
import { Button } from "@/components/Subcontractor dashboard/ui/button";
import { Badge } from "@/components/Subcontractor dashboard/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/Subcontractor dashboard/ui/tooltip";
import { History, Check, Eye, Loader2, X, GitBranch } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { usePlanVersionHistory, useSetCurrentVersion, PlanVersion } from "@/hooks/Subcontractor dashboard/usePlanVersions";
import { Plan } from "@/hooks/Subcontractor dashboard/usePlans";

interface VersionHistoryPanelProps {
  plan: Plan;
  projectId: string;
  onClose: () => void;
  onViewVersion: (version: PlanVersion) => void;
  viewingVersionId?: string;
}

export default function VersionHistoryPanel({
  plan,
  projectId,
  onClose,
  onViewVersion,
  viewingVersionId,
}: VersionHistoryPanelProps) {
  const { data: versions, isLoading } = usePlanVersionHistory(
    projectId,
    plan.sheet_number,
    plan.discipline
  );
  const setCurrentVersion = useSetCurrentVersion(projectId);

  const handleSetCurrent = (version: PlanVersion) => {
    setCurrentVersion.mutate({
      versionId: version.id,
      sheetNumber: version.sheet_number,
      discipline: version.discipline,
    });
  };

  // If there's no sheet number, versioning isn't available
  if (!plan.sheet_number) {
    return (
      <div className="h-full flex flex-col border-l bg-background">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5" />
            <h3 className="font-semibold">Version History</h3>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex-1 flex items-center justify-center p-6 text-center">
          <div>
            <GitBranch className="w-10 h-10 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">
              Versioning requires a sheet number.
              <br />
              Add a sheet number to track revisions.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col border-l bg-background">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5" />
          <h3 className="font-semibold">Version History</h3>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="p-3 border-b bg-muted/30">
        <p className="text-sm font-medium">{plan.name}</p>
        <p className="text-xs text-muted-foreground">
          {plan.sheet_number}
          {plan.discipline && ` • ${plan.discipline}`}
        </p>
      </div>

      <ScrollArea className="flex-1">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : !versions || versions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <History className="w-8 h-8 text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground">No versions found</p>
          </div>
        ) : (
          <div className="p-3 space-y-2">
            {versions.map((version, index) => {
              const isViewing = viewingVersionId === version.id;
              const isCurrent = version.is_current;

              return (
                <div
                  key={version.id}
                  className={cn(
                    "p-3 rounded-lg border transition-colors",
                    isViewing
                      ? "bg-primary/10 border-primary/30"
                      : "hover:bg-muted/50"
                  )}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={isCurrent ? "default" : "outline"}
                        className="text-xs"
                      >
                        v{version.version || 1}
                      </Badge>
                      {isCurrent && (
                        <Badge variant="secondary" className="text-xs">
                          <Check className="w-3 h-3 mr-1" />
                          Current
                        </Badge>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground mb-1">
                    {format(new Date(version.created_at), "MMM d, yyyy 'at' h:mm a")}
                  </p>

                  {version.uploaded_by_profile && (
                    <p className="text-xs text-muted-foreground mb-2">
                      by {version.uploaded_by_profile.full_name || version.uploaded_by_profile.email}
                    </p>
                  )}

                  {version.description && (
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {version.description}
                    </p>
                  )}

                  <div className="flex items-center gap-2 mt-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={isViewing ? "secondary" : "outline"}
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => onViewVersion(version)}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            {isViewing ? "Viewing" : "View"}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>View this version</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    {!isCurrent && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs"
                              onClick={() => handleSetCurrent(version)}
                              disabled={setCurrentVersion.isPending}
                            >
                              {setCurrentVersion.isPending ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <>
                                  <Check className="w-3 h-3 mr-1" />
                                  Set as Current
                                </>
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Make this the current version</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
