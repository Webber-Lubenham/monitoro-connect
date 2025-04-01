import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { Resend } from 'npm:resend';
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { getDynamicCorsHeaders } from "../_shared/cors.ts";

// Get Resend API key from environment variable
const resendApiKey = Deno.env.get('RESEND_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

// Initialize clients
const resend = new Resend(resendApiKey);
const supabase = createClient(supabaseUrl, supabaseKey);

interface LocationEmailRequest {
  studentName: string;
  studentEmail?: string;
  guardianName: string;
  guardianEmail: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  accuracy?: number;
  mapUrl?: string;
  isEmergency?: boolean;
}

const handler = async (req: Request) => {
  // Get request details
  const origin = req.headers.get('origin');
  const method = req.method;
  
  console.log('Request received in send-location-email:', method, origin);
  
  // Get appropriate CORS headers based on origin
  const corsHeaders = getDynamicCorsHeaders(origin);
  
  // Handle preflight requests
  if (method === 'OPTIONS') {
    console.log('Handling OPTIONS preflight request from origin:', origin);
    return new Response(null, { 
      status: 204,
      headers: corsHeaders 
    });
  }

  try {
    console.log('=== Send location email function invoked ===');
    
    // Validate API keys
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

    // Parse request body
    let requestData: LocationEmailRequest;
    try {
      const requestText = await req.text();
      console.log('Raw request body:', requestText);
      
      if (!requestText || requestText.trim() === '') {
        throw new Error('Empty request body');
      }
      
      requestData = JSON.parse(requestText);
    } catch (error) {
      console.error('Error parsing request:', error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: error instanceof Error ? error.message : 'Invalid request format',
          raw_body: await req.clone().text()
        }),
        { 
          status: 400, 
          headers: corsHeaders
        }
      );
    }

    // Validate required fields
    if (!requestData.guardianEmail || !requestData.latitude || !requestData.longitude) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Missing required fields (guardianEmail, latitude, longitude)',
          received: requestData
        }),
        { 
          status: 400, 
          headers: corsHeaders
        }
      );
    }

    // Format timestamp
    const dateTimeOptions: Intl.DateTimeFormatOptions = { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: false
    };
    
    let formattedTime;
    try {
      const date = new Date(requestData.timestamp);
      formattedTime = date.toLocaleString('pt-BR', dateTimeOptions);
    } catch (e) {
      formattedTime = new Date().toLocaleString('pt-BR', dateTimeOptions);
    }
    
    // Create map URL if not provided
    const mapUrl = requestData.mapUrl || 
      `https://www.google.com/maps?q=${requestData.latitude},${requestData.longitude}`;

    // Prepare email content
    const isEmergency = requestData.isEmergency || false;
    const studentName = requestData.studentName || 'Aluno';
    const guardianName = requestData.guardianName || 'Responsável';

    const htmlContent = `
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

    // Generate a unique message ID for tracking
    const messageId = `monitore-location-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
    
    // Send email via Resend
    console.log(`Sending location notification to ${requestData.guardianEmail} about student ${studentName}`);
    
    try {
      const recipientEmail = requestData.guardianEmail.trim();
      const fromAddress = "notifications@sistema-monitore.com.br";
      const fromName = "Sistema Monitore";
      const fromField = `${fromName} <${fromAddress}>`;
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '').substring(0, 15);
      const subject = isEmergency 
        ? `⚠️ ALERTA DE EMERGÊNCIA: ${studentName} [${timestamp}]`
        : `Localização atual de ${studentName} - Sistema Monitore [${timestamp}]`;
      
      // Send email
      const { data, error } = await resend.emails.send({
        from: fromField,
        to: [recipientEmail],
        subject: subject,
        html: htmlContent,
        tags: [
          { name: 'system', value: 'monitore' },
          { name: 'message_id', value: messageId },
          { name: 'type', value: isEmergency ? 'emergency' : 'location' }
        ]
      });

      if (error) {
        console.error('Error sending email via Resend:', error);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: error.message || 'Failed to send location email',
            details: error,
            code: error.statusCode,
            recipient: recipientEmail,
            messageId
          }),
          { 
            status: error.statusCode || 400, 
            headers: corsHeaders
          }
        );
      }

      // Log successful notification in Supabase
      const { error: logError } = await supabase
        .from("notification_logs")
        .insert({
          student_name: studentName,
          recipient_email: recipientEmail,
          notification_type: isEmergency ? "emergency" : "location_update",
          location_data: {
            latitude: requestData.latitude,
            longitude: requestData.longitude,
            accuracy: requestData.accuracy || 0,
            timestamp: requestData.timestamp || new Date().toISOString()
          },
          message_id: messageId,
          status: 'sent'
        });

      if (logError) {
        console.warn('Failed to log notification:', logError);
      }

      console.log('Email sent successfully:', data);
      return new Response(
        JSON.stringify({ 
          success: true, 
          data: {
            id: data?.id,
            messageId,
            recipient: recipientEmail,
            timestamp: new Date().toISOString()
          }
        }),
        { 
          status: 200, 
          headers: corsHeaders
        }
      );
    } catch (emailError) {
      console.error('Exception during email sending:', emailError);
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Exception during email sending', 
          details: emailError instanceof Error ? emailError.message : String(emailError)
        }),
        { 
          status: 500, 
          headers: corsHeaders
        }
      );
    }
  } catch (error) {
    console.error('Unexpected error in send-location-email function:', error);
    
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
