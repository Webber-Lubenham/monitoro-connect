
import { serve } from 'https://deno.land/std@0.192.0/http/server.ts';
import { handleEmailRequest } from './handler.ts';

// Use the serve function to handle HTTP requests
serve(handleEmailRequest);
