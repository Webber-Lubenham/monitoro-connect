
// Import shared CORS headers
import { corsHeaders as sharedCorsHeaders } from "../../_shared/cors.ts";

// Use the shared CORS headers to maintain consistency
export const corsHeaders = {
  ...sharedCorsHeaders,
  'Vary': 'Origin'
};
