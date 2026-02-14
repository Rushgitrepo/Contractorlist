import { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  AnnotationType,
  PlanAnnotation,
  PathPoint,
  CreateAnnotationInput,
} from "@/hooks/Subcontractor dashboard/useAnnotations";
import { Input } from "@/components/Subcontractor dashboard/ui/input";
import { Button } from "@/components/Subcontractor dashboard/ui/button";

interface AnnotationCanvasProps {
  annotations: PlanAnnotation[];
  activeTool: AnnotationType | "select" | "calibrate" | null;
  selectedColor: string;
  strokeWidth: number;
  isDrawingMode: boolean;
  onCreateAnnotation: (input: Omit<CreateAnnotationInput, "plan_id" | "project_id">) => void;
  onDeleteAnnotation: (id: string) => void;
  planId: string;
  projectId: string;
  onCalibrationComplete?: (startX: number, startY: number, endX: number, endY: number) => void;
  scaleCalibration?: { pixelsPerUnit: number; unit: string } | null;
}

interface DrawingState {
  isDrawing: boolean;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  pathPoints: PathPoint[];
}

export default function AnnotationCanvas({
  annotations,
  activeTool,
  selectedColor,
  strokeWidth,
  isDrawingMode,
  onCreateAnnotation,
  onDeleteAnnotation,
  onCalibrationComplete,
  scaleCalibration,
}: AnnotationCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [drawing, setDrawing] = useState<DrawingState>({
    isDrawing: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    pathPoints: [],
  });
  const [selectedAnnotation, setSelectedAnnotation] = useState<string | null>(null);
  const [textInput, setTextInput] = useState({ show: false, x: 0, y: 0, value: "" });

  const getCoordinates = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };

    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) };
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!isDrawingMode || !activeTool || activeTool === "select") return;
      e.preventDefault();
      e.stopPropagation();

      const { x, y } = getCoordinates(e);

      if (activeTool === "text") {
        setTextInput({ show: true, x, y, value: "" });
        return;
      }

      setDrawing({
        isDrawing: true,
        startX: x,
        startY: y,
        currentX: x,
        currentY: y,
        pathPoints: [{ x, y }],
      });
    },
    [isDrawingMode, activeTool, getCoordinates]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!drawing.isDrawing) return;
      e.preventDefault();

      const { x, y } = getCoordinates(e);

      setDrawing((prev) => ({
        ...prev,
        currentX: x,
        currentY: y,
        pathPoints:
          activeTool === "freehand" ? [...prev.pathPoints, { x, y }] : prev.pathPoints,
      }));
    },
    [drawing.isDrawing, activeTool, getCoordinates]
  );

  const handleMouseUp = useCallback(() => {
    if (!drawing.isDrawing || !activeTool || activeTool === "select" || activeTool === "text") return;

    const { startX, startY, currentX, currentY, pathPoints } = drawing;

    // Minimum size check
    const dx = Math.abs(currentX - startX);
    const dy = Math.abs(currentY - startY);
    if (activeTool !== "freehand" && activeTool !== "measure_area" && dx < 1 && dy < 1) {
      setDrawing((prev) => ({ ...prev, isDrawing: false, pathPoints: [] }));
      return;
    }

    if ((activeTool === "freehand" || activeTool === "measure_area") && pathPoints.length < 3) {
      setDrawing((prev) => ({ ...prev, isDrawing: false, pathPoints: [] }));
      return;
    }

    // Handle calibration separately
    if (activeTool === "calibrate") {
      onCalibrationComplete?.(startX, startY, currentX, currentY);
      setDrawing({
        isDrawing: false,
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
        pathPoints: [],
      });
      return;
    }

    onCreateAnnotation({
      annotation_type: activeTool,
      start_x: startX,
      start_y: startY,
      end_x: currentX,
      end_y: currentY,
      path_points: activeTool === "freehand" || activeTool === "measure_area" ? pathPoints : undefined,
      color: selectedColor,
      stroke_width: strokeWidth,
    });

    setDrawing({
      isDrawing: false,
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0,
      pathPoints: [],
    });
  }, [drawing, activeTool, selectedColor, strokeWidth, onCreateAnnotation, onCalibrationComplete]);

  const handleTextSubmit = useCallback(() => {
    if (!textInput.value.trim()) {
      setTextInput({ show: false, x: 0, y: 0, value: "" });
      return;
    }

    onCreateAnnotation({
      annotation_type: "text",
      start_x: textInput.x,
      start_y: textInput.y,
      text_content: textInput.value,
      color: selectedColor,
      stroke_width: strokeWidth,
    });

    setTextInput({ show: false, x: 0, y: 0, value: "" });
  }, [textInput, selectedColor, strokeWidth, onCreateAnnotation]);

  const handleAnnotationClick = useCallback(
    (e: React.MouseEvent, id: string) => {
      if (!isDrawingMode || activeTool !== "select") return;
      e.stopPropagation();
      setSelectedAnnotation((prev) => (prev === id ? null : id));
    },
    [isDrawingMode, activeTool]
  );

  // Handle delete key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "Delete" || e.key === "Backspace") && selectedAnnotation && !textInput.show) {
        onDeleteAnnotation(selectedAnnotation);
        setSelectedAnnotation(null);
      }
      if (e.key === "Escape") {
        setSelectedAnnotation(null);
        setTextInput({ show: false, x: 0, y: 0, value: "" });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedAnnotation, onDeleteAnnotation, textInput.show]);

  const renderAnnotation = (annotation: PlanAnnotation, isPreview = false) => {
    const { annotation_type, start_x, start_y, end_x, end_y, color, stroke_width, path_points: rawPathPoints, text_content, id, measurement_value, measurement_unit } = annotation;
    // Ensure path_points is always an array (handle JSON string from database)
    const path_points: PathPoint[] = Array.isArray(rawPathPoints) 
      ? rawPathPoints 
      : (typeof rawPathPoints === 'string' ? JSON.parse(rawPathPoints) : []);
    const isSelected = selectedAnnotation === id;
    const strokeColor = isPreview ? color : color;
    const opacity = isPreview ? 0.7 : 1;

    const commonProps = {
      stroke: strokeColor,
      strokeWidth: stroke_width,
      fill: "none",
      opacity,
      className: cn(
        "transition-opacity",
        isDrawingMode && activeTool === "select" && !isPreview && "cursor-pointer hover:opacity-80"
      ),
      onClick: isPreview ? undefined : (e: React.MouseEvent) => handleAnnotationClick(e, id),
    };

    switch (annotation_type) {
      case "line":
        return (
          <g key={id}>
            <line
              x1={`${start_x}%`}
              y1={`${start_y}%`}
              x2={`${end_x}%`}
              y2={`${end_y}%`}
              {...commonProps}
            />
            {isSelected && (
              <>
                <circle cx={`${start_x}%`} cy={`${start_y}%`} r="4" fill="white" stroke={color} strokeWidth="2" />
                <circle cx={`${end_x}%`} cy={`${end_y}%`} r="4" fill="white" stroke={color} strokeWidth="2" />
              </>
            )}
          </g>
        );

      case "arrow":
        const angle = Math.atan2((end_y ?? 0) - start_y, (end_x ?? 0) - start_x);
        const arrowLength = 12;
        const arrowAngle = Math.PI / 6;
        const endX = end_x ?? start_x;
        const endY = end_y ?? start_y;

        return (
          <g key={id}>
            <line
              x1={`${start_x}%`}
              y1={`${start_y}%`}
              x2={`${endX}%`}
              y2={`${endY}%`}
              {...commonProps}
            />
            {/* Arrow head */}
            <line
              x1={`${endX}%`}
              y1={`${endY}%`}
              x2={`calc(${endX}% - ${arrowLength * Math.cos(angle - arrowAngle)}px)`}
              y2={`calc(${endY}% - ${arrowLength * Math.sin(angle - arrowAngle)}px)`}
              {...commonProps}
            />
            <line
              x1={`${endX}%`}
              y1={`${endY}%`}
              x2={`calc(${endX}% - ${arrowLength * Math.cos(angle + arrowAngle)}px)`}
              y2={`calc(${endY}% - ${arrowLength * Math.sin(angle + arrowAngle)}px)`}
              {...commonProps}
            />
            {isSelected && (
              <>
                <circle cx={`${start_x}%`} cy={`${start_y}%`} r="4" fill="white" stroke={color} strokeWidth="2" />
                <circle cx={`${endX}%`} cy={`${endY}%`} r="4" fill="white" stroke={color} strokeWidth="2" />
              </>
            )}
          </g>
        );

      case "rectangle":
        const rx = Math.min(start_x, end_x ?? start_x);
        const ry = Math.min(start_y, end_y ?? start_y);
        const rw = Math.abs((end_x ?? start_x) - start_x);
        const rh = Math.abs((end_y ?? start_y) - start_y);
        return (
          <g key={id}>
            <rect
              x={`${rx}%`}
              y={`${ry}%`}
              width={`${rw}%`}
              height={`${rh}%`}
              {...commonProps}
            />
            {isSelected && (
              <>
                <circle cx={`${rx}%`} cy={`${ry}%`} r="4" fill="white" stroke={color} strokeWidth="2" />
                <circle cx={`${rx + rw}%`} cy={`${ry}%`} r="4" fill="white" stroke={color} strokeWidth="2" />
                <circle cx={`${rx}%`} cy={`${ry + rh}%`} r="4" fill="white" stroke={color} strokeWidth="2" />
                <circle cx={`${rx + rw}%`} cy={`${ry + rh}%`} r="4" fill="white" stroke={color} strokeWidth="2" />
              </>
            )}
          </g>
        );

      case "freehand":
        if (!path_points || path_points.length < 2) return null;
        const pathD = path_points
          .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x}% ${p.y}%`)
          .join(" ");
        return (
          <g key={id}>
            <path d={pathD} {...commonProps} strokeLinecap="round" strokeLinejoin="round" />
            {isSelected && (
              <>
                <circle cx={`${path_points[0].x}%`} cy={`${path_points[0].y}%`} r="4" fill="white" stroke={color} strokeWidth="2" />
                <circle cx={`${path_points[path_points.length - 1].x}%`} cy={`${path_points[path_points.length - 1].y}%`} r="4" fill="white" stroke={color} strokeWidth="2" />
              </>
            )}
          </g>
        );

      case "text":
        return (
          <g key={id} onClick={isPreview ? undefined : (e) => handleAnnotationClick(e, id)}>
            <text
              x={`${start_x}%`}
              y={`${start_y}%`}
              fill={color}
              fontSize="14"
              fontWeight="500"
              className={cn(
                "select-none",
                isDrawingMode && activeTool === "select" && !isPreview && "cursor-pointer"
              )}
              style={{ opacity }}
            >
              {text_content}
            </text>
            {isSelected && (
              <rect
                x={`calc(${start_x}% - 4px)`}
                y={`calc(${start_y}% - 16px)`}
                width="auto"
                height="20"
                fill="none"
                stroke={color}
                strokeWidth="1"
                strokeDasharray="4"
              />
            )}
          </g>
        );

      case "measure_distance":
        const measureEndX = end_x ?? start_x;
        const measureEndY = end_y ?? start_y;
        const midX = (start_x + measureEndX) / 2;
        const midY = (start_y + measureEndY) / 2;
        const measurementText = measurement_value !== null 
          ? `${measurement_value.toFixed(2)} ${measurement_unit || 'ft'}`
          : '';
        
        return (
          <g key={id} onClick={isPreview ? undefined : (e) => handleAnnotationClick(e, id)}>
            {/* Main line */}
            <line
              x1={`${start_x}%`}
              y1={`${start_y}%`}
              x2={`${measureEndX}%`}
              y2={`${measureEndY}%`}
              {...commonProps}
              strokeDasharray="6,3"
            />
            {/* End caps */}
            <circle cx={`${start_x}%`} cy={`${start_y}%`} r="4" fill={color} opacity={opacity} />
            <circle cx={`${measureEndX}%`} cy={`${measureEndY}%`} r="4" fill={color} opacity={opacity} />
            {/* Label background */}
            {measurementText && (
              <>
                <rect
                  x={`calc(${midX}% - 30px)`}
                  y={`calc(${midY}% - 10px)`}
                  width="60"
                  height="20"
                  fill="white"
                  stroke={color}
                  strokeWidth="1"
                  rx="4"
                  opacity={0.95}
                />
                <text
                  x={`${midX}%`}
                  y={`${midY}%`}
                  fill={color}
                  fontSize="11"
                  fontWeight="600"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="select-none"
                >
                  {measurementText}
                </text>
              </>
            )}
            {isSelected && (
              <>
                <circle cx={`${start_x}%`} cy={`${start_y}%`} r="6" fill="none" stroke={color} strokeWidth="2" />
                <circle cx={`${measureEndX}%`} cy={`${measureEndY}%`} r="6" fill="none" stroke={color} strokeWidth="2" />
              </>
            )}
          </g>
        );

      case "measure_area":
        if (!path_points || path_points.length < 3) return null;
        const areaPathD = path_points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x}% ${p.y}%`).join(" ") + " Z";
        
        // Calculate centroid for label placement
        const centroidX = path_points.reduce((sum, p) => sum + p.x, 0) / path_points.length;
        const centroidY = path_points.reduce((sum, p) => sum + p.y, 0) / path_points.length;
        
        const areaText = measurement_value !== null 
          ? `${measurement_value.toFixed(2)} ${measurement_unit || 'ft²'}`
          : '';
        
        return (
          <g key={id} onClick={isPreview ? undefined : (e) => handleAnnotationClick(e, id)}>
            {/* Filled polygon */}
            <path 
              d={areaPathD} 
              fill={color}
              fillOpacity={0.15}
              stroke={color}
              strokeWidth={stroke_width}
              strokeDasharray="6,3"
              opacity={opacity}
              className={cn(
                isDrawingMode && activeTool === "select" && !isPreview && "cursor-pointer hover:fill-opacity-25"
              )}
            />
            {/* Vertices */}
            {path_points.map((p, i) => (
              <circle key={i} cx={`${p.x}%`} cy={`${p.y}%`} r="3" fill={color} opacity={opacity} />
            ))}
            {/* Area label */}
            {areaText && (
              <>
                <rect
                  x={`calc(${centroidX}% - 35px)`}
                  y={`calc(${centroidY}% - 10px)`}
                  width="70"
                  height="20"
                  fill="white"
                  stroke={color}
                  strokeWidth="1"
                  rx="4"
                  opacity={0.95}
                />
                <text
                  x={`${centroidX}%`}
                  y={`${centroidY}%`}
                  fill={color}
                  fontSize="11"
                  fontWeight="600"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="select-none"
                >
                  {areaText}
                </text>
              </>
            )}
            {isSelected && path_points.map((p, i) => (
              <circle key={`sel-${i}`} cx={`${p.x}%`} cy={`${p.y}%`} r="5" fill="none" stroke={color} strokeWidth="2" />
            ))}
          </g>
        );

      default:
        return null;
    }
  };

  const renderCurrentDrawing = () => {
    if (!drawing.isDrawing || !activeTool || activeTool === "select" || activeTool === "text") return null;

    // Handle calibration preview as a dashed line
    if (activeTool === "calibrate") {
      return (
        <g key="calibration-preview">
          <line
            x1={`${drawing.startX}%`}
            y1={`${drawing.startY}%`}
            x2={`${drawing.currentX}%`}
            y2={`${drawing.currentY}%`}
            stroke="#3b82f6"
            strokeWidth={2}
            strokeDasharray="6,4"
            opacity={0.8}
          />
          <circle cx={`${drawing.startX}%`} cy={`${drawing.startY}%`} r="4" fill="#3b82f6" />
          <circle cx={`${drawing.currentX}%`} cy={`${drawing.currentY}%`} r="4" fill="#3b82f6" />
        </g>
      );
    }

    const previewAnnotation: PlanAnnotation = {
      id: "preview",
      plan_id: "",
      project_id: "",
      created_by: "",
      annotation_type: activeTool,
      start_x: drawing.startX,
      start_y: drawing.startY,
      end_x: drawing.currentX,
      end_y: drawing.currentY,
      path_points: activeTool === "freehand" || activeTool === "measure_area" ? drawing.pathPoints : null,
      text_content: null,
      color: selectedColor,
      stroke_width: strokeWidth,
      measurement_value: null,
      measurement_unit: null,
      layer: "default",
      created_at: "",
      updated_at: "",
    };

    return renderAnnotation(previewAnnotation, true);
  };

  if (!isDrawingMode && annotations.length === 0) return null;

  return (
    <>
      <svg
        ref={svgRef}
        className={cn(
          "absolute inset-0 w-full h-full pointer-events-none",
          isDrawingMode && activeTool && activeTool !== "select" && "pointer-events-auto cursor-crosshair",
          isDrawingMode && activeTool === "select" && "pointer-events-auto"
        )}
        style={{ zIndex: 10 }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {annotations.map((annotation) => renderAnnotation(annotation))}
        {renderCurrentDrawing()}
      </svg>

      {/* Text input overlay */}
      {textInput.show && (
        <div
          className="absolute z-20 flex gap-1"
          style={{
            left: `${textInput.x}%`,
            top: `${textInput.y}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <Input
            autoFocus
            value={textInput.value}
            onChange={(e) => setTextInput((prev) => ({ ...prev, value: e.target.value }))}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleTextSubmit();
              if (e.key === "Escape") setTextInput({ show: false, x: 0, y: 0, value: "" });
            }}
            placeholder="Enter text..."
            className="w-48 h-8 text-sm"
          />
          <Button size="sm" className="h-8" onClick={handleTextSubmit}>
            Add
          </Button>
        </div>
      )}
    </>
  );
}
