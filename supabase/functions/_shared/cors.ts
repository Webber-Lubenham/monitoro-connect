
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
    'https://monitoro-connect.lovable.app',
    'https://4629cb7d-b3ba-4d33-8157-8ad16626160e-00-2q62t3fp8p2fl.riker.replit.dev',
    'https://4629cb7d-b3ba-4d33-8157-8ad16626160e-00-2q62t3fp8p2fl.riker.replit.dev:5000',
    'https://replit.dev',
    'https://*.replit.dev',
    'https://*.riker.replit.dev',
    'https://*.picard.replit.dev'
  ];
  
  // Check if the origin matches any of the patterns with wildcards
  const matchesWildcard = (testOrigin: string, pattern: string): boolean => {
    if (!pattern.includes('*')) return testOrigin === pattern;
    
    const regexPattern = pattern.replace(/\./g, '\\.').replace(/\*/g, '.*');
    return new RegExp(`^${regexPattern}$`).test(testOrigin);
  };
  
  // If origin is null, default to '*'
  if (!origin) return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-application-name, origin',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400',
    'Content-Type': 'application/json',
    'Vary': 'Origin'
  };
  
  console.log('Checking origin against allowed origins:', origin);
  
  // Check for exact matches first
  let allowOrigin = allowedOrigins.includes(origin) ? origin : null;
  
  // If no exact match, check for wildcard patterns
  if (!allowOrigin) {
    for (const pattern of allowedOrigins) {
      if (matchesWildcard(origin, pattern)) {
        console.log('Origin matched wildcard pattern:', pattern);
        allowOrigin = origin;
        break;
      }
    }
  }
  
  // If still no match, use '*'
  if (!allowOrigin) {
    console.log('No match found, defaulting to *');
    allowOrigin = '*';
  }
  
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-application-name, origin',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400',
    'Content-Type': 'application/json',
    'Vary': 'Origin'
  };
};
