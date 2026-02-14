import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/Subcontractor dashboard/contexts/AuthContext";
import { toast } from "sonner";

interface PayAppAttachment {
  id: string;
  project_id: string;
  pay_application_id: string;
  file_name: string;
  file_path: string;
  file_size: number | null;
  file_type: string | null;
  uploaded_by: string;
  created_at: string;
}

export function usePayAppAttachments(projectId: string, payApplicationId: string) {
  return useQuery({
    queryKey: ["pay-app-attachments", projectId, payApplicationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("attachments")
        .select("*")
        .eq("project_id", projectId)
        .eq("pay_application_id", payApplicationId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as PayAppAttachment[];
    },
    enabled: !!projectId && !!payApplicationId,
  });
}

export function useUploadPayAppAttachment(projectId: string) {
  const queryClient = useQueryClient();
  const { profile } = useAuth();

  return useMutation({
    mutationFn: async ({
      file,
      payApplicationId,
    }: {
      file: File;
      payApplicationId: string;
    }) => {
      if (!profile?.id) throw new Error("User not authenticated");

      // Generate unique file path
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${projectId}/pay-apps/${payApplicationId}/${fileName}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from("project-attachments")
        .upload(filePath, file);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw new Error("Failed to upload file");
      }

      // Create attachment record
      const { data, error } = await supabase
        .from("attachments")
        .insert({
          project_id: projectId,
          pay_application_id: payApplicationId,
          file_name: file.name,
          file_path: filePath,
          file_size: file.size,
          file_type: file.type,
          uploaded_by: profile.id,
        })
        .select()
        .single();

      if (error) {
        // Try to clean up uploaded file
        await supabase.storage.from("project-attachments").remove([filePath]);
        throw new Error("Failed to save attachment record");
      }

      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["pay-app-attachments", projectId, variables.payApplicationId],
      });
      toast.success("File uploaded successfully");
    },
    onError: (error: Error) => {
      console.error("Error uploading attachment:", error);
      toast.error(error.message || "Failed to upload file");
    },
  });
}

export function useDeleteAttachment(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (attachment: { id: string; file_path: string }) => {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from("project-attachments")
        .remove([attachment.file_path]);

      if (storageError) {
        console.error("Storage delete error:", storageError);
      }

      // Delete record
      const { error } = await supabase
        .from("attachments")
        .delete()
        .eq("id", attachment.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pay-app-attachments"] });
      toast.success("Attachment deleted");
    },
    onError: (error: Error) => {
      console.error("Error deleting attachment:", error);
      toast.error("Failed to delete attachment");
    },
  });
}

export function getAttachmentUrl(filePath: string): string {
  const { data } = supabase.storage
    .from("project-attachments")
    .getPublicUrl(filePath);
  return data.publicUrl;
}
