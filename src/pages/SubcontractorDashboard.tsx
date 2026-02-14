import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "@/components/Subcontractor dashboard/AppLayout";
import { AuthProvider } from "@/context/Subcontractor dashboard/contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import ProtectedRoute from "@/components/Subcontractor dashboard/ProtectedRoute";

// New Pages
import DashboardPage from "@/pages/Subcontractor dashboard/DashboardPage";
import ProjectsPage from "@/pages/Subcontractor dashboard/ProjectsPage";
import ProjectDetailPage from "@/pages/Subcontractor dashboard/ProjectDetailPage";
import SchedulePage from "@/pages/Subcontractor dashboard/SchedulePage";
import DailyLogsPage from "@/pages/Subcontractor dashboard/DailyLogsPage";
import RFIManagementPage from "@/pages/Subcontractor dashboard/RFIManagementPage";
import PhotosPage from "@/pages/Subcontractor dashboard/PhotosPage";
import AnalyticsPage from "@/pages/Subcontractor dashboard/AnalyticsPage";
import FinancialsPage from "@/pages/Subcontractor dashboard/FinancialsPage";
import BillingPage from "@/pages/Subcontractor dashboard/BillingPage";
import ChangeOrdersPage from "@/pages/Subcontractor dashboard/ChangeOrdersPage";
import SignatureHistoryPage from "@/pages/Subcontractor dashboard/SignatureHistoryPage";
import LienWaiverManagementPage from "@/pages/Subcontractor dashboard/LienWaiverManagementPage";
import SafetyTrackingPage from "@/pages/Subcontractor dashboard/SafetyTrackingPage";
import InsuranceTrackingPage from "@/pages/Subcontractor dashboard/InsuranceTrackingPage";
import CertifiedPayrollPage from "@/pages/Subcontractor dashboard/CertifiedPayrollPage";
import ResourceManagementPage from "@/pages/Subcontractor dashboard/ResourceManagementPage";
import SettingsPage from "@/pages/Subcontractor dashboard/SettingsPage";
import ExternalSigningPage from "@/pages/Subcontractor dashboard/ExternalSigningPage";
import FindProjectsPage from "@/pages/Subcontractor dashboard/FindProjectsPage";
import DirectoryPage from "@/pages/Subcontractor dashboard/DirectoryPage";
import BidsPage from "@/pages/Subcontractor dashboard/BidsPage";

// Subcontractor Components
import SubcontractorMessages from "@/components/Subcontractor dashboard/SubcontractorMessages";
import ProductsOverview from "@/components/Subcontractor dashboard/Products/ProductsOverview";
import ServicesOverview from "@/components/Subcontractor dashboard/Services/ServicesOverview";
import EnterpriseTeamManagement from "@/components/Subcontractor dashboard/EnterpriseTeamManagement";
import EnhancedDocuments from "@/components/Subcontractor dashboard/EnhancedDocuments";
import CustomerSupport from "@/components/Subcontractor dashboard/CustomerSupport";

const queryClient = new QueryClient();

export default function SubcontractorDashboard() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Routes>
          <Route
            path="*"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Routes>
                    <Route index element={<DashboardPage />} />
                    <Route path="projects" element={<ProjectsPage />} />
                    <Route path="projects/:projectId" element={<ProjectDetailPage />} />
                    <Route path="schedule" element={<SchedulePage />} />
                    <Route path="daily-logs" element={<DailyLogsPage />} />
                    <Route path="rfi" element={<RFIManagementPage />} />
                    <Route path="photos" element={<PhotosPage />} />
                    <Route path="analytics" element={<AnalyticsPage />} />
                    <Route path="financials" element={<FinancialsPage />} />
                    <Route path="billing" element={<BillingPage />} />
                    <Route path="change-orders" element={<ChangeOrdersPage />} />
                    <Route path="signature-history" element={<SignatureHistoryPage />} />
                    <Route path="liens" element={<LienWaiverManagementPage />} />
                    <Route path="safety" element={<SafetyTrackingPage />} />
                    <Route path="insurance" element={<InsuranceTrackingPage />} />
                    <Route path="payroll" element={<CertifiedPayrollPage />} />

                    {/* Subcontractor Dashboard Pages */}
                    <Route path="team" element={<EnterpriseTeamManagement />} />
                    <Route path="documents" element={<EnhancedDocuments />} />
                    <Route path="settings" element={<SettingsPage />} />
                    <Route path="customer-support" element={<CustomerSupport />} />
                    <Route path="resources" element={<ResourceManagementPage />} />
                    <Route path="sign/:token" element={<ExternalSigningPage />} />


                    {/* Preserved Routes */}
                    <Route path="project-discovery" element={<FindProjectsPage />} />
                    <Route path="directory" element={<DirectoryPage />} />
                    <Route path="bids" element={<BidsPage />} />
                    <Route path="products" element={<ProductsOverview />} />
                    <Route path="services" element={<ServicesOverview />} />
                    <Route path="communications" element={<SubcontractorMessages />} />

                    <Route path="*" element={<Navigate to="/subcontractor-dashboard" replace />} />
                  </Routes>
                </AppLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}