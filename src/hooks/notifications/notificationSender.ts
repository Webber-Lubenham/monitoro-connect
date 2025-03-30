
import { supabase } from '@/integrations/supabase/client';
import { NotificationResult, NotificationPayload } from './types';
import { logNotification } from './databaseUtils';

/**
 * Sends notification using the Edge Function
 */
export const sendEdgeFunctionNotification = async (
  notificationData: NotificationPayload
): Promise<NotificationResult> => {
  try {
    console.log('Sending notification using email-service function:', notificationData);
    
    // Call the consolidated email-service function
    const response = await supabase.functions.invoke('email-service', {
      body: {
        type: 'location-notification',
        data: notificationData
      }
    });
    
    console.log('Response from email-service function:', response);
    
    if (response.error) {
      console.error('Edge Function error:', response.error);
      return {
        success: false,
        error: `Edge Function error: ${response.error.message}`
      };
    }
    
    if (response.data?.success) {
      // Fix: Provide all required parameters to logNotification
      await logNotification(
        notificationData.guardianEmail,
        notificationData.studentEmail, // Using studentEmail as a proxy for studentId
        'location',
        { 
          location: { 
            lat: notificationData.latitude, 
            lng: notificationData.longitude 
          } 
        },
        'sent'  // Status parameter
      );
      
      return {
        success: true,
        message: 'Notification sent successfully'
      };
    } else {
      console.error('Email service error:', response.data?.error);
      return {
        success: false,
        error: response.data?.error || 'Erro desconhecido'
      };
    }
  } catch (error) {
    console.error('Error sending notification:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      error: errorMessage
    };
  }
};

/**
 * Sends a fallback notification using a different Edge Function
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
    console.log('Sending fallback notification using email-service function');
    
    // Call the email-service function with fallback data
    const fallbackResponse = await supabase.functions.invoke('email-service', {
      body: {
        type: 'guardian-notification',
        data: {
          guardianEmail,
          guardianName,
          studentName,
          studentEmail,
          latitude,
          longitude,
          timestamp,
          locationType: 'test'
        }
      }
    });
    
    console.log('Fallback notification response:', fallbackResponse);
    
    if (fallbackResponse.data?.success) {
      // Log successful fallback notification
      await logNotification(
        guardianEmail,
        studentEmail, // Using studentEmail as a proxy for studentId
        'location_fallback',
        {
          latitude,
          longitude,
          timestamp,
          method: 'fallback'
        },
        'sent'  // Status parameter
      );
      
      return { success: true };
    }
    
    return { 
      success: false, 
      error: fallbackResponse.data?.error || 'Erro desconhecido no método fallback'
    };
  } catch (fallbackError) {
    console.error(`Fallback notification failed:`, fallbackError);
    return { 
      success: false, 
      error: fallbackError instanceof Error ? fallbackError.message : String(fallbackError)
    };
  }
};
