import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/Subcontractor dashboard/ui/card";
import { Badge } from "@/components/Subcontractor dashboard/ui/badge";
import { Button } from "@/components/Subcontractor dashboard/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Subcontractor dashboard/ui/tabs";
import { Input } from "@/components/Subcontractor dashboard/ui/input";
import { Checkbox } from "@/components/Subcontractor dashboard/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/Subcontractor dashboard/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Subcontractor dashboard/ui/select";
import {
  Loader2,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  DollarSign,
  Mail,
  Search,
  RefreshCw,
  XCircle,
  ExternalLink,
  BarChart3,
  Bell,
  History,
  Users,
  Settings,
} from "lucide-react";
import { useSignatureDashboard, SignatureDocument } from "@/hooks/Subcontractor dashboard/useSignatureDashboard";
import { useCancelSignatureRequest, useResendSignatureRequest, useSendSignatureReminder } from "@/hooks/Subcontractor dashboard/useSignatureRequests";
import { useCreateAuditLog } from "@/hooks/Subcontractor dashboard/useSignatureAuditLog";
import { useAuth } from "@/context/Subcontractor dashboard/contexts/AuthContext";
import { formatDistanceToNow, isPast } from "date-fns";
import { cn } from "@/lib/utils";
import SignatureCaptureDialog from "./budget/SignatureCaptureDialog";
import ChangeOrderSignatureCaptureDialog from "./change-orders/ChangeOrderSignatureCaptureDialog";
import { usePayApplications } from "@/hooks/Subcontractor dashboard/useBudget";
import { useChangeOrders } from "@/hooks/Subcontractor dashboard/useChangeOrderMutations";
import { useProjectMembers } from "@/hooks/Subcontractor dashboard/useProjectDetail";
import SignatureAnalytics from "./signatures/SignatureAnalytics";
import SignatureAuditLog from "./signatures/SignatureAuditLog";
import EmailTemplateEditor from "./signatures/EmailTemplateEditor";
import SignatureContactsManager from "./signatures/SignatureContactsManager";

interface ProjectSignaturesTabProps {
  projectId: string;
  projectName: string;
}

