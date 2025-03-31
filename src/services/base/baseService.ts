
import { supabase } from '@/integrations/supabase';

// Export the supabase client as dbClient for consistent usage
export const dbClient = supabase;

// Logging utility for operations
export const logOperation = (message: string, error?: any) => {
  console.log(`[Operation] ${message}`);
  if (error) {
    console.error('Error details:', error);
  }
};

// Retry utility for database operations
export const retryOperation = async <T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> => {
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      console.warn(`Operation failed (attempt ${attempt}/${maxRetries}):`, error);
      
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
  }
  
  throw lastError;
};
