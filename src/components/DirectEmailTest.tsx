
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Mail, CheckCircle, AlertTriangle } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const DirectEmailTest = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [email, setEmail] = useState("frankwebber33@hotmail.com");

  const runTest = async () => {
    if (!email || !email.includes('@')) {
      toast({
        title: "Email inválido",
        description: "Por favor, insira um endereço de email válido.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    setResult(null);
    
    try {
      console.log(`Iniciando teste direto para email: ${email}`);
      
      // Call the test-location-email function directly
      const { data, error } = await supabase.functions.invoke('test-location-email', {
        body: {
          email,
          debug: true,  // Include debug info in the email
          plain: false  // Use the more styled template
        }
      });
      
      console.log(`Resposta do teste direto:`, { data, error });
      
      if (error) {
        throw error;
      }
      
      setResult({
        success: true,
        ...data
      });
      
      toast({
        title: "Email de teste enviado!",
        description: `Email enviado diretamente para ${email}`,
      });
    } catch (error) {
      console.error("Erro no teste direto:", error);
      
      setResult({
        success: false,
        error: error instanceof Error ? error.message : String(error)
      });
      
      toast({
        title: "Erro ao enviar email",
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Teste Direto de Email
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Este teste envia um email diretamente pela Edge Function, ignorando a camada de abstração
        </p>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="test-email" className="block text-sm font-medium">
              Email para teste:
            </label>
            <input
              id="test-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-3 py-2 border rounded-md w-full"
              placeholder="seu@email.com"
            />
          </div>
          
          {result && (
            <div className={`p-4 rounded-md ${result.success ? 'bg-green-50' : 'bg-red-50'}`}>
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  {result.success ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  )}
                </div>
                <div className="ml-3">
                  <h3 className={`text-sm font-medium ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                    {result.success ? 'Sucesso' : 'Erro'}
                  </h3>
                  <div className="mt-2 text-sm">
                    <p className={result.success ? 'text-green-700' : 'text-red-700'}>
                      {result.success 
                        ? `Email de teste enviado diretamente para ${email}` 
                        : `Falha ao enviar email: ${result.error}`}
                    </p>
                  </div>
                  
                  {result.success && (
                    <div className="mt-2 text-xs bg-white p-3 rounded border">
                      <p className="font-semibold mb-1">Detalhes:</p>
                      <pre className="whitespace-pre-wrap overflow-auto">
                        {JSON.stringify(result, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={runTest}
              disabled={loading}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>Enviar teste direto</>
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setEmail("frankwebber33@hotmail.com")}
              disabled={loading}
              className="flex-1"
            >
              Usar email padrão
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DirectEmailTest;
