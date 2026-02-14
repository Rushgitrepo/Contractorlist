import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface SignatureWithContext {
  id: string;
  signature_type: "contractor" | "architect" | "owner";
  signer_name: string;
  signer_title: string | null;
  signed_at: string;
  ip_address: string | null;
  document_type: "pay_application" | "change_order";
  document_id: string;
  document_number: number;
  document_title: string;
  amount: number;
}

interface PendingRequest {
  id: string;
  token: string;
  signature_type: "contractor" | "architect" | "owner";
  recipient_email: string;
  recipient_name: string | null;
  status: "pending" | "signed" | "expired" | "cancelled";
  expires_at: string;
  created_at: string;
  document_type: "pay_application" | "change_order";
  document_id: string;
  document_number: number;
  document_title: string;
  amount: number;
  requested_by_name: string | null;
}

export interface SignatureDocument {
  document_type: "pay_application" | "change_order";
  document_id: string;
  document_number: number;
  document_title: string;
  amount: number;
  status: string;
  required_signatures: number;
  completed_signatures: number;
  signatures: {
    contractor?: { signer_name: string; signed_at: string } | null;
    architect?: { signer_name: string; signed_at: string } | null;
    owner?: { signer_name: string; signed_at: string } | null;
  };
  pending_requests: PendingRequest[];
}

export function useSignatureDashboard(projectId: string) {
  return useQuery({
    queryKey: ["signature-dashboard", projectId],
    queryFn: async () => {
      // Fetch pay applications with their signatures
      const { data: payApps, error: payAppsError } = await supabase
        .from("pay_applications")
        .select(`
          id,
          application_number,
          period_from,
          period_to,
          current_payment_due,
          status
        `)
        .eq("project_id", projectId)
        .order("application_number", { ascending: false });

      if (payAppsError) throw payAppsError;

      // Fetch change orders with their signatures
      const { data: changeOrders, error: coError } = await supabase
        .from("change_orders")
        .select(`
          id,
          co_number,
          title,
          amount,
          status
        `)
        .eq("project_id", projectId)
        .order("co_number", { ascending: false });

      if (coError) throw coError;

      // Fetch all signatures for this project
      const { data: signatures, error: sigError } = await supabase
        .from("pay_application_signatures")
        .select("*")
        .eq("project_id", projectId);

      if (sigError) throw sigError;

      // Fetch all signature requests
      const { data: requests, error: reqError } = await supabase
        .from("signature_requests")
        .select(`
          *,
          requested_by_profile:requested_by (full_name)
        `)
        .eq("project_id", projectId);

      if (reqError) throw reqError;

      // Build document status list
      const documents: SignatureDocument[] = [];

      // Process pay applications (need 2 signatures: contractor, architect)
      for (const app of payApps || []) {
        const appSigs = (signatures || []).filter(s => s.pay_application_id === app.id);
        const appRequests = (requests || []).filter(r => r.pay_application_id === app.id && r.status === "pending");

        const contractorSig = appSigs.find(s => s.signature_type === "contractor");
        const architectSig = appSigs.find(s => s.signature_type === "architect");

        documents.push({
          document_type: "pay_application",
          document_id: app.id,
          document_number: app.application_number,
          document_title: `Pay Application #${app.application_number}`,
          amount: Number(app.current_payment_due),
          status: app.status,
          required_signatures: 2,
          completed_signatures: [contractorSig, architectSig].filter(Boolean).length,
          signatures: {
            contractor: contractorSig ? { signer_name: contractorSig.signer_name, signed_at: contractorSig.signed_at } : null,
            architect: architectSig ? { signer_name: architectSig.signer_name, signed_at: architectSig.signed_at } : null,
          },
          pending_requests: appRequests.map(r => ({
            id: r.id,
            token: r.token,
            signature_type: r.signature_type as "contractor" | "architect" | "owner",
            recipient_email: r.recipient_email,
            recipient_name: r.recipient_name,
            status: r.status as "pending",
            expires_at: r.expires_at,
            created_at: r.created_at,
            document_type: "pay_application" as const,
            document_id: app.id,
            document_number: app.application_number,
            document_title: `Pay Application #${app.application_number}`,
            amount: Number(app.current_payment_due),
            requested_by_name: (r.requested_by_profile as any)?.full_name || null,
          })),
        });
      }

      // Process change orders (need 3 signatures: contractor, architect, owner)
      for (const co of changeOrders || []) {
        const coSigs = (signatures || []).filter(s => s.change_order_id === co.id);
        const coRequests = (requests || []).filter(r => r.change_order_id === co.id && r.status === "pending");

        const contractorSig = coSigs.find(s => s.signature_type === "contractor");
        const architectSig = coSigs.find(s => s.signature_type === "architect");
        const ownerSig = coSigs.find(s => s.signature_type === "owner");

        documents.push({
          document_type: "change_order",
          document_id: co.id,
          document_number: co.co_number,
          document_title: co.title,
          amount: Number(co.amount),
          status: co.status,
          required_signatures: 3,
          completed_signatures: [contractorSig, architectSig, ownerSig].filter(Boolean).length,
          signatures: {
            contractor: contractorSig ? { signer_name: contractorSig.signer_name, signed_at: contractorSig.signed_at } : null,
            architect: architectSig ? { signer_name: architectSig.signer_name, signed_at: architectSig.signed_at } : null,
            owner: ownerSig ? { signer_name: ownerSig.signer_name, signed_at: ownerSig.signed_at } : null,
          },
          pending_requests: coRequests.map(r => ({
            id: r.id,
            token: r.token,
            signature_type: r.signature_type as "contractor" | "architect" | "owner",
            recipient_email: r.recipient_email,
            recipient_name: r.recipient_name,
            status: r.status as "pending",
            expires_at: r.expires_at,
            created_at: r.created_at,
            document_type: "change_order" as const,
            document_id: co.id,
            document_number: co.co_number,
            document_title: co.title,
            amount: Number(co.amount),
            requested_by_name: (r.requested_by_profile as any)?.full_name || null,
          })),
        });
      }

      // Calculate summary stats
      const totalDocuments = documents.length;
      const fullySignedDocuments = documents.filter(d => d.completed_signatures === d.required_signatures).length;
      const partiallySignedDocuments = documents.filter(d => d.completed_signatures > 0 && d.completed_signatures < d.required_signatures).length;
      const unsignedDocuments = documents.filter(d => d.completed_signatures === 0).length;
      const pendingRequests = documents.flatMap(d => d.pending_requests);
      const totalSignatures = documents.reduce((sum, d) => sum + d.completed_signatures, 0);

      return {
        documents,
        summary: {
          totalDocuments,
          fullySignedDocuments,
          partiallySignedDocuments,
          unsignedDocuments,
          pendingRequestsCount: pendingRequests.length,
          totalSignatures,
        },
        pendingRequests,
      };
    },
    enabled: !!projectId,
  });
}
