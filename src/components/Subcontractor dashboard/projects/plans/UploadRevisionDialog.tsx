import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/Subcontractor dashboard/ui/dialog";
import { Button } from "@/components/Subcontractor dashboard/ui/button";
import { Label } from "@/components/Subcontractor dashboard/ui/label";
import { Textarea } from "@/components/Subcontractor dashboard/ui/textarea";
import { Upload, Loader2, FileImage, GitBranch } from "lucide-react";
import { useUploadPlanRevision } from "@/hooks/Subcontractor dashboard/usePlanVersions";
import { Plan } from "@/hooks/Subcontractor dashboard/usePlans";

interface UploadRevisionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: Plan;
  projectId: string;
  onSuccess?: (newPlan: Plan) => void;
}

export default function UploadRevisionDialog({
  open,
  onOpenChange,
  plan,
  projectId,
  onSuccess,
}: UploadRevisionDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const uploadRevision = useUploadPlanRevision(projectId);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const result = await uploadRevision.mutateAsync({
      file,
      existingPlan: {
        id: plan.id,
        name: plan.name,
        sheet_number: plan.sheet_number,
        discipline: plan.discipline,
        version: plan.version,
      },
      description,
    });

    // Reset form and close
    setFile(null);
    setDescription("");
    onOpenChange(false);
    
    if (onSuccess && result) {
      onSuccess(result as Plan);
    }
  };

  const resetForm = () => {
    setFile(null);
    setDescription("");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) resetForm();
        onOpenChange(isOpen);
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GitBranch className="w-5 h-5" />
            Upload New Revision
          </DialogTitle>
        </DialogHeader>

        <div className="bg-muted/50 rounded-lg p-3 mb-4">
          <p className="text-sm">
            <span className="text-muted-foreground">Updating: </span>
            <span className="font-medium">{plan.name}</span>
            {plan.sheet_number && (
              <span className="text-muted-foreground"> ({plan.sheet_number})</span>
            )}
          </p>
          <p className="text-sm text-muted-foreground">
            Current version: v{plan.version || 1} → New version: v{(plan.version || 1) + 1}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File Upload */}
          <div className="space-y-2">
            <Label>New Plan File *</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={handleFileSelect}
            />
            {file ? (
              <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/50">
                <FileImage className="w-8 h-8 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Change
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                className="w-full h-24 border-dashed"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="flex flex-col items-center gap-2">
                  <Upload className="w-6 h-6 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Click to upload new revision (PDF or Image)
                  </span>
                </div>
              </Button>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Revision Notes</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What changed in this revision?"
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!file || uploadRevision.isPending}>
              {uploadRevision.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Upload Revision
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
