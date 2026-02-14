import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/Subcontractor dashboard/ui/dialog";
import { Button } from "@/components/Subcontractor dashboard/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Subcontractor dashboard/ui/select";
import { Label } from "@/components/Subcontractor dashboard/ui/label";
import { Loader2, FileQuestion } from "lucide-react";
import { useProjectRFIs } from "@/hooks/Subcontractor dashboard/useProjectDetail";

interface LinkRFIDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  currentRfiId?: string | null;
  onLink: (rfiId: string | null) => Promise<void>;
  isLinking: boolean;
}

export default function LinkRFIDialog({
  open,
  onOpenChange,
  projectId,
  currentRfiId,
  onLink,
  isLinking,
}: LinkRFIDialogProps) {
  const [selectedRfiId, setSelectedRfiId] = useState<string>(currentRfiId || "none");
  const { data: rfis, isLoading } = useProjectRFIs(projectId);

  const handleLink = async () => {
    await onLink(selectedRfiId === "none" ? null : selectedRfiId);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileQuestion className="w-5 h-5" />
            Link to RFI
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Select RFI</Label>
            {isLoading ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
            ) : (
              <Select value={selectedRfiId} onValueChange={setSelectedRfiId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an RFI" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No linked RFI</SelectItem>
                  {rfis?.map((rfi) => (
                    <SelectItem key={rfi.id} value={rfi.id}>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-muted-foreground">
                          RFI-{rfi.rfi_number}
                        </span>
                        <span className="truncate max-w-[200px]">{rfi.title}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {rfis?.length === 0 && !isLoading && (
              <p className="text-sm text-muted-foreground">
                No RFIs available. Create a new RFI first.
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleLink} disabled={isLinking}>
            {isLinking && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {selectedRfiId === "none" ? "Unlink" : "Link RFI"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
