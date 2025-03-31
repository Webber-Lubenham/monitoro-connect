
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmailTesterButton } from "@/components/EmailTesterButton";
import { EmailTestButton } from "@/components/EmailTestButton";
import { PayloadInspector } from "@/components/email-testing/PayloadInspector";
import { AdvancedDiagnostic } from "@/components/email-testing/AdvancedDiagnostic";
import { DiagnoseEdgeFunction } from "@/components/email-testing/DiagnoseEdgeFunction"; 
import { EmailDiagnosticButton } from "@/components/EmailDiagnosticButton";
import { DirectEmailTest } from "@/components/DirectEmailTest";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronsDown, ChevronsUp, AlertTriangle, ArrowLeft, Info, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { DirectEmailTestButton } from "@/components/DirectEmailTestButton";
import { ResendVerifier } from "@/components/ResendVerifier";
import { ResendConnectionTest } from "@/components/email-testing/ResendConnectionTest";

const EmailTester = () => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Sistema de Diagnóstico de Email</h1>
          <Button variant="outline" size="sm" asChild>
            <Link to="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao Dashboard
            </Link>
          </Button>
        </div>
        
        <Card className="p-6 border-2 border-blue-500 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Info className="h-8 w-8 text-blue-500" />
            <h2 className="text-2xl font-bold text-blue-500">INSTRUÇÕES IMPORTANTES</h2>
          </div>
          
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            Esta página de diagnóstico de email permite testar o envio de emails do sistema diretamente. 
            Use os botões abaixo para verificar se os emails estão sendo enviados corretamente.
          </p>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
            <ul className="list-disc pl-5 space-y-2">
              <li>Clique no botão <strong>TESTAR E-MAIL DIRETAMENTE</strong> para enviar um email de teste</li>
              <li>Se o email não chegar, verifique sua pasta de spam/lixo eletrônico</li>
              <li>Certifique-se que o domínio <code>sistema-monitore.com.br</code> está verificado no Resend</li>
              <li>Verifique se a API key do Resend está configurada corretamente nas variáveis de ambiente do Supabase</li>
            </ul>
          </div>
        </Card>
        
        {/* Novo componente de teste de conexão com Resend */}
        <ResendConnectionTest />
        
        <DirectEmailTestButton />
        
        <DirectEmailTest />
        
        <ResendVerifier />
        
        <Card className="p-6 border-2 border-green-500 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <h2 className="text-2xl font-bold text-green-500">PROBLEMAS COMUNS</h2>
          </div>
          
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            Se os emails não estão chegando ao destinatário, verifique estas possíveis causas:
          </p>
          
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-md">
            <ol className="list-decimal pl-5 space-y-3">
              <li className="font-medium">
                Verifique a pasta de spam/lixo eletrônico
                <p className="font-normal text-sm mt-1">
                  Muitos provedores de email colocam emails automaticamente na pasta de spam. Isso é especialmente comum
                  com serviços como Hotmail/Outlook.
                </p>
              </li>
              
              <li className="font-medium">
                Verifique se o domínio está verificado no Resend
                <p className="font-normal text-sm mt-1">
                  O domínio <code>sistema-monitore.com.br</code> precisa estar verificado na sua conta Resend.
                  Use o verificador acima para conferir.
                </p>
              </li>
              
              <li className="font-medium">
                Confirme que está usando o remetente correto
                <p className="font-normal text-sm mt-1">
                  Sempre use <code>Sistema Monitore &lt;notifications@sistema-monitore.com.br&gt;</code> como remetente,
                  não use emails @resend.dev.
                </p>
              </li>
              
              <li className="font-medium">
                Problemas com emails corporativos
                <p className="font-normal text-sm mt-1">
                  Servidores de email corporativos frequentemente possuem filtros mais rigorosos.
                  Tente com um email pessoal como Gmail para testar.
                </p>
              </li>
            </ol>
          </div>
        </Card>
        
        <Card className="p-6 border-2 border-amber-500 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="h-8 w-8 text-amber-500" />
            <h2 className="text-2xl font-bold text-amber-500">TESTE COMPLETO DE EMAIL</h2>
          </div>
          
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            Use este botão para testar o envio de email usando a função <code>send-email</code>.
            Este teste ajuda a identificar problemas específicos com o formato do payload.
          </p>
          
          <EmailDiagnosticButton />
        </Card>
        
        <Tabs defaultValue="basic">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Testes Básicos</TabsTrigger>
            <TabsTrigger value="advanced">Diagnóstico</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Teste de Envio de Emails</h2>
              <p className="mb-4 text-gray-600 dark:text-gray-400">
                Esta página permite testar se o sistema de envio de emails está funcionando corretamente. 
                Use-a para verificar a configuração do envio de emails no Sistema Monitore.
              </p>
              
              <EmailTesterButton />
              
              <div className="mt-8 border-t pt-6">
                <h3 className="text-xl font-bold mb-4">Teste com Payload Direto</h3>
                <p className="mb-4 text-gray-600 dark:text-gray-400">
                  Este teste envia um email diretamente para a Edge Function sem passar por camadas intermediárias.
                  Útil para diagnosticar problemas específicos com o formato do payload.
                </p>
                
                <EmailDiagnosticButton />
              </div>
              
              <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                <h3 className="font-semibold mb-2">Notas importantes:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>O teste utiliza o método de envio via Edge Function.</li>
                  <li>Verifique tanto a caixa de entrada quanto a pasta de spam.</li>
                  <li>Se o email não chegar, verifique se as configurações do Resend estão corretas.</li>
                  <li>A chave de API do Resend precisa estar configurada corretamente.</li>
                  <li>O domínio de envio precisa estar verificado no Resend.</li>
                </ul>
              </div>
              
              <div className="mt-6 p-4 border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950 rounded-md">
                <h3 className="font-semibold text-amber-800 dark:text-amber-400 mb-2">Status dos Testes:</h3>
                <EmailTestButton />
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="advanced">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Ferramentas de Diagnóstico</h2>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-1"
                >
                  {showAdvanced ? (
                    <>
                      <ChevronsUp className="h-4 w-4" />
                      <span>Ocultar opções avançadas</span>
                    </>
                  ) : (
                    <>
                      <ChevronsDown className="h-4 w-4" />
                      <span>Mostrar opções avançadas</span>
                    </>
                  )}
                </Button>
              </div>
              
              <p className="mb-6 text-gray-600 dark:text-gray-400">
                Esta seção contém ferramentas avançadas para diagnosticar problemas com o sistema de email.
                Use estas ferramentas para identificar a causa raiz de falhas no envio de emails.
              </p>
              
              <div className="grid grid-cols-1 gap-6">
                <DiagnoseEdgeFunction />
                <PayloadInspector />
                
                {showAdvanced && <AdvancedDiagnostic />}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EmailTester;
