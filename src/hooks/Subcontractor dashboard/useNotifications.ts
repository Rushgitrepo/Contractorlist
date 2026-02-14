import { supabase } from "@/integrations/supabase/client";

interface SendRFINotificationParams {
  recipientEmail: string;
  recipientName: string | null;
  projectName: string;
  rfiTitle: string;
  rfiNumber: number;
  assignedByName: string | null;
  dueDate: string | null;
  projectId: string;
}

interface SendChangeOrderNotificationParams {
  recipientEmail: string;
  recipientName: string | null;
  projectName: string;
  coTitle: string;
  coNumber: number;
  amount: number;
  projectId: string;
}

export async function sendRFIAssignedNotification(params: SendRFINotificationParams) {
  try {
    const { data, error } = await supabase.functions.invoke("send-notification", {
      body: {
        type: "rfi_assigned",
        recipientEmail: params.recipientEmail,
        recipientName: params.recipientName || params.recipientEmail,
        projectName: params.projectName,
        itemTitle: params.rfiTitle,
        itemNumber: params.rfiNumber,
        assignedBy: params.assignedByName,
        dueDate: params.dueDate,
        projectId: params.projectId,
      },
    });

    if (error) {
      console.error("Failed to send RFI notification:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Error sending RFI notification:", err);
    return { success: false, error: err };
  }
}

export async function sendChangeOrderNotification(params: SendChangeOrderNotificationParams) {
  try {
    const { data, error } = await supabase.functions.invoke("send-notification", {
      body: {
        type: "change_order_approval",
        recipientEmail: params.recipientEmail,
        recipientName: params.recipientName || params.recipientEmail,
        projectName: params.projectName,
        itemTitle: params.coTitle,
        itemNumber: params.coNumber,
        amount: params.amount,
        projectId: params.projectId,
      },
    });

    if (error) {
      console.error("Failed to send change order notification:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Error sending change order notification:", err);
    return { success: false, error: err };
  }
}
