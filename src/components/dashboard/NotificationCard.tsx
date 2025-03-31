
import { useState } from "react";
import { Card } from "@/components/ui/card";
import EmergencyButton from "./EmergencyButton";
import { useToast } from "@/components/ui/use-toast";
import { sendEmergencyNotification } from "./EmergencyService";

interface NotificationCardProps {
  location: { latitude: number; longitude: number; accuracy?: number } | null;
}

const NotificationCard = ({ location }: NotificationCardProps) => {
  const { toast } = useToast();
  const [isNotifying, setIsNotifying] = useState(false);
  const [notificationError, setNotificationError] = useState<string | null>(null);

  const notifyGuardians = async (location: { latitude: number; longitude: number; accuracy?: number }) => {
    if (isNotifying) return; // Prevent multiple simultaneous notifications
    
    try {
      setIsNotifying(true);
      setNotificationError(null);
      
      // Show toast for user feedback
      toast({
        title: "Enviando alerta de emergência",
        description: "Estamos notificando seus responsáveis sobre sua localização atual...",
      });

      // Use the extracted emergency notification service
      const result = await sendEmergencyNotification(location);
      
      if (result.success) {
        toast({
          title: "Alerta enviado",
          description: result.message,
        });
      } else {
        throw new Error(result.error || "Não foi possível enviar a notificação");
      }
    } catch (error) {
      console.error('Error notifying guardians:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setNotificationError(errorMessage);
      toast({
        title: "Falha na notificação",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsNotifying(false);
    }
  };

  return (
    <Card className="p-6 border-none bg-white/80 backdrop-blur-sm">
      <EmergencyButton 
        location={location} 
        onEmergency={notifyGuardians} 
        isNotifying={isNotifying}
        error={notificationError}
      />
      
      {notificationError && !isNotifying && (
        <p className="text-red-500 text-sm mt-3 text-center">
          {notificationError}
        </p>
      )}
    </Card>
  );
};

export default NotificationCard;
