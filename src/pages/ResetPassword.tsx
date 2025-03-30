
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidLink, setIsValidLink] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Get the hash parameters when component mounts
  useEffect(() => {
    // Extract hash parameters
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const type = params.get("type");
    const token = params.get("access_token");
    
    console.log("Reset password params:", { hash, type, token });
    
    if ((type === "recovery" || type === "signup") && token) {
      setIsValidLink(true);
      setAccessToken(token);
      
      // Set the session with the tokens from the URL
      const refreshToken = params.get("refresh_token") || "";
      supabase.auth.setSession({
        access_token: token,
        refresh_token: refreshToken,
      }).catch((error) => {
        console.error("Error setting session:", error);
        toast({
          variant: "destructive",
          title: "Erro ao validar link",
          description: "Não foi possível validar o link de recuperação. Por favor, solicite um novo link.",
        });
        setIsValidLink(false);
      });
    } else {
      console.error("Invalid reset password link");
      toast({
        variant: "destructive",
        title: "Link inválido",
        description: "Este link de recuperação é inválido ou expirou. Por favor, solicite um novo link.",
      });
      setIsValidLink(false);
      // Don't navigate away immediately, let user see the error
    }
  }, [navigate, toast]);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword.length < 6) {
      toast({
        variant: "destructive",
        title: "Senha muito curta",
        description: "A senha deve ter pelo menos 6 caracteres.",
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Senhas não coincidem",
        description: "As senhas digitadas não são iguais. Por favor, tente novamente.",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Now update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (updateError) throw updateError;
      
      setIsSuccess(true);
      
      toast({
        title: "Senha redefinida com sucesso",
        description: "Você já pode fazer login com sua nova senha.",
      });
      
      // Redirect to login page after 3 seconds
      setTimeout(() => {
        navigate("/");
      }, 3000);
      
    } catch (error) {
      console.error("Error resetting password:", error);
      toast({
        variant: "destructive",
        title: "Erro ao redefinir senha",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado. Por favor, tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                {isSuccess ? "Senha Redefinida" : "Redefinir Senha"}
              </h1>
              <p className="text-gray-500">
                {!isValidLink 
                  ? "Este link é inválido ou expirou. Por favor, solicite um novo."
                  : isSuccess 
                    ? "Sua senha foi redefinida com sucesso!" 
                    : "Digite sua nova senha abaixo"}
              </p>
            </div>

            {isValidLink && !isSuccess && (
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <Input
                  type="password"
                  placeholder="Nova senha"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <Input
                  type="password"
                  placeholder="Confirme a nova senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Redefinindo..." : "Redefinir Senha"}
                </Button>
              </form>
            )}

            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => navigate("/")}
            >
              Voltar para o Login
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
