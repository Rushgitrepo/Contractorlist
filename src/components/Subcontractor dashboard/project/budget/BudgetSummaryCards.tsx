import { DollarSign, TrendingUp, Receipt, Percent } from "lucide-react";
import { cn } from "@/lib/utils";

interface BudgetSummaryCardsProps {
  originalContract: number;
  approvedChanges: number;
  totalCompleted: number;
  retainageHeld: number;
  balanceToFinish: number;
}

function formatCurrency(n: number) {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toLocaleString()}`;
}

export default function BudgetSummaryCards({
  originalContract,
  approvedChanges,
  totalCompleted,
  retainageHeld,
  balanceToFinish,
}: BudgetSummaryCardsProps) {
  const contractToDate = originalContract + approvedChanges;
  const percentComplete = contractToDate > 0 ? (totalCompleted / contractToDate) * 100 : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      <div className="stat-card p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <DollarSign className="w-4 h-4 text-primary" />
          </div>
        </div>
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Original Contract</p>
        <p className="text-xl font-bold">{formatCurrency(originalContract)}</p>
      </div>

      <div className="stat-card p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded-lg bg-warning/10">
            <TrendingUp className="w-4 h-4 text-warning" />
          </div>
        </div>
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Approved Changes</p>
        <p className="text-xl font-bold">{formatCurrency(approvedChanges)}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {originalContract > 0 ? ((approvedChanges / originalContract) * 100).toFixed(1) : 0}% of original
        </p>
      </div>

      <div className="stat-card p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded-lg bg-success/10">
            <Receipt className="w-4 h-4 text-success" />
          </div>
        </div>
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Work Completed</p>
        <p className="text-xl font-bold">{formatCurrency(totalCompleted)}</p>
        <p className="text-xs text-muted-foreground mt-1">{percentComplete.toFixed(1)}% complete</p>
      </div>

      <div className="stat-card p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded-lg bg-info/10">
            <Percent className="w-4 h-4 text-info" />
          </div>
        </div>
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Retainage Held</p>
        <p className="text-xl font-bold">{formatCurrency(retainageHeld)}</p>
      </div>

      <div className="stat-card p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className={cn("p-2 rounded-lg", balanceToFinish > 0 ? "bg-muted" : "bg-destructive/10")}>
            <DollarSign className={cn("w-4 h-4", balanceToFinish > 0 ? "text-muted-foreground" : "text-destructive")} />
          </div>
        </div>
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Balance to Finish</p>
        <p className="text-xl font-bold">{formatCurrency(balanceToFinish)}</p>
      </div>
    </div>
  );
}
