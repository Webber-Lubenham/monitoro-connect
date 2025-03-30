
import { EmailParams } from '../core/types';
import { logEmailEvent } from '../core/logger';

/**
 * Formato do template de convite para responsável
 */
interface GuardianInviteTemplateParams {
  guardianName: string;
  studentName: string;
  inviteLink: string;
}

/**
 * Gera o HTML para o email de convite de responsável
 */
const generateGuardianInviteHtml = (params: GuardianInviteTemplateParams): string => {
  const { guardianName, studentName, inviteLink } = params;
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h1 style="color: #4a6ee0;">Sistema Monitore - Convite de Responsável</h1>
      
      <p>Olá ${guardianName},</p>
      
      <p>Você foi convidado(a) para ser responsável do(a) estudante <strong>${studentName}</strong> no Sistema Monitore.</p>
      
      <p>O Sistema Monitore permite que responsáveis acompanhem a localização dos estudantes em tempo real, recebam notificações importantes e garantam sua segurança.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${inviteLink}" style="background-color: #4a6ee0; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
          Aceitar Convite
        </a>
      </div>
      
      <p>Se você não esperava receber este convite, por favor ignore este email.</p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #666; text-align: center;">
        <p>Sistema Monitore - Segurança e tranquilidade para alunos e responsáveis</p>
      </div>
    </div>
  `;
};

/**
 * Função para enviar convite para responsável
 */
export const sendGuardianInviteEmail = async (
  email: string,
  guardianName: string,
  studentName: string,
  inviteLink: string
): Promise<boolean> => {
  try {
    // Importar dinamicamente para evitar dependências circulares
    const { sendEmail } = await import('../core/emailClient');
    
    const params: EmailParams = {
      to: email,
      subject: `Convite para ser responsável de ${studentName} no Sistema Monitore`,
      html: generateGuardianInviteHtml({
        guardianName,
        studentName,
        inviteLink
      })
    };
    
    const result = await sendEmail(params);
    
    if (result.success) {
      logEmailEvent('success', `Convite enviado com sucesso para ${email}`);
      return true;
    } else {
      logEmailEvent('error', `Falha ao enviar convite para ${email}`, result.error);
      return false;
    }
  } catch (error) {
    logEmailEvent('error', `Exceção ao enviar convite para ${email}`, error);
    return false;
  }
};

/**
 * Gera o HTML para o email de confirmação de cadastro como responsável
 */
const generateGuardianConfirmationHtml = (guardianName: string, studentName: string): string => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h1 style="color: #4a6ee0;">Sistema Monitore - Confirmação de Cadastro</h1>
      
      <p>Olá ${guardianName},</p>
      
      <p>Seu cadastro como responsável do(a) estudante <strong>${studentName}</strong> foi concluído com sucesso!</p>
      
      <p>Agora você poderá acompanhar a localização do estudante em tempo real e receber notificações importantes.</p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #666; text-align: center;">
        <p>Sistema Monitore - Segurança e tranquilidade para alunos e responsáveis</p>
      </div>
    </div>
  `;
};

/**
 * Função para enviar confirmação de cadastro para responsável
 */
export const sendGuardianConfirmationEmail = async (
  email: string,
  guardianName: string,
  studentName: string
): Promise<boolean> => {
  try {
    // Importar dinamicamente para evitar dependências circulares
    const { sendEmail } = await import('../core/emailClient');
    
    const params: EmailParams = {
      to: email,
      subject: `Confirmação de cadastro como responsável no Sistema Monitore`,
      html: generateGuardianConfirmationHtml(guardianName, studentName)
    };
    
    const result = await sendEmail(params);
    
    if (result.success) {
      logEmailEvent('success', `Confirmação enviada com sucesso para ${email}`);
      return true;
    } else {
      logEmailEvent('error', `Falha ao enviar confirmação para ${email}`, result.error);
      return false;
    }
  } catch (error) {
    logEmailEvent('error', `Exceção ao enviar confirmação para ${email}`, error);
    return false;
  }
};
