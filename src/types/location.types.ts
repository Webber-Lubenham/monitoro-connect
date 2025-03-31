
export interface LocationData {
  latitude: number;
  longitude: number;
}

export type StudentStatus = 'in_class' | 'in_transit' | 'at_home' | 'unknown';

export interface GeolocationConfig {
  enableHighAccuracy: boolean;
  timeout: number;
  maximumAge: number;
}
