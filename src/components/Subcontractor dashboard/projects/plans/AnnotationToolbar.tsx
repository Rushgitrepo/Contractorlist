import { Button } from "@/components/Subcontractor dashboard/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/Subcontractor dashboard/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/Subcontractor dashboard/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  Minus,
  ArrowRight,
  Square,
  Type,
  Pencil,
  MousePointer,
  Palette,
  Trash2,
  X,
  Ruler,
  Move3D,
  Settings2,
  Undo2,
  Redo2,
  LayoutList,
} from "lucide-react";
import { AnnotationType, ANNOTATION_COLORS, STROKE_WIDTHS } from "@/hooks/Subcontractor dashboard/useAnnotations";
import { ScaleCalibration } from "@/hooks/Subcontractor dashboard/useScaleCalibration";
import { HistoryEntry } from "@/hooks/Subcontractor dashboard/useAnnotationHistory";
import HistoryDropdown from "./HistoryDropdown";

interface AnnotationToolbarProps {
  activeTool: AnnotationType | "select" | "calibrate" | null;
  onToolChange: (tool: AnnotationType | "select" | "calibrate" | null) => void;
  selectedColor: string;
  onColorChange: (color: string) => void;
  strokeWidth: number;
  onStrokeWidthChange: (width: number) => void;
  onClearAll: () => void;
  hasAnnotations: boolean;
  isDrawingMode: boolean;
  onToggleDrawingMode: () => void;
  scaleCalibration: ScaleCalibration | null;
  onClearCalibration?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  undoCount?: number;
  redoCount?: number;
  pastEntries?: HistoryEntry[];
  futureEntries?: HistoryEntry[];
  onUndo?: () => void;
  onRedo?: () => void;
  onUndoToIndex?: (index: number) => void;
  onRedoToIndex?: (index: number) => void;
  onClearHistory?: () => void;
  showMeasurementLegend?: boolean;
  onToggleMeasurementLegend?: () => void;
  hasMeasurements?: boolean;
}

const DRAWING_TOOLS: { type: AnnotationType | "select"; icon: React.ElementType; label: string }[] = [
  { type: "select", icon: MousePointer, label: "Select" },
  { type: "line", icon: Minus, label: "Line" },
  { type: "arrow", icon: ArrowRight, label: "Arrow" },
  { type: "rectangle", icon: Square, label: "Rectangle" },
  { type: "text", icon: Type, label: "Text" },
  { type: "freehand", icon: Pencil, label: "Freehand" },
];

const MEASUREMENT_TOOLS: { type: AnnotationType | "calibrate"; icon: React.ElementType; label: string; requiresCalibration?: boolean }[] = [
  { type: "calibrate", icon: Settings2, label: "Set Scale" },
  { type: "measure_distance", icon: Ruler, label: "Measure Distance", requiresCalibration: true },
  { type: "measure_area", icon: Move3D, label: "Measure Area", requiresCalibration: true },
];

