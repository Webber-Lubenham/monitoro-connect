
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

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
        // Validar parâmetros obrigatórios
        if (!type) {
          console.error("Missing required parameter: type");
          setError('Link de confirmação inválido. Falta o parâmetro "type".');
          setLoading(false);
          return;
        }
        
        if (!token) {
          console.error("Missing required parameter: token");
          setError('Link de confirmação inválido. Falta o parâmetro "token".');
          setLoading(false);
          return;
        }
        
        if (!email) {
          console.error("Missing required parameter: email");
          setError('Link de confirmação inválido. Falta o parâmetro "email".');
          setLoading(false);
          return;
        }
        
        console.log("Processing confirmation with parameters:", { type, token, email });
        
        if (type === 'signup') {
          console.log("Attempting to verify account with token:", token, "and email:", email);
          
          try {
            // Verificar o token com retry em caso de falha de rede
            const maxRetries = 3;
            let attemptCount = 0;
            let success = false;
            
            while (attemptCount < maxRetries && !success) {
              try {
                attemptCount++;
                
                const { data, error: verifyError } = await supabase.auth.verifyOtp({
                  type: 'signup',
                  token: token,
                  email: email
                });
        
                if (verifyError) {
                  console.error(`Attempt ${attemptCount}/${maxRetries} failed:`, verifyError);
                  
                  // Check for specific error messages
                  if (verifyError.message.includes("Token has expired")) {
                    setError('O link de confirmação expirou. Por favor, solicite um novo link de confirmação.');
                    toast({
                      title: "Link expirado",
                      description: "O link de confirmação expirou. Solicite um novo link na tela de login.",
                      variant: "destructive",
                    });
                    break; // No need to retry for expired tokens
                  } else if (verifyError.message.includes("Invalid token")) {
                    setError('Link de confirmação inválido. Por favor, verifique se você está usando o link mais recente.');
                    toast({
                      title: "Link inválido",
                      description: "Este link de confirmação é inválido. Verifique se você está usando o link mais recente.",
                      variant: "destructive",
                    });
                    break; // No need to retry for invalid tokens
                  } else if (attemptCount === maxRetries) {
                    // Last attempt, show the error
                    setError(`Erro ao confirmar sua conta: ${verifyError.message}`);
                    toast({
                      title: "Erro na confirmação",
                      description: "Não foi possível confirmar sua conta. Tente novamente ou solicite um novo email de confirmação.",
                      variant: "destructive",
                    });
                  } else {
                    // Retry with a delay
                    await new Promise(resolve => setTimeout(resolve, 1000 * attemptCount));
                  }
                } else {
                  console.log("Signup confirmed successfully:", data);
                  setSuccess(true);
                  toast({
                    title: "🎉 Conta confirmada!",
                    description: "Sua conta foi confirmada com sucesso. Redirecionando...",
                  });
                  success = true;
                  setTimeout(() => {
                    navigate('/dashboard', { replace: true });
                  }, 3000);
                  break;
                }
              } catch (apiError) {
                console.error(`API call attempt ${attemptCount}/${maxRetries} failed with exception:`, apiError);
                
                if (attemptCount === maxRetries) {
                  setError('Erro interno ao processar a confirmação. Por favor, tente novamente mais tarde.');
                } else {
                  // Retry with a delay
                  await new Promise(resolve => setTimeout(resolve, 1000 * attemptCount));
                }
              }
            }
          } catch (apiError) {
            console.error("Exception during signup verification:", apiError);
            setError('Erro interno ao processar a confirmação. Por favor, tente novamente mais tarde.');
          }
        } else if (type === 'guardian' && token && email) {
          // Handle guardian confirmation separately
          setTokenType('guardian');
          setProcessing(false);
          return;
        } else if (type === 'reset' && token && email) {
          // Handle password reset separately
          setTokenType('reset');
          setProcessing(false);
          return;
        } else {
          setError('Tipo de confirmação inválido ou parâmetros insuficientes.');
          setTokenType('error');
          setLoading(false);
          return;
        }
        
        setLoading(false);
      } catch (error: any) {
        console.error('Error in confirmation logic:', error);
        setError('Ocorreu um erro ao processar sua confirmação. Por favor, tente novamente.');
        setLoading(false);
      }
    };
    
    processToken();
  }, [type, token, email, navigate, toast]);
  
  const handleGuardianSignupSuccess = () => {
    setSuccess(true);
    setTimeout(() => {
      navigate('/', { replace: true });
    }, 3000);
  };
  
  return {
    loading,
    error,
    success,
    processing,
    tokenType,
    handleGuardianSignupSuccess
  };
};
