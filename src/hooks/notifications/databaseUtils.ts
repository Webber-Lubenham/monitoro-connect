
import { supabase } from '@/integrations/supabase/client';
import { NotificationLogEntry } from './types';
import { Guardian } from '@/types/database.types';

/**
 * Saves location update to the database
 */
export const saveLocationToDatabase = async (
  userId: string,
  latitude: number,
  longitude: number,
  accuracy?: number,
  altitude?: number | null
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('location_updates')
      .insert({
        student_id: userId,
        latitude,
        longitude,
        accuracy,
        altitude,
        timestamp: new Date().toISOString()
      });

    if (error) {
      console.error('Error saving location:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception saving location:', error);
    return false;
  }
};

/**
 * Logs notification in the database
 */
export const logNotification = async (
  guardianEmail: string,
  studentId: string,
  notificationType: string,
  details: Record<string, any>,
  status: string = 'sent'
): Promise<boolean> => {
  try {
    const notificationLog: NotificationLogEntry = {
      guardianEmail,
      studentId,
      notificationType,
      details,
      status // Now this is required and always has a value
    };

    await supabase
      .from('notification_logs')
      .insert(notificationLog);
    return true;
  } catch (error) {
    console.error('Error logging notification:', error);
    return false;
  }
};

/**
 * Fetches guardians for a student
 */
export const fetchGuardians = async (userId: string): Promise<Guardian[]> => {
  const { data: guardians, error } = await supabase
    .from('guardians')
    .select('*')
    .eq('student_id', userId);

  if (error) {
    console.error('Error fetching guardians:', error);
    throw new Error('Não foi possível obter a lista de responsáveis');
  }

  // Type-casting and filtering out invalid data
  return (guardians || []).filter(guardian => guardian.student_id) as Guardian[];
};
