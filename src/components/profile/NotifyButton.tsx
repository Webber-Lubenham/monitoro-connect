
import { useLocationPermission } from '@/hooks/location/useLocationPermission';
import { useNotification } from '@/hooks/useNotification';
import LocationPermissionButton from './LocationPermissionButton';
import NotifyingButton from './NotifyingButton';
import StandardNotifyButton from './StandardNotifyButton';

const NotifyButton = () => {
  const { hasPermission, setHasPermission } = useLocationPermission();
  const { isNotifying, handleNotification } = useNotification();

  // Check permission before proceeding
  if (hasPermission === false) {
    return <LocationPermissionButton onPermissionGranted={() => setHasPermission(true)} />;
  }

  // Show the appropriate button based on notification state
  if (isNotifying) {
    return <NotifyingButton isNotifying={isNotifying} />;
  }

  return <StandardNotifyButton onClick={handleNotification} />;
};

export default NotifyButton;
