
// Add a simple Echo function to help with debugging
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-application-name',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

const handler = async (req: Request) => {
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }
  
  try {
    console.log('Echo payload function invoked');
    
    // Parse and echo back whatever was sent
    let payload;
    const contentType = req.headers.get('Content-Type');
    
    if (contentType?.includes('application/json')) {
      try {
        const bodyText = await req.text();
        console.log('Raw request body:', bodyText);
        payload = bodyText ? JSON.parse(bodyText) : {};
      } catch (e) {
        const bodyText = await req.text();
        console.log('Failed to parse JSON:', bodyText);
        payload = { raw: bodyText, parseError: String(e) };
      }
    } else {
      const bodyText = await req.text();
      console.log('Non-JSON content:', bodyText);
      
      // Try to parse as URL encoded form data
      if (bodyText.includes('=')) {
        try {
          const params = new URLSearchParams(bodyText);
          const formData = {};
          for (const [key, value] of params.entries()) {
            formData[key] = value;
          }
          payload = formData;
        } catch (e) {
          payload = { raw: bodyText, contentType };
        }
      } else {
        payload = { raw: bodyText, contentType };
      }
    }
    
    // Add debugging information
    const headers = Object.fromEntries(req.headers.entries());
    
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Payload received and echoed back',
        request: {
          method: req.method,
          headers,
          payload
        },
        timestamp: new Date().toISOString()
      }),
      { 
        status: 200, 
        headers: corsHeaders
      }
    );
  } catch (error) {
    console.error('Error in echo-payload function:', error);
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
