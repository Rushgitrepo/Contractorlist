import { useState } from "react";
import { useProjectMembers } from "@/hooks/Subcontractor dashboard/useProjectDetail";
import { useRemoveTeamMember } from "@/hooks/Subcontractor dashboard/useTeamMembers";
import { Loader2, Users, Mail, Phone, Building, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/Subcontractor dashboard/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/Subcontractor dashboard/ui/alert-dialog";
import InviteTeamMemberDialog from "./InviteTeamMemberDialog";

const roleStyles: Record<string, { bg: string; text: string }> = {
  owner: { bg: "bg-primary/10", text: "text-primary" },
  gc: { bg: "bg-info/10", text: "text-info" },
  superintendent: { bg: "bg-warning/10", text: "text-warning" },
  subcontractor: { bg: "bg-success/10", text: "text-success" },
  architect: { bg: "bg-purple-500/10", text: "text-purple-500" },
  engineer: { bg: "bg-pink-500/10", text: "text-pink-500" },
};

const roleLabels: Record<string, string> = {
  owner: "Owner",
  gc: "General Contractor",
  superintendent: "Superintendent",
  subcontractor: "Subcontractor",
  architect: "Architect",
  engineer: "Engineer",
};

interface ProjectTeamTabProps {
  projectId: string;
}

export default function ProjectTeamTab({ projectId }: ProjectTeamTabProps) {
  const { data: members, isLoading } = useProjectMembers(projectId);
  const removeMember = useRemoveTeamMember(projectId);
  
  const [memberToRemove, setMemberToRemove] = useState<{
    id: string;
    name: string;
    role: string;
  } | null>(null);

  const handleRemove = async () => {
    if (!memberToRemove) return;
    await removeMember.mutateAsync(memberToRemove.id);
    setMemberToRemove(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Team Members ({members?.length || 0})</h3>
        <InviteTeamMemberDialog projectId={projectId} />
      </div>

      {members?.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Users className="w-10 h-10 mx-auto mb-3 opacity-50" />
          <p>No team members yet</p>
          <p className="text-sm">Invite people to collaborate on this project</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members?.map((member: any) => (
            <div key={member.id} className="stat-card p-4 relative group">
              {/* Remove button - hidden for owners */}
              {member.role !== "owner" && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7 text-muted-foreground hover:text-destructive"
                  onClick={() => setMemberToRemove({
                    id: member.id,
                    name: member.profile?.full_name || member.profile?.email || "Unknown",
                    role: roleLabels[member.role] || member.role,
                  })}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
              
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium shrink-0">
                  {member.profile?.full_name
                    ?.split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2) || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">
                    {member.profile?.full_name || "Unknown"}
                  </p>
                  <span className={cn(
                    "text-[10px] font-semibold px-2 py-0.5 rounded uppercase",
                    roleStyles[member.role]?.bg,
                    roleStyles[member.role]?.text
                  )}>
                    {roleLabels[member.role] || member.role}
                  </span>
                </div>
              </div>

              <div className="mt-3 space-y-1.5 text-sm">
                {member.profile?.email && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{member.profile.email}</span>
                  </div>
                )}
                {member.profile?.company_name && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{member.profile.company_name}</span>
                  </div>
                )}
                {member.profile?.phone && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-3.5 h-3.5 shrink-0" />
                    <span>{member.profile.phone}</span>
                  </div>
                )}
                {member.subcontractor && (
                  <div className="text-xs text-muted-foreground mt-2 pt-2 border-t border-border">
                    <span className="font-medium">{member.subcontractor.company_name}</span>
                    {member.subcontractor.trade && (
                      <span className="ml-1">• {member.subcontractor.trade}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Remove confirmation dialog */}
      <AlertDialog open={!!memberToRemove} onOpenChange={(open) => !open && setMemberToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Team Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove <strong>{memberToRemove?.name}</strong> ({memberToRemove?.role}) from this project? 
              They will no longer have access to project data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemove}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {removeMember.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
