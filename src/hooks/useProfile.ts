
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Profile } from '@/types/database.types';

export const useProfile = (userId?: string) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Fetch the profile data
        const { data, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (profileError) {
          if (profileError.code !== 'PGRST116') { // Not found - not an error for us
            console.error('Error fetching profile:', profileError);
            throw new Error(profileError.message);
          }
        }

        if (data) {
          // Cast the data to the Profile type
          setProfile(data as unknown as Profile);
        }
      } catch (err: any) {
        console.error('Failed to fetch profile:', err);
        setError(err);
        toast({
          variant: "destructive",
          title: "Erro ao buscar perfil",
          description: err.message
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [userId, toast]);

  return { profile, isLoading, error, setProfile };
};
