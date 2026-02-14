import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type ResourceType = Database["public"]["Enums"]["resource_type"];
type ResourceStatus = Database["public"]["Enums"]["resource_status"];

export interface Resource {
  id: string;
  name: string;
  resource_type: ResourceType;
  description: string | null;
  unit: string | null;
  hourly_rate: number | null;
  daily_rate: number | null;
  status: ResourceStatus;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface ResourceAllocation {
  id: string;
  resource_id: string;
  project_id: string;
  allocated_by: string | null;
  start_date: string;
  end_date: string | null;
  quantity: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
  resource?: Resource;
  project?: { id: string; name: string };
}

export interface ResourceUsageLog {
  id: string;
  allocation_id: string;
  project_id: string;
  log_date: string;
  hours_used: number | null;
  quantity_used: number | null;
  cost: number | null;
  notes: string | null;
  logged_by: string | null;
  created_at: string;
  updated_at: string;
}

// ============ Resources ============

export function useResources() {
  return useQuery({
    queryKey: ["resources"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .order("name");

      if (error) throw error;
      return data as Resource[];
    },
  });
}

export function useCreateResource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      name: string;
      resource_type: ResourceType;
      description?: string;
      unit?: string;
      hourly_rate?: number;
      daily_rate?: number;
      status?: ResourceStatus;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", user.id)
        .single();

      const { data, error } = await supabase
        .from("resources")
        .insert({
          name: params.name,
          resource_type: params.resource_type,
          description: params.description || null,
          unit: params.unit || null,
          hourly_rate: params.hourly_rate || 0,
          daily_rate: params.daily_rate || 0,
          status: params.status || "available",
          created_by: profile?.id || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data as Resource;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
      toast.success("Resource created");
    },
    onError: (error: Error) => {
      toast.error(`Failed to create resource: ${error.message}`);
    },
  });
}

export function useUpdateResource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      id: string;
      name?: string;
      resource_type?: ResourceType;
      description?: string | null;
      unit?: string | null;
      hourly_rate?: number;
      daily_rate?: number;
      status?: ResourceStatus;
    }) => {
      const { id, ...updates } = params;
      const { data, error } = await supabase
        .from("resources")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Resource;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
      toast.success("Resource updated");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update resource: ${error.message}`);
    },
  });
}

export function useDeleteResource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("resources")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
      toast.success("Resource deleted");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete resource: ${error.message}`);
    },
  });
}

// ============ Resource Allocations ============

export function useResourceAllocations(projectId?: string) {
  return useQuery({
    queryKey: ["resource-allocations", projectId],
    queryFn: async () => {
      let query = supabase
        .from("resource_allocations")
        .select(`
          *,
          resource:resources(*),
          project:projects(id, name)
        `)
        .order("start_date", { ascending: false });

      if (projectId) {
        query = query.eq("project_id", projectId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as ResourceAllocation[];
    },
    enabled: projectId ? !!projectId : true,
  });
}

export function useCreateResourceAllocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      resource_id: string;
      project_id: string;
      start_date: string;
      end_date?: string;
      quantity?: number;
      notes?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", user.id)
        .single();

      const { data, error } = await supabase
        .from("resource_allocations")
        .insert({
          resource_id: params.resource_id,
          project_id: params.project_id,
          start_date: params.start_date,
          end_date: params.end_date || null,
          quantity: params.quantity || 1,
          notes: params.notes || null,
          allocated_by: profile?.id || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["resource-allocations"] });
      queryClient.invalidateQueries({ queryKey: ["resource-allocations", variables.project_id] });
      toast.success("Resource allocated");
    },
    onError: (error: Error) => {
      toast.error(`Failed to allocate resource: ${error.message}`);
    },
  });
}

export function useDeleteResourceAllocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { id: string; projectId: string }) => {
      const { error } = await supabase
        .from("resource_allocations")
        .delete()
        .eq("id", params.id);

      if (error) throw error;
      return params;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["resource-allocations"] });
      queryClient.invalidateQueries({ queryKey: ["resource-allocations", data.projectId] });
      toast.success("Allocation removed");
    },
    onError: (error: Error) => {
      toast.error(`Failed to remove allocation: ${error.message}`);
    },
  });
}

// ============ Resource Summary ============

export function useResourceSummary() {
  return useQuery({
    queryKey: ["resource-summary"],
    queryFn: async () => {
      const { data: resources, error: resourcesError } = await supabase
        .from("resources")
        .select("*");

      if (resourcesError) throw resourcesError;

      const { data: allocations, error: allocationsError } = await supabase
        .from("resource_allocations")
        .select("*, resource:resources(resource_type)")
        .gte("end_date", new Date().toISOString().split("T")[0])
        .or("end_date.is.null");

      if (allocationsError) throw allocationsError;

      const total = resources?.length || 0;
      const available = resources?.filter(r => r.status === "available").length || 0;
      const assigned = resources?.filter(r => r.status === "assigned").length || 0;
      const maintenance = resources?.filter(r => r.status === "maintenance").length || 0;

      const byType = {
        labor: resources?.filter(r => r.resource_type === "labor").length || 0,
        equipment: resources?.filter(r => r.resource_type === "equipment").length || 0,
        material: resources?.filter(r => r.resource_type === "material").length || 0,
      };

      const activeAllocations = allocations?.length || 0;

      return {
        total,
        available,
        assigned,
        maintenance,
        byType,
        activeAllocations,
      };
    },
  });
}
