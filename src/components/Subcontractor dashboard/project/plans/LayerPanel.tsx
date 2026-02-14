import { useState, useEffect } from "react";
import { Button } from "@/components/Subcontractor dashboard/ui/button";
import { Input } from "@/components/Subcontractor dashboard/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/Subcontractor dashboard/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/Subcontractor dashboard/ui/tooltip";
import { cn } from "@/lib/utils";
import { Layers, Eye, EyeOff, Lock, Unlock, Plus, Trash2, GripVertical } from "lucide-react";
import { AnnotationLayer, useAnnotationLayers, DEFAULT_LAYERS } from "@/hooks/Subcontractor dashboard/useAnnotationLayers";
import { ConfirmDialog } from "@/components/Subcontractor dashboard/ConfirmDialog";


interface LayerPanelProps {
  planId: string;
  projectId: string;
  activeLayer: string;
  onLayerChange: (layer: string) => void;
  isDrawingMode: boolean;
}

export default function LayerPanel({
  planId,
  projectId,
  activeLayer,
  onLayerChange,
  isDrawingMode,
}: LayerPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newLayerName, setNewLayerName] = useState("");
  const [layerToDelete, setLayerToDelete] = useState<{ id: string; label: string } | null>(null);


  const {
    layers,
    visibleLayerNames,
    lockedLayerNames,
    createLayer,
    deleteLayer,
    toggleLayerVisibility,
    toggleLayerLock,
    ensureDefaultLayers,
  } = useAnnotationLayers(planId, projectId);

  // Initialize default layers when panel opens
  useEffect(() => {
    if (isOpen && layers.length === 0) {
      ensureDefaultLayers.mutate();
    }
  }, [isOpen, layers.length]);

  const handleCreateLayer = () => {
    if (!newLayerName.trim()) return;
    createLayer.mutate({
      plan_id: planId,
      project_id: projectId,
      name: newLayerName.trim().toLowerCase().replace(/\s+/g, "-"),
      color: "#3b82f6",
    });
    setNewLayerName("");
  };

  const getLayerLabel = (name: string) => {
    const defaultLayer = DEFAULT_LAYERS.find((dl) => dl.name === name);
    return defaultLayer?.label || name.charAt(0).toUpperCase() + name.slice(1);
  };

  const isDefaultLayer = (name: string) => DEFAULT_LAYERS.some((dl) => dl.name === name);

  if (!isDrawingMode) return null;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Layers className="h-4 w-4" />
              Layers
            </Button>
          </SheetTrigger>
        </TooltipTrigger>
        <TooltipContent>Manage annotation layers</TooltipContent>
      </Tooltip>

      <SheetContent side="right" className="w-80 z-50">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Layers
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {/* Active layer indicator */}
          <div className="text-sm text-muted-foreground">
            Active layer: <span className="font-medium text-foreground">{getLayerLabel(activeLayer)}</span>
          </div>

          {/* Layer list */}
          <div className="space-y-1">
            {layers.map((layer) => (
              <div
                key={layer.id}
                className={cn(
                  "flex items-center gap-2 p-2 rounded-lg border transition-colors cursor-pointer",
                  activeLayer === layer.name
                    ? "bg-accent border-primary"
                    : "hover:bg-muted/50 border-transparent"
                )}
                onClick={() => onLayerChange(layer.name)}
              >
                <GripVertical className="h-4 w-4 text-muted-foreground/50 cursor-grab" />

                {/* Color indicator */}
                <div
                  className="w-3 h-3 rounded-full border border-border"
                  style={{ backgroundColor: layer.color }}
                />

                {/* Layer name */}
                <span className="flex-1 text-sm font-medium truncate">
                  {getLayerLabel(layer.name)}
                </span>

                {/* Visibility toggle */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLayerVisibility.mutate({
                          id: layer.id,
                          is_visible: !layer.is_visible,
                        });
                      }}
                    >
                      {layer.is_visible ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {layer.is_visible ? "Hide layer" : "Show layer"}
                  </TooltipContent>
                </Tooltip>

                {/* Lock toggle */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLayerLock.mutate({
                          id: layer.id,
                          is_locked: !layer.is_locked,
                        });
                      }}
                    >
                      {layer.is_locked ? (
                        <Lock className="h-4 w-4 text-destructive" />
                      ) : (
                        <Unlock className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {layer.is_locked ? "Unlock layer" : "Lock layer"}
                  </TooltipContent>
                </Tooltip>

                {/* Delete (only for custom layers) */}
                {!isDefaultLayer(layer.name) && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          setLayerToDelete({ id: layer.id, label: getLayerLabel(layer.name) });
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Delete layer</TooltipContent>
                  </Tooltip>
                )}
              </div>
            ))}

            {layers.length === 0 && (
              <div className="text-sm text-muted-foreground text-center py-4">
                No layers yet. Click to create default layers.
              </div>
            )}
          </div>

          {/* Create new layer */}
          <div className="border-t pt-4">
            <div className="text-sm font-medium mb-2">Create custom layer</div>
            <div className="flex gap-2">
              <Input
                placeholder="Layer name..."
                value={newLayerName}
                onChange={(e) => setNewLayerName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreateLayer();
                }}
                className="flex-1"
              />
              <Button
                size="icon"
                onClick={handleCreateLayer}
                disabled={!newLayerName.trim() || createLayer.isPending}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Legend */}
          <div className="border-t pt-4 text-xs text-muted-foreground space-y-1">
            <div className="flex items-center gap-2">
              <Eye className="h-3 w-3" /> Click to toggle visibility
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-3 w-3" /> Locked layers cannot be edited
            </div>
          </div>
        </div>
      </SheetContent>

      <ConfirmDialog
        open={!!layerToDelete}
        onOpenChange={(open) => !open && setLayerToDelete(null)}
        title="Delete Layer"
        description={`Are you sure you want to delete the layer "${layerToDelete?.label}"? This action cannot be undone.`}
        onConfirm={() => {
          if (layerToDelete) {
            deleteLayer.mutate(layerToDelete.id);
            setLayerToDelete(null);
          }
        }}
        confirmText="Delete Layer"
        variant="destructive"
      />
    </Sheet>
  );
}
