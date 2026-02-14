import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useProjects } from "@/hooks/Subcontractor dashboard/useProjects";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Subcontractor dashboard/ui/card";
import { Badge } from "@/components/Subcontractor dashboard/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Subcontractor dashboard/ui/select";
import {
  Camera,
  MapPin,
  Image,
  Calendar,
  User,
  ExternalLink,
} from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";

const pinTypeColors: Record<string, string> = {
  general: "bg-blue-500",
  issue: "bg-red-500",
  photo: "bg-green-500",
  rfi: "bg-amber-500",
  safety: "bg-orange-500",
};

export default function PhotosPage() {
  const { data: projects } = useProjects();
  const [selectedProjectId, setSelectedProjectId] = useState<string>("all");

  // Get all pins with their attachments (photos)
  const { data: pinsWithPhotos, isLoading } = useQuery({
    queryKey: ["all-plan-pins-with-photos", selectedProjectId],
    queryFn: async () => {
      let query = supabase
        .from("plan_pins")
        .select(`
          *,
          project:projects(id, name),
          plan:plans(id, name, sheet_number),
          created_by_profile:profiles!plan_pins_created_by_fkey(full_name),
          attachments(id, file_name, file_path, file_type, created_at)
        `)
        .order("created_at", { ascending: false });

      if (selectedProjectId !== "all") {
        query = query.eq("project_id", selectedProjectId);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Filter to only pins that have photo attachments
      // Ensure attachments is an array before calling .some()
      return data?.filter((pin: any) => {
        const attachments = Array.isArray(pin.attachments) ? pin.attachments : [];
        return attachments.some((att: any) => att.file_type?.startsWith("image/"));
      }) || [];
    },
  });

  // Get all standalone photo attachments
  const { data: allPhotos } = useQuery({
    queryKey: ["all-photo-attachments", selectedProjectId],
    queryFn: async () => {
      let query = supabase
        .from("attachments")
        .select(`
          *,
          project:projects(id, name),
          pin:plan_pins(id, title, plan:plans(name, sheet_number))
        `)
        .like("file_type", "image/%")
        .order("created_at", { ascending: false })
        .limit(100);

      if (selectedProjectId !== "all") {
        query = query.eq("project_id", selectedProjectId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const summary = {
    totalPins: pinsWithPhotos?.length || 0,
    totalPhotos: allPhotos?.length || 0,
    projectsWithPhotos: new Set(allPhotos?.map((p: any) => p.project_id)).size,
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Plan-Pinned Photos</h1>
          <p className="text-muted-foreground">View photos attached to plan pins across all projects</p>
        </div>
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

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pins with Photos</CardTitle>
            <MapPin className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalPins}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Photos</CardTitle>
            <Image className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalPhotos}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Projects</CardTitle>
            <Camera className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.projectsWithPhotos}</div>
          </CardContent>
        </Card>
      </div>

      {/* Photos Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Photos</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : allPhotos?.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Camera className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p>No photos found</p>
              <p className="text-sm">Upload photos to plan pins to see them here</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {allPhotos?.map((photo: any) => (
                <div key={photo.id} className="group relative border rounded-lg overflow-hidden hover:ring-2 hover:ring-primary transition-all">
                  <div className="aspect-square bg-muted flex items-center justify-center">
                    {photo.file_path ? (
                      <img
                        src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/project-attachments/${photo.file_path}`}
                        alt={photo.file_name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <Image className="w-12 h-12 text-muted-foreground" />
                    )}
                  </div>
                  <div className="p-3 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{photo.file_name}</p>
                        <Link
                          to={`/subcontractor-dashboard/projects/${photo.project_id}`}
                          className="text-xs text-primary hover:underline"
                        >
                          {photo.project?.name}
                        </Link>
                      </div>
                      {photo.pin && (
                        <Badge variant="outline" className="text-[10px] shrink-0">
                          <MapPin className="w-2.5 h-2.5 mr-1" />
                          Pin
                        </Badge>
                      )}
                    </div>
                    {photo.pin && (
                      <p className="text-xs text-muted-foreground truncate">
                        {photo.pin.title} • {photo.pin.plan?.name}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(photo.created_at), "MMM d, yyyy")}
                    </div>
                  </div>
                  <Link
                    to={`/subcontractor-dashboard/projects/${photo.project_id}?tab=plans`}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 p-1.5 rounded-md hover:bg-background"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
