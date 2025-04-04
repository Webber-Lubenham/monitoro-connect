
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
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
      
      // Try to sign in directly with Supabase Auth
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
          toast({
            variant: "destructive",
            title: "Email não confirmado",
            description: "Por favor, verifique seu email e clique no link de confirmação antes de fazer login.",
          });
          sonnerToast.error("Email não confirmado", "Verifique sua caixa de entrada");
        } else if (error.message.includes("Invalid login credentials")) {
          toast({
            variant: "destructive",
            title: "Credenciais inválidas",
            description: "Email ou senha incorretos. Verifique suas informações e tente novamente.",
          });
          sonnerToast.error("Email ou senha incorretos");
          
          // Verificar conta (método simplificado que não usa API de admin)
          console.log('Verificando conta e senha...');
          
          try {
            // Tenta verificar se o email existe usando um método mais simples
            const { data: usersData, error: profileError } = await supabase
              .from('profiles')
              .select('id, email')
              .eq('email', normalizedEmail)
              .maybeSingle();
            
            if (profileError) {
              console.error('Erro ao verificar perfil:', profileError);
            } else if (usersData) {
              console.log('Email encontrado na base de dados, senha incorreta');
              sonnerToast.error("Senha incorreta", "Verifique sua senha e tente novamente");
            } else {
              console.log('Email não encontrado na base de dados');
              sonnerToast.error("Conta não encontrada", "Este email não está cadastrado");
            }
          } catch (checkError) {
            console.log('Erro ao verificar email:', checkError);
          }
        } else {
          toast({
            variant: "destructive",
            title: "Erro no login",
            description: `Ocorreu um erro: ${error.message}`,
          });
          sonnerToast.error(`Erro: ${error.message}`);
        }
        
        // If too many login attempts, suggest password reset
        if (loginAttempts >= 3) {
          toast({
            title: "Muitas tentativas de login",
            description: "Esqueceu sua senha? Tente recuperá-la clicando em 'Esqueceu sua senha?'",
          });
          sonnerToast.info("Muitas tentativas", "Tente recuperar sua senha");
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
        sonnerToast.success("Login realizado com sucesso");
        
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

  // Teste da existência do usuário no banco
  const testUserExistence = async () => {
    if (!email) return;
    
    const normalizedEmail = normalizeEmail(email);
    try {
      console.log('Testando existência do usuário:', normalizedEmail);
      
      // Abordagem simplificada: verificar na tabela de perfis
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('email', normalizedEmail)
        .maybeSingle();
      
      if (profileError) {
        console.error('Erro ao verificar perfil:', profileError);
        sonnerToast.error("Erro ao verificar usuário");
      } else if (profileData) {
        console.log('Resultado da verificação (profiles):', profileData);
        sonnerToast.success("Usuário encontrado", "Email está registrado");
        return;
      } else {
        sonnerToast.error("Usuário não encontrado", "Este email não está cadastrado");
      }
      
    } catch (error) {
      console.error('Erro ao testar existência do usuário:', error);
      sonnerToast.error("Erro ao verificar usuário");
    }
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
    toggleDebugMode,
    testUserExistence
  };
};
