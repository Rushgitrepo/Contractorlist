import { useState } from "react";
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
import { Badge } from "@/components/Subcontractor dashboard/ui/badge";
import { Separator } from "@/components/Subcontractor dashboard/ui/separator";
import { ScrollArea } from "@/components/Subcontractor dashboard/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Subcontractor dashboard/ui/tabs";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/Subcontractor dashboard/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/Subcontractor dashboard/ui/popover";
import { Checkbox } from "@/components/Subcontractor dashboard/ui/checkbox";
import { 
  Mail, 
  Loader2, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Plus, 
  Trash2,
  Users,
  User,
  Send,
  BookUser,
  ChevronsUpDown,
  Star,
} from "lucide-react";
import {
  useSignatureRequests,
  useCreateSignatureRequest,
  useSendSignatureRequestEmail,
  useCancelSignatureRequest,
  useResendSignatureRequest,
} from "@/hooks/Subcontractor dashboard/useSignatureRequests";
import { 
  useSignatureContacts, 
  useCreateSignatureContact,
  SignatureContact 
} from "@/hooks/Subcontractor dashboard/useSignatureContacts";
import { useAuth } from "@/context/Subcontractor dashboard/contexts/AuthContext";
import { format } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface RequestSignatureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  projectName: string;
  documentType: "pay_application" | "change_order";
  documentId: string;
  documentNumber: number;
  documentTitle: string;
  amount?: number;
  missingSignatures: Array<"contractor" | "architect" | "owner">;
}

interface BatchRecipient {
  id: string;
  signatureType: "contractor" | "architect" | "owner";
  email: string;
  name: string;
}

const ROLE_LABELS: Record<string, string> = {
  contractor: "Contractor",
  architect: "Architect",
  owner: "Owner",
};

