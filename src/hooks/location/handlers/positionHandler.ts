
import { GeolocationPosition } from "../locationTypes";
import { positionToLocation } from "../locationUtils";
import { saveCurrentLocation } from "../locationDatabaseService";

export const handleLocationPosition = (
  position: GeolocationPosition,
  lastSentLocation: Date | null,
  updateInterval: number,
  onUpdateLocation: (location: any) => void,
  onUpdateAccuracy: (accuracy: number) => void,
  onUpdateLastSent: (date: Date) => void,
  onLocationUpdate?: (location: any) => void
) => {
  try {
    console.log('Raw geolocation position received:', position);
    
    // Basic validation to ensure we have valid coordinates
    if (isNaN(position.coords.latitude) || isNaN(position.coords.longitude)) {
      throw new Error("Invalid coordinates received from geolocation API");
    }
    
    // Check for extremely poor accuracy and provide a warning
    if (position.coords.accuracy > 5000) {
      console.warn(`Location has very poor accuracy: ${position.coords.accuracy}m. Consider using in an area with better GPS coverage.`);
    }
    
    const newLocation = positionToLocation(position);
    console.log('New position processed:', newLocation);
    
    onUpdateLocation(newLocation);
    onUpdateAccuracy(position.coords.accuracy);
    
    if (onLocationUpdate) {
      onLocationUpdate(newLocation);
    }

    const shouldUpdateDatabase = 
      !lastSentLocation || 
      (new Date().getTime() - lastSentLocation.getTime() > updateInterval);
    
    if (shouldUpdateDatabase) {
      // Print more verbose information about the update
      console.log(`Updating location in database for user ${localStorage.getItem('userId')}: ${JSON.stringify(newLocation)}`);
      
      saveCurrentLocation()
        .then((success) => {
          if (success) {
            onUpdateLastSent(new Date());
          } else {
            console.error('Error updating location in database');
          }
        })
        .catch((err) => {
          console.error('Exception updating location in database:', err);
        });
    }
  } catch (error) {
    console.error('Error handling position update:', error);
    throw new Error(`Error processing location update: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
