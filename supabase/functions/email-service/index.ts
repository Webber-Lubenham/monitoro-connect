
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { handleEmailRequest } from "./handlers/requestHandler.ts";

// Updated CORS headers to include all necessary production domains
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-requested-with, origin',
  'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
  'Access-Control-Max-Age': '86400',
  'Access-Control-Allow-Credentials': 'true'
}

// Handle the request with proper CORS support
serve(async (req) => {
  // Log request details for debugging
  console.log('Request received:', {
    method: req.method,
    url: req.url,
    origin: req.headers.get('origin')
  });

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS preflight request');
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
    Object.entries(corsHeaders).forEach(([key, value]) => {
      headers.set(key, value);
    });
    
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
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
