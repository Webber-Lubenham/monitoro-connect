
import { serve } from 'https://deno.land/std@0.192.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';

// Simple function to test connectivity to edge functions
const handler = async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    console.log('Test connectivity function invoked');
    
    // Attempt to check Resend API key configuration
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    const apiKeyConfigured = !!resendApiKey;
    
    // Basic validation of the key format (starts with 're_')
    const keyFormatValid = resendApiKey ? resendApiKey.startsWith('re_') : false;
    
    // Get request payload if any
    let payload = {};
    try {
      const contentType = req.headers.get('Content-Type');
      if (contentType?.includes('application/json')) {
        const bodyText = await req.text();
        if (bodyText) {
          payload = JSON.parse(bodyText);
        }
      }
    } catch (error) {
      console.error('Error parsing request body:', error);
    }
    
    // Return connectivity test results
    return new Response(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        test: "resend-api-key",
        resendApiKeyConfigured: apiKeyConfigured,
        partialKey: apiKeyConfigured ? `${resendApiKey!.substring(0, 5)}...${resendApiKey!.substring(resendApiKey!.length - 4)}` : null,
        keyFormatValid,
        keyLength: resendApiKey?.length,
        ...payload
      }),
      { 
        status: 200, 
        headers: corsHeaders
      }
    );
  } catch (error) {
    console.error('Error in test-connectivity function:', error);
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
