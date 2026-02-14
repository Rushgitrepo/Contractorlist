import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useProjects } from "@/hooks/Subcontractor dashboard/useProjects";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Subcontractor dashboard/ui/card";
import { Button } from "@/components/Subcontractor dashboard/ui/button";
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
  MessageSquare,
  Clock,
  CheckCircle,
  FileQuestion,
  AlertTriangle,
} from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const statusStyles = {
  draft: { bg: "bg-muted", text: "text-muted-foreground", icon: FileQuestion },
  open: { bg: "bg-amber-500/10", text: "text-amber-600", icon: Clock },
  answered: { bg: "bg-blue-500/10", text: "text-blue-600", icon: CheckCircle },
  closed: { bg: "bg-green-600/10", text: "text-green-600", icon: CheckCircle },
};

export default function RFIManagementPage() {
  const { data: projects } = useProjects();
  const [selectedProjectId, setSelectedProjectId] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("all");

  const { data: rfis, isLoading } = useQuery({
    queryKey: ["all-rfis", selectedProjectId],
    queryFn: async () => {
      let query = supabase
        .from("rfis")
        .select(`
          *,
          project:projects(id, name),
          assigned_to_profile:profiles!rfis_assigned_to_fkey(full_name, email),
          created_by_profile:profiles!rfis_created_by_fkey(full_name)
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

  const summary = rfis?.reduce(
    (acc, rfi) => {
      acc.total++;
      if (rfi.status === "open") acc.open++;
      if (rfi.status === "answered") acc.answered++;
      if (rfi.status === "closed") acc.closed++;
      if (rfi.due_date && new Date(rfi.due_date) < new Date() && rfi.status === "open") {
        acc.overdue++;
      }
      return acc;
    },
    { total: 0, open: 0, answered: 0, closed: 0, overdue: 0 }
  ) || { total: 0, open: 0, answered: 0, closed: 0, overdue: 0 };

  const filteredRFIs = rfis?.filter((rfi) => {
    if (activeTab === "all") return true;
    if (activeTab === "overdue") {
      return rfi.due_date && new Date(rfi.due_date) < new Date() && rfi.status === "open";
    }
    return rfi.status === activeTab;
  });

  const getDueDateBadge = (dueDate: string | null, status: string) => {
    if (!dueDate) return null;
    const due = new Date(dueDate);
    const today = new Date();
    const daysUntil = differenceInDays(due, today);

    if (status === "closed" || status === "answered") {
      return <span className="text-muted-foreground">{format(due, "MMM d, yyyy")}</span>;
    }

    if (daysUntil < 0) {
      return <Badge variant="destructive">{Math.abs(daysUntil)}d overdue</Badge>;
    }
    if (daysUntil <= 3) {
      return <Badge className="bg-amber-500">Due in {daysUntil}d</Badge>;
    }
    return <span className="text-muted-foreground">{format(due, "MMM d, yyyy")}</span>;
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">RFIs & Submittals</h1>
          <p className="text-muted-foreground">Manage Requests for Information across all projects</p>
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
            <CardTitle className="text-sm font-medium">Total RFIs</CardTitle>
            <MessageSquare className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Open</CardTitle>
            <Clock className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">{summary.open}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Answered</CardTitle>
            <CheckCircle className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{summary.answered}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Closed</CardTitle>
            <CheckCircle className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{summary.closed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertTriangle className="w-4 h-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{summary.overdue}</div>
          </CardContent>
        </Card>
      </div>

      {/* RFI Table */}
      <Card>
        <CardHeader>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="open">Open</TabsTrigger>
              <TabsTrigger value="answered">Answered</TabsTrigger>
              <TabsTrigger value="closed">Closed</TabsTrigger>
              <TabsTrigger value="overdue">Overdue</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : filteredRFIs?.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileQuestion className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p>No RFIs found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>RFI #</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRFIs?.map((rfi: any) => {
                  const StatusIcon = statusStyles[rfi.status as keyof typeof statusStyles]?.icon || FileQuestion;
                  return (
                    <TableRow key={rfi.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-mono text-xs">
                        <Link to={`/subcontractor-dashboard/projects/${rfi.project_id}?tab=rfis`} className="hover:underline">
                          RFI-{rfi.rfi_number}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link to={`/subcontractor-dashboard/projects/${rfi.project_id}`} className="hover:underline text-primary">
                          {rfi.project?.name}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{rfi.title}</p>
                        {rfi.description && (
                          <p className="text-xs text-muted-foreground truncate max-w-[250px]">
                            {rfi.description}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded uppercase",
                            statusStyles[rfi.status as keyof typeof statusStyles]?.bg,
                            statusStyles[rfi.status as keyof typeof statusStyles]?.text
                          )}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {rfi.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {rfi.assigned_to_profile?.full_name || "Unassigned"}
                      </TableCell>
                      <TableCell>{getDueDateBadge(rfi.due_date, rfi.status)}</TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {format(new Date(rfi.created_at), "MMM d, yyyy")}
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
