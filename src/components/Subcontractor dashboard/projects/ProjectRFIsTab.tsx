import { useState } from "react";
import { useProjectRFIs, useCreateRFI } from "@/hooks/Subcontractor dashboard/useProjectDetail";
import { useProjectMembers } from "@/hooks/Subcontractor dashboard/useProjectDetail";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Subcontractor dashboard/ui/select";
import { Plus, Loader2, FileQuestion, Clock, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import RFIDetailDialog from "./RFIDetailDialog";

const statusStyles = {
  draft: { bg: "bg-muted", text: "text-muted-foreground", icon: FileQuestion },
  open: { bg: "bg-warning/10", text: "text-warning", icon: Clock },
  answered: { bg: "bg-info/10", text: "text-info", icon: CheckCircle },
  closed: { bg: "bg-success/10", text: "text-success", icon: XCircle },
};

interface ProjectRFIsTabProps {
  projectId: string;
}

export default function ProjectRFIsTab({ projectId }: ProjectRFIsTabProps) {
  const { data: rfis, isLoading } = useProjectRFIs(projectId);
  const { data: members } = useProjectMembers(projectId);
  const createRFI = useCreateRFI(projectId);

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [dueDate, setDueDate] = useState("");
  
  const [selectedRFI, setSelectedRFI] = useState<any>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createRFI.mutateAsync({
      title,
      description: description || undefined,
      assigned_to: assignedTo || undefined,
      due_date: dueDate || undefined,
    });
    setTitle("");
    setDescription("");
    setAssignedTo("");
    setDueDate("");
    setOpen(false);
  };

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
        <h3 className="text-lg font-semibold">RFIs ({rfis?.length || 0})</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-1" />
              New RFI
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Create RFI</DialogTitle>
                <DialogDescription>
                  Submit a new Request for Information
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="RFI subject"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Detailed question or request..."
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="assignee">Assign To</Label>
                    <Select value={assignedTo} onValueChange={setAssignedTo}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select person" />
                      </SelectTrigger>
                      <SelectContent>
                        {members?.map((m: any) => (
                          <SelectItem key={m.user_id} value={m.user_id}>
                            {m.profile?.full_name || m.profile?.email}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createRFI.isPending || !title}>
                  {createRFI.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create RFI"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {rfis?.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <FileQuestion className="w-10 h-10 mx-auto mb-3 opacity-50" />
          <p>No RFIs yet</p>
          <p className="text-sm">Create an RFI to request information</p>
        </div>
      ) : (
        <div className="stat-card overflow-hidden">
          <table className="procore-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Status</th>
                <th>Assigned To</th>
                <th>Due Date</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {rfis?.map((rfi: any) => {
                const StatusIcon = statusStyles[rfi.status as keyof typeof statusStyles]?.icon || FileQuestion;
                return (
                  <tr 
                    key={rfi.id} 
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => {
                      setSelectedRFI(rfi);
                      setDetailOpen(true);
                    }}
                  >
                    <td className="font-mono text-xs">RFI-{rfi.rfi_number}</td>
                    <td>
                      <p className="font-medium">{rfi.title}</p>
                      {rfi.description && (
                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {rfi.description}
                        </p>
                      )}
                    </td>
                    <td>
                      <span className={cn(
                        "inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded uppercase",
                        statusStyles[rfi.status as keyof typeof statusStyles]?.bg,
                        statusStyles[rfi.status as keyof typeof statusStyles]?.text
                      )}>
                        <StatusIcon className="w-3 h-3" />
                        {rfi.status}
                      </span>
                    </td>
                    <td className="text-muted-foreground">
                      {rfi.assigned_to_profile?.full_name || "Unassigned"}
                    </td>
                    <td className="text-muted-foreground">
                      {rfi.due_date ? format(new Date(rfi.due_date), "MMM d, yyyy") : "—"}
                    </td>
                    <td className="text-muted-foreground text-xs">
                      {format(new Date(rfi.created_at), "MMM d, yyyy")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <RFIDetailDialog
        rfi={selectedRFI}
        projectId={projectId}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  );
}
