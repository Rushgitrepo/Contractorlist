import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/Subcontractor dashboard/ui/card";
import { Badge } from "@/components/Subcontractor dashboard/ui/badge";
import { Button } from "@/components/Subcontractor dashboard/ui/button";
import { Input } from "@/components/Subcontractor dashboard/ui/input";
import { Label } from "@/components/Subcontractor dashboard/ui/label";
import { Textarea } from "@/components/Subcontractor dashboard/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Subcontractor dashboard/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/Subcontractor dashboard/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/Subcontractor dashboard/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/Subcontractor dashboard/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Subcontractor dashboard/ui/select";
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  Search,
  Users,
  Wrench,
  Package,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FolderKanban,
} from "lucide-react";
import {
  useResources,
  useCreateResource,
  useUpdateResource,
  useDeleteResource,
  useResourceAllocations,
  useResourceSummary,
  Resource,
} from "@/hooks/Subcontractor dashboard/useResources";
import { useProjects } from "@/hooks/Subcontractor dashboard/useProjects";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

type ResourceType = "labor" | "equipment" | "material";
type ResourceStatus = "available" | "assigned" | "unavailable" | "maintenance";

const typeConfig: Record<ResourceType, { label: string; icon: React.ReactNode; className: string }> = {
  labor: {
    label: "Labor",
    icon: <Users className="w-4 h-4" />,
    className: "bg-blue-500/10 text-blue-600 border-blue-500/30",
  },
  equipment: {
    label: "Equipment",
    icon: <Wrench className="w-4 h-4" />,
    className: "bg-amber-500/10 text-amber-600 border-amber-500/30",
  },
  material: {
    label: "Material",
    icon: <Package className="w-4 h-4" />,
    className: "bg-green-500/10 text-green-600 border-green-500/30",
  },
};

const statusConfig: Record<ResourceStatus, { label: string; icon: React.ReactNode; className: string }> = {
  available: {
    label: "Available",
    icon: <CheckCircle2 className="w-3 h-3" />,
    className: "bg-success/10 text-success border-success/30",
  },
  assigned: {
    label: "Assigned",
    icon: <Clock className="w-3 h-3" />,
    className: "bg-primary/10 text-primary border-primary/30",
  },
  unavailable: {
    label: "Unavailable",
    icon: <AlertTriangle className="w-3 h-3" />,
    className: "bg-muted text-muted-foreground border-muted",
  },
  maintenance: {
    label: "Maintenance",
    icon: <Wrench className="w-3 h-3" />,
    className: "bg-warning/10 text-warning border-warning/30",
  },
};

