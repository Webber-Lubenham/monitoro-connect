
import { supabase } from '@/integrations/supabase/client';

/**
 * Envia um email de convite para um responsável (guardião)
 */
export const sendGuardianInvitation = async (
  email: string,
  guardianName: string,
  studentName: string,
  tempPassword: string,
  guardianCpf?: string,
  confirmationUrl?: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log(`Preparando convite para responsável: ${email}`);
    
    // Determina o URL base da aplicação (poderia ser obtido de variáveis de ambiente)
    const appUrl = window.location.origin;
    
    // Usa a URL fornecida ou cria uma padrão
    const activationUrl = confirmationUrl || 
      `${appUrl}/guardian-confirm?token=${tempPassword}&email=${encodeURIComponent(email)}`;
    
    // Tenta enviar o email através da função edge do Supabase
    const { data, error } = await supabase.functions.invoke('send-guardian-invitation', {
      body: {
        guardianEmail: email,
        guardianName,
        studentName,
        tempPassword,
        guardianCpf,
        confirmationUrl: activationUrl
      }
    });

    if (error) {
      console.error('Erro ao chamar edge function de convite:', error);
      return { success: false, error: error.message };
    }

    if (!data.success) {
      console.error('Função de edge retornou erro:', data.error);
      return { success: false, error: data.error || 'Erro ao enviar convite' };
    }

    console.log('Convite enviado com sucesso para:', email);
    return { success: true };
  } catch (error: unknown) {
    console.error('Exceção ao enviar convite de responsável:', error instanceof Error ? error.message : String(error));
    return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido ao enviar convite' };
  }
};

/**
 * Envia um email de notificação de localização
 */
export const sendLocationNotification = async (
  email: string,
  studentName: string,
  latitude: number,
  longitude: number
): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log(`Enviando notificação de localização para: ${email}`);
    
    // Criar link para Google Maps com as coordenadas
    const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
    
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        to: email,
        subject: `Localização de ${studentName} - Sistema Monitore`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #4a6ee0;">Sistema Monitore</h1>
            
            <p>Olá,</p>
            
            <p>O estudante <strong>${studentName}</strong> compartilhou sua localização.</p>
            
            <p>Você pode visualizar a localização no mapa clicando no link abaixo:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${mapsUrl}" style="background-color: #4a6ee0; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
                Ver Localização no Mapa
              </a>
            </div>
            
            <p>Ou copie e cole este link no seu navegador:</p>
            <p style="background-color: #f5f5f5; padding: 10px; border-radius: 4px; word-break: break-all;">
              ${mapsUrl}
            </p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #666; text-align: center;">
              <p>Sistema Monitore - Segurança e tranquilidade para alunos e responsáveis</p>
            </div>
          </div>
        `
      }
    });

    if (error) {
      console.error('Erro ao chamar edge function de email:', error);
      return { success: false, error: error.message };
    }

    console.log('Notificação de localização enviada com sucesso para:', email);
    return { success: true };
  } catch (error: unknown) {
    console.error('Exceção ao enviar notificação de localização:', error instanceof Error ? error.message : String(error));
    return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido ao enviar notificação' };
  }
};

// Adiciona função de envio de email genérica para ser usada nas outras funções de mutação
export const sendEmail = async (
  to: string,
  subject: string,
  html: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        to,
        subject,
        html
      }
    });

    if (error) {
      console.error('Erro ao enviar email:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: unknown) {
    console.error('Exceção ao enviar email:', error instanceof Error ? error.message : String(error));
    return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido ao enviar email' };
  }
};

// Adiciona função de teste de email para ser usada em diagnósticos
export const testEmailDelivery = async (
  to: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    return sendEmail(
      to,
      'Teste de Entrega de Email - Sistema Monitore',
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #4a6ee0;">Teste de Email</h1>
          <p>Este é um email de teste do Sistema Monitore.</p>
          <p>Se você está recebendo este email, a configuração está funcionando corretamente.</p>
          <p>Hora do envio: ${new Date().toLocaleString('pt-BR')}</p>
        </div>
      `
    );
  } catch (error: unknown) {
    console.error('Erro no teste de email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido no teste de email' };
  }
};

// Adiciona função de teste para o componente TestEdgeFunctionButton
export const sendTestEmail = async (
  to: string
): Promise<{ success: boolean; error?: string }> => {
  return testEmailDelivery(to);
};
