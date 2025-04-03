
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { Profile } from '@/types/database.types';

// Define the auth state structure
export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  profile: Profile | null;
}

// Create context with initial state
const AuthContext = createContext<{
  authState: AuthState;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}>({
  authState: { user: null, session: null, isLoading: true, profile: null },
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
});

// Hook to use auth context
export const useAuth = () => useContext(AuthContext);

// Auth provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
    profile: null,
  });

  // Fetch user profile
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      // Make sure we cast data to Profile with required fields
      return {
        id: data.id,
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        email: data.email || '',
        role: data.role,
        created_at: data.created_at,
        updated_at: data.updated_at
      } as Profile;
    } catch (error) {
      console.error('Exception fetching profile:', error);
      return null;
    }
  };

  // Set up auth state listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setAuthState(prevState => ({ ...prevState, isLoading: true }));

        if (session?.user) {
          const profile = await fetchProfile(session.user.id);
          setAuthState({
            user: session.user,
            session,
            isLoading: false,
            profile,
          });
        } else {
          setAuthState({
            user: null,
            session: null,
            isLoading: false,
            profile: null,
          });
        }
      }
    );

    // Initial session check
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        setAuthState({
          user: session.user,
          session,
          isLoading: false,
          profile,
        });
      } else {
        setAuthState(prevState => ({ ...prevState, isLoading: false }));
      }
    };

    initializeAuth();

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Sign in function
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  // Sign up function
  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    return { error };
  };

  // Sign out function
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ authState, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
