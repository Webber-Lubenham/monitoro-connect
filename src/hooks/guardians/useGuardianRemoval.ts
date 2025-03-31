
import { useCallback } from 'react';
import { dbClient } from '@/services/base/baseService';
import * as guardianService from '@/services/guardianService';
import { useGuardianUtils } from './utils/useGuardianUtils';

/**
 * Hook for removing guardians
 */
export const useGuardianRemoval = (
  loadGuardians: () => Promise<void>
) => {
  const { checkSession, showToast } = useGuardianUtils();

  const removeGuardian = useCallback(async (id: string) => {
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
          "Apenas responsáveis podem remover outros responsáveis.",
          "destructive"
        );
        return;
      }

      // Here we pass both the guardian id and the student id (which is the user id for a student)
      await guardianService.deleteGuardian(id, userId);
      await loadGuardians();
      
      showToast(
        "Sucesso",
        "Responsável removido com sucesso."
      );
    } catch (error: any) {
      showToast(
        "Erro",
        "Não foi possível remover o responsável. Tente novamente mais tarde.",
        "destructive"
      );
    }
  }, [checkSession, loadGuardians, showToast]);

  return {
    removeGuardian
  };
};
