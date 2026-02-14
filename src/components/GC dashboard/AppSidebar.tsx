import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FolderKanban,
  CalendarDays,
  DollarSign,
  HardHat,
  ClipboardList,
  BarChart3,
  Receipt,
  ArrowLeftRight,
  MessageSquare,
  Camera,
  Scale,
  AlertTriangle,
  FileCheck,
  Landmark,
  ChevronLeft,
  ChevronRight,
  Settings,
  HelpCircle,
  Search,
  FileSignature,
  Gavel,
  Package,
  Wrench,
  Users,
} from "lucide-react";

interface NavItem {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  newTab?: boolean;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    label: "Project",
    items: [
      { to: "/gc-dashboard", icon: LayoutDashboard, label: "Dashboard" },
      { to: "/gc-dashboard/project-discovery", icon: Search, label: "Find Projects" },
    ],
  },
  {
    label: "Project Management",
    items: [
      { to: "/project-management", icon: ClipboardList, label: "Project Management", newTab: true },
    ],
  },
  {
    label: "Marketplace",
    items: [
      { to: "/gc-dashboard/products", icon: Package, label: "Products" },
      { to: "/gc-dashboard/services", icon: Wrench, label: "Services" },
    ],
  },
];

export default function AppSidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-200",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className={cn("flex items-center h-14 px-4 border-b border-sidebar-border", collapsed && "justify-center px-2")}>
        {collapsed ? (
          <span className="text-primary font-black text-xl tracking-tighter">GC</span>
        ) : (
          <div className="flex flex-col">
            <p className="text-sm font-black text-white uppercase tracking-tight">ContractorsList</p>
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest -mt-0.5">GC Dashboard</p>
          </div>
        )}
      </div>

      {/* Search */}
      {!collapsed && (
        <div className="px-3 py-3 border-b border-sidebar-border">
          <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-sidebar-accent/50 text-sidebar-foreground text-sm border border-sidebar-border">
            <Search className="w-4 h-4 text-sidebar-foreground/40" />
            <span>Search</span>
            <span className="ml-auto text-xs opacity-60">⌘K</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2">
        {navSections.map((section) => (
          <div key={section.label} className="mb-2">
            {!collapsed && (
              <p className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-sidebar-foreground/60">
                {section.label}
              </p>
            )}
            <div className="space-y-0.5 px-2">
              {section.items.map((item) => {
                const isActive = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    target={item.newTab ? "_blank" : undefined}
                    rel={item.newTab ? "noopener noreferrer" : undefined}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      collapsed && "justify-center px-2"
                    )}
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-2">
        {!collapsed && (
          <div className="space-y-0.5 mb-2">
            <Link to="/gc-dashboard/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </Link>
            <Link to="/gc-dashboard/customer-support" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors">
              <HelpCircle className="w-4 h-4" />
              <span>Customer Support</span>
            </Link>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 py-2 text-xs text-sidebar-foreground/40 hover:text-sidebar-foreground transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <><ChevronLeft className="w-4 h-4" /><span>Collapse</span></>}
        </button>
      </div>
    </aside>
  );
}
