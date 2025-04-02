
// deno-lint-ignore-file
// @ts-expect-error - Supabase is installed via npm
import { createClient } from '@supabase/supabase-js';
import { supabaseUrl, supabaseAnonKey } from "../integrations/supabase/config.ts";

type SupabaseClient = ReturnType<typeof createClient>;

// Global variable to store the singleton instance
let supabaseInstance: SupabaseClient | null = null;

/**
 * Gets or creates the singleton Supabase client instance
 */
export const getSupabaseClient = (): SupabaseClient => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        storage: localStorage,
        storageKey: 'monitoro_supabase_auth',
        autoRefreshToken: true,
        detectSessionInUrl: true
      },
      global: {
        headers: {
          'x-application-name': 'monitoro-connect'
        }
      }
    });
  }
  return supabaseInstance;
};

// Export the singleton instance
export const supabase = getSupabaseClient();

/**
 * Gets authentication headers for Supabase Edge Functions
 * This ensures proper authorization for requests to edge functions
 */
export const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const { data: { session } } = await supabase.auth.getSession();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-client-info': 'monitore-app'
  };

  // Add authorization header if user is logged in
  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`;
  }

  return headers;
};
