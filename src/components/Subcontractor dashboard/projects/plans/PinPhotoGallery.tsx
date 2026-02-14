import { useRef, useState } from "react";
import { useAttachments, useUploadAttachment, useDeleteAttachment, getAttachmentUrl } from "@/hooks/Subcontractor dashboard/useAttachments";
import { Button } from "@/components/Subcontractor dashboard/ui/button";
import { Camera, Loader2, Trash2, X, Plus, ImageIcon } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
} from "@/components/Subcontractor dashboard/ui/dialog";
import { Label } from "@/components/Subcontractor dashboard/ui/label";

interface PinPhotoGalleryProps {
  projectId: string;
  pinId: string;
}

export default function PinPhotoGallery({ projectId, pinId }: PinPhotoGalleryProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoToDelete, setPhotoToDelete] = useState<{ id: string; file_path: string; file_name: string } | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  const { data: attachments, isLoading } = useAttachments({
    projectId,
    pinId,
  });

  const uploadMutation = useUploadAttachment(projectId);
  const deleteMutation = useDeleteAttachment(projectId);

  // Filter to only show images
  const photos = attachments?.filter(a => a.file_type?.startsWith("image/")) || [];

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) {
        continue; // Skip non-image files
      }
      await uploadMutation.mutateAsync({
        file,
        pinId,
      });
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDelete = async () => {
    if (!photoToDelete) return;
    await deleteMutation.mutateAsync(photoToDelete);
    setPhotoToDelete(null);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs uppercase text-muted-foreground flex items-center gap-1">
          <Camera className="w-3 h-3" />
          Photos ({photos.length})
        </Label>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadMutation.isPending}
          >
            {uploadMutation.isPending ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Plus className="w-3 h-3" />
            )}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
        </div>
      ) : photos.length > 0 ? (
        <div className="grid grid-cols-3 gap-1.5">
          {photos.map((photo) => {
            const url = getAttachmentUrl(photo.file_path);
            return (
              <div
                key={photo.id}
                className="relative aspect-square rounded-md overflow-hidden bg-muted group cursor-pointer"
                onClick={() => setPreviewPhoto(url)}
              >
                <img
                  src={url}
                  alt={photo.file_name}
                  className="w-full h-full object-cover"
                />
                <button
                  className="absolute top-1 right-1 p-1 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPhotoToDelete({
                      id: photo.id,
                      file_path: photo.file_path,
                      file_name: photo.file_name,
                    });
                  }}
                >
                  <Trash2 className="w-3 h-3 text-white" />
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div 
          className="border border-dashed rounded-md p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <ImageIcon className="w-6 h-6 mx-auto text-muted-foreground mb-1" />
          <p className="text-xs text-muted-foreground">
            Click to add site photos
          </p>
        </div>
      )}

      {/* Photo Preview Dialog */}
      <Dialog open={!!previewPhoto} onOpenChange={() => setPreviewPhoto(null)}>
        <DialogContent className="max-w-3xl p-1">
          <button
            className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full z-10"
            onClick={() => setPreviewPhoto(null)}
          >
            <X className="w-4 h-4 text-white" />
          </button>
          {previewPhoto && (
            <img
              src={previewPhoto}
              alt="Preview"
              className="w-full h-auto max-h-[80vh] object-contain rounded-md"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!photoToDelete} onOpenChange={(open) => !open && setPhotoToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Photo</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this photo? This action cannot be undone.
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
