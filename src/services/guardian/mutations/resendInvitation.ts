
import { dbClient, logOperation } from '../../base/baseService';
import { getGuardianWithStudentInfo } from '../fetch/guardianLookupService';
import { getAuthHeaders } from '@/integrations/supabase/client';

export const resendGuardianInvitation = async (
  guardianId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    logOperation(`Reenviando convite para o responsável com ID ${guardianId}`);
    
    // Get guardian details with student info
    const guardianInfo = await getGuardianWithStudentInfo(guardianId);
    
    if (!guardianInfo) {
      logOperation(`Responsável não encontrado com ID: ${guardianId}`);
      return { success: false, error: 'Responsável não encontrado' };
    }
    
    // Generate a new temporary password
    const tempPassword = Math.random().toString(36).slice(-8);
    
    // Update the guardian's temp_password
    const { error: updateError } = await dbClient
      .from('guardians')
      .update({ 
        temp_password: tempPassword,
        updated_at: new Date().toISOString()
      })
      .eq('id', guardianId);
    
    if (updateError) {
      logOperation(`Erro ao atualizar senha temporária: ${updateError.message}`);
      return { success: false, error: updateError.message };
    }
    
    // Get auth headers to ensure proper authorization
    const authHeaders = await getAuthHeaders();
    
    // Call the consolidated email-service function instead of send-guardian-invitation
    const { data, error: inviteError } = await dbClient.functions.invoke('email-service', {
      body: {
        type: 'guardian-invitation',
        data: {
          guardianEmail: guardianInfo.email,
          guardianName: guardianInfo.nome,
          studentName: guardianInfo.student_name || 'aluno',
          tempPassword: tempPassword,
          guardianCpf: guardianInfo.cpf
        }
      },
      headers: authHeaders
    });
    
    if (inviteError) {
      logOperation(`Erro ao enviar email de convite: ${inviteError.message}`);
      return { success: false, error: inviteError.message };
    }
    
    logOperation(`Convite reenviado com sucesso para ${guardianInfo.email}`);
    return { success: true };
    
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logOperation(`Exceção em resendGuardianInvitation: ${errorMessage}`);
    console.error('Error in resendGuardianInvitation:', error);
    return { success: false, error: errorMessage };
  }
};
