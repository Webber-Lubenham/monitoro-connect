
// Utility functions for guardian email operations

import { Resend } from "npm:resend@2.0.0";

// Headers for CORS support
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-application-name',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Credentials': 'true'
};

// Helper function to delay execution (for rate limiting)
export const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

// Format timestamp for email display
export const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Generate a unique message ID to avoid duplicates
export const generateMessageId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
};

// Get verified sender email based on environment
export const getVerifiedSender = (): string => {
  // Always use the verified domain for all environments
  return `Sistema Monitore <notifications@sistema-monitore.com.br>`;
};

// Initialize Resend if API key is available
export const getResendClient = (): Resend | null => {
  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  if (!resendApiKey) {
    console.error("Missing RESEND_API_KEY environment variable");
    return null;
  }
  return new Resend(resendApiKey);
};
