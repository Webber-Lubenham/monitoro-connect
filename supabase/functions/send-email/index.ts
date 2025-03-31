
import { serve } from 'https://deno.land/std@0.192.0/http/server.ts';
import { handleEmailRequest } from './handler.ts';
import { getDynamicCorsHeaders } from '../_shared/cors.ts';

// Updated serve implementation with better CORS handling
serve(async (req) => {
  // Get request details
  const origin = req.headers.get('origin');
  const method = req.method;
  
  console.log('Request received in send-email:', method, req.url, origin);
  
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
        headers: corsHeaders
      }
    );
  }
});
