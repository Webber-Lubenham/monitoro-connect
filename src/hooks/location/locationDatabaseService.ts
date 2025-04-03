
import { supabase } from '@/integrations/supabase/client';
import { getGeoLocation } from './locationUtils';

/**
 * Save current location to database
 */
export const saveCurrentLocation = async (): Promise<boolean> => {
  try {
    // Get user session
    const { data } = await supabase.auth.getSession();
    const session = data?.session;
    
    if (!session?.user?.id) {
      console.error('User not authenticated');
      return false;
    }

    // Get current location
    const position = await getGeoLocation();
    if (!position) {
      console.error('Failed to get location');
      return false;
    }

    // Save location to database
    const { error } = await supabase
      .from('location_updates')
      .insert({
        student_id: session.user.id,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy ?? null,
        altitude: position.coords.altitude ?? null,
        timestamp: new Date().toISOString()
      });

    if (error) {
      console.error('Error saving location:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Exception saving location:', error);
    return false;
  }
};

/**
 * Update location in database
 * Simplified function called from position handler
 */
export const updateLocationInDatabase = async (
  location: { latitude: number; longitude: number; },
  accuracy: number
): Promise<{success: boolean, error?: string}> => {
  try {
    // Get user session
    const { data } = await supabase.auth.getSession();
    const session = data?.session;
    
    if (!session?.user?.id) {
      return { success: false, error: 'User not authenticated' };
    }

    const { error } = await supabase
      .from('location_updates')
      .insert({
        student_id: session.user.id,
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: accuracy,
        timestamp: new Date().toISOString()
      });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: errorMessage };
  }
};
