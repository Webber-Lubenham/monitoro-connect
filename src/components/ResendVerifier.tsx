
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { Loader2, CheckCircle2, XCircle, AlertTriangle, Info } from "lucide-react";

export const ResendVerifier = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  
  const verifyResendConfig = async () => {
    setLoading(true);
    setResults(null);
    
    try {
      toast({
        title: "Verificando configuração Resend",
        description: "Aguarde enquanto verificamos a configuração da API Resend..."
      });
      
      // Call the verification function
      const { data, error } = await supabase.functions.invoke('verify-resend-config', {});
      
      if (error) {
        console.error("Erro ao verificar configuração:", error);
        
        toast({
          title: "Erro ao verificar configuração",
          description: error.message || "Ocorreu um erro ao verificar a configuração do Resend",
          variant: "destructive"
        });
        
        setResults({
          success: false,
          error: error
        });
      } else {
        console.log("Resultado da verificação:", data);
        setResults(data);
        
        if (data?.verification?.api_connectivity) {
          toast({
            title: "Configuração verificada",
            description: "A API do Resend está configurada e funcionando corretamente"
          });
        } else {
          toast({
            title: "Problemas na configuração",
            description: "Foram encontrados problemas na configuração do Resend",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error("Erro ao verificar configuração:", error);
      
      toast({
        title: "Erro ao verificar configuração",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado",
        variant: "destructive"
      });
      
      setResults({
        success: false,
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const renderVerificationResults = () => {
    if (!results) return null;
    
    const verification = results.verification;
    if (!verification) return null;
    
    return (
      <div className="space-y-4 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Configuração da API</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Chave API configurada:</span>
                  <span className={verification.api_key.configured ? "text-green-500" : "text-red-500"}>
                    {verification.api_key.configured ? 
                      <CheckCircle2 className="h-5 w-5" /> : 
                      <XCircle className="h-5 w-5" />
                    }
                  </span>
                </div>
                
                {verification.api_key.configured && (
                  <>
                    <div className="flex items-center justify-between">
                      <span>Chave API (mascarada):</span>
                      <span className="font-mono text-sm">{verification.api_key.masked_value}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span>Tamanho da chave:</span>
                      <span>{verification.api_key.length} caracteres</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span>Conectividade da API:</span>
                      <span className={verification.api_connectivity ? "text-green-500" : "text-red-500"}>
                        {verification.api_connectivity ? 
                          <CheckCircle2 className="h-5 w-5" /> : 
                          <XCircle className="h-5 w-5" />
                        }
                      </span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
          
          {verification.primary_domain && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Domínio Principal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Nome do domínio:</span>
                    <span className="font-mono text-sm">{verification.primary_domain.name}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span>Status:</span>
                    <span className={
                      verification.primary_domain.status === 'verified' ? "text-green-500" : 
                      verification.primary_domain.status === 'not_found' ? "text-red-500" : 
                      "text-amber-500"
                    }>
                      {verification.primary_domain.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span>Verificado:</span>
                    <span className={verification.primary_domain.verified ? "text-green-500" : "text-red-500"}>
                      {verification.primary_domain.verified ? 
                        <CheckCircle2 className="h-5 w-5" /> : 
                        <XCircle className="h-5 w-5" />
                      }
                    </span>
                  </div>
                  
                  {verification.primary_domain.message && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Problema com domínio</AlertTitle>
                      <AlertDescription>
                        {verification.primary_domain.message}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        {verification.test_send && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Teste de Envio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Teste de envio:</span>
                  <span className={verification.test_send.success ? "text-green-500" : "text-red-500"}>
                    {verification.test_send.success ? 
                      <CheckCircle2 className="h-5 w-5" /> : 
                      <XCircle className="h-5 w-5" />
                    }
                  </span>
                </div>
                
                <div className="text-sm">
                  <p>{verification.test_send.message}</p>
                  
                  {verification.test_send.id && (
                    <p className="mt-1">ID: <span className="font-mono">{verification.test_send.id}</span></p>
                  )}
                  
                  {verification.test_send.error && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Erro no teste de envio</AlertTitle>
                      <AlertDescription>
                        {typeof verification.test_send.error === 'string' ? 
                          verification.test_send.error : 
                          JSON.stringify(verification.test_send.error)
                        }
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {verification.domains && verification.domains.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Domínios Configurados</CardTitle>
              <CardDescription>
                Domínios verificados na sua conta Resend
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Nome</th>
                      <th className="text-left py-2">Status</th>
                      <th className="text-left py-2">Região</th>
                      <th className="text-left py-2">Data de Criação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {verification.domains.map((domain: any, index: number) => (
                      <tr key={index} className="border-b">
                        <td className="py-2 font-mono">{domain.name}</td>
                        <td className="py-2">
                          <span className={
                            domain.status === 'verified' ? "text-green-500" : 
                            "text-amber-500"
                          }>
                            {domain.status}
                          </span>
                        </td>
                        <td className="py-2">{domain.region}</td>
                        <td className="py-2">{new Date(domain.created_at).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
        
        {(!verification.api_key.configured || !verification.api_connectivity || 
         (verification.primary_domain && !verification.primary_domain.verified)) && (
          <Alert className="mt-4 bg-amber-50 text-amber-900 border-amber-300">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <AlertTitle>Problemas detectados na configuração</AlertTitle>
            <AlertDescription className="mt-2 space-y-2">
              <ul className="list-disc pl-5 space-y-1">
                {!verification.api_key.configured && (
                  <li>A chave API do Resend não está configurada. Adicione a variável RESEND_API_KEY no Supabase.</li>
                )}
                
                {verification.api_key.configured && !verification.api_connectivity && (
                  <li>Não foi possível conectar à API do Resend com a chave fornecida. Verifique se a chave API está correta.</li>
                )}
                
                {verification.primary_domain && !verification.primary_domain.verified && (
                  <li>
                    O domínio <strong>{verification.primary_domain.name}</strong> não está verificado. 
                    Verifique o domínio no painel do Resend.
                  </li>
                )}
                
                {verification.primary_domain && verification.primary_domain.status === 'not_found' && (
                  <li>
                    O domínio <strong>{verification.primary_domain.name}</strong> não foi encontrado na sua conta Resend. 
                    Adicione este domínio no painel do Resend.
                  </li>
                )}
              </ul>
              
              <div className="mt-4 pt-2 border-t">
                <p className="font-medium">Ações recomendadas:</p>
                <ul className="list-disc pl-5 space-y-1 mt-1">
                  <li>Acesse o painel do Resend em <a href="https://resend.com" target="_blank" className="text-blue-600 underline">resend.com</a></li>
                  <li>Verifique se a chave API está correta nas variáveis de ambiente do Supabase</li>
                  <li>Adicione e verifique o domínio <strong>sistema-monitore.com.br</strong> na sua conta Resend</li>
                  <li>
                    Use o remetente <code className="bg-gray-100 px-1 py-0.5 rounded">Sistema Monitore &lt;notifications@sistema-monitore.com.br&gt;</code> em
                    todos os emails
                  </li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </div>
    );
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Verificador de Configuração Resend</CardTitle>
        <CardDescription>
          Verifica a configuração da API Resend e domínios para envio de emails
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4">
          <Info className="h-4 w-4" />
          <AlertTitle>Informação</AlertTitle>
          <AlertDescription>
            Esta ferramenta verifica se a API do Resend está configurada corretamente
            e se o domínio <strong>sistema-monitore.com.br</strong> está verificado na sua conta.
          </AlertDescription>
        </Alert>
        
        <Button 
          onClick={verifyResendConfig} 
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verificando configuração...
            </>
          ) : (
            <>Verificar Configuração Resend</>
          )}
        </Button>
        
        {renderVerificationResults()}
      </CardContent>
    </Card>
  );
};

export default ResendVerifier;
