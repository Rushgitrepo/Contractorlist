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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
  Plus,
  Smartphone,
  RefreshCw,
  X,
  Trash2,
  Calendar
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import { companyService } from '@/api/companyService';
import { uploadService } from '@/api/uploadService';
import { Loader2 } from 'lucide-react';

const AccountSettings = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<null | 'success' | 'error'>(null);
  const [uploading, setUploading] = useState<string | null>(null);

  // License Management State
  const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);
  const [editingLicenseIndex, setEditingLicenseIndex] = useState<number | null>(null);
  const [licenseForm, setLicenseForm] = useState({
    name: '',
    license_number: '',
    issuing_authority: '',
    issue_date: '',
    expiry_date: ''
  });

  // Certification Management State
  const [isCertificationModalOpen, setIsCertificationModalOpen] = useState(false);
  const [editingCertificationIndex, setEditingCertificationIndex] = useState<number | null>(null);
  const [certificationForm, setCertificationForm] = useState({
    name: '',
    certification_number: '',
    issuing_organization: '',
    issue_date: '',
    expiry_date: ''
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(fieldName);
    try {
      const response = await uploadService.uploadImage(file);
      if (response.success) {
        setCompanyData((prev: any) => ({
          ...prev,
          [fieldName]: response.url
        }));
        toast({
          title: "Image Uploaded",
          description: "Your image has been uploaded successfully."
        });
      }
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your image.",
        variant: "destructive"
      });
    } finally {
      setUploading(null);
    }
  };
  const [companyData, setCompanyData] = useState<any>({
    company_name: '',
    tagline: '',
    description: '',
    phone: '',
    email: '',
    address: '',
    website: '',
    license_number: '',
    professional_category: '',
    budget_range: '$$$',
    years_in_business: 0,
    employees_count: '',
    responds_quickly: false,
    family_owned: false,
    eco_friendly: false,
    locally_owned: false,
    offers_custom_work: false,
    provides_3d_visualization: false,
  });

  const [activeNotifications, setActiveNotifications] = useState<Record<string, boolean>>({
    'New Bid Opportunities': true,
    'Project Updates': true,
    'Team Invitations': true,
    'Document Approvals': false,
    'System Updates': true
  });

  React.useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await companyService.getMyCompanyProfile();
      if (response.success && response.data) {
        setCompanyData({
          ...response.data,
          image_url: response.data.image_url || response.data.images?.[0] || '',
          image_url_2: response.data.image_url_2 || response.data.images?.[1] || '',
          image_url_3: response.data.image_url_3 || response.data.images?.[2] || '',
        });
      }
    } catch (error) {
      console.error('Fetch profile error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await companyService.updateMyCompanyProfile(companyData);
      if (response.success) {
        setIsEditing(false);
        toast({
          title: "Profile Updated",
          description: "Your company information has been successfully saved.",
        });
      }
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Could not save your changes. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setCompanyData(prev => ({ ...prev, [id]: value }));
  };

  const handleSwitchChange = (id: string, checked: boolean) => {
    setCompanyData(prev => ({ ...prev, [id]: checked }));
  };

  const handleSync = () => {
    setIsSyncing(true);
    setSyncStatus(null);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncStatus('success');
      toast({
        title: "Directory Synced",
        description: "Your phone contacts have been successfully imported and matched.",
      });
    }, 2000);
  };

  const toggleNotification = (title: string) => {
    const isNowEnabled = !activeNotifications[title];
    setActiveNotifications(prev => ({
      ...prev,
      [title]: isNowEnabled
    }));
    toast({
      title: "Settings Updated",
      description: `Notification for "${title}" has been ${isNowEnabled ? 'enabled' : 'disabled'}.`,
    });
  };

  // Parse licenses from licenses field
  const parseLicenses = () => {
    try {
      if (Array.isArray(companyData.licenses)) {
        return companyData.licenses.map((lic: any) => {
          if (typeof lic === 'string') {
            try {
              return JSON.parse(lic);
            } catch {
              return { name: lic, license_number: '', issuing_authority: '', issue_date: '', expiry_date: '' };
            }
          }
          return lic;
        });
      }
      return [];
    } catch {
      return [];
    }
  };

  // Parse certifications from certifications field
  const parseCertifications = () => {
    try {
      if (Array.isArray(companyData.certifications)) {
        return companyData.certifications.map((cert: any) => {
          if (typeof cert === 'string') {
            try {
              return JSON.parse(cert);
            } catch {
              return { name: cert, certification_number: '', issuing_organization: '', issue_date: '', expiry_date: '' };
            }
          }
          return cert;
        });
      }
      return [];
    } catch {
      return [];
    }
  };

  const licenses = parseLicenses();
  const certifications = parseCertifications();

  const getLicenseStatus = (expiryDate: string) => {
    if (!expiryDate) return 'Active';
    const expiry = new Date(expiryDate);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) return 'Expired';
    if (daysUntilExpiry < 30) return 'Expires Soon';
    return 'Active';
  };

  // License Management Functions
  const handleAddLicense = () => {
    setEditingLicenseIndex(null);
    setLicenseForm({
      name: '',
      license_number: '',
      issuing_authority: '',
      issue_date: '',
      expiry_date: ''
    });
    setIsLicenseModalOpen(true);
  };

  const handleEditLicense = (index: number) => {
    setEditingLicenseIndex(index);
    setLicenseForm(licenses[index]);
    setIsLicenseModalOpen(true);
  };

  const handleDeleteLicense = (index: number) => {
    const updatedLicenses = licenses.filter((_: any, i: number) => i !== index);
    setCompanyData((prev: any) => ({
      ...prev,
      licenses: updatedLicenses
    }));
    toast({
      title: "License Deleted",
      description: "The license has been removed."
    });
  };

  const handleSaveLicense = () => {
    if (!licenseForm.name || !licenseForm.license_number) {
      toast({
        title: "Missing Information",
        description: "Please provide at least a license name and number.",
        variant: "destructive"
      });
      return;
    }

    let updatedLicenses;
    if (editingLicenseIndex !== null) {
      updatedLicenses = licenses.map((lic: any, i: number) =>
        i === editingLicenseIndex ? licenseForm : lic
      );
    } else {
      updatedLicenses = [...licenses, licenseForm];
    }

    setCompanyData((prev: any) => ({
      ...prev,
      licenses: updatedLicenses
    }));

    setIsLicenseModalOpen(false);
    toast({
      title: editingLicenseIndex !== null ? "License Updated" : "License Added",
      description: `${licenseForm.name} has been ${editingLicenseIndex !== null ? 'updated' : 'added'} successfully.`
    });
  };

  // Certification Management Functions
  const handleAddCertification = () => {
    setEditingCertificationIndex(null);
    setCertificationForm({
      name: '',
      certification_number: '',
      issuing_organization: '',
      issue_date: '',
      expiry_date: ''
    });
    setIsCertificationModalOpen(true);
  };

  const handleEditCertification = (index: number) => {
    setEditingCertificationIndex(index);
    setCertificationForm(certifications[index]);
    setIsCertificationModalOpen(true);
  };

  const handleDeleteCertification = (index: number) => {
    const updatedCertifications = certifications.filter((_: any, i: number) => i !== index);
    setCompanyData((prev: any) => ({
      ...prev,
      certifications: updatedCertifications
    }));
    toast({
      title: "Certification Deleted",
      description: "The certification has been removed."
    });
  };

  const handleSaveCertification = () => {
    if (!certificationForm.name) {
      toast({
        title: "Missing Information",
        description: "Please provide at least a certification name.",
        variant: "destructive"
      });
      return;
    }

    let updatedCertifications;
    if (editingCertificationIndex !== null) {
      updatedCertifications = certifications.map((cert: any, i: number) =>
        i === editingCertificationIndex ? certificationForm : cert
      );
    } else {
      updatedCertifications = [...certifications, certificationForm];
    }

    setCompanyData((prev: any) => ({
      ...prev,
      certifications: updatedCertifications
    }));

    setIsCertificationModalOpen(false);
    toast({
      title: editingCertificationIndex !== null ? "Certification Updated" : "Certification Added",
      description: `${certificationForm.name} has been ${editingCertificationIndex !== null ? 'updated' : 'added'} successfully.`
    });
  };

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
          <TabsList className="grid w-full grid-cols-5 bg-gray-100 dark:bg-[#1c1e24] p-1 border border-gray-200 dark:border-white/5 rounded-xl">
            <TabsTrigger value="profile" className="data-[state=active]:bg-yellow-400 dark:data-[state=active]:bg-yellow-500 data-[state=active]:text-black text-gray-500 dark:text-gray-400 rounded-lg transition-all font-medium">Profile</TabsTrigger>
            <TabsTrigger value="expertise" className="data-[state=active]:bg-yellow-400 dark:data-[state=active]:bg-yellow-500 data-[state=active]:text-black text-gray-500 dark:text-gray-400 rounded-lg transition-all font-medium">Expertise</TabsTrigger>
            <TabsTrigger value="licenses" className="data-[state=active]:bg-yellow-400 dark:data-[state=active]:bg-yellow-500 data-[state=active]:text-black text-gray-500 dark:text-gray-400 rounded-lg transition-all font-medium">Licenses</TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-yellow-400 dark:data-[state=active]:bg-yellow-500 data-[state=active]:text-black text-gray-500 dark:text-gray-400 rounded-lg transition-all font-medium">Alerts</TabsTrigger>
            <TabsTrigger value="integrations" className="data-[state=active]:bg-yellow-400 dark:data-[state=active]:bg-yellow-500 data-[state=active]:text-black text-gray-500 dark:text-gray-400 rounded-lg transition-all font-medium">Apps</TabsTrigger>
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
                  <Avatar key={companyData.image_url || 'logo'} className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-500 dark:from-yellow-500 dark:to-yellow-600 text-black border-2 border-yellow-200 dark:border-yellow-500/20 shadow-lg shadow-yellow-500/10">
                    <AvatarImage
                      src={
                        companyData.image_url?.startsWith('/')
                          ? `${import.meta.env.VITE_API_URL.replace('/api', '')}${companyData.image_url}`
                          : companyData.image_url || "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&q=80&w=200&h=200"
                      }
                      className="object-cover"
                    />
                    <AvatarFallback className="text-2xl font-bold">
                      {uploading === 'image_url' ? <Loader2 className="w-6 h-6 animate-spin" /> : 'AC'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <input
                      id="logo_upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'image_url')}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 bg-transparent"
                      onClick={() => document.getElementById('logo_upload')?.click()}
                      disabled={uploading === 'image_url'}
                    >
                      {uploading === 'image_url' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Camera className="w-4 h-4 mr-2" />}
                      {uploading === 'image_url' ? 'Uploading...' : 'Change Logo'}
                    </Button>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                      Recommended: 200x200px, PNG or JPG
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Label className="text-gray-700 dark:text-gray-300 flex items-center justify-between">
                      Gallery Image 1
                      {uploading === 'image_url_2' && <Loader2 className="w-3 h-3 animate-spin" />}
                    </Label>
                    <div className="relative group rounded-xl overflow-hidden aspect-video bg-gray-100 dark:bg-black/20 border-2 border-dashed border-gray-200 dark:border-white/5 flex items-center justify-center">
                      {companyData.image_url_2 ? (
                        <div className="relative w-full h-full">
                          <img
                            src={companyData.image_url_2.startsWith('/') ? `${import.meta.env.VITE_API_URL.replace('/api', '')}${companyData.image_url_2}` : companyData.image_url_2}
                            alt="Gallery 1"
                            className="w-full h-full object-cover"
                          />
                          {isEditing && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button variant="secondary" size="sm" onClick={() => document.getElementById('gallery1_upload')?.click()}>Change</Button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center p-4">
                          <Plus className="w-8 h-8 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
                          <p className="text-xs text-gray-400">No image added</p>
                          {isEditing && <Button variant="ghost" size="sm" className="mt-2" onClick={() => document.getElementById('gallery1_upload')?.click()}>Upload</Button>}
                        </div>
                      )}
                      <input id="gallery1_upload" type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'image_url_2')} />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-gray-700 dark:text-gray-300 flex items-center justify-between">
                      Gallery Image 2
                      {uploading === 'image_url_3' && <Loader2 className="w-3 h-3 animate-spin" />}
                    </Label>
                    <div className="relative group rounded-xl overflow-hidden aspect-video bg-gray-100 dark:bg-black/20 border-2 border-dashed border-gray-200 dark:border-white/5 flex items-center justify-center">
                      {companyData.image_url_3 ? (
                        <div className="relative w-full h-full">
                          <img
                            src={companyData.image_url_3.startsWith('/') ? `${import.meta.env.VITE_API_URL.replace('/api', '')}${companyData.image_url_3}` : companyData.image_url_3}
                            alt="Gallery 2"
                            className="w-full h-full object-cover"
                          />
                          {isEditing && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button variant="secondary" size="sm" onClick={() => document.getElementById('gallery2_upload')?.click()}>Change</Button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center p-4">
                          <Plus className="w-8 h-8 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
                          <p className="text-xs text-gray-400">No image added</p>
                          {isEditing && <Button variant="ghost" size="sm" className="mt-2" onClick={() => document.getElementById('gallery2_upload')?.click()}>Upload</Button>}
                        </div>
                      )}
                      <input id="gallery2_upload" type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'image_url_3')} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="company_name" className="text-gray-700 dark:text-gray-300">Company Name</Label>
                    <Input
                      id="company_name"
                      value={companyData.company_name || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 text-gray-900 dark:text-white focus:border-yellow-500/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tagline" className="text-gray-700 dark:text-gray-300">Tagline</Label>
                    <Input
                      id="tagline"
                      value={companyData.tagline || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="Your company's motto"
                      className="border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 text-gray-900 dark:text-white focus:border-yellow-500/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-gray-700 dark:text-gray-300">Company Description</Label>
                  <Textarea
                    id="description"
                    value={companyData.description || ''}
                    onChange={handleInputChange}
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
                      value={companyData.email || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 text-gray-900 dark:text-white focus:border-yellow-500/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={companyData.phone || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 text-gray-900 dark:text-white focus:border-yellow-500/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-gray-700 dark:text-gray-300">Business Address</Label>
                    <Input
                      id="address"
                      value={companyData.address || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 text-gray-900 dark:text-white focus:border-yellow-500/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website" className="text-gray-700 dark:text-gray-300">Website</Label>
                    <Input
                      id="website"
                      value={companyData.website || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 text-gray-900 dark:text-white focus:border-yellow-500/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="license_number" className="text-gray-700 dark:text-gray-300">License Number</Label>
                    <Input
                      id="license_number"
                      value={companyData.license_number || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 text-gray-900 dark:text-white focus:border-yellow-500/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="professional_category" className="text-gray-700 dark:text-gray-300">Professional Category</Label>
                    <Input
                      id="professional_category"
                      value={companyData.professional_category || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 text-gray-900 dark:text-white focus:border-yellow-500/50"
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-white/5">
                    <div className="flex items-center space-x-2">
                      <Switch id="responds_quickly" checked={companyData.responds_quickly} onCheckedChange={(c) => handleSwitchChange('responds_quickly', c)} />
                      <Label htmlFor="responds_quickly" className="text-xs">Responds Quickly</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="family_owned" checked={companyData.family_owned} onCheckedChange={(c) => handleSwitchChange('family_owned', c)} />
                      <Label htmlFor="family_owned" className="text-xs">Family Owned</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="eco_friendly" checked={companyData.eco_friendly} onCheckedChange={(c) => handleSwitchChange('eco_friendly', c)} />
                      <Label htmlFor="eco_friendly" className="text-xs">Eco Friendly</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="locally_owned" checked={companyData.locally_owned} onCheckedChange={(c) => handleSwitchChange('locally_owned', c)} />
                      <Label htmlFor="locally_owned" className="text-xs">Locally Owned</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="offers_custom_work" checked={companyData.offers_custom_work} onCheckedChange={(c) => handleSwitchChange('offers_custom_work', c)} />
                      <Label htmlFor="offers_custom_work" className="text-xs">Custom Work</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="provides_3d_visualization" checked={companyData.provides_3d_visualization} onCheckedChange={(c) => handleSwitchChange('provides_3d_visualization', c)} />
                      <Label htmlFor="provides_3d_visualization" className="text-xs">3D Visualization</Label>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Expertise Tab */}
          <TabsContent value="expertise" className="space-y-6">
            <Card className="border-gray-200 dark:border-white/5 bg-white dark:bg-[#1c1e24] shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Professional Expertise</CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">
                  Manage your services, specialties, and professional background.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-gray-700 dark:text-gray-300">Services Offered</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {(companyData.services_offered || []).map((s: string, i: number) => (
                        <Badge key={i} variant="secondary" className="bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-500 border-none">
                          {s}
                          {isEditing && <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => {
                            setCompanyData((p: any) => ({ ...p, services_offered: p.services_offered.filter((_: any, idx: number) => idx !== i) }));
                          }} />}
                        </Badge>
                      ))}
                    </div>
                    {isEditing && (
                      <div className="flex gap-2">
                        <Input id="new_service" placeholder="Add service..." onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const val = (e.target as HTMLInputElement).value;
                            if (val) {
                              setCompanyData((p: any) => ({ ...p, services_offered: [...(p.services_offered || []), val] }));
                              (e.target as HTMLInputElement).value = '';
                            }
                          }
                        }} />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 dark:text-gray-300">Specialties</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {(companyData.specialties || []).map((s: string, i: number) => (
                        <Badge key={i} variant="secondary" className="bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-500 border-none">
                          {s}
                          {isEditing && <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => {
                            setCompanyData((p: any) => ({ ...p, specialties: p.specialties.filter((_: any, idx: number) => idx !== i) }));
                          }} />}
                        </Badge>
                      ))}
                    </div>
                    {isEditing && (
                      <Input placeholder="Add specialty..." onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const val = (e.target as HTMLInputElement).value;
                          if (val) {
                            setCompanyData((p: any) => ({ ...p, specialties: [...(p.specialties || []), val] }));
                            (e.target as HTMLInputElement).value = '';
                          }
                        }
                      }} />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200 dark:border-white/5">
                  <div className="space-y-2">
                    <Label htmlFor="years_in_business" className="text-gray-700 dark:text-gray-300">Years in Business</Label>
                    <Input
                      id="years_in_business"
                      type="number"
                      value={companyData.years_in_business || 0}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employees_count" className="text-gray-700 dark:text-gray-300">Employee Count</Label>
                    <Input
                      id="employees_count"
                      value={companyData.employees_count || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="e.g. 10-50"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Licenses & Certifications Tab */}
          <TabsContent value="licenses" className="space-y-6">
            {/* Licenses Section */}
            <Card className="border-gray-200 dark:border-white/5 bg-white dark:bg-[#1c1e24] shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Professional Licenses</CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">
                  Manage your professional licenses and permits
                </CardDescription>
              </CardHeader>
              <CardContent className={`space-y-4 ${!isEditing ? 'cursor-not-allowed' : ''}`}>
                {licenses.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-gray-200 dark:border-white/10 rounded-xl">
                    <Shield className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">No licenses added yet</p>
                    <Button
                      variant="outline"
                      className="border-gray-300 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5"
                      onClick={handleAddLicense}
                      disabled={!isEditing}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First License
                    </Button>
                  </div>
                ) : (
                  <>
                    {licenses.map((license: any, index: number) => {
                      const status = getLicenseStatus(license.expiry_date);
                      return (
                        <div
                          key={index}
                          className="flex items-start justify-between p-4 border border-gray-200 dark:border-white/5 rounded-xl bg-gray-50 dark:bg-black/20 hover:border-yellow-400 dark:hover:border-yellow-500/20 transition-all group"
                        >
                          <div className="flex items-start gap-4 flex-1">
                            <div className={`p-3 rounded-lg ${status === 'Active'
                              ? 'bg-gray-100 dark:bg-white/10 text-black dark:text-white'
                              : status === 'Expired'
                                ? 'bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-500'
                                : 'bg-yellow-100 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-500'
                              }`}>
                              <Shield className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                                {license.name}
                              </h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                {license.issuing_authority && `${license.issuing_authority} • `}
                                {license.license_number && `#${license.license_number}`}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
                                {license.issue_date && (
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    Issued: {new Date(license.issue_date).toLocaleDateString()}
                                  </span>
                                )}
                                {license.expiry_date && (
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    Expires: {new Date(license.expiry_date).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={`${status === 'Active'
                              ? 'bg-gray-100 dark:bg-white/10 text-black dark:text-white border-black dark:border-white'
                              : status === 'Expired'
                                ? 'bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-500 border-red-200 dark:border-red-500/20'
                                : 'bg-yellow-100 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border-yellow-200 dark:border-yellow-500/20'
                              }`}>
                              {status === 'Active' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                              {status === 'Expires Soon' && <AlertTriangle className="w-3 h-3 mr-1" />}
                              {status === 'Expired' && <X className="w-3 h-3 mr-1" />}
                              {status}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"
                              onClick={() => handleEditLicense(index)}
                              disabled={!isEditing}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-400 hover:text-red-600 dark:hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                              onClick={() => handleDeleteLicense(index)}
                              disabled={!isEditing}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                    <Button
                      variant="outline"
                      className="w-full mt-4 border-gray-300 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 bg-transparent border-dashed"
                      onClick={handleAddLicense}
                      disabled={!isEditing}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add License
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Certifications Section */}
            <Card className="border-gray-200 dark:border-white/5 bg-white dark:bg-[#1c1e24] shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Professional Certifications</CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">
                  Manage your professional certifications and training credentials
                </CardDescription>
              </CardHeader>
              <CardContent className={`space-y-4 ${!isEditing ? 'cursor-not-allowed' : ''}`}>
                {certifications.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-gray-200 dark:border-white/10 rounded-xl">
                    <Shield className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">No certifications added yet</p>
                    <Button
                      variant="outline"
                      className="border-gray-300 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5"
                      onClick={handleAddCertification}
                      disabled={!isEditing}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Certification
                    </Button>
                  </div>
                ) : (
                  <>
                    {certifications.map((certification: any, index: number) => {
                      const status = getLicenseStatus(certification.expiry_date);
                      return (
                        <div
                          key={index}
                          className="flex items-start justify-between p-4 border border-gray-200 dark:border-white/5 rounded-xl bg-gray-50 dark:bg-black/20 hover:border-yellow-400 dark:hover:border-yellow-500/20 transition-all group"
                        >
                          <div className="flex items-start gap-4 flex-1">
                            <div className={`p-3 rounded-lg ${status === 'Active'
                              ? 'bg-gray-100 dark:bg-white/10 text-black dark:text-white'
                              : status === 'Expired'
                                ? 'bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-500'
                                : 'bg-yellow-100 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-500'
                              }`}>
                              <Shield className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                                {certification.name}
                              </h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                {certification.issuing_organization && `${certification.issuing_organization} • `}
                                {certification.certification_number && `#${certification.certification_number}`}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
                                {certification.issue_date && (
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    Issued: {new Date(certification.issue_date).toLocaleDateString()}
                                  </span>
                                )}
                                {certification.expiry_date && (
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    Expires: {new Date(certification.expiry_date).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={`${status === 'Active'
                              ? 'bg-gray-100 dark:bg-white/10 text-black dark:text-white border-black dark:border-white'
                              : status === 'Expired'
                                ? 'bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-500 border-red-200 dark:border-red-500/20'
                                : 'bg-yellow-100 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border-yellow-200 dark:border-yellow-500/20'
                              }`}>
                              {status === 'Active' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                              {status === 'Expires Soon' && <AlertTriangle className="w-3 h-3 mr-1" />}
                              {status === 'Expired' && <X className="w-3 h-3 mr-1" />}
                              {status}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"
                              onClick={() => handleEditCertification(index)}
                              disabled={!isEditing}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-400 hover:text-red-600 dark:hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                              onClick={() => handleDeleteCertification(index)}
                              disabled={!isEditing}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                    <Button
                      variant="outline"
                      className="w-full mt-4 border-gray-300 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 bg-transparent border-dashed"
                      onClick={handleAddCertification}
                      disabled={!isEditing}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Certification
                    </Button>
                  </>
                )}
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

          {/* Integrations Tab */}
          <TabsContent value="integrations" className="space-y-6">
            <Card className="border-gray-200 dark:border-white/5 bg-white dark:bg-[#1c1e24] shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Sync & Integrations</CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">
                  Connect external tools and sync your data with the platform
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row items-center justify-between p-6 border border-gray-200 dark:border-white/5 rounded-2xl bg-gray-50/50 dark:bg-black/10 gap-6">
                  <div className="flex items-center gap-6">
                    <div className="p-4 bg-yellow-100 dark:bg-yellow-500/10 rounded-2xl text-yellow-600 dark:text-yellow-500 shadow-sm">
                      <Smartphone className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                        Phone Directory Sync
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
                        Import your mobile contacts to easily manage and invite sub-contractors or team members.
                      </p>
                      {syncStatus === 'success' && (
                        <div className="flex items-center gap-2 mt-3 text-yellow-600 dark:text-yellow-400 text-sm font-medium">
                          <CheckCircle2 className="w-4 h-4" />
                          Last synced: Just now
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    onClick={handleSync}
                    disabled={isSyncing}
                    className="w-full md:w-auto bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 font-bold px-8 h-12 rounded-xl transition-all"
                  >
                    {isSyncing ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Syncing...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Sync Contacts
                      </>
                    )}
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-white dark:bg-black/20 border-gray-200 dark:border-white/5 p-4 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <Shield className="w-5 h-5 text-gray-900 dark:text-white" />
                      <h5 className="font-bold text-sm dark:text-white">Privacy & Security</h5>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      We never store your raw contact list. We only hash phone numbers to find matches within our network.
                    </p>
                  </Card>
                  <Card className="bg-white dark:bg-black/20 border-gray-200 dark:border-white/5 p-4 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <Users className="w-5 h-5 text-gray-900 dark:text-white" />
                      <h5 className="font-bold text-sm dark:text-white">Smart Match</h5>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Automatically identify which of your contacts are already verified sub-contractors on the platform.
                    </p>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* License Add/Edit Modal */}
      <Dialog open={isLicenseModalOpen} onOpenChange={setIsLicenseModalOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white dark:bg-[#1c1e24] border-gray-200 dark:border-white/10">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">
              {editingLicenseIndex !== null ? 'Edit License' : 'Add New License'}
            </DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400">
              Enter the details of your professional license
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="license_name" className="text-gray-700 dark:text-gray-300">License Name *</Label>
              <Input
                id="license_name"
                value={licenseForm.name}
                onChange={(e) => setLicenseForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., General Contractor License"
                className="border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="license_num" className="text-gray-700 dark:text-gray-300">License Number *</Label>
              <Input
                id="license_num"
                value={licenseForm.license_number}
                onChange={(e) => setLicenseForm(prev => ({ ...prev, license_number: e.target.value }))}
                placeholder="e.g., GC-994821"
                className="border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="issuing_auth" className="text-gray-700 dark:text-gray-300">Issuing Authority</Label>
              <Input
                id="issuing_auth"
                value={licenseForm.issuing_authority}
                onChange={(e) => setLicenseForm(prev => ({ ...prev, issuing_authority: e.target.value }))}
                placeholder="e.g., State of Texas"
                className="border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="issue_date" className="text-gray-700 dark:text-gray-300">Issue Date</Label>
                <Input
                  id="issue_date"
                  type="date"
                  value={licenseForm.issue_date}
                  onChange={(e) => setLicenseForm(prev => ({ ...prev, issue_date: e.target.value }))}
                  className="border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiry_date" className="text-gray-700 dark:text-gray-300">Expiry Date</Label>
                <Input
                  id="expiry_date"
                  type="date"
                  value={licenseForm.expiry_date}
                  onChange={(e) => setLicenseForm(prev => ({ ...prev, expiry_date: e.target.value }))}
                  className="border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsLicenseModalOpen(false)}
              className="border-gray-200 dark:border-white/10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveLicense}
              className="bg-yellow-400 hover:bg-yellow-500 dark:bg-yellow-500 dark:hover:bg-yellow-400 text-black font-semibold"
            >
              {editingLicenseIndex !== null ? 'Update License' : 'Add License'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Certification Add/Edit Modal */}
      <Dialog open={isCertificationModalOpen} onOpenChange={setIsCertificationModalOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white dark:bg-[#1c1e24] border-gray-200 dark:border-white/10">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">
              {editingCertificationIndex !== null ? 'Edit Certification' : 'Add New Certification'}
            </DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400">
              Enter the details of your professional certification
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="cert_name" className="text-gray-700 dark:text-gray-300">Certification Name *</Label>
              <Input
                id="cert_name"
                value={certificationForm.name}
                onChange={(e) => setCertificationForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., OSHA 30 Certification"
                className="border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cert_num" className="text-gray-700 dark:text-gray-300">Certification Number</Label>
              <Input
                id="cert_num"
                value={certificationForm.certification_number}
                onChange={(e) => setCertificationForm(prev => ({ ...prev, certification_number: e.target.value }))}
                placeholder="e.g., OSHA-30-12345"
                className="border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="issuing_org" className="text-gray-700 dark:text-gray-300">Issuing Organization</Label>
              <Input
                id="issuing_org"
                value={certificationForm.issuing_organization}
                onChange={(e) => setCertificationForm(prev => ({ ...prev, issuing_organization: e.target.value }))}
                placeholder="e.g., OSHA"
                className="border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cert_issue_date" className="text-gray-700 dark:text-gray-300">Issue Date</Label>
                <Input
                  id="cert_issue_date"
                  type="date"
                  value={certificationForm.issue_date}
                  onChange={(e) => setCertificationForm(prev => ({ ...prev, issue_date: e.target.value }))}
                  className="border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cert_expiry_date" className="text-gray-700 dark:text-gray-300">Expiry Date</Label>
                <Input
                  id="cert_expiry_date"
                  type="date"
                  value={certificationForm.expiry_date}
                  onChange={(e) => setCertificationForm(prev => ({ ...prev, expiry_date: e.target.value }))}
                  className="border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCertificationModalOpen(false)}
              className="border-gray-200 dark:border-white/10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveCertification}
              className="bg-yellow-400 hover:bg-yellow-500 dark:bg-yellow-500 dark:hover:bg-yellow-400 text-black font-semibold"
            >
              {editingCertificationIndex !== null ? 'Update Certification' : 'Add Certification'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AccountSettings;
