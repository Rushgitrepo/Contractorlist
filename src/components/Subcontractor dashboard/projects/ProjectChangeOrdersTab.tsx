import { useState } from "react";
import { useProjectChangeOrders, useCreateChangeOrder, useProjectMembers } from "@/hooks/Subcontractor dashboard/useProjectDetail";
import { Button } from "@/components/Subcontractor dashboard/ui/button";
import { Input } from "@/components/Subcontractor dashboard/ui/input";
import { Label } from "@/components/Subcontractor dashboard/ui/label";
import { Textarea } from "@/components/Subcontractor dashboard/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/Subcontractor dashboard/ui/dialog";
import { Plus, Loader2, FileText, Clock, CheckCircle, XCircle, Ban } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import ChangeOrderDetailDialog from "./ChangeOrderDetailDialog";

const statusStyles = {
  pending: { bg: "bg-warning/10", text: "text-warning", icon: Clock },
  approved: { bg: "bg-success/10", text: "text-success", icon: CheckCircle },
  rejected: { bg: "bg-destructive/10", text: "text-destructive", icon: XCircle },
  void: { bg: "bg-muted", text: "text-muted-foreground", icon: Ban },
};

interface ProjectChangeOrdersTabProps {
  projectId: string;
  projectName: string;
  projectLocation: string;
  originalContract?: number;
  approvedChanges?: number;
}

export default function ProjectChangeOrdersTab({ 
  projectId, 
  projectName, 
  projectLocation,
  originalContract,
  approvedChanges,
}: ProjectChangeOrdersTabProps) {
  const { data: changeOrders, isLoading } = useProjectChangeOrders(projectId);
  const { data: members } = useProjectMembers(projectId);
  const createChangeOrder = useCreateChangeOrder(projectId);

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");

  const [selectedCO, setSelectedCO] = useState<any>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createChangeOrder.mutateAsync({
      title,
      description: description || undefined,
      amount: parseFloat(amount) || 0,
      reason: reason || undefined,
    });
    setTitle("");
    setDescription("");
    setAmount("");
    setReason("");
    setOpen(false);
  };

  const totalPending = changeOrders
    ?.filter((co: any) => co.status === "pending")
    .reduce((sum: number, co: any) => sum + Number(co.amount), 0) || 0;

  const totalApproved = changeOrders
    ?.filter((co: any) => co.status === "approved")
    .reduce((sum: number, co: any) => sum + Number(co.amount), 0) || 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Change Orders ({changeOrders?.length || 0})</h3>
          <div className="flex gap-4 text-sm mt-1">
            <span className="text-warning">Pending: ${totalPending.toLocaleString()}</span>
            <span className="text-success">Approved: ${totalApproved.toLocaleString()}</span>
          </div>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-1" />
              New Change Order
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Create Change Order</DialogTitle>
                <DialogDescription>
                  Submit a new change order request
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Change order subject"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="amount">Amount ($) *</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="reason">Reason</Label>
                  <Input
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="e.g., Owner request, unforeseen conditions"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Detailed description of the change..."
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createChangeOrder.isPending || !title || !amount}>
                  {createChangeOrder.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {changeOrders?.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <FileText className="w-10 h-10 mx-auto mb-3 opacity-50" />
          <p>No change orders yet</p>
          <p className="text-sm">Create a change order to track scope changes</p>
        </div>
      ) : (
        <div className="stat-card overflow-hidden">
          <table className="procore-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Reason</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {changeOrders?.map((co: any) => {
                const StatusIcon = statusStyles[co.status as keyof typeof statusStyles]?.icon || Clock;
                return (
                  <tr 
                    key={co.id}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => {
                      setSelectedCO(co);
                      setDetailOpen(true);
                    }}
                  >
                    <td className="font-mono text-xs">CO-{co.co_number}</td>
                    <td>
                      <p className="font-medium">{co.title}</p>
                      {co.description && (
                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {co.description}
                        </p>
                      )}
                    </td>
                    <td className={cn(
                      "font-semibold",
                      Number(co.amount) >= 0 ? "text-success" : "text-destructive"
                    )}>
                      {Number(co.amount) >= 0 ? "+" : ""}${Number(co.amount).toLocaleString()}
                    </td>
                    <td>
                      <span className={cn(
                        "inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded uppercase",
                        statusStyles[co.status as keyof typeof statusStyles]?.bg,
                        statusStyles[co.status as keyof typeof statusStyles]?.text
                      )}>
                        <StatusIcon className="w-3 h-3" />
                        {co.status}
                      </span>
                    </td>
                    <td className="text-muted-foreground">{co.reason || "—"}</td>
                    <td className="text-muted-foreground text-xs">
                      {format(new Date(co.created_at), "MMM d, yyyy")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <ChangeOrderDetailDialog
        changeOrder={selectedCO}
        projectId={projectId}
        projectName={projectName}
        projectLocation={projectLocation}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        contractInfo={{
          originalContract,
          previousChanges: approvedChanges,
        }}
        adminEmails={
          members
            ?.filter((m: any) => m.role === "owner" || m.role === "gc")
            .map((m: any) => ({
              email: m.profile?.email || "",
              name: m.profile?.full_name || null,
            }))
            .filter((a: any) => a.email) || []
        }
      />
    </div>
  );
}
