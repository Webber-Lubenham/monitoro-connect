
/**
 * Log email related events
 */
export const logEmailEvent = (type: 'info' | 'error' | 'success', message: string, data?: any): void => {
  const timestamp = new Date().toISOString();
  
  switch (type) {
    case 'info':
      console.log(`[EMAIL][${timestamp}] INFO: ${message}`, data || '');
      break;
    case 'error':
      console.error(`[EMAIL][${timestamp}] ERROR: ${message}`, data || '');
      break;
    case 'success':
      console.log(`[EMAIL][${timestamp}] SUCCESS: ${message}`, data || '');
      break;
    default:
      console.log(`[EMAIL][${timestamp}] ${message}`, data || '');
  }
};
