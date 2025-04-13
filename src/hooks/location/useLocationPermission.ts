
import { useState, useEffect } from 'react';
import { showLocationPermissionError } from '@/hooks/notifications/simpleFallbackNotification';

/**
 * Hook to handle requesting and checking location permission
 */
export const useLocationPermission = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [requesting, setRequesting] = useState(false);

  // Check permission status on mount
  useEffect(() => {
    checkPermission();
  }, []);

  // Function to check current permission status
  const checkPermission = async () => {
    try {
      if (!navigator.geolocation) {
        setHasPermission(false);
        return;
      }

      // Try to get the permission state if available
      if (navigator.permissions && navigator.permissions.query) {
        const result = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
        
        if (result.state === 'granted') {
          setHasPermission(true);
        } else if (result.state === 'denied') {
          setHasPermission(false);
        } else {
          // prompt state - we'll need to request
          setHasPermission(null);
        }

        // Listen for permission changes
        result.addEventListener('change', () => {
          setHasPermission(result.state === 'granted');
        });
      } else {
        // If permissions API is not available, we'll have to try accessing geolocation
        navigator.geolocation.getCurrentPosition(
          () => setHasPermission(true),
          () => setHasPermission(false),
          { timeout: 5000 }
        );
      }
    } catch (error) {
      console.error('Error checking location permission:', error);
      setHasPermission(false);
    }
  };

  // Function to request permission
  const requestPermission = () => {
    if (hasPermission === true) return; // Already granted
    
    setRequesting(true);
    
    navigator.geolocation.getCurrentPosition(
      () => {
        setHasPermission(true);
        setRequesting(false);
      },
      (error) => {
        console.error('Permission denied:', error);
        setHasPermission(false);
        setRequesting(false);
        
        // Show error notification with retry action
        showLocationPermissionError(() => requestPermission());
      },
      { 
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  return {
    hasPermission,
    requesting,
    requestPermission,
    checkPermission,
    setHasPermission
  };
};

export default useLocationPermission;
