import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/Subcontractor dashboard/contexts/AuthContext";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type LienWaiverType = Database["public"]["Enums"]["lien_waiver_type"];
type LienWaiverStatus = Database["public"]["Enums"]["lien_waiver_status"];

export interface LienWaiver {
  id: string;
  project_id: string;
  subcontractor_id: string | null;
  pay_application_id: string | null;
  waiver_type: LienWaiverType;
  status: LienWaiverStatus;
  amount: number;
  through_date: string | null;
  document_path: string | null;
  document_name: string | null;
  requested_by: string | null;
  requested_at: string | null;
  received_at: string | null;
  approved_by: string | null;
  approved_at: string | null;
  is_notarized: boolean;
  notary_name: string | null;
  notarized_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  subcontractor?: {
    company_name: string;
    trade: string;
  };
}

export const WAIVER_TYPE_LABELS: Record<LienWaiverType, string> = {
  conditional_partial: "Conditional Partial",
  unconditional_partial: "Unconditional Partial",
  conditional_final: "Conditional Final",
  unconditional_final: "Unconditional Final",
};

export const WAIVER_STATUS_LABELS: Record<LienWaiverStatus, string> = {
  draft: "Draft",
  requested: "Requested",
  received: "Received",
  approved: "Approved",
  rejected: "Rejected",
};

export function useLienWaivers(projectId?: string) {
  return useQuery({
    queryKey: ["lien-waivers", projectId],
    queryFn: async () => {
      let query = supabase
        .from("lien_waivers")
        .select(`
          *,
          subcontractor:subcontractors(company_name, trade)
        `)
        .order("created_at", { ascending: false });

      if (projectId) {
        query = query.eq("project_id", projectId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as LienWaiver[];
    },
    enabled: projectId ? !!projectId : true,
  });
}

export function useCreateLienWaiver() {
  const queryClient = useQueryClient();
  const { profile } = useAuth();

  return useMutation({
    mutationFn: async (params: {
      project_id: string;
      subcontractor_id?: string;
      waiver_type: LienWaiverType;
      amount: number;
      through_date?: string;
      notes?: string;
    }) => {
      if (!profile?.id) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("lien_waivers")
        .insert({
          project_id: params.project_id,
          subcontractor_id: params.subcontractor_id || null,
          waiver_type: params.waiver_type,
          amount: params.amount,
          through_date: params.through_date || null,
          notes: params.notes || null,
          status: "draft",
          requested_by: profile.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["lien-waivers"] });
      queryClient.invalidateQueries({ queryKey: ["lien-waivers", variables.project_id] });
      toast.success("Lien waiver created");
    },
    onError: (error: Error) => {
      toast.error(`Failed to create lien waiver: ${error.message}`);
    },
  });
}

export function useUpdateLienWaiver() {
  const queryClient = useQueryClient();
  const { profile } = useAuth();

  return useMutation({
    mutationFn: async (params: {
      id: string;
      project_id: string;
      status?: LienWaiverStatus;
      received_at?: string;
      document_path?: string;
      document_name?: string;
      is_notarized?: boolean;
      notary_name?: string;
      notarized_at?: string;
      notes?: string;
    }) => {
      const { id, project_id, ...updates } = params;

      // If approving, set approved_by and approved_at
      if (updates.status === "approved" && profile?.id) {
        (updates as any).approved_by = profile.id;
        (updates as any).approved_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from("lien_waivers")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return { ...data, project_id };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["lien-waivers"] });
      queryClient.invalidateQueries({ queryKey: ["lien-waivers", data.project_id] });
      toast.success("Lien waiver updated");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update lien waiver: ${error.message}`);
    },
  });
}

export function useDeleteLienWaiver() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { id: string; projectId: string }) => {
      const { error } = await supabase
        .from("lien_waivers")
        .delete()
        .eq("id", params.id);

      if (error) throw error;
      return params;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["lien-waivers"] });
      queryClient.invalidateQueries({ queryKey: ["lien-waivers", data.projectId] });
      toast.success("Lien waiver deleted");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete lien waiver: ${error.message}`);
    },
  });
}

export function useLienWaiverSummary(projectId?: string) {
  return useQuery({
    queryKey: ["lien-waiver-summary", projectId],
    queryFn: async () => {
      let query = supabase
        .from("lien_waivers")
        .select("status, amount");

      if (projectId) {
        query = query.eq("project_id", projectId);
      }

      const { data, error } = await query;
      if (error) throw error;

      const total = data?.length || 0;
      const pending = data?.filter((w) => w.status === "requested" || w.status === "draft").length || 0;
      const received = data?.filter((w) => w.status === "received").length || 0;
      const approved = data?.filter((w) => w.status === "approved").length || 0;
      const totalAmount = data?.reduce((sum, w) => sum + Number(w.amount || 0), 0) || 0;
      const approvedAmount = data?.filter((w) => w.status === "approved").reduce((sum, w) => sum + Number(w.amount || 0), 0) || 0;

      return {
        total,
        pending,
        received,
        approved,
        totalAmount,
        approvedAmount,
      };
    },
  });
}
