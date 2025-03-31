
import { toast as _toast } from "../../../ui/use-toast.ts";

// Hardcoded Mapbox token instead of using environment variable
export const MAPBOX_TOKEN = 'pk.eyJ1IjoidGVjaC1lZHUtbGFiIiwiYSI6ImNtN3cxaTFzNzAwdWwyanMxeHJkb3RrZjAifQ.h0g6a56viW7evC7P0c5mwQ';

// Map style constants
export const MAP_STYLES = {
  SATELLITE: 'mapbox://styles/mapbox/satellite-streets-v12',
  STREETS: 'mapbox://styles/mapbox/streets-v11',
  LIGHT: 'mapbox://styles/mapbox/light-v11',
  DARK: 'mapbox://styles/mapbox/dark-v11',
  OUTDOORS: 'mapbox://styles/mapbox/outdoors-v12'
};

// Function to load the Mapbox token from Supabase Edge Function
export const getMapboxTokenFromEdgeFunction = async (): Promise<string> => {
  try {
    console.log('Attempting to fetch Mapbox token from edge function...');
    const supabaseUrl = 'https://sb1-yohd9adf.supabase.co';
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNiMS15b2hkOWFkZiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzM0ODg5NDUzLCJleHAiOjIwNTA0NjU0NTN9.yp2f5iBM7cMjpjB0VUhPTuOe3rvhCNYWMIJ1z0_iEVo';
    
    const response = await fetch(`${supabaseUrl}/functions/v1/get-mapbox-token`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`
      },
    });
    
    if (!response.ok) {
      console.error(`Error fetching Mapbox token: ${response.status} - ${response.statusText}`);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      return MAPBOX_TOKEN; // Return the default token as fallback
    }
    
    const data = await response.json();
    console.log('Received token from edge function:', data.token ? 'Valid token' : 'No token received');
    return data.token || MAPBOX_TOKEN; // Return the fetched token or default
  } catch (error) {
    console.error('Failed to get Mapbox token from edge function:', error);
    return MAPBOX_TOKEN; // Return the default token as fallback
  }
};

// Validate token format (basic check)
export const isValidMapboxToken = (token: string): boolean => {
  // Mapbox tokens typically start with "pk." for public tokens
  // This is a very basic check and might need to be improved
  return !!token && token.length > 20 && (token.startsWith('pk.') || token.includes('.'));
};

// Log appropriate warnings about token
if (!MAPBOX_TOKEN) {
  console.warn('Mapbox token não encontrado nas variáveis de ambiente, tentaremos obter do backend');
} else {
  console.log('Usando token Mapbox das variáveis de ambiente');
}
