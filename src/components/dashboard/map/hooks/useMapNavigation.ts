
import { useEffect, useRef } from "react";
import mapboxgl from 'mapbox-gl';
import { getZoomLevelByAccuracy, isLocationUsable, Location } from "../utils/locationUtils";

interface UseMapNavigationProps {
  location: Location | null;
  map: mapboxgl.Map | null;
  isInitialized: boolean;
}

export const useMapNavigation = ({
  location,
  map,
  isInitialized
}: UseMapNavigationProps) => {
  const lastLocationRef = useRef<Location | null>(null);

  useEffect(() => {
    if (!map || !location || !isInitialized) return;

    // Skip if location hasn't changed
    if (lastLocationRef.current?.latitude === location.latitude && 
        lastLocationRef.current?.longitude === location.longitude) {
      return;
    }

    if (!isLocationUsable(location)) return;
    
    try {
      console.log('Atualizando visão do mapa para:', location);
      lastLocationRef.current = location;
      
      const zoom = getZoomLevelByAccuracy(location.accuracy);
      
      map.flyTo({
        center: [location.longitude, location.latitude],
        zoom: zoom,
        pitch: 60,
        bearing: 0,
        essential: true,
        speed: 0.8,
        curve: 1
      });
    } catch (error) {
      console.error("Erro ao navegar no mapa:", error);
    }
  }, [location, map, isInitialized]);

  return {
    lastLocation: lastLocationRef.current
  };
};
