
// Add a new utility file for your email test edge function

// Updated CORS headers
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-application-name',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

// Helper function to get current timestamp
export const getCurrentTimestamp = (): string => {
  return new Date().toLocaleString('pt-BR');
};

// Helper function to delay execution
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
