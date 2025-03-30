
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
// @deno-types="npm:@types/resend"
import { Resend } from 'npm:resend';

// Configuração de CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-application-name',
  'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
  'Content-Type': 'application/json'
};

// Get Resend API key from environment variable
const resendApiKey = Deno.env.get('RESEND_API_KEY');
console.log(`RESEND_API_KEY configured: ${!!resendApiKey}`);
if (resendApiKey) {
  console.log(`API key starts with: ${resendApiKey.substring(0, 5)}`);
  console.log(`API key length: ${resendApiKey.length}`);
}

// Initialize Resend with API key
const resend = new Resend(resendApiKey);

const handler = async (req: Request) => {
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    console.log('Test location email function invoked:', req.method);
    
    // Add API key validation
    if (!resendApiKey) {
      console.error('RESEND_API_KEY is not set');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Resend API key not configured',
          config_error: true
        }),
        { 
          status: 500, 
          headers: corsHeaders
        }
      );
    }

    // In case of GET request, return API status
    if (req.method === 'GET') {
      // Test Resend connectivity without sending email
      try {
        const domains = await resend.domains.list();
        return new Response(
          JSON.stringify({
            success: true,
            api_configured: true,
            api_responsive: true,
            domains: domains.data || [],
            api_key_starts_with: resendApiKey.substring(0, 3)
          }),
          { headers: corsHeaders }
        );
      } catch (connectError) {
        return new Response(
          JSON.stringify({
            success: false,
            api_configured: true, 
            api_responsive: false,
            error: connectError instanceof Error ? connectError.message : String(connectError)
          }),
          { 
            status: 500,
            headers: corsHeaders
          }
        );
      }
    }

    // Parse request to get email address and other parameters
    let email = 'frankwebber33@hotmail.com'; // Default test email
    let includeDebugInfo = false;
    let usePlainFormatter = false;
    
    try {
      // Clone the request for text and json parsing
      const reqClone = req.clone();
      const bodyText = await reqClone.text();
      console.log('Raw request body:', bodyText);
      
      if (bodyText && bodyText.trim()) {
        try {
          // Try to parse as JSON
          const bodyData = JSON.parse(bodyText);
          if (bodyData && typeof bodyData === 'object') {
            if (bodyData.email) email = bodyData.email;
            if (bodyData.debug) includeDebugInfo = true;
            if (bodyData.plain) usePlainFormatter = true;
          }
        } catch (parseError) {
          console.log('JSON parse error (trying URL format):', parseError);
          
          // Try to parse as URL encoded form
          try {
            const formData = new URLSearchParams(bodyText);
            const emailParam = formData.get('email');
            if (emailParam) email = emailParam;
            if (formData.get('debug') === 'true') includeDebugInfo = true;
            if (formData.get('plain') === 'true') usePlainFormatter = true;
          } catch (formError) {
            console.log('Form parse error:', formError);
          }
        }
      }
    } catch (e) {
      console.log('Error parsing request:', e);
    }
    
    console.log(`Sending test email to ${email}`);
    console.log(`Debug info: ${includeDebugInfo}, Plain formatter: ${usePlainFormatter}`);
    
    // Create a timestamp for uniqueness
    const timestamp = new Date().toLocaleString('pt-BR');
    const messageId = `monitore-test-location-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
    
    // Create email content with additional debug info
    const debugInfo = includeDebugInfo ? `
      <div style="margin-top: 30px; padding: 15px; background-color: #f8f9fa; border-radius: 5px; border-left: 4px solid #6c757d;">
        <h3 style="margin-top: 0; color: #343a40;">Informações de Debug</h3>
        <ul style="margin-bottom: 0;">
          <li>API Key configurada: ${!!resendApiKey}</li>
          <li>Resend API Key (primeiros 3 chars): ${resendApiKey ? resendApiKey.substring(0, 3) : 'N/A'}</li>
          <li>Comprimento da API Key: ${resendApiKey ? resendApiKey.length : 0}</li>
          <li>ID da mensagem: ${messageId}</li>
          <li>Data/hora do servidor: ${new Date().toISOString()}</li>
        </ul>
      </div>
    ` : '';
    
    // Choose the email formatter
    let htmlContent, textContent;
    
    if (usePlainFormatter) {
      // Plain minimal email for testing basic functionality
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #4F46E5;">Teste Básico de Email</h2>
          <p>Este é um email de teste básico para verificar a funcionalidade do sistema de envio de emails.</p>
          <p>Se você estiver vendo este email, significa que o sistema está funcionando corretamente.</p>
          <p>Enviado em: ${timestamp}</p>
          ${debugInfo}
        </div>
      `;

      textContent = `
        Teste Básico de Email
        
        Este é um email de teste básico para verificar a funcionalidade do sistema de envio de emails.
        
        Se você estiver vendo este email, significa que o sistema está funcionando corretamente.
        
        Enviado em: ${timestamp}
      `;
    } else {
      // More styled email for regular testing
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px; background-color: #ffffff;">
          <h1 style="color: #4F46E5; text-align: center; margin-bottom: 30px;">Sistema Monitore</h1>
          
          <div style="background-color: #f5f8ff; border-radius: 5px; padding: 20px; margin-bottom: 30px;">
            <h2 style="color: #3730a3; margin-top: 0;">Teste de Email de Localização</h2>
            <p>Este é um email de teste enviado pelo <strong>Sistema Monitore</strong> para verificar a funcionalidade do sistema de envio de emails.</p>
            <p style="margin-bottom: 0;">Se você está vendo este email, o serviço de notificações está <strong>funcionando corretamente</strong>.</p>
          </div>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 30px;">
            <p style="margin: 0;"><strong>Detalhes do Teste:</strong></p>
            <p style="margin: 10px 0 0 0;">Data/Hora: ${timestamp}</p>
            <p style="margin: 5px 0 0 0;">ID de Rastreamento: ${messageId}</p>
          </div>
          
          <p style="color: #666;">Este é um email automático, por favor não responda.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">
            Sistema Monitore - Teste de Email de Localização
          </p>
          ${debugInfo}
        </div>
      `;

      textContent = `
        Sistema Monitore
        
        Teste de Email de Localização
        
        Este é um email de teste enviado pelo Sistema Monitore para verificar a funcionalidade do sistema de envio de emails.
        
        Se você está vendo este email, o serviço de notificações está funcionando corretamente.
        
        Detalhes do Teste:
        Data/Hora: ${timestamp}
        ID de Rastreamento: ${messageId}
        
        Este é um email automático, por favor não responda.
      `;
    }
    
    // Add detailed logging for transparency
    console.log('Sending email with the following configuration:');
    console.log('- To:', email);
    console.log('- Subject:', `Teste do Sistema Monitore - ${timestamp}`);
    console.log('- From:', 'Sistema Monitore <notifications@sistema-monitore.com.br>');
    console.log('- Message ID:', messageId);
    console.log('- HTML Content Length:', htmlContent.length);
    
    // Send email via Resend with additional headers and options
    try {
      const { data, error } = await resend.emails.send({
        from: 'Sistema Monitore <notifications@sistema-monitore.com.br>',
        to: [email],
        subject: `Teste do Sistema Monitore - ${timestamp}`,
        html: htmlContent,
        text: textContent,
        // Add metadata for tracking and filtering
        tags: [
          {
            name: 'system',
            value: 'monitore'
          },
          {
            name: 'message_id',
            value: messageId
          },
          {
            name: 'type',
            value: 'test'
          }
        ],
        // Add custom headers for better deliverability
        headers: {
          'X-Entity-Ref-ID': messageId,
          'X-System-Generated': 'true',
          'X-Message-Source': 'sistema-monitore',
          'X-Mailer': 'Monitore-EmailSystem-v1.3',
          'X-Priority': '3'  // Normal priority
        }
      });

      if (error) {
        console.error('Error from Resend API:', error);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: error.message || 'Failed to send test email',
            error_code: error.statusCode || 500,
            details: error,
            request_info: {
              to: email,
              message_id: messageId,
              timestamp: timestamp
            }
          }),
          { 
            status: error.statusCode || 400, 
            headers: corsHeaders
          }
        );
      }

      console.log('Test email sent successfully:', data);
      return new Response(
        JSON.stringify({ 
          success: true, 
          id: data?.id,
          messageId,
          timestamp: new Date().toISOString()
        }),
        { 
          status: 200, 
          headers: corsHeaders
        }
      );
    } catch (resendError) {
      console.error('Exception when calling Resend API:', resendError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: resendError instanceof Error ? resendError.message : 'Unknown error calling Resend API',
          details: resendError,
          stack: resendError instanceof Error ? resendError.stack : null
        }),
        { 
          status: 500, 
          headers: corsHeaders
        }
      );
    }
  } catch (error) {
    console.error('Unexpected error in test-location-email function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : null
      }),
      { 
        status: 500, 
        headers: corsHeaders
      }
    );
  }
};

serve(handler);
