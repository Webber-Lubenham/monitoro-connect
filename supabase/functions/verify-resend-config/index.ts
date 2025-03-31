
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
// @deno-types="npm:@types/resend"
import { Resend } from 'npm:resend';

// Configuração de CORS
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
    console.log('Verify Resend config function invoked');
    
    // Get RESEND_API_KEY from environment
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    let apiKeyConfigured = !!resendApiKey;
    
    // Mask the API key for security in logs
    let maskedApiKey = 'not_configured';
    if (apiKeyConfigured && resendApiKey) {
      const firstChars = resendApiKey.substring(0, 3);
      const lastChars = resendApiKey.substring(resendApiKey.length - 3);
      maskedApiKey = `${firstChars}...${lastChars}`;
      
      console.log(`API key configured: ${firstChars}...${lastChars} (length: ${resendApiKey.length})`);
    } else {
      console.log('RESEND_API_KEY is not configured');
    }
    
    // Initialize verification results
    const verificationResults = {
      api_key: {
        configured: apiKeyConfigured,
        masked_value: maskedApiKey,
        length: apiKeyConfigured ? resendApiKey?.length : 0
      },
      domains: [],
      api_connectivity: false,
      verification_time: new Date().toISOString()
    };
    
    // Test API connectivity if key is configured
    if (apiKeyConfigured && resendApiKey) {
      try {
        // Initialize Resend client
        const resend = new Resend(resendApiKey);
        
        // Test API connectivity by listing domains
        const domainsResponse = await resend.domains.list();
        
        verificationResults.api_connectivity = true;
        verificationResults.domains = domainsResponse.data || [];
        
        // Check for sistema-monitore.com.br domain
        const monitoreDomain = domainsResponse.data?.find(
          domain => domain.name === 'sistema-monitore.com.br'
        );
        
        if (monitoreDomain) {
          verificationResults.primary_domain = {
            name: monitoreDomain.name,
            status: monitoreDomain.status,
            verified: monitoreDomain.status === 'verified',
            created_at: monitoreDomain.created_at
          };
        } else {
          verificationResults.primary_domain = {
            name: 'sistema-monitore.com.br',
            status: 'not_found',
            verified: false,
            message: 'Domain not found in Resend account'
          };
        }
        
        // Test sending a simple email to a test address
        try {
          const testEmail = {
            from: 'Sistema Monitore <onboarding@resend.dev>',
            to: ['delivered@resend.dev'],  // Resend's test address that always succeeds
            subject: 'API Connectivity Test',
            html: '<p>This is a test email to verify API connectivity.</p>'
          };
          
          const sendResult = await resend.emails.send(testEmail);
          
          if (sendResult.error) {
            verificationResults.test_send = {
              success: false,
              error: sendResult.error,
              message: 'Failed to send test email to Resend test address'
            };
          } else {
            verificationResults.test_send = {
              success: true,
              id: sendResult.data?.id,
              message: 'Successfully sent test email to Resend test address'
            };
          }
        } catch (sendError) {
          verificationResults.test_send = {
            success: false,
            error: sendError instanceof Error ? sendError.message : String(sendError),
            message: 'Exception when trying to send test email'
          };
        }
        
      } catch (connectivityError) {
        console.error('Error testing Resend API connectivity:', connectivityError);
        
        verificationResults.error = {
          message: connectivityError instanceof Error ? connectivityError.message : String(connectivityError),
          type: 'connectivity_error'
        };
      }
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        verification: verificationResults
      }),
      { 
        status: 200, 
        headers: corsHeaders
      }
    );
    
  } catch (error) {
    console.error('Unexpected error in verify-resend-config function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error', 
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
