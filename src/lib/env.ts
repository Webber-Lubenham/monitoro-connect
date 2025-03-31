
// Create a simplified version without the dependency
export const env = {
  // Client-side environment variables
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL as string,
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY as string,
}
