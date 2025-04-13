
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { 
  notifyGuardiansViaEmail,
  notifyGuardiansDirectly,
  notifyViaEdgeFunction,
  saveLocationToDatabase,
  NotificationLocationData
} from "@/services/guardian/notifications";

export interface EmergencyNotificationOptions {
  isEmergency?: boolean;
  silent?: boolean;
}

export const sendEmergencyNotification = async (
  location: NotificationLocationData,
  options: EmergencyNotificationOptions = {}
): Promise<{success: boolean; message?: string; error?: string}> => {
  const { 
    isEmergency = true, 
    silent = false,
    channels = { email: true, sms: true, realtime: true }
  } = options;
  
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("Usuário não autenticado");
    }
    
    // Check if we have a valid location first
    if (!location || typeof location.latitude !== 'number' || typeof location.longitude !== 'number') {
      throw new Error("Localização inválida. Não foi possível obter sua localização atual.");
    }
    
    // Save to database first to ensure location is always recorded
    await saveLocationToDatabase(user.id, location, isEmergency);
    
    let notificationMethods: string[] = [];
    let success = false;
    
    // Try email notification if enabled
    if (channels.email) {
      const emailSuccess = await notifyGuardiansViaEmail(user.id, location, { isEmergency });
      if (emailSuccess) {
        notificationMethods.push("e-mail");
        success = true;
      }
    }
    
    // Try SMS notification (via edge function) if enabled
    if (channels.sms && isEmergency) {
      const smsResult = await notifyViaEdgeFunction(user.id, location, { isEmergency });
      if (smsResult.success) {
        notificationMethods.push("SMS");
        success = true;
      }
    }
    
    // Try direct notification to guardians (realtime) if enabled
    if (channels.realtime) {
      const directResult = await notifyGuardiansDirectly(user.id, location, { isEmergency });
      if (directResult.success) {
        notificationMethods.push("notificação direta");
        success = true;
      }
    }
    
    if (success) {
      const methodsText = notificationMethods.join(" e ");
      return {
        success: true,
        message: `Seus responsáveis foram notificados via ${methodsText} com sua localização${isEmergency ? " de emergência" : ""}`
      };
    } else {
      return {
        success: true,
        message: "Sua localização foi registrada no sistema, mas não foi possível notificar os responsáveis diretamente"
      };
    }
  } catch (error) {
    console.error('Error in emergency notification:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return {
      success: false,
      error: errorMessage
    };
  }
};

// Nova função para notificação regular por e-mail (não emergencial)
export const sendEmailNotification = async (
  location: NotificationLocationData
): Promise<{success: boolean; message?: string; error?: string}> => {
  return await sendEmergencyNotification(location, {
    isEmergency: false, 
    channels: { email: true, sms: false, realtime: false }
  });
};

// Nova função para compartilhamento em tempo real
export const sendRealtimeLocationUpdate = async (
  location: NotificationLocationData
): Promise<{success: boolean; message?: string; error?: string}> => {
  return await sendEmergencyNotification(location, {
    isEmergency: false,
    channels: { email: false, sms: false, realtime: true }
  });
};
