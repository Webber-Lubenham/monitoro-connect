
import { safeQuery } from "@/integrations/supabase/safeQueryBuilder";
import { Location, LocationUpdateResponse } from "./locationTypes";

export const updateLocationInDatabase = async (
  location: Location,
  accuracy: number = 0
): Promise<LocationUpdateResponse> => {
  try {
    // Get current user session
    const { data: { session }, error: sessionError } = await safeQuery
      .from('auth.sessions')
      .select('user.id')
      .maybeSingle();
    
    if (sessionError) {
      console.error("Session error:", sessionError);
      return { 
        success: false, 
        error: "Erro de autenticação. Por favor, faça login novamente." 
      };
    }
    
    if (!session || !session.user) {
      console.error("No authenticated user found");
      return { 
        success: false, 
        error: "Usuário não autenticado. Por favor, faça login novamente." 
      };
    }
    
    const userId = session.user.id;
    console.log(`Updating location in database for user ${userId}:`, location);
    
    // Insert location into database using safeQuery
    const { error: insertError } = await safeQuery.insert(
      'location_updates',
      {
        student_id: userId,
        latitude: location.latitude,
        longitude: location.longitude,
        timestamp: new Date().toISOString(),
        accuracy: accuracy,
        altitude: location.altitude || null,
        speed: location.speed || null,
        status: 'unknown'
      }
    );
    
    if (insertError) {
      handleDatabaseError(insertError);
      return { 
        success: false, 
        error: `Erro ao salvar localização: ${insertError.message}` 
      };
    }
    
    // Check for guardians
    await verifyGuardians(userId);
    
    return { success: true };
  } catch (error) {
    console.error("Exception in updateLocationInDatabase:", error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return { 
      success: false, 
      error: `Exceção ao atualizar localização: ${errorMessage}` 
    };
  }
};

const verifyGuardians = async (userId: string): Promise<void> => {
  try {
    const { data: guardians, error } = await safeQuery
      .from('guardians')
      .select('*')
      .eq('student_id', userId);
    
    if (error) {
      console.error("Error checking guardians:", error);
      return;
    }
    
    if (!guardians || guardians.length === 0) {
      console.warn("No guardians found for student ID:", userId);
    } else {
      console.log(`Found ${guardians.length} guardians for student ID:`, userId);
    }
  } catch (error) {
    console.error("Exception checking guardians:", error);
  }
};

const handleDatabaseError = (error: any): void => {
  console.error("Database error:", error);
  
  // Analyze specific error codes for better feedback
  if (error.code === "23505") { // Unique constraint violation
    console.log("Duplicate entry detected");
  } else if (error.code === "23503") { // Foreign key constraint violation
    console.log("Referenced record doesn't exist");
  } else if (error.code === "42P01") { // Undefined table
    console.log("Table does not exist");
  } else if (error.code?.startsWith("42")) { // Syntax or permission error
    console.log("SQL syntax or permission error");
  } else if (error.code?.startsWith("28")) { // Authentication error
    console.log("Authentication error");
  }
};

export const getStudentLocationStatus = async (
  studentId: string
): Promise<'in_class' | 'in_transit' | 'unknown'> => {
  try {
    const { data, error } = await safeQuery
      .from('location_updates')
      .select('status')
      .eq('student_id', studentId)
      .order('timestamp', { ascending: false })
      .limit(1)
      .single();
    
    if (error || !data) {
      return 'unknown';
    }
    
    return data.status as 'in_class' | 'in_transit' | 'unknown' || 'unknown';
  } catch (error) {
    console.error("Error getting student location status:", error);
    return 'unknown';
  }
};
