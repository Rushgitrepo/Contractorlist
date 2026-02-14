import { useState } from "react";
import { useAuth } from "@/context/Subcontractor dashboard/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/Subcontractor dashboard/ui/button";
import { Input } from "@/components/Subcontractor dashboard/ui/input";
import { Label } from "@/components/Subcontractor dashboard/ui/label";
import { Switch } from "@/components/Subcontractor dashboard/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Subcontractor dashboard/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/Subcontractor dashboard/ui/card";
import { Separator } from "@/components/Subcontractor dashboard/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/Subcontractor dashboard/ui/avatar";
import {
  User,
  Building2,
  Bell,
  Palette,
  Shield,
  Loader2,
  Camera,
  Mail,
  Phone,
  MapPin,
  Globe,
  CreditCard,
  Users,
  FileText
} from "lucide-react";
import { toast } from "sonner";
import { UploadLogoDialog } from "@/components/Subcontractor dashboard/settings/UploadLogoDialog";
import { ManageTeamDialog } from "@/components/Subcontractor dashboard/settings/ManageTeamDialog";
import { ConfirmDialog } from "@/components/Subcontractor dashboard/ConfirmDialog";


export default function SettingsPage() {
  const { profile, refreshProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Profile form state
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [phone, setPhone] = useState(profile?.phone || "");

  // Company form state
  const [companyName, setCompanyName] = useState(profile?.company_name || "");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");

  // Notification preferences
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [rfiNotifications, setRfiNotifications] = useState(true);
  const [changeOrderNotifications, setChangeOrderNotifications] = useState(true);
  const [payAppNotifications, setPayAppNotifications] = useState(true);
  const [dailyDigest, setDailyDigest] = useState(false);

  // Dialog states
  const [logoDialogOpen, setLogoDialogOpen] = useState(false);
  const [teamDialogOpen, setTeamDialogOpen] = useState(false);

  // Get company logo URL
  const companyLogoUrl = (profile as any)?.company_logo_url || null;
  const [signatureNotifications, setSignatureNotifications] = useState(true);

  const handleSaveProfile = async () => {
    if (!profile) return;
    setIsLoading(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName.trim(),
        phone: phone.trim() || null,
      })
      .eq("id", profile.id);

    if (error) {
      toast.error("Failed to update profile");
    } else {
      await refreshProfile();
      toast.success("Profile updated successfully");
    }
    setIsLoading(false);
  };

  const handleSaveCompany = async () => {
    if (!profile) return;
    setIsLoading(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        company_name: companyName.trim(),
      })
      .eq("id", profile.id);

    if (error) {
      toast.error("Failed to update company settings");
    } else {
      await refreshProfile();
      toast.success("Company settings updated");
    }
    setIsLoading(false);
  };

  const handleSaveNotifications = () => {
    toast.success("Notification preferences saved");
  };

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account and application preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="profile" className="gap-2">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="company" className="gap-2">
            <Building2 className="w-4 h-4" />
            <span className="hidden sm:inline">Company</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="gap-2">
            <Palette className="w-4 h-4" />
            <span className="hidden sm:inline">Preferences</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                    {getInitials(profile?.full_name ?? null)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Camera className="w-4 h-4" />
                    Change Photo
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">JPG, PNG or GIF. Max 2MB.</p>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pl-10"
                      placeholder="John Smith"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      value={profile?.email || ""}
                      className="pl-10"
                      disabled
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-10"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveProfile} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50/10 dark:bg-red-900/10">
            <CardHeader>
              <CardTitle className="text-destructive flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Danger Zone
              </CardTitle>
              <CardDescription>Irreversible account actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Reset Profile Data</p>
                  <p className="text-sm text-muted-foreground">Clear your name and company info to restart onboarding.</p>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => setShowResetConfirm(true)}
                  disabled={isLoading}
                >
                  Reset Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          <ConfirmDialog
            open={showResetConfirm}
            onOpenChange={setShowResetConfirm}
            title="Reset Profile Data"
            description="Are you sure? This will clear your name and company info. This action cannot be undone."
            onConfirm={async () => {
              if (!profile) return;
              setShowResetConfirm(false);
              setIsLoading(true);
              await supabase.from("profiles").update({ full_name: null, company_name: null }).eq("id", profile.id);
              await refreshProfile();
              toast.success("Profile reset successfully.");
              setIsLoading(false);
              window.location.href = "/subcontractor-dashboard";
            }}
            confirmText="Reset Data"
            variant="destructive"
          />


          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security
              </CardTitle>
              <CardDescription>Manage your password and security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Password</p>
                  <p className="text-sm text-muted-foreground">Last changed: Never</p>
                </div>
                <Button variant="outline">Change Password</Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
                <Button variant="outline">Enable 2FA</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Company Tab */}
        <TabsContent value="company" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Company Details</CardTitle>
              <CardDescription>Your company information appears on documents and invoices</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="companyName"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="pl-10"
                      placeholder="ABC Construction LLC"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyWebsite">Website</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="companyWebsite"
                      value={companyWebsite}
                      onChange={(e) => setCompanyWebsite(e.target.value)}
                      className="pl-10"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="companyAddress">Business Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="companyAddress"
                      value={companyAddress}
                      onChange={(e) => setCompanyAddress(e.target.value)}
                      className="pl-10"
                      placeholder="123 Main Street, City, State 12345"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveCompany} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    "Save Company Info"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Document Defaults
              </CardTitle>
              <CardDescription>Default settings for generated documents</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {companyLogoUrl ? (
                    <Avatar className="w-12 h-12 rounded">
                      <AvatarImage src={companyLogoUrl} className="object-contain" />
                      <AvatarFallback className="rounded bg-muted">
                        <Building2 className="w-6 h-6 text-muted-foreground" />
                      </AvatarFallback>
                    </Avatar>
                  ) : null}
                  <div>
                    <p className="font-medium">Company Logo</p>
                    <p className="text-sm text-muted-foreground">Appears on pay applications and reports</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => setLogoDialogOpen(true)}>
                  {companyLogoUrl ? "Change Logo" : "Upload Logo"}
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Default Retainage</p>
                  <p className="text-sm text-muted-foreground">Standard retainage percentage for new projects</p>
                </div>
                <div className="w-24">
                  <Input type="number" defaultValue="10" className="text-right" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Team Members
              </CardTitle>
              <CardDescription>Manage users who have access to your organization</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={() => setTeamDialogOpen(true)}>Manage Team</Button>
            </CardContent>

            {/* Dialogs */}
            <UploadLogoDialog open={logoDialogOpen} onOpenChange={setLogoDialogOpen} />
            <ManageTeamDialog open={teamDialogOpen} onOpenChange={setTeamDialogOpen} />
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>Choose which emails you want to receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive email notifications</p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">RFI Updates</p>
                    <p className="text-sm text-muted-foreground">When an RFI is created, answered, or assigned to you</p>
                  </div>
                  <Switch
                    checked={rfiNotifications}
                    onCheckedChange={setRfiNotifications}
                    disabled={!emailNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Change Order Updates</p>
                    <p className="text-sm text-muted-foreground">When change orders are created or status changes</p>
                  </div>
                  <Switch
                    checked={changeOrderNotifications}
                    onCheckedChange={setChangeOrderNotifications}
                    disabled={!emailNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Pay Application Updates</p>
                    <p className="text-sm text-muted-foreground">When pay apps are submitted or approved</p>
                  </div>
                  <Switch
                    checked={payAppNotifications}
                    onCheckedChange={setPayAppNotifications}
                    disabled={!emailNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Signature Requests</p>
                    <p className="text-sm text-muted-foreground">When documents require your signature</p>
                  </div>
                  <Switch
                    checked={signatureNotifications}
                    onCheckedChange={setSignatureNotifications}
                    disabled={!emailNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Daily Digest</p>
                    <p className="text-sm text-muted-foreground">Receive a daily summary of all activity</p>
                  </div>
                  <Switch
                    checked={dailyDigest}
                    onCheckedChange={setDailyDigest}
                    disabled={!emailNotifications}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveNotifications}>Save Preferences</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize how the application looks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-sm text-muted-foreground">Use dark theme across the application</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Compact View</p>
                  <p className="text-sm text-muted-foreground">Show more content with less spacing</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Regional Settings</CardTitle>
              <CardDescription>Date, time, and currency preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Date Format</Label>
                  <Input defaultValue="MM/DD/YYYY" disabled />
                </div>
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Input defaultValue="USD ($)" disabled />
                </div>
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Input defaultValue="America/New_York (EST)" disabled />
                </div>
                <div className="space-y-2">
                  <Label>Measurement Units</Label>
                  <Input defaultValue="Imperial (ft, in)" disabled />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <CreditCard className="w-5 h-5" />
                Billing & Subscription
              </CardTitle>
              <CardDescription>Manage your subscription and billing details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Professional Plan</p>
                    <p className="text-sm text-muted-foreground">Unlimited projects • All features</p>
                  </div>
                  <Button variant="outline">Manage Subscription</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
