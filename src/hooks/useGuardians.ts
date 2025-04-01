
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { useProfile } from '@/hooks/useProfile';

export interface Guardian {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  student_id: string;
  status: string;
  created_at: string;
}

export const useGuardians = () => {
  const [guardians, setGuardians] = useState<Guardian[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useProfile();

  useEffect(() => {
    if (profile?.id) {
      fetchGuardians();
    }
  }, [profile?.id]);

  const fetchGuardians = async () => {
    try {
      setLoading(true);
      
      if (!profile?.id) {
        console.error('No profile ID available');
        return;
      }
      
      console.log(`Loading guardians for user ID: ${profile.id}`);
      
      const { data, error } = await supabase
        .from('guardians')
        .select('*')
        .eq('student_id', profile.id);

      if (error) {
        throw error;
      }

      console.log(`Found ${data.length} guardians for this user`);
      setGuardians(data || []);
    } catch (error) {
      console.error('Error fetching guardians:', error);
      toast({
        title: 'Erro ao carregar responsáveis',
        description: 'Não foi possível obter a lista de responsáveis.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const notifyGuardians = async (
    location: { latitude: number; longitude: number; accuracy?: number }
  ) => {
    try {
      // Ensure we have guardians to notify
      if (guardians.length === 0) {
        toast({
          title: 'Nenhum responsável encontrado',
          description: 'Você precisa cadastrar responsáveis antes de enviar notificações.',
          variant: 'destructive',
        });
        return false;
      }

      // Ensure we have the user's profile
      if (!profile) {
        toast({
          title: 'Perfil não encontrado',
          description: 'Não foi possível obter seu perfil.',
          variant: 'destructive',
        });
        return false;
      }

      // Use the send-location-email function for more reliable delivery
      for (const guardian of guardians) {
        try {
          // Add a small delay between requests to prevent rate limiting
          if (guardian !== guardians[0]) {
            await new Promise(resolve => setTimeout(resolve, 500));
          }

          // Call the Edge Function directly with the CORS header
          const response = await supabase.functions.invoke('send-location-email', {
            body: JSON.stringify({
              studentName: profile.name || profile.email || 'Aluno', // Changed from full_name to name
              guardianEmail: guardian.email,
              guardianName: guardian.nome,
              latitude: location.latitude,
              longitude: location.longitude,
              timestamp: new Date().toISOString(),
              accuracy: location.accuracy,
              trackingId: Math.random().toString(36).substring(2, 15)
            }),
            headers: {
              'Content-Type': 'application/json',
              'Origin': window.location.origin
            }
          });

          if (response.error) {
            console.error('Failed to notify guardian:', guardian.email, response.error);
          } else {
            console.log('Successfully notified guardian:', guardian.email);
          }
        } catch (guardianError) {
          console.error(`Error notifying guardian ${guardian.email}:`, guardianError);
        }
      }

      return true;
    } catch (error) {
      console.error('Error in notification process:', error);
      toast({
        title: 'Erro ao notificar responsáveis',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    guardians,
    loading,
    fetchGuardians,
    notifyGuardians,
  };
};
