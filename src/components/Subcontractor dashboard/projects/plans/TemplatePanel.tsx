import { useState } from "react";
import { Button } from "@/components/Subcontractor dashboard/ui/button";
import { Input } from "@/components/Subcontractor dashboard/ui/input";
import { Textarea } from "@/components/Subcontractor dashboard/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/Subcontractor dashboard/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/Subcontractor dashboard/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/Subcontractor dashboard/ui/tooltip";
import { cn } from "@/lib/utils";
import { BookTemplate, Save, Download, Trash2, FileText, Loader2 } from "lucide-react";
import { useAnnotationTemplates, AnnotationTemplate, TemplateAnnotation } from "@/hooks/Subcontractor dashboard/useAnnotationTemplates";
import { PlanAnnotation } from "@/hooks/Subcontractor dashboard/useAnnotations";
import { formatDistanceToNow } from "date-fns";
import { ConfirmDialog } from "@/components/Subcontractor dashboard/ConfirmDialog";


interface TemplatePanelProps {
  planId: string;
  projectId: string;
  annotations: PlanAnnotation[];
  onApplyTemplate: (annotations: TemplateAnnotation[]) => void;
  isDrawingMode: boolean;
}

export default function TemplatePanel({
  planId,
  projectId,
  annotations,
  onApplyTemplate,
  isDrawingMode,
}: TemplatePanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [templateDescription, setTemplateDescription] = useState("");
  const [templateToDeleteId, setTemplateToDeleteId] = useState<string | null>(null);


  const { templates, isLoading, createTemplate, deleteTemplate } = useAnnotationTemplates(projectId);

  const handleSaveTemplate = () => {
    if (!templateName.trim()) return;

    createTemplate.mutate(
      {
        project_id: projectId,
        name: templateName.trim(),
        description: templateDescription.trim() || undefined,
        annotations,
      },
      {
        onSuccess: () => {
          setIsSaveDialogOpen(false);
          setTemplateName("");
          setTemplateDescription("");
        },
      }
    );
  };

  const handleApplyTemplate = (template: AnnotationTemplate) => {
    if (template.annotations.length === 0) {
      return;
    }
    onApplyTemplate(template.annotations);
    setIsOpen(false);
  };

  const handleDeleteTemplate = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setTemplateToDeleteId(id);
  };


  if (!isDrawingMode) return null;

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <Tooltip>
          <TooltipTrigger asChild>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <BookTemplate className="h-4 w-4" />
                Templates
              </Button>
            </SheetTrigger>
          </TooltipTrigger>
          <TooltipContent>Save and load annotation templates</TooltipContent>
        </Tooltip>

        <SheetContent side="right" className="w-96 z-50">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <BookTemplate className="h-5 w-5" />
              Annotation Templates
            </SheetTitle>
          </SheetHeader>

          <div className="mt-6 space-y-4">
            {/* Save current annotations as template */}
            <Button
              className="w-full gap-2"
              onClick={() => setIsSaveDialogOpen(true)}
              disabled={annotations.length === 0}
            >
              <Save className="h-4 w-4" />
              Save Current as Template ({annotations.length} annotations)
            </Button>

            <div className="border-t pt-4">
              <h3 className="text-sm font-medium mb-3">Saved Templates</h3>

              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : templates.length === 0 ? (
                <div className="text-sm text-muted-foreground text-center py-8">
                  <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  No templates yet. Save your first template above.
                </div>
              ) : (
                <div className="space-y-2">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className={cn(
                        "p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors group"
                      )}
                      onClick={() => handleApplyTemplate(template)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">
                            {template.name}
                          </div>
                          {template.description && (
                            <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                              {template.description}
                            </div>
                          )}
                          <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
                            <span>{template.annotations.length} annotations</span>
                            <span>•</span>
                            <span>
                              {formatDistanceToNow(new Date(template.created_at), { addSuffix: true })}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleApplyTemplate(template);
                                }}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Apply template</TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                                onClick={(e) => handleDeleteTemplate(e, template.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Delete template</TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Help text */}
            <div className="border-t pt-4 text-xs text-muted-foreground space-y-1">
              <p>• Templates save annotation positions, colors, and styles</p>
              <p>• Apply a template to quickly add standard markups to any plan</p>
              <p>• Templates are shared with all project members</p>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Save Template Dialog */}
      <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save as Template</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Template Name</label>
              <Input
                placeholder="e.g., Standard Floor Markups"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description (optional)</label>
              <Textarea
                placeholder="Describe what this template contains..."
                value={templateDescription}
                onChange={(e) => setTemplateDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="text-sm text-muted-foreground">
              This will save {annotations.length} annotation{annotations.length !== 1 ? "s" : ""} as a reusable template.
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSaveDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveTemplate}
              disabled={!templateName.trim() || createTemplate.isPending}
            >
              {createTemplate.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Template
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!templateToDeleteId}
        onOpenChange={(open) => !open && setTemplateToDeleteId(null)}
        title="Delete Template"
        description="Are you sure you want to delete this template? This will remove it for all project members."
        onConfirm={() => {
          if (templateToDeleteId) {
            deleteTemplate.mutate(templateToDeleteId);
            setTemplateToDeleteId(null);
          }
        }}
        confirmText="Delete Template"
        variant="destructive"
      />
    </>

  );
}
