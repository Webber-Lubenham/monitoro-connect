
import { TestEmailData } from "../types/index.ts";

/**
 * Create test email template
 */
export function createTestEmail(data: TestEmailData): string {
  const { email, testType, includeDiagnostics } = data;
  const timestamp = new Date().toISOString();

  let diagnostics = '';
  if (includeDiagnostics) {
    diagnostics = `
      <div style="background-color: #f8f9fa; padding: 15px; border-radius: 4px; margin: 20px 0;">
        <p><strong>Informações técnicas:</strong></p>
        <ul>
          <li>Timestamp: ${timestamp}</li>
          <li>Destinatário: ${email}</li>
          <li>Enviado via: Edge Function "email-service"</li>
          <li>Serviço: Resend API</li>
          <li>Test Type: ${testType}</li>
        </ul>
      </div>
    `;
  }

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 5px;">
      <h1 style="color: #4a6ee0;">Teste de Email</h1>
      
      <p>Este é um email de teste do Sistema Monitore.</p>
      
      <p>Se você está vendo esta mensagem, o sistema de envio de emails está funcionando corretamente.</p>
      
      ${diagnostics}
      
      <p style="color: #666; font-size: 0.8em; margin-top: 30px;">
        Esta é uma mensagem automática de teste. Por favor, não responda a este email.
      </p>
    </div>
  `;
}
