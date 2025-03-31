
// Email templates for the test email function

// Regular SDK email template
export const generateSdkEmailTemplate = (timestamp: string) => {
  const subject = `Teste do Sistema Monitore - ${timestamp}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h1 style="color: #4a6ee0;">Sistema Monitore - Teste de Email (SDK)</h1>
      <p>Este é um email de teste enviado em <strong>${timestamp}</strong> usando o Resend SDK.</p>
      <p>Se você está recebendo esta mensagem, significa que o sistema de envio de emails está funcionando corretamente.</p>
      <hr style="border: 0; height: 1px; background-color: #e0e0e0; margin: 20px 0;" />
      <p style="font-size: 12px; color: #666;">
        Este é apenas um teste. Por favor, ignore esta mensagem.
      </p>
    </div>
  `;
  
  return { subject, html };
};

// Direct API email template
export const generateDirectApiEmailTemplate = (timestamp: string) => {
  const subject = `Teste do Sistema Monitore (API Direta) - ${timestamp}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h1 style="color: #4a6ee0;">Sistema Monitore - Teste de Email (API Direta)</h1>
      <p>Este é um email de teste enviado em <strong>${timestamp}</strong> usando a API direta do Resend.</p>
      <p>Se você está recebendo esta mensagem, significa que o sistema de envio de emails está funcionando corretamente, mesmo como fallback.</p>
      <hr style="border: 0; height: 1px; background-color: #e0e0e0; margin: 20px 0;" />
      <p style="font-size: 12px; color: #666;">
        Este é apenas um teste alternativo. Por favor, ignore esta mensagem.
      </p>
    </div>
  `;
  
  return { subject, html };
};
