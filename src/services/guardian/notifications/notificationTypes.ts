
/**
 * Types for guardian notifications
 */

/**
 * Location data structure for notifications
 */
export interface NotificationLocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: string;
}

/**
 * Notification options
 */
export interface NotificationOptions {
  isEmergency?: boolean;
  studentName?: string;
  guardianName?: string;
}

/**
 * Notification result
 */
export interface NotificationResult {
  success: boolean;
  message?: string;
  error?: string;
  details?: Record<string, any>;
}
