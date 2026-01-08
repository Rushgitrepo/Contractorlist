import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Target,
  MessageSquare,
  BarChart3,
  Settings,
  HelpCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Truck,
  Activity,
  Crown
} from 'lucide-react';

interface SupplierSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const SupplierSidebar = ({ isOpen, onClose }: SupplierSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: 'Overview',
      description: 'Dashboard & insights',
      path: '/supplier-dashboard/overview',
      badge: null,
      isPro: false
    },
    {
      icon: Package,
      label: 'Product Catalog',
      description: 'Manage products',
      path: '/supplier-dashboard/catalog',
      badge: '1,247',
      isPro: false
    },
    {
      icon: ShoppingCart,
      label: 'Orders & RFQs',
      description: 'Track orders',
      path: '/supplier-dashboard/orders',
      badge: '18',
      isPro: false
    },
    {
      icon: Target,
      label: 'Project Leads',
      description: 'New opportunities',
      path: '/supplier-dashboard/leads',
      badge: '42',
      isPro: false
    },
    {
      icon: MessageSquare,
      label: 'Messages',
      description: 'Communications',
      path: '/supplier-dashboard/messages',
      badge: '7',
      isPro: false
    },
    {
      icon: BarChart3,
      label: 'Analytics',
      description: 'Performance metrics',
      path: '/supplier-dashboard/analytics',
      badge: null,
      isPro: false
    },
    {
      icon: Settings,
      label: 'Settings',
      description: 'Account settings',
      path: '/supplier-dashboard/settings',
      badge: null,
      isPro: false
    },
    {
      icon: HelpCircle,
      label: 'Help & Support',
      description: 'Get assistance',
      path: '/supplier-dashboard/help',
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
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full bg-surface-light dark:bg-surface-dark border-r border-border-light dark:border-border-dark z-50
        transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isCollapsed ? 'w-16' : 'w-64'}
        lg:relative lg:translate-x-0
      `}>
        {/* Enhanced Header */}
        <div className="flex items-center justify-between p-4 border-b border-border-light dark:border-border-dark bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                <Truck className="w-5 h-5 text-black" />
              </div>
              <div>
                <h2 className="font-bold text-base text-gray-900 dark:text-white">BuildMart Supply</h2>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Material Supplier</p>
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
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

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

export default SupplierSidebar;