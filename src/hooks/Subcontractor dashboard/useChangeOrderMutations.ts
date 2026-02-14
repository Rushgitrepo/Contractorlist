import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/Subcontractor dashboard/contexts/AuthContext";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type ChangeOrderStatus = Database["public"]["Enums"]["change_order_status"];

export function useChangeOrders(projectId: string | undefined) {
  return useQuery({
    queryKey: ["project-change-orders", projectId],
    queryFn: async () => {
      if (!projectId) return [];
      const { data, error } = await supabase
        .from("change_orders")
        .select("*")
        .eq("project_id", projectId)
        .order("co_number", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!projectId,
  });
}

export function useUpdateChangeOrderStatus(projectId: string) {
  const queryClient = useQueryClient();
  const { profile } = useAuth();

  return useMutation({
    mutationFn: async ({
      changeOrderId,
      status,
    }: {
      changeOrderId: string;
      status: ChangeOrderStatus;
    }) => {
      const updateData: {
        status: ChangeOrderStatus;
        approved_by?: string | null;
        approved_at?: string | null;
      } = {
        status,
      };

      // Track who approved/rejected and when
      if (status === "approved" || status === "rejected") {
        updateData.approved_by = profile?.id || null;
        updateData.approved_at = new Date().toISOString();
      } else if (status === "void") {
        updateData.approved_by = profile?.id || null;
        updateData.approved_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from("change_orders")
        .update(updateData)
        .eq("id", changeOrderId)
        .select()
        .single();

      if (error) {
        console.error("Error updating change order:", error);
        throw new Error("Failed to update change order");
      }

      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["project-change-orders", projectId] });
      const statusMessages: Record<ChangeOrderStatus, string> = {
        approved: "Change order approved",
        rejected: "Change order rejected",
        void: "Change order voided",
        pending: "Change order set to pending",
      };
      toast.success(statusMessages[variables.status]);
    },
    onError: (error: Error) => {
      console.error("Error updating change order:", error);
      toast.error(error.message || "Failed to update change order");
    },
  });
}
