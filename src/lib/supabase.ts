import { createClient } from '@supabase/supabase-js';
import { supabaseUrl, supabaseAnonKey } from "../integrations/supabase/config";

// Create a single Supabase instance with persistent storage
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storage: localStorage,
    storageKey: 'aberrdeen_supabase_auth',
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'x-application-name': 'aberrdeen'
    }
  }
});

// Export a single instance
export { supabase };
