
// Types for email sending function
export interface EmailRequest {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

export interface EmailResponse {
  success: boolean;
  data?: any;
  error?: any;
  details?: string;
  message?: string;
  source?: string;
}
