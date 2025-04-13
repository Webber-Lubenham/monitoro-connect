import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client.ts";
import { useToast } from "@/hooks/use-toast";
import { toast as sonnerToast } from "sonner";

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

  const normalizeEmail = (email: string) => {
    return email.trim().toLowerCase();
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setDebugInfo(null);
    
    const normalizedEmail = normalizeEmail(email);
    console.log('Attempting login with:', { email: normalizedEmail });

    try {
      setLoginAttempts(prev => prev + 1);
      
      console.log('Starting authentication process');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (debugMode) {
        setDebugInfo((prev: DebugInfo | null) => ({ ...prev ?? {}, loginAttempt: { data, error } }));
        console.log('Auth result:', { data, error });
      }

      if (error) {
        console.error('Authentication error details:', {
          message: error.message,
          status: error.status,
          name: error.name
        });
        
        if (error.message.includes("Email not confirmed")) {
          showEmailVerificationToast();
        } else if (error.message.includes("Invalid login credentials")) {
          showIncorrectPasswordToast();
        } else {
          toast({
            variant: "destructive",
            title: "Erro no login",
            description: `Ocorreu um erro: ${error.message}`,
          });
          sonnerToast.error(`Erro: ${error.message}`);
        }
        
        if (loginAttempts >= 3) {
          showPasswordRecoveryToast();
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
        
        setLoginAttempts(0);
        
        toast({
          title: "Login realizado com sucesso",
          description: "Redirecionando para o dashboard...",
        });
        sonnerToast.success("Login realizado com sucesso");
        
        const userRole = data.user.user_metadata?.role || 'student';
        console.log('User role detected:', userRole);
        
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
        sonnerToast.error("Erro inesperado");
      }

    } catch (error) {
      console.error("Unhandled login error:", error);
      toast({
        variant: "destructive",
        title: "Erro no login",
        description: "Ocorreu um erro inesperado. Por favor, tente novamente.",
      });
      sonnerToast.error("Erro inesperado no login");
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

  const testUserExistence = async () => {
    if (!email) return;
    
    const normalizedEmail = normalizeEmail(email);
    try {
      console.log('Testando existência do usuário:', normalizedEmail);
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('email', normalizedEmail)
        .maybeSingle();
      
      if (profileError) {
        console.error('Erro ao verificar perfil:', profileError);
        showEmailNotRegisteredToast();
      } else if (profileData) {
        console.log('Resultado da verificação (profiles):', profileData);
        showEmailRegisteredToast();
        return;
      } else {
        showEmailNotFoundToast();
      }
      
    } catch (error) {
      console.error('Erro ao testar existência do usuário:', error);
      showEmailNotRegisteredToast();
    }
  };

  const showEmailVerificationToast = () => {
    toast({
      title: "Email de verificação enviado",
      description: "Verifique sua caixa de entrada",
      duration: 5000
    });
  };

  const showIncorrectPasswordToast = () => {
    toast({
      variant: "destructive",
      title: "Senha incorreta",
      description: "Verifique sua senha e tente novamente",
      duration: 5000
    });
  };

  const showEmailNotRegisteredToast = () => {
    toast({
      variant: "destructive",
      title: "Email não encontrado",
      description: "Este email não está cadastrado",
      duration: 5000
    });
  };

  const showPasswordRecoveryToast = () => {
    toast({
      variant: "destructive", 
      title: "Muitas tentativas",
      description: "Tente recuperar sua senha",
      duration: 5000
    });
  };

  const showEmailRegisteredToast = () => {
    toast({
      variant: "default",
      title: "Email já cadastrado",
      description: "Email está registrado",
      duration: 5000
    });
  };

  const showEmailNotFoundToast = () => {
    toast({
      variant: "destructive",
      title: "Email não encontrado",
      description: "Este email não está cadastrado",
      duration: 5000
    });
  };

  useEffect(() => {
    if (loginAttempts >= 3) {
      const timer = setTimeout(() => {
        setLoginAttempts(0);
      }, 60000);
      return () => clearTimeout(timer);
    }
  }, [loginAttempts]);

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
    toggleDebugMode,
    testUserExistence
  };
};
