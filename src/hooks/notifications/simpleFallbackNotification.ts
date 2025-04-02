
import { NotificationPayload, NotificationResult } from './types';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';

/**
 * Provides a client-side fallback notification method when edge functions fail
 * This creates a direct mailto: link for the user to send an email manually
 */
export const createFallbackEmailLink = (
  notificationData: NotificationPayload
): string => {
  const {
    guardianEmail,
    studentName,
    latitude,
    longitude,
    timestamp = new Date().toISOString()
  } = notificationData;
  
  // Create the map URL
  const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
  
  // Format timestamp for display
  const formattedTime = new Date(timestamp).toLocaleString('pt-BR');
  
  // Create email subject and body
  const subject = `Localização atual de ${studentName} - Sistema Monitore`;
  const body = `
    Olá,
    
    ${studentName} compartilhou sua localização atual com você.
    
    Horário: ${formattedTime}
    
    Veja no mapa: ${mapUrl}
    
    Sistema Monitore - Segurança e tranquilidade
  `.trim().replace(/\n    /g, '\n'); // Remove extra indentation
  
  // Create mailto link
  return `mailto:${encodeURIComponent(guardianEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

/**
 * Shows a manual fallback dialog with instructions for the user
 */
export const showManualFallbackOption = (mailtoLink: string): void => {
  toast({
    title: "Enviando notificação manualmente",
    description: "O sistema de notificação automático falhou. Clique em 'Enviar Email' para abrir o seu aplicativo de email.",
    action: (
      <Button 
        className="bg-primary text-primary-foreground px-3 py-1 rounded hover:bg-primary/90 transition-colors"
        onClick={() => window.open(mailtoLink, '_blank')}
      >
        Enviar Email
      </Button>
    ),
    duration: 10000, // Longer duration to give user time to act
  });
};

/**
 * Fallback notification method that provides manual options to the user
 * when all automatic methods fail
 */
export const useFallbackManualNotification = () => {
  const sendManualFallbackNotification = async (
    notificationData: NotificationPayload
  ): Promise<NotificationResult> => {
    try {
      // Create mailto link for manual sending
      const mailtoLink = createFallbackEmailLink(notificationData);
      
      // Try to open user's email client directly
      const emailWindow = window.open(mailtoLink, '_blank');
      
      // If popup blocked, show toast with button
      if (!emailWindow) {
        showManualFallbackOption(mailtoLink);
      }
      
      return {
        success: true,
        message: 'Fallback notification option provided to user'
      };
    } catch (error) {
      console.error('Error in manual fallback notification:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  };
  
  return { sendManualFallbackNotification };
};
