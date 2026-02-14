import { useState, useEffect, Suspense, lazy, Component, ReactNode } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import SubcontractorSidebar from '@/components/subcontractor/SubcontractorSidebar';
import SubcontractorHeader from '@/components/subcontractor/SubcontractorHeader';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load components for better performance
// Lazy load components for better performance
const SubcontractorOverview = lazy(() => import('@/components/subcontractor/SubcontractorOverview'));
const MyProjects = lazy(() => import('@/components/subcontractor/MyProjects'));
const BidManagement = lazy(() => import('@/components/subcontractor/BidManagement'));
const FindProjects = lazy(() => import('@/components/subcontractor/FindProjects'));
const ProjectDiscovery = lazy(() => import('@/components/subcontractor/ProjectDiscovery'));
const Communications = lazy(() => import('@/components/common/Communications'));
const AccountSettings = lazy(() => import('@/components/subcontractor/AccountSettings'));
const CustomerSupport = lazy(() => import('@/components/subcontractor/CustomerSupport'));
const AIAssistant = lazy(() => import('@/components/subcontractor/AIAssistant'));
const Suppliers = lazy(() => import('@/components/GC dashboard/Suppliers'));
const ProductsOverview = lazy(() => import('@/components/GC dashboard/Products/ProductsOverview'));
const ServicesOverview = lazy(() => import('@/components/GC dashboard/Services/ServicesOverview'));

// ... (PageSkeleton and ErrorBoundary remain unchanged)

// In SubcontractorDashboard component:
// <Route path="/find-projects" element={<FindProjects />} />

// Loading fallback component
const PageSkeleton = () => (
  <div className="flex-1 w-full p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
    <div className="space-y-4">
      <Skeleton className="h-4 w-32 bg-gray-200 dark:bg-white/5" />
      <Skeleton className="h-10 w-80 bg-gray-200 dark:bg-white/5" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-32 rounded-2xl bg-gray-200 dark:bg-white/5" />
      ))}
    </div>
    <div className="space-y-6">
      <Skeleton className="h-[400px] w-full rounded-2xl bg-gray-200 dark:bg-white/5" />
    </div>
  </div>
);

// Error Boundary Component
class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Subcontractor Dashboard Error:', error, errorInfo);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <div className="flex-1 w-full bg-slate-50/50 dark:bg-slate-950/50 p-6 lg:p-8 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-slate-100">Something went wrong</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">{this.state.error.message}</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold rounded-lg transition-colors"
              >
                Refresh Page
              </button>
              <button
                onClick={this.reset}
                className="px-6 py-3 bg-accent hover:bg-accent/80 text-accent-foreground font-semibold rounded-lg transition-colors"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const SubcontractorDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [sidebarOpen]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50 dark:bg-gray-900">
      <SubcontractorSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-gray-50 dark:bg-gray-900 transition-all duration-300">
        <SubcontractorHeader onMenuClick={() => setSidebarOpen(true)} />

        <div className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar">
          <ErrorBoundary>
            <Suspense fallback={<PageSkeleton />}>
              <Routes>
                <Route path="/" element={<Navigate to="/subcontractor-dashboard/overview" replace />} />
                <Route path="/overview" element={<SubcontractorOverview />} />
                <Route path="/my-projects" element={<MyProjects />} />
                <Route path="/bid-management" element={<BidManagement />} />
                <Route path="/find-projects" element={<ProjectDiscovery />} />
                <Route path="/project-discovery" element={<ProjectDiscovery />} />
                <Route path="/messages" element={<Communications />} />
                <Route path="/products" element={<ProductsOverview />} />
                <Route path="/services" element={<ServicesOverview />} />
                <Route path="/suppliers" element={<Suppliers />} />
                <Route path="/settings" element={<AccountSettings />} />
                <Route path="/customer-support" element={<CustomerSupport />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
};

export default SubcontractorDashboard;