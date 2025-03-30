
import { Resend } from "npm:resend@2.0.0";

/**
 * Send email using Resend SDK
 */
export const sendWithSdk = async (
  resend: Resend,
  recipient: string,
  subject: string,
  html: string
): Promise<{
  success: boolean;
  emailId?: string;
  error?: string;
  details?: any;
  method: string;
  isRateLimit?: boolean;
}> => {
  try {
    console.log(`Attempting to send email to ${recipient} using SDK method`);
    
    const response = await resend.emails.send({
      from: "Sistema Monitore <noreply@resend.dev>",
      to: recipient,
      subject: subject,
      html: html
    });
    
    if ('error' in response && response.error) {
      console.error('Resend SDK error:', response.error);
      
      // Check for rate limit
      if (response.error.statusCode === 429 || 
          (response.error.message && response.error.message.includes('rate limit'))) {
        return {
          success: false,
          error: 'Rate limit exceeded',
          details: response.error,
          method: 'SDK',
          isRateLimit: true
        };
      }
      
      return {
        success: false,
        error: response.error.message || 'Unknown error',
        details: response.error,
        method: 'SDK'
      };
    }
    
    return {
      success: true,
      emailId: response.data?.id,
      method: 'SDK'
    };
  } catch (error) {
    console.error('Exception in sendWithSdk:', error);
    
    // Check for rate limit
    if (error.message && error.message.includes('429')) {
      return {
        success: false,
        error: 'Rate limit exceeded',
        details: error.message,
        method: 'SDK',
        isRateLimit: true
      };
    }
    
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      details: error,
      method: 'SDK'
    };
  }
};

/**
 * Send email using direct API call
 */
export const sendWithDirectApi = async (
  apiKey: string,
  recipient: string,
  subject: string,
  html: string
): Promise<{
  success: boolean;
  emailId?: string;
  error?: string;
  details?: any;
  method: string;
  isRateLimit?: boolean;
}> => {
  try {
    console.log(`Attempting to send email to ${recipient} using direct API method`);
    
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Sistema Monitore <noreply@resend.dev>',
        to: recipient,
        subject: subject,
        html: html
      })
    });
    
    // Check for rate limit
    if (response.status === 429) {
      return {
        success: false,
        error: 'Rate limit exceeded',
        details: 'Too many requests',
        method: 'Direct API',
        isRateLimit: true
      };
    }
    
    // Handle other errors
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Resend API error:', errorText);
      return {
        success: false,
        error: `HTTP error ${response.status}`,
        details: errorText,
        method: 'Direct API'
      };
    }
    
    // Parse successful response
    const data = await response.json();
    return {
      success: true,
      emailId: data.id,
      method: 'Direct API'
    };
  } catch (error) {
    console.error('Exception in sendWithDirectApi:', error);
    
    // Check for rate limit or CORS issues in error message
    if (error.message && (error.message.includes('429') || error.message.includes('CORS'))) {
      return {
        success: false,
        error: error.message.includes('CORS') ? 'CORS error' : 'Rate limit exceeded',
        details: error.message,
        method: 'Direct API',
        isRateLimit: error.message.includes('429')
      };
    }
    
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      details: error,
      method: 'Direct API'
    };
  }
};
