
import { LocationNotificationData } from "../types/index.ts";

/**
 * Create location notification email template
 */
export function createLocationNotificationEmail(data: LocationNotificationData): string {
  const { studentName, guardianName, latitude, longitude, timestamp, accuracy, status } = data;

  const date = new Date(timestamp);
  const formattedTime = date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const mapLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e9e9e9; border-radius: 5px;">
      <h2 style="color: #4a6ee0; margin-bottom: 20px;">Atualização de Localização</h2>
      <p>Olá ${guardianName},</p>
      <p>Estamos enviando uma atualização sobre a localização de <strong>${studentName}</strong>.</p>
      
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Horário:</strong> ${formattedTime}</p>
        <p><strong>Coordenadas:</strong> ${latitude.toFixed(6)}, ${longitude.toFixed(6)}</p>
        ${accuracy ? `<p><strong>Precisão:</strong> ${Math.round(accuracy)} metros</p>` : ''}
        ${status ? `<p><strong>Status:</strong> ${status === 'unknown' ? 'Desconhecido' : status === 'moving' ? 'Em movimento' : 'Parado'}</p>` : ''}
      </div>
      
      <p>Você pode visualizar a localização no mapa clicando no botão abaixo:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${mapLink}" target="_blank" style="background-color: #4a6ee0; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Ver no Mapa</a>
      </div>
      
      <p style="color: #666; font-size: 0.8em; margin-top: 30px; border-top: 1px solid #e9e9e9; padding-top: 15px;">
        Esta é uma mensagem automática do Sistema Monitore. Por favor, não responda a este email.
      </p>
    </div>
  `;
}
