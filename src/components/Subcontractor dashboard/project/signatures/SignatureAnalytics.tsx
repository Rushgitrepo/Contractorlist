import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/Subcontractor dashboard/ui/card";
import { Badge } from "@/components/Subcontractor dashboard/ui/badge";
import { Button } from "@/components/Subcontractor dashboard/ui/button";
import { Calendar } from "@/components/Subcontractor dashboard/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/Subcontractor dashboard/ui/popover";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Clock, CheckCircle2, AlertCircle, TrendingUp, Users, FileText, Download, FileDown, Loader2, CalendarIcon, X } from "lucide-react";
import { useSignatureAnalytics, DateRange } from "@/hooks/Subcontractor dashboard/useSignatureAnalytics";
import jsPDF from "jspdf";
import { toast } from "sonner";
import { format, subDays, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { cn } from "@/lib/utils";

interface SignatureAnalyticsProps {
  projectId: string;
}

const COLORS = ["hsl(var(--primary))", "hsl(var(--success))", "hsl(var(--warning))"];

const PRESET_RANGES = [
  { label: "Last 7 days", getValue: () => ({ from: subDays(new Date(), 7), to: new Date() }) },
  { label: "Last 30 days", getValue: () => ({ from: subDays(new Date(), 30), to: new Date() }) },
  { label: "Last 90 days", getValue: () => ({ from: subDays(new Date(), 90), to: new Date() }) },
  { label: "This month", getValue: () => ({ from: startOfMonth(new Date()), to: endOfMonth(new Date()) }) },
  { label: "Last month", getValue: () => ({ from: startOfMonth(subMonths(new Date(), 1)), to: endOfMonth(subMonths(new Date(), 1)) }) },
  { label: "Last 6 months", getValue: () => ({ from: subMonths(new Date(), 6), to: new Date() }) },
];

export default function SignatureAnalytics({ projectId }: SignatureAnalyticsProps) {
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  const { data, isLoading } = useSignatureAnalytics(projectId, dateRange);

  const handlePresetClick = (preset: typeof PRESET_RANGES[0]) => {
    setDateRange(preset.getValue());
    setIsCalendarOpen(false);
  };

  const handleClearDateRange = () => {
    setDateRange({ from: undefined, to: undefined });
  };

  const formatDateRange = () => {
    if (!dateRange.from) return "All time";
    if (!dateRange.to) return format(dateRange.from, "MMM d, yyyy");
    return `${format(dateRange.from, "MMM d, yyyy")} - ${format(dateRange.to, "MMM d, yyyy")}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No analytics data available.
      </div>
    );
  }

  const { metrics, monthlyTrends, roleBreakdown, documentTypeBreakdown } = data;

  const formatTime = (hours: number) => {
    if (hours < 1) return "< 1 hour";
    if (hours < 24) return `${Math.round(hours)} hours`;
    const days = Math.round(hours / 24);
    return `${days} day${days !== 1 ? "s" : ""}`;
  };

  const exportToCSV = () => {
    try {
      const lines: string[] = [];
      
      // Key Metrics
      lines.push("SIGNATURE ANALYTICS REPORT");
      lines.push("");
      lines.push("KEY METRICS");
      lines.push("Metric,Value");
      lines.push(`Average Time to Sign,${formatTime(metrics.averageTimeToSignature)}`);
      lines.push(`Completion Rate,${metrics.completionRate.toFixed(1)}%`);
      lines.push(`Total Requests,${metrics.totalRequests}`);
      lines.push(`Signed Requests,${metrics.signedRequests}`);
      lines.push(`Pending Requests,${metrics.pendingRequests}`);
      lines.push(`Expired Requests,${metrics.expiredRequests}`);
      lines.push(`Cancelled Requests,${metrics.cancelledRequests}`);
      lines.push("");
      
      // Monthly Trends
      lines.push("MONTHLY TRENDS");
      lines.push("Month,Completion Rate,Total Requests,Signed Count");
      monthlyTrends.forEach(t => {
        lines.push(`${t.month},${t.completionRate.toFixed(1)}%,${t.totalRequests},${t.signedCount}`);
      });
      lines.push("");
      
      // Role Breakdown
      lines.push("PERFORMANCE BY ROLE");
      lines.push("Role,Average Time,Completion Rate,Request Count");
      roleBreakdown.forEach(r => {
        lines.push(`${r.role},${formatTime(r.averageTime)},${r.completionRate.toFixed(1)}%,${r.count}`);
      });
      lines.push("");
      
      // Document Type Breakdown
      lines.push("PERFORMANCE BY DOCUMENT TYPE");
      lines.push("Document Type,Completion Rate,Average Time,Request Count");
      documentTypeBreakdown.forEach(d => {
        lines.push(`${d.label},${d.completionRate.toFixed(1)}%,${formatTime(d.averageTime)},${d.count}`);
      });
      
      const csvContent = lines.join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `signature-analytics-${new Date().toISOString().split("T")[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success("CSV exported successfully");
    } catch (error) {
      toast.error("Failed to export CSV");
    }
  };

  const exportToPDF = () => {
    try {
      const pdf = new jsPDF();
      let yPos = 20;
      const lineHeight = 7;
      const pageWidth = pdf.internal.pageSize.getWidth();
      
      // Title
      pdf.setFontSize(18);
      pdf.setFont("helvetica", "bold");
      pdf.text("Signature Analytics Report", pageWidth / 2, yPos, { align: "center" });
      yPos += 15;
      
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPos, { align: "center" });
      yPos += 15;
      
      // Key Metrics Section
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("Key Metrics", 20, yPos);
      yPos += 10;
      
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      const metricsData = [
        ["Average Time to Sign", formatTime(metrics.averageTimeToSignature)],
        ["Completion Rate", `${metrics.completionRate.toFixed(1)}%`],
        ["Total Requests", metrics.totalRequests.toString()],
        ["Signed Requests", metrics.signedRequests.toString()],
        ["Pending Requests", metrics.pendingRequests.toString()],
        ["Expired Requests", metrics.expiredRequests.toString()],
        ["Cancelled Requests", metrics.cancelledRequests.toString()],
      ];
      
      metricsData.forEach(([label, value]) => {
        pdf.text(`${label}:`, 25, yPos);
        pdf.text(value, 100, yPos);
        yPos += lineHeight;
      });
      yPos += 10;
      
      // Monthly Trends Section
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("Monthly Trends", 20, yPos);
      yPos += 10;
      
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "bold");
      pdf.text("Month", 25, yPos);
      pdf.text("Completion Rate", 70, yPos);
      pdf.text("Total", 120, yPos);
      pdf.text("Signed", 150, yPos);
      yPos += lineHeight;
      
      pdf.setFont("helvetica", "normal");
      monthlyTrends.forEach(t => {
        pdf.text(t.month, 25, yPos);
        pdf.text(`${t.completionRate.toFixed(1)}%`, 70, yPos);
        pdf.text(t.totalRequests.toString(), 120, yPos);
        pdf.text(t.signedCount.toString(), 150, yPos);
        yPos += lineHeight;
      });
      yPos += 10;
      
      // Check if we need a new page
      if (yPos > 250) {
        pdf.addPage();
        yPos = 20;
      }
      
      // Role Breakdown Section
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("Performance by Role", 20, yPos);
      yPos += 10;
      
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "bold");
      pdf.text("Role", 25, yPos);
      pdf.text("Avg Time", 60, yPos);
      pdf.text("Completion Rate", 110, yPos);
      pdf.text("Count", 160, yPos);
      yPos += lineHeight;
      
      pdf.setFont("helvetica", "normal");
      roleBreakdown.forEach(r => {
        pdf.text(r.role, 25, yPos);
        pdf.text(formatTime(r.averageTime), 60, yPos);
        pdf.text(`${r.completionRate.toFixed(1)}%`, 110, yPos);
        pdf.text(r.count.toString(), 160, yPos);
        yPos += lineHeight;
      });
      yPos += 10;
      
      // Document Type Breakdown Section
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("Performance by Document Type", 20, yPos);
      yPos += 10;
      
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "bold");
      pdf.text("Type", 25, yPos);
      pdf.text("Completion Rate", 80, yPos);
      pdf.text("Avg Time", 130, yPos);
      pdf.text("Count", 170, yPos);
      yPos += lineHeight;
      
      pdf.setFont("helvetica", "normal");
      documentTypeBreakdown.forEach(d => {
        pdf.text(d.label, 25, yPos);
        pdf.text(`${d.completionRate.toFixed(1)}%`, 80, yPos);
        pdf.text(formatTime(d.averageTime), 130, yPos);
        pdf.text(d.count.toString(), 170, yPos);
        yPos += lineHeight;
      });
      
      pdf.save(`signature-analytics-${new Date().toISOString().split("T")[0]}.pdf`);
      toast.success("PDF exported successfully");
    } catch (error) {
      toast.error("Failed to export PDF");
    }
  };

  const statusDistribution = [
    { name: "Signed", value: metrics.signedRequests, color: "hsl(var(--success))" },
    { name: "Pending", value: metrics.pendingRequests, color: "hsl(var(--warning))" },
    { name: "Expired", value: metrics.expiredRequests, color: "hsl(var(--destructive))" },
    { name: "Cancelled", value: metrics.cancelledRequests, color: "hsl(var(--muted))" },
  ].filter(item => item.value > 0);

  return (
    <div className="space-y-6">
      {/* Filters and Export Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Date Range Filter */}
        <div className="flex items-center gap-2">
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal",
                  !dateRange.from && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formatDateRange()}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="flex">
                {/* Presets */}
                <div className="border-r p-2 space-y-1">
                  <p className="text-xs font-medium text-muted-foreground px-2 py-1">Quick Select</p>
                  {PRESET_RANGES.map((preset) => (
                    <Button
                      key={preset.label}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-sm"
                      onClick={() => handlePresetClick(preset)}
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
                {/* Calendar */}
                <Calendar
                  mode="range"
                  selected={{ from: dateRange.from, to: dateRange.to }}
                  onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })}
                  numberOfMonths={2}
                  className="p-3 pointer-events-auto"
                />
              </div>
            </PopoverContent>
          </Popover>
          
          {dateRange.from && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearDateRange}
              className="h-8 px-2"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear date range</span>
            </Button>
          )}
          
          {dateRange.from && (
            <Badge variant="secondary" className="text-xs">
              Filtered
            </Badge>
          )}
        </div>

        {/* Export Buttons */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportToCSV}>
            <FileDown className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={exportToPDF}>
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatTime(metrics.averageTimeToSignature)}</p>
                <p className="text-xs text-muted-foreground">Avg. Time to Sign</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{metrics.completionRate.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">Completion Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <CheckCircle2 className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{metrics.signedRequests}</p>
                <p className="text-xs text-muted-foreground">Signed Requests</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <AlertCircle className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{metrics.pendingRequests}</p>
                <p className="text-xs text-muted-foreground">Pending Requests</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Completion Rate Over Time */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Completion Rate Trend
            </CardTitle>
            <CardDescription>Monthly signature completion rates</CardDescription>
          </CardHeader>
          <CardContent>
            {monthlyTrends.some(t => t.totalRequests > 0) ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 12 }}
                    className="text-muted-foreground"
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    domain={[0, 100]}
                    tickFormatter={(value) => `${value}%`}
                    className="text-muted-foreground"
                  />
                  <Tooltip 
                    formatter={(value: number) => [`${value.toFixed(1)}%`, "Completion Rate"]}
                    labelFormatter={(label) => `Month: ${label}`}
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="completionRate"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                No trend data available yet
              </div>
            )}
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Request Status Distribution
            </CardTitle>
            <CardDescription>Breakdown of all signature requests</CardDescription>
          </CardHeader>
          <CardContent>
            {statusDistribution.length > 0 ? (
              <div className="flex items-center gap-4">
                <ResponsiveContainer width="50%" height={200}>
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-2">
                  {statusDistribution.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <Badge variant="secondary">{item.value}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                No request data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Performance by Role */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="w-5 h-5" />
              Performance by Role
            </CardTitle>
            <CardDescription>Average signing time and completion rate by role</CardDescription>
          </CardHeader>
          <CardContent>
            {roleBreakdown.some(r => r.count > 0) ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={roleBreakdown} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    type="number" 
                    domain={[0, 100]}
                    tickFormatter={(value) => `${value}%`}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    type="category" 
                    dataKey="role" 
                    tick={{ fontSize: 12 }}
                    width={80}
                  />
                  <Tooltip 
                    formatter={(value: number, name: string) => {
                      if (name === "completionRate") return [`${value.toFixed(1)}%`, "Completion Rate"];
                      return [value, name];
                    }}
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar 
                    dataKey="completionRate" 
                    fill="hsl(var(--primary))" 
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                No role data available
              </div>
            )}
            
            {/* Role details table */}
            <div className="mt-4 space-y-2">
              {roleBreakdown.filter(r => r.count > 0).map((role, index) => (
                <div key={index} className="flex items-center justify-between text-sm p-2 rounded-lg bg-muted/50">
                  <span className="font-medium">{role.role}</span>
                  <div className="flex gap-4 text-muted-foreground">
                    <span>Avg: {formatTime(role.averageTime)}</span>
                    <span>{role.count} requests</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance by Document Type */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Performance by Document Type
            </CardTitle>
            <CardDescription>Comparison between pay applications and change orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {documentTypeBreakdown.map((doc, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{doc.label}</span>
                    <Badge variant="outline">{doc.count} requests</Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Completion Rate</span>
                      <span>{doc.completionRate.toFixed(1)}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${Math.min(doc.completionRate, 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Average Time to Sign</span>
                    <span>{formatTime(doc.averageTime)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
