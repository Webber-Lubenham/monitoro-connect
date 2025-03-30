
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { Resend } from 'npm:resend@2.0.0';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

// Updated CORS headers to include x-application-name
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-application-name',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

interface TestEmailRequest {
  email: string;
}

const handler = async (req: Request) => {
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    console.log('Test email function invoked');
    
    // Check for API key
    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set in environment variables');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Email service configuration error - API key missing' 
        }),
        { 
          status: 500, 
          headers: corsHeaders
        }
      );
    }

    // Initialize Resend client
    const resend = new Resend(RESEND_API_KEY);
    
    // Extract email from request
    let requestData: TestEmailRequest;
    try {
      const requestText = await req.text();
      console.log('Raw request body:', requestText);
      requestData = requestText ? JSON.parse(requestText) : { email: "frankwebber33@hotmail.com" };
    } catch (error) {
      console.error('Error parsing request:', error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid request format'
        }),
        { 
          status: 400, 
          headers: corsHeaders
        }
      );
    }
    
    const email = requestData.email || "frankwebber33@hotmail.com";
    
    if (!email || !email.includes('@')) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid or missing email address' 
        }),
        { 
          status: 400, 
          headers: corsHeaders
        }
      );
    }
    
    console.log(`Sending test email to ${email}`);
    
    // Timestamp for uniqueness
    const timestamp = new Date().toLocaleString('pt-BR');
    
    // Send test email
    const { data, error } = await resend.emails.send({
      from: 'Sistema Monitore <notifications@sistema-monitore.com.br>',
      to: email,
      subject: `Teste do Sistema Monitore - ${timestamp}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h1 style="color: #4a6ee0;">Sistema Monitore - Teste de Email</h1>
          <p>Este é um email de teste enviado em <strong>${timestamp}</strong>.</p>
          <p>Se você está recebendo esta mensagem, significa que o sistema de envio de emails está funcionando corretamente.</p>
          <hr style="border: 0; height: 1px; background-color: #e0e0e0; margin: 20px 0;" />
          <p style="font-size: 12px; color: #666;">
            Este é apenas um teste. Por favor, ignore esta mensagem.
          </p>
        </div>
      `,
      text: `
        Sistema Monitore - Teste de Email
        
        Este é um email de teste enviado em ${timestamp}.
        
        Se você está recebendo esta mensagem, significa que o sistema de envio de emails está funcionando corretamente.
        
        Este é apenas um teste. Por favor, ignore esta mensagem.
      `
    });
    
    if (error) {
      console.error('Error sending test email:', error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: error.message || 'Failed to send test email',
          details: error
        }),
        { 
          status: 500, 
          headers: corsHeaders
        }
      );
    }
    
    console.log('Test email sent successfully:', data);
    return new Response(
      JSON.stringify({ 
        success: true, 
        messageId: data?.id || 'unknown',
        recipient: email,
        timestamp
      }),
      { 
        status: 200, 
        headers: corsHeaders
      }
    );
    
  } catch (error) {
    console.error('Unexpected error in test-email function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : String(error)
      }),
      { 
        status: 500, 
        headers: corsHeaders
      }
    );
  }
};

serve(handler);
