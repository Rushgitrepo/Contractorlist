import { useRef, useState } from "react";
import { useAttachments, useUploadAttachment, useDeleteAttachment, getAttachmentUrl } from "@/hooks/Subcontractor dashboard/useAttachments";
import { Button } from "@/components/Subcontractor dashboard/ui/button";
import { 
  Paperclip, 
  Upload, 
  Loader2, 
  FileText, 
  Image, 
  File, 
  Trash2, 
  Download,
  X
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
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

interface FileAttachmentsProps {
  projectId: string;
  rfiId?: string;
  changeOrderId?: string;
}

function formatFileSize(bytes: number | null): string {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(fileType: string | null) {
  if (!fileType) return File;
  if (fileType.startsWith("image/")) return Image;
  if (fileType.includes("pdf") || fileType.includes("document")) return FileText;
  return File;
}

export default function FileAttachments({ projectId, rfiId, changeOrderId }: FileAttachmentsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachmentToDelete, setAttachmentToDelete] = useState<{ id: string; file_path: string; file_name: string } | null>(null);
  
  const { data: attachments, isLoading } = useAttachments({
    projectId,
    rfiId,
    changeOrderId,
  });
  
  const uploadMutation = useUploadAttachment(projectId);
  const deleteMutation = useDeleteAttachment(projectId);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (const file of Array.from(files)) {
      await uploadMutation.mutateAsync({
        file,
        rfiId,
        changeOrderId,
      });
    }

    // Clear input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDelete = async () => {
    if (!attachmentToDelete) return;
    await deleteMutation.mutateAsync(attachmentToDelete);
    setAttachmentToDelete(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Paperclip className="w-4 h-4" />
          <span>Attachments ({attachments?.length || 0})</span>
        </div>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileSelect}
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.csv"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadMutation.isPending}
          >
            {uploadMutation.isPending ? (
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
            ) : (
              <Upload className="w-4 h-4 mr-1" />
            )}
            Upload
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      ) : attachments && attachments.length > 0 ? (
        <div className="space-y-2">
          {attachments.map((attachment) => {
            const FileIcon = getFileIcon(attachment.file_type);
            const url = getAttachmentUrl(attachment.file_path);
            
            return (
              <div
                key={attachment.id}
                className="flex items-center gap-3 p-2 rounded-md bg-muted/50 group"
              >
                <FileIcon className="w-5 h-5 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-foreground hover:underline truncate block"
                  >
                    {attachment.file_name}
                  </a>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(attachment.file_size)} • {formatDistanceToNow(new Date(attachment.created_at), { addSuffix: true })}
                    {attachment.uploader && ` by ${attachment.uploader.full_name || attachment.uploader.email}`}
                  </p>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    asChild
                  >
                    <a href={url} download={attachment.file_name} target="_blank" rel="noopener noreferrer">
                      <Download className="w-4 h-4" />
                    </a>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    onClick={() => setAttachmentToDelete({
                      id: attachment.id,
                      file_path: attachment.file_path,
                      file_name: attachment.file_name,
                    })}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-3">
          No attachments yet
        </p>
      )}

      <AlertDialog open={!!attachmentToDelete} onOpenChange={(open) => !open && setAttachmentToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Attachment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{attachmentToDelete?.file_name}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