export default function AnnotationToolbar({
  activeTool,
  onToolChange,
  selectedColor,
  onColorChange,
  strokeWidth,
  onStrokeWidthChange,
  onClearAll,
  hasAnnotations,
  isDrawingMode,
  onToggleDrawingMode,
  scaleCalibration,
  onClearCalibration,
  canUndo = false,
  canRedo = false,
  undoCount = 0,
  redoCount = 0,
  pastEntries = [],
  futureEntries = [],
  onUndo,
  onRedo,
  onUndoToIndex,
  onRedoToIndex,
  onClearHistory,
  showMeasurementLegend = false,
  onToggleMeasurementLegend,
  hasMeasurements = false,
}: AnnotationToolbarProps) {
  if (!isDrawingMode) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleDrawingMode}
              className="gap-2"
            >
              <Pencil className="h-4 w-4" />
              Markup
            </Button>
          </TooltipTrigger>
          <TooltipContent>Draw annotations and measure on the plan</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className="flex items-center gap-1 bg-background/95 backdrop-blur rounded-lg p-1 shadow-lg border">
      <TooltipProvider delayDuration={300}>
        {/* Close drawing mode */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onToggleDrawingMode}
            >
              <X className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Exit markup mode</TooltipContent>
        </Tooltip>

        <div className="w-px h-6 bg-border" />

        {/* Drawing tools */}
        {DRAWING_TOOLS.map(({ type, icon: Icon, label }) => (
          <Tooltip key={type}>
            <TooltipTrigger asChild>
              <Button
                variant={activeTool === type ? "secondary" : "ghost"}
                size="icon"
                className={cn("h-8 w-8", activeTool === type && "bg-accent")}
                onClick={() => onToolChange(type)}
              >
                <Icon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{label}</TooltipContent>
          </Tooltip>
        ))}

        <div className="w-px h-6 bg-border" />

        {/* Measurement tools */}
        {MEASUREMENT_TOOLS.map(({ type, icon: Icon, label, requiresCalibration }) => {
          const isDisabled = requiresCalibration && !scaleCalibration;
          const isCalibrated = type === "calibrate" && scaleCalibration;
          
          return (
            <Tooltip key={type}>
              <TooltipTrigger asChild>
                <Button
                  variant={activeTool === type ? "secondary" : "ghost"}
                  size="icon"
                  className={cn(
                    "h-8 w-8",
                    activeTool === type && "bg-accent",
                    isCalibrated && "text-primary"
                  )}
                  onClick={() => onToolChange(type)}
                  disabled={isDisabled}
                >
                  <Icon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isDisabled 
                  ? "Set scale first to use measurements" 
                  : isCalibrated 
                    ? `Scale set: 1 ${scaleCalibration.unit} = ${(scaleCalibration.pixelsPerUnit).toFixed(1)}px` 
                    : label
                }
              </TooltipContent>
            </Tooltip>
          );
        })}

        {/* Clear calibration button */}
        {scaleCalibration && onClearCalibration && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs px-2 text-muted-foreground"
                onClick={onClearCalibration}
              >
                {scaleCalibration.referenceLength} {scaleCalibration.unit}
                <X className="h-3 w-3 ml-1" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Clear scale calibration</TooltipContent>
          </Tooltip>
        )}

        {/* Measurement Legend Toggle */}
        {onToggleMeasurementLegend && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={showMeasurementLegend ? "secondary" : "ghost"}
                size="icon"
                className={cn("h-8 w-8", showMeasurementLegend && "bg-accent")}
                onClick={onToggleMeasurementLegend}
                disabled={!hasMeasurements && !showMeasurementLegend}
              >
                <LayoutList className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {hasMeasurements ? "Measurement Summary" : "No measurements yet"}
            </TooltipContent>
          </Tooltip>
        )}

        <div className="w-px h-6 bg-border" />

        {/* Color picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <div
                className="w-4 h-4 rounded-full border border-border"
                style={{ backgroundColor: selectedColor }}
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2" align="start">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium text-muted-foreground">Color</span>
              <div className="flex gap-1">
                {ANNOTATION_COLORS.map(({ value, label }) => (
                  <button
                    key={value}
                    className={cn(
                      "w-6 h-6 rounded-full border-2 transition-transform hover:scale-110",
                      selectedColor === value
                        ? "border-foreground scale-110"
                        : "border-transparent"
                    )}
                    style={{ backgroundColor: value }}
                    onClick={() => onColorChange(value)}
                    title={label}
                  />
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Stroke width */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Palette className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2" align="start">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium text-muted-foreground">Stroke Width</span>
              <div className="flex gap-1">
                {STROKE_WIDTHS.map(({ value, label }) => (
                  <button
                    key={value}
                    className={cn(
                      "w-8 h-8 rounded border flex items-center justify-center transition-colors",
                      strokeWidth === value
                        ? "border-primary bg-primary/10"
                        : "border-border hover:bg-accent"
                    )}
                    onClick={() => onStrokeWidthChange(value)}
                    title={label}
                  >
                    <div
                      className="rounded-full bg-foreground"
                      style={{ width: value * 2, height: value * 2 }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <div className="w-px h-6 bg-border" />

        {/* Undo */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 relative"
              onClick={onUndo}
              disabled={!canUndo}
            >
              <Undo2 className="h-4 w-4" />
              {undoCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 text-[10px] font-medium bg-muted text-muted-foreground rounded-full flex items-center justify-center">
                  {undoCount}
                </span>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Undo ({undoCount} steps) • Ctrl+Z</TooltipContent>
        </Tooltip>

        {/* Redo */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 relative"
              onClick={onRedo}
              disabled={!canRedo}
            >
              <Redo2 className="h-4 w-4" />
              {redoCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 text-[10px] font-medium bg-muted text-muted-foreground rounded-full flex items-center justify-center">
                  {redoCount}
                </span>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Redo ({redoCount} steps) • Ctrl+Shift+Z</TooltipContent>
        </Tooltip>

        {/* History Dropdown */}
        {onUndoToIndex && onRedoToIndex && onClearHistory && (
          <HistoryDropdown
            pastEntries={pastEntries}
            futureEntries={futureEntries}
            onUndoToIndex={onUndoToIndex}
            onRedoToIndex={onRedoToIndex}
            onClearHistory={onClearHistory}
          />
        )}

        <div className="w-px h-6 bg-border" />

        {/* Clear all */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={onClearAll}
              disabled={!hasAnnotations}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Clear all annotations</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