export default function RequestSignatureDialog({
  open,
  onOpenChange,
  projectId,
  projectName,
  documentType,
  documentId,
  documentNumber,
  documentTitle,
  amount,
  missingSignatures,
}: RequestSignatureDialogProps) {
  const { profile } = useAuth();
  
  // Single request state
  const [selectedType, setSelectedType] = useState<"contractor" | "architect" | "owner" | null>(null);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [saveAsContact, setSaveAsContact] = useState(false);
  const [contactsPopoverOpen, setContactsPopoverOpen] = useState(false);
  
  // Batch request state
  const [batchRecipients, setBatchRecipients] = useState<BatchRecipient[]>([]);
  const [batchSending, setBatchSending] = useState(false);
  const [batchProgress, setBatchProgress] = useState({ sent: 0, total: 0 });

  const { data: existingRequests = [], isLoading: loadingRequests } = useSignatureRequests(
    projectId,
    documentId,
    documentType
  );

  const { data: contacts = [] } = useSignatureContacts(projectId);
  const createContact = useCreateSignatureContact();

  const createRequest = useCreateSignatureRequest();
  const sendEmail = useSendSignatureRequestEmail();
  const cancelRequest = useCancelSignatureRequest();
  const resendRequest = useResendSignatureRequest();

  const pendingRequests = existingRequests.filter((r) => r.status === "pending");

  // Get available signature types (not already pending or in batch)
  const getAvailableTypes = (excludeId?: string) => {
    const pendingTypes = pendingRequests.map((r) => r.signature_type);
    const batchTypes = batchRecipients
      .filter((r) => r.id !== excludeId)
      .map((r) => r.signatureType);
    return missingSignatures.filter(
      (type) => !pendingTypes.includes(type) && !batchTypes.includes(type)
    );
  };

  // Filter contacts that match the selected signature type
  const getFilteredContacts = () => {
    if (!selectedType) return contacts;
    return contacts.filter(
      (c) => !c.default_role || c.default_role === selectedType
    );
  };

  const handleSelectContact = (contact: SignatureContact) => {
    setRecipientEmail(contact.email);
    setRecipientName(contact.name);
    if (contact.default_role && missingSignatures.includes(contact.default_role)) {
      const hasPending = pendingRequests.some((r) => r.signature_type === contact.default_role);
      const isInBatch = batchRecipients.some((r) => r.signatureType === contact.default_role);
      if (!hasPending && !isInBatch) {
        setSelectedType(contact.default_role);
      }
    }
    setContactsPopoverOpen(false);
  };

  const handleSendSingleRequest = async () => {
    if (!selectedType || !recipientEmail.trim()) return;

    try {
      // Save as contact if checkbox is checked
      if (saveAsContact && recipientName.trim()) {
        const existingContact = contacts.find(
          (c) => c.email.toLowerCase() === recipientEmail.trim().toLowerCase()
        );
        if (!existingContact) {
          try {
            await createContact.mutateAsync({
              projectId,
              name: recipientName.trim(),
              email: recipientEmail.trim(),
              defaultRole: selectedType,
            });
          } catch (e) {
            // Contact creation failed, but continue with signature request
            console.warn("Failed to save contact:", e);
          }
        }
      }

      const request = await createRequest.mutateAsync({
        project_id: projectId,
        [documentType === "pay_application" ? "pay_application_id" : "change_order_id"]: documentId,
        signature_type: selectedType,
        recipient_email: recipientEmail.trim(),
        recipient_name: recipientName.trim() || undefined,
      });

      const baseUrl = window.location.origin;
      const signingUrl = `${baseUrl}/sign/${request.token}`;

      await sendEmail.mutateAsync({
        requestId: request.id,
        projectId,
        recipientEmail: recipientEmail.trim(),
        recipientName: recipientName.trim() || recipientEmail.trim(),
        projectName,
        documentType,
        documentNumber,
        documentTitle,
        signatureType: selectedType,
        amount,
        requestedByName: profile?.full_name || profile?.email || "A team member",
        signingUrl,
        expiresAt: request.expires_at,
      });

      setSelectedType(null);
      setRecipientEmail("");
      setRecipientName("");
      setSaveAsContact(false);
    } catch (error) {
      // Error handling is done in the hooks
    }
  };

  const handleAddBatchRecipient = () => {
    const availableTypes = getAvailableTypes();
    if (availableTypes.length === 0) return;

    setBatchRecipients((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        signatureType: availableTypes[0],
        email: "",
        name: "",
      },
    ]);
  };

  const handleUpdateBatchRecipient = (
    id: string,
    field: keyof BatchRecipient,
    value: string
  ) => {
    setBatchRecipients((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const handleRemoveBatchRecipient = (id: string) => {
    setBatchRecipients((prev) => prev.filter((r) => r.id !== id));
  };

  const handleSendBatchRequests = async () => {
    const validRecipients = batchRecipients.filter((r) => r.email.trim());
    if (validRecipients.length === 0) return;

    setBatchSending(true);
    setBatchProgress({ sent: 0, total: validRecipients.length });

    let successCount = 0;
    let failCount = 0;

    for (const recipient of validRecipients) {
      try {
        const request = await createRequest.mutateAsync({
          project_id: projectId,
          [documentType === "pay_application" ? "pay_application_id" : "change_order_id"]: documentId,
          signature_type: recipient.signatureType,
          recipient_email: recipient.email.trim(),
          recipient_name: recipient.name.trim() || undefined,
        });

        const baseUrl = window.location.origin;
        const signingUrl = `${baseUrl}/sign/${request.token}`;

        await sendEmail.mutateAsync({
          requestId: request.id,
          projectId,
          recipientEmail: recipient.email.trim(),
          recipientName: recipient.name.trim() || recipient.email.trim(),
          projectName,
          documentType,
          documentNumber,
          documentTitle,
          signatureType: recipient.signatureType,
          amount,
          requestedByName: profile?.full_name || profile?.email || "A team member",
          signingUrl,
          expiresAt: request.expires_at,
        });

        successCount++;
        setBatchProgress((prev) => ({ ...prev, sent: prev.sent + 1 }));
      } catch (error) {
        failCount++;
        console.error(`Failed to send request to ${recipient.email}:`, error);
      }
    }

    setBatchSending(false);
    setBatchRecipients([]);
    setBatchProgress({ sent: 0, total: 0 });

    if (successCount > 0 && failCount === 0) {
      toast.success(`Successfully sent ${successCount} signature request${successCount > 1 ? "s" : ""}`);
    } else if (successCount > 0 && failCount > 0) {
      toast.warning(`Sent ${successCount} request${successCount > 1 ? "s" : ""}, ${failCount} failed`);
    } else {
      toast.error("Failed to send signature requests");
    }
  };

  const handleResend = async (request: typeof existingRequests[0]) => {
    const baseUrl = window.location.origin;
    const signingUrl = `${baseUrl}/sign/${request.token}`;

    await resendRequest.mutateAsync({
      requestId: request.id,
      projectId,
      recipientEmail: request.recipient_email,
      recipientName: request.recipient_name || request.recipient_email,
      projectName,
      documentType,
      documentNumber,
      documentTitle,
      signatureType: request.signature_type as "contractor" | "architect" | "owner",
      amount,
      requestedByName: profile?.full_name || profile?.email || "A team member",
      signingUrl,
      expiresAt: request.expires_at,
    });
  };

  const handleCancel = async (requestId: string) => {
    await cancelRequest.mutateAsync({ id: requestId, projectId });
  };

  const isSending = createRequest.isPending || sendEmail.isPending;
  const availableTypesForNew = getAvailableTypes();
  const validBatchRecipients = batchRecipients.filter((r) => r.email.trim());

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Request External Signatures
          </DialogTitle>
          <DialogDescription>
            Send signature requests via email. Request one at a time or batch multiple requests.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {/* Pending Requests */}
          {pendingRequests.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Pending Requests ({pendingRequests.length})
              </h4>
              <ScrollArea className="max-h-[120px]">
                <div className="space-y-2">
                  {pendingRequests.map((request) => (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-2 rounded-lg border bg-muted/30"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Badge variant="outline" className="text-xs shrink-0">
                          {ROLE_LABELS[request.signature_type]}
                        </Badge>
                        <span className="text-sm truncate">
                          {request.recipient_name || request.recipient_email}
                        </span>
                        <span className="text-xs text-muted-foreground shrink-0">
                          expires {format(new Date(request.expires_at), "MMM d")}
                        </span>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleResend(request)}
                          disabled={resendRequest.isPending}
                        >
                          <RefreshCw className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:text-destructive"
                          onClick={() => handleCancel(request.id)}
                          disabled={cancelRequest.isPending}
                        >
                          <XCircle className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <Separator className="mt-4" />
            </div>
          )}

          {/* New Request Forms */}
          {missingSignatures.length > 0 && availableTypesForNew.length > 0 ? (
            <Tabs defaultValue="single" className="flex-1">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="single" className="gap-2">
                  <User className="w-4 h-4" />
                  Single Request
                </TabsTrigger>
                <TabsTrigger value="batch" className="gap-2">
                  <Users className="w-4 h-4" />
                  Batch Request
                </TabsTrigger>
              </TabsList>

              {/* Single Request Tab */}
              <TabsContent value="single" className="space-y-4 mt-4">
                {/* Saved Contacts Picker */}
                {contacts.length > 0 && (
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <BookUser className="w-4 h-4" />
                      Quick Select from Contacts
                    </Label>
                    <Popover open={contactsPopoverOpen} onOpenChange={setContactsPopoverOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="w-full justify-between"
                        >
                          <span className="text-muted-foreground">
                            {recipientEmail 
                              ? contacts.find(c => c.email === recipientEmail)?.name || "Select a contact..."
                              : "Select a contact..."}
                          </span>
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[400px] p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Search contacts..." />
                          <CommandList>
                            <CommandEmpty>No contacts found.</CommandEmpty>
                            <CommandGroup>
                              {getFilteredContacts().map((contact) => (
                                <CommandItem
                                  key={contact.id}
                                  value={`${contact.name} ${contact.email}`}
                                  onSelect={() => handleSelectContact(contact)}
                                  className="cursor-pointer"
                                >
                                  <div className="flex items-center gap-3 flex-1">
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2">
                                        <span className="font-medium truncate">{contact.name}</span>
                                        {contact.default_role && (
                                          <Badge variant="secondary" className="text-xs shrink-0">
                                            {ROLE_LABELS[contact.default_role]}
                                          </Badge>
                                        )}
                                      </div>
                                      <span className="text-xs text-muted-foreground truncate block">
                                        {contact.email}
                                        {contact.company && ` • ${contact.company}`}
                                      </span>
                                    </div>
                                    {contact.email === recipientEmail && (
                                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                                    )}
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Signature Type *</Label>
                  <div className="flex gap-2 flex-wrap">
                    {missingSignatures.map((type) => {
                      const hasPendingRequest = pendingRequests.some(
                        (r) => r.signature_type === type
                      );
                      const isInBatch = batchRecipients.some(
                        (r) => r.signatureType === type
                      );
                      return (
                        <Button
                          key={type}
                          variant={selectedType === type ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedType(type)}
                          disabled={hasPendingRequest || isInBatch}
                        >
                          {ROLE_LABELS[type]}
                          {hasPendingRequest && (
                            <Clock className="w-3 h-3 ml-1 text-warning" />
                          )}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="recipient-email">Email Address *</Label>
                    <Input
                      id="recipient-email"
                      type="email"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      placeholder="recipient@company.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recipient-name">Name</Label>
                    <Input
                      id="recipient-name"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="John Smith"
                    />
                  </div>
                </div>

                {/* Save as contact checkbox */}
                {recipientEmail.trim() && recipientName.trim() && !contacts.find(
                  c => c.email.toLowerCase() === recipientEmail.trim().toLowerCase()
                ) && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="save-contact"
                      checked={saveAsContact}
                      onCheckedChange={(checked) => setSaveAsContact(checked === true)}
                    />
                    <label
                      htmlFor="save-contact"
                      className="text-sm text-muted-foreground cursor-pointer flex items-center gap-1"
                    >
                      <Star className="w-3 h-3" />
                      Save as contact for future requests
                    </label>
                  </div>
                )}

                <Button
                  onClick={handleSendSingleRequest}
                  disabled={!selectedType || !recipientEmail.trim() || isSending}
                  className="w-full"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Send Signature Request
                    </>
                  )}
                </Button>
              </TabsContent>

              {/* Batch Request Tab */}
              <TabsContent value="batch" className="space-y-4 mt-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Add multiple recipients to send requests at once.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddBatchRecipient}
                    disabled={getAvailableTypes().length === 0}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Recipient
                  </Button>
                </div>

                {batchRecipients.length > 0 ? (
                  <ScrollArea className="max-h-[200px]">
                    <div className="space-y-3 pr-2">
                      {batchRecipients.map((recipient, index) => (
                        <div
                          key={recipient.id}
                          className="p-3 rounded-lg border bg-muted/20 space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                              Recipient {index + 1}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-destructive hover:text-destructive"
                              onClick={() => handleRemoveBatchRecipient(recipient.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>

                          <div className="grid gap-3 sm:grid-cols-3">
                            <div className="space-y-1">
                              <Label className="text-xs">Role *</Label>
                              <select
                                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                                value={recipient.signatureType}
                                onChange={(e) =>
                                  handleUpdateBatchRecipient(
                                    recipient.id,
                                    "signatureType",
                                    e.target.value as "contractor" | "architect" | "owner"
                                  )
                                }
                              >
                                {missingSignatures
                                  .filter(
                                    (type) =>
                                      type === recipient.signatureType ||
                                      getAvailableTypes(recipient.id).includes(type)
                                  )
                                  .map((type) => (
                                    <option key={type} value={type}>
                                      {ROLE_LABELS[type]}
                                    </option>
                                  ))}
                              </select>
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Email *</Label>
                              <Input
                                type="email"
                                value={recipient.email}
                                onChange={(e) =>
                                  handleUpdateBatchRecipient(
                                    recipient.id,
                                    "email",
                                    e.target.value
                                  )
                                }
                                placeholder="email@company.com"
                                className="h-9"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Name</Label>
                              <Input
                                value={recipient.name}
                                onChange={(e) =>
                                  handleUpdateBatchRecipient(
                                    recipient.id,
                                    "name",
                                    e.target.value
                                  )
                                }
                                placeholder="John Smith"
                                className="h-9"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="text-center py-8 border rounded-lg border-dashed">
                    <Users className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      No recipients added yet
                    </p>
                    <Button
                      variant="link"
                      size="sm"
                      onClick={handleAddBatchRecipient}
                      disabled={getAvailableTypes().length === 0}
                    >
                      Add your first recipient
                    </Button>
                  </div>
                )}

                {batchRecipients.length > 0 && (
                  <Button
                    onClick={handleSendBatchRequests}
                    disabled={validBatchRecipients.length === 0 || batchSending}
                    className="w-full"
                  >
                    {batchSending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending {batchProgress.sent}/{batchProgress.total}...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send {validBatchRecipients.length} Request
                        {validBatchRecipients.length !== 1 ? "s" : ""}
                      </>
                    )}
                  </Button>
                )}
              </TabsContent>
            </Tabs>
          ) : missingSignatures.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-10 h-10 text-success mx-auto mb-3" />
              <p className="font-medium">All Signatures Complete</p>
              <p className="text-sm text-muted-foreground">
                All required signatures have been captured.
              </p>
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock className="w-10 h-10 text-warning mx-auto mb-3" />
              <p className="font-medium">Requests Pending</p>
              <p className="text-sm text-muted-foreground">
                All signature types have pending requests.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
