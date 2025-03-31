
import { Guardian } from '@/types/database.types';
import { retryOperation, dbClient, logOperation } from '../../base/baseService';

/**
 * Get guardians for a specific user by user ID
 */
export const getGuardians = async (userId: string): Promise<Guardian[]> => {
  try {
    logOperation(`Fetching guardians for user ID: ${userId}`);
    
    const response = await dbClient
      .from('guardians')
      .select('*')
      .eq('student_id', userId);
    
    if (response.error) {
      logOperation(`Error fetching guardians: ${response.error.message}`, response.error);
      console.error('Error in getGuardians query:', response.error);
      return [];
    }
    
    logOperation(`Retrieved ${response.data?.length || 0} guardians`);
    console.log('Guardian data retrieved:', response.data);
    
    return response.data as Guardian[] || [];
  } catch (error) {
    console.error('Exception in getGuardians:', error);
    return [];
  }
};

/**
 * Check if a guardian with the specified email already exists for this student
 */
export const checkExistingGuardian = async (userId: string, email: string): Promise<Guardian[]> => {
  try {
    logOperation(`Checking existing guardian for user ${userId} and email ${email}`);
    
    const response = await dbClient
      .from('guardians')
      .select('*')
      .eq('student_id', userId)
      .eq('email', email.trim().toLowerCase());
    
    if (response.error) {
      logOperation(`Error checking existing guardian: ${response.error.message}`);
      console.error('Error in checkExistingGuardian query:', response.error);
      return [];
    }
    
    logOperation(`Found ${response.data?.length || 0} existing guardians with email ${email}`);
    return response.data as Guardian[] || [];
  } catch (error) {
    console.error('Exception in checkExistingGuardian:', error);
    return [];
  }
};
