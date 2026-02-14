import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/Subcontractor dashboard/contexts/AuthContext";
import { toast } from "sonner";

export interface RetainageRelease {
  id: string;
  project_id: string;
  pay_application_id: string | null;
  amount: number;
  release_date: string;
  description: string | null;
  released_by: string | null;
  created_at: string;
  updated_at: string;
}

export function useRetainageReleases(projectId: string | undefined) {
  return useQuery({
    queryKey: ["retainage-releases", projectId],
    queryFn: async () => {
      if (!projectId) return [];
      const { data, error } = await supabase
        .from("retainage_releases")
        .select("*")
        .eq("project_id", projectId)
        .order("release_date", { ascending: false });

      if (error) throw error;
      return data as RetainageRelease[];
    },
    enabled: !!projectId,
  });
}

export function useRetainageMutations(projectId: string) {
  const queryClient = useQueryClient();
  const { profile } = useAuth();

  const createRelease = useMutation({
    mutationFn: async (release: {
      project_id: string;
      amount: number;
      release_date: string;
      description: string | null;
      pay_application_id?: string;
    }) => {
      const { data, error } = await supabase
        .from("retainage_releases")
        .insert({
          ...release,
          released_by: profile?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["retainage-releases", projectId] });
      toast.success("Retainage release recorded");
    },
    onError: (error: Error) => {
      toast.error("Failed to record retainage release", { description: error.message });
    },
  });

  const deleteRelease = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("retainage_releases")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["retainage-releases", projectId] });
      toast.success("Retainage release deleted");
    },
    onError: (error: Error) => {
      toast.error("Failed to delete retainage release", { description: error.message });
    },
  });

  return { createRelease, deleteRelease };
}
