
import { supabase } from '@/integrations/supabase/client';

/**
 * Promise wrapper for the Geolocation API
 * @returns Promise that resolves with a Position object
 */
export const getLocationPromise = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      (error) => reject(new Error(`Error getting location: ${error.message}`)),
      { 
        enableHighAccuracy: true, 
        timeout: 10000, 
        maximumAge: 0 
      }
    );
  });
};

/**
 * Formats location into a human-readable string
 */
export const formatLocationInfo = (latitude: number, longitude: number): string => {
  const latDirection = latitude >= 0 ? 'N' : 'S';
  const lonDirection = longitude >= 0 ? 'E' : 'W';
  
  const latDeg = Math.abs(latitude).toFixed(6);
  const lonDeg = Math.abs(longitude).toFixed(6);
  
  return `${latDeg}° ${latDirection}, ${lonDeg}° ${lonDirection}`;
};

/**
 * Gets a user's display name from their profile
 */
export const getUserDisplayName = async (userId: string): Promise<string> => {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('first_name, last_name')
      .eq('id', userId)
      .single();
    
    if (error || !profile) {
      console.error('Error getting user profile:', error);
      return 'Unknown User';
    }
    
    const firstName = profile.first_name || '';
    const lastName = profile.last_name || '';
    
    if (firstName || lastName) {
      return `${firstName} ${lastName}`.trim();
    }
    
    return 'Unknown User';
  } catch (error) {
    console.error('Exception getting user display name:', error);
    return 'Unknown User';
  }
};
