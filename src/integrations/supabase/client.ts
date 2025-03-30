
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { CustomStorageAPI } from './storage';
import { retryFetch } from './fetch-utils';
import { STORAGE_KEY, supabaseUrl, supabaseAnonKey } from './config';

// Determine if we should use sessionStorage
// This can be controlled via URL parameter or environment variable
const urlParams = new URLSearchParams(window.location.search);
const useSessionStorage = urlParams.has('use_session_storage') || import.meta.env.VITE_USE_SESSION_STORAGE === 'true';

// Initialize the custom storage
const storageApi = new CustomStorageAPI(useSessionStorage);

// Create a single Supabase client instance
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    storage: storageApi,
    storageKey: STORAGE_KEY,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Client-Info': 'monitore-app/1.0.0'
    },
    fetch: (url, options) => retryFetch(url, options, 4, 300)
  }
});

// Export the storage API for potential reuse
export const authStorage = storageApi;

// Export helper function to get auth headers for edge function calls
export const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const { data } = await supabase.auth.getSession();
  const session = data.session;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Client-Info': 'monitore-app/1.0.0'
  };
  
  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`;
  }
  
  return headers;
};
