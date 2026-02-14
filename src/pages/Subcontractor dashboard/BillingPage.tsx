import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useProjects } from "@/hooks/Subcontractor dashboard/useProjects";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Subcontractor dashboard/ui/card";
import { Badge } from "@/components/Subcontractor dashboard/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/Subcontractor dashboard/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Subcontractor dashboard/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/Subcontractor dashboard/ui/table";
import {
  Receipt,
  FileText,
  Clock,
  CheckCircle,
  Send,
  DollarSign,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const statusStyles: Record<string, { bg: string; text: string; icon: typeof Clock }> = {
  draft: { bg: "bg-muted", text: "text-muted-foreground", icon: FileText },
  submitted: { bg: "bg-blue-500/10", text: "text-blue-600", icon: Send },
  approved: { bg: "bg-green-600/10", text: "text-green-600", icon: CheckCircle },
  paid: { bg: "bg-primary/10", text: "text-primary", icon: DollarSign },
};

export default function BillingPage() {
  const { data: projects } = useProjects();
  const [selectedProjectId, setSelectedProjectId] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("all");

  const { data: payApplications, isLoading } = useQuery({
    queryKey: ["all-pay-applications", selectedProjectId],
    queryFn: async () => {
      let query = supabase
        .from("pay_applications")
        .select(`
          *,
          project:projects(id, name)
        `)
        .order("created_at", { ascending: false });

      if (selectedProjectId !== "all") {
        query = query.eq("project_id", selectedProjectId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const summary = payApplications?.reduce(
    (acc, pa) => {
      acc.total++;
      const paymentDue = Number(pa.current_payment_due);
      acc.totalBilled += paymentDue;

      if (pa.status === "draft") acc.draft++;
      if (pa.status === "submitted") {
        acc.submitted++;
        acc.submittedAmount += paymentDue;
      }
      if (pa.status === "approved") {
        acc.approved++;
        acc.approvedAmount += paymentDue;
      }
      if (pa.status === "paid") {
        acc.paid++;
        acc.paidAmount += paymentDue;
      }
      return acc;
    },
    { total: 0, draft: 0, submitted: 0, approved: 0, paid: 0, totalBilled: 0, submittedAmount: 0, approvedAmount: 0, paidAmount: 0 }
  ) || { total: 0, draft: 0, submitted: 0, approved: 0, paid: 0, totalBilled: 0, submittedAmount: 0, approvedAmount: 0, paidAmount: 0 };

  const filteredApps = payApplications?.filter((pa) => {
    if (activeTab === "all") return true;
    return pa.status === activeTab;
  });

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">AIA Progress Billing</h1>
          <p className="text-muted-foreground">Track pay applications across all projects</p>
        </div>
        <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="All Projects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            {projects?.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Apps</CardTitle>
            <Receipt className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Draft</CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.draft}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Submitted</CardTitle>
            <Send className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{summary.submitted}</div>
            <p className="text-xs text-muted-foreground">
              ${summary.submittedAmount.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{summary.approved}</div>
            <p className="text-xs text-muted-foreground">
              ${summary.approvedAmount.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
            <DollarSign className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{summary.paid}</div>
            <p className="text-xs text-muted-foreground">
              ${summary.paidAmount.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pay Applications Table */}
      <Card>
        <CardHeader>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="draft">Draft</TabsTrigger>
              <TabsTrigger value="submitted">Submitted</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="paid">Paid</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : filteredApps?.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Receipt className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p>No pay applications found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>App #</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Contract Value</TableHead>
                  <TableHead>Total Completed</TableHead>
                  <TableHead>Current Due</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApps?.map((pa: any) => {
                  const StatusIcon = statusStyles[pa.status]?.icon || FileText;
                  return (
                    <TableRow key={pa.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-mono text-xs">
                        <Link to={`/subcontractor-dashboard/projects/${pa.project_id}?tab=budget`} className="hover:underline">
                          #{pa.application_number}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link to={`/subcontractor-dashboard/projects/${pa.project_id}`} className="hover:underline text-primary">
                          {pa.project?.name}
                        </Link>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {format(new Date(pa.period_from), "MMM d")} - {format(new Date(pa.period_to), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="font-medium">
                        ${Number(pa.contract_to_date).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        ${Number(pa.total_completed).toLocaleString()}
                      </TableCell>
                      <TableCell className="font-semibold text-primary">
                        ${Number(pa.current_payment_due).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded uppercase",
                            statusStyles[pa.status]?.bg,
                            statusStyles[pa.status]?.text
                          )}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {pa.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
