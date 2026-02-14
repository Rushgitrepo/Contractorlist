import { useState } from "react";
import { Button } from "@/components/Subcontractor dashboard/ui/button";
import { Input } from "@/components/Subcontractor dashboard/ui/input";
import { Label } from "@/components/Subcontractor dashboard/ui/label";
import { Textarea } from "@/components/Subcontractor dashboard/ui/textarea";
import { Badge } from "@/components/Subcontractor dashboard/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Subcontractor dashboard/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/Subcontractor dashboard/ui/alert-dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/Subcontractor dashboard/ui/collapsible";
import { X, Trash2, Loader2, User, Calendar, Link2, Plus, ChevronDown, MessageCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  PlanPin,
  PIN_TYPES,
  PIN_STATUSES,
  PinType,
  PinStatus,
  useUpdatePin,
  useDeletePin,
} from "@/hooks/Subcontractor dashboard/usePlans";
import { useTeamMembers } from "@/hooks/Subcontractor dashboard/useTeamMembers";
import { useProjectRFIs, useCreateRFI, useProject } from "@/hooks/Subcontractor dashboard/useProjectDetail";
import { usePinComments } from "@/hooks/Subcontractor dashboard/usePinComments";
import LinkRFIDialog from "./LinkRFIDialog";
import CreateRFIFromPinDialog from "./CreateRFIFromPinDialog";
import PinPhotoGallery from "./PinPhotoGallery";
import PinCommentsSection from "./PinCommentsSection";

interface PinDetailPanelProps {
  pin: PlanPin;
  planId: string;
  projectId: string;
  onClose: () => void;
}

