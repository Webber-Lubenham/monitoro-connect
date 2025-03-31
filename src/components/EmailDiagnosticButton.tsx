
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

export const EmailDiagnosticButton = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [email, setEmail] = useState("frankwebber33@hotmail.com");

  const runDiagnostic = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      toast({
        title: "Iniciando diagnóstico detalhado",
        description: "Aguarde enquanto executamos testes de diagnóstico..."
      });
      
      // Create a payload with ONLY simple string values, no nested objects
      // CRITICAL: Use your verified domain as the from address to allow sending to any recipient
      const testPayload = {
        to: email,
        subject: "TESTE DIAGNOSTICO - " + new Date().toISOString(),
        html: "<p>Este é um email de teste diagnóstico.</p>",
        text: "Este é um email de teste diagnóstico.",
        from: "Sistema Monitore <notifications@sistema-monitore.com.br>"
      };
      
      console.log("Enviando payload de teste direto:", testPayload);
      
      // Send directly to edge function without intermediate layers
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: testPayload
      });
      
      if (error) {
        console.error("Erro na função send-email:", error);
        
        // Try to get more diagnostic information
        try {
          const diagResponse = await supabase.functions.invoke('diagnose-email', {
            body: testPayload
          });
          
          setResult({
            success: false,
            error: error,
            diagnostics: diagResponse.data,
            message: `Erro na edge function: ${error.message || JSON.stringify(error)}`
          });
        } catch (diagError) {
          setResult({
            success: false,
            error: error,
            message: `Erro na edge function: ${error.message || JSON.stringify(error)}`
          });
        }
        
        toast({
          title: "Teste falhou",
          description: "O diagnóstico detectou um problema. Verifique os detalhes abaixo.",
          variant: "destructive"
        });
      } else {
        console.log("Resposta do teste:", data);
        setResult({
          success: true,
          data: data,
          message: "Teste direto foi bem-sucedido!"
        });
        
        toast({
          title: "Teste bem-sucedido!",
          description: "O email de diagnóstico foi enviado com sucesso.",
        });
      }
    } catch (error) {
      console.error("Exceção durante o diagnóstico:", error);
      setResult({
        success: false,
        error: error instanceof Error ? error.message : String(error),
        message: "Uma exceção ocorreu durante o diagnóstico"
      });
      
      toast({
        title: "Erro durante diagnóstico",
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <div className="mb-4">
        <label htmlFor="test-email" className="block text-sm font-medium mb-1">
          Email para teste:
        </label>
        <input
          id="test-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-3 py-2 border rounded-md w-full"
          placeholder="Seu email para teste"
        />
      </div>
      
      <Button 
        onClick={runDiagnostic} 
        disabled={loading}
        size="lg"
        variant="destructive"
        className="w-full"
      >
        {loading ? "Executando diagnóstico..." : "EXECUTAR TESTE DIRETO"}
      </Button>
      
      {result && (
        <Card className="mt-4">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Resultado do diagnóstico:</h3>
                <span className={result.success ? "text-green-500" : "text-red-500"}>
                  {result.success ? "Sucesso" : "Falha"}
                </span>
              </div>
              
              <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-md overflow-x-auto">
                <pre className="text-xs">{JSON.stringify(result, null, 2)}</pre>
              </div>
              
              {!result.success && (
                <div className="text-sm text-red-500 space-y-2">
                  <p>
                    Dica: Verifique se a chave da API Resend está configurada corretamente nas variáveis de ambiente do projeto Supabase.
                  </p>
                  <p>
                    Acesse o painel do Supabase e verifique os logs da edge function para mais detalhes.
                  </p>
                  <p>
                    Verifique também se o domínio do remetente está corretamente verificado no Resend.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
