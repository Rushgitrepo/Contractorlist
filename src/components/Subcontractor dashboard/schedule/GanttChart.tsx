import { useMemo } from "react";
import { format, differenceInDays, addDays, startOfWeek, endOfWeek, eachWeekOfInterval, isWithinInterval } from "date-fns";
import { cn } from "@/lib/utils";
import type { Milestone } from "@/hooks/Subcontractor dashboard/useMilestones";

interface GanttChartProps {
  milestones: Milestone[];
  onMilestoneClick?: (milestone: Milestone) => void;
}

export default function GanttChart({ milestones, onMilestoneClick }: GanttChartProps) {
  const { startDate, endDate, weeks, totalDays } = useMemo(() => {
    if (milestones.length === 0) {
      const today = new Date();
      const start = startOfWeek(today);
      const end = endOfWeek(addDays(today, 28));
      return {
        startDate: start,
        endDate: end,
        weeks: eachWeekOfInterval({ start, end }),
        totalDays: differenceInDays(end, start) + 1,
      };
    }

    const dates = milestones.flatMap((m) => [new Date(m.start_date), new Date(m.end_date)]);
    const minDate = new Date(Math.min(...dates.map((d) => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())));
    
    // Add padding
    const start = startOfWeek(addDays(minDate, -7));
    const end = endOfWeek(addDays(maxDate, 7));
    
    return {
      startDate: start,
      endDate: end,
      weeks: eachWeekOfInterval({ start, end }),
      totalDays: differenceInDays(end, start) + 1,
    };
  }, [milestones]);

  const getBarPosition = (milestone: Milestone) => {
    const start = new Date(milestone.start_date);
    const end = new Date(milestone.end_date);
    
    const startOffset = differenceInDays(start, startDate);
    const duration = differenceInDays(end, start) + 1;
    
    const leftPercent = (startOffset / totalDays) * 100;
    const widthPercent = (duration / totalDays) * 100;
    
    return { left: `${leftPercent}%`, width: `${widthPercent}%` };
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const todayPosition = useMemo(() => {
    const today = new Date();
    if (today < startDate || today > endDate) return null;
    const offset = differenceInDays(today, startDate);
    return `${(offset / totalDays) * 100}%`;
  }, [startDate, endDate, totalDays]);

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px]">
        {/* Header with weeks */}
        <div className="flex border-b border-border">
          {/* Task name column */}
          <div className="w-64 shrink-0 p-3 bg-muted/50 font-medium text-sm border-r border-border">
            Task Name
          </div>
          
          {/* Timeline header */}
          <div className="flex-1 relative">
            <div className="flex">
              {weeks.map((week, i) => (
                <div
                  key={i}
                  className="flex-1 text-center p-2 text-xs text-muted-foreground border-r border-border last:border-r-0"
                  style={{ minWidth: `${100 / weeks.length}%` }}
                >
                  {format(week, "MMM d")}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Milestone rows */}
        {milestones.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <p>No milestones yet</p>
            <p className="text-sm">Add milestones to see them on the timeline</p>
          </div>
        ) : (
          milestones.map((milestone) => {
            const position = getBarPosition(milestone);
            
            return (
              <div
                key={milestone.id}
                className="flex border-b border-border hover:bg-muted/30 transition-colors cursor-pointer"
                onClick={() => onMilestoneClick?.(milestone)}
              >
                {/* Task name */}
                <div className="w-64 shrink-0 p-3 border-r border-border">
                  <p className="font-medium text-sm truncate">{milestone.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(milestone.start_date), "MMM d")} - {format(new Date(milestone.end_date), "MMM d")}
                  </p>
                </div>
                
                {/* Gantt bar area */}
                <div className="flex-1 relative h-16 py-2">
                  {/* Week grid lines */}
                  <div className="absolute inset-0 flex pointer-events-none">
                    {weeks.map((_, i) => (
                      <div
                        key={i}
                        className="flex-1 border-r border-border/50 last:border-r-0"
                      />
                    ))}
                  </div>
                  
                  {/* Today marker */}
                  {todayPosition && (
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-destructive z-10"
                      style={{ left: todayPosition }}
                    />
                  )}
                  
                  {/* Gantt bar */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 h-8 rounded-md shadow-sm flex items-center justify-between px-2 overflow-hidden group"
                    style={{
                      left: position.left,
                      width: position.width,
                      backgroundColor: milestone.color || "#3b82f6",
                      minWidth: "24px",
                    }}
                  >
                    {/* Progress fill */}
                    <div
                      className="absolute inset-0 bg-black/20"
                      style={{ width: `${100 - milestone.progress}%`, right: 0, left: "auto" }}
                    />
                    
                    {/* Progress text */}
                    <span className="relative text-xs font-medium text-white truncate">
                      {milestone.progress}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
