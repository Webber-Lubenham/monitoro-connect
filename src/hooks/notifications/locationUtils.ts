
import { getCurrentLocation } from '@/services/notification/notificationService';
import { NotificationPosition } from './types';

/**
 * Gets the current location wrapped in a promise
 */
export const getLocationPromise = (): Promise<GeolocationPosition> => {
  return new Promise<GeolocationPosition>((resolve, reject) => {
    getCurrentLocation(
      (position: { latitude: number; longitude: number; accuracy?: number }) => {
        // Create a proper GeolocationPosition object
        const geolocationPosition: GeolocationPosition = {
          coords: {
            latitude: position.latitude,
            longitude: position.longitude,
            accuracy: position.accuracy ?? 0,
            altitude: null,
            altitudeAccuracy: null,
            heading: null,
            speed: null
          },
          timestamp: Date.now()
        } as GeolocationPosition;
        
        resolve(geolocationPosition);
      },
      (error: string) => reject(new Error(error))
    );
  });
};

/**
 * Format location data for display
 */
export const formatLocationInfo = (latitude: number, longitude: number): string => {
  return `Lat: ${latitude.toFixed(5)}, Long: ${longitude.toFixed(5)}`;
};

/**
 * Create a Google Maps URL from coordinates
 */
export const createMapUrl = (position: NotificationPosition): string => {
  return `https://www.google.com/maps?q=${position.latitude},${position.longitude}`;
};
