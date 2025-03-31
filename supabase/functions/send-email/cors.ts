
// CORS headers for cross-origin requests
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-application-name, origin',
  'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Max-Age': '86400',
  'Vary': 'Origin'
};
