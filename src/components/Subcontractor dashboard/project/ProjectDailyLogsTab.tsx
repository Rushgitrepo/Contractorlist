import { useState } from "react";
import { useProjectDailyLogs, useCreateDailyLog } from "@/hooks/Subcontractor dashboard/useProjectDetail";
import { Button } from "@/components/Subcontractor dashboard/ui/button";
import { Input } from "@/components/Subcontractor dashboard/ui/input";
import { Label } from "@/components/Subcontractor dashboard/ui/label";
import { Textarea } from "@/components/Subcontractor dashboard/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/Subcontractor dashboard/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Subcontractor dashboard/ui/select";
import { Plus, Loader2, Calendar, Sun, Cloud, CloudRain, CloudLightning, Snowflake, Wind, Users, Clock } from "lucide-react";
import { format } from "date-fns";
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

interface ProjectDailyLogsTabProps {
  projectId: string;
}

export default function ProjectDailyLogsTab({ projectId }: ProjectDailyLogsTabProps) {
  const { data: logs, isLoading } = useProjectDailyLogs(projectId);
  const createLog = useCreateDailyLog(projectId);

  const [open, setOpen] = useState(false);
  const [logDate, setLogDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [weather, setWeather] = useState<WeatherCondition | "">("");
  const [tempHigh, setTempHigh] = useState("");
  const [tempLow, setTempLow] = useState("");
  const [manHours, setManHours] = useState("");
  const [workersOnsite, setWorkersOnsite] = useState("");
  const [workPerformed, setWorkPerformed] = useState("");
  const [delays, setDelays] = useState("");
  const [notes, setNotes] = useState("");

  const resetForm = () => {
    setLogDate(format(new Date(), "yyyy-MM-dd"));
    setWeather("");
    setTempHigh("");
    setTempLow("");
    setManHours("");
    setWorkersOnsite("");
    setWorkPerformed("");
    setDelays("");
    setNotes("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createLog.mutateAsync({
      log_date: logDate,
      weather: weather || undefined,
      temperature_high: tempHigh ? parseInt(tempHigh) : undefined,
      temperature_low: tempLow ? parseInt(tempLow) : undefined,
      man_hours: manHours ? parseFloat(manHours) : undefined,
      workers_onsite: workersOnsite ? parseInt(workersOnsite) : undefined,
      work_performed: workPerformed || undefined,
      delays: delays || undefined,
      notes: notes || undefined,
    });
    resetForm();
    setOpen(false);
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
        <h3 className="text-lg font-semibold">Daily Logs ({logs?.length || 0})</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-1" />
              New Log
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Create Daily Log</DialogTitle>
                <DialogDescription>
                  Record the day's activities and conditions
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="logDate">Date *</Label>
                    <Input
                      id="logDate"
                      type="date"
                      value={logDate}
                      onChange={(e) => setLogDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="weather">Weather</Label>
                    <Select value={weather} onValueChange={(v) => setWeather(v as WeatherCondition)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select weather" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sunny">☀️ Sunny</SelectItem>
                        <SelectItem value="cloudy">☁️ Cloudy</SelectItem>
                        <SelectItem value="rainy">🌧️ Rainy</SelectItem>
                        <SelectItem value="stormy">⛈️ Stormy</SelectItem>
                        <SelectItem value="snowy">❄️ Snowy</SelectItem>
                        <SelectItem value="windy">💨 Windy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="tempHigh">High Temp (°F)</Label>
                    <Input
                      id="tempHigh"
                      type="number"
                      value={tempHigh}
                      onChange={(e) => setTempHigh(e.target.value)}
                      placeholder="85"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="tempLow">Low Temp (°F)</Label>
                    <Input
                      id="tempLow"
                      type="number"
                      value={tempLow}
                      onChange={(e) => setTempLow(e.target.value)}
                      placeholder="65"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="manHours">Man Hours</Label>
                    <Input
                      id="manHours"
                      type="number"
                      step="0.5"
                      value={manHours}
                      onChange={(e) => setManHours(e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="workersOnsite">Workers Onsite</Label>
                    <Input
                      id="workersOnsite"
                      type="number"
                      value={workersOnsite}
                      onChange={(e) => setWorkersOnsite(e.target.value)}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="workPerformed">Work Performed</Label>
                  <Textarea
                    id="workPerformed"
                    value={workPerformed}
                    onChange={(e) => setWorkPerformed(e.target.value)}
                    placeholder="Describe work completed today..."
                    rows={2}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="delays">Delays / Issues</Label>
                  <Textarea
                    id="delays"
                    value={delays}
                    onChange={(e) => setDelays(e.target.value)}
                    placeholder="Any delays or issues encountered..."
                    rows={2}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Other observations..."
                    rows={2}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createLog.isPending || !logDate}>
                  {createLog.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Log"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {logs?.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Calendar className="w-10 h-10 mx-auto mb-3 opacity-50" />
          <p>No daily logs yet</p>
          <p className="text-sm">Create a daily log to track site activity</p>
        </div>
      ) : (
        <div className="space-y-3">
          {logs?.map((log: any) => {
            const WeatherIcon = log.weather ? weatherIcons[log.weather as WeatherCondition] : Cloud;
            return (
              <div key={log.id} className="stat-card p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-foreground">
                        {format(new Date(log.log_date), "d")}
                      </p>
                      <p className="text-xs text-muted-foreground uppercase">
                        {format(new Date(log.log_date), "MMM yyyy")}
                      </p>
                    </div>
                    <div className="h-10 w-px bg-border" />
                    <div>
                      {log.weather && (
                        <div className="flex items-center gap-1.5 text-sm">
                          <WeatherIcon className="w-4 h-4 text-muted-foreground" />
                          <span className="capitalize">{log.weather}</span>
                          {(log.temperature_high || log.temperature_low) && (
                            <span className="text-muted-foreground">
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
                    <p className="text-xs font-medium text-warning uppercase mb-1">Delays</p>
                    <p className="text-sm text-warning">{log.delays}</p>
                  </div>
                )}

                {log.notes && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase mb-1">Notes</p>
                    <p className="text-sm text-muted-foreground">{log.notes}</p>
                  </div>
                )}

                <div className="mt-3 pt-2 border-t border-border text-xs text-muted-foreground">
                  By {log.author?.full_name || "Unknown"}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
