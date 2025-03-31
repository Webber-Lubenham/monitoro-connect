
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useGuardianUtils } from './utils/useGuardianUtils';
import * as guardianService from '@/services/guardianService';

/**
 * Hook for sending invitations to guardians
 */
export const useGuardianInvitation = () => {
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  const { checkSession } = useGuardianUtils();

  const sendGuardianInvitation = useCallback(async (guardianId: string) => {
    setIsSending(true);
    try {
      const userId = await checkSession();
      
      if (!userId) {
        setIsSending(false);
        return false;
      }

      // Get guardian details first to make sure they exist
      const guardian = await guardianService.getGuardianById(guardianId);
      
      if (!guardian) {
        toast({
          title: "Erro ao enviar convite",
          description: "Não foi possível encontrar o responsável selecionado.",
          variant: "destructive"
        });
        setIsSending(false);
        return false;
      }

      // Send invitation using guardianService
      const result = await guardianService.resendGuardianInvitation(guardianId);
      
      if (result.success) {
        toast({
          title: "Convite enviado",
          description: `Convite enviado com sucesso para ${guardian.nome}.`
        });
        setIsSending(false);
        return true;
      } else {
        toast({
          title: "Erro ao enviar convite",
          description: result.error || "Não foi possível enviar o convite. Tente novamente mais tarde.",
          variant: "destructive"
        });
        setIsSending(false);
        return false;
      }
    } catch (error: any) {
      console.error('Erro ao enviar convite:', error);
      toast({
        title: "Erro ao enviar convite",
        description: "Ocorreu um erro ao enviar o convite. Tente novamente mais tarde.",
        variant: "destructive"
      });
      setIsSending(false);
      return false;
    }
  }, [checkSession, toast]);

  return {
    sendGuardianInvitation,
    isSending
  };
};