export default function PinDetailPanel({
  pin,
  planId,
  projectId,
  onClose,
}: PinDetailPanelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(pin.title);
  const [description, setDescription] = useState(pin.description || "");
  const [pinType, setPinType] = useState<PinType>((pin.pin_type as PinType) || "general");
  const [status, setStatus] = useState<PinStatus>((pin.status as PinStatus) || "open");
  const [assignedTo, setAssignedTo] = useState(pin.assigned_to || "unassigned");
  const [showLinkRFIDialog, setShowLinkRFIDialog] = useState(false);
  const [showCreateRFIDialog, setShowCreateRFIDialog] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(true);

  const updatePin = useUpdatePin(planId);
  const deletePin = useDeletePin(planId);
  const { data: teamMembers } = useTeamMembers(projectId);
  const { data: rfis } = useProjectRFIs(projectId);
  const { data: project } = useProject(projectId);
  const { data: comments } = usePinComments(pin.id);
  const createRFI = useCreateRFI(projectId);

  // Find linked RFI
  const linkedRfi = pin.rfi_id ? rfis?.find(r => r.id === pin.rfi_id) : null;

  const handleSave = async () => {
    await updatePin.mutateAsync({
      pinId: pin.id,
      updates: {
        title,
        description: description || null,
        pin_type: pinType,
        status,
        assigned_to: assignedTo === "unassigned" ? null : assignedTo || null,
      },
    });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    await deletePin.mutateAsync(pin.id);
    onClose();
  };

  const handleLinkRFI = async (rfiId: string | null) => {
    await updatePin.mutateAsync({
      pinId: pin.id,
      updates: { rfi_id: rfiId },
    });
  };

  const handleCreateRFI = async (data: {
    title: string;
    description?: string;
    assigned_to?: string;
    due_date?: string;
  }) => {
    // Find the assigned member's details for notification
    const assignedMember = data.assigned_to 
      ? teamMembers?.find(m => m.user_id === data.assigned_to)
      : null;

    const newRfi = await createRFI.mutateAsync({
      title: data.title,
      description: data.description,
      assigned_to: data.assigned_to,
      due_date: data.due_date,
      projectName: project?.name,
      assigneeName: assignedMember?.profile?.full_name || undefined,
      assigneeEmail: assignedMember?.profile?.email,
    });

    // Link the new RFI to this pin
    await updatePin.mutateAsync({
      pinId: pin.id,
      updates: { rfi_id: newRfi.id },
    });
  };

  const getPinColor = (type: string | null) => {
    const t = PIN_TYPES.find((p) => p.value === type);
    return t?.color || "#6b7280";
  };

  const getStatusBadgeStyle = (s: string | null) => {
    switch (s) {
      case "open":
        return "bg-blue-500/10 text-blue-600";
      case "in_progress":
        return "bg-amber-500/10 text-amber-600";
      case "resolved":
        return "bg-green-500/10 text-green-600";
      case "closed":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getRfiStatusBadgeStyle = (status: string | null) => {
    switch (status) {
      case "draft":
        return "bg-muted text-muted-foreground";
      case "open":
        return "bg-blue-500/10 text-blue-600";
      case "answered":
        return "bg-green-500/10 text-green-600";
      case "closed":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="w-80 bg-background border-l flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: getPinColor(pin.pin_type) }}
          />
          <span className="font-medium text-sm capitalize">
            {PIN_TYPES.find((t) => t.value === pin.pin_type)?.label || "Pin"}
          </span>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isEditing ? (
          <>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={pinType} onValueChange={(v) => setPinType(v as PinType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PIN_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: type.color }}
                        />
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as PinStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PIN_STATUSES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Assign To</Label>
              <Select value={assignedTo} onValueChange={setAssignedTo}>
                <SelectTrigger>
                  <SelectValue placeholder="Select team member" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {teamMembers?.map((member) => (
                    <SelectItem key={member.user_id} value={member.user_id}>
                      {member.profile?.full_name || member.profile?.email || "Unknown"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <h3 className="font-semibold text-lg">{pin.title}</h3>
              <Badge className={cn("mt-2", getStatusBadgeStyle(pin.status))}>
                {PIN_STATUSES.find((s) => s.value === pin.status)?.label || "Open"}
              </Badge>
            </div>

            {pin.description && (
              <p className="text-sm text-muted-foreground">{pin.description}</p>
            )}

            {/* Linked RFI Section */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs uppercase text-muted-foreground">Linked RFI</Label>
              </div>
              {linkedRfi ? (
                <div className="p-3 rounded-lg border bg-muted/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-muted-foreground">
                      RFI-{linkedRfi.rfi_number}
                    </span>
                    <Badge className={cn("text-xs", getRfiStatusBadgeStyle(linkedRfi.status))}>
                      {linkedRfi.status}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium">{linkedRfi.title}</p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setShowLinkRFIDialog(true)}
                    >
                      <Link2 className="w-3 h-3 mr-1" />
                      Change
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-lg border border-dashed bg-muted/20 space-y-2">
                  <p className="text-sm text-muted-foreground text-center">
                    No RFI linked to this pin
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setShowCreateRFIDialog(true)}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Create RFI
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setShowLinkRFIDialog(true)}
                    >
                      <Link2 className="w-3 h-3 mr-1" />
                      Link
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Photo Gallery Section */}
            <div className="pt-2">
              <PinPhotoGallery projectId={projectId} pinId={pin.id} />
            </div>

            {/* Comments Section */}
            <Collapsible open={commentsOpen} onOpenChange={setCommentsOpen} className="pt-2">
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between p-2 h-auto"
                >
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      Comments ({comments?.reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0) || 0})
                    </span>
                  </div>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 transition-transform",
                      commentsOpen && "rotate-180"
                    )}
                  />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="border rounded-lg mt-2 h-[300px]">
                  <PinCommentsSection pinId={pin.id} projectId={projectId} />
                </div>
              </CollapsibleContent>
            </Collapsible>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Created by:</span>
                <span>
                  {pin.created_by_profile?.full_name || pin.created_by_profile?.email || "Unknown"}
                </span>
              </div>

              {pin.assigned_to_profile && (
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Assigned to:</span>
                  <span>
                    {pin.assigned_to_profile.full_name || pin.assigned_to_profile.email}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Created:</span>
                <span>{format(new Date(pin.created_at), "MMM d, yyyy")}</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Actions */}
      <div className="p-4 border-t space-y-2">
        {isEditing ? (
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setIsEditing(false);
                setTitle(pin.title);
                setDescription(pin.description || "");
                setPinType((pin.pin_type as PinType) || "general");
                setStatus((pin.status as PinStatus) || "open");
                setAssignedTo(pin.assigned_to || "unassigned");
              }}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleSave}
              disabled={!title.trim() || updatePin.isPending}
            >
              {updatePin.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save
            </Button>
          </div>
        ) : (
          <>
            <Button variant="outline" className="w-full" onClick={() => setIsEditing(true)}>
              Edit Pin
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" className="w-full text-destructive hover:text-destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Pin
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Pin</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this pin? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </div>

      {/* Dialogs */}
      <LinkRFIDialog
        open={showLinkRFIDialog}
        onOpenChange={setShowLinkRFIDialog}
        projectId={projectId}
        currentRfiId={pin.rfi_id}
        onLink={handleLinkRFI}
        isLinking={updatePin.isPending}
      />

      <CreateRFIFromPinDialog
        open={showCreateRFIDialog}
        onOpenChange={setShowCreateRFIDialog}
        projectId={projectId}
        pinTitle={pin.title}
        pinDescription={pin.description}
        onCreateRFI={handleCreateRFI}
        isCreating={createRFI.isPending}
      />
    </div>
  );
}
