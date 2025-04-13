import { supabase } from '@/integrations/supabase/client.ts';
import { logOperation } from '../../base/baseService';
import { NotificationLocationData, NotificationOptions, NotificationResult } from './notificationTypes';
import { getStudentNameWithFallback } from './notificationUtils';

/**
 * Notify guardians directly via Supabase functions
 */
export const notifyGuardiansDirectly = async (
  userId: string,
  location: NotificationLocationData,
  options: NotificationOptions = {}
): Promise<NotificationResult> => {
  try {
    const isEmergency = options.isEmergency || false;
    
    // Get student name if not provided
    const studentName = options.studentName || await getStudentNameWithFallback(userId);
    logOperation(`Notifying guardians directly for student: ${studentName}`);
    
    // Get guardians
    const guardiansResponse = await supabase
      .from('guardians')
      .select('*')
      .eq('student_id', userId);
    
    if (guardiansResponse.error) {
      throw new Error(`Erro ao buscar responsáveis: ${guardiansResponse.error.message}`);
    }
    
    if (!guardiansResponse.data || guardiansResponse.data.length === 0) {
      return {
        success: false,
        error: "Não há responsáveis cadastrados para notificar"
      };
    }
    
    let notifiedCount = 0;
    const guardianCount = guardiansResponse.data.length;
    const errors: string[] = [];
    
    // Try to notify each guardian
    for (const guardian of guardiansResponse.data) {
      try {
        logOperation(`Notificando responsável: ${guardian.email} (${guardian.nome})`);
        
        // Prepare the payload with proper JSON structure
        const payload = {
          studentName,
          guardianEmail: guardian.email,
          guardianName: guardian.nome || 'Responsável',
          latitude: location.latitude,
          longitude: location.longitude,
          timestamp: location.timestamp || new Date().toISOString(),
          accuracy: location.accuracy || 0,
          isEmergency
        };
        
        // Call the send-guardian-email function
        const response = await supabase.functions.invoke('send-guardian-email', {
          body: JSON.stringify(payload)
        });
        
        if (response.error) {
          errors.push(`Error notifying guardian ${guardian.id}: ${response.error.message || 'Unknown error'}`);
          logOperation(`Error notifying guardian ${guardian.id}:`, response.error);
        } else {
          notifiedCount++;
          logOperation(`Email sent to ${guardian.email}`);
        }
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        errors.push(`Failed to send email to ${guardian.email}: ${errorMessage}`);
        logOperation(`Failed to send email to ${guardian.email}:`, e);
      }
    }
    
    if (notifiedCount > 0) {
      return {
        success: true,
        message: `${notifiedCount} of ${guardianCount} guardians notified successfully`,
        details: { notifiedCount, total: guardianCount, errors: errors.length > 0 ? errors : undefined }
      };
    }
    
    return {
      success: false,
      error: "Failed to notify any guardians",
      details: { errors }
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logOperation(`Error in direct notification: ${errorMessage}`);
    return { 
      success: false, 
      error: errorMessage 
    };
  }
};

/**
 * Notify via Supabase Edge Function
 */
export const notifyViaEdgeFunction = async (
  userId: string,
  location: NotificationLocationData,
  options: NotificationOptions = {}
): Promise<NotificationResult> => {
  try {
    const isEmergency = options.isEmergency || false;
    logOperation("Trying edge function for notification...");
    
    // Structure the payload properly
    const payload = {
      studentId: userId,
      latitude: location.latitude,
      longitude: location.longitude,
      timestamp: location.timestamp || new Date().toISOString(),
      accuracy: location.accuracy || 0,
      isEmergency
    };
    
    // Ensure we're sending properly formatted JSON
    const response = await supabase.functions.invoke('notify-location', {
      body: JSON.stringify(payload)
    });

    if (response.error) {
      return {
        success: false,
        error: `Edge function error: ${response.error.message || 'Unknown error'}`,
        details: response.error
      };
    }
    
    return {
      success: true,
      message: `Successfully notified via edge function`,
      details: response.data
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logOperation(`Error invoking edge function: ${errorMessage}`);
    return {
      success: false,
      error: `Error invoking edge function: ${errorMessage}`
    };
  }
};

/**
 * Save location to database
 */
export const saveLocationToDatabase = async (
  userId: string,
  location: NotificationLocationData,
  isEmergency: boolean = false
): Promise<NotificationResult> => {
  try {
    logOperation("Saving location directly to database...");
    
    // Fix the status field to use valid enum values
    const status = isEmergency ? 'emergency' : 'unknown';
    
    const { error: dbError } = await supabase
      .from('location_updates')
      .insert({
        student_id: userId,
        latitude: location.latitude,
        longitude: location.longitude,
        timestamp: location.timestamp || new Date().toISOString(),
        status: status,
        accuracy: location.accuracy || 0
      });
      
    if (dbError) {
      return {
        success: false,
        error: `Database error: ${dbError.message}`,
        details: dbError
      };
    }
    
    return {
      success: true,
      message: `Location saved to database`
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logOperation(`Error saving to database: ${errorMessage}`);
    return {
      success: false,
      error: `Error saving to database: ${errorMessage}`
    };
  }
};
