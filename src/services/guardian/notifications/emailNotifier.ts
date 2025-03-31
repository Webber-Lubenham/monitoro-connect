
import { supabase } from '@/integrations/supabase/client';
import { logOperation } from '../../base/baseService';
import { sendEmailViaEdgeFunction } from '../../email/core/edgeFunctionClient';
import { NotificationLocationData, NotificationOptions, NotificationResult } from './notificationTypes';
import { createMapLink, formatNotificationTimestamp, getStudentNameWithFallback } from './notificationUtils';

/**
 * Notify all guardians via email about student location
 */
export const notifyGuardiansViaEmail = async (
  studentId: string,
  location: NotificationLocationData,
  options: NotificationOptions = {}
): Promise<boolean> => {
  try {
    const isEmergency = options.isEmergency || false;
    logOperation(`Notificando responsáveis via email para o aluno ID: ${studentId} (Emergência: ${isEmergency})`);
    
    // Get student name if not provided
    const studentName = options.studentName || await getStudentNameWithFallback(studentId);
    logOperation(`Nome do aluno: ${studentName || 'Não encontrado'}`);
    
    // Get all guardians for this student
    const { data: guardians, error: guardiansError } = await supabase
      .from('guardians')
      .select('*')
      .eq('student_id', studentId);
    
    if (guardiansError) {
      logOperation(`Erro ao buscar responsáveis: ${guardiansError.message}`);
      throw guardiansError;
    }
    
    if (!guardians || guardians.length === 0) {
      logOperation('Nenhum responsável encontrado para notificar via email');
      return false;
    }
    
    logOperation(`Encontrados ${guardians.length} responsáveis para notificar`);
    
    // Send notification to each guardian
    const timestamp = location.timestamp || new Date().toISOString();
    let anySuccessful = false;
    
    for (const guardian of guardians) {
      try {
        logOperation(`Preparando email para responsável: ${guardian.email} (${guardian.nome})`);
        
        // Try sending via dedicated edge function first
        try {
          const response = await supabase.functions.invoke('send-guardian-email', {
            body: JSON.stringify({
              studentName: studentName || 'Aluno',
              guardianEmail: guardian.email,
              guardianName: guardian.nome || 'Responsável',
              latitude: location.latitude,
              longitude: location.longitude,
              timestamp: timestamp,
              accuracy: location.accuracy || 0,
              isEmergency
            })
          });
          
          if (!response.error) {
            logOperation(`Email enviado com sucesso para ${guardian.email} via send-guardian-email`);
            anySuccessful = true;
            continue; // Move to next guardian
          } else {
            logOperation(`Falha ao usar send-guardian-email: ${response.error.message}`);
            // Continue to alternative method
          }
        } catch (edgeError) {
          logOperation(`Exceção em send-guardian-email: ${edgeError instanceof Error ? edgeError.message : String(edgeError)}`);
          // Continue to alternative method
        }
        
        // Fallback to manual email sending
        const emailContent = generateGuardianEmailContent(
          studentName,
          guardian.nome,
          location,
          isEmergency
        );
        
        // Send email with correct parameters - this was incorrectly formatted before
        const emailSuccess = await sendEmailViaEdgeFunction({
          to: guardian.email,
          subject: isEmergency 
            ? `⚠️ ALERTA DE EMERGÊNCIA: ${studentName}`
            : `Localização atual de ${studentName} - Sistema Monitore`,
          html: emailContent.html,
          text: emailContent.text,
          from: 'Sistema Monitore <notifications@sistema-monitore.com.br>'
        });
        
        if (emailSuccess.success) {
          logOperation(`Email enviado com sucesso para responsável: ${guardian.email}`);
          anySuccessful = true;
        } else {
          logOperation(`Falha ao enviar email para: ${guardian.email} - ${emailSuccess.message || emailSuccess.error}`);
        }
      } catch (guardianError) {
        // Log the error but continue with other guardians
        const errorMessage = guardianError instanceof Error ? guardianError.message : String(guardianError);
        logOperation(`Exceção para ${guardian.email}: ${errorMessage}`);
        console.error(`Error sending notification to ${guardian.email}:`, guardianError);
      }
    }
    
    logOperation(`Notificação completa. Sucesso: ${anySuccessful ? 'Sim' : 'Não'}`);
    return anySuccessful;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logOperation(`Erro global em notifyGuardiansViaEmail: ${errorMessage}`);
    console.error('Error in notifyGuardiansViaEmail:', error);
    return false;
  }
};

/**
 * Generate email content for guardian notifications
 */
export const generateGuardianEmailContent = (
  studentName: string,
  guardianName: string,
  location: NotificationLocationData,
  isEmergency: boolean
): { html: string; text: string } => {
  // Format the timestamp
  const formattedTime = formatNotificationTimestamp(location.timestamp);
  
  // Generate Google Maps link
  const mapLink = createMapLink(location);
  
  // HTML email content
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: ${isEmergency ? '#e53935' : '#4F46E5'};">${isEmergency ? '⚠️ ALERTA DE EMERGÊNCIA' : `Localização atual de ${studentName}`}</h2>
      <p>Olá ${guardianName || 'Responsável'},</p>
      <p>${isEmergency 
          ? `<strong>${studentName}</strong> acionou um <strong style="color: #e53935;">alerta de emergência</strong>.` 
          : `${studentName} compartilhou sua localização atual com você:`}
      </p>
      
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 0; font-weight: bold;">Localização: Lat: ${location.latitude.toFixed(6)}, Long: ${location.longitude.toFixed(6)}</p>
          <p style="margin: 10px 0 0 0;">Horário: ${formattedTime}</p>
          ${location.accuracy ? `<p style="margin: 10px 0 0 0;">Precisão: ${Math.round(location.accuracy)} metros</p>` : ''}
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
          <a href="${mapLink}" target="_blank" style="background-color: ${isEmergency ? '#e53935' : '#4F46E5'}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Ver no mapa</a>
      </div>
      
      <p>Você recebeu este email porque está cadastrado como responsável de ${studentName} no Sistema Monitore.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
      <p style="color: #999; font-size: 12px;">Este é um email automático, por favor não responda.</p>
    </div>
  `;

  // Plain text alternative
  const textContent = `
    ${isEmergency ? 'ALERTA DE EMERGÊNCIA' : `Localização atual de ${studentName}`}
    
    Olá ${guardianName || 'Responsável'},
    
    ${isEmergency 
        ? `${studentName} acionou um alerta de emergência.` 
        : `${studentName} compartilhou sua localização atual com você.`}
    
    Localização: Lat: ${location.latitude.toFixed(6)}, Long: ${location.longitude.toFixed(6)}
    Horário: ${formattedTime}
    ${location.accuracy ? `Precisão: ${Math.round(location.accuracy)} metros` : ''}
    
    Veja a localização: ${mapLink}
    
    Você recebeu este email porque está cadastrado como responsável de ${studentName} no Sistema Monitore.
    
    Este é um email automático, por favor não responda.
  `;

  return { html: htmlContent, text: textContent };
};