export default function ProjectSignaturesTab({ 
  projectId, 
  projectName,
}: ProjectSignaturesTabProps) {
  const { data, isLoading, refetch } = useSignatureDashboard(projectId);
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  
  // State for opening dialogs
  const [selectedPayApp, setSelectedPayApp] = useState<any>(null);
  const [selectedChangeOrder, setSelectedChangeOrder] = useState<any>(null);
  
  // State for bulk selection
  const [selectedRequestIds, setSelectedRequestIds] = useState<Set<string>>(new Set());
  const [isSendingBulkReminders, setIsSendingBulkReminders] = useState(false);
  
  // Fetch full document data for dialogs
  const { data: payApplications = [] } = usePayApplications(projectId);
  const { data: changeOrders = [] } = useChangeOrders(projectId);
  const { data: members } = useProjectMembers(projectId);

  // Get admin emails for notifications
  const adminEmails = members
    ?.filter((m: any) => m.role === "owner" || m.role === "gc")
    .map((m: any) => ({
      email: m.profile?.email || "",
      name: m.profile?.full_name || null,
    }))
    .filter((a: any) => a.email) || [];

  const cancelRequest = useCancelSignatureRequest();
  const resendRequest = useResendSignatureRequest();
  const sendReminder = useSendSignatureReminder();
  const createAuditLog = useCreateAuditLog();
  
  // Handle document row click
  const handleDocumentClick = (doc: SignatureDocument) => {
    if (doc.document_type === "pay_application") {
      const payApp = payApplications.find(p => p.id === doc.document_id);
      if (payApp) {
        setSelectedPayApp(payApp);
      }
    } else {
      const co = changeOrders.find(c => c.id === doc.document_id);
      if (co) {
        setSelectedChangeOrder(co);
      }
    }
  };
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No signature data available.
      </div>
    );
  }

  const { documents, summary, pendingRequests } = data;

  // Filter documents
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      searchQuery === "" ||
      doc.document_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.document_number.toString().includes(searchQuery);

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "complete" && doc.completed_signatures === doc.required_signatures) ||
      (statusFilter === "partial" && doc.completed_signatures > 0 && doc.completed_signatures < doc.required_signatures) ||
      (statusFilter === "unsigned" && doc.completed_signatures === 0);

    const matchesType =
      typeFilter === "all" ||
      doc.document_type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const handleResend = async (request: typeof pendingRequests[0]) => {
    const baseUrl = window.location.origin;
    await resendRequest.mutateAsync({
      requestId: request.id,
      projectId,
      recipientEmail: request.recipient_email,
      recipientName: request.recipient_name || request.recipient_email,
      projectName,
      documentType: request.document_type,
      documentNumber: request.document_number,
      documentTitle: request.document_title,
      signatureType: request.signature_type,
      amount: request.amount,
      requestedByName: profile?.full_name || profile?.email || "A team member",
      signingUrl: `${baseUrl}/sign/${request.token}`,
      expiresAt: request.expires_at,
    });
  };

  const handleSendReminder = async (request: typeof pendingRequests[0]) => {
    await sendReminder.mutateAsync({
      requestId: request.id,
      projectId,
      token: request.token,
      recipientEmail: request.recipient_email,
      recipientName: request.recipient_name,
      projectName,
      documentType: request.document_type,
      documentNumber: request.document_number,
      documentTitle: request.document_title,
      signatureType: request.signature_type,
      amount: request.amount,
      expiresAt: request.expires_at,
    });

    // Log audit event
    createAuditLog.mutate({
      projectId,
      signatureRequestId: request.id,
      payApplicationId: request.document_type === "pay_application" ? request.document_id : undefined,
      changeOrderId: request.document_type === "change_order" ? request.document_id : undefined,
      actionType: "reminder_sent",
      description: `Reminder sent for ${request.document_type === "pay_application" ? "Pay Application" : "Change Order"} #${request.document_number} to ${request.recipient_email}`,
      metadata: {
        document_title: request.document_title,
        recipient_email: request.recipient_email,
        signature_type: request.signature_type,
      },
    });
  };
  // Cancel request handler with audit logging
  const handleCancelRequest = async (request: typeof pendingRequests[0]) => {
    await cancelRequest.mutateAsync({ id: request.id, projectId });
    
    createAuditLog.mutate({
      projectId,
      signatureRequestId: request.id,
      payApplicationId: request.document_type === "pay_application" ? request.document_id : undefined,
      changeOrderId: request.document_type === "change_order" ? request.document_id : undefined,
      actionType: "request_cancelled",
      description: `Signature request cancelled for ${request.document_type === "pay_application" ? "Pay Application" : "Change Order"} #${request.document_number}`,
      metadata: {
        document_title: request.document_title,
        recipient_email: request.recipient_email,
        signature_type: request.signature_type,
      },
    });
  };

  // Bulk selection handlers
  const nonExpiredRequests = pendingRequests.filter(r => !isPast(new Date(r.expires_at)));
  const allSelected = nonExpiredRequests.length > 0 && nonExpiredRequests.every(r => selectedRequestIds.has(r.id));
  const someSelected = selectedRequestIds.size > 0;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedRequestIds(new Set());
    } else {
      setSelectedRequestIds(new Set(nonExpiredRequests.map(r => r.id)));
    }
  };

  const toggleSelectRequest = (requestId: string) => {
    const newSet = new Set(selectedRequestIds);
    if (newSet.has(requestId)) {
      newSet.delete(requestId);
    } else {
      newSet.add(requestId);
    }
    setSelectedRequestIds(newSet);
  };

  const handleBulkSendReminders = async () => {
    const selectedRequests = pendingRequests.filter(r => selectedRequestIds.has(r.id));
    if (selectedRequests.length === 0) return;

    setIsSendingBulkReminders(true);
    let successCount = 0;
    let errorCount = 0;

    for (const request of selectedRequests) {
      try {
        await sendReminder.mutateAsync({
          requestId: request.id,
          projectId,
          token: request.token,
          recipientEmail: request.recipient_email,
          recipientName: request.recipient_name,
          projectName,
          documentType: request.document_type,
          documentNumber: request.document_number,
          documentTitle: request.document_title,
          signatureType: request.signature_type,
          amount: request.amount,
          expiresAt: request.expires_at,
        });
        successCount++;
      } catch {
        errorCount++;
      }
    }

    setIsSendingBulkReminders(false);
    setSelectedRequestIds(new Set());

    if (errorCount === 0) {
      // Toast already shown by individual mutations
    }
  };

  const getSignatureStatusBadge = (completed: number, required: number) => {
    if (completed === required) {
      return (
        <Badge variant="outline" className="bg-success/10 text-success border-success/30">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Complete
        </Badge>
      );
    }
    if (completed > 0) {
      return (
        <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30">
          <Clock className="w-3 h-3 mr-1" />
          {completed}/{required} Signed
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-muted text-muted-foreground">
        <AlertCircle className="w-3 h-3 mr-1" />
        No Signatures
      </Badge>
    );
  };

  const roleLabels: Record<string, string> = {
    contractor: "Contractor",
    architect: "Architect",
    owner: "Owner",
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{summary.totalDocuments}</p>
                <p className="text-xs text-muted-foreground">Total Documents</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-success" />
              <div>
                <p className="text-2xl font-bold text-success">{summary.fullySignedDocuments}</p>
                <p className="text-xs text-muted-foreground">Fully Signed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-warning" />
              <div>
                <p className="text-2xl font-bold text-warning">{summary.partiallySignedDocuments}</p>
                <p className="text-xs text-muted-foreground">Partially Signed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{summary.unsignedDocuments}</p>
                <p className="text-xs text-muted-foreground">No Signatures</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              <div>
                <p className="text-2xl font-bold text-primary">{summary.pendingRequestsCount}</p>
                <p className="text-xs text-muted-foreground">Pending Requests</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">All Documents</TabsTrigger>
          <TabsTrigger value="pending">
            Pending Requests
            {pendingRequests.length > 0 && (
              <Badge variant="secondary" className="ml-2 bg-primary/10 text-primary">
                {pendingRequests.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="audit-log" className="gap-2">
            <History className="w-4 h-4" />
            Audit Log
          </TabsTrigger>
          <TabsTrigger value="templates" className="gap-2">
            <Settings className="w-4 h-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="contacts" className="gap-2">
            <Users className="w-4 h-4" />
            Contacts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4 space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="complete">Complete</SelectItem>
                <SelectItem value="partial">Partial</SelectItem>
                <SelectItem value="unsigned">No Signatures</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="pay_application">Pay Applications</SelectItem>
                <SelectItem value="change_order">Change Orders</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Documents Table */}
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Contractor</TableHead>
                  <TableHead>Architect</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No documents found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDocuments.map((doc) => (
                    <TableRow 
                      key={`${doc.document_type}-${doc.document_id}`}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleDocumentClick(doc)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {doc.document_type === "change_order" ? (
                            <FileText className="w-4 h-4 text-muted-foreground" />
                          ) : (
                            <DollarSign className="w-4 h-4 text-muted-foreground" />
                          )}
                          <div>
                            <p className="font-medium">
                              {doc.document_type === "change_order" ? `CO-${doc.document_number}` : `#${doc.document_number}`}
                            </p>
                            <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                              {doc.document_title}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={cn(
                          "font-medium",
                          doc.amount >= 0 ? "text-success" : "text-destructive"
                        )}>
                          {doc.amount >= 0 ? "+" : ""}${Math.abs(doc.amount).toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        {doc.signatures.contractor ? (
                          <div className="flex items-center gap-1 text-success">
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="text-xs">{doc.signatures.contractor.signer_name}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {doc.signatures.architect ? (
                          <div className="flex items-center gap-1 text-success">
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="text-xs">{doc.signatures.architect.signer_name}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {doc.document_type === "change_order" ? (
                          doc.signatures.owner ? (
                            <div className="flex items-center gap-1 text-success">
                              <CheckCircle2 className="w-4 h-4" />
                              <span className="text-xs">{doc.signatures.owner.signer_name}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )
                        ) : (
                          <span className="text-xs text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {getSignatureStatusBadge(doc.completed_signatures, doc.required_signatures)}
                      </TableCell>
                      <TableCell>
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="mt-4 space-y-4">
          {/* Bulk Actions Bar */}
          {someSelected && (
            <div className="flex items-center gap-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <span className="text-sm font-medium">
                {selectedRequestIds.size} request{selectedRequestIds.size !== 1 ? "s" : ""} selected
              </span>
              <Button
                size="sm"
                onClick={handleBulkSendReminders}
                disabled={isSendingBulkReminders}
                className="gap-2"
              >
                {isSendingBulkReminders ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Bell className="w-4 h-4" />
                )}
                Send Reminders
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelectedRequestIds(new Set())}
              >
                Clear Selection
              </Button>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Pending Signature Requests</CardTitle>
              <CardDescription>
                External signature requests that are awaiting completion
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingRequests.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Mail className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No pending signature requests.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10">
                        <Checkbox
                          checked={allSelected}
                          onCheckedChange={toggleSelectAll}
                          aria-label="Select all"
                        />
                      </TableHead>
                      <TableHead>Document</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Recipient</TableHead>
                      <TableHead>Requested By</TableHead>
                      <TableHead>Expires</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingRequests.map((request) => {
                      const isExpiringSoon = new Date(request.expires_at).getTime() - Date.now() < 2 * 24 * 60 * 60 * 1000;
                      const isExpired = isPast(new Date(request.expires_at));

                      return (
                        <TableRow key={request.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedRequestIds.has(request.id)}
                              onCheckedChange={() => toggleSelectRequest(request.id)}
                              disabled={isExpired}
                              aria-label={`Select request for ${request.recipient_email}`}
                            />
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {request.document_type === "change_order"
                                  ? `CO-${request.document_number}`
                                  : `Pay App #${request.document_number}`}
                              </p>
                              <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                                {request.document_title}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{roleLabels[request.signature_type]}</Badge>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="text-sm">{request.recipient_name || request.recipient_email}</p>
                              <p className="text-xs text-muted-foreground">{request.recipient_email}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {request.requested_by_name || "—"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className={cn(
                              "text-sm",
                              isExpired && "text-destructive",
                              isExpiringSoon && !isExpired && "text-warning"
                            )}>
                              {isExpired ? (
                                <span className="flex items-center gap-1">
                                  <XCircle className="w-3 h-3" />
                                  Expired
                                </span>
                              ) : (
                                formatDistanceToNow(new Date(request.expires_at), { addSuffix: true })
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleSendReminder(request)}
                                disabled={sendReminder.isPending || isExpired}
                                title="Send reminder"
                                className="text-warning hover:text-warning"
                              >
                                <Bell className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleResend(request)}
                                disabled={resendRequest.isPending}
                                title="Resend original request"
                              >
                                <RefreshCw className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCancelRequest(request)}
                                disabled={cancelRequest.isPending}
                                className="text-destructive hover:text-destructive"
                                title="Cancel request"
                              >
                                <XCircle className="w-3 h-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="mt-4">
          <SignatureAnalytics projectId={projectId} />
        </TabsContent>

        <TabsContent value="audit-log" className="mt-4">
          <SignatureAuditLog projectId={projectId} />
        </TabsContent>

        <TabsContent value="templates" className="mt-4">
          <EmailTemplateEditor projectId={projectId} />
        </TabsContent>

        <TabsContent value="contacts" className="mt-4">
          <SignatureContactsManager projectId={projectId} />
        </TabsContent>
      </Tabs>

      {/* Pay Application Signature Dialog */}
      {selectedPayApp && (
        <SignatureCaptureDialog
          open={!!selectedPayApp}
          onOpenChange={(open) => !open && setSelectedPayApp(null)}
          projectId={projectId}
          projectName={projectName}
          payApplicationId={selectedPayApp.id}
          applicationNumber={selectedPayApp.application_number}
          periodFrom={selectedPayApp.period_from}
          periodTo={selectedPayApp.period_to}
          currentPaymentDue={selectedPayApp.current_payment_due}
          adminEmails={adminEmails}
        />
      )}

      {/* Change Order Signature Dialog */}
      {selectedChangeOrder && (
        <ChangeOrderSignatureCaptureDialog
          open={!!selectedChangeOrder}
          onOpenChange={(open) => !open && setSelectedChangeOrder(null)}
          projectId={projectId}
          projectName={projectName}
          changeOrderId={selectedChangeOrder.id}
          coNumber={selectedChangeOrder.co_number}
          coTitle={selectedChangeOrder.title}
          coAmount={selectedChangeOrder.amount}
          adminEmails={adminEmails}
        />
      )}
    </div>
  );
}
