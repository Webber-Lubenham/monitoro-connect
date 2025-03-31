
import { sendEmail } from '../core/emailClient';
import { EmailResponse } from '../core/types';
import { logEmailEvent } from '../core/logger';

/**
 * Send location notification email
 */
export const sendLocationNotification = async (
  guardianEmail: string,
  guardianName: string,
  studentName: string,
  locationInfo: string,
  mapUrl: string
): Promise<EmailResponse> => {
  try {
    logEmailEvent('info', `Enviando notificação de localização para ${guardianEmail}`);
    
    // Ensure all inputs are valid strings to prevent undefined values
    const safeGuardianName = guardianName || 'Responsável';
    const safeStudentName = studentName || 'Estudante';
    const safeLocationInfo = locationInfo || 'Informação não disponível';
    const safeMapUrl = mapUrl || '#';
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">Localização atual de ${safeStudentName}</h2>
        <p>Olá ${safeGuardianName},</p>
        <p>${safeStudentName} compartilhou sua localização atual com você:</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0; font-weight: bold;">Localização: ${safeLocationInfo}</p>
            <p style="margin: 10px 0 0 0;">Horário: ${new Date().toLocaleString('pt-BR')}</p>
        </div>
        <div style="text-align: center; margin: 30px 0;">
            <a href="${safeMapUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Ver no mapa</a>
        </div>
        <p>Você recebeu este email porque está cadastrado como responsável de ${safeStudentName} no Sistema Monitore.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #999; font-size: 12px;">Este é um email automático, por favor não responda.</p>
      </div>
    `;
    
    // Plain text version
    const text = `
      Localização atual de ${safeStudentName}
      
      Olá ${safeGuardianName},
      
      ${safeStudentName} compartilhou sua localização atual com você.
      
      Localização: ${safeLocationInfo}
      Horário: ${new Date().toLocaleString('pt-BR')}
      
      Para ver no mapa, acesse: ${safeMapUrl}
      
      Você recebeu este email porque está cadastrado como responsável de ${safeStudentName} no Sistema Monitore.
      
      Este é um email automático, por favor não responda.
    `;
    
    // Ensure recipient email is provided and valid
    if (!guardianEmail || !guardianEmail.includes('@')) {
      return {
        success: false,
        error: 'Email do destinatário inválido ou não fornecido'
      };
    }
    
    // Ensure subject is not empty
    const subject = `Localização atual de ${safeStudentName} - Sistema Monitore`;
    
    // Enviar o email usando a função sendEmail
    return await sendEmail({
      to: guardianEmail,
      subject,
      html,
      text,
      from: 'Sistema Monitore <notifications@sistema-monitore.com.br>'
    });
  } catch (error) {
    logEmailEvent('error', 'Erro ao enviar notificação de localização:', error);
    return { 
      success: false, 
      error 
    };
  }
};
