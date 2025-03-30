
import { supabase } from '@/integrations/supabase/client';
import { sendGuardianInvitation } from '@/services/email/emailService';

export interface GuardianInviteParams {
  studentId: string;
  studentName: string;
  guardianName: string;
  guardianEmail: string;
  guardianPhone: string;
  guardianCpf?: string;
  isPrimary?: boolean;
}

export const sendGuardianInvite = async (params: GuardianInviteParams): Promise<{
  success: boolean;
  error?: string;
  guardianId?: string;
}> => {
  try {
    console.log('Sending guardian invitation with params:', params);
    
    // Generate temporary password
    const tempPassword = Math.random().toString(36).slice(-8);
    
    // First, insert the guardian record into the database
    const { data: guardian, error: insertError } = await supabase
      .from('guardians')
      .insert({
        student_id: params.studentId,
        nome: params.guardianName,
        email: params.guardianEmail,
        telefone: params.guardianPhone,
        cpf: params.guardianCpf || null,
        is_primary: params.isPrimary || false,
        temp_password: tempPassword,
        status: 'pending' // Adicionando status inicial
      })
      .select('id')
      .single();
    
    if (insertError) {
      console.error('Error inserting guardian record:', insertError);
      return {
        success: false,
        error: insertError.message || 'Failed to create guardian record'
      };
    }
    
    // Determina o URL base da aplicação
    const appUrl = window.location.origin;
    
    // Cria um link de confirmação com o ID do guardião
    const confirmationUrl = `${appUrl}/guardian-confirm?token=${tempPassword}&guardian_id=${guardian.id}&email=${encodeURIComponent(params.guardianEmail)}`;
    
    // Then send the invitation email with the custom confirmation URL
    const emailResult = await sendGuardianInvitation(
      params.guardianEmail,
      params.guardianName,
      params.studentName,
      tempPassword,
      params.guardianCpf,
      confirmationUrl  // Novo parâmetro adicionado à função
    );
    
    if (!emailResult.success) {
      console.error('Error sending guardian invitation email:', emailResult.error);
      
      // Update the guardian record to indicate invite wasn't sent
      await supabase
        .from('guardians')
        .update({
          temp_password: null, // Clear temp password if invite failed
          status: 'error'      // Marcar status como erro
        })
        .eq('id', guardian.id);
      
      return {
        success: false,
        error: emailResult.error || 'Failed to send invitation email',
        guardianId: guardian.id
      };
    }
    
    // Update the guardian record to indicate invite was sent
    const now = new Date().toISOString();
    const updateResult = await supabase
      .from('guardians')
      .update({ 
        // Use an object with only fields that are definitely in the type definition
        updated_at: now
      })
      .eq('id', guardian.id);
    
    // Make a separate call to update the invitation_sent_at field
    // This works around the TypeScript error while still updating the field in the database
    try {
      // Use a manual fetch call to execute the function instead of using RPC
      // Use environment variables rather than protected client properties
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/update_guardian_invitation_timestamp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`
        },
        body: JSON.stringify({
          guardian_id: guardian.id,
          sent_at: now
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error updating invitation timestamp:', errorText);
      }
    } catch (error: unknown) {
      console.error('Exception updating invitation timestamp:', error instanceof Error ? error.message : String(error));
      // Continue execution even if this fails
    }
    
    console.log('Guardian invitation process completed successfully');
    
    return {
      success: true,
      guardianId: guardian.id
    };
  } catch (error: unknown) {
    console.error('Exception in sendGuardianInvite:', error instanceof Error ? error.message : String(error));
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error sending guardian invitation'
    };
  }
};
