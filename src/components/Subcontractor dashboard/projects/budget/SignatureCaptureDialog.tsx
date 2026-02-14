import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/Subcontractor dashboard/ui/dialog";
import { Button } from "@/components/Subcontractor dashboard/ui/button";
import { Input } from "@/components/Subcontractor dashboard/ui/input";
import { Label } from "@/components/Subcontractor dashboard/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Subcontractor dashboard/ui/tabs";
import { Badge } from "@/components/Subcontractor dashboard/ui/badge";
import { CheckCircle2, PenLine, AlertCircle, Mail } from "lucide-react";
import SignatureCanvas from "./SignatureCanvas";
import { useSignatures, SignatureData } from "@/hooks/Subcontractor dashboard/useSignatures";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import RequestSignatureDialog from "@/components/Subcontractor dashboard/project/signatures/RequestSignatureDialog";

interface SignatureCaptureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  payApplicationId: string;
  applicationNumber: number;
  projectName: string;
  currentPaymentDue: number;
  periodFrom: string;
  periodTo: string;
  adminEmails: Array<{ email: string; name: string | null }>;
}

export default function SignatureCaptureDialog({
  open,
  onOpenChange,
  projectId,
  payApplicationId,
  applicationNumber,
  projectName,
  currentPaymentDue,
  periodFrom,
  periodTo,
  adminEmails,
}: SignatureCaptureDialogProps) {
  const { signatures, saveSignature, deleteSignature, isLoading } = useSignatures(
    projectId,
    payApplicationId
  );

  const [activeTab, setActiveTab] = useState<"contractor" | "architect">("contractor");
  const [contractorSignature, setContractorSignature] = useState<string | null>(null);
  const [contractorName, setContractorName] = useState("");
  const [contractorTitle, setContractorTitle] = useState("");
  const [architectSignature, setArchitectSignature] = useState<string | null>(null);
  const [architectName, setArchitectName] = useState("");
  const [architectTitle, setArchitectTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const [notificationSent, setNotificationSent] = useState(false);
  const [showRequestDialog, setShowRequestDialog] = useState(false);

  const existingContractor = signatures.find((s) => s.signature_type === "contractor");
  const existingArchitect = signatures.find((s) => s.signature_type === "architect");

  // Check if all signatures are complete and send notification
  useEffect(() => {
    const allSigned = existingContractor && existingArchitect;
    if (allSigned && !notificationSent && adminEmails.length > 0) {
      sendFullySignedNotification();
      setNotificationSent(true);
    }
  }, [existingContractor, existingArchitect, notificationSent, adminEmails]);

  const sendFullySignedNotification = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      for (const admin of adminEmails) {
        await supabase.functions.invoke("send-notification", {
          body: {
            type: "pay_app_fully_signed",
            recipientEmail: admin.email,
            recipientName: admin.name || admin.email,
            projectName,
            itemTitle: `Pay Application #${applicationNumber}`,
            itemNumber: applicationNumber,
            amount: currentPaymentDue,
            projectId,
            periodFrom,
            periodTo,
            signers: {
              contractor: existingContractor?.signer_name,
              architect: existingArchitect?.signer_name,
            },
          },
        });
      }

      toast.success("Notification sent: Pay application fully signed");
    } catch (error) {
      console.error("Failed to send fully signed notification:", error);
    }
  };

  const handleSaveSignature = async (type: "contractor" | "architect") => {
    const signatureData = type === "contractor" ? contractorSignature : architectSignature;
    const name = type === "contractor" ? contractorName : architectName;
    const title = type === "contractor" ? contractorTitle : architectTitle;

    if (!signatureData || !name.trim()) return;

    setSaving(true);
    try {
      await saveSignature.mutateAsync({
        pay_application_id: payApplicationId,
        project_id: projectId,
        signature_type: type,
        signature_data: signatureData,
        signer_name: name.trim(),
        signer_title: title.trim() || null,
      });

      // Clear form after successful save
      if (type === "contractor") {
        setContractorSignature(null);
        setContractorName("");
        setContractorTitle("");
      } else {
        setArchitectSignature(null);
        setArchitectName("");
        setArchitectTitle("");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSignature = async (id: string) => {
    await deleteSignature.mutateAsync(id);
  };

  const renderSignatureForm = (
    type: "contractor" | "architect",
    existingSignature: SignatureData | undefined
  ) => {
    const signature = type === "contractor" ? contractorSignature : architectSignature;
    const name = type === "contractor" ? contractorName : architectName;
    const title = type === "contractor" ? contractorTitle : architectTitle;
    const setSignature = type === "contractor" ? setContractorSignature : setArchitectSignature;
    const setName = type === "contractor" ? setContractorName : setArchitectName;
    const setTitle = type === "contractor" ? setContractorTitle : setArchitectTitle;

    if (existingSignature) {
      return (
        <div className="space-y-4">
          <div className="p-4 rounded-lg border bg-success/5 border-success/20">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-5 h-5 text-success" />
              <span className="font-medium text-success">Signature Captured</span>
            </div>
            <div className="bg-white rounded border p-2 mb-3">
              <img
                src={existingSignature.signature_data}
                alt={`${type} signature`}
                className="max-h-24 mx-auto"
              />
            </div>
            <div className="text-sm space-y-1">
              <p>
                <span className="text-muted-foreground">Signed by:</span>{" "}
                <span className="font-medium">{existingSignature.signer_name}</span>
              </p>
              {existingSignature.signer_title && (
                <p>
                  <span className="text-muted-foreground">Title:</span>{" "}
                  {existingSignature.signer_title}
                </p>
              )}
              <p>
                <span className="text-muted-foreground">Date:</span>{" "}
                {new Date(existingSignature.signed_at).toLocaleString()}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDeleteSignature(existingSignature.id)}
            disabled={deleteSignature.isPending}
          >
            Remove & Re-sign
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor={`${type}-name`}>Full Name *</Label>
            <Input
              id={`${type}-name`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={type === "contractor" ? "John Smith" : "Jane Architect"}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${type}-title`}>Title</Label>
            <Input
              id={`${type}-title`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={type === "contractor" ? "Project Manager" : "Principal Architect"}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Signature *</Label>
          <SignatureCanvas onSignatureChange={setSignature} width={380} height={120} />
        </div>

        <Button
          onClick={() => handleSaveSignature(type)}
          disabled={!signature || !name.trim() || saving}
          className="w-full"
        >
          <PenLine className="w-4 h-4 mr-2" />
          {saving ? "Saving..." : `Save ${type === "contractor" ? "Contractor" : "Architect"} Signature`}
        </Button>
      </div>
    );
  };

  // Determine which signatures are missing for external requests
  const missingSignatures: Array<"contractor" | "architect"> = [];
  if (!existingContractor) missingSignatures.push("contractor");
  if (!existingArchitect) missingSignatures.push("architect");

  return (
    <>
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Digital Signatures</DialogTitle>
          <DialogDescription>
            Capture contractor and architect signatures for Pay Application #{applicationNumber}
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

        <div className="flex gap-2 mb-4">
          {existingContractor && (
            <Badge variant="outline" className="bg-success/10 text-success border-success/30">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Contractor Signed
            </Badge>
          )}
          {existingArchitect && (
            <Badge variant="outline" className="bg-success/10 text-success border-success/30">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Architect Signed
            </Badge>
          )}
          {!existingContractor && !existingArchitect && (
            <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30">
              <AlertCircle className="w-3 h-3 mr-1" />
              No signatures yet
            </Badge>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="contractor" className="relative">
              Contractor
              {existingContractor && (
                <CheckCircle2 className="w-3 h-3 ml-1 text-success" />
              )}
            </TabsTrigger>
            <TabsTrigger value="architect" className="relative">
              Architect
              {existingArchitect && (
                <CheckCircle2 className="w-3 h-3 ml-1 text-success" />
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="contractor" className="mt-4">
            <div className="mb-3 p-3 rounded-lg bg-muted/50 text-sm">
              <p className="font-medium mb-1">Contractor's Certification</p>
              <p className="text-muted-foreground text-xs">
                The undersigned certifies that the Work covered by this Application for Payment has
                been completed in accordance with the Contract Documents.
              </p>
            </div>
            {renderSignatureForm("contractor", existingContractor)}
          </TabsContent>

          <TabsContent value="architect" className="mt-4">
            <div className="mb-3 p-3 rounded-lg bg-muted/50 text-sm">
              <p className="font-medium mb-1">Architect's Certificate for Payment</p>
              <p className="text-muted-foreground text-xs">
                Based on on-site observations and the data comprising this application, the Architect
                certifies that the Work has progressed as indicated.
              </p>
            </div>
            {renderSignatureForm("architect", existingArchitect)}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <RequestSignatureDialog
      open={showRequestDialog}
      onOpenChange={setShowRequestDialog}
      projectId={projectId}
      projectName={projectName}
      documentType="pay_application"
      documentId={payApplicationId}
      documentNumber={applicationNumber}
      documentTitle={`Pay Application #${applicationNumber}`}
      amount={currentPaymentDue}
      missingSignatures={missingSignatures}
    />
    </>
  );
}
