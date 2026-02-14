import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface SignatureRequest {
  id: string;
  project_id: string;
  pay_application_id: string | null;
  change_order_id: string | null;
  signature_type: "contractor" | "architect" | "owner";
  token: string;
  recipient_email: string;
  recipient_name: string | null;
  status: "pending" | "signed" | "expired" | "cancelled";
  expires_at: string;
  requested_by: string;
  signed_at: string | null;
  created_at: string;
}

interface CreateSignatureRequestParams {
  project_id: string;
  pay_application_id?: string;
  change_order_id?: string;
  signature_type: "contractor" | "architect" | "owner";
  recipient_email: string;
  recipient_name?: string;
}

interface SendRequestEmailParams {
  requestId: string;
  projectId: string;
  recipientEmail: string;
  recipientName: string;
  projectName: string;
  documentType: "change_order" | "pay_application";
  documentNumber: number;
  documentTitle: string;
  signatureType: "contractor" | "architect" | "owner";
  amount?: number;
  requestedByName: string;
  signingUrl: string;
  expiresAt?: string;
}

export function useSignatureRequests(
  projectId: string,
  documentId?: string,
  documentType?: "pay_application" | "change_order"
) {
  return useQuery({
    queryKey: ["signature-requests", projectId, documentId, documentType],
    queryFn: async () => {
      let query = supabase
        .from("signature_requests")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });

      if (documentId && documentType) {
        if (documentType === "pay_application") {
          query = query.eq("pay_application_id", documentId);
        } else {
          query = query.eq("change_order_id", documentId);
        }
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as SignatureRequest[];
    },
    enabled: !!projectId,
  });
}

export function useCreateSignatureRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: CreateSignatureRequestParams) => {
      // Get current user's profile for requested_by
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!profile) throw new Error("Profile not found");

      const { data, error } = await supabase
        .from("signature_requests")
        .insert({
          ...params,
          requested_by: profile.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data as SignatureRequest;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["signature-requests", data.project_id] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to create signature request: ${error.message}`);
    },
  });
}

export function useSendSignatureRequestEmail() {
  return useMutation({
    mutationFn: async (params: SendRequestEmailParams) => {
      const { data, error } = await supabase.functions.invoke("request-signature", {
        body: params,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Signature request email sent");
    },
    onError: (error: Error) => {
      toast.error(`Failed to send email: ${error.message}`);
    },
  });
}

export function useCancelSignatureRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, projectId }: { id: string; projectId: string }) => {
      const { error } = await supabase
        .from("signature_requests")
        .update({ status: "cancelled" })
        .eq("id", id);

      if (error) throw error;
      return { id, projectId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["signature-requests", data.projectId] });
      toast.success("Signature request cancelled");
    },
    onError: (error: Error) => {
      toast.error(`Failed to cancel request: ${error.message}`);
    },
  });
}

export function useResendSignatureRequest() {
  return useMutation({
    mutationFn: async (params: SendRequestEmailParams) => {
      const { data, error } = await supabase.functions.invoke("request-signature", {
        body: params,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Signature request resent");
    },
    onError: (error: Error) => {
      toast.error(`Failed to resend: ${error.message}`);
    },
  });
}

interface SendReminderParams {
  requestId: string;
  projectId: string;
  token: string;
  recipientEmail: string;
  recipientName: string | null;
  projectName: string;
  documentType: "change_order" | "pay_application";
  documentNumber: number;
  documentTitle: string;
  signatureType: "contractor" | "architect" | "owner";
  amount: number;
  expiresAt: string;
}

export function useSendSignatureReminder() {
  return useMutation({
    mutationFn: async (params: SendReminderParams) => {
      const { data, error } = await supabase.functions.invoke("send-signature-reminder", {
        body: params,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Reminder email sent successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to send reminder: ${error.message}`);
    },
  });
}
