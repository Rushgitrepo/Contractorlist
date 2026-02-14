import { useState, useMemo, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Subcontractor dashboard/ui/card";
import { Button } from "@/components/Subcontractor dashboard/ui/button";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/Subcontractor dashboard/ui/resizable";
import { Plus, MapPin, Loader2, FileImage, History, Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useProjectPlans,
  usePlanPins,
  useDeletePlan,
  useBulkUpdatePins,
  Plan,
  PlanPin,
  PinStatus,
} from "@/hooks/Subcontractor dashboard/usePlans";
import { PlanVersion } from "@/hooks/Subcontractor dashboard/usePlanVersions";
import PlanViewer, { PlanViewerHandle } from "./plans/PlanViewer";
import PlansList from "./plans/PlansList";
import UploadPlanDialog from "./plans/UploadPlanDialog";
import UploadRevisionDialog from "./plans/UploadRevisionDialog";
import VersionHistoryPanel from "./plans/VersionHistoryPanel";
import AddPinDialog from "./plans/AddPinDialog";
import PinDetailPanel from "./plans/PinDetailPanel";
import PinFilters, { PinFiltersState, DEFAULT_FILTERS, ViewMode } from "./plans/PinFilters";
import BulkPinActions from "./plans/BulkPinActions";
import PinListView from "./plans/PinListView";
import { usePlanExport } from "@/hooks/Subcontractor dashboard/usePlanExport";

interface ProjectPlansTabProps {
  projectId: string;
}

export default function ProjectPlansTab({ projectId }: ProjectPlansTabProps) {
  const { data: plans, isLoading: isLoadingPlans } = useProjectPlans(projectId);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [selectedPin, setSelectedPin] = useState<PlanPin | null>(null);
  const [isAddingPin, setIsAddingPin] = useState(false);
  const [pendingPinPosition, setPendingPinPosition] = useState<{ x: number; y: number } | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [filters, setFilters] = useState<PinFiltersState>(DEFAULT_FILTERS);
  const [selectedPinIds, setSelectedPinIds] = useState<Set<string>>(new Set());
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("map");
  const [isFullscreen, setIsFullscreen] = useState(false);
  // Version-related state
  const [revisionDialogPlan, setRevisionDialogPlan] = useState<Plan | null>(null);
  const [versionHistoryPlan, setVersionHistoryPlan] = useState<Plan | null>(null);
  const [viewingVersion, setViewingVersion] = useState<PlanVersion | null>(null);

  // Keep selectedPlan in sync with actual plans data
  // This ensures we don't reference stale/deleted plans
  const validSelectedPlan = useMemo(() => {
    if (!plans || plans.length === 0) return null;
    if (selectedPlan) {
      // Check if the selected plan still exists in the current plans list
      const existingPlan = plans.find(p => p.id === selectedPlan.id);
      if (existingPlan) return existingPlan;
    }
    // Auto-select first plan if no valid selection
    return plans[0];
  }, [plans, selectedPlan?.id]);

  // Update local state when validSelectedPlan changes
  if (validSelectedPlan?.id !== selectedPlan?.id) {
    setSelectedPlan(validSelectedPlan);
  }

  // Use validSelectedPlan for all operations
  const activePlan = validSelectedPlan;

  const { data: pins, isLoading: isLoadingPins } = usePlanPins(activePlan?.id);
  const deletePlan = useDeletePlan(projectId);
  const bulkUpdatePins = useBulkUpdatePins(activePlan?.id || "");
  
  // PDF Export
  const planViewerRef = useRef<PlanViewerHandle>(null);
  const { exportToPdf, isExporting } = usePlanExport();

  // Filter pins based on current filter state
  const filteredPins = useMemo(() => {
    if (!pins) return [];
    
    return pins.filter((pin) => {
      // Filter by search text
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const titleMatch = pin.title.toLowerCase().includes(searchLower);
        const descMatch = pin.description?.toLowerCase().includes(searchLower);
        if (!titleMatch && !descMatch) {
          return false;
        }
      }
      
      // Filter by type
      if (filters.type !== "all" && pin.pin_type !== filters.type) {
        return false;
      }
      
      // Filter by status
      if (filters.status !== "all" && pin.status !== filters.status) {
        return false;
      }
      
      // Filter by RFI
      if (filters.hasRfi === "yes" && !pin.rfi_id) {
        return false;
      }
      if (filters.hasRfi === "no" && pin.rfi_id) {
        return false;
      }
      
      // Filter by photos
      const photoCount = pin.photo_count || 0;
      if (filters.hasPhotos === "yes" && photoCount === 0) {
        return false;
      }
      if (filters.hasPhotos === "no" && photoCount > 0) {
        return false;
      }
      
      return true;
    });
  }, [pins, filters]);
  
  const handleExportPdf = useCallback(() => {
    if (!planViewerRef.current || !activePlan) return;
    
    const exportableElement = planViewerRef.current.getExportableElement();
    const annotations = planViewerRef.current.getAnnotations();
    
    exportToPdf(
      { current: exportableElement } as React.RefObject<HTMLDivElement>,
      {
        planName: activePlan.name,
        projectName: `Project ${projectId.slice(0, 8)}`,
        includeAnnotations: true,
        includePins: true,
        includeMeasurements: true,
        includeSummary: true,
      },
      filteredPins,
      annotations
    );
  }, [activePlan, projectId, exportToPdf, filteredPins]);

  const handleAddPin = (x: number, y: number) => {
    setPendingPinPosition({ x, y });
    setIsAddingPin(false);
  };

  const handlePinClick = (pin: PlanPin) => {
    if (isSelectMode) {
      // Toggle pin selection in select mode
      setSelectedPinIds((prev) => {
        const next = new Set(prev);
        if (next.has(pin.id)) {
          next.delete(pin.id);
        } else {
          next.add(pin.id);
        }
        return next;
      });
    } else {
      setSelectedPin(pin);
    }
  };

  const handleSelectAll = useCallback(() => {
    setIsSelectMode(true);
    setSelectedPinIds(new Set(filteredPins.map((p) => p.id)));
  }, [filteredPins]);

  const handleClearSelection = useCallback(() => {
    setSelectedPinIds(new Set());
    setIsSelectMode(false);
  }, []);

  const handleBulkUpdateStatus = useCallback(
    (status: PinStatus) => {
      if (selectedPinIds.size === 0) return;
      bulkUpdatePins.mutate(
        { pinIds: Array.from(selectedPinIds), status },
        {
          onSuccess: () => {
            setSelectedPinIds(new Set());
            setIsSelectMode(false);
          },
        }
      );
    },
    [selectedPinIds, bulkUpdatePins]
  );

  const toggleSelectMode = useCallback(() => {
    if (isSelectMode) {
      setSelectedPinIds(new Set());
    }
    setIsSelectMode(!isSelectMode);
  }, [isSelectMode]);

  if (isLoadingPlans) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className={cn(
      "space-y-4",
      isFullscreen && "fixed inset-0 z-50 bg-background p-4"
    )}>
      <Card className="overflow-hidden h-full flex flex-col">
        <CardHeader className="pb-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileImage className="w-5 h-5" />
              {isFullscreen && activePlan ? (
                <span className="flex items-center gap-2">
                  <span className="text-muted-foreground font-normal">Viewing:</span>
                  {activePlan.name}
                </span>
              ) : (
                "Plans & Blueprints"
              )}
            </CardTitle>
            <div className="flex items-center gap-2">
              {activePlan && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsFullscreen(!isFullscreen)}
                  >
                    {isFullscreen ? (
                      <Minimize2 className="w-4 h-4" />
                    ) : (
                      <Maximize2 className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    variant={isSelectMode ? "secondary" : "outline"}
                    size="sm"
                    onClick={toggleSelectMode}
                  >
                    {isSelectMode ? "Exit Select" : "Select"}
                  </Button>
                  <Button
                    variant={isAddingPin ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => setIsAddingPin(!isAddingPin)}
                    disabled={isSelectMode || !!viewingVersion}
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    {isAddingPin ? "Cancel" : "Add Pin"}
                  </Button>
                </>
              )}
              <Button size="sm" onClick={() => setUploadDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Upload Plan
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 flex-1 min-h-0">
          <div className={cn(
            "border-t",
            isFullscreen ? "h-full" : "h-[600px]"
          )}>
            {!plans || plans.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <FileImage className="w-16 h-16 text-muted-foreground/40 mb-4" />
                <h3 className="text-lg font-medium mb-2">No plans uploaded yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload blueprints, drawings, and floor plans to mark up and share with your team.
                </p>
                <Button onClick={() => setUploadDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Upload First Plan
                </Button>
              </div>
            ) : (
              <ResizablePanelGroup direction="horizontal">
                {/* Plans list sidebar - hidden in fullscreen */}
                {!isFullscreen && (
                  <>
                    <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
                      <PlansList
                        plans={plans}
                        selectedPlanId={activePlan?.id}
                        onSelectPlan={(plan) => {
                          setSelectedPlan(plan);
                          setSelectedPin(null);
                          setSelectedPinIds(new Set());
                          setIsSelectMode(false);
                          setViewingVersion(null);
                          setVersionHistoryPlan(null);
                        }}
                        onDeletePlan={(planId) => deletePlan.mutate(planId)}
                        onUploadRevision={(plan) => setRevisionDialogPlan(plan)}
                        onShowVersionHistory={(plan) => {
                          setVersionHistoryPlan(plan);
                          setSelectedPin(null);
                        }}
                        isDeleting={deletePlan.isPending}
                      />
                    </ResizablePanel>

                    <ResizableHandle withHandle />
                  </>
                )}

                {/* Plan viewer */}
                <ResizablePanel defaultSize={isFullscreen ? 100 : (selectedPin ? 55 : 80)}>
                  {activePlan ? (
                    isLoadingPins ? (
                      <div className="flex items-center justify-center h-full">
                        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                      </div>
                    ) : (
                      <div className="flex flex-col h-full">
                        {isSelectMode && (
                          <BulkPinActions
                            selectedCount={selectedPinIds.size}
                            totalCount={filteredPins.length}
                            onSelectAll={handleSelectAll}
                            onClearSelection={handleClearSelection}
                            onBulkUpdateStatus={handleBulkUpdateStatus}
                            isUpdating={bulkUpdatePins.isPending}
                          />
                        )}
                        <PinFilters
                          filters={filters}
                          onFiltersChange={setFilters}
                          pinCount={pins?.length || 0}
                          filteredCount={filteredPins.length}
                          pins={filteredPins}
                          planName={activePlan.name}
                          viewMode={viewMode}
                          onViewModeChange={setViewMode}
                          viewingVersionNumber={viewingVersion?.version}
                          isViewingOldVersion={!!viewingVersion}
                          onExitVersionView={() => setViewingVersion(null)}
                          onShowVersionHistory={() => {
                            setVersionHistoryPlan(activePlan);
                            setSelectedPin(null);
                          }}
                          hasVersionHistory={!!activePlan.sheet_number}
                          onExportPdf={handleExportPdf}
                          isExportingPdf={isExporting}
                        />
                        <div className="flex-1">
                          {viewMode === "map" ? (
                            <PlanViewer
                              ref={planViewerRef}
                              imageUrl={viewingVersion?.file_path || activePlan.file_path}
                              planId={activePlan.id}
                              projectId={projectId}
                              pins={viewingVersion ? [] : filteredPins}
                              isAddingPin={!viewingVersion && isAddingPin}
                              onPinClick={handlePinClick}
                              onAddPin={handleAddPin}
                              selectedPinId={selectedPin?.id}
                              searchQuery={filters.search}
                              isSelectMode={isSelectMode}
                              selectedPinIds={selectedPinIds}
                              scaleCalibration={(activePlan as any).scale_calibration || null}
                            />
                          ) : (
                            <PinListView
                              pins={filteredPins}
                              onPinClick={handlePinClick}
                              selectedPinId={selectedPin?.id}
                              isSelectMode={isSelectMode}
                              selectedPinIds={selectedPinIds}
                              onToggleSelect={(pinId) => {
                                setSelectedPinIds((prev) => {
                                  const next = new Set(prev);
                                  if (next.has(pinId)) {
                                    next.delete(pinId);
                                  } else {
                                    next.add(pinId);
                                  }
                                  return next;
                                });
                              }}
                              searchQuery={filters.search}
                            />
                          )}
                        </div>
                      </div>
                    )
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      Select a plan to view
                    </div>
                  )}
                </ResizablePanel>

                {/* Pin detail panel or Version history panel - hidden in fullscreen */}
                {!isFullscreen && versionHistoryPlan && activePlan && !selectedPin && (
                  <>
                    <ResizableHandle />
                    <ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
                      <VersionHistoryPanel
                        plan={versionHistoryPlan}
                        projectId={projectId}
                        onClose={() => {
                          setVersionHistoryPlan(null);
                          setViewingVersion(null);
                        }}
                        onViewVersion={(version) => {
                          setViewingVersion(version);
                        }}
                        viewingVersionId={viewingVersion?.id}
                      />
                    </ResizablePanel>
                  </>
                )}
                {!isFullscreen && selectedPin && activePlan && !versionHistoryPlan && (
                  <>
                    <ResizableHandle />
                    <ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
                      <PinDetailPanel
                        pin={selectedPin}
                        planId={activePlan.id}
                        projectId={projectId}
                        onClose={() => setSelectedPin(null)}
                      />
                    </ResizablePanel>
                  </>
                )}
              </ResizablePanelGroup>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <UploadPlanDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        projectId={projectId}
      />

      {pendingPinPosition && activePlan && (
        <AddPinDialog
          open={!!pendingPinPosition}
          onOpenChange={(open) => !open && setPendingPinPosition(null)}
          planId={activePlan.id}
          projectId={projectId}
          position={pendingPinPosition}
        />
      )}

      {/* Upload Revision Dialog */}
      {revisionDialogPlan && (
        <UploadRevisionDialog
          open={!!revisionDialogPlan}
          onOpenChange={(open) => !open && setRevisionDialogPlan(null)}
          plan={revisionDialogPlan}
          projectId={projectId}
          onSuccess={(newPlan) => {
            // Switch to the new version
            setSelectedPlan(newPlan);
            setRevisionDialogPlan(null);
          }}
        />
      )}
    </div>
  );
}
