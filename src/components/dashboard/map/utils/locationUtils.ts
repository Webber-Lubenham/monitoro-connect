
// Type definitions
export type Location = {
  latitude: number;
  longitude: number;
  accuracy?: number;
};

// Utility functions for locations
export const isLocationUsable = (location: Location | null): boolean => {
  if (!location) return false;
  
  const { latitude, longitude } = location;
  
  // Basic validation - ensure coordinates are within valid ranges
  const isValidLatitude = latitude >= -90 && latitude <= 90;
  const isValidLongitude = longitude >= -180 && longitude <= 180;
  
  return isValidLatitude && isValidLongitude;
};

// Get appropriate zoom level based on accuracy
export const getZoomLevelByAccuracy = (accuracy?: number): number => {
  if (!accuracy) return 16;
  
  // Adjust zoom based on accuracy (precision) of the location
  if (accuracy < 10) return 19;        // Very high precision: street level
  if (accuracy < 50) return 17;        // High precision: block level
  if (accuracy < 100) return 16;       // Medium precision: neighborhood
  if (accuracy < 500) return 14;       // Low precision: district
  if (accuracy < 1000) return 13;      // Poor precision: city area
  if (accuracy < 5000) return 11;      // Very poor precision: city
  
  return 10;                          // Extremely poor precision: region
};

// Function to determine accuracy level for display
export const getAccuracyLevel = (accuracy: number) => {
  if (accuracy < 10) {
    return { level: 'Excelente', color: 'text-green-600' };
  } else if (accuracy < 50) {
    return { level: 'Boa', color: 'text-green-500' };
  } else if (accuracy < 100) {
    return { level: 'Média', color: 'text-yellow-500' };
  } else if (accuracy < 500) {
    return { level: 'Baixa', color: 'text-orange-500' };
  } else {
    return { level: 'Muito baixa', color: 'text-red-500' };
  }
};
