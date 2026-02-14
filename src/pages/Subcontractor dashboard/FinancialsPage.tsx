import { mockFinancials } from "@/data/Subcontractor dashboard/mockData";
import StatCard from "@/components/Subcontractor dashboard/StatCard";
import { cn } from "@/lib/utils";
import { DollarSign, TrendingUp, Receipt, ArrowUpDown, FileText, Download, Plus, Filter } from "lucide-react";

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

const changeOrders = [
  { id: "CO-001", description: "Additional fire suppression — Bldg B", amount: 185000, status: "approved", date: "2026-01-22", requestedBy: "Mechanical Sub" },
  { id: "CO-002", description: "Owner-requested lobby upgrade", amount: 145000, status: "approved", date: "2026-02-10", requestedBy: "Owner" },
  { id: "CO-003", description: "Unforeseen rock excavation", amount: 90000, status: "approved", date: "2026-03-05", requestedBy: "Excavation Sub" },
  { id: "CO-004", description: "HVAC redesign — floors 3-5", amount: 220000, status: "pending", date: "2026-03-28", requestedBy: "MEP Engineer" },
  { id: "CO-005", description: "Electrical panel relocation", amount: 45000, status: "pending", date: "2026-04-02", requestedBy: "Electrical Sub" },
  { id: "CO-006", description: "Sidewalk ADA compliance", amount: 32000, status: "rejected", date: "2026-03-15", requestedBy: "Civil Engineer" },
];

const costBreakdown = [
  { category: "Labor", budgeted: 6200000, actual: 2650000, variance: 0 },
  { category: "Materials", budgeted: 8100000, actual: 3450000, variance: -85000 },
  { category: "Equipment", budgeted: 2400000, actual: 980000, variance: 25000 },
  { category: "Subcontracts", budgeted: 1500000, actual: 620000, variance: 0 },
  { category: "Other", budgeted: 300000, actual: 70000, variance: -12000 },
];

const statusStyle: Record<string, { bg: string; text: string }> = {
  approved: { bg: "bg-success/10", text: "text-success" },
  pending: { bg: "bg-warning/10", text: "text-warning" },
  rejected: { bg: "bg-destructive/10", text: "text-destructive" },
};

export default function FinancialsPage() {
  const f = mockFinancials;
  const percentBilled = ((f.billedToDate / f.revisedContract) * 100).toFixed(1);

  return (
    <div className="p-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Budget</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Riverside Medical Center — Financial Overview
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-border rounded-md text-foreground hover:bg-muted transition-colors">
            <Download className="w-4 h-4" /> Export
          </button>
          <button className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
            <FileText className="w-4 h-4" /> Generate G702
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Original Contract"
          value={fmt(f.originalContract)}
          icon={<DollarSign className="w-5 h-5" />}
        />
        <StatCard
          title="Approved Changes"
          value={fmt(f.approvedChanges)}
          subtitle="+2.3% of original"
          icon={<ArrowUpDown className="w-5 h-5" />}
          variant="warning"
        />
        <StatCard
          title="Billed to Date"
          value={fmt(f.billedToDate)}
          subtitle={`${percentBilled}% complete`}
          icon={<Receipt className="w-5 h-5" />}
          variant="primary"
        />
        <StatCard
          title="Balance to Finish"
          value={fmt(f.balance)}
          icon={<TrendingUp className="w-5 h-5" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Cost Breakdown */}
        <div className="lg:col-span-2 stat-card">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Cost Breakdown by Category</h2>
            <button className="text-xs text-yellow-600 dark:text-yellow-400 hover:underline">View Details</button>
          </div>
          <table className="procore-table">
            <thead>
              <tr>
                <th>Category</th>
                <th className="text-right">Budgeted</th>
                <th className="text-right">Actual</th>
                <th className="text-right">% Spent</th>
                <th className="text-right">Variance</th>
              </tr>
            </thead>
            <tbody>
              {costBreakdown.map((row) => {
                const pct = ((row.actual / row.budgeted) * 100).toFixed(0);
                return (
                  <tr key={row.category}>
                    <td className="font-medium">{row.category}</td>
                    <td className="text-right text-muted-foreground">{fmt(row.budgeted)}</td>
                    <td className="text-right font-medium">{fmt(row.actual)}</td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${Math.min(Number(pct), 100)}%` }}
                          />
                        </div>
                        <span className="text-xs w-8">{pct}%</span>
                      </div>
                    </td>
                    <td className={cn(
                      "text-right font-medium",
                      row.variance > 0 ? "text-success" : row.variance < 0 ? "text-destructive" : "text-muted-foreground"
                    )}>
                      {row.variance > 0 ? "+" : ""}{fmt(row.variance)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Budget Utilization */}
        <div className="stat-card">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">Budget Utilization</h2>
          </div>
          <div className="p-5">
            <div className="text-center mb-6">
              <p className="text-4xl font-bold text-foreground">{percentBilled}%</p>
              <p className="text-sm text-muted-foreground">of revised contract billed</p>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Paid</span>
                  <span className="font-medium">{fmt(f.paidToDate)}</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-success rounded-full"
                    style={{ width: `${(f.paidToDate / f.revisedContract) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Retainage</span>
                  <span className="font-medium">{fmt(f.retainage)}</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-warning rounded-full"
                    style={{ width: `${(f.retainage / f.revisedContract) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Remaining</span>
                  <span className="font-medium">{fmt(f.balance)}</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-muted-foreground/30 rounded-full"
                    style={{ width: `${(f.balance / f.revisedContract) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change Orders */}
      <div className="stat-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Change Events</h2>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-border rounded-md text-foreground hover:bg-muted transition-colors">
              <Filter className="w-3 h-3" /> Filter
            </button>
            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
              <Plus className="w-3 h-3" /> New Change
            </button>
          </div>
        </div>
        <table className="procore-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Description</th>
              <th>Requested By</th>
              <th>Date</th>
              <th className="text-right">Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {changeOrders.map((co) => (
              <tr key={co.id} className="cursor-pointer">
                <td className="font-mono text-xs">{co.id}</td>
                <td className="font-medium">{co.description}</td>
                <td className="text-muted-foreground">{co.requestedBy}</td>
                <td className="font-mono text-xs text-muted-foreground">{co.date}</td>
                <td className="text-right font-semibold">{fmt(co.amount)}</td>
                <td>
                  <span className={cn(
                    "text-[10px] font-semibold px-2 py-1 rounded uppercase",
                    statusStyle[co.status].bg,
                    statusStyle[co.status].text
                  )}>
                    {co.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
