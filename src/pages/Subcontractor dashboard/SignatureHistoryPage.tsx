import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/Subcontractor dashboard/ui/card";
import { Badge } from "@/components/Subcontractor dashboard/ui/badge";
import { Button } from "@/components/Subcontractor dashboard/ui/button";
import { Input } from "@/components/Subcontractor dashboard/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/Subcontractor dashboard/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Subcontractor dashboard/ui/select";
import {
  Loader2,
  Search,
  FileSignature,
  CheckCircle2,
  Clock,
  XCircle,
  ExternalLink,
  FileText,
  DollarSign,
  FolderKanban,
} from "lucide-react";
import { useSignatureHistory } from "@/hooks/Subcontractor dashboard/useSignatureHistory";
import { format, formatDistanceToNow, isPast } from "date-fns";
import { cn } from "@/lib/utils";

const statusConfig: Record<string, { label: string; icon: React.ReactNode; className: string }> = {
  pending: {
    label: "Pending",
    icon: <Clock className="w-3 h-3" />,
    className: "bg-warning/10 text-warning border-warning/30",
  },
  signed: {
    label: "Signed",
    icon: <CheckCircle2 className="w-3 h-3" />,
    className: "bg-success/10 text-success border-success/30",
  },
  expired: {
    label: "Expired",
    icon: <XCircle className="w-3 h-3" />,
    className: "bg-destructive/10 text-destructive border-destructive/30",
  },
  cancelled: {
    label: "Cancelled",
    icon: <XCircle className="w-3 h-3" />,
    className: "bg-muted text-muted-foreground border-muted",
  },
};

const roleLabels: Record<string, string> = {
  contractor: "Contractor",
  architect: "Architect",
  owner: "Owner",
};

export default function SignatureHistoryPage() {
  const { data: history = [], isLoading } = useSignatureHistory();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [projectFilter, setProjectFilter] = useState<string>("all");

  // Get unique projects for filter
  const projects = useMemo(() => {
    const uniqueProjects = new Map<string, string>();
    history.forEach((item) => {
      uniqueProjects.set(item.project_id, item.project_name);
    });
    return Array.from(uniqueProjects.entries()).map(([id, name]) => ({ id, name }));
  }, [history]);

  // Compute actual status (check if expired)
  const getActualStatus = (item: typeof history[0]) => {
    if (item.status === "signed") return "signed";
    if (item.status === "cancelled") return "cancelled";
    if (isPast(new Date(item.expires_at))) return "expired";
    return "pending";
  };

  // Filter history
  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      const actualStatus = getActualStatus(item);

      const matchesSearch =
        searchQuery === "" ||
        item.recipient_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.recipient_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.project_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.document_title.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "all" || actualStatus === statusFilter;
      const matchesType = typeFilter === "all" || item.document_type === typeFilter;
      const matchesProject = projectFilter === "all" || item.project_id === projectFilter;

      return matchesSearch && matchesStatus && matchesType && matchesProject;
    });
  }, [history, searchQuery, statusFilter, typeFilter, projectFilter]);

  // Summary stats
  const stats = useMemo(() => {
    const pending = history.filter(h => getActualStatus(h) === "pending").length;
    const signed = history.filter(h => h.status === "signed").length;
    const expired = history.filter(h => getActualStatus(h) === "expired").length;
    return { total: history.length, pending, signed, expired };
  }, [history]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FileSignature className="w-6 h-6" />
          Signature Request History
        </h1>
        <p className="text-muted-foreground">
          View all signature requests across your projects
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <FileSignature className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Requests</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-warning" />
              <div>
                <p className="text-2xl font-bold text-warning">{stats.pending}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-success" />
              <div>
                <p className="text-2xl font-bold text-success">{stats.signed}</p>
                <p className="text-xs text-muted-foreground">Signed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-destructive" />
              <div>
                <p className="text-2xl font-bold text-destructive">{stats.expired}</p>
                <p className="text-xs text-muted-foreground">Expired</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Requests</CardTitle>
          <CardDescription>
            Filter and search through your signature request history
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by recipient, project, or document..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="signed">Signed</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Document Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="pay_application">Pay Applications</SelectItem>
                <SelectItem value="change_order">Change Orders</SelectItem>
              </SelectContent>
            </Select>
            <Select value={projectFilter} onValueChange={setProjectFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          {filteredHistory.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileSignature className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No signature requests found</p>
              <p className="text-sm">
                {history.length === 0
                  ? "You haven't sent any signature requests yet."
                  : "Try adjusting your filters."}
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Requested By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHistory.map((item) => {
                    const actualStatus = getActualStatus(item);
                    const config = statusConfig[actualStatus];

                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {item.document_type === "change_order" ? (
                              <FileText className="w-4 h-4 text-muted-foreground" />
                            ) : (
                              <DollarSign className="w-4 h-4 text-muted-foreground" />
                            )}
                            <div>
                              <p className="font-medium">
                                {item.document_type === "change_order"
                                  ? `CO-${item.document_number}`
                                  : `Pay App #${item.document_number}`}
                              </p>
                              <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                                {item.document_title}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Link
                            to={`/subcontractor-dashboard/projects/${item.project_id}`}
                            className="flex items-center gap-1 text-sm hover:underline text-primary"
                          >
                            <FolderKanban className="w-3 h-3" />
                            {item.project_name}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm">
                              {item.recipient_name || item.recipient_email}
                            </p>
                            {item.recipient_name && (
                              <p className="text-xs text-muted-foreground">
                                {item.recipient_email}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {roleLabels[item.signature_type] || item.signature_type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {item.requested_by_name || "—"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{format(new Date(item.created_at), "MMM d, yyyy")}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn("gap-1", config.className)}>
                            {config.icon}
                            {config.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Link to={`/subcontractor-dashboard/projects/${item.project_id}`}>
                            <Button variant="ghost" size="icon" title="View project">
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
