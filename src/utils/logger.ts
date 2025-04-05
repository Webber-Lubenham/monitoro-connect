
import { supabase } from '@/integrations/supabase/client';
import { LogEntry } from '@/types/database.types';

const LOG_LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  fatal: 4
};

/**
 * Inserts logs into the database
 */
export const insertLogs = async (logs: LogEntry[]): Promise<boolean> => {
  try {
    if (!logs || logs.length === 0) return true;

    const convertedLogs = logs.map(log => ({
      message: log.message,
      level: log.level,
      timestamp: log.timestamp || new Date().toISOString(),
      metadata: log.metadata || {}
    }));

    // Insert logs into the database
    const { error } = await supabase
      .from('logs')
      .insert(convertedLogs as any);

    if (error) {
      console.error('Failed to insert logs into database:', error);
      return false;
    }

    return true;
  } catch (e) {
    console.error('Exception in insertLogs:', e);
    return false;
  }
};

/**
 * Log a message with additional metadata
 */
export const logMessage = async (
  level: string,
  message: string,
  metadata?: Record<string, any>
): Promise<boolean> => {
  try {
    const logEntry: LogEntry = {
      message,
      level,
      timestamp: new Date().toISOString(),
      metadata
    };

    // Always log to console
    const consoleMethod = level === 'error' || level === 'fatal' 
      ? console.error 
      : level === 'warn' 
        ? console.warn 
        : console.log;
    
    consoleMethod(`[${level.toUpperCase()}] ${message}`, metadata || '');

    // Insert into database
    return await insertLogs([logEntry]);
  } catch (e) {
    console.error('Exception in logMessage:', e);
    return false;
  }
};

/**
 * Global logger object
 */
export const logger = {
  debug: (message: string, metadata?: Record<string, any>) => logMessage('debug', message, metadata),
  info: (message: string, metadata?: Record<string, any>) => logMessage('info', message, metadata),
  warn: (message: string, metadata?: Record<string, any>) => logMessage('warn', message, metadata),
  error: (message: string, metadata?: Record<string, any>) => logMessage('error', message, metadata),
  fatal: (message: string, metadata?: Record<string, any>) => logMessage('fatal', message, metadata),
};
