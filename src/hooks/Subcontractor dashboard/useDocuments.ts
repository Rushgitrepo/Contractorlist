import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/Subcontractor dashboard/contexts/AuthContext";
import { toast } from "sonner";

export const DOCUMENT_CATEGORIES = [
  { value: "general", label: "General" },
  { value: "drawings", label: "Drawings" },
  { value: "specifications", label: "Specifications" },
  { value: "contracts", label: "Contracts" },
  { value: "permits", label: "Permits" },
  { value: "photos", label: "Photos" },
  { value: "reports", label: "Reports" },
  { value: "submittals", label: "Submittals" },
] as const;

export type DocumentCategory = typeof DOCUMENT_CATEGORIES[number]["value"];

export function useProjectDocuments(projectId: string | undefined) {
  return useQuery({
    queryKey: ["project-documents", projectId],
    queryFn: async () => {
      if (!projectId) return [];

      const { data, error } = await supabase
        .from("attachments")
        .select(`
          *,
          uploaded_by_profile:profiles!attachments_uploaded_by_fkey(id, full_name, email)
        `)
        .eq("project_id", projectId)
        .is("rfi_id", null)
        .is("change_order_id", null)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!projectId,
  });
}

export function useUploadDocument(projectId: string) {
  const queryClient = useQueryClient();
  const { profile } = useAuth();

  return useMutation({
    mutationFn: async ({
      file,
      category,
    }: {
      file: File;
      category: DocumentCategory;
    }) => {
      if (!profile?.id) throw new Error("User not authenticated");

      const fileExt = file.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${projectId}/documents/${fileName}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from("project-attachments")
        .upload(filePath, file);

      if (uploadError) {
        console.error("Storage upload error:", uploadError);
        throw new Error("Failed to upload file");
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("project-attachments")
        .getPublicUrl(filePath);

      // Create attachment record
      const { data, error } = await supabase
        .from("attachments")
        .insert({
          project_id: projectId,
          file_name: file.name,
          file_path: urlData.publicUrl,
          file_type: file.type,
          file_size: file.size,
          uploaded_by: profile.id,
          category,
        })
        .select()
        .single();

      if (error) {
        // Clean up uploaded file if database insert fails
        await supabase.storage.from("project-attachments").remove([filePath]);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-documents", projectId] });
      toast.success("Document uploaded successfully");
    },
    onError: (error) => {
      console.error("Error uploading document:", error);
      toast.error("Failed to upload document");
    },
  });
}

export function useDeleteDocument(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (attachmentId: string) => {
      // Get the attachment to find the file path
      const { data: attachment, error: fetchError } = await supabase
        .from("attachments")
        .select("file_path")
        .eq("id", attachmentId)
        .single();

      if (fetchError) throw fetchError;

      // Extract the storage path from the full URL
      const url = new URL(attachment.file_path);
      const pathParts = url.pathname.split("/storage/v1/object/public/project-attachments/");
      const storagePath = pathParts[1];

      if (storagePath) {
        // Delete from storage
        await supabase.storage.from("project-attachments").remove([storagePath]);
      }

      // Delete the database record
      const { error } = await supabase
        .from("attachments")
        .delete()
        .eq("id", attachmentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-documents", projectId] });
      toast.success("Document deleted");
    },
    onError: (error) => {
      console.error("Error deleting document:", error);
      toast.error("Failed to delete document");
    },
  });
}

export function useUpdateDocumentCategory(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      attachmentId,
      category,
    }: {
      attachmentId: string;
      category: DocumentCategory;
    }) => {
      const { error } = await supabase
        .from("attachments")
        .update({ category })
        .eq("id", attachmentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-documents", projectId] });
      toast.success("Document category updated");
    },
    onError: (error) => {
      console.error("Error updating document category:", error);
      toast.error("Failed to update category");
    },
  });
}
