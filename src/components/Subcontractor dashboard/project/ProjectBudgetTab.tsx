import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Subcontractor dashboard/ui/tabs";
import { useBudgetItems, usePayApplications } from "@/hooks/Subcontractor dashboard/useBudget";
import { useChangeOrders } from "@/hooks/Subcontractor dashboard/useChangeOrderMutations";
import { useProjectMembers } from "@/hooks/Subcontractor dashboard/useProjectDetail";
import BudgetSummaryCards from "./budget/BudgetSummaryCards";
import ScheduleOfValues from "./budget/ScheduleOfValues";
import PayApplicationsList from "./budget/PayApplicationsList";
import FinancialDashboard from "./budget/FinancialDashboard";

interface ProjectBudgetTabProps {
  projectId: string;
  projectName: string;
  projectLocation: string;
  originalContract: number;
}

export default function ProjectBudgetTab({ projectId, projectName, projectLocation, originalContract }: ProjectBudgetTabProps) {
  const [activeTab, setActiveTab] = useState("dashboard");
  
  const { data: budgetItems = [], isLoading: isLoadingItems } = useBudgetItems(projectId);
  const { data: payApplications = [], isLoading: isLoadingApps } = usePayApplications(projectId);
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

  // Calculate approved change orders total
  const approvedChanges = changeOrders
    .filter(co => co.status === 'approved')
    .reduce((sum, co) => sum + Number(co.amount), 0);

  // Calculate totals from budget items
  const totals = budgetItems.reduce(
    (acc, item) => {
      const totalCompleted = item.work_completed_previous + item.work_completed_current + item.materials_stored;
      const retainage = totalCompleted * (item.retainage_percent / 100);
      return {
        totalCompleted: acc.totalCompleted + totalCompleted,
        retainage: acc.retainage + retainage,
        scheduledValue: acc.scheduledValue + item.scheduled_value,
      };
    },
    { totalCompleted: 0, retainage: 0, scheduledValue: 0 }
  );

  const contractToDate = originalContract + approvedChanges;
  const balanceToFinish = contractToDate - totals.totalCompleted;

  return (
    <div className="space-y-6">
      <BudgetSummaryCards
        originalContract={originalContract}
        approvedChanges={approvedChanges}
        totalCompleted={totals.totalCompleted}
        retainageHeld={totals.retainage}
        balanceToFinish={balanceToFinish}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="sov">Schedule of Values</TabsTrigger>
          <TabsTrigger value="pay-apps">Pay Applications</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-4">
          <FinancialDashboard
            projectId={projectId}
            applications={payApplications}
            budgetItems={budgetItems}
            originalContract={originalContract}
            approvedChanges={approvedChanges}
          />
        </TabsContent>

        <TabsContent value="sov" className="mt-4">
          <ScheduleOfValues
            projectId={projectId}
            items={budgetItems}
            isLoading={isLoadingItems}
          />
        </TabsContent>

        <TabsContent value="pay-apps" className="mt-4">
          <PayApplicationsList
            projectId={projectId}
            projectName={projectName}
            projectLocation={projectLocation}
            applications={payApplications}
            budgetItems={budgetItems}
            originalContract={originalContract}
            approvedChanges={approvedChanges}
            isLoading={isLoadingApps}
            adminEmails={adminEmails}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
