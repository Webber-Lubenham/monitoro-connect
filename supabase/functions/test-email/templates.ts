
import { getCurrentTime } from "./config.ts";

type EmailTemplateProps = {
  email: string;
  testType: string;
  currentTime: string;
  appDomain: string;
  includeDiagnostics?: boolean;
  domain?: string;
  fromEmail?: string;
  apiKey?: string;
};

// Generate email content for signup tests
export const generateSignupTestEmail = (props: EmailTemplateProps) => {
  const { email, testType, currentTime, appDomain } = props;
  const confirmationUrl = `https://${appDomain}/confirm?token=SAMPLE_TOKEN&type=signup&email=${encodeURIComponent(email)}`;
  
  return {
    subject: "Confirme seu cadastro - Sistema Sentinel Hub",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #4a6ee0;">Sistema Sentinel Hub</h1>
          <p style="font-size: 18px; color: #333;">Confirmação de Cadastro</p>
        </div>
        
        <p>Olá!</p>
        <p>Obrigado por se cadastrar no Sistema Sentinel Hub.</p>
        <p>Para ativar sua conta e começar a usar o sistema, por favor, clique no botão abaixo:</p>
        
        <div style="margin: 30px 0; padding: 15px; background-color: #f5f5f5; border-radius: 5px; text-align: center;">
          <a href="${confirmationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #4a6ee0; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
            Confirmar meu email
          </a>
        </div>
        
        <p>Ou copie e cole este link no seu navegador:</p>
        <p style="word-break: break-all; background-color: #f5f5f5; padding: 10px; border-radius: 4px; font-size: 14px;">
          ${confirmationUrl}
        </p>
        
        <p style="margin-top: 20px; font-size: 14px; color: #666;">
          Tipo de teste: ${testType}<br>
          Data e hora: ${currentTime}<br>
          Email enviado para: ${email}
        </p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; color: #718096; font-size: 12px;">
          <p>Este é um email automático de teste. Por favor, não responda a esta mensagem.</p>
          <p>Sistema Sentinel Hub &copy; ${new Date().getFullYear()}</p>
        </div>
      </div>
    `,
    text: `
      Sistema Sentinel Hub - Confirmação de Cadastro
      
      Olá!
      
      Obrigado por se cadastrar no Sistema Sentinel Hub.
      
      Para ativar sua conta e começar a usar o sistema, por favor, acesse o link abaixo:
      
      ${confirmationUrl}
      
      Tipo de teste: ${testType}
      Data e hora: ${currentTime}
      Email enviado para: ${email}
      
      Este é um email automático de teste. Por favor, não responda a esta mensagem.
      Sistema Sentinel Hub
    `
  };
};

// Generate email content for general tests
export const generateGeneralTestEmail = (props: EmailTemplateProps) => {
  const { email, testType, currentTime } = props;
  
  return {
    subject: "Teste de Email - Sistema Sentinel Hub",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h1 style="color: #4a6ee0;">Sistema Sentinel Hub</h1>
        <p>Este é um email de teste do Sistema Sentinel Hub para verificar a entrega de emails.</p>
        
        <p>Se você está recebendo este email, significa que o sistema de notificação por email está funcionando corretamente.</p>
        
        <div style="margin: 20px 0; padding: 15px; background-color: #f5f5f5; border-radius: 5px;">
          <h3 style="margin-top: 0;">Informações do Teste:</h3>
          <p>Tipo de teste: ${testType}</p>
          <p>Data e hora: ${currentTime}</p>
          <p>Email enviado para: ${email}</p>
        </div>
        
        <p>Obrigado por usar o Sistema Sentinel Hub!</p>
      </div>
    `,
    text: `
      Teste de Email - Sistema Sentinel Hub
      
      Este é um email de teste do Sistema Sentinel Hub para verificar a entrega de emails.
      
      Se você está recebendo este email, significa que o sistema de notificação por email está funcionando corretamente.
      
      Informações do Teste:
      Tipo de teste: ${testType}
      Data e hora: ${currentTime}
      Email enviado para: ${email}
      
      Obrigado por usar o Sistema Sentinel Hub!
    `
  };
};

// Add diagnostic information to email template
export const addDiagnostics = (html: string, props: EmailTemplateProps) => {
  const { domain, appDomain, fromEmail, apiKey } = props;
  
  const diagnosticsHtml = `
    <div style="margin-top: 30px; padding: 15px; background-color: #f8f9fa; border-radius: 5px; border-left: 4px solid #4a6ee0;">
      <h3 style="margin-top: 0; color: #4a6ee0;">Diagnóstico do Sistema:</h3>
      <ul style="padding-left: 20px;">
        <li>Domínio: ${domain}</li>
        <li>Domínio do app: ${appDomain}</li>
        <li>Remetente: ${fromEmail}</li>
        <li>API Resend: ${apiKey ? "Configurada" : "Não configurada"}</li>
        <li>Timestamp: ${Date.now()}</li>
      </ul>
    </div>
  `;
  
  return html.replace('</div>', `${diagnosticsHtml}</div>`);
};

// Main function to generate email content based on test type
export const generateEmailContent = (props: EmailTemplateProps) => {
  const { testType, includeDiagnostics } = props;
  
  let emailContent;
  
  if (testType === "signup_test") {
    emailContent = generateSignupTestEmail(props);
  } else {
    emailContent = generateGeneralTestEmail(props);
  }
  
  // Add diagnostics if requested
  if (includeDiagnostics && emailContent.html) {
    emailContent.html = addDiagnostics(emailContent.html, props);
  }
  
  return emailContent;
};
