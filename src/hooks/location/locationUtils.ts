
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

/**
 * Get the user's current geolocation
 * @returns Promise that resolves with a GeolocationPosition or null if unavailable
 */
export const getGeoLocation = (): Promise<GeolocationPosition | null> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by this browser');
      resolve(null);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve(position);
      },
      (error) => {
        console.error('Error getting geolocation', error);
        resolve(null);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  });
};

