import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
  MapPin,
  Globe,
  FileText,
  Plus
} from 'lucide-react';

const AccountSettings = () => {
  const [isEditing, setIsEditing] = useState(false);

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
    <div className="p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-full">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Account Settings
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your company profile, licenses, team access, and notification preferences.
            </p>
          </div>
          <div className="flex gap-3">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)} className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Company Profile</TabsTrigger>
            <TabsTrigger value="licenses">Licenses & Certifications</TabsTrigger>
            <TabsTrigger value="team">Team Management</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          {/* Company Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>
                  Update your company details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="w-24 h-24 bg-yellow-400 dark:bg-yellow-500 text-gray-900">
                    <AvatarFallback className="text-2xl font-bold">AC</AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" size="sm">
                      <Camera className="w-4 h-4 mr-2" />
                      Change Logo
                    </Button>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Recommended: 200x200px, PNG or JPG
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      defaultValue="Acme Construction"
                      disabled={!isEditing}
                      className="border-gray-200 dark:border-gray-800"
                    />
                  </div>
                  <div>
                    <Label htmlFor="licenseNumber">License Number</Label>
                    <Input
                      id="licenseNumber"
                      defaultValue="GC-994821"
                      disabled={!isEditing}
                      className="border-gray-200 dark:border-gray-800"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Company Description</Label>
                  <Textarea
                    id="description"
                    defaultValue="Leading general contractor specializing in commercial and residential construction projects across Texas."
                    disabled={!isEditing}
                    className="border-gray-200 dark:border-gray-800 min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue="info@acmeconstruction.com"
                      disabled={!isEditing}
                      className="border-gray-200 dark:border-gray-800"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      defaultValue="(512) 555-0100"
                      disabled={!isEditing}
                      className="border-gray-200 dark:border-gray-800"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Business Address</Label>
                  <Input
                    id="address"
                    defaultValue="123 Construction Ave, Austin, TX 78701"
                    disabled={!isEditing}
                    className="border-gray-200 dark:border-gray-800"
                  />
                </div>

                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    defaultValue="www.acmeconstruction.com"
                    disabled={!isEditing}
                    className="border-gray-200 dark:border-gray-800"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Licenses & Certifications Tab */}
          <TabsContent value="licenses" className="space-y-6">
            <Card className="border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle>Licenses & Certifications</CardTitle>
                <CardDescription>
                  Manage your professional licenses and certifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {licenses.map((license, index) => (
                  <div
                    key={index}
                    className="flex items-start justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${
                        license.statusColor === 'green' 
                          ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400'
                      }`}>
                        <license.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {license.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {license.details}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                          <span>Expires: {license.expiryDate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${
                        license.statusColor === 'green'
                          ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {license.status === 'Active' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                        {license.status === 'Expires Soon' && <AlertTriangle className="w-3 h-3 mr-1" />}
                        {license.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <FileText className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add License or Certification
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Management Tab */}
          <TabsContent value="team" className="space-y-6">
            <Card className="border-gray-200 dark:border-gray-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Team Members</CardTitle>
                    <CardDescription>
                      Manage team member access and permissions
                    </CardDescription>
                  </div>
                  <Button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold">
                    <Users className="w-4 h-4 mr-2" />
                    Invite Team Member
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'John Doe', role: 'Admin', email: 'john@acmeconstruction.com', status: 'Active' },
                    { name: 'Sarah Miller', role: 'Estimator', email: 'sarah@acmeconstruction.com', status: 'Active' },
                    { name: 'Robert Johnson', role: 'Project Manager', email: 'robert@acmeconstruction.com', status: 'Active' }
                  ].map((member, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar className="w-10 h-10 bg-yellow-400 dark:bg-yellow-500 text-gray-900">
                          <AvatarFallback className="text-sm font-semibold">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {member.name}
                            {index === 0 && <span className="text-xs text-gray-500 ml-2">(You)</span>}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {member.role} • {member.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          {member.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Configure how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {notifications.map((notification, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {notification.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {notification.description}
                      </p>
                    </div>
                    <Switch checked={notification.enabled} />
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
