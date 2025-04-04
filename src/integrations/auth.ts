
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';

// Handle user session and auth state
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
        
        // Fetch user preferences if logged in
        if (initialSession?.user) {
          try {
            // Use parent_id instead of user_id to match the database column
            const { data, error } = await supabase
              .from('parent_notification_preferences')
              .select('*')
              .eq('parent_id', initialSession.user.id);
            
            if (error) {
              console.error('Error fetching user preferences:', error);
            } else {
              console.log('User preferences loaded:', data);
            }
          } catch (prefError) {
            console.error('Failed to load user preferences:', prefError);
          }
        }
      } catch (error) {
        console.error('Error fetching initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log('Auth state changed:', event, newSession?.user?.id);
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setLoading(false);
    });

    // Clean up subscription on unmount
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    session,
    loading,
    signOut: () => supabase.auth.signOut(),
  };
};

export default useAuth;
