import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Bell,
  ChevronDown,
  HelpCircle,
  Plus,
  Search,
  LogOut,
  User,
  FolderKanban,
  FileText,
  ArrowLeftRight,
  ClipboardList,
  Calendar,
  Check,
  MessageSquare,
  BookOpen,
  LifeBuoy,
  Mail,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  Clock,
  Home,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { format, formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/gc/dropdown-menu";
import { ScrollArea } from "@/components/ui/gc/scroll-area";
import { Badge } from "@/components/ui/gc/badge";
import CreateProjectDialog from "@/components/GC dashboard/CreateProjectDialog";
import { useAuth } from "@/context/GC dashboard/contexts/AuthContext";
import { SimpleThemeToggle } from "@/components/ThemeToggle";

export default function AppHeader() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [createProjectOpen, setCreateProjectOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Fetch projects for dropdown
  const { data: projects = [] } = useQuery({
    queryKey: ["header-projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("id, name, status")
        .order("name");
      if (error) throw error;
      return data || [];
    },
  });

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  // Fetch notifications (RFIs assigned to user, pending change orders, overdue items)
  const { data: notifications = [] } = useQuery({
    queryKey: ["header-notifications", profile?.id],
    queryFn: async () => {
      const items: Array<{
        id: string;
        type: "rfi" | "change_order" | "milestone" | "signature";
        title: string;
        description: string;
        time: Date;
        read: boolean;
        projectId?: string;
      }> = [];

      // Get RFIs assigned to user or created by user that are open
      const { data: rfis } = await supabase
        .from("rfis")
        .select("id, title, status, created_at, project_id")
        .in("status", ["open", "draft"])
        .order("created_at", { ascending: false })
        .limit(5);

      rfis?.forEach(rfi => {
        items.push({
          id: rfi.id,
          type: "rfi",
          title: `RFI: ${rfi.title?.slice(0, 30) || "Untitled"}`,
          description: rfi.status === "open" ? "Awaiting response" : "Draft",
          time: new Date(rfi.created_at),
          read: false,
          projectId: rfi.project_id,
        });
      });

      // Get pending change orders
      const { data: changeOrders } = await supabase
        .from("change_orders")
        .select("id, title, amount, created_at, project_id")
        .eq("status", "pending")
        .order("created_at", { ascending: false })
        .limit(3);

      changeOrders?.forEach(co => {
        items.push({
          id: co.id,
          type: "change_order",
          title: `CO: ${co.title?.slice(0, 30) || "Change Order"}`,
          description: `$${Number(co.amount || 0).toLocaleString()} pending approval`,
          time: new Date(co.created_at),
          read: false,
          projectId: co.project_id,
        });
      });

      // Get upcoming milestones (next 7 days)
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);

      const { data: milestones } = await supabase
        .from("milestones")
        .select("id, name, end_date, project_id")
        .gte("end_date", format(new Date(), "yyyy-MM-dd"))
        .lte("end_date", format(nextWeek, "yyyy-MM-dd"))
        .order("end_date", { ascending: true })
        .limit(3);

      milestones?.forEach(milestone => {
        items.push({
          id: milestone.id,
          type: "milestone",
          title: `Milestone: ${milestone.name?.slice(0, 25)}`,
          description: `Due ${format(new Date(milestone.end_date), "MMM d")}`,
          time: new Date(milestone.end_date),
          read: false,
          projectId: milestone.project_id,
        });
      });

      return items.sort((a, b) => b.time.getTime() - a.time.getTime()).slice(0, 8);
    },
    enabled: !!profile?.id,
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "rfi": return <MessageSquare className="w-4 h-4" />;
      case "change_order": return <ArrowLeftRight className="w-4 h-4" />;
      case "milestone": return <Calendar className="w-4 h-4" />;
      case "signature": return <FileText className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const handleCreateRFI = () => {
    if (selectedProjectId) {
      navigate(`/gc-dashboard/projects/${selectedProjectId}?tab=rfis&action=create`);
    } else if (projects.length > 0) {
      navigate(`/gc-dashboard/projects/${projects[0].id}?tab=rfis&action=create`);
    } else {
      navigate("/gc-dashboard/rfi");
    }
  };

  const handleCreateChangeOrder = () => {
    if (selectedProjectId) {
      navigate(`/gc-dashboard/projects/${selectedProjectId}?tab=change-orders&action=create`);
    } else if (projects.length > 0) {
      navigate(`/gc-dashboard/projects/${projects[0].id}?tab=change-orders&action=create`);
    } else {
      navigate("/gc-dashboard/change-orders");
    }
  };

  const handleCreateDailyLog = () => {
    if (selectedProjectId) {
      navigate(`/gc-dashboard/projects/${selectedProjectId}?tab=daily-logs&action=create`);
    } else if (projects.length > 0) {
      navigate(`/gc-dashboard/projects/${projects[0].id}?tab=daily-logs&action=create`);
    } else {
      navigate("/gc-dashboard/daily-logs");
    }
  };

  const handleCreateMilestone = () => {
    if (selectedProjectId) {
      navigate(`/gc-dashboard/projects/${selectedProjectId}?tab=schedule&action=create`);
    } else {
      navigate("/gc-dashboard/schedule");
    }
  };

  return (
    <header className="h-14 bg-card border-b border-border flex items-center justify-between px-4 shrink-0">
      {/* Left: Project selector */}
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-muted transition-colors">
              <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center">
                <span className="text-yellow-700 dark:text-yellow-400 font-semibold text-xs">
                  {selectedProject ? selectedProject.name.slice(0, 2).toUpperCase() : "AP"}
                </span>
              </div>
              <span className="text-sm font-medium text-foreground max-w-[200px] truncate">
                {selectedProject ? selectedProject.name : "All Projects"}
              </span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64">
            <DropdownMenuLabel>Switch Project</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setSelectedProjectId(null)}
              className="flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <FolderKanban className="w-4 h-4" />
                All Projects
              </span>
              {!selectedProjectId && <Check className="w-4 h-4 text-primary" />}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {projects.length === 0 ? (
              <div className="px-2 py-3 text-sm text-muted-foreground text-center">
                No projects yet
              </div>
            ) : (
              projects.map((project) => (
                <DropdownMenuItem
                  key={project.id}
                  onClick={() => {
                    setSelectedProjectId(project.id);
                    navigate(`/gc-dashboard/projects/${project.id}`);
                  }}
                  className="flex items-center justify-between"
                >
                  <span className="truncate">{project.name}</span>
                  {selectedProjectId === project.id && <Check className="w-4 h-4 text-primary" />}
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Center: Global search */}
      <div className="flex-1 max-w-xl mx-8 hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search projects, RFIs, documents..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-muted/50 border border-border rounded-md placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">⌘K</span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Home Icon - Navigate to Contractor Website */}
        <button
          onClick={() => navigate("/")}
          className="p-2 rounded-md hover:bg-muted transition-colors"
          title="Go to Home"
        >
          <Home className="w-5 h-5 text-muted-foreground" />
        </button>

        {/* Theme Toggle */}
        <SimpleThemeToggle />

        {/* Create Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Create</span>
              <ChevronDown className="w-3 h-3 ml-0.5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => setCreateProjectOpen(true)}>
              <FolderKanban className="w-4 h-4 mr-2" />
              New Project
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleCreateRFI}>
              <FileText className="w-4 h-4 mr-2" />
              New RFI
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleCreateChangeOrder}>
              <ArrowLeftRight className="w-4 h-4 mr-2" />
              New Change Order
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleCreateDailyLog}>
              <ClipboardList className="w-4 h-4 mr-2" />
              New Daily Log
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleCreateMilestone}>
              <Calendar className="w-4 h-4 mr-2" />
              New Milestone
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative p-2 rounded-md hover:bg-muted transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-[10px] font-bold text-primary-foreground">{unreadCount > 9 ? "9+" : unreadCount}</span>
                </span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="text-xs">{unreadCount} new</Badge>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <ScrollArea className="h-[300px]">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No notifications</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className="flex items-start gap-3 p-3 cursor-pointer"
                    onClick={() => {
                      if (notification.projectId) {
                        navigate(`/gc-dashboard/projects/${notification.projectId}`);
                      }
                    }}
                  >
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{notification.title}</p>
                      <p className="text-xs text-muted-foreground">{notification.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(notification.time, { addSuffix: true })}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                    )}
                  </DropdownMenuItem>
                ))
              )}
            </ScrollArea>
            {notifications.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="justify-center text-yellow-600 dark:text-yellow-400"
                  onClick={() => navigate("/gc-dashboard/rfi")}
                >
                  View all activity
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Help Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 rounded-md hover:bg-muted transition-colors">
              <HelpCircle className="w-5 h-5 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Help & Resources</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/help")}>
              <BookOpen className="w-4 h-4 mr-2" />
              Documentation
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/help")}>
              <LifeBuoy className="w-4 h-4 mr-2" />
              Support Center
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => window.open("mailto:support@contractorslist.com", "_blank")}>
              <Mail className="w-4 h-4 mr-2" />
              Contact Support
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/help")}>
              <MessageSquare className="w-4 h-4 mr-2" />
              Send Feedback
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <div className="px-2 py-1.5 text-xs text-muted-foreground">
              Version 1.0.0
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 ml-2 p-1 pr-2 rounded-md hover:bg-muted transition-colors">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium text-sm">
                {getInitials(profile?.full_name || null)}
              </div>
              <ChevronDown className="w-3 h-3 text-muted-foreground hidden sm:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium text-foreground">
                {profile?.full_name || "User"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {profile?.email}
              </p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/gc-dashboard/settings")}>
              <User className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Create Project Dialog */}
      <CreateProjectDialog
        open={createProjectOpen}
        onOpenChange={setCreateProjectOpen}
        showTrigger={false}
      />
    </header>
  );
}
