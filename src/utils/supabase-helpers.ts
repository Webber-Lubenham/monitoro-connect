
import { supabase } from '@/integrations/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';
import { LogEntry } from '@/types/database.types';

/**
 * Logs an error to the database
 * @param message Error message
 * @param metadata Additional metadata
 */
export const logErrorToDatabase = async (
  message: string,
  metadata?: Record<string, any>
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('logs')
      .insert({
        message,
        level: 'error',
        metadata,
        timestamp: new Date().toISOString(),
      });

    if (error) {
      console.error('Error logging to database:', error);
    }
  } catch (err) {
    console.error('Exception logging to database:', err);
  }
};

/**
 * Logs information to the database
 * @param message Info message
 * @param metadata Additional metadata
 */
export const logInfoToDatabase = async (
  message: string,
  metadata?: Record<string, any>
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('logs')
      .insert({
        message,
        level: 'info',
        metadata,
        timestamp: new Date().toISOString(),
      });

    if (error) {
      console.error('Error logging to database:', error);
    }
  } catch (err) {
    console.error('Exception logging to database:', err);
  }
};

/**
 * Fetches recent logs from the database
 * @param limit Number of logs to fetch
 * @returns Array of log entries
 */
export const fetchRecentLogs = async (limit: number = 50): Promise<LogEntry[]> => {
  try {
    const { data, error } = await supabase
      .from('logs')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching logs:', error);
      return [];
    }

    return data as LogEntry[];
  } catch (err) {
    console.error('Exception fetching logs:', err);
    return [];
  }
};

/**
 * Fetches logs by level from the database
 * @param level Log level to fetch
 * @param limit Number of logs to fetch
 * @returns Array of log entries
 */
export const fetchLogsByLevel = async (
  level: string,
  limit: number = 50
): Promise<LogEntry[]> => {
  try {
    const { data, error } = await supabase
      .from('logs')
      .select('*')
      .eq('level', level)
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching logs:', error);
      return [];
    }

    return data as LogEntry[];
  } catch (err) {
    console.error('Exception fetching logs:', err);
    return [];
  }
};
