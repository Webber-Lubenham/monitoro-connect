
import { supabase } from './client';
import { safeQuery, safeDataExtract } from './safeQueryBuilder';

/**
 * Finds a user in the database by their email address.
 * This is a safe utility that works with both the auth.users and profiles tables.
 */
export const findUserByEmail = async (email: string): Promise<any | null> => {
  try {
    // First attempt to find the user in the auth schema
    const { data: authUser, error: authError } = await supabase.auth.admin.getUserByEmail(email);

    if (!authError && authUser) {
      return authUser;
    }

    // If not found in auth or not accessible, try profiles table
    const { data: profile, error: profileError } = await safeQuery
      .from('profiles')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (profileError) {
      console.error('Error finding user by email:', profileError);
      return null;
    }

    if (profile) {
      return profile;
    }

    // As a final attempt, check other possible tables
    return null;
  } catch (error) {
    console.error('Exception in findUserByEmail:', error);
    return null;
  }
};

/**
 * A safer way to get user by ID that works with multiple tables
 */
export const getUserById = async (userId: string): Promise<any | null> => {
  try {
    // Try to get from profiles first
    const result = await safeQuery
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    return safeDataExtract(result);
  } catch (error) {
    console.error('Error getting user by ID:', error);
    return null;
  }
};
