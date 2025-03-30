
import { EmailRequest, EmailResponse } from './types.ts';
import { Resend } from 'npm:resend';

// Get Resend API key from environment variable
const resendApiKey = Deno.env.get('RESEND_API_KEY');

export async function handleEmailRequest(req: Request): Promise<Response> {
  try {
    // Check if Resend API key is configured
    if (!resendApiKey) {
      console.error('RESEND_API_KEY is not set');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Email service not properly configured'
        }),
        { status: 500 }
      );
    }

    // Initialize Resend client
    const resend = new Resend(resendApiKey);
    
    // Parse the request body
    const requestBody = await req.json() as EmailRequest;
    console.log('Email request received:', JSON.stringify({
      to: requestBody.to,
      subject: requestBody.subject,
      hasHtml: !!requestBody.html
    }));
    
    // Validate required fields
    const { to, subject, html, from = 'Sistema Monitore <notifications@sistema-monitore.com.br>' } = requestBody;
    
    if (!to || !subject || !html) {
      console.error('Missing required email parameters');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Missing required fields: to, subject, html'
        }),
        { status: 400 }
      );
    }
    
    // Send email via Resend
    console.log(`Sending email to ${to} with subject: ${subject}`);
    
    try {
      const { data, error } = await resend.emails.send({
        from,
        to,
        subject,
        html,
        text: requestBody.text,
      });
      
      if (error) {
        console.error('Error sending email:', error);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: error.message,
            details: error,
            source: 'resend'
          }),
          { status: 400 }
        );
      }
      
      console.log('Email sent successfully:', data);
      
      // Return success response
      const response: EmailResponse = {
        success: true,
        data,
        message: 'Email sent successfully'
      };
      
      return new Response(
        JSON.stringify(response),
        { status: 200 }
      );
    } catch (sendError) {
      console.error('Exception calling Resend API:', sendError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: sendError instanceof Error ? sendError.message : String(sendError),
          source: 'exception'
        }),
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Unexpected error in handleEmailRequest:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : String(error),
        source: 'handler'
      }),
      { status: 500 }
    );
  }
}
