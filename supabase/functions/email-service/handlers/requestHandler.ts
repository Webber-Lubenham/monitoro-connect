
import { Resend } from "npm:resend@2.0.0";

// Types for email requests
export interface EmailRequest {
  type: string;
  data: Record<string, any>;
}

// Get Resend API key from environment variable
const resendApiKey = Deno.env.get('RESEND_API_KEY');
const resend = new Resend(resendApiKey);

export async function handleEmailRequest(req: Request): Promise<Response> {
  try {
    // Parse the request body
    const body = await req.json() as EmailRequest;
    console.log('Email service received request:', JSON.stringify(body));

    // Validate request structure
    if (!body.type || !body.data) {
      console.error('Invalid request format: missing type or data');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid request format: missing type or data' 
        }),
        { status: 400 }
      );
    }

    // Handle different email types
    switch (body.type) {
      case 'guardian-invitation':
        return await handleGuardianInvitation(body.data);
      
      case 'location-notification':
        return await handleLocationNotification(body.data);
      
      case 'test':
        return await handleTestEmail(body.data);
      
      case 'guardian-notification':
        return await handleGuardianNotification(body.data);
      
      default:
        console.error(`Unknown email type: ${body.type}`);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: `Unknown email type: ${body.type}` 
          }),
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error processing email request:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : String(error)
      }),
      { status: 500 }
    );
  }
}

// Email handler implementations
async function handleGuardianInvitation(data: Record<string, any>): Promise<Response> {
  try {
    const { guardianEmail, guardianName, studentName, invitationUrl } = data;
    
    if (!guardianEmail || !guardianName || !studentName || !invitationUrl) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Missing required fields for guardian invitation' 
        }),
        { status: 400 }
      );
    }
    
    const { data: emailData, error } = await resend.emails.send({
      from: 'Sistema Monitore <notifications@sistema-monitore.com.br>',
      to: guardianEmail,
      subject: `${studentName} o convidou para ser um responsável no Sistema Monitore`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 5px;">
          <h1 style="color: #4a6ee0;">Convite para Responsável</h1>
          
          <p>Olá ${guardianName},</p>
          
          <p>${studentName} o convidou para ser um responsável no Sistema Monitore.</p>
          
          <p>Com o Sistema Monitore, você poderá acompanhar a localização de ${studentName} em tempo real, receber notificações importantes e muito mais.</p>
          
          <div style="margin: 30px 0; text-align: center;">
            <a href="${invitationUrl}" style="background-color: #4a6ee0; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
              ACEITAR CONVITE
            </a>
          </div>
          
          <p style="color: #666; font-size: 0.8em; margin-top: 30px;">
            Se você não conhece ${studentName} ou acredita que este email foi enviado por engano, por favor ignore-o.
          </p>
        </div>
      `
    });
    
    if (error) {
      console.error('Error sending guardian invitation email:', error);
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { status: 500 }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Guardian invitation sent successfully',
        id: emailData?.id 
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in handleGuardianInvitation:', error);
    return new Response(
      JSON.stringify({ success: false, error: String(error) }),
      { status: 500 }
    );
  }
}

async function handleLocationNotification(data: Record<string, any>): Promise<Response> {
  try {
    const { guardianEmail, guardianName, studentName, latitude, longitude, timestamp } = data;
    
    if (!guardianEmail || !studentName || !latitude || !longitude) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Missing required fields for location notification' 
        }),
        { status: 400 }
      );
    }
    
    const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
    const formattedTime = new Date(timestamp || Date.now()).toLocaleString('pt-BR');
    
    const { data: emailData, error } = await resend.emails.send({
      from: 'Sistema Monitore <notifications@sistema-monitore.com.br>',
      to: guardianEmail,
      subject: `Localização atual de ${studentName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 5px;">
          <h1 style="color: #4a6ee0;">Atualização de Localização</h1>
          
          <p>Olá ${guardianName || 'Responsável'},</p>
          
          <p>Estamos enviando a localização atual de ${studentName}.</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <p><strong>Detalhes da localização:</strong></p>
            <ul>
              <li>Hora: ${formattedTime}</li>
              <li>Coordenadas: ${latitude}, ${longitude}</li>
            </ul>
          </div>
          
          <div style="margin: 30px 0; text-align: center;">
            <a href="${mapUrl}" style="background-color: #4a6ee0; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
              VER NO MAPA
            </a>
          </div>
          
          <p style="color: #666; font-size: 0.8em; margin-top: 30px;">
            Esta é uma mensagem automática do Sistema Monitore. Não responda a este email.
          </p>
        </div>
      `
    });
    
    if (error) {
      console.error('Error sending location notification email:', error);
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { status: 500 }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Location notification sent successfully',
        id: emailData?.id 
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in handleLocationNotification:', error);
    return new Response(
      JSON.stringify({ success: false, error: String(error) }),
      { status: 500 }
    );
  }
}

async function handleTestEmail(data: Record<string, any>): Promise<Response> {
  try {
    const { email = "test@example.com" } = data;
    
    const { data: emailData, error } = await resend.emails.send({
      from: 'Sistema Monitore <notifications@sistema-monitore.com.br>',
      to: email,
      subject: 'Teste do Sistema Monitore',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 5px;">
          <h1 style="color: #4a6ee0;">Teste de Email</h1>
          
          <p>Este é um email de teste do Sistema Monitore.</p>
          
          <p>Se você está vendo esta mensagem, o sistema de envio de emails está funcionando corretamente.</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <p><strong>Informações técnicas:</strong></p>
            <ul>
              <li>Timestamp: ${new Date().toISOString()}</li>
              <li>Destinatário: ${email}</li>
              <li>Enviado via: Edge Function "email-service"</li>
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
        { status: 500 }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Test email sent successfully',
        id: emailData?.id 
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in handleTestEmail:', error);
    return new Response(
      JSON.stringify({ success: false, error: String(error) }),
      { status: 500 }
    );
  }
}

async function handleGuardianNotification(data: Record<string, any>): Promise<Response> {
  try {
    const { guardianEmail, guardianName, studentName, message, subject } = data;
    
    if (!guardianEmail || !studentName) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Missing required fields for guardian notification' 
        }),
        { status: 400 }
      );
    }
    
    const emailSubject = subject || `Notificação sobre ${studentName}`;
    const emailMessage = message || `Esta é uma notificação automática sobre ${studentName} do Sistema Monitore.`;
    
    const { data: emailData, error } = await resend.emails.send({
      from: 'Sistema Monitore <notifications@sistema-monitore.com.br>',
      to: guardianEmail,
      subject: emailSubject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 5px;">
          <h1 style="color: #4a6ee0;">Notificação do Sistema Monitore</h1>
          
          <p>Olá ${guardianName || 'Responsável'},</p>
          
          <p>${emailMessage}</p>
          
          <p style="color: #666; font-size: 0.8em; margin-top: 30px;">
            Esta é uma mensagem automática do Sistema Monitore. Não responda a este email.
          </p>
        </div>
      `
    });
    
    if (error) {
      console.error('Error sending guardian notification email:', error);
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { status: 500 }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Guardian notification sent successfully',
        id: emailData?.id 
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in handleGuardianNotification:', error);
    return new Response(
      JSON.stringify({ success: false, error: String(error) }),
      { status: 500 }
    );
  }
}
