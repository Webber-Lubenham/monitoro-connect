
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  testEmailWithEchoFunction, 
  generateMinimalEmailPayload, 
  validateEmailPayload,
  testCompareEmailMethods
} from "@/services/email/core/diagnosticUtils";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, CheckCircle2Icon, XCircleIcon } from "lucide-react";

export const EmailDiagnosticTools: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState<any>(null);
  
  const runDiagnosticTest = async () => {
    setLoading(true);
    setDiagnosticResult(null);
    
    try {
      const minimalPayload = generateMinimalEmailPayload();
      const result = await testEmailWithEchoFunction(minimalPayload);
      
      setDiagnosticResult(result);
      
      toast({
        title: result.success ? "Diagnóstico concluído" : "Erro no diagnóstico",
        description: result.message,
        variant: result.success ? "default" : "destructive"
      });
    } catch (error) {
      console.error("Error running diagnostic:", error);
      
      toast({
        title: "Erro no diagnóstico",
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive"
      });
      
      setDiagnosticResult({ 
        success: false, 
        error: error instanceof Error ? error.message : String(error) 
      });
    } finally {
      setLoading(false);
    }
  };
  
  const runComprehensiveTest = async () => {
    setLoading(true);
    setDiagnosticResult(null);
    
    try {
      const minimalPayload = generateMinimalEmailPayload();
      const validationResult = validateEmailPayload(minimalPayload);
      
      if (!validationResult.valid) {
        toast({
          title: "Payload inválido",
          description: validationResult.issues.join(", "),
          variant: "destructive"
        });
        
        setDiagnosticResult({
          success: false,
          validation: validationResult,
          message: "O payload de teste falhou na validação"
        });
        setLoading(false);
        return;
      }
      
      const result = await testCompareEmailMethods(minimalPayload);
      setDiagnosticResult(result);
      
      toast({
        title: result.success ? "Diagnóstico detalhado concluído" : "Erros no diagnóstico detalhado",
        description: result.message,
        variant: result.success ? "default" : "destructive"
      });
    } catch (error) {
      console.error("Error running comprehensive diagnostic:", error);
      
      toast({
        title: "Erro no diagnóstico detalhado",
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive"
      });
      
      setDiagnosticResult({ 
        success: false, 
        error: error instanceof Error ? error.message : String(error) 
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="w-full mb-6">
      <CardHeader>
        <CardTitle>Ferramentas de Diagnóstico</CardTitle>
        <CardDescription>
          Teste e diagnostique problemas no sistema de email
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4">
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Dica</AlertTitle>
          <AlertDescription>
            Use estas ferramentas para diagnosticar problemas na comunicação com as Edge Functions.
            Os resultados podem ajudar a identificar erros no formato do payload.
          </AlertDescription>
        </Alert>
        
        <div className="space-y-4">
          <div className="flex gap-4 flex-col sm:flex-row">
            <Button 
              onClick={runDiagnosticTest} 
              disabled={loading}
              variant="secondary"
              className="flex-1"
            >
              {loading ? "Executando teste básico..." : "Testar com Echo Function"}
            </Button>
            
            <Button 
              onClick={runComprehensiveTest} 
              disabled={loading}
              variant="default"
              className="flex-1"
            >
              {loading ? "Executando diagnóstico completo..." : "Diagnóstico Completo"}
            </Button>
          </div>
          
          {diagnosticResult && (
            <>
              <Separator className="my-4" />
              
              <Tabs defaultValue="summary">
                <TabsList className="w-full">
                  <TabsTrigger value="summary" className="flex-1">Resumo</TabsTrigger>
                  <TabsTrigger value="validation" className="flex-1">Validação</TabsTrigger>
                  <TabsTrigger value="echo" className="flex-1">Echo Function</TabsTrigger>
                  {diagnosticResult.sendEmail && (
                    <TabsTrigger value="sendemail" className="flex-1">Send-Email</TabsTrigger>
                  )}
                  <TabsTrigger value="payload" className="flex-1">Payload</TabsTrigger>
                </TabsList>
                
                <TabsContent value="summary">
                  <Card>
                    <CardContent className="pt-4">
                      <div className="rounded-md p-4 flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-semibold">Status: </span>
                          {diagnosticResult.success ? (
                            <span className="inline-flex items-center text-green-600">
                              <CheckCircle2Icon className="h-5 w-5 mr-1" /> Sucesso
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-red-600">
                              <XCircleIcon className="h-5 w-5 mr-1" /> Falha
                            </span>
                          )}
                        </div>
                        
                        <p className="text-sm mt-2">{diagnosticResult.message}</p>
                        
                        {diagnosticResult.validation && (
                          <div className="mt-4">
                            <h4 className="text-sm font-medium mb-1">Validação do Payload:</h4>
                            {diagnosticResult.validation.valid ? (
                              <p className="text-sm text-green-600">✓ Formato válido</p>
                            ) : (
                              <ul className="text-sm text-red-600 list-disc pl-5">
                                {diagnosticResult.validation.issues.map((issue: string, index: number) => (
                                  <li key={index}>{issue}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        )}
                        
                        {!diagnosticResult.success && diagnosticResult.error && (
                          <div className="mt-2 text-sm text-red-600 bg-red-50 p-3 rounded">
                            <p>Erro: {String(diagnosticResult.error)}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="validation">
                  <Card>
                    <CardContent className="pt-4">
                      {diagnosticResult.validation ? (
                        <div className="space-y-4">
                          <div className={`p-3 rounded ${diagnosticResult.validation.valid ? 'bg-green-50' : 'bg-red-50'}`}>
                            <h3 className="font-medium">
                              {diagnosticResult.validation.valid ? '✅ Payload Válido' : '❌ Payload Inválido'}
                            </h3>
                            
                            {!diagnosticResult.validation.valid && diagnosticResult.validation.issues.length > 0 && (
                              <div className="mt-2">
                                <h4 className="text-sm font-medium">Problemas encontrados:</h4>
                                <ul className="mt-1 text-sm list-disc pl-5">
                                  {diagnosticResult.validation.issues.map((issue: string, index: number) => (
                                    <li key={index}>{issue}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium mb-1">Campos esperados:</h4>
                            <ul className="text-sm list-disc pl-5">
                              <li><code>to</code>: Email do destinatário (string)</li>
                              <li><code>subject</code>: Assunto do email (string)</li>
                              <li><code>html</code>: Conteúdo HTML do email (string)</li>
                              <li><code>text</code>: Versão texto do email (string, opcional)</li>
                              <li><code>from</code>: Email do remetente (string, opcional)</li>
                            </ul>
                          </div>
                        </div>
                      ) : (
                        <p className="text-muted-foreground">Nenhuma informação de validação disponível.</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="echo">
                  <Card>
                    <CardContent className="pt-4">
                      {diagnosticResult.echo ? (
                        <div>
                          <h3 className="text-sm font-medium mb-2">
                            {diagnosticResult.echo.success ? '✅ Echo Function OK' : '❌ Echo Function Falhou'}
                          </h3>
                          
                          <p className="text-sm">{diagnosticResult.echo.message}</p>
                          
                          {diagnosticResult.echo.data && (
                            <div className="mt-3">
                              <h4 className="text-sm font-medium mb-1">Resposta:</h4>
                              <pre className="text-xs bg-gray-100 p-3 rounded-md overflow-auto max-h-60">
                                {JSON.stringify(diagnosticResult.echo.data, null, 2)}
                              </pre>
                            </div>
                          )}
                          
                          {diagnosticResult.echo.error && (
                            <div className="mt-3">
                              <h4 className="text-sm font-medium mb-1 text-red-600">Erro:</h4>
                              <pre className="text-xs bg-red-50 p-3 rounded-md overflow-auto max-h-60">
                                {JSON.stringify(diagnosticResult.echo.error, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">Nenhuma informação da Echo Function disponível.</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="sendemail">
                  <Card>
                    <CardContent className="pt-4">
                      {diagnosticResult.sendEmail ? (
                        <div>
                          <h3 className="text-sm font-medium mb-2">
                            {diagnosticResult.sendEmail.success ? '✅ Send-Email Function OK' : '❌ Send-Email Function Falhou'}
                          </h3>
                          
                          <p className="text-sm">{diagnosticResult.sendEmail.message}</p>
                          
                          {diagnosticResult.sendEmail.data && (
                            <div className="mt-3">
                              <h4 className="text-sm font-medium mb-1">Resposta:</h4>
                              <pre className="text-xs bg-gray-100 p-3 rounded-md overflow-auto max-h-60">
                                {JSON.stringify(diagnosticResult.sendEmail.data, null, 2)}
                              </pre>
                            </div>
                          )}
                          
                          {diagnosticResult.sendEmail.error && (
                            <div className="mt-3">
                              <h4 className="text-sm font-medium mb-1 text-red-600">Erro:</h4>
                              <pre className="text-xs bg-red-50 p-3 rounded-md overflow-auto max-h-60">
                                {JSON.stringify(diagnosticResult.sendEmail.error, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">Nenhuma informação da função Send-Email disponível.</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="payload">
                  <Card>
                    <CardContent className="pt-4">
                      <h3 className="text-sm font-medium mb-2">Payload de Teste Utilizado:</h3>
                      <pre className="text-xs bg-gray-100 p-3 rounded-md overflow-auto max-h-60">
                        {JSON.stringify(generateMinimalEmailPayload(), null, 2)}
                      </pre>
                      
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-1">Formato esperado pela Edge Function:</h4>
                        <ul className="text-sm list-disc pl-5 space-y-1">
                          <li>O payload deve ser enviado <strong>diretamente</strong>, não aninhado dentro de outro objeto</li>
                          <li>Todos os valores devem ser do tipo correto (string, número, etc.)</li>
                          <li>Cuidado com carimbos de data/hora ou objetos complexos que não podem ser serializados adequadamente</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
