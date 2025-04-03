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

export interface NotificationPreference {
  id: string;
  guardian_id: string;
  location_notifications: boolean;
  email_notifications: boolean;
  sms_notifications: boolean;
  app_notifications: boolean;
  created_at: string;
  updated_at: string;
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
