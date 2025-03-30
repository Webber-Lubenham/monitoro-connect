
/**
 * Email parameters interface
 */
export interface EmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
  cc?: string | string[];
  bcc?: string | string[];
  reply_to?: string | string[];
}

/**
 * Email response interface
 */
export interface EmailResponse {
  success: boolean;
  data?: any;
  error?: any;
  message?: string;
  details?: any;
  id?: string; // Add the missing 'id' property that Resend returns
}
