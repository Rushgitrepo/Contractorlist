import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/Subcontractor dashboard/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/Subcontractor dashboard/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Subcontractor dashboard/ui/select";
import { Button } from "@/components/Subcontractor dashboard/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/Subcontractor dashboard/ui/avatar";
import { Badge } from "@/components/Subcontractor dashboard/ui/badge";
import { ScrollArea } from "@/components/Subcontractor dashboard/ui/scroll-area";
import { Separator } from "@/components/Subcontractor dashboard/ui/separator";
import { Skeleton } from "@/components/Subcontractor dashboard/ui/skeleton";
import {
  Users,
  Mail,
  Building2,
  Trash2,
  Crown,
  HardHat,
  Loader2,
  FolderKanban,
} from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/Subcontractor dashboard/ConfirmDialog";


interface ManageTeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const roleIcons: Record<string, React.ReactNode> = {
  owner: <Crown className="w-3 h-3" />,
  gc: <HardHat className="w-3 h-3" />,
  superintendent: <HardHat className="w-3 h-3" />,
  subcontractor: <Building2 className="w-3 h-3" />,
  architect: <Building2 className="w-3 h-3" />,
  engineer: <Building2 className="w-3 h-3" />,
};

const roleLabels: Record<string, string> = {
  owner: "Owner",
  gc: "General Contractor",
  superintendent: "Superintendent",
  subcontractor: "Subcontractor",
  architect: "Architect",
  engineer: "Engineer",
};

export function ManageTeamDialog({ open, onOpenChange }: ManageTeamDialogProps) {
  const { profile } = useAuth();
  const [selectedProject, setSelectedProject] = useState<string>("all");
  const [removingMemberId, setRemovingMemberId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; name: string } | null>(null);


  // Fetch projects where user is admin
  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ["admin-projects", profile?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("id, name")
        .order("name");

      if (error) throw error;
      return data || [];
    },
    enabled: open && !!profile?.id,
  });

  // Fetch team members across projects
  const { data: teamMembers, isLoading: membersLoading, refetch } = useQuery({
    queryKey: ["team-members", selectedProject, profile?.id],
    queryFn: async () => {
      let query = supabase
        .from("project_members")
        .select(`
          id,
          role,
          created_at,
          project_id,
          project:projects(id, name),
          user:profiles!project_members_user_id_fkey(id, full_name, email, avatar_url, company_name)
        `)
        .order("created_at", { ascending: false });

      if (selectedProject !== "all") {
        query = query.eq("project_id", selectedProject);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    enabled: open && !!profile?.id,
  });

  const handleRemoveMember = async () => {
    if (!confirmDelete) return;

    const { id: memberId, name: memberName } = confirmDelete;
    setConfirmDelete(null);
    setRemovingMemberId(memberId);

    try {
      const { error } = await supabase
        .from("project_members")
        .delete()
        .eq("id", memberId);

      if (error) throw error;

      toast.success(`${memberName} has been removed`);
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to remove member");
    } finally {
      setRemovingMemberId(null);
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const isLoading = projectsLoading || membersLoading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Manage Team
          </DialogTitle>
          <DialogDescription>
            View and manage team members across your projects
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Project Filter */}
          <div className="flex items-center gap-3">
            <FolderKanban className="w-4 h-4 text-muted-foreground" />
            <Select value={selectedProject} onValueChange={setSelectedProject}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Filter by project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {projects?.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Team Members List */}
          <ScrollArea className="h-[400px] pr-4">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4 p-3">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </div>
                ))}
              </div>
            ) : teamMembers?.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No team members found</p>
                <p className="text-sm">Invite members from individual project settings</p>
              </div>
            ) : (
              <div className="space-y-2">
                {teamMembers?.map((member) => {
                  const user = member.user as any;
                  const project = member.project as any;
                  const isOwner = member.role === "owner";
                  const isCurrentUser = user?.id === profile?.id;

                  return (
                    <div
                      key={member.id}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <Avatar>
                        <AvatarImage src={user?.avatar_url} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {getInitials(user?.full_name)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium truncate">
                            {user?.full_name || "Unknown User"}
                          </span>
                          {isCurrentUser && (
                            <Badge variant="outline" className="text-xs">You</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="w-3 h-3" />
                          <span className="truncate">{user?.email}</span>
                        </div>
                        {user?.company_name && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Building2 className="w-3 h-3" />
                            <span>{user.company_name}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <Badge
                          variant={isOwner ? "default" : "secondary"}
                          className="flex items-center gap-1"
                        >
                          {roleIcons[member.role]}
                          {roleLabels[member.role] || member.role}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {project?.name}
                        </span>
                      </div>

                      {!isOwner && !isCurrentUser && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => setConfirmDelete({ id: member.id, name: user?.full_name || "this member" })}
                          disabled={removingMemberId === member.id}

                        >
                          {removingMemberId === member.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>

          <Separator />

          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>
              {teamMembers?.length || 0} member{(teamMembers?.length || 0) !== 1 ? "s" : ""} total
            </span>
            <p>To invite new members, go to a project's Team tab</p>
          </div>
        </div>
      </DialogContent>

      <ConfirmDialog
        open={!!confirmDelete}
        onOpenChange={(open) => !open && setConfirmDelete(null)}
        title="Remove Team Member"
        description={`Are you sure you want to remove ${confirmDelete?.name} from this project? They will no longer have access to this project's data.`}
        onConfirm={handleRemoveMember}
        confirmText="Remove Member"
        variant="destructive"
      />
    </Dialog>

  );
}
