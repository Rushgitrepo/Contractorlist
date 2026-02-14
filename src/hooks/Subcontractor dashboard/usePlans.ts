import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/Subcontractor dashboard/contexts/AuthContext";
import { toast } from "sonner";

export const PLAN_DISCIPLINES = [
  { value: "general", label: "General" },
  { value: "architectural", label: "Architectural" },
  { value: "structural", label: "Structural" },
  { value: "mechanical", label: "Mechanical" },
  { value: "electrical", label: "Electrical" },
  { value: "plumbing", label: "Plumbing" },
  { value: "civil", label: "Civil" },
  { value: "landscape", label: "Landscape" },
] as const;

export type PlanDiscipline = typeof PLAN_DISCIPLINES[number]["value"];

export const PIN_TYPES = [
  { value: "general", label: "General", color: "#6b7280" },
  { value: "issue", label: "Issue", color: "#ef4444" },
  { value: "question", label: "Question", color: "#f59e0b" },
  { value: "task", label: "Task", color: "#3b82f6" },
  { value: "inspection", label: "Inspection", color: "#10b981" },
  { value: "photo", label: "Photo", color: "#8b5cf6" },
] as const;

export type PinType = typeof PIN_TYPES[number]["value"];

export const PIN_STATUSES = [
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
] as const;

export type PinStatus = typeof PIN_STATUSES[number]["value"];

export interface Plan {
  id: string;
  project_id: string;
  name: string;
  description: string | null;
  file_path: string;
  file_name: string;
  file_size: number | null;
  sheet_number: string | null;
  discipline: string | null;
  version: number | null;
  is_current: boolean | null;
  uploaded_by: string;
  created_at: string;
  updated_at: string;
  uploaded_by_profile?: {
    id: string;
    full_name: string | null;
    email: string;
  };
}

export interface PlanPin {
  id: string;
  plan_id: string;
  project_id: string;
  x_position: number;
  y_position: number;
  pin_type: string | null;
  title: string;
  description: string | null;
  status: string | null;
  rfi_id: string | null;
  created_by: string;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
  created_by_profile?: {
    id: string;
    full_name: string | null;
    email: string;
  };
  assigned_to_profile?: {
    id: string;
    full_name: string | null;
    email: string;
  } | null;
  // Computed fields for badges
  has_rfi?: boolean;
  photo_count?: number;
}

export function useProjectPlans(projectId: string | undefined) {
  return useQuery({
    queryKey: ["project-plans", projectId],
    queryFn: async () => {
      if (!projectId) return [];

      const { data, error } = await supabase
        .from("plans")
        .select(`
          *,
          uploaded_by_profile:profiles!plans_uploaded_by_fkey(id, full_name, email)
        `)
        .eq("project_id", projectId)
        .eq("is_current", true)
        .order("discipline", { ascending: true })
        .order("sheet_number", { ascending: true });

      if (error) throw error;
      return data as Plan[];
    },
    enabled: !!projectId,
  });
}

