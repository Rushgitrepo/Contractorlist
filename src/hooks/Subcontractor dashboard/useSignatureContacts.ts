import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface SignatureContact {
  id: string;
  project_id: string;
  name: string;
  email: string;
  company: string | null;
  default_role: "contractor" | "architect" | "owner" | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export function useSignatureContacts(projectId: string) {
  return useQuery({
    queryKey: ["signature-contacts", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("signature_contacts")
        .select("*")
        .eq("project_id", projectId)
        .order("name");

      if (error) throw error;
      return data as SignatureContact[];
    },
    enabled: !!projectId,
  });
}

export function useCreateSignatureContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      projectId: string;
      name: string;
      email: string;
      company?: string;
      defaultRole?: "contractor" | "architect" | "owner";
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", user.id)
        .single();

      const { data, error } = await supabase
        .from("signature_contacts")
        .insert({
          project_id: params.projectId,
          name: params.name,
          email: params.email,
          company: params.company || null,
          default_role: params.defaultRole || null,
          created_by: profile?.id || null,
        } as never)
        .select()
        .single();

      if (error) {
        if (error.code === "23505") {
          throw new Error("A contact with this email already exists");
        }
        throw error;
      }
      return data as SignatureContact;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["signature-contacts", variables.projectId] });
      toast.success("Contact saved");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateSignatureContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      id: string;
      projectId: string;
      name?: string;
      email?: string;
      company?: string | null;
      defaultRole?: "contractor" | "architect" | "owner" | null;
    }) => {
      const updateData: Record<string, unknown> = {};
      if (params.name !== undefined) updateData.name = params.name;
      if (params.email !== undefined) updateData.email = params.email;
      if (params.company !== undefined) updateData.company = params.company;
      if (params.defaultRole !== undefined) updateData.default_role = params.defaultRole;

      const { data, error } = await supabase
        .from("signature_contacts")
        .update(updateData as never)
        .eq("id", params.id)
        .select()
        .single();

      if (error) throw error;
      return { ...data, projectId: params.projectId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["signature-contacts", data.projectId] });
      toast.success("Contact updated");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update contact: ${error.message}`);
    },
  });
}

export function useDeleteSignatureContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { id: string; projectId: string }) => {
      const { error } = await supabase
        .from("signature_contacts")
        .delete()
        .eq("id", params.id);

      if (error) throw error;
      return params;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["signature-contacts", data.projectId] });
      toast.success("Contact deleted");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete contact: ${error.message}`);
    },
  });
}
