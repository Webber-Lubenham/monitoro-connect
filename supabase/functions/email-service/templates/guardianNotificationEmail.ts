
import { GuardianNotificationData } from "../types/index.ts";

/**
 * Create a simple guardian notification email
 */
export function createGuardianNotificationEmail(data: GuardianNotificationData): string {
  const { guardianName, studentName } = data;
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2>Atualização do Sistema Monitore</h2>
      <p>Prezado(a) ${guardianName || "Responsável"},</p>
      <p>Este é um email de notificação sobre a localização de ${studentName}.</p>
      <p>A localização foi atualizada em ${new Date().toLocaleString('pt-BR')}</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://sistema-monitore.com.br/dashboard" style="background-color: #4a6ee0; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
          Acessar Dashboard
        </a>
      </div>
      
      <p style="color: #666; font-size: 0.8em; margin-top: 20px;">
        Esta é uma mensagem automática do Sistema Monitore. Por favor, não responda a este email.
      </p>
    </div>
  `;
}
