import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar, Building2, User, FileText } from "lucide-react";
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
import { PayApplication, useBudgetMutations, BudgetItem } from "@/hooks/Subcontractor dashboard/useBudget";

interface EditPayApplicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application: PayApplication;
  projectId: string;
  budgetItems: BudgetItem[];
  originalContract: number;
  approvedChanges: number;
  previousCertificates: number;
}

export default function EditPayApplicationDialog({
  open,
  onOpenChange,
  application,
  projectId,
  budgetItems,
  originalContract,
  approvedChanges,
  previousCertificates,
}: EditPayApplicationDialogProps) {
  const { updatePayApplication } = useBudgetMutations(projectId);

  const [formData, setFormData] = useState({
    period_from: "",
    period_to: "",
    application_date: "",
    architect_name: "",
    architect_project_number: "",
    owner_name: "",
    contract_date: "",
    notes: "",
  });

  useEffect(() => {
    if (application) {
      setFormData({
        period_from: application.period_from,
        period_to: application.period_to,
        application_date: application.application_date || format(new Date(), "yyyy-MM-dd"),
        architect_name: application.architect_name || "",
        architect_project_number: application.architect_project_number || "",
        owner_name: application.owner_name || "",
        contract_date: application.contract_date || "",
        notes: application.notes || "",
      });
    }
  }, [application]);

  const calculateTotalsFromBudgetItems = () => {
    return budgetItems.reduce(
      (acc, item) => {
        const totalCompleted = item.work_completed_previous + item.work_completed_current + item.materials_stored;
        const retainage = totalCompleted * (item.retainage_percent / 100);
        return {
          totalCompleted: acc.totalCompleted + totalCompleted,
          retainage: acc.retainage + retainage,
        };
      },
      { totalCompleted: 0, retainage: 0 }
    );
  };

  const handleRecalculate = () => {
    const totals = calculateTotalsFromBudgetItems();
    const contractToDate = originalContract + approvedChanges;
    const earnedLessRetainage = totals.totalCompleted - totals.retainage;
    const currentPayment = earnedLessRetainage - previousCertificates;

    updatePayApplication.mutate({
      id: application.id,
      ...formData,
      original_contract: originalContract,
      change_orders_total: approvedChanges,
      contract_to_date: contractToDate,
      total_completed: totals.totalCompleted,
      retainage_amount: totals.retainage,
      total_earned_less_retainage: earnedLessRetainage,
      less_previous_certificates: previousCertificates,
      current_payment_due: currentPayment > 0 ? currentPayment : 0,
      notes: formData.notes || null,
    });

    onOpenChange(false);
  };

  const handleSave = () => {
    updatePayApplication.mutate({
      id: application.id,
      period_from: formData.period_from,
      period_to: formData.period_to,
      notes: formData.notes || null,
      application_date: formData.application_date || null,
      architect_name: formData.architect_name || null,
      architect_project_number: formData.architect_project_number || null,
      owner_name: formData.owner_name || null,
      contract_date: formData.contract_date || null,
    } as any);

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Pay Application #{application.application_number}</DialogTitle>
          <DialogDescription>
            Update application details. Only draft applications can be edited.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Period Dates */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Calendar className="w-4 h-4" />
              Billing Period
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Period From</Label>
                <Input
                  type="date"
                  value={formData.period_from}
                  onChange={(e) => setFormData({ ...formData, period_from: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Period To</Label>
                <Input
                  type="date"
                  value={formData.period_to}
                  onChange={(e) => setFormData({ ...formData, period_to: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Application Date</Label>
                <Input
                  type="date"
                  value={formData.application_date}
                  onChange={(e) => setFormData({ ...formData, application_date: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Contract Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <FileText className="w-4 h-4" />
              Contract Information
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Contract Date</Label>
                <Input
                  type="date"
                  value={formData.contract_date}
                  onChange={(e) => setFormData({ ...formData, contract_date: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Owner Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <User className="w-4 h-4" />
              Owner
            </div>
            <div className="space-y-2">
              <Label>Owner Name</Label>
              <Input
                value={formData.owner_name}
                onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}
                placeholder="Property owner or client name"
              />
            </div>
          </div>

          {/* Architect Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Building2 className="w-4 h-4" />
              Architect
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Architect Name</Label>
                <Input
                  value={formData.architect_name}
                  onChange={(e) => setFormData({ ...formData, architect_name: e.target.value })}
                  placeholder="Architect firm name"
                />
              </div>
              <div className="space-y-2">
                <Label>Project Number</Label>
                <Input
                  value={formData.architect_project_number}
                  onChange={(e) => setFormData({ ...formData, architect_project_number: e.target.value })}
                  placeholder="Architect's project #"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any notes for this billing period..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="secondary" onClick={handleRecalculate}>
            Recalculate & Save
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
