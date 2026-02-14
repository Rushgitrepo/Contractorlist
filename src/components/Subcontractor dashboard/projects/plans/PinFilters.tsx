import { Button } from "@/components/Subcontractor dashboard/ui/button";
import { Input } from "@/components/Subcontractor dashboard/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Subcontractor dashboard/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/Subcontractor dashboard/ui/toggle-group";
import { Badge } from "@/components/Subcontractor dashboard/ui/badge";
import { Filter, X, Search, Download, Map, List, History, AlertTriangle, FileText, Loader2 } from "lucide-react";
import { PIN_TYPES, PIN_STATUSES, PinType, PinStatus, PlanPin } from "@/hooks/Subcontractor dashboard/usePlans";
import { format } from "date-fns";

export type ViewMode = "map" | "list";

export interface PinFiltersState {
  search: string;
  type: PinType | "all";
  status: PinStatus | "all";
  hasRfi: "all" | "yes" | "no";
  hasPhotos: "all" | "yes" | "no";
}

interface PinFiltersProps {
  filters: PinFiltersState;
  onFiltersChange: (filters: PinFiltersState) => void;
  pinCount: number;
  filteredCount: number;
  pins: PlanPin[];
  planName?: string;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  // Version-related props
  viewingVersionNumber?: number | null;
  isViewingOldVersion?: boolean;
  onExitVersionView?: () => void;
  onShowVersionHistory?: () => void;
  hasVersionHistory?: boolean;
  // PDF export props
  onExportPdf?: () => void;
  isExportingPdf?: boolean;
}

export const DEFAULT_FILTERS: PinFiltersState = {
  search: "",
  type: "all",
  status: "all",
  hasRfi: "all",
  hasPhotos: "all",
};

