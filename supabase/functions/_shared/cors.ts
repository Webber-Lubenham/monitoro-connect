
// CORS headers for cross-origin requests
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-application-name, origin',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Max-Age': '86400',
  'Vary': 'Origin'
};

// Get CORS headers based on the request origin
export const getDynamicCorsHeaders = (origin: string | null) => {
  // Allow localhost, development domains, and all production domains
  const allowedOrigins = [
    'http://localhost:8080',
    'http://localhost:3000',
    'https://student-sentinel-hub.lovable.app',
    'https://sistema-monitore.com.br',
    'https://monitoro-connect.lovable.app'
  ];
  
  // If the origin is in the allowed list, use it; otherwise, use the default
  const requestOrigin = origin && allowedOrigins.includes(origin) ? origin : '*';
  
  return {
    'Access-Control-Allow-Origin': requestOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-application-name, origin',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400',
    'Content-Type': 'application/json',
    'Vary': 'Origin'
  };
};
