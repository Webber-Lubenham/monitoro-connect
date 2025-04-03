
export interface NotificationLogEntry {
  id: string;
  student_id: string;
  guardian_id?: string;
  notification_type: string;
  status: string;
  sent_at: string;
  message?: string;
  created_at: string;
}

export interface NotificationPosition {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: string;
}
