import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/Subcontractor dashboard/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/Subcontractor dashboard/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Subcontractor dashboard/ui/select";
import { Textarea } from "@/components/Subcontractor dashboard/ui/textarea";
import { Button } from "@/components/Subcontractor dashboard/ui/button";
import { Badge } from "@/components/Subcontractor dashboard/ui/badge";
import { Separator } from "@/components/Subcontractor dashboard/ui/separator";
import { Loader2, FileQuestion, Clock, CheckCircle, XCircle, User, Calendar } from "lucide-react";
import { useUpdateRFI } from "@/hooks/Subcontractor dashboard/useRFIMutations";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import FileAttachments from "./FileAttachments";
import type { Database } from "@/integrations/supabase/types";

type RFIStatus = Database["public"]["Enums"]["rfi_status"];

const statusStyles: Record<RFIStatus, { bg: string; text: string; icon: React.ElementType }> = {
  draft: { bg: "bg-muted", text: "text-muted-foreground", icon: FileQuestion },
  open: { bg: "bg-warning/10", text: "text-warning", icon: Clock },
  answered: { bg: "bg-info/10", text: "text-info", icon: CheckCircle },
  closed: { bg: "bg-success/10", text: "text-success", icon: XCircle },
};

const statusOptions: { value: RFIStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "open", label: "Open" },
  { value: "answered", label: "Answered" },
  { value: "closed", label: "Closed" },
];

const responseSchema = z.object({
  status: z.enum(["draft", "open", "answered", "closed"] as const),
  response: z.string().optional(),
});

type ResponseFormValues = z.infer<typeof responseSchema>;

interface RFI {
  id: string;
  rfi_number: number;
  title: string;
  description: string | null;
  status: RFIStatus;
  response: string | null;
  due_date: string | null;
  created_at: string;
  responded_at: string | null;
  created_by_profile?: { full_name: string | null; email: string } | null;
  assigned_to_profile?: { full_name: string | null; email: string } | null;
  responded_by_profile?: { full_name: string | null; email: string } | null;
}

interface RFIDetailDialogProps {
  rfi: RFI | null;
  projectId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function RFIDetailDialog({ rfi, projectId, open, onOpenChange }: RFIDetailDialogProps) {
  const updateRFI = useUpdateRFI(projectId);

  const form = useForm<ResponseFormValues>({
    resolver: zodResolver(responseSchema),
    values: {
      status: rfi?.status || "open",
      response: rfi?.response || "",
    },
  });

  if (!rfi) return null;

  const StatusIcon = statusStyles[rfi.status]?.icon || FileQuestion;

  const onSubmit = async (values: ResponseFormValues) => {
    await updateRFI.mutateAsync({
      rfiId: rfi.id,
      status: values.status,
      response: values.response,
    });
    onOpenChange(false);
  };

  const hasChanges = 
    form.watch("status") !== rfi.status || 
    (form.watch("response") || "") !== (rfi.response || "");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground font-mono mb-1">
                RFI-{rfi.rfi_number}
              </p>
              <DialogTitle className="text-xl">{rfi.title}</DialogTitle>
            </div>
            <Badge
              variant="secondary"
              className={cn(
                "gap-1 shrink-0",
                statusStyles[rfi.status]?.bg,
                statusStyles[rfi.status]?.text
              )}
            >
              <StatusIcon className="w-3 h-3" />
              {rfi.status.toUpperCase()}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Metadata */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Created By</p>
              <div className="flex items-center gap-1">
                <User className="w-3 h-3 text-muted-foreground" />
                <span>{rfi.created_by_profile?.full_name || "Unknown"}</span>
              </div>
            </div>
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Assigned To</p>
              <div className="flex items-center gap-1">
                <User className="w-3 h-3 text-muted-foreground" />
                <span>{rfi.assigned_to_profile?.full_name || "Unassigned"}</span>
              </div>
            </div>
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Due Date</p>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-muted-foreground" />
                <span>{rfi.due_date ? format(new Date(rfi.due_date), "MMM d, yyyy") : "—"}</span>
              </div>
            </div>
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Created</p>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-muted-foreground" />
                <span>{format(new Date(rfi.created_at), "MMM d, yyyy")}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Question */}
          <div>
            <p className="text-muted-foreground text-xs uppercase tracking-wider mb-2">Question</p>
            <div className="bg-muted/50 rounded-md p-3">
              <p className="text-sm whitespace-pre-wrap">
                {rfi.description || "No description provided."}
              </p>
            </div>
          </div>

          <Separator />

          {/* Attachments */}
          <FileAttachments projectId={projectId} rfiId={rfi.id} />

          <Separator />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="response"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Response</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter your response to this RFI..."
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {rfi.responded_at && rfi.responded_by_profile && (
                <p className="text-xs text-muted-foreground">
                  Last responded by {rfi.responded_by_profile.full_name || rfi.responded_by_profile.email} on{" "}
                  {format(new Date(rfi.responded_at), "MMM d, yyyy 'at' h:mm a")}
                </p>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={updateRFI.isPending || !hasChanges}>
                  {updateRFI.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
