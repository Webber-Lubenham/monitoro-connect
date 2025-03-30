
import { EmailParams, EmailResponse } from './types';
import { validateEmailParams } from './validator';
import { logEmailEvent } from './logger';
import { sendEmailViaEdgeFunction, sendViaEdgeFunction } from './edgeFunctionClient';
import { sendViaResendDirect } from './resendClient';

/**
 * Core function to send emails
 * Primarily uses Supabase Edge Functions with a fallback to direct Resend API (dev only)
 */
export const sendEmail = async (params: EmailParams): Promise<EmailResponse> => {
  try {
    // Validar parâmetros do email
    const validation = validateEmailParams(params);
    if (!validation.isValid) {
      logEmailEvent('error', validation.errorMessage || 'Parâmetros de email inválidos');
      return { 
        success: false, 
        error: validation.errorMessage 
      };
    }
    
    const { to, subject } = params;
    logEmailEvent('info', `Enviando email para ${to} com assunto "${subject}"`);
    
    // Tentar enviar via Edge Function
    const edgeFunctionResult = await sendEmailViaEdgeFunction(params);
    
    // Se o envio via Edge Function for bem-sucedido, retorne o resultado
    if (edgeFunctionResult.success) {
      return edgeFunctionResult;
    }
    
    // Log de falha na Edge Function
    logEmailEvent('info', 'Edge Function falhou, tentando método alternativo...', edgeFunctionResult.error);
    
    // Se estamos em ambiente de desenvolvimento e temos uma chave Resend, tentar envio direto
    if (import.meta.env.DEV && import.meta.env.VITE_RESEND_API_KEY) {
      return await sendViaResendDirect(params);
    }
    
    // Se chegamos aqui, ambos os métodos falharam
    return {
      success: false,
      error: edgeFunctionResult.error,
      message: 'Falha ao enviar email por todos os métodos disponíveis'
    };
  } catch (error) {
    logEmailEvent('error', 'Exceção não tratada em sendEmail:', error);
    return { 
      success: false, 
      error,
      message: 'Erro interno ao tentar enviar email'
    };
  }
};

/**
 * Attempt to send an email confirmation via various methods
 * This function tries multiple methods to ensure email delivery
 */
export const sendConfirmationEmail = async (
  email: string, 
  confirmationUrl: string, 
  userRole: string
): Promise<EmailResponse> => {
  logEmailEvent('info', `Enviando email de confirmação para ${email} com role ${userRole}`);
  
  try {
    // First attempt: Use dedicated edge function
    try {
      const edgeFunctionResult = await sendViaEdgeFunction('send-confirmation-email', {
        email,
        confirmationUrl,
        userRole
      });
      
      if (edgeFunctionResult.success) {
        return {
          success: true,
          message: 'Email de confirmação enviado com sucesso via Edge Function específica'
        };
      }
      
      logEmailEvent('info', 'Edge Function falhou, tentando serviço de email genérico...');
    } catch (edgeFunctionError) {
      logEmailEvent('error', 'Exception in send-confirmation-email edge function:', edgeFunctionError);
    }
    
    // Second attempt: Use generic send-email edge function
    const isGuardian = userRole === 'guardian';
    const subject = isGuardian
      ? "Confirmação de cadastro como Responsável - Sistema Monitore"
      : "Confirmação de cadastro - Sistema Monitore";
      
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h1 style="color: #4a6ee0;">Sistema Monitore</h1>
        <p>Olá,</p>
        <p>Obrigado por se cadastrar no Sistema Monitore ${isGuardian ? 'como responsável' : ''}.</p>
        <p>Para ativar sua conta e começar a usar o sistema, por favor, clique no botão abaixo:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${confirmationUrl}" style="background-color: #4a6ee0; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
            Confirmar meu cadastro
          </a>
        </div>
        
        <p>Ou copie e cole este link no seu navegador:</p>
        <p style="background-color: #f5f5f5; padding: 10px; border-radius: 4px; word-break: break-all;">
          ${confirmationUrl}
        </p>
        
        <p>Se você não solicitou este cadastro, por favor, ignore este email.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #666; text-align: center;">
          <p>Sistema Monitore - Segurança e tranquilidade para alunos e responsáveis</p>
        </div>
      </div>
    `;
    
    const textContent = `
      Sistema Monitore - Confirmação de cadastro ${isGuardian ? 'como responsável' : ''}
      
      Olá,
      
      Obrigado por se cadastrar no Sistema Monitore ${isGuardian ? 'como responsável' : ''}.
      
      Para ativar sua conta e começar a usar o sistema, por favor, acesse o link abaixo:
      
      ${confirmationUrl}
      
      Se você não solicitou este cadastro, por favor, ignore este email.
      
      Sistema Monitore - Segurança e tranquilidade para alunos e responsáveis
    `;
    
    const emailResult = await sendEmail({
      to: email,
      subject,
      html,
      text: textContent
    });
    
    if (emailResult.success) {
      return {
        success: true,
        message: 'Email de confirmação enviado com sucesso via serviço de email genérico'
      };
    }
    
    // If all attempts fail, return detailed error
    return {
      success: false,
      message: 'Não foi possível enviar o email de confirmação',
      error: emailResult.error
    };
    
  } catch (error) {
    logEmailEvent('error', 'Erro ao enviar email de confirmação:', error);
    return {
      success: false,
      message: 'Erro ao enviar email de confirmação',
      error
    };
  }
};

// Export types to fix the import error
export type { EmailParams, EmailResponse };
