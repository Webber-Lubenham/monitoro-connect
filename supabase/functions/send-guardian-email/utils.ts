
import { Resend } from "npm:resend@2.0.0";

// Get Resend API key from environment
const resendApiKey = Deno.env.get('RESEND_API_KEY');

// Get Resend client
export const getResendClient = (): Resend | null => {
  if (!resendApiKey) {
    console.error('RESEND_API_KEY is not set. Emails will not be sent.');
    return null;
  }
  
  return new Resend(resendApiKey);
};

// Verified sender email
export const getVerifiedSender = (): string => {
  return 'Sistema Monitore <notifications@sistema-monitore.com.br>';
};

// Generate unique message ID
export const generateMessageId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
};

// CORS headers
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-application-name, origin',
  'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Max-Age': '86400',
  'Vary': 'Origin'
};
