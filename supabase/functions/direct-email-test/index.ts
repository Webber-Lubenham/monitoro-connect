
import { serve } from "https://deno.land/std@0.192.0/http/server.ts"
import { Resend } from "npm:resend@2.0.0"

const resendKey = Deno.env.get('RESEND_API_KEY')
const resend = new Resend(resendKey)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get the email from the request or use a default email
    const { email = "frankwebber33@hotmail.com" } = await req.json();
    
    console.log(`Running direct email test to: ${email}`);
    
    // Create a simple test email
    const { data, error } = await resend.emails.send({
      from: 'Sistema Monitore <notifications@sistema-monitore.com.br>',
      to: email,
      subject: 'Teste Direto do Sistema Monitore',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 5px;">
          <h1 style="color: #4a6ee0;">Teste de Email</h1>
          
          <p>Este é um email de teste direto do Sistema Monitore.</p>
          
          <p>Se você está vendo esta mensagem, o sistema de envio de emails está funcionando corretamente.</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <p><strong>Informações técnicas:</strong></p>
            <ul>
              <li>Timestamp: ${new Date().toISOString()}</li>
              <li>Destinatário: ${email}</li>
              <li>Enviado via: Edge Function "direct-email-test"</li>
              <li>Serviço: Resend API</li>
            </ul>
          </div>
          
          <p style="color: #666; font-size: 0.8em; margin-top: 30px;">
            Esta é uma mensagem automática de teste. Por favor, não responda a este email.
          </p>
        </div>
      `
    });

    if (error) {
      console.error('Error sending test email:', error);
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Test email sent successfully:', data);
    
    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Error in direct email test function:', err);
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
