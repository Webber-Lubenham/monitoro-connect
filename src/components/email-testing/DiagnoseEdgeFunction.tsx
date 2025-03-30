
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

export const DiagnoseEdgeFunction = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const runDiagnostic = async () => {
    setLoading(true);
    try {
      // Create a minimal valid email payload
      const testPayload = {
        to: "test@example.com",
        subject: "Diagnostic Test",
        html: "<p>This is a test</p>",
        text: "This is a test"
      };
      
      console.log("Running diagnostic with payload:", testPayload);
      
      const { data, error } = await supabase.functions.invoke('diagnose-email', {
        body: testPayload,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (error) {
        console.error("Diagnostic error:", error);
        toast({
          title: "Diagnóstico falhou",
          description: error.message,
          variant: "destructive"
        });
        setResults({ success: false, error });
      } else {
        console.log("Diagnostic results:", data);
        toast({
          title: "Diagnóstico concluído",
          description: data.success 
            ? "O formato do payload parece válido" 
            : "Foram encontrados problemas com o formato",
          variant: data.success ? "default" : "destructive"
        });
        setResults(data);
      }
    } catch (error) {
      console.error("Exception running diagnostic:", error);
      toast({
        title: "Erro ao executar diagnóstico",
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive"
      });
      setResults({ success: false, error: String(error) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Diagnóstico da Comunicação</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Esta ferramenta verifica se o formato do payload está correto para o envio de emails.
          </p>
          
          <div className="flex justify-end">
            <Button 
              onClick={runDiagnostic} 
              disabled={loading}
            >
              {loading ? "Executando..." : "Executar Diagnóstico"}
            </Button>
          </div>
          
          {results && (
            <div className="mt-4 p-4 border rounded-md bg-gray-50 dark:bg-gray-900">
              <h3 className="font-medium mb-2">Resultados do Diagnóstico:</h3>
              <div className="text-xs font-mono bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-auto max-h-64">
                <pre>{JSON.stringify(results, null, 2)}</pre>
              </div>
              
              {results.issues && results.issues.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium text-red-600 dark:text-red-400 mb-2">
                    Problemas encontrados:
                  </h4>
                  <ul className="list-disc list-inside text-sm">
                    {results.issues.map((issue: any, i: number) => (
                      <li key={i} className="mb-1">
                        {issue.message}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {results.tips && (
                <div className="mt-4">
                  <h4 className="font-medium text-blue-600 dark:text-blue-400 mb-2">
                    Dicas:
                  </h4>
                  <ul className="list-disc list-inside text-sm">
                    {results.tips.map((tip: string, i: number) => (
                      <li key={i} className="mb-1">
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
