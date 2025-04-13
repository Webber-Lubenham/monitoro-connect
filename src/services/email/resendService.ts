import { supabase } from "@/integrations/supabase/client.ts";
import { EmailParams, EmailResponse } from "./core/types";

/**
 * Send a confirmation email to a user
 */
const sendConfirmationEmail = async (
  email: string, 
  confirmationUrl: string, 
  userRole: string
): Promise<EmailResponse> => {
  try {
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
    
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        to: email,
        subject,
        html,
        text: textContent
      }
    });
    
    if (error) {
      console.error('Error sending confirmation email:', error);
      return { 
        success: false, 
        error: error.message,
        message: 'Falha ao enviar email de confirmação'
      };
    }
    
    return { 
      success: true,
      id: data?.id,
      message: 'Email de confirmação enviado com sucesso'
    };
  } catch (error) {
    console.error('Exception sending confirmation email:', error);
    return { 
      success: false, 
      error,
      message: 'Exceção ao enviar email de confirmação'
    };
  }
};

/**
 * Send a password reset email
 */
const sendPasswordResetEmail = async (email: string, resetUrl: string): Promise<EmailResponse> => {
  try {
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        to: email,
        subject: "Redefinição de senha - Sistema Monitore",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <h1 style="color: #4a6ee0;">Sistema Monitore</h1>
            <p>Olá,</p>
            <p>Recebemos uma solicitação para redefinir sua senha.</p>
            <p>Clique no botão abaixo para criar uma nova senha:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background-color: #4a6ee0; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
                Redefinir Senha
              </a>
            </div>
            
            <p>Ou copie e cole este link no seu navegador:</p>
            <p style="background-color: #f5f5f5; padding: 10px; border-radius: 4px; word-break: break-all;">
              ${resetUrl}
            </p>
            
            <p>Se você não solicitou esta redefinição, ignore este email.</p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #666; text-align: center;">
              <p>Sistema Monitore - Segurança e tranquilidade para alunos e responsáveis</p>
            </div>
          </div>
        `
      }
    });
    
    if (error) {
      console.error('Error sending password reset email:', error);
      return { 
        success: false, 
        error: error.message,
        message: 'Falha ao enviar email de redefinição de senha'
      };
    }
    
    return { 
      success: true,
      id: data?.id,
      message: 'Email de redefinição de senha enviado com sucesso'
    };
  } catch (error) {
    console.error('Exception sending password reset email:', error);
    return { 
      success: false, 
      error,
      message: 'Exceção ao enviar email de redefinição de senha'
    };
  }
};

/**
 * Send a notification to a guardian about a student's location
 */
const sendGuardianNotification = async (
  guardianEmail: string,
  guardianName: string,
  subject: string,
  message: string
): Promise<EmailResponse> => {
  try {
    // Create the HTML content
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h1 style="color: #4a6ee0;">Sistema Monitore</h1>
        <p>Olá ${guardianName},</p>
        
        ${message}
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #666; text-align: center;">
          <p>Sistema Monitore - Segurança e tranquilidade para alunos e responsáveis</p>
        </div>
      </div>
    `;
    
    // Create plain text version
    const text = message.replace(/<[^>]*>?/gm, '');
    
    // Send the email through the edge function
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        to: guardianEmail,
        subject,
        html,
        text
      }
    });
    
    if (error) {
      console.error('Error sending guardian notification:', error);
      return { 
        success: false, 
        error: error.message,
        message: 'Falha ao enviar notificação para responsável'
      };
    }
    
    return { 
      success: true,
      id: data?.id,
      message: 'Notificação para responsável enviada com sucesso'
    };
  } catch (error) {
    console.error('Exception sending guardian notification:', error);
    return { 
      success: false, 
      error,
      message: 'Exceção ao enviar notificação para responsável'
    };
  }
};

// Export the service methods
export default {
  sendConfirmationEmail,
  sendPasswordResetEmail,
  sendGuardianNotification
};
