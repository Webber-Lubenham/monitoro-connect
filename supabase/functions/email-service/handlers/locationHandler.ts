
import { LocationNotificationRequest } from "../types/index.ts";
import { corsHeaders } from "../../_shared/cors.ts";
import { Resend } from "npm:resend@2.0.0";
import { sendEmail } from "../services/resendService.ts";

/**
 * Handles location notification email requests
 */
export const handleLocationNotification = async (req: Request, resend: Resend): Promise<Response> => {
  try {
    console.log('Handling location notification request');
    
    // Extract location data from request
    let requestData: LocationNotificationRequest;
    try {
      const payload = await req.json();
      requestData = payload.data || payload;
    } catch (error) {
      console.error('Error parsing request body:', error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid request format' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    // Validate required fields
    if (!requestData.guardianEmail || !requestData.latitude || !requestData.longitude) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Missing required fields (guardianEmail, latitude, longitude)' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    // Format timestamp
    let formattedTime;
    try {
      const date = new Date(requestData.timestamp);
      formattedTime = date.toLocaleString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
    } catch (e) {
      formattedTime = new Date().toLocaleString('pt-BR');
    }
    
    // Create Google Maps link
    const mapUrl = `https://www.google.com/maps?q=${requestData.latitude},${requestData.longitude}`;
    
    // Get email content values
    const isEmergency = requestData.isEmergency || false;
    const studentName = requestData.studentName || 'Aluno';
    const guardianName = requestData.guardianName || 'Responsável';
    
    // Create email content
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e9e9e9; border-radius: 5px;">
        <h2 style="color: ${isEmergency ? '#e53935' : '#4F46E5'};">${isEmergency ? '⚠️ ALERTA DE EMERGÊNCIA' : `Localização atual de ${studentName}`}</h2>
        <p>Olá ${guardianName},</p>
        <p>${isEmergency 
            ? `<strong>${studentName}</strong> acionou um <strong style="color: #e53935;">alerta de emergência</strong>.` 
            : `${studentName} compartilhou sua localização atual com você:`}
        </p>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0; font-weight: bold;">Localização: Lat: ${requestData.latitude.toFixed(6)}, Long: ${requestData.longitude.toFixed(6)}</p>
            <p style="margin: 10px 0 0 0;">Horário: ${formattedTime}</p>
            ${requestData.accuracy ? `<p style="margin: 10px 0 0 0;">Precisão: ${Math.round(requestData.accuracy)} metros</p>` : ''}
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="${mapUrl}" target="_blank" style="background-color: ${isEmergency ? '#e53935' : '#4F46E5'}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Ver no mapa</a>
        </div>
        
        <p>Você recebeu este email porque está cadastrado como responsável de ${studentName} no Sistema Monitore.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #999; font-size: 12px;">Este é um email automático, por favor não responda.</p>
      </div>
    `;

    const text = `
      ${isEmergency ? 'ALERTA DE EMERGÊNCIA' : `Localização atual de ${studentName}`}
      
      Olá ${guardianName},
      
      ${isEmergency 
          ? `${studentName} acionou um alerta de emergência.` 
          : `${studentName} compartilhou sua localização atual com você.`}
      
      Localização: Lat: ${requestData.latitude.toFixed(6)}, Long: ${requestData.longitude.toFixed(6)}
      Horário: ${formattedTime}
      ${requestData.accuracy ? `Precisão: ${Math.round(requestData.accuracy)} metros` : ''}
      
      Veja a localização: ${mapUrl}
      
      Você recebeu este email porque está cadastrado como responsável de ${studentName} no Sistema Monitore.
      
      Este é um email automático, por favor não responda.
    `;
    
    // Generate subject with timestamp to reduce threading
    const timestamp = new Date().toISOString().replace(/[:.]/g, '').substring(0, 15);
    const subject = isEmergency 
      ? `⚠️ ALERTA DE EMERGÊNCIA: ${studentName} [${timestamp}]`
      : `Localização atual de ${studentName} - Sistema Monitore [${timestamp}]`;
    
    // Send the email
    const result = await sendEmail(
      resend,
      requestData.guardianEmail,
      subject,
      html,
      text
    );
    
    if (!result.success) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to send location notification',
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
        sentTo: requestData.guardianEmail,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error in location notification handler:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Failed to process location notification',
        details: error instanceof Error ? error.message : String(error)
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
};
