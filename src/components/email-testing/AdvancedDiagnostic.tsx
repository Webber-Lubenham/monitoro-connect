
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { generateMinimalEmailPayload } from "@/services/email/core/diagnosticUtils";

export const AdvancedDiagnostic = () => {
  const { toast } = useToast();
  const [functionName, setFunctionName] = useState<string>("debug-email");
  const [payload, setPayload] = useState<string>(JSON.stringify(generateMinimalEmailPayload(), null, 2));
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
      console.log(`Testing payload with ${functionName}:`, payloadObj);
      
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: payloadObj,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log(`Response from ${functionName}:`, { data, error });
      
      if (error) {
        toast({
          title: `Erro na função ${functionName}`,
          description: error.message || "Ocorreu um erro inesperado",
          variant: "destructive"
        });
        setResponse({ success: false, error });
      } else {
        toast({
          title: data?.success ? "Teste concluído com sucesso" : "Erro no teste",
          description: data?.message || "Concluído sem mensagem específica",
          variant: data?.success ? "default" : "destructive"
        });
        setResponse(data);
      }
    } catch (error) {
      console.error(`Error testing with ${functionName}:`, error);
      toast({
        title: "Erro ao testar função",
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive"
      });
      setResponse({
        success: false,
        error: error instanceof Error ? error.message : String(error)
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Diagnóstico Avançado</CardTitle>
        <CardDescription>
          Teste diferentes funções Edge com payloads personalizados para diagnosticar problemas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Função Edge:</label>
          <Select value={functionName} onValueChange={setFunctionName}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="debug-email">debug-email (diagnóstico)</SelectItem>
              <SelectItem value="echo-payload">echo-payload (eco)</SelectItem>
              <SelectItem value="send-email">send-email (envio real)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Payload JSON:</label>
          <Textarea
            rows={10}
            value={payload}
            onChange={handlePayloadChange}
            className={`font-mono text-xs ${!isValid ? 'border-red-500' : ''}`}
          />
          {!isValid && (
            <p className="text-xs text-red-500">
              JSON inválido. Verifique o formato.
            </p>
          )}
        </div>
        
        <div className="flex justify-end">
          <Button 
            onClick={handleTest} 
            disabled={!isValid || loading}
          >
            {loading ? "Testando..." : `Testar com ${functionName}`}
          </Button>
        </div>
        
        {response && (
          <div className="mt-4">
            <h4 className="font-medium mb-2">Resposta:</h4>
            <pre className="text-xs bg-slate-100 dark:bg-slate-800 p-3 rounded-md overflow-auto max-h-60 whitespace-pre-wrap">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
