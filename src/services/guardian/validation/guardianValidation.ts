
import { GuardianData } from '../mutations/addGuardian';
import { dbClient } from '../../base/baseService';

/**
 * Verifica se um responsável já existe para um aluno pelo email
 */
export const checkExistingGuardianByEmail = async (
  studentId: string,
  email: string
): Promise<boolean> => {
  const normalizedEmail = email.toLowerCase().trim();
  
  try {
    // Skip destructuring to avoid deep type inference
    const response = await dbClient
      .from('guardians')
      .select('id')
      .eq('student_id', studentId)
      .eq('email', normalizedEmail)
      .maybeSingle();
      
    if (response.error) {
      console.error('Error checking existing guardian by email:', response.error);
      return false;
    }
    
    return !!response.data;
  } catch (e) {
    console.error('Exception in checkExistingGuardianByEmail:', e);
    return false;
  }
};

/**
 * Verifica se um responsável já existe para um aluno pelo CPF
 */
export const checkExistingGuardianByCpf = async (
  studentId: string,
  cpf: string
): Promise<boolean> => {
  if (!cpf) return false;
  
  try {
    // Execute the query and get the response directly
    const response = await dbClient
      .from('guardians')
      .select('id')
      .eq('student_id', studentId)
      .eq('cpf', cpf)
      .maybeSingle();
      
    if (response.error) {
      console.error('Error checking existing guardian by CPF:', response.error);
      return false;
    }
    
    return !!response.data;
  } catch (e) {
    console.error('Exception in checkExistingGuardianByCpf:', e);
    return false;
  }
};

// Simple interface for student data
interface StudentProfileData {
  id: string;
  name?: string;
  email?: string;
}

/**
 * Verifica se o aluno existe
 */
export const verifyStudentExists = async (studentId: string): Promise<{exists: boolean, studentData?: StudentProfileData}> => {
  try {
    // Skip destructuring to avoid deep type inference
    const response = await dbClient
      .from('profiles')
      .select('id, name, email')
      .eq('id', studentId)
      .maybeSingle();
      
    if (response.error) {
      console.error(`Error verifying student: ${response.error.message}`);
      return { exists: false };
    }
    
    if (!response.data) {
      return { exists: false };
    }
    
    // Map the data to our interface with proper type handling
    const studentData: StudentProfileData = {
      id: response.data.id,
      name: response.data.name || undefined,  // Convert null to undefined
      email: response.data.email || undefined // Convert null to undefined
    };
    
    return { 
      exists: true, 
      studentData 
    };
  } catch (error) {
    console.error('Exception in verifyStudentExists:', error);
    return { exists: false };
  }
};
