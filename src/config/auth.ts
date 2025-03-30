
import { createClient } from '@supabase/supabase-js'

// Hardcoded Supabase configuration values
const supabaseUrl = 'https://sb1-yohd9adf.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNiMS15b2hkOWFkZiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzM0ODg5NDUzLCJleHAiOjIwNTA0NjU0NTN9.yp2f5iBM7cMjpjB0VUhPTuOe3rvhCNYWMIJ1z0_iEVo'

// Enhanced Supabase client configuration
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: localStorage,
    storageKey: 'student-sentinel.auth.token'
  }
})

// Authentication state management
export const initializeAuth = () => {
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT') {
      // Clean up auth data
      localStorage.removeItem('student-sentinel.auth.token')
      // Clean up user preferences
      localStorage.removeItem('student-sentinel.user.preferences')
    }
    
    if (event === 'SIGNED_IN') {
      // Initialize user preferences
      initializeUserPreferences(session?.user?.id)
    }
  })
}

// User preferences management
const initializeUserPreferences = async (userId: string | undefined) => {
  if (!userId) return

  try {
    const { data: preferences, error } = await supabase
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
