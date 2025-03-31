
import { useState, useEffect, useRef } from 'react';

export const useLocationPermission = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const permissionCheckRef = useRef<boolean>(false);

  // Check for location permissions on component mount and periodically
  useEffect(() => {
    // Function to check geolocation permission
    const checkGeolocationPermission = () => {
      console.log("Checking geolocation permission...");
      
      // Check if geolocation is available
      if (!("geolocation" in navigator)) {
        console.error("Geolocation API not supported by this browser");
        setHasPermission(false);
        return;
      }
      
      // Try to get the permission status if the browser supports it
      if (navigator.permissions && navigator.permissions.query) {
        navigator.permissions.query({ name: 'geolocation' })
          .then(permissionStatus => {
            console.log("Current permission status:", permissionStatus.state);
            setHasPermission(permissionStatus.state === 'granted');
            
            // Listen for permission changes
            permissionStatus.onchange = () => {
              console.log("Permission status changed to:", permissionStatus.state);
              setHasPermission(permissionStatus.state === 'granted');
            };
            
            // If permission is prompt, we'll test it by requesting location
            if (permissionStatus.state === 'prompt') {
              // Test geolocation access with a simple request
              navigator.geolocation.getCurrentPosition(
                () => {
                  console.log("Geolocation test successful - permission granted");
                  setHasPermission(true);
                },
                (error) => {
                  console.error("Geolocation test failed:", error);
                  if (error.code === error.PERMISSION_DENIED) {
                    setHasPermission(false);
                  }
                },
                { timeout: 5000, maximumAge: 0 }
              );
            }
          })
          .catch(err => {
            console.error("Error checking location permission:", err);
            // If we can't check permission, we'll find out when we try to use it
            setHasPermission(null);
          });
      } else {
        // For browsers without permission API, test with direct request
        try {
          navigator.geolocation.getCurrentPosition(
            () => {
              console.log("Geolocation test successful - permission granted");
              setHasPermission(true);
            },
            (error) => {
              console.error("Geolocation test failed:", error);
              if (error.code === error.PERMISSION_DENIED) {
                setHasPermission(false);
              } else {
                // For other errors, we're not sure if permission is denied
                setHasPermission(null);
              }
            },
            { timeout: 5000, maximumAge: 0 }
          );
        } catch (e) {
          console.error("Exception during geolocation test:", e);
          setHasPermission(null);
        }
      }
    };
    
    // Check permission immediately
    if (!permissionCheckRef.current) {
      permissionCheckRef.current = true;
      checkGeolocationPermission();
    }
    
    // Set up periodic permission check
    const permissionCheckInterval = setInterval(checkGeolocationPermission, 30000);
    
    return () => {
      clearInterval(permissionCheckInterval);
    };
  }, []);

  return { 
    hasPermission,
    setHasPermission
  };
};
