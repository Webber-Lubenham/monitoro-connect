
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UseConfirmationLogicProps {
  type: string | null;
  token: string | null;
  email: string | null;
}

export const useConfirmationLogic = ({ type, token, email }: UseConfirmationLogicProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [processing, setProcessing] = useState(true);
  const [tokenType, setTokenType] = useState<string | null>(null);
  
  useEffect(() => {
    const processToken = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Validating required parameters
        if (!type) {
          console.error("Missing required parameter: type");
          setError('Invalid confirmation link. Missing "type" parameter.');
          setLoading(false);
          return;
        }
        
        if (!token) {
          console.error("Missing required parameter: token");
          setError('Invalid confirmation link. Missing token.');
          setLoading(false);
          return;
        }
        
        if (!email) {
          console.error("Missing required parameter: email");
          setError('Invalid confirmation link. Missing email address.');
          setLoading(false);
          return;
        }
        
        console.log(`Processing ${type} confirmation for ${email} with token ${token.substring(0, 5)}...`);
        
        // Handle based on confirmation type
        if (type === 'signup') {
          // Handle signup verification
          const { error: verificationError } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'signup',
            email: email
          });
          
          if (verificationError) {
            console.error('Verification error:', verificationError);
            setError(`Account verification failed: ${verificationError.message}`);
          } else {
            setSuccess(true);
            toast({
              title: "Account verified",
              description: "Your account has been verified successfully. You can now sign in.",
              duration: 5000,
            });
          }
        } else if (type === 'recovery') {
          // For password recovery, redirect to the reset form
          setTokenType('recovery');
          navigate(`/reset-password?token=${token}&email=${encodeURIComponent(email)}`);
          return;
        } else if (type === 'guardian') {
          // For guardian invites
          setTokenType('guardian');
          navigate(`/guardian-signup?token=${token}&email=${encodeURIComponent(email)}`);
          return;
        } else {
          setError(`Unknown confirmation type: ${type}`);
        }
      } catch (error) {
        console.error('Error processing confirmation:', error);
        setError('An unexpected error occurred during confirmation');
      } finally {
        setLoading(false);
        setProcessing(false);
      }
    };
    
    processToken();
  }, [type, token, email, navigate, toast]);

  return {
    loading,
    error,
    success,
    processing,
    tokenType
  };
};

export default useConfirmationLogic;
