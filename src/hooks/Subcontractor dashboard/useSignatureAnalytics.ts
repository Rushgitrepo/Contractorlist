import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfMonth, subMonths, format, differenceInHours, isWithinInterval, startOfDay, endOfDay } from "date-fns";

interface SignatureMetrics {
  averageTimeToSignature: number; // in hours
  completionRate: number; // percentage
  totalRequests: number;
  signedRequests: number;
  pendingRequests: number;
  expiredRequests: number;
  cancelledRequests: number;
}

interface MonthlyTrend {
  month: string;
  completionRate: number;
  totalRequests: number;
  signedCount: number;
}

interface RoleBreakdown {
  role: string;
  averageTime: number;
  completionRate: number;
  count: number;
}

interface DocumentTypeBreakdown {
  type: string;
  label: string;
  completionRate: number;
  averageTime: number;
  count: number;
}

export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

export function useSignatureAnalytics(projectId: string, dateRange?: DateRange) {
  return useQuery({
    queryKey: ["signature-analytics", projectId, dateRange?.from?.toISOString(), dateRange?.to?.toISOString()],
    queryFn: async () => {
      // Fetch all signature requests for the project
      const { data: requests, error: reqError } = await supabase
        .from("signature_requests")
        .select("*")
        .eq("project_id", projectId);

      if (reqError) throw reqError;

      // Fetch all signatures for the project
      const { data: signatures, error: sigError } = await supabase
        .from("pay_application_signatures")
        .select("*")
        .eq("project_id", projectId);

      if (sigError) throw sigError;

      // Filter requests by date range if provided
      let filteredRequests = requests || [];
      if (dateRange?.from && dateRange?.to) {
        filteredRequests = filteredRequests.filter(r => {
          const createdAt = new Date(r.created_at);
          return isWithinInterval(createdAt, {
            start: startOfDay(dateRange.from!),
            end: endOfDay(dateRange.to!),
          });
        });
      }

      // Calculate overall metrics
      const totalRequests = filteredRequests.length;
      const signedRequests = filteredRequests.filter(r => r.status === "signed").length;
      const pendingRequests = filteredRequests.filter(r => r.status === "pending").length;
      const expiredRequests = filteredRequests.filter(r => r.status === "expired").length;
      const cancelledRequests = filteredRequests.filter(r => r.status === "cancelled").length;
      
      const completionRate = totalRequests > 0 ? (signedRequests / totalRequests) * 100 : 0;

      // Calculate average time to signature (for signed requests)
      const signedWithTime = filteredRequests.filter(r => r.status === "signed" && r.signed_at);
      let averageTimeToSignature = 0;
      
      if (signedWithTime.length > 0) {
        const totalHours = signedWithTime.reduce((sum, req) => {
          const createdAt = new Date(req.created_at);
          const signedAt = new Date(req.signed_at!);
          return sum + differenceInHours(signedAt, createdAt);
        }, 0);
        averageTimeToSignature = totalHours / signedWithTime.length;
      }

      const metrics: SignatureMetrics = {
        averageTimeToSignature,
        completionRate,
        totalRequests,
        signedRequests,
        pendingRequests,
        expiredRequests,
        cancelledRequests,
      };

      // Calculate monthly trends (last 6 months)
      const monthlyTrends: MonthlyTrend[] = [];
      for (let i = 5; i >= 0; i--) {
        const monthStart = startOfMonth(subMonths(new Date(), i));
        const monthEnd = startOfMonth(subMonths(new Date(), i - 1));
        
        const monthRequests = filteredRequests.filter(r => {
          const created = new Date(r.created_at);
          return created >= monthStart && created < monthEnd;
        });

        const monthSigned = monthRequests.filter(r => r.status === "signed").length;
        
        monthlyTrends.push({
          month: format(monthStart, "MMM yyyy"),
          completionRate: monthRequests.length > 0 ? (monthSigned / monthRequests.length) * 100 : 0,
          totalRequests: monthRequests.length,
          signedCount: monthSigned,
        });
      }

      // Calculate role breakdown
      const roleBreakdown: RoleBreakdown[] = [];
      const roles = ["contractor", "architect", "owner"];
      
      for (const role of roles) {
        const roleRequests = filteredRequests.filter(r => r.signature_type === role);
        const roleSigned = roleRequests.filter(r => r.status === "signed");
        
        let avgTime = 0;
        if (roleSigned.length > 0) {
          const totalHours = roleSigned.reduce((sum, req) => {
            if (!req.signed_at) return sum;
            const createdAt = new Date(req.created_at);
            const signedAt = new Date(req.signed_at);
            return sum + differenceInHours(signedAt, createdAt);
          }, 0);
          avgTime = totalHours / roleSigned.length;
        }

        roleBreakdown.push({
          role: role.charAt(0).toUpperCase() + role.slice(1),
          averageTime: avgTime,
          completionRate: roleRequests.length > 0 ? (roleSigned.length / roleRequests.length) * 100 : 0,
          count: roleRequests.length,
        });
      }

      // Calculate document type breakdown
      const payAppRequests = filteredRequests.filter(r => r.pay_application_id);
      const coRequests = filteredRequests.filter(r => r.change_order_id);

      const payAppSigned = payAppRequests.filter(r => r.status === "signed");
      const coSigned = coRequests.filter(r => r.status === "signed");

      const calculateAvgTime = (reqs: typeof requests) => {
        const signed = reqs?.filter(r => r.status === "signed" && r.signed_at) || [];
        if (signed.length === 0) return 0;
        const totalHours = signed.reduce((sum, req) => {
          return sum + differenceInHours(new Date(req.signed_at!), new Date(req.created_at));
        }, 0);
        return totalHours / signed.length;
      };

      const documentTypeBreakdown: DocumentTypeBreakdown[] = [
        {
          type: "pay_application",
          label: "Pay Applications",
          completionRate: payAppRequests.length > 0 ? (payAppSigned.length / payAppRequests.length) * 100 : 0,
          averageTime: calculateAvgTime(payAppRequests),
          count: payAppRequests.length,
        },
        {
          type: "change_order",
          label: "Change Orders",
          completionRate: coRequests.length > 0 ? (coSigned.length / coRequests.length) * 100 : 0,
          averageTime: calculateAvgTime(coRequests),
          count: coRequests.length,
        },
      ];

      return {
        metrics,
        monthlyTrends,
        roleBreakdown,
        documentTypeBreakdown,
      };
    },
    enabled: !!projectId,
  });
}
