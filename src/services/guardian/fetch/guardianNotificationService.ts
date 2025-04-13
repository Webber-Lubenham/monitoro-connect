import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import resendService from "@/services/email/resendService";
import type { Guardian } from "@/types/database.types";

/**
 * Notifies a guardian about an event via email
 */
export const notifyGuardianViaEmail = async (
  guardianId: string,
  subject: string,
  message: string
): Promise<boolean> => {
  try {
    // Fetch guardian data
    const { data, error } = await supabase
      .from("guardians")
      .select("*")
      .eq("id", guardianId)
      .single();
    
    if (error || !data) {
      console.error("Error fetching guardian for notification:", error);
      return false;
    }
    
    if (data.email === null) {
      throw new Error('Email cannot be null');
    }
    
    // Send email using resend service
    const emailResult = await resendService.sendGuardianNotification(
      data.email,
      data.nome,
      subject,
      message
    );
    
    return emailResult.success;
  } catch (error) {
    console.error("Error notifying guardian via email:", error);
    return false;
  }
};

/**
 * Notifies all guardians of a student about an event via email
 */
export const notifyAllGuardiansViaEmail = async (
  studentId: string,
  subject: string,
  message: string
): Promise<boolean> => {
  try {
    // Fetch all guardians for the student
    const { data, error } = await supabase
      .from("guardians")
      .select("*")
      .eq("student_id", studentId);
    
    if (error || !data || data.length === 0) {
      console.error("Error fetching guardians or no guardians found:", error);
      return false;
    }

    // Create properly typed guardians array to work with
    const typeSafeGuardians = data.map(guardian => {
      // Ensure student_id is always a string (not null)
      const student_id = guardian.student_id || "";
      
      // Convert is_primary from null to false if needed
      const is_primary = guardian.is_primary === null ? false : guardian.is_primary;
      
      // Return a guardian object that matches the Guardian type
      return {
        ...guardian,
        student_id,
        is_primary,
        // Handle other potentially null fields that should be converted to undefined
        cpf: guardian.cpf || undefined
      } as Guardian;
    });
    
    // Send email to each guardian
    const results = await Promise.all(
      typeSafeGuardians.map(async (guardian) => {
        const result = await resendService.sendGuardianNotification(
          guardian.email,
          guardian.nome,
          subject,
          message
        );
        
        return result.success;
      })
    );
    
    // Return true if at least one email was sent successfully
    return results.some((result: boolean) => result);
  } catch (error) {
    console.error("Error notifying all guardians via email:", error);
    return false;
  }
};
