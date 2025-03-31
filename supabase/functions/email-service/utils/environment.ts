
/**
 * Environment utilities for email service
 */

// Get configuration values from environment or use hardcoded fallbacks
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') || "re_P8whBAgb_QDkLcB9DHzGfBy4JiBTw5f29";
const APP_DOMAIN = Deno.env.get('APP_DOMAIN') || "sistema-monitore.com.br";

/**
 * Get Resend API key
 */
export function getResendApiKey(): string {
  return RESEND_API_KEY;
}

/**
 * Get app domain for links in emails
 */
export function getAppDomain(): string {
  return APP_DOMAIN;
}

/**
 * Check if all required environment variables are set
 */
export function checkRequiredEnv(): boolean {
  if (!RESEND_API_KEY) {
    console.error("Missing RESEND_API_KEY in environment");
    return false;
  }
  
  if (!APP_DOMAIN) {
    console.error("Missing APP_DOMAIN in environment");
    return false;
  }
  
  return true;
}
