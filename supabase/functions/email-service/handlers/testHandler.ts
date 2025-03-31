
import { TestEmailRequest } from "../types/index.ts";
import { corsHeaders } from "../../_shared/cors.ts";
import { Resend } from "npm:resend@2.0.0";
import { sendEmail } from "../services/resendService.ts";

/**
 * Handles test email requests
 */
export const handleTestEmail = async (req: Request, resend: Resend): Promise<Response> => {
  try {
    console.log('Handling test email request');
    
    // Extract email from request
    let requestData: TestEmailRequest;
    try {
      requestData = await req.json();
    } catch (error) {
      console.error('Error parsing request body:', error);
      requestData = { email: "test@example.com" };
    }
    
    const email = requestData.email || "test@example.com";
    const includeDebug = requestData.includeDebug || false;
    
    console.log(`Sending test email to ${email}, debug: ${includeDebug}`);
    
    // Create a timestamp for uniqueness
    const timestamp = new Date().toLocaleString('pt-BR');
    
    // Create debug info if requested
    const debugInfo = includeDebug ? `
      <div style="margin-top: 30px; padding: 15px; background-color: #f8f9fa; border-radius: 5px; border-left: 4px solid #6c757d;">
        <h3 style="margin-top: 0; color: #343a40;">Informações de Debug</h3>
        <ul style="margin-bottom: 0;">
          <li>API Key configurada: ${!!Deno.env.get('RESEND_API_KEY')}</li>
          <li>Timestamp: ${new Date().toISOString()}</li>
          <li>API Versão: email-service/1.0</li>
        </ul>
      </div>
    ` : '';
    
    // Create test email content
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px; background-color: #ffffff;">
        <h1 style="color: #4F46E5; text-align: center; margin-bottom: 30px;">Sistema Monitore</h1>
        
        <div style="background-color: #f5f8ff; border-radius: 5px; padding: 20px; margin-bottom: 30px;">
          <h2 style="color: #3730a3; margin-top: 0;">Teste de Email</h2>
          <p>Este é um email de teste enviado pelo <strong>Sistema Monitore</strong> para verificar a funcionalidade do sistema de envio de emails.</p>
          <p style="margin-bottom: 0;">Se você está vendo este email, o serviço de notificações está <strong>funcionando corretamente</strong>.</p>
        </div>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 30px;">
          <p style="margin: 0;"><strong>Detalhes do Teste:</strong></p>
          <p style="margin: 10px 0 0 0;">Data/Hora: ${timestamp}</p>
        </div>
        
        <p style="color: #666;">Este é um email automático, por favor não responda.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #999; font-size: 12px; text-align: center;">
          Sistema Monitore - Teste de Email
        </p>
        ${debugInfo}
      </div>
    `;
    
    const text = `
      Sistema Monitore
      
      Teste de Email
      
      Este é um email de teste enviado pelo Sistema Monitore para verificar a funcionalidade do sistema de envio de emails.
      
      Se você está vendo este email, o serviço de notificações está funcionando corretamente.
      
      Detalhes do Teste:
      Data/Hora: ${timestamp}
      
      Este é um email automático, por favor não responda.
    `;
    
    // Send the test email
    const result = await sendEmail(
      resend,
      email,
      `Teste do Sistema Monitore - ${timestamp}`,
      html,
      text
    );
    
    if (!result.success) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to send test email',
          details: result.error
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        emailId: result.data?.id,
        sentTo: email,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error in test email handler:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Failed to process test email request',
        details: error instanceof Error ? error.message : String(error)
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
};
