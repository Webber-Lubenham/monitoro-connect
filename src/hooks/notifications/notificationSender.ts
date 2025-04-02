
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
    
    // Make sure we have all required properties
    const completeNotificationData = {
      ...notificationData,
      mapUrl: notificationData.mapUrl || `https://www.google.com/maps?q=${notificationData.latitude},${notificationData.longitude}`,
      isEmergency: notificationData.isEmergency !== undefined ? notificationData.isEmergency : false,
      timestamp: notificationData.timestamp || new Date().toISOString()
    };
    
    // Try to call the edge function
    try {
      // Check if we should use the newer email-service or the legacy function
      const functionName = 'email-service';
      
      console.log(`Attempting to call edge function: ${functionName}`);
      
      const response = await supabase.functions.invoke(functionName, {
        body: {
          type: 'location-notification',
          data: completeNotificationData
        },
        headers: {
          'Content-Type': 'application/json',
          'Origin': origin,
          'X-Client-Info': 'monitore-app/1.0.0'
        }
      });
      
      console.log(`Response from ${functionName} function:`, response);
      
      if (response.error) {
        console.error('Edge Function error:', response.error);
        
        // Check if this is a "function not found" error
        if (response.error.message?.includes('not found') || response.error.code === 'NOT_FOUND') {
          console.log('Function not found, attempting to use notify-location function instead');
          
          // Try the legacy function as a backup
          const legacyResponse = await supabase.functions.invoke('notify-location', {
            body: completeNotificationData,
            headers: {
              'Content-Type': 'application/json',
              'Origin': origin,
              'X-Client-Info': 'monitore-app/1.0.0'
            }
          });
          
          if (legacyResponse.error) {
            console.error('Legacy edge function also failed:', legacyResponse.error);
            // Will try fallback below
          } else if (legacyResponse.data?.success) {
            // Success with legacy function
            await logSuccessfulNotification(completeNotificationData);
            return { success: true, message: 'Notification sent successfully via legacy function' };
          }
        }
        // Will try fallback below for all other errors
      } else if (response.data?.success) {
        // Success case - log notification and return
        await logSuccessfulNotification(completeNotificationData);
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
    return await sendFallbackNotificationDirectly(completeNotificationData);
    
  } catch (error) {
    console.error('Error sending notification:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      error: errorMessage
    };
  }
};

// Helper function to log successful notifications
const logSuccessfulNotification = async (notificationData: NotificationPayload) => {
  try {
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
  } catch (logError) {
    console.error('Error logging notification:', logError);
    // Don't let logging errors affect the success response
  }
};

/**
 * Sends a fallback notification using client-side methods
 */
export const sendFallbackNotificationDirectly = async (
  notificationData: NotificationPayload
): Promise<NotificationResult> => {
  try {
    // Since useFallbackNotification is a hook, we need to create a function
    // that doesn't require the hook to be used in the component context
    const { sendFallbackEmail } = useFallbackNotification();
    
    const {
      guardianEmail,
      guardianName,
      studentName,
      studentEmail,
      latitude,
      longitude,
      timestamp = new Date().toISOString(),
      mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`,
      isEmergency = false
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
    
    // Create map URL for the location
    const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
    
    // Try various functions in order of preference
    const functionsToTry = ['email-service', 'notify-location', 'send-location-email'];
    
    for (const functionName of functionsToTry) {
      console.log(`Attempting to use ${functionName} function for fallback notification`);
      
      try {
        const fallbackResponse = await supabase.functions.invoke(functionName, {
          body: functionName === 'email-service' ? {
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
          } : {
            guardianEmail,
            guardianName,
            studentName,
            studentEmail,
            latitude,
            longitude,
            timestamp,
            locationType: 'test'
          },
          headers: {
            'Content-Type': 'application/json',
            'Origin': origin,
            'X-Client-Info': 'monitore-app/1.0.0'
          }
        });
        
        console.log(`${functionName} fallback notification response:`, fallbackResponse);
        
        if (!fallbackResponse.error && 
            (fallbackResponse.data?.success || (fallbackResponse.status >= 200 && fallbackResponse.status < 300))) {
          // Log successful fallback notification
          await logNotification(
            guardianEmail,
            studentEmail,
            'location_fallback',
            {
              latitude,
              longitude,
              timestamp,
              method: 'fallback',
              functionUsed: functionName
            },
            'sent'
          );
          
          return { 
            success: true, 
            message: `Notification sent using ${functionName} function` 
          };
        }
      } catch (functionError) {
        console.error(`Error with ${functionName} function:`, functionError);
        // Continue to the next function
      }
    }
    
    // If all edge functions fail, try client-side fallback
    return await sendFallbackNotificationDirectly({
      guardianEmail,
      guardianName,
      studentName,
      studentEmail,
      latitude,
      longitude,
      timestamp,
      mapUrl,
      isEmergency: false
    });
  } catch (fallbackError) {
    console.error(`Fallback notification failed:`, fallbackError);
    return { 
      success: false, 
      error: fallbackError instanceof Error ? fallbackError.message : String(fallbackError)
    };
  }
};
