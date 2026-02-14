import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ChangeOrderSignatureData {
  id: string;
  change_order_id: string;
  project_id: string;
  signature_type: "contractor" | "architect" | "owner";
  signature_data: string;
  signer_name: string;
  signer_title: string | null;
  signed_at: string;
  ip_address: string | null;
  created_at: string;
  updated_at: string;
}

export interface ChangeOrderSignatureInsert {
  change_order_id: string;
  project_id: string;
  signature_type: "contractor" | "architect" | "owner";
  signature_data: string;
  signer_name: string;
  signer_title?: string | null;
}

export function useChangeOrderSignatures(projectId: string, changeOrderId: string) {
  const queryClient = useQueryClient();

  const signaturesQuery = useQuery({
    queryKey: ["change-order-signatures", changeOrderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pay_application_signatures")
        .select("*")
        .eq("change_order_id", changeOrderId);

      if (error) throw error;
      return data as ChangeOrderSignatureData[];
    },
    enabled: !!changeOrderId,
  });

  const saveSignature = useMutation({
    mutationFn: async (signature: ChangeOrderSignatureInsert) => {
      // Check if signature already exists
      const { data: existing } = await supabase
        .from("pay_application_signatures")
        .select("id")
        .eq("change_order_id", signature.change_order_id)
        .eq("signature_type", signature.signature_type)
        .single();

      if (existing) {
        // Update existing
        const { data, error } = await supabase
          .from("pay_application_signatures")
          .update({
            signature_data: signature.signature_data,
            signer_name: signature.signer_name,
            signer_title: signature.signer_title,
            signed_at: new Date().toISOString(),
          })
          .eq("id", existing.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Insert new
        const { data, error } = await supabase
          .from("pay_application_signatures")
          .insert({
            change_order_id: signature.change_order_id,
            project_id: signature.project_id,
            signature_type: signature.signature_type,
            signature_data: signature.signature_data,
            signer_name: signature.signer_name,
            signer_title: signature.signer_title,
            signed_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["change-order-signatures", changeOrderId] });
      const typeLabel = data.signature_type === "contractor" 
        ? "Contractor" 
        : data.signature_type === "architect" 
          ? "Architect" 
          : "Owner";
      toast.success(`${typeLabel} signature saved`);
    },
    onError: (error) => {
      console.error("Error saving signature:", error);
      toast.error("Failed to save signature");
    },
  });

  const deleteSignature = useMutation({
    mutationFn: async (signatureId: string) => {
      const { error } = await supabase
        .from("pay_application_signatures")
        .delete()
        .eq("id", signatureId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["change-order-signatures", changeOrderId] });
      toast.success("Signature removed");
    },
    onError: (error) => {
      console.error("Error deleting signature:", error);
      toast.error("Failed to remove signature");
    },
  });

  return {
    signatures: signaturesQuery.data || [],
    isLoading: signaturesQuery.isLoading,
    saveSignature,
    deleteSignature,
  };
}

// Utility hook to fetch signatures for PDF generation
export function useChangeOrderSignaturesForPDF(changeOrderId: string) {
  return useQuery({
    queryKey: ["change-order-signatures-pdf", changeOrderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pay_application_signatures")
        .select("*")
        .eq("change_order_id", changeOrderId);

      if (error) throw error;
      
      const signatures: {
        contractor?: ChangeOrderSignatureData;
        architect?: ChangeOrderSignatureData;
        owner?: ChangeOrderSignatureData;
      } = {};
      
      data?.forEach((sig) => {
        if (sig.signature_type === "contractor") {
          signatures.contractor = sig as ChangeOrderSignatureData;
        } else if (sig.signature_type === "architect") {
          signatures.architect = sig as ChangeOrderSignatureData;
        } else if (sig.signature_type === "owner") {
          signatures.owner = sig as ChangeOrderSignatureData;
        }
      });
      
      return signatures;
    },
    enabled: !!changeOrderId,
  });
}
