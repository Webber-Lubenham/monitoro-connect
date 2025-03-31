
import { formatTimestamp } from "./utils.ts";

/**
 * Generates HTML and text content for location sharing emails
 */
export const generateLocationEmailContent = (
  studentName: string,
  guardianName: string,
  timestamp: string,
  latitude: number,
  longitude: number,
  accuracy: number | undefined,
  isEmergency: boolean,
  messageId: string
): { html: string; text: string } => {
  // Format the timestamp
  const formattedTime = formatTimestamp(timestamp);
  
  // Generate Google Maps link
  const mapLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
  
  // HTML content - simpler design similar to the previous template
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: ${isEmergency ? '#e53935' : '#4F46E5'};">${isEmergency ? '⚠️ ALERTA DE EMERGÊNCIA' : `Localização atual de ${studentName}`}</h2>
      <p>Olá ${guardianName || 'Responsável'},</p>
      <p>${isEmergency 
          ? `<strong>${studentName}</strong> acionou um <strong style="color: #e53935;">alerta de emergência</strong>.` 
          : `${studentName} compartilhou sua localização atual com você:`}
      </p>
      
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p style="margin: 0; font-weight: bold;">Localização: Lat: ${latitude.toFixed(6)}, Long: ${longitude.toFixed(6)}</p>
        <p style="margin: 10px 0 0 0;">Horário: ${formattedTime}</p>
        ${accuracy ? `<p style="margin: 10px 0 0 0;">Precisão: ${Math.round(accuracy)} metros</p>` : ''}
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
    
    Localização: Lat: ${latitude.toFixed(6)}, Long: ${longitude.toFixed(6)}
    Horário: ${formattedTime}
    ${accuracy ? `Precisão: ${Math.round(accuracy)} metros` : ''}
    
    Veja a localização: ${mapLink}
    
    Você recebeu este email porque está cadastrado como responsável de ${studentName} no Sistema Monitore.
    
    Este é um email automático, por favor não responda.
  `;

  return { html: htmlContent, text: textContent };
};

/**
 * Generates email subject for location notifications
 */
export const generateEmailSubject = (
  studentName: string,
  isEmergency: boolean
): string => {
  return isEmergency 
    ? `⚠️ ALERTA DE EMERGÊNCIA: ${studentName}`
    : `Localização atual de ${studentName} - Sistema Monitore`;
};
