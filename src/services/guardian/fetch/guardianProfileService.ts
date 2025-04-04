
import { logOperation } from '../../base/baseService';
import { dbClient } from '../../base/baseService';

/**
 * Get student name by ID
 */
export const getStudentName = async (studentId: string): Promise<string> => {
  try {
    logOperation(`Fetching student name for ID: ${studentId}`);
    
    // Try profiles table first
    const profileResponse = await dbClient
      .from('profiles')
      .select('full_name, name, email')
      .eq('id', studentId)
      .maybeSingle();
    
    if (!profileResponse.error && profileResponse.data) {
      // Try to get full_name first, then name, then email as fallback
      const name = profileResponse.data.full_name || 
                   profileResponse.data.name || 
                   profileResponse.data.email;
      if (name) {
        logOperation(`Found student name in profiles: ${name}`);
        return name;
      }
    }
    
    // Then try children table
    const childrenResponse = await dbClient
      .from('children')
      .select('name')
      .eq('id', studentId)
      .maybeSingle();
    
    if (!childrenResponse.error && childrenResponse.data?.name) {
      logOperation(`Found student name in children: ${childrenResponse.data.name}`);
      return childrenResponse.data.name;
    }
    
    // Try to get user email directly from auth
    const { data: userData } = await dbClient.auth.getUser(studentId);
    if (userData?.user?.email) {
      const email = userData.user.email;
      logOperation(`Found student email from auth: ${email}`);
      return email.split('@')[0]; // Use part before @ as name
    }
    
    logOperation(`Could not find student name in any table for ID: ${studentId}`);
    return 'Aluno';
  } catch (error) {
    console.error('Error in getStudentName:', error);
    return 'Aluno';
  }
};
