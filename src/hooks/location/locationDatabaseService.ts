
import { supabase } from '@/integrations/supabase/client';
import { getGeoLocation } from './locationUtils';

/**
 * Save current location to database
 */
export const saveCurrentLocation = async (): Promise<boolean> => {
  try {
    // Get user session
    const { data } = await supabase.auth.getSession();
    const session = data.session;
    
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
