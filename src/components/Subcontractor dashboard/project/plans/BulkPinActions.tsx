import { Button } from "@/components/Subcontractor dashboard/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Subcontractor dashboard/ui/select";
import { X, CheckSquare } from "lucide-react";
import { PIN_STATUSES, PinStatus } from "@/hooks/Subcontractor dashboard/usePlans";
import { useState } from "react";

interface BulkPinActionsProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onBulkUpdateStatus: (status: PinStatus) => void;
  isUpdating: boolean;
}

export default function BulkPinActions({
  selectedCount,
  totalCount,
  onSelectAll,
  onClearSelection,
  onBulkUpdateStatus,
  isUpdating,
}: BulkPinActionsProps) {
  const [selectedStatus, setSelectedStatus] = useState<PinStatus | "">("");

  const handleApply = () => {
    if (selectedStatus) {
      onBulkUpdateStatus(selectedStatus);
      setSelectedStatus("");
    }
  };

  if (selectedCount === 0) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 border-b text-sm">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs"
          onClick={onSelectAll}
          disabled={totalCount === 0}
        >
          <CheckSquare className="w-3 h-3 mr-1" />
          Select All ({totalCount})
        </Button>
        <span className="text-xs text-muted-foreground">
          Click pins to select for bulk actions
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 px-3 py-2 bg-primary/10 border-b border-primary/20">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2"
          onClick={onClearSelection}
        >
          <X className="w-3 h-3" />
        </Button>
        <span className="text-sm font-medium">
          {selectedCount} pin{selectedCount !== 1 ? "s" : ""} selected
        </span>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <span className="text-xs text-muted-foreground">Change status to:</span>
        <Select
          value={selectedStatus}
          onValueChange={(value) => setSelectedStatus(value as PinStatus)}
        >
          <SelectTrigger className="h-7 w-[130px] text-xs">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {PIN_STATUSES.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          size="sm"
          className="h-7 text-xs"
          onClick={handleApply}
          disabled={!selectedStatus || isUpdating}
        >
          {isUpdating ? "Updating..." : "Apply"}
        </Button>
      </div>
    </div>
  );
}
