import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useProjects } from "@/hooks/Subcontractor dashboard/useProjects";
import { useMilestones, type Milestone } from "@/hooks/Subcontractor dashboard/useMilestones";
import GanttChart from "@/components/Subcontractor dashboard/schedule/GanttChart";
import AddMilestoneDialog from "@/components/Subcontractor dashboard/schedule/AddMilestoneDialog";
import MilestoneDetailDialog from "@/components/Subcontractor dashboard/schedule/MilestoneDetailDialog";
import { Loader2, CalendarDays, ChevronDown } from "lucide-react";
import { Button } from "@/components/Subcontractor dashboard/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Subcontractor dashboard/ui/select";

export default function SchedulePage() {
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  // Select first project by default when loaded
  const activeProjectId = selectedProjectId || projects?.[0]?.id;
  const { data: milestones, isLoading: milestonesLoading } = useMilestones(activeProjectId);

  const activeProject = projects?.find(p => p.id === activeProjectId);

  const handleMilestoneClick = (milestone: Milestone) => {
    setSelectedMilestone(milestone);
    setDetailOpen(true);
  };

  if (projectsLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="p-6 animate-fade-in">
        <div className="stat-card p-8 text-center">
          <CalendarDays className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
          <h2 className="text-lg font-semibold mb-2">No Projects</h2>
          <p className="text-muted-foreground mb-4">
            Create a project first to manage its schedule.
          </p>
          <Button asChild>
            <Link to="/subcontractor-dashboard/projects">Go to Projects</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Schedule</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage project milestones and timeline
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select
            value={activeProjectId || ""}
            onValueChange={setSelectedProjectId}
          >
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="Select project" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {activeProjectId && (
            <AddMilestoneDialog projectId={activeProjectId} />
          )}
        </div>
      </div>

      {/* Project Info */}
      {activeProject && (
        <div className="stat-card p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-lg">{activeProject.name}</h2>
              <p className="text-sm text-muted-foreground">
                {activeProject.location || "No location"} • {activeProject.percent_complete}% complete
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Milestones</p>
              <p className="text-2xl font-bold">{milestones?.length || 0}</p>
            </div>
          </div>
        </div>
      )}

      {/* Gantt Chart */}
      <div className="stat-card overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="font-semibold">Timeline</h3>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-sm bg-primary" />
              <span>In Progress</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-0.5 h-3 bg-destructive" />
              <span>Today</span>
            </div>
          </div>
        </div>

        {milestonesLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <GanttChart
            milestones={milestones || []}
            onMilestoneClick={handleMilestoneClick}
          />
        )}
      </div>

      {/* Milestones Table */}
      {milestones && milestones.length > 0 && (
        <div className="mt-6 stat-card overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">Milestone Details</h2>
          </div>
          <table className="procore-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Start</th>
                <th>End</th>
                <th>Duration</th>
                <th>Progress</th>
              </tr>
            </thead>
            <tbody>
              {milestones.map((milestone) => {
                const start = new Date(milestone.start_date);
                const end = new Date(milestone.end_date);
                const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                return (
                  <tr
                    key={milestone.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleMilestoneClick(milestone)}
                  >
                    <td>
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-sm shrink-0"
                          style={{ backgroundColor: milestone.color || "hsl(var(--primary))" }}
                        />
                        <span className="font-medium">{milestone.name}</span>
                      </div>
                    </td>
                    <td className="font-mono text-xs text-muted-foreground">
                      {milestone.start_date}
                    </td>
                    <td className="font-mono text-xs text-muted-foreground">
                      {milestone.end_date}
                    </td>
                    <td className="text-muted-foreground">{duration} days</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${milestone.progress}%`,
                              backgroundColor: milestone.color || "hsl(var(--primary))",
                            }}
                          />
                        </div>
                        <span className="text-xs font-medium">{milestone.progress}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Milestone Detail Dialog */}
      {activeProjectId && (
        <MilestoneDetailDialog
          milestone={selectedMilestone}
          projectId={activeProjectId}
          open={detailOpen}
          onOpenChange={setDetailOpen}
        />
      )}
    </div>
  );
}
