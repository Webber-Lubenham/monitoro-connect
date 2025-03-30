
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json"
};

const handler = async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    console.log("Starting test-resend-connection function");
    
    // Get Resend API key
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error("RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({ 
          success: false,
          error: "Resend API key not configured",
          details: "The RESEND_API_KEY environment variable is not set in Supabase Edge Functions settings"
        }),
        {
          status: 500,
          headers: corsHeaders
        }
      );
    }

    console.log("RESEND_API_KEY is available");
    
    // Initialize Resend client
    const resend = new Resend(resendApiKey);

    // Get the target email from the request
    let testEmail = "test@example.com";
    
    try {
      const { email } = await req.json();
      if (email && typeof email === "string") {
        testEmail = email;
      }
    } catch (e) {
      // If parsing fails, use the default test email
      console.log("Using default test email address");
    }
    
    console.log(`Testing Resend API connection with ${testEmail}`);
    
    try {
      // Try to validate the API key by making a simple API call
      const domains = await resend.domains.list();
      
      // Get information about the API key
      const apiInfo = {
        domains: domains.data?.length || 0,
        hasVerifiedDomains: domains.data?.some(d => d.status === "verified") || false,
        apiKeyWorks: true
      };
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Resend API connection successful",
          data: apiInfo
        }),
        {
          status: 200,
          headers: corsHeaders
        }
      );
    } catch (resendError) {
      console.error("Error connecting to Resend API:", resendError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Failed to connect to Resend API",
          details: resendError instanceof Error ? resendError.message : String(resendError)
        }),
        {
          status: 500,
          headers: corsHeaders
        }
      );
    }
  } catch (error) {
    console.error("Unhandled error in test-resend-connection function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "An unexpected error occurred",
        details: error instanceof Error ? error.message : String(error)
      }),
      {
        status: 500,
        headers: corsHeaders
      }
    );
  }
};

serve(handler);
