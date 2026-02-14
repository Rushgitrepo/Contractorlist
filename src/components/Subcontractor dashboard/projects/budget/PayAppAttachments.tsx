import { useRef, useState } from "react";
import { ConfirmDialog } from "@/components/Subcontractor dashboard/ConfirmDialog";

import { format } from "date-fns";
import { Paperclip, Upload, Trash2, FileText, Download } from "lucide-react";
import { Button } from "@/components/Subcontractor dashboard/ui/button";
import { usePayAppAttachments, useUploadPayAppAttachment, useDeleteAttachment, getAttachmentUrl } from "@/hooks/Subcontractor dashboard/usePayAppAttachments";

interface PayAppAttachmentsProps {
  projectId: string;
  payApplicationId: string;
}

function formatFileSize(bytes: number | null): string {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function PayAppAttachments({ projectId, payApplicationId }: PayAppAttachmentsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: attachments = [], isLoading } = usePayAppAttachments(projectId, payApplicationId);
  const uploadMutation = useUploadPayAppAttachment(projectId);
  const deleteMutation = useDeleteAttachment(projectId);
  const [attachmentToDelete, setAttachmentToDelete] = useState<{ id: string; file_path: string; file_name: string } | null>(null);


  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    for (const file of Array.from(files)) {
      await uploadMutation.mutateAsync({
        file,
        payApplicationId,
      });
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDelete = (attachment: { id: string; file_path: string; file_name: string }) => {
    setAttachmentToDelete(attachment);
  };


  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Paperclip className="w-4 h-4" />
          Attachments ({attachments.length})
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadMutation.isPending}
        >
          <Upload className="w-3 h-3 mr-1" />
          {uploadMutation.isPending ? "Uploading..." : "Upload"}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileSelect}
          accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
        />
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading attachments...</p>
      ) : attachments.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No attachments. Upload lien waivers, invoices, or supporting documents.
        </p>
      ) : (
        <div className="space-y-2">
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="flex items-center gap-3 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{attachment.file_name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(attachment.file_size)} • {format(new Date(attachment.created_at), "MMM d, yyyy")}
                </p>
              </div>
              <div className="flex gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  asChild
                >
                  <a
                    href={getAttachmentUrl(attachment.file_path)}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                  >
                    <Download className="w-3 h-3" />
                  </a>
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 text-destructive hover:text-destructive"
                  onClick={() => handleDelete({ id: attachment.id, file_path: attachment.file_path, file_name: attachment.file_name || "this attachment" })}

                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!attachmentToDelete}
        onOpenChange={(open) => !open && setAttachmentToDelete(null)}
        title="Delete Attachment"
        description={`Are you sure you want to delete "${attachmentToDelete?.file_name}"? This action cannot be undone.`}
        onConfirm={() => {
          if (attachmentToDelete) {
            deleteMutation.mutate(attachmentToDelete);
            setAttachmentToDelete(null);
          }
        }}
        confirmText="Delete Attachment"
        variant="destructive"
        isLoading={deleteMutation.isPending}
      />
    </div>

  );
}
