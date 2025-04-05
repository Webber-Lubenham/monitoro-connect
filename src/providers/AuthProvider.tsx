
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  role: 'student' | 'guardian';
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isLoading: boolean;
}

interface AuthContextType {
  authState: AuthState;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userType?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  profile: null,
  session: null,
  isLoading: true,
};

export const AuthContext = createContext<AuthContextType>({
  authState: initialState,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
  user: null,
  profile: null,
  isLoading: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(initialState);

  const setProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      if (data) {
        // Make sure the email is included in the profile
        let profileWithEmail = data as Profile;
        
        if (!profileWithEmail.email) {
          // Fetch user to get email if needed
          const { data: userData } = await supabase.auth.getUser(userId);
          if (userData?.user?.email) {
            profileWithEmail.email = userData.user.email;
          }
        }

        setAuthState(prev => ({
          ...prev,
          profile: profileWithEmail,
        }));
      }
    } catch (err) {
      console.error('Error in setProfile:', err);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setAuthState(prev => ({ ...prev, isLoading: true }));

        if (session) {
          setAuthState(prev => ({
            ...prev,
            user: session.user,
            session,
          }));
          
          await setProfile(session.user.id);
        } else {
          setAuthState(prev => ({
            ...prev,
            user: null,
            profile: null,
            session: null,
          }));
        }

        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    );

    // Initial session check
    const initializeAuth = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (data.session) {
        setAuthState({
          user: data.session.user,
          profile: null, // Will be set by the setProfile call
          session: data.session,
          isLoading: true,
        });
        
        await setProfile(data.session.user.id);
      }
      
      setAuthState(prev => ({ ...prev, isLoading: false }));
    };

    initializeAuth();

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (err) {
      console.error('Error in signIn:', err);
      return { error: err };
    }
  };

  const signUp = async (email: string, password: string, userType = 'student') => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            user_type: userType,
          },
        },
      });
      return { error };
    } catch (err) {
      console.error('Error in signUp:', err);
      return { error: err };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Error in signOut:', err);
    }
  };

  // Create a value object that includes both the state and functions
  // as well as direct access to user, profile and loading state for simpler access
  const value = {
    authState,
    signIn,
    signUp,
    signOut,
    user: authState.user,
    profile: authState.profile,
    isLoading: authState.isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for easier access to auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
