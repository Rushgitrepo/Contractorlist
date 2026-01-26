import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  User,
  Building,
  MapPin,
  Phone,
  Mail,
  Globe,
  Star,
  Award,
  Upload,
  Edit,
  Save,
  Camera,
  Plus,
  X,
  CheckCircle,
  Shield,
  FileText,
  Calendar
} from 'lucide-react';

const MyProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

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

  return (
    <div className="p-4 sm:p-6 lg:p-8 pb-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight mb-2">My Profile</h1>
            <p className="text-text-secondary-light dark:text-text-secondary-dark">
              Manage your company profile and showcase your expertise
            </p>
          </div>
          <Button 
            onClick={() => setIsEditing(!isEditing)}
            className={isEditing ? "bg-green-600 hover:bg-green-700 text-white" : "bg-primary hover:bg-yellow-400 text-black"}
          >
            {isEditing ? (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
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
            <Card className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <div className="size-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Building className="w-12 h-12 text-primary" />
                    </div>
                    {isEditing && (
                      <Button size="sm" className="absolute -bottom-2 -right-2 rounded-full p-2">
                        <Camera className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <h2 className="text-xl font-bold mb-1">Acme Construction</h2>
                  <p className="text-text-secondary-light dark:text-text-secondary-dark mb-2">HVAC Specialists</p>
                  <div className="flex items-center justify-center gap-1 mb-4">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium ml-2">4.9 (127 reviews)</span>
                  </div>
                  <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified Contractor
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-text-secondary-light dark:text-text-secondary-dark" />
                    {isEditing ? (
                      <Input defaultValue="Austin, TX" className="flex-1" />
                    ) : (
                      <span className="text-sm">Austin, TX</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-text-secondary-light dark:text-text-secondary-dark" />
                    {isEditing ? (
                      <Input defaultValue="(512) 555-0123" className="flex-1" />
                    ) : (
                      <span className="text-sm">(512) 555-0123</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-text-secondary-light dark:text-text-secondary-dark" />
                    {isEditing ? (
                      <Input defaultValue="contact@acmeconstruction.com" className="flex-1" />
                    ) : (
                      <span className="text-sm">contact@acmeconstruction.com</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-text-secondary-light dark:text-text-secondary-dark" />
                    {isEditing ? (
                      <Input defaultValue="www.acmeconstruction.com" className="flex-1" />
                    ) : (
                      <span className="text-sm">www.acmeconstruction.com</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark">
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Projects Completed</span>
                  <span className="font-bold">247</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Years in Business</span>
                  <span className="font-bold">15</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Win Rate</span>
                  <span className="font-bold text-green-600">24%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Response Time</span>
                  <span className="font-bold">{"< 2 hours"}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Detailed Info */}
          <div className="lg:w-2/3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="certifications">Certifications</TabsTrigger>
                <TabsTrigger value="gallery">Gallery</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark">
                  <CardHeader>
                    <CardTitle>Company Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <Textarea
                        defaultValue="Acme Construction is a leading HVAC contractor serving the Austin metropolitan area for over 15 years. We specialize in commercial and residential HVAC installation, maintenance, and energy efficiency solutions. Our team of certified technicians is committed to delivering high-quality work on time and within budget."
                        rows={6}
                        className="w-full"
                      />
                    ) : (
                      <p className="text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
                        Acme Construction is a leading HVAC contractor serving the Austin metropolitan area for over 15 years. 
                        We specialize in commercial and residential HVAC installation, maintenance, and energy efficiency solutions. 
                        Our team of certified technicians is committed to delivering high-quality work on time and within budget.
                      </p>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark">
                  <CardHeader>
                    <CardTitle>Service Areas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {['Austin', 'Round Rock', 'Cedar Park', 'Georgetown', 'Pflugerville', 'Leander'].map((area) => (
                        <div key={area} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <span className="text-sm font-medium">{area}</span>
                          {isEditing && (
                            <Button variant="ghost" size="sm" className="p-1">
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      {isEditing && (
                        <Button variant="outline" className="p-3 border-dashed">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Area
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark">
                  <CardHeader>
                    <CardTitle>Profile Visibility</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="public-profile">Public Profile</Label>
                        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                          Allow your profile to be visible in contractor directory
                        </p>
                      </div>
                      <Switch id="public-profile" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="contact-info">Contact Information</Label>
                        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                          Show phone and email to potential clients
                        </p>
                      </div>
                      <Switch id="contact-info" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="project-gallery">Project Gallery</Label>
                        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                          Display your completed projects
                        </p>
                      </div>
                      <Switch id="project-gallery" defaultChecked />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="services" className="space-y-6">
                <Card className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark">
                  <CardHeader>
                    <CardTitle>Services Offered</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {services.map((service, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <span className="font-medium">{service}</span>
                          {isEditing && (
                            <Button variant="ghost" size="sm" className="p-1 text-red-600">
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      {isEditing && (
                        <Button variant="outline" className="p-4 border-dashed">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Service
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark">
                  <CardHeader>
                    <CardTitle>Specializations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {['Commercial HVAC', 'Energy Efficiency', 'Preventive Maintenance', 'Emergency Repairs', 'System Design'].map((spec) => (
                        <Badge key={spec} className="bg-primary/10 text-primary border border-primary/20">
                          {spec}
                          {isEditing && (
                            <X className="w-3 h-3 ml-1 cursor-pointer" />
                          )}
                        </Badge>
                      ))}
                      {isEditing && (
                        <Button variant="outline" size="sm" className="border-dashed">
                          <Plus className="w-3 h-3 mr-1" />
                          Add
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="certifications" className="space-y-6">
                <Card className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Licenses & Certifications</CardTitle>
                    {isEditing && (
                      <Button size="sm" className="bg-primary hover:bg-yellow-400 text-black">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Certification
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {certifications.map((cert, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Award className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-semibold">{cert.name}</h4>
                              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                                Issued by {cert.issuer} • Expires {cert.expiry}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {cert.verified ? (
                              <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                                <Shield className="w-3 h-3 mr-1" />
                                Verified
                              </Badge>
                            ) : (
                              <Badge className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">
                                Pending
                              </Badge>
                            )}
                            {isEditing && (
                              <Button variant="ghost" size="sm" className="p-1">
                                <Edit className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark">
                  <CardHeader>
                    <CardTitle>Insurance & Bonding</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <Shield className="w-5 h-5 text-green-600" />
                          <h4 className="font-semibold">General Liability</h4>
                        </div>
                        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                          $2M Coverage • Expires Dec 2024
                        </p>
                        <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 mt-2">
                          Active
                        </Badge>
                      </div>
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <Shield className="w-5 h-5 text-green-600" />
                          <h4 className="font-semibold">Workers' Compensation</h4>
                        </div>
                        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                          $1M Coverage • Expires Dec 2024
                        </p>
                        <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 mt-2">
                          Active
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="gallery" className="space-y-6">
                <Card className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Project Gallery</CardTitle>
                    {isEditing && (
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
                          <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                            <div className="w-full h-full flex items-center justify-center">
                              <Building className="w-12 h-12 text-gray-400" />
                            </div>
                          </div>
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                            <div className="text-center text-white">
                              <h4 className="font-semibold mb-1">{project.title}</h4>
                              <Badge className="bg-white/20 text-white">{project.category}</Badge>
                            </div>
                          </div>
                          {isEditing && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="absolute top-2 right-2 p-1 bg-red-600 hover:bg-red-700 text-white"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      {isEditing && (
                        <div className="aspect-video border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
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
      </div>
    </div>
  );
};

export default MyProfile;