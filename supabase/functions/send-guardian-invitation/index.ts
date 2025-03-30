
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { getDynamicCorsHeaders } from "../_shared/cors.ts";

// Simplified redirection to the consolidated email-service function
serve(async (req) => {
  const origin = req.headers.get('origin');
  console.log(`Guardian invitation service received request from: ${origin}`);
  
  // Get CORS headers for this request
  const corsHeaders = getDynamicCorsHeaders(origin);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request for guardian invitation service');
    return new Response(null, {
      headers: corsHeaders,
      status: 204
    });
  }

  try {
    // Get the request body
    const requestBody = await req.json();
    
    // Create a new request to the email-service function with proper type
    const url = new URL(req.url);
    const baseUrl = `${url.protocol}//${url.host}`;
    const emailServiceUrl = `${baseUrl}/functions/v1/email-service`;
    
    console.log(`Forwarding request to ${emailServiceUrl} with origin: ${origin}`);
    
    // Forward as guardian-invitation type
    const modifiedBody = {
      type: 'guardian-invitation',
      data: requestBody
    };
    
    // Forward the request with proper headers
    const response = await fetch(emailServiceUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': req.headers.get('Authorization') || '',
        'x-client-info': req.headers.get('x-client-info') || '',
        'Origin': origin || ''
      },
      body: JSON.stringify(modifiedBody)
    });
    
    // Return the response from email-service
    const responseData = await response.json();
    
    return new Response(
      JSON.stringify(responseData),
      {
        headers: corsHeaders,
        status: response.status
      }
    );
  } catch (error) {
    console.error('Error redirecting to email-service:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Error redirecting to email-service',
        details: error instanceof Error ? error.message : String(error),
        origin: origin
      }),
      {
        headers: corsHeaders,
        status: 500
      }
    );
  }
});
