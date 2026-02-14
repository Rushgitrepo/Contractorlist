import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type InsuranceType = Database["public"]["Enums"]["insurance_type"];
type COIStatus = Database["public"]["Enums"]["coi_status"];

export interface InsuranceRequirement {
  id: string;
  project_id: string;
  insurance_type: InsuranceType;
  minimum_coverage: number;
  is_required: boolean;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface CertificateOfInsurance {
  id: string;
  project_id: string;
  subcontractor_id: string | null;
  insurance_type: InsuranceType;
  carrier_name: string;
  policy_number: string | null;
  coverage_amount: number;
  effective_date: string;
  expiration_date: string;
  status: COIStatus;
  document_path: string | null;
  document_name: string | null;
  is_additional_insured: boolean | null;
  is_waiver_of_subrogation: boolean | null;
  verified_by: string | null;
  verified_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export function useInsuranceRequirements(projectId?: string) {
  return useQuery({
    queryKey: ["insurance-requirements", projectId],
    queryFn: async () => {
      let query = supabase.from("insurance_requirements").select("*");
      if (projectId) {
        query = query.eq("project_id", projectId);
      }
      const { data, error } = await query.order("insurance_type");
      if (error) throw error;
      return data as InsuranceRequirement[];
    },
    enabled: !!projectId,
  });
}

export function useCertificatesOfInsurance(projectId?: string) {
  return useQuery({
    queryKey: ["certificates-of-insurance", projectId],
    queryFn: async () => {
      let query = supabase.from("certificates_of_insurance").select("*");
      if (projectId) {
        query = query.eq("project_id", projectId);
      }
      const { data, error } = await query.order("expiration_date", { ascending: true });
      if (error) throw error;
      return data as CertificateOfInsurance[];
    },
  });
}

export function useCreateCOI() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (coi: Omit<CertificateOfInsurance, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("certificates_of_insurance")
        .insert(coi)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["certificates-of-insurance"] });
      toast.success("Certificate of Insurance added successfully");
    },
    onError: (error) => {
      toast.error("Failed to add COI: " + error.message);
    },
  });
}

export function useUpdateCOI() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<CertificateOfInsurance> & { id: string }) => {
      const { data, error } = await supabase
        .from("certificates_of_insurance")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certificates-of-insurance"] });
      toast.success("COI updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update COI: " + error.message);
    },
  });
}

export function useDeleteCOI() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("certificates_of_insurance")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certificates-of-insurance"] });
      toast.success("COI deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete COI: " + error.message);
    },
  });
}

export function useInsuranceSummary(projectId?: string) {
  return useQuery({
    queryKey: ["insurance-summary", projectId],
    queryFn: async () => {
      let query = supabase.from("certificates_of_insurance").select("status, expiration_date, coverage_amount");
      if (projectId) {
        query = query.eq("project_id", projectId);
      }
      const { data, error } = await query;
      if (error) throw error;

      const today = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(today.getDate() + 30);

      const summary = {
        total: data.length,
        active: 0,
        expiringSoon: 0,
        expired: 0,
        pending: 0,
        totalCoverage: 0,
      };

      data.forEach((coi) => {
        summary.totalCoverage += Number(coi.coverage_amount);
        const expDate = new Date(coi.expiration_date);
        
        if (expDate < today) {
          summary.expired++;
        } else if (expDate <= thirtyDaysFromNow) {
          summary.expiringSoon++;
        } else if (coi.status === "active") {
          summary.active++;
        } else if (coi.status === "pending") {
          summary.pending++;
        }
      });

      return summary;
    },
  });
}

export const INSURANCE_TYPE_LABELS: Record<InsuranceType, string> = {
  general_liability: "General Liability",
  workers_compensation: "Workers' Compensation",
  auto_liability: "Auto Liability",
  umbrella: "Umbrella/Excess",
  professional_liability: "Professional Liability",
  builders_risk: "Builder's Risk",
  pollution: "Pollution Liability",
  other: "Other",
};

export const COI_STATUS_LABELS: Record<COIStatus, string> = {
  pending: "Pending Review",
  active: "Active",
  expiring_soon: "Expiring Soon",
  expired: "Expired",
  non_compliant: "Non-Compliant",
};
