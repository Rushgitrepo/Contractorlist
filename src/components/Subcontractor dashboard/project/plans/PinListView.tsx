import { format } from "date-fns";
import { Badge } from "@/components/Subcontractor dashboard/ui/badge";
import { Button } from "@/components/Subcontractor dashboard/ui/button";
import { Checkbox } from "@/components/Subcontractor dashboard/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/Subcontractor dashboard/ui/table";
import { FileQuestion, Camera, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { PlanPin, PIN_TYPES, PIN_STATUSES } from "@/hooks/Subcontractor dashboard/usePlans";

interface PinListViewProps {
  pins: PlanPin[];
  onPinClick: (pin: PlanPin) => void;
  selectedPinId?: string;
  isSelectMode: boolean;
  selectedPinIds: Set<string>;
  onToggleSelect: (pinId: string) => void;
  searchQuery?: string;
}

export default function PinListView({
  pins,
  onPinClick,
  selectedPinId,
  isSelectMode,
  selectedPinIds,
  onToggleSelect,
  searchQuery = "",
}: PinListViewProps) {
  const getPinTypeInfo = (pinType: string | null) => {
    return PIN_TYPES.find((t) => t.value === pinType) || PIN_TYPES[0];
  };

  const getStatusInfo = (status: string | null) => {
    return PIN_STATUSES.find((s) => s.value === status) || PIN_STATUSES[0];
  };

  const getStatusVariant = (status: string | null): "default" | "secondary" | "outline" | "destructive" => {
    switch (status) {
      case "open":
        return "destructive";
      case "in_progress":
        return "default";
      case "resolved":
        return "secondary";
      case "closed":
        return "outline";
      default:
        return "secondary";
    }
  };

  const highlightMatch = (text: string) => {
    if (!searchQuery) return text;
    const regex = new RegExp(`(${searchQuery})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-primary/30 text-foreground rounded px-0.5">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  if (pins.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        No pins found
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto">
      <Table>
        <TableHeader className="sticky top-0 bg-background z-10">
          <TableRow>
            {isSelectMode && <TableHead className="w-10"></TableHead>}
            <TableHead className="w-[200px]">Title</TableHead>
            <TableHead className="w-[100px]">Type</TableHead>
            <TableHead className="w-[100px]">Status</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="w-[120px]">Created By</TableHead>
            <TableHead className="w-[120px]">Assigned To</TableHead>
            <TableHead className="w-[80px] text-center">Links</TableHead>
            <TableHead className="w-[100px]">Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pins.map((pin) => {
            const typeInfo = getPinTypeInfo(pin.pin_type);
            const statusInfo = getStatusInfo(pin.status);
            const hasRfi = pin.has_rfi || !!pin.rfi_id;
            const photoCount = pin.photo_count || 0;
            const isSelected = selectedPinIds.has(pin.id);

            return (
              <TableRow
                key={pin.id}
                className={cn(
                  "cursor-pointer hover:bg-muted/50 transition-colors",
                  selectedPinId === pin.id && "bg-primary/10",
                  isSelected && "bg-primary/5"
                )}
                onClick={() => {
                  if (isSelectMode) {
                    onToggleSelect(pin.id);
                  } else {
                    onPinClick(pin);
                  }
                }}
              >
                {isSelectMode && (
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onToggleSelect(pin.id)}
                    />
                  </TableCell>
                )}
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: typeInfo.color }}
                    />
                    <span className="truncate max-w-[160px]">
                      {highlightMatch(pin.title)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {typeInfo.label}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(pin.status)} className="text-xs">
                    {statusInfo.label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground line-clamp-1">
                    {pin.description ? highlightMatch(pin.description) : "—"}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-sm">
                    <User className="w-3 h-3 text-muted-foreground" />
                    <span className="truncate max-w-[90px]">
                      {pin.created_by_profile?.full_name ||
                        pin.created_by_profile?.email ||
                        "—"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {pin.assigned_to_profile ? (
                    <div className="flex items-center gap-1.5 text-sm">
                      <User className="w-3 h-3 text-muted-foreground" />
                      <span className="truncate max-w-[90px]">
                        {pin.assigned_to_profile.full_name ||
                          pin.assigned_to_profile.email}
                      </span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-2">
                    {hasRfi && (
                      <div className="flex items-center gap-0.5 text-primary" title="Has RFI">
                        <FileQuestion className="w-4 h-4" />
                      </div>
                    )}
                    {photoCount > 0 && (
                      <div className="flex items-center gap-0.5 text-muted-foreground" title={`${photoCount} photo(s)`}>
                        <Camera className="w-4 h-4" />
                        <span className="text-xs">{photoCount}</span>
                      </div>
                    )}
                    {!hasRfi && photoCount === 0 && (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(pin.created_at), "MMM d, yyyy")}
                  </span>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
