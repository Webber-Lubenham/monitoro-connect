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
