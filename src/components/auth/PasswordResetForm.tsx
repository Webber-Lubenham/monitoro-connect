
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import resendService from "@/services/email/resendService";
import { useState } from "react";

interface PasswordResetFormProps {
  onCancel: () => void;
}

export const PasswordResetForm = ({ onCancel }: PasswordResetFormProps) => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Get the application domain and protocol based on environment
  const getAppUrl = () => {
    // Use HTTP for development
    if (import.meta.env.DEV) {
      return 'http://localhost:8080';
    }
    // Use HTTPS for production with the correct domain
    return 'https://www.sistema-monitore.com.br';
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        variant: "destructive",
        title: "Campo obrigatório",
        description: "Por favor, insira seu email para recuperar a senha.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const appUrl = getAppUrl();
      console.log(`Usando URL para redirecionamento: ${appUrl}`);
      
      // Solicitar redefinição de senha através do Supabase
      const { data, error: supabaseError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${appUrl}/reset-password`,
      });

      if (supabaseError) throw supabaseError;

      console.log("Resposta da solicitação de redefinição:", data);

      // Enviar email personalizado caso necessário
      try {
        // Esta linha é opcional, pois o Supabase já envia o email padrão
        const resetUrl = `${appUrl}/reset-password`;
        await resendService.sendPasswordResetEmail(email, resetUrl);
        console.log("Email personalizado enviado com sucesso");
      } catch (emailError) {
        console.error("Erro ao enviar email personalizado:", emailError);
        // Se falhar o envio do email personalizado, o Supabase já terá enviado o email padrão
      }

      toast({
        title: "✉️ Email enviado",
        description: "Enviamos instruções para recuperar sua senha. Verifique sua caixa de entrada e pasta de spam.",
        duration: 6000,
      });

      onCancel();
    } catch (error) {
      console.error("Erro na recuperação de senha:", error);
      toast({
        variant: "destructive",
        title: "Erro ao recuperar senha",
        description: "Não foi possível enviar o email de recuperação. Verifique se o email está correto e tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Recuperar Senha</h2>
      <form onSubmit={handlePasswordReset} className="space-y-4">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button 
          type="submit" 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Enviando..." : "Enviar link de recuperação"}
        </Button>
        <Button 
          type="button"
          variant="ghost"
          className="w-full"
          onClick={onCancel}
        >
          Voltar para o Login
        </Button>
      </form>
    </div>
  );
};
