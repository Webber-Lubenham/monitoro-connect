
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types.ts';
import { CustomStorageAPI } from './storage.ts'; // Already correct
import { retryFetch } from './fetch-utils.ts';
import { STORAGE_KEY } from './config.ts';

// Definir tipo para import.meta.env
interface ImportMeta {
  env: {
    VITE_SUPABASE_URL: string;
    VITE_SUPABASE_ANON_KEY: string;
    MODE: string;
  };
}

// Configuração para Vite
const SUPABASE_URL = (import.meta as unknown as ImportMeta).env.VITE_SUPABASE_URL || 'https://rsvjnndhbyyxktbczlnk.supabase.co';
const SUPABASE_ANON_KEY = (import.meta as unknown as ImportMeta).env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzdmpubmRoYnl5eGt0YmN6bG5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0MDk3NzksImV4cCI6MjA1ODk4NTc3OX0.AlM_iSptGQ7G5qrJFHU9OECu1wqH6AXQP1zOU70L0T4';

// Verificação de segurança
if ((!SUPABASE_URL || !SUPABASE_ANON_KEY) && (import.meta as unknown as ImportMeta).env.MODE === 'production') {
  throw new Error('Supabase configuration is required in production');
}

// Singleton pattern implementation
class SupabaseClientSingleton {
  private static _instance: SupabaseClient<Database>;
  private static _storageApi: CustomStorageAPI;

  private constructor() {}

  private static initialize() {
    const urlParams = new URLSearchParams(window.location.search);
    const useSessionStorage = urlParams.has('use_session_storage') || false;
    this._storageApi = new CustomStorageAPI(useSessionStorage);
    
    this._instance = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        storage: this._storageApi,
        storageKey: STORAGE_KEY,
        detectSessionInUrl: true
      },
      global: {
        headers: {
          'X-Client-Info': 'monitore-app/1.0.0'
        },
        fetch: (input: RequestInfo | URL, init?: RequestInit) => {
          if (typeof input === 'string') {
            return retryFetch(input, init || {}, 4, 300);
          }
          return retryFetch(input.toString(), init || {}, 4, 300);
        }
      }
    });
    console.log(`Supabase client initialized with URL: ${SUPABASE_URL.substring(0, 15)}...`);
  }

  public static getInstance(): SupabaseClient<Database> {
    if (!this._instance) {
      this.initialize();
    }
    return this._instance;
  }

  public static getStorage(): CustomStorageAPI {
    if (!this._storageApi) {
      this.initialize();
    }
    return this._storageApi;
  }
}

// Export singleton instance
export const supabase = SupabaseClientSingleton.getInstance();

// Export storage API
export const authStorage = SupabaseClientSingleton.getStorage();

// Helper function for auth headers
export const getAuthHeaders = async (): Promise<Record<string, string>> => {
  try {
    const { data } = await supabase.auth.getSession();
    const session = data?.session;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Client-Info': 'monitore-app/1.0.0'
    };
    
    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`;
    }
    
    return headers;
  } catch (error) {
    console.error('Error getting auth headers:', error);
    return {
      'Content-Type': 'application/json',
      'X-Client-Info': 'monitore-app/1.0.0'
    };
  }
};
