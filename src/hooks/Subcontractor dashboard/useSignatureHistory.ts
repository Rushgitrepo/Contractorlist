import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SignatureHistoryItem {
  id: string;
  project_id: string;
  project_name: string;
  pay_application_id: string | null;
  change_order_id: string | null;
  document_type: "pay_application" | "change_order";
  document_number: number;
  document_title: string;
  signature_type: string;
  recipient_email: string;
  recipient_name: string | null;
  status: string;
  token: string;
  requested_by: string;
  requested_by_name: string | null;
  created_at: string;
  expires_at: string;
  signed_at: string | null;
}

export function useSignatureHistory() {
  return useQuery({
    queryKey: ["signature-history"],
    queryFn: async () => {
      // Fetch signature requests with project info
      const { data: requests, error } = await supabase
        .from("signature_requests")
        .select(`
          id,
          project_id,
          pay_application_id,
          change_order_id,
          signature_type,
          recipient_email,
          recipient_name,
          status,
          token,
          requested_by,
          created_at,
          expires_at,
          signed_at
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Get unique project IDs
      const projectIds = [...new Set(requests.map(r => r.project_id))];
      
      // Fetch project names
      const { data: projects } = await supabase
        .from("projects")
        .select("id, name")
        .in("id", projectIds);

      const projectMap = new Map<string, string>(
        projects?.map(p => [p.id, p.name] as [string, string]) || []
      );

      // Fetch pay applications for document details
      const payAppIds = requests
        .filter(r => r.pay_application_id)
        .map(r => r.pay_application_id as string);
      
      const { data: payApps } = payAppIds.length > 0 
        ? await supabase
            .from("pay_applications")
            .select("id, application_number, period_from, period_to")
            .in("id", payAppIds)
        : { data: [] };

      const payAppMap = new Map<string, { application_number: number; period_from: string; period_to: string }>(
        payApps?.map(p => [p.id, { application_number: p.application_number, period_from: p.period_from, period_to: p.period_to }] as [string, { application_number: number; period_from: string; period_to: string }]) || []
      );

      // Fetch change orders for document details
      const coIds = requests
        .filter(r => r.change_order_id)
        .map(r => r.change_order_id as string);
      
      const { data: changeOrders } = coIds.length > 0
        ? await supabase
            .from("change_orders")
            .select("id, co_number, title")
            .in("id", coIds)
        : { data: [] };

      const coMap = new Map<string, { co_number: number; title: string }>(
        changeOrders?.map(c => [c.id, { co_number: c.co_number, title: c.title }] as [string, { co_number: number; title: string }]) || []
      );

      // Fetch requester profiles
      const requesterIds = [...new Set(requests.map(r => r.requested_by))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .in("id", requesterIds);

      const profileMap = new Map<string, { full_name: string | null; email: string }>(
        profiles?.map(p => [p.id, { full_name: p.full_name, email: p.email }] as [string, { full_name: string | null; email: string }]) || []
      );

      // Transform the data
      const history: SignatureHistoryItem[] = requests.map(request => {
        const isPayApp = !!request.pay_application_id;
        const payApp = isPayApp ? payAppMap.get(request.pay_application_id!) : null;
        const co = !isPayApp ? coMap.get(request.change_order_id!) : null;
        const requester = profileMap.get(request.requested_by);

        return {
          id: request.id,
          project_id: request.project_id,
          project_name: projectMap.get(request.project_id) || "Unknown Project",
          pay_application_id: request.pay_application_id,
          change_order_id: request.change_order_id,
          document_type: isPayApp ? "pay_application" : "change_order",
          document_number: isPayApp 
            ? (payApp?.application_number || 0)
            : (co?.co_number || 0),
          document_title: isPayApp
            ? `Period ${payApp?.period_from || ""} - ${payApp?.period_to || ""}`
            : (co?.title || ""),
          signature_type: request.signature_type,
          recipient_email: request.recipient_email,
          recipient_name: request.recipient_name,
          status: request.status,
          token: request.token,
          requested_by: request.requested_by,
          requested_by_name: requester?.full_name || requester?.email || null,
          created_at: request.created_at,
          expires_at: request.expires_at,
          signed_at: request.signed_at,
        };
      });

      return history;
    },
  });
}
