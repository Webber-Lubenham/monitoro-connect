
/**
 * Configuration for Supabase client
 */

// Define a consistent storage key to be used across the app
export const STORAGE_KEY = 'monitore.auth.token';

// Configuração do Supabase
export const supabaseUrl = 'https://usnrnaxpoqmojxsfcoox.supabase.co';
export const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzbnJuYXhwb3Ftb2p4c2Zjb294Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ4ODk0NTMsImV4cCI6MjA1MDQ2NTQ1M30.aaQ8gDyJS20GSr6AdjJN6gLJBEX7sTlPC3h8e06j_5k';

// Validar configuração
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase configuration missing. Check environment variables.');
}
