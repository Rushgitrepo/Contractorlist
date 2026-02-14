import { useState } from "react";
import { useProjects } from "@/hooks/Subcontractor dashboard/useProjects";
import {
  useLienWaivers,
  useLienWaiverSummary,
  useCreateLienWaiver,
  useUpdateLienWaiver,
  useDeleteLienWaiver,
  WAIVER_TYPE_LABELS,
  WAIVER_STATUS_LABELS,
  LienWaiver,
} from "@/hooks/Subcontractor dashboard/useLienWaivers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Subcontractor dashboard/ui/card";
import { Button } from "@/components/Subcontractor dashboard/ui/button";
import { Badge } from "@/components/Subcontractor dashboard/ui/badge";
import { Input } from "@/components/Subcontractor dashboard/ui/input";
import { Label } from "@/components/Subcontractor dashboard/ui/label";
import { Textarea } from "@/components/Subcontractor dashboard/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Subcontractor dashboard/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/Subcontractor dashboard/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/Subcontractor dashboard/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/Subcontractor dashboard/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Subcontractor dashboard/ui/tabs";
import { ScrollArea } from "@/components/Subcontractor dashboard/ui/scroll-area";
import {
  FileText,
  Plus,
  MoreHorizontal,
  Check,
  Clock,
  FileCheck,
  AlertCircle,
  DollarSign,
  Building2,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import type { Database } from "@/integrations/supabase/types";

type LienWaiverType = Database["public"]["Enums"]["lien_waiver_type"];

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  requested: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  received: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  approved: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export default function LienWaiverManagementPage() {
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const { data: waivers = [], isLoading: waiversLoading } = useLienWaivers(selectedProjectId || undefined);
  const { data: summary } = useLienWaiverSummary(selectedProjectId || undefined);
  const createWaiver = useCreateLienWaiver();
  const updateWaiver = useUpdateLienWaiver();
  const deleteWaiver = useDeleteLienWaiver();

  // Form state
  const [formData, setFormData] = useState({
    waiver_type: "conditional_partial" as LienWaiverType,
    amount: "",
    through_date: "",
    notes: "",
  });

  const handleCreateWaiver = () => {
    if (!selectedProjectId || !formData.amount) return;

    createWaiver.mutate(
      {
        project_id: selectedProjectId,
        waiver_type: formData.waiver_type,
        amount: parseFloat(formData.amount),
        through_date: formData.through_date || undefined,
        notes: formData.notes || undefined,
      },
      {
        onSuccess: () => {
          setCreateDialogOpen(false);
          setFormData({
            waiver_type: "conditional_partial",
            amount: "",
            through_date: "",
            notes: "",
          });
        },
      }
    );
  };

  const handleStatusChange = (waiver: LienWaiver, newStatus: string) => {
    updateWaiver.mutate({
      id: waiver.id,
      project_id: waiver.project_id,
      status: newStatus as any,
      received_at: newStatus === "received" ? new Date().toISOString() : undefined,
    });
  };

  const filteredWaivers = waivers.filter((w) => {
    if (activeTab === "all") return true;
    if (activeTab === "pending") return w.status === "draft" || w.status === "requested";
    if (activeTab === "received") return w.status === "received";
    if (activeTab === "approved") return w.status === "approved";
    return true;
  });

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Lien Waiver Management</h1>
          <p className="text-muted-foreground">Track and manage lien waivers from subcontractors</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Select Project" />
            </SelectTrigger>
            <SelectContent>
              {projects?.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={!selectedProjectId}>
                <Plus className="h-4 w-4 mr-2" />
                New Waiver
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Lien Waiver</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Waiver Type</Label>
                  <Select
                    value={formData.waiver_type}
                    onValueChange={(v) => setFormData({ ...formData, waiver_type: v as LienWaiverType })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(WAIVER_TYPE_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Amount</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Through Date</Label>
                  <Input
                    type="date"
                    value={formData.through_date}
                    onChange={(e) => setFormData({ ...formData, through_date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea
                    placeholder="Additional notes..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
                <Button
                  className="w-full"
                  onClick={handleCreateWaiver}
                  disabled={createWaiver.isPending || !formData.amount}
                >
                  {createWaiver.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Create Waiver
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted">
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{summary?.total || 0}</p>
                <p className="text-sm text-muted-foreground">Total Waivers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
                <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{summary?.pending || 0}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                <FileCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{summary?.approved || 0}</p>
                <p className="text-sm text-muted-foreground">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatCurrency(summary?.approvedAmount || 0)}</p>
                <p className="text-sm text-muted-foreground">Approved Value</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Waivers Table */}
      <Card>
        <CardHeader>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="received">Received</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          {waiversLoading || projectsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : !selectedProjectId ? (
            <div className="text-center py-12 text-muted-foreground">
              <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Select a project to view lien waivers</p>
            </div>
          ) : filteredWaivers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No lien waivers found</p>
            </div>
          ) : (
            <ScrollArea className="h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Subcontractor</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Through Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Notarized</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWaivers.map((waiver) => (
                    <TableRow key={waiver.id}>
                      <TableCell className="font-medium">
                        {WAIVER_TYPE_LABELS[waiver.waiver_type]}
                      </TableCell>
                      <TableCell>
                        {waiver.subcontractor?.company_name || "—"}
                      </TableCell>
                      <TableCell>{formatCurrency(waiver.amount)}</TableCell>
                      <TableCell>
                        {waiver.through_date
                          ? format(new Date(waiver.through_date), "MMM d, yyyy")
                          : "—"}
                      </TableCell>
                      <TableCell>
                        <Badge className={STATUS_COLORS[waiver.status]}>
                          {WAIVER_STATUS_LABELS[waiver.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {waiver.is_notarized ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {waiver.status === "draft" && (
                              <DropdownMenuItem onClick={() => handleStatusChange(waiver, "requested")}>
                                Mark as Requested
                              </DropdownMenuItem>
                            )}
                            {waiver.status === "requested" && (
                              <DropdownMenuItem onClick={() => handleStatusChange(waiver, "received")}>
                                Mark as Received
                              </DropdownMenuItem>
                            )}
                            {waiver.status === "received" && (
                              <DropdownMenuItem onClick={() => handleStatusChange(waiver, "approved")}>
                                Approve
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() =>
                                deleteWaiver.mutate({ id: waiver.id, projectId: waiver.project_id })
                              }
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
