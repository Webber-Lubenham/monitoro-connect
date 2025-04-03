
// If this file exists, just add the Guardian type and export it
export interface Guardian {
  id: string;
  student_id: string;
  nome: string;
  telefone?: string;
  email: string;
  is_primary?: boolean;
  cpf?: string;
  created_at?: string;
  updated_at?: string;
  invitation_sent_at?: string;
  invitation_token?: string;
  whatsapp_number?: string;
  guardian_id?: string;
  is_approved?: boolean;
}

// Add GuardianForm interface which was missing
export interface GuardianForm {
  nome: string;
  telefone: string;
  email: string;
  isPrimary: boolean;
  cpf?: string;
}

// Add Profile interface which was missing
export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  role?: string;
  created_at?: string;
  updated_at?: string;
}

// Update NotificationPreference to match the schema - combined both versions
export interface NotificationPreference {
  id: string;
  guardian_id: string;
  location_notifications: boolean;
  email_notifications: boolean;
  sms_notifications: boolean;
  app_notifications: boolean;
  created_at: string;
  updated_at: string;
  
  // Added these properties to fix type errors in NotificationPreferences.tsx
  student_id: string;
  email: string;
  whatsapp_number?: string;
  notification_type: string;
}

// Add LogEntry interface
export interface LogEntry {
  id: string;
  message: string;
  level: string;
  timestamp: string;
  metadata?: any;
}

export interface LocationUpdate {
  id: string;
  student_id: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number;
  timestamp: string;
  created_at: string;
}

export interface School {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
  address?: string;
  created_at: string;
  updated_at: string;
}
