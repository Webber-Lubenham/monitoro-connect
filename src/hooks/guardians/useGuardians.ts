
import { useGuardianLoader } from './useGuardianLoader';
import { useGuardianAddition } from './useGuardianAddition';
import { useGuardianRemoval } from './useGuardianRemoval';
import { usePrimaryGuardian } from './usePrimaryGuardian';
import { useGuardianInvitation } from './useGuardianInvitation';
import { UseGuardiansReturn } from './types';
import { useCallback } from 'react';
import { GuardianForm } from '@/types/database.types';

/**
 * Main hook for guardian management
 * Combines all the specialized guardian hooks into one easy-to-use API
 */
export const useGuardians = (): UseGuardiansReturn => {
  const { 
    guardians, 
    isLoading, 
    loadGuardians: originalLoadGuardians
  } = useGuardianLoader();

  // Wrap loadGuardians to ensure we don't cause infinite loops
  const loadGuardians = useCallback(async () => {
    return await originalLoadGuardians();
  }, [originalLoadGuardians]);

  const { 
    errors,
    addGuardian: originalAddGuardian 
  } = useGuardianAddition(loadGuardians);

  // Wrap addGuardian to handle loading state
  const addGuardian = useCallback(async (data: GuardianForm) => {
    const result = await originalAddGuardian(data);
    return result;
  }, [originalAddGuardian]);

  const { 
    removeGuardian: originalRemoveGuardian
  } = useGuardianRemoval(loadGuardians);

  // Wrap removeGuardian to handle loading state
  const removeGuardian = useCallback(async (id: string) => {
    await originalRemoveGuardian(id);
  }, [originalRemoveGuardian]);

  const { 
    setPrimaryGuardian: rawSetPrimaryGuardian
  } = usePrimaryGuardian(loadGuardians);

  // Wrapper for setPrimaryGuardian to handle getting the studentId from the guardian
  const setPrimaryGuardian = useCallback(async (id: string) => {
    const guardian = guardians.find(g => g.id === id);
    if (!guardian) return;
    
    await rawSetPrimaryGuardian(id, guardian.student_id);
  }, [guardians, rawSetPrimaryGuardian]);

  // Add the invitation functionality
  const {
    sendGuardianInvitation: originalSendInvitation,
    isSending
  } = useGuardianInvitation();

  // Wrap sendGuardianInvitation to match the expected return type (void instead of boolean)
  const sendGuardianInvitation = useCallback(async (id: string) => {
    await originalSendInvitation(id);
  }, [originalSendInvitation]);

  return {
    guardians,
    isLoading,
    errors,
    loadGuardians,
    addGuardian,
    removeGuardian,
    setPrimaryGuardian,
    sendGuardianInvitation
  };
};
