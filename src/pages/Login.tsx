import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Copy, Check } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { MOCK_ACCOUNTS } from "@/data/mockUsers";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedRole, setCopiedRole] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError("");
    setIsLoading(true);

    try {
      // 1. Check for specific MOCK ACCOUNTS first
      const mockAccount = MOCK_ACCOUNTS.find(
        (acc) => acc.email === data.email && acc.password === data.password
      );

      if (mockAccount) {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Dispatch setUser action
        const { setUser } = await import("@/store/slices/authSlice");
        dispatch(
          setUser({
            id: `mock-${mockAccount.role}-${Date.now()}`,
            name: mockAccount.name,
            email: mockAccount.email,
            role: mockAccount.role as any,
            phone: "(555) 000-0000",
            company: "Demo Company Inc.",
            is_verified: true,
          })
        );

        toast({
          title: "Demo Login Successful! 🚀",
          description: `Welcome back, ${mockAccount.name}`,
        });

        navigate(mockAccount.redirectPath);
        return;
      }

      // 2. Fallback to existing logic or show error if not using mock
      let userRole: 'contractor' | 'client' | 'homeowner' | 'admin' | 'vendor' = 'contractor';
      let userName = 'Demo User';
      let redirectPath = '/subcontractor-dashboard';

      if (data.email.includes('supplier') || data.email.includes('vendor')) {
        userRole = 'vendor';
        userName = 'Demo Supplier';
        redirectPath = '/supplier-dashboard';
      } else if (data.email.includes('homeowner') || data.email.includes('client')) {
        userRole = 'homeowner';
        userName = 'Demo Homeowner';
        redirectPath = '/homeowner-dashboard';
      } else if (data.email.includes('gc') || data.email.includes('general')) {
        userRole = 'contractor';
        userName = 'Demo General Contractor';
        redirectPath = '/gc-dashboard';
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Dispatch setUser action to update Redux state
      const { setUser } = await import('@/store/slices/authSlice');
      dispatch(setUser({
        id: '1',
        name: userName,
        email: data.email,
        role: userRole,
        phone: '(555) 123-4567',
        company: 'Demo Company',
        is_verified: true,
      }));

      toast({
        title: "Login Successful! 🎉",
        description: `Welcome ${userName}! (Demo Account - No API)`,
      });

      // Redirect to appropriate dashboard
      navigate(redirectPath);

    } catch (err: any) {
      const errorMessage = err.message || "Login failed. Please check your credentials.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (email: string, pass: string, role: string) => {
    setValue("email", email);
    setValue("password", pass);
    toast({
      title: "Credentials Filled! ⚡",
      description: `Ready to login as ${role}`,
    });
    setCopiedRole(role);
    setTimeout(() => setCopiedRole(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <Card className="shadow-xl border-0 mb-6">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <img
                src="/main-logo.png"
                alt="Contractorlist Logo"
                className="h-12 w-auto"
              />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Welcome back
            </CardTitle>
            <CardDescription className="text-gray-600">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-red-800 font-medium">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email address
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
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

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
                    placeholder="Enter your password"
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

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="remember"
                    className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                  />
                  <Label htmlFor="remember" className="text-sm text-gray-600">
                    Remember me
                  </Label>
                </div>
                <Link
                  to="/forgot-password"
                  className="text-sm text-yellow-600 hover:text-yellow-700 font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  "Sign in"
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

            <div className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-medium text-yellow-600 hover:text-yellow-700"
              >
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default Login;
