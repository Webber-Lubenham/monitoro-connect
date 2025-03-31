
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { handleGuardianEmail } from "./handlers.ts";

// Updated CORS headers to include all necessary production domains
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, origin',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
  'Access-Control-Allow-Credentials': 'true'
};

// Handle preflight requests for CORS
const handleOptions = (req: Request) => {
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS preflight request');
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }
  return null;
};

// Serve with CORS handling
serve(async (req) => {
  console.log('Guardian email request received:', req.method, req.url, req.headers.get('origin'));
  
  // Handle CORS preflight
  const optionsResponse = handleOptions(req);
  if (optionsResponse) {
    return optionsResponse;
  }
  
  // Handle the regular request
  try {
    const response = await handleGuardianEmail(req);
    
    // Ensure all responses have CORS headers
    const headers = response.headers;
    Object.entries(corsHeaders).forEach(([key, value]) => {
      headers.set(key, value);
    });
    
    return response;
  } catch (error) {
    console.error('Unhandled error in guardian email:', error);
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
