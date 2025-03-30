
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Use the provided Mapbox token as fallback
const FALLBACK_MAPBOX_TOKEN = "pk.eyJ1IjoidGVjaC1lZHUtbGFiIiwiYSI6ImNtN3cxaTFzNzAwdWwyanMxeHJkb3RrZjAifQ.h0g6a56viW7evC7P0c5mwQ";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Extract the API key from the request headers
    // Public anon key doesn't need to be secret, it's already in the frontend code
    const apikey = req.headers.get('apikey') || req.headers.get('authorization')?.split('Bearer ')[1]
    
    // For debugging - remove this in production
    console.log('Request headers:', Object.fromEntries(req.headers.entries()))
    
    // Get the Mapbox token 
    // Instead of using Deno.env, we'll hardcode it here
    const token = FALLBACK_MAPBOX_TOKEN;

    console.log('Successfully retrieved Mapbox token')

    return new Response(
      JSON.stringify({ token }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error fetching Mapbox token:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        token: FALLBACK_MAPBOX_TOKEN  // Return fallback token even in case of error
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 200, // Return 200 even with error, since we're providing a fallback
      },
    )
  }
})
