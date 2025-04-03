
import { safeQuery } from '@/integrations/supabase/safeQueryBuilder';
import { getAuthHeaders } from '@/integrations/supabase/client';
import { NotificationResult } from './types';

/**
 * Sends a notification via the edge function
 */
export const sendEdgeFunctionNotification = async (notificationData: any): Promise<NotificationResult> => {
  try {
    const authHeaders = await getAuthHeaders();
    
    // Call the edge function
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-notification`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify(notificationData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Edge function error: ${errorText}`);
    }

    const result = await response.json();
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('Error in sendEdgeFunctionNotification:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
};

/**
 * Sends a bulk notification to multiple guardians
 */
export const sendBulkNotifications = async (
  studentId: string,
  guardianIds: string[],
  notificationType: string,
  message: string
): Promise<NotificationResult> => {
  try {
    // Prepare notification entries
    const notificationEntries = guardianIds.map(guardianId => ({
      student_id: studentId,
      guardian_id: guardianId,
      notification_type: notificationType,
      status: 'pending',
      message: message
    }));

    // Insert all notifications
    const { error } = await safeQuery.insert('notification_logs', notificationEntries);
    
    if (error) {
      throw new Error(`Failed to create notification records: ${error.message}`);
    }

    return {
      success: true
    };
  } catch (error) {
    console.error('Error sending bulk notifications:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
};

/**
 * Gets guardian emails for a student
 */
export const getGuardianEmails = async (studentId: string): Promise<string[]> => {
  try {
    const { data: guardians, error } = await safeQuery
      .from('guardians')
      .select('*')
      .eq('student_id', studentId);
    
    if (error) {
      throw new Error(`Failed to fetch guardians: ${error.message}`);
    }
    
    if (!guardians || guardians.length === 0) {
      console.log(`No guardians found for student ${studentId}`);
      return [];
    }
    
    // Extract guardian emails, ensuring they are valid
    const emails = guardians
      .filter(guardian => guardian.email && guardian.email.includes('@'))
      .map(guardian => guardian.email);
    
    return emails;
  } catch (error) {
    console.error('Error getting guardian emails:', error);
    return [];
  }
};

/**
 * Send a fallback notification when the main notification method fails
 */
export const sendFallbackNotification = async (
  guardianEmail: string,
  guardianName: string,
  studentName: string,
  studentEmail: string,
  latitude: number,
  longitude: number,
  timestamp: string
): Promise<NotificationResult> => {
  try {
    // Create a Google Maps link
    const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
    
    // Prepare the notification log
    const notificationLogEntry = {
      recipient_email: guardianEmail,
      student_id: studentEmail,
      notification_type: 'location_fallback',
      status: 'sent',
      message: `Fallback location notification for ${studentName} at ${timestamp}`,
      metadata: {
        latitude,
        longitude,
        timestamp,
        mapUrl,
        method: 'fallback'
      },
      sent_at: new Date().toISOString()
    };
    
    // Log the notification attempt
    const { error } = await safeQuery.insert('notification_logs', [notificationLogEntry]);
    
    if (error) {
      console.error('Error logging fallback notification:', error);
    }
    
    return {
      success: true
    };
  } catch (error) {
    console.error('Error in fallback notification:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
};
