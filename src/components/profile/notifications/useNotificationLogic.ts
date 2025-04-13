import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useProfile } from "@/hooks/useProfile";
import { useLocationTracking } from "@/hooks/location";
import { sendLocationNotification } from "../NotificationHelper";
import { isLowAccuracy } from "./accuracyUtils";
import { Guardian } from "@/types/database.types";

export interface NotificationLogicState {
  loading: boolean;
  location: { latitude: number; longitude: number } | null;
  accuracy: number | null;
  locationError: string | null;
  showLowAccuracyWarning: boolean;
}

export interface NotificationLogicHandlers {
  handleNotifyByEmail: () => Promise<void>;
  handleUpdateLocation: () => void;
}

export type NotificationLogicResult = NotificationLogicState & NotificationLogicHandlers;

export const useNotificationLogic = (guardians: Guardian[]): NotificationLogicResult => {
  const { toast } = useToast();
  const { profile } = useProfile();
  const [loading, setLoading] = useState(false);
  const [showLowAccuracyWarning, setShowLowAccuracyWarning] = useState(false);

  // Use the hook of location to get precise location
  const { location, accuracy, error: locationError, refreshLocation } = useLocationTracking();

  const handleUpdateLocation = () => {
    refreshLocation();
    toast({
      title: "Atualizando localização",
      description: "Obtendo sua localização atual com a maior precisão possível...",
    });
  };

  const handleNotifyByEmail = async () => {
    setLoading(true);
    setShowLowAccuracyWarning(false);

    try {
      if (!guardians || guardians.length === 0) {
        toast({
          title: "Nenhum responsável encontrado",
          description: "Você precisa cadastrar responsáveis antes de enviar notificações.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Verify if we have a valid location
      if (!location) {
        toast({
          title: "Localização não disponível",
          description: "Não foi possível obter sua localização atual. Tente atualizar clicando no botão.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Warning for low accuracy but still proceed
      if (accuracy && isLowAccuracy(accuracy)) {
        setShowLowAccuracyWarning(true);
        toast({
          title: "Precisão de localização reduzida",
          description: `A precisão atual da sua localização é de aproximadamente ${Math.round(
            accuracy
          )}m. Para melhorar, verifique se o GPS está ativado e se você está em área com boa recepção.`,
          variant: "destructive", // Using destructive since warning isn't available for toast
        });
      }

      // Send notification to each guardian
      console.log(`Sending notifications to ${guardians.length} guardians using location:`, location);

      let successful = 0;

      for (const guardian of guardians) {
        try {
          // Add a small delay between notifications to avoid rate limiting
          if (successful > 0) {
            await new Promise((resolve) => setTimeout(resolve, 500));
          }

          // Use the enhanced notification function with our current precise location
          const success = await sendLocationNotification(
            profile?.email || "Aluno",
            guardian.email,
            guardian.nome,
            location
          );

          if (success) {
            successful++;
          }
        } catch (guardianError) {
          console.error(`Error notifying guardian ${guardian.email}:`, guardianError);
        }
      }

      if (successful > 0) {
        toast({
          title: "Notificação enviada",
          description: `Sua localização foi enviada para ${successful} responsáveis.`,
        });
      } else {
        toast({
          title: "Falha ao enviar notificações",
          description: "Não foi possível enviar notificações para nenhum responsável.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error in notification process:", error);
      toast({
        title: "Erro ao enviar notificação",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao processar a notificação",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    location,
    accuracy,
    locationError,
    showLowAccuracyWarning,
    handleNotifyByEmail,
    handleUpdateLocation,
  };
};
