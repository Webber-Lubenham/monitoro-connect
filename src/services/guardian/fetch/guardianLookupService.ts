
import { dbClient, logOperation } from '../../base/baseService';
import { Guardian } from '@/types/database.types';
import { asType } from '@/integrations/supabase/supabaseClient';

/**
 * Get a guardian's details by ID
 */
export const getGuardianById = async (guardianId: string): Promise<Guardian | null> => {
  try {
    logOperation(`Buscando responsável com ID ${guardianId}`);
    
    const { data, error } = await dbClient
      .from('guardians')
      .select('*')
      .eq('id', guardianId)
      .single();
    
    if (error) {
      logOperation(`Erro ao buscar responsável: ${error.message}`);
      return null;
    }
    
    return asType<Guardian>(data);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logOperation(`Exceção em getGuardianById: ${errorMessage}`);
    return null;
  }
};

/**
 * Get a guardian with student information by ID
 * Fetches guardian and student data in separate queries to avoid join issues
 */
export const getGuardianWithStudentInfo = async (guardianId: string): Promise<(Guardian & { student_name?: string }) | null> => {
  try {
    logOperation(`Buscando responsável com informações do estudante para ID ${guardianId}`);
    
    // First, get the guardian data
    const guardian = await getGuardianById(guardianId);
    
    if (!guardian) {
      logOperation(`Responsável não encontrado com ID: ${guardianId}`);
      return null;
    }
    
    // Then get the student name in a separate query
    let studentName: string | undefined;
    if (guardian.student_id) {
      const { data: profileData, error: profileError } = await dbClient
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', guardian.student_id)
        .single();
      
      if (profileError) {
        logOperation(`Erro ao buscar nome do estudante: ${profileError.message}`);
      } else if (profileData) {
        // Construct name from first_name and last_name
        studentName = `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim() || undefined;
      }
    }
    
    // Return guardian with student name
    return {
      ...guardian,
      student_name: studentName
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logOperation(`Exceção em getGuardianWithStudentInfo: ${errorMessage}`);
    return null;
  }
};
