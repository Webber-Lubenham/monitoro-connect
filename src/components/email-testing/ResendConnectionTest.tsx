
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

export const ResendConnectionTest = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const testResendConnection = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('test-resend-connection');

      if (error) {
        console.error("Error testing Resend connection:", error);
        setResult({
          success: false,
          error: error.message,
          details: "Falha ao invocar a Edge Function"
        });
        
        toast({
          variant: "destructive",
          title: "Erro ao testar conexão",
          description: error.message,
        });
      } else {
        console.log("Resend connection test result:", data);
        setResult(data);
        
        toast({
          title: data.success ? "Conexão com Resend bem-sucedida" : "Falha na conexão com Resend",
          description: data.message || data.error,
          variant: data.success ? "default" : "destructive",
        });
      }
    } catch (error) {
      console.error("Exception testing Resend connection:", error);
      setResult({
        success: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
      
      toast({
        variant: "destructive",
        title: "Erro inesperado",
        description: error instanceof Error ? error.message : "Erro desconhecido ao testar conexão",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Teste de Conexão com Resend API</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">
          Este teste verifica se a chave de API do Resend está configurada corretamente nas
          variáveis de ambiente da função Edge.
        </p>
        
        {result && (
          <div className="mt-4 p-4 rounded-md bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium">Status:</span>
              {result.success ? (
                <span className="flex items-center text-green-600 dark:text-green-400">
                  <CheckCircle2 className="w-4 h-4 mr-1" /> Conectado
                </span>
              ) : (
                <span className="flex items-center text-red-600 dark:text-red-400">
                  <XCircle className="w-4 h-4 mr-1" /> Erro
                </span>
              )}
            </div>
            
            {result.success && result.data && (
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Domínios:</span> {result.data.domains}</p>
                <p>
                  <span className="font-medium">Domínios verificados:</span> 
                  {result.data.hasVerifiedDomains ? ' Sim' : ' Não'}
                </p>
                <p>
                  <span className="font-medium">API Key:</span> 
                  {result.data.apiKeyWorks ? ' Válida' : ' Inválida'}
                </p>
              </div>
            )}
            
            {!result.success && (
              <div className="mt-2 text-red-600 dark:text-red-400">
                <p className="font-medium">Erro:</p>
                <p className="text-sm">{result.error}</p>
                {result.details && <p className="text-xs mt-1">{result.details}</p>}
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={testResendConnection} disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          {loading ? "Testando..." : "Testar Conexão com Resend"}
        </Button>
      </CardFooter>
    </Card>
  );
};
