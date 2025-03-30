
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { getDynamicCorsHeaders } from "../_shared/cors.ts";
import { handleEmailRequest } from "./handler.ts";

serve(async (req) => {
  const origin = req.headers.get('origin');
  console.log(`Email-service received request from: ${origin}`);
  
  // Get CORS headers for this request
  const corsHeaders = getDynamicCorsHeaders(origin);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request for email-service');
    return new Response(null, {
      headers: corsHeaders,
      status: 204
    });
  }
  
  try {
    // Handle the main request
    const response = await handleEmailRequest(req);
    
    // Ensure CORS headers are in the response
    const headers = new Headers();
    
    // Add CORS headers
    for (const [key, value] of Object.entries(corsHeaders)) {
      headers.set(key, value);
    }
    
    // Add any other headers from the original response
    if (response.headers) {
      for (const [key, value] of response.headers.entries()) {
        if (!headers.has(key)) {
          headers.set(key, value);
        }
      }
    }
    
    return new Response(response.body, {
      status: response.status,
      headers: headers
    });
  } catch (error) {
    console.error('Unhandled error in email-service:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Internal server error in email-service',
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
