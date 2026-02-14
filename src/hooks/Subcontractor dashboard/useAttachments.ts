import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/Subcontractor dashboard/contexts/AuthContext";
import { toast } from "sonner";

interface Attachment {
  id: string;
  project_id: string;
  rfi_id: string | null;
  change_order_id: string | null;
  pin_id: string | null;
  file_name: string;
  file_path: string;
  file_size: number | null;
  file_type: string | null;
  uploaded_by: string;
  created_at: string;
  uploader?: {
    full_name: string | null;
    email: string;
  } | null;
}

export function useAttachments(options: {
  projectId: string;
  rfiId?: string;
  changeOrderId?: string;
  pinId?: string;
}) {
  return useQuery({
    queryKey: ["attachments", options],
    queryFn: async () => {
      let query = supabase
        .from("attachments")
        .select(`
          *,
          uploader:profiles!attachments_uploaded_by_fkey(full_name, email)
        `)
        .eq("project_id", options.projectId);

      if (options.rfiId) {
        query = query.eq("rfi_id", options.rfiId);
      } else if (options.changeOrderId) {
        query = query.eq("change_order_id", options.changeOrderId);
      } else if (options.pinId) {
        query = query.eq("pin_id", options.pinId);
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) throw error;
      return data as Attachment[];
    },
    enabled: !!options.projectId,
  });
}

export function useUploadAttachment(projectId: string) {
  const queryClient = useQueryClient();
  const { profile } = useAuth();

  return useMutation({
    mutationFn: async ({
      file,
      rfiId,
      changeOrderId,
      pinId,
    }: {
      file: File;
      rfiId?: string;
      changeOrderId?: string;
      pinId?: string;
    }) => {
      if (!profile?.id) throw new Error("User not authenticated");

      // Generate unique file path
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${projectId}/${fileName}`;

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
          rfi_id: rfiId || null,
          change_order_id: changeOrderId || null,
          pin_id: pinId || null,
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
      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: ["attachments", { projectId, rfiId: variables.rfiId }],
      });
      queryClient.invalidateQueries({
        queryKey: ["attachments", { projectId, changeOrderId: variables.changeOrderId }],
      });
      queryClient.invalidateQueries({
        queryKey: ["attachments", { projectId, pinId: variables.pinId }],
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
        // Continue to delete record even if storage fails
      }

      // Delete record
      const { error } = await supabase
        .from("attachments")
        .delete()
        .eq("id", attachment.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attachments"] });
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
