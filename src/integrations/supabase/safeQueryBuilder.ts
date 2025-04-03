
import { PostgrestFilterBuilder, PostgrestQueryBuilder } from '@supabase/postgrest-js';
import { supabase } from './client';

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
  from: (table: string): PostgrestQueryBuilder<any, any, any, any> => {
    // @ts-ignore - We're intentionally bypassing type checking
    return supabase.from(table);
  },

  /**
   * Safely insert data into any table
   * @param table The table name to insert into
   * @param data The data to insert
   * @returns A filter builder for the insert operation
   */
  insert: (table: string, data: any): PostgrestFilterBuilder<any, any, any, any> => {
    // @ts-ignore - We're intentionally bypassing type checking
    return supabase.from(table).insert(data);
  },

  /**
   * Safely update data in any table
   * @param table The table name to update
   * @param data The data to update
   * @returns A filter builder for the update operation
   */
  update: (table: string, data: any): PostgrestFilterBuilder<any, any, any, any> => {
    // @ts-ignore - We're intentionally bypassing type checking
    return supabase.from(table).update(data);
  },

  /**
   * Safely delete data from any table
   * @param table The table name to delete from
   * @returns A filter builder for the delete operation
   */
  delete: (table: string): PostgrestFilterBuilder<any, any, any, any> => {
    // @ts-ignore - We're intentionally bypassing type checking
    return supabase.from(table).delete();
  }
};
