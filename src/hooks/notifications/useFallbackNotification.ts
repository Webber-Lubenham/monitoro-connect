
import { toast } from '@/hooks/use-toast';

interface FallbackEmailOptions {
  to: string;
  subject: string;
  body: string;
  studentName: string;
  guardianName: string;
  latitude: number;
  longitude: number;
}

/**
 * Creates a URL for directly sending emails without relying on edge functions
 * This is a browser-based fallback when edge functions are not working
 */
export const useFallbackNotification = () => {
  const sendFallbackEmail = (options: FallbackEmailOptions) => {
    try {
      const { to, subject, body, latitude, longitude } = options;
      
      // Create Google Maps link for the location
      const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
      
      // Format timestamp
      const timestamp = new Date().toLocaleString('pt-BR');
      
      // Format message body with additional information
      const emailBody = `${body}\n\nLocalização: https://www.google.com/maps?q=${latitude},${longitude}\nHorário: ${timestamp}`;
      
      // Create a mailto link
      const mailtoLink = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
      
      // Open the default email client
      const emailWindow = window.open(mailtoLink, '_blank');
      
      // If popup was blocked, provide feedback to the user
      if (!emailWindow) {
        toast({
          title: "Método alternativo de notificação disponível",
          description: "O envio automático falhou. Clique em 'Enviar por Email' para abrir seu aplicativo de email.",
          variant: "default",
          action: (
            <button 
              className="bg-blue-500 text-white px-3 py-1 rounded"
              onClick={() => window.location.href = mailtoLink}
            >
              Enviar por Email
            </button>
          )
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error creating fallback email:', error);
      return false;
    }
  };

  return { sendFallbackEmail };
};
