import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/Subcontractor dashboard/ui/card";
import { Button } from "@/components/Subcontractor dashboard/ui/button";
import { Input } from "@/components/Subcontractor dashboard/ui/input";
import { Label } from "@/components/Subcontractor dashboard/ui/label";
import { Textarea } from "@/components/Subcontractor dashboard/ui/textarea";
import { Badge } from "@/components/Subcontractor dashboard/ui/badge";
import { Switch } from "@/components/Subcontractor dashboard/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/Subcontractor dashboard/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Subcontractor dashboard/ui/select";
import { ScrollArea } from "@/components/Subcontractor dashboard/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Subcontractor dashboard/ui/tabs";
import { 
  Mail, 
  Plus, 
  Edit2, 
  Trash2, 
  Eye, 
  Save,
  Loader2,
  Code,
  FileText,
  AlertCircle,
  Send,
} from "lucide-react";
import {
  useEmailTemplates,
  useCreateEmailTemplate,
  useUpdateEmailTemplate,
  useDeleteEmailTemplate,
  TEMPLATE_TYPES,
  DEFAULT_TEMPLATES,
  TemplateType,
  EmailTemplate,
} from "@/hooks/Subcontractor dashboard/useEmailTemplates";
import { useAuth } from "@/context/Subcontractor dashboard/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Sample data for template preview
const SAMPLE_DATA: Record<string, string> = {
  recipient_name: "John Smith",
  project_name: "Downtown Office Tower",
  document_type: "Change Order",
  document_number: "007",
  document_title: "Foundation Reinforcement",
  amount: "$45,000.00",
  signature_type: "Owner",
  requested_by: "Jane Doe",
  signing_url: "https://example.com/sign/abc123",
  expires_at: "February 16, 2026",
  days_remaining: "5",
  signer_name: "John Smith",
  signed_at: "February 9, 2026 at 2:30 PM",
};

function replaceVariablesWithSampleData(template: string): string {
  let result = template;
  for (const [key, value] of Object.entries(SAMPLE_DATA)) {
    result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
  }
  return result;
}

interface EmailTemplateEditorProps {
  projectId: string;
}

