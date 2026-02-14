import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/Subcontractor dashboard/ui/dialog";
import { Button } from "@/components/Subcontractor dashboard/ui/button";
import { Input } from "@/components/Subcontractor dashboard/ui/input";
import { Label } from "@/components/Subcontractor dashboard/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Subcontractor dashboard/ui/select";
import { MEASUREMENT_UNITS, MeasurementUnit } from "@/hooks/Subcontractor dashboard/useScaleCalibration";
import { Ruler } from "lucide-react";

interface ScaleCalibrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (length: number, unit: MeasurementUnit) => void;
  pixelLength: number;
}

export default function ScaleCalibrationDialog({
  open,
  onOpenChange,
  onConfirm,
  pixelLength,
}: ScaleCalibrationDialogProps) {
  const [length, setLength] = useState<string>("10");
  const [unit, setUnit] = useState<MeasurementUnit>("ft");

  const handleConfirm = () => {
    const numLength = parseFloat(length);
    if (isNaN(numLength) || numLength <= 0) return;
    onConfirm(numLength, unit);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ruler className="h-5 w-5" />
            Set Scale
          </DialogTitle>
          <DialogDescription>
            Enter the real-world length of the line you just drew. This will calibrate
            measurements for the entire plan.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <div className="text-sm text-muted-foreground">
              Reference line: <span className="font-medium text-foreground">{Math.round(pixelLength)}px</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="length">Length</Label>
              <Input
                id="length"
                type="number"
                min="0.01"
                step="0.01"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                placeholder="e.g., 10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Select value={unit} onValueChange={(v) => setUnit(v as MeasurementUnit)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MEASUREMENT_UNITS.map((u) => (
                    <SelectItem key={u.value} value={u.value}>
                      {u.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Tip: For best accuracy, use a known dimension on the plan (like a door width
            or room length) as your reference.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!length || parseFloat(length) <= 0}>
            Set Scale
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
