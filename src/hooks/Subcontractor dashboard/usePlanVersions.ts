import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/Subcontractor dashboard/contexts/AuthContext";
import { toast } from "sonner";
import { PlanDiscipline } from "./usePlans";

export interface PlanVersion {
  id: string;
  project_id: string;
  name: string;
  description: string | null;
  file_path: string;
  file_name: string;
  file_size: number | null;
  sheet_number: string | null;
  discipline: string | null;
  version: number | null;
  is_current: boolean | null;
  uploaded_by: string;
  created_at: string;
  updated_at: string;
  uploaded_by_profile?: {
    id: string;
    full_name: string | null;
    email: string;
  };
}

/**
 * Fetch all versions of plans that share the same sheet_number and discipline
 */
export function usePlanVersionHistory(
  projectId: string | undefined,
  sheetNumber: string | null | undefined,
  discipline: string | null | undefined
) {
  return useQuery({
    queryKey: ["plan-versions", projectId, sheetNumber, discipline],
    queryFn: async () => {
      if (!projectId || !sheetNumber) return [];

      let query = supabase
        .from("plans")
        .select(`
          *,
          uploaded_by_profile:profiles!plans_uploaded_by_fkey(id, full_name, email)
        `)
        .eq("project_id", projectId)
        .eq("sheet_number", sheetNumber);

      if (discipline) {
        query = query.eq("discipline", discipline);
      }

      const { data, error } = await query.order("version", { ascending: false });

      if (error) throw error;
      return data as PlanVersion[];
    },
    enabled: !!projectId && !!sheetNumber,
  });
}

/**
 * Upload a new revision of an existing plan
 */
export function useUploadPlanRevision(projectId: string) {
  const queryClient = useQueryClient();
  const { profile } = useAuth();

  return useMutation({
    mutationFn: async ({
      file,
      existingPlan,
      description,
    }: {
      file: File;
      existingPlan: {
        id: string;
        name: string;
        sheet_number: string | null;
        discipline: string | null;
        version: number | null;
      };
      description?: string;
    }) => {
      if (!profile?.id) throw new Error("User not authenticated");

      const fileExt = file.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${projectId}/plans/${fileName}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from("project-attachments")
        .upload(filePath, file);

      if (uploadError) {
        console.error("Storage upload error:", uploadError);
        throw new Error("Failed to upload plan revision");
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("project-attachments")
        .getPublicUrl(filePath);

      const newVersion = (existingPlan.version || 1) + 1;

      // Mark old plan as not current
      const { error: updateError } = await supabase
        .from("plans")
        .update({ is_current: false })
        .eq("id", existingPlan.id);

      if (updateError) {
        // Clean up uploaded file
        await supabase.storage.from("project-attachments").remove([filePath]);
        throw updateError;
      }

      // Create new plan record with incremented version
      const { data, error } = await supabase
        .from("plans")
        .insert({
          project_id: projectId,
          name: existingPlan.name,
          description: description || null,
          file_path: urlData.publicUrl,
          file_name: file.name,
          file_size: file.size,
          sheet_number: existingPlan.sheet_number,
          discipline: existingPlan.discipline as PlanDiscipline,
          version: newVersion,
          is_current: true,
          uploaded_by: profile.id,
        })
        .select()
        .single();

      if (error) {
        // Rollback: restore old plan as current
        await supabase
          .from("plans")
          .update({ is_current: true })
          .eq("id", existingPlan.id);
        // Clean up uploaded file
        await supabase.storage.from("project-attachments").remove([filePath]);
        throw error;
      }

      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["project-plans", projectId] });
      queryClient.invalidateQueries({
        queryKey: [
          "plan-versions",
          projectId,
          variables.existingPlan.sheet_number,
          variables.existingPlan.discipline,
        ],
      });
      toast.success(`Uploaded revision v${data.version}`);
    },
    onError: (error) => {
      console.error("Error uploading plan revision:", error);
      toast.error("Failed to upload revision");
    },
  });
}

/**
 * Switch which version is marked as current
 */
export function useSetCurrentVersion(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      versionId,
      sheetNumber,
      discipline,
    }: {
      versionId: string;
      sheetNumber: string | null;
      discipline: string | null;
    }) => {
      // First, mark all versions with same sheet_number/discipline as not current
      let updateQuery = supabase
        .from("plans")
        .update({ is_current: false })
        .eq("project_id", projectId);

      if (sheetNumber) {
        updateQuery = updateQuery.eq("sheet_number", sheetNumber);
      }
      if (discipline) {
        updateQuery = updateQuery.eq("discipline", discipline);
      }

      const { error: updateError } = await updateQuery;
      if (updateError) throw updateError;

      // Then mark the selected version as current
      const { error } = await supabase
        .from("plans")
        .update({ is_current: true })
        .eq("id", versionId);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["project-plans", projectId] });
      queryClient.invalidateQueries({
        queryKey: [
          "plan-versions",
          projectId,
          variables.sheetNumber,
          variables.discipline,
        ],
      });
      toast.success("Switched to selected version");
    },
    onError: (error) => {
      console.error("Error switching version:", error);
      toast.error("Failed to switch version");
    },
  });
}
