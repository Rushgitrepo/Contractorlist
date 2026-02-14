import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type AuditActionType =
  | "request_created"
  | "request_cancelled"
  | "reminder_sent"
  | "signature_completed"
  | "signature_rejected"
  | "request_expired"
  | "document_viewed"
  | "request_resent";

export interface SignatureAuditLog {
  id: string;
  project_id: string;
  signature_request_id: string | null;
  pay_application_id: string | null;
  change_order_id: string | null;
  action_type: AuditActionType;
  actor_id: string | null;
  actor_email: string | null;
  actor_name: string | null;
  description: string | null;
  metadata: Record<string, unknown>;
  ip_address: string | null;
  created_at: string;
}

export function useSignatureAuditLog(projectId: string) {
  return useQuery({
    queryKey: ["signature-audit-logs", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("signature_audit_logs")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) throw error;
      return data as SignatureAuditLog[];
    },
    enabled: !!projectId,
  });
}

export function useCreateAuditLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      projectId: string;
      signatureRequestId?: string;
      payApplicationId?: string;
      changeOrderId?: string;
      actionType: AuditActionType;
      actorName?: string;
      description: string;
      metadata?: Record<string, unknown>;
    }) => {
      // Get current user profile
      const { data: { user } } = await supabase.auth.getUser();
      let actorId: string | null = null;
      let actorEmail: string | null = null;
      let actorName: string | null = params.actorName || null;

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("id, full_name, email")
          .eq("user_id", user.id)
          .single();

        if (profile) {
          actorId = profile.id;
          actorEmail = profile.email;
          actorName = actorName || profile.full_name;
        }
      }

      const insertData = {
        project_id: params.projectId,
        signature_request_id: params.signatureRequestId || null,
        pay_application_id: params.payApplicationId || null,
        change_order_id: params.changeOrderId || null,
        action_type: params.actionType,
        actor_id: actorId,
        actor_email: actorEmail,
        actor_name: actorName,
        description: params.description,
        metadata: params.metadata || {},
      };

      const { data, error } = await supabase
        .from("signature_audit_logs")
        .insert(insertData as never)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["signature-audit-logs", variables.projectId],
      });
    },
  });
}
