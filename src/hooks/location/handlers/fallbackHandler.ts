
import { GeolocationPosition, GeolocationPositionError } from "../locationTypes";
import { getIpBasedLocation } from "../locationUtils";

export const tryGetFallbackLocation = async (
  error: GeolocationPositionError,
  handlePosition: (position: GeolocationPosition) => void,
  handleError: (error: GeolocationPositionError) => void,
  onSetSharing: (isSharing: boolean) => void,
  onClearError: () => void
): Promise<boolean> => {
  // Only try fallback for certain error types
  if (error.code === error.POSITION_UNAVAILABLE || error.code === error.TIMEOUT) {
    console.log("Trying fallback geolocation method due to error code:", error.code);
    try {
      const fallbackLocation = await getIpBasedLocation();
      if (fallbackLocation && 
          typeof fallbackLocation.latitude === 'number' && 
          typeof fallbackLocation.longitude === 'number') {
        console.log("Fallback location obtained:", fallbackLocation);
        
        // Create a mock position object that follows the GeolocationPosition interface
        const mockPosition = {
          coords: {
            latitude: fallbackLocation.latitude,
            longitude: fallbackLocation.longitude,
            accuracy: 1000, // Default to 1km accuracy for IP-based location
            altitude: null,
            altitudeAccuracy: null,
            heading: null,
            speed: null
          },
          timestamp: Date.now()
        };
        
        handlePosition(mockPosition as GeolocationPosition);
        onSetSharing(true);
        onClearError();
        
        // Try to improve location after showing fallback
        setTimeout(() => {
          console.log("Attempting to get more precise location after fallback...");
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (betterPosition) => {
                // Only use this position if it's significantly more accurate
                if (betterPosition.coords.accuracy < mockPosition.coords.accuracy - 200) {
                  console.log("Found more precise location:", betterPosition);
                  handlePosition(betterPosition);
                }
              },
              (innerError) => console.warn("Failed to get precision improvement:", innerError),
              { enableHighAccuracy: true, timeout: 30000, maximumAge: 0 }
            );
          }
        }, 5000);
        
        return true;
      }
    } catch (err) {
      console.error("Fallback geolocation failed:", err);
    }
  }
  
  // If fallback failed or wasn't attempted, let the original error propagate
  handleError(error);
  return false;
};
