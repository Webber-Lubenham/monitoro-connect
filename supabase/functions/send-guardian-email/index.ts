
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { handleGuardianEmail } from "./handlers.ts";

// Serve the handler
serve(handleGuardianEmail);
