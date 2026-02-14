import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/Subcontractor dashboard/contexts/AuthContext";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type RFIStatus = Database["public"]["Enums"]["rfi_status"];

export function useUpdateRFI(projectId: string) {
  const queryClient = useQueryClient();
  const { profile } = useAuth();

  return useMutation({
    mutationFn: async ({
      rfiId,
      status,
      response,
    }: {
      rfiId: string;
      status: RFIStatus;
      response?: string;
    }) => {
      const updateData: {
        status: RFIStatus;
        response?: string | null;
        responded_by?: string;
        responded_at?: string;
      } = {
        status,
      };

      // If there's a response being added/updated, track who responded
      if (response !== undefined) {
        updateData.response = response || null;
        if (response && profile?.id) {
          updateData.responded_by = profile.id;
          updateData.responded_at = new Date().toISOString();
        }
      }

      const { data, error } = await supabase
        .from("rfis")
        .update(updateData)
        .eq("id", rfiId)
        .select()
        .single();

      if (error) {
        console.error("Error updating RFI:", error);
        throw new Error("Failed to update RFI");
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-rfis", projectId] });
      toast.success("RFI updated successfully");
    },
    onError: (error: Error) => {
      console.error("Error updating RFI:", error);
      toast.error(error.message || "Failed to update RFI");
    },
  });
}
