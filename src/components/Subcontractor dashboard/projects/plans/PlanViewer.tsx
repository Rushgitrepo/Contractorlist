import { useState, useRef, useCallback, useEffect, forwardRef, useImperativeHandle, useMemo } from "react";
import { ConfirmDialog } from "@/components/Subcontractor dashboard/ConfirmDialog";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "@/components/Subcontractor dashboard/ui/button";
import { ZoomIn, ZoomOut, RotateCcw, Move, Loader2, ChevronLeft, ChevronRight, FileQuestion, Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import { PlanPin, PIN_TYPES } from "@/hooks/Subcontractor dashboard/usePlans";
import { useAnnotations, AnnotationType, PlanAnnotation } from "@/hooks/Subcontractor dashboard/useAnnotations";
import { useAnnotationHistory, HistoryAction } from "@/hooks/Subcontractor dashboard/useAnnotationHistory";
import { useScaleCalibration, ScaleCalibration, MeasurementUnit, calculatePixelDistance } from "@/hooks/Subcontractor dashboard/useScaleCalibration";
import { useAnnotationLayers } from "@/hooks/Subcontractor dashboard/useAnnotationLayers";
import { TemplateAnnotation } from "@/hooks/Subcontractor dashboard/useAnnotationTemplates";
import AnnotationToolbar from "./AnnotationToolbar";
import AnnotationCanvas from "./AnnotationCanvas";
import ScaleCalibrationDialog from "./ScaleCalibrationDialog";
import LayerPanel from "./LayerPanel";
import TemplatePanel from "./TemplatePanel";
import MeasurementLegend from "./MeasurementLegend";

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PlanViewerProps {
  imageUrl: string;
  planId: string;
  projectId: string;
  pins: PlanPin[];
  isAddingPin: boolean;
  onPinClick: (pin: PlanPin) => void;
  onAddPin: (x: number, y: number) => void;
  selectedPinId?: string;
  searchQuery?: string;
  isSelectMode?: boolean;
  selectedPinIds?: Set<string>;
  scaleCalibration?: ScaleCalibration | null;
}

export interface PlanViewerHandle {
  getExportableElement: () => HTMLDivElement | null;
  getAnnotations: () => PlanAnnotation[];
}

const PlanViewer = forwardRef<PlanViewerHandle, PlanViewerProps>(({
  imageUrl,
  planId,
  projectId,
  pins,
  isAddingPin,
  onPinClick,
  onAddPin,
  selectedPinId,
  searchQuery = "",
  isSelectMode = false,
  selectedPinIds = new Set(),
  scaleCalibration: initialScaleCalibration = null,
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [contentLoaded, setContentLoaded] = useState(false);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pdfError, setPdfError] = useState(false);

  // Annotation state
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [activeTool, setActiveTool] = useState<AnnotationType | "select" | "calibrate" | null>("select");
  const [selectedColor, setSelectedColor] = useState("#ef4444");
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [activeLayer, setActiveLayer] = useState("default");

  // Scale calibration state
  const [scaleCalibration, setScaleCalibration] = useState<ScaleCalibration | null>(initialScaleCalibration);
  const [calibrationDialogOpen, setCalibrationDialogOpen] = useState(false);
  const [pendingCalibration, setPendingCalibration] = useState<{ startX: number; startY: number; endX: number; endY: number } | null>(null);

  // Measurement legend state
  const [showMeasurementLegend, setShowMeasurementLegend] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);


  // Sync calibration when prop changes
  useEffect(() => {
    setScaleCalibration(initialScaleCalibration);
  }, [initialScaleCalibration]);

  const { annotations, createAnnotation, deleteAnnotation, clearAllAnnotations } = useAnnotations(planId);
  const { canUndo, canRedo, undoCount, redoCount, pastEntries, futureEntries, recordCreate, recordDelete, undo, redo, undoToIndex, redoToIndex, clearHistory } = useAnnotationHistory();
  const { saveCalibration, clearCalibration } = useScaleCalibration(planId);
  const { layers, visibleLayerNames, lockedLayerNames, ensureDefaultLayers } = useAnnotationLayers(planId, projectId);

  // Filter annotations by visible layers
  const visibleAnnotations = useMemo(() => {
    if (visibleLayerNames.length === 0) return annotations;
    return annotations.filter((a) => visibleLayerNames.includes(a.layer));
  }, [annotations, visibleLayerNames]);

  // Check if there are any measurements
  const hasMeasurements = useMemo(() => {
    return visibleAnnotations.some(
      (a) =>
        (a.annotation_type === "measure_distance" || a.annotation_type === "measure_area") &&
        a.measurement_value !== null
    );
  }, [visibleAnnotations]);

  // Check if current layer is locked
  const isCurrentLayerLocked = lockedLayerNames.includes(activeLayer);

  // Initialize default layers when drawing mode is enabled
  useEffect(() => {
    if (isDrawingMode && layers.length === 0) {
      ensureDefaultLayers.mutate();
    }
  }, [isDrawingMode, layers.length]);

  // Expose imperative handle for PDF export
  useImperativeHandle(ref, () => ({
    getExportableElement: () => contentRef.current,
    getAnnotations: () => visibleAnnotations,
  }), [visibleAnnotations]);

  // Detect if the file is a PDF
  const isPdf = imageUrl.toLowerCase().includes('.pdf') ||
    imageUrl.toLowerCase().includes('application/pdf');

  const handleZoomIn = useCallback(() => {
    setScale((prev) => Math.min(prev * 1.25, 5));
  }, []);

  const handleZoomOut = useCallback(() => {
    setScale((prev) => Math.max(prev / 1.25, 0.25));
  }, []);

  const handleReset = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale((prev) => Math.min(Math.max(prev * delta, 0.25), 5));
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isAddingPin) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  }, [isAddingPin, position]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleContentClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isAddingPin || isDragging) return;

    // Get the content container bounds
    const rect = contentRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    onAddPin(x, y);
  }, [isAddingPin, isDragging, onAddPin]);

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setCurrentPage(1);
    setContentLoaded(true);
    setPdfError(false);
  }, []);

  const onDocumentLoadError = useCallback(() => {
    setPdfError(true);
    setContentLoaded(false);
  }, []);

  const goToPreviousPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  }, []);

  const goToNextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(prev + 1, numPages || 1));
  }, [numPages]);

  // Basic keyboard shortcuts (zoom, navigation) - define first for immediate use
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Zoom and navigation shortcuts
      if (e.key === "+" || e.key === "=") handleZoomIn();
      if (e.key === "-") handleZoomOut();
      if (e.key === "0") handleReset();
      if (e.key === "ArrowLeft" && isPdf && numPages && numPages > 1) goToPreviousPage();
      if (e.key === "ArrowRight" && isPdf && numPages && numPages > 1) goToNextPage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleZoomIn, handleZoomOut, handleReset, isPdf, numPages, goToPreviousPage, goToNextPage]);

  const getPinColor = (pinType: string | null) => {
    const type = PIN_TYPES.find((t) => t.value === pinType);
    return type?.color || "#6b7280";
  };

  const handleCreateAnnotation = useCallback(
    (input: Omit<Parameters<typeof createAnnotation.mutate>[0], "plan_id" | "project_id">) => {
      if (!planId || !projectId) return;

      // Check if current layer is locked
      if (isCurrentLayerLocked) {
        return;
      }

      let measurementValue: number | undefined;
      let measurementUnit: string | undefined;

      // Calculate measurements if calibration exists
      if (scaleCalibration && contentRef.current) {
        const rect = contentRef.current.getBoundingClientRect();

        if (input.annotation_type === "measure_distance" && input.start_x !== undefined && input.end_x !== undefined) {
          const pixelDistance = calculatePixelDistance(
            input.start_x,
            input.start_y,
            input.end_x,
            input.end_y || input.start_y,
            rect.width,
            rect.height
          );
          measurementValue = pixelDistance / scaleCalibration.pixelsPerUnit;
          measurementUnit = scaleCalibration.unit;
        }

        if (input.annotation_type === "measure_area" && input.path_points && input.path_points.length >= 3) {
          // Calculate area using Shoelace formula
          const pixelPoints = input.path_points.map((p) => ({
            x: (p.x / 100) * rect.width,
            y: (p.y / 100) * rect.height,
          }));

          let area = 0;
          for (let i = 0; i < pixelPoints.length; i++) {
            const j = (i + 1) % pixelPoints.length;
            area += pixelPoints[i].x * pixelPoints[j].y;
            area -= pixelPoints[j].x * pixelPoints[i].y;
          }
          area = Math.abs(area) / 2;

          const pixelsPerUnitSquared = scaleCalibration.pixelsPerUnit * scaleCalibration.pixelsPerUnit;
          measurementValue = area / pixelsPerUnitSquared;
          measurementUnit = `${scaleCalibration.unit}²`;
        }
      }

      createAnnotation.mutate({
        ...input,
        plan_id: planId,
        project_id: projectId,
        measurement_value: measurementValue,
        measurement_unit: measurementUnit,
        layer: activeLayer,
      }, {
        onSuccess: (newAnnotation) => {
          // Record for undo - cast the return type to match PlanAnnotation
          recordCreate(newAnnotation as unknown as PlanAnnotation);
        },
      });
    },
    [planId, projectId, createAnnotation, scaleCalibration, recordCreate, activeLayer, isCurrentLayerLocked]
  );

  const handleDeleteAnnotation = useCallback(
    (id: string) => {
      const annotation = annotations.find((a) => a.id === id);
      if (!annotation) return;

      deleteAnnotation.mutate(id, {
        onSuccess: () => {
          recordDelete(annotation);
        },
      });
    },
    [annotations, deleteAnnotation, recordDelete]
  );

  const handleUndo = useCallback(() => {
    const action = undo();
    if (!action) return;

    switch (action.type) {
      case "create":
        // Undo create = delete the annotation
        deleteAnnotation.mutate(action.annotation.id);
        break;
      case "delete":
        // Undo delete = recreate the annotation
        createAnnotation.mutate({
          plan_id: action.annotation.plan_id,
          project_id: action.annotation.project_id,
          annotation_type: action.annotation.annotation_type,
          start_x: action.annotation.start_x,
          start_y: action.annotation.start_y,
          end_x: action.annotation.end_x ?? undefined,
          end_y: action.annotation.end_y ?? undefined,
          path_points: action.annotation.path_points ?? undefined,
          text_content: action.annotation.text_content ?? undefined,
          color: action.annotation.color,
          stroke_width: action.annotation.stroke_width,
          measurement_value: action.annotation.measurement_value ?? undefined,
          measurement_unit: action.annotation.measurement_unit ?? undefined,
        });
        break;
    }
  }, [undo, deleteAnnotation, createAnnotation]);

  const handleRedo = useCallback(() => {
    const action = redo();
    if (!action) return;

    switch (action.type) {
      case "create":
        // Redo create = recreate the annotation
        createAnnotation.mutate({
          plan_id: action.annotation.plan_id,
          project_id: action.annotation.project_id,
          annotation_type: action.annotation.annotation_type,
          start_x: action.annotation.start_x,
          start_y: action.annotation.start_y,
          end_x: action.annotation.end_x ?? undefined,
          end_y: action.annotation.end_y ?? undefined,
          path_points: action.annotation.path_points ?? undefined,
          text_content: action.annotation.text_content ?? undefined,
          color: action.annotation.color,
          stroke_width: action.annotation.stroke_width,
          measurement_value: action.annotation.measurement_value ?? undefined,
          measurement_unit: action.annotation.measurement_unit ?? undefined,
        });
        break;
      case "delete":
        // Redo delete = delete the annotation
        deleteAnnotation.mutate(action.annotation.id);
        break;
    }
  }, [redo, deleteAnnotation, createAnnotation]);

  const executeAction = useCallback((action: HistoryAction, isUndo: boolean) => {
    if (isUndo) {
      // Reverse the action
      switch (action.type) {
        case "create":
          deleteAnnotation.mutate(action.annotation.id);
          break;
        case "delete":
          createAnnotation.mutate({
            plan_id: action.annotation.plan_id,
            project_id: action.annotation.project_id,
            annotation_type: action.annotation.annotation_type,
            start_x: action.annotation.start_x,
            start_y: action.annotation.start_y,
            end_x: action.annotation.end_x ?? undefined,
            end_y: action.annotation.end_y ?? undefined,
            path_points: action.annotation.path_points ?? undefined,
            text_content: action.annotation.text_content ?? undefined,
            color: action.annotation.color,
            stroke_width: action.annotation.stroke_width,
            measurement_value: action.annotation.measurement_value ?? undefined,
            measurement_unit: action.annotation.measurement_unit ?? undefined,
          });
          break;
      }
    } else {
      // Execute the action
      switch (action.type) {
        case "create":
          createAnnotation.mutate({
            plan_id: action.annotation.plan_id,
            project_id: action.annotation.project_id,
            annotation_type: action.annotation.annotation_type,
            start_x: action.annotation.start_x,
            start_y: action.annotation.start_y,
            end_x: action.annotation.end_x ?? undefined,
            end_y: action.annotation.end_y ?? undefined,
            path_points: action.annotation.path_points ?? undefined,
            text_content: action.annotation.text_content ?? undefined,
            color: action.annotation.color,
            stroke_width: action.annotation.stroke_width,
            measurement_value: action.annotation.measurement_value ?? undefined,
            measurement_unit: action.annotation.measurement_unit ?? undefined,
          });
          break;
        case "delete":
          deleteAnnotation.mutate(action.annotation.id);
          break;
      }
    }
  }, [deleteAnnotation, createAnnotation]);

  const handleUndoToIndex = useCallback((index: number) => {
    const actions = undoToIndex(index);
    actions.forEach((action) => executeAction(action, true));
  }, [undoToIndex, executeAction]);

  const handleRedoToIndex = useCallback((index: number) => {
    const actions = redoToIndex(index);
    actions.forEach((action) => executeAction(action, false));
  }, [redoToIndex, executeAction]);

  const handleClearAllAnnotations = useCallback(() => {
    setShowClearConfirm(true);
  }, []);

  const executeClearAll = useCallback(() => {
    clearAllAnnotations.mutate();
    clearHistory();
    setShowClearConfirm(false);
  }, [clearAllAnnotations, clearHistory]);

  // Apply template annotations to current plan
  const handleApplyTemplate = useCallback(
    (templateAnnotations: TemplateAnnotation[]) => {
      if (!planId || !projectId) return;

      templateAnnotations.forEach((ta) => {
        createAnnotation.mutate({
          plan_id: planId,
          project_id: projectId,
          annotation_type: ta.annotation_type as AnnotationType,
          start_x: ta.start_x,
          start_y: ta.start_y,
          end_x: ta.end_x ?? undefined,
          end_y: ta.end_y ?? undefined,
          path_points: ta.path_points ?? undefined,
          text_content: ta.text_content ?? undefined,
          color: ta.color,
          stroke_width: ta.stroke_width,
          layer: ta.layer,
        });
      });
    },
    [planId, projectId, createAnnotation]
  );

  // Undo/redo keyboard shortcuts - must be after handler definitions
  useEffect(() => {
    const handleUndoRedoKeyDown = (e: KeyboardEvent) => {
      if (isDrawingMode && (e.metaKey || e.ctrlKey)) {
        if (e.key === "z" && !e.shiftKey) {
          e.preventDefault();
          handleUndo();
        } else if ((e.key === "z" && e.shiftKey) || e.key === "y") {
          e.preventDefault();
          handleRedo();
        }
      }
    };
    window.addEventListener("keydown", handleUndoRedoKeyDown);
    return () => window.removeEventListener("keydown", handleUndoRedoKeyDown);
  }, [isDrawingMode, handleUndo, handleRedo]);

  const handleCalibrationComplete = useCallback(
    (startX: number, startY: number, endX: number, endY: number) => {
      // Calculate pixel distance - we need the container size
      const contentEl = contentRef.current;
      if (!contentEl) return;

      const rect = contentEl.getBoundingClientRect();
      const pixelDistance = calculatePixelDistance(startX, startY, endX, endY, rect.width, rect.height);

      setPendingCalibration({ startX, startY, endX, endY });
      setCalibrationDialogOpen(true);
    },
    []
  );

  const handleCalibrationConfirm = useCallback(
    (referenceLength: number, unit: MeasurementUnit) => {
      if (!pendingCalibration) return;

      const contentEl = contentRef.current;
      if (!contentEl) return;

      const rect = contentEl.getBoundingClientRect();
      const pixelDistance = calculatePixelDistance(
        pendingCalibration.startX,
        pendingCalibration.startY,
        pendingCalibration.endX,
        pendingCalibration.endY,
        rect.width,
        rect.height
      );

      const calibration: ScaleCalibration = {
        pixelsPerUnit: pixelDistance / referenceLength,
        unit,
        referenceLength,
        startX: pendingCalibration.startX,
        startY: pendingCalibration.startY,
        endX: pendingCalibration.endX,
        endY: pendingCalibration.endY,
      };

      setScaleCalibration(calibration);
      saveCalibration.mutate(calibration);
      setPendingCalibration(null);
      setActiveTool("select");
    },
    [pendingCalibration, saveCalibration]
  );

  return (
    <div className="relative h-full flex flex-col bg-muted/30">
      {/* Zoom Toolbar */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-background/95 backdrop-blur rounded-lg p-1 shadow-lg border">
        <Button variant="ghost" size="icon" onClick={handleZoomOut} className="h-8 w-8">
          <ZoomOut className="h-4 w-4" />
        </Button>
        <span className="text-xs font-medium px-2 min-w-[50px] text-center">
          {Math.round(scale * 100)}%
        </span>
        <Button variant="ghost" size="icon" onClick={handleZoomIn} className="h-8 w-8">
          <ZoomIn className="h-4 w-4" />
        </Button>
        <div className="w-px h-4 bg-border" />
        <Button variant="ghost" size="icon" onClick={handleReset} className="h-8 w-8">
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* Annotation Toolbar */}
      <div className="absolute top-4 right-4 z-20">
        <AnnotationToolbar
          activeTool={activeTool}
          onToolChange={setActiveTool}
          selectedColor={selectedColor}
          onColorChange={setSelectedColor}
          strokeWidth={strokeWidth}
          onStrokeWidthChange={setStrokeWidth}
          onClearAll={handleClearAllAnnotations}
          hasAnnotations={annotations.length > 0}
          isDrawingMode={isDrawingMode}
          onToggleDrawingMode={() => {
            setIsDrawingMode(!isDrawingMode);
            if (!isDrawingMode) setActiveTool("select");
          }}
          scaleCalibration={scaleCalibration}
          onClearCalibration={() => {
            clearCalibration.mutate();
            setScaleCalibration(null);
          }}
          canUndo={canUndo}
          canRedo={canRedo}
          undoCount={undoCount}
          redoCount={redoCount}
          pastEntries={pastEntries}
          futureEntries={futureEntries}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onUndoToIndex={handleUndoToIndex}
          onRedoToIndex={handleRedoToIndex}
          onClearHistory={clearHistory}
          showMeasurementLegend={showMeasurementLegend}
          onToggleMeasurementLegend={() => setShowMeasurementLegend(!showMeasurementLegend)}
          hasMeasurements={hasMeasurements}
        />
      </div>

      {/* Measurement Legend Panel */}
      {showMeasurementLegend && (
        <MeasurementLegend
          annotations={visibleAnnotations}
          onClose={() => setShowMeasurementLegend(false)}
        />
      )}

      {/* Layer and Template Panels */}
      {isDrawingMode && (
        <div className="absolute top-16 right-4 z-20 flex gap-2">
          <TemplatePanel
            planId={planId}
            projectId={projectId}
            annotations={annotations}
            onApplyTemplate={handleApplyTemplate}
            isDrawingMode={isDrawingMode}
          />
          <LayerPanel
            planId={planId}
            projectId={projectId}
            activeLayer={activeLayer}
            onLayerChange={setActiveLayer}
            isDrawingMode={isDrawingMode}
          />
        </div>
      )}

      {/* Add pin mode indicator */}
      {isAddingPin && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium shadow-lg">
          Click on the plan to drop a pin
        </div>
      )}

      {/* Layer locked indicator */}
      {isDrawingMode && isCurrentLayerLocked && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-destructive text-destructive-foreground px-4 py-2 rounded-full text-sm font-medium shadow-lg">
          Layer "{activeLayer}" is locked
        </div>
      )}

      {/* Plan viewer */}
      <div
        ref={containerRef}
        className={cn(
          "flex-1 overflow-hidden relative",
          isAddingPin ? "cursor-crosshair" : isDragging ? "cursor-grabbing" : "cursor-grab"
        )}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <div
          className="absolute origin-center transition-transform duration-75"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          }}
        >
          <div
            ref={contentRef}
            className="relative inline-block"
            onClick={handleContentClick}
          >
            {isPdf ? (
              <Document
                file={imageUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                loading={
                  <div className="flex items-center justify-center p-8">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                  </div>
                }
                error={
                  <div className="flex flex-col items-center justify-center p-8 text-destructive">
                    <p>Failed to load PDF</p>
                    <p className="text-sm text-muted-foreground mt-1">Try uploading an image instead</p>
                  </div>
                }
              >
                <Page
                  pageNumber={currentPage}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  className="select-none"
                />
              </Document>
            ) : (
              <img
                src={imageUrl}
                alt="Plan"
                className="max-w-none select-none"
                onLoad={() => setContentLoaded(true)}
                draggable={false}
              />
            )}

            {/* Pins overlay */}
            {contentLoaded && pins.map((pin) => {
              const hasRfi = pin.has_rfi || !!pin.rfi_id;
              const photoCount = pin.photo_count || 0;
              const hasBadges = hasRfi || photoCount > 0;
              const isSelected = selectedPinIds.has(pin.id);

              // Check if pin matches search query
              const isSearchMatch = searchQuery && (
                pin.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                pin.description?.toLowerCase().includes(searchQuery.toLowerCase())
              );

              return (
                <button
                  key={pin.id}
                  className={cn(
                    "absolute -translate-x-1/2 -translate-y-full transition-transform hover:scale-125 group",
                    selectedPinId === pin.id && "scale-125 z-10",
                    isSelectMode && "cursor-pointer"
                  )}
                  style={{
                    left: `${pin.x_position}%`,
                    top: `${pin.y_position}%`,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onPinClick(pin);
                  }}
                >
                  {/* Selection indicator */}
                  {isSelectMode && (
                    <div
                      className={cn(
                        "absolute -top-1 -left-3 w-4 h-4 rounded border-2 transition-colors",
                        isSelected
                          ? "bg-primary border-primary"
                          : "bg-background border-muted-foreground/50"
                      )}
                    >
                      {isSelected && (
                        <svg viewBox="0 0 24 24" className="w-full h-full text-primary-foreground">
                          <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                        </svg>
                      )}
                    </div>
                  )}

                  {/* Search match highlight ring */}
                  {isSearchMatch && (
                    <span className="absolute inset-0 -m-2 rounded-full border-2 border-primary animate-pulse" />
                  )}

                  {/* Pin marker */}
                  <svg
                    viewBox="0 0 24 24"
                    fill={getPinColor(pin.pin_type)}
                    className="w-6 h-6 drop-shadow-md"
                  >
                    <path d="M12 0C7.58 0 4 3.58 4 8c0 5.25 8 13 8 13s8-7.75 8-13c0-4.42-3.58-8-8-8zm0 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" />
                  </svg>

                  {/* Badge indicators */}
                  {hasBadges && (
                    <div className="absolute -top-1 -right-3 flex gap-0.5">
                      {hasRfi && (
                        <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center shadow-sm border border-background">
                          <FileQuestion className="w-2.5 h-2.5 text-primary-foreground" />
                        </div>
                      )}
                      {photoCount > 0 && (
                        <div className="w-4 h-4 rounded-full bg-accent flex items-center justify-center shadow-sm border border-background">
                          <Camera className="w-2.5 h-2.5 text-accent-foreground" />
                        </div>
                      )}
                    </div>
                  )}
                </button>
              );
            })}

            {/* Annotation canvas overlay */}
            {contentLoaded && (
              <AnnotationCanvas
                annotations={visibleAnnotations}
                activeTool={activeTool}
                selectedColor={selectedColor}
                strokeWidth={strokeWidth}
                isDrawingMode={isDrawingMode}
                onCreateAnnotation={handleCreateAnnotation}
                onDeleteAnnotation={handleDeleteAnnotation}
                planId={planId}
                projectId={projectId}
                onCalibrationComplete={handleCalibrationComplete}
                scaleCalibration={scaleCalibration}
              />
            )}
          </div>
        </div>
      </div>

      {/* Pan hint */}
      {!isAddingPin && (
        <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 text-xs text-muted-foreground bg-background/80 backdrop-blur rounded px-2 py-1">
          <Move className="h-3 w-3" />
          Drag to pan • Scroll to zoom
          {isPdf && numPages && numPages > 1 && " • ←/→ to navigate pages"}
        </div>
      )}

      {/* Calibration mode indicator */}
      {isDrawingMode && activeTool === "calibrate" && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium shadow-lg">
          Draw a line of known length to set the scale
        </div>
      )}

      {/* PDF Page Navigation */}
      {isPdf && numPages && numPages > 1 && (
        <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1 bg-background/95 backdrop-blur rounded-lg p-1 shadow-lg border">
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPreviousPage}
            disabled={currentPage <= 1}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-xs font-medium px-2 min-w-[60px] text-center">
            {currentPage} / {numPages}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToNextPage}
            disabled={currentPage >= numPages}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      <ConfirmDialog
        open={showClearConfirm}
        onOpenChange={setShowClearConfirm}
        title="Clear All Annotations"
        description="Are you sure you want to clear all annotations from this plan? This action cannot be undone."
        onConfirm={executeClearAll}
        confirmText="Clear All"
        variant="destructive"
      />

      {/* Scale Calibration Dialog */}

      <ScaleCalibrationDialog
        open={calibrationDialogOpen}
        onOpenChange={setCalibrationDialogOpen}
        onConfirm={handleCalibrationConfirm}
        pixelLength={pendingCalibration ? calculatePixelDistance(
          pendingCalibration.startX,
          pendingCalibration.startY,
          pendingCalibration.endX,
          pendingCalibration.endY,
          contentRef.current?.getBoundingClientRect().width || 1000,
          contentRef.current?.getBoundingClientRect().height || 800
        ) : 0}
      />
    </div>
  );
});

PlanViewer.displayName = "PlanViewer";

export default PlanViewer;
