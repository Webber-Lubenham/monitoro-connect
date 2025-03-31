
import { GeolocationPosition, GeolocationPositionError } from "../locationTypes";
import { UseLocationTrackingOptions } from "../useLocationTrackingTypes";
import { permissionService } from "./permissionService";

/**
 * Get current position with improved error handling and options
 */
export const requestCurrentPosition = (
  options: UseLocationTrackingOptions,
  onSuccess: (position: GeolocationPosition) => void,
  onError: (error: GeolocationPositionError) => void
): void => {
  const geoOptions = {
    enableHighAccuracy: true,     // Always force high accuracy for better results
    timeout: options.timeout || 10000,     // Use configured timeout with fallback
    maximumAge: 0                 // Always get fresh position
  };

  console.log("Requesting current position with options:", geoOptions);
  
  // Check if geolocation is supported
  if (!navigator.geolocation) {
    console.error("Geolocation API not supported by this browser");
    onError({
      code: 2, // POSITION_UNAVAILABLE
      message: "Geolocation not supported by this browser",
      PERMISSION_DENIED: 1,
      POSITION_UNAVAILABLE: 2,
      TIMEOUT: 3
    });
    return;
  }

  // If we already know permission is denied, don't bother trying
  if (permissionService.isPermissionDenied()) {
    console.error("Geolocation permission previously denied");
    onError({
      code: 1, // PERMISSION_DENIED
      message: "Permissão de localização negada pelo usuário. Por favor, habilite a localização nas configurações do navegador.",
      PERMISSION_DENIED: 1,
      POSITION_UNAVAILABLE: 2,
      TIMEOUT: 3
    });
    return;
  }
  
  // For mobile devices, use a shorter timeout initially to improve responsiveness
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  if (isMobile) {
    geoOptions.timeout = Math.min(geoOptions.timeout, 5000); 
    console.log("Mobile device detected, using shorter initial timeout:", geoOptions.timeout);
  }
  
  // Check permission status and then call geolocation API with high accuracy
  permissionService.checkGeolocationPermission(
    () => callGeolocationAPI(geoOptions, onSuccess, onError),
    () => {
      onError({
        code: 1, // PERMISSION_DENIED
        message: "Permissão de localização negada pelo usuário. Por favor, habilite a localização nas configurações do navegador.",
        PERMISSION_DENIED: 1,
        POSITION_UNAVAILABLE: 2,
        TIMEOUT: 3
      });
    },
    () => callGeolocationAPI(geoOptions, onSuccess, onError)
  );
};

/**
 * Helper function to call geolocation API with improved timeout handling
 * and accuracy filtering
 */
export const callGeolocationAPI = (
  geoOptions: PositionOptions,
  onSuccess: (position: GeolocationPosition) => void,
  onError: (error: GeolocationPositionError) => void
) => {
  try {
    // Set a timeout backup in case the geolocation API gets stuck
    const timeoutId = setTimeout(() => {
      console.warn(`Manual timeout triggered after ${geoOptions.timeout}ms`);
      onError({
        code: 3, // TIMEOUT
        message: "Tempo esgotado ao obter localização. O navegador não respondeu a tempo.",
        PERMISSION_DENIED: 1,
        POSITION_UNAVAILABLE: 2,
        TIMEOUT: 3
      });
    }, (geoOptions.timeout || 10000) + 2000); // Add 2 seconds buffer
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Clear the manual timeout
        clearTimeout(timeoutId);
        
        permissionService.setPermissionGranted(true);
        
        // Add accuracy validation - filter out extremely imprecise locations
        if (position.coords.accuracy > 20000) {
          console.error("Position has very poor accuracy:", position.coords.accuracy);
          
          // If accuracy is very poor but we got a position, let's let the caller decide
          // instead of treating it as an error
          onSuccess(position);
          return;
        }
        
        // Add a second validation for stale positions (if timestamp is too old)
        const positionTime = position.timestamp;
        const currentTime = Date.now();
        const positionAge = currentTime - positionTime;
        
        if (positionAge > 30000) { // If position is more than 30 seconds old
          console.warn("Position data is stale:", positionAge, "ms old");
          
          // Let's still return the position but with a warning
          onSuccess(position);
          return;
        }
        
        console.log("Received position with accuracy:", position.coords.accuracy, "meters");
        onSuccess(position);
      },
      (error) => {
        // Clear the manual timeout
        clearTimeout(timeoutId);
        
        if (error.code === error.PERMISSION_DENIED) {
          permissionService.setPermissionGranted(false);
        }
        onError(error);
      },
      geoOptions
    );
  } catch (e) {
    console.error("Exception requesting geolocation:", e);
    onError({
      code: 2, // POSITION_UNAVAILABLE
      message: e instanceof Error ? e.message : "Unknown error requesting geolocation",
      PERMISSION_DENIED: 1,
      POSITION_UNAVAILABLE: 2,
      TIMEOUT: 3
    });
  }
};
