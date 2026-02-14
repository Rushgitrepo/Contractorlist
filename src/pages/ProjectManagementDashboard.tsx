import { Routes, Route, Navigate } from "react-router-dom";
import GCProjectManagementLayout from "@/components/GC dashboard/ProjectManagementLayout";
import SubcontractorProjectManagementLayout from "@/components/Subcontractor dashboard/ProjectManagementLayout";
import { AuthProvider as GCAuthProvider } from "@/context/GC dashboard/contexts/AuthContext";
import { AuthProvider as SubcontractorAuthProvider } from "@/context/Subcontractor dashboard/contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import RouteThemeManager from "@/components/RouteThemeManager";

// Reuse existing pages
import SchedulePage from "@/pages/GC dashboard/SchedulePage";
import DailyLogsPage from "@/pages/GC dashboard/DailyLogsPage";
import RFIManagementPage from "@/pages/GC dashboard/RFIManagementPage";
import PhotosPage from "@/pages/GC dashboard/PhotosPage";
import Communications from "@/components/common/Communications";
import ProjectsPage from "@/pages/GC dashboard/ProjectsPage";
import GCDirectoryPage from "@/pages/GC dashboard/DirectoryPage";
import SubcontractorDirectoryPage from "@/pages/Subcontractor dashboard/DirectoryPage";
import BidsPage from "@/pages/GC dashboard/BidsPage";
import ResourceManagementPage from "@/pages/GC dashboard/ResourceManagementPage";
import AnalyticsPage from "@/pages/GC dashboard/AnalyticsPage";
import FinancialsPage from "@/pages/GC dashboard/FinancialsPage";
import BillingPage from "@/pages/GC dashboard/BillingPage";
import ChangeOrdersPage from "@/pages/GC dashboard/ChangeOrdersPage";
import SignatureHistoryPage from "@/pages/GC dashboard/SignatureHistoryPage";
import LienWaiverManagementPage from "@/pages/GC dashboard/LienWaiverManagementPage";
import SafetyTrackingPage from "@/pages/GC dashboard/SafetyTrackingPage";
import InsuranceTrackingPage from "@/pages/GC dashboard/InsuranceTrackingPage";
import CertifiedPayrollPage from "@/pages/GC dashboard/CertifiedPayrollPage";
import Contractors from "@/pages/Contractors";
import { useAppSelector } from "@/store/hooks";

const queryClient = new QueryClient();

export default function ProjectManagementDashboard() {
    const { user } = useAppSelector((state) => state.auth);
    const Layout = user?.role === 'subcontractor' ? SubcontractorProjectManagementLayout : GCProjectManagementLayout;

    return (
        <QueryClientProvider client={queryClient}>
            <GCAuthProvider>
                <SubcontractorAuthProvider>
                    <RouteThemeManager />
                    <Layout>
                        <Routes>
                            <Route index element={<Navigate to="schedule" replace />} />
                            <Route path="projects" element={<ProjectsPage />} />
                            <Route
                                path="directory"
                                element={user?.role === 'subcontractor' ? <SubcontractorDirectoryPage /> : <GCDirectoryPage />}
                            />
                            <Route path="communications" element={<Communications />} />
                            <Route path="bids" element={<BidsPage />} />
                            <Route path="schedule" element={<SchedulePage />} />
                            <Route path="daily-logs" element={<DailyLogsPage />} />
                            <Route path="rfi" element={<RFIManagementPage />} />
                            <Route path="photos" element={<PhotosPage />} />
                            <Route path="resources" element={<ResourceManagementPage />} />
                            <Route path="analytics" element={<AnalyticsPage />} />
                            <Route path="financials" element={<FinancialsPage />} />
                            <Route path="billing" element={<BillingPage />} />
                            <Route path="change-orders" element={<ChangeOrdersPage />} />
                            <Route path="signature-history" element={<SignatureHistoryPage />} />
                            <Route path="liens" element={<LienWaiverManagementPage />} />
                            <Route path="safety" element={<SafetyTrackingPage />} />
                            <Route path="insurance" element={<InsuranceTrackingPage />} />
                            <Route path="payroll" element={<CertifiedPayrollPage />} />
                            <Route path="*" element={<Navigate to="schedule" replace />} />
                        </Routes>
                    </Layout>
                    <Toaster />
                </SubcontractorAuthProvider>
            </GCAuthProvider>
        </QueryClientProvider>
    );
}
