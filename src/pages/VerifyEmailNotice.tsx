import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, ArrowLeft } from 'lucide-react';
import authService from '@/api/authService';
import { useToast } from '@/hooks/use-toast';

const VerifyEmailNotice = () => {
  const location = useLocation();
  const { toast } = useToast();
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  // Get email from location state or from the form (you might want to store it in localStorage during signup)
  const email = location.state?.email || '';

  const handleResendVerification = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Email address not found. Please try signing up again.",
        variant: "destructive",
      });
      return;
    }

    setIsResending(true);
    setResendSuccess(false);

    try {
      await authService.resendVerification(email);
      setResendSuccess(true);
      toast({
        title: "Verification Email Sent!",
        description: "A new verification email has been sent to your inbox.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to resend verification email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link
          to="/login"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Login
        </Link>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Check your email
            </CardTitle>
            <CardDescription className="text-gray-600">
              We've sent a verification link to your email address
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                Please check your email and click on the verification link to activate your account.
                The link will expire in 24 hours.
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800 mb-3">
                <strong>Don't see the email?</strong> Check your spam folder or click the button below to resend the verification email.
              </p>
              {email && (
                <Button
                  onClick={handleResendVerification}
                  disabled={isResending || resendSuccess}
                  variant="outline"
                  className="w-full border-yellow-600 text-yellow-600 hover:bg-yellow-50"
                >
                  {isResending ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600 mr-2"></div>
                      Sending...
                    </div>
                  ) : resendSuccess ? (
                    'Email Sent!'
                  ) : (
                    'Resend Verification Email'
                  )}
                </Button>
              )}
            </div>

            {resendSuccess && (
              <Alert className="bg-green-50 border-green-200">
                <AlertDescription className="text-green-800">
                  Verification email has been sent successfully!
                </AlertDescription>
              </Alert>
            )}

            <div className="text-center space-y-4">
              <Button
                asChild
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
              >
                <Link to="/login">
                  Go to Login
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerifyEmailNotice;

