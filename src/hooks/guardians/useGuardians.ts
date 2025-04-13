
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Guardian } from '@/types/database.types';
import { useToast } from '@/components/ui/use-toast';

export const useGuardians = (studentId?: string) => {
  const [guardians, setGuardians] = useState<Guardian[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchGuardians = useCallback(async () => {
    if (!studentId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('guardians')
        .select('*')
        .eq('student_id', studentId);

      if (fetchError) {
        console.error('Error fetching guardians:', fetchError);
        setError(fetchError.message);
        toast({
          title: 'Erro ao carregar responsáveis',
          description: fetchError.message,
          variant: 'destructive',
        });
        return;
      }

      // Ensure we don't have null values in our data
      const safeGuardians = data?.map(guardian => ({
        ...guardian,
        nome: guardian.nome || 'Sem nome',
        email: guardian.email || '',
        telefone: guardian.telefone || '',
        status: guardian.status || 'pending',
        created_at: guardian.created_at || new Date().toISOString(),
        updated_at: guardian.updated_at || new Date().toISOString(),
      })) || [];

      setGuardians(safeGuardians as Guardian[]);
    } catch (e) {
      console.error('Exception in fetchGuardians:', e);
      const errorMessage = e instanceof Error ? e.message : 'Erro desconhecido';
      setError(errorMessage);
      toast({
        title: 'Erro ao carregar responsáveis',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [studentId, toast]);

  useEffect(() => {
    fetchGuardians();
  }, [fetchGuardians]);

  return {
    guardians,
    loading,
    error,
    refreshGuardians: fetchGuardians,
  };
};
