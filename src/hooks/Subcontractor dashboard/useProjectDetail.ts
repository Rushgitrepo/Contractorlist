import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/Subcontractor dashboard/contexts/AuthContext";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";
import { sendRFIAssignedNotification, sendChangeOrderNotification } from "./useNotifications";

type Project = Database["public"]["Tables"]["projects"]["Row"];
type RFI = Database["public"]["Tables"]["rfis"]["Row"];
type ChangeOrder = Database["public"]["Tables"]["change_orders"]["Row"];
type DailyLog = Database["public"]["Tables"]["daily_logs"]["Row"];
type ProjectMember = Database["public"]["Tables"]["project_members"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export function useProject(projectId: string | undefined) {
  return useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      if (!projectId) return null;

      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .maybeSingle();

      if (error) throw error;
      return data as Project | null;
    },
    enabled: !!projectId,
  });
}

export function useProjectRFIs(projectId: string | undefined) {
  return useQuery({
    queryKey: ["project-rfis", projectId],
    queryFn: async () => {
      if (!projectId) return [];

      const { data, error } = await supabase
        .from("rfis")
        .select(`
          *,
          created_by_profile:profiles!rfis_created_by_fkey(id, full_name, email),
          assigned_to_profile:profiles!rfis_assigned_to_fkey(id, full_name, email),
          responded_by_profile:profiles!rfis_responded_by_fkey(id, full_name, email)
        `)
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!projectId,
  });
}

export function useProjectChangeOrders(projectId: string | undefined) {
  return useQuery({
    queryKey: ["project-change-orders", projectId],
    queryFn: async () => {
      if (!projectId) return [];

      const { data, error } = await supabase
        .from("change_orders")
        .select(`
          *,
          created_by_profile:profiles!change_orders_created_by_fkey(id, full_name, email),
          approved_by_profile:profiles!change_orders_approved_by_fkey(id, full_name, email)
        `)
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!projectId,
  });
}

export function useProjectMembers(projectId: string | undefined) {
  return useQuery({
    queryKey: ["project-members", projectId],
    queryFn: async () => {
      if (!projectId) return [];

      const { data, error } = await supabase
        .from("project_members")
        .select(`
          *,
          profile:profiles!project_members_user_id_fkey(id, full_name, email, company_name, phone, avatar_url),
          subcontractor:subcontractors(id, company_name, trade)
        `)
        .eq("project_id", projectId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!projectId,
  });
}

export function useProjectDailyLogs(projectId: string | undefined) {
  return useQuery({
    queryKey: ["project-daily-logs", projectId],
    queryFn: async () => {
      if (!projectId) return [];

      const { data, error } = await supabase
        .from("daily_logs")
        .select(`
          *,
          author:profiles!daily_logs_author_id_fkey(id, full_name, email)
        `)
        .eq("project_id", projectId)
        .order("log_date", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!projectId,
  });
}

export function useCreateRFI(projectId: string) {
  const queryClient = useQueryClient();
  const { profile } = useAuth();

  return useMutation({
    mutationFn: async (rfiData: {
      title: string;
      description?: string;
      assigned_to?: string;
      due_date?: string;
      projectName?: string;
      assigneeName?: string;
      assigneeEmail?: string;
    }) => {
      if (!profile?.id) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("rfis")
        .insert({
          project_id: projectId,
          title: rfiData.title,
          description: rfiData.description || null,
          assigned_to: rfiData.assigned_to || null,
          due_date: rfiData.due_date || null,
          created_by: profile.id,
          status: "open",
        })
        .select()
        .single();

      if (error) throw error;

      // Send notification if RFI is assigned to someone
      if (rfiData.assigned_to && rfiData.assigneeEmail) {
        sendRFIAssignedNotification({
          recipientEmail: rfiData.assigneeEmail,
          recipientName: rfiData.assigneeName || null,
          projectName: rfiData.projectName || "Project",
          rfiTitle: rfiData.title,
          rfiNumber: data.rfi_number,
          assignedByName: profile.full_name,
          dueDate: rfiData.due_date || null,
          projectId,
        }).catch((err) => console.error("Failed to send RFI notification:", err));
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-rfis", projectId] });
      toast.success("RFI created successfully");
    },
    onError: (error) => {
      console.error("Error creating RFI:", error);
      toast.error("Failed to create RFI");
    },
  });
}

export function useCreateChangeOrder(projectId: string) {
  const queryClient = useQueryClient();
  const { profile } = useAuth();

  return useMutation({
    mutationFn: async (coData: {
      title: string;
      description?: string;
      amount: number;
      reason?: string;
      projectName?: string;
      adminEmails?: { email: string; name: string | null }[];
    }) => {
      if (!profile?.id) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("change_orders")
        .insert({
          project_id: projectId,
          title: coData.title,
          description: coData.description || null,
          amount: coData.amount,
          reason: coData.reason || null,
          created_by: profile.id,
          status: "pending",
        })
        .select()
        .single();

      if (error) throw error;

      // Send notifications to all project admins
      if (coData.adminEmails && coData.adminEmails.length > 0) {
        for (const admin of coData.adminEmails) {
          sendChangeOrderNotification({
            recipientEmail: admin.email,
            recipientName: admin.name,
            projectName: coData.projectName || "Project",
            coTitle: coData.title,
            coNumber: data.co_number,
            amount: coData.amount,
            projectId,
          }).catch((err) => console.error("Failed to send CO notification:", err));
        }
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-change-orders", projectId] });
      toast.success("Change order created successfully");
    },
    onError: (error) => {
      console.error("Error creating change order:", error);
      toast.error("Failed to create change order");
    },
  });
}

export function useCreateDailyLog(projectId: string) {
  const queryClient = useQueryClient();
  const { profile } = useAuth();

  return useMutation({
    mutationFn: async (logData: {
      log_date: string;
      weather?: Database["public"]["Enums"]["weather_condition"];
      temperature_high?: number;
      temperature_low?: number;
      man_hours?: number;
      workers_onsite?: number;
      work_performed?: string;
      delays?: string;
      safety_incidents?: string;
      notes?: string;
    }) => {
      if (!profile?.id) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("daily_logs")
        .insert({
          project_id: projectId,
          author_id: profile.id,
          ...logData,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-daily-logs", projectId] });
      toast.success("Daily log created successfully");
    },
    onError: (error) => {
      console.error("Error creating daily log:", error);
      toast.error("Failed to create daily log");
    },
  });
}
