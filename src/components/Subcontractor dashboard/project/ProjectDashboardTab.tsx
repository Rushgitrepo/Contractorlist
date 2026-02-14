import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  useProjectRFIs, 
  useProjectChangeOrders, 
  useProjectMembers, 
  useProjectDailyLogs 
} from "@/hooks/Subcontractor dashboard/useProjectDetail";
import { useMilestones } from "@/hooks/Subcontractor dashboard/useMilestones";
import { cn } from "@/lib/utils";
import { format, formatDistanceToNow } from "date-fns";
import {
  FileQuestion,
  FileText,
  Users,
  CalendarDays,
  ClipboardList,
  Plus,
  ArrowRight,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Activity,
} from "lucide-react";
import { Button } from "@/components/Subcontractor dashboard/ui/button";
import { Skeleton } from "@/components/Subcontractor dashboard/ui/skeleton";
import CreateRFIDialog from "./CreateRFIDialog";
import CreateChangeOrderDialog from "./CreateChangeOrderDialog";
import AddMilestoneDialog from "@/components/Subcontractor dashboard/schedule/AddMilestoneDialog";
import InviteTeamMemberDialog from "./InviteTeamMemberDialog";
import type { Database } from "@/integrations/supabase/types";

type Project = Database["public"]["Tables"]["projects"]["Row"];

interface ProjectDashboardTabProps {
  project: Project;
  onTabChange?: (tab: string) => void;
}

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: { label: string; positive: boolean };
  variant?: "default" | "success" | "warning" | "danger";
}

function StatCard({ title, value, subtitle, icon, trend, variant = "default" }: StatCardProps) {
  const variantStyles = {
    default: "",
    success: "border-l-4 border-l-success",
    warning: "border-l-4 border-l-warning",
    danger: "border-l-4 border-l-destructive",
  };

  return (
    <div className={cn("stat-card p-4", variantStyles[variant])}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
          {trend && (
            <p className={cn(
              "text-xs mt-1 font-medium",
              trend.positive ? "text-success" : "text-destructive"
            )}>
              {trend.label}
            </p>
          )}
        </div>
        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground shrink-0">
          {icon}
        </div>
      </div>
    </div>
  );
}

type ActivityType = "rfi" | "change_order" | "daily_log" | "milestone";

interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: Date;
  status?: string;
}

