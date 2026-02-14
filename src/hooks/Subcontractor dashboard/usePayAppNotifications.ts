import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PayAppNotificationPayload {
  type: "pay_app_submitted" | "pay_app_approved";
  recipientEmail: string;
  recipientName: string;
  projectName: string;
  projectId: string;
  itemNumber: number;
  amount: number;
  periodFrom: string;
  periodTo: string;
  assignedBy?: string;
}

export function useSendPayAppNotification() {
  return useMutation({
    mutationFn: async (payload: PayAppNotificationPayload) => {
      const { data, error } = await supabase.functions.invoke("send-notification", {
        body: {
          ...payload,
          itemTitle: `Pay Application #${payload.itemNumber}`,
        },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Notification sent");
    },
    onError: (error: Error) => {
      console.error("Failed to send notification:", error);
      // Don't show error toast - notification failures shouldn't block the workflow
    },
  });
}

export async function notifyProjectAdmins(
  projectId: string,
  notificationPayload: Omit<PayAppNotificationPayload, "recipientEmail" | "recipientName">
) {
  try {
    // Get project admins (owners and GCs)
    const { data: members, error } = await supabase
      .from("project_members")
      .select(`
        user_id,
        role,
        profiles:user_id (
          email,
          full_name
        )
      `)
      .eq("project_id", projectId)
      .in("role", ["owner", "gc"]);

    if (error) {
      console.error("Failed to fetch project admins:", error);
      return;
    }

    // Send notification to each admin
    for (const member of members || []) {
      const profile = member.profiles as any;
      if (!profile?.email) continue;

      await supabase.functions.invoke("send-notification", {
        body: {
          ...notificationPayload,
          recipientEmail: profile.email,
          recipientName: profile.full_name || profile.email,
          itemTitle: `Pay Application #${notificationPayload.itemNumber}`,
        },
      });
    }
  } catch (err) {
    console.error("Failed to notify project admins:", err);
  }
}
