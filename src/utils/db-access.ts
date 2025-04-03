
import { supabase } from "@/integrations/supabase/client";
import { Guardian, Profile } from "@/types/database.types";

/**
 * A collection of type-safe database access functions
 * to work around TypeScript Supabase client limitations
 */

/**
 * Get user profile by ID
 */
export async function getUserProfile(userId: string): Promise<Profile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
    
    return data as unknown as Profile;
  } catch (error) {
    console.error("Exception fetching profile:", error);
    return null;
  }
}

/**
 * Create or update a guardian
 */
export async function saveGuardian(guardian: Partial<Guardian> & { student_id: string }): Promise<string | null> {
  try {
    // Make sure email is provided since it's required by the database
    if (!guardian.email) {
      console.error("Error saving guardian: Email is required");
      return null;
    }
    
    // Create copy of guardian with required fields
    const guardianToSave = {
      ...guardian,
      nome: guardian.nome || '',
      telefone: guardian.telefone || '',
      email: guardian.email,
      is_primary: guardian.is_primary ?? false
    };
    
    const { data, error } = await supabase
      .from('guardians')
      .upsert(guardianToSave)
      .select('id')
      .single();
      
    if (error) {
      console.error("Error saving guardian:", error);
      return null;
    }
    
    return data?.id || null;
  } catch (error) {
    console.error("Exception saving guardian:", error);
    return null;
  }
}

/**
 * Delete a guardian
 */
export async function deleteGuardian(guardianId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('guardians')
      .delete()
      .eq('id', guardianId);
      
    if (error) {
      console.error("Error deleting guardian:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Exception deleting guardian:", error);
    return false;
  }
}

/**
 * Get all guardians for a student
 */
export async function getGuardians(studentId: string): Promise<Guardian[]> {
  try {
    const { data, error } = await supabase
      .from('guardians')
      .select('*')
      .eq('student_id', studentId);
      
    if (error) {
      console.error("Error fetching guardians:", error);
      return [];
    }
    
    return data as unknown as Guardian[];
  } catch (error) {
    console.error("Exception fetching guardians:", error);
    return [];
  }
}
