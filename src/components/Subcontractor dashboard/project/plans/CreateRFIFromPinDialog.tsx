import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, FileQuestion, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { useTeamMembers } from "@/hooks/Subcontractor dashboard/useTeamMembers";

const rfiSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  assigned_to: z.string().optional(),
  due_date: z.date().optional(),
});

type RFIFormData = z.infer<typeof rfiSchema>;

interface CreateRFIFromPinDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  pinTitle: string;
  pinDescription?: string | null;
  onCreateRFI: (data: {
    title: string;
    description?: string;
    assigned_to?: string;
    due_date?: string;
  }) => Promise<void>;
  isCreating: boolean;
}

export default function CreateRFIFromPinDialog({
  open,
  onOpenChange,
  projectId,
  pinTitle,
  pinDescription,
  onCreateRFI,
  isCreating,
}: CreateRFIFromPinDialogProps) {
  const { data: members } = useTeamMembers(projectId);

  const form = useForm<RFIFormData>({
    resolver: zodResolver(rfiSchema),
    defaultValues: {
      title: pinTitle,
      description: pinDescription || "",
    },
  });

  const onSubmit = async (data: RFIFormData) => {
    await onCreateRFI({
      title: data.title,
      description: data.description,
      assigned_to: data.assigned_to === "unassigned" ? undefined : data.assigned_to,
      due_date: data.due_date ? format(data.due_date, "yyyy-MM-dd") : undefined,
    });
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileQuestion className="w-5 h-5" />
            Create RFI from Pin
          </DialogTitle>
          <DialogDescription>
            Create a new RFI linked to this plan pin
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
              value={form.watch("assigned_to") || "unassigned"}
              onValueChange={(value) => form.setValue("assigned_to", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select team member" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Unassigned</SelectItem>
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
                  type="button"
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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create RFI
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
