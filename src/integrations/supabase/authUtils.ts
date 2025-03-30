
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
 * Using a more reliable approach that doesn't require admin privileges
 */
export const findUserByEmail = async (email: string): Promise<string | null> => {
  try {
    // Instead of trying to list all users (which requires admin privileges),
    // we'll query the profiles table which should have the same information
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('email', email.toLowerCase())
      .single();
    
    if (error) {
      console.error('Error finding user by email:', error);
      return null;
    }
    
    return data?.id || null;
  } catch (error) {
    console.error('Error finding user by email:', error);
    return null;
  }
};
