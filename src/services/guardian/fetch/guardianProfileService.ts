
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
      .select('first_name, last_name, email')
      .eq('id', studentId)
      .maybeSingle();
    
    if (!profileResponse.error && profileResponse.data) {
      // Try to build name from first and last name
      if (profileResponse.data.first_name || profileResponse.data.last_name) {
        const name = `${profileResponse.data.first_name || ''} ${profileResponse.data.last_name || ''}`.trim();
        if (name) {
          logOperation(`Found student name in profiles: ${name}`);
          return name;
        }
      }
      
      // Try to use email as fallback
      if (profileResponse.data.email) {
        logOperation(`Using email as student name: ${profileResponse.data.email}`);
        return profileResponse.data.email;
      }
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
