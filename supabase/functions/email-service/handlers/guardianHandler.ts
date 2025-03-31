
import { GuardianNotificationRequest } from "../types/index.ts";
import { corsHeaders } from "../../_shared/cors.ts";
import { Resend } from "npm:resend@2.0.0";
import { sendEmail } from "../services/resendService.ts";

/**
 * Handles guardian notification email requests
 */
export const handleGuardianNotification = async (req: Request, resend: Resend): Promise<Response> => {
  try {
    console.log('Handling guardian notification request');
    
    // Extract guardian notification data from request
    let requestData: GuardianNotificationRequest;
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
    
    // Generate notification content based on locationType
    const locationType = requestData.locationType || 'test';
    const guardianName = requestData.guardianName || 'Responsável';
    const studentName = requestData.studentName;
    
    let subject, html, text;
    
    // Create notification based on type
    switch (locationType) {
      case 'arrival':
        subject = `${studentName} chegou ao destino - Sistema Monitore`;
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e9e9e9; border-radius: 5px;">
            <h2 style="color: #4CAF50;">🏫 Chegada ao Destino</h2>
            <p>Olá ${guardianName},</p>
            <p><strong>${studentName}</strong> chegou ao destino com segurança.</p>
            <p>Este é um aviso automático do Sistema Monitore.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="color: #999; font-size: 12px;">Este é um email automático, por favor não responda.</p>
          </div>
        `;
        text = `
          Chegada ao Destino
          
          Olá ${guardianName},
          
          ${studentName} chegou ao destino com segurança.
          
          Este é um aviso automático do Sistema Monitore.
          
          Este é um email automático, por favor não responda.
        `;
        break;
        
      case 'departure':
        subject = `${studentName} saiu do local - Sistema Monitore`;
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e9e9e9; border-radius: 5px;">
            <h2 style="color: #2196F3;">🚶 Notificação de Saída</h2>
            <p>Olá ${guardianName},</p>
            <p><strong>${studentName}</strong> saiu do local monitorado.</p>
            <p>Este é um aviso automático do Sistema Monitore.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="color: #999; font-size: 12px;">Este é um email automático, por favor não responda.</p>
          </div>
        `;
        text = `
          Notificação de Saída
          
          Olá ${guardianName},
          
          ${studentName} saiu do local monitorado.
          
          Este é um aviso automático do Sistema Monitore.
          
          Este é um email automático, por favor não responda.
        `;
        break;
        
      case 'alert':
        subject = `⚠️ Alerta de segurança: ${studentName} - Sistema Monitore`;
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e9e9e9; border-radius: 5px;">
            <h2 style="color: #e53935;">⚠️ Alerta de Segurança</h2>
            <p>Olá ${guardianName},</p>
            <p>Um alerta de segurança foi gerado para <strong>${studentName}</strong>.</p>
            <p>Por favor, verifique o aplicativo para mais detalhes ou entre em contato com ${studentName} diretamente.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="color: #999; font-size: 12px;">Este é um email automático, por favor não responda.</p>
          </div>
        `;
        text = `
          Alerta de Segurança
          
          Olá ${guardianName},
          
          Um alerta de segurança foi gerado para ${studentName}.
          
          Por favor, verifique o aplicativo para mais detalhes ou entre em contato com ${studentName} diretamente.
          
          Este é um email automático, por favor não responda.
        `;
        break;
        
      default: // 'test' or any other case
        subject = `Teste de Notificação - Sistema Monitore`;
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e9e9e9; border-radius: 5px;">
            <h2 style="color: #4F46E5;">🔔 Teste de Notificação</h2>
            <p>Olá ${guardianName},</p>
            <p>Este é um teste de notificação do Sistema Monitore para confirmar que você está recebendo as notificações corretamente.</p>
            <p>Esta mensagem está relacionada a <strong>${studentName}</strong>.</p>
            <p>Nenhuma ação é necessária.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="color: #999; font-size: 12px;">Este é um email automático de teste, por favor não responda.</p>
          </div>
        `;
        text = `
          Teste de Notificação
          
          Olá ${guardianName},
          
          Este é um teste de notificação do Sistema Monitore para confirmar que você está recebendo as notificações corretamente.
          
          Esta mensagem está relacionada a ${studentName}.
          
          Nenhuma ação é necessária.
          
          Este é um email automático de teste, por favor não responda.
        `;
        break;
    }
    
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
          error: 'Failed to send guardian notification',
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
    console.error('Error in guardian notification handler:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Failed to process guardian notification',
        details: error instanceof Error ? error.message : String(error)
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
};
