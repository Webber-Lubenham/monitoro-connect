
import { Resend } from 'resend';
import { EmailParams, EmailResponse } from './types';
import { logEmailEvent } from './logger';

// Resend API key (somente para ambientes de desenvolvimento como fallback)
const resendApiKey = import.meta.env.VITE_RESEND_API_KEY;
export const resend = new Resend(resendApiKey);

/**
 * Send email directly via Resend (fallback)
 * Note: Not recommended for production due to CORS issues
 */
export const sendViaResendDirect = async (params: EmailParams): Promise<EmailResponse> => {
  if (!resendApiKey) {
    logEmailEvent('error', 'Chave da API Resend não configurada');
    return {
      success: false,
      error: 'Chave da API Resend não configurada'
    };
  }
  
  try {
    const { to, subject, html, text, from = 'Sistema Monitore <notifications@sistema-monitore.com.br>' } = params;
    
    logEmailEvent('info', `Tentando enviar email diretamente via Resend para ${to}`);
    
    const payload: {
      from: string;
      to: string;
      subject: string;
      html: string;
      text?: string;
    } = {
      from,
      to,
      subject,
      html
    };
    
    if (text) {
      payload.text = text;
    }
    
    const { data, error } = await resend.emails.send(payload);
    
    if (error) {
      logEmailEvent('error', 'Erro ao enviar email direto pelo Resend:', error);
      return {
        success: false,
        error: error.message
      };
    }
    
    logEmailEvent('success', 'Email enviado com sucesso via Resend:', data);
    return {
      success: true,
      data
    };
  } catch (error) {
    logEmailEvent('error', 'Exceção ao enviar email diretamente pelo Resend:', error);
    return {
      success: false,
      error
    };
  }
};
