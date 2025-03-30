
import { useState, useRef } from "react";
import mapboxgl from 'mapbox-gl';
import { Location } from "../utils/locationUtils";
import { useMarkerUpdate } from "./useMarkerUpdate";
import { useAccuracyCircle } from "./useAccuracyCircle";
import { useMapNavigation } from "./useMapNavigation";
import { useMapErrorHandling } from "./useMapErrorHandling";

interface UseLocationUpdateProps {
  location: Location | null;
  map: mapboxgl.Map | null;
  marker: mapboxgl.Marker | null;
  isInitialized: boolean;
  setMarker: React.Dispatch<React.SetStateAction<mapboxgl.Marker | null>>;
}

export const useLocationUpdate = ({
  location,
  map,
  marker,
  isInitialized,
  setMarker
}: UseLocationUpdateProps) => {
  const [error, setError] = useState<Error | null>(null);
  const throttleTimerRef = useRef<number | null>(null);
  const lastProcessedLocationRef = useRef<Location | null>(null);

  // Verifica se a localização é a mesma que a última
  const isDifferentLocation = !lastProcessedLocationRef.current || 
    lastProcessedLocationRef.current.latitude !== location?.latitude ||
    lastProcessedLocationRef.current.longitude !== location?.longitude ||
    lastProcessedLocationRef.current.accuracy !== location?.accuracy;

  // Atualiza a referência se a localização mudou
  if (location && isDifferentLocation) {
    lastProcessedLocationRef.current = { ...location };
  }

  // Handle marker updates
  useMarkerUpdate({
    location: isDifferentLocation ? location : null, // Passa null se não mudou para evitar updates
    map,
    marker,
    isInitialized,
    setMarker
  });

  // Handle accuracy circle
  useAccuracyCircle({
    location: isDifferentLocation ? location : null, // Passa null se não mudou
    map,
    isInitialized
  });

  // Handle map navigation
  useMapNavigation({
    location, // Sempre passa a localização para navegação
    map,
    isInitialized
  });

  // Handle errors
  useMapErrorHandling({
    location,
    operation: "atualizar o mapa",
    error
  });

  return {
    error
  };
};
