import { supabase } from "@/integrations/supabase/client.ts";
import { STORAGE_KEY } from "@/integrations/supabase/config.ts";

/**
 * Handles the logout process consistently across the application
 * Forces a full page reload to clear all application state
 * Redirects to the root URL based on environment
 */
export const handleLogout = async () => {
  try {
    console.log("Iniciando processo de logout...");
    
    // Limpar qualquer estado local antes do logout
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
    
    // Sign out from Supabase
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error("Erro ao fazer logout do Supabase:", error);
      // Mesmo com erro, vamos tentar redirecionar o usuário
      window.location.href = '/';
      return false;
    }
    
    console.log("Logout do Supabase bem-sucedido, redirecionando...");
    
    // Pequeno atraso para garantir que todas as operações sejam concluídas
    setTimeout(() => {
      // Force redirect to the root domain to ensure proper logout
      window.location.href = '/';
    }, 100);
    
    return true;
  } catch (error) {
    console.error("Erro completo durante o logout:", error);
    // Mesmo com erro, vamos tentar redirecionar o usuário
    window.location.href = '/';
    return false;
  }
};

/**
 * Gets the current session user ID
 * @returns The user ID or null if no session exists
 */
export const getUserSession = async (): Promise<string | null> => {
  try {
    const { data } = await supabase.auth.getSession();
    return data.session?.user?.id || null;
  } catch (error) {
    console.error("Error getting user session:", error);
    return null;
  }
};
