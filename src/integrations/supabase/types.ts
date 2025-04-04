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
          created_at: string
          id: string
          is_primary: boolean | null
          parent_id: string | null
          relation: string | null
          student_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_primary?: boolean | null
          parent_id?: string | null
          relation?: string | null
          student_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_primary?: boolean | null
          parent_id?: string | null
          relation?: string | null
          student_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      guardian_students: {
        Row: {
          created_at: string
          guardian_id: string
          id: string
          is_approved: boolean
          relation_type: string
          student_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          guardian_id: string
          id?: string
          is_approved?: boolean
          relation_type: string
          student_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          guardian_id?: string
          id?: string
          is_approved?: boolean
          relation_type?: string
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "guardian_students_guardian_id_fkey"
            columns: ["guardian_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guardian_students_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      guardians: {
        Row: {
          cpf: string | null
          created_at: string
          email: string
          guardian_id: string | null
          id: string
          invitation_sent_at: string | null
          is_primary: boolean
          nome: string
          sms_number: string | null
          status: string | null
          student_id: string
          telefone: string
          temp_password: string | null
          updated_at: string
          whatsapp_number: string | null
        }
        Insert: {
          cpf?: string | null
          created_at?: string
          email: string
          guardian_id?: string | null
          id?: string
          invitation_sent_at?: string | null
          is_primary?: boolean
          nome: string
          sms_number?: string | null
          status?: string | null
          student_id: string
          telefone: string
          temp_password?: string | null
          updated_at?: string
          whatsapp_number?: string | null
        }
        Update: {
          cpf?: string | null
          created_at?: string
          email?: string
          guardian_id?: string | null
          id?: string
          invitation_sent_at?: string | null
          is_primary?: boolean
          nome?: string
          sms_number?: string | null
          status?: string | null
          student_id?: string
          telefone?: string
          temp_password?: string | null
          updated_at?: string
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      location_updates: {
        Row: {
          accuracy: number | null
          altitude: number | null
          battery_level: number | null
          created_at: string
          device_id: string | null
          id: string
          latitude: number
          longitude: number
          speed: number | null
          status: string | null
          student_id: string
          timestamp: string
          transport_mode: string | null
        }
        Insert: {
          accuracy?: number | null
          altitude?: number | null
          battery_level?: number | null
          created_at?: string
          device_id?: string | null
          id?: string
          latitude: number
          longitude: number
          speed?: number | null
          status?: string | null
          student_id: string
          timestamp?: string
          transport_mode?: string | null
        }
        Update: {
          accuracy?: number | null
          altitude?: number | null
          battery_level?: number | null
          created_at?: string
          device_id?: string | null
          id?: string
          latitude?: number
          longitude?: number
          speed?: number | null
          status?: string | null
          student_id?: string
          timestamp?: string
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
          timestamp: string
        }
        Insert: {
          id?: string
          level: string
          message: string
          metadata?: Json | null
          timestamp?: string
        }
        Update: {
          id?: string
          level?: string
          message?: string
          metadata?: Json | null
          timestamp?: string
        }
        Relationships: []
      }
      notification_logs: {
        Row: {
          created_at: string
          guardian_id: string | null
          id: string
          message: string | null
          metadata: Json | null
          notification_type: string
          recipient_email: string | null
          sent_at: string
          status: string
          student_id: string
        }
        Insert: {
          created_at?: string
          guardian_id?: string | null
          id?: string
          message?: string | null
          metadata?: Json | null
          notification_type: string
          recipient_email?: string | null
          sent_at?: string
          status: string
          student_id: string
        }
        Update: {
          created_at?: string
          guardian_id?: string | null
          id?: string
          message?: string | null
          metadata?: Json | null
          notification_type?: string
          recipient_email?: string | null
          sent_at?: string
          status?: string
          student_id?: string
        }
        Relationships: []
      }
      parent_notification_preferences: {
        Row: {
          created_at: string
          email: string
          id: string
          notification_type: string
          parent_id: string | null
          student_id: string
          updated_at: string
          whatsapp_number: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          notification_type: string
          parent_id?: string | null
          student_id: string
          updated_at?: string
          whatsapp_number?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          notification_type?: string
          parent_id?: string | null
          student_id?: string
          updated_at?: string
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          first_name: string
          id: string
          last_name: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          first_name: string
          id: string
          last_name: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          first_name?: string
          id?: string
          last_name?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      schools: {
        Row: {
          address: string | null
          created_at: string
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_student_profile: {
        Args: {
          user_id: string
          student_name: string
          student_email: string
          student_cpf: string
          student_grade: string
          parent_name: string
          parent_email: string
          parent_phone: string
          parent_cpf: string
        }
        Returns: undefined
      }
      is_guardian: {
        Args: {
          uid: string
        }
        Returns: boolean
      }
      is_student: {
        Args: {
          uid: string
        }
        Returns: boolean
      }
      table_exists: {
        Args: {
          schema_name: string
          table_name: string
        }
        Returns: boolean
      }
    }
    Enums: {
      user_role: "student" | "guardian"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
