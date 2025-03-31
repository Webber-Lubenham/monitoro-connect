
// Re-export all services from a central file
import { requestCurrentPosition, callGeolocationAPI } from './services/coreGeolocationService';
import { permissionService } from './services/permissionService';
import { startWatchingPosition, stopWatchingPosition } from './services/trackingService';

export {
  // Core geolocation functions
  requestCurrentPosition,
  callGeolocationAPI,
  
  // Permission management
  permissionService,
  
  // Tracking functions
  startWatchingPosition,
  stopWatchingPosition
};
