
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { testEmailWithEchoFunction } from "@/services/email/core/diagnosticUtils";

export const PayloadInspector = () => {
  const { toast } = useToast();
  const [payload, setPayload] = useState<string>(`{
  "to": "test@example.com",
  "subject": "Test Email",
  "html": "<p>This is a test email from payload inspector.</p>",
  "text": "This is a test email from payload inspector.",
  "from": "Sistema Monitore <test@sistema-monitore.com.br>"
}`);
  const [isValid, setIsValid] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<any>(null);

  const validateJson = (jsonString: string): boolean => {
    try {
      JSON.parse(jsonString);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handlePayloadChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newPayload = e.target.value;
    setPayload(newPayload);
    setIsValid(validateJson(newPayload));
  };

  const handleTest = async () => {
    if (!isValid) {
      toast({
        title: "JSON inválido",
        description: "Por favor, corrija o formato do JSON antes de testar.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const payloadObj = JSON.parse(payload);
      const result = await testEmailWithEchoFunction(payloadObj);
      setResponse(result);
      
      toast({
        title: result.success ? "Teste concluído" : "Erro no teste",
        description: result.message,
        variant: result.success ? "default" : "destructive"
      });
    } catch (error) {
      console.error("Erro ao testar payload:", error);
      setResponse({
        success: false,
        error: error instanceof Error ? error.message : String(error)
      });
      
      toast({
        title: "Erro ao testar payload",
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inspetor de Payload</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-2">
            Edite o payload JSON diretamente e teste-o com a Edge Function de eco para diagnóstico.
          </p>
          <Textarea
            rows={10}
            value={payload}
            onChange={handlePayloadChange}
            className={`font-mono ${!isValid ? 'border-red-500' : ''}`}
          />
          {!isValid && (
            <p className="text-xs text-red-500 mt-1">
              JSON inválido. Verifique o formato.
            </p>
          )}
        </div>
        
        <div className="flex justify-end">
          <Button 
            onClick={handleTest} 
            disabled={!isValid || loading}
            className="w-full md:w-auto"
          >
            {loading ? "Enviando..." : "Testar com Echo Function"}
          </Button>
        </div>
        
        {response && (
          <div className="mt-4">
            <h4 className="font-medium mb-2">Resposta:</h4>
            <pre className="text-xs bg-gray-100 p-3 rounded-md overflow-auto max-h-60">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
