import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Input } from "@/components/Subcontractor dashboard/ui/input";
import { Button } from "@/components/Subcontractor dashboard/ui/button";
import { UserPlus, Loader2 } from "lucide-react";
import { useInviteTeamMember } from "@/hooks/Subcontractor dashboard/useTeamMembers";
import type { Database } from "@/integrations/supabase/types";

type ProjectRole = Database["public"]["Enums"]["project_role"];

const roleOptions: { value: ProjectRole; label: string }[] = [
  { value: "gc", label: "General Contractor" },
  { value: "superintendent", label: "Superintendent" },
  { value: "subcontractor", label: "Subcontractor" },
  { value: "architect", label: "Architect" },
  { value: "engineer", label: "Engineer" },
];

const formSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),
  role: z.enum(["owner", "gc", "superintendent", "subcontractor", "architect", "engineer"] as const, {
    required_error: "Please select a role",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface InviteTeamMemberDialogProps {
  projectId: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function InviteTeamMemberDialog({ projectId, open: controlledOpen, onOpenChange }: InviteTeamMemberDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = (value: boolean) => {
    if (onOpenChange) onOpenChange(value);
    if (!isControlled) setInternalOpen(value);
  };
  const inviteMutation = useInviteTeamMember(projectId);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      role: undefined,
    },
  });

  const onSubmit = async (values: FormValues) => {
    await inviteMutation.mutateAsync({
      email: values.email,
      role: values.role,
    });
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!isControlled && (
        <DialogTrigger asChild>
          <Button size="sm" className="gap-1.5">
            <UserPlus className="w-4 h-4" />
            Invite Member
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="colleague@company.com"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roleOptions.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={inviteMutation.isPending}>
                {inviteMutation.isPending && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Send Invite
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
