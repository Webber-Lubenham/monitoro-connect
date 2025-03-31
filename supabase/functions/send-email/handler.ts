
import { corsHeaders, getDynamicCorsHeaders } from '../_shared/cors.ts';
import { Resend } from 'npm:resend@2.0.0';

// Get Resend API key from environment
const resendApiKey = Deno.env.get('RESEND_API_KEY');
if (!resendApiKey) {
  console.error('RESEND_API_KEY is not set. Emails will not be sent.');
}

// Initialize Resend client
const resend = resendApiKey ? new Resend(resendApiKey) : null;

/**
 * Verified sender domain for production use
 */
const VERIFIED_SENDER = 'Sistema Monitore <notifications@sistema-monitore.com.br>';

/**
 * Main handler for email requests
 */
export const handleEmailRequest = async (req: Request): Promise<Response> => {
  // Get appropriate CORS headers based on origin
  const origin = req.headers.get('origin');
  const corsHeaders = getDynamicCorsHeaders(origin);
  
  try {
    if (!resend) {
      throw new Error('Resend client is not initialized. Check RESEND_API_KEY environment variable.');
    }

    // Parse request body
    let requestBody = {};
    try {
      // Try to get the text first
      const requestText = await req.text();
      console.log('Request text:', requestText);
      
      // Attempt to parse it as JSON
      try {
        requestBody = JSON.parse(requestText);
        console.log('Parsed JSON request body:', requestBody);
      } catch (jsonError) {
        // If it's not valid JSON, treat as form data
        const formData = new URLSearchParams(requestText);
        formData.forEach((value, key) => {
          requestBody[key] = value;
        });
        console.log('Parsed form data request body:', requestBody);
      }
    } catch (error) {
      console.log('Error parsing request body:', error);
      requestBody = {}; // Fallback to empty object
    }
    
    // Extract email parameters
    const { 
      to, 
      from = VERIFIED_SENDER,
      subject, 
      html, 
      text = '',
      type = 'standard'
    } = requestBody;

    // Validate required parameters
    if (!to || !subject || !html) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Missing required parameters: to, subject, html' 
        }), 
        { 
          status: 400, 
          headers: corsHeaders
        }
      );
    }

    // Log email details
    console.log(`Sending ${type} email to: ${to}, subject: ${subject}`);
    
    // Send the email using Resend
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
      text,
      tags: [
        {
          name: 'system',
          value: 'monitore'
        },
        {
          name: 'email_type',
          value: type
        }
      ]
    });

    // Handle Resend errors
    if (error) {
      console.error('Resend API error:', error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: error.message || 'Failed to send email',
          details: error
        }), 
        { 
          status: 500, 
          headers: corsHeaders
        }
      );
    }

    // Return success response
    console.log('Email sent successfully:', data);
    return new Response(
      JSON.stringify({ 
        success: true, 
        data
      }), 
      { 
        status: 200, 
        headers: corsHeaders
      }
    );
  } catch (error) {
    // Handle any unexpected errors
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : String(error) 
      }), 
      { 
        status: 500, 
        headers: corsHeaders
      }
    );
  }
};