export default function EmailTemplateEditor({ projectId }: EmailTemplateEditorProps) {
  const { profile } = useAuth();
  const { data: templates, isLoading } = useEmailTemplates(projectId);
  const createTemplate = useCreateEmailTemplate();
  const updateTemplate = useUpdateEmailTemplate();
  const deleteTemplate = useDeleteEmailTemplate();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);
  const [sendingTestEmail, setSendingTestEmail] = useState(false);

  // Form state for creating/editing
  const [formType, setFormType] = useState<TemplateType>("signature_request");
  const [formName, setFormName] = useState("");
  const [formSubject, setFormSubject] = useState("");
  const [formBody, setFormBody] = useState("");

  const sendTestEmail = async (subject: string, bodyHtml: string, templateType: string) => {
    if (!profile?.email) {
      toast.error("Unable to send test email: No email found");
      return;
    }

    setSendingTestEmail(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const response = await supabase.functions.invoke("send-test-email", {
        body: {
          recipientEmail: profile.email,
          subject,
          bodyHtml,
          templateType,
        },
        headers: {
          Authorization: `Bearer ${sessionData.session?.access_token}`,
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      if (response.data?.success) {
        toast.success(`Test email sent to ${profile.email}`);
      } else if (response.data?.error) {
        // Resend domain verification error
        if (response.data.error.includes("verify a domain")) {
          toast.info("Test email queued. Note: Resend requires domain verification for external delivery.");
        } else {
          toast.error(`Failed to send: ${response.data.error}`);
        }
      }
    } catch (error) {
      console.error("Error sending test email:", error);
      toast.error("Failed to send test email");
    } finally {
      setSendingTestEmail(false);
    }
  };

  // Reset form when opening create dialog
  const openCreateDialog = (type: TemplateType) => {
    const defaults = DEFAULT_TEMPLATES[type];
    setFormType(type);
    setFormName(TEMPLATE_TYPES[type].label);
    setFormSubject(defaults.subject);
    setFormBody(defaults.body_html);
    setIsCreateDialogOpen(true);
  };

  // Load template data when editing
  useEffect(() => {
    if (editingTemplate) {
      setFormType(editingTemplate.template_type);
      setFormName(editingTemplate.name);
      setFormSubject(editingTemplate.subject);
      setFormBody(editingTemplate.body_html);
    }
  }, [editingTemplate]);

  const handleCreate = async () => {
    await createTemplate.mutateAsync({
      projectId,
      templateType: formType,
      name: formName,
      subject: formSubject,
      bodyHtml: formBody,
    });
    setIsCreateDialogOpen(false);
  };

  const handleUpdate = async () => {
    if (!editingTemplate) return;
    await updateTemplate.mutateAsync({
      id: editingTemplate.id,
      projectId,
      name: formName,
      subject: formSubject,
      bodyHtml: formBody,
    });
    setEditingTemplate(null);
  };

  const handleDelete = async (template: EmailTemplate) => {
    if (confirm("Are you sure you want to delete this template?")) {
      await deleteTemplate.mutateAsync({ id: template.id, projectId });
    }
  };

  const handleToggleActive = async (template: EmailTemplate) => {
    await updateTemplate.mutateAsync({
      id: template.id,
      projectId,
      isActive: !template.is_active,
    });
  };

  const copyVariable = (variable: string) => {
    navigator.clipboard.writeText(variable);
    toast.success(`Copied ${variable} to clipboard`);
  };

  const insertVariable = (variable: string) => {
    setFormBody(prev => prev + variable);
  };

  // Get templates that haven't been created yet
  const existingTypes = templates?.map(t => t.template_type) || [];
  const availableTypes = (Object.keys(TEMPLATE_TYPES) as TemplateType[]).filter(
    type => !existingTypes.includes(type)
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Email Templates</h3>
          <p className="text-sm text-muted-foreground">
            Customize the emails sent for signature requests
          </p>
        </div>
        
        {availableTypes.length > 0 && (
          <Select onValueChange={(value) => openCreateDialog(value as TemplateType)}>
            <SelectTrigger className="w-[200px]">
              <Plus className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Add template" />
            </SelectTrigger>
            <SelectContent>
              {availableTypes.map(type => (
                <SelectItem key={type} value={type}>
                  {TEMPLATE_TYPES[type].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Templates List */}
      {templates && templates.length > 0 ? (
        <div className="space-y-4">
          {templates.map(template => (
            <Card key={template.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        {template.name}
                        {!template.is_active && (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </CardTitle>
                      <CardDescription>
                        {TEMPLATE_TYPES[template.template_type as TemplateType]?.description}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={template.is_active}
                      onCheckedChange={() => handleToggleActive(template)}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setPreviewTemplate(template)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingTemplate(template)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => handleDelete(template)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <span className="text-muted-foreground">Subject: </span>
                  <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                    {template.subject}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No custom templates</p>
              <p className="text-sm mb-4">Default templates are used for all email notifications</p>
              <Select onValueChange={(value) => openCreateDialog(value as TemplateType)}>
                <SelectTrigger className="w-[200px] mx-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Create template" />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(TEMPLATE_TYPES) as TemplateType[]).map(type => (
                    <SelectItem key={type} value={type}>
                      {TEMPLATE_TYPES[type].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create/Edit Dialog */}
      <Dialog 
        open={isCreateDialogOpen || !!editingTemplate} 
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateDialogOpen(false);
            setEditingTemplate(null);
          }
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? "Edit Template" : "Create Email Template"}
            </DialogTitle>
            <DialogDescription>
              {editingTemplate 
                ? `Editing ${TEMPLATE_TYPES[editingTemplate.template_type as TemplateType]?.label}`
                : `Creating ${TEMPLATE_TYPES[formType]?.label} template`
              }
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-hidden">
            <div className="grid grid-cols-3 gap-4 h-full">
              {/* Editor */}
              <div className="col-span-2 space-y-4">
                <div className="space-y-2">
                  <Label>Template Name</Label>
                  <Input
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g., Signature Request"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Subject Line</Label>
                  <Input
                    value={formSubject}
                    onChange={(e) => setFormSubject(e.target.value)}
                    placeholder="Email subject..."
                    className="font-mono text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Email Body (HTML)</Label>
                  <Tabs defaultValue="code">
                    <TabsList className="mb-2">
                      <TabsTrigger value="code" className="gap-2">
                        <Code className="w-4 h-4" />
                        Code
                      </TabsTrigger>
                      <TabsTrigger value="preview" className="gap-2">
                        <Eye className="w-4 h-4" />
                        Preview
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="code">
                      <Textarea
                        value={formBody}
                        onChange={(e) => setFormBody(e.target.value)}
                        placeholder="<div>Your HTML content...</div>"
                        className="font-mono text-xs h-[300px] resize-none"
                      />
                    </TabsContent>
                    <TabsContent value="preview">
                      <div className="border rounded-md h-[300px] overflow-hidden flex flex-col bg-muted/30">
                        <div className="px-3 py-2 border-b bg-muted/50 flex items-center justify-between">
                          <span className="text-xs text-muted-foreground font-medium">
                            Preview with sample data
                          </span>
                          <Badge variant="outline" className="text-xs">
                            Variables replaced
                          </Badge>
                        </div>
                        <div className="flex-1 overflow-auto p-4 bg-white">
                          <div className="mb-3 pb-3 border-b">
                            <span className="text-xs text-muted-foreground">Subject: </span>
                            <span className="text-sm font-medium">
                              {replaceVariablesWithSampleData(formSubject)}
                            </span>
                          </div>
                          <div 
                            dangerouslySetInnerHTML={{ 
                              __html: replaceVariablesWithSampleData(formBody) 
                            }}
                          />
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>

              {/* Variables Panel */}
              <div className="border-l pl-4">
                <div className="sticky top-0">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Available Variables
                  </h4>
                  <p className="text-xs text-muted-foreground mb-4">
                    Click to copy, double-click to insert
                  </p>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-1">
                      {TEMPLATE_TYPES[formType]?.variables.map(variable => (
                        <button
                          key={variable}
                          onClick={() => copyVariable(variable)}
                          onDoubleClick={() => insertVariable(variable)}
                          className="w-full text-left px-2 py-1.5 text-xs font-mono bg-muted rounded hover:bg-muted/80 transition-colors"
                        >
                          {variable}
                        </button>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateDialogOpen(false);
                setEditingTemplate(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={editingTemplate ? handleUpdate : handleCreate}
              disabled={createTemplate.isPending || updateTemplate.isPending}
            >
              {(createTemplate.isPending || updateTemplate.isPending) && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              <Save className="w-4 h-4 mr-2" />
              {editingTemplate ? "Save Changes" : "Create Template"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={!!previewTemplate} onOpenChange={(open) => !open && setPreviewTemplate(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Template Preview
            </DialogTitle>
            <DialogDescription>
              Preview of "{previewTemplate?.name}" with sample data
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-hidden space-y-4">
            <div className="p-3 bg-muted/50 rounded-lg border">
              <Label className="text-xs text-muted-foreground mb-1 block">Subject</Label>
              <p className="font-medium text-sm">
                {replaceVariablesWithSampleData(previewTemplate?.subject || "")}
              </p>
            </div>
            
            <div className="border rounded-lg overflow-hidden flex-1 flex flex-col">
              <div className="px-3 py-2 border-b bg-muted/50 flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Email Body</span>
              </div>
              <ScrollArea className="flex-1 max-h-[300px]">
                <div 
                  className="p-4 bg-white"
                  dangerouslySetInnerHTML={{ 
                    __html: replaceVariablesWithSampleData(previewTemplate?.body_html || "") 
                  }}
                />
              </ScrollArea>
            </div>

            <div className="flex items-start gap-2 p-3 bg-primary/5 rounded-lg border border-primary/20">
              <AlertCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div className="text-xs text-muted-foreground">
                <p className="font-medium mb-1 text-foreground">Sample Data Used:</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
                  <span>Recipient: {SAMPLE_DATA.recipient_name}</span>
                  <span>Project: {SAMPLE_DATA.project_name}</span>
                  <span>Document: {SAMPLE_DATA.document_type} #{SAMPLE_DATA.document_number}</span>
                  <span>Amount: {SAMPLE_DATA.amount}</span>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex-row gap-2 sm:justify-between">
            <Button
              variant="outline"
              onClick={() => previewTemplate && sendTestEmail(
                previewTemplate.subject,
                previewTemplate.body_html,
                previewTemplate.template_type
              )}
              disabled={sendingTestEmail || !profile?.email}
            >
              {sendingTestEmail ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Test to {profile?.email ? profile.email.split("@")[0] + "@..." : "Me"}
                </>
              )}
            </Button>
            <Button variant="secondary" onClick={() => setPreviewTemplate(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
