
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner"  // Changed import to use directly from sonner

interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  role: 'student' | 'guardian';
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isGuardian: boolean;
  isStudent: boolean;
  signUp: (email: string, password: string, userData: {
    first_name: string, 
    last_name: string, 
    role: 'student' | 'guardian'
  }) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const refreshProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      setProfile(data as UserProfile);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (event === 'SIGNED_IN') {
          toast.success("Login realizado com sucesso!");
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
          toast.info("Logout realizado com sucesso!");
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch user profile when user changes
  useEffect(() => {
    if (user) {
      refreshProfile();
    }
  }, [user]);

  const signUp = async (
    email: string, 
    password: string, 
    userData: { first_name: string, last_name: string, role: 'student' | 'guardian' }
  ) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: userData.first_name,
            last_name: userData.last_name,
            role: userData.role,
          },
          emailRedirectTo: `${window.location.origin}/auth/verificar`,
        },
      });

      if (error) throw error;
      toast.success('Cadastro realizado! Verifique seu email para confirmar sua conta.');
      navigate('/auth/verificar');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar conta');
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao fazer login');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/auth/login');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao fazer logout');
      console.error('Logout error:', error);
    }
  };

  const isGuardian = !!profile && profile.role === 'guardian';
  const isStudent = !!profile && profile.role === 'student';

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        isLoading,
        isGuardian,
        isStudent,
        signUp,
        signIn,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
