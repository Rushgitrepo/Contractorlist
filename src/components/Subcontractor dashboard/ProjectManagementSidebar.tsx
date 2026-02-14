import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
    CalendarDays,
    ClipboardList,
    MessageSquare,
    Camera,
    ChevronLeft,
    ChevronRight,
    ArrowLeft,
    LayoutDashboard,
    FolderKanban,
    HardHat,
    Gavel,
    BarChart3,
    DollarSign,
    Receipt,
    ArrowLeftRight,
    FileSignature,
    Scale,
    AlertTriangle,
    FileCheck,
    Landmark
} from "lucide-react";

interface NavItem {
    to: string;
    icon: React.ComponentType<{ className?: string }>;
    label: string;
}

interface NavSection {
    label: string;
    items: NavItem[];
}

const navSections: NavSection[] = [
    {
        label: "Project",
        items: [
            { to: "/project-management/projects", icon: FolderKanban, label: "My Projects" },
            { to: "/project-management/directory", icon: HardHat, label: "Directory" },
            { to: "/project-management/communications", icon: MessageSquare, label: "Communications" },
            { to: "/project-management/bids", icon: Gavel, label: "Bid Management" },
            { to: "/project-management/schedule", icon: CalendarDays, label: "Schedule" },
            { to: "/project-management/daily-logs", icon: ClipboardList, label: "Daily Log" },
            { to: "/project-management/rfi", icon: MessageSquare, label: "RFIs" },
            { to: "/project-management/photos", icon: Camera, label: "Photos" },
        ]
    },
    {
        label: "Resources",
        items: [
            { to: "/project-management/resources", icon: BarChart3, label: "Resource Management" },
        ]
    },
    {
        label: "Financial Management",
        items: [
            { to: "/project-management/analytics", icon: BarChart3, label: "Analytics" },
            { to: "/project-management/financials", icon: DollarSign, label: "Budget" },
            { to: "/project-management/billing", icon: Receipt, label: "Pay Applications" },
            { to: "/project-management/change-orders", icon: ArrowLeftRight, label: "Change Events" },
            { to: "/project-management/signature-history", icon: FileSignature, label: "Signatures" },
        ]
    },
    {
        label: "Risk & Compliance",
        items: [
            { to: "/project-management/liens", icon: Scale, label: "Commitments" },
            { to: "/project-management/safety", icon: AlertTriangle, label: "Incidents" },
            { to: "/project-management/insurance", icon: FileCheck, label: "Insurances" },
            { to: "/project-management/payroll", icon: Landmark, label: "Certified Payroll" },
        ]
    }
];

export default function ProjectManagementSidebar() {
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <aside
            className={cn(
                "flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-200",
                collapsed ? "w-16" : "w-60"
            )}
        >
            {/* Logo Section */}
            <div className={cn("flex items-center h-14 px-4 border-b border-sidebar-border", collapsed && "justify-center px-2")}>
                {collapsed ? (
                    <span className="text-primary font-black text-xl tracking-tighter">PM</span>
                ) : (
                    <div className="flex flex-col">
                        <p className="text-sm font-black text-white uppercase tracking-tight">Project Management</p>
                    </div>
                )}
            </div>

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

            {/* Footer / Back to Dashboard */}
            <div className="border-t border-sidebar-border p-2">
                {!collapsed && (
                    <div className="space-y-1 mb-2">
                        <Link
                            to="/subcontractor-dashboard"
                            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Back to Dashboard</span>
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
