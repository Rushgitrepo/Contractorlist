import { useState } from "react";
import { useProjects } from "@/hooks/Subcontractor dashboard/useProjects";
import {
  useSafetyIncidents,
  useSafetyObservations,
  useSafetySummary,
  useCreateSafetyIncident,
  useCreateSafetyObservation,
  useUpdateSafetyIncident,
  useMarkObservationCorrected,
  SEVERITY_LABELS,
  SEVERITY_COLORS,
  STATUS_LABELS,
  OBSERVATION_TYPE_LABELS,
  SafetyIncident,
  SafetyObservation,
} from "@/hooks/Subcontractor dashboard/useSafetyTracking";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Subcontractor dashboard/ui/card";
import { Button } from "@/components/Subcontractor dashboard/ui/button";
import { Badge } from "@/components/Subcontractor dashboard/ui/badge";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/Subcontractor dashboard/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/Subcontractor dashboard/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/Subcontractor dashboard/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Subcontractor dashboard/ui/tabs";
import { ScrollArea } from "@/components/Subcontractor dashboard/ui/scroll-area";
import {
  AlertTriangle,
  Plus,
  MoreHorizontal,
  ShieldAlert,
  ShieldCheck,
  ClipboardList,
  HardHat,
  Check,
  Building2,
  Loader2,
  Eye,
  Search,
} from "lucide-react";
import { format } from "date-fns";
import type { Database } from "@/integrations/supabase/types";

type IncidentSeverity = Database["public"]["Enums"]["incident_severity"];
type ObservationType = Database["public"]["Enums"]["safety_observation_type"];

const STATUS_COLORS: Record<string, string> = {
  reported: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  investigating: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  corrective_action: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  closed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
};

