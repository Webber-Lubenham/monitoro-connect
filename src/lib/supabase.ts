import { createClient } from '@supabase/supabase-js';
import { customStorage } from './storage';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Initialize Supabase client with custom storage
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: customStorage,
    storageKey: 'student-sentinel.auth.token',
    detectSessionInUrl: true,
  },
  global: {
    headers: {
      'x-application-name': 'student-sentinel-hub',
    },
  },
});

// Initialize auth listener
export const initializeAuth = () => {
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT') {
      // Clean up auth data
      customStorage.removeItem('student-sentinel.auth.token');
      // Clean up user preferences
      customStorage.removeItem('student-sentinel.user.preferences');
    }
    
    if (event === 'SIGNED_IN' && session?.user?.id) {
      // Initialize user preferences
      initializeUserPreferences(session.user.id);
    }
  });
};

// User preferences management
const initializeUserPreferences = async (userId: string) => {
  try {
    const { data: preferences, error } = await supabase
      .from('parent_notification_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching preferences:', error);
      return;
    }

    if (preferences) {
      customStorage.setItem('student-sentinel.user.preferences', JSON.stringify(preferences));
    }
  } catch (error) {
    console.error('Error initializing user preferences:', error);
  }
};
