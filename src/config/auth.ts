import { createClient, SupabaseClient, AuthChangeEvent, Session } from '@supabase/supabase-js'

// Hardcoded Supabase configuration values
const supabaseUrl = 'https://pqhxgsrbazjgzyrxhyjj.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxaHhnc3JiYXpqZ3p5cnhoeWpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyNjg4MzEsImV4cCI6MjA1ODg0NDgzMX0.EV6PyUfJRM3p8CFbWfXw0HCnY124PI-T6tQVDIe0DW0'

// Singleton pattern for Supabase client
let supabaseInstance: SupabaseClient | null = null
let isInitializing = false

export const supabase = (): SupabaseClient => {
  if (!supabaseInstance && !isInitializing) {
    isInitializing = true
    try {
      supabaseInstance = createClient(supabaseUrl, supabaseKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          storage: localStorage,
          storageKey: 'student-sentinel.auth.token',
          detectSessionInUrl: false
        }
      })
    } finally {
      isInitializing = false
    }
  }
  if (!supabaseInstance) {
    throw new Error('Failed to initialize Supabase client')
  }
  return supabaseInstance
}

// Authentication state management
export const initializeAuth = () => {
  const client = supabase()
  
  // Remove any existing listeners to prevent duplicates
  client.auth.removeAllListeners()
  
  client.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
    console.log('Auth state changed:', event, session?.user?.id)
    
    if (event === 'SIGNED_OUT') {
      // Clean up auth data
      localStorage.removeItem('student-sentinel.auth.token')
      // Clean up user preferences
      localStorage.removeItem('student-sentinel.user.preferences')
    }
    
    if (event === 'SIGNED_IN' && session?.user?.id) {
      // Initialize user preferences
      initializeUserPreferences(session.user.id)
    }
  })
}

// User preferences management
const initializeUserPreferences = async (userId: string) => {
  try {
    const { data: preferences, error } = await supabase()
      .from('parent_notification_preferences')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) throw error

    localStorage.setItem('student-sentinel.user.preferences', JSON.stringify(preferences))
  } catch (error) {
    console.error('Error initializing user preferences:', error)
  }
}
