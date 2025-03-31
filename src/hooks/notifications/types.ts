
export interface NotificationPosition {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: string;
}

export interface NotificationResult {
  success: boolean;
  message?: string;
  error?: string;
  details?: Record<string, unknown>;
}

export interface GuardianNotification {
  guardianId: string;
  email: string;
  name: string;
  phone?: string;
}

export interface StudentInfo {
  id?: string;
  name: string;
  email: string;
}

export interface NotificationPayload {
  studentName: string;
  studentEmail: string;
  guardianName: string;
  guardianEmail: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: string;
  mapUrl: string;
  isEmergency: boolean;
  trackingId?: string;
}

export interface NotificationLogEntry {
  guardianEmail: string;
  studentId: string;
  notificationType: string;
  details: Record<string, any>;
  status: string; // Changing from optional to required since the database expects it
}
