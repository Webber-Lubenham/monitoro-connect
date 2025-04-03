
import { NotificationPosition } from './types';

/**
 * Create a Promise wrapper for the geolocation API
 */
export const getLocationPromise = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation não é suportada neste navegador.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve(position);
      },
      (error) => {
        let errorMessage = 'Erro desconhecido ao obter localização.';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Acesso à localização foi negado pelo usuário.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Informação de localização indisponível.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Tempo limite excedido ao obter localização.';
            break;
        }
        
        reject(new Error(errorMessage));
      },
      { 
        enableHighAccuracy: true, 
        timeout: 10000, 
        maximumAge: 0 
      }
    );
  });
};

/**
 * Format location info for display
 */
export const formatLocationInfo = (latitude: number, longitude: number): string => {
  return `Latitude: ${latitude.toFixed(6)}, Longitude: ${longitude.toFixed(6)}`;
};

/**
 * Check if the current location has high accuracy
 */
export const hasHighAccuracy = (accuracy: number): boolean => {
  // Consider high accuracy anything below 50 meters
  return accuracy < 50;
};

/**
 * Convert a GeolocationPosition to NotificationPosition
 */
export const positionToNotificationPosition = (position: GeolocationPosition): NotificationPosition => {
  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    accuracy: position.coords.accuracy,
    timestamp: new Date(position.timestamp).toISOString()
  };
};
