import { useState } from "react";
import { useMilestones, type Milestone } from "@/hooks/Subcontractor dashboard/useMilestones";
import GanttChart from "@/components/Subcontractor dashboard/schedule/GanttChart";
import AddMilestoneDialog from "@/components/Subcontractor dashboard/schedule/AddMilestoneDialog";
import MilestoneDetailDialog from "@/components/Subcontractor dashboard/schedule/MilestoneDetailDialog";
import { Loader2, CalendarDays } from "lucide-react";

interface ProjectScheduleTabProps {
  projectId: string;
}

export default function ProjectScheduleTab({ projectId }: ProjectScheduleTabProps) {
  const { data: milestones, isLoading } = useMilestones(projectId);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const handleMilestoneClick = (milestone: Milestone) => {
    setSelectedMilestone(milestone);
    setDetailOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Schedule ({milestones?.length || 0} milestones)</h3>
        <AddMilestoneDialog projectId={projectId} />
      </div>

      {/* Gantt Chart */}
      <div className="stat-card overflow-hidden mb-4">
        <div className="p-3 border-b border-border flex items-center justify-between">
          <span className="text-sm font-medium">Timeline</span>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <span className="w-0.5 h-3 bg-destructive" />
              <span>Today</span>
            </div>
          </div>
        </div>
        
        <GanttChart
          milestones={milestones || []}
          onMilestoneClick={handleMilestoneClick}
        />
      </div>

      {/* Milestones List */}
      {milestones && milestones.length > 0 && (
        <div className="stat-card overflow-hidden">
          <table className="procore-table">
            <thead>
              <tr>
                <th>Milestone</th>
                <th>Dates</th>
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
                          style={{ backgroundColor: milestone.color || "#3b82f6" }}
                        />
                        <div>
                          <p className="font-medium">{milestone.name}</p>
                          {milestone.description && (
                            <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                              {milestone.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="text-muted-foreground text-sm">
                      {milestone.start_date} → {milestone.end_date}
                    </td>
                    <td className="text-muted-foreground">{duration} days</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${milestone.progress}%`,
                              backgroundColor: milestone.color || "#3b82f6",
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

      <MilestoneDetailDialog
        milestone={selectedMilestone}
        projectId={projectId}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  );
}
