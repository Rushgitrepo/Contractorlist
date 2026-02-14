import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface SignatureData {
  id: string;
  pay_application_id: string;
  project_id: string;
  signature_type: "contractor" | "architect";
  signature_data: string;
  signer_name: string;
  signer_title: string | null;
  signed_at: string;
  ip_address: string | null;
  created_at: string;
  updated_at: string;
}

export interface SignatureInsert {
  pay_application_id: string;
  project_id: string;
  signature_type: "contractor" | "architect";
  signature_data: string;
  signer_name: string;
  signer_title?: string | null;
}

export function useSignatures(projectId: string, payApplicationId: string) {
  const queryClient = useQueryClient();

  const signaturesQuery = useQuery({
    queryKey: ["signatures", payApplicationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pay_application_signatures")
        .select("*")
        .eq("pay_application_id", payApplicationId);

      if (error) throw error;
      return data as SignatureData[];
    },
    enabled: !!payApplicationId,
  });

  const saveSignature = useMutation({
    mutationFn: async (signature: SignatureInsert) => {
      // Check if signature already exists
      const { data: existing } = await supabase
        .from("pay_application_signatures")
        .select("id")
        .eq("pay_application_id", signature.pay_application_id)
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
            ...signature,
            signed_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["signatures", payApplicationId] });
      toast.success(
        `${data.signature_type === "contractor" ? "Contractor" : "Architect"} signature saved`
      );
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
      queryClient.invalidateQueries({ queryKey: ["signatures", payApplicationId] });
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
export function useSignaturesForPDF(payApplicationId: string) {
  return useQuery({
    queryKey: ["signatures-pdf", payApplicationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pay_application_signatures")
        .select("*")
        .eq("pay_application_id", payApplicationId);

      if (error) throw error;
      
      const signatures: {
        contractor?: SignatureData;
        architect?: SignatureData;
      } = {};
      
      data?.forEach((sig) => {
        if (sig.signature_type === "contractor") {
          signatures.contractor = sig as SignatureData;
        } else if (sig.signature_type === "architect") {
          signatures.architect = sig as SignatureData;
        }
      });
      
      return signatures;
    },
    enabled: !!payApplicationId,
  });
}
