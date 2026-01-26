import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Building,
  Shield,
  Users,
  Bell,
  CreditCard,
  Camera,
  Save,
  Edit,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Phone,
  FileText,
  Plus
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AccountSettings = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [activeNotifications, setActiveNotifications] = useState<Record<string, boolean>>({
    'New Bid Opportunities': true,
    'Project Updates': true,
    'Team Invitations': true,
    'Document Approvals': false,
    'System Updates': true
  });

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your company information has been successfully saved.",
    });
  };

  const toggleNotification = (title: string) => {
    setActiveNotifications(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
    toast({
      title: "Settings Updated",
      description: `Notification for "${title}" has been ${!activeNotifications[title] ? 'enabled' : 'disabled'}.`,
    });
  };

  const licenses = [
    {
      name: 'General Contractor License',
      details: 'State of Texas • #GC-994821',
      status: 'Active',
      statusColor: 'green',
      expiryDate: 'Dec 31, 2025',
      icon: Shield
    },
    {
      name: 'OSHA 30 Certification',
      details: 'Safety Compliance • Exp: Dec 2024',
      status: 'Expires Soon',
      statusColor: 'yellow',
      expiryDate: 'Dec 15, 2024',
      icon: Shield
    },
    {
      name: 'Workers Compensation Insurance',
      details: 'Active Coverage • Policy #WC-4521',
      status: 'Active',
      statusColor: 'green',
      expiryDate: 'Mar 31, 2025',
      icon: Shield
    }
  ];

  const notifications = [
    {
      title: 'New Bid Opportunities',
      description: 'Daily digest of matching projects in your area',
      enabled: true
    },
    {
      title: 'Project Updates',
      description: 'Notifications when project status changes',
      enabled: true
    },
    {
      title: 'Team Invitations',
      description: 'Alerts when team members are invited to projects',
      enabled: true
    },
    {
      title: 'Document Approvals',
      description: 'Notifications for document reviews and approvals',
      enabled: false
    },
    {
      title: 'System Updates',
      description: 'Platform maintenance and feature announcements',
      enabled: true
    }
  ];

  return (
    <div className="p-6 md:p-8 bg-gray-50 dark:bg-[#0f1115] min-h-full text-gray-900 dark:text-white font-sans relative transition-colors duration-300">
      <div className="max-w-5xl mx-auto space-y-6 relative z-10">
        {/* Background Ambience */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[10%] right-[10%] w-[40%] h-[40%] rounded-full bg-yellow-400/5 dark:bg-yellow-600/5 blur-[120px]" />
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-1">
              Account Settings
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage your company profile, licenses, team access, and notification preferences.
            </p>
          </div>
          <div className="flex gap-3">
            {isEditing ? (
              <>
                <Button variant="ghost" onClick={() => setIsEditing(false)} className="hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white">
                  Cancel
                </Button>
                <Button onClick={handleSave} className="bg-yellow-400 hover:bg-yellow-500 dark:bg-yellow-500 dark:hover:bg-yellow-400 text-black font-semibold shadow-sm dark:shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)} className="bg-yellow-400 hover:bg-yellow-500 dark:bg-yellow-500 dark:hover:bg-yellow-400 text-black font-semibold shadow-sm dark:shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-100 dark:bg-[#1c1e24] p-1 border border-gray-200 dark:border-white/5 rounded-xl">
            <TabsTrigger value="profile" className="data-[state=active]:bg-yellow-400 dark:data-[state=active]:bg-yellow-500 data-[state=active]:text-black text-gray-500 dark:text-gray-400 rounded-lg transition-all font-medium">Company Profile</TabsTrigger>
            <TabsTrigger value="licenses" className="data-[state=active]:bg-yellow-400 dark:data-[state=active]:bg-yellow-500 data-[state=active]:text-black text-gray-500 dark:text-gray-400 rounded-lg transition-all font-medium">Licenses</TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-yellow-400 dark:data-[state=active]:bg-yellow-500 data-[state=active]:text-black text-gray-500 dark:text-gray-400 rounded-lg transition-all font-medium">Notifications</TabsTrigger>
          </TabsList>

          {/* Company Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="border-gray-200 dark:border-white/5 bg-white dark:bg-[#1c1e24] shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Company Information</CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">
                  Update your company details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-500 dark:from-yellow-500 dark:to-yellow-600 text-black border-2 border-yellow-200 dark:border-yellow-500/20 shadow-lg shadow-yellow-500/10">
                    <AvatarImage src="https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&q=80&w=200&h=200" className="object-cover" />
                    <AvatarFallback className="text-2xl font-bold">AC</AvatarFallback>
                  </Avatar>
                  <div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 bg-transparent"
                      onClick={() => toast({ title: "Upload Logo", description: "Select a file to upload as your company logo." })}
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Change Logo
                    </Button>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                      Recommended: 200x200px, PNG or JPG
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="companyName" className="text-gray-700 dark:text-gray-300">Company Name</Label>
                    <Input
                      id="companyName"
                      defaultValue="Acme Construction"
                      disabled={!isEditing}
                      className="border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 text-gray-900 dark:text-white focus:border-yellow-500/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber" className="text-gray-700 dark:text-gray-300">License Number</Label>
                    <Input
                      id="licenseNumber"
                      defaultValue="GC-994821"
                      disabled={!isEditing}
                      className="border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 text-gray-900 dark:text-white focus:border-yellow-500/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-gray-700 dark:text-gray-300">Company Description</Label>
                  <Textarea
                    id="description"
                    defaultValue="Leading general contractor specializing in commercial and residential construction projects across Texas."
                    disabled={!isEditing}
                    className="border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 text-gray-900 dark:text-white min-h-[100px] focus:border-yellow-500/50"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue="info@acmeconstruction.com"
                      disabled={!isEditing}
                      className="border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 text-gray-900 dark:text-white focus:border-yellow-500/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      defaultValue="(512) 555-0100"
                      disabled={!isEditing}
                      className="border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 text-gray-900 dark:text-white focus:border-yellow-500/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-gray-700 dark:text-gray-300">Business Address</Label>
                  <Input
                    id="address"
                    defaultValue="123 Construction Ave, Austin, TX 78701"
                    disabled={!isEditing}
                    className="border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 text-gray-900 dark:text-white focus:border-yellow-500/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website" className="text-gray-700 dark:text-gray-300">Website</Label>
                  <Input
                    id="website"
                    defaultValue="www.acmeconstruction.com"
                    disabled={!isEditing}
                    className="border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 text-gray-900 dark:text-white focus:border-yellow-500/50"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Licenses & Certifications Tab */}
          <TabsContent value="licenses" className="space-y-6">
            <Card className="border-gray-200 dark:border-white/5 bg-white dark:bg-[#1c1e24] shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Licenses & Certifications</CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">
                  Manage your professional licenses and certifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {licenses.map((license, index) => (
                  <div
                    key={index}
                    className="flex items-start justify-between p-4 border border-gray-200 dark:border-white/5 rounded-xl bg-gray-50 dark:bg-black/20 hover:border-yellow-400 dark:hover:border-yellow-500/20 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${license.statusColor === 'green'
                        ? 'bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-500'
                        : 'bg-yellow-100 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-500'
                        }`}>
                        <license.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {license.name}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          {license.details}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
                          <span>Expires: {license.expiryDate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${license.statusColor === 'green'
                        ? 'bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-500 border-green-200 dark:border-green-500/20'
                        : 'bg-yellow-100 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border-yellow-200 dark:border-yellow-500/20'
                        }`}>
                        {license.status === 'Active' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                        {license.status === 'Expires Soon' && <AlertTriangle className="w-3 h-3 mr-1" />}
                        {license.status}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"
                        onClick={() => toast({ title: "View Document", description: `Opening ${license.name} documentation.` })}
                      >
                        <FileText className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="w-full mt-4 border-gray-300 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 bg-transparent border-dashed"
                  onClick={() => toast({ title: "Add License", description: "Please upload your license file and enter details." })}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add License or Certification
                </Button>
              </CardContent>
            </Card>
          </TabsContent>



          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="border-gray-200 dark:border-white/5 bg-white dark:bg-[#1c1e24] shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Notification Preferences</CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">
                  Configure how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {notifications.map((notification, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-white/5 rounded-xl bg-gray-50 dark:bg-black/20 hover:bg-gray-100 dark:hover:bg-black/30 transition-all"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {notification.title}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {notification.description}
                      </p>
                    </div>
                    <Switch
                      checked={activeNotifications[notification.title]}
                      onCheckedChange={() => toggleNotification(notification.title)}
                      className="data-[state=checked]:bg-yellow-500"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AccountSettings;
