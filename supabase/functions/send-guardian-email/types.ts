
// Type definitions for guardian email function

export interface GuardianEmailRequest {
  studentName: string;
  guardianEmail: string;
  guardianName: string;
  locationType?: 'arrival' | 'departure' | 'alert' | 'test';
  locationData?: LocationData;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  timestamp: string;
  accuracy?: number;
}

export interface EmailResponse {
  success: boolean;
  emailId?: string;
  sentTo?: string;
  messageId?: string;
  error?: string;
  details?: string | Record<string, unknown>;
  rateLimited?: boolean;
}
