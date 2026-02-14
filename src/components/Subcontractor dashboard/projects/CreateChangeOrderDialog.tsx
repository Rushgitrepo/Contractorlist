import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { useCreateChangeOrder, useProject, useProjectMembers } from "@/hooks/Subcontractor dashboard/useProjectDetail";

const changeOrderSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  amount: z.string().min(1, "Amount is required").transform((val) => parseFloat(val)),
  reason: z.string().optional(),
});

type ChangeOrderFormData = z.infer<typeof changeOrderSchema>;

interface CreateChangeOrderDialogProps {
  projectId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateChangeOrderDialog({ projectId, open, onOpenChange }: CreateChangeOrderDialogProps) {
  const { data: project } = useProject(projectId);
  const { data: members } = useProjectMembers(projectId);
  const createChangeOrder = useCreateChangeOrder(projectId);

  const form = useForm<ChangeOrderFormData>({
    resolver: zodResolver(changeOrderSchema),
    defaultValues: {
      title: "",
      description: "",
      amount: "",
      reason: "",
    } as any,
  });

  const onSubmit = async (data: ChangeOrderFormData) => {
    // Get admin emails for notifications (owners and GCs)
    const adminEmails = members
      ?.filter(m => m.role === "owner" || m.role === "gc")
      .map(m => ({
        email: m.profile?.email || "",
        name: m.profile?.full_name || null,
      }))
      .filter(a => a.email) || [];

    await createChangeOrder.mutateAsync({
      title: data.title,
      description: data.description,
      amount: data.amount as unknown as number,
      reason: data.reason,
      projectName: project?.name,
      adminEmails,
    });
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Change Order</DialogTitle>
          <DialogDescription>
            Submit a new change order request
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Enter change order title"
              {...form.register("title")}
            />
            {form.formState.errors.title && (
              <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount ($) *</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              {...form.register("amount")}
            />
            {form.formState.errors.amount && (
              <p className="text-sm text-destructive">{form.formState.errors.amount.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the change..."
              rows={3}
              {...form.register("description")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason</Label>
            <Textarea
              id="reason"
              placeholder="Reason for the change..."
              rows={2}
              {...form.register("reason")}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createChangeOrder.isPending}>
              {createChangeOrder.isPending ? "Creating..." : "Create Change Order"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
