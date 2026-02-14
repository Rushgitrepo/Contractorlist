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
        fixed top-0 left-0 h-full bg-gray-900 border-r border-gray-800 z-50 shadow-2xl transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isCollapsed ? 'w-20' : 'w-80'}
        lg:relative lg:translate-x-0
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800 bg-gray-800">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-accent flex items-center justify-center shadow-lg">
                <Home className="w-6 h-6 text-accent-foreground" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-white">ContractorsList</h2>
                <p className="text-sm text-gray-400 font-medium">Homeowner Portal</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            {/* Desktop Collapse Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white"
            >
              {isCollapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <ChevronLeft className="w-5 h-5" />
              )}
            </Button>

            {/* Mobile Close */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* User Profile */}
        {!isCollapsed && (
          <div className="p-6 border-b border-gray-800 bg-gray-800">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold text-lg shadow-lg ring-4 ring-accent/20">
                A
              </div>
              <div className="flex flex-col overflow-hidden">
                <p className="text-white text-base font-semibold truncate">Alex Johnson</p>
                <p className="text-gray-400 text-sm truncate">Premium Homeowner</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-green-400 font-medium">Active</span>
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
                      ? "bg-accent text-accent-foreground shadow-lg shadow-accent/30 transform scale-[1.02]"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white hover:shadow-md",
                    isCollapsed ? 'justify-center px-3' : ''
                  )}
                >
                  {/* Active indicator background animation */}
                  {active && (
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                  )}

                  <div className={cn(
                    "flex items-center justify-center w-5 h-5 transition-all duration-300 relative z-10",
                    item.isPro && !active && "text-accent",
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
                              active ? "text-accent-foreground" : "text-accent"
                            )} />
                          )}
                        </div>
                        <p className={cn(
                          "text-xs truncate transition-all duration-300",
                          active ? "text-accent-foreground/70" : "text-gray-500"
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
                            item.badge === 'Pro' && !active && "bg-accent/10 text-accent group-hover:scale-110",
                            item.badge === 'New' && !active && "bg-green-100 text-green-700 group-hover:scale-110 animate-pulse",
                            !active && !['Pro', 'New'].includes(item.badge) && "bg-gray-700 text-gray-300 group-hover:scale-105"
                          )}
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                  {active && (
                    <>
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-black/20 rounded-r-full shadow-lg" />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-black/20 rounded-full animate-ping" />
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
