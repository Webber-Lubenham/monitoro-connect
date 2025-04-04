
import { useState, useCallback } from 'react';
import { GuardianForm } from '@/types/database.types';
import * as guardianService from '@/services/guardianService';
import { validateGuardianForm } from '@/utils/validations/guardianValidation';
import { FormErrors } from './types';
import { useGuardianUtils } from './utils/useGuardianUtils';

/**
 * Hook for adding new guardians
 */
export const useGuardianAddition = (
  loadGuardians: () => Promise<void>
) => {
  const [errors, setErrors] = useState<FormErrors>({});
  const { checkSession, showToast } = useGuardianUtils();

  const addGuardian = useCallback(async (newGuardian: GuardianForm) => {
    try {
      const userId = await checkSession();
      
      if (!userId) {
        return false;
      }

      const validationErrors = validateGuardianForm(newGuardian);
      setErrors(validationErrors);
      
      if (Object.keys(validationErrors).length > 0) {
        return false;
      }

      // Check if guardian with same email exists
      const existingGuardians = await guardianService.checkExistingGuardian(
        userId, 
        newGuardian.email
      );

      if (existingGuardians && existingGuardians.length > 0) {
        showToast(
          "Responsável já existe",
          "Um responsável com este email já está cadastrado.",
          "destructive"
        );
        return false;
      }

      // If CPF is provided, check if guardian with same CPF exists
      if (newGuardian.cpf) {
        const existingGuardiansByCpf = await guardianService.checkExistingGuardianByCpf(
          userId,
          newGuardian.cpf
        );

        if (existingGuardiansByCpf && existingGuardiansByCpf.length > 0) {
          showToast(
            "Responsável já existe",
            "Um responsável com este CPF já está cadastrado.",
            "destructive"
          );
          return false;
        }
      }

      const result = await guardianService.createGuardian(userId, {
        nome: newGuardian.nome.trim(),
        telefone: newGuardian.telefone.trim(),
        email: newGuardian.email.trim().toLowerCase(),
        is_primary: newGuardian.is_primary,
        cpf: newGuardian.cpf?.trim()
      });

      if (result.success) {
        showToast(
          "Responsável adicionado",
          "O responsável foi adicionado com sucesso e receberá um email com instruções de acesso."
        );

        await loadGuardians();
        return true;
      } else {
        showToast(
          "Erro ao adicionar responsável",
          "Não foi possível adicionar o responsável. Tente novamente mais tarde.",
          "destructive"
        );
        return false;
      }
    } catch (error: any) {
      console.error('Erro ao adicionar responsável:', error);
      showToast(
        "Erro ao adicionar responsável",
        "Não foi possível adicionar o responsável. Tente novamente mais tarde.",
        "destructive"
      );
      return false;
    }
  }, [checkSession, loadGuardians, showToast]);

  return {
    errors,
    setErrors,
    addGuardian
  };
};
