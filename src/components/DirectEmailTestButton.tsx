
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Mail, ArrowRight, AlertTriangle, CheckCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

export const DirectEmailTestButton = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const runTest = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      console.log(`Iniciando teste direto para email: frankwebber33@hotmail.com`);
      
      // Call the direct email test function
      const response = await supabase.functions.invoke('direct-email-test', {
        body: JSON.stringify({ email: "frankwebber33@hotmail.com" })
      });
      
      console.log("Resposta do teste direto:", response);
      
      if (response.error) {
        setResult({
          success: false,
          error: response.error.message || 'Erro no envio direto',
          details: response.error
        });
        
        toast({
          title: "Falha no teste direto",
          description: `Não foi possível enviar o email: ${response.error.message}`,
          variant: "destructive"
        });
      } else {
        setResult({
          success: true,
          data: response.data
        });
        
        toast({
          title: "Email enviado com sucesso!",
          description: `Email de teste enviado diretamente para frankwebber33@hotmail.com`,
        });
      }
    } catch (error) {
      console.error("Erro no teste direto:", error);
      
      setResult({
        success: false,
        error: error instanceof Error ? error.message : String(error)
      });
      
      toast({
        title: "Erro durante o teste",
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Button 
          size="lg" 
          onClick={runTest}
          disabled={loading}
          className="flex items-center justify-center gap-2 h-16 text-lg"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>ENVIANDO...</span>
            </>
          ) : (
            <>
              <Mail className="h-5 w-5" />
              <span>TESTAR E-MAIL DIRETAMENTE</span>
            </>
          )}
        </Button>
        
        <Button 
          variant="outline"
          size="lg" 
          onClick={() => navigate('/email-tester')}
          className="flex items-center justify-center gap-2 h-16"
        >
          <span>IR PARA PÁGINA DE DIAGNÓSTICO</span>
          <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
      
      <Card className="p-4 border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950">
        <h3 className="text-amber-800 dark:text-amber-400 font-medium mb-2">🔍 Problemas comuns de entrega de email:</h3>
        <ul className="list-disc ml-5 space-y-1 text-sm text-amber-700 dark:text-amber-300">
          <li>Verifique a pasta de spam/lixo eletrônico</li>
          <li>Verifique se o domínio sistema-monitore.com.br está verificado no Resend</li>
          <li>Certifique-se que a API key do Resend está configurada corretamente</li>
          <li>Problemas de filtragem de spam podem ocorrer em emails empresariais</li>
        </ul>
      </Card>
      
      {result && (
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            {result.success ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-red-500" />
            )}
            <span className="font-medium">
              {result.success ? "✅ Sucesso" : "❌ Falha"}
            </span>
          </div>
          
          {result.success && (
            <p className="mb-4">
              Email de teste enviado diretamente para frankwebber33@hotmail.com
            </p>
          )}
          
          {!result.success && result.error && (
            <p className="mb-4 text-red-600">
              {result.error}
            </p>
          )}
          
          {result.data && (
            <div>
              <p className="font-medium mb-2">Detalhes:</p>
              <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-xs overflow-auto">
                {JSON.stringify(result.data, null, 2)}
              </pre>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default DirectEmailTestButton;
