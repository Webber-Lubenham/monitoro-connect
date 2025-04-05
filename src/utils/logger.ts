
import { supabase } from '@/integrations/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';
import { LogEntry } from '@/types/database.types';

// Log levels
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
}

/**
 * Logs a message to the database
 * @param level Log level
 * @param message Log message
 * @param metadata Optional metadata
 */
export const logToDatabase = async (
  level: LogLevel,
  message: string,
  metadata?: Record<string, any>
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('logs')
      .insert({
        level,
        message,
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
 * Fetches logs from the database
 * @param limit Maximum number of logs to fetch
 * @param level Optional log level filter
 * @returns Array of log entries
 */
export const fetchLogs = async (
  limit: number = 100,
  level?: LogLevel
): Promise<LogEntry[]> => {
  try {
    let query = supabase
      .from('logs')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (level) {
      query = query.eq('level', level);
    }

    const { data, error } = await query;

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
