
/**
 * Notification payload structure
 */
export interface NotificationPayload {
  guardianEmail: string;
  guardianName: string;
  studentName: string;
  studentEmail: string;
  latitude: number;
  longitude: number;
  timestamp?: string;
  accuracy?: number;
  mapUrl?: string;
  isEmergency?: boolean;
}

/**
 * Notification result structure
 */
export interface NotificationResult {
  success: boolean;
  message?: string;
  error?: string;
}
