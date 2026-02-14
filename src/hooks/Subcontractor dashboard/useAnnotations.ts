import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/Subcontractor dashboard/contexts/AuthContext";
import { toast } from "sonner";

export type AnnotationType = "line" | "arrow" | "rectangle" | "text" | "freehand" | "measure_distance" | "measure_area";

export interface PathPoint {
  x: number;
  y: number;
}

export interface PlanAnnotation {
  id: string;
  plan_id: string;
  project_id: string;
  created_by: string;
  annotation_type: AnnotationType;
  start_x: number;
  start_y: number;
  end_x: number | null;
  end_y: number | null;
  path_points: PathPoint[] | null;
  text_content: string | null;
  color: string;
  stroke_width: number;
  measurement_value: number | null;
  measurement_unit: string | null;
  layer: string;
  created_at: string;
  updated_at: string;
  author?: {
    full_name: string | null;
    email: string;
  };
}

export interface CreateAnnotationInput {
  plan_id: string;
  project_id: string;
  annotation_type: AnnotationType;
  start_x: number;
  start_y: number;
  end_x?: number;
  end_y?: number;
  path_points?: PathPoint[];
  text_content?: string;
  color: string;
  stroke_width: number;
  measurement_value?: number;
  measurement_unit?: string;
  layer?: string;
}

export const ANNOTATION_COLORS = [
  { value: "#ef4444", label: "Red" },
  { value: "#f97316", label: "Orange" },
  { value: "#eab308", label: "Yellow" },
  { value: "#22c55e", label: "Green" },
  { value: "#3b82f6", label: "Blue" },
  { value: "#8b5cf6", label: "Purple" },
  { value: "#000000", label: "Black" },
];

export const STROKE_WIDTHS = [
  { value: 1, label: "Thin" },
  { value: 2, label: "Medium" },
  { value: 4, label: "Thick" },
  { value: 6, label: "Extra Thick" },
];

export function useAnnotations(planId: string | undefined) {
  const queryClient = useQueryClient();
  const { profile } = useAuth();

  const { data: annotations = [], isLoading } = useQuery({
    queryKey: ["annotations", planId],
    queryFn: async () => {
      if (!planId) return [];

      const { data, error } = await supabase
        .from("plan_annotations")
        .select(`
          *,
          author:profiles!plan_annotations_created_by_fkey(full_name, email)
        `)
        .eq("plan_id", planId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      
      return (data || []).map(item => ({
        ...item,
        path_points: item.path_points as unknown as PathPoint[] | null,
      })) as PlanAnnotation[];
    },
    enabled: !!planId,
  });

  const createAnnotation = useMutation({
    mutationFn: async (input: CreateAnnotationInput) => {
      if (!profile?.id) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("plan_annotations")
        .insert({
          ...input,
          created_by: profile.id,
          path_points: input.path_points ? JSON.stringify(input.path_points) : null,
          layer: input.layer || "default",
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["annotations", planId] });
    },
    onError: (error) => {
      console.error("Failed to create annotation:", error);
      toast.error("Failed to save annotation");
    },
  });

  const updateAnnotation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<PlanAnnotation> & { id: string }) => {
      const { data, error } = await supabase
        .from("plan_annotations")
        .update({
          ...updates,
          path_points: updates.path_points ? JSON.stringify(updates.path_points) : undefined,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["annotations", planId] });
    },
    onError: (error) => {
      console.error("Failed to update annotation:", error);
      toast.error("Failed to update annotation");
    },
  });

  const deleteAnnotation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("plan_annotations")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["annotations", planId] });
      toast.success("Annotation deleted");
    },
    onError: (error) => {
      console.error("Failed to delete annotation:", error);
      toast.error("Failed to delete annotation");
    },
  });

  const clearAllAnnotations = useMutation({
    mutationFn: async () => {
      if (!planId) throw new Error("No plan selected");

      const { error } = await supabase
        .from("plan_annotations")
        .delete()
        .eq("plan_id", planId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["annotations", planId] });
      toast.success("All annotations cleared");
    },
    onError: (error) => {
      console.error("Failed to clear annotations:", error);
      toast.error("Failed to clear annotations");
    },
  });

  return {
    annotations,
    isLoading,
    createAnnotation,
    updateAnnotation,
    deleteAnnotation,
    clearAllAnnotations,
  };
}
