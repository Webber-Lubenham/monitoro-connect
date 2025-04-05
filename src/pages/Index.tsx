
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";
import { PasswordResetForm } from "@/components/auth/PasswordResetForm";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/AuthProvider";

const Index = () => {
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    // If user is already authenticated, redirect to the appropriate dashboard
    if (user) {
      console.log("User already authenticated, redirecting...");
      const userRole = user.user_metadata?.role || 'student';
      
      if (userRole === 'guardian' || userRole === 'parent') {
        navigate('/parent-dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, navigate]);

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
