
import { supabase } from './client';

/**
 * Simplified interface for Supabase user to avoid type complexity
 */
export interface SimpleSupabaseUser {
  id: string;
  email?: string;
}

/**
 * Find a user by email in Supabase 
 * Using a more robust approach that works even with partial database schema
 */
export const findUserByEmail = async (email: string): Promise<string | null> => {
  if (!email) return null;
  
  try {
    const normalizedEmail = email.toLowerCase().trim();
    console.log('Procurando usuário pelo email:', normalizedEmail);
    
    // Primeiro: verificar diretamente nos registros de autenticação
    try {
      const { data: authUsers } = await supabase.auth.admin.listUsers({
        filter: {
          email: normalizedEmail
        }
      });
      
      if (authUsers?.users && authUsers.users.length > 0) {
        console.log('Usuário encontrado no sistema de autenticação:', authUsers.users[0].id);
        return authUsers.users[0].id;
      }
    } catch (adminError) {
      console.log('Admin API não disponível ou erro:', adminError);
    }
    
    // Alternativa: verificar na tabela de perfis
    try {
      // Tenta obter dados da tabela de perfis com várias colunas possíveis (para flexibilidade)
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', normalizedEmail)
        .maybeSingle();
      
      if (profileError) {
        console.log('Erro ao buscar perfil:', profileError);
      } else if (profileData) {
        console.log('Usuário encontrado na tabela de perfis:', profileData.id);
        return profileData.id;
      }
    } catch (profileQueryError) {
      console.log('Erro na consulta de perfis:', profileQueryError);
    }
    
    // Último recurso: Verificar usando a função get_profile_by_email
    try {
      const { data: rpcData, error: rpcError } = await supabase.rpc('get_profile_by_email', { 
        email_param: normalizedEmail 
      });
      
      if (rpcError) {
        console.log('Erro na função RPC:', rpcError);
      } else if (rpcData && rpcData.id) {
        console.log('Usuário encontrado via RPC:', rpcData.id);
        return rpcData.id;
      }
    } catch (rpcCallError) {
      console.log('Erro ao chamar RPC:', rpcCallError);
    }
    
    console.log('Usuário não encontrado com o email:', email);
    return null;
  } catch (error) {
    console.error('Erro ao buscar usuário por email:', error);
    return null;
  }
};

/**
 * Verificar se a senha está correta para um determinado email
 */
export const verifyPassword = async (email: string, password: string): Promise<boolean> => {
  try {
    // Testamos o login sem alterar o estado da aplicação
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password
    });
    
    // Se não houver erro e tivermos dados do usuário, a senha está correta
    return !error && !!data.user;
  } catch (error) {
    console.error('Erro ao verificar senha:', error);
    return false;
  }
};
