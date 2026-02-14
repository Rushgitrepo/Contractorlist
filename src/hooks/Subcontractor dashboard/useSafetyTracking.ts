import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/Subcontractor dashboard/contexts/AuthContext";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type IncidentSeverity = Database["public"]["Enums"]["incident_severity"];
type IncidentStatus = Database["public"]["Enums"]["incident_status"];
type ObservationType = Database["public"]["Enums"]["safety_observation_type"];

export interface SafetyIncident {
  id: string;
  project_id: string;
  incident_number: number;
  incident_date: string;
  incident_time: string | null;
  location: string | null;
  severity: IncidentSeverity;
  status: IncidentStatus;
  title: string;
  description: string | null;
  immediate_actions: string | null;
  injured_party_name: string | null;
  injured_party_company: string | null;
  witness_names: string | null;
  is_osha_recordable: boolean;
  osha_case_number: string | null;
  days_away_from_work: number;
  days_restricted_duty: number;
  root_cause: string | null;
  corrective_actions: string | null;
  preventive_measures: string | null;
  reported_by: string;
  investigated_by: string | null;
  closed_by: string | null;
  closed_at: string | null;
  created_at: string;
  updated_at: string;
  reporter?: {
    full_name: string | null;
    email: string;
  };
}

export interface SafetyObservation {
  id: string;
  project_id: string;
  observation_type: ObservationType;
  observation_date: string;
  location: string | null;
  title: string;
  description: string | null;
  is_corrected: boolean;
  corrected_by: string | null;
  corrected_at: string | null;
  correction_notes: string | null;
  attendee_count: number | null;
  topic: string | null;
  photo_path: string | null;
  reported_by: string;
  created_at: string;
  updated_at: string;
  reporter?: {
    full_name: string | null;
    email: string;
  };
}

export const SEVERITY_LABELS: Record<IncidentSeverity, string> = {
  near_miss: "Near Miss",
  first_aid: "First Aid",
  medical_treatment: "Medical Treatment",
  lost_time: "Lost Time",
  fatality: "Fatality",
};

export const SEVERITY_COLORS: Record<IncidentSeverity, string> = {
  near_miss: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  first_aid: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  medical_treatment: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  lost_time: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  fatality: "bg-red-200 text-red-900 dark:bg-red-900/50 dark:text-red-300",
};

export const STATUS_LABELS: Record<IncidentStatus, string> = {
  reported: "Reported",
  investigating: "Investigating",
  corrective_action: "Corrective Action",
  closed: "Closed",
};

export const OBSERVATION_TYPE_LABELS: Record<ObservationType, string> = {
  hazard: "Hazard",
  unsafe_act: "Unsafe Act",
  unsafe_condition: "Unsafe Condition",
  positive: "Positive Observation",
  toolbox_talk: "Toolbox Talk",
};

// ============ Safety Incidents ============

