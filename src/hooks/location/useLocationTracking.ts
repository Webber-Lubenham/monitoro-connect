
import { Location } from "./locationTypes";
import { UseLocationTrackingOptions, defaultTrackingOptions } from "./useLocationTrackingTypes";
import { useLocationTrackingCore } from "./hooks/useLocationTrackingCore";
import { useLocationActions } from "./hooks/useLocationActions";
import { useLocationLifecycle } from "./hooks/useLocationLifecycle";

export const useLocationTracking = (
  onLocationUpdate?: (location: Location) => void,
  options: UseLocationTrackingOptions = defaultTrackingOptions
) => {
  // Use our refactored modules
  const coreHook = useLocationTrackingCore(onLocationUpdate, options);
  const actions = useLocationActions(coreHook);
  
  // Set up lifecycle hooks
  useLocationLifecycle(coreHook, actions);
  
  // Extract state from coreHook
  const { state } = coreHook;
  
  // Return the same API as before to maintain compatibility
  return {
    location: state.location,
    isSharing: state.isSharing,
    accuracy: state.accuracy,
    error: state.error,
    startSharing: actions.startSharing,
    stopSharing: actions.stopSharing,
    refreshLocation: actions.getLocationOnce
  };
};
