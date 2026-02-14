import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/Subcontractor dashboard/ui/dialog";
import { Button } from "@/components/Subcontractor dashboard/ui/button";
import { Input } from "@/components/Subcontractor dashboard/ui/input";
import { Label } from "@/components/Subcontractor dashboard/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Subcontractor dashboard/ui/tabs";
import { Badge } from "@/components/Subcontractor dashboard/ui/badge";
import { Loader2, CheckCircle, Trash2, Mail } from "lucide-react";
import SignatureCanvas from "@/components/Subcontractor dashboard/project/budget/SignatureCanvas";
import { useChangeOrderSignatures, ChangeOrderSignatureData } from "@/hooks/Subcontractor dashboard/useChangeOrderSignatures";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import RequestSignatureDialog from "@/components/Subcontractor dashboard/project/signatures/RequestSignatureDialog";

type SignatureType = "contractor" | "architect" | "owner";

interface ChangeOrderSignatureCaptureDialogProps {
  changeOrderId: string;
  projectId: string;
  coNumber: number;
  coTitle: string;
  coAmount: number;
  projectName: string;
  adminEmails: Array<{ email: string; name: string | null }>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ChangeOrderSignatureCaptureDialog({
  changeOrderId,
  projectId,
  coNumber,
  coTitle,
  coAmount,
  projectName,
  adminEmails,
  open,
  onOpenChange,
}: ChangeOrderSignatureCaptureDialogProps) {
  const { signatures, isLoading, saveSignature, deleteSignature } = useChangeOrderSignatures(
    projectId,
    changeOrderId
  );

  const [activeTab, setActiveTab] = useState<SignatureType>("contractor");
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [signerName, setSignerName] = useState("");
  const [signerTitle, setSignerTitle] = useState("");
  const [notificationSent, setNotificationSent] = useState(false);
  const [showRequestDialog, setShowRequestDialog] = useState(false);

  const contractorSig = signatures.find((s) => s.signature_type === "contractor");
  const architectSig = signatures.find((s) => s.signature_type === "architect");
  const ownerSig = signatures.find((s) => s.signature_type === "owner");

  // Check if all signatures are complete and send notification
  useEffect(() => {
    const allSigned = contractorSig && architectSig && ownerSig;
    if (allSigned && !notificationSent && adminEmails.length > 0) {
      sendFullySignedNotification();
      setNotificationSent(true);
    }
  }, [contractorSig, architectSig, ownerSig, notificationSent, adminEmails]);

  const sendFullySignedNotification = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      for (const admin of adminEmails) {
        await supabase.functions.invoke("send-notification", {
          body: {
            type: "change_order_fully_signed",
            recipientEmail: admin.email,
            recipientName: admin.name || admin.email,
            projectName,
            itemTitle: coTitle,
            itemNumber: coNumber,
            amount: coAmount,
            projectId,
            signers: {
              contractor: contractorSig?.signer_name,
              architect: architectSig?.signer_name,
              owner: ownerSig?.signer_name,
            },
          },
        });
      }

      toast.success("Notification sent: Change order fully signed");
    } catch (error) {
      console.error("Failed to send fully signed notification:", error);
    }
  };

  const getCurrentSignature = (): ChangeOrderSignatureData | undefined => {
    switch (activeTab) {
      case "contractor":
        return contractorSig;
      case "architect":
        return architectSig;
      case "owner":
        return ownerSig;
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as SignatureType);
    setSignatureData(null);
    setSignerName("");
    setSignerTitle("");
  };

  const handleSave = async () => {
    if (!signatureData || !signerName.trim()) return;

    await saveSignature.mutateAsync({
      change_order_id: changeOrderId,
      project_id: projectId,
      signature_type: activeTab,
      signature_data: signatureData,
      signer_name: signerName.trim(),
      signer_title: signerTitle.trim() || null,
    });

    setSignatureData(null);
    setSignerName("");
    setSignerTitle("");
  };

  const handleDelete = async (sig: ChangeOrderSignatureData) => {
    await deleteSignature.mutateAsync(sig.id);
  };

  const getTabLabel = (type: SignatureType): string => {
    switch (type) {
      case "contractor":
        return "Contractor";
      case "architect":
        return "Architect";
      case "owner":
        return "Owner";
    }
  };

  const getCertificationText = (type: SignatureType): string => {
    switch (type) {
      case "contractor":
        return "The undersigned Contractor hereby agrees to the above change and certifies that the change order amount represents fair and reasonable compensation for the work described.";
      case "architect":
        return "The undersigned Architect recommends approval of this Change Order and certifies that the work described is consistent with the project requirements.";
      case "owner":
        return "The undersigned Owner hereby approves this Change Order and authorizes the Contractor to proceed with the work as described above.";
    }
  };

  const renderSignatureTab = (type: SignatureType) => {
    const sig = type === "contractor" ? contractorSig : type === "architect" ? architectSig : ownerSig;

    if (sig) {
      return (
        <div className="space-y-4">
          <div className="bg-success/10 border border-success/20 rounded-lg p-4">
            <div className="flex items-center gap-2 text-success mb-3">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">{getTabLabel(type)} Signature Captured</span>
            </div>
            <div className="bg-white rounded border p-2 mb-3">
              <img
                src={sig.signature_data}
                alt={`${type} signature`}
                className="max-h-24 mx-auto"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground text-xs uppercase">Name</p>
                <p className="font-medium">{sig.signer_name}</p>
              </div>
              {sig.signer_title && (
                <div>
                  <p className="text-muted-foreground text-xs uppercase">Title</p>
                  <p className="font-medium">{sig.signer_title}</p>
                </div>
              )}
              <div>
                <p className="text-muted-foreground text-xs uppercase">Signed</p>
                <p>{format(new Date(sig.signed_at), "MMM d, yyyy h:mm a")}</p>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(sig)}
            disabled={deleteSignature.isPending}
            className="text-destructive hover:text-destructive"
          >
            {deleteSignature.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4 mr-2" />
            )}
            Remove Signature
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-sm text-muted-foreground">{getCertificationText(type)}</p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="signerName">Name *</Label>
              <Input
                id="signerName"
                placeholder={`${getTabLabel(type)}'s name`}
                value={signerName}
                onChange={(e) => setSignerName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signerTitle">Title</Label>
              <Input
                id="signerTitle"
                placeholder="e.g., Project Manager"
                value={signerTitle}
                onChange={(e) => setSignerTitle(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Signature *</Label>
            <SignatureCanvas
              onSignatureChange={setSignatureData}
              width={380}
              height={120}
            />
          </div>

          <Button
            onClick={handleSave}
            disabled={!signatureData || !signerName.trim() || saveSignature.isPending}
            className="w-full"
          >
            {saveSignature.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save {getTabLabel(type)} Signature
          </Button>
        </div>
      </div>
    );
  };

  const signatureCount = [contractorSig, architectSig, ownerSig].filter(Boolean).length;
  
  // Determine which signatures are missing for external requests
  const missingSignatures: SignatureType[] = [];
  if (!contractorSig) missingSignatures.push("contractor");
  if (!architectSig) missingSignatures.push("architect");
  if (!ownerSig) missingSignatures.push("owner");

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Signatures for CO-{coNumber}
              {signatureCount > 0 && (
                <Badge variant="secondary" className="bg-success/10 text-success">
                  {signatureCount}/3 signed
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription>
              Capture digital signatures for the G701 Change Order document
            </DialogDescription>
          </DialogHeader>

          {/* Request External Signature Button */}
          {missingSignatures.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowRequestDialog(true)}
              className="w-full"
            >
              <Mail className="w-4 h-4 mr-2" />
              Request External Signature via Email
            </Button>
          )}

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="contractor" className="relative">
                Contractor
                {contractorSig && (
                  <CheckCircle className="w-3 h-3 absolute -top-1 -right-1 text-success" />
                )}
              </TabsTrigger>
              <TabsTrigger value="architect" className="relative">
                Architect
                {architectSig && (
                  <CheckCircle className="w-3 h-3 absolute -top-1 -right-1 text-success" />
                )}
              </TabsTrigger>
              <TabsTrigger value="owner" className="relative">
                Owner
                {ownerSig && (
                  <CheckCircle className="w-3 h-3 absolute -top-1 -right-1 text-success" />
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="contractor" className="mt-4">
              {renderSignatureTab("contractor")}
            </TabsContent>
            <TabsContent value="architect" className="mt-4">
              {renderSignatureTab("architect")}
            </TabsContent>
            <TabsContent value="owner" className="mt-4">
              {renderSignatureTab("owner")}
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>

    <RequestSignatureDialog
      open={showRequestDialog}
      onOpenChange={setShowRequestDialog}
      projectId={projectId}
      projectName={projectName}
      documentType="change_order"
      documentId={changeOrderId}
      documentNumber={coNumber}
      documentTitle={coTitle}
      amount={coAmount}
      missingSignatures={missingSignatures}
    />
  </>
  );
}
