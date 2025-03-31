
// Re-export types and functions from the new notification modules
export type { NotificationLocationData as LocationData } from '@/services/guardian/notifications';
export { 
  notifyGuardiansDirectly,
  notifyViaEdgeFunction,
  saveLocationToDatabase,
  getStudentNameWithFallback as getStudentName
} from '@/services/guardian/notifications';

// Add enhanced notification function directly accessible from the profile
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

export interface LocationNotificationParams {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export const sendLocationNotification = async (
  studentName: string,
  guardianEmail: string,
  guardianName: string,
  location: LocationNotificationParams
): Promise<boolean> => {
  try {
    console.log(`Sending notification to ${guardianEmail} with location:`, location);
    
    // Add timestamp and unique ID to avoid caching issues
    const timestamp = new Date().toISOString();
    const uniqueId = Math.random().toString(36).substring(2, 15);
    
    // Ensure we have valid coordinates
    if (isNaN(location.latitude) || isNaN(location.longitude)) {
      throw new Error("Coordenadas inválidas. Por favor, tente atualizar sua localização.");
    }
    
    // Use the dedicated location email edge function for more reliable delivery
    const response = await supabase.functions.invoke('send-location-email', {
      body: JSON.stringify({
        studentName,
        guardianEmail,
        guardianName,
        latitude: location.latitude,
        longitude: location.longitude,
        timestamp: timestamp,
        accuracy: location.accuracy || 0,
        trackingId: uniqueId
      })
    });
    
    if (response.error) {
      console.error('Failed to send notification:', response.error);
      toast({
        title: "Falha ao enviar notificação",
        description: `Não foi possível enviar email para ${guardianEmail}: ${response.error.message}`,
        variant: "destructive"
      });
      return false;
    }
    
    console.log(`Successfully notified guardian: ${guardianEmail}`);
    toast({
      title: "Notificação enviada",
      description: `Email enviado com sucesso para ${guardianName} (${guardianEmail})`,
    });
    
    return true;
  } catch (error) {
    console.error('Error sending notification:', error);
    toast({
      title: "Erro ao enviar notificação",
      description: error instanceof Error ? error.message : "Ocorreu um erro ao enviar a notificação",
      variant: "destructive"
    });
    return false;
  }
};
