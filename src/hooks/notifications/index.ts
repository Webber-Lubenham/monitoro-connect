
// Export types
export type { NotificationLogEntry } from './types';
export type { NotificationPosition } from './types';

// Export utility functions 
export { saveLocationToDatabase, logNotification, fetchGuardians } from './databaseUtils';
export { 
  sendEdgeFunctionNotification, 
  sendBulkNotifications, 
  getGuardianEmails, 
  sendFallbackNotification 
} from './notificationSender';
export { useNotifyGuardians } from './useNotifyGuardians';

// Default export
import { useNotifyGuardians } from './useNotifyGuardians';
export default useNotifyGuardians;
