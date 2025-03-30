
import { Guardian } from '@/types/database.types';
import { dbClient, logOperation } from '../../base/baseService';
import * as emailService from '@/services/email/emailService';

export interface GuardianUpdateData {
  nome?: string;
  telefone?: string;
  email?: string;
  is_primary?: boolean;
  cpf?: string;
  whatsapp_number?: string;
  sms_number?: string;
}

export const updateGuardian = async (
  guardianId: string,
  data: GuardianUpdateData
): Promise<boolean> => {
  try {
    logOperation(`Atualizando guardião ${guardianId}`, data);
    
    const { error } = await dbClient
      .from('guardians')
      .update(data)
      .eq('id', guardianId);
    
    if (error) {
      logOperation(`Erro ao atualizar guardião: ${error.message}`, error);
      return false;
    }
    
    // Se o email foi alterado, enviar notificação
    if (data.email) {
      try {
        await emailService.sendEmail(
          data.email,
          'Atualização de Cadastro - Sistema Monitore',
          `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #4a6ee0;">Sistema Monitore</h1>
            <p>Seu cadastro como responsável foi atualizado no Sistema Monitore.</p>
            <p>Se você não reconhece esta ação, por favor entre em contato conosco imediatamente.</p>
          </div>`
        );
      } catch (emailError) {
        console.error('Erro ao enviar email de notificação de atualização:', emailError);
        // Não falhar a operação se apenas o email falhar
      }
    }
    
    // Se o status de primário foi alterado, notificar ao responsável
    if (data.is_primary === true) {
      try {
        // Obter dados do guardião para enviar email
        const { data: guardian } = await dbClient
          .from('guardians')
          .select('*')
          .eq('id', guardianId)
          .single();
          
        if (guardian) {
          await emailService.sendEmail(
            guardian.email,
            'Você agora é o Responsável Principal - Sistema Monitore',
            `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #4a6ee0;">Sistema Monitore</h1>
              <p>Você foi definido como o responsável principal do aluno no Sistema Monitore.</p>
              <p>Isto significa que você receberá todas as notificações importantes relacionadas ao aluno.</p>
            </div>`
          );
        }
      } catch (emailError) {
        console.error('Erro ao enviar email de notificação de responsável principal:', emailError);
        // Não falhar a operação se apenas o email falhar
      }
    }
    
    logOperation(`Guardião ${guardianId} atualizado com sucesso`);
    return true;
  } catch (error) {
    logOperation(`Exceção ao atualizar guardião: ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
};
