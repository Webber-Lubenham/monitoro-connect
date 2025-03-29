
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';

const Privacy = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Política de Privacidade</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-monitoro-500" />
            Política de Privacidade do Monitor Connect
          </CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">1. Introdução</h2>
          <p>
            O Monitor Connect ("nós", "nosso" ou "aplicativo") está comprometido em proteger a privacidade de todos os nossos usuários. 
            Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e compartilhamos suas informações quando você usa nosso aplicativo.
          </p>
          
          <Separator className="my-4" />
          
          <h2 className="text-xl font-semibold mt-6 mb-3">2. Informações que Coletamos</h2>
          <p className="mb-2">Podemos coletar os seguintes tipos de informações:</p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>Informações pessoais:</strong> Nome, endereço de e-mail, número de telefone e informações de conta.
            </li>
            <li>
              <strong>Dados de localização:</strong> Com seu consentimento explícito, coletamos dados de localização para fornecer serviços de rastreamento e segurança.
            </li>
            <li>
              <strong>Informações do dispositivo:</strong> Tipo de dispositivo, sistema operacional, identificadores únicos e dados de rede.
            </li>
            <li>
              <strong>Dados de uso:</strong> Informações sobre como você interage com nosso aplicativo.
            </li>
          </ul>
          
          <Separator className="my-4" />
          
          <h2 className="text-xl font-semibold mt-6 mb-3">3. Como Usamos Suas Informações</h2>
          <p className="mb-2">Usamos suas informações para:</p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Fornecer e manter nossos serviços de monitoramento e segurança</li>
            <li>Enviar notificações importantes e atualizações</li>
            <li>Melhorar e personalizar sua experiência no aplicativo</li>
            <li>Desenvolver novos recursos e funcionalidades</li>
            <li>Garantir a segurança de nossos serviços</li>
          </ul>
          
          <Separator className="my-4" />
          
          <h2 className="text-xl font-semibold mt-6 mb-3">4. Compartilhamento de Informações</h2>
          <p className="mb-4">
            Compartilhamos suas informações apenas nas seguintes circunstâncias:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Com responsáveis designados por você dentro do aplicativo</li>
            <li>Com provedores de serviços terceirizados que nos ajudam a operar o aplicativo</li>
            <li>Quando exigido por lei ou para proteger nossos direitos</li>
            <li>Em caso de emergência, com serviços de emergência relevantes</li>
          </ul>
          
          <Separator className="my-4" />
          
          <h2 className="text-xl font-semibold mt-6 mb-3">5. Seus Direitos e Escolhas</h2>
          <p className="mb-2">Você tem o direito de:</p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Acessar, corrigir ou excluir suas informações pessoais</li>
            <li>Retirar seu consentimento para o compartilhamento de localização a qualquer momento</li>
            <li>Optar por não receber comunicações promocionais</li>
            <li>Solicitar uma cópia de seus dados pessoais</li>
          </ul>
          
          <Separator className="my-4" />
          
          <h2 className="text-xl font-semibold mt-6 mb-3">6. Segurança de Dados</h2>
          <p className="mb-4">
            Implementamos medidas técnicas e organizacionais para proteger suas informações contra acesso não autorizado, 
            perda acidental ou alteração. No entanto, nenhum método de transmissão pela Internet ou método de armazenamento 
            eletrônico é 100% seguro.
          </p>
          
          <Separator className="my-4" />
          
          <h2 className="text-xl font-semibold mt-6 mb-3">7. Alterações nesta Política</h2>
          <p className="mb-4">
            Podemos atualizar nossa Política de Privacidade periodicamente. Notificaremos você sobre quaisquer alterações 
            publicando a nova Política de Privacidade nesta página e atualizando a data "Última atualização".
          </p>
          
          <Separator className="my-4" />
          
          <h2 className="text-xl font-semibold mt-6 mb-3">8. Contato</h2>
          <p className="mb-4">
            Se você tiver dúvidas sobre esta Política de Privacidade, entre em contato conosco:
          </p>
          <div className="mb-4">
            <p><strong>E-mail:</strong> privacy@monitorconnect.com</p>
            <p><strong>Telefone:</strong> (11) 1234-5678</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Privacy;
