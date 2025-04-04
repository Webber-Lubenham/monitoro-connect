
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

/**
 * Notification log entry structure
 */
export interface NotificationLogEntry {
  guardian_email: string;
  student_id: string;
  notification_type: string;
  details: Record<string, any>;
  status: string;
  created_at: string;
}

/**
 * Location position structure for notifications
 */
export interface NotificationPosition {
  latitude: number;
  longitude: number;
  accuracy?: number;
}
