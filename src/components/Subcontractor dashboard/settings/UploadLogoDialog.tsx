import { useState, useRef } from "react";
import { useAuth } from "@/context/Subcontractor dashboard/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/Subcontractor dashboard/ui/dialog";
import { Button } from "@/components/Subcontractor dashboard/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/Subcontractor dashboard/ui/avatar";
import { Upload, Loader2, Trash2, Building2 } from "lucide-react";
import { toast } from "sonner";

interface UploadLogoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UploadLogoDialog({ open, onOpenChange }: UploadLogoDialogProps) {
  const { user, profile, refreshProfile } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Access company_logo_url from profile (cast to any since types aren't updated yet)
  const currentLogoUrl = (profile as any)?.company_logo_url || null;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size must be less than 2MB");
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to storage
    setIsUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${user?.id}/logo.${fileExt}`;

      // Delete existing logo if any
      if (currentLogoUrl) {
        const oldPath = currentLogoUrl.split("/").slice(-2).join("/");
        await supabase.storage.from("company-logos").remove([oldPath]);
      }

      const { error: uploadError } = await supabase.storage
        .from("company-logos")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("company-logos")
        .getPublicUrl(filePath);

      // Update profile with logo URL
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ company_logo_url: publicUrl } as any)
        .eq("id", profile?.id);

      if (updateError) throw updateError;

      await refreshProfile();
      toast.success("Logo uploaded successfully");
      onOpenChange(false);
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload logo");
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!currentLogoUrl) return;

    setIsDeleting(true);
    try {
      // Extract path from URL
      const pathMatch = currentLogoUrl.match(/company-logos\/(.+)$/);
      if (pathMatch) {
        await supabase.storage.from("company-logos").remove([pathMatch[1]]);
      }

      // Update profile to remove logo URL
      const { error } = await supabase
        .from("profiles")
        .update({ company_logo_url: null } as any)
        .eq("id", profile?.id);

      if (error) throw error;

      await refreshProfile();
      setPreviewUrl(null);
      toast.success("Logo removed");
    } catch (error: any) {
      toast.error(error.message || "Failed to remove logo");
    } finally {
      setIsDeleting(false);
    }
  };

  const displayUrl = previewUrl || currentLogoUrl;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Company Logo</DialogTitle>
          <DialogDescription>
            Upload your company logo to appear on documents and reports
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Logo Preview */}
          <div className="flex flex-col items-center gap-4">
            <Avatar className="w-32 h-32 rounded-lg">
              <AvatarImage src={displayUrl || undefined} className="object-contain" />
              <AvatarFallback className="rounded-lg bg-muted">
                <Building2 className="w-12 h-12 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>

            {displayUrl && (
              <p className="text-xs text-muted-foreground">
                Logo will appear on pay applications and exported documents
              </p>
            )}
          </div>

          {/* Upload Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Action Buttons */}
          <div className="flex gap-2 justify-center">
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  {currentLogoUrl ? "Replace Logo" : "Upload Logo"}
                </>
              )}
            </Button>

            {currentLogoUrl && (
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </Button>
            )}
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Recommended: Square image, PNG or JPG, max 2MB
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
