
/**
 * Configuration for Supabase client
 */

// Define a consistent storage key to be used across the app
export const STORAGE_KEY = 'monitore.auth.token';

// Configuração do Supabase
export const supabaseUrl = 'https://rsvjnndhbyyxktbczlnk.supabase.co';
export const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzdmpubmRoYnl5eGt0YmN6bG5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0MDk3NzksImV4cCI6MjA1ODk4NTc3OX0.AlM_iSptGQ7G5qrJFHU9OECu1wqH6AXQP1zOU70L0T4';

// Validar configuração
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase configuration missing. Check environment variables.');
}
