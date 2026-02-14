import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type TemplateType = 
  | "signature_request"
  | "signature_reminder"
  | "signature_completed";

export interface EmailTemplate {
  id: string;
  project_id: string;
  template_type: TemplateType;
  name: string;
  subject: string;
  body_html: string;
  available_variables: string[];
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export const TEMPLATE_TYPES: Record<TemplateType, { label: string; description: string; variables: string[] }> = {
  signature_request: {
    label: "Signature Request",
    description: "Sent when requesting a signature from an external party",
    variables: [
      "{{recipient_name}}",
      "{{project_name}}",
      "{{document_type}}",
      "{{document_number}}",
      "{{document_title}}",
      "{{amount}}",
      "{{signature_type}}",
      "{{requested_by}}",
      "{{signing_url}}",
      "{{expires_at}}",
    ],
  },
  signature_reminder: {
    label: "Signature Reminder",
    description: "Sent as a follow-up reminder for pending signatures",
    variables: [
      "{{recipient_name}}",
      "{{project_name}}",
      "{{document_type}}",
      "{{document_number}}",
      "{{document_title}}",
      "{{amount}}",
      "{{signature_type}}",
      "{{signing_url}}",
      "{{expires_at}}",
      "{{days_remaining}}",
    ],
  },
  signature_completed: {
    label: "Signature Completed",
    description: "Sent to notify when a signature has been collected",
    variables: [
      "{{signer_name}}",
      "{{project_name}}",
      "{{document_type}}",
      "{{document_number}}",
      "{{document_title}}",
      "{{amount}}",
      "{{signature_type}}",
      "{{signed_at}}",
    ],
  },
};

export const DEFAULT_TEMPLATES: Record<TemplateType, { subject: string; body_html: string }> = {
  signature_request: {
    subject: "Signature Required: {{document_type}} #{{document_number}} - {{project_name}}",
    body_html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #1a1a1a;">Signature Request</h2>
  <p>Hello {{recipient_name}},</p>
  <p>You have been requested to sign a document for <strong>{{project_name}}</strong>.</p>
  
  <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 20px 0;">
    <p style="margin: 0;"><strong>Document:</strong> {{document_type}} #{{document_number}}</p>
    <p style="margin: 8px 0 0;"><strong>Title:</strong> {{document_title}}</p>
    <p style="margin: 8px 0 0;"><strong>Amount:</strong> {{amount}}</p>
    <p style="margin: 8px 0 0;"><strong>Your Role:</strong> {{signature_type}}</p>
  </div>
  
  <p>Requested by: {{requested_by}}</p>
  
  <div style="text-align: center; margin: 30px 0;">
    <a href="{{signing_url}}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
      Review & Sign Document
    </a>
  </div>
  
  <p style="color: #666; font-size: 14px;">This link expires on {{expires_at}}.</p>
  <p style="color: #666; font-size: 14px;">If you have any questions, please contact the project team.</p>
</div>`,
  },
  signature_reminder: {
    subject: "Reminder: Signature Needed - {{document_type}} #{{document_number}}",
    body_html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #1a1a1a;">Signature Reminder</h2>
  <p>Hello {{recipient_name}},</p>
  <p>This is a friendly reminder that your signature is still pending for a document on <strong>{{project_name}}</strong>.</p>
  
  <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 16px; margin: 20px 0;">
    <p style="margin: 0; color: #856404;"><strong>⏰ {{days_remaining}} days remaining</strong> before this request expires.</p>
  </div>
  
  <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 20px 0;">
    <p style="margin: 0;"><strong>Document:</strong> {{document_type}} #{{document_number}}</p>
    <p style="margin: 8px 0 0;"><strong>Title:</strong> {{document_title}}</p>
    <p style="margin: 8px 0 0;"><strong>Amount:</strong> {{amount}}</p>
  </div>
  
  <div style="text-align: center; margin: 30px 0;">
    <a href="{{signing_url}}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
      Sign Now
    </a>
  </div>
  
  <p style="color: #666; font-size: 14px;">This link expires on {{expires_at}}.</p>
</div>`,
  },
  signature_completed: {
    subject: "Signature Received: {{document_type}} #{{document_number}} - {{project_name}}",
    body_html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #1a1a1a;">✅ Signature Completed</h2>
  <p>A signature has been successfully collected for <strong>{{project_name}}</strong>.</p>
  
  <div style="background: #d4edda; border-left: 4px solid #28a745; padding: 16px; margin: 20px 0;">
    <p style="margin: 0; color: #155724;"><strong>{{signer_name}}</strong> signed as <strong>{{signature_type}}</strong></p>
    <p style="margin: 8px 0 0; color: #155724;">Signed on: {{signed_at}}</p>
  </div>
  
  <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 20px 0;">
    <p style="margin: 0;"><strong>Document:</strong> {{document_type}} #{{document_number}}</p>
    <p style="margin: 8px 0 0;"><strong>Title:</strong> {{document_title}}</p>
    <p style="margin: 8px 0 0;"><strong>Amount:</strong> {{amount}}</p>
  </div>
  
  <p style="color: #666; font-size: 14px;">You can view the signed document in your project dashboard.</p>
</div>`,
  },
};

export function useEmailTemplates(projectId: string) {
  return useQuery({
    queryKey: ["email-templates", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("email_templates")
        .select("*")
        .eq("project_id", projectId)
        .order("template_type");

      if (error) throw error;
      return data as EmailTemplate[];
    },
    enabled: !!projectId,
  });
}

export function useCreateEmailTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      projectId: string;
      templateType: TemplateType;
      name: string;
      subject: string;
      bodyHtml: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", user.id)
        .single();

      const templateConfig = TEMPLATE_TYPES[params.templateType];

      const insertData = {
        project_id: params.projectId,
        template_type: params.templateType,
        name: params.name,
        subject: params.subject,
        body_html: params.bodyHtml,
        available_variables: templateConfig.variables,
        created_by: profile?.id || null,
      };

      const { data, error } = await supabase
        .from("email_templates")
        .insert(insertData as never)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["email-templates", variables.projectId] });
      toast.success("Email template created");
    },
    onError: (error: Error) => {
      toast.error(`Failed to create template: ${error.message}`);
    },
  });
}

export function useUpdateEmailTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      id: string;
      projectId: string;
      name?: string;
      subject?: string;
      bodyHtml?: string;
      isActive?: boolean;
    }) => {
      const updateData: Record<string, unknown> = {};
      if (params.name !== undefined) updateData.name = params.name;
      if (params.subject !== undefined) updateData.subject = params.subject;
      if (params.bodyHtml !== undefined) updateData.body_html = params.bodyHtml;
      if (params.isActive !== undefined) updateData.is_active = params.isActive;

      const { data, error } = await supabase
        .from("email_templates")
        .update(updateData as never)
        .eq("id", params.id)
        .select()
        .single();

      if (error) throw error;
      return { ...data, projectId: params.projectId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["email-templates", data.projectId] });
      toast.success("Email template updated");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update template: ${error.message}`);
    },
  });
}

export function useDeleteEmailTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { id: string; projectId: string }) => {
      const { error } = await supabase
        .from("email_templates")
        .delete()
        .eq("id", params.id);

      if (error) throw error;
      return params;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["email-templates", data.projectId] });
      toast.success("Email template deleted");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete template: ${error.message}`);
    },
  });
}
