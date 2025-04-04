
// Define the database schema types manually until they're properly generated

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'student' | 'guardian' | 'admin'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          first_name: string
          last_name: string
          role: UserRole
          created_at: string
          updated_at: string
          email?: string
          full_name?: string
          name?: string
        }
        Insert: {
          id: string
          first_name: string
          last_name: string
          role: UserRole
          created_at?: string
          updated_at?: string
          email?: string
          full_name?: string
          name?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          role?: UserRole
          created_at?: string
          updated_at?: string
          email?: string
          full_name?: string
          name?: string
        }
      }
      guardian_students: {
        Row: {
          id: string
          guardian_id: string
          student_id: string
          relation_type: string
          is_approved: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          guardian_id: string
          student_id: string
          relation_type: string
          is_approved?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          guardian_id?: string
          student_id?: string
          relation_type?: string
          is_approved?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      guardians: {
        Row: {
          id: string
          student_id: string
          nome: string
          telefone: string
          email: string
          is_primary: boolean
          created_at: string
          updated_at: string
          cpf?: string
          temp_password?: string
          invitation_sent_at?: string
          status?: string
          sms_number?: string
          whatsapp_number?: string
          guardian_id?: string
        }
        Insert: {
          id?: string
          student_id: string
          nome: string
          telefone: string
          email: string
          is_primary?: boolean
          created_at?: string
          updated_at?: string
          cpf?: string
          temp_password?: string
          invitation_sent_at?: string
          status?: string
          sms_number?: string
          whatsapp_number?: string
          guardian_id?: string
        }
        Update: {
          id?: string
          student_id?: string
          nome?: string
          telefone?: string
          email?: string
          is_primary?: boolean
          created_at?: string
          updated_at?: string
          cpf?: string
          temp_password?: string
          invitation_sent_at?: string
          status?: string
          sms_number?: string
          whatsapp_number?: string
          guardian_id?: string
        }
      }
      location_updates: {
        Row: {
          id: string
          student_id: string
          latitude: number
          longitude: number
          timestamp: string
          created_at: string
          accuracy?: number
          altitude?: number
          speed?: number
          battery_level?: number
          device_id?: string
          transport_mode?: string
          status?: string
        }
        Insert: {
          id?: string
          student_id: string
          latitude: number
          longitude: number
          timestamp?: string
          created_at?: string
          accuracy?: number
          altitude?: number
          speed?: number
          battery_level?: number
          device_id?: string
          transport_mode?: string
          status?: string
        }
        Update: {
          id?: string
          student_id?: string
          latitude?: number
          longitude?: number
          timestamp?: string
          created_at?: string
          accuracy?: number
          altitude?: number
          speed?: number
          battery_level?: number
          device_id?: string
          transport_mode?: string
          status?: string
        }
      }
      student_invitations: {
        Row: {
          id: string
          student_id: string
          parent_id?: string
          email: string
          token: string
          used: boolean
          created_at: string
        }
        Insert: {
          id?: string
          student_id: string
          parent_id?: string
          email: string
          token: string
          used?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          parent_id?: string
          email?: string
          token?: string
          used?: boolean
          created_at?: string
        }
      }
      notification_logs: {
        Row: {
          id: string
          student_id: string
          guardian_id?: string
          notification_type: string
          status: string
          sent_at: string
          message?: string
          created_at: string
        }
        Insert: {
          id?: string
          student_id: string
          guardian_id?: string
          notification_type: string
          status: string
          sent_at?: string
          message?: string
          created_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          guardian_id?: string
          notification_type?: string
          status?: string
          sent_at?: string
          message?: string
          created_at?: string
        }
      }
      parent_notification_preferences: {
        Row: {
          id: string
          parent_id?: string
          student_id: string
          email: string
          whatsapp_number?: string
          notification_type: 'email' | 'whatsapp' | 'both'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          parent_id?: string
          student_id: string
          email: string
          whatsapp_number?: string
          notification_type: 'email' | 'whatsapp' | 'both'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          parent_id?: string
          student_id?: string
          email?: string
          whatsapp_number?: string
          notification_type?: 'email' | 'whatsapp' | 'both'
          created_at?: string
          updated_at?: string
        }
      }
      schools: {
        Row: {
          id: string
          name: string
          address?: string
          latitude?: number
          longitude?: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          address?: string
          latitude?: number
          longitude?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string
          latitude?: number
          longitude?: number
          created_at?: string
          updated_at?: string
        }
      }
      children: {
        Row: {
          id: string
          parent_id: string
          student_id: string
          relation?: string
          is_primary: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          parent_id: string
          student_id: string
          relation?: string
          is_primary?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          parent_id?: string
          student_id?: string
          relation?: string
          is_primary?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}