export function useSafetyIncidents(projectId?: string) {
  return useQuery({
    queryKey: ["safety-incidents", projectId],
    queryFn: async () => {
      let query = supabase
        .from("safety_incidents")
        .select(`
          *,
          reporter:profiles!safety_incidents_reported_by_fkey(full_name, email)
        `)
        .order("incident_date", { ascending: false });

      if (projectId) {
        query = query.eq("project_id", projectId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as SafetyIncident[];
    },
    enabled: projectId ? !!projectId : true,
  });
}

export function useCreateSafetyIncident() {
  const queryClient = useQueryClient();
  const { profile } = useAuth();

  return useMutation({
    mutationFn: async (params: {
      project_id: string;
      incident_date: string;
      severity: IncidentSeverity;
      title: string;
      description?: string;
      location?: string;
      incident_time?: string;
      injured_party_name?: string;
      injured_party_company?: string;
      immediate_actions?: string;
    }) => {
      if (!profile?.id) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("safety_incidents")
        .insert({
          project_id: params.project_id,
          incident_date: params.incident_date,
          severity: params.severity,
          title: params.title,
          description: params.description || null,
          location: params.location || null,
          incident_time: params.incident_time || null,
          injured_party_name: params.injured_party_name || null,
          injured_party_company: params.injured_party_company || null,
          immediate_actions: params.immediate_actions || null,
          reported_by: profile.id,
          status: "reported",
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["safety-incidents"] });
      queryClient.invalidateQueries({ queryKey: ["safety-incidents", variables.project_id] });
      queryClient.invalidateQueries({ queryKey: ["safety-summary"] });
      toast.success("Incident reported");
    },
    onError: (error: Error) => {
      toast.error(`Failed to report incident: ${error.message}`);
    },
  });
}

export function useUpdateSafetyIncident() {
  const queryClient = useQueryClient();
  const { profile } = useAuth();

  return useMutation({
    mutationFn: async (params: {
      id: string;
      project_id: string;
      status?: IncidentStatus;
      root_cause?: string;
      corrective_actions?: string;
      preventive_measures?: string;
      is_osha_recordable?: boolean;
      osha_case_number?: string;
      days_away_from_work?: number;
      days_restricted_duty?: number;
    }) => {
      const { id, project_id, ...updates } = params;

      // If closing, set closed_by and closed_at
      if (updates.status === "closed" && profile?.id) {
        (updates as any).closed_by = profile.id;
        (updates as any).closed_at = new Date().toISOString();
      }

      // If investigating, set investigated_by
      if (updates.status === "investigating" && profile?.id) {
        (updates as any).investigated_by = profile.id;
      }

      const { data, error } = await supabase
        .from("safety_incidents")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return { ...data, project_id };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["safety-incidents"] });
      queryClient.invalidateQueries({ queryKey: ["safety-incidents", data.project_id] });
      queryClient.invalidateQueries({ queryKey: ["safety-summary"] });
      toast.success("Incident updated");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update incident: ${error.message}`);
    },
  });
}

// ============ Safety Observations ============

export function useSafetyObservations(projectId?: string) {
  return useQuery({
    queryKey: ["safety-observations", projectId],
    queryFn: async () => {
      let query = supabase
        .from("safety_observations")
        .select(`
          *,
          reporter:profiles!safety_observations_reported_by_fkey(full_name, email)
        `)
        .order("observation_date", { ascending: false });

      if (projectId) {
        query = query.eq("project_id", projectId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as SafetyObservation[];
    },
    enabled: projectId ? !!projectId : true,
  });
}

export function useCreateSafetyObservation() {
  const queryClient = useQueryClient();
  const { profile } = useAuth();

  return useMutation({
    mutationFn: async (params: {
      project_id: string;
      observation_type: ObservationType;
      observation_date: string;
      title: string;
      description?: string;
      location?: string;
      attendee_count?: number;
      topic?: string;
    }) => {
      if (!profile?.id) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("safety_observations")
        .insert({
          project_id: params.project_id,
          observation_type: params.observation_type,
          observation_date: params.observation_date,
          title: params.title,
          description: params.description || null,
          location: params.location || null,
          attendee_count: params.attendee_count || null,
          topic: params.topic || null,
          reported_by: profile.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["safety-observations"] });
      queryClient.invalidateQueries({ queryKey: ["safety-observations", variables.project_id] });
      queryClient.invalidateQueries({ queryKey: ["safety-summary"] });
      toast.success("Observation recorded");
    },
    onError: (error: Error) => {
      toast.error(`Failed to record observation: ${error.message}`);
    },
  });
}

export function useMarkObservationCorrected() {
  const queryClient = useQueryClient();
  const { profile } = useAuth();

  return useMutation({
    mutationFn: async (params: { id: string; projectId: string; correction_notes?: string }) => {
      if (!profile?.id) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("safety_observations")
        .update({
          is_corrected: true,
          corrected_by: profile.id,
          corrected_at: new Date().toISOString(),
          correction_notes: params.correction_notes || null,
        })
        .eq("id", params.id)
        .select()
        .single();

      if (error) throw error;
      return { ...data, projectId: params.projectId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["safety-observations"] });
      queryClient.invalidateQueries({ queryKey: ["safety-observations", data.projectId] });
      toast.success("Marked as corrected");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update: ${error.message}`);
    },
  });
}

// ============ Summary ============

export function useSafetySummary(projectId?: string) {
  return useQuery({
    queryKey: ["safety-summary", projectId],
    queryFn: async () => {
      // Fetch incidents
      let incidentQuery = supabase.from("safety_incidents").select("severity, status, is_osha_recordable");
      if (projectId) incidentQuery = incidentQuery.eq("project_id", projectId);
      const { data: incidents } = await incidentQuery;

      // Fetch observations
      let obsQuery = supabase.from("safety_observations").select("observation_type, is_corrected");
      if (projectId) obsQuery = obsQuery.eq("project_id", projectId);
      const { data: observations } = await obsQuery;

      const totalIncidents = incidents?.length || 0;
      const openIncidents = incidents?.filter((i) => i.status !== "closed").length || 0;
      const oshaRecordable = incidents?.filter((i) => i.is_osha_recordable).length || 0;
      const nearMisses = incidents?.filter((i) => i.severity === "near_miss").length || 0;

      const totalObservations = observations?.length || 0;
      const hazards = observations?.filter((o) => o.observation_type === "hazard" || o.observation_type === "unsafe_condition").length || 0;
      const uncorrectedHazards = observations?.filter((o) => (o.observation_type === "hazard" || o.observation_type === "unsafe_condition") && !o.is_corrected).length || 0;
      const toolboxTalks = observations?.filter((o) => o.observation_type === "toolbox_talk").length || 0;

      return {
        totalIncidents,
        openIncidents,
        oshaRecordable,
        nearMisses,
        totalObservations,
        hazards,
        uncorrectedHazards,
        toolboxTalks,
      };
    },
  });
}
