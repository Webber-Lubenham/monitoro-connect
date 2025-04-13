import { PostgrestError, PostgrestQueryBuilder, PostgrestFilterBuilder } from '@supabase/supabase-js';
import { supabase } from './client';

export interface GenericStringError {
  message: string;
  code?: string;
  details?: string;
}

// Note: This is a simplified version of the query builder with more flexible types
export class SafeQueryBuilder {
  // Generic select query with better error handling
  static async select<T = any>(
    table: string,
    query: string = '*',
    options: {
      errorMessage?: string;
      single?: boolean;
      match?: Record<string, any>;
      order?: { column: string; ascending?: boolean };
      limit?: number;
    } = {}
  ): Promise<{ data: T | null; error: PostgrestError | null }> {
    try {
      let builder = supabase.from(table).select(query);
      
      // Add match conditions if provided
      if (options.match) {
        Object.entries(options.match).forEach(([key, value]) => {
          builder = builder.eq(key, value);
        });
      }
      
      // Add ordering if provided
      if (options.order) {
        builder = builder.order(
          options.order.column,
          { ascending: options.order.ascending ?? true }
        );
      }
      
      // Add limit if provided
      if (options.limit) {
        builder = builder.limit(options.limit);
      }
      
      // Execute as single or multiple
      if (options.single) {
        const { data, error } = await builder.maybeSingle();
        return { data: data as T, error };
      } else {
        const { data, error } = await builder;
        return { data: data as T, error };
      }
    } catch (err) {
      console.error(`Error in SafeQueryBuilder.select(${table}):`, err);
      const genericError = {
        message: options.errorMessage || `Failed to query ${table}`,
        details: err instanceof Error ? err.message : String(err),
        code: 'query_execution_error'
      };
      
      return { 
        data: null, 
        error: {
          message: genericError.message,
          details: genericError.details,
          hint: '',
          code: genericError.code
        } 
      };
    }
  }
  
  // Other methods like insert, update, delete, etc. can be added as needed
}
