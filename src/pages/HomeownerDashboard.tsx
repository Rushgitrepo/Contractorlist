import { useState, useEffect, Suspense, lazy, Component, ReactNode } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import HomeownerSidebar from '@/components/homeowner/HomeownerSidebar';
import HomeownerHeader from '@/components/homeowner/HomeownerHeader';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load components for better performance
const HomeownerOverview = lazy(() => import('@/components/homeowner/HomeownerOverview'));
const MyProjects = lazy(() => import('@/components/homeowner/MyProjects'));
const BidManagement = lazy(() => import('@/components/homeowner/BidManagement'));
const ContractorDirectory = lazy(() => import('@/components/homeowner/ContractorDirectory'));
const Messages = lazy(() => import('@/components/homeowner/Messages'));
const AccountSettings = lazy(() => import('@/components/homeowner/AccountSettings'));
const HelpSupport = lazy(() => import('@/components/homeowner/HelpSupport'));

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
    console.error('Homeowner Dashboard Error:', error, errorInfo);
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

const HomeownerDashboard = () => {
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
      <HomeownerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-slate-50/50 dark:bg-slate-950/50 transition-all duration-300">
        <HomeownerHeader onMenuClick={() => setSidebarOpen(true)} />
        
        <div className="flex-1 overflow-y-auto scroll-smooth">
          <ErrorBoundary>
            <Suspense fallback={<PageSkeleton />}>
              <Routes>
                <Route path="/" element={<Navigate to="/homeowner-dashboard/overview" replace />} />
                <Route path="/overview" element={<HomeownerOverview />} />
                <Route path="/projects" element={<MyProjects />} />
                <Route path="/bids" element={<BidManagement />} />
                <Route path="/contractors" element={<ContractorDirectory />} />
                <Route path="/messages" element={<Messages />} />
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

export default HomeownerDashboard;