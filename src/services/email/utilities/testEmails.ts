
import { supabase } from '@/integrations/supabase/client';
import { sendEmail } from '../core/emailClient';
import { EmailParams, EmailResponse } from '../core/types';
import { logEmailEvent } from '../core/logger';

/**
 * Test email delivery using the email service
 */
export const testEmailDelivery = async (
  email: string
): Promise<EmailResponse> => {
  try {
    // Prepare test email content
    const timestamp = new Date().toLocaleString('pt-BR');
    
    const params: EmailParams = {
      to: email,
      subject: `Teste de Email - ${timestamp}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h1 style="color: #4a6ee0;">Sistema Monitore - Teste de Email</h1>
          <p>Este é um email de teste enviado em <strong>${timestamp}</strong>.</p>
          <p>Se você está recebendo esta mensagem, significa que o sistema de emails está funcionando corretamente.</p>
          <hr style="border: 0; height: 1px; background-color: #e0e0e0; margin: 20px 0;" />
          <p style="font-size: 12px; color: #666;">
            Este é apenas um teste do sistema de email. Por favor, ignore esta mensagem.
          </p>
        </div>
      `,
      text: `
        Sistema Monitore - Teste de Email
        
        Este é um email de teste enviado em ${timestamp}.
        
        Se você está recebendo esta mensagem, significa que o sistema de emails está funcionando corretamente.
        
        Este é apenas um teste do sistema de email. Por favor, ignore esta mensagem.
      `
    };
    
    // Try to send email via our standard service
    const result = await sendEmail(params);
    
    if (result.success) {
      return {
        success: true,
        message: `Email de teste enviado com sucesso para ${email}`
      };
    }
    
    // If standard service fails, try Edge Function directly
    logEmailEvent('info', 'Email via client falhou, tentando Edge Function diretamente...');
    
    const edgeFunctionResult = await supabase.functions.invoke('send-test-email', {
      body: JSON.stringify({ email }),
    });
    
    if (edgeFunctionResult.error) {
      throw new Error(`Erro na Edge Function: ${edgeFunctionResult.error.message}`);
    }
    
    if (edgeFunctionResult.data?.success) {
      return {
        success: true,
        message: `Email enviado com sucesso via Edge Function para ${email}`
      };
    }
    
    return {
      success: false,
      error: edgeFunctionResult.data?.error || 'Falha ao enviar email de teste'
    };
    
  } catch (error) {
    logEmailEvent('error', 'Erro em testEmailDelivery:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
};
