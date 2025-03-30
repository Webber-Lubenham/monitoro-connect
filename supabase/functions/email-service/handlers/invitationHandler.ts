
import { GuardianInvitationRequest } from "../types/index.ts";
import { corsHeaders } from "../../_shared/cors.ts";
import { Resend } from "npm:resend@2.0.0";
import { sendEmail } from "../services/resendService.ts";

/**
 * Handles guardian invitation email requests
 */
export const handleGuardianInvitation = async (req: Request, resend: Resend): Promise<Response> => {
  try {
    console.log('Handling guardian invitation request');
    
    // Extract invitation data from request
    let requestData: GuardianInvitationRequest;
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
    if (!requestData.guardianEmail || !requestData.studentName) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Missing required fields (guardianEmail, studentName)' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    // Generate a unique invitation code if not provided
    const invitationCode = requestData.invitationCode || 
      `INV-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`.toUpperCase();
    
    // Create the invitation URL (placeholder - should be updated with actual URL)
    const invitationUrl = `https://sistema-monitore.com.br/aceitar-convite?codigo=${invitationCode}&email=${encodeURIComponent(requestData.guardianEmail)}`;
    
    // Create email content
    const guardianName = requestData.guardianName || 'Responsável';
    const studentName = requestData.studentName;
    
    const subject = `Convite para acompanhar ${studentName} - Sistema Monitore`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h1 style="color: #4a6ee0; text-align: center;">Sistema Monitore</h1>
        
        <p>Olá ${guardianName},</p>
        
        <p>Você foi convidado(a) para acompanhar <strong>${studentName}</strong> no Sistema Monitore.</p>
        
        <p>O Sistema Monitore permite que responsáveis acompanhem a localização e segurança de estudantes de forma simples e segura.</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Detalhes do Convite:</strong></p>
          <p style="margin: 10px 0 0 0;">Estudante: ${studentName}</p>
          <p style="margin: 5px 0 0 0;">Código de convite: ${invitationCode}</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${invitationUrl}" style="background-color: #4a6ee0; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
            Aceitar Convite
          </a>
        </div>
        
        <p>Se o botão acima não funcionar, copie e cole o link abaixo no seu navegador:</p>
        <p style="word-break: break-all; background-color: #f5f5f5; padding: 10px; border-radius: 4px; font-size: 14px;">
          ${invitationUrl}
        </p>
        
        <p>Este convite expira em 7 dias.</p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #999; font-size: 12px; text-align: center;">
          Sistema Monitore - Segurança e tranquilidade para estudantes e responsáveis
        </p>
      </div>
    `;
    
    const text = `
      Sistema Monitore - Convite para Acompanhar ${studentName}
      
      Olá ${guardianName},
      
      Você foi convidado(a) para acompanhar ${studentName} no Sistema Monitore.
      
      O Sistema Monitore permite que responsáveis acompanhem a localização e segurança de estudantes de forma simples e segura.
      
      Detalhes do Convite:
      Estudante: ${studentName}
      Código de convite: ${invitationCode}
      
      Para aceitar o convite, acesse o link abaixo:
      ${invitationUrl}
      
      Este convite expira em 7 dias.
      
      Sistema Monitore - Segurança e tranquilidade para estudantes e responsáveis
    `;
    
    // Send the invitation email
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
          error: 'Failed to send guardian invitation',
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
        invitationCode,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error in guardian invitation handler:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Failed to process guardian invitation',
        details: error instanceof Error ? error.message : String(error)
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
};
