import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Building,
  Bell,
  Shield,
  CreditCard,
  Globe,
  Mail,
  Phone,
  MapPin,
  Save,
  Eye,
  EyeOff,
  Star,
  Award,
  Upload,
  Camera,
  Plus,
  X, // Added X to imports
  CheckCircle,
  Edit
} from 'lucide-react';

const AccountSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    marketing: false
  });

  // Profile State from MyProfile
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileActiveTab, setProfileActiveTab] = useState('overview');

  const services = [
    'HVAC Installation',
    'HVAC Maintenance',
    'Commercial HVAC',
    'Residential HVAC',
    'Energy Efficiency Consulting'
  ];

  const certifications = [
    { name: 'EPA Section 608', issuer: 'EPA', expiry: '2025-12-31', verified: true },
    { name: 'NATE Certified', issuer: 'NATE', expiry: '2024-06-30', verified: true },
    { name: 'OSHA 30-Hour', issuer: 'OSHA', expiry: '2026-03-15', verified: false }
  ];

  const projectGallery = [
    { id: 1, title: 'Medical Center HVAC', image: '/placeholder-project-1.jpg', category: 'Commercial' },
    { id: 2, title: 'School Renovation', image: '/placeholder-project-2.jpg', category: 'Public Works' },
    { id: 3, title: 'Apartment Complex', image: '/placeholder-project-3.jpg', category: 'Multi-Family' },
    { id: 4, title: 'Office Building', image: '/placeholder-project-4.jpg', category: 'Commercial' }
  ];

  const [profileData, setProfileData] = useState({
    companyName: 'Acme Construction',
    contactName: 'John Smith',
    email: 'john@acmeconstruction.com',
    phone: '(555) 123-4567',
    address: '123 Main St, Austin, TX 78701',
    website: 'www.acmeconstruction.com',
    description: 'Professional HVAC and electrical contractor with 15+ years of experience.',
    licenseNumber: 'TX-HVAC-12345',
    insuranceAmount: '$2,000,000'
  });

  const handleProfileUpdate = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationChange = (type: string, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [type]: value
    }));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Account Settings</h1>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">
            Manage your account preferences and company information
          </p>
        </div>

        {/* Settings Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          {/* Rich Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="flex justify-end mb-4">
              <Button
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className={isEditingProfile ? "bg-yellow-400 hover:bg-yellow-500 text-black" : "bg-primary hover:bg-yellow-400 text-black"}
              >
                {isEditingProfile ? (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save & Exit
                  </>
                ) : (
                  <>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </>
                )}
              </Button>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left Column - Profile Info */}
              <div className="lg:w-1/3 space-y-6">
                {/* Profile Card */}
                <Card className="bg-white dark:bg-[#1c1e24] border-gray-200 dark:border-white/5">
                  <CardContent className="p-6">
                    <div className="text-center mb-6">
                      <div className="relative inline-block">
                        <div className="size-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                          <Building className="w-12 h-12 text-primary" />
                        </div>
                        {isEditingProfile && (
                          <Button size="sm" className="absolute -bottom-2 -right-2 rounded-full p-2 h-8 w-8">
                            <Camera className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      <h2 className="text-xl font-bold mb-1 text-gray-900 dark:text-white">Acme Construction</h2>
                      <p className="text-gray-500 dark:text-gray-400 mb-2">HVAC Specialists</p>
                      <div className="flex items-center justify-center gap-1 mb-4">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium ml-2 text-gray-700 dark:text-gray-300">4.9 (127 reviews)</span>
                      </div>
                      <Badge className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-none">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified Contractor
                      </Badge>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        {isEditingProfile ? (
                          <Input defaultValue="Austin, TX" className="flex-1 h-8" />
                        ) : (
                          <span className="text-sm text-gray-700 dark:text-gray-300">Austin, TX</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-gray-400" />
                        {isEditingProfile ? (
                          <Input defaultValue="(512) 555-0123" className="flex-1 h-8" />
                        ) : (
                          <span className="text-sm text-gray-700 dark:text-gray-300">(512) 555-0123</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-gray-400" />
                        {isEditingProfile ? (
                          <Input defaultValue="contact@acmeconstruction.com" className="flex-1 h-8" />
                        ) : (
                          <span className="text-sm text-gray-700 dark:text-gray-300">contact@acmeconstruction.com</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <Globe className="w-4 h-4 text-gray-400" />
                        {isEditingProfile ? (
                          <Input defaultValue="www.acmeconstruction.com" className="flex-1 h-8" />
                        ) : (
                          <span className="text-sm text-gray-700 dark:text-gray-300">www.acmeconstruction.com</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card className="bg-white dark:bg-[#1c1e24] border-gray-200 dark:border-white/5">
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Projects Completed</span>
                      <span className="font-bold text-gray-900 dark:text-white">247</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Years in Business</span>
                      <span className="font-bold text-gray-900 dark:text-white">15</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Win Rate</span>
                      <span className="font-bold text-yellow-600">24%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Response Time</span>
                      <span className="font-bold text-gray-900 dark:text-white">{"< 2 hours"}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Detailed Info */}
              <div className="lg:w-2/3">
                <Tabs value={profileActiveTab} onValueChange={setProfileActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-4 bg-gray-100 dark:bg-white/5 p-1 rounded-xl">
                    <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-[#1c1e24]">Overview</TabsTrigger>
                    <TabsTrigger value="services" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-[#1c1e24]">Services</TabsTrigger>
                    <TabsTrigger value="certifications" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-[#1c1e24]">Certs</TabsTrigger>
                    <TabsTrigger value="gallery" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-[#1c1e24]">Gallery</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-6 mt-6">
                    <Card className="bg-white dark:bg-[#1c1e24] border-gray-200 dark:border-white/5">
                      <CardHeader>
                        <CardTitle>Company Description</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {isEditingProfile ? (
                          <Textarea
                            defaultValue="Acme Construction is a leading HVAC contractor serving the Austin metropolitan area for over 15 years. We specialize in commercial and residential HVAC installation, maintenance, and energy efficiency solutions. Our team of certified technicians is committed to delivering high-quality work on time and within budget."
                            rows={6}
                            className="w-full bg-gray-50 dark:bg-black/20"
                          />
                        ) : (
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            Acme Construction is a leading HVAC contractor serving the Austin metropolitan area for over 15 years.
                            We specialize in commercial and residential HVAC installation, maintenance, and energy efficiency solutions.
                            Our team of certified technicians is committed to delivering high-quality work on time and within budget.
                          </p>
                        )}
                      </CardContent>
                    </Card>

                    <Card className="bg-white dark:bg-[#1c1e24] border-gray-200 dark:border-white/5">
                      <CardHeader>
                        <CardTitle>Service Areas</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {['Austin', 'Round Rock', 'Cedar Park', 'Georgetown', 'Pflugerville', 'Leander'].map((area) => (
                            <div key={area} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-black/20 rounded-lg border border-gray-100 dark:border-white/5">
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{area}</span>
                              {isEditingProfile && (
                                <Button variant="ghost" size="sm" className="p-1 h-6 w-6">
                                  <X className="w-3 h-3" />
                                </Button>
                              )}
                            </div>
                          ))}
                          {isEditingProfile && (
                            <Button variant="outline" className="p-3 border-dashed border-gray-300 dark:border-gray-700">
                              <Plus className="w-4 h-4 mr-2" />
                              Add Area
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white dark:bg-[#1c1e24] border-gray-200 dark:border-white/5">
                      <CardHeader>
                        <CardTitle>Profile Visibility</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="public-profile" className="font-semibold">Public Profile</Label>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Allow your profile to be visible in contractor directory
                            </p>
                          </div>
                          <Switch id="public-profile" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="contact-info" className="font-semibold">Contact Information</Label>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Show phone and email to potential clients
                            </p>
                          </div>
                          <Switch id="contact-info" defaultChecked />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="services" className="space-y-6 mt-6">
                    <Card className="bg-white dark:bg-[#1c1e24] border-gray-200 dark:border-white/5">
                      <CardHeader>
                        <CardTitle>Services Offered</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {services.map((service, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-black/20 rounded-lg border border-gray-100 dark:border-white/5">
                              <span className="font-medium text-gray-700 dark:text-gray-300">{service}</span>
                              {isEditingProfile && (
                                <Button variant="ghost" size="sm" className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8">
                                  <X className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                          {isEditingProfile && (
                            <Button variant="outline" className="p-4 border-dashed border-gray-300 dark:border-gray-700 h-auto py-4">
                              <Plus className="w-4 h-4 mr-2" />
                              Add Service
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white dark:bg-[#1c1e24] border-gray-200 dark:border-white/5">
                      <CardHeader>
                        <CardTitle>Specializations</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {['Commercial HVAC', 'Energy Efficiency', 'Preventive Maintenance', 'Emergency Repairs', 'System Design'].map((spec) => (
                            <Badge key={spec} className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20">
                              {spec}
                              {isEditingProfile && (
                                <X className="w-3 h-3 ml-1 cursor-pointer" />
                              )}
                            </Badge>
                          ))}
                          {isEditingProfile && (
                            <Button variant="outline" size="sm" className="border-dashed border-gray-300 dark:border-gray-700">
                              <Plus className="w-3 h-3 mr-1" />
                              Add
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="certifications" className="space-y-6 mt-6">
                    <Card className="bg-white dark:bg-[#1c1e24] border-gray-200 dark:border-white/5">
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Licenses & Certifications</CardTitle>
                        {isEditingProfile && (
                          <Button size="sm" className="bg-primary hover:bg-yellow-400 text-black">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Certification
                          </Button>
                        )}
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {certifications.map((cert, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-black/20 rounded-lg border border-gray-100 dark:border-white/5">
                              <div className="flex items-center gap-4">
                                <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                  <Award className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-900 dark:text-white">{cert.name}</h4>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Issued by {cert.issuer} • Expires {cert.expiry}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {cert.verified ? (
                                  <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-none">
                                    <Shield className="w-3 h-3 mr-1" />
                                    Verified
                                  </Badge>
                                ) : (
                                  <Badge className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-none">
                                    Pending
                                  </Badge>
                                )}
                                {isEditingProfile && (
                                  <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="gallery" className="space-y-6 mt-6">
                    <Card className="bg-white dark:bg-[#1c1e24] border-gray-200 dark:border-white/5">
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Project Gallery</CardTitle>
                        {isEditingProfile && (
                          <Button size="sm" className="bg-primary hover:bg-yellow-400 text-black">
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Photos
                          </Button>
                        )}
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {projectGallery.map((project) => (
                            <div key={project.id} className="relative group">
                              <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                                <div className="w-full h-full flex items-center justify-center">
                                  <Building className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                                </div>
                              </div>
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                <div className="text-center text-white p-2">
                                  <h4 className="font-semibold mb-1 text-sm">{project.title}</h4>
                                  <Badge className="bg-white/20 text-white border-none text-xs">{project.category}</Badge>
                                </div>
                              </div>
                              {isEditingProfile && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="absolute top-2 right-2 p-1 bg-red-600 hover:bg-red-700 text-white h-7 w-7 rounded-full"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                          {isEditingProfile && (
                            <div className="aspect-video border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg flex items-center justify-center cursor-pointer hover:border-primary transition-colors bg-gray-50 dark:bg-black/20">
                              <div className="text-center">
                                <Plus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-500">Add Photo</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span className="font-medium">Email Notifications</span>
                      </div>
                      <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                        Receive notifications about bids, projects, and messages
                      </p>
                    </div>
                    <Switch
                      checked={notifications.email}
                      onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span className="font-medium">SMS Notifications</span>
                      </div>
                      <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                        Get urgent notifications via text message
                      </p>
                    </div>
                    <Switch
                      checked={notifications.sms}
                      onCheckedChange={(checked) => handleNotificationChange('sms', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4" />
                        <span className="font-medium">Push Notifications</span>
                      </div>
                      <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                        Browser notifications for real-time updates
                      </p>
                    </div>
                    <Switch
                      checked={notifications.push}
                      onCheckedChange={(checked) => handleNotificationChange('push', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        <span className="font-medium">Marketing Communications</span>
                      </div>
                      <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                        Updates about new features and platform news
                      </p>
                    </div>
                    <Switch
                      checked={notifications.marketing}
                      onCheckedChange={(checked) => handleNotificationChange('marketing', checked)}
                    />
                  </div>
                </div>

                <Button className="bg-primary hover:bg-yellow-400 text-black font-semibold">
                  <Save className="w-4 h-4 mr-2" />
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter current password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="Enter new password"
                    />
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="bg-primary hover:bg-yellow-400 text-black font-semibold">
                    Update Password
                  </Button>
                  <Button variant="outline">Cancel</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="space-y-6">
            <Card className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Billing Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-yellow-800 dark:text-yellow-300">Professional Plan</h3>
                      <p className="text-sm text-yellow-700 dark:text-yellow-400">
                        Active until March 15, 2024
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-yellow-800 dark:text-yellow-300">$49</p>
                      <p className="text-sm text-yellow-700 dark:text-yellow-400">/month</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="**** **** **** 1234"
                      disabled
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        placeholder="MM/YY"
                        disabled
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="***"
                        disabled
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="billingAddress">Billing Address</Label>
                    <Textarea
                      id="billingAddress"
                      value="123 Main St, Austin, TX 78701"
                      disabled
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline">Update Payment Method</Button>
                  <Button variant="outline">View Billing History</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AccountSettings;
