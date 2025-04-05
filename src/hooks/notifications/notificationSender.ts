
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import { getGuardianById } from '@/services/guardian/fetch/guardianLookupService';

/**
 * Sends a notification to a specific guardian
 */
export const sendNotificationToGuardian = async (
  studentId: string,
  guardianId: string,
  message: string,
  notificationType: string
): Promise<boolean> => {
  try {
    logger.info(`Enviando notificação para o guardião ${guardianId} do aluno ${studentId} via ${notificationType}`);

    // Fetch guardian data
    const guardian = await getGuardianById(guardianId);

    if (!guardian) {
      logger.warn(`Guardião não encontrado com ID: ${guardianId}`);
      return false;
    }
    
    // Fix the line with error
    const guardianEmail = guardian?.email ?? '';

    // Send email notification
    if (notificationType === 'email' || notificationType === 'both') {
      const emailPayload = {
        to: guardianEmail,
        subject: 'Notificação do Sistema Monitore',
        body: message,
      };

      const { error: emailError } = await supabase.functions.invoke('send-email', {
        body: emailPayload,
      });

      if (emailError) {
        logger.error(`Erro ao enviar email para ${guardianEmail}: ${emailError.message}`);
      } else {
        logger.info(`Email enviado com sucesso para ${guardianEmail}`);
      }
    }

    // Log the notification
    const { error: logError } = await supabase
      .from('notification_logs')
      .insert([
        {
          student_id: studentId,
          guardian_id: guardianId,
          notification_type: notificationType,
          status: 'sent',
          message: message,
        },
      ]);

    if (logError) {
      logger.error(`Erro ao registrar log de notificação: ${logError.message}`);
    }

    return true;
  } catch (error: any) {
    logger.error(`Erro ao enviar notificação para o guardião ${guardianId}: ${error.message}`);
    return false;
  }
};

/**
 * Sends a notification to all guardians of a student
 */
export const sendNotificationToAllGuardians = async (
  studentId: string,
  message: string,
  notificationType: string
): Promise<boolean> => {
  try {
    logger.info(`Enviando notificação para todos os responsáveis do aluno ${studentId} via ${notificationType}`);

    // Fetch all guardians for the student
    const { data: guardians, error: guardianError } = await supabase
      .from('guardians')
      .select('*')
      .eq('student_id', studentId);

    if (guardianError) {
      logger.error(`Erro ao buscar responsáveis do aluno ${studentId}: ${guardianError.message}`);
      return false;
    }

    if (!guardians || guardians.length === 0) {
      logger.warn(`Nenhum responsável encontrado para o aluno ${studentId}`);
      return false;
    }
    
    // Add null checks for all email references
    const emails = guardians
      .filter(guardian => guardian.email)
      .map(guardian => guardian.email)
      .filter(Boolean);

    // Send email notification to all guardians
    if (notificationType === 'email' || notificationType === 'both') {
      const emailPayload = {
        to: emails.join(','),
        subject: 'Notificação do Sistema Monitore',
        body: message,
      };

      const { error: emailError } = await supabase.functions.invoke('send-email', {
        body: emailPayload,
      });

      if (emailError) {
        logger.error(`Erro ao enviar email para os responsáveis do aluno ${studentId}: ${emailError.message}`);
      } else {
        logger.info(`Email enviado com sucesso para os responsáveis do aluno ${studentId}`);
      }
    }

    // Log the notification for each guardian
    for (const guardian of guardians) {
      const { error: logError } = await supabase
        .from('notification_logs')
        .insert([
          {
            student_id: studentId,
            guardian_id: guardian.id,
            notification_type: notificationType,
            status: 'sent',
            message: message,
          },
        ]);

      if (logError) {
        logger.error(`Erro ao registrar log de notificação para o guardião ${guardian.id}: ${logError.message}`);
      }
    }

    return true;
  } catch (error: any) {
    logger.error(`Erro ao enviar notificação para todos os responsáveis do aluno ${studentId}: ${error.message}`);
    return false;
  }
};

