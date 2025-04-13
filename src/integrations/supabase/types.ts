export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      children: {
        Row: {
          created_at: string | null
          id: string
          is_primary: boolean | null
          parent_id: string
          relation: string | null
          student_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          parent_id: string
          relation?: string | null
          student_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          parent_id?: string
          relation?: string | null
          student_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      guardian_students: {
        Row: {
          created_at: string | null
          guardian_id: string
          id: string
          is_approved: boolean | null
          relation_type: string
          student_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          guardian_id: string
          id?: string
          is_approved?: boolean | null
          relation_type: string
          student_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          guardian_id?: string
          id?: string
          is_approved?: boolean | null
          relation_type?: string
          student_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      guardians: {
        Row: {
          cpf: string | null
          created_at: string | null
          document_number: string | null
          document_type: string | null
          email: string | null
          guardian_id: string | null
          id: string
          invitation_sent_at: string | null
          is_primary: boolean | null
          nome: string | null
          phone: string
          sms_number: string | null
          status: string | null
          student_id: string | null
          telefone: string | null
          temp_password: string | null
          updated_at: string | null
          whatsapp_number: string | null
        }
        Insert: {
          cpf?: string | null
          created_at?: string | null
          document_number?: string | null
          document_type?: string | null
          email?: string | null
          guardian_id?: string | null
          id: string
          invitation_sent_at?: string | null
          is_primary?: boolean | null
          nome?: string | null
          phone: string
          sms_number?: string | null
          status?: string | null
          student_id?: string | null
          telefone?: string | null
          temp_password?: string | null
          updated_at?: string | null
          whatsapp_number?: string | null
        }
        Update: {
          cpf?: string | null
          created_at?: string | null
          document_number?: string | null
          document_type?: string | null
          email?: string | null
          guardian_id?: string | null
          id?: string
          invitation_sent_at?: string | null
          is_primary?: boolean | null
          nome?: string | null
          phone?: string
          sms_number?: string | null
          status?: string | null
          student_id?: string | null
          telefone?: string | null
          temp_password?: string | null
          updated_at?: string | null
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      institutions: {
        Row: {
          address: string | null
          created_at: string | null
          document: string | null
          email_domain: string | null
          id: string
          name: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          document?: string | null
          email_domain?: string | null
          id: string
          name: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          document?: string | null
          email_domain?: string | null
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      invitations: {
        Row: {
          created_at: string | null
          email: string
          expires_at: string
          id: string
          invitation_type: string
          metadata: Json | null
          recipient_type: string
          sender_id: string
          status: string
          token: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          expires_at: string
          id?: string
          invitation_type: string
          metadata?: Json | null
          recipient_type: string
          sender_id: string
          status?: string
          token: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          expires_at?: string
          id?: string
          invitation_type?: string
          metadata?: Json | null
          recipient_type?: string
          sender_id?: string
          status?: string
          token?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      location_updates: {
        Row: {
          accuracy: number | null
          altitude: number | null
          battery_level: number | null
          created_at: string | null
          device_id: string | null
          id: string
          latitude: number
          longitude: number
          speed: number | null
          status: string | null
          student_id: string
          timestamp: string | null
          transport_mode: string | null
        }
        Insert: {
          accuracy?: number | null
          altitude?: number | null
          battery_level?: number | null
          created_at?: string | null
          device_id?: string | null
          id?: string
          latitude: number
          longitude: number
          speed?: number | null
          status?: string | null
          student_id: string
          timestamp?: string | null
          transport_mode?: string | null
        }
        Update: {
          accuracy?: number | null
          altitude?: number | null
          battery_level?: number | null
          created_at?: string | null
          device_id?: string | null
          id?: string
          latitude?: number
          longitude?: number
          speed?: number | null
          status?: string | null
          student_id?: string
          timestamp?: string | null
          transport_mode?: string | null
        }
        Relationships: []
      }
      logs: {
        Row: {
          id: string
          level: string
          message: string
          metadata: Json | null
          timestamp: string | null
        }
        Insert: {
          id?: string
          level?: string
          message: string
          metadata?: Json | null
          timestamp?: string | null
        }
        Update: {
          id?: string
          level?: string
          message?: string
          metadata?: Json | null
          timestamp?: string | null
        }
        Relationships: []
      }
      notification_logs: {
        Row: {
          created_at: string | null
          guardian_id: string | null
          id: string
          message: string | null
          notification_type: string
          sent_at: string | null
          status: string
          student_id: string
        }
        Insert: {
          created_at?: string | null
          guardian_id?: string | null
          id?: string
          message?: string | null
          notification_type: string
          sent_at?: string | null
          status: string
          student_id: string
        }
        Update: {
          created_at?: string | null
          guardian_id?: string | null
          id?: string
          message?: string | null
          notification_type?: string
          sent_at?: string | null
          status?: string
          student_id?: string
        }
        Relationships: []
      }
      notification_preferences: {
        Row: {
          created_at: string | null
          email_notifications: boolean | null
          id: string
          location_alerts: boolean | null
          push_notifications: boolean | null
          quiet_hours_end: string | null
          quiet_hours_start: string | null
          security_alerts: boolean | null
          sms_notifications: boolean | null
          status_updates: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          location_alerts?: boolean | null
          push_notifications?: boolean | null
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          security_alerts?: boolean | null
          sms_notifications?: boolean | null
          status_updates?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          location_alerts?: boolean | null
          push_notifications?: boolean | null
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          security_alerts?: boolean | null
          sms_notifications?: boolean | null
          status_updates?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          guardian_email: string
          guardian_name: string
          id: string
          latitude: number
          longitude: number
          sent_at: string | null
          status: string | null
          student_email: string
          student_id: string | null
          student_name: string
        }
        Insert: {
          created_at?: string | null
          guardian_email: string
          guardian_name: string
          id?: string
          latitude: number
          longitude: number
          sent_at?: string | null
          status?: string | null
          student_email: string
          student_id?: string | null
          student_name: string
        }
        Update: {
          created_at?: string | null
          guardian_email?: string
          guardian_name?: string
          id?: string
          latitude?: number
          longitude?: number
          sent_at?: string | null
          status?: string | null
          student_email?: string
          student_id?: string | null
          student_name?: string
        }
        Relationships: []
      }
      parent_notification_preferences: {
        Row: {
          created_at: string | null
          email: string
          id: string
          notification_type: string
          parent_id: string | null
          student_id: string
          updated_at: string | null
          user_id: string | null
          whatsapp_number: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          notification_type: string
          parent_id?: string | null
          student_id: string
          updated_at?: string | null
          user_id?: string | null
          whatsapp_number?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          notification_type?: string
          parent_id?: string | null
          student_id?: string
          updated_at?: string | null
          user_id?: string | null
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      parents: {
        Row: {
          cpf: string | null
          created_at: string
          email: string | null
          id: string
          name: string | null
          phone: string | null
          student_id: string | null
        }
        Insert: {
          cpf?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          phone?: string | null
          student_id?: string | null
        }
        Update: {
          cpf?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          phone?: string | null
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "parents_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      privacy_settings: {
        Row: {
          created_at: string | null
          id: string
          location_history_days: number | null
          share_contact_info: boolean | null
          share_location: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          location_history_days?: number | null
          share_contact_info?: boolean | null
          share_location?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          location_history_days?: number | null
          share_contact_info?: boolean | null
          share_location?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          full_name: string
          id: string
          last_name: string | null
          role: string | null
          updated_at: string | null
          user_type: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          full_name: string
          id: string
          last_name?: string | null
          role?: string | null
          updated_at?: string | null
          user_type: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          full_name?: string
          id?: string
          last_name?: string | null
          role?: string | null
          updated_at?: string | null
          user_type?: string
        }
        Relationships: []
      }
      relationships: {
        Row: {
          access_level: string
          created_at: string | null
          guardian_id: string
          id: string
          relationship_type: string
          status: string
          student_id: string
          updated_at: string | null
        }
        Insert: {
          access_level?: string
          created_at?: string | null
          guardian_id: string
          id?: string
          relationship_type: string
          status?: string
          student_id: string
          updated_at?: string | null
        }
        Update: {
          access_level?: string
          created_at?: string | null
          guardian_id?: string
          id?: string
          relationship_type?: string
          status?: string
          student_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "relationships_guardian_id_fkey"
            columns: ["guardian_id"]
            isOneToOne: false
            referencedRelation: "guardians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "relationships_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      schools: {
        Row: {
          address: string | null
          created_at: string | null
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      student_invitations: {
        Row: {
          accepted: boolean | null
          accepted_at: string | null
          birth_date: string
          created_at: string | null
          email: string
          expires_at: string
          full_name: string
          guardian_id: string
          id: string
          invitation_token: string
          student_id: string | null
          temporary_password: string
          used: boolean | null
        }
        Insert: {
          accepted?: boolean | null
          accepted_at?: string | null
          birth_date: string
          created_at?: string | null
          email: string
          expires_at: string
          full_name: string
          guardian_id: string
          id?: string
          invitation_token: string
          student_id?: string | null
          temporary_password: string
          used?: boolean | null
        }
        Update: {
          accepted?: boolean | null
          accepted_at?: string | null
          birth_date?: string
          created_at?: string | null
          email?: string
          expires_at?: string
          full_name?: string
          guardian_id?: string
          id?: string
          invitation_token?: string
          student_id?: string | null
          temporary_password?: string
          used?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "student_invitations_guardian_id_fkey"
            columns: ["guardian_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          birth_date: string | null
          class: string | null
          created_at: string | null
          enrollment_number: string | null
          id: string
          institution_id: string | null
          updated_at: string | null
        }
        Insert: {
          birth_date?: string | null
          class?: string | null
          created_at?: string | null
          enrollment_number?: string | null
          id: string
          institution_id?: string | null
          updated_at?: string | null
        }
        Update: {
          birth_date?: string | null
          class?: string | null
          created_at?: string | null
          enrollment_number?: string | null
          id?: string
          institution_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "students_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          image: string | null
          name: string | null
          token_identifier: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          image?: string | null
          name?: string | null
          token_identifier: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          image?: string | null
          name?: string | null
          token_identifier?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
