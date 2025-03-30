
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { sendEmailViaEdgeFunction } from "@/services/email/core/edgeFunctionClient";
import { supabase } from "@/lib/supabase";
import { type EmailTestResult } from "./types";

interface EmailTestActionsProps {
  onResultsChange: (results: EmailTestResult | null) => void;
}

export const EmailTestActions = ({ onResultsChange }: EmailTestActionsProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleTestEmail = async () => {
    setLoading(true);
    onResultsChange(null);
    
    try {
      // Test sending email using the standard Edge Function
      const result = await sendEmailViaEdgeFunction({
        to: "frankwebber33@hotmail.com",
        subject: "Teste do Sistema Monitore - " + new Date().toLocaleString(),
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <h1 style="color: #4a6ee0;">Teste de Email do Sistema Monitore</h1>
            <p>Este é um email de teste enviado em: ${new Date().toLocaleString()}</p>
            <p>Se você está recebendo este email, o sistema de notificações está funcionando corretamente.</p>
          </div>
        `,
        text: `Teste de Email do Sistema Monitore\n\nEste é um email de teste enviado em: ${new Date().toLocaleString()}\n\nSe você está recebendo este email, o sistema de notificações está funcionando corretamente.`,
        from: "Sistema Monitore <notifications@sistema-monitore.com.br>"
      });

      // Store detailed results for troubleshooting
      onResultsChange({
        success: result.success,
        message: result.message,
        error: result.error ? String(result.error) : undefined,
        details: result.data
      });

      toast({
        title: result.success ? "Email de teste enviado!" : "Falha ao enviar email",
        description: result.success 
          ? "Email enviado com sucesso para frankwebber33@hotmail.com" 
          : `Erro: ${result.message || String(result.error)}`,
        variant: result.success ? "default" : "destructive"
      });
    } catch (error) {
      console.error("Erro ao testar email:", error);
      
      onResultsChange({
        success: false,
        error: error instanceof Error ? error.message : String(error)
      });
      
      toast({
        title: "Erro ao testar email",
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTestGuardianEmail = async () => {
    setLoading(true);
    onResultsChange(null);
    
    try {
      // Test sending email using the guardian-specific Edge Function
      const response = await supabase.functions.invoke('send-guardian-email', {
        body: JSON.stringify({
          studentName: "Teste de Aluno",
          guardianEmail: "frankwebber33@hotmail.com",
          guardianName: "Responsável de Teste",
          latitude: 52.4746752,
          longitude: -0.917504,
          timestamp: new Date().toISOString(),
          accuracy: 10,
          isEmergency: false
        })
      });

      if (response.error) {
        throw response.error;
      }

      onResultsChange({
        success: true,
        message: "Email de teste enviado via Edge Function especializada",
        details: response.data
      });

      toast({
        title: "Email de teste enviado!",
        description: "Email enviado com sucesso para frankwebber33@hotmail.com via Edge Function especializada",
      });
    } catch (error) {
      console.error("Erro ao testar email via Edge Function especializada:", error);
      
      onResultsChange({
        success: false,
        error: error instanceof Error ? error.message : String(error)
      });
      
      toast({
        title: "Erro ao testar email via Edge Function especializada",
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTestResendSettings = async () => {
    setLoading(true);
    onResultsChange(null);
    
    try {
      // Test the Resend API key configuration
      const response = await supabase.functions.invoke('test-connectivity', {
        body: JSON.stringify({
          test: "resend-api-key"
        })
      });

      onResultsChange({
        success: !response.error,
        message: "Resultado do teste de conectividade",
        details: response.data || response.error
      });

      toast({
        title: response.error ? "Falha no teste de conectividade" : "Teste de conectividade concluído",
        description: response.error 
          ? `Erro: ${response.error.message}` 
          : "Verifique os detalhes do resultado para mais informações",
        variant: response.error ? "destructive" : "default"
      });
    } catch (error) {
      console.error("Erro ao testar configurações:", error);
      
      onResultsChange({
        success: false,
        error: error instanceof Error ? error.message : String(error)
      });
      
      toast({
        title: "Erro ao testar configurações",
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button 
        onClick={handleTestEmail} 
        disabled={loading}
        variant="default"
      >
        {loading ? "Enviando..." : "Enviar Email de Teste"}
      </Button>
      
      <Button 
        onClick={handleTestGuardianEmail} 
        disabled={loading}
        variant="outline"
      >
        Testar Edge Function Especializada
      </Button>

      <Button 
        onClick={handleTestResendSettings} 
        disabled={loading}
        variant="secondary"
      >
        Testar Configurações da API
      </Button>
    </div>
  );
};