export default function PinFilters({
  filters,
  onFiltersChange,
  pinCount,
  filteredCount,
  pins,
  planName,
  viewMode,
  onViewModeChange,
  viewingVersionNumber,
  isViewingOldVersion,
  onExitVersionView,
  onShowVersionHistory,
  hasVersionHistory,
  onExportPdf,
  isExportingPdf,
}: PinFiltersProps) {
  const hasActiveFilters =
    filters.search !== "" ||
    filters.type !== "all" ||
    filters.status !== "all" ||
    filters.hasRfi !== "all" ||
    filters.hasPhotos !== "all";

  const clearFilters = () => {
    onFiltersChange(DEFAULT_FILTERS);
  };

  const exportToCSV = () => {
    if (pins.length === 0) return;

    // CSV headers
    const headers = [
      "Title",
      "Description",
      "Type",
      "Status",
      "Created By",
      "Assigned To",
      "Has RFI",
      "Photo Count",
      "X Position",
      "Y Position",
      "Created At",
    ];

    // Convert pins to CSV rows
    const rows = pins.map((pin) => {
      const pinType = PIN_TYPES.find((t) => t.value === pin.pin_type)?.label || pin.pin_type || "";
      const pinStatus = PIN_STATUSES.find((s) => s.value === pin.status)?.label || pin.status || "";
      const createdBy = pin.created_by_profile?.full_name || pin.created_by_profile?.email || "";
      const assignedTo = pin.assigned_to_profile?.full_name || pin.assigned_to_profile?.email || "";
      
      return [
        `"${(pin.title || "").replace(/"/g, '""')}"`,
        `"${(pin.description || "").replace(/"/g, '""')}"`,
        pinType,
        pinStatus,
        `"${createdBy}"`,
        `"${assignedTo}"`,
        pin.rfi_id ? "Yes" : "No",
        pin.photo_count || 0,
        pin.x_position.toFixed(2),
        pin.y_position.toFixed(2),
        format(new Date(pin.created_at), "yyyy-MM-dd HH:mm"),
      ];
    });

    // Combine headers and rows
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    // Create and download the file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `pins-${planName ? planName.replace(/[^a-z0-9]/gi, "-").toLowerCase() : "export"}-${format(new Date(), "yyyy-MM-dd")}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col border-b bg-muted/30">
      {/* Version viewing banner */}
      {isViewingOldVersion && (
        <div className="flex items-center justify-between px-3 py-2 bg-destructive/10 border-b border-destructive/20">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-destructive" />
            <span className="text-sm text-destructive">
              Viewing version {viewingVersionNumber} (read-only)
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={onExitVersionView}
          >
            Exit Version View
          </Button>
        </div>
      )}

      <div className="flex items-center gap-2 p-2">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <Input
          placeholder="Search pins..."
          value={filters.search}
          onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
          className="h-8 w-[140px] pl-7 text-xs bg-background"
        />
      </div>
      
      <div className="w-px h-5 bg-border" />

      <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
      
      <Select
        value={filters.type}
        onValueChange={(v) => onFiltersChange({ ...filters, type: v as PinType | "all" })}
      >
        <SelectTrigger className="h-8 w-[110px] text-xs bg-background">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent className="bg-background border shadow-lg z-50">
          <SelectItem value="all">All Types</SelectItem>
          {PIN_TYPES.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: type.color }}
                />
                {type.label}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.status}
        onValueChange={(v) => onFiltersChange({ ...filters, status: v as PinStatus | "all" })}
      >
        <SelectTrigger className="h-8 w-[110px] text-xs bg-background">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent className="bg-background border shadow-lg z-50">
          <SelectItem value="all">All Status</SelectItem>
          {PIN_STATUSES.map((status) => (
            <SelectItem key={status.value} value={status.value}>
              {status.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.hasRfi}
        onValueChange={(v) => onFiltersChange({ ...filters, hasRfi: v as "all" | "yes" | "no" })}
      >
        <SelectTrigger className="h-8 w-[90px] text-xs bg-background">
          <SelectValue placeholder="RFI" />
        </SelectTrigger>
        <SelectContent className="bg-background border shadow-lg z-50">
          <SelectItem value="all">Any RFI</SelectItem>
          <SelectItem value="yes">Has RFI</SelectItem>
          <SelectItem value="no">No RFI</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.hasPhotos}
        onValueChange={(v) => onFiltersChange({ ...filters, hasPhotos: v as "all" | "yes" | "no" })}
      >
        <SelectTrigger className="h-8 w-[100px] text-xs bg-background">
          <SelectValue placeholder="Photos" />
        </SelectTrigger>
        <SelectContent className="bg-background border shadow-lg z-50">
          <SelectItem value="all">Any Photos</SelectItem>
          <SelectItem value="yes">Has Photos</SelectItem>
          <SelectItem value="no">No Photos</SelectItem>
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-xs"
          onClick={clearFilters}
        >
          <X className="w-3 h-3 mr-1" />
          Clear
        </Button>
      )}

      <div className="ml-auto flex items-center gap-2">
        <span className="text-xs text-muted-foreground">
          {filteredCount === pinCount
            ? `${pinCount} pins`
            : `${filteredCount} of ${pinCount} pins`}
        </span>
        
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-2 text-xs"
          onClick={exportToCSV}
          disabled={pins.length === 0}
        >
          <Download className="w-3 h-3 mr-1" />
          CSV
        </Button>

        {onExportPdf && (
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-2 text-xs"
            onClick={onExportPdf}
            disabled={isExportingPdf}
          >
            {isExportingPdf ? (
              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
            ) : (
              <FileText className="w-3 h-3 mr-1" />
            )}
            PDF
          </Button>
        )}

        {hasVersionHistory && onShowVersionHistory && (
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-2 text-xs"
            onClick={onShowVersionHistory}
          >
            <History className="w-3 h-3 mr-1" />
            History
          </Button>
        )}

        <ToggleGroup
          type="single"
          value={viewMode}
          onValueChange={(value) => value && onViewModeChange(value as ViewMode)}
          className="border rounded-md"
        >
          <ToggleGroupItem value="map" aria-label="Map view" className="h-8 w-8 p-0">
            <Map className="w-4 h-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="List view" className="h-8 w-8 p-0">
            <List className="w-4 h-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      </div>
    </div>
  );
}
