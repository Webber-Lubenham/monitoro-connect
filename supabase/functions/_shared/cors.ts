
// CORS headers for cross-origin requests
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, Authorization, x-application-name, origin',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Max-Age': '86400',
  'Content-Type': 'application/json',
  'Vary': 'Origin'
};

// Get CORS headers based on the request origin
export const getDynamicCorsHeaders = (origin: string | null) => {
  // Expanded list of allowed origins
  const allowedOrigins = [
    'http://localhost:8080', 
    'https://sistema-monitore.com.br', 
    'https://www.sistema-monitore.com.br',
    'https://student-sentinel-hub.lovable.app',
    'https://monitore-connect.lovable.app',
    'https://lovable.dev',
    'https://*.lovable.app'
  ];
  
  // If we're in development or testing, allow any origin
  if (process.env.NODE_ENV === 'development' || process.env.SUPABASE_ENV === 'test') {
    return {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, Authorization, X-Client-Info, Apikey, Content-Type, Origin',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400',
      'Content-Type': 'application/json',
      'Vary': 'Origin'
    };
  }
  
  // For production, validate the origin
  const clientOrigin = origin || '';
  
  // Always allow lovable domains explicitly
  if (clientOrigin.includes('lovable.app') || clientOrigin.includes('lovable.dev')) {
    return {
      'Access-Control-Allow-Origin': clientOrigin,
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, Authorization, X-Client-Info, Apikey, Content-Type, Origin',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400',
      'Content-Type': 'application/json',
      'Vary': 'Origin'
    };
  }
  
  // Check if the origin is allowed (exact match or domain pattern match)
  const isAllowedOrigin = allowedOrigins.includes(clientOrigin) || 
                         allowedOrigins.some(allowed => {
                           if (allowed.includes('*')) {
                             // Convert wildcard pattern to regex
                             const pattern = allowed.replace(/\./g, '\\.').replace(/\*/g, '.*');
                             const regex = new RegExp(`^${pattern}$`);
                             return regex.test(clientOrigin);
                           }
                           return clientOrigin.endsWith(allowed);
                         });
  
  return {
    'Access-Control-Allow-Origin': isAllowedOrigin ? clientOrigin : '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, Authorization, X-Client-Info, Apikey, Content-Type, Origin',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400',
    'Content-Type': 'application/json',
    'Vary': 'Origin'
  };
};
