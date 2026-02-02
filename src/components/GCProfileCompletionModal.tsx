import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { companyService } from '@/api/companyService';
import { uploadService } from '@/api/uploadService';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, X, Camera } from 'lucide-react';

interface GCProfileCompletionModalProps {
    onComplete: () => void;
}

const GCProfileCompletionModal: React.FC<GCProfileCompletionModalProps> = ({ onComplete }) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const [formData, setFormData] = useState<any>({
        // company_name, address, years_in_business removed as they come from registration
        tagline: '',
        description: '',
        website: '',
        image_url: '',
        image_url_2: '',
        image_url_3: '',
        license_number: '',
        responds_quickly: false,
        family_owned: false,
        eco_friendly: false,
        locally_owned: false,
        offers_custom_work: false,
        provides_3d_visualization: false,
        professional_category: '',
        budget_range: '$$$',
        languages: [],
        services_offered: [],
        specialties: [],
        service_areas: '',
        service_cities: [],
        service_zip_codes: [],
        awards: [],
        certifications: [],
        featured_reviewer_name: '',
        featured_review_text: '',
        featured_review_rating: 0,
    });

    const [newLanguage, setNewLanguage] = useState('');
    const [newService, setNewService] = useState('');
    const [newSpecialty, setNewSpecialty] = useState('');
    const [newAward, setNewAward] = useState('');
    const [newCert, setNewCert] = useState('');

    const [uploading, setUploading] = useState<string | null>(null);

    useEffect(() => {
        checkProfileStatus();
    }, []);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(fieldName);
        try {
            const response = await uploadService.uploadImage(file);
            if (response.success) {
                setFormData((prev: any) => ({
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

    const checkProfileStatus = async () => {
        try {
            const response = await companyService.getMyCompanyProfile();
            if (response.success) {
                // If profile is already completed, don't show modal
                if (response.profile_metadata?.profile_completed) {
                    return;
                }

                // Check last reminder interval (from .env or default to 24 hours)
                const lastReminder = response.profile_metadata?.last_reminder_at;
                const now = new Date().getTime();
                const intervalSeconds = Number(import.meta.env.VITE_PROFILE_REMINDER_INTERVAL_SECONDS) || 86400;
                const intervalMs = intervalSeconds * 1000;

                if (!lastReminder || (now - new Date(lastReminder).getTime() > intervalMs)) {
                    if (response.data) {
                        setFormData((prev: any) => ({
                            ...prev,
                            ...response.data,
                            // Ensure array fields are not null
                            languages: response.data.languages || [],
                            services_offered: response.data.services_offered || [],
                            specialties: response.data.specialties || [],
                            awards: response.data.awards || [],
                            certifications: response.data.certifications || [],
                            service_cities: response.data.service_cities || [],
                            service_zip_codes: response.data.service_zip_codes || [],
                            // Map images array back to individual URLs if needed
                            image_url: response.data.images?.[0] || '',
                            image_url_2: response.data.images?.[1] || '',
                            image_url_3: response.data.images?.[2] || '',
                        }));
                    }
                    setOpen(true);
                }
            }
        } catch (error) {
            console.error('Error checking profile status:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (name: string, checked: boolean) => {
        setFormData((prev: any) => ({ ...prev, [name]: checked }));
    };

    const addItem = (field: string, value: string, setter: (v: string) => void) => {
        if (!value.trim()) return;
        setFormData((prev: any) => ({
            ...prev,
            [field]: [...(prev[field] || []), value.trim()]
        }));
        setter('');
    };

    const removeItem = (field: string, index: number) => {
        setFormData((prev: any) => ({
            ...prev,
            [field]: (prev[field] || []).filter((_: any, i: number) => i !== index)
        }));
    };

    const handleSkip = async () => {
        try {
            await companyService.skipProfileReminder();
            setOpen(false);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to skip. Please try again.",
                variant: "destructive"
            });
        }
    };

    const handleSubmit = async () => {
        // Validation - now checking description or tagline as essential
        if (!formData.tagline && !formData.description) {
            toast({
                title: "Incomplete",
                description: "Please add a tagline or description to help clients know you.",
                variant: "destructive"
            });
            return;
        }

        setLoading(true);
        try {
            const response = await companyService.updateMyCompanyProfile(formData);
            if (response.success) {
                toast({
                    title: "Profile Updated",
                    description: "Your company information has been saved.",
                });
                setOpen(false);
                onComplete();
            }
        } catch (error) {
            toast({
                title: "Update Failed",
                description: "Could not save profile. Please try again.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle className="text-2xl font-bold">Complete Your Company Profile</DialogTitle>
                    <DialogDescription>
                        Help clients find you by providing more details about your electrical contracting business.
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="basic" className="w-full">
                    <div className="px-6">
                        <TabsList className="grid w-full grid-cols-4 bg-gray-100 dark:bg-gray-800">
                            <TabsTrigger value="basic">Basic Info</TabsTrigger>
                            <TabsTrigger value="details">Company Details</TabsTrigger>
                            <TabsTrigger value="services">Services & Expertise</TabsTrigger>
                            <TabsTrigger value="review">Featured Review</TabsTrigger>
                        </TabsList>
                    </div>

                    <ScrollArea className="h-[50vh] px-6 py-4">
                        <TabsContent value="basic" className="space-y-4 m-0">
                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="tagline">Tagline</Label>
                                    <Input id="tagline" name="tagline" value={formData.tagline} onChange={handleChange} placeholder="e.g. Leading the Charge / Electrical Excellence" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Company Description</Label>
                                <Textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Tell clients what makes your business special..." rows={3} />
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="website">Website URL</Label>
                                    <Input id="website" name="website" value={formData.website} onChange={handleChange} placeholder="https://yourwebsite.com" />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-6">
                                <div className="space-y-3">
                                    <Label className="flex items-center justify-between">
                                        Main Image
                                        {uploading === 'image_url' && <Loader2 className="w-3 h-3 animate-spin" />}
                                    </Label>
                                    <div className="relative group cursor-pointer">
                                        {formData.image_url ? (
                                            <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-gray-100 shadow-sm">
                                                <img src={formData.image_url.startsWith('/') ? `${import.meta.env.VITE_API_URL.replace('/api', '')}${formData.image_url}` : formData.image_url} alt="Main" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                                    <Button variant="secondary" size="sm" onClick={() => document.getElementById('main_image_input')?.click()}>Change</Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div
                                                onClick={() => document.getElementById('main_image_input')?.click()}
                                                className="aspect-video rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-accent hover:text-accent transition-all bg-gray-50/50"
                                            >
                                                <Camera className="w-8 h-8 opacity-20" />
                                                <span className="text-xs font-medium">Upload Portfolio</span>
                                            </div>
                                        )}
                                        <input
                                            id="main_image_input"
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(e, 'image_url')}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label className="flex items-center justify-between">
                                        Gallery 1
                                        {uploading === 'image_url_2' && <Loader2 className="w-3 h-3 animate-spin" />}
                                    </Label>
                                    <div className="relative group cursor-pointer">
                                        {formData.image_url_2 ? (
                                            <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-gray-100 shadow-sm">
                                                <img src={formData.image_url_2.startsWith('/') ? `${import.meta.env.VITE_API_URL.replace('/api', '')}${formData.image_url_2}` : formData.image_url_2} alt="Gallery 2" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                                    <Button variant="secondary" size="sm" onClick={() => document.getElementById('image2_input')?.click()}>Change</Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div
                                                onClick={() => document.getElementById('image2_input')?.click()}
                                                className="aspect-video rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-accent hover:text-accent transition-all bg-gray-50/50"
                                            >
                                                <Plus className="w-8 h-8 opacity-20" />
                                                <span className="text-xs font-medium">Add Image</span>
                                            </div>
                                        )}
                                        <input id="image2_input" type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'image_url_2')} />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label className="flex items-center justify-between">
                                        Gallery 2
                                        {uploading === 'image_url_3' && <Loader2 className="w-3 h-3 animate-spin" />}
                                    </Label>
                                    <div className="relative group cursor-pointer">
                                        {formData.image_url_3 ? (
                                            <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-gray-100 shadow-sm">
                                                <img src={formData.image_url_3.startsWith('/') ? `${import.meta.env.VITE_API_URL.replace('/api', '')}${formData.image_url_3}` : formData.image_url_3} alt="Gallery 3" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                                    <Button variant="secondary" size="sm" onClick={() => document.getElementById('image3_input')?.click()}>Change</Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div
                                                onClick={() => document.getElementById('image3_input')?.click()}
                                                className="aspect-video rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-accent hover:text-accent transition-all bg-gray-50/50"
                                            >
                                                <Plus className="w-8 h-8 opacity-20" />
                                                <span className="text-xs font-medium">Add Image</span>
                                            </div>
                                        )}
                                        <input id="image3_input" type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'image_url_3')} />
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="details" className="space-y-4 m-0">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="license_number">License Number</Label>
                                    <Input id="license_number" name="license_number" value={formData.license_number} onChange={handleChange} placeholder="e.g. EC13013307" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="professional_category">Professional Category</Label>
                                    <Input id="professional_category" name="professional_category" value={formData.professional_category} onChange={handleChange} placeholder="e.g. Electrical Contractor" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="budget_range">Typical Project Budget Range</Label>
                                    <select
                                        id="budget_range"
                                        name="budget_range"
                                        className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-accent"
                                        value={formData.budget_range}
                                        onChange={(e: any) => setFormData((p: any) => ({ ...p, budget_range: e.target.value }))}
                                    >
                                        <option value="$">$ - Budget-friendly</option>
                                        <option value="$$">$$ - Mid-range</option>
                                        <option value="$$$">$$$ - High-end</option>
                                        <option value="$$$$">$$$$ - Luxury / Custom</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 pt-2">
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="responds_quickly" checked={formData.responds_quickly} onCheckedChange={(c) => handleCheckboxChange('responds_quickly', !!c)} />
                                        <Label htmlFor="responds_quickly">Responds Quickly</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="family_owned" checked={formData.family_owned} onCheckedChange={(c) => handleCheckboxChange('family_owned', !!c)} />
                                        <Label htmlFor="family_owned">Family Owned</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="eco_friendly" checked={formData.eco_friendly} onCheckedChange={(c) => handleCheckboxChange('eco_friendly', !!c)} />
                                        <Label htmlFor="eco_friendly">Eco Friendly</Label>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="locally_owned" checked={formData.locally_owned} onCheckedChange={(c) => handleCheckboxChange('locally_owned', !!c)} />
                                        <Label htmlFor="locally_owned">Locally Owned</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="offers_custom_work" checked={formData.offers_custom_work} onCheckedChange={(c) => handleCheckboxChange('offers_custom_work', !!c)} />
                                        <Label htmlFor="offers_custom_work">Offers Custom Work</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="provides_3d_visualization" checked={formData.provides_3d_visualization} onCheckedChange={(c) => handleCheckboxChange('provides_3d_visualization', !!c)} />
                                        <Label htmlFor="provides_3d_visualization">Provides 3D Visualization</Label>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="services" className="space-y-6 m-0">
                            <div className="space-y-4">
                                <div>
                                    <Label>Languages Spoken</Label>
                                    <div className="flex gap-2 mt-1">
                                        <Input value={newLanguage} onChange={(e) => setNewLanguage(e.target.value)} placeholder="Add language..." className="flex-1" />
                                        <Button type="button" size="sm" onClick={() => addItem('languages', newLanguage, setNewLanguage)}><Plus className="h-4 w-4" /></Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {formData.languages?.map((item: string, i: number) => (
                                            <span key={i} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs flex items-center">
                                                {item} <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => removeItem('languages', i)} />
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <Label>Services Offered</Label>
                                    <div className="flex gap-2 mt-1">
                                        <Input value={newService} onChange={(e) => setNewService(e.target.value)} placeholder="Add service..." className="flex-1" />
                                        <Button type="button" size="sm" onClick={() => addItem('services_offered', newService, setNewService)}><Plus className="h-4 w-4" /></Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {formData.services_offered?.map((item: string, i: number) => (
                                            <span key={i} className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs flex items-center">
                                                {item} <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => removeItem('services_offered', i)} />
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <Label>Specialties</Label>
                                    <div className="flex gap-2 mt-1">
                                        <Input value={newSpecialty} onChange={(e) => setNewSpecialty(e.target.value)} placeholder="Add specialty..." className="flex-1" />
                                        <Button type="button" size="sm" onClick={() => addItem('specialties', newSpecialty, setNewSpecialty)}><Plus className="h-4 w-4" /></Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {formData.specialties?.map((item: string, i: number) => (
                                            <span key={i} className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs flex items-center">
                                                {item} <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => removeItem('specialties', i)} />
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Awards</Label>
                                        <div className="flex gap-2 mt-1">
                                            <Input value={newAward} onChange={(e) => setNewAward(e.target.value)} placeholder="Add award..." className="flex-1" />
                                            <Button type="button" size="sm" onClick={() => addItem('awards', newAward, setNewAward)}><Plus className="h-4 w-4" /></Button>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {formData.awards?.map((item: string, i: number) => (
                                                <span key={i} className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs flex items-center">
                                                    {item} <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => removeItem('awards', i)} />
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Certifications</Label>
                                        <div className="flex gap-2 mt-1">
                                            <Input value={newCert} onChange={(e) => setNewCert(e.target.value)} placeholder="Add certification..." className="flex-1" />
                                            <Button type="button" size="sm" onClick={() => addItem('certifications', newCert, setNewCert)}><Plus className="h-4 w-4" /></Button>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {formData.certifications?.map((item: string, i: number) => (
                                                <span key={i} className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs flex items-center">
                                                    {item} <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => removeItem('certifications', i)} />
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="review" className="space-y-4 m-0">
                            <div className="space-y-4">
                                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
                                    <h4 className="font-medium text-sm mb-3">Featured Client Review</h4>
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="featured_reviewer_name">Reviewer Name</Label>
                                            <Input id="featured_reviewer_name" name="featured_reviewer_name" value={formData.featured_reviewer_name} onChange={handleChange} placeholder="e.g. John Doe" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="featured_review_rating">Rating (0-5)</Label>
                                            <Input id="featured_review_rating" name="featured_review_rating" type="number" step="0.1" max="5" min="0" value={formData.featured_review_rating} onChange={handleChange} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="featured_review_text">Review Content</Label>
                                        <Textarea id="featured_review_text" name="featured_review_text" value={formData.featured_review_text} onChange={handleChange} placeholder="The client's testimonial..." rows={4} />
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    </ScrollArea>
                </Tabs>

                <DialogFooter className="p-6 pt-2 flex items-center justify-between sm:justify-between border-t mt-4">
                    <Button variant="ghost" onClick={handleSkip} disabled={loading}>
                        Skip for now
                    </Button>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                            Close
                        </Button>
                        <Button onClick={handleSubmit} disabled={loading} className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 transition-colors">
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Profile
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default GCProfileCompletionModal;
