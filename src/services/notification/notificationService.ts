
import { supabase } from "@/integrations/supabase/client";
import resendService from "@/services/email/resendService";
import { getGuardiansForNotification, getPrimaryGuardians } from "@/services/guardian/fetch/guardianNotificationService";

/**
 * Sends a location update notification to guardians
 */
export const sendLocationUpdateNotification = async (
  studentId: string,
  studentName: string,
  latitude: number,
  longitude: number
): Promise<boolean> => {
  try {
    // Fetch guardians who should receive notifications
    const guardians = await getGuardiansForNotification(studentId);
    
    if (!guardians || guardians.length === 0) {
      console.log("No guardians to notify about location update");
      return false;
    }
    
    // Generate Google Maps link
    const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
    
    // Create message
    const subject = `Atualização de localização de ${studentName}`;
    const message = `
      <p>Olá,</p>
      <p>${studentName} compartilhou uma atualização de localização.</p>
      <p>Você pode visualizar a localização <a href="${mapsLink}" target="_blank">clicando aqui</a>.</p>
      <p>Ou acessando o dashboard do Sistema Monitore.</p>
    `;
    
    // Send notifications
    const results = await Promise.all(
      guardians.filter(guardian => guardian.email).map(async (guardian) => {
        return await resendService.sendGuardianNotification(
          guardian.email || '',
          guardian.nome || 'Responsável',
          subject,
          message
        );
      })
    );
    
    // Return true if at least one notification was sent successfully
    return results.some((result: any) => result?.success);
  } catch (error) {
    console.error("Error sending location notification:", error);
    return false;
  }
};

/**
 * Sends an emergency notification to all guardians
 */
export const sendEmergencyNotification = async (
  studentId: string,
  studentName: string,
  latitude: number,
  longitude: number
): Promise<boolean> => {
  // Generate Google Maps link
  const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
  
  // Create emergency message
  const subject = `⚠️ EMERGÊNCIA: ${studentName} solicitou ajuda`;
  const message = `
    <div style="color: #d00; font-weight: bold; font-size: 18px; margin-bottom: 10px;">
      ALERTA DE EMERGÊNCIA
    </div>
    <p>${studentName} acionou o botão de emergência.</p>
    <p>Localização atual: <a href="${mapsLink}" target="_blank">Ver no mapa</a></p>
    <p>Por favor, entre em contato imediatamente.</p>
    <p>Esta mensagem foi enviada automaticamente pelo Sistema Monitore em resposta a um alerta de emergência.</p>
  `;
  
  try {
    // Fetch all guardians for this student, regardless of notification preferences
    const guardians = await getGuardiansForNotification(studentId);
    
    if (!guardians || guardians.length === 0) {
      console.log("No guardians to notify for emergency alert");
      return false;
    }
    
    // Send notifications to all guardians
    const results = await Promise.all(
      guardians.filter(guardian => guardian.email).map(async (guardian) => {
        return await resendService.sendGuardianNotification(
          guardian.email || '',
          guardian.nome || 'Responsável',
          subject,
          message
        );
      })
    );
    
    // Return true if at least one notification was sent successfully
    return results.some((result: any) => result?.success);
  } catch (error) {
    console.error("Error sending emergency notification:", error);
    return false;
  }
};

/**
 * A utility function to get the current location
 */
export const getCurrentLocation = (
  onSuccess: (position: { latitude: number; longitude: number; accuracy?: number }) => void,
  onError: (error: string) => void
): void => {
  if (!navigator.geolocation) {
    onError("Geolocalização não suportada pelo navegador");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      onSuccess({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy
      });
    },
    (error) => {
      let errorMessage: string;
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = "Permissão de localização negada pelo usuário";
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = "Informação de localização indisponível";
          break;
        case error.TIMEOUT:
          errorMessage = "Tempo esgotado ao obter a localização";
          break;
        default:
          errorMessage = "Erro desconhecido ao obter localização";
      }
      onError(errorMessage);
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  );
};