/**
 * Triggers a Supabase Edge Function with retry logic
 */
export const triggerFunctionWithRetry = async (
  functionName: string, 
  payload: any,
  maxRetries = 3
): Promise<any> => {
  let retries = 0;
  let response: any = null;

  while (retries < maxRetries) {
    try {
      logger.info(`Tentando chamar a função ${functionName} (tentativa ${retries + 1})`);

      response = await supabase.functions.invoke(functionName, {
        body: payload,
      });

      if (response.error) {
        logger.error(`Erro na chamada da função ${functionName}: ${response.error.message}`);

        // Modify the error checking to use optional chaining
        const isRateLimited = 
          response?.error?.message?.includes('rate limit') || 
          response?.error?.message?.includes('429') ||
          (response as any)?.status === 429;

        if (isRateLimited) {
          const waitTime = (retries + 1) * 1000;
          logger.warn(`Limite de taxa atingido. Esperando ${waitTime}ms antes de tentar novamente.`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          retries++;
        } else {
          logger.error(`Erro não relacionado ao limite de taxa. Não tentando novamente.`);
          break;
        }
      } else {
        logger.info(`Função ${functionName} chamada com sucesso.`);
        break;
      }
    } catch (error: any) {
      logger.error(`Exceção ao chamar a função ${functionName}: ${error.message}`);
      retries++;
    }
  }

  if (response?.error) {
    logger.error(`A função ${functionName} falhou após ${maxRetries} tentativas.`);
  }

  return response;
};

/**
 * Sends a notification to a guardian using an Edge Function
 * This is the function that was missing and causing the import error
 */
export interface NotificationResult {
  success: boolean;
  error?: string;
  data?: any;
}

export const sendEdgeFunctionNotification = async (notificationData: any): Promise<NotificationResult> => {
  try {
    logger.info(`Enviando notificação via Edge Function para ${notificationData.guardianEmail}`);
    
    const response = await supabase.functions.invoke('send-guardian-email', {
      body: JSON.stringify(notificationData)
    });
    
    if (response.error) {
      logger.error(`Erro ao enviar notificação via Edge Function: ${response.error.message}`);
      return {
        success: false,
        error: response.error.message
      };
    }
    
    logger.info('Notificação enviada com sucesso via Edge Function');
    return {
      success: true,
      data: response.data
    };
  } catch (error: any) {
    logger.error(`Exceção ao enviar notificação via Edge Function: ${error.message}`);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Sends a fallback notification (email link)
 * This is another function that was missing and causing an import error
 */
export const sendFallbackNotification = async (
  guardianEmail: string,
  guardianName: string,
  studentName: string,
  studentEmail: string,
  latitude: number,
  longitude: number,
  timestamp: string
): Promise<NotificationResult> => {
  try {
    logger.info(`Enviando notificação de fallback para ${guardianEmail}`);
    
    // Create a simple email with location info
    const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
    const subject = `Localização atual de ${studentName}`;
    const body = `
      <h2>Localização de ${studentName}</h2>
      <p>Olá ${guardianName},</p>
      <p>${studentName} compartilhou sua localização com você:</p>
      <p>Coordenadas: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}</p>
      <p>Horário: ${timestamp}</p>
      <p><a href="${mapUrl}" target="_blank">Ver no mapa</a></p>
    `;
    
    const emailPayload = {
      to: guardianEmail,
      subject,
      html: body,
    };
    
    const { error: emailError } = await supabase.functions.invoke('email-service', {
      body: emailPayload,
    });
    
    if (emailError) {
      logger.error(`Erro ao enviar email de fallback para ${guardianEmail}: ${emailError.message}`);
      return {
        success: false,
        error: emailError.message
      };
    }
    
    logger.info(`Email de fallback enviado com sucesso para ${guardianEmail}`);
    return {
      success: true
    };
  } catch (error: any) {
    logger.error(`Exceção ao enviar notificação de fallback: ${error.message}`);
    return {
      success: false,
      error: error.message
    };
  }
};
