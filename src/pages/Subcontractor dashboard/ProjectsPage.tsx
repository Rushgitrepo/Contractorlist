import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { MapPin, Users, AlertCircle, ArrowRight, Search, Filter, Grid, List, Loader2, FolderOpen } from "lucide-react";
import { useState } from "react";
import { useProjects } from "@/hooks/Subcontractor dashboard/useProjects";
import CreateProjectDialog from "@/components/Subcontractor dashboard/CreateProjectDialog";
import type { Database } from "@/integrations/supabase/types";

type ProjectStatus = Database["public"]["Enums"]["project_status"];

const statusStyles: Record<ProjectStatus, { bg: string; text: string }> = {
  "in-progress": { bg: "bg-info/20", text: "text-info" },
  planning: { bg: "bg-warning/20", text: "text-warning" },
  "on-hold": { bg: "bg-destructive/20", text: "text-destructive" },
  completed: { bg: "bg-primary/20", text: "text-primary-foreground" },
};

const statusLabels: Record<ProjectStatus, string> = {
  "in-progress": "Active",
  planning: "Planning",
  "on-hold": "On Hold",
  completed: "Completed",
};

export default function ProjectsPage() {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const { data: projects, isLoading, error } = useProjects();

  const filteredProjects = (projects || []).filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.location?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  if (error) {
    return (
      <div className="p-6">
        <div className="stat-card p-8 text-center">
          <p className="text-destructive">Failed to load projects. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isLoading ? "Loading..." : `${projects?.length || 0} projects in portfolio`}
          </p>
        </div>
        <CreateProjectDialog />
      </div>

      {/* Filters Bar */}
      <div className="stat-card p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-muted/50 border border-border rounded-md placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-border rounded-md text-foreground hover:bg-muted transition-colors">
              <Filter className="w-4 h-4" />
              Filters
            </button>
            <div className="flex items-center border border-border rounded-md overflow-hidden">
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-2 transition-colors",
                  viewMode === "list" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-2 transition-colors",
                  viewMode === "grid" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="stat-card p-12 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredProjects.length === 0 && (
        <div className="stat-card p-12 text-center">
          <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {searchQuery ? "No projects found" : "No projects yet"}
          </h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery
              ? "Try adjusting your search terms"
              : "Get started by creating your first project"}
          </p>
          {!searchQuery && <CreateProjectDialog />}
        </div>
      )}

      {/* Projects Grid/List */}
      {!isLoading && filteredProjects.length > 0 && (
        <>
          {viewMode === "list" ? (
            <div className="stat-card overflow-hidden">
              <table className="procore-table">
                <thead>
                  <tr>
                    <th>Project</th>
                    <th>Status</th>
                    <th>Location</th>
                    <th>Budget</th>
                    <th>Progress</th>
                    <th>Team</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.map((project) => (
                    <tr key={project.id}>
                      <td>
                        <div>
                          <p className="font-medium text-foreground">{project.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {project.id.slice(0, 8)}
                          </p>
                        </div>
                      </td>
                      <td>
                        <span className={cn(
                          "text-[10px] font-semibold px-2 py-1 rounded uppercase",
                          statusStyles[project.status].bg,
                          statusStyles[project.status].text
                        )}>
                          {statusLabels[project.status]}
                        </span>
                      </td>
                      <td className="text-muted-foreground">
                        {project.location || "—"}
                      </td>
                      <td className="font-medium">
                        {Number(project.budget_total) > 0
                          ? `$${(Number(project.budget_total) / 1e6).toFixed(1)}M`
                          : "—"}
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full rounded-full bg-primary"
                              style={{ width: `${project.percent_complete}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium w-8">
                            {project.percent_complete}%
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Users className="w-4 h-4" />
                          <span className="text-sm">
                            {project.project_members?.length || 1}
                          </span>
                        </div>
                      </td>
                      <td>
                        <Link
                          to={`/subcontractor-dashboard/projects/${project.id}`}
                          className="p-2 rounded-md hover:bg-muted transition-colors inline-flex"
                        >
                          <ArrowRight className="w-4 h-4 text-muted-foreground" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProjects.map((project) => (
                <Link
                  key={project.id}
                  to={`/subcontractor-dashboard/projects/${project.id}`}
                  className="stat-card p-5 hover:shadow-lg transition-shadow group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className={cn(
                      "text-[10px] font-semibold px-2 py-1 rounded uppercase",
                      statusStyles[project.status].bg,
                      statusStyles[project.status].text
                    )}>
                      {statusLabels[project.status]}
                    </span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>

                  <h3 className="text-base font-semibold text-foreground mb-1">
                    {project.name}
                  </h3>
                  {project.location && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mb-4">
                      <MapPin className="w-3.5 h-3.5" /> {project.location}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-sm mb-3">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-semibold">{project.percent_complete}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden mb-4">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${project.percent_complete}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" /> {project.project_members?.length || 1} members
                    </span>
                    {Number(project.budget_total) > 0 && (
                      <span>${(Number(project.budget_total) / 1e6).toFixed(1)}M</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
