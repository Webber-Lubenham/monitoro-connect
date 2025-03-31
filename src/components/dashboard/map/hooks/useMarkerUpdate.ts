
import { useEffect, useRef } from "react";
import mapboxgl from 'mapbox-gl';
import { LocationMarker } from "../LocationMarker";
import { isLocationUsable, Location } from "../utils/locationUtils";

interface UseMarkerUpdateProps {
  location: Location | null;
  map: mapboxgl.Map | null;
  marker: mapboxgl.Marker | null;
  isInitialized: boolean;
  setMarker: React.Dispatch<React.SetStateAction<mapboxgl.Marker | null>>;
}

export const useMarkerUpdate = ({
  location,
  map,
  marker,
  isInitialized,
  setMarker
}: UseMarkerUpdateProps) => {
  // Adicionar uma referência para armazenar a última localização processada
  const lastLocationRef = useRef<Location | null>(null);

  useEffect(() => {
    if (!map || !location || !isInitialized) return;

    if (!isLocationUsable(location)) {
      console.warn('Ignorando atualização de localização inválida:', location);
      return;
    }

    // Verificar se a localização é igual à última processada
    const isSameLocation = lastLocationRef.current && 
      lastLocationRef.current.latitude === location.latitude && 
      lastLocationRef.current.longitude === location.longitude;

    // Só atualiza se a localização mudou
    if (!isSameLocation) {
      try {
        console.log('Atualizando marcador para:', location);
        
        if (marker) {
          marker.remove();
        }
        
        const newMarker = LocationMarker.addToMap(map, location);
        setMarker(newMarker);

        // Atualiza a referência da última localização
        lastLocationRef.current = { ...location };
      } catch (error) {
        console.error("Erro ao atualizar marcador:", error);
      }
    }
  }, [location, map, marker, setMarker, isInitialized]);
};