export default function ResourceManagementPage() {
  const { data: resources = [], isLoading: resourcesLoading } = useResources();
  const { data: allocations = [], isLoading: allocationsLoading } = useResourceAllocations();
  const { data: summary } = useResourceSummary();
  const { data: projects = [] } = useProjects();

  const createResource = useCreateResource();
  const updateResource = useUpdateResource();
  const deleteResource = useDeleteResource();

  const [activeTab, setActiveTab] = useState("resources");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [resourceToDelete, setResourceToDelete] = useState<Resource | null>(null);

  // Form state
  const [formName, setFormName] = useState("");
  const [formType, setFormType] = useState<ResourceType>("labor");
  const [formDescription, setFormDescription] = useState("");
  const [formUnit, setFormUnit] = useState("");
  const [formHourlyRate, setFormHourlyRate] = useState("");
  const [formDailyRate, setFormDailyRate] = useState("");
  const [formStatus, setFormStatus] = useState<ResourceStatus>("available");

  // Filter resources
  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const matchesSearch =
        searchQuery === "" ||
        resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = typeFilter === "all" || resource.resource_type === typeFilter;
      const matchesStatus = statusFilter === "all" || resource.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [resources, searchQuery, typeFilter, statusFilter]);

  const openCreateDialog = () => {
    setEditingResource(null);
    setFormName("");
    setFormType("labor");
    setFormDescription("");
    setFormUnit("");
    setFormHourlyRate("");
    setFormDailyRate("");
    setFormStatus("available");
    setIsDialogOpen(true);
  };

  const openEditDialog = (resource: Resource) => {
    setEditingResource(resource);
    setFormName(resource.name);
    setFormType(resource.resource_type);
    setFormDescription(resource.description || "");
    setFormUnit(resource.unit || "");
    setFormHourlyRate(resource.hourly_rate?.toString() || "");
    setFormDailyRate(resource.daily_rate?.toString() || "");
    setFormStatus(resource.status);
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (resource: Resource) => {
    setResourceToDelete(resource);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingResource) {
      await updateResource.mutateAsync({
        id: editingResource.id,
        name: formName,
        resource_type: formType,
        description: formDescription || null,
        unit: formUnit || null,
        hourly_rate: parseFloat(formHourlyRate) || 0,
        daily_rate: parseFloat(formDailyRate) || 0,
        status: formStatus,
      });
    } else {
      await createResource.mutateAsync({
        name: formName,
        resource_type: formType,
        description: formDescription || undefined,
        unit: formUnit || undefined,
        hourly_rate: parseFloat(formHourlyRate) || undefined,
        daily_rate: parseFloat(formDailyRate) || undefined,
        status: formStatus,
      });
    }

    setIsDialogOpen(false);
  };

  const handleDelete = async () => {
    if (!resourceToDelete) return;
    await deleteResource.mutateAsync(resourceToDelete.id);
    setIsDeleteDialogOpen(false);
    setResourceToDelete(null);
  };

  const isLoading = resourcesLoading || allocationsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Wrench className="w-6 h-6" />
            Resource Management
          </h1>
          <p className="text-muted-foreground">
            Track and allocate labor, equipment, and materials across projects
          </p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="w-4 h-4 mr-2" />
          Add Resource
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{summary?.total || 0}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-success">{summary?.available || 0}</p>
              <p className="text-xs text-muted-foreground">Available</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{summary?.assigned || 0}</p>
              <p className="text-xs text-muted-foreground">Assigned</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-warning">{summary?.maintenance || 0}</p>
              <p className="text-xs text-muted-foreground">Maintenance</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              <div className="text-center">
                <p className="text-xl font-bold">{summary?.byType.labor || 0}</p>
                <p className="text-xs text-muted-foreground">Labor</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center gap-2">
              <Wrench className="w-4 h-4 text-amber-500" />
              <div className="text-center">
                <p className="text-xl font-bold">{summary?.byType.equipment || 0}</p>
                <p className="text-xs text-muted-foreground">Equipment</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center gap-2">
              <Package className="w-4 h-4 text-green-500" />
              <div className="text-center">
                <p className="text-xl font-bold">{summary?.byType.material || 0}</p>
                <p className="text-xs text-muted-foreground">Material</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="resources">All Resources</TabsTrigger>
          <TabsTrigger value="allocations">
            Active Allocations
            {(summary?.activeAllocations || 0) > 0 && (
              <Badge variant="secondary" className="ml-2">
                {summary?.activeAllocations}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="resources" className="mt-4 space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="labor">Labor</SelectItem>
                <SelectItem value="equipment">Equipment</SelectItem>
                <SelectItem value="material">Material</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="unavailable">Unavailable</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Resources Table */}
          <Card>
            {filteredResources.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Wrench className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No resources found</p>
                <p className="text-sm">
                  {resources.length === 0
                    ? "Add your first resource to get started."
                    : "Try adjusting your filters."}
                </p>
                {resources.length === 0 && (
                  <Button onClick={openCreateDialog} className="mt-4">
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Resource
                  </Button>
                )}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Hourly Rate</TableHead>
                    <TableHead>Daily Rate</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResources.map((resource) => {
                    const typeInfo = typeConfig[resource.resource_type];
                    const statusInfo = statusConfig[resource.status];

                    return (
                      <TableRow key={resource.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{resource.name}</p>
                            {resource.description && (
                              <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                                {resource.description}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn("gap-1", typeInfo.className)}>
                            {typeInfo.icon}
                            {typeInfo.label}
                          </Badge>
                        </TableCell>
                        <TableCell>{resource.unit || "—"}</TableCell>
                        <TableCell>
                          {resource.hourly_rate
                            ? `$${Number(resource.hourly_rate).toFixed(2)}/hr`
                            : "—"}
                        </TableCell>
                        <TableCell>
                          {resource.daily_rate
                            ? `$${Number(resource.daily_rate).toFixed(2)}/day`
                            : "—"}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn("gap-1", statusInfo.className)}>
                            {statusInfo.icon}
                            {statusInfo.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(resource)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openDeleteDialog(resource)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="allocations" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Active Allocations</CardTitle>
              <CardDescription>
                Resources currently assigned to projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              {allocations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FolderKanban className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No active allocations</p>
                  <p className="text-sm">
                    Allocate resources to projects from the project's resource tab.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Resource</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Quantity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allocations.map((allocation) => {
                      const resource = allocation.resource;
                      const typeInfo = resource ? typeConfig[resource.resource_type] : null;

                      return (
                        <TableRow key={allocation.id}>
                          <TableCell className="font-medium">
                            {resource?.name || "Unknown"}
                          </TableCell>
                          <TableCell>
                            {typeInfo && (
                              <Badge variant="outline" className={cn("gap-1", typeInfo.className)}>
                                {typeInfo.icon}
                                {typeInfo.label}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <Link
                              to={`/subcontractor-dashboard/projects/${allocation.project_id}`}
                              className="text-primary hover:underline flex items-center gap-1"
                            >
                              <FolderKanban className="w-3 h-3" />
                              {allocation.project?.name || "Unknown"}
                            </Link>
                          </TableCell>
                          <TableCell>
                            {format(new Date(allocation.start_date), "MMM d, yyyy")}
                          </TableCell>
                          <TableCell>
                            {allocation.end_date
                              ? format(new Date(allocation.end_date), "MMM d, yyyy")
                              : "Ongoing"}
                          </TableCell>
                          <TableCell>{allocation.quantity}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingResource ? "Edit Resource" : "Add Resource"}
            </DialogTitle>
            <DialogDescription>
              {editingResource
                ? "Update the resource details below."
                : "Add a new resource to your pool."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g., Excavator, Electrician Crew"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type *</Label>
                <Select value={formType} onValueChange={(v) => setFormType(v as ResourceType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="labor">Labor</SelectItem>
                    <SelectItem value="equipment">Equipment</SelectItem>
                    <SelectItem value="material">Material</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formStatus} onValueChange={(v) => setFormStatus(v as ResourceStatus)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="assigned">Assigned</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="unavailable">Unavailable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Input
                id="unit"
                value={formUnit}
                onChange={(e) => setFormUnit(e.target.value)}
                placeholder="e.g., hours, days, cubic yards"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  step="0.01"
                  value={formHourlyRate}
                  onChange={(e) => setFormHourlyRate(e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dailyRate">Daily Rate ($)</Label>
                <Input
                  id="dailyRate"
                  type="number"
                  step="0.01"
                  value={formDailyRate}
                  onChange={(e) => setFormDailyRate(e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Optional notes about this resource..."
                rows={2}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createResource.isPending || updateResource.isPending}
              >
                {(createResource.isPending || updateResource.isPending) && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                {editingResource ? "Save Changes" : "Add Resource"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Resource</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-medium">{resourceToDelete?.name}</span>? This
              will also remove all allocations for this resource.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteResource.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
