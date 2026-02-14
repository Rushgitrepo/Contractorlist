import { useState } from "react";
import { format } from "date-fns";
import { DollarSign, Plus, Trash2 } from "lucide-react";
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
} from "@/components/Subcontractor dashboard/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/Subcontractor dashboard/ui/table";
import { useRetainageReleases, useRetainageMutations, RetainageRelease } from "@/hooks/Subcontractor dashboard/useRetainage";

interface RetainageReleaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  totalRetainage: number;
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

export default function RetainageReleaseDialog({
  open,
  onOpenChange,
  projectId,
  totalRetainage,
}: RetainageReleaseDialogProps) {
  const { data: releases = [], isLoading } = useRetainageReleases(projectId);
  const { createRelease, deleteRelease } = useRetainageMutations(projectId);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newRelease, setNewRelease] = useState({
    amount: "",
    release_date: format(new Date(), "yyyy-MM-dd"),
    description: "",
  });

  const totalReleased = releases.reduce((sum, r) => sum + Number(r.amount), 0);
  const remainingRetainage = totalRetainage - totalReleased;

  const handleAddRelease = () => {
    if (!newRelease.amount || Number(newRelease.amount) <= 0) return;

    createRelease.mutate({
      project_id: projectId,
      amount: Number(newRelease.amount),
      release_date: newRelease.release_date,
      description: newRelease.description || null,
    });

    setNewRelease({
      amount: "",
      release_date: format(new Date(), "yyyy-MM-dd"),
      description: "",
    });
    setShowAddForm(false);
  };

  const handleDeleteRelease = (release: RetainageRelease) => {
    if (confirm("Are you sure you want to delete this retainage release?")) {
      deleteRelease.mutate(release.id);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Retainage Management</DialogTitle>
          <DialogDescription>
            Track and release retainage at project milestones or completion.
          </DialogDescription>
        </DialogHeader>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="text-xs text-muted-foreground">Total Retainage</p>
            <p className="text-lg font-semibold text-warning">{formatCurrency(totalRetainage)}</p>
          </div>
          <div className="p-4 bg-success/10 rounded-lg">
            <p className="text-xs text-muted-foreground">Released</p>
            <p className="text-lg font-semibold text-success">{formatCurrency(totalReleased)}</p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="text-xs text-muted-foreground">Remaining</p>
            <p className="text-lg font-semibold">{formatCurrency(remainingRetainage)}</p>
          </div>
        </div>

        {/* Releases Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : releases.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No retainage releases recorded yet.
                  </TableCell>
                </TableRow>
              ) : (
                releases.map((release) => (
                  <TableRow key={release.id}>
                    <TableCell>{format(new Date(release.release_date), "MMM d, yyyy")}</TableCell>
                    <TableCell>{release.description || "—"}</TableCell>
                    <TableCell className="text-right font-mono text-success">
                      {formatCurrency(release.amount)}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={() => handleDeleteRelease(release)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Add Release Form */}
        {showAddForm ? (
          <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
            <div className="flex items-center gap-2 text-sm font-medium">
              <DollarSign className="w-4 h-4" />
              New Retainage Release
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Amount</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={newRelease.amount}
                  onChange={(e) => setNewRelease({ ...newRelease, amount: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label>Release Date</Label>
                <Input
                  type="date"
                  value={newRelease.release_date}
                  onChange={(e) => setNewRelease({ ...newRelease, release_date: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={newRelease.description}
                onChange={(e) => setNewRelease({ ...newRelease, description: e.target.value })}
                placeholder="e.g., 50% release at substantial completion"
                rows={2}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddRelease} disabled={!newRelease.amount}>
                Add Release
              </Button>
            </div>
          </div>
        ) : (
          <Button variant="outline" onClick={() => setShowAddForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Retainage Release
          </Button>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
