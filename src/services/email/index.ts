
import * as emailService from './emailService';
import resendService from './resendService';
// Import and re-export the type from the correct location
export type { EmailParams } from './core/types';
// Export templates para convites de responsáveis
export * from './templates/guardianEmails';

export {
  emailService,
  resendService
};

export default emailService;
