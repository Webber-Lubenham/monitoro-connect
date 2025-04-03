
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { createFallbackEmailLink, showManualFallbackOption } from './simpleFallbackNotification';

/**
 * Hook to provide fallback email notification capabilities
 */
export const useFallbackNotification = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const sendFallbackEmail = (emailData: {
    to: string;
    subject: string;
    body: string;
    studentName: string;
    guardianName: string;
    latitude: number;
    longitude: number;
  }) => {
    try {
      setIsLoading(true);
      
      // Create a mailto link for the fallback
      const mailtoLink = `mailto:${encodeURIComponent(emailData.to)}?subject=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(emailData.body)}`;
      
      // Try to open email client
      const emailWindow = window.open(mailtoLink, '_blank');
      
      // If popup blocked or failed, show manual option
      if (!emailWindow) {
        // Create a notification payload
        const payload = {
          guardianEmail: emailData.to,
          studentName: emailData.studentName,
          latitude: emailData.latitude,
          longitude: emailData.longitude
        };
        
        // Show fallback option using the shared function
        showManualFallbackOption(createFallbackEmailLink(payload));
      }
      
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Error in fallback email:', error);
      toast({
        title: "Falha ao iniciar email",
        description: "Não foi possível abrir seu aplicativo de email. Tente novamente.",
        variant: "destructive"
      });
      setIsLoading(false);
      return false;
    }
  };

  return {
    sendFallbackEmail,
    isLoading
  };
};

export default useFallbackNotification;
