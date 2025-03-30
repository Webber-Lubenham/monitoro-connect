
import React, { useEffect } from 'react';
import { Card } from "../ui/card.tsx";
import LocationSharing from "./LocationSharing.tsx";
import MapComponent from "./MapComponent.tsx";
import { AlertCircle } from "lucide-react";

interface LocationCardProps {
  location: { latitude: number; longitude: number; accuracy?: number } | null;
  locationError: string | null;
  onLocationUpdate: (newLocation: { latitude: number; longitude: number; accuracy?: number }) => void;
}

const LocationCard = ({ location, locationError, onLocationUpdate }: LocationCardProps) => {
  // Log quando a localização mudar para depuração
  useEffect(() => {
    if (location) {
      console.log("LocationCard: Location updated", location);
    }
  }, [location]);

  return (
    <Card className="p-6 shadow-lg border-none bg-white/80 backdrop-blur-sm">
      <LocationSharing 
        onLocationUpdate={onLocationUpdate} 
        locationError={locationError}
      />
      
      {location && <MapComponent location={location} />}
      
      {!location && (
        <div className="flex flex-col items-center justify-center h-60 bg-gray-100 rounded-lg">
          {locationError ? (
            <div className="text-center p-4">
              <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-2" />
              <p className="text-red-500 font-medium">Erro de localização</p>
              <p className="text-gray-600 mt-1">{locationError}</p>
              <button 
                onClick={() => globalThis.location.reload()}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Tentar novamente
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
              <p className="text-gray-500">Aguardando localização...</p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default LocationCard;
