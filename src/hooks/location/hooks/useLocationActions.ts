import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  requestCurrentPosition,
  startWatchingPosition,
  stopWatchingPosition 
} from "../geolocationService";
import { 
  saveWatchIdToStorage, 
  removeWatchIdFromStorage 
} from "../locationStorageService";
import { tryGetFallbackLocation } from "../handlers/fallbackHandler";

export const useLocationActions = (coreHook: any) => {
  const {
    updateState,
    watchIdRef,
    retryCountRef,
    handlePosition,
    handleError,
    toast,
    options
  } = coreHook;

  const startSharing = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Erro de autenticação",
          description: "Você precisa estar logado para compartilhar sua localização",
          variant: "destructive",
        });
        return;
      }

      // Reset retry counter
      retryCountRef.current = 0;
      
      const handleInitialPosition = (position: GeolocationPosition) => {
        console.log('Initial position obtained:', position);
        handlePosition(position);
        
        const watchId = startWatchingPosition(
          options,
          handlePosition,
          handleError
        );
        
        watchIdRef.current = watchId;
        saveWatchIdToStorage(watchId);
        
        updateState({ isSharing: true, error: null });
      };
      
      const handleInitialError = async (err: GeolocationPositionError) => {
        console.error("Error getting initial position:", err);
        
        // For timeout errors, always try fallback and continue sharing
        if (err.code === err.TIMEOUT) {
          const fallbackSuccess = await tryGetFallbackLocation(
            err,
            handlePosition,
            handleError,
            (isSharing) => updateState({ isSharing }),
            () => updateState({ error: null }),
          );
          
          // If fallback successful, setup normal watch
          if (fallbackSuccess) {
            const watchId = startWatchingPosition(
              options,
              handlePosition,
              handleError
            );
            
            watchIdRef.current = watchId;
            saveWatchIdToStorage(watchId);
          }
        } else {
          // For other errors, try fallback once
          await tryGetFallbackLocation(
            err,
            handlePosition,
            handleError,
            (isSharing) => updateState({ isSharing }),
            () => updateState({ error: null }),
          );
        }
      };
      
      requestCurrentPosition(
        options,
        handleInitialPosition,
        handleInitialError
      );
      
    } catch (e) {
      console.error("Exception starting monitoring:", e);
      updateState({ 
        error: `Error starting monitoring: ${e instanceof Error ? e.message : 'Unknown error'}`
      });
    }
  }, [handlePosition, handleError, toast, options, updateState, watchIdRef, retryCountRef]);

  const stopSharing = useCallback(() => {
    if (watchIdRef.current !== null) {
      stopWatchingPosition(watchIdRef.current);
      watchIdRef.current = null;
      removeWatchIdFromStorage();
      
      updateState({ isSharing: false });
      toast({
        title: "Compartilhamento de localização interrompido",
        description: "Você não está mais compartilhando sua localização",
      });
    }
  }, [toast, updateState, watchIdRef]);
  
  const getLocationOnce = useCallback(async () => {
    try {
      console.log('Getting location once without sharing...');
      
      // Reset retry counter
      retryCountRef.current = 0;
      
      const handleSinglePosition = (position: GeolocationPosition) => {
        console.log('Single position obtained:', position);
        
        // Extrair localização e atualizar estado
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          speed: position.coords.speed,
          timestamp: position.timestamp
        };
        
        // Atualizar estado sem iniciar compartilhamento
        updateState({ 
          location, 
          accuracy: position.coords.accuracy, 
          error: null 
        });
      };
      
      requestCurrentPosition(
        { ...options, highAccuracy: true, timeout: 10000 },
        handleSinglePosition,
        (err) => {
          console.error("Error getting single position:", err);
          updateState({ 
            error: `Erro ao obter localização: ${err.message}`
          });
        }
      );
    } catch (e) {
      console.error("Exception getting location once:", e);
      updateState({ 
        error: `Erro ao obter localização: ${e instanceof Error ? e.message : 'Unknown error'}`
      });
    }
  }, [options, updateState, retryCountRef]);

  return {
    startSharing,
    stopSharing,
    getLocationOnce
  };
};
