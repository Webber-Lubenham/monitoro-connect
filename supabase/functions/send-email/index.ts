
import { serve } from 'https://deno.land/std@0.192.0/http/server.ts';
import { handleEmailRequest } from './handler.ts';
import { getDynamicCorsHeaders } from './cors.ts';

// Use the serve function to handle HTTP requests
serve(async (req) => {
  const origin = req.headers.get('origin');
  console.log(`Send-email service received request from: ${origin}`);
  
  // Get CORS headers for this request
  const corsHeaders = getDynamicCorsHeaders(origin);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request for send-email');
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }
  
  try {
    // Handle the actual request
    const response = await handleEmailRequest(req);
    
    // Ensure CORS headers are included in the response
    const headers = new Headers();
    
    // Add all CORS headers
    for (const [key, value] of Object.entries(corsHeaders)) {
      headers.set(key, value);
    }
    
    // Add all other headers from the original response
    for (const [key, value] of response.headers.entries()) {
      if (!headers.has(key)) {
        headers.set(key, value);
      }
    }
    
    return new Response(response.body, {
      status: response.status,
      headers
    });
  } catch (error) {
    console.error('Unhandled error in send-email edge function:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error),
        origin
      }),
      {
        status: 500,
        headers: corsHeaders
      }
    );
  }
});
