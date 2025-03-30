
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { handleLogout } from '@/utils/authUtils';

/**
 * Utility hook with common guardian-related functionality
 */
export const useGuardianUtils = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
      
    if (!session?.user?.id) {
      console.error('No session found, redirecting to auth');
      window.location.href = window.location.origin; // Force complete reload to clear any state
      return null;
    }
    
    return session.user.id;
  };

  const logout = async () => {
    try {
      toast({
        title: "Saindo do sistema",
        description: "Você será redirecionado em instantes...",
      });
      return await handleLogout();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast({
        variant: "destructive",
        title: "Erro ao sair",
        description: "Não foi possível sair do sistema. Tente novamente."
      });
      return false;
    }
  };

  const showToast = (title: string, description: string, variant: "default" | "destructive" = "default") => {
    toast({
      title,
      description,
      variant,
    });
  };

  return {
    checkSession,
    showToast,
    navigate,
    logout
  };
};
