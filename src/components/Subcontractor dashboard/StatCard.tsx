import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: { value: number; positive: boolean };
  className?: string;
  variant?: "default" | "primary" | "success" | "warning" | "danger";
}

const variantStyles: Record<string, string> = {
  default: "",
  primary: "border-l-4 border-l-primary",
  success: "border-l-4 border-l-success",
  warning: "border-l-4 border-l-warning",
  danger: "border-l-4 border-l-destructive",
};

function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  trend, 
  className,
  variant = "default" 
}: StatCardProps) {
  return (
    <div className={cn("stat-card p-5", variantStyles[variant], className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
            {title}
          </p>
          <p className="text-2xl font-bold text-foreground tabular-nums">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className={cn(
              "flex items-center gap-1 mt-2 text-xs font-medium",
              trend.positive ? "text-success" : "text-destructive"
            )}>
              {trend.positive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span>{Math.abs(trend.value)}%</span>
              <span className="text-muted-foreground font-normal">vs last period</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground shrink-0">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

export default StatCard;
