
import { Send, Smartphone, Wifi, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocationTracking } from "@/hooks/location";
import LocationHeader from "./LocationHeader";

interface LocationSharingProps {
  onLocationUpdate: (location: { latitude: number; longitude: number }) => void;
  locationError?: string | null;
}

const LocationSharing = ({ onLocationUpdate, locationError }: LocationSharingProps) => {
  const { isSharing, accuracy, error, startSharing, stopSharing, refreshLocation } = useLocationTracking(onLocationUpdate);

  const handleShareLocation = () => {
    if (!isSharing) {
      startSharing();
    } else {
      stopSharing();
    }
  };

  // Determine which error to display (priority to the hook's error)
  const displayError = error || locationError;

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
      <LocationHeader isSharing={isSharing} accuracy={accuracy} error={displayError} />
      <div className="flex gap-2 w-full md:w-auto">
        <Button
          variant={isSharing ? "destructive" : "default"}
          onClick={handleShareLocation}
          className="flex-1 md:flex-auto transition-all duration-300 hover:scale-105"
          size="lg"
        >
          {isSharing ? (
            <>
              <Wifi className="mr-2 h-5 w-5 animate-pulse" />
              Pausar Tempo Real
            </>
          ) : (
            <>
              <Smartphone className="mr-2 h-5 w-5" />
              Compartilhar em Tempo Real
            </>
          )}
        </Button>
        
        <Button
          variant="outline"
          onClick={refreshLocation}
          className="transition-all duration-300 hover:scale-105"
          size="lg"
          title="Atualizar localização"
        >
          <RefreshCw className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default LocationSharing;
