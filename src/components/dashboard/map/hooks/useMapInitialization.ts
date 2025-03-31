
import { useRef, useState, useEffect } from "react";
import mapboxgl from 'mapbox-gl';
import { Location } from "../utils/locationUtils";
import { useMapboxToken } from "./useMapboxToken";
import { useMapCreation } from "./useMapCreation";

interface UseMapInitializationProps {
  location: Location | null;
  mapStyle: string;
  customToken?: string | null;
}

interface UseMapInitializationReturn {
  mapContainer: React.RefObject<HTMLDivElement>;
  map: mapboxgl.Map | null;
  marker: mapboxgl.Marker | null;
  hasMapError: boolean;
  isInitialized: boolean;
  setMarker: React.Dispatch<React.SetStateAction<mapboxgl.Marker | null>>;
}

export const useMapInitialization = ({ 
  location, 
  mapStyle,
  customToken
}: UseMapInitializationProps): UseMapInitializationReturn => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [marker, setMarker] = useState<mapboxgl.Marker | null>(null);

  // Get and validate Mapbox token
  const { mapboxToken: defaultToken, hasTokenError: defaultTokenError } = useMapboxToken();
  
  // Use custom token if provided, otherwise use the default
  const mapboxToken = customToken || defaultToken;
  const hasTokenError = customToken ? false : defaultTokenError;
  
  // Log token status
  useEffect(() => {
    if (customToken) {
      console.log('Usando token Mapbox personalizado fornecido pelo usuário');
    } else if (defaultToken) {
      console.log('Usando token Mapbox padrão da aplicação');
    }
  }, [customToken, defaultToken]);

  // Create and initialize map
  const { map, hasMapError, isInitialized } = useMapCreation({
    mapContainer,
    location,
    mapStyle,
    mapboxToken,
    hasTokenError
  });

  const combinedHasMapError = hasMapError || hasTokenError;

  return {
    mapContainer,
    map,
    marker,
    hasMapError: combinedHasMapError,
    isInitialized,
    setMarker
  };
};
