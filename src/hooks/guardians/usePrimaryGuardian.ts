
import { useCallback } from 'react';
import { dbClient } from '@/services/base/baseService';
import * as guardianService from '@/services/guardianService';
import { useGuardianUtils } from './utils/useGuardianUtils';

/**
 * Hook for managing primary guardian functionality
 */
export const usePrimaryGuardian = (
  loadGuardians: () => Promise<void>
) => {
  const { checkSession, showToast } = useGuardianUtils();

  const setPrimaryGuardian = useCallback(async (id: string, studentId: string) => {
    try {
      const userId = await checkSession();
      
      if (!userId) {
        return;
      }

      // Verificar se o usuário é um estudante
      const { data: profile } = await dbClient
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (profile?.role === 'student') {
        showToast(
          "Acesso não autorizado",
          "Apenas responsáveis podem definir o responsável principal.",
          "destructive"
        );
        return;
      }

      await guardianService.updatePrimaryStatus(studentId, id);
      await loadGuardians();
      
      showToast(
        "Sucesso",
        "Responsável principal atualizado com sucesso."
      );
    } catch (error: any) {
      showToast(
        "Erro",
        "Não foi possível atualizar o responsável principal. Tente novamente mais tarde.",
        "destructive"
      );
    }
  }, [checkSession, loadGuardians, showToast]);

  return {
    setPrimaryGuardian
  };
};
