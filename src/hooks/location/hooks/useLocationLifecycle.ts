
import { useEffect } from "react";
import { stopWatchingPosition } from "../geolocationService";

export const useLocationLifecycle = (coreHook: any, actions: any) => {
  const {
    autoInitializedRef,
    watchIdRef
  } = coreHook;
  
  const { getLocationOnce } = actions;

  // Inicialização automática para obter a localização do usuário quando o componente monta
  useEffect(() => {
    // Apenas executa uma vez
    if (!autoInitializedRef.current) {
      autoInitializedRef.current = true;
      
      // Obter localização uma vez ao inicializar
      getLocationOnce();
    }
    
    return () => {
      // Limpar ao desmontar
      if (watchIdRef.current !== null) {
        stopWatchingPosition(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [getLocationOnce, autoInitializedRef, watchIdRef]);
};
