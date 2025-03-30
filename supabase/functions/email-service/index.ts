
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { handleEmailRequest } from "./handlers/requestHandler.ts";
import { getDynamicCorsHeaders } from "../_shared/cors.ts";

// Serve the handler
serve(async (req) => {
  const origin = req.headers.get('origin');
  console.log(`Email service received request from: ${origin}`);

  // Get CORS headers for this request
  const corsHeaders = getDynamicCorsHeaders(origin);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request for email-service');
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    // Handle the actual request
    const response = await handleEmailRequest(req);
    
    // Ensure CORS headers are included in the response
    const headers = new Headers(corsHeaders);
    for (const [key, value] of response.headers.entries()) {
      headers.set(key, value);
    }

    return new Response(response.body, {
      status: response.status,
      headers
    });
  } catch (error) {
    console.error('Error in email service:', error);
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
