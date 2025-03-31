
import { serve } from 'https://deno.land/std@0.192.0/http/server.ts';
import { handleEmailRequest } from './handler.ts';
import { corsHeaders } from './cors.ts';

// Updated serve implementation with better CORS handling
serve(async (req) => {
  console.log('Request received in send-email:', req.method, req.url, req.headers.get('origin'));
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS preflight request');
    return new Response(null, { 
      status: 204,
      headers: corsHeaders 
    });
  }
  
  try {
    const response = await handleEmailRequest(req);
    
    // Ensure all responses have CORS headers
    const headers = response.headers;
    Object.entries(corsHeaders).forEach(([key, value]) => {
      headers.set(key, value);
    });
    
    return response;
  } catch (error) {
    console.error('Unhandled error in send-email:', error);
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
