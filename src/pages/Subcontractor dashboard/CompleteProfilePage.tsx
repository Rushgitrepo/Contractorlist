import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/Subcontractor dashboard/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/Subcontractor dashboard/ui/button";
import { Input } from "@/components/Subcontractor dashboard/ui/input";
import { Label } from "@/components/Subcontractor dashboard/ui/label";
import { Building2, Loader2, User, Phone, Building } from "lucide-react";
import { toast } from "sonner";

export default function CompleteProfilePage() {
  const { profile, refreshProfile } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [companyName, setCompanyName] = useState(profile?.company_name || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !companyName.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName.trim(),
        company_name: companyName.trim(),
        phone: phone.trim() || null,
      })
      .eq("id", profile?.id);

    if (error) {
      toast.error("Failed to update profile");
      setIsLoading(false);
      return;
    }

    await refreshProfile();
    toast.success("Profile completed!");
    navigate("/subcontractor-dashboard/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Building2 className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">BuildPro</span>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">Complete your profile</h2>
          <p className="mt-2 text-muted-foreground">
            Tell us a bit about yourself to get started
          </p>
        </div>

        <div className="stat-card p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="fullName">
                Full name <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Smith"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyName">
                Company name <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="companyName"
                  type="text"
                  placeholder="ABC Construction"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                "Complete Setup"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
