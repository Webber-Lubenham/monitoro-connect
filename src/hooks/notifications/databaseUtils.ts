
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import { NotificationLogEntry } from './types';
import { Guardian } from '@/types/database.types';

/**
 * Save location data to the database
 */
export const saveLocationToDatabase = async (
  userId: string,
  latitude: number,
  longitude: number,
  accuracy?: number,
  altitude?: number
): Promise<void> => {
  try {
    // Cast any to avoid TypeScript errors with Supabase tables that aren't in types
    const { error } = await (supabase
      .from('location_updates') as any)
      .insert({
        student_id: userId,
        latitude,
        longitude,
        accuracy: accuracy || null,
        altitude: altitude || null,
        timestamp: new Date().toISOString(),
      });

    if (error) {
      console.error('Error saving location:', error);
    }
  } catch (error) {
    console.error('Exception saving location:', error);
  }
};

/**
 * Log a notification in the system
 */
export const logNotification = async (
  recipientEmail: string,
  studentId: string,
  notificationType: string,
  data: any
): Promise<void> => {
  try {
    // Create log entry
    const logEntry: any = {
      student_id: studentId,
      notification_type: notificationType,
      status: 'sent',
      recipient_email: recipientEmail,
      metadata: data,
      sent_at: new Date().toISOString(),
    };

    // Insert into logs table
    const { error } = await (supabase
      .from('notification_logs') as any)
      .insert(logEntry);

    if (error) {
      console.error('Error logging notification:', error);
    }
  } catch (error) {
    console.error('Exception logging notification:', error);
  }
};

/**
 * Fetch guardians for a student
 */
export const fetchGuardians = async (studentId: string): Promise<Guardian[]> => {
  try {
    // Cast to avoid TypeScript errors with tables not in types
    const { data: guardians, error } = await (supabase
      .from('guardians') as any)
      .select('*')
      .eq('student_id', studentId);

    if (error) {
      console.error('Error fetching guardians:', error);
      return [];
    }

    if (!guardians || guardians.length === 0) {
      console.warn(`No guardians found for student ${studentId}`);
      return [];
    }

    // Cast to Guardian type
    return guardians as unknown as Guardian[];
  } catch (error) {
    console.error('Exception fetching guardians:', error);
    return [];
  }
};
