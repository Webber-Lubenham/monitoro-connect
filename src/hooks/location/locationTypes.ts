
export interface Location {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number | null;
  speed?: number | null;
  timestamp?: number;
}

export type StudentStatus = 'in_class' | 'in_transit' | 'unknown';

export interface LocationUpdateResponse {
  success: boolean;
  status?: StudentStatus;
  error?: string;
}

export interface GuardianNotificationResult {
  success: boolean;
  notifiedGuardians?: number;
  error?: string;
}

export interface Guardian {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  student_id: string;
  is_primary: boolean;
}

export type GeolocationPosition = globalThis.GeolocationPosition;
export type GeolocationPositionError = globalThis.GeolocationPositionError;

export interface LocationStorageSettings {
  enabled: boolean;
  interval?: number;
  highAccuracy?: boolean;
}

export interface LocationNotificationPayload {
  studentId: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: string;
  status?: StudentStatus;
}

export interface LocationEdgeFunctionResponse {
  success: boolean;
  notificationsCreated?: number;
  error?: string;
  location?: {
    latitude: number;
    longitude: number;
    timestamp: string;
    status?: StudentStatus;
    accuracy?: number;
  };
}
