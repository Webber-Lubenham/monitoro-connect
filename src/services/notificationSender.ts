import { supabase } from "@/lib/supabase";

export async function sendNotification(data: {
  studentName: string;
  studentEmail: string;
  guardianName: string;
  guardianEmail: string;
  latitude: number;
  longitude: number;
}) {
  try {
    const { data: response, error } = await supabase.functions.invoke('email-service', {
      body: data,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.VITE_SUPABASE_ANON_KEY}`,
      },
      method: 'POST',
    });

    if (error) {
      console.error('Notification error:', error);
      throw error;
    }
    
    return response;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw new Error(`Failed to send notification: ${error.message}`);
  }
}
