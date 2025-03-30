
import { useEffect } from "react";
import mapboxgl from 'mapbox-gl';
import { addAccuracyCircle } from "../features/AccuracyCircle";
import { isLocationUsable, Location } from "../utils/locationUtils";

interface UseAccuracyCircleProps {
  location: Location | null;
  map: mapboxgl.Map | null;
  isInitialized: boolean;
}

export const useAccuracyCircle = ({
  location,
  map,
  isInitialized
}: UseAccuracyCircleProps) => {
  useEffect(() => {
    if (!map || !location || !isInitialized) return;

    if (!isLocationUsable(location)) return;
    
    try {
      if (location.accuracy) {
        addAccuracyCircle(map, location);
      }
    } catch (error) {
      console.error("Erro ao adicionar círculo de precisão:", error);
    }
  }, [location, map, isInitialized]);
};
