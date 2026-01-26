import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  User,
  Lock,
  CreditCard,
  Bell,
  Shield,
  Camera,
  Mail,
  Phone,
  MapPin,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

const AccountSettings = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    marketing: false
  });

  const handleNotificationChange = (type: string, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [type]: value
    }));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">
            Account Settings
          </h1>
          <p className="text-text-secondary-light dark:text-text-secondary-dark mt-1">
            Manage your personal information and account preferences
          </p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          {/* Profile Picture */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="relative group cursor-pointer">
                  <div 
                    className="size-24 rounded-full bg-cover bg-center ring-4 ring-gray-50 dark:ring-gray-800"
                    style={{
                      backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAKfw81NtWq6MjX9hmQPp9aILtiE7Qdj8UMwLNDrJLP291GncYiNAs3sqAonO8BeBQN1D_vsvmyVUXIME3IxyWl-fLIFfAJHahSo71uTjkBMVFZnMs9eWneXJXgyquPZZ13ba6O5BEoUG-QkWp8hOoIJ1ciyDvdjFhdybMf3aKdfl93spbPaQ3voSwuhnGjDnpU5fSBkrCyFiAOzMObLBSGqWBG2CJHuETOCYz5xCE6Rcnxx4pJkoDSG-coBPT2P9zCqdZkNBd5xwRH')"
                    }}
                  />
                  <div className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full shadow-lg hover:bg-blue-600 transition-colors">
                    <Camera className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex flex-col gap-1 text-center sm:text-left">
                  <h3 className="text-lg font-bold text-text-primary-light dark:text-white">
                    Profile Picture
                  </h3>
                  <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm max-w-sm">
                    JPG, GIF or PNG. Max size of 800K. This photo will be visible to contractors you message.
                  </p>
                  <div className="flex gap-3 mt-3 justify-center sm:justify-start">
                    <Button size="sm" variant="outline">
                      Upload New
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
                </CardTitle>
                <Shield className="w-5 h-5 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="Alex" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="Johnson" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input id="email" type="email" defaultValue="alex.johnson@example.com" className="pl-10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" className="pl-10" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Property Address
              </CardTitle>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                Used to match you with local contractors nearby.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input id="address" defaultValue="1234 Maplewood Drive" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" defaultValue="Springfield" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <select className="w-full p-2 border border-border-light dark:border-border-dark rounded-md bg-background-light dark:bg-background-dark">
                      <option>Illinois</option>
                      <option>California</option>
                      <option>New York</option>
                      <option>Texas</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">Zip Code</Label>
                    <Input id="zip" defaultValue="62704" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex items-center justify-end gap-4">
            <Button variant="outline">Cancel</Button>
            <Button className="bg-primary hover:bg-blue-600 text-white">
              Save Changes
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          {/* Password */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Password & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input 
                      id="currentPassword" 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Enter current password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" placeholder="Enter new password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" placeholder="Confirm new password" />
                </div>
              </div>
              
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-sm mb-2">Password Requirements:</h4>
                <ul className="text-sm text-text-secondary-light dark:text-text-secondary-dark space-y-1">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    At least 8 characters long
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Contains uppercase and lowercase letters
                  </li>
                  <li className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    Contains at least one number
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Two-Factor Authentication */}
          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                Add an extra layer of security to your account
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 border border-border-light dark:border-border-dark rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold">SMS Authentication</h4>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                      Receive codes via text message
                    </p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                  Enabled
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex items-center justify-end gap-4">
            <Button variant="outline">Cancel</Button>
            <Button className="bg-primary hover:bg-blue-600 text-white">
              Update Security
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Methods
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-border-light dark:border-border-dark rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold">•••• •••• •••• 4242</h4>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                      Expires 12/25 • Visa
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>Default</Badge>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <Button variant="outline" className="w-full">
                Add New Payment Method
              </Button>
            </CardContent>
          </Card>

          {/* Billing History */}
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border-light dark:border-border-dark rounded-lg">
                  <div>
                    <h4 className="font-semibold">Premium Plan</h4>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                      Oct 1, 2023 - Nov 1, 2023
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">$29.99</p>
                    <Button variant="ghost" size="sm" className="text-primary">
                      Download
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-border-light dark:border-border-dark rounded-lg">
                  <div>
                    <h4 className="font-semibold">Premium Plan</h4>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                      Sep 1, 2023 - Oct 1, 2023
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">$29.99</p>
                    <Button variant="ghost" size="sm" className="text-primary">
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          {/* Email Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border-light dark:border-border-dark rounded-lg">
                  <div>
                    <h4 className="font-semibold">Email Notifications</h4>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                      Receive updates about your projects and bids
                    </p>
                  </div>
                  <label className="relative flex h-6 w-11 cursor-pointer items-center rounded-full border-none bg-gray-200 dark:bg-gray-700 p-0.5 has-[:checked]:bg-primary transition-all">
                    <div className="h-5 w-5 rounded-full bg-white shadow-sm transition-all has-[:checked]:translate-x-5"></div>
                    <input 
                      type="checkbox" 
                      className="invisible absolute"
                      checked={notifications.email}
                      onChange={(e) => handleNotificationChange('email', e.target.checked)}
                    />
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-border-light dark:border-border-dark rounded-lg">
                  <div>
                    <h4 className="font-semibold">SMS Notifications</h4>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                      Get text messages for urgent updates
                    </p>
                  </div>
                  <label className="relative flex h-6 w-11 cursor-pointer items-center rounded-full border-none bg-gray-200 dark:bg-gray-700 p-0.5 has-[:checked]:bg-primary transition-all">
                    <div className="h-5 w-5 rounded-full bg-white shadow-sm transition-all has-[:checked]:translate-x-5"></div>
                    <input 
                      type="checkbox" 
                      className="invisible absolute"
                      checked={notifications.sms}
                      onChange={(e) => handleNotificationChange('sms', e.target.checked)}
                    />
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-border-light dark:border-border-dark rounded-lg">
                  <div>
                    <h4 className="font-semibold">Push Notifications</h4>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                      Browser notifications for real-time updates
                    </p>
                  </div>
                  <label className="relative flex h-6 w-11 cursor-pointer items-center rounded-full border-none bg-gray-200 dark:bg-gray-700 p-0.5 has-[:checked]:bg-primary transition-all">
                    <div className="h-5 w-5 rounded-full bg-white shadow-sm transition-all has-[:checked]:translate-x-5"></div>
                    <input 
                      type="checkbox" 
                      className="invisible absolute"
                      checked={notifications.push}
                      onChange={(e) => handleNotificationChange('push', e.target.checked)}
                    />
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-border-light dark:border-border-dark rounded-lg">
                  <div>
                    <h4 className="font-semibold">Marketing Communications</h4>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                      Tips, guides, and promotional offers
                    </p>
                  </div>
                  <label className="relative flex h-6 w-11 cursor-pointer items-center rounded-full border-none bg-gray-200 dark:bg-gray-700 p-0.5 has-[:checked]:bg-primary transition-all">
                    <div className="h-5 w-5 rounded-full bg-white shadow-sm transition-all has-[:checked]:translate-x-5"></div>
                    <input 
                      type="checkbox" 
                      className="invisible absolute"
                      checked={notifications.marketing}
                      onChange={(e) => handleNotificationChange('marketing', e.target.checked)}
                    />
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex items-center justify-end gap-4">
            <Button variant="outline">Cancel</Button>
            <Button className="bg-primary hover:bg-blue-600 text-white">
              Save Preferences
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Security Note */}
      <div className="flex items-center justify-center gap-2 text-text-secondary-light dark:text-text-secondary-dark text-xs">
        <Shield className="w-4 h-4" />
        <span>Your data is encrypted and secure via SSL.</span>
      </div>
    </div>
  );
};

export default AccountSettings;