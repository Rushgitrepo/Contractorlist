import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Building2,
  MessageSquare,
  FolderOpen,
  FileText,
  Users,
  Search,
  Building,
  Settings,
  HelpCircle,
  X,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  LayoutDashboard
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    myprojects: false
  });
  const location = useLocation();

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const navigationItems = [
    { 
      name: 'Overview', 
      href: '/gc-dashboard/overview', 
      icon: LayoutDashboard,
      description: 'Dashboard home'
    },
    { 
      name: 'My Projects', 
      href: '/gc-dashboard/my-projects', 
      icon: FolderOpen,
      description: 'Manage projects, bid, invite team & documents'
    },
    { 
      name: 'Communication', 
      href: '/gc-dashboard/communications', 
      icon: MessageSquare,
      description: 'Messages & updates'
    },
    { 
      name: 'Project Discovery', 
      href: '/gc-dashboard/project-discovery', 
      icon: Search,
      description: 'Find homeowner projects'
    },
    { 
      name: 'Sub Contractor Directory', 
      href: '/gc-dashboard/directory', 
      icon: Building,
      description: 'Find subcontractors'
    },
  ];

  const bottomItems = [
    { 
      name: 'Settings', 
      href: '/gc-dashboard/settings', 
      icon: Settings,
      description: 'Account settings'
    },
    { 
      name: 'Support', 
      href: '/gc-dashboard/help', 
      icon: HelpCircle,
      description: 'Get assistance'
    },
  ];

  const renderNavItem = (item: any) => {
    const sectionKey = item.name?.toLowerCase().replace(/\s+/g, '') || '';
    const isActive = location.pathname === item.href || 
      (item.subItems && item.subItems.some((sub: any) => location.pathname === sub.href));
    const isExpanded = expandedSections[sectionKey] || false;

    if (item.hasSubmenu) {
      return (
        <div key={item.name}>
          <button
            onClick={() => toggleSection(sectionKey)}
            className={cn(
              "group w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden",
              isActive
                ? "bg-yellow-400 dark:bg-yellow-500 text-gray-900 shadow-md"
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
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                  <p className={cn(
                    "text-xs truncate transition-all duration-300",
                    isActive ? "text-gray-800" : "text-gray-500 dark:text-gray-400"
                  )}>
                    {item.description}
                  </p>
                </div>
              </>
            )}
          </button>
          {!isCollapsed && isExpanded && item.subItems && (
            <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
              {item.subItems.map((subItem: any) => {
                const isSubActive = location.pathname === subItem.href;
                return (
                  <Link
                    key={subItem.name}
                    to={subItem.href}
                    onClick={onClose}
                    className={cn(
                      "group flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all duration-300",
                      isSubActive
                        ? "bg-yellow-100 dark:bg-yellow-900/30 text-gray-900 dark:text-white font-medium"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                    )}
                  >
                    <subItem.icon className="w-4 h-4" />
                    <span>{subItem.name}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.name}
        to={item.href}
        onClick={onClose}
        className={cn(
          "group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden",
          isActive
            ? "bg-yellow-400 dark:bg-yellow-500 text-gray-900 shadow-md"
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
            <div className="flex-1 min-w-0 relative z-10">
              <div className="flex items-center gap-2">
                <span className={cn(
                  "truncate transition-all duration-300",
                  isActive && "font-bold"
                )}>
                  {item.name}
                </span>
              </div>
              <p className={cn(
                "text-xs truncate transition-all duration-300",
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

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-all duration-500 ease-out flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        isCollapsed ? "w-16" : "w-72"
      )}>
        {/* Header */}
        <div className="p-6 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 h-20">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-400 dark:bg-yellow-500 flex items-center justify-center text-gray-900 shadow-md">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                  GC Dashboard
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">General Contractor</p>
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

        {/* Navigation */}
        <div className="flex-1 flex flex-col gap-4 p-6 overflow-y-auto">
          <div className="space-y-1">
            {navigationItems.map((item) => renderNavItem(item))}
          </div>
        </div>

        {/* Bottom section */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-800 space-y-1">
          {bottomItems.map((item) => renderNavItem(item))}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
