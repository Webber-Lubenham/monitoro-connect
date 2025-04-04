
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { handleEmailRequest } from "./handlers/requestHandler.ts";
import { corsHeaders, getDynamicCorsHeaders } from "../_shared/cors.ts";

// Serve with proper CORS handling
serve(async (req) => {
  // Get the request origin for CORS
  const origin = req.headers.get('origin');
  const method = req.method;
  
  console.log(`Email-service request received: ${method} from ${origin || 'unknown origin'}`);
  
  // Get appropriate CORS headers based on origin
  const dynamicHeaders = getDynamicCorsHeaders(origin);
  
  // Handle CORS preflight requests
  if (method === 'OPTIONS') {
    console.log('Handling OPTIONS preflight request');
    return new Response(null, { 
      status: 204,
      headers: dynamicHeaders
    });
  }
  
  try {
    // Handle the actual request
    const response = await handleEmailRequest(req);
    
    // Add CORS headers to response
    const headers = new Headers(response.headers);
    Object.entries(dynamicHeaders).forEach(([key, value]) => {
      headers.set(key, value);
    });

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: headers
    });
  } catch (error) {
    console.error('Error in email-service:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : String(error)
      }),
      {
        status: 500,
        headers: {
          ...dynamicHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});
