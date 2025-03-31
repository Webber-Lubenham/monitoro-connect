
// Re-export all guardian services from the new modular structure
export * from './guardian';

// Re-export specific functions that are being used in other parts of the application
export { 
  addGuardian as createGuardian,
  removeGuardian as deleteGuardian,
  updateGuardian as updateGuardianInfo
} from './guardian/guardianMutationService';

// Export additional functions needed
export const updatePrimaryStatus = async (studentId: string, guardianId: string): Promise<boolean> => {
  // Import dynamically to avoid circular dependencies
  const { updateGuardian } = await import('./guardian/guardianMutationService');
  
  try {
    // First, reset primary status for all guardians of this student
    const { dbClient } = await import('./base/baseService');
    await dbClient
      .from('guardians')
      .update({ is_primary: false })
      .eq('student_id', studentId);
    
    // Then set the specific guardian as primary
    return await updateGuardian(guardianId, { is_primary: true });
  } catch (error) {
    console.error('Error in updatePrimaryStatus:', error);
    return false;
  }
};

// Additional function for checking existing guardians by email
export const checkExistingGuardian = async (studentId: string, email: string) => {
  const { dbClient } = await import('./base/baseService');
  const { data, error } = await dbClient
    .from('guardians')
    .select('*')
    .eq('student_id', studentId)
    .eq('email', email.toLowerCase());
  
  if (error) {
    console.error('Error checking existing guardian:', error);
    return null;
  }
  
  return data;
};

// New function for checking existing guardians by CPF
export const checkExistingGuardianByCpf = async (studentId: string, cpf: string) => {
  const { dbClient } = await import('./base/baseService');
  const { data, error } = await dbClient
    .from('guardians')
    .select('*')
    .eq('student_id', studentId)
    .eq('cpf', cpf);
  
  if (error) {
    console.error('Error checking existing guardian by CPF:', error);
    return null;
  }
  
  return data;
};