export function usePlanPins(planId: string | undefined) {
  return useQuery({
    queryKey: ["plan-pins", planId],
    queryFn: async () => {
      if (!planId) return [];

      // Fetch pins with profiles
      const { data: pins, error } = await supabase
        .from("plan_pins")
        .select(`
          *,
          created_by_profile:profiles!plan_pins_created_by_fkey(id, full_name, email),
          assigned_to_profile:profiles!plan_pins_assigned_to_fkey(id, full_name, email)
        `)
        .eq("plan_id", planId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch attachment counts for all pins in this plan
      const pinIds = pins.map(p => p.id);
      const { data: attachments } = await supabase
        .from("attachments")
        .select("pin_id")
        .in("pin_id", pinIds);

      // Count photos per pin
      const photoCounts: Record<string, number> = {};
      attachments?.forEach(a => {
        if (a.pin_id) {
          photoCounts[a.pin_id] = (photoCounts[a.pin_id] || 0) + 1;
        }
      });

      // Enrich pins with badge data
      const enrichedPins: PlanPin[] = pins.map(pin => ({
        ...pin,
        has_rfi: !!pin.rfi_id,
        photo_count: photoCounts[pin.id] || 0,
      }));

      return enrichedPins;
    },
    enabled: !!planId,
  });
}

export function useUploadPlan(projectId: string) {
  const queryClient = useQueryClient();
  const { profile } = useAuth();

  return useMutation({
    mutationFn: async ({
      file,
      name,
      description,
      sheetNumber,
      discipline,
    }: {
      file: File;
      name: string;
      description?: string;
      sheetNumber?: string;
      discipline: PlanDiscipline;
    }) => {
      if (!profile?.id) throw new Error("User not authenticated");

      const fileExt = file.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${projectId}/plans/${fileName}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from("project-attachments")
        .upload(filePath, file);

      if (uploadError) {
        console.error("Storage upload error:", uploadError);
        throw new Error("Failed to upload plan");
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("project-attachments")
        .getPublicUrl(filePath);

      // Create plan record
      const { data, error } = await supabase
        .from("plans")
        .insert({
          project_id: projectId,
          name,
          description: description || null,
          file_path: urlData.publicUrl,
          file_name: file.name,
          file_size: file.size,
          sheet_number: sheetNumber || null,
          discipline,
          uploaded_by: profile.id,
        })
        .select()
        .single();

      if (error) {
        // Clean up uploaded file if database insert fails
        await supabase.storage.from("project-attachments").remove([filePath]);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-plans", projectId] });
      toast.success("Plan uploaded successfully");
    },
    onError: (error) => {
      console.error("Error uploading plan:", error);
      toast.error("Failed to upload plan");
    },
  });
}

export function useDeletePlan(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (planId: string) => {
      // Get the plan to find the file path
      const { data: plan, error: fetchError } = await supabase
        .from("plans")
        .select("file_path")
        .eq("id", planId)
        .single();

      if (fetchError) throw fetchError;

      // Extract the storage path from the full URL
      const url = new URL(plan.file_path);
      const pathParts = url.pathname.split("/storage/v1/object/public/project-attachments/");
      const storagePath = pathParts[1];

      if (storagePath) {
        await supabase.storage.from("project-attachments").remove([storagePath]);
      }

      // Delete the database record (cascade will delete pins)
      const { error } = await supabase
        .from("plans")
        .delete()
        .eq("id", planId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-plans", projectId] });
      toast.success("Plan deleted");
    },
    onError: (error) => {
      console.error("Error deleting plan:", error);
      toast.error("Failed to delete plan");
    },
  });
}

export function useCreatePin(planId: string, projectId: string) {
  const queryClient = useQueryClient();
  const { profile } = useAuth();

  return useMutation({
    mutationFn: async ({
      xPosition,
      yPosition,
      pinType,
      title,
      description,
      assignedTo,
    }: {
      xPosition: number;
      yPosition: number;
      pinType: PinType;
      title: string;
      description?: string;
      assignedTo?: string;
    }) => {
      if (!profile?.id) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("plan_pins")
        .insert({
          plan_id: planId,
          project_id: projectId,
          x_position: xPosition,
          y_position: yPosition,
          pin_type: pinType,
          title,
          description: description || null,
          created_by: profile.id,
          assigned_to: assignedTo || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plan-pins", planId] });
      toast.success("Pin added");
    },
    onError: (error) => {
      console.error("Error creating pin:", error);
      toast.error("Failed to add pin");
    },
  });
}

export function useUpdatePin(planId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      pinId,
      updates,
    }: {
      pinId: string;
      updates: {
        title?: string;
        description?: string | null;
        pin_type?: PinType;
        status?: PinStatus;
        assigned_to?: string | null;
        rfi_id?: string | null;
      };
    }) => {
      const { error } = await supabase
        .from("plan_pins")
        .update(updates)
        .eq("id", pinId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plan-pins", planId] });
      toast.success("Pin updated");
    },
    onError: (error) => {
      console.error("Error updating pin:", error);
      toast.error("Failed to update pin");
    },
  });
}

export function useBulkUpdatePins(planId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      pinIds,
      status,
    }: {
      pinIds: string[];
      status: PinStatus;
    }) => {
      const { error } = await supabase
        .from("plan_pins")
        .update({ status })
        .in("id", pinIds);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["plan-pins", planId] });
      toast.success(`Updated ${variables.pinIds.length} pins`);
    },
    onError: (error) => {
      console.error("Error bulk updating pins:", error);
      toast.error("Failed to update pins");
    },
  });
}

export function useDeletePin(planId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pinId: string) => {
      const { error } = await supabase
        .from("plan_pins")
        .delete()
        .eq("id", pinId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plan-pins", planId] });
      toast.success("Pin deleted");
    },
    onError: (error) => {
      console.error("Error deleting pin:", error);
      toast.error("Failed to delete pin");
    },
  });
}
