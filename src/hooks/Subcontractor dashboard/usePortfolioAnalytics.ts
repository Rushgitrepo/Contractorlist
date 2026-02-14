import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/Subcontractor dashboard/contexts/AuthContext";

export interface ProjectSummary {
  id: string;
  name: string;
  status: string;
  budget_total: number;
  budget_spent: number;
  percent_complete: number;
  start_date: string | null;
  end_date: string | null;
}

export interface PayAppSummary {
  project_id: string;
  project_name: string;
  application_number: number;
  period_to: string;
  status: string;
  total_completed: number;
  current_payment_due: number;
  retainage_amount: number;
}

export interface PortfolioMetrics {
  totalProjects: number;
  activeProjects: number;
  totalContractValue: number;
  totalBilled: number;
  totalPaid: number;
  totalRetainage: number;
  avgCompletion: number;
  projectsByStatus: { status: string; count: number }[];
  billingByMonth: { month: string; billed: number; paid: number }[];
  projectsProgress: { name: string; completion: number; budget: number }[];
}

export function usePortfolioAnalytics() {
  const { profile } = useAuth();

  return useQuery({
    queryKey: ["portfolio-analytics", profile?.id],
    queryFn: async (): Promise<PortfolioMetrics> => {
      if (!profile?.id) throw new Error("No profile");

      // Fetch all projects
      const { data: projects, error: projectsError } = await supabase
        .from("projects")
        .select("id, name, status, budget_total, budget_spent, percent_complete, start_date, end_date");

      if (projectsError) throw projectsError;

      // Fetch all pay applications across projects
      const { data: payApps, error: payAppsError } = await supabase
        .from("pay_applications")
        .select(`
          id,
          project_id,
          application_number,
          period_to,
          status,
          total_completed,
          current_payment_due,
          retainage_amount,
          approved_at
        `)
        .in("status", ["submitted", "approved", "paid"]);

      if (payAppsError) throw payAppsError;

      // Calculate metrics
      const totalProjects = projects?.length || 0;
      const activeProjects = projects?.filter(p => p.status === "in-progress").length || 0;
      const totalContractValue = projects?.reduce((sum, p) => sum + Number(p.budget_total || 0), 0) || 0;

      const totalBilled = payApps?.reduce((sum, pa) => sum + Number(pa.current_payment_due || 0), 0) || 0;
      const totalPaid = payApps?.filter(pa => pa.status === "paid").reduce((sum, pa) => sum + Number(pa.current_payment_due || 0), 0) || 0;
      const totalRetainage = payApps?.reduce((sum, pa) => sum + Number(pa.retainage_amount || 0), 0) || 0;

      const avgCompletion = totalProjects > 0 
        ? (projects?.reduce((sum, p) => sum + (p.percent_complete || 0), 0) || 0) / totalProjects 
        : 0;

      // Projects by status
      const statusCounts: Record<string, number> = {};
      projects?.forEach(p => {
        statusCounts[p.status] = (statusCounts[p.status] || 0) + 1;
      });
      const projectsByStatus = Object.entries(statusCounts).map(([status, count]) => ({ status, count }));

      // Billing by month (last 12 months)
      const monthlyBilling: Record<string, { billed: number; paid: number }> = {};
      payApps?.forEach(pa => {
        const month = new Date(pa.period_to).toISOString().slice(0, 7); // YYYY-MM
        if (!monthlyBilling[month]) {
          monthlyBilling[month] = { billed: 0, paid: 0 };
        }
        monthlyBilling[month].billed += Number(pa.current_payment_due || 0);
        if (pa.status === "paid") {
          monthlyBilling[month].paid += Number(pa.current_payment_due || 0);
        }
      });

      const billingByMonth = Object.entries(monthlyBilling)
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-12)
        .map(([month, data]) => ({
          month: new Date(month + "-01").toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
          ...data,
        }));

      // Projects progress (top 10 by budget)
      const projectsProgress = (projects || [])
        .sort((a, b) => Number(b.budget_total || 0) - Number(a.budget_total || 0))
        .slice(0, 10)
        .map(p => ({
          name: p.name.length > 20 ? p.name.slice(0, 20) + "..." : p.name,
          completion: p.percent_complete || 0,
          budget: Number(p.budget_total || 0),
        }));

      return {
        totalProjects,
        activeProjects,
        totalContractValue,
        totalBilled,
        totalPaid,
        totalRetainage,
        avgCompletion,
        projectsByStatus,
        billingByMonth,
        projectsProgress,
      };
    },
    enabled: !!profile?.id,
  });
}

export function useRecentPayApplications() {
  const { profile } = useAuth();

  return useQuery({
    queryKey: ["recent-pay-applications", profile?.id],
    queryFn: async () => {
      if (!profile?.id) return [];

      const { data, error } = await supabase
        .from("pay_applications")
        .select(`
          id,
          project_id,
          application_number,
          period_to,
          status,
          current_payment_due,
          submitted_at,
          approved_at,
          projects!inner(name)
        `)
        .order("updated_at", { ascending: false })
        .limit(10);

      if (error) throw error;

      return data?.map(pa => ({
        ...pa,
        project_name: (pa.projects as any)?.name || "Unknown",
      })) || [];
    },
    enabled: !!profile?.id,
  });
}

export function useProjectHealthScores() {
  const { profile } = useAuth();

  return useQuery({
    queryKey: ["project-health-scores", profile?.id],
    queryFn: async () => {
      if (!profile?.id) return [];

      // Get projects with their metrics
      const { data: projects, error } = await supabase
        .from("projects")
        .select(`
          id,
          name,
          status,
          budget_total,
          budget_spent,
          percent_complete,
          start_date,
          end_date
        `)
        .eq("status", "in-progress");

      if (error) throw error;

      // Calculate health score for each project
      return (projects || []).map(p => {
        const budgetHealth = Number(p.budget_total) > 0 
          ? Math.max(0, 100 - ((Number(p.budget_spent) / Number(p.budget_total)) * 100 - (p.percent_complete || 0)))
          : 100;
        
        // Schedule health based on expected vs actual progress
        let scheduleHealth = 100;
        if (p.start_date && p.end_date) {
          const start = new Date(p.start_date).getTime();
          const end = new Date(p.end_date).getTime();
          const now = Date.now();
          const expectedProgress = Math.min(100, ((now - start) / (end - start)) * 100);
          const actualProgress = p.percent_complete || 0;
          scheduleHealth = Math.max(0, 100 - (expectedProgress - actualProgress));
        }

        const overallHealth = (budgetHealth + scheduleHealth) / 2;

        return {
          id: p.id,
          name: p.name,
          budgetHealth: Math.round(budgetHealth),
          scheduleHealth: Math.round(scheduleHealth),
          overallHealth: Math.round(overallHealth),
          completion: p.percent_complete || 0,
        };
      });
    },
    enabled: !!profile?.id,
  });
}
