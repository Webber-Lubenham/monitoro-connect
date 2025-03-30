
// Main handler functions for processing guardian email requests

import { Resend } from "npm:resend@2.0.0";
import { corsHeaders, getResendClient, getVerifiedSender, generateMessageId } from "./utils.ts";
import { generateEmailContent, generateEmailSubject } from "./templates.ts";
import { GuardianEmailRequest, EmailResponse } from "./types.ts";

/**
 * Main handler for email notification requests
 */
export const handleGuardianEmail = async (req: Request): Promise<Response> => {
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    console.log('Guardian email function invoked');
    
    // Parse request body
    const requestBody = await parseAndValidateRequest(req);
    if ('errorResponse' in requestBody) {
      return requestBody.errorResponse;
    }
    
    // Initialize Resend client
    const resend = getResendClient();
    if (!resend) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Email service not configured' 
        }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    // Send the email
    return await sendGuardianEmail(resend, requestBody.data);
    
  } catch (error) {
    console.error('Error in send-guardian-email function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error)
      }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
};

/**
 * Parse and validate the incoming request
 */
async function parseAndValidateRequest(req: Request): Promise<
  { data: GuardianEmailRequest; } | 
  { errorResponse: Response; }
> {
  try {
    const requestText = await req.text();
    console.log('Raw request body:', requestText);
    
    if (!requestText) {
      return {
        errorResponse: new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Invalid JSON in request body'
          }), 
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      };
    }
    
    const requestBody: GuardianEmailRequest = JSON.parse(requestText);
    
    // Check required fields
    const { studentName, guardianEmail, guardianName } = requestBody;
    
    if (!guardianEmail || !guardianEmail.includes('@')) {
      return {
        errorResponse: new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Invalid or missing guardian email' 
          }), 
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      };
    }
    
    if (!studentName) {
      return {
        errorResponse: new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Missing student name' 
          }), 
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      };
    }
    
    return { data: requestBody };
  } catch (error) {
    console.error('Error parsing request:', error);
    return {
      errorResponse: new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid JSON in request body',
          details: error instanceof Error ? error.message : String(error)
        }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    };
  }
}

/**
 * Send the guardian email using Resend
 */
async function sendGuardianEmail(
  resend: Resend, 
  requestData: GuardianEmailRequest
): Promise<Response> {
  const { studentName, guardianEmail, guardianName, locationType = 'test', locationData } = requestData;
  
  console.log(`Sending ${locationType} email to ${guardianEmail}`);
  
  // Generate email content based on locationType
  const { subject, html, text } = generateEmailContent(studentName, guardianName, locationType, locationData);
  
  // Generate a unique message ID for tracking
  const messageId = generateMessageId();
  
  try {
    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: getVerifiedSender(),
      to: guardianEmail,
      subject,
      html,
      text,
      // Add tracking headers
      headers: {
        'X-Entity-Ref-ID': messageId,
        'X-System-Generated': 'true',
        'X-Message-Source': 'sistema-monitore-guardian',
        'X-Mailer': 'Monitore-GuardianNotification-v1.0'
      },
      // Add tags for better filtering in Resend dashboard
      tags: [
        {
          name: 'system',
          value: 'monitore'
        },
        {
          name: 'message_id',
          value: messageId
        },
        {
          name: 'message_type',
          value: 'guardian_notification'
        },
        {
          name: 'notification_type',
          value: locationType
        }
      ]
    });
    
    // Handle Resend errors
    if (error) {
      console.error('Error sending guardian email:', error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: error.message || 'Failed to send email',
          details: error
        }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    console.log('Guardian email sent successfully:', data);
    
    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        messageId: data?.id || messageId,
        recipient: guardianEmail,
        timestamp: new Date().toISOString(),
        notificationType: locationType
      }), 
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (emailError) {
    console.error('Error in email sending:', emailError);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Failed to send email',
        details: emailError instanceof Error ? emailError.message : String(emailError)
      }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
}
