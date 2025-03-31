import { useState, useEffect, useRef, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Location } from "../locationTypes";
import { 
  UseLocationTrackingOptions, 
  defaultTrackingOptions, 
  LocationTrackingState 
} from "../useLocationTrackingTypes";
import { 
  handleLocationPosition, 
  handleLocationError
} from "../handlers";
import { 
  requestCurrentPosition,
  startWatchingPosition,
  stopWatchingPosition 
} from "../geolocationService";
import { 
  saveWatchIdToStorage, 
  removeWatchIdFromStorage 
} from "../locationStorageService";
import { supabase } from "@/integrations/supabase/client";

export const useLocationTrackingCore = (
  onLocationUpdate?: (location: Location) => void,
  options: UseLocationTrackingOptions = defaultTrackingOptions
) => {
  const [state, setState] = useState<LocationTrackingState>({
    location: null,
    error: null,
    isSharing: false,
    lastSentLocation: null,
    accuracy: null
  });
  
  const watchIdRef = useRef<number | null>(null);
  const lastPositionRef = useRef<Location | null>(null);
  const { toast } = useToast();
  const retryCountRef = useRef(0);
  const maxRetries = 3;
  const autoInitializedRef = useRef(false);

  const updateState = (newState: Partial<LocationTrackingState>) => {
    setState(prev => ({ ...prev, ...newState }));
  };

  const handlePosition = useCallback((position: GeolocationPosition) => {
    try {
      // Reset retry counter on successful position
      retryCountRef.current = 0;
      
      handleLocationPosition(
        position,
        state.lastSentLocation,
        options.updateInterval || 30000,
        (location) => {
          updateState({ location });
          lastPositionRef.current = location;
          
          // Pass location to parent component through callback if provided
          if (onLocationUpdate) {
            onLocationUpdate(location);
          }
        },
        (accuracy) => updateState({ accuracy }),
        (date) => {
          updateState({ lastSentLocation: date });
          
          // Only show toast for first update or when significant time has passed
          if (!state.lastSentLocation || (new Date().getTime() - state.lastSentLocation.getTime() > 300000)) {
            toast({
              title: "Localização atualizada",
              description: `Localização atualizada com precisão de ${Math.round(position.coords.accuracy)} metros`,
            });
          }
        }
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      updateState({ error: errorMessage });
    }
  }, [state.lastSentLocation, onLocationUpdate, options.updateInterval, toast]);

  const handleError = useCallback((err: GeolocationPositionError) => {
    // Increment retry counter
    retryCountRef.current += 1;
    
    const errorMessage = handleLocationError(
      err,
      (error) => {
        // For timeout errors, make the message more friendly
        if (err.code === err.TIMEOUT) {
          updateState({ 
            error: "Tempo esgotado ao obter localização precisa. Usando localização aproximada."
          });
        } else {
          updateState({ error });
        }
      },
      () => {
        // Only stop sharing if we've exceeded max retries or it's not a timeout error
        if (retryCountRef.current > maxRetries || err.code !== err.TIMEOUT) {
          updateState({ isSharing: false, accuracy: null });
          toast({
            title: "Compartilhamento pausado",
            description: "O compartilhamento de localização foi interrompido devido a erros repetidos.",
            variant: "destructive",
          });
        }
      }
    );
  }, [toast]);

  return {
    state,
    updateState,
    watchIdRef,
    lastPositionRef,
    retryCountRef,
    maxRetries,
    autoInitializedRef,
    handlePosition,
    handleError,
    toast,
    options
  };
};
