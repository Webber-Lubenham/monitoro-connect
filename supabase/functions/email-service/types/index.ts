
// Email service request and response types

// Main request type
export interface EmailServiceRequest {
  type: string;
  data: any;
}

// Test email request data
export interface TestEmailRequest {
  email: string;
  includeDebug?: boolean;
}

// Location notification request data
export interface LocationNotificationData {
  studentName: string;
  studentEmail?: string;
  guardianName: string;
  guardianEmail: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  accuracy?: number;
  isEmergency?: boolean;
  mapUrl?: string;
  trackingId?: string;
}

// Guardian notification request data
export interface GuardianNotificationData {
  studentName: string;
  guardianEmail: string;
  guardianName: string;
  studentEmail?: string;
  locationType?: 'arrival' | 'departure' | 'alert' | 'test';
  latitude?: number;
  longitude?: number;
  timestamp?: string;
}

// Guardian invitation request data
export interface GuardianInvitationData {
  studentName: string;
  studentEmail?: string;
  guardianEmail: string;
  guardianName: string;
  invitationCode?: string;
  tempPassword?: string;
  confirmationUrl?: string;
}

// Common email response format
export interface EmailResponse {
  success: boolean;
  emailId?: string;
  error?: string;
  details?: any;
  sentTo?: string;
  timestamp?: string;
}
