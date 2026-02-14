import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/Subcontractor dashboard/ui/dialog";
import { Button } from "@/components/Subcontractor dashboard/ui/button";
import { Input } from "@/components/Subcontractor dashboard/ui/input";
import { Textarea } from "@/components/Subcontractor dashboard/ui/textarea";
import { Label } from "@/components/Subcontractor dashboard/ui/label";
import { Calendar } from "@/components/Subcontractor dashboard/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/Subcontractor dashboard/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Subcontractor dashboard/ui/select";
import { cn } from "@/lib/utils";
import { useCreateRFI, useProjectMembers, useProject } from "@/hooks/Subcontractor dashboard/useProjectDetail";

const rfiSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  assigned_to: z.string().optional(),
  due_date: z.date().optional(),
});

type RFIFormData = z.infer<typeof rfiSchema>;

interface CreateRFIDialogProps {
  projectId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateRFIDialog({ projectId, open, onOpenChange }: CreateRFIDialogProps) {
  const { data: project } = useProject(projectId);
  const { data: members } = useProjectMembers(projectId);
  const createRFI = useCreateRFI(projectId);

  const form = useForm<RFIFormData>({
    resolver: zodResolver(rfiSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const onSubmit = async (data: RFIFormData) => {
    // Find the assigned member's details for notification
    const assignedMember = data.assigned_to 
      ? members?.find(m => m.user_id === data.assigned_to)
      : null;

    await createRFI.mutateAsync({
      title: data.title,
      description: data.description,
      assigned_to: data.assigned_to,
      due_date: data.due_date ? format(data.due_date, "yyyy-MM-dd") : undefined,
      projectName: project?.name,
      assigneeName: assignedMember?.profile?.full_name,
      assigneeEmail: assignedMember?.profile?.email,
    });
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create RFI</DialogTitle>
          <DialogDescription>
            Submit a new Request for Information
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Enter RFI title"
              {...form.register("title")}
            />
            {form.formState.errors.title && (
              <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the information you need..."
              rows={3}
              {...form.register("description")}
            />
          </div>

          <div className="space-y-2">
            <Label>Assign To</Label>
            <Select
              value={form.watch("assigned_to") || ""}
              onValueChange={(value) => form.setValue("assigned_to", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select team member" />
              </SelectTrigger>
              <SelectContent>
                {members?.map((member) => (
                  <SelectItem key={member.user_id} value={member.user_id}>
                    {member.profile?.full_name || member.profile?.email || "Unknown"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !form.watch("due_date") && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {form.watch("due_date") ? format(form.watch("due_date")!, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={form.watch("due_date")}
                  onSelect={(date) => form.setValue("due_date", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createRFI.isPending}>
              {createRFI.isPending ? "Creating..." : "Create RFI"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
