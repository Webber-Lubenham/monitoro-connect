
import { GeolocationPosition, GeolocationPositionError } from "../locationTypes";
import { UseLocationTrackingOptions } from "../useLocationTrackingTypes";
import { permissionService } from "./permissionService";

export const startWatchingPosition = (
  options: UseLocationTrackingOptions,
  onSuccess: (position: GeolocationPosition) => void,
  onError: (error: GeolocationPositionError) => void
): number => {
  const geoOptions = {
    enableHighAccuracy: true,     // Always force high accuracy for tracking
    timeout: options.timeout || 15000,  // Increased timeout for better accuracy
    maximumAge: 0                 // Always get fresh positions
  };

  console.log("Starting location tracking with options:", geoOptions);

  if (!navigator.geolocation) {
    console.error("Geolocation API not supported by this browser");
    onError({
      code: 2, // POSITION_UNAVAILABLE
      message: "Geolocation not supported by this browser",
      PERMISSION_DENIED: 1,
      POSITION_UNAVAILABLE: 2,
      TIMEOUT: 3
    });
    return -1;
  }

  try {
    // Add exponential backoff for accuracy improvements
    let lastPosition: GeolocationPosition | null = null;
    let accuracyImprovementTimeout: number | null = null;
    
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        console.log("Raw position update:", {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
        
        // Filter out extremely imprecise locations
        if (position.coords.accuracy > 20000) {
          console.error("Watched position has very poor accuracy:", position.coords.accuracy);
          return; // Skip this update but don't stop watching
        }
        
        // Compare with last position to see if accuracy improved
        if (lastPosition && position.coords.accuracy > lastPosition.coords.accuracy + 200) {
          console.warn("Position accuracy degraded by more than 200m, discarding update");
          return; // Skip updates that significantly degrade accuracy
        }
        
        // Check if this is a better position than what we had before
        const isFirstPosition = !lastPosition;
        const isBetterAccuracy = lastPosition && position.coords.accuracy < lastPosition.coords.accuracy;
        const isSignificantlyNewer = lastPosition && 
          (position.timestamp - lastPosition.timestamp > 60000); // 1 minute
        
        // Additional check: Ensure we're not getting a cached position
        const isFreshEnough = !lastPosition || 
          (position.timestamp - lastPosition.timestamp > 1000); // At least 1 second newer
        
        if ((isFirstPosition || isBetterAccuracy || isSignificantlyNewer) && isFreshEnough) {
          console.log(`Position update: accuracy=${position.coords.accuracy}m, ` +
                     `improvement=${lastPosition ? (lastPosition.coords.accuracy - position.coords.accuracy).toFixed(2) + 'm' : 'N/A'}`);
          
          // Clear any pending accuracy improvement timeout
          if (accuracyImprovementTimeout !== null) {
            clearTimeout(accuracyImprovementTimeout);
            accuracyImprovementTimeout = null;
          }
          
          // Save as last position
          lastPosition = position;
          
          // Pass to callback
          onSuccess(position);
          
          // If accuracy is still not great, wait for a better update before processing more
          if (position.coords.accuracy > 100) {
            accuracyImprovementTimeout = window.setTimeout(() => {
              console.log("Requesting single high accuracy update to improve position");
              navigator.geolocation.getCurrentPosition(
                (improvedPosition) => {
                  if (improvedPosition.coords.accuracy < position.coords.accuracy) {
                    console.log(`Accuracy improved from ${position.coords.accuracy}m to ${improvedPosition.coords.accuracy}m`);
                    lastPosition = improvedPosition;
                    onSuccess(improvedPosition);
                  }
                },
                (error) => console.warn("Failed to get improved position:", error),
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
              );
            }, 3000); // Wait 3 seconds to see if we get a better update naturally
          }
        } else {
          console.log("Skipping position update as it's not significantly better");
        }
      },
      onError,
      geoOptions
    );
    
    // Força uma atualização imediata com alta precisão para começar
    navigator.geolocation.getCurrentPosition(
      position => {
        console.log("Initial forced position update with high accuracy");
        onSuccess(position);
      },
      error => console.warn("Failed to get initial forced position:", error),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
    
    return watchId;
  } catch (e) {
    console.error("Exception watching geolocation:", e);
    onError({
      code: 2, // POSITION_UNAVAILABLE
      message: e instanceof Error ? e.message : "Unknown error watching geolocation",
      PERMISSION_DENIED: 1,
      POSITION_UNAVAILABLE: 2,
      TIMEOUT: 3
    });
    return -1;
  }
};

export const stopWatchingPosition = (watchId: number | null): void => {
  if (watchId !== null && watchId >= 0 && navigator.geolocation) {
    try {
      console.log("Stopping location watching with ID:", watchId);
      navigator.geolocation.clearWatch(watchId);
    } catch (e) {
      console.error("Error clearing geolocation watch:", e);
    }
  }
};
