
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { Resend } from 'npm:resend@2.0.0';
import { generateSdkEmailTemplate, generateDirectApiEmailTemplate } from './emailTemplates.ts';
import { corsHeaders, getCurrentTimestamp, delay } from './utils.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

const handler = async (req: Request) => {
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    console.log('Test Email Function Invoked');
    
    // Extract request data
    let requestData: any;
    
    try {
      const requestText = await req.text();
      requestData = requestText ? JSON.parse(requestText) : {};
    } catch (error) {
      console.error('Error parsing request JSON:', error);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid JSON in request'
        }),
        { headers: corsHeaders, status: 400 }
      );
    }
    
    const { email = 'frankwebber33@hotmail.com' } = requestData;
    
    console.log(`Sending test email to: ${email}`);
    
    // Validate email
    if (!email || !email.includes('@')) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid email address'
        }),
        { headers: corsHeaders, status: 400 }
      );
    }
    
    // Check for API key
    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set');
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Email service not configured - missing API key'
        }),
        { headers: corsHeaders, status: 500 }
      );
    }
    
    // Initialize Resend client
    const resend = new Resend(RESEND_API_KEY);
    
    try {
      // Get current timestamp for the email
      const timestamp = getCurrentTimestamp();
      
      // Generate email template
      const { subject, html } = generateSdkEmailTemplate(timestamp);
      
      // Send email
      console.log(`Sending test email to ${email} with subject "${subject}"`);
      
      const response = await resend.emails.send({
        from: 'Sistema Monitore <noreply@resend.dev>',
        to: email,
        subject,
        html
      });
      
      console.log('Email service response:', response);
      
      if ('error' in response && response.error) {
        throw new Error(response.error.message || 'Unknown error from email service');
      }
      
      return new Response(
        JSON.stringify({
          success: true,
          message: `Test email sent successfully to ${email}`,
          data: response.data
        }),
        { headers: corsHeaders, status: 200 }
      );
    } catch (error) {
      console.error('Error in SDK method:', error);
      
      // Try alternative API method after a short delay
      await delay(500);
      
      try {
        console.log('Trying alternative direct API method...');
        
        const { subject, html } = generateDirectApiEmailTemplate(getCurrentTimestamp());
        
        // Create the request payload
        const directApiPayload = {
          from: 'Sistema Monitore <noreply@resend.dev>',
          to: email,
          subject,
          html
        };
        
        // Make direct API request to Resend
        const apiResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(directApiPayload)
        });
        
        if (!apiResponse.ok) {
          const errorData = await apiResponse.text();
          throw new Error(`API response error (${apiResponse.status}): ${errorData}`);
        }
        
        const directResult = await apiResponse.json();
        
        return new Response(
          JSON.stringify({
            success: true,
            message: `Test email sent via direct API to ${email}`,
            data: directResult
          }),
          { headers: corsHeaders, status: 200 }
        );
      } catch (directApiError) {
        console.error('Error in direct API method:', directApiError);
        
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Both SDK and direct API methods failed',
            sdkError: error instanceof Error ? error.message : String(error),
            directApiError: directApiError instanceof Error ? directApiError.message : String(directApiError)
          }),
          { headers: corsHeaders, status: 500 }
        );
      }
    }
  } catch (error) {
    console.error('Unexpected error in test-email function:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error)
      }),
      { headers: corsHeaders, status: 500 }
    );
  }
};

serve(handler);
