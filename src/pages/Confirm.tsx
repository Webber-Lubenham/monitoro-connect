
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Parse query parameters from URL
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const Confirm: React.FC = () => {
  const query = useQuery();
  const navigate = useNavigate();
  
  const token = query.get('token');
  const email = query.get('email');
  const type = query.get('type') || 'signup';
  
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const confirmAccount = async () => {
      if (!token || !email) {
        setError('Missing token or email parameter');
        setLoading(false);
        return;
      }

      try {
        // Determine what type of confirmation this is
        if (type === 'signup') {
          // Handle signup confirmation
          const { error: signInError } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'signup',
            email: email
          });
          
          if (signInError) {
            console.error('Error confirming user:', signInError);
            setError(`Failed to confirm account: ${signInError.message}`);
          } else {
            setSuccess(true);
            toast({
              title: "Account confirmed successfully!",
              description: "Your account has been confirmed. Please log in."
            });
          }
        } else if (type === 'recovery') {
          // Handle password reset confirmation
          setSuccess(true);
          navigate(`/reset-password?token=${token}&email=${encodeURIComponent(email)}`);
        } else {
          setError(`Unknown confirmation type: ${type}`);
        }
      } catch (err) {
        console.error('Exception in confirmation process:', err);
        setError('An unexpected error occurred during confirmation');
      } finally {
        setLoading(false);
      }
    };
    
    confirmAccount();
  }, [token, email, type, navigate]);

  const handleRedirect = () => {
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 space-y-6 text-center">
        {loading && (
          <div className="py-8 flex flex-col items-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <h2 className="text-xl font-semibold">Confirming your account...</h2>
            <p className="text-gray-500 mt-2">Please wait a moment</p>
          </div>
        )}
        
        {!loading && success && (
          <div className="py-8 flex flex-col items-center">
            <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
            <h2 className="text-xl font-semibold">Account confirmed successfully!</h2>
            <p className="text-gray-500 mt-2">You can now log in to your account.</p>
            <Button className="mt-6" onClick={handleRedirect}>
              Go to Login
            </Button>
          </div>
        )}
        
        {!loading && error && (
          <div className="py-8 flex flex-col items-center">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold">Confirmation Error</h2>
            <p className="text-gray-500 mt-2">{error}</p>
            <Button className="mt-6" onClick={handleRedirect}>
              Return to Login
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Confirm;
