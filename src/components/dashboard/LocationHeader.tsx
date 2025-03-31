
import { Shield } from "lucide-react";

interface LocationHeaderProps {
  isSharing: boolean;
  accuracy: number | null;
  error?: string | null;
}

const LocationHeader = ({ isSharing, accuracy, error }: LocationHeaderProps) => {
  return (
    <div className="flex items-center gap-3">
      <Shield className="h-8 w-8 text-primary" />
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Minha Localização</h1>
        <p className="text-gray-500 text-sm">
          Status: {isSharing ? (
            accuracy ? 
              `Compartilhando (Precisão: ${accuracy.toFixed(1)}m)` : 
              "Obtendo localização..."
          ) : "Compartilhamento pausado"}
        </p>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    </div>
  );
};

export default LocationHeader;
