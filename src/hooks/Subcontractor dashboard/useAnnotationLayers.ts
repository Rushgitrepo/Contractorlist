import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface AnnotationLayer {
  id: string;
  plan_id: string;
  project_id: string;
  name: string;
  color: string;
  is_visible: boolean;
  is_locked: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface CreateLayerInput {
  plan_id: string;
  project_id: string;
  name: string;
  color?: string;
}

// Default layers that are always available
export const DEFAULT_LAYERS = [
  { name: "default", label: "Default", color: "#6b7280" },
  { name: "markup", label: "Markup", color: "#ef4444" },
  { name: "measurements", label: "Measurements", color: "#3b82f6" },
  { name: "notes", label: "Notes", color: "#eab308" },
];

export function useAnnotationLayers(planId: string | undefined, projectId: string | undefined) {
  const queryClient = useQueryClient();

  const { data: layers = [], isLoading } = useQuery({
    queryKey: ["annotation-layers", planId],
    queryFn: async () => {
      if (!planId) return [];

      const { data, error } = await supabase
        .from("plan_annotation_layers")
        .select("*")
        .eq("plan_id", planId)
        .order("sort_order", { ascending: true });

      if (error) throw error;
      return data as AnnotationLayer[];
    },
    enabled: !!planId,
  });

  const createLayer = useMutation({
    mutationFn: async (input: CreateLayerInput) => {
      const { data, error } = await supabase
        .from("plan_annotation_layers")
        .insert({
          plan_id: input.plan_id,
          project_id: input.project_id,
          name: input.name,
          color: input.color || "#3b82f6",
          sort_order: layers.length,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["annotation-layers", planId] });
      toast.success("Layer created");
    },
    onError: (error) => {
      console.error("Failed to create layer:", error);
      toast.error("Failed to create layer");
    },
  });

  const updateLayer = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<AnnotationLayer> & { id: string }) => {
      const { data, error } = await supabase
        .from("plan_annotation_layers")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["annotation-layers", planId] });
    },
    onError: (error) => {
      console.error("Failed to update layer:", error);
      toast.error("Failed to update layer");
    },
  });

  const deleteLayer = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("plan_annotation_layers")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["annotation-layers", planId] });
      toast.success("Layer deleted");
    },
    onError: (error) => {
      console.error("Failed to delete layer:", error);
      toast.error("Failed to delete layer");
    },
  });

  const toggleLayerVisibility = useMutation({
    mutationFn: async ({ id, is_visible }: { id: string; is_visible: boolean }) => {
      const { error } = await supabase
        .from("plan_annotation_layers")
        .update({ is_visible })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["annotation-layers", planId] });
    },
  });

  const toggleLayerLock = useMutation({
    mutationFn: async ({ id, is_locked }: { id: string; is_locked: boolean }) => {
      const { error } = await supabase
        .from("plan_annotation_layers")
        .update({ is_locked })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["annotation-layers", planId] });
    },
  });

  // Ensure default layers exist for this plan
  const ensureDefaultLayers = useMutation({
    mutationFn: async () => {
      if (!planId || !projectId) throw new Error("Plan and project required");

      const existingNames = layers.map((l) => l.name);
      const missingLayers = DEFAULT_LAYERS.filter((dl) => !existingNames.includes(dl.name));

      if (missingLayers.length === 0) return;

      const { error } = await supabase
        .from("plan_annotation_layers")
        .insert(
          missingLayers.map((layer, i) => ({
            plan_id: planId,
            project_id: projectId,
            name: layer.name,
            color: layer.color,
            sort_order: layers.length + i,
          }))
        );

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["annotation-layers", planId] });
    },
  });

  // Get visible layer names for filtering annotations
  const visibleLayerNames = layers.filter((l) => l.is_visible).map((l) => l.name);
  const lockedLayerNames = layers.filter((l) => l.is_locked).map((l) => l.name);

  return {
    layers,
    isLoading,
    visibleLayerNames,
    lockedLayerNames,
    createLayer,
    updateLayer,
    deleteLayer,
    toggleLayerVisibility,
    toggleLayerLock,
    ensureDefaultLayers,
  };
}