export default function ProjectDashboardTab({ project, onTabChange }: ProjectDashboardTabProps) {
  const { data: rfis, isLoading: rfisLoading } = useProjectRFIs(project.id);
  const { data: changeOrders, isLoading: cosLoading } = useProjectChangeOrders(project.id);
  const { data: members, isLoading: membersLoading } = useProjectMembers(project.id);
  const { data: dailyLogs, isLoading: logsLoading } = useProjectDailyLogs(project.id);
  const { data: milestones, isLoading: milestonesLoading } = useMilestones(project.id);

  const [createRFIOpen, setCreateRFIOpen] = useState(false);
  const [createCOOpen, setCreateCOOpen] = useState(false);
  const [addMilestoneOpen, setAddMilestoneOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);

  const isLoading = rfisLoading || cosLoading || membersLoading || logsLoading || milestonesLoading;

  // Calculate stats
  const openRFIs = rfis?.filter(r => r.status === "open" || r.status === "draft").length || 0;
  const answeredRFIs = rfis?.filter(r => r.status === "answered" || r.status === "closed").length || 0;
  const pendingCOs = changeOrders?.filter(co => co.status === "pending").length || 0;
  const approvedCOValue = changeOrders
    ?.filter(co => co.status === "approved")
    .reduce((sum, co) => sum + Number(co.amount), 0) || 0;
  const teamSize = members?.length || 0;
  const upcomingMilestones = milestones?.filter(m => {
    const endDate = new Date(m.end_date);
    const now = new Date();
    const twoWeeksFromNow = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
    return endDate >= now && endDate <= twoWeeksFromNow && m.progress < 100;
  }).length || 0;

  // Build recent activity feed
  const recentActivity: ActivityItem[] = [];

  rfis?.slice(0, 3).forEach(rfi => {
    recentActivity.push({
      id: `rfi-${rfi.id}`,
      type: "rfi",
      title: `RFI #${rfi.rfi_number}: ${rfi.title}`,
      description: rfi.status === "open" ? "Awaiting response" : rfi.status === "answered" ? "Response received" : rfi.status,
      timestamp: new Date(rfi.created_at),
      status: rfi.status,
    });
  });

  changeOrders?.slice(0, 3).forEach(co => {
    recentActivity.push({
      id: `co-${co.id}`,
      type: "change_order",
      title: `CO #${co.co_number}: ${co.title}`,
      description: co.status === "pending" ? `$${Number(co.amount).toLocaleString()} pending approval` : `${co.status}`,
      timestamp: new Date(co.created_at),
      status: co.status,
    });
  });

  dailyLogs?.slice(0, 2).forEach(log => {
    recentActivity.push({
      id: `log-${log.id}`,
      type: "daily_log",
      title: `Daily Log - ${format(new Date(log.log_date), "MMM d, yyyy")}`,
      description: log.work_performed?.slice(0, 60) || "No work summary",
      timestamp: new Date(log.created_at),
    });
  });

  milestones?.slice(0, 2).forEach(m => {
    recentActivity.push({
      id: `milestone-${m.id}`,
      type: "milestone",
      title: m.name,
      description: `${m.progress}% complete`,
      timestamp: new Date(m.updated_at),
    });
  });

  // Sort by timestamp and take most recent
  recentActivity.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  const topActivity = recentActivity.slice(0, 6);

  const activityIcon: Record<ActivityType, React.ReactNode> = {
    rfi: <FileQuestion className="w-4 h-4" />,
    change_order: <FileText className="w-4 h-4" />,
    daily_log: <ClipboardList className="w-4 h-4" />,
    milestone: <CalendarDays className="w-4 h-4" />,
  };

  const getStatusColor = (type: ActivityType, status?: string) => {
    if (type === "rfi") {
      if (status === "open") return "bg-warning";
      if (status === "answered") return "bg-success";
    }
    if (type === "change_order") {
      if (status === "pending") return "bg-warning";
      if (status === "approved") return "bg-success";
      if (status === "rejected") return "bg-destructive";
    }
    return "bg-muted-foreground";
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="stat-card p-4">
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-8 w-16" />
            </div>
          ))}
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 stat-card p-4">
            <Skeleton className="h-6 w-32 mb-4" />
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-16 mb-2" />
            ))}
          </div>
          <div className="stat-card p-4">
            <Skeleton className="h-6 w-24 mb-4" />
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-10 mb-2" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Open RFIs"
          value={openRFIs}
          subtitle={`${answeredRFIs} answered`}
          icon={<FileQuestion className="w-5 h-5" />}
          variant={openRFIs > 5 ? "warning" : "default"}
        />
        <StatCard
          title="Pending COs"
          value={pendingCOs}
          subtitle={`$${approvedCOValue.toLocaleString()} approved`}
          icon={<DollarSign className="w-5 h-5" />}
          variant={pendingCOs > 0 ? "warning" : "default"}
        />
        <StatCard
          title="Team Members"
          value={teamSize}
          icon={<Users className="w-5 h-5" />}
        />
        <StatCard
          title="Upcoming Milestones"
          value={upcomingMilestones}
          subtitle="Due in 2 weeks"
          icon={<CalendarDays className="w-5 h-5" />}
          variant={upcomingMilestones > 0 ? "warning" : "default"}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 stat-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-foreground">Recent Activity</h3>
            </div>
          </div>
          
          {topActivity.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No recent activity</p>
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {topActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 px-5 py-3 hover:bg-muted/30 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                    {activityIcon[activity.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-foreground truncate">{activity.title}</p>
                      {activity.status && (
                        <span className={cn(
                          "w-2 h-2 rounded-full shrink-0",
                          getStatusColor(activity.type, activity.status)
                        )} />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{activity.description}</p>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="stat-card">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">Quick Actions</h3>
          </div>
          <div className="p-4 space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2"
              onClick={() => setCreateRFIOpen(true)}
            >
              <Plus className="w-4 h-4" />
              Create RFI
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2"
              onClick={() => setCreateCOOpen(true)}
            >
              <Plus className="w-4 h-4" />
              Create Change Order
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2"
              onClick={() => setAddMilestoneOpen(true)}
            >
              <Plus className="w-4 h-4" />
              Add Milestone
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2"
              onClick={() => setInviteOpen(true)}
            >
              <Users className="w-4 h-4" />
              Invite Team Member
            </Button>
          </div>

          <div className="px-4 pb-4 space-y-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wider px-1">Navigate to</p>
            {onTabChange && (
              <>
                <Button 
                  variant="ghost" 
                  className="w-full justify-between text-muted-foreground hover:text-foreground"
                  onClick={() => onTabChange("rfis")}
                >
                  <span className="flex items-center gap-2">
                    <FileQuestion className="w-4 h-4" />
                    View All RFIs
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-between text-muted-foreground hover:text-foreground"
                  onClick={() => onTabChange("change-orders")}
                >
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    View Change Orders
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-between text-muted-foreground hover:text-foreground"
                  onClick={() => onTabChange("schedule")}
                >
                  <span className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4" />
                    View Schedule
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <CreateRFIDialog
        projectId={project.id}
        open={createRFIOpen}
        onOpenChange={setCreateRFIOpen}
      />
      <CreateChangeOrderDialog
        projectId={project.id}
        open={createCOOpen}
        onOpenChange={setCreateCOOpen}
      />
      <AddMilestoneDialog
        projectId={project.id}
        open={addMilestoneOpen}
        onOpenChange={setAddMilestoneOpen}
      />
      <InviteTeamMemberDialog
        projectId={project.id}
        open={inviteOpen}
        onOpenChange={setInviteOpen}
      />
    </div>
  );
}
