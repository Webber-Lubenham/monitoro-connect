import { PostgrestFilterBuilder, PostgrestQueryBuilder } from '@supabase/postgrest-js';
import { supabase } from './client';
import { Database } from './database.types';

type Tables = Database['public']['Tables'];
type TableNames = keyof Tables;

/**
 * A wrapper for Supabase that allows safely querying tables that may not exist in 
 * the TypeScript types but do exist in the database.
 */
export const safeQuery = {
  /**
   * Safely query any table in the database
   * @param table The table name to query
   * @returns A query builder for the specified table
   */
  from: <T = any>(table: string): PostgrestQueryBuilder<any, any, T, any> => {
    return supabase.from(table);
  },

  /**
   * Safely insert data into any table
   * @param table The table name to insert into
   * @param data The data to insert
   * @returns A filter builder for the insert operation
   */
  insert: <T = any>(table: string, data: any): PostgrestFilterBuilder<any, any, T, any> => {
    return supabase.from(table).insert(data);
  },

  /**
   * Safely update data in any table
   * @param table The table name to update
   * @param data The data to update
   * @returns A filter builder for the update operation
   */
  update: <T = any>(table: string, data: any): PostgrestFilterBuilder<any, any, T, any> => {
    return supabase.from(table).update(data);
  },

  /**
   * Safely delete data from any table
   * @param table The table name to delete from
   * @returns A filter builder for the delete operation
   */
  delete: <T = any>(table: string): PostgrestFilterBuilder<any, any, T, any> => {
    return supabase.from(table).delete();
  },

  /**
   * Safely select specific columns from a table
   * @param table The table name to query
   * @param columns The columns to select
   * @returns A filter builder for the select operation
   */
  select: <T = any>(table: string, columns: string): PostgrestFilterBuilder<any, any, T, any> => {
    return supabase.from(table).select(columns);
  }
};

/**
 * Type-safe utility for handling database responses with null checks
 * @param result The result from a Supabase query
 * @param defaultValue Optional default value to return if result.data is null
 * @returns The data from the result, or the default value if data is null
 */
export function safeDataExtract<T>(
  result: { data: T | null; error: any },
  defaultValue: T | null = null
): T | null {
  if (result.error) {
    console.error('Database error:', result.error);
    return defaultValue;
  }
  return result.data || defaultValue;
}

/**
 * Safely convert a database entity to a specific type
 * @param entity The database entity to convert
 * @returns The entity cast to the specified type
 */
export function safeEntityCast<T>(entity: any): T {
  return entity as unknown as T;
}

export async function safeQuery<T extends object | null>(
  query: PostgrestFilterBuilder<any, any, T, any, unknown>
): Promise<T> {
  const { data, error } = await query.throwOnError();
  
  if (error) {
    throw error;
  }
  
  return data as T;
}
