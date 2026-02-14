import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/Subcontractor dashboard/contexts/AuthContext";
import { toast } from "sonner";
import { PlanAnnotation } from "./useAnnotations";

export interface AnnotationTemplate {
  id: string;
  project_id: string;
  created_by: string;
  name: string;
  description: string | null;
  annotations: TemplateAnnotation[];
  thumbnail_url: string | null;
  created_at: string;
  updated_at: string;
  author?: {
    full_name: string | null;
    email: string;
  };
}

// Simplified annotation for template storage (no IDs or plan-specific data)
export interface TemplateAnnotation {
  annotation_type: string;
  start_x: number;
  start_y: number;
  end_x: number | null;
  end_y: number | null;
  path_points: { x: number; y: number }[] | null;
  text_content: string | null;
  color: string;
  stroke_width: number;
  layer: string;
}

export interface CreateTemplateInput {
  project_id: string;
  name: string;
  description?: string;
  annotations: PlanAnnotation[];
}

export function useAnnotationTemplates(projectId: string | undefined) {
  const queryClient = useQueryClient();
  const { profile } = useAuth();

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ["annotation-templates", projectId],
    queryFn: async () => {
      if (!projectId) return [];

      const { data, error } = await (supabase
        .from("annotation_templates" as any)
        .select(`
          *,
          author:profiles!annotation_templates_created_by_fkey(full_name, email)
        `)
        .eq("project_id", projectId)
        .order("created_at", { ascending: false }) as any);

      if (error) throw error;
      
      return (data || []).map(item => ({
        ...item,
        annotations: (item.annotations as unknown as TemplateAnnotation[]) || [],
      })) as AnnotationTemplate[];
    },
    enabled: !!projectId,
  });

  const createTemplate = useMutation({
    mutationFn: async (input: CreateTemplateInput) => {
      if (!profile?.id) throw new Error("Not authenticated");

      // Convert annotations to template format (remove IDs and plan-specific data)
      const templateAnnotations: TemplateAnnotation[] = input.annotations.map(a => ({
        annotation_type: a.annotation_type,
        start_x: a.start_x,
        start_y: a.start_y,
        end_x: a.end_x,
        end_y: a.end_y,
        path_points: a.path_points,
        text_content: a.text_content,
        color: a.color,
        stroke_width: a.stroke_width,
        layer: a.layer,
      }));

      const { data, error } = await (supabase
        .from("annotation_templates" as any)
        .insert({
          project_id: input.project_id,
          created_by: profile.id,
          name: input.name,
          description: input.description || null,
          annotations: templateAnnotations,
        }) as any)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["annotation-templates", projectId] });
      toast.success("Template saved successfully");
    },
    onError: (error) => {
      console.error("Failed to create template:", error);
      toast.error("Failed to save template");
    },
  });

  const deleteTemplate = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase
        .from("annotation_templates" as any)
        .delete()
        .eq("id", id) as any);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["annotation-templates", projectId] });
      toast.success("Template deleted");
    },
    onError: (error) => {
      console.error("Failed to delete template:", error);
      toast.error("Failed to delete template");
    },
  });

  const updateTemplate = useMutation({
    mutationFn: async ({ id, name, description }: { id: string; name: string; description?: string }) => {
      const { data, error } = await (supabase
        .from("annotation_templates" as any)
        .update({ name, description })
        .eq("id", id)
        .select()
        .single() as any);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["annotation-templates", projectId] });
      toast.success("Template updated");
    },
    onError: (error) => {
      console.error("Failed to update template:", error);
      toast.error("Failed to update template");
    },
  });

  return {
    templates,
    isLoading,
    createTemplate,
    deleteTemplate,
    updateTemplate,
  };
}
