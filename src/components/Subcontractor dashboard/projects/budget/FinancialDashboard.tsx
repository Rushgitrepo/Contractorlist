import { useMemo } from "react";
import { format } from "date-fns";
import { TrendingUp, TrendingDown, DollarSign, Percent, Calendar, ArrowRight } from "lucide-react";
import {
  LineChart,
  Line,
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
  AreaChart,
  Area,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/Subcontractor dashboard/ui/card";
import { PayApplication, BudgetItem } from "@/hooks/Subcontractor dashboard/useBudget";
import { useRetainageReleases } from "@/hooks/Subcontractor dashboard/useRetainage";

interface FinancialDashboardProps {
  projectId: string;
  applications: PayApplication[];
  budgetItems: BudgetItem[];
  originalContract: number;
  approvedChanges: number;
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

function formatCurrencyShort(n: number) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

const CHART_COLORS = {
  primary: "hsl(var(--primary))",
  success: "hsl(142, 76%, 36%)",
  warning: "hsl(38, 92%, 50%)",
  muted: "hsl(var(--muted-foreground))",
  accent: "hsl(262, 83%, 58%)",
};

export default function FinancialDashboard({
  projectId,
  applications,
  budgetItems,
  originalContract,
  approvedChanges,
}: FinancialDashboardProps) {
  const { data: retainageReleases = [] } = useRetainageReleases(projectId);

  // Calculate metrics
  const metrics = useMemo(() => {
    const contractToDate = originalContract + approvedChanges;
    
    const totals = budgetItems.reduce(
      (acc, item) => {
        const totalCompleted = item.work_completed_previous + item.work_completed_current + item.materials_stored;
        const retainage = totalCompleted * (item.retainage_percent / 100);
        return {
          totalCompleted: acc.totalCompleted + totalCompleted,
          retainage: acc.retainage + retainage,
        };
      },
      { totalCompleted: 0, retainage: 0 }
    );

    const totalReleased = retainageReleases.reduce((sum, r) => sum + Number(r.amount), 0);
    const retainageBalance = totals.retainage - totalReleased;

    const paidApps = applications.filter(a => a.status === 'paid');
    const approvedApps = applications.filter(a => a.status === 'approved');
    const totalBilled = applications
      .filter(a => ['submitted', 'approved', 'paid'].includes(a.status))
      .reduce((sum, a) => sum + a.current_payment_due, 0);
    const totalPaid = paidApps.reduce((sum, a) => sum + a.current_payment_due, 0);
    const pendingPayments = approvedApps.reduce((sum, a) => sum + a.current_payment_due, 0);

    const percentComplete = contractToDate > 0 ? (totals.totalCompleted / contractToDate) * 100 : 0;
    const percentBilled = contractToDate > 0 ? (totalBilled / contractToDate) * 100 : 0;

    return {
      contractToDate,
      totalCompleted: totals.totalCompleted,
      totalRetainage: totals.retainage,
      totalReleased,
      retainageBalance,
      totalBilled,
      totalPaid,
      pendingPayments,
      percentComplete,
      percentBilled,
      balanceToFinish: contractToDate - totals.totalCompleted,
    };
  }, [applications, budgetItems, originalContract, approvedChanges, retainageReleases]);

  // Prepare billing trends data (cumulative over time)
  const billingTrendsData = useMemo(() => {
    const sortedApps = [...applications]
      .filter(a => ['submitted', 'approved', 'paid'].includes(a.status))
      .sort((a, b) => new Date(a.period_to).getTime() - new Date(b.period_to).getTime());

    let cumulative = 0;
    return sortedApps.map(app => {
      cumulative += app.current_payment_due;
      return {
        period: format(new Date(app.period_to), "MMM yyyy"),
        billed: app.current_payment_due,
        cumulative,
        completed: app.total_completed,
      };
    });
  }, [applications]);

  // Payment status breakdown
  const paymentStatusData = useMemo(() => {
    const paid = applications.filter(a => a.status === 'paid').reduce((s, a) => s + a.current_payment_due, 0);
    const approved = applications.filter(a => a.status === 'approved').reduce((s, a) => s + a.current_payment_due, 0);
    const submitted = applications.filter(a => a.status === 'submitted').reduce((s, a) => s + a.current_payment_due, 0);
    const draft = applications.filter(a => a.status === 'draft').reduce((s, a) => s + a.current_payment_due, 0);

    return [
      { name: 'Paid', value: paid, color: CHART_COLORS.success },
      { name: 'Approved', value: approved, color: CHART_COLORS.primary },
      { name: 'Submitted', value: submitted, color: CHART_COLORS.warning },
      { name: 'Draft', value: draft, color: CHART_COLORS.muted },
    ].filter(d => d.value > 0);
  }, [applications]);

  // Retainage over time
  const retainageData = useMemo(() => {
    const sortedApps = [...applications]
      .filter(a => ['approved', 'paid'].includes(a.status))
      .sort((a, b) => new Date(a.period_to).getTime() - new Date(b.period_to).getTime());

    let cumulativeRetainage = 0;
    const dataPoints = sortedApps.map(app => {
      cumulativeRetainage += app.retainage_amount;
      return {
        period: format(new Date(app.period_to), "MMM yyyy"),
        held: cumulativeRetainage,
      };
    });

    // Add release points
    const sortedReleases = [...retainageReleases].sort(
      (a, b) => new Date(a.release_date).getTime() - new Date(b.release_date).getTime()
    );

    let released = 0;
    sortedReleases.forEach(release => {
      released += Number(release.amount);
      const period = format(new Date(release.release_date), "MMM yyyy");
      const existing = dataPoints.find(d => d.period === period);
      if (existing) {
        (existing as any).released = released;
      } else {
        dataPoints.push({ period, held: cumulativeRetainage, released } as any);
      }
    });

    return dataPoints;
  }, [applications, retainageReleases]);

  // Contract progress breakdown
  const contractProgressData = useMemo(() => [
    { name: 'Completed', value: metrics.totalCompleted, color: CHART_COLORS.success },
    { name: 'Remaining', value: metrics.balanceToFinish, color: CHART_COLORS.muted },
  ], [metrics]);

  return (
    <div className="space-y-6">
      {/* Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <DollarSign className="w-3 h-3" />
              Total Billed
            </div>
            <p className="text-2xl font-bold">{formatCurrencyShort(metrics.totalBilled)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.percentBilled.toFixed(1)}% of contract
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <TrendingUp className="w-3 h-3 text-success" />
              Paid to Date
            </div>
            <p className="text-2xl font-bold text-success">{formatCurrencyShort(metrics.totalPaid)}</p>
            {metrics.pendingPayments > 0 && (
              <p className="text-xs text-warning mt-1">
                +{formatCurrencyShort(metrics.pendingPayments)} pending
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <Percent className="w-3 h-3 text-warning" />
              Retainage Held
            </div>
            <p className="text-2xl font-bold text-warning">{formatCurrencyShort(metrics.retainageBalance)}</p>
            {metrics.totalReleased > 0 && (
              <p className="text-xs text-success mt-1">
                {formatCurrencyShort(metrics.totalReleased)} released
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <Calendar className="w-3 h-3" />
              Balance to Finish
            </div>
            <p className="text-2xl font-bold">{formatCurrencyShort(metrics.balanceToFinish)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.percentComplete.toFixed(1)}% complete
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Billing Trends */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Billing Trends</CardTitle>
            <CardDescription>Cumulative billing over time</CardDescription>
          </CardHeader>
          <CardContent>
            {billingTrendsData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={billingTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="period" fontSize={12} tickLine={false} />
                  <YAxis fontSize={12} tickLine={false} tickFormatter={formatCurrencyShort} />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="cumulative"
                    stroke={CHART_COLORS.primary}
                    fill={CHART_COLORS.primary}
                    fillOpacity={0.2}
                    name="Cumulative Billed"
                  />
                  <Area
                    type="monotone"
                    dataKey="completed"
                    stroke={CHART_COLORS.success}
                    fill={CHART_COLORS.success}
                    fillOpacity={0.1}
                    name="Work Completed"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                No billing data yet
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Status */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Payment Status</CardTitle>
            <CardDescription>Breakdown by application status</CardDescription>
          </CardHeader>
          <CardContent>
            {paymentStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={paymentStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {paymentStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend
                    formatter={(value, entry) => (
                      <span className="text-sm">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                No applications yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Retainage Tracking */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Retainage Tracking</CardTitle>
            <CardDescription>Held vs released over time</CardDescription>
          </CardHeader>
          <CardContent>
            {retainageData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={retainageData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="period" fontSize={12} tickLine={false} />
                  <YAxis fontSize={12} tickLine={false} tickFormatter={formatCurrencyShort} />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="held" fill={CHART_COLORS.warning} name="Retainage Held" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="released" fill={CHART_COLORS.success} name="Released" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                No retainage data yet
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment History Timeline */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Payment History</CardTitle>
            <CardDescription>Recent payment activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[250px] overflow-y-auto">
              {applications
                .filter(a => ['approved', 'paid'].includes(a.status))
                .sort((a, b) => {
                  const dateA = a.approved_at || a.created_at;
                  const dateB = b.approved_at || b.created_at;
                  return new Date(dateB).getTime() - new Date(dateA).getTime();
                })
                .slice(0, 8)
                .map((app) => (
                  <div key={app.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                    <div className={`w-2 h-2 rounded-full ${app.status === 'paid' ? 'bg-success' : 'bg-primary'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">App #{app.application_number}</span>
                        <ArrowRight className="w-3 h-3 text-muted-foreground" />
                        <span className={`text-xs font-medium ${app.status === 'paid' ? 'text-success' : 'text-primary'}`}>
                          {app.status === 'paid' ? 'Paid' : 'Approved'}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(app.approved_at || app.created_at), "MMM d, yyyy")}
                      </p>
                    </div>
                    <span className="font-mono font-semibold text-success">
                      {formatCurrency(app.current_payment_due)}
                    </span>
                  </div>
                ))}
              {applications.filter(a => ['approved', 'paid'].includes(a.status)).length === 0 && (
                <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                  No payments yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
