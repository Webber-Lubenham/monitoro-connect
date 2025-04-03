
import { dbClient } from '../../base/baseService';
import { asType } from '@/integrations/supabase/supabaseClient';
import { Profile } from '@/types/database.types';

/**
 * Check if a guardian email already exists for a student
 */
export const checkGuardianEmailExists = async (studentId: string, email: string): Promise<boolean> => {
  try {
    const formattedEmail = email.toLowerCase().trim();
    
    const { data, error } = await dbClient
      .from('guardians')
      .select('id')
      .eq('student_id', studentId)
      .eq('email', formattedEmail);
    
    if (error) {
      console.error('Error checking guardian email:', error);
      return false;
    }
    
    return (data?.length || 0) > 0;
  } catch (error) {
    console.error('Exception checking guardian email:', error);
    return false;
  }
};

/**
 * Check if a guardian with the specified CPF already exists for this student
 */
export const checkGuardianCpfExists = async (studentId: string, cpf: string): Promise<boolean> => {
  try {
    const formattedCpf = cpf.replace(/[^\d]/g, '').trim();
    
    if (!formattedCpf) {
      return false;
    }
    
    const { data, error } = await dbClient
      .from('guardians')
      .select('id')
      .eq('student_id', studentId)
      .eq('cpf', formattedCpf);
    
    if (error) {
      console.error('Error checking guardian CPF:', error);
      return false;
    }
    
    return (data?.length || 0) > 0;
  } catch (error) {
    console.error('Exception checking guardian CPF:', error);
    return false;
  }
};

/**
 * Check if a guardian with the specified email already exists
 * This function is used by other services and exported with a different name
 */
export const checkExistingGuardianByEmail = async (studentId: string, email: string): Promise<boolean> => {
  return checkGuardianEmailExists(studentId, email);
};

/**
 * Check if a guardian with the specified CPF already exists 
 * This function is used by other services and exported with a different name
 */
export const checkExistingGuardianByCpf = async (studentId: string, cpf: string): Promise<boolean> => {
  return checkGuardianCpfExists(studentId, cpf);
};

/**
 * Check if a student exists and return some basic info
 */
export const verifyStudentExists = async (studentId: string) => {
  try {
    const { data, error } = await dbClient
      .from('profiles')
      .select('first_name, last_name, email')
      .eq('id', studentId)
      .single();
    
    if (error) {
      console.error('Error checking if student exists:', error);
      return { exists: false, studentData: null };
    }
    
    // Ensure we have the correct data type
    const profileData = data as Profile;
    
    // Create a name from first_name and last_name, fallback to 'Aluno'
    const name = `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim() || 'Aluno';
    
    return {
      exists: true,
      studentData: {
        id: studentId,
        name,
        email: profileData.email || ''
      }
    };
  } catch (error) {
    console.error('Exception checking if student exists:', error);
    return { exists: false, studentData: null };
  }
};

/**
 * Get a student's details for displaying in guardian-related UIs
 */
export const getStudentDetailsForGuardians = async (studentId: string) => {
  try {
    const { data, error } = await dbClient
      .from('profiles')
      .select('first_name, last_name, email')
      .eq('id', studentId)
      .single();
    
    if (error) {
      console.error('Error getting student details:', error);
      return {
        id: studentId,
        name: 'Aluno',
        email: ''
      };
    }
    
    // Ensure we have the correct data type
    const profileData = data as Profile;
    
    // Create a name from first_name and last_name, fallback to 'Aluno'
    const name = `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim() || 'Aluno';
    
    return {
      id: studentId,
      name,
      email: profileData.email || ''
    };
  } catch (error) {
    console.error('Exception getting student details:', error);
    return {
      id: studentId,
      name: 'Aluno',
      email: ''
    };
  }
};
