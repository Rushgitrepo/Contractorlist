import { useState, useEffect } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { useProject } from "@/hooks/Subcontractor dashboard/useProjectDetail";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Subcontractor dashboard/ui/tabs";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Loader2,
  LayoutDashboard,
  FileQuestion,
  FileText,
  Users,
  ClipboardList,
  CalendarDays,
  FolderOpen,
  Map,
  DollarSign,
  PenLine
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import ProjectDashboardTab from "@/components/Subcontractor dashboard/project/ProjectDashboardTab";
import ProjectRFIsTab from "@/components/Subcontractor dashboard/project/ProjectRFIsTab";
import ProjectChangeOrdersTab from "@/components/Subcontractor dashboard/project/ProjectChangeOrdersTab";
import ProjectTeamTab from "@/components/Subcontractor dashboard/project/ProjectTeamTab";
import ProjectDailyLogsTab from "@/components/Subcontractor dashboard/project/ProjectDailyLogsTab";
import ProjectScheduleTab from "@/components/Subcontractor dashboard/project/ProjectScheduleTab";
import ProjectDocumentsTab from "@/components/Subcontractor dashboard/project/ProjectDocumentsTab";
import ProjectPlansTab from "@/components/Subcontractor dashboard/project/ProjectPlansTab";
import ProjectBudgetTab from "@/components/Subcontractor dashboard/project/ProjectBudgetTab";
import ProjectSignaturesTab from "@/components/Subcontractor dashboard/project/ProjectSignaturesTab";
import type { Database } from "@/integrations/supabase/types";

type ProjectStatus = Database["public"]["Enums"]["project_status"];

const statusStyles: Record<ProjectStatus, { bg: string; text: string }> = {
  "in-progress": { bg: "bg-info/20", text: "text-info" },
  planning: { bg: "bg-warning/20", text: "text-warning" },
  "on-hold": { bg: "bg-destructive/20", text: "text-destructive" },
  completed: { bg: "bg-primary/20", text: "text-primary-foreground" },
};

const statusLabels: Record<ProjectStatus, string> = {
  "in-progress": "Active",
  planning: "Planning",
  "on-hold": "On Hold",
  completed: "Completed",
};

const VALID_TABS = ["dashboard", "plans", "rfis", "change-orders", "schedule", "team", "daily-logs", "documents", "budget", "signatures"];

export default function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: project, isLoading, error } = useProject(projectId);

  // Get tab from URL or default to dashboard
  const tabFromUrl = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(() =>
    tabFromUrl && VALID_TABS.includes(tabFromUrl) ? tabFromUrl : "dashboard"
  );

  // Sync tab state with URL
  useEffect(() => {
    if (tabFromUrl && VALID_TABS.includes(tabFromUrl) && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchParams({ tab: value }, { replace: true });
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="p-6">
        <div className="stat-card p-8 text-center">
          <p className="text-destructive mb-4">Project not found or access denied.</p>
          <Link to="/subcontractor-dashboard/projects" className="text-primary hover:underline">
            ← Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const budgetUtilization = Number(project.budget_total) > 0
    ? (Number(project.budget_spent) / Number(project.budget_total)) * 100
    : 0;

  return (
    <div className="p-6 animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/subcontractor-dashboard/projects"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>

        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-foreground">{project.name}</h1>
              <span className={cn(
                "text-[10px] font-semibold px-2 py-1 rounded uppercase",
                statusStyles[project.status].bg,
                statusStyles[project.status].text
              )}>
                {statusLabels[project.status]}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {project.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {project.location}
                </span>
              )}
              {project.start_date && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {format(new Date(project.start_date), "MMM d, yyyy")}
                  {project.end_date && ` - ${format(new Date(project.end_date), "MMM d, yyyy")}`}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="stat-card p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Progress</p>
          <div className="flex items-end gap-2">
            <p className="text-2xl font-bold">{project.percent_complete}%</p>
          </div>
          <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${project.percent_complete}%` }}
            />
          </div>
        </div>

        <div className="stat-card p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total Budget</p>
          <p className="text-2xl font-bold">
            ${Number(project.budget_total).toLocaleString()}
          </p>
        </div>

        <div className="stat-card p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Spent</p>
          <p className="text-2xl font-bold">
            ${Number(project.budget_spent).toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {budgetUtilization.toFixed(1)}% of budget
          </p>
        </div>

        <div className="stat-card p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Remaining</p>
          <p className="text-2xl font-bold text-success">
            ${(Number(project.budget_total) - Number(project.budget_spent)).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Tabbed Content */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList className="bg-card border-b border-border rounded-none h-auto p-0 gap-0 flex-wrap justify-start">
          <TabsTrigger
            value="dashboard"
            className="gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3"
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger
            value="plans"
            className="gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3"
          >
            <Map className="w-4 h-4" />
            Plans
          </TabsTrigger>
          <TabsTrigger
            value="rfis"
            className="gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3"
          >
            <FileQuestion className="w-4 h-4" />
            RFIs
          </TabsTrigger>
          <TabsTrigger
            value="change-orders"
            className="gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3"
          >
            <FileText className="w-4 h-4" />
            Change Orders
          </TabsTrigger>
          <TabsTrigger
            value="schedule"
            className="gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3"
          >
            <CalendarDays className="w-4 h-4" />
            Schedule
          </TabsTrigger>
          <TabsTrigger
            value="team"
            className="gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3"
          >
            <Users className="w-4 h-4" />
            Team
          </TabsTrigger>
          <TabsTrigger
            value="daily-logs"
            className="gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3"
          >
            <ClipboardList className="w-4 h-4" />
            Daily Logs
          </TabsTrigger>
          <TabsTrigger
            value="documents"
            className="gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3"
          >
            <FolderOpen className="w-4 h-4" />
            Documents
          </TabsTrigger>
          <TabsTrigger
            value="budget"
            className="gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3"
          >
            <DollarSign className="w-4 h-4" />
            Budget
          </TabsTrigger>
          <TabsTrigger
            value="signatures"
            className="gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3"
          >
            <PenLine className="w-4 h-4" />
            Signatures
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <ProjectDashboardTab project={project} onTabChange={handleTabChange} />
        </TabsContent>

        <TabsContent value="plans">
          <ProjectPlansTab projectId={project.id} />
        </TabsContent>

        <TabsContent value="rfis">
          <ProjectRFIsTab projectId={project.id} />
        </TabsContent>

        <TabsContent value="change-orders">
          <ProjectChangeOrdersTab
            projectId={project.id}
            projectName={project.name}
            projectLocation={project.location || ""}
            originalContract={Number(project.budget_total) || 0}
          />
        </TabsContent>

        <TabsContent value="schedule">
          <ProjectScheduleTab projectId={project.id} />
        </TabsContent>

        <TabsContent value="team">
          <ProjectTeamTab projectId={project.id} />
        </TabsContent>

        <TabsContent value="daily-logs">
          <ProjectDailyLogsTab projectId={project.id} />
        </TabsContent>

        <TabsContent value="documents">
          <ProjectDocumentsTab projectId={project.id} />
        </TabsContent>

        <TabsContent value="budget">
          <ProjectBudgetTab
            projectId={project.id}
            projectName={project.name}
            projectLocation={project.location || ""}
            originalContract={Number(project.budget_total)}
          />
        </TabsContent>

        <TabsContent value="signatures">
          <ProjectSignaturesTab
            projectId={project.id}
            projectName={project.name}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
