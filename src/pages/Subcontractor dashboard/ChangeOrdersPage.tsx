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
  ArrowLeftRight,
  Clock,
  CheckCircle,
  XCircle,
  Ban,
  DollarSign,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const statusStyles = {
  pending: { bg: "bg-amber-500/10", text: "text-amber-600", icon: Clock },
  approved: { bg: "bg-green-600/10", text: "text-green-600", icon: CheckCircle },
  rejected: { bg: "bg-destructive/10", text: "text-destructive", icon: XCircle },
  void: { bg: "bg-muted", text: "text-muted-foreground", icon: Ban },
};

export default function ChangeOrdersPage() {
  const { data: projects } = useProjects();
  const [selectedProjectId, setSelectedProjectId] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("all");

  const { data: changeOrders, isLoading } = useQuery({
    queryKey: ["all-change-orders", selectedProjectId],
    queryFn: async () => {
      let query = supabase
        .from("change_orders")
        .select(`
          *,
          project:projects(id, name),
          created_by_profile:profiles!change_orders_created_by_fkey(full_name)
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

  const summary = changeOrders?.reduce(
    (acc, co) => {
      acc.total++;
      const amount = Number(co.amount);
      if (co.status === "pending") {
        acc.pending++;
        acc.pendingAmount += amount;
      }
      if (co.status === "approved") {
        acc.approved++;
        acc.approvedAmount += amount;
      }
      if (co.status === "rejected") acc.rejected++;
      return acc;
    },
    { total: 0, pending: 0, approved: 0, rejected: 0, pendingAmount: 0, approvedAmount: 0 }
  ) || { total: 0, pending: 0, approved: 0, rejected: 0, pendingAmount: 0, approvedAmount: 0 };

  const filteredCOs = changeOrders?.filter((co) => {
    if (activeTab === "all") return true;
    return co.status === activeTab;
  });

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Change Order Management</h1>
          <p className="text-muted-foreground">Track change orders across all projects</p>
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
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total COs</CardTitle>
            <ArrowLeftRight className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">{summary.pending}</div>
            <p className="text-xs text-muted-foreground">
              ${summary.pendingAmount.toLocaleString()}
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
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="w-4 h-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{summary.rejected}</div>
          </CardContent>
        </Card>
      </div>

      {/* Change Orders Table */}
      <Card>
        <CardHeader>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : filteredCOs?.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <ArrowLeftRight className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p>No change orders found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>CO #</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCOs?.map((co: any) => {
                  const StatusIcon = statusStyles[co.status as keyof typeof statusStyles]?.icon || Clock;
                  const amount = Number(co.amount);
                  return (
                    <TableRow key={co.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-mono text-xs">
                        <Link to={`/subcontractor-dashboard/projects/${co.project_id}?tab=change-orders`} className="hover:underline">
                          CO-{co.co_number}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link to={`/subcontractor-dashboard/projects/${co.project_id}`} className="hover:underline text-primary">
                          {co.project?.name}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{co.title}</p>
                        {co.description && (
                          <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {co.description}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className={cn(
                          "font-semibold flex items-center gap-1",
                          amount >= 0 ? "text-green-600" : "text-destructive"
                        )}>
                          {amount >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {amount >= 0 ? "+" : ""}${Math.abs(amount).toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded uppercase",
                            statusStyles[co.status as keyof typeof statusStyles]?.bg,
                            statusStyles[co.status as keyof typeof statusStyles]?.text
                          )}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {co.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{co.reason || "—"}</TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {format(new Date(co.created_at), "MMM d, yyyy")}
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
