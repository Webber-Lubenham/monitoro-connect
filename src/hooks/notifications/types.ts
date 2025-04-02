
/**
 * Type definitions for notification system
 */

// Payload for sending a notification
export interface NotificationPayload {
  guardianEmail: string;
  studentName: string;
  studentEmail?: string;
  guardianName?: string;
  latitude: number;
  longitude: number;
  timestamp?: string;
  mapUrl?: string;
  accuracy?: number;
  isEmergency?: boolean;
}

// Result from notification operation
export interface NotificationResult {
  success: boolean;
  message?: string;
  error?: any;
}

// Location data specific to notifications
export interface NotificationLocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: string;
}
