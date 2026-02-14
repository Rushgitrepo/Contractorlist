import { useState } from "react";
import { format } from "date-fns";
import { Plus, FileText, CheckCircle, Clock, XCircle, DollarSign, Eye, Download, FileSpreadsheet, Edit, Unlock, PenLine } from "lucide-react";
import { Button } from "@/components/Subcontractor dashboard/ui/button";
import { Badge } from "@/components/Subcontractor dashboard/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/Subcontractor dashboard/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/Subcontractor dashboard/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/Subcontractor dashboard/ui/dropdown-menu";
import { Input } from "@/components/Subcontractor dashboard/ui/input";
import { Label } from "@/components/Subcontractor dashboard/ui/label";
import { Textarea } from "@/components/Subcontractor dashboard/ui/textarea";
import { Separator } from "@/components/Subcontractor dashboard/ui/separator";
import { PayApplication, useBudgetMutations, BudgetItem } from "@/hooks/Subcontractor dashboard/useBudget";
import { cn } from "@/lib/utils";
import { generateG702PDF, generateG703PDF, generateCombinedPDF } from "@/utils/aiaDocumentGenerator";
import { toast } from "sonner";
import EditPayApplicationDialog from "./EditPayApplicationDialog";
import RetainageReleaseDialog from "./RetainageReleaseDialog";
import PayAppAttachments from "./PayAppAttachments";
import SignatureCaptureDialog from "./SignatureCaptureDialog";
import { notifyProjectAdmins } from "@/hooks/Subcontractor dashboard/usePayAppNotifications";
import { useSignaturesForPDF } from "@/hooks/Subcontractor dashboard/useSignatures";

interface PayApplicationsListProps {
  projectId: string;
  projectName: string;
  projectLocation: string;
  applications: PayApplication[];
  budgetItems: BudgetItem[];
  originalContract: number;
  approvedChanges: number;
  isLoading: boolean;
  adminEmails?: Array<{ email: string; name: string | null }>;
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

const statusConfig: Record<string, { label: string; icon: React.ReactNode; className: string }> = {
  draft: { label: "Draft", icon: <FileText className="w-3 h-3" />, className: "bg-muted text-muted-foreground" },
  submitted: { label: "Submitted", icon: <Clock className="w-3 h-3" />, className: "bg-warning/10 text-warning" },
  approved: { label: "Approved", icon: <CheckCircle className="w-3 h-3" />, className: "bg-success/10 text-success" },
  rejected: { label: "Rejected", icon: <XCircle className="w-3 h-3" />, className: "bg-destructive/10 text-destructive" },
  paid: { label: "Paid", icon: <DollarSign className="w-3 h-3" />, className: "bg-primary/10 text-primary" },
};

export default function PayApplicationsList({
  projectId,
  projectName,
  projectLocation,
  applications,
  budgetItems,
  originalContract,
  approvedChanges,
  isLoading,
  adminEmails = [],
}: PayApplicationsListProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedApp, setSelectedApp] = useState<PayApplication | null>(null);
  const [editingApp, setEditingApp] = useState<PayApplication | null>(null);
  const [showRetainageDialog, setShowRetainageDialog] = useState(false);
  const [signingApp, setSigningApp] = useState<PayApplication | null>(null);
  const [newApp, setNewApp] = useState({
    period_from: "",
    period_to: "",
    notes: "",
  });

  // Fetch signatures for the selected app (for PDF export)
  const { data: selectedAppSignatures } = useSignaturesForPDF(selectedApp?.id || "");

  const { createPayApplication, updatePayApplication } = useBudgetMutations(projectId);

  // Calculate previous certificates for edit dialog
  const calculatePreviousCertificates = (excludeId?: string) => {
    return applications
      .filter(a => (a.status === 'approved' || a.status === 'paid') && a.id !== excludeId)
      .reduce((sum, a) => sum + a.current_payment_due, 0);
  };

  const totalRetainage = budgetItems.reduce((acc, item) => {
    const totalCompleted = item.work_completed_previous + item.work_completed_current + item.materials_stored;
    return acc + (totalCompleted * (item.retainage_percent / 100));
  }, 0);

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

  const handleCreateApplication = () => {
    const nextNumber = applications.length > 0 
      ? Math.max(...applications.map(a => a.application_number)) + 1 
      : 1;
    
    const totals = calculateTotalsFromBudgetItems();
    const contractToDate = originalContract + approvedChanges;
    const previousCertificates = applications
      .filter(a => a.status === 'approved' || a.status === 'paid')
      .reduce((sum, a) => sum + a.current_payment_due, 0);
    
    const earnedLessRetainage = totals.totalCompleted - totals.retainage;
    const currentPayment = earnedLessRetainage - previousCertificates;

    createPayApplication.mutate({
      project_id: projectId,
      application_number: nextNumber,
      period_from: newApp.period_from,
      period_to: newApp.period_to,
      status: 'draft',
      original_contract: originalContract,
      change_orders_total: approvedChanges,
      contract_to_date: contractToDate,
      total_completed: totals.totalCompleted,
      retainage_amount: totals.retainage,
      total_earned_less_retainage: earnedLessRetainage,
      less_previous_certificates: previousCertificates,
      current_payment_due: currentPayment > 0 ? currentPayment : 0,
      notes: newApp.notes || null,
      submitted_at: null,
      submitted_by: null,
      approved_at: null,
      approved_by: null,
    });

    setShowCreateDialog(false);
    setNewApp({ period_from: "", period_to: "", notes: "" });
  };

  const handleStatusChange = async (app: PayApplication, newStatus: string) => {
    const updates: Partial<PayApplication> = { status: newStatus as PayApplication['status'] };
    
    if (newStatus === 'submitted') {
      updates.submitted_at = new Date().toISOString();
    } else if (newStatus === 'approved') {
      updates.approved_at = new Date().toISOString();
    }

    updatePayApplication.mutate({ id: app.id, ...updates });
    setSelectedApp(null);

    // Send email notifications
    if (newStatus === 'submitted' || newStatus === 'approved') {
      const notificationType = newStatus === 'submitted' ? 'pay_app_submitted' : 'pay_app_approved';
      
      await notifyProjectAdmins(projectId, {
        type: notificationType,
        projectId,
        projectName,
        itemNumber: app.application_number,
        amount: app.current_payment_due,
        periodFrom: app.period_from,
        periodTo: app.period_to,
      });
    }
  };

  const projectInfo = {
    name: projectName,
    location: projectLocation,
  };

  const handleExportG702 = (app: PayApplication, signatures?: { contractor?: any; architect?: any }) => {
    try {
      generateG702PDF(app, projectInfo, budgetItems, signatures);
      toast.success("G702 Application exported successfully");
    } catch (error) {
      toast.error("Failed to export G702");
      console.error(error);
    }
  };

  const handleExportG703 = (app: PayApplication) => {
    try {
      generateG703PDF(app, projectInfo, budgetItems);
      toast.success("G703 Continuation Sheet exported successfully");
    } catch (error) {
      toast.error("Failed to export G703");
      console.error(error);
    }
  };

  const handleExportBoth = (app: PayApplication, signatures?: { contractor?: any; architect?: any }) => {
    try {
      generateCombinedPDF(app, projectInfo, budgetItems, signatures);
      toast.success("AIA Documents exported successfully");
    } catch (error) {
      toast.error("Failed to export documents");
      console.error(error);
    }
  };

  if (isLoading) {
    return <div className="p-4 text-center text-muted-foreground">Loading pay applications...</div>;
  }

  return (
    <>
      <div className="stat-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Pay Applications (G702)</h2>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setShowRetainageDialog(true)}>
              <Unlock className="w-4 h-4 mr-1" /> Retainage
            </Button>
            <Button size="sm" onClick={() => setShowCreateDialog(true)}>
              <Plus className="w-4 h-4 mr-1" /> New Application
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">App #</TableHead>
                <TableHead>Period</TableHead>
                <TableHead className="text-right">Contract</TableHead>
                <TableHead className="text-right">Completed</TableHead>
                <TableHead className="text-right">Retainage</TableHead>
                <TableHead className="text-right">Less Previous</TableHead>
                <TableHead className="text-right">Current Due</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-20"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((app) => {
                const status = statusConfig[app.status];
                return (
                  <TableRow key={app.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-mono font-semibold">#{app.application_number}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {format(new Date(app.period_from), "MMM d")} - {format(new Date(app.period_to), "MMM d, yyyy")}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(app.contract_to_date)}</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(app.total_completed)}</TableCell>
                    <TableCell className="text-right font-mono text-warning">{formatCurrency(app.retainage_amount)}</TableCell>
                    <TableCell className="text-right font-mono text-muted-foreground">{formatCurrency(app.less_previous_certificates)}</TableCell>
                    <TableCell className="text-right font-mono font-semibold text-success">{formatCurrency(app.current_payment_due)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("gap-1", status.className)}>
                        {status.icon}
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setSelectedApp(app)}>
                          <Eye className="w-3 h-3" />
                        </Button>
                        {app.status === 'draft' && (
                          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditingApp(app)}>
                            <Edit className="w-3 h-3" />
                          </Button>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost" className="h-7 w-7">
                              <Download className="w-3 h-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleExportG702(app)}>
                              <FileText className="w-4 h-4 mr-2" />
                              Export G702 (Application)
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleExportG703(app)}>
                              <FileSpreadsheet className="w-4 h-4 mr-2" />
                              Export G703 (Continuation)
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleExportBoth(app)}>
                              <Download className="w-4 h-4 mr-2" />
                              Export Both Documents
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}

              {applications.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    No pay applications yet. Create your first application to start billing.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Pay Application</DialogTitle>
            <DialogDescription>
              Create a new pay application based on current schedule of values.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Period From</Label>
                <Input
                  type="date"
                  value={newApp.period_from}
                  onChange={(e) => setNewApp({ ...newApp, period_from: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Period To</Label>
                <Input
                  type="date"
                  value={newApp.period_to}
                  onChange={(e) => setNewApp({ ...newApp, period_to: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Notes (Optional)</Label>
              <Textarea
                value={newApp.notes}
                onChange={(e) => setNewApp({ ...newApp, notes: e.target.value })}
                placeholder="Any notes for this billing period..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
            <Button 
              onClick={handleCreateApplication}
              disabled={!newApp.period_from || !newApp.period_to}
            >
              Create Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View/Edit Dialog */}
      <Dialog open={!!selectedApp} onOpenChange={() => setSelectedApp(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Pay Application #{selectedApp?.application_number}</DialogTitle>
            <DialogDescription>
              {selectedApp && (
                <>Period: {format(new Date(selectedApp.period_from), "MMM d")} - {format(new Date(selectedApp.period_to), "MMM d, yyyy")}</>
              )}
            </DialogDescription>
          </DialogHeader>
          
          {selectedApp && (
            <div className="space-y-4">
              {/* Contract Info if available */}
              {(selectedApp.owner_name || selectedApp.architect_name) && (
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                  {selectedApp.owner_name && (
                    <div>
                      <p className="text-xs text-muted-foreground">Owner</p>
                      <p className="font-medium">{selectedApp.owner_name}</p>
                    </div>
                  )}
                  {selectedApp.architect_name && (
                    <div>
                      <p className="text-xs text-muted-foreground">Architect</p>
                      <p className="font-medium">{selectedApp.architect_name}</p>
                      {selectedApp.architect_project_number && (
                        <p className="text-xs text-muted-foreground">Project #: {selectedApp.architect_project_number}</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                <div>
                  <p className="text-xs text-muted-foreground">Original Contract</p>
                  <p className="font-semibold">{formatCurrency(selectedApp.original_contract)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Change Orders</p>
                  <p className="font-semibold">{formatCurrency(selectedApp.change_orders_total)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Contract to Date</p>
                  <p className="font-semibold">{formatCurrency(selectedApp.contract_to_date)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Completed</p>
                  <p className="font-semibold">{formatCurrency(selectedApp.total_completed)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Retainage</p>
                  <p className="font-semibold text-warning">{formatCurrency(selectedApp.retainage_amount)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Less Previous Certificates</p>
                  <p className="font-semibold">{formatCurrency(selectedApp.less_previous_certificates)}</p>
                </div>
              </div>

              <div className="p-4 bg-success/10 rounded-lg">
                <p className="text-xs text-muted-foreground">Current Payment Due</p>
                <p className="text-2xl font-bold text-success">{formatCurrency(selectedApp.current_payment_due)}</p>
              </div>

              {selectedApp.notes && (
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Notes</p>
                  <p className="text-sm">{selectedApp.notes}</p>
                </div>
              )}

              {/* Attachments Section */}
              <Separator />
              <PayAppAttachments projectId={projectId} payApplicationId={selectedApp.id} />
            </div>
          )}

          <DialogFooter className="gap-2 flex-wrap">
            <div className="flex gap-2 mr-auto">
              <Button variant="outline" size="sm" onClick={() => selectedApp && setSigningApp(selectedApp)}>
                <PenLine className="w-4 h-4 mr-2" />
                Signatures
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export PDF
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => selectedApp && handleExportG702(selectedApp, selectedAppSignatures)}>
                    <FileText className="w-4 h-4 mr-2" />
                    G702 Application
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => selectedApp && handleExportG703(selectedApp)}>
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                    G703 Continuation Sheet
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => selectedApp && handleExportBoth(selectedApp, selectedAppSignatures)}>
                    <Download className="w-4 h-4 mr-2" />
                    Both Documents
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {selectedApp?.status === 'draft' && (
                <Button variant="outline" size="sm" onClick={() => {
                  setEditingApp(selectedApp);
                  setSelectedApp(null);
                }}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
            
            {selectedApp?.status === 'draft' && (
              <Button onClick={() => handleStatusChange(selectedApp, 'submitted')}>
                Submit for Approval
              </Button>
            )}
            {selectedApp?.status === 'submitted' && (
              <>
                <Button variant="destructive" onClick={() => handleStatusChange(selectedApp, 'rejected')}>
                  Reject
                </Button>
                <Button onClick={() => handleStatusChange(selectedApp, 'approved')}>
                  Approve
                </Button>
              </>
            )}
            {selectedApp?.status === 'approved' && (
              <Button onClick={() => handleStatusChange(selectedApp, 'paid')}>
                Mark as Paid
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Pay Application Dialog */}
      {editingApp && (
        <EditPayApplicationDialog
          open={!!editingApp}
          onOpenChange={(open) => !open && setEditingApp(null)}
          application={editingApp}
          projectId={projectId}
          budgetItems={budgetItems}
          originalContract={originalContract}
          approvedChanges={approvedChanges}
          previousCertificates={calculatePreviousCertificates(editingApp.id)}
        />
      )}

      {/* Retainage Release Dialog */}
      <RetainageReleaseDialog
        open={showRetainageDialog}
        onOpenChange={setShowRetainageDialog}
        projectId={projectId}
        totalRetainage={totalRetainage}
      />

      {/* Signature Capture Dialog */}
      {signingApp && (
        <SignatureCaptureDialog
          open={!!signingApp}
          onOpenChange={(open) => !open && setSigningApp(null)}
          projectId={projectId}
          payApplicationId={signingApp.id}
          applicationNumber={signingApp.application_number}
          projectName={projectName}
          currentPaymentDue={signingApp.current_payment_due}
          periodFrom={signingApp.period_from}
          periodTo={signingApp.period_to}
          adminEmails={adminEmails}
        />
      )}
    </>
  );
}
