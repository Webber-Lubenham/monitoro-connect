
// Configuration and helpers for the test-email function

// Headers for CORS support
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper function to get app configuration
export const getConfig = () => {
  return {
    domain: Deno.env.get("RESEND_DOMAIN") || "sistema-monitore.com.br",
    appDomain: Deno.env.get("APP_DOMAIN") || "www.sistema-monitore.com.br",
    apiKey: Deno.env.get("RESEND_API_KEY"),
  };
};

// Helper function to generate a formatted timestamp
export const getCurrentTime = (): string => {
  return new Date().toLocaleString("pt-BR");
};
