
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types.ts';
import { CustomStorageAPI } from './storage.ts'; // Already correct
import { retryFetch } from './fetch-utils.ts';
import { STORAGE_KEY } from './config.ts';

// Supabase URLs e chaves corretas para o ambiente de produção
const SUPABASE_URL = 'https://usnrnaxpoqmojxsfcoox.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzbnJuYXhwb3Ftb2p4c2Zjb294Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ4ODk0NTMsImV4cCI6MjA1MDQ2NTQ1M30.aaQ8gDyJS20GSr6AdjJN6gLJBEX7sTlPC3h8e06j_5k';

// Singleton instance to ensure we never create multiple clients
let instance: SupabaseClient<Database> | null = null;

// Create a factory function that returns the same instance every time
export const getSupabaseClient = () => {
  if (instance) return instance;

  // Determine if we should use sessionStorage
  const urlParams = new URLSearchParams(window.location.search);
  const useSessionStorage = urlParams.has('use_session_storage') || false;

  // Initialize the custom storage
  const storageApi = new CustomStorageAPI(useSessionStorage);

  // Create a single Supabase client instance - usando credenciais fixas em vez de env
  instance = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
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
      // Fix the fetch type issue
      fetch: (input: RequestInfo | URL, init?: RequestInit) => {
        if (typeof input === 'string') {
          return retryFetch(input, init || {}, 4, 300);
        } else {
          // For Request or URL objects
          return retryFetch(input.toString(), init || {}, 4, 300);
        }
      }
    }
  });

  console.log(`Supabase client inicializado com URL: ${SUPABASE_URL.substring(0, 15)}...`);
  return instance;
};

// Export the singleton instance for backward compatibility
export const supabase = getSupabaseClient();

// Export the storage API for potential reuse
export const authStorage = new CustomStorageAPI(
  new URLSearchParams(window.location.search).has('use_session_storage') || false
);

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
