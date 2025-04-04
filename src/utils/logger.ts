import { supabase } from '@/lib/supabase';

type LogLevel = 'error' | 'info' | 'debug' | 'warn';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: any;
  userId?: string;
  error?: any;
}

class Logger {
  private async persistLog(entry: LogEntry) {
    try {
      const { error } = await supabase
        .from('logs')
        .insert([entry]);

      if (error) {
        console.error('Failed to persist log:', error);
      }
    } catch (e) {
      console.error('Error persisting log:', e);
    }
  }

  private formatError(error: any): string {
    if (error instanceof Error) {
      return `${error.name}: ${error.message}\nStack: ${error.stack}`;
    }
    return String(error);
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    data?: any,
    error?: any
  ): LogEntry {
    const user = supabase.auth.getUser();
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      data: data ? JSON.stringify(data) : undefined,
      userId: user ? (user as any).id : undefined,
      error: error ? this.formatError(error) : undefined
    };
  }

  error(message: string, error?: any, data?: any) {
    const entry = this.createLogEntry('error', message, data, error);
    console.error(`[${entry.timestamp}] ERROR: ${message}`, error, data);
    this.persistLog(entry);
  }

  warn(message: string, data?: any) {
    const entry = this.createLogEntry('warn', message, data);
    console.warn(`[${entry.timestamp}] WARN: ${message}`, data);
    this.persistLog(entry);
  }

  info(message: string, data?: any) {
    const entry = this.createLogEntry('info', message, data);
    console.info(`[${entry.timestamp}] INFO: ${message}`, data);
    this.persistLog(entry);
  }

  debug(message: string, data?: any) {
    if (import.meta.env.DEV) {
      const entry = this.createLogEntry('debug', message, data);
      console.debug(`[${entry.timestamp}] DEBUG: ${message}`, data);
      this.persistLog(entry);
    }
  }
}

export const logger = new Logger();
