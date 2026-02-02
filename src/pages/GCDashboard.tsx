import { useState, useEffect, Suspense, lazy, Component, ReactNode } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from '@/components/GC dashboard/Sidebar';
import Header from '@/components/GC dashboard/Header';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load components for better performance
const CleanOverview = lazy(() => import('@/components/GC dashboard/CleanOverview'));
const CleanCommunications = lazy(() => import('@/components/GC dashboard/CleanCommunications'));
const Directory = lazy(() => import('@/components/GC dashboard/Directory'));
const MyProjects = lazy(() => import('@/components/GC dashboard/MyProjects'));
const AccountSettings = lazy(() => import('@/components/GC dashboard/AccountSettings'));
const HelpSupport = lazy(() => import('@/components/GC dashboard/HelpSupport'));
const ProjectDiscovery = lazy(() => import('@/components/GC dashboard/ProjectDiscovery'));
const EnterpriseTeamManagement = lazy(() => import('@/components/GC dashboard/EnterpriseTeamManagement'));
const EnhancedDocuments = lazy(() => import('@/components/GC dashboard/EnhancedDocuments'));
const BidManagement = lazy(() => import('@/components/GC dashboard/BidManagement'));
const Suppliers = lazy(() => import('@/components/GC dashboard/Suppliers'));
const ProductsOverview = lazy(() => import('@/components/GC dashboard/Products/ProductsOverview'));
const ServicesOverview = lazy(() => import('@/components/GC dashboard/Services/ServicesOverview'));

// Loading fallback component
const PageSkeleton = () => (
  <div className="flex-1 w-full bg-gray-50 dark:bg-gray-900 p-6 lg:p-8">
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

// Simple Error Boundary Component
class ErrorBoundary extends Component<
  { children: ReactNode; fallback?: (error: Error, reset: () => void) => ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode; fallback?: (error: Error, reset: () => void) => ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Dashboard Error:', error, errorInfo);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.reset);
      }
      return (
        <div className="flex-1 w-full bg-gray-50 dark:bg-gray-900 p-6 lg:p-8 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Something went wrong</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{this.state.error.message}</p>
            <button
              onClick={this.reset}
              className="px-6 py-3 bg-accent hover:bg-accent/80 text-accent-foreground font-semibold rounded-lg transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

import GCProfileCompletionModal from '@/components/GCProfileCompletionModal';

const GCDashboard = () => {
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
      <GCProfileCompletionModal onComplete={() => window.location.reload()} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-gray-50 dark:bg-gray-900 transition-all duration-300">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <div className="flex-1 overflow-y-auto scroll-smooth">
          <ErrorBoundary>
            <Suspense fallback={<PageSkeleton />}>
              <Routes>
                <Route path="/" element={<Navigate to="/gc-dashboard/overview" replace />} />
                <Route path="/overview" element={<CleanOverview />} />
                <Route path="/my-projects" element={<MyProjects />} />
                <Route path="/communications" element={<CleanCommunications />} />
                <Route path="/project-discovery" element={<ProjectDiscovery />} />
                <Route path="/directory" element={<Directory />} />
                <Route path="/bids" element={<BidManagement />} />
                <Route path="/suppliers" element={<Suppliers />} />
                <Route path="/products" element={<ProductsOverview />} />
                <Route path="/services" element={<ServicesOverview />} />
                <Route path="/team" element={<EnterpriseTeamManagement />} />
                <Route path="/documents" element={<EnhancedDocuments />} />
                <Route path="/settings" element={<AccountSettings />} />
                <Route path="/help" element={<HelpSupport />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
};

export default GCDashboard;