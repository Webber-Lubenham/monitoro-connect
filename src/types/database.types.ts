
export interface Guardian {
  id: string;
  student_id: string;
  nome: string;
  telefone: string;
  email: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
  cpf?: string;
  temp_password?: string;
  invitation_sent_at?: string;
  status?: string;
  sms_number?: string;
  whatsapp_number?: string;
  guardian_id?: string;
}

export interface GuardianForm {
  nome: string;
  telefone: string;
  email: string;
  isPrimary: boolean;
  cpf?: string;
}

export interface LocationUpdate {
  id: string;
  student_id: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  created_at: string;
  accuracy?: number;
  altitude?: number;
  speed?: number;
  battery_level?: number;
  device_id?: string;
  transport_mode?: string;
  status: 'unknown' | 'moving' | 'stopped';
}

export interface NotificationPreference {
  id: string;
  parent_id?: string;
  student_id: string;
  email: string;
  whatsapp_number?: string;
  notification_type: 'whatsapp' | 'email' | 'both';
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  first_name?: string;
  last_name?: string;
  email: string;
  role?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SupabaseNotificationPreference {
  id: string;
  parent_id?: string;
  student_id: string;
  email: string;
  whatsapp_number?: string;
  notification_type: 'email' | 'both' | 'whatsapp';
  created_at: string;
  updated_at: string;
}

export interface GuardianData {
  nome: string;
  email: string;
  telefone?: string;
  is_primary?: boolean;
  cpf?: string;
  student_id: string;
}

export interface GuardianUpdateData {
  nome?: string;
  email?: string;
  telefone?: string;
  is_primary?: boolean;
  cpf?: string;
}

export interface LogEntry {
  id?: string;
  message: string;
  level: string;
  timestamp?: string;
  metadata?: Record<string, any>;
}
