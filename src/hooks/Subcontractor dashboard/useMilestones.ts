import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/Subcontractor dashboard/contexts/AuthContext";
import { toast } from "sonner";

export interface Milestone {
  id: string;
  project_id: string;
  name: string;
  description: string | null;
  start_date: string;
  end_date: string;
  progress: number;
  color: string | null;
  parent_id: string | null;
  sort_order: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export function useMilestones(projectId: string | undefined) {
  return useQuery({
    queryKey: ["milestones", projectId],
    queryFn: async () => {
      if (!projectId) return [];

      const { data, error } = await supabase
        .from("milestones")
        .select("*")
        .eq("project_id", projectId)
        .order("sort_order", { ascending: true })
        .order("start_date", { ascending: true });

      if (error) throw error;
      return data as Milestone[];
    },
    enabled: !!projectId,
  });
}

export function useCreateMilestone(projectId: string) {
  const queryClient = useQueryClient();
  const { profile } = useAuth();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      description?: string;
      start_date: string;
      end_date: string;
      progress?: number;
      color?: string;
      parent_id?: string;
    }) => {
      const { data: result, error } = await supabase
        .from("milestones")
        .insert({
          project_id: projectId,
          name: data.name,
          description: data.description || null,
          start_date: data.start_date,
          end_date: data.end_date,
          progress: data.progress || 0,
          color: data.color || "#3b82f6",
          parent_id: data.parent_id || null,
          created_by: profile?.id || null,
        })
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["milestones", projectId] });
      toast.success("Milestone created");
    },
    onError: (error) => {
      console.error("Error creating milestone:", error);
      toast.error("Failed to create milestone");
    },
  });
}

export function useUpdateMilestone(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...data
    }: {
      id: string;
      name?: string;
      description?: string;
      start_date?: string;
      end_date?: string;
      progress?: number;
      color?: string;
    }) => {
      const { data: result, error } = await supabase
        .from("milestones")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["milestones", projectId] });
      toast.success("Milestone updated");
    },
    onError: (error) => {
      console.error("Error updating milestone:", error);
      toast.error("Failed to update milestone");
    },
  });
}

export function useDeleteMilestone(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("milestones")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["milestones", projectId] });
      toast.success("Milestone deleted");
    },
    onError: (error) => {
      console.error("Error deleting milestone:", error);
      toast.error("Failed to delete milestone");
    },
  });
}
