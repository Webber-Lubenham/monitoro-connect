
import { useState, useCallback, useRef } from 'react';
import { Guardian } from '@/types/database.types';
import * as guardianService from '@/services/guardianService';
import { useGuardianUtils } from './utils/useGuardianUtils';

/**
 * Hook for loading guardian data from the API
 */
export const useGuardianLoader = () => {
  const [guardians, setGuardians] = useState<Guardian[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { checkSession, showToast } = useGuardianUtils();
  const isLoadingRef = useRef(false); // Prevents concurrent load operations

  const loadGuardians = useCallback(async () => {
    // Prevent multiple simultaneous calls
    if (isLoadingRef.current) {
      return;
    }
    
    try {
      isLoadingRef.current = true;
      setIsLoading(true);
      const userId = await checkSession();
      
      if (!userId) {
        isLoadingRef.current = false;
        setIsLoading(false);
        return;
      }

      console.log('Loading guardians for user ID:', userId);

      try {
        const data = await guardianService.getGuardians(userId);
        console.log('Guardians data received:', data);
        
        if (!Array.isArray(data)) {
          console.error('Expected array of guardians but received:', data);
          setGuardians([]);
          return;
        }
        
        // Apply data validation and normalization
        const validGuardians = data
          .filter(guardian => 
            guardian && 
            guardian.nome && 
            guardian.email
          )
          .map(guardian => ({
            ...guardian,
            email: guardian.email?.toLowerCase().trim() || '',
            telefone: guardian.telefone || '',
            is_primary: Boolean(guardian.is_primary)
          }));
        
        setGuardians(validGuardians);
        
        if (validGuardians.length === 0) {
          console.log('No guardians found for this user');
        } else {
          console.log(`Found ${validGuardians.length} guardians for this user`);
        }
      } catch (error: any) {
        console.error('Error in guardianService.getGuardians:', error);
        showToast(
          "Erro ao carregar responsáveis",
          "Não foi possível carregar os responsáveis. Tente novamente mais tarde.",
          "destructive"
        );
      }
    } catch (error: any) {
      console.error('Error fetching guardians:', error);
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  }, [checkSession, showToast]);

  return {
    guardians,
    setGuardians,
    isLoading,
    loadGuardians
  };
};
