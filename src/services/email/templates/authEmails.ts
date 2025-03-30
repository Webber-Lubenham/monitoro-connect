
import { sendEmail } from '../core/emailClient';

/**
 * Send account confirmation email
 */
export const sendConfirmationEmail = async (
  email: string, 
  confirmationUrl: string, 
  userRole: string
): Promise<{ success: boolean; data?: any; error?: any }> => {
  try {
    console.log(`Enviando email de confirmação para ${email} com role ${userRole}`);
    
    // Configura o título e o corpo do email com base no tipo de usuário
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
    
    // Envia o email usando a função sendEmail
    return await sendEmail({
      to: email,
      subject,
      html
    });
  } catch (error) {
    console.error('Erro ao enviar email de confirmação:', error);
    return { 
      success: false, 
      error 
    };
  }
};

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async (
  email: string, 
  resetUrl: string
): Promise<{ success: boolean; data?: any; error?: any }> => {
  try {
    console.log(`Enviando email de recuperação de senha para ${email}`);
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h1 style="color: #4a6ee0;">Sistema Monitore</h1>
        <p>Olá,</p>
        <p>Recebemos uma solicitação para redefinir sua senha no Sistema Monitore.</p>
        <p>Para criar uma nova senha, clique no botão abaixo:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #4a6ee0; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
            Redefinir minha senha
          </a>
        </div>
        
        <p>Ou copie e cole este link no seu navegador:</p>
        <p style="background-color: #f5f5f5; padding: 10px; border-radius: 4px; word-break: break-all;">
          ${resetUrl}
        </p>
        
        <p>Se você não solicitou a redefinição de senha, por favor, ignore este email.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #666; text-align: center;">
          <p>Sistema Monitore - Segurança e tranquilidade para alunos e responsáveis</p>
        </div>
      </div>
    `;
    
    // Enviar o email usando a função sendEmail
    return await sendEmail({
      to: email,
      subject: "Recuperação de Senha - Sistema Monitore",
      html
    });
  } catch (error) {
    console.error('Erro ao enviar email de recuperação de senha:', error);
    return { 
      success: false, 
      error 
    };
  }
};
