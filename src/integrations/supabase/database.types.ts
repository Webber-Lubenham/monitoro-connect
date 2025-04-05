
// Define the database schema types for Supabase

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
          first_name: string | null
          last_name: string | null
          role: UserRole | null
          created_at: string | null
          updated_at: string | null
          email: string | null
          full_name: string | null
          name: string | null
          avatar_url: string | null
          user_type: string | null
        }
        Insert: {
          id: string
          first_name?: string | null
          last_name?: string | null
          role?: UserRole | null
          created_at?: string | null
          updated_at?: string | null
          email?: string | null
          full_name?: string | null
          name?: string | null
          avatar_url?: string | null
          user_type?: string | null
        }
        Update: {
          id?: string
          first_name?: string | null
          last_name?: string | null
          role?: UserRole | null
          created_at?: string | null
          updated_at?: string | null
          email?: string | null
          full_name?: string | null
          name?: string | null
          avatar_url?: string | null
          user_type?: string | null
        }
      }
      guardian_students: {
        Row: {
          id: string
          guardian_id: string
          student_id: string
          relation_type: string
          is_approved: boolean
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          guardian_id: string
          student_id: string
          relation_type: string
          is_approved?: boolean
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          guardian_id?: string
          student_id?: string
          relation_type?: string
          is_approved?: boolean
          created_at?: string | null
          updated_at?: string | null
        }
      }
      guardians: {
        Row: {
          id: string
          student_id: string | null
          nome: string | null
          telefone: string | null
          email: string | null
          is_primary: boolean | null
          created_at: string | null
          updated_at: string | null
          cpf: string | null
          temp_password: string | null
          invitation_sent_at: string | null
          status: string | null
          sms_number: string | null
          whatsapp_number: string | null
          guardian_id: string | null
          phone: string
          document_type: string | null
          document_number: string | null
        }
        Insert: {
          id?: string
          student_id?: string | null
          nome?: string | null
          telefone?: string | null
          email?: string | null
          is_primary?: boolean | null
          created_at?: string | null
          updated_at?: string | null
          cpf?: string | null
          temp_password?: string | null
          invitation_sent_at?: string | null
          status?: string | null
          sms_number?: string | null
          whatsapp_number?: string | null
          guardian_id?: string | null
          phone: string
          document_type?: string | null
          document_number?: string | null
        }
        Update: {
          id?: string
          student_id?: string | null
          nome?: string | null
          telefone?: string | null
          email?: string | null
          is_primary?: boolean | null
          created_at?: string | null
          updated_at?: string | null
          cpf?: string | null
          temp_password?: string | null
          invitation_sent_at?: string | null
          status?: string | null
          sms_number?: string | null
          whatsapp_number?: string | null
          guardian_id?: string | null
          phone?: string
          document_type?: string | null
          document_number?: string | null
        }
      }
      location_updates: {
        Row: {
          id: string
          student_id: string
          latitude: number
          longitude: number
          timestamp: string
          created_at: string | null
          accuracy: number | null
          altitude: number | null
          speed: number | null
          battery_level: number | null
          device_id: string | null
          transport_mode: string | null
          status: string | null
        }
        Insert: {
          id?: string
          student_id: string
          latitude: number
          longitude: number
          timestamp?: string
          created_at?: string | null
          accuracy?: number | null
          altitude?: number | null
          speed?: number | null
          battery_level?: number | null
          device_id?: string | null
          transport_mode?: string | null
          status?: string | null
        }
        Update: {
          id?: string
          student_id?: string
          latitude?: number
          longitude?: number
          timestamp?: string
          created_at?: string | null
          accuracy?: number | null
          altitude?: number | null
          speed?: number | null
          battery_level?: number | null
          device_id?: string | null
          transport_mode?: string | null
          status?: string | null
        }
      }
      student_invitations: {
        Row: {
          id: string
          student_id: string | null
          parent_id: string | null
          email: string
          token: string
          used: boolean | null
          created_at: string | null
          full_name: string
          invitation_token: string
          expires_at: string
          birth_date: string
          guardian_id: string
          accepted_at: string | null
          accepted: boolean | null
          temporary_password: string
        }
        Insert: {
          id?: string
          student_id?: string | null
          parent_id?: string | null
          email: string
          token: string
          used?: boolean | null
          created_at?: string | null
          full_name: string
          invitation_token?: string
          expires_at: string
          birth_date: string
          guardian_id: string
          accepted_at?: string | null
          accepted?: boolean | null
          temporary_password: string
        }
        Update: {
          id?: string
          student_id?: string | null
          parent_id?: string | null
          email?: string
          token?: string
          used?: boolean | null
          created_at?: string | null
          full_name?: string
          invitation_token?: string
          expires_at?: string
          birth_date?: string
          guardian_id?: string
          accepted_at?: string | null
          accepted?: boolean | null
          temporary_password?: string
        }
      }
      notification_logs: {
        Row: {
          id: string
          student_id: string
          guardian_id: string | null
          notification_type: string
          status: string
          sent_at: string | null
          message: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          student_id: string
          guardian_id?: string | null
          notification_type: string
          status: string
          sent_at?: string | null
          message?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          student_id?: string
          guardian_id?: string | null
          notification_type?: string
          status?: string
          sent_at?: string | null
          message?: string | null
          created_at?: string | null
        }
      }
      parent_notification_preferences: {
        Row: {
          id: string
          parent_id: string | null
          user_id: string | null
          student_id: string
          email: string
          whatsapp_number: string | null
          notification_type: 'email' | 'whatsapp' | 'both'
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          parent_id?: string | null
          user_id?: string | null
          student_id: string
          email: string
          whatsapp_number?: string | null
          notification_type: 'email' | 'whatsapp' | 'both'
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          parent_id?: string | null
          user_id?: string | null
          student_id?: string
          email?: string
          whatsapp_number?: string | null
          notification_type?: 'email' | 'whatsapp' | 'both'
          created_at?: string | null
          updated_at?: string | null
        }
      }
      schools: {
        Row: {
          id: string
          name: string
          address: string | null
          latitude: number | null
          longitude: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          address?: string | null
          latitude?: number | null
          longitude?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          address?: string | null
          latitude?: number | null
          longitude?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      logs: {
        Row: {
          id: string
          message: string
          level: string
          timestamp: string
          metadata: Json | null
        }
        Insert: {
          id?: string
          message: string
          level?: string
          timestamp?: string
          metadata?: Json | null
        }
        Update: {
          id?: string
          message?: string
          level?: string
          timestamp?: string
          metadata?: Json | null
        }
      }
      children: {
        Row: {
          id: string
          parent_id: string
          student_id: string
          relation: string | null
          is_primary: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          parent_id: string
          student_id: string
          relation?: string | null
          is_primary?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          parent_id?: string
          student_id?: string
          relation?: string | null
          is_primary?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      // Include all other tables from the database as needed
      institutions: {
        Row: {
          id: string
          name: string
          email_domain: string | null
          document: string | null
          address: string | null
          phone: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          email_domain?: string | null
          document?: string | null
          address?: string | null
          phone?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          email_domain?: string | null
          document?: string | null
          address?: string | null
          phone?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      },
      invitations: {
        Row: {
          id: string
          sender_id: string
          email: string
          token: string
          status: string
          expires_at: string
          invitation_type: string
          recipient_type: string
          metadata: Json | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          sender_id: string
          email: string
          token: string
          status?: string
          expires_at: string
          invitation_type: string
          recipient_type: string
          metadata?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          sender_id?: string
          email?: string
          token?: string
          status?: string
          expires_at?: string
          invitation_type?: string
          recipient_type?: string
          metadata?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
      },
      notification_preferences: {
        Row: {
          id: string
          user_id: string
          email_notifications: boolean | null
          push_notifications: boolean | null
          sms_notifications: boolean | null
          location_alerts: boolean | null
          security_alerts: boolean | null
          status_updates: boolean | null
          quiet_hours_start: string | null
          quiet_hours_end: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          email_notifications?: boolean | null
          push_notifications?: boolean | null
          sms_notifications?: boolean | null
          location_alerts?: boolean | null
          security_alerts?: boolean | null
          status_updates?: boolean | null
          quiet_hours_start?: string | null
          quiet_hours_end?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          email_notifications?: boolean | null
          push_notifications?: boolean | null
          sms_notifications?: boolean | null
          location_alerts?: boolean | null
          security_alerts?: boolean | null
          status_updates?: boolean | null
          quiet_hours_start?: string | null
          quiet_hours_end?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      },
      notifications: {
        Row: {
          id: string
          student_id: string | null
          student_name: string
          student_email: string
          guardian_name: string
          guardian_email: string
          latitude: number
          longitude: number
          status: string | null
          created_at: string | null
          sent_at: string | null
        }
        Insert: {
          id?: string
          student_id?: string | null
          student_name: string
          student_email: string
          guardian_name: string
          guardian_email: string
          latitude: number
          longitude: number
          status?: string | null
          created_at?: string | null
          sent_at?: string | null
        }
        Update: {
          id?: string
          student_id?: string | null
          student_name?: string
          student_email?: string
          guardian_name?: string
          guardian_email?: string
          latitude?: number
          longitude?: number
          status?: string | null
          created_at?: string | null
          sent_at?: string | null
        }
      },
      parents: {
        Row: {
          id: string
          name: string | null
          email: string | null
          phone: string | null
          cpf: string | null
          student_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name?: string | null
          email?: string | null
          phone?: string | null
          cpf?: string | null
          student_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          email?: string | null
          phone?: string | null
          cpf?: string | null
          student_id?: string | null
          created_at?: string
        }
      },
      privacy_settings: {
        Row: {
          id: string
          user_id: string
          share_location: boolean | null
          share_contact_info: boolean | null
          location_history_days: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          share_location?: boolean | null
          share_contact_info?: boolean | null
          location_history_days?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          share_location?: boolean | null
          share_contact_info?: boolean | null
          location_history_days?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
      },
      relationships: {
        Row: {
          id: string
          guardian_id: string
          student_id: string
          relationship_type: string
          access_level: string
          status: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          guardian_id: string
          student_id: string
          relationship_type: string
          access_level?: string
          status?: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          guardian_id?: string
          student_id?: string
          relationship_type?: string
          access_level?: string
          status?: string
          created_at?: string | null
          updated_at?: string | null
        }
      },
      students: {
        Row: {
          id: string
          enrollment_number: string | null
          class: string | null
          institution_id: string | null
          birth_date: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          enrollment_number?: string | null
          class?: string | null
          institution_id?: string | null
          birth_date?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          enrollment_number?: string | null
          class?: string | null
          institution_id?: string | null
          birth_date?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      },
      users: {
        Row: {
          id: string
          user_id: string | null
          email: string | null
          name: string | null
          full_name: string | null
          token_identifier: string
          avatar_url: string | null
          image: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id: string
          user_id?: string | null
          email?: string | null
          name?: string | null
          full_name?: string | null
          token_identifier: string
          avatar_url?: string | null
          image?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          email?: string | null
          name?: string | null
          full_name?: string | null
          token_identifier?: string
          avatar_url?: string | null
          image?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
    }
    Views: {}
    Functions: {
      get_profile_by_email: {
        Args: {
          email_param: string
        }
        Returns: {
          id: string
          email: string | null
        }[]
      }
    }
    Enums: {}
  }
}
