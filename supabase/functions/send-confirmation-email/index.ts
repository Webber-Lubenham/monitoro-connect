
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json"
};

interface ConfirmationEmailParams {
  email: string;
  confirmationUrl: string;
  userRole: string;
}

const handler = async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    console.log("Starting send-confirmation-email function");
    
    // Get Resend API key
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error("RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({ 
          success: false,
          error: "Email service not properly configured",
          details: "Missing API key" 
        }),
        {
          status: 500,
          headers: corsHeaders
        }
      );
    }

    console.log("RESEND_API_KEY is available");
    
    // Initialize Resend client
    const resend = new Resend(resendApiKey);

    // Parse request body - handling different payload formats
    let params: ConfirmationEmailParams;
    try {
      // Get the request body as text first for debugging
      const requestText = await req.text();
      console.log("Raw request body:", requestText);
      
      // Try parsing as JSON
      try {
        params = JSON.parse(requestText);
      } catch (e) {
        console.log("Failed to parse as JSON, trying alternative formats:", e);
        // If JSON parsing fails, check if the data is already an object
        if (typeof requestText === 'object') {
          params = requestText as unknown as ConfirmationEmailParams;
        } else {
          // Try to extract parameters from form-encoded data or URL parameters
          const formData = new URLSearchParams(requestText);
          params = {
            email: formData.get("email") || "",
            confirmationUrl: formData.get("confirmationUrl") || "",
            userRole: formData.get("userRole") || "student"
          };
        }
      }
      
      console.log("Parsed parameters:", JSON.stringify(params, null, 2));
    } catch (parseError) {
      console.error("Error parsing request body:", parseError);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: "Invalid request body", 
          details: parseError instanceof Error ? parseError.message : String(parseError),
          rawBody: await req.text()
        }),
        {
          status: 400,
          headers: corsHeaders
        }
      );
    }
    
    // Validate parameters
    const { email, confirmationUrl, userRole } = params;
    
    if (!email || !confirmationUrl) {
      console.error("Missing required parameters:", { email, confirmationUrl });
      return new Response(
        JSON.stringify({ 
          success: false,
          error: "Missing required parameters", 
          details: "Email and confirmationUrl are required",
          receivedParams: params
        }),
        {
          status: 400,
          headers: corsHeaders
        }
      );
    }

    console.log(`Preparing to send confirmation email to ${email} with role ${userRole}`);

    // Configure email for user type
    const isGuardian = userRole === "guardian";
    const subject = isGuardian
      ? "Confirmação de cadastro como Responsável - Sistema Monitore"
      : "Confirmação de cadastro - Sistema Monitore";
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h1 style="color: #4a6ee0;">Sistema Monitore</h1>
        <p>Olá,</p>
        <p>Obrigado por se cadastrar no Sistema Monitore ${isGuardian ? 'como responsável' : ''}.</p>
        <p>Para ativar sua conta e começar a usar o sistema, por favor, clique no botão abaixo:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${confirmationUrl}" style="background-color: #4a6ee0; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
            Confirmar meu cadastro
          </a>
        </div>
        
        <p>Ou copie e cole este link no seu navegador:</p>
        <p style="background-color: #f5f5f5; padding: 10px; border-radius: 4px; word-break: break-all;">
          ${confirmationUrl}
        </p>
        
        <p>Se você não solicitou este cadastro, por favor, ignore este email.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #666; text-align: center;">
          <p>Sistema Monitore - Segurança e tranquilidade para alunos e responsáveis</p>
        </div>
      </div>
    `;
    
    // Plain text alternative
    const text = `
      Sistema Monitore - Confirmação de cadastro ${isGuardian ? 'como responsável' : ''}
      
      Olá,
      
      Obrigado por se cadastrar no Sistema Monitore ${isGuardian ? 'como responsável' : ''}.
      
      Para ativar sua conta e começar a usar o sistema, por favor, acesse o link abaixo:
      
      ${confirmationUrl}
      
      Se você não solicitou este cadastro, por favor, ignore este email.
      
      Sistema Monitore - Segurança e tranquilidade para alunos e responsáveis
    `;
    
    // Send the email
    console.log(`Attempting to send confirmation email to ${email}`);
    try {
      const emailResult = await resend.emails.send({
        from: "Sistema Monitore <notifications@sistema-monitore.com.br>",
        to: email,
        subject: subject,
        html: html,
        text: text,
      });

      console.log("Resend API response:", JSON.stringify(emailResult, null, 2));
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          data: emailResult
        }),
        {
          status: 200,
          headers: corsHeaders
        }
      );
    } catch (error) {
      console.error("Exception during email sending:", error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: error instanceof Error ? error.message : "Unknown error sending email",
          details: error instanceof Error ? error.stack : String(error)
        }),
        {
          status: 500,
          headers: corsHeaders
        }
      );
    }
    
  } catch (error) {
    console.error("Unhandled error in send-confirmation-email function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : "An unknown error occurred",
        details: error instanceof Error ? error.stack : String(error)
      }),
      {
        status: 500,
        headers: corsHeaders
      }
    );
  }
};

serve(handler);
