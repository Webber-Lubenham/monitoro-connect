
import { supabase } from '@/integrations/supabase/client';
import { Guardian } from '@/types/database.types';

// Safely get a property with fallback
const safeGet = <T, K extends keyof T>(obj: T | null | undefined, key: K, fallback: T[K]): T[K] => {
  if (!obj) return fallback;
  return obj[key] !== undefined && obj[key] !== null ? obj[key] : fallback;
};

/**
 * Gets a list of guardians for notification purposes
 * 
 * @param studentId The ID of the student
 * @returns A list of guardians with their notification info
 */
export const getGuardiansForNotification = async (studentId: string): Promise<Guardian[]> => {
  try {
    console.log(`Fetching guardians for student: ${studentId}`);
    
    const { data, error } = await supabase
      .from('guardians')
      .select('*')
      .eq('student_id', studentId);
    
    if (error) {
      console.error('Error fetching guardians for notification:', error);
      return [];
    }
    
    if (!data || data.length === 0) {
      console.warn('No guardians found for student:', studentId);
      return [];
    }
    
    // Map DB response to expected Guardian type and ensure all fields have values
    const guardians = data.map(guardian => ({
      id: guardian.id,
      student_id: safeGet(guardian, 'student_id', studentId),
      nome: safeGet(guardian, 'nome', 'Responsável'),
      telefone: safeGet(guardian, 'telefone', ''),
      email: safeGet(guardian, 'email', ''),
      is_primary: safeGet(guardian, 'is_primary', false),
      created_at: safeGet(guardian, 'created_at', new Date().toISOString()),
      updated_at: safeGet(guardian, 'updated_at', new Date().toISOString()),
      cpf: safeGet(guardian, 'cpf', ''),
      guardian_id: safeGet(guardian, 'guardian_id', undefined),
      status: safeGet(guardian, 'status', 'pending'),
      temp_password: safeGet(guardian, 'temp_password', undefined),
      whatsapp_number: safeGet(guardian, 'whatsapp_number', undefined),
      sms_number: safeGet(guardian, 'sms_number', undefined),
      invitation_sent_at: safeGet(guardian, 'invitation_sent_at', undefined),
      phone: safeGet(guardian, 'phone', ''),
      document_type: safeGet(guardian, 'document_type', null),
      document_number: safeGet(guardian, 'document_number', null)
    }));
    
    return guardians as Guardian[];
  } catch (error) {
    console.error('Exception fetching guardians for notification:', error);
    return [];
  }
};

/**
 * Get a list of primary guardians (first preference for notifications)
 */
export const getPrimaryGuardians = async (studentId: string): Promise<Guardian[]> => {
  try {
    const { data, error } = await supabase
      .from('guardians')
      .select('*')
      .eq('student_id', studentId)
      .eq('is_primary', true);
    
    if (error) {
      console.error('Error fetching primary guardians:', error);
      return [];
    }
    
    if (!data || data.length === 0) {
      console.warn('No primary guardians found for student:', studentId);
      return [];
    }

    // Map DB response to expected Guardian type
    const guardians = data.map(guardian => ({
      id: guardian.id,
      student_id: safeGet(guardian, 'student_id', studentId),
      nome: safeGet(guardian, 'nome', 'Responsável'),
      telefone: safeGet(guardian, 'telefone', ''),
      email: safeGet(guardian, 'email', ''),
      is_primary: true,
      created_at: safeGet(guardian, 'created_at', new Date().toISOString()),
      updated_at: safeGet(guardian, 'updated_at', new Date().toISOString()),
      cpf: safeGet(guardian, 'cpf', ''),
      guardian_id: safeGet(guardian, 'guardian_id', undefined),
      status: safeGet(guardian, 'status', 'pending'),
      temp_password: safeGet(guardian, 'temp_password', undefined),
      whatsapp_number: safeGet(guardian, 'whatsapp_number', undefined),
      sms_number: safeGet(guardian, 'sms_number', undefined),
      invitation_sent_at: safeGet(guardian, 'invitation_sent_at', undefined),
      phone: safeGet(guardian, 'phone', ''),
      document_type: safeGet(guardian, 'document_type', null),
      document_number: safeGet(guardian, 'document_number', null)
    }));
    
    return guardians as Guardian[];
  } catch (error) {
    console.error('Exception fetching primary guardians:', error);
    return [];
  }
};

// Add the missing exports required by notificationService.ts
export const notifyGuardianViaEmail = async (
  guardianEmail: string,
  subject: string,
  message: string
): Promise<boolean> => {
  try {
    console.log(`Sending email notification to ${guardianEmail}: ${subject}`);
    // In a real implementation, you would send an email here
    // For now, just log and return success
    return true;
  } catch (error) {
    console.error('Error sending email notification:', error);
    return false;
  }
};

export const notifyAllGuardiansViaEmail = async (
  studentId: string,
  subject: string,
  message: string
): Promise<boolean> => {
  try {
    const guardians = await getGuardiansForNotification(studentId);
    
    if (!guardians || guardians.length === 0) {
      console.warn('No guardians to notify for student:', studentId);
      return false;
    }
    
    const results = await Promise.all(
      guardians.map(guardian => 
        guardian.email ? notifyGuardianViaEmail(guardian.email, subject, message) : Promise.resolve(false)
      )
    );
    
    return results.some(result => result);
  } catch (error) {
    console.error('Error notifying all guardians:', error);
    return false;
  }
};
