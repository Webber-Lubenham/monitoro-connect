
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resendApiKey = Deno.env.get("RESEND_API_KEY");
if (!resendApiKey) {
  console.error("Missing RESEND_API_KEY environment variable");
}

const resend = new Resend(resendApiKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface LocationNotification {
  studentName: string;
  studentId: string;
  guardianEmail: string;
  guardianName: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  accuracy?: number;
  status?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request with validation
    let requestData: LocationNotification;
    try {
      requestData = await req.json() as LocationNotification;
    } catch (parseError) {
      console.error("Error parsing request JSON:", parseError);
      return new Response(
        JSON.stringify({ error: "Invalid JSON in request body" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    const { 
      studentName, 
      studentId, 
      guardianEmail, 
      guardianName, 
      latitude, 
      longitude, 
      timestamp, 
      accuracy, 
      status 
    } = requestData;
    
    // Validate required fields
    if (!studentName || !studentId || !guardianEmail || !latitude || !longitude || !timestamp) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
    
    console.log(`Sending location notification email to ${guardianEmail} for student ${studentName}`);
    
    // Format the timestamp
    const date = new Date(timestamp);
    const formattedTime = date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    
    // Generate Google Maps link
    const mapLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
    
    // Create HTML email content
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e9e9e9; border-radius: 5px;">
        <h2 style="color: #4a6ee0; margin-bottom: 20px;">Atualização de Localização</h2>
        <p>Olá ${guardianName},</p>
        <p>Estamos enviando uma atualização sobre a localização de <strong>${studentName}</strong>.</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Horário:</strong> ${formattedTime}</p>
          <p><strong>Coordenadas:</strong> ${latitude.toFixed(6)}, ${longitude.toFixed(6)}</p>
          ${accuracy ? `<p><strong>Precisão:</strong> ${Math.round(accuracy)} metros</p>` : ''}
          ${status ? `<p><strong>Status:</strong> ${status === 'unknown' ? 'Desconhecido' : status === 'moving' ? 'Em movimento' : 'Parado'}</p>` : ''}
        </div>
        
        <p>Você pode visualizar a localização no mapa clicando no botão abaixo:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${mapLink}" target="_blank" style="background-color: #4a6ee0; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Ver no Mapa</a>
        </div>
        
        <p style="color: #666; font-size: 0.8em; margin-top: 30px; border-top: 1px solid #e9e9e9; padding-top: 15px;">
          Esta é uma mensagem automática do Sistema Monitore. Por favor, não responda a este email.
        </p>
      </div>
    `;

    // Send the email
    try {
      const emailResponse = await resend.emails.send({
        from: "Sistema Monitore <notifications@sistema-monitore.com.br>",
        to: guardianEmail,
        subject: `Atualização de Localização: ${studentName}`,
        html: htmlContent,
      });

      console.log("Email sent successfully:", emailResponse);

      return new Response(JSON.stringify({ success: true, emailResponse }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } catch (emailError) {
      console.error("Error sending email through Resend:", emailError);
      return new Response(
        JSON.stringify({ error: `Error sending email: ${emailError instanceof Error ? emailError.message : 'Unknown error'}` }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
  } catch (error) {
    console.error("Unhandled error in notify-email function:", error);
    
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
