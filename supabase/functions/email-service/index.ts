
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { handleEmailRequest } from "./handlers/requestHandler.ts";
import { getDynamicCorsHeaders } from "../_shared/cors.ts";

// Serve with proper CORS handling
serve(async (req) => {
  // Get request details
  const origin = req.headers.get('origin');
  const method = req.method;
  
  // Log request for debugging
  console.log('Request received in email-service:', method, req.url, 'Origin:', origin);
  
  // Get appropriate CORS headers based on origin
  const corsHeaders = getDynamicCorsHeaders(origin);
  
  // Handle CORS preflight requests
  if (method === 'OPTIONS') {
    console.log('Handling OPTIONS preflight request from origin:', origin);
    return new Response(null, { 
      status: 204,
      headers: corsHeaders 
    });
  }
  
  try {
    // Forward to the handler function
    const response = await handleEmailRequest(req);
    
    // Ensure all responses have CORS headers
    const headers = response.headers;
    for (const [key, value] of Object.entries(corsHeaders)) {
      headers.set(key, value);
    }
    
    return response;
  } catch (error) {
    console.error('Unhandled error in email-service:', error);
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
});
