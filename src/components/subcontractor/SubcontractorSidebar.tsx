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
  User,
  Sparkles,
  Truck,
  PhoneCall,
  Gavel,
  LifeBuoy
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



  const navGroups = [
    {
      label: 'Main',
      items: [
        { name: 'Overview', href: '/subcontractor-dashboard/overview', icon: LayoutDashboard },
        { name: 'Find Projects', href: '/subcontractor-dashboard/find-projects', icon: Search, badge: '0' },
        { name: 'Bid Management', href: '/subcontractor-dashboard/bid-management', icon: Gavel, badge: '0' },
        { name: 'My Projects', href: '/subcontractor-dashboard/my-projects', icon: Briefcase },
      ]
    },
    {
      label: 'Platform',
      items: [
        { name: 'Messages', href: '/subcontractor-dashboard/messages', icon: MessageSquare, badge: '12' },
        { name: 'Suppliers', href: '/subcontractor-dashboard/suppliers', icon: Truck },
        { name: 'Products', href: '/subcontractor-dashboard/products', icon: Sparkles },
        { name: 'Services', href: '/subcontractor-dashboard/services', icon: Briefcase },
      ]
    },
    {
      label: 'System',
      items: [
        { name: 'Customer Support', href: '/subcontractor-dashboard/customer-support', icon: LifeBuoy },
        { name: 'Profile', href: '/subcontractor-dashboard/my-profile', icon: User },
        { name: 'Settings', href: '/subcontractor-dashboard/settings', icon: Settings },
      ]
    }
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 bg-gray-50 dark:bg-[#0f1115] border-r border-gray-200 dark:border-white/5 transform transition-all duration-500 ease-out flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        isCollapsed ? "w-20" : "w-72"
      )}>
        {/* Header */}
        <div className={cn(
          "flex items-center justify-between border-b border-gray-200 dark:border-gray-800 h-20 transition-all duration-300",
          isCollapsed ? "justify-center px-2" : "px-6"
        )}>
          {isCollapsed ? (
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-accent-foreground shrink-0 mb-2 mt-2">
              <Building2 className="w-6 h-6" />
            </div>
          ) : (
            <div className="flex items-center gap-3 overflow-hidden text-left">
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-accent-foreground shrink-0">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white truncate">
                  SC Dashboard
                </h1>
                <p className="text-xs text-gray-500 truncate font-medium">Sub Contractor</p>
              </div>
            </div>
          )}

          <div className={cn("flex items-center gap-1", isCollapsed ? "absolute top-1/2 -translate-y-1/2 -right-3 z-50 pointer-events-auto" : "")}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={cn(
                "hidden lg:flex p-1.5 transition-all duration-300",
                isCollapsed ? "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-sm hover:bg-gray-100 h-6 w-6 items-center justify-center p-0" : ""
              )}
            >
              {isCollapsed ? (
                <ChevronRight className="w-3 h-3" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="lg:hidden p-1.5"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <div className={cn("flex-1 flex flex-col gap-6 overflow-y-auto overflow-x-hidden p-4 scrollbar-hide", isCollapsed ? "items-center" : "")}>
          {navGroups.map((group) => (
            <div key={group.label} className="space-y-1 w-full text-left">
              {!isCollapsed && (
                <h3 className="px-4 text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-600 mb-2">
                  {group.label}
                </h3>
              )}
              {group.items.map((item: any) => {
                const isActive = location.pathname === item.href;

                return (
                  <div key={item.name} className="space-y-1">
                    <Link
                      to={item.href}
                      onClick={(e: any) => {
                        if (item.onClick) {
                          e.preventDefault();
                          item.onClick();
                        }
                        onClose();
                      }}
                      className={cn(
                        "group flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative",
                        isActive
                          ? "bg-accent text-accent-foreground shadow-sm"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white",
                        isCollapsed ? 'justify-center px-0 h-10 w-10 mx-auto' : ''
                      )}
                      title={isCollapsed ? item.name : ''}
                    >
                      <item.icon className={cn(
                        "w-5 h-5 transition-all duration-200 shrink-0"
                      )} />
                      {!isCollapsed && (
                        <div className="flex-1 flex items-center justify-between min-w-0">
                          <span className="truncate">{item.name}</span>
                          {item.badge && (
                            <Badge variant="secondary" className={cn(
                              "ml-auto h-5 px-1.5 text-[10px] font-bold",
                              isActive ? "bg-white/20 text-white border-none" : "bg-accent/10 text-accent dark:bg-accent/20 border-none"
                            )}>
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                      )}
                      {isActive && !isCollapsed && (
                        <div className="absolute left-0 w-1 h-4 bg-accent-foreground/50 rounded-r-full" />
                      )}
                    </Link>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </aside>
    </>
  );
};

export default SubcontractorSidebar;

