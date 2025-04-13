import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";
import { PasswordResetForm } from "@/components/auth/PasswordResetForm";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client.ts";
import { STORAGE_KEY } from "@/integrations/supabase/config";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const Index = () => {
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    let sessionCheckAttempts = 0;
    const MAX_ATTEMPTS = 3;
    
    // Check if user is already logged in
    const checkSession = async () => {
      try {
        sessionCheckAttempts++;
        console.log("Verificando sessão de usuário...");
        
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Erro ao verificar sessão:", error);
          
          if (sessionCheckAttempts >= MAX_ATTEMPTS) {
            if (isMounted) {
              setConnectionError(true);
              setIsLoading(false);
            }
          } else {
            // Try again in 2 seconds (with increasing delay)
            setTimeout(checkSession, 2000 * sessionCheckAttempts);
          }
          return;
        }
        
        if (data.session && isMounted) {
          console.log("Sessão encontrada:", data.session.user.id);
          
          // Manually verify if session is still valid by checking token expiry
          const tokenExpiry = data.session.expires_at;
          const now = Math.floor(Date.now() / 1000);
          
          if (tokenExpiry && tokenExpiry < now) {
            console.log("Sessão expirada, limpando dados.");
            // Session expired, clear it
            await supabase.auth.signOut();
            localStorage.removeItem(STORAGE_KEY);
            sessionStorage.removeItem(STORAGE_KEY);
            setIsLoading(false);
            return;
          }
          
          // User is already logged in, check role and redirect
          const userRole = data.session.user.user_metadata?.role || 'student';
          console.log("Função do usuário:", userRole);
          
          if (userRole === 'guardian' || userRole === 'parent') {
            navigate('/parent-dashboard', { replace: true });
          } else {
            navigate('/dashboard', { replace: true });
          }
        } else if (isMounted) {
          console.log("Nenhuma sessão ativa encontrada.");
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Erro ao verificar sessão:", error);
        if (isMounted) {
          setConnectionError(true);
          setIsLoading(false);
        }
      }
    };

    checkSession();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const handleSignupSuccess = () => {
    const loginTab = document.querySelector('[value="login"]') as HTMLElement;
    if (loginTab) {
      loginTab.click();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-2 text-sm text-gray-500">Verificando sessão...</p>
        </div>
      </div>
    );
  }

  if (connectionError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md px-4"
        >
          <Card className="p-8 backdrop-blur-sm bg-white/80">
            <div className="text-center space-y-6">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Erro de Conexão</h1>
                <p className="text-gray-500">
                  Não foi possível conectar ao servidor. Verifique sua conexão com a internet.
                </p>
              </div>
              
              <Button
                onClick={() => window.location.reload()}
                className="w-full"
              >
                Tentar novamente
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md px-4"
      >
        <Card className="p-8 backdrop-blur-sm bg-white/80">
          <div className="text-center space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">Monitore</h1>
              <p className="text-gray-500">
                Conecte-se para compartilhar sua localização com seus responsáveis
              </p>
            </div>

            {isResettingPassword ? (
              <PasswordResetForm onCancel={() => setIsResettingPassword(false)} />
            ) : (
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Cadastro</TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="mt-4">
                  <LoginForm onResetPassword={() => setIsResettingPassword(true)} />
                </TabsContent>

                <TabsContent value="signup" className="mt-4">
                  <SignupForm onSignupSuccess={handleSignupSuccess} />
                </TabsContent>
              </Tabs>
            )}

            {!isResettingPassword && (
              <p className="text-sm text-gray-500 mt-4">
                Ao entrar, você concorda com nossos Termos de Serviço e Política de Privacidade
              </p>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Index;