export default function SafetyTrackingPage() {
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [incidentDialogOpen, setIncidentDialogOpen] = useState(false);
  const [observationDialogOpen, setObservationDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("incidents");

  const { data: incidents = [], isLoading: incidentsLoading } = useSafetyIncidents(selectedProjectId || undefined);
  const { data: observations = [], isLoading: observationsLoading } = useSafetyObservations(selectedProjectId || undefined);
  const { data: summary } = useSafetySummary(selectedProjectId || undefined);

  const createIncident = useCreateSafetyIncident();
  const createObservation = useCreateSafetyObservation();
  const updateIncident = useUpdateSafetyIncident();
  const markCorrected = useMarkObservationCorrected();

  // Incident form
  const [incidentForm, setIncidentForm] = useState({
    title: "",
    severity: "near_miss" as IncidentSeverity,
    incident_date: new Date().toISOString().split("T")[0],
    location: "",
    description: "",
    injured_party_name: "",
    immediate_actions: "",
  });

  // Observation form
  const [observationForm, setObservationForm] = useState({
    title: "",
    observation_type: "hazard" as ObservationType,
    observation_date: new Date().toISOString().split("T")[0],
    location: "",
    description: "",
    attendee_count: "",
    topic: "",
  });

  const handleCreateIncident = () => {
    if (!selectedProjectId || !incidentForm.title) return;

    createIncident.mutate(
      {
        project_id: selectedProjectId,
        ...incidentForm,
      },
      {
        onSuccess: () => {
          setIncidentDialogOpen(false);
          setIncidentForm({
            title: "",
            severity: "near_miss",
            incident_date: new Date().toISOString().split("T")[0],
            location: "",
            description: "",
            injured_party_name: "",
            immediate_actions: "",
          });
        },
      }
    );
  };

  const handleCreateObservation = () => {
    if (!selectedProjectId || !observationForm.title) return;

    createObservation.mutate(
      {
        project_id: selectedProjectId,
        ...observationForm,
        attendee_count: observationForm.attendee_count ? parseInt(observationForm.attendee_count) : undefined,
      },
      {
        onSuccess: () => {
          setObservationDialogOpen(false);
          setObservationForm({
            title: "",
            observation_type: "hazard",
            observation_date: new Date().toISOString().split("T")[0],
            location: "",
            description: "",
            attendee_count: "",
            topic: "",
          });
        },
      }
    );
  };

  const handleStatusChange = (incident: SafetyIncident, newStatus: string) => {
    updateIncident.mutate({
      id: incident.id,
      project_id: incident.project_id,
      status: newStatus as any,
    });
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Safety & Incident Tracking</h1>
          <p className="text-muted-foreground">OSHA compliance, incidents, and safety observations</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Select Project" />
            </SelectTrigger>
            <SelectContent>
              {projects?.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{summary?.openIncidents || 0}</p>
                <p className="text-sm text-muted-foreground">Open Incidents</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                <ShieldAlert className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{summary?.oshaRecordable || 0}</p>
                <p className="text-sm text-muted-foreground">OSHA Recordable</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
                <Eye className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{summary?.uncorrectedHazards || 0}</p>
                <p className="text-sm text-muted-foreground">Open Hazards</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                <HardHat className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{summary?.toolboxTalks || 0}</p>
                <p className="text-sm text-muted-foreground">Toolbox Talks</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="incidents">Incidents</TabsTrigger>
                <TabsTrigger value="observations">Observations</TabsTrigger>
              </TabsList>
              <div className="flex gap-2">
                <Dialog open={incidentDialogOpen} onOpenChange={setIncidentDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" disabled={!selectedProjectId}>
                      <Plus className="h-4 w-4 mr-2" />
                      Report Incident
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Report Safety Incident</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                      <div className="space-y-2">
                        <Label>Title *</Label>
                        <Input
                          placeholder="Brief description of incident"
                          value={incidentForm.title}
                          onChange={(e) => setIncidentForm({ ...incidentForm, title: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Severity *</Label>
                          <Select
                            value={incidentForm.severity}
                            onValueChange={(v) => setIncidentForm({ ...incidentForm, severity: v as IncidentSeverity })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(SEVERITY_LABELS).map(([value, label]) => (
                                <SelectItem key={value} value={value}>
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Date *</Label>
                          <Input
                            type="date"
                            value={incidentForm.incident_date}
                            onChange={(e) => setIncidentForm({ ...incidentForm, incident_date: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Location</Label>
                        <Input
                          placeholder="Where did it occur?"
                          value={incidentForm.location}
                          onChange={(e) => setIncidentForm({ ...incidentForm, location: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Injured Party Name</Label>
                        <Input
                          placeholder="Name of injured person (if any)"
                          value={incidentForm.injured_party_name}
                          onChange={(e) => setIncidentForm({ ...incidentForm, injured_party_name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          placeholder="Detailed description of the incident..."
                          value={incidentForm.description}
                          onChange={(e) => setIncidentForm({ ...incidentForm, description: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Immediate Actions Taken</Label>
                        <Textarea
                          placeholder="What actions were taken immediately?"
                          value={incidentForm.immediate_actions}
                          onChange={(e) => setIncidentForm({ ...incidentForm, immediate_actions: e.target.value })}
                        />
                      </div>
                      <Button
                        className="w-full"
                        onClick={handleCreateIncident}
                        disabled={createIncident.isPending || !incidentForm.title}
                      >
                        {createIncident.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        Report Incident
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={observationDialogOpen} onOpenChange={setObservationDialogOpen}>
                  <DialogTrigger asChild>
                    <Button disabled={!selectedProjectId}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Observation
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Record Safety Observation</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Title *</Label>
                        <Input
                          placeholder="Brief description"
                          value={observationForm.title}
                          onChange={(e) => setObservationForm({ ...observationForm, title: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Type *</Label>
                          <Select
                            value={observationForm.observation_type}
                            onValueChange={(v) => setObservationForm({ ...observationForm, observation_type: v as ObservationType })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(OBSERVATION_TYPE_LABELS).map(([value, label]) => (
                                <SelectItem key={value} value={value}>
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Date *</Label>
                          <Input
                            type="date"
                            value={observationForm.observation_date}
                            onChange={(e) => setObservationForm({ ...observationForm, observation_date: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Location</Label>
                        <Input
                          placeholder="Where was this observed?"
                          value={observationForm.location}
                          onChange={(e) => setObservationForm({ ...observationForm, location: e.target.value })}
                        />
                      </div>
                      {observationForm.observation_type === "toolbox_talk" && (
                        <>
                          <div className="space-y-2">
                            <Label>Topic</Label>
                            <Input
                              placeholder="Topic discussed"
                              value={observationForm.topic}
                              onChange={(e) => setObservationForm({ ...observationForm, topic: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Attendee Count</Label>
                            <Input
                              type="number"
                              placeholder="Number of attendees"
                              value={observationForm.attendee_count}
                              onChange={(e) => setObservationForm({ ...observationForm, attendee_count: e.target.value })}
                            />
                          </div>
                        </>
                      )}
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          placeholder="Details..."
                          value={observationForm.description}
                          onChange={(e) => setObservationForm({ ...observationForm, description: e.target.value })}
                        />
                      </div>
                      <Button
                        className="w-full"
                        onClick={handleCreateObservation}
                        disabled={createObservation.isPending || !observationForm.title}
                      >
                        {createObservation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        Record Observation
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </Tabs>
        </CardHeader>
        <CardContent>
          {incidentsLoading || observationsLoading || projectsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : !selectedProjectId ? (
            <div className="text-center py-12 text-muted-foreground">
              <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Select a project to view safety data</p>
            </div>
          ) : activeTab === "incidents" ? (
            incidents.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <ShieldCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No incidents reported</p>
              </div>
            ) : (
              <ScrollArea className="h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>OSHA</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {incidents.map((incident) => (
                      <TableRow key={incident.id}>
                        <TableCell className="font-mono text-sm">
                          #{incident.incident_number}
                        </TableCell>
                        <TableCell className="font-medium max-w-[200px] truncate">
                          {incident.title}
                        </TableCell>
                        <TableCell>
                          {format(new Date(incident.incident_date), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>
                          <Badge className={SEVERITY_COLORS[incident.severity]}>
                            {SEVERITY_LABELS[incident.severity]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={STATUS_COLORS[incident.status]}>
                            {STATUS_LABELS[incident.status]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {incident.is_osha_recordable ? (
                            <Badge variant="destructive">Yes</Badge>
                          ) : (
                            <span className="text-muted-foreground">No</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {incident.status === "reported" && (
                                <DropdownMenuItem onClick={() => handleStatusChange(incident, "investigating")}>
                                  Start Investigation
                                </DropdownMenuItem>
                              )}
                              {incident.status === "investigating" && (
                                <DropdownMenuItem onClick={() => handleStatusChange(incident, "corrective_action")}>
                                  Move to Corrective Action
                                </DropdownMenuItem>
                              )}
                              {incident.status === "corrective_action" && (
                                <DropdownMenuItem onClick={() => handleStatusChange(incident, "closed")}>
                                  Close Incident
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            )
          ) : observations.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <ClipboardList className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No observations recorded</p>
            </div>
          ) : (
            <ScrollArea className="h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {observations.map((obs) => (
                    <TableRow key={obs.id}>
                      <TableCell className="font-medium max-w-[200px] truncate">
                        {obs.title}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {OBSERVATION_TYPE_LABELS[obs.observation_type]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(obs.observation_date), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>{obs.location || "—"}</TableCell>
                      <TableCell>
                        {obs.observation_type === "toolbox_talk" ? (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            Completed
                          </Badge>
                        ) : obs.is_corrected ? (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            <Check className="h-3 w-3 mr-1" />
                            Corrected
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                            Open
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {!obs.is_corrected && obs.observation_type !== "toolbox_talk" && obs.observation_type !== "positive" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              markCorrected.mutate({ id: obs.id, projectId: obs.project_id })
                            }
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
