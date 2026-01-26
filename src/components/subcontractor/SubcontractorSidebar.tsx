import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Search,
  FileText,
  Briefcase,
  MessageSquare,
  Settings,
  HelpCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Building,
  Kanban,
  Zap,
  TrendingUp,
  Target,
  Award,
  Activity,
  DollarSign,
  Clock,
  Star,
  Crown,
  LogOut,
  Building2,
  User
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SubcontractorSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const SubcontractorSidebar = ({ isOpen, onClose }: SubcontractorSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    toast({
      title: "Logging out...",
      description: "You are being safely redirected to the login page.",
    });
    setTimeout(() => navigate('/'), 1500);
  };

  const navigationItems = [
    {
      name: 'Overview',
      href: '/subcontractor-dashboard/overview',
      icon: LayoutDashboard,
      description: 'Dashboard home'
    },
    {
      name: 'Find Projects',
      href: '/subcontractor-dashboard/find-projects',
      icon: Search,
      description: 'Discover opportunities',
      badge: '0'
    },
    {
      name: 'Bid Management',
      href: '/subcontractor-dashboard/bid-management',
      icon: FileText,
      description: 'Track & manage bids',
      badge: '0'
    },
    {
      name: 'My Projects',
      href: '/subcontractor-dashboard/my-projects',
      icon: Briefcase,
      description: 'Active projects'
    },
    {
      name: 'Messages',
      href: '/subcontractor-dashboard/messages',
      icon: MessageSquare,
      description: 'Communications',
      badge: '12'
    },
  ];


  const bottomItems = [
    {
      name: 'My Profile',
      href: '/subcontractor-dashboard/my-profile',
      icon: User,
      description: 'Account details'
    },
    {
      name: 'Settings',
      href: '/subcontractor-dashboard/settings',
      icon: Settings,
      description: 'Preferences'
    },
  ];

  const renderNavItem = (item: any) => {
    const isActive = location.pathname === item.href;

    return (
      <Link
        key={item.name}
        to={item.href}
        onClick={onClose}
        className={cn(
          "group flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden",
          isActive
            ? "bg-yellow-400 dark:bg-yellow-500 text-gray-900 shadow-[0_0_20px_rgba(234,179,8,0.3)]"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white",
          isCollapsed ? 'justify-center px-3' : ''
        )}
      >
        <item.icon className={cn(
          "w-5 h-5 transition-all duration-300 relative z-10",
          isActive && "scale-110"
        )} />
        {!isCollapsed && (
          <>
            <div className="flex-1 min-w-0 relative z-10 text-left">
              <div className="flex items-center justify-between">
                <span className={cn(
                  "truncate transition-all duration-300",
                  isActive && "font-bold"
                )}>
                  {item.name}
                </span>
                {item.isPro && (
                  <Crown className={cn(
                    "w-3 h-3 ml-2",
                    isActive ? "text-gray-900" : "text-yellow-500"
                  )} />
                )}
                {item.badge && !isActive && (
                  <Badge variant="secondary" className="bg-yellow-400/10 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-500 border-none px-1.5 h-4 text-[10px] font-bold">
                    {item.badge}
                  </Badge>
                )}
              </div>
              <p className={cn(
                "text-[10px] truncate transition-all duration-300 uppercase tracking-widest",
                isActive ? "text-gray-800" : "text-gray-500 dark:text-gray-400"
              )}>
                {item.description}
              </p>
            </div>
          </>
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={cn(
        "relative fixed lg:static inset-y-0 left-0 z-50 bg-gray-50 dark:bg-[#0f1115] border-r border-gray-200 dark:border-white/5 transform transition-all duration-500 ease-out flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        isCollapsed ? "w-20" : "w-72"
      )}>
        {/* Header */}
        <div className={cn(
          "flex items-center justify-between border-b border-gray-200 dark:border-gray-800 h-20 transition-all duration-300",
          isCollapsed ? "justify-center px-2" : "px-6"
        )}>
          {isCollapsed ? (
            <div className="w-10 h-10 rounded-xl bg-yellow-400 dark:bg-yellow-500 flex items-center justify-center text-gray-900 shadow-md shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
          ) : (
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-yellow-400 dark:bg-yellow-500 flex items-center justify-center text-gray-900 shadow-md shrink-0">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="min-w-0 text-left">
                <h1 className="text-sm font-bold tracking-tight text-gray-900 dark:text-white truncate uppercase">
                  Sub Contractor


                </h1>
                <p className="text-[10px] font-black text-yellow-600 dark:text-yellow-500 truncate uppercase tracking-widest">HVAC Partner • Active</p>
              </div>
            </div>
          )}

          <div className="absolute top-7 -right-3 z-50">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={cn(
                "hidden lg:flex p-1.5 transition-all duration-300",
                isCollapsed ? "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-sm hover:bg-gray-100 h-6 w-6 items-center justify-center p-0" : ""
              )}
            >
              {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose} className="lg:hidden p-1.5">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <div className={cn("flex-1 flex flex-col gap-6 overflow-y-auto duration-300 custom-scrollbar p-6", isCollapsed && "px-2 items-center")}>
          <div className="space-y-4 w-full">
            <div className="space-y-1">
              {!isCollapsed && <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-4">Main Menu</p>}
              {navigationItems.map(item => renderNavItem(item))}
            </div>

          </div>
        </div>

        {/* Bottom section */}
        <div className={cn("border-t border-gray-200 dark:border-gray-800 p-6 space-y-1 duration-300", isCollapsed && "px-2")}>
          {bottomItems.map(item => renderNavItem(item))}
          <button
            onClick={handleLogout}
            className={cn(
              "group w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all duration-300",
              isCollapsed && "justify-center px-3"
            )}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span className="truncate">Logout Terminal</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default SubcontractorSidebar;