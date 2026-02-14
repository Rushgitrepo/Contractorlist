import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/Subcontractor dashboard/ui/dialog";
import { Button } from "@/components/Subcontractor dashboard/ui/button";
import { Badge } from "@/components/Subcontractor dashboard/ui/badge";
import { Separator } from "@/components/Subcontractor dashboard/ui/separator";
import { Loader2, Clock, CheckCircle, XCircle, Ban, User, Calendar, Download, PenLine } from "lucide-react";
import { useUpdateChangeOrderStatus } from "@/hooks/Subcontractor dashboard/useChangeOrderMutations";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import FileAttachments from "./FileAttachments";
import { generateG701PDF, ChangeOrderInfo } from "@/utils/aiaDocumentGenerator";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";
import ChangeOrderSignatureCaptureDialog from "./change-orders/ChangeOrderSignatureCaptureDialog";
import { useChangeOrderSignaturesForPDF } from "@/hooks/Subcontractor dashboard/useChangeOrderSignatures";

type ChangeOrderStatus = Database["public"]["Enums"]["change_order_status"];

const statusStyles: Record<ChangeOrderStatus, { bg: string; text: string; icon: React.ElementType }> = {
  pending: { bg: "bg-warning/10", text: "text-warning", icon: Clock },
  approved: { bg: "bg-success/10", text: "text-success", icon: CheckCircle },
  rejected: { bg: "bg-destructive/10", text: "text-destructive", icon: XCircle },
  void: { bg: "bg-muted", text: "text-muted-foreground", icon: Ban },
};

interface ChangeOrder {
  id: string;
  co_number: number;
  title: string;
  description: string | null;
  amount: number;
  reason: string | null;
  status: ChangeOrderStatus;
  created_at: string;
  approved_at: string | null;
  created_by_profile?: { full_name: string | null; email: string } | null;
  approved_by_profile?: { full_name: string | null; email: string } | null;
}

interface ChangeOrderDetailDialogProps {
  changeOrder: ChangeOrder | null;
  projectId: string;
  projectName: string;
  projectLocation: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contractInfo?: {
    originalContract?: number;
    previousChanges?: number;
    contractDate?: string;
  };
  adminEmails?: Array<{ email: string; name: string | null }>;
}

export default function ChangeOrderDetailDialog({ 
  changeOrder, 
  projectId, 
  projectName,
  projectLocation,
  open, 
  onOpenChange,
  contractInfo,
  adminEmails = [],
}: ChangeOrderDetailDialogProps) {
  const updateStatus = useUpdateChangeOrderStatus(projectId);
  const [showSignatures, setShowSignatures] = useState(false);
  
  const { data: signatures } = useChangeOrderSignaturesForPDF(changeOrder?.id || "");

  if (!changeOrder) return null;

  const StatusIcon = statusStyles[changeOrder.status]?.icon || Clock;
  const isPending = changeOrder.status === "pending";
  
  const signatureCount = [signatures?.contractor, signatures?.architect, signatures?.owner].filter(Boolean).length;

  const handleApprove = async () => {
    await updateStatus.mutateAsync({
      changeOrderId: changeOrder.id,
      status: "approved",
    });
    onOpenChange(false);
  };

  const handleReject = async () => {
    await updateStatus.mutateAsync({
      changeOrderId: changeOrder.id,
      status: "rejected",
    });
    onOpenChange(false);
  };

  const handleVoid = async () => {
    await updateStatus.mutateAsync({
      changeOrderId: changeOrder.id,
      status: "void",
    });
    onOpenChange(false);
  };

  const handleExportG701 = () => {
    try {
      const coInfo: ChangeOrderInfo = {
        co_number: changeOrder.co_number,
        title: changeOrder.title,
        description: changeOrder.description,
        amount: Number(changeOrder.amount),
        reason: changeOrder.reason,
        status: changeOrder.status,
        created_at: changeOrder.created_at,
        approved_at: changeOrder.approved_at,
        created_by_name: changeOrder.created_by_profile?.full_name || undefined,
        approved_by_name: changeOrder.approved_by_profile?.full_name || undefined,
      };

      generateG701PDF(
        coInfo,
        { name: projectName, location: projectLocation },
        contractInfo,
        signatures
      );
      toast.success("G701 Change Order exported successfully");
    } catch (error) {
      toast.error("Failed to export G701");
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground font-mono mb-1">
                CO-{changeOrder.co_number}
              </p>
              <DialogTitle className="text-xl">{changeOrder.title}</DialogTitle>
            </div>
            <Badge
              variant="secondary"
              className={cn(
                "gap-1 shrink-0",
                statusStyles[changeOrder.status]?.bg,
                statusStyles[changeOrder.status]?.text
              )}
            >
              <StatusIcon className="w-3 h-3" />
              {changeOrder.status.toUpperCase()}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Amount highlight */}
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Amount</p>
            <p className={cn(
              "text-3xl font-bold",
              Number(changeOrder.amount) >= 0 ? "text-success" : "text-destructive"
            )}>
              {Number(changeOrder.amount) >= 0 ? "+" : ""}${Number(changeOrder.amount).toLocaleString()}
            </p>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Created By</p>
              <div className="flex items-center gap-1">
                <User className="w-3 h-3 text-muted-foreground" />
                <span>{changeOrder.created_by_profile?.full_name || "Unknown"}</span>
              </div>
            </div>
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Created</p>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-muted-foreground" />
                <span>{format(new Date(changeOrder.created_at), "MMM d, yyyy")}</span>
              </div>
            </div>
            {changeOrder.reason && (
              <div className="col-span-2">
                <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Reason</p>
                <p>{changeOrder.reason}</p>
              </div>
            )}
          </div>

          {changeOrder.description && (
            <>
              <Separator />
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wider mb-2">Description</p>
                <div className="bg-muted/50 rounded-md p-3">
                  <p className="text-sm whitespace-pre-wrap">{changeOrder.description}</p>
                </div>
              </div>
            </>
          )}

          {/* Approval info if already decided */}
          {changeOrder.approved_at && changeOrder.approved_by_profile && (
            <>
              <Separator />
              <div className="text-sm">
                <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">
                  {changeOrder.status === "approved" ? "Approved" : changeOrder.status === "rejected" ? "Rejected" : "Updated"} By
                </p>
                <p>
                  {changeOrder.approved_by_profile.full_name || changeOrder.approved_by_profile.email} on{" "}
                  {format(new Date(changeOrder.approved_at), "MMM d, yyyy 'at' h:mm a")}
                </p>
              </div>
            </>
          )}

          <Separator />

          {/* Attachments */}
          <FileAttachments projectId={projectId} changeOrderId={changeOrder.id} />

          <Separator />

          {/* Action buttons */}
          <div className="flex justify-between gap-2">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSignatures(true)}
              >
                <PenLine className="w-4 h-4 mr-2" />
                Signatures
                {signatureCount > 0 && (
                  <Badge variant="secondary" className="ml-2 bg-success/10 text-success">
                    {signatureCount}/3
                  </Badge>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportG701}
              >
                <Download className="w-4 h-4 mr-2" />
                Export G701
              </Button>
              {changeOrder.status !== "void" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleVoid}
                  disabled={updateStatus.isPending}
                  className="text-muted-foreground"
                >
                  Void
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Close
              </Button>
              {isPending && (
                <>
                  <Button
                    variant="destructive"
                    onClick={handleReject}
                    disabled={updateStatus.isPending}
                  >
                    {updateStatus.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    <XCircle className="w-4 h-4 mr-1" />
                    Reject
                  </Button>
                  <Button
                    onClick={handleApprove}
                    disabled={updateStatus.isPending}
                    className="bg-success hover:bg-success/90"
                  >
                    {updateStatus.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Approve
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        <ChangeOrderSignatureCaptureDialog
          changeOrderId={changeOrder.id}
          projectId={projectId}
          coNumber={changeOrder.co_number}
          coTitle={changeOrder.title}
          coAmount={Number(changeOrder.amount)}
          projectName={projectName}
          adminEmails={adminEmails}
          open={showSignatures}
          onOpenChange={setShowSignatures}
        />
      </DialogContent>
    </Dialog>
  );
}
