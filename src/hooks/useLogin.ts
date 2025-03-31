
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface DebugInfo {
  profileCheck?: {
    data: any;
    error: any;
  };
  loginAttempt?: {
    data: any;
    error: any;
  };
  [key: string]: any;
}

export const useLogin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [debugMode, setDebugMode] = useState(false);
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);

  // Reset login attempts after a delay
  useEffect(() => {
    if (loginAttempts >= 3) {
      const timer = setTimeout(() => {
        setLoginAttempts(0);
      }, 60000); // Reset after 1 minute
      return () => clearTimeout(timer);
    }
  }, [loginAttempts]);

  const normalizeEmail = (email: string) => {
    return email.trim().toLowerCase();
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setDebugInfo(null);
    
    // Normalize email to lowercase and trim spaces
    const normalizedEmail = normalizeEmail(email);
    console.log('Attempting login with:', { email: normalizedEmail });

    try {
      // Increment login attempts
      setLoginAttempts(prev => prev + 1);
      
      // Log pre-authentication state
      console.log('Starting authentication process');
      
      // Check if the user exists in profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('email, role')
        .eq('email', normalizedEmail)
        .maybeSingle();
      
      if (debugMode) {
        setDebugInfo((prev: DebugInfo | null) => ({ ...prev ?? {}, profileCheck: { data: profileData, error: profileError } }));
      }

      if (profileError) {
        console.error('Error checking if user exists:', profileError);
      }
      
      // Try to sign in regardless if we found the user or not
      // (We don't want to reveal if an email exists for security reasons)
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (debugMode) {
        setDebugInfo((prev: DebugInfo | null) => ({ ...prev ?? {}, loginAttempt: { data, error } }));
      }

      if (error) {
        console.error('Authentication error details:', {
          message: error.message,
          status: error.status,
          name: error.name
        });
        
        if (error.message.includes("Email not confirmed")) {
          toast({
            variant: "destructive",
            title: "Email não confirmado",
            description: "Por favor, verifique seu email e clique no link de confirmação antes de fazer login.",
          });
        } else if (error.message.includes("Invalid login credentials")) {
          // Check if user exists but credentials are wrong
          if (profileData) {
            toast({
              variant: "destructive",
              title: "Credenciais inválidas",
              description: "A senha informada está incorreta. Por favor, verifique e tente novamente.",
            });
          } else {
            toast({
              variant: "destructive",
              title: "Credenciais inválidas",
              description: "Email ou senha incorretos. Verifique suas informações e tente novamente.",
            });
          }
        } else {
          toast({
            variant: "destructive",
            title: "Erro no login",
            description: `Ocorreu um erro: ${error.message}`,
          });
        }
        
        // If too many login attempts, suggest password reset
        if (loginAttempts >= 3) {
          toast({
            title: "Muitas tentativas de login",
            description: "Esqueceu sua senha? Tente recuperá-la clicando em 'Esqueceu sua senha?'",
          });
        }
        
        setIsLoading(false);
        return;
      }

      if (data?.user) {
        console.log('User authenticated successfully:', {
          id: data.user.id,
          email: data.user.email,
          metadata: data.user.user_metadata
        });
        
        // Reset login attempts on successful login
        setLoginAttempts(0);
        
        toast({
          title: "Login realizado com sucesso",
          description: "Redirecionando para o dashboard...",
        });
        
        // Check user role from metadata
        const userRole = data.user.user_metadata?.role || 'student';
        console.log('User role detected:', userRole);
        
        // Redirect based on role
        if (userRole === 'guardian' || userRole === 'parent') {
          console.log('Redirecting to parent dashboard');
          navigate('/parent-dashboard');
        } else {
          console.log('Redirecting to student dashboard');
          navigate('/dashboard');
        }
      } else {
        console.warn('Login successful but user data not found');
        toast({
          variant: "destructive",
          title: "Erro no login",
          description: "Ocorreu um erro inesperado. Por favor, tente novamente.",
        });
      }

    } catch (error) {
      console.error("Unhandled login error:", error);
      toast({
        variant: "destructive",
        title: "Erro no login",
        description: "Ocorreu um erro inesperado. Por favor, tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDebugMode = () => {
    setDebugMode(!debugMode);
    toast({
      title: debugMode ? "Modo de depuração desativado" : "Modo de depuração ativado",
      description: debugMode ? "Informações de depuração não serão exibidas" : "Informações de depuração serão exibidas",
    });
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    debugMode,
    debugInfo,
    loginAttempts,
    handleEmailSignIn,
    toggleDebugMode
  };
};
