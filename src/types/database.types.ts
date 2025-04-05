// This file defines types for database tables that are used throughout the application
import type { Database } from '@/integrations/supabase/database.types';

// Define a Profile type based on the schema
export interface Profile {
  id: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  full_name?: string;
  avatar_url?: string;
  user_type?: string;
  created_at?: string;
  updated_at?: string;
}

// Define a LogEntry type for the logging system
export interface LogEntry {
  id: string;
  message: string;
  level: string;
  timestamp: string;
metadata?: Record<string, unknown>;
}

// Define a GuardianForm type for handling guardian data
export interface GuardianForm {
  id?: string;
  student_id: string;
  nome: string;
  telefone: string;
  email: string;
  is_primary?: boolean;
  cpf?: string;
  whatsapp_number?: string;
  status?: string;
}

// Define a Guardian type based on the database schema
export type Guardian = Database['public']['Tables']['guardians']['Row'];

// Define a NotificationPreference type based on the database schema
export interface NotificationPreference {
  id: string;
  parent_id?: string;
  user_id?: string;
  student_id: string;
  notification_type: string;
  email: string;
  whatsapp_number?: string;
  created_at: string;
  updated_at: string;
  // For the UI layer
  location_notifications?: boolean;
  email_notifications?: boolean;
  sms_notifications?: boolean;
  app_notifications?: boolean;
  guardian_id?: string;
}

// Export other useful types from the database schema as needed
export type LocationUpdate = Database['public']['Tables']['location_updates']['Row'];
export type School = Database['public']['Tables']['schools']['Row'];
export type StudentInvitation = Database['public']['Tables']['student_invitations']['Row'];
export type Child = Database['public']['Tables']['children']['Row'];
export type NotificationLog = Database['public']['Tables']['notification_logs']['Row'];
export type ParentNotificationPreference = Database['public']['Tables']['parent_notification_preferences']['Row'];
