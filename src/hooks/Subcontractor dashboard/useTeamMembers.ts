import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/Subcontractor dashboard/contexts/AuthContext";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type ProjectRole = Database["public"]["Enums"]["project_role"];

export function useTeamMembers(projectId: string | undefined) {
  return useQuery({
    queryKey: ["project-members", projectId],
    queryFn: async () => {
      if (!projectId) return [];

      const { data, error } = await supabase
        .from("project_members")
        .select(`
          *,
          profile:profiles!project_members_user_id_fkey(id, full_name, email, avatar_url)
        `)
        .eq("project_id", projectId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!projectId,
  });
}

export function useInviteTeamMember(projectId: string) {
  const queryClient = useQueryClient();
  const { profile } = useAuth();

  return useMutation({
    mutationFn: async ({ email, role }: { email: string; role: ProjectRole }) => {
      // First, look up the user by email in profiles
      const { data: targetProfile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", email.toLowerCase().trim())
        .maybeSingle();

      if (profileError) {
        throw new Error("Failed to look up user");
      }

      if (!targetProfile) {
        throw new Error("No user found with that email address. They must sign up first.");
      }

      // Check if user is already a member
      const { data: existingMember, error: memberCheckError } = await supabase
        .from("project_members")
        .select("id")
        .eq("project_id", projectId)
        .eq("user_id", targetProfile.id)
        .maybeSingle();

      if (memberCheckError) {
        throw new Error("Failed to check existing membership");
      }

      if (existingMember) {
        throw new Error("This user is already a member of this project");
      }

      // Add the user as a project member
      const { data, error } = await supabase
        .from("project_members")
        .insert({
          project_id: projectId,
          user_id: targetProfile.id,
          role: role,
          invited_by: profile?.id || null,
        })
        .select()
        .single();

      if (error) {
        console.error("Error adding team member:", error);
        throw new Error("Failed to add team member");
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-members", projectId] });
      toast.success("Team member added successfully");
    },
    onError: (error: Error) => {
      console.error("Error inviting team member:", error);
      toast.error(error.message || "Failed to invite team member");
    },
  });
}

export function useRemoveTeamMember(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (memberId: string) => {
      const { error } = await supabase
        .from("project_members")
        .delete()
        .eq("id", memberId);

      if (error) {
        throw new Error("Failed to remove team member");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-members", projectId] });
      toast.success("Team member removed");
    },
    onError: (error: Error) => {
      console.error("Error removing team member:", error);
      toast.error(error.message || "Failed to remove team member");
    },
  });
}
