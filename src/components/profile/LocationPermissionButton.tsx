
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

interface LocationPermissionButtonProps {
  onPermissionGranted: () => void;
}

const LocationPermissionButton = ({ onPermissionGranted }: LocationPermissionButtonProps) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handlePermissionRequest = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!("geolocation" in navigator)) {
      toast({
        title: "Erro de compatibilidade",
        description: "Seu navegador não suporta geolocalização",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Solicitando permissão",
      description: "Abrindo diálogo de permissão de localização...",
    });
    
    // Try requesting permission by calling getCurrentPosition
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("Permission granted:", position);
        onPermissionGranted();
        toast({
          title: "Permissão concedida",
          description: "Acesso à localização permitido. Agora você pode notificar os responsáveis.",
        });
      },
      (error) => {
        console.error("Permission denied:", error);
        toast({
          title: "Permissão negada",
          description: "Você precisa permitir o acesso à localização nas configurações do navegador.",
          variant: "destructive",
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  return (
    <div className="space-y-4">
      <Button 
        onClick={handlePermissionRequest}
        className="w-full"
        size={isMobile ? "lg" : "lg"}
        variant="destructive"
        type="button"
      >
        <AlertTriangle className="mr-2 h-5 w-5" />
        Localização não permitida
      </Button>
      <p className="text-xs text-red-500 text-center">
        Você precisa permitir o acesso à sua localização nas configurações do navegador.
      </p>
    </div>
  );
};

export default LocationPermissionButton;
