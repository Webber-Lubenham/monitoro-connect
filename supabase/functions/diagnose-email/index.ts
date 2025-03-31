
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-application-name',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

const handler = async (req: Request) => {
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }
  
  try {
    console.log('Diagnose email function invoked');
    
    // Extract payload from request, handle various formats
    let payload;
    try {
      const bodyText = await req.text();
      console.log('Raw request body:', bodyText);
      
      if (!bodyText || bodyText.trim() === '') {
        payload = {};
      } else if (bodyText.trim().startsWith('{')) {
        payload = JSON.parse(bodyText);
      } else if (bodyText.includes('=')) {
        // Handle URL encoded form data
        const params = new URLSearchParams(bodyText);
        payload = {};
        for (const [key, value] of params.entries()) {
          payload[key] = value;
        }
      } else {
        payload = { raw: bodyText };
      }
    } catch (e) {
      console.error('Error parsing request payload:', e);
      payload = {};
    }
    
    // Verify key fields are present
    const issues = [];
    if (!payload.to) {
      issues.push({
        field: "to",
        message: "Missing recipient email address"
      });
    }
    
    if (!payload.subject) {
      issues.push({
        field: "subject",
        message: "Missing email subject"
      });
    }
    
    if (!payload.html) {
      issues.push({
        field: "html",
        message: "Missing HTML content"
      });
    }
    
    // Check Resend API key
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    const resendKeyStatus = {
      present: !!resendApiKey,
      length: resendApiKey ? resendApiKey.length : 0,
      firstChars: resendApiKey ? `${resendApiKey.substring(0, 5)}...` : 'N/A',
      valid: resendApiKey ? resendApiKey.startsWith('re_') : false
    };
    
    const tips = [
      "Make sure your Resend API key is configured in Supabase secrets",
      "Ensure your domain is verified in Resend dashboard",
      "Check if the from address is using your verified domain"
    ];
    
    // Return diagnostic results
    return new Response(
      JSON.stringify({
        success: issues.length === 0,
        diagnosed_at: new Date().toISOString(),
        payload_received: payload,
        resend_key_status: resendKeyStatus,
        issues: issues,
        tips: tips
      }),
      { 
        status: 200, 
        headers: corsHeaders
      }
    );
  } catch (error) {
    console.error('Error in diagnose-email function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Diagnostic error', 
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
