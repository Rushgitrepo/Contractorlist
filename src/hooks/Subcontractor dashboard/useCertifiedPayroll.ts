import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type PayrollStatus = Database["public"]["Enums"]["payroll_status"];

export interface CertifiedPayrollReport {
  id: string;
  project_id: string;
  subcontractor_id: string | null;
  report_number: number;
  week_ending: string;
  status: PayrollStatus;
  contractor_name: string | null;
  contractor_address: string | null;
  project_name: string | null;
  project_location: string | null;
  submitted_by: string | null;
  submitted_at: string | null;
  approved_by: string | null;
  approved_at: string | null;
  certification_statement: string | null;
  signature_data: string | null;
  signer_name: string | null;
  signer_title: string | null;
  signed_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface PayrollEmployee {
  id: string;
  payroll_report_id: string;
  project_id: string;
  employee_name: string;
  employee_id: string | null;
  work_classification: string;
  prevailing_wage_rate: number;
  fringe_rate: number;
  hours_worked_day1: number | null;
  hours_worked_day2: number | null;
  hours_worked_day3: number | null;
  hours_worked_day4: number | null;
  hours_worked_day5: number | null;
  hours_worked_day6: number | null;
  hours_worked_day7: number | null;
  total_hours: number | null;
  overtime_hours: number | null;
  gross_wages: number | null;
  deductions: number | null;
  net_wages: number | null;
  created_at: string;
  updated_at: string;
}

export function useCertifiedPayrollReports(projectId?: string) {
  return useQuery({
    queryKey: ["certified-payroll-reports", projectId],
    queryFn: async () => {
      let query = supabase.from("certified_payroll_reports").select("*");
      if (projectId) {
        query = query.eq("project_id", projectId);
      }
      const { data, error } = await query.order("week_ending", { ascending: false });
      if (error) throw error;
      return data as CertifiedPayrollReport[];
    },
  });
}

export function usePayrollEmployees(reportId: string) {
  return useQuery({
    queryKey: ["payroll-employees", reportId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payroll_employees")
        .select("*")
        .eq("payroll_report_id", reportId)
        .order("employee_name");
      if (error) throw error;
      return data as PayrollEmployee[];
    },
    enabled: !!reportId,
  });
}

export function useCreatePayrollReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (report: Omit<CertifiedPayrollReport, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("certified_payroll_reports")
        .insert(report)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certified-payroll-reports"] });
      toast.success("Payroll report created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create payroll report: " + error.message);
    },
  });
}

export function useUpdatePayrollReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<CertifiedPayrollReport> & { id: string }) => {
      const { data, error } = await supabase
        .from("certified_payroll_reports")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certified-payroll-reports"] });
      toast.success("Payroll report updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update payroll report: " + error.message);
    },
  });
}

export function useDeletePayrollReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("certified_payroll_reports")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certified-payroll-reports"] });
      toast.success("Payroll report deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete payroll report: " + error.message);
    },
  });
}

export function useCreatePayrollEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (employee: Omit<PayrollEmployee, "id" | "created_at" | "updated_at" | "total_hours">) => {
      const { data, error } = await supabase
        .from("payroll_employees")
        .insert(employee)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["payroll-employees", data.payroll_report_id] });
      toast.success("Employee added to payroll");
    },
    onError: (error) => {
      toast.error("Failed to add employee: " + error.message);
    },
  });
}

export function useUpdatePayrollEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<PayrollEmployee> & { id: string; payroll_report_id: string }) => {
      const { data, error } = await supabase
        .from("payroll_employees")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return { ...data, payroll_report_id: updates.payroll_report_id };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["payroll-employees", data.payroll_report_id] });
      toast.success("Employee updated");
    },
    onError: (error) => {
      toast.error("Failed to update employee: " + error.message);
    },
  });
}

export function useDeletePayrollEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, reportId }: { id: string; reportId: string }) => {
      const { error } = await supabase
        .from("payroll_employees")
        .delete()
        .eq("id", id);
      if (error) throw error;
      return { reportId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["payroll-employees", data.reportId] });
      toast.success("Employee removed from payroll");
    },
    onError: (error) => {
      toast.error("Failed to remove employee: " + error.message);
    },
  });
}

export function usePayrollSummary(projectId?: string) {
  return useQuery({
    queryKey: ["payroll-summary", projectId],
    queryFn: async () => {
      let query = supabase.from("certified_payroll_reports").select("status, week_ending");
      if (projectId) {
        query = query.eq("project_id", projectId);
      }
      const { data, error } = await query;
      if (error) throw error;

      const summary = {
        total: data.length,
        draft: 0,
        submitted: 0,
        approved: 0,
        rejected: 0,
      };

      data.forEach((report) => {
        if (report.status === "draft") summary.draft++;
        else if (report.status === "submitted") summary.submitted++;
        else if (report.status === "approved") summary.approved++;
        else if (report.status === "rejected") summary.rejected++;
      });

      return summary;
    },
  });
}

export const PAYROLL_STATUS_LABELS: Record<PayrollStatus, string> = {
  draft: "Draft",
  submitted: "Submitted",
  approved: "Approved",
  rejected: "Rejected",
};
