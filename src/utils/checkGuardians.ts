
import { dbClient } from '@/services/base/baseService';
import * as guardianService from '@/services/guardianService';

export const ensureGuardianExists = async (studentId: string, guardianData: any) => {
  // Check if guardian exists
  const { data: existingGuardians } = await dbClient
    .from('guardians')
    .select('*')
    .eq('student_id', studentId)
    .eq('email', guardianData.email);

  // If guardian doesn't exist, create it
  if (!existingGuardians || existingGuardians.length === 0) {
    return await guardianService.createGuardian(studentId, {
      nome: guardianData.nome,
      email: guardianData.email,
      telefone: guardianData.telefone || null,
      is_primary: guardianData.isPrimary || false
    });
  }

  return true;
};
