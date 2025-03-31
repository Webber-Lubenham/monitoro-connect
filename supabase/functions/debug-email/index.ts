
// @deno-types="npm:@types/resend"
import { Resend } from 'npm:resend@2.0.0';
import { serve } from 'https://deno.land/std@0.192.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('DEBUG-EMAIL: Request received:', req.method);
    console.log('DEBUG-EMAIL: Content-Type:', req.headers.get('Content-Type'));
    
    // Log all headers
    const headers = {};
    req.headers.forEach((value, key) => {
      headers[key] = value;
    });
    console.log('DEBUG-EMAIL: Request headers:', headers);
    
    // Clone request to read body
    const clonedReq = req.clone();
    const bodyText = await clonedReq.text();
    console.log('DEBUG-EMAIL: Raw request body:', bodyText);
    
    let bodyData;
    try {
      bodyData = JSON.parse(bodyText);
      console.log('DEBUG-EMAIL: Parsed JSON body:', bodyData);
    } catch (parseError) {
      console.error('DEBUG-EMAIL: JSON parse error:', parseError);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Invalid JSON format',
          rawBody: bodyText.slice(0, 100) + (bodyText.length > 100 ? '...' : '')
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Validate required parameters
    const { to, subject, html } = bodyData;
    if (!to || !subject || !html) {
      console.error('DEBUG-EMAIL: Missing required parameters:', { 
        hasTo: !!to, 
        hasSubject: !!subject, 
        hasHtml: !!html 
      });
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Missing required email parameters',
          received: { 
            hasTo: !!to, 
            hasSubject: !!subject, 
            hasHtml: !!html 
          }
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Check payload format
    const isNestedPayload = bodyData.payload && typeof bodyData.payload === 'object';
    if (isNestedPayload) {
      console.error('DEBUG-EMAIL: Nested payload detected:', bodyData);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Nested payload detected. Email parameters should be at the top level.',
          receivedStructure: Object.keys(bodyData),
          suggestedFix: 'Remove the "payload" wrapper and send properties directly'
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    // For debugging purposes, just return success without actually sending the email
    console.log('DEBUG-EMAIL: Validation passed, payload looks correct');
    
    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Debug validation passed',
        receivedPayload: {
          to,
          subject,
          htmlLength: html?.length || 0,
          textLength: bodyData.text?.length || 0,
          from: bodyData.from || 'default'
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('DEBUG-EMAIL: Unhandled error:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
