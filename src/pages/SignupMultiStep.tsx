import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Check,
  User,
  Building2,
  Briefcase,
  Target,
  HardHat,
  Store,
  UserCircle,
  Mail,
  Lock,
  Phone,
  Home,
  Building,
  Wrench,
  Zap,
  Droplet,
  Hammer,
  PaintBucket,
  TreePine,
  Ruler,
  HelpCircle,
  Package,
  CheckCircle2,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import authService from "@/api/authService";

const SignupMultiStep = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    workType: "",
    companyName: "",
    companySize: "",
    address: "",
    phone: "",
    otp: "",
    receiveUpdates: false,
    trades: [] as string[],
    goals: [] as string[],

    // Additional fields
    role: "",
    yearsInBusiness: 0,
    projectSizeRange: "",
    serviceArea: "",
    businessType: "",
    deliveryRadius: 0,
    minOrderValue: "",
    offerCreditTerms: false,
    projectType: "",
    budget: "",
    timeline: "",
    propertySize: "",
    financingStatus: "",
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  // SMS OTP State
  const [smsOtp, setSmsOtp] = useState("");
  const [smsSent, setSmsSent] = useState(false);
  const [smsVerified, setSmsVerified] = useState(false);
  const [isVerifyingSms, setIsVerifyingSms] = useState(false);

  const handleSendEmailOtp = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      toast({ title: "Invalid Email", description: "Please enter a valid email address first", variant: "destructive" });
      return;
    }

    try {
      setIsLoading(true);
      // Check availability first to avoid sending OTP to taken email
      const check = await authService.checkEmail(formData.email);
      if (check.exists) {
        toast({ title: "Email Taken", description: "This email is already registered", variant: "destructive" });
        return;
      }

      await authService.sendEmailOtp(formData.email);
      setOtpSent(true);
      toast({ title: "OTP Sent", description: "Please check your email for the verification code" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to send OTP", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyEmailOtp = async () => {
    if (!formData.otp) {
      toast({ title: "OTP Required", description: "Please enter the verification code", variant: "destructive" });
      return;
    }

    try {
      setIsVerifyingOtp(true);
      await authService.verifyEmailOtp(formData.email, formData.otp);
      setOtpVerified(true);
      toast({ title: "Verified", description: "Email verified successfully", className: "bg-green-500 text-white" });
    } catch (error: any) {
      toast({ title: "Verification Failed", description: error.message || "Invalid code", variant: "destructive" });
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleSendSmsOtp = async () => {
    // US Phone Check: Must start with +1 and have 10 digits
    // More flexible regex: Allow +1 or just 10 digits
    const phone = formData.phone.trim();
    if (!/^\+1\d{10}$/.test(phone)) {
      toast({ title: "Invalid Phone Format", description: "Please use US format: +1 followed by 10 digits (e.g., +15551234567)", variant: "destructive" });
      return;
    }

    try {
      setIsLoading(true);
      await authService.sendSmsOtp(formData.phone);
      setSmsSent(true);
      toast({ title: "SMS Sent", description: "Please check your phone for the verification code" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to send SMS", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifySmsOtp = async () => {
    if (!smsOtp) {
      toast({ title: "OTP Required", description: "Please enter the verification code", variant: "destructive" });
      return;
    }

    try {
      setIsVerifyingSms(true);
      await authService.verifySmsOtp(formData.phone, smsOtp);
      setSmsVerified(true);
      toast({ title: "Verified", description: "Phone verified successfully", className: "bg-green-500 text-white" });
    } catch (error: any) {
      toast({ title: "Verification Failed", description: error.message || "Invalid code", variant: "destructive" });
    } finally {
      setIsVerifyingSms(false);
    }
  };

  const steps = [
    { number: 1, title: "Register", icon: User, completed: currentStep > 1 },
    { number: 2, title: "Company Info", icon: Building2, completed: currentStep > 2 },
    { number: 3, title: "Company Trades", icon: Briefcase, completed: currentStep > 3 },
    { number: 4, title: "Your Goals", icon: Target, completed: currentStep > 4 },
  ];

  const validateStep = async (step: number) => {
    if (step === 1) {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
        toast({ title: "Missing Information", description: "Please fill in all required fields marked with *", variant: "destructive" });
        return false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast({ title: "Invalid Email", description: "Please enter a valid email address", variant: "destructive" });
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        toast({ title: "Password Mismatch", description: "Passwords do not match", variant: "destructive" });
        return false;
      }

      // Check Password Complexity
      // At least 8 chars, 1 uppercase, 1 lowercase, 1 number
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/;
      if (formData.password.length < 8) {
        toast({ title: "Weak Password", description: "Password must be at least 8 characters long", variant: "destructive" });
        return false;
      }
      if (!passwordRegex.test(formData.password)) {
        toast({ title: "Weak Password", description: "Password must contain at least one uppercase letter, one lowercase letter, and one number", variant: "destructive" });
        return false;
      }

      // Check Email Availability asynchronously
      try {
        setIsLoading(true);
        const check = await authService.checkEmail(formData.email);
        if (check.exists) {
          toast({ title: "Email Taken", description: "This email address is already registered. Please login or use another email.", variant: "destructive" });
          return false;
        }
      } catch (error) {
        console.error("Email check failed", error);
        // Fallback: allow to proceed if check fails? Or block?
        // Blocking is safer to avoid frustration later.
        toast({ title: "Network Error", description: "Could not verify email availability. Please check your connection.", variant: "destructive" });
        return false;
      } finally {
        setIsLoading(false);
      }

      if (!otpVerified) {
        toast({ title: "Email Unverified", description: "Please verify your email address to continue", variant: "destructive" });
        return false;
      }
    }

    if (step === 2) {
      if (!formData.workType) {
        toast({ title: "Selection Required", description: "Please select a work type", variant: "destructive" });
        return false;
      }

      const commonFields = !formData.address || !formData.phone || !formData.role;
      let specificFields = false;

      if (formData.workType === 'client') {
        specificFields = !formData.projectType || !formData.budget || !formData.timeline || !formData.financingStatus;
      } else if (formData.workType === 'general-contractor') {
        specificFields = !formData.companyName || !formData.companySize || !formData.yearsInBusiness || !formData.projectSizeRange;
      } else if (formData.workType === 'subcontractor') {
        specificFields = !formData.companyName || !formData.companySize || !formData.yearsInBusiness || !formData.serviceArea;
      } else if (formData.workType === 'supplier') {
        specificFields = !formData.companyName || !formData.companySize || !formData.businessType || !formData.deliveryRadius || !formData.yearsInBusiness || !formData.minOrderValue;
      }

      if (commonFields || specificFields) {
        toast({ title: "Missing Information", description: "Please fill in all required company details marked with *", variant: "destructive" });
        return false;
      }

      // Enforce US Phone Format before proceeding
      const phoneRegex = /^\+1\d{10}$/;
      if (!phoneRegex.test(formData.phone.trim())) {
        toast({ title: "Invalid Phone Format", description: "Phone number must be in US format: +1 followed by 10 digits (e.g., +15551234567)", variant: "destructive" });
        return false;
      }
    }
    if (step === 3) {
      if (!formData.trades || formData.trades.length === 0) {
        const title = formData.workType === "client" ? "Selection Required" : "Trade Selection Required";
        const description = formData.workType === "client" ? "Please select at least one project interest" : "Please select at least one trade your company specializes in";
        toast({ title, description, variant: "destructive" });
        return false;
      }
    }

    if (step === 4) {
      if (!formData.goals || formData.goals.length === 0) {
        toast({ title: "Selection Required", description: "Please select at least one goal to continue", variant: "destructive" });
        return false;
      }
    }
    if (step === 3) {
      if (!formData.trades || formData.trades.length === 0) {
        const title = formData.workType === "client" ? "Selection Required" : "Trade Selection Required";
        const description = formData.workType === "client" ? "Please select at least one project interest" : "Please select at least one trade your company specializes in";
        toast({ title, description, variant: "destructive" });
        return false;
      }
    }

    if (step === 4) {
      if (!formData.goals || formData.goals.length === 0) {
        toast({ title: "Selection Required", description: "Please select at least one goal to continue", variant: "destructive" });
        return false;
      }
    }

    return true;
  };

  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSendOtp = async () => {
    if (!formData.phone || formData.phone.length < 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement actual OTP sending API call
      // await api.post('/auth/send-otp', { phone: formData.phone });

      // Simulating OTP send
      await new Promise(resolve => setTimeout(resolve, 1000));

      setOtpSent(true);
      toast({
        title: "OTP Sent!",
        description: `Verification code sent to ${formData.phone}`,
      });
    } catch (error: any) {
      toast({
        title: "Failed to Send OTP",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!formData.otp || formData.otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP",
        variant: "destructive",
      });
      return;
    }

    setIsVerifyingOtp(true);
    try {
      // TODO: Implement actual OTP verification API call
      // await api.post('/auth/verify-otp', { phone: formData.phone, otp: formData.otp });

      // Simulating OTP verification
      await new Promise(resolve => setTimeout(resolve, 1000));

      setOtpVerified(true);
      toast({
        title: "Phone Verified!",
        description: "Your phone number has been verified successfully",
      });
    } catch (error: any) {
      toast({
        title: "Verification Failed",
        description: error.message || "Invalid OTP. Please try again",
        variant: "destructive",
      });
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const basePayload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        workType: formData.workType,
        phone: formData.phone,
        goals: formData.goals,
      };

      let payload = { ...basePayload } as any;

      if (formData.workType === 'client') {
        payload = {
          ...payload,
          projectType: formData.projectType,
          budgetRange: formData.budget,
          timeline: formData.timeline,
          propertySize: formData.propertySize,
          financingStatus: formData.financingStatus,
          address: formData.address, // Property address
          companyName: formData.companyName, // Optional for client
          role: formData.role // Optional for client
        };
      } else if (formData.workType === 'general-contractor') {
        payload = {
          ...payload,
          companyName: formData.companyName,
          companySize: formData.companySize,
          yearsInBusiness: formData.yearsInBusiness,
          projectSizeRange: formData.projectSizeRange,
          address: formData.address,
          role: formData.role,
          trades: formData.trades
        };
      } else if (formData.workType === 'subcontractor') {
        payload = {
          ...payload,
          companyName: formData.companyName,
          companySize: formData.companySize,
          yearsInBusiness: formData.yearsInBusiness,
          serviceArea: formData.serviceArea,
          address: formData.address,
          role: formData.role,
          trades: formData.trades
        };
      } else if (formData.workType === 'supplier') {
        payload = {
          ...payload,
          companyName: formData.companyName,
          companySize: formData.companySize,
          yearsInBusiness: formData.yearsInBusiness,
          businessType: formData.businessType,
          deliveryRadius: formData.deliveryRadius,
          minOrderValue: formData.minOrderValue,
          offerCreditTerms: formData.offerCreditTerms,
          address: formData.address,
          role: formData.role,
          trades: formData.trades // representing product categories
        };
      }

      await authService.register(payload);

      toast({
        title: "Account Created Successfully! 🎉",
        description: "Your account has been successfully created. Please login to continue.",
      });

      navigate("/login");
    } catch (error: any) {
      console.error('Registration Error:', error);

      let errorMessage = "Please try again";

      if (error.errors && Array.isArray(error.errors) && error.errors.length > 0) {
        // Display the first validation error message
        errorMessage = error.errors[0].message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getTradesForWorkType = () => {
    if (formData.workType === "general-contractor") {
      return [
        { name: "Residential Construction", icon: Home },
        { name: "Commercial Construction", icon: Building },
        { name: "Renovation & Remodeling", icon: Hammer },
        { name: "New Construction", icon: Building2 },
        { name: "Project Management", icon: Briefcase },
        { name: "Design-Build", icon: Ruler },
      ];
    } else if (formData.workType === "subcontractor") {
      return [
        { name: "Plumbing", icon: Droplet },
        { name: "Electrical", icon: Zap },
        { name: "HVAC", icon: Wrench },
        { name: "Carpentry", icon: Hammer },
        { name: "Roofing", icon: Home },
        { name: "Painting", icon: PaintBucket },
        { name: "Flooring", icon: Ruler },
        { name: "Masonry", icon: Building },
        { name: "Landscaping", icon: TreePine },
        { name: "Concrete", icon: Building2 },
        { name: "Drywall", icon: Ruler },
        { name: "Windows & Doors", icon: Building },
      ];
    } else if (formData.workType === "supplier") {
      return [
        { name: "Building Materials", icon: Package },
        { name: "Tools & Equipment", icon: Wrench },
        { name: "Plumbing Supplies", icon: Droplet },
        { name: "Electrical Supplies", icon: Zap },
        { name: "Paint & Supplies", icon: PaintBucket },
        { name: "Hardware", icon: Hammer },
        { name: "Lumber & Wood", icon: TreePine },
        { name: "Concrete & Masonry", icon: Building },
      ];
    } else if (formData.workType === "client") {
      return [
        { name: "Residential Project", icon: Home },
        { name: "Commercial Project", icon: Building },
        { name: "Renovation", icon: Hammer },
        { name: "New Construction", icon: Building2 },
        { name: "Interior Design", icon: PaintBucket },
        { name: "Landscaping", icon: TreePine },
      ];
    }
    return [];
  };

  const getGoalsForWorkType = () => {
    if (formData.workType === "general-contractor" || formData.workType === "subcontractor") {
      return [
        "Find new projects and opportunities",
        "Grow my business and revenue",
        "Connect with reliable suppliers",
        "Manage my team efficiently",
        "Track project progress in real-time",
        "Get more qualified leads",
        "Build my professional reputation",
        "Network with other contractors",
      ];
    } else if (formData.workType === "supplier") {
      return [
        "Reach more contractors and builders",
        "Increase sales and revenue",
        "Showcase my products and services",
        "Build long-term relationships",
        "Expand my market reach",
        "Get more purchase orders",
      ];
    } else if (formData.workType === "client") {
      return [
        "Find reliable and vetted contractors",
        "Get competitive quotes and estimates",
        "Complete my project on time",
        "Stay within my budget",
        "Ensure quality workmanship",
        "Easy project management and communication",
      ];
    }
    return [];
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Sidebar */}
      <div className="w-100 bg-[#fce011] p-6 flex flex-col">
        <div className="mb-8">
          <img src="/main-logo.png" alt="ContractorList" className="h-10 w-auto" />
        </div>

        <div className="flex-1 space-y-6">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {index < steps.length - 1 && (
                <div className="absolute left-5 top-10 w-0.5 h-12 bg-white/30" />
              )}
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-base transition-all flex-shrink-0 ${step.completed
                    ? "bg-white text-black shadow-md"
                    : currentStep === step.number
                      ? "bg-gray-900 text-white shadow-md"
                      : "bg-black/10 text-white/70"
                    }`}
                >
                  {step.completed ? <Check className="w-5 h-5" /> : step.number}
                </div>
                <h3
                  className={`font-medium text-sm ${currentStep === step.number || step.completed
                    ? "text-black"
                    : "text-gray-500"
                    }`}
                >
                  {step.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-auto pt-6 border-t border-white/20">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm font-medium transition-all">
            <HelpCircle className="w-4 h-4" />
            Need Help?
          </button>
        </div>
      </div>

      {/* Right Content */}
      <div className="flex-1 bg-gray-50 p-12 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">

            {/* Step 1: Register */}
            {currentStep === 1 && (
              <div className="space-y-8">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-[#fce011] rounded-full mb-4">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-4xl font-bold text-gray-900 mb-3">Create Your Account</h2>
                  <p className="text-lg text-gray-600">Join thousands of professionals on ContractorList</p>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">First Name *</Label>
                      <div className="relative mt-1">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="firstName"
                          placeholder="John"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          className="pl-10 h-11"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">Last Name *</Label>
                      <div className="relative mt-1">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="lastName"
                          placeholder="Doe"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          className="pl-10 h-11"
                        />
                      </div>
                    </div>

                    <div className="col-span-2">
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address *</Label>
                      <div className="relative mt-1">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="john.doe@company.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="pl-10 h-11"
                        />
                      </div>

                      {/* OTP Section */}
                      {otpVerified ? (
                        <div className="mt-2 flex items-center gap-2 text-green-600 bg-green-50 p-2 rounded-md">
                          <CheckCircle2 className="w-5 h-5" />
                          <span className="text-sm font-medium">Email Verified</span>
                        </div>
                      ) : (
                        <div className="mt-2 space-y-3">
                          {!otpSent ? (
                            formData.email && (
                              <Button
                                type="button"
                                onClick={handleSendEmailOtp}
                                disabled={isLoading || !formData.email}
                                variant="outline"
                                className="w-full"
                              >
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Mail className="w-4 h-4 mr-2" />}
                                Verify Email
                              </Button>
                            )
                          ) : (
                            <div className="space-y-2">
                              <div className="flex gap-2">
                                <Input
                                  placeholder="Enter 6-digit code"
                                  value={formData.otp}
                                  onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                                  maxLength={6}
                                  className="tracking-widest"
                                />
                                <Button
                                  type="button"
                                  onClick={handleVerifyEmailOtp}
                                  disabled={isVerifyingOtp}
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                  {isVerifyingOtp ? "Verifying..." : "Verify"}
                                </Button>
                              </div>
                              <button
                                type="button"
                                onClick={handleSendEmailOtp}
                                className="text-xs text-blue-600 hover:underline"
                              >
                                Resend Code
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="col-span-2">
                      <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password *</Label>
                      <div className="relative mt-1">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a strong password"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          className="pl-10 pr-10 h-11"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                        Minimum 8 characters with uppercase, lowercase, and number
                      </p>
                    </div>

                    <div className="col-span-2">
                      <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirm Password *</Label>
                      <div className="relative mt-1">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          className="pl-10 pr-10 h-11"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        className="mt-1 rounded border-gray-300 text-black focus:ring-[#fce011] w-4 h-4"
                      />
                      <span className="text-sm text-gray-700">
                        I agree to the{" "}
                        <a href="/terms" className="text-gray-900 hover:text-black font-medium underline">
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="/privacy" className="text-gray-900 hover:text-black font-medium underline">
                          Privacy Policy
                        </a>
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Company Info */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Setup Your Company</h2>
                </div>

                <div>
                  <Label className="text-base font-semibold mb-3 block">
                    What type of work do you do? <span className="text-red-500">*</span>
                  </Label>
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { value: "client", label: "Client", icon: UserCircle },
                      { value: "subcontractor", label: "Subcontractor", icon: HardHat },
                      { value: "general-contractor", label: "General Contractor", icon: Building2 },
                      { value: "supplier", label: "Supplier", icon: Store },
                    ].map((type) => {
                      const Icon = type.icon;
                      return (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, workType: type.value })}
                          className={`p-5 border-2 rounded-xl text-center transition-all flex flex-col items-center gap-2 ${formData.workType === type.value
                            ? "border-teal-500 bg-teal-50"
                            : "border-gray-300 hover:border-gray-400 bg-white"
                            }`}
                        >
                          <Icon className={`w-8 h-8 ${formData.workType === type.value ? "text-teal-600" : "text-gray-400"}`} />
                          <span className={`text-xs font-semibold ${formData.workType === type.value ? "text-teal-700" : "text-gray-600"}`}>
                            {type.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Subcontractor Fields */}
                {formData.workType === "subcontractor" && (
                  <>
                    <div className="border-t pt-6 space-y-4">
                      <h3 className="text-base font-semibold text-gray-900 mb-4">Company Info</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          placeholder="Company Name *"
                          value={formData.companyName}
                          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                          className="bg-gray-50"
                        />
                        <select
                          value={formData.companySize}
                          onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
                          className="w-full h-10 rounded-md border border-gray-300 bg-gray-50 px-3 text-sm"
                        >
                          <option value="">Company Size *</option>
                          <option value="1-5">1-5 employees</option>
                          <option value="6-10">6-10 employees</option>
                          <option value="11-25">11-25 employees</option>
                          <option value="25+">25+ employees</option>
                        </select>
                        <Input
                          placeholder="Years in Business *"
                          type="number"
                          value={formData.yearsInBusiness || ''}
                          onChange={(e) => setFormData({ ...formData, yearsInBusiness: parseInt(e.target.value) || 0 })}
                          className="bg-gray-50"
                        />
                        <Input
                          placeholder="Service Area (City/Region) *"
                          value={formData.serviceArea || ''}
                          onChange={(e) => setFormData({ ...formData, serviceArea: e.target.value })}
                          className="bg-gray-50"
                        />
                      </div>
                    </div>

                    <div className="border-t pt-6 space-y-4">
                      <h3 className="text-base font-semibold text-gray-900 mb-4">Company Address</h3>
                      <Input
                        placeholder="Address *"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="bg-gray-50"
                      />
                    </div>

                    <div className="border-t pt-6 space-y-4">
                      <h3 className="text-base font-semibold text-gray-900 mb-4">Contact Details</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <select
                          value={formData.role || ''}
                          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                          className="w-full h-10 rounded-md border border-gray-300 bg-gray-50 px-3 text-sm">
                          <option value="">Role *</option>
                          <option value="owner">Owner</option>
                          <option value="manager">Manager</option>
                          <option value="foreman">Foreman</option>
                          <option value="estimator">Estimator</option>
                        </select>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                          <Input
                            placeholder="Phone Number *"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="bg-gray-50 pl-10"
                            disabled={smsVerified}
                          />
                          {smsVerified && (
                            <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                          )}
                        </div>

                        {!smsVerified && formData.phone && formData.phone.length >= 10 && (
                          <div className="col-span-2">
                            {!smsSent ? (
                              <Button
                                type="button"
                                onClick={handleSendSmsOtp}
                                disabled={isLoading}
                                className="w-full bg-teal-600 text-white"
                              >
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Verify Phone Number"}
                              </Button>
                            ) : (
                              <div className="space-y-2">
                                <div className="flex gap-2">
                                  <Input
                                    placeholder="Enter SMS Code"
                                    value={smsOtp}
                                    onChange={(e) => setSmsOtp(e.target.value)}
                                    maxLength={6}
                                    className="tracking-widest text-center"
                                  />
                                  <Button
                                    type="button"
                                    onClick={handleVerifySmsOtp}
                                    disabled={isVerifyingSms}
                                    className="bg-green-600 text-white"
                                  >
                                    {isVerifyingSms ? "..." : "Verify"}
                                  </Button>
                                </div>
                                <button type="button" onClick={handleSendSmsOtp} className="text-xs text-blue-500 underline">Resend Code</button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* General Contractor Fields */}
                {formData.workType === "general-contractor" && (
                  <>
                    <div className="border-t pt-6 space-y-4">
                      <h3 className="text-base font-semibold text-gray-900 mb-4">Company Info</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          placeholder="Company Name *"
                          value={formData.companyName}
                          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                          className="bg-gray-50"
                        />
                        <select
                          value={formData.companySize}
                          onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
                          className="w-full h-10 rounded-md border border-gray-300 bg-gray-50 px-3 text-sm"
                        >
                          <option value="">Company Size *</option>
                          <option value="10-25">10-25 employees</option>
                          <option value="26-50">26-50 employees</option>
                          <option value="51-100">51-100 employees</option>
                          <option value="100+">100+ employees</option>
                        </select>
                        <Input
                          placeholder="Years in Business *"
                          type="number"
                          value={formData.yearsInBusiness || ''}
                          onChange={(e) => setFormData({ ...formData, yearsInBusiness: parseInt(e.target.value) || 0 })}
                          className="bg-gray-50"
                        />
                        <select
                          value={formData.projectSizeRange || ''}
                          onChange={(e) => setFormData({ ...formData, projectSizeRange: e.target.value })}
                          className="w-full h-10 rounded-md border border-gray-300 bg-gray-50 px-3 text-sm">
                          <option value="">Project Size Range *</option>
                          <option value="under-500k">Under $500K</option>
                          <option value="500k-2m">$500K - $2M</option>
                          <option value="2m-10m">$2M - $10M</option>
                          <option value="10m+">$10M+</option>
                        </select>
                      </div>
                    </div>

                    <div className="border-t pt-6 space-y-4">
                      <h3 className="text-base font-semibold text-gray-900 mb-4">Company Address</h3>
                      <Input
                        placeholder="Address *"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="bg-gray-50"
                      />
                    </div>

                    <div className="border-t pt-6 space-y-4">
                      <h3 className="text-base font-semibold text-gray-900 mb-4">Contact Details</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <select
                          value={formData.role || ''}
                          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                          className="w-full h-10 rounded-md border border-gray-300 bg-gray-50 px-3 text-sm">
                          <option value="">Role *</option>
                          <option value="owner">Owner</option>
                          <option value="project-manager">Project Manager</option>
                          <option value="estimator">Estimator</option>
                          <option value="superintendent">Superintendent</option>
                        </select>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                          <Input
                            placeholder="Phone Number *"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="bg-gray-50 pl-10"
                            disabled={false}
                          />
                          {otpVerified && (
                            <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                          )}
                        </div>
                        {!true && formData.phone && formData.phone.length >= 10 && (
                          <div className="col-span-2">
                            <Button
                              type="button"
                              onClick={handleSendOtp}
                              disabled={isLoading || otpSent}
                              className="w-full bg-teal-500 hover:bg-teal-600 text-white"
                            >
                              {otpSent ? "OTP Sent" : "Send OTP"}
                            </Button>
                          </div>
                        )}
                        {otpSent && !true && (
                          <>
                            <div className="col-span-2">
                              <Input
                                placeholder="Enter 6-digit OTP *"
                                type="text"
                                maxLength={6}
                                value={formData.otp}
                                onChange={(e) => setFormData({ ...formData, otp: e.target.value.replace(/\D/g, '') })}
                                className="bg-gray-50 text-center text-lg tracking-widest"
                              />
                            </div>
                            <div className="col-span-2 flex gap-2">
                              <Button
                                type="button"
                                onClick={handleVerifyOtp}
                                disabled={isVerifyingOtp || formData.otp.length !== 6}
                                className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                              >
                                {isVerifyingOtp ? "Verifying..." : "Verify OTP"}
                              </Button>
                              <Button
                                type="button"
                                onClick={handleSendOtp}
                                disabled={isLoading}
                                variant="outline"
                                className="flex-1"
                              >
                                Resend OTP
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* Supplier Fields */}
                {formData.workType === "supplier" && (
                  <>
                    <div className="border-t pt-6 space-y-4">
                      <h3 className="text-base font-semibold text-gray-900 mb-4">Company Info</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          placeholder="Company Name *"
                          value={formData.companyName}
                          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                          className="bg-gray-50"
                        />
                        <select
                          value={formData.companySize}
                          onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
                          className="w-full h-10 rounded-md border border-gray-300 bg-gray-50 px-3 text-sm"
                        >
                          <option value="">Company Size *</option>
                          <option value="1-10">1-10 employees</option>
                          <option value="11-50">11-50 employees</option>
                          <option value="51-200">51-200 employees</option>
                          <option value="200+">200+ employees</option>
                        </select>
                        <select
                          value={formData.businessType || ''}
                          onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                          className="w-full h-10 rounded-md border border-gray-300 bg-gray-50 px-3 text-sm">
                          <option value="">Business Type *</option>
                          <option value="manufacturer">Manufacturer</option>
                          <option value="distributor">Distributor</option>
                          <option value="wholesaler">Wholesaler</option>
                          <option value="retailer">Retailer</option>
                        </select>
                        <Input
                          placeholder="Years in Business *"
                          type="number"
                          value={formData.yearsInBusiness || ''}
                          onChange={(e) => setFormData({ ...formData, yearsInBusiness: parseInt(e.target.value) || 0 })}
                          className="bg-gray-50"
                        />
                        <Input
                          placeholder="Delivery Radius (miles) *"
                          type="number"
                          value={formData.deliveryRadius || ''}
                          onChange={(e) => setFormData({ ...formData, deliveryRadius: parseInt(e.target.value) || 0 })}
                          className="bg-gray-50"
                        />
                        <Input
                          placeholder="Minimum Order Value *"
                          value={formData.minOrderValue || ''}
                          onChange={(e) => setFormData({ ...formData, minOrderValue: e.target.value })}
                          className="bg-gray-50"
                        />
                        <div className="col-span-2">
                          <label className="flex items-center gap-3 cursor-pointer p-4 border-2 border-gray-200 rounded-lg hover:border-teal-300">
                            <input
                              type="checkbox"
                              checked={!!formData.offerCreditTerms}
                              onChange={(e) => setFormData({ ...formData, offerCreditTerms: e.target.checked })}
                              className="rounded border-gray-300 text-teal-500 focus:ring-teal-500"
                            />
                            <span className="font-medium text-gray-700">Offer Credit Terms</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-6 space-y-4">
                      <h3 className="text-base font-semibold text-gray-900 mb-4">Company Address</h3>
                      <Input
                        placeholder="Address *"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="bg-gray-50"
                      />
                    </div>

                    <div className="border-t pt-6 space-y-4">
                      <h3 className="text-base font-semibold text-gray-900 mb-4">Contact Details</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <select
                          value={formData.role || ''}
                          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                          className="w-full h-10 rounded-md border border-gray-300 bg-gray-50 px-3 text-sm">
                          <option value="">Role *</option>
                          <option value="owner">Owner</option>
                          <option value="sales-manager">Sales Manager</option>
                          <option value="account-rep">Account Representative</option>
                        </select>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                          <Input
                            placeholder="Phone Number *"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="bg-gray-50 pl-10"
                            disabled={smsVerified}
                          />
                          {otpVerified && (
                            <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                          )}
                        </div>
                        {!smsVerified && formData.phone && formData.phone.length >= 10 && (
                          <div className="col-span-2">
                            {!smsSent ? (
                              <Button
                                type="button"
                                onClick={handleSendSmsOtp}
                                disabled={isLoading}
                                className="w-full bg-teal-600 text-white"
                              >
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Verify Phone Number (SMS)"}
                              </Button>
                            ) : (
                              <div className="space-y-2">
                                <div className="flex gap-2">
                                  <Input
                                    placeholder="Enter SMS Code"
                                    value={smsOtp}
                                    onChange={(e) => setSmsOtp(e.target.value)}
                                    maxLength={6}
                                    className="tracking-widest text-center"
                                  />
                                  <Button
                                    type="button"
                                    onClick={handleVerifySmsOtp}
                                    disabled={isVerifyingSms}
                                    className="bg-green-600 text-white"
                                  >
                                    {isVerifyingSms ? "..." : "Verify"}
                                  </Button>
                                </div>
                                <button type="button" onClick={handleSendSmsOtp} className="text-xs text-blue-500 underline">Resend Code</button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* Client Fields */}
                {formData.workType === "client" && (
                  <>
                    <div className="border-t pt-6 space-y-4">
                      <h3 className="text-base font-semibold text-gray-900 mb-4">Project Details</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <select
                          value={formData.projectType || ''}
                          onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                          className="w-full h-10 rounded-md border border-gray-300 bg-gray-50 px-3 text-sm">
                          <option value="">Project Type *</option>
                          <option value="residential">Residential</option>
                          <option value="commercial">Commercial</option>
                          <option value="renovation">Renovation</option>
                          <option value="new-construction">New Construction</option>
                        </select>
                        <select
                          value={formData.budget || ''}
                          onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                          className="w-full h-10 rounded-md border border-gray-300 bg-gray-50 px-3 text-sm">
                          <option value="">Budget Range *</option>
                          <option value="over-1m">Over $1,000,000</option>
                        </select>
                        <select
                          value={formData.timeline || ''}
                          onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                          className="w-full h-10 rounded-md border border-gray-300 bg-gray-50 px-3 text-sm">
                          <option value="">Timeline *</option>
                          <option value="immediate">Immediate (Within 1 month)</option>
                          <option value="1-3-months">1-3 months</option>
                          <option value="3-6-months">3-6 months</option>
                          <option value="6-12-months">6-12 months</option>
                          <option value="planning">Planning Phase</option>
                        </select>
                        <Input
                          placeholder="Property Size (sq ft)"
                          type="number"
                          value={formData.propertySize || ''}
                          onChange={(e) => setFormData({ ...formData, propertySize: e.target.value })}
                          className="bg-gray-50"
                        />
                        <Input
                          placeholder="Company/Organization Name"
                          value={formData.companyName}
                          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                          className="bg-gray-50"
                        />
                        <select
                          value={formData.financingStatus || ''}
                          onChange={(e) => setFormData({ ...formData, financingStatus: e.target.value })}
                          className="w-full h-10 rounded-md border border-gray-300 bg-gray-50 px-3 text-sm">
                          <option value="">Financing Status *</option>
                          <option value="secured">Financing Secured</option>
                          <option value="in-progress">In Progress</option>
                          <option value="not-started">Not Started</option>
                          <option value="cash">Cash Purchase</option>
                        </select>
                      </div>
                    </div>

                    <div className="border-t pt-6 space-y-4">
                      <h3 className="text-base font-semibold text-gray-900 mb-4">Property Address</h3>
                      <Input
                        placeholder="Property Address *"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="bg-gray-50"
                      />
                    </div>

                    <div className="border-t pt-6 space-y-4">
                      <h3 className="text-base font-semibold text-gray-900 mb-4">Contact Details</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <select
                          value={formData.role || ''}
                          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                          className="w-full h-10 rounded-md border border-gray-300 bg-gray-50 px-3 text-sm">
                          <option value="">Role *</option>
                          <option value="owner">Owner</option>
                          <option value="property-manager">Property Manager</option>
                          <option value="project-coordinator">Project Coordinator</option>
                          <option value="facilities-manager">Facilities Manager</option>
                        </select>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                          <Input
                            placeholder="Phone Number (+1...)"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="bg-gray-50 pl-10"
                            disabled={smsVerified}
                          />
                          {smsVerified && (
                            <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                          )}
                        </div>

                        {!smsVerified && formData.phone && formData.phone.length >= 10 && (
                          <div className="col-span-2">
                            {!smsSent ? (
                              <Button
                                type="button"
                                onClick={handleSendSmsOtp}
                                disabled={isLoading}
                                className="w-full bg-teal-600 text-white"
                              >
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Verify Phone Number (SMS)"}
                              </Button>
                            ) : (
                              <div className="space-y-2">
                                <div className="flex gap-2">
                                  <Input
                                    placeholder="Enter SMS Code"
                                    value={smsOtp}
                                    onChange={(e) => setSmsOtp(e.target.value)}
                                    maxLength={6}
                                    className="tracking-widest text-center"
                                  />
                                  <Button
                                    type="button"
                                    onClick={handleVerifySmsOtp}
                                    disabled={isVerifyingSms}
                                    className="bg-green-600 text-white"
                                  >
                                    {isVerifyingSms ? "..." : "Verify"}
                                  </Button>
                                </div>
                                <button type="button" onClick={handleSendSmsOtp} className="text-xs text-blue-500 underline">Resend Code</button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}


              </div>
            )}

            {/* Step 3: Company Trades */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {formData.workType === "client" ? "Project Interests" :
                      formData.workType === "supplier" ? "Product Categories" :
                        "Company Trades"}
                  </h2>
                  <p className="text-gray-600">
                    {formData.workType === "client"
                      ? "What type of projects are you interested in?"
                      : formData.workType === "supplier"
                        ? "Select the product categories you supply"
                        : formData.workType === "general-contractor"
                          ? "Select the types of construction projects you handle"
                          : "Select the trades your company specializes in"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {getTradesForWorkType().map((trade) => {
                    const Icon = trade.icon;
                    return (
                      <label
                        key={trade.name}
                        className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-teal-300 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={formData.trades.includes(trade.name)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({ ...formData, trades: [...formData.trades, trade.name] });
                            } else {
                              setFormData({ ...formData, trades: formData.trades.filter(t => t !== trade.name) });
                            }
                          }}
                          className="rounded border-gray-300 text-teal-500 focus:ring-teal-500"
                        />
                        <Icon className="w-5 h-5 text-gray-600" />
                        <span className="font-medium text-gray-700">{trade.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 4: Your Goals */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Goals</h2>
                  <p className="text-gray-600">What are you looking to achieve with ContractorList?</p>
                </div>

                <div className="space-y-3">
                  {getGoalsForWorkType().map((goal) => (
                    <label
                      key={goal}
                      className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-teal-300 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={formData.goals.includes(goal)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({ ...formData, goals: [...formData.goals, goal] });
                          } else {
                            setFormData({ ...formData, goals: formData.goals.filter(g => g !== goal) });
                          }
                        }}
                        className="rounded border-gray-300 text-teal-500 focus:ring-teal-500"
                      />
                      <Target className="w-5 h-5 text-gray-600" />
                      <span className="font-medium text-gray-700">{goal}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="px-8 h-12 border-2 border-gray-300 hover:bg-gray-50 font-semibold"
                >
                  Back
                </Button>
              )}
              <Button
                type="button"
                onClick={handleNext}
                disabled={isLoading}
                className="ml-auto bg-[#fce011] hover:bg-[#ebd010] text-black font-bold px-10 h-12 text-base shadow-lg hover:shadow-xl transition-all"
              >
                {currentStep === 4 ? (isLoading ? "Creating Account..." : "Complete Registration") : "Continue"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupMultiStep;
