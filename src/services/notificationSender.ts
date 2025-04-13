import { supabase } from '../lib/supabase.ts';

export async function sendNotification(data: {
  studentName: string;
  studentEmail: string;
  guardianName: string;
  guardianEmail: string;
  latitude: number;
  longitude: number;
}) {
  try {
    console.log('Sending notification with data:', data);
    
    // Explicitly set the origin header to help with CORS
    const origin = window.location.origin;
    
    // Add additional headers that might help with CORS
    const { data: response, error } = await supabase.functions.invoke('email-service', {
      body: data,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.VITE_SUPABASE_ANON_KEY}`,
        'Origin': origin,
        'X-Application-Name': 'monitore-app',
      },
      method: 'POST',
    });

    if (error) {
      console.error('Notification error:', error);
      throw error;
    }
    
    console.log('Notification sent successfully:', response);
    return response;
  } catch (error: unknown) {
    console.error('Error sending notification:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Failed to send notification: ${errorMessage}`);
  }
}
