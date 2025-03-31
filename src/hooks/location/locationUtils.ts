
import { Location } from './locationTypes';

/**
 * Get battery level if available
 */
export const getBatteryLevel = async (): Promise<number | undefined> => {
  try {
    if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
      const battery = await (navigator as any).getBattery();
      return battery.level * 100;
    }
  } catch (error) {
    console.error('Error getting battery level:', error);
  }
  return undefined;
};

/**
 * Try to get location from IP address as fallback
 */
export const getIpBasedLocation = async (): Promise<Location | null> => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    
    if (data.latitude && data.longitude) {
      return {
        latitude: data.latitude,
        longitude: data.longitude,
        accuracy: 1000, // Low accuracy for IP-based location
        altitude: null,
        speed: null,
        timestamp: Date.now()
      };
    }
  } catch (error) {
    console.error("IP-based geolocation failed:", error);
  }
  
  return null;
};

/**
 * Convert GeolocationPosition to our Location interface
 */
export const positionToLocation = (position: GeolocationPosition): Location => {
  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    accuracy: position.coords.accuracy,
    altitude: position.coords.altitude,
    speed: position.coords.speed,
    timestamp: position.timestamp
  };
};
