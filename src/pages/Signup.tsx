import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  Building,
  ArrowLeft,
  Check,
  Users,
  Briefcase,
  Store,
} from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { clearError } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import authService from "@/api/authService";

const signupSchema = z
  .object({
    name: z.string().min(2, "Please Enter your name"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string(),
    phone: z.string().optional(),
    company: z.string().optional(),
    // role: z.enum(["contractor", "client"], {
    //   required_error: "Please select your account type",
    // }),

    role: z.preprocess(
      (val) => (val === "" || val === null ? undefined : val),
      z.enum(["contractor", "client", "vendor"], {
        required_error: "Please select your account type",
      })
    ),
    // Contractor specific fields
    licenseNumber: z.string().optional(),
    businessAddress: z.string().optional(),
    yearsExperience: z.string().optional(),
    specialties: z.string().optional(),
    // Client specific fields
    projectType: z.string().optional(),
    budget: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

const Signup = () => {
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<
    "client" | "contractor" | "vendor" | ""
  >("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Set preselected role from navigation state
  useEffect(() => {
    const preselectedRole = location.state?.preselectedRole;
    if (preselectedRole === 'client' || preselectedRole === 'contractor' || preselectedRole === 'vendor') {
      setSelectedRole(preselectedRole);
    }
  }, [location.state]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setError("");
    setIsLoading(true);
    dispatch(clearError());

    try {
      // Split name into first and last name
      const nameParts = data.name.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ') || '';

      // Map role to workType
      let workType: 'client' | 'subcontractor' | 'general-contractor' | 'supplier' = 'client';
      if (data.role === 'vendor') workType = 'supplier';
      else if (data.role === 'contractor') workType = 'subcontractor'; // Defaulting to subcontractor 

      // Call real backend API
      const response = await authService.register({
        firstName,
        lastName,
        email: data.email,
        password: data.password,
        workType, // Correct field for backend
        phone: data.phone || '',
        companyName: data.company, // Map company -> companyName
        address: data.businessAddress, // Map businessAddress -> address
        yearsInBusiness: data.yearsExperience ? Number(data.yearsExperience) : undefined, // Map yearsExperience -> yearsInBusiness
        trades: data.specialties ? data.specialties.split(',').map(s => s.trim()) : undefined, // Map specialties -> trades
        projectType: data.projectType,
        budgetRange: data.budget, // Map budget -> budgetRange
        // Add other fields mapping if necessary
        role: data.role // Pass original role just in case
      });

      toast({
        title: "Account Created Successfully!",
        description: "Please check your email to verify your account.",
      });

      // Redirect to verification notice page with email
      navigate("/verify-email-notice", { state: { email: data.email } });
    } catch (err: any) {
      const errorMessage = err.message || "Registration failed. Please try again.";
      setError(errorMessage);
      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Back to Home */}
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <img
                src="/main-logo.png"
                alt="Contractorlist Logo"
                className="h-12 w-auto"
              />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Create your account
            </CardTitle>
            <CardDescription className="text-gray-600">
              Join our network of professionals
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Account Type Selection */}
              <div className="space-y-4">
                <Label className="text-base font-semibold text-gray-800">
                  I want to sign up as:
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Client Option */}
                  <label
                    htmlFor="client"
                    className={`relative flex flex-col items-center p-5 border-2 rounded-2xl cursor-pointer transition-all ${selectedRole === 'client'
                      ? 'border-green-400 bg-green-50 shadow-lg'
                      : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
                      }`}
                  >
                    <input
                      type="radio"
                      id="client"
                      value="client"
                      {...register("role")}
                      onChange={(e) => setSelectedRole(e.target.value as "client")}
                      className="absolute top-4 right-4 text-green-600 focus:ring-green-500"
                    />
                    <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center mb-3 shadow-md">
                      <Users className="w-7 h-7 text-green-600" />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-1">Client</h3>
                    <p className="text-sm text-gray-600 text-center">Find contractors</p>
                  </label>

                  {/* Contractor Option */}
                  <label
                    htmlFor="contractor"
                    className={`relative flex flex-col items-center p-5 border-2 rounded-2xl cursor-pointer transition-all ${selectedRole === 'contractor'
                      ? 'border-blue-400 bg-blue-50 shadow-lg'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                      }`}
                  >
                    <input
                      type="radio"
                      id="contractor"
                      value="contractor"
                      {...register("role")}
                      onChange={(e) => setSelectedRole(e.target.value as "contractor")}
                      className="absolute top-4 right-4 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mb-3 shadow-md">
                      <Briefcase className="w-7 h-7 text-blue-600" />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-1">Contractor</h3>
                    <p className="text-sm text-gray-600 text-center">Get projects</p>
                  </label>

                  {/* Vendor Option */}
                  <label
                    htmlFor="vendor"
                    className={`relative flex flex-col items-center p-5 border-2 rounded-2xl cursor-pointer transition-all ${selectedRole === 'vendor'
                      ? 'border-purple-400 bg-purple-50 shadow-lg'
                      : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                      }`}
                  >
                    <input
                      type="radio"
                      id="vendor"
                      value="vendor"
                      {...register("role")}
                      onChange={(e) => setSelectedRole(e.target.value as "vendor")}
                      className="absolute top-4 right-4 text-purple-600 focus:ring-purple-500"
                    />
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center mb-3 shadow-md">
                      <Store className="w-7 h-7 text-purple-600" />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-1">Vendor</h3>
                    <p className="text-sm text-gray-600 text-center">Sell materials</p>
                  </label>
                </div>
                {errors.role && (
                  <p className="text-sm text-red-600">{errors.role.message}</p>
                )}
              </div>

              {/* Role-specific fields */}
              {selectedRole === "contractor" && (
                <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900">
                    Contractor Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="licenseNumber"
                        className="text-sm font-medium text-gray-700"
                      >
                        License Number
                      </Label>
                      <Input
                        id="licenseNumber"
                        placeholder="Enter license number"
                        {...register("licenseNumber")}
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="yearsExperience"
                        className="text-sm font-medium text-gray-700"
                      >
                        Years of Experience
                      </Label>
                      <Input
                        id="yearsExperience"
                        placeholder="e.g., 5 years"
                        {...register("yearsExperience")}
                      />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <Label
                      htmlFor="specialties"
                      className="text-sm font-medium text-gray-700"
                    >
                      Specialties
                    </Label>
                    <Input
                      id="specialties"
                      placeholder="e.g., Plumbing, Electrical, HVAC"
                      {...register("specialties")}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label
                      htmlFor="businessAddress"
                      className="text-sm font-medium text-gray-700"
                    >
                      Business Address
                    </Label>
                    <Input
                      id="businessAddress"
                      placeholder="Enter business address"
                      {...register("businessAddress")}
                    />
                  </div>
                </div>
              )}

              {selectedRole === "client" && (
                <div className="space-y-4 p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-green-900">
                    Project Information
                  </h3>
                  <div>
                    <Label
                      htmlFor="projectType"
                      className="text-sm font-medium text-gray-700"
                    >
                      Project Type
                    </Label>
                    <select
                      id="projectType"
                      {...register("projectType")}
                      className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    >
                      <option value="">Select project type</option>
                      <option value="residential">Residential</option>
                      <option value="commercial">Commercial</option>
                      <option value="renovation">Renovation</option>
                      <option value="new-construction">
                        New Construction
                      </option>
                    </select>
                  </div>
                </div>
              )}

              {selectedRole === "vendor" && (
                <div className="space-y-4 p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-semibold text-purple-900">
                    Store Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="storeName"
                        className="text-sm font-medium text-gray-700"
                      >
                        Store Name
                      </Label>
                      <Input
                        id="storeName"
                        placeholder="Enter your store name"
                        {...register("company")}
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="businessType"
                        className="text-sm font-medium text-gray-700"
                      >
                        Business Type
                      </Label>
                      <select
                        id="businessType"
                        {...register("projectType")}
                        className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      >
                        <option value="">Select business type</option>
                        <option value="building-materials">Building Materials</option>
                        <option value="tools-equipment">Tools & Equipment</option>
                        <option value="plumbing-supplies">Plumbing Supplies</option>
                        <option value="electrical-supplies">Electrical Supplies</option>
                        <option value="paint-supplies">Paint & Supplies</option>
                        <option value="hardware">Hardware Store</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <Label
                      htmlFor="storeAddress"
                      className="text-sm font-medium text-gray-700"
                    >
                      Store Address
                    </Label>
                    <Input
                      id="storeAddress"
                      placeholder="Enter your store address"
                      {...register("businessAddress")}
                    />
                  </div>
                </div>
              )}

              {/* Personal Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      className="pl-10 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                      {...register("name")}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-sm text-red-600">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                      {...register("email")}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="phone"
                    className="text-sm font-medium text-gray-700"
                  >
                    Phone Number
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter phone number"
                      className="pl-10 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                      {...register("phone")}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="company"
                    className="text-sm font-medium text-gray-700"
                  >
                    Company Name
                  </Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="company"
                      type="text"
                      placeholder="Enter company name"
                      className="pl-10 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                      {...register("company")}
                    />
                  </div>
                </div>
              </div>

              {/* Password Section */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create password"
                      className="pl-10 pr-10 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                      {...register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-600">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium text-gray-700"
                  >
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm password"
                      className="pl-10 pr-10 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                      {...register("confirmPassword")}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-600">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="mt-1 rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                />
                <Label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the{" "}
                  <Link
                    to="/terms"
                    className="text-yellow-600 hover:text-yellow-700 font-medium"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    className="text-yellow-600 hover:text-yellow-700 font-medium"
                  >
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                    Creating account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="w-full">
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </Button>
              <Button variant="outline" className="w-full">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
                Twitter
              </Button>
            </div>

            <div className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-yellow-600 hover:text-yellow-700"
              >
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
