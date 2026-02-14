import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/Subcontractor dashboard/contexts/AuthContext";
import StatCard from "@/components/Subcontractor dashboard/StatCard";
import { cn } from "@/lib/utils";
import {
  FolderKanban,
  DollarSign,
  FileText,
  ShieldCheck,
  Clock,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Calendar,
  MessageSquare,
  ArrowLeftRight,
  ClipboardList,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { format, isAfter, isBefore, addDays } from "date-fns";

const statusColor: Record<string, { bg: string; text: string }> = {
  "in-progress": { bg: "bg-info/20", text: "text-info" }, // Now a decent navy/slate from theme
  planning: { bg: "bg-warning/20", text: "text-warning" },
  "on-hold": { bg: "bg-destructive/20", text: "text-destructive" },
  completed: { bg: "bg-primary/20", text: "text-primary-foreground" }, // Brand yellow for completion
};

const statusLabel: Record<string, string> = {
  "in-progress": "In Progress",
  planning: "Planning",
  "on-hold": "On Hold",
  completed: "Completed",
};

export default function DashboardPage() {
  const { profile } = useAuth();

  // Fetch all projects
  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ["dashboard-projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch open RFIs count
  const { data: rfiData } = useQuery({
    queryKey: ["dashboard-rfis"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rfis")
        .select("id, status, due_date, title, project_id, created_at")
        .in("status", ["draft", "open"]);
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch pending change orders
  const { data: changeOrders } = useQuery({
    queryKey: ["dashboard-change-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("change_orders")
        .select("id, title, status, amount, project_id, created_at")
        .eq("status", "pending");
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch upcoming milestones (next 14 days)
  const { data: upcomingMilestones = [] } = useQuery({
    queryKey: ["dashboard-milestones"],
    queryFn: async () => {
      const today = new Date();
      const twoWeeksLater = addDays(today, 14);

      const { data, error } = await supabase
        .from("milestones")
        .select("id, name, end_date, project_id, progress")
        .gte("end_date", format(today, "yyyy-MM-dd"))
        .lte("end_date", format(twoWeeksLater, "yyyy-MM-dd"))
        .order("end_date", { ascending: true })
        .limit(5);
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch recent daily logs
  const { data: recentLogs = [] } = useQuery({
    queryKey: ["dashboard-logs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("daily_logs")
        .select("id, log_date, workers_onsite, man_hours, project_id")
        .order("log_date", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch pay applications for financial summary
  const { data: payApps = [] } = useQuery({
    queryKey: ["dashboard-pay-apps"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pay_applications")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch budget items for total contract value
  const { data: budgetItems = [] } = useQuery({
    queryKey: ["dashboard-budget-items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("budget_items")
        .select("scheduled_value, work_completed_current, work_completed_previous, materials_stored");
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch safety incidents
  const { data: safetyIncidents = [] } = useQuery({
    queryKey: ["dashboard-safety"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("safety_incidents")
        .select("id, status")
        .eq("status", "reported");
      if (error) throw error;
      return data || [];
    },
  });

  // Calculate KPIs
  const activeProjects = projects.filter((p) => p.status !== "completed").length;
  const totalContractValue = budgetItems.reduce((sum, item) => sum + Number(item.scheduled_value || 0), 0);
  const openRFIs = rfiData?.length || 0;
  const overdueRFIs = rfiData?.filter(rfi =>
    rfi.due_date && isBefore(new Date(rfi.due_date), new Date())
  ).length || 0;

  // Calculate financial summary from pay apps
  const latestPayApp = payApps[0];
  const totalBilled = payApps.reduce((sum, pa) => sum + Number(pa.total_completed || 0), 0);
  const totalPaid = payApps.filter(pa => pa.status === "paid").reduce((sum, pa) => sum + Number(pa.current_payment_due || 0), 0);
  const totalRetainage = payApps.reduce((sum, pa) => sum + Number(pa.retainage_amount || 0), 0);

  // Build recent activity from real data
  const recentActivity = [
    ...rfiData?.slice(0, 2).map(rfi => ({
      type: "rfi",
      title: `RFI #${rfi.id.slice(0, 4)} - ${rfi.title?.slice(0, 30) || "New RFI"}`,
      projectId: rfi.project_id,
      time: format(new Date(rfi.created_at), "MMM d"),
      icon: MessageSquare,
    })) || [],
    ...changeOrders?.slice(0, 2).map(co => ({
      type: "change",
      title: `CO pending: ${co.title?.slice(0, 25) || "Change Order"}`,
      projectId: co.project_id,
      time: format(new Date(co.created_at), "MMM d"),
      icon: ArrowLeftRight,
    })) || [],
    ...recentLogs.slice(0, 2).map(log => ({
      type: "log",
      title: `Daily log: ${log.workers_onsite || 0} workers, ${log.man_hours || 0}hrs`,
      projectId: log.project_id,
      time: format(new Date(log.log_date), "MMM d"),
      icon: ClipboardList,
    })),
  ].slice(0, 5);

  // Map project IDs to names
  const projectMap = new Map(projects.map(p => [p.id, p.name]));

  if (projectsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-6 animate-fade-in">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Welcome back{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}. Here's an overview of your portfolio.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Active Projects"
          value={activeProjects}
          subtitle={`${projects.length} total in portfolio`}
          icon={<FolderKanban className="w-5 h-5" />}
          variant="primary"
        />
        <StatCard
          title="Total Contract Value"
          value={totalContractValue > 0 ? `$${(totalContractValue / 1_000_000).toFixed(1)}M` : "$0"}
          subtitle="Schedule of values"
          icon={<DollarSign className="w-5 h-5" />}
        />
        <StatCard
          title="Open RFIs"
          value={openRFIs}
          subtitle={overdueRFIs > 0 ? `${overdueRFIs} overdue` : "Requiring response"}
          icon={<FileText className="w-5 h-5" />}
          variant={overdueRFIs > 0 ? "warning" : "default"}
        />
        <StatCard
          title="Pending COs"
          value={changeOrders?.length || 0}
          subtitle={`$${((changeOrders?.reduce((s, co) => s + Number(co.amount || 0), 0) || 0) / 1000).toFixed(0)}K pending`}
          icon={<ArrowLeftRight className="w-5 h-5" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projects List */}
        <div className="lg:col-span-2 stat-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">Active Projects</h2>
            <Link to="/subcontractor-dashboard/projects" className="text-xs text-primary dark:text-yellow-400 font-medium flex items-center gap-1 hover:underline">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {projects.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <FolderKanban className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No projects yet</p>
              <p className="text-sm">Create your first project to get started</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {projects.slice(0, 4).map((project) => (
                <Link
                  key={project.id}
                  to={`/subcontractor-dashboard/projects/${project.id}`}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn(
                        "text-[10px] font-semibold px-2 py-0.5 rounded uppercase",
                        statusColor[project.status]?.bg || "bg-muted",
                        statusColor[project.status]?.text || "text-muted-foreground"
                      )}>
                        {statusLabel[project.status] || project.status}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-foreground truncate">{project.name}</p>
                    <p className="text-xs text-muted-foreground">{project.location || project.address || "No location"}</p>
                  </div>
                  <div className="flex items-center gap-6 text-right">
                    <div className="hidden md:block">
                      <p className="text-xs text-muted-foreground">Budget</p>
                      <p className="text-sm font-semibold text-foreground">
                        ${(Number(project.budget_total || 0) / 1e6).toFixed(1)}M
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Progress</p>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full bg-primary transition-all"
                            style={{ width: `${project.percent_complete || 0}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-foreground w-8">
                          {project.percent_complete || 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <div className="stat-card">
            <div className="px-5 py-4 border-b border-border">
              <h2 className="text-sm font-semibold text-foreground">Recent Activity</h2>
            </div>
            {recentActivity.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground text-sm">
                No recent activity
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {recentActivity.map((activity, i) => (
                  <div key={i} className="flex items-start gap-3 px-5 py-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <activity.icon className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground truncate">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {projectMap.get(activity.projectId) || "Project"} · {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Milestones */}
          <div className="stat-card">
            <div className="px-5 py-4 border-b border-border flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold text-foreground">Upcoming Milestones</h2>
            </div>
            {upcomingMilestones.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground text-sm">
                No upcoming milestones
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {upcomingMilestones.map((milestone) => {
                  const daysUntil = Math.ceil(
                    (new Date(milestone.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                  );
                  return (
                    <div key={milestone.id} className="flex items-start gap-3 px-5 py-3">
                      <div className={cn(
                        "w-2 h-2 rounded-full mt-1.5 shrink-0",
                        daysUntil <= 3 ? "bg-destructive" :
                          daysUntil <= 7 ? "bg-warning" : "bg-muted-foreground"
                      )} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground truncate">{milestone.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {projectMap.get(milestone.project_id) || "Project"}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {format(new Date(milestone.end_date), "MMM d")}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Financial Summary */}
      {latestPayApp && (
        <div className="mt-6 stat-card">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">
              Financial Summary — {projectMap.get(latestPayApp.project_id) || "Latest Project"}
            </h2>
            <Link to="/subcontractor-dashboard/financials" className="text-xs text-primary dark:text-yellow-400 font-medium flex items-center gap-1 hover:underline">
              View details <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
              {[
                { label: "Original Contract", value: `$${(Number(latestPayApp.original_contract || 0) / 1e6).toFixed(2)}M` },
                { label: "Change Orders", value: `$${(Number(latestPayApp.change_orders_total || 0) / 1e3).toFixed(0)}K` },
                { label: "Contract to Date", value: `$${(Number(latestPayApp.contract_to_date || 0) / 1e6).toFixed(2)}M` },
                { label: "Total Completed", value: `$${(Number(latestPayApp.total_completed || 0) / 1e6).toFixed(2)}M` },
                { label: "Payment Due", value: `$${(Number(latestPayApp.current_payment_due || 0) / 1e6).toFixed(2)}M` },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{item.label}</p>
                  <p className="text-lg font-bold text-foreground">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                <span>Budget Utilization</span>
                <span>
                  {latestPayApp.contract_to_date > 0
                    ? `${((Number(latestPayApp.total_completed) / Number(latestPayApp.contract_to_date)) * 100).toFixed(0)}%`
                    : "0%"} completed
                </span>
              </div>
              <div className="h-3 rounded-full bg-muted overflow-hidden flex">
                <div
                  className="h-full bg-success"
                  style={{
                    width: `${latestPayApp.contract_to_date > 0
                      ? ((Number(latestPayApp.total_earned_less_retainage) / Number(latestPayApp.contract_to_date)) * 100)
                      : 0}%`
                  }}
                />
                <div
                  className="h-full bg-warning"
                  style={{
                    width: `${latestPayApp.contract_to_date > 0
                      ? ((Number(latestPayApp.retainage_amount) / Number(latestPayApp.contract_to_date)) * 100)
                      : 0}%`
                  }}
                />
              </div>
              <div className="flex items-center gap-6 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-success" /> Earned Less Retainage
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-warning" /> Retainage
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-muted" /> Remaining
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty state for financial summary */}
      {!latestPayApp && projects.length > 0 && (
        <div className="mt-6 stat-card p-8 text-center text-muted-foreground">
          <DollarSign className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No pay applications yet</p>
          <p className="text-sm">Create a pay application in a project to see financial summary</p>
        </div>
      )}
    </div>
  );
}
