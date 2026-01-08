import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  BarChart3,
  Building2,
  Users,
  MessageSquare,
  FileText,
  Calendar,
  Search,
  Gavel,
  Building,
  Megaphone,
  FolderOpen,
  Bot,
  Zap,
  Settings,
  HelpCircle,
  X,
  ChevronRight,
  ChevronLeft,
  Crown,
  Sparkles,
  Activity,
  DollarSign,
  TrendingUp,
  Star,
  Award,
  Target
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { 
      name: 'Overview', 
      href: '/gc-dashboard/overview', 
      icon: LayoutDashboard,
      badge: null,
      description: 'Dashboard home'
    },
    { 
      name: 'Analytics', 
      href: '/gc-dashboard/analytics', 
      icon: BarChart3,
      badge: null,
      description: 'Performance metrics'
    },
    { 
      name: 'Projects', 
      href: '/gc-dashboard/projects', 
      icon: Building2,
      badge: '24',
      description: 'Active projects'
    },
    { 
      name: 'Team', 
      href: '/gc-dashboard/team', 
      icon: Users,
      badge: null,
      description: 'Team management'
    },
    { 
      name: 'Communications', 
      href: '/gc-dashboard/communications', 
      icon: MessageSquare,
      badge: '8',
      description: 'Messages & updates'
    },
    { 
      name: 'Documents', 
      href: '/gc-dashboard/documents', 
      icon: FileText,
      badge: null,
      description: 'Project documents'
    },
    { 
      name: 'Calendar', 
      href: '/gc-dashboard/calendar', 
      icon: Calendar,
      badge: null,
      description: 'Schedule & meetings'
    },
  ];

  const businessItems = [
    { 
      name: 'Project Discovery', 
      href: '/gc-dashboard/project-discovery', 
      icon: Search,
      badge: 'New',
      description: 'Find opportunities'
    },
    { 
      name: 'Bid Board', 
      href: '/gc-dashboard/bid-board', 
      icon: Gavel,
      badge: '12',
      description: 'Active bids'
    },
    { 
      name: 'Directory', 
      href: '/gc-dashboard/directory', 
      icon: Building,
      badge: null,
      description: 'Contractor network'
    },
    { 
      name: 'Marketing', 
      href: '/gc-dashboard/marketing', 
      icon: Megaphone,
      badge: null,
      description: 'Promote services'
    },
    { 
      name: 'My Projects', 
      href: '/gc-dashboard/my-projects', 
      icon: FolderOpen,
      badge: null,
      description: 'Personal projects'
    },
  ];

  const aiItems = [
    { 
      name: 'AI Takeoff', 
      href: '/gc-dashboard/ai-takeoff', 
      icon: Bot,
      badge: 'Pro',
      description: 'Smart estimations',
      isPro: true
    },
    { 
      name: 'AI Copilot', 
      href: '/gc-dashboard/ai-copilot', 
      icon: Zap,
      badge: 'Pro',
      description: 'AI assistant',
      isPro: true
    },
  ];

  const bottomItems = [
    { 
      name: 'Settings', 
      href: '/gc-dashboard/settings', 
      icon: Settings,
      badge: null,
      description: 'Account settings'
    },
    { 
      name: 'Help & Support', 
      href: '/gc-dashboard/help', 
      icon: HelpCircle,
      badge: null,
      description: 'Get assistance'
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
          "group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden",
          isActive
            ? "bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-500 text-black shadow-lg shadow-yellow-500/30 transform scale-[1.02]"
            : "text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-800 dark:hover:to-gray-700 hover:text-gray-900 dark:hover:text-white hover:shadow-md",
          isCollapsed ? 'justify-center px-3' : ''
        )}
      >
        {/* Active indicator background animation */}
        {isActive && (
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 animate-pulse" />
        )}
        
        <div className={cn(
          "flex items-center justify-center w-5 h-5 transition-all duration-300 relative z-10",
          item.isPro && !isActive && "text-purple-500",
          isActive && "scale-110",
          "group-hover:scale-110"
        )}>
          <item.icon className={cn(
            "w-5 h-5 transition-transform duration-300",
            isActive && "drop-shadow-lg"
          )} />
        </div>
        {!isCollapsed && (
          <>
            <div className="flex-1 min-w-0 relative z-10">
              <div className="flex items-center gap-2">
                <span className={cn(
                  "truncate transition-all duration-300",
                  isActive && "font-bold"
                )}>
                  {item.name}
                </span>
                {item.isPro && (
                  <Crown className={cn(
                    "w-3 h-3 transition-transform duration-300",
                    "group-hover:scale-125",
                    isActive ? "text-black" : "text-purple-500"
                  )} />
                )}
              </div>
              <p className={cn(
                "text-xs truncate transition-all duration-300",
                isActive ? "text-black/70" : "text-gray-500 dark:text-gray-400"
              )}>
                {item.description}
              </p>
            </div>
            {item.badge && (
              <Badge 
                variant={item.badge === 'Pro' ? 'default' : 'secondary'} 
                className={cn(
                  "text-xs px-2 py-1 font-semibold transition-all duration-300 relative z-10",
                  isActive && 'bg-black/20 text-black border-black/20 shadow-md',
                  item.badge === 'Pro' && !isActive && "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 group-hover:scale-110",
                  item.badge === 'New' && !isActive && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 group-hover:scale-110 animate-pulse",
                  !isActive && !['Pro', 'New'].includes(item.badge) && "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 group-hover:scale-105"
                )}
              >
                {item.badge}
              </Badge>
            )}
          </>
        )}
        {isActive && (
          <>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-black rounded-r-full shadow-lg" />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-black rounded-full animate-ping" />
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

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 transform transition-all duration-500 ease-out flex flex-col shadow-xl lg:shadow-lg",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        isCollapsed ? "w-16" : "w-72"
      )}>
        {/* Enhanced Header */}
        <div className="p-6 flex items-center justify-between border-b border-gray-200/50 dark:border-gray-700/50 h-20 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-black shadow-lg">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tight text-gray-900 dark:text-white">
                  Acme Construction
                </h1>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-gray-600 dark:text-gray-400">General Contractor</p>
                  <Badge className="bg-green-100 text-green-800 text-xs px-2 py-0.5">
                    <Activity className="w-3 h-3 mr-1" />
                    Active
                  </Badge>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-1">
            {/* Desktop Collapse Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex p-1.5"
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </Button>
            
            {/* Mobile Close */}
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

        {/* Enhanced Navigation */}
        <div className="flex-1 flex flex-col gap-6 p-6 overflow-y-auto">
          {/* Main Navigation */}
          <div className="space-y-2">
            {!isCollapsed && (
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3">
                Dashboard
              </h3>
            )}
            <div className="space-y-1">
              {navigationItems.map((item) => renderNavItem(item))}
            </div>
          </div>

          {/* Business Tools */}
          <div className="space-y-2">
            {!isCollapsed && (
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3">
                Business Tools
              </h3>
            )}
            <div className="space-y-1">
              {businessItems.map((item) => renderNavItem(item))}
            </div>
          </div>

          {/* AI Features */}
          <div className="space-y-2">
            {!isCollapsed && (
              <div className="flex items-center gap-2 px-3">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  AI Features
                </h3>
                <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 text-xs px-2 py-0.5">
                  Pro
                </Badge>
              </div>
            )}
            <div className="space-y-1">
              {aiItems.map((item) => renderNavItem(item))}
            </div>
          </div>
        </div>

        {/* Enhanced Bottom section */}
        <div className="p-6 border-t border-gray-200/50 dark:border-gray-700/50 space-y-4">
          {/* Settings */}
          <div className="space-y-1">
            {bottomItems.map((item) => renderNavItem(item))}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;