
// Extension types for Supabase integration
// These types extend or complement the base Supabase types without modifying them

import { Database } from '@/integrations/supabase/types';

// Type for email service responses
export interface EmailServiceResponse {
  success: boolean;
  message?: string;
  error?: any;
  data?: any;
}

// Type for notification-related functions
export interface NotificationParams {
  guardianEmail: string;
  guardianName: string;
  studentName: string;
  location?: {
    latitude: number;
    longitude: number;
    accuracy?: number;
    timestamp?: string;
  };
  message?: string;
  type?: 'location' | 'emergency' | 'general';
}

// Type-safe access to Supabase tables
export type Tables = Database['public']['Tables'];
export type TablesInsert<T extends keyof Tables> = Tables[T]['Insert'];
export type TablesRow<T extends keyof Tables> = Tables[T]['Row'];
export type TablesUpdate<T extends keyof Tables> = Tables[T]['Update'];
