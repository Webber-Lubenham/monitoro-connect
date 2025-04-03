
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { getLocationPromise, formatLocationInfo } from './locationUtils';
import { saveLocationToDatabase, fetchGuardians, logNotification } from './databaseUtils';
import { sendEdgeFunctionNotification, sendFallbackNotification } from './notificationSender';
import { NotificationResult } from './types';

/**
 * Hook for sending notifications to guardians
 */
export const useNotifyGuardians = () => {
  const { toast } = useToast();
  const [isNotifying, setIsNotifying] = useState(false);

  const notifyGuardians = async () => {
    setIsNotifying(true);
    
    try {
      // Get current location
      const position = await getLocationPromise();
      
      // Get current user data
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Usuário não autenticado');
      }

      const userId = session.user.id;
      const userEmail = session.user.email;

      if (!userEmail) {
        throw new Error('Email do usuário não encontrado');
      }

      // Get user's name from profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', userId)
        .single();

      // Use a fallback name if profile data isn't available
      const studentName = profile ? 
        `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : 
        userEmail;

      // Extract location data
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      const locationInfo = formatLocationInfo(latitude, longitude);
      
      // Convert null to undefined for TypeScript compatibility
      const accuracy = position.coords.accuracy ?? undefined;
      const altitude = position.coords.altitude ?? undefined;
      
      // Save location to database
      await saveLocationToDatabase(
        userId,
        latitude,
        longitude,
        accuracy,
        altitude
      );

      // Get user's guardians
      const guardians = await fetchGuardians(userId);

      if (!guardians || guardians.length === 0) {
        toast({
          title: "Nenhum responsável encontrado",
          description: "Você não tem responsáveis cadastrados para receber notificações.",
          variant: "destructive"
        });
        setIsNotifying(false);
        return;
      }

      // Create map link
      const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

      // Notify each guardian
      const timestamp = new Date().toISOString();
      let successCount = 0;
      let errorMessages: string[] = [];

      console.log(`Sending notifications to ${guardians.length} guardians`);

      for (const guardian of guardians) {
        try {
          console.log(`Sending notification to ${guardian.email}`);
          
          // Prepare payload for the Edge Function
          const notificationData = {
            studentName: studentName,
            studentEmail: userEmail,
            guardianName: guardian.nome || 'Responsável',
            guardianEmail: guardian.email || '',
            latitude,
            longitude,
            accuracy: accuracy,
            timestamp,
            mapUrl,
            isEmergency: false
          };
          
          // Skip guardians without email
          if (!guardian.email) {
            console.warn(`Guardian ${guardian.id} has no email, skipping notification`);
            continue;
          }
          
          // Send the notification
          const result = await sendEdgeFunctionNotification(notificationData);
          
          if (result.success) {
            successCount++;
            console.log(`Successfully notified guardian: ${guardian.email}`);
            
            // Log the notification
            await logNotification(
              guardian.email,
              userId,
              'location',
              {
                latitude,
                longitude,
                locationInfo,
                timestamp
              }
            );
          } else {
            const errorMessage = result.error || 'Erro desconhecido';
            errorMessages.push(`Erro ao notificar ${guardian.nome || guardian.email}: ${errorMessage}`);
            console.error(`Error notifying guardian ${guardian.id}:`, errorMessage);
            
            // Try fallback method
            await handleFallbackNotification(
              guardian,
              studentName,
              userEmail,
              latitude,
              longitude,
              timestamp,
              userId,
              locationInfo,
              successCount
            );
          }
        } catch (error: any) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          errorMessages.push(`Falha ao enviar para ${guardian.nome || guardian.email}: ${errorMessage}`);
          console.error(`Exception notifying guardian ${guardian.id}:`, error);
          
          // Try fallback method
          const fallbackSuccess = await handleFallbackNotification(
            guardian,
            studentName,
            userEmail,
            latitude,
            longitude,
            timestamp,
            userId,
            locationInfo,
            successCount
          );
          
          if (fallbackSuccess) {
            successCount++;
          }
        }
      }

      // Show toast with results
      displayResultToast(successCount, guardians.length);
    } catch (error: any) {
      console.error('Error in notification process:', error);
      toast({
        title: "Erro ao enviar notificação",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado",
        variant: "destructive"
      });
    } finally {
      setIsNotifying(false);
    }
  };

  // Handle fallback notification when primary method fails
  const handleFallbackNotification = async (
    guardian: any,
    studentName: string,
    userEmail: string,
    latitude: number,
    longitude: number,
    timestamp: string,
    userId: string,
    locationInfo: string,
    successCount: number
  ): Promise<boolean> => {
    try {
      console.log(`Attempting fallback notification for ${guardian.email}`);
      
      // Skip guardians without email
      if (!guardian.email) {
        console.warn(`Guardian ${guardian.id} has no email, skipping fallback notification`);
        return false;
      }
      
      // Format timestamp for display
      const formattedTime = new Date(timestamp).toLocaleString('pt-BR');
      
      // Send fallback notification
      const fallbackResult = await sendFallbackNotification(
        guardian.email,
        guardian.nome || 'Responsável',
        studentName,
        userEmail,
        latitude,
        longitude,
        formattedTime
      );
      
      if (fallbackResult.success) {
        console.log(`Fallback notification successful for ${guardian.email}`);
        
        // Update log entry
        await logNotification(
          guardian.email,
          userId,
          'location_fallback',
          {
            latitude,
            longitude,
            locationInfo,
            timestamp,
            method: 'fallback'
          }
        );
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error(`Fallback notification also failed:`, error);
      return false;
    }
  };

  // Display toast with notification results
  const displayResultToast = (successCount: number, totalGuardians: number) => {
    if (successCount > 0) {
      toast({
        title: `Notificação enviada com sucesso`,
        description: `${successCount} de ${totalGuardians} responsáveis foram notificados com sua localização atual.`,
        variant: "default"
      });
    } else {
      toast({
        title: "Falha ao enviar notificações",
        description: "Nenhum responsável foi notificado. Verifique sua conexão e tente novamente.",
        variant: "destructive"
      });
    }
  };

  return {
    isNotifying,
    handleNotification: notifyGuardians
  };
};

export default useNotifyGuardians;
