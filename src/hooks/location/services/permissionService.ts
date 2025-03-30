// Keep track of permission status to avoid repeated prompts
let permissionGranted: boolean | null = null;

export const permissionService = {
  isPermissionGranted: () => permissionGranted,
  isPermissionDenied: () => permissionGranted === false,
  
  setPermissionGranted: (value: boolean) => {
    permissionGranted = value;
  },
  
  /**
   * Check geolocation permission using Permissions API if available
   */
  checkGeolocationPermission: (
    onGranted: () => void,
    onDenied: () => void,
    onFallback: () => void
  ) => {
    // Use Permissions API if available to check for permission
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'geolocation' as PermissionName })
        .then(permissionStatus => {
          console.log("Geolocation permission status:", permissionStatus.state);
          
          if (permissionStatus.state === 'denied') {
            permissionGranted = false;
            console.error("Geolocation permission denied by user");
            onDenied();
            return;
          }
          
          // Permission is granted or prompt, proceed
          onGranted();
        })
        .catch(err => {
          console.error("Error checking geolocation permission:", err);
          // Fall back to standard geolocation request
          onFallback();
        });
    } else {
      // Browser doesn't support permission API, try direct geolocation
      onFallback();
    }
  }
};
