import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/Subcontractor dashboard/ui/dialog";
import { Button } from "@/components/Subcontractor dashboard/ui/button";
import { Input } from "@/components/Subcontractor dashboard/ui/input";
import { Label } from "@/components/Subcontractor dashboard/ui/label";
import { Textarea } from "@/components/Subcontractor dashboard/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Subcontractor dashboard/ui/select";
import { Upload, Loader2, FileImage } from "lucide-react";
import { PLAN_DISCIPLINES, PlanDiscipline, useUploadPlan } from "@/hooks/Subcontractor dashboard/usePlans";

interface UploadPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
}

export default function UploadPlanDialog({
  open,
  onOpenChange,
  projectId,
}: UploadPlanDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [sheetNumber, setSheetNumber] = useState("");
  const [discipline, setDiscipline] = useState<PlanDiscipline>("architectural");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadPlan = useUploadPlan(projectId);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (!name) {
        // Auto-fill name from filename
        setName(selectedFile.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    await uploadPlan.mutateAsync({
      file,
      name,
      description,
      sheetNumber,
      discipline,
    });

    // Reset form and close
    setFile(null);
    setName("");
    setDescription("");
    setSheetNumber("");
    setDiscipline("architectural");
    onOpenChange(false);
  };

  const resetForm = () => {
    setFile(null);
    setName("");
    setDescription("");
    setSheetNumber("");
    setDiscipline("architectural");
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
          <DialogTitle>Upload Plan</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File Upload */}
          <div className="space-y-2">
            <Label>Plan File *</Label>
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
                    Click to upload (PDF or Image)
                  </span>
                </div>
              </Button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Floor Plan - Level 1"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sheetNumber">Sheet Number</Label>
              <Input
                id="sheetNumber"
                value={sheetNumber}
                onChange={(e) => setSheetNumber(e.target.value)}
                placeholder="A-101"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="discipline">Discipline</Label>
            <Select value={discipline} onValueChange={(v) => setDiscipline(v as PlanDiscipline)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PLAN_DISCIPLINES.map((d) => (
                  <SelectItem key={d.value} value={d.value}>
                    {d.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add notes about this plan..."
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!file || !name.trim() || uploadPlan.isPending}>
              {uploadPlan.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Upload Plan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
