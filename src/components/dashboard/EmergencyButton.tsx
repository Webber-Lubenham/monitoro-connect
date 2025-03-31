
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2, MessageSquare } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from '@/hooks/use-mobile';

interface EmergencyButtonProps {
  location: { latitude: number; longitude: number } | null;
  onEmergency: (location: { latitude: number; longitude: number }) => void;
  isNotifying?: boolean;
  error?: string | null;
}

const EmergencyButton = ({ location, onEmergency, isNotifying = false, error = null }: EmergencyButtonProps) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleEmergency = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isNotifying) return; // Prevent multiple clicks
    
    if (location) {
      onEmergency(location);
    } else {
      toast({
        title: "Erro de localização",
        description: "Não foi possível obter sua localização atual.",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <Button 
        variant="destructive" 
        className={`w-full py-6 text-lg font-semibold transition-all duration-300 hover:scale-105 active:scale-100 shadow-lg ${isMobile ? 'text-base py-5' : ''}`}
        onClick={handleEmergency}
        disabled={isNotifying}
        type="button"
      >
        {isNotifying ? (
          <>
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            Enviando alerta...
          </>
        ) : (
          <>
            <AlertTriangle className="mr-2 h-6 w-6" />
            Alerta de Emergência
            <MessageSquare className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
      
      <p className="text-sm text-gray-500 mt-3 text-center">
        Em caso de emergência, clique no botão acima para notificar seus responsáveis imediatamente via SMS e e-mail
      </p>
      
      {!location && !error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-center">
          <p className="text-red-600 text-sm">
            Erro de localização: Não foi possível obter sua localização atual.
          </p>
        </div>
      )}
    </div>
  );
};

export default EmergencyButton;
