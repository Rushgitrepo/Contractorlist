import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import authService from '@/api/authService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, ArrowLeft, Loader2 } from 'lucide-react';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link. Please check your email and try again.');
      return;
    }

    verifyEmail(token);
  }, [searchParams]);

  const verifyEmail = async (token: string) => {
    try {
      const response = await authService.verifyEmail(token);
      setStatus('success');
      setMessage(response.message || 'Email verified successfully!');

      // Redirect to login after 3 seconds
      setTimeout(() => navigate('/login'), 3000);
    } catch (error: any) {
      setStatus('error');

      // Handle different error types
      if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
        setMessage('Cannot connect to server. Please make sure the backend server is running on http://localhost:5000');
      } else if (error.response?.status === 404) {
        setMessage('Verification endpoint not found. Please check your backend server configuration.');
      } else if (error.response?.status === 401 || error.response?.status === 400) {
        setMessage(error.response?.data?.message || 'Verification failed. The link may have expired or is invalid.');
      } else if (error.response?.data?.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage('Verification failed. The link may have expired. Please request a new verification email.');
      }
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
              {status === 'loading' && (
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                </div>
              )}
              {status === 'success' && (
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              )}
              {status === 'error' && (
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
              )}
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              {status === 'loading' && 'Verifying your email...'}
              {status === 'success' && 'Email Verified!'}
              {status === 'error' && 'Verification Failed'}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {status === 'loading' && 'Please wait while we verify your email address.'}
              {status === 'success' && 'Your email has been successfully verified.'}
              {status === 'error' && 'We couldn\'t verify your email address.'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {status === 'success' && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  {message}
                </AlertDescription>
              </Alert>
            )}

            {status === 'error' && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  {message}
                </AlertDescription>
              </Alert>
            )}

            {status === 'success' && (
              <div className="text-center space-y-4">
                <p className="text-sm text-gray-600">
                  Redirecting to login page...
                </p>
                <Button
                  onClick={() => navigate('/login')}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
                >
                  Go to Login
                </Button>
              </div>
            )}

            {status === 'error' && (
              <div className="text-center space-y-4">
                <p className="text-sm text-gray-600">
                  You can request a new verification email from the login page.
                </p>
                <Button
                  asChild
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
                >
                  <Link to="/login">
                    Go to Login
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerifyEmail;

