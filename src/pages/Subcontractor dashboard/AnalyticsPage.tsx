import { useMemo } from "react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Percent,
  FolderKanban,
  Activity,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/Subcontractor dashboard/ui/card";
import { Badge } from "@/components/Subcontractor dashboard/ui/badge";
import { Progress } from "@/components/Subcontractor dashboard/ui/progress";
import { usePortfolioAnalytics, useRecentPayApplications, useProjectHealthScores } from "@/hooks/Subcontractor dashboard/usePortfolioAnalytics";

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

function formatCurrencyShort(n: number) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

const STATUS_COLORS: Record<string, string> = {
  planning: "hsl(var(--muted-foreground))",
  "in-progress": "hsl(var(--primary))",
  "on-hold": "hsl(var(--warning))",
  completed: "hsl(var(--primary))",
};

const STATUS_LABELS: Record<string, string> = {
  planning: "Planning",
  "in-progress": "In Progress",
  "on-hold": "On Hold",
  completed: "Completed",
};

const PAY_STATUS_COLORS: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  submitted: "bg-warning/20 text-warning",
  approved: "bg-primary/20 text-primary",
  paid: "bg-success/20 text-success",
};

export default function AnalyticsPage() {
  const { data: metrics, isLoading: metricsLoading } = usePortfolioAnalytics();
  const { data: recentPayApps, isLoading: payAppsLoading } = useRecentPayApplications();
  const { data: healthScores, isLoading: healthLoading } = useProjectHealthScores();

  const pieData = useMemo(() => {
    if (!metrics?.projectsByStatus) return [];
    return metrics.projectsByStatus.map(item => ({
      name: STATUS_LABELS[item.status] || item.status,
      value: item.count,
      color: STATUS_COLORS[item.status] || "hsl(var(--muted))",
    }));
  }, [metrics]);

  if (metricsLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">Portfolio Analytics</h1>
        <p className="text-muted-foreground">Aggregated insights across all your projects</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <FolderKanban className="w-3 h-3" />
              Total Projects
            </div>
            <p className="text-2xl font-bold">{metrics?.totalProjects || 0}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics?.activeProjects || 0} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <DollarSign className="w-3 h-3" />
              Contract Value
            </div>
            <p className="text-2xl font-bold">{formatCurrencyShort(metrics?.totalContractValue || 0)}</p>
            <p className="text-xs text-muted-foreground mt-1">all projects</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <TrendingUp className="w-3 h-3 text-primary" />
              Total Billed
            </div>
            <p className="text-2xl font-bold text-primary">{formatCurrencyShort(metrics?.totalBilled || 0)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {((metrics?.totalBilled || 0) / (metrics?.totalContractValue || 1) * 100).toFixed(1)}% of value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <CheckCircle2 className="w-3 h-3 text-success" />
              Total Paid
            </div>
            <p className="text-2xl font-bold text-success">{formatCurrencyShort(metrics?.totalPaid || 0)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {((metrics?.totalPaid || 0) / (metrics?.totalBilled || 1) * 100).toFixed(1)}% collected
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <Percent className="w-3 h-3 text-warning" />
              Retainage Held
            </div>
            <p className="text-2xl font-bold text-warning">{formatCurrencyShort(metrics?.totalRetainage || 0)}</p>
            <p className="text-xs text-muted-foreground mt-1">across projects</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <Activity className="w-3 h-3" />
              Avg Completion
            </div>
            <p className="text-2xl font-bold">{(metrics?.avgCompletion || 0).toFixed(0)}%</p>
            <Progress value={metrics?.avgCompletion || 0} className="mt-2 h-1.5" />
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Billing Trends */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Billing Trends</CardTitle>
            <CardDescription>Monthly billing and payments across all projects</CardDescription>
          </CardHeader>
          <CardContent>
            {metrics?.billingByMonth && metrics.billingByMonth.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={metrics.billingByMonth}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" fontSize={12} tickLine={false} />
                  <YAxis fontSize={12} tickLine={false} tickFormatter={formatCurrencyShort} />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="billed"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.2}
                    name="Billed"
                  />
                  <Area
                    type="monotone"
                    dataKey="paid"
                    stroke="hsl(142, 76%, 36%)"
                    fill="hsl(142, 76%, 36%)"
                    fillOpacity={0.1}
                    name="Paid"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[280px] flex items-center justify-center text-muted-foreground">
                No billing data yet
              </div>
            )}
          </CardContent>
        </Card>

        {/* Projects by Status */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Projects by Status</CardTitle>
            <CardDescription>Distribution of project states</CardDescription>
          </CardHeader>
          <CardContent>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend formatter={(value) => <span className="text-sm">{value}</span>} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[280px] flex items-center justify-center text-muted-foreground">
                No projects yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Project Progress */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Top Projects by Budget</CardTitle>
            <CardDescription>Completion progress of largest projects</CardDescription>
          </CardHeader>
          <CardContent>
            {metrics?.projectsProgress && metrics.projectsProgress.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={metrics.projectsProgress}
                  layout="vertical"
                  margin={{ left: 80, right: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} fontSize={12} />
                  <YAxis type="category" dataKey="name" fontSize={11} tickLine={false} width={80} />
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      name === "completion" ? `${value}%` : formatCurrency(value),
                      name === "completion" ? "Progress" : "Budget",
                    ]}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="completion" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} name="Progress" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No project data yet
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Pay Applications */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Recent Pay Applications</CardTitle>
            <CardDescription>Latest billing activity across projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {!payAppsLoading && recentPayApps && recentPayApps.length > 0 ? (
                recentPayApps.map((pa) => (
                  <Link
                    key={pa.id}
                    to={`/subcontractor-dashboard/projects/${pa.project_id}?tab=budget`}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm truncate">{pa.project_name}</span>
                        <Badge variant="outline" className="text-xs">
                          App #{pa.application_number}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Period: {format(new Date(pa.period_to), "MMM d, yyyy")}
                      </p>
                    </div>
                    <Badge className={PAY_STATUS_COLORS[pa.status] || "bg-muted"}>
                      {pa.status}
                    </Badge>
                    <span className="font-mono font-semibold text-sm">
                      {formatCurrency(pa.current_payment_due)}
                    </span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </Link>
                ))
              ) : (
                <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                  No pay applications yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Health Scores */}
      {!healthLoading && healthScores && healthScores.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Active Project Health</CardTitle>
            <CardDescription>Budget and schedule health indicators for in-progress projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {healthScores.map((project) => (
                <Link
                  key={project.id}
                  to={`/subcontractor-dashboard/projects/${project.id}`}
                  className="p-4 rounded-lg border bg-card hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-medium text-sm truncate flex-1 pr-2">{project.name}</h4>
                    <HealthIndicator score={project.overallHealth} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Budget</span>
                      <div className="flex items-center gap-1.5">
                        <Progress value={project.budgetHealth} className="w-16 h-1.5" />
                        <span className="w-8 text-right">{project.budgetHealth}%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Schedule</span>
                      <div className="flex items-center gap-1.5">
                        <Progress value={project.scheduleHealth} className="w-16 h-1.5" />
                        <span className="w-8 text-right">{project.scheduleHealth}%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs pt-1 border-t">
                      <span className="text-muted-foreground">Completion</span>
                      <span className="font-medium">{project.completion}%</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function HealthIndicator({ score }: { score: number }) {
  if (score >= 80) {
    return (
      <div className="flex items-center gap-1 text-success text-xs">
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span>Healthy</span>
      </div>
    );
  }
  if (score >= 60) {
    return (
      <div className="flex items-center gap-1 text-warning text-xs">
        <Clock className="w-3.5 h-3.5" />
        <span>At Risk</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1 text-destructive text-xs">
      <AlertTriangle className="w-3.5 h-3.5" />
      <span>Critical</span>
    </div>
  );
}
