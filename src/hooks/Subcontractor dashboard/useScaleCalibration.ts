import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ScaleCalibration {
  // Pixels per unit (e.g., pixels per foot)
  pixelsPerUnit: number;
  // The unit of measurement
  unit: "ft" | "m" | "in" | "cm";
  // The reference line used for calibration (for display purposes)
  referenceLength: number; // in the chosen unit
  // Start and end points of the calibration line (as percentages)
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export const MEASUREMENT_UNITS = [
  { value: "ft", label: "Feet", shortLabel: "ft" },
  { value: "m", label: "Meters", shortLabel: "m" },
  { value: "in", label: "Inches", shortLabel: "in" },
  { value: "cm", label: "Centimeters", shortLabel: "cm" },
] as const;

export type MeasurementUnit = (typeof MEASUREMENT_UNITS)[number]["value"];

export function useScaleCalibration(planId: string | undefined) {
  const queryClient = useQueryClient();

  const saveCalibration = useMutation({
    mutationFn: async (calibration: ScaleCalibration) => {
      if (!planId) throw new Error("No plan selected");

      const { data, error } = await supabase
        .from("plans")
        .update({ scale_calibration: JSON.parse(JSON.stringify(calibration)) })
        .eq("id", planId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      toast.success("Scale calibration saved");
    },
    onError: (error) => {
      console.error("Failed to save calibration:", error);
      toast.error("Failed to save calibration");
    },
  });

  const clearCalibration = useMutation({
    mutationFn: async () => {
      if (!planId) throw new Error("No plan selected");

      const { error } = await supabase
        .from("plans")
        .update({ scale_calibration: null })
        .eq("id", planId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      toast.success("Scale calibration cleared");
    },
    onError: (error) => {
      console.error("Failed to clear calibration:", error);
      toast.error("Failed to clear calibration");
    },
  });

  return {
    saveCalibration,
    clearCalibration,
  };
}

// Calculate the distance between two points in percentage coordinates
export function calculatePixelDistance(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  containerWidth: number,
  containerHeight: number
): number {
  const dx = ((endX - startX) / 100) * containerWidth;
  const dy = ((endY - startY) / 100) * containerHeight;
  return Math.sqrt(dx * dx + dy * dy);
}

// Calculate real-world distance using calibration
export function calculateRealDistance(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  calibration: ScaleCalibration | null,
  containerWidth: number,
  containerHeight: number
): { value: number; unit: string } | null {
  if (!calibration) return null;

  const pixelDistance = calculatePixelDistance(
    startX,
    startY,
    endX,
    endY,
    containerWidth,
    containerHeight
  );

  const realDistance = pixelDistance / calibration.pixelsPerUnit;
  return { value: realDistance, unit: calibration.unit };
}

// Calculate polygon area using Shoelace formula
export function calculatePolygonArea(
  points: { x: number; y: number }[],
  calibration: ScaleCalibration | null,
  containerWidth: number,
  containerHeight: number
): { value: number; unit: string } | null {
  if (points.length < 3 || !calibration) return null;

  // Convert percentage coordinates to pixels
  const pixelPoints = points.map((p) => ({
    x: (p.x / 100) * containerWidth,
    y: (p.y / 100) * containerHeight,
  }));

  // Shoelace formula
  let area = 0;
  for (let i = 0; i < pixelPoints.length; i++) {
    const j = (i + 1) % pixelPoints.length;
    area += pixelPoints[i].x * pixelPoints[j].y;
    area -= pixelPoints[j].x * pixelPoints[i].y;
  }
  area = Math.abs(area) / 2;

  // Convert to real-world area
  const pixelsPerUnitSquared = calibration.pixelsPerUnit * calibration.pixelsPerUnit;
  const realArea = area / pixelsPerUnitSquared;

  return { value: realArea, unit: `${calibration.unit}²` };
}

// Format measurement value for display
export function formatMeasurement(value: number, unit: string, decimals: number = 2): string {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(decimals)}k ${unit}`;
  }
  return `${value.toFixed(decimals)} ${unit}`;
}
