import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
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
  AlertTriangle,
  Download,
  Settings,
  Activity,
  Zap,
  Globe,
  Smartphone
} from 'lucide-react';

const AccountSettings = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    marketing: false,
    projectUpdates: true,
    bidAlerts: true,
    messages: true,
    newsletter: false
  });

  const handleNotificationChange = (type: string, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [type]: value
    }));
  };

  return (
    <div className="p-6 bg-gray-50/50 dark:bg-slate-950/50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Account Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Manage your profile, security, and preferences
          </p>
          <div className="flex items-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Activity className="w-4 h-4 text-green-500" />
              <span>Account active</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield className="w-4 h-4 text-accent" />
              <span>Verified account</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4 text-accent" />
              <span>Premium member</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-accent mb-1">Account Status</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">Active</p>
              </div>
              <div className="p-2.5 bg-accent/20 rounded-lg">
                <CheckCircle className="w-5 h-5 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 border-gray-200 dark:border-gray-800">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Member Since</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">2023</p>
              </div>
              <div className="p-2.5 bg-gray-200 dark:bg-gray-800 rounded-lg">
                <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 border-gray-200 dark:border-gray-800">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Security Score</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">95%</p>
              </div>
              <div className="p-2.5 bg-gray-200 dark:bg-gray-800 rounded-lg">
                <Shield className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 border-gray-200 dark:border-gray-800">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Plan</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">Premium</p>
              </div>
              <div className="p-2.5 bg-gray-200 dark:bg-gray-800 rounded-lg">
                <Zap className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-gray-100 dark:bg-gray-800 h-12">
          <TabsTrigger value="profile" className="font-semibold text-sm">Profile</TabsTrigger>
          <TabsTrigger value="security" className="font-semibold text-sm">Security</TabsTrigger>
          <TabsTrigger value="billing" className="font-semibold text-sm">Billing</TabsTrigger>
          <TabsTrigger value="notifications" className="font-semibold text-sm">Notifications</TabsTrigger>
          <TabsTrigger value="preferences" className="font-semibold text-sm">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          {/* Profile Picture */}
          <Card className="shadow-lg border-gray-200 dark:border-gray-800">
            <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Camera className="w-5 h-5 text-accent" />
                Profile Picture
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="relative group cursor-pointer">
                  <Avatar className="w-32 h-32 ring-4 ring-white dark:ring-gray-800 shadow-lg">
                    <AvatarImage src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKfw81NtWq6MjX9hmQPp9aILtiE7Qdj8UMwLNDrJLP291GncYiNAs3sqAonO8BeBQN1D_vsvmyVUXIME3IxyWl-fLIFfAJHahSo71uTjkBMVFZnMs9eWneXJXgyquPZZ13ba6O5BEoUG-QkWp8hOoIJ1ciyDvdjFhdybMf3aKdfl93spbPaQ3voSwuhnGjDnpU5fSBkrCyFiAOzMObLBSGqWBG2CJHuETOCYz5xCE6Rcnxx4pJkoDSG-coBPT2P9zCqdZkNBd5xwRH" />
                    <AvatarFallback className="text-2xl font-bold bg-accent text-accent-foreground">AJ</AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-2 right-2 bg-accent text-accent-foreground p-2 rounded-full shadow-lg hover:bg-accent/90 transition-colors">
                    <Camera className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex flex-col gap-2 text-center sm:text-left flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Profile Picture
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm max-w-md">
                    JPG, GIF or PNG. Max size of 2MB. This photo will be visible to contractors and in your profile.
                  </p>
                  <div className="flex gap-3 mt-3 justify-center sm:justify-start">
                    <Button className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2">
                      <Camera className="w-4 h-4" />
                      Upload New
                    </Button>
                    <Button variant="outline" className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 gap-2">
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card className="shadow-lg border-gray-200 dark:border-gray-800">
            <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="w-5 h-5 text-accent" />
                  Personal Information
                </CardTitle>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-semibold">First Name</Label>
                  <Input id="firstName" defaultValue="Alex" className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-semibold">Last Name</Label>
                  <Input id="lastName" defaultValue="Johnson" className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input id="email" type="email" defaultValue="alex.johnson@example.com" className="pl-11 h-11" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-semibold">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" className="pl-11 h-11" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card className="shadow-lg border-gray-200 dark:border-gray-800">
            <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="w-5 h-5 text-accent" />
                Property Address
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Used to match you with local contractors nearby
              </p>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address" className="text-sm font-semibold">Street Address</Label>
                  <Input id="address" defaultValue="123 Maple Dr" className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-sm font-semibold">City</Label>
                  <Input id="city" defaultValue="Austin" className="h-11" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="state" className="text-sm font-semibold">State</Label>
                    <select className="w-full h-11 px-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950">
                      <option>Texas</option>
                      <option>California</option>
                      <option>New York</option>
                      <option>Florida</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip" className="text-sm font-semibold">Zip Code</Label>
                    <Input id="zip" defaultValue="78701" className="h-11" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex items-center justify-end gap-4">
            <Button variant="outline" size="lg">Cancel</Button>
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
              Save Changes
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          {/* Password */}
          <Card className="shadow-lg border-gray-200 dark:border-gray-800">
            <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Lock className="w-5 h-5 text-accent" />
                Password & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="text-sm font-semibold">Current Password</Label>
                  <div className="relative">
                    <Input 
                      id="currentPassword" 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Enter current password"
                      className="h-11 pr-11"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-sm font-semibold">New Password</Label>
                  <Input id="newPassword" type="password" placeholder="Enter new password" className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-semibold">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" placeholder="Confirm new password" className="h-11" />
                </div>
              </div>
              
              <Card className="bg-gradient-to-r from-accent/10 to-accent/5 border-accent/20">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-sm mb-3 text-gray-900 dark:text-white">Password Requirements:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-gray-700 dark:text-gray-300">At least 8 characters long</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-gray-700 dark:text-gray-300">Contains uppercase and lowercase letters</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      <span className="text-gray-700 dark:text-gray-300">Contains at least one number</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      <span className="text-gray-700 dark:text-gray-300">Contains at least one special character</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </CardContent>
          </Card>

          {/* Two-Factor Authentication */}
          <Card className="shadow-lg border-gray-200 dark:border-gray-800">
            <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="w-5 h-5 text-accent" />
                Two-Factor Authentication
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Add an extra layer of security to your account
              </p>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between p-5 border-2 border-green-200 dark:border-green-800 rounded-xl bg-green-50 dark:bg-green-900/20">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                    <Smartphone className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">SMS Authentication</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Receive verification codes via text message
                    </p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-3 py-1">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Enabled
                </Badge>
              </div>

              <div className="flex items-center justify-between p-5 border border-gray-200 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-xl">
                    <Mail className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Email Authentication</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Receive verification codes via email
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Enable
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Login History */}
          <Card className="shadow-lg border-gray-200 dark:border-gray-800">
            <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Activity className="w-5 h-5 text-accent" />
                Recent Login Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {[
                  { device: 'Chrome on Windows', location: 'Austin, TX', time: '2 hours ago', current: true },
                  { device: 'Safari on iPhone', location: 'Austin, TX', time: '1 day ago', current: false },
                  { device: 'Chrome on MacBook', location: 'Austin, TX', time: '3 days ago', current: false }
                ].map((login, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{login.device}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{login.location} • {login.time}</p>
                      </div>
                    </div>
                    {login.current && (
                      <Badge className="bg-accent/20 text-accent border-accent/30">Current</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex items-center justify-end gap-4">
            <Button variant="outline" size="lg">Cancel</Button>
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
              Update Security
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          {/* Current Plan */}
          <Card className="shadow-lg bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
            <CardHeader className="border-b border-accent/20">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-accent text-lg">
                  <Zap className="w-5 h-5" />
                  Current Plan
                </CardTitle>
                <Badge className="bg-accent text-accent-foreground px-3 py-1">Premium</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">$29.99/month</h3>
                  <p className="text-gray-600 dark:text-gray-400">Billed monthly • Next billing: Nov 1, 2024</p>
                </div>
                <Button variant="outline" className="hover:bg-accent/10 border-accent/20 text-accent">
                  Upgrade Plan
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white dark:bg-gray-900 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Projects</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">Unlimited</p>
                </div>
                <div className="p-4 bg-white dark:bg-gray-900 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Support</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">Priority</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card className="shadow-lg border-gray-200 dark:border-gray-800">
            <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
              <CardTitle className="flex items-center gap-2 text-lg">
                <CreditCard className="w-5 h-5 text-accent" />
                Payment Methods
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between p-5 border-2 border-accent/30 rounded-xl bg-accent/5">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-accent/20 rounded-xl">
                    <CreditCard className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">•••• •••• •••• 4242</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Expires 12/25 • Visa
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-accent/20 text-accent border-accent/30">Default</Badge>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <Button variant="outline" className="w-full h-12 hover:bg-accent/10 border-accent/20 text-accent font-semibold">
                + Add New Payment Method
              </Button>
            </CardContent>
          </Card>

          {/* Billing History */}
          <Card className="shadow-lg border-gray-200 dark:border-gray-800">
            <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
              <CardTitle className="text-lg">Billing History</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {[
                  { date: 'Oct 1, 2024', plan: 'Premium Plan', amount: '$29.99', status: 'Paid' },
                  { date: 'Sep 1, 2024', plan: 'Premium Plan', amount: '$29.99', status: 'Paid' },
                  { date: 'Aug 1, 2024', plan: 'Premium Plan', amount: '$29.99', status: 'Paid' }
                ].map((invoice, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{invoice.plan}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{invoice.date}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 dark:text-white">{invoice.amount}</p>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-xs">
                          {invoice.status}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="sm" className="text-accent hover:bg-accent/10">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          {/* Email Notifications */}
          <Card className="shadow-lg border-gray-200 dark:border-gray-800">
            <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Bell className="w-5 h-5 text-accent" />
                Notification Preferences
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Choose how you want to be notified about updates
              </p>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {[
                { 
                  id: 'projectUpdates', 
                  title: 'Project Updates', 
                  description: 'Get notified about project milestones and progress',
                  icon: Activity,
                  checked: notifications.projectUpdates
                },
                { 
                  id: 'bidAlerts', 
                  title: 'Bid Alerts', 
                  description: 'Receive notifications when contractors submit bids',
                  icon: Bell,
                  checked: notifications.bidAlerts
                },
                { 
                  id: 'messages', 
                  title: 'Messages', 
                  description: 'Get notified about new messages from contractors',
                  icon: Mail,
                  checked: notifications.messages
                },
                { 
                  id: 'email', 
                  title: 'Email Notifications', 
                  description: 'Receive updates via email',
                  icon: Mail,
                  checked: notifications.email
                },
                { 
                  id: 'sms', 
                  title: 'SMS Notifications', 
                  description: 'Get text messages for urgent updates',
                  icon: Smartphone,
                  checked: notifications.sms
                },
                { 
                  id: 'push', 
                  title: 'Push Notifications', 
                  description: 'Browser notifications for real-time updates',
                  icon: Bell,
                  checked: notifications.push
                },
                { 
                  id: 'newsletter', 
                  title: 'Newsletter', 
                  description: 'Weekly tips and platform updates',
                  icon: Mail,
                  checked: notifications.newsletter
                },
                { 
                  id: 'marketing', 
                  title: 'Marketing Communications', 
                  description: 'Promotional offers and special deals',
                  icon: Zap,
                  checked: notifications.marketing
                }
              ].map((notification) => (
                <div key={notification.id} className="flex items-center justify-between p-5 border border-gray-200 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      <notification.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{notification.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {notification.description}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={notification.checked}
                    onCheckedChange={(checked) => handleNotificationChange(notification.id, checked)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex items-center justify-end gap-4">
            <Button variant="outline" size="lg">Cancel</Button>
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
              Save Preferences
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          {/* Language & Region */}
          <Card className="shadow-lg border-gray-200 dark:border-gray-800">
            <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Globe className="w-5 h-5 text-accent" />
                Language & Region
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="language" className="text-sm font-semibold">Language</Label>
                  <select className="w-full h-11 px-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950">
                    <option>English (US)</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone" className="text-sm font-semibold">Timezone</Label>
                  <select className="w-full h-11 px-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950">
                    <option>Central Time (CT)</option>
                    <option>Eastern Time (ET)</option>
                    <option>Pacific Time (PT)</option>
                    <option>Mountain Time (MT)</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card className="shadow-lg border-gray-200 dark:border-gray-800">
            <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="w-5 h-5 text-accent" />
                Privacy Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between p-5 border border-gray-200 dark:border-gray-800 rounded-xl">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Profile Visibility</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Make your profile visible to contractors
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-5 border border-gray-200 dark:border-gray-800 rounded-xl">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Show Project History</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Display your completed projects to contractors
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-5 border border-gray-200 dark:border-gray-800 rounded-xl">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Activity Status</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Show when you're online
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="shadow-lg border-2 border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-900/10">
            <CardHeader className="border-b border-red-200 dark:border-red-900">
              <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400 text-lg">
                <AlertTriangle className="w-5 h-5" />
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Deactivate Account</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Temporarily disable your account
                  </p>
                </div>
                <Button variant="outline" className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200">
                  Deactivate
                </Button>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-red-200 dark:border-red-900">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Delete Account</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Permanently delete your account and all data
                  </p>
                </div>
                <Button variant="outline" className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200">
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex items-center justify-end gap-4">
            <Button variant="outline" size="lg">Cancel</Button>
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
              Save Preferences
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Security Note */}
      <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
        <Shield className="w-4 h-4 text-accent" />
        <span>Your data is encrypted and secure with 256-bit SSL encryption</span>
      </div>
      </div>
    </div>
  );
};

export default AccountSettings;
