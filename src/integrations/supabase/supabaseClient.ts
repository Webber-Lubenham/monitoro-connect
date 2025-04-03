
import { supabase } from "./client";
import { Database } from "./database.types";
import { PostgrestFilterBuilder, PostgrestQueryBuilder } from "@supabase/postgrest-js";

// Type-safe DB client that allows accessing all tables
export const db = {
  from: <T extends keyof Database['public']['Tables']>(
    table: T
  ): PostgrestQueryBuilder<Database['public']['Tables'], Database['public']['Tables'][T]['Row'], T> => {
    return supabase.from(table);
  },
  
  // Helper method for casting response data to a specific type
  cast: <T>(data: any): T => {
    return data as unknown as T;
  }
};

// Type assertion helper for when TypeScript has issues with table definitions
export function asType<T>(data: any): T {
  return data as unknown as T;
}
