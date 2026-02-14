import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/Subcontractor dashboard/ui/button";
import { Input } from "@/components/Subcontractor dashboard/ui/input";
import { Label } from "@/components/Subcontractor dashboard/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/Subcontractor dashboard/ui/card";
import { Badge } from "@/components/Subcontractor dashboard/ui/badge";
import { Separator } from "@/components/Subcontractor dashboard/ui/separator";
import { Loader2, CheckCircle2, XCircle, Clock, AlertTriangle, PenLine } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import SignatureCanvas from "@/components/Subcontractor dashboard/project/budget/SignatureCanvas";
import { toast } from "sonner";
import { format } from "date-fns";

interface SignatureRequestData {
  id: string;
  status: string;
  signature_type: string;
  recipient_email: string;
  recipient_name: string | null;
  expires_at: string;
  project: { name: string; location: string | null };
  pay_application: {
    application_number: number;
    period_from: string;
    period_to: string;
    current_payment_due: number;
  } | null;
  change_order: {
    co_number: number;
    title: string;
    description: string | null;
    amount: number;
    status: string;
  } | null;
  requested_by: { full_name: string | null; email: string };
}

export default function ExternalSigningPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [requestData, setRequestData] = useState<SignatureRequestData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [signerName, setSignerName] = useState("");
  const [signerTitle, setSignerTitle] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (token) {
      fetchRequestData();
    }
  }, [token]);

  const fetchRequestData = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("get-signature-request", {
        body: null,
        headers: {},
        method: "GET",
      });

      // Use fetch directly since we need query params
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-signature-request?token=${token}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
        }
      );

      const result = await response.json();

      if (!response.ok || result.error) {
        setError(result.error || "Failed to load signature request");
        return;
      }

      setRequestData(result.data);
      if (result.data.recipient_name) {
        setSignerName(result.data.recipient_name);
      }
    } catch (err) {
      console.error("Error fetching signature request:", err);
      setError("Failed to load signature request");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!signatureData || !signerName.trim()) {
      toast.error("Please provide your name and signature");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/submit-external-signature`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({
            token,
            signatureData,
            signerName: signerName.trim(),
            signerTitle: signerTitle.trim() || undefined,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || result.error) {
        throw new Error(result.error || "Failed to submit signature");
      }

      setSubmitted(true);
      toast.success("Signature submitted successfully!");
    } catch (err) {
      console.error("Error submitting signature:", err);
      toast.error(err instanceof Error ? err.message : "Failed to submit signature");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading signature request...</p>
        </div>
      </div>
    );
  }

  if (error || !requestData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <XCircle className="w-12 h-12 text-destructive mx-auto mb-2" />
            <CardTitle>Invalid Request</CardTitle>
            <CardDescription>{error || "This signature request could not be found."}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (requestData.status === "signed" || submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-2" />
            <CardTitle>Signature Submitted</CardTitle>
            <CardDescription>
              Thank you! Your signature has been successfully recorded.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground">
              You can close this window now.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (requestData.status === "expired") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <Clock className="w-12 h-12 text-warning mx-auto mb-2" />
            <CardTitle>Request Expired</CardTitle>
            <CardDescription>
              This signature request has expired. Please contact the sender to request a new link.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (requestData.status === "cancelled") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
            <CardTitle>Request Cancelled</CardTitle>
            <CardDescription>
              This signature request has been cancelled.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const isChangeOrder = !!requestData.change_order;
  const document = isChangeOrder ? requestData.change_order : requestData.pay_application;
  const docNumber = isChangeOrder 
    ? requestData.change_order?.co_number 
    : requestData.pay_application?.application_number;
  const docLabel = isChangeOrder ? "Change Order" : "Pay Application";
  const roleLabel = requestData.signature_type.charAt(0).toUpperCase() + requestData.signature_type.slice(1);

  return (
    <div className="min-h-screen bg-muted/30 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Digital Signature Request</h1>
          <p className="text-muted-foreground">
            You've been requested to sign as <Badge variant="outline">{roleLabel}</Badge>
          </p>
        </div>

        {/* Document Details */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  {docLabel} #{docNumber}
                </p>
                <CardTitle className="text-xl">
                  {isChangeOrder ? requestData.change_order?.title : `Pay Application #${docNumber}`}
                </CardTitle>
              </div>
              <Badge variant="secondary">
                {requestData.project.name}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {isChangeOrder && requestData.change_order && (
              <>
                {requestData.change_order.description && (
                  <p className="text-sm text-muted-foreground">
                    {requestData.change_order.description}
                  </p>
                )}
                <div className="bg-muted/50 rounded-lg p-4 text-center">
                  <p className="text-xs text-muted-foreground uppercase mb-1">Amount</p>
                  <p className={`text-2xl font-bold ${Number(requestData.change_order.amount) >= 0 ? "text-success" : "text-destructive"}`}>
                    {Number(requestData.change_order.amount) >= 0 ? "+" : ""}
                    ${Number(requestData.change_order.amount).toLocaleString()}
                  </p>
                </div>
              </>
            )}

            {!isChangeOrder && requestData.pay_application && (
              <>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Period</p>
                    <p className="font-medium">
                      {format(new Date(requestData.pay_application.period_from), "MMM d")} - {format(new Date(requestData.pay_application.period_to), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
                <div className="bg-muted/50 rounded-lg p-4 text-center">
                  <p className="text-xs text-muted-foreground uppercase mb-1">Current Payment Due</p>
                  <p className="text-2xl font-bold text-success">
                    ${Number(requestData.pay_application.current_payment_due).toLocaleString()}
                  </p>
                </div>
              </>
            )}

            <Separator />

            <div className="text-sm text-muted-foreground">
              <p>Requested by: <span className="font-medium text-foreground">{requestData.requested_by.full_name || requestData.requested_by.email}</span></p>
              <p>Expires: <span className="font-medium text-foreground">{format(new Date(requestData.expires_at), "MMM d, yyyy 'at' h:mm a")}</span></p>
            </div>
          </CardContent>
        </Card>

        {/* Signature Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Signature</CardTitle>
            <CardDescription>
              {requestData.signature_type === "contractor" && 
                "By signing, you certify that the Work covered has been completed in accordance with the Contract Documents."}
              {requestData.signature_type === "architect" && 
                "By signing, you certify that based on on-site observations, the Work has progressed as indicated."}
              {requestData.signature_type === "owner" && 
                "By signing, you approve this document and authorize the work/payment described herein."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="signer-name">Full Name *</Label>
                <Input
                  id="signer-name"
                  value={signerName}
                  onChange={(e) => setSignerName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signer-title">Title</Label>
                <Input
                  id="signer-title"
                  value={signerTitle}
                  onChange={(e) => setSignerTitle(e.target.value)}
                  placeholder="e.g., Project Manager"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Draw Your Signature *</Label>
              <SignatureCanvas onSignatureChange={setSignatureData} width={500} height={150} />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!signatureData || !signerName.trim() || submitting}
              className="w-full"
              size="lg"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <PenLine className="w-4 h-4 mr-2" />
                  Submit Signature
                </>
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              By submitting, you agree that this electronic signature is legally binding.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
