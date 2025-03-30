
import { GuardianInvitationData } from "../types/index.ts";

/**
 * Create guardian invitation email template
 */
export function createGuardianInvitationEmail(data: GuardianInvitationData): string {
  const { guardianName, studentName, tempPassword, confirmationUrl } = data;
  
  console.log("Creating guardian invitation email for:", guardianName);
  console.log("Student name:", studentName);
  console.log("Has temp password:", !!tempPassword);
  console.log("Has confirmation URL:", !!confirmationUrl);

  // Use the confirmation URL if provided, otherwise use a generic one
  const inviteLink = confirmationUrl || "https://sistema-monitore.com.br/accept-invitation";

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e9e9e9; border-radius: 5px;">
      <h2 style="color: #4a6ee0; margin-bottom: 20px;">Convite para o Sistema Monitore</h2>
      <p>Olá ${guardianName},</p>
      <p>Você foi convidado para ser responsável de <strong>${studentName}</strong> no Sistema Monitore.</p>
      
      ${tempPassword ? `
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Senha temporária:</strong> ${tempPassword}</p>
        <p>Use esta senha temporária para acessar sua conta pela primeira vez.</p>
      </div>
      ` : ''}
      
      <p>Clique no link abaixo para aceitar o convite:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${inviteLink}" style="background-color: #4a6ee0; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Aceitar Convite</a>
      </div>
      
      <p style="color: #666; font-size: 0.8em; margin-top: 30px; border-top: 1px solid #e9e9e9; padding-top: 15px;">
        Esta é uma mensagem automática do Sistema Monitore. Por favor, não responda a este email.
      </p>
    </div>
  `;
}
