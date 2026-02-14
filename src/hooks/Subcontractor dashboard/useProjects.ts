import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/Subcontractor dashboard/contexts/AuthContext";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type Project = Database["public"]["Tables"]["projects"]["Row"];
type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"];

export function useProjects() {
  const { profile } = useAuth();

  return useQuery({
    queryKey: ["projects", profile?.id],
    queryFn: async () => {
      if (!profile?.id) return [];

      // Fetch projects where user is a member OR creator
      const { data, error } = await supabase
        .from("projects")
        .select(`
          *,
          project_members!inner(user_id, role)
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching projects:", error);
        throw error;
      }

      return data as (Project & { project_members: { user_id: string; role: string }[] })[];
    },
    enabled: !!profile?.id,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  const { profile } = useAuth();

  return useMutation({
    mutationFn: async (projectData: Omit<ProjectInsert, "created_by">) => {
      if (!profile?.id) throw new Error("User not authenticated");

      // Create the project
      const { data: project, error: projectError } = await supabase
        .from("projects")
        .insert({
          ...projectData,
          created_by: profile.id,
        })
        .select()
        .single();

      if (projectError) throw projectError;

      // Add the creator as an owner in project_members
      const { error: memberError } = await supabase
        .from("project_members")
        .insert({
          project_id: project.id,
          user_id: profile.id,
          role: "owner",
          invited_by: profile.id,
        });

      if (memberError) {
        // Rollback project creation if member insert fails
        await supabase.from("projects").delete().eq("id", project.id);
        throw memberError;
      }

      return project;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project created successfully");
    },
    onError: (error) => {
      console.error("Error creating project:", error);
      toast.error("Failed to create project");
    },
  });
}

export function useProjectStats() {
  const { profile } = useAuth();

  return useQuery({
    queryKey: ["project-stats", profile?.id],
    queryFn: async () => {
      if (!profile?.id) return null;

      const { data, error } = await supabase
        .from("projects")
        .select(`
          status,
          budget_total,
          budget_spent
        `);

      if (error) throw error;

      const stats = {
        total: data.length,
        active: data.filter((p) => p.status === "in-progress").length,
        planning: data.filter((p) => p.status === "planning").length,
        completed: data.filter((p) => p.status === "completed").length,
        onHold: data.filter((p) => p.status === "on-hold").length,
        totalBudget: data.reduce((sum, p) => sum + Number(p.budget_total || 0), 0),
        totalSpent: data.reduce((sum, p) => sum + Number(p.budget_spent || 0), 0),
      };

      return stats;
    },
    enabled: !!profile?.id,
  });
}
