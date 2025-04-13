
import { useState, useEffect } from 'react';
import { supabase } from '../../integrations/supabase/client.ts';
import { useToast } from '@/components/ui/use-toast';

export interface Profile {
  id: string;
  email: string;
  role?: string;
  name?: string;
  created_at?: string;
  updated_at?: string;
}

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setProfile(null);
          setLoading(false);
          return;
        }
        
        // Get profile data from profiles table
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (error) {
          console.error('Error fetching profile:', error);
          throw error;
        }
        
        // If profile exists, use it; otherwise use basic user data
        setProfile(data || {
          id: user.id,
          email: user.email || '',
        });
      } catch (err) {
        console.error('Error in useProfile hook:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
        toast({
          title: "Erro ao carregar perfil",
          description: "Não foi possível carregar as informações do perfil.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [toast]);

  return { profile, loading, error };
};

export default useProfile;
