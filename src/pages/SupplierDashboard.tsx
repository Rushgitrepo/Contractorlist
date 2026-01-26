import { useState, useEffect, Suspense, lazy, Component, ReactNode } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import SupplierSidebar from '@/components/supplier/SupplierSidebar';
import SupplierHeader from '@/components/supplier/SupplierHeader';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load components for better performance
const SupplierOverview = lazy(() => import('@/components/supplier/SupplierOverview'));
const ProductCatalog = lazy(() => import('@/components/supplier/ProductCatalog'));
const OrdersRFQs = lazy(() => import('@/components/supplier/OrdersRFQs'));
const ProjectLeads = lazy(() => import('@/components/supplier/ProjectLeads'));
const SupplierMessages = lazy(() => import('@/components/supplier/SupplierMessages'));
const SupplierAnalytics = lazy(() => import('@/components/supplier/SupplierAnalytics'));
const SupplierSettings = lazy(() => import('@/components/supplier/SupplierSettings'));
const SupplierHelp = lazy(() => import('@/components/supplier/SupplierHelp'));

// Loading fallback component
const PageSkeleton = () => (
  <div className="flex-1 w-full bg-slate-50/50 dark:bg-slate-950/50 p-6 lg:p-8">
    <div className="max-w-[1600px] mx-auto space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-5 w-96" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Skeleton className="lg:col-span-2 h-96" />
        <Skeleton className="h-96" />
      </div>
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
    console.error('Supplier Dashboard Error:', error, errorInfo);
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
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
              >
                Refresh Page
              </button>
              <button
                onClick={this.reset}
                className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg transition-colors"
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

const SupplierDashboard = () => {
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
    <div className="flex h-screen w-full overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      <SupplierSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-slate-50/50 dark:bg-slate-950/50 transition-all duration-300">
        <SupplierHeader onMenuClick={() => setSidebarOpen(true)} />
        
        <div className="flex-1 overflow-y-auto scroll-smooth">
          <ErrorBoundary>
            <Suspense fallback={<PageSkeleton />}>
              <Routes>
                <Route path="/" element={<Navigate to="/supplier-dashboard/overview" replace />} />
                <Route path="/overview" element={<SupplierOverview />} />
                <Route path="/catalog" element={<ProductCatalog />} />
                <Route path="/orders" element={<OrdersRFQs />} />
                <Route path="/leads" element={<ProjectLeads />} />
                <Route path="/messages" element={<SupplierMessages />} />
                <Route path="/analytics" element={<SupplierAnalytics />} />
                <Route path="/settings" element={<SupplierSettings />} />
                <Route path="/help" element={<SupplierHelp />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
};

export default SupplierDashboard;