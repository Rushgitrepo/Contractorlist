import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  FolderOpen,
  Gavel,
  Users,
  MessageSquare,
  Settings,
  HelpCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Home,
  Crown
} from 'lucide-react';

interface HomeownerSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const HomeownerSidebar = ({ isOpen, onClose }: HomeownerSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      description: 'Overview & insights',
      path: '/homeowner-dashboard/overview',
      badge: null,
      isPro: false
    },
    {
      icon: FolderOpen,
      label: 'My Projects',
      description: 'Manage projects',
      path: '/homeowner-dashboard/projects',
      badge: '3',
      isPro: false
    },
    {
      icon: Gavel,
      label: 'Bid Management',
      description: 'Review bids',
      path: '/homeowner-dashboard/bids',
      badge: '5',
      isPro: false
    },
    {
      icon: Users,
      label: 'Contractor Directory',
      description: 'Find contractors',
      path: '/homeowner-dashboard/contractors',
      badge: null,
      isPro: false
    },
    {
      icon: MessageSquare,
      label: 'Messages',
      description: 'Communications',
      path: '/homeowner-dashboard/messages',
      badge: '2',
      isPro: false
    },
    {
      icon: Settings,
      label: 'Account Settings',
      description: 'Account settings',
      path: '/homeowner-dashboard/settings',
      badge: null,
      isPro: false
    },
    {
      icon: HelpCircle,
      label: 'Help & Support',
      description: 'Get assistance',
      path: '/homeowner-dashboard/help',
      badge: null,
      isPro: false
    }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-50 shadow-2xl transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isCollapsed ? 'w-20' : 'w-80'}
        lg:relative lg:translate-x-0
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-gray-800 dark:to-gray-900">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                <Home className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-gray-900 dark:text-white">ContractorsList</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Homeowner Portal</p>
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            {/* Desktop Collapse Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex p-2 hover:bg-yellow-50 rounded-lg"
            >
              {isCollapsed ? (
                <ChevronRight className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              )}
            </Button>
            
            {/* Mobile Close */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-yellow-50 rounded-lg"
            >
              <X className="w-5 h-5 text-gray-600" />
            </Button>
          </div>
        </div>

        {/* User Profile */}
        {!isCollapsed && (
          <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-yellow-50/30 dark:from-gray-800 dark:to-gray-900/50">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-lg shadow-lg ring-4 ring-yellow-100 dark:ring-yellow-900/50">
                A
              </div>
              <div className="flex flex-col overflow-hidden">
                <p className="text-gray-900 dark:text-white text-base font-semibold truncate">Alex Johnson</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm truncate">Premium Homeowner</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-green-600 dark:text-green-400 font-medium">Active</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      onClose();
                    }
                  }}
                  className={cn(
                    "group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden",
                    active
                      ? "bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-500 text-black shadow-lg shadow-yellow-500/30 transform scale-[1.02]"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-800 dark:hover:to-gray-700 hover:text-gray-900 dark:hover:text-white hover:shadow-md",
                    isCollapsed ? 'justify-center px-3' : ''
                  )}
                >
                  {/* Active indicator background animation */}
                  {active && (
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 animate-pulse" />
                  )}
                  
                  <div className={cn(
                    "flex items-center justify-center w-5 h-5 transition-all duration-300 relative z-10",
                    item.isPro && !active && "text-purple-500",
                    active && "scale-110",
                    "group-hover:scale-110"
                  )}>
                    <item.icon className={cn(
                      "w-5 h-5 transition-transform duration-300",
                      active && "drop-shadow-lg"
                    )} />
                  </div>
                  {!isCollapsed && (
                    <>
                      <div className="flex-1 min-w-0 relative z-10">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "truncate transition-all duration-300",
                            active && "font-bold"
                          )}>
                            {item.label}
                          </span>
                          {item.isPro && (
                            <Crown className={cn(
                              "w-3 h-3 transition-transform duration-300",
                              "group-hover:scale-125",
                              active ? "text-black" : "text-purple-500"
                            )} />
                          )}
                        </div>
                        <p className={cn(
                          "text-xs truncate transition-all duration-300",
                          active ? "text-black/70" : "text-gray-500 dark:text-gray-400"
                        )}>
                          {item.description}
                        </p>
                      </div>
                      {item.badge && (
                        <Badge 
                          variant={item.badge === 'Pro' ? 'default' : 'secondary'} 
                          className={cn(
                            "text-xs px-2 py-1 font-semibold transition-all duration-300 relative z-10",
                            active && 'bg-black/20 text-black border-black/20 shadow-md',
                            item.badge === 'Pro' && !active && "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 group-hover:scale-110",
                            item.badge === 'New' && !active && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 group-hover:scale-110 animate-pulse",
                            !active && !['Pro', 'New'].includes(item.badge) && "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 group-hover:scale-105"
                          )}
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                  {active && (
                    <>
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-black rounded-r-full shadow-lg" />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-black rounded-full animate-ping" />
                    </>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </>
  );
};

export default HomeownerSidebar;