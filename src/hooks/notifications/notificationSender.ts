
import { supabase } from '@/integrations/supabase/client';
import { NotificationResult, NotificationPayload } from './types';
import { logNotification } from './databaseUtils';
import { useFallbackNotification } from './useFallbackNotification';

/**
 * Sends notification using the Edge Function
 */
export const sendEdgeFunctionNotification = async (
  notificationData: NotificationPayload
): Promise<NotificationResult> => {
  try {
    // Validate payload structure
    if (!notificationData || typeof notificationData !== 'object') {
      throw new Error('Invalid payload structure');
    }

    console.log('Sending notification using email-service function:', notificationData);
    
    // Get the current origin for CORS headers
    const origin = window.location.origin;
    
    // Try to call the consolidated email-service function
    try {
      const response = await supabase.functions.invoke('email-service', {
        body: {
          type: 'location-notification',
          data: notificationData
        },
        headers: {
          'Content-Type': 'application/json',
          'Origin': origin
        }
      });
      
      console.log('Response from email-service function:', response);
      
      if (response.error) {
        console.error('Edge Function error:', response.error);
        // Will try fallback below
      } else if (response.data?.success) {
        // Success case - log notification and return
        await logNotification(
          notificationData.guardianEmail,
          notificationData.studentEmail,
          'location',
          { 
            location: { 
              lat: notificationData.latitude, 
              lng: notificationData.longitude 
            } 
          },
          'sent'
        );
        
        return {
          success: true,
          message: 'Notification sent successfully'
        };
      }
    } catch (edgeFunctionError) {
      console.error('Failed to call edge function:', edgeFunctionError);
      // Will try fallback below
    }
    
    // If we get here, the edge function call failed - try direct fallback
    return await sendFallbackNotificationDirectly(notificationData);
    
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
 * Sends a fallback notification using client-side methods
 */
export const sendFallbackNotificationDirectly = async (
  notificationData: NotificationPayload
): Promise<NotificationResult> => {
  try {
    const { sendFallbackEmail } = useFallbackNotification();
    
    const {
      guardianEmail,
      guardianName,
      studentName,
      latitude,
      longitude,
      timestamp = new Date().toISOString(),
    } = notificationData;
    
    // Format the body with the student's location information
    const formattedTime = new Date(timestamp).toLocaleString('pt-BR');
    const body = `Olá ${guardianName},\n\n${studentName} compartilhou sua localização atual com você.\n\nVocê pode visualizar a localização clicando no link abaixo.`;
    
    // Try to send the email via the client-side fallback
    const emailSent = sendFallbackEmail({
      to: guardianEmail,
      subject: `Localização atual de ${studentName} - Sistema Monitore`,
      body,
      studentName,
      guardianName,
      latitude,
      longitude
    });
    
    if (emailSent) {
      return {
        success: true,
        message: 'Fallback notification method used successfully'
      };
    }
    
    return {
      success: false,
      error: 'All notification methods failed'
    };
  } catch (error) {
    console.error('Error in fallback notification:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
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
    
    // Get the current origin for CORS headers
    const origin = window.location.origin;
    
    // First try using the email-service function
    try {
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
        },
        headers: {
          'Content-Type': 'application/json',
          'Origin': origin
        }
      });
      
      console.log('Fallback notification response:', fallbackResponse);
      
      if (fallbackResponse.data?.success) {
        // Log successful fallback notification
        await logNotification(
          guardianEmail,
          studentEmail,
          'location_fallback',
          {
            latitude,
            longitude,
            timestamp,
            method: 'fallback'
          },
          'sent'
        );
        
        return { success: true };
      }
    } catch (edgeFunctionError) {
      console.error('Failed to call fallback edge function:', edgeFunctionError);
    }
    
    // If edge function fails, try client-side fallback
    return await sendFallbackNotificationDirectly({
      guardianEmail,
      guardianName,
      studentName,
      studentEmail,
      latitude,
      longitude,
      timestamp
    });
  } catch (fallbackError) {
    console.error(`Fallback notification failed:`, fallbackError);
    return { 
      success: false, 
      error: fallbackError instanceof Error ? fallbackError.message : String(fallbackError)
    };
  }
};
