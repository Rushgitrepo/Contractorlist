import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/Subcontractor dashboard/use-toast";

export interface BudgetItem {
  id: string;
  project_id: string;
  item_number: string;
  description: string;
  scheduled_value: number;
  work_completed_previous: number;
  work_completed_current: number;
  materials_stored: number;
  retainage_percent: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface PayApplication {
  id: string;
  project_id: string;
  application_number: number;
  period_from: string;
  period_to: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'paid';
  original_contract: number;
  change_orders_total: number;
  contract_to_date: number;
  total_completed: number;
  retainage_amount: number;
  total_earned_less_retainage: number;
  less_previous_certificates: number;
  current_payment_due: number;
  notes: string | null;
  submitted_at: string | null;
  submitted_by: string | null;
  approved_at: string | null;
  approved_by: string | null;
  created_at: string;
  updated_at: string;
  // Extended fields
  architect_name?: string | null;
  architect_project_number?: string | null;
  owner_name?: string | null;
  contract_date?: string | null;
  application_date?: string | null;
  retainage_released?: number;
}

export function useBudgetItems(projectId: string | undefined) {
  return useQuery({
    queryKey: ["budget-items", projectId],
    queryFn: async () => {
      if (!projectId) return [];
      const { data, error } = await supabase
        .from("budget_items")
        .select("*")
        .eq("project_id", projectId)
        .order("sort_order", { ascending: true });
      
      if (error) throw error;
      return data as BudgetItem[];
    },
    enabled: !!projectId,
  });
}

export function usePayApplications(projectId: string | undefined) {
  return useQuery({
    queryKey: ["pay-applications", projectId],
    queryFn: async () => {
      if (!projectId) return [];
      const { data, error } = await supabase
        .from("pay_applications")
        .select("*")
        .eq("project_id", projectId)
        .order("application_number", { ascending: false });
      
      if (error) throw error;
      return data as PayApplication[];
    },
    enabled: !!projectId,
  });
}

export function useBudgetMutations(projectId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createBudgetItem = useMutation({
    mutationFn: async (item: Omit<BudgetItem, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from("budget_items")
        .insert(item)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget-items", projectId] });
      toast({ title: "Budget item added" });
    },
    onError: (error) => {
      toast({ title: "Error adding budget item", description: error.message, variant: "destructive" });
    },
  });

  const updateBudgetItem = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<BudgetItem> & { id: string }) => {
      const { data, error } = await supabase
        .from("budget_items")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget-items", projectId] });
      toast({ title: "Budget item updated" });
    },
    onError: (error) => {
      toast({ title: "Error updating budget item", description: error.message, variant: "destructive" });
    },
  });

  const deleteBudgetItem = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("budget_items")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget-items", projectId] });
      toast({ title: "Budget item deleted" });
    },
    onError: (error) => {
      toast({ title: "Error deleting budget item", description: error.message, variant: "destructive" });
    },
  });

  const createPayApplication = useMutation({
    mutationFn: async (app: Omit<PayApplication, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from("pay_applications")
        .insert(app)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pay-applications", projectId] });
      toast({ title: "Pay application created" });
    },
    onError: (error) => {
      toast({ title: "Error creating pay application", description: error.message, variant: "destructive" });
    },
  });

  const updatePayApplication = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<PayApplication> & { id: string }) => {
      const { data, error } = await supabase
        .from("pay_applications")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pay-applications", projectId] });
      toast({ title: "Pay application updated" });
    },
    onError: (error) => {
      toast({ title: "Error updating pay application", description: error.message, variant: "destructive" });
    },
  });

  return {
    createBudgetItem,
    updateBudgetItem,
    deleteBudgetItem,
    createPayApplication,
    updatePayApplication,
  };
}
