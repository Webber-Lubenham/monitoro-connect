
import { supabase } from "@/integrations/supabase/client";
import { Guardian, LogEntry } from "@/types/database.types";

// Type safe wrapper functions for common database operations
// These functions use typecasting to work around TypeScript limitations

/**
 * Get guardians for a student by student ID
 */
export async function getGuardiansForStudent(studentId: string): Promise<Guardian[]> {
  const { data, error } = await supabase
    .from('guardians')
    .select('*')
    .eq('student_id', studentId);
    
  if (error) {
    console.error("Error fetching guardians:", error);
    return [];
  }
  
  // Use type assertion to convert the result
  return data as unknown as Guardian[];
}

/**
 * Get a guardian by ID
 */
export async function getGuardianById(guardianId: string): Promise<Guardian | null> {
  const { data, error } = await supabase
    .from('guardians')
    .select('*')
    .eq('id', guardianId)
    .single();
    
  if (error) {
    console.error("Error fetching guardian:", error);
    return null;
  }
  
  // Use type assertion to convert the result
  return data as unknown as Guardian;
}

/**
 * Add a log entry
 */
export async function addLogEntry(logEntry: LogEntry): Promise<boolean> {
  const { error } = await supabase
    .from('logs')
    .insert(logEntry);
    
  if (error) {
    console.error("Error adding log entry:", error);
    return false;
  }
  
  return true;
}

/**
 * Update a location for a student
 */
export async function updateLocation(
  studentId: string, 
  latitude: number, 
  longitude: number,
  accuracy?: number,
  altitude?: number
): Promise<boolean> {
  const { error } = await supabase
    .from('location_updates')
    .insert({
      student_id: studentId,
      latitude,
      longitude,
      accuracy,
      altitude,
      timestamp: new Date().toISOString()
    });
    
  if (error) {
    console.error("Error updating location:", error);
    return false;
  }
  
  return true;
}

/**
 * Check if email exists in guardians
 */
export async function checkExistingGuardianEmail(
  studentId: string, 
  email: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from('guardians')
    .select('id')
    .eq('student_id', studentId)
    .eq('email', email.toLowerCase().trim());
    
  if (error) {
    console.error("Error checking guardian email:", error);
    return false;
  }
  
  return (data?.length || 0) > 0;
}
