
// @deno-types="npm:@types/resend"
import { Resend } from 'npm:resend';
import { corsHeaders } from './cors.ts';
import { EmailRequest, EmailResponse } from './types.ts';
import { parseRequestBody, validateEmailRequest, logEmailEvent } from './utils.ts';

// Get Resend API key from environment variable
const resendApiKey = Deno.env.get('RESEND_API_KEY');

// Initialize Resend client with the API key
const resend = new Resend(resendApiKey);

// Log the API key configuration status
console.log('RESEND_API_KEY is', resendApiKey ? 'configured' : 'NOT configured');
if (resendApiKey) {
  console.log('Key starts with:', resendApiKey.substring(0, 5));
  console.log('Key length:', resendApiKey.length);
}

export async function handleEmailRequest(req: Request): Promise<Response> {
  // Log incoming request with more detail
  console.log('Request received in send-email:', req.method);
  console.log('RESEND_API_KEY configured:', !!resendApiKey);
  console.log('Headers:', JSON.stringify(Object.fromEntries(req.headers.entries())));
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Log the full raw request for debugging
    const reqClone = req.clone();
    const rawBody = await reqClone.text();
    console.log('Raw request body:', rawBody);
    
    // Check if the body is empty
    if (!rawBody || rawBody.trim() === '') {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Empty request body',
          message: 'The request body cannot be empty'
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Parse the request body
    let body: EmailRequest | null = null;
    let parseError: string | null = null;
    
    try {
      // First try to parse as JSON
      if (rawBody.trim().startsWith('{')) {
        const parsedBody = JSON.parse(rawBody);
        body = parsedBody;
      } else if (rawBody.includes('=')) {
        // Then try to parse as form data
        const params = new URLSearchParams(rawBody);
        body = {
          to: params.get('to') || '',
          subject: params.get('subject') || '',
          html: params.get('html') || '',
          text: params.get('text') || '',
          from: params.get('from') || ''
        };
      } else {
        parseError = 'Unsupported content format';
      }
    } catch (error) {
      parseError = `Failed to parse request body: ${error instanceof Error ? error.message : String(error)}`;
    }
    
    // Handle parsing errors
    if (parseError || !body) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: parseError || 'Invalid or empty request body',
          rawBody: rawBody
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Log the parsed body for debugging
    console.log('Parsed request body:', JSON.stringify(body));
    
    // Validate email parameters
    const { isValid, error: validationError } = validateEmailRequest(body);
    if (!isValid) {
      logEmailEvent('error', validationError || 'Validation error', { received: body });
      return new Response(
        JSON.stringify({ 
          success: false,
          error: validationError,
          received: { to: body.to, subject: body.subject, hasHtml: !!body.html }
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Extract email parameters
    const { to, subject, html, text } = body;
    // Use the provided from address or default to the verified domain
    const from = body.from || 'Sistema Monitore <notifications@sistema-monitore.com.br>';

    logEmailEvent('info', 'Extracted email parameters', { 
      to, 
      subject, 
      from,
      hasHtml: !!html, 
      htmlLength: html?.length 
    });

    // Check Resend API key again
    if (!resendApiKey) {
      logEmailEvent('error', 'RESEND_API_KEY is not configured');
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Resend API key is not configured',
          message: 'Server configuration error'
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    logEmailEvent('info', 'Sending email via Resend', {
      from,
      to,
      subject
    });

    // Send email via Resend with additional tracking
    try {
      // Generate a unique message ID for tracking
      const messageId = `monitore-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
      
      const { data, error } = await resend.emails.send({
        from,
        to,
        subject,
        html,
        text,
        // Add extra debugging headers to track emails
        headers: {
          'X-Entity-Ref-ID': messageId,
          'X-System-Generated': 'true',
          'X-Message-Source': 'sistema-monitore',
          'X-Mailer': 'Monitore-EmailSystem-v1.2',
          'X-Priority': '1' // High priority
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
            value: 'location_notification'
          }
        ]
      });

      // Handle Resend API errors
      if (error) {
        // Log in more detail
        logEmailEvent('error', 'Error returned by Resend API', {
          error: error.message,
          statusCode: error.statusCode,
          details: error
        });
        
        // Check for common Resend error patterns
        let userFriendlyError = 'Failed to send email';
        if (error.statusCode === 429) {
          userFriendlyError = 'Rate limit exceeded. Too many email requests.';
        } else if (error.message && error.message.includes('domain verification')) {
          userFriendlyError = 'Domain not verified. Please verify sistema-monitore.com.br in Resend dashboard.';
        } else if (error.message && error.message.includes('rate limit')) {
          userFriendlyError = 'Rate limit exceeded. Too many email requests.';
        }
        
        return new Response(
          JSON.stringify({ 
            success: false,
            error: userFriendlyError,
            details: error,
            messageId
          }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      // Enhanced logging for successful sends
      logEmailEvent('success', 'Email sent successfully via Resend API', {
        id: data?.id,
        to,
        messageId
      });

      // Return success response with more details
      return new Response(
        JSON.stringify({ 
          success: true,
          data: {
            id: data?.id,
            messageId,
            timestamp: new Date().toISOString()
          }
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    } catch (resendError) {
      // More detailed error logging
      const errorMessage = resendError instanceof Error ? resendError.message : String(resendError);
      const errorStack = resendError instanceof Error ? resendError.stack : undefined;
      
      logEmailEvent('error', 'Exception when calling Resend API', {
        message: errorMessage,
        stack: errorStack,
        details: resendError
      });
      
      return new Response(
        JSON.stringify({ 
          success: false,
          error: errorMessage,
          source: 'resend_api_call',
          stack: errorStack
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
  } catch (error: unknown) {
    // Handle unhandled exceptions with more context
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : 'No stack trace';
    
    logEmailEvent('error', 'Unhandled error in send-email Edge Function', {
      message: errorMessage,
      stack: errorStack,
      error
    });
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: errorMessage,
        stack: errorStack
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        
      }
    );
  }
}
