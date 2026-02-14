import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useProjects } from "@/hooks/Subcontractor dashboard/useProjects";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Subcontractor dashboard/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Subcontractor dashboard/ui/select";
import {
  Calendar,
  Sun,
  Cloud,
  CloudRain,
  CloudLightning,
  Snowflake,
  Wind,
  Users,
  Clock,
  ClipboardList,
} from "lucide-react";
import { format, startOfWeek, endOfWeek, subDays } from "date-fns";
import { Link } from "react-router-dom";
import type { Database } from "@/integrations/supabase/types";

type WeatherCondition = Database["public"]["Enums"]["weather_condition"];

const weatherIcons: Record<WeatherCondition, typeof Sun> = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
  stormy: CloudLightning,
  snowy: Snowflake,
  windy: Wind,
};

export default function DailyLogsPage() {
  const { data: projects } = useProjects();
  const [selectedProjectId, setSelectedProjectId] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("7days");

  const { data: logs, isLoading } = useQuery({
    queryKey: ["all-daily-logs", selectedProjectId, dateRange],
    queryFn: async () => {
      let query = supabase
        .from("daily_logs")
        .select(`
          *,
          project:projects(id, name),
          author:profiles!daily_logs_author_id_fkey(full_name, email)
        `)
        .order("log_date", { ascending: false });

      if (selectedProjectId !== "all") {
        query = query.eq("project_id", selectedProjectId);
      }

      // Apply date filter
      const today = new Date();
      let startDate: Date;
      switch (dateRange) {
        case "7days":
          startDate = subDays(today, 7);
          break;
        case "30days":
          startDate = subDays(today, 30);
          break;
        case "thisweek":
          startDate = startOfWeek(today, { weekStartsOn: 1 });
          break;
        default:
          startDate = subDays(today, 7);
      }
      query = query.gte("log_date", format(startDate, "yyyy-MM-dd"));

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const summary = logs?.reduce(
    (acc, log) => {
      acc.totalLogs++;
      acc.totalWorkers += log.workers_onsite || 0;
      acc.totalManHours += Number(log.man_hours) || 0;
      return acc;
    },
    { totalLogs: 0, totalWorkers: 0, totalManHours: 0 }
  ) || { totalLogs: 0, totalWorkers: 0, totalManHours: 0 };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Daily Field Logs</h1>
          <p className="text-muted-foreground">View daily logs across all projects</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="thisweek">This Week</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="All Projects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
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
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
            <ClipboardList className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalLogs}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Workers</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalWorkers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Man Hours</CardTitle>
            <Clock className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalManHours.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Logs List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Logs</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : logs?.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Calendar className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p>No daily logs found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {logs?.map((log: any) => {
                const WeatherIcon = log.weather ? weatherIcons[log.weather as WeatherCondition] : Cloud;
                return (
                  <div key={log.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-4">
                        <div className="text-center min-w-[50px]">
                          <p className="text-2xl font-bold text-foreground">
                            {format(new Date(log.log_date), "d")}
                          </p>
                          <p className="text-xs text-muted-foreground uppercase">
                            {format(new Date(log.log_date), "MMM")}
                          </p>
                        </div>
                        <div className="h-10 w-px bg-border" />
                        <div>
                          <Link
                            to={`/subcontractor-dashboard/projects/${log.project_id}?tab=daily-logs`}
                            className="font-medium text-primary hover:underline"
                          >
                            {log.project?.name}
                          </Link>
                          {log.weather && (
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                              <WeatherIcon className="w-4 h-4" />
                              <span className="capitalize">{log.weather}</span>
                              {(log.temperature_high || log.temperature_low) && (
                                <span>
                                  {log.temperature_high && `${log.temperature_high}°`}
                                  {log.temperature_high && log.temperature_low && "/"}
                                  {log.temperature_low && `${log.temperature_low}°`}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {log.workers_onsite > 0 && (
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {log.workers_onsite}
                          </span>
                        )}
                        {log.man_hours > 0 && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {log.man_hours}h
                          </span>
                        )}
                      </div>
                    </div>

                    {log.work_performed && (
                      <div className="mb-2">
                        <p className="text-xs font-medium text-muted-foreground uppercase mb-1">Work Performed</p>
                        <p className="text-sm">{log.work_performed}</p>
                      </div>
                    )}

                    {log.delays && (
                      <div className="mb-2">
                        <p className="text-xs font-medium text-amber-600 uppercase mb-1">Delays</p>
                        <p className="text-sm text-amber-600">{log.delays}</p>
                      </div>
                    )}

                    <div className="mt-3 pt-2 border-t text-xs text-muted-foreground">
                      By {log.author?.full_name || "Unknown"}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
