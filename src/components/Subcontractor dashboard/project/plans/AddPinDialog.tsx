import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/Subcontractor dashboard/ui/dialog";
import { Button } from "@/components/Subcontractor dashboard/ui/button";
import { Input } from "@/components/Subcontractor dashboard/ui/input";
import { Label } from "@/components/Subcontractor dashboard/ui/label";
import { Textarea } from "@/components/Subcontractor dashboard/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Subcontractor dashboard/ui/select";
import { Loader2 } from "lucide-react";
import { PIN_TYPES, PinType, useCreatePin } from "@/hooks/Subcontractor dashboard/usePlans";
import { useTeamMembers } from "@/hooks/Subcontractor dashboard/useTeamMembers";

interface AddPinDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planId: string;
  projectId: string;
  position: { x: number; y: number };
}

export default function AddPinDialog({
  open,
  onOpenChange,
  planId,
  projectId,
  position,
}: AddPinDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pinType, setPinType] = useState<PinType>("general");
  const [assignedTo, setAssignedTo] = useState<string>("");

  const createPin = useCreatePin(planId, projectId);
  const { data: teamMembers } = useTeamMembers(projectId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await createPin.mutateAsync({
      xPosition: position.x,
      yPosition: position.y,
      pinType,
      title,
      description,
      assignedTo: assignedTo === "unassigned" ? undefined : assignedTo || undefined,
    });

    // Reset form and close
    setTitle("");
    setDescription("");
    setPinType("general");
    setAssignedTo("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Pin</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs attention here?"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pinType">Type</Label>
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
            <Label htmlFor="assignedTo">Assign To</Label>
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
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim() || createPin.isPending}>
              {createPin.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Add Pin
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
