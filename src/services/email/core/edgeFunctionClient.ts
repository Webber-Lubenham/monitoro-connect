
import { supabase } from '../../../lib/supabase';
import { EmailParams, EmailResponse } from './types';
import { logEmailEvent } from './logger';

interface ExtendedEmailResponse extends EmailResponse {
  status?: number;
  statusText?: string;
}

export const sendViaEdgeFunction = async (
  functionName: string, 
  payload: Record<string, unknown>
): Promise<ExtendedEmailResponse> => {
  try {
    // Validate payload structure
    if (!payload || typeof payload !== 'object') {
      throw new Error('Invalid payload structure');
    }

    logEmailEvent('info', `Sending via Edge Function: ${functionName}`, payload);
    
    // CRITICAL: Create a completely flat object with only string values
    // This is critical to ensure consistent formatting for all Edge Functions
    const flatPayload: Record<string, string> = {};
    
    // Convert all values to strings and only include simple key-value pairs
    Object.entries(payload).forEach(([key, value]) => {
      // Skip null/undefined values
      if (value == null) return;
      
      // Convert all values to strings to ensure consistent handling
      flatPayload[key] = String(value);
    });
    
    // Debug log showing exact payload format being sent
    console.log(`Exact payload being sent to ${functionName}:`, JSON.stringify(flatPayload, null, 2));
    
    // Send directly to the edge function with no Content-Type header
    // This is CRITICAL - some edge functions may have issues with content-type headers
    const { data, error } = await supabase.functions.invoke(functionName, {
      body: flatPayload
    });
    
    // Log response details
    logEmailEvent('info', `Raw response from ${functionName}:`, {
      error,
      data
    });
    
    if (error) {
      logEmailEvent('error', `Edge Function ${functionName} error:`, {
        error
      });
      
      return { 
        success: false, 
        error,
        message: `Edge Function error: ${error.message || 'Unknown error'}`
      };
    }
    
    logEmailEvent('success', `Edge Function ${functionName} response:`, data);
    
    return { 
      success: true, 
      data,
      message: 'Email sent successfully' 
    };
  } catch (error) {
    logEmailEvent('error', `Exception calling Edge Function ${functionName}:`, error);
    return { 
      success: false, 
      error,
      message: `Exception: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

export const sendEmailViaEdgeFunction = async (params: EmailParams): Promise<EmailResponse> => {
  try {
    const { to, subject, html, text } = params;
    // CRITICAL: Always use your verified domain for the from address
    // This is required by Resend when sending to external email addresses
    const from = params.from || 'Sistema Monitore <notifications@sistema-monitore.com.br>';
    
    // Validate required parameters
    if (!to || !subject || !html) {
      const error = 'Missing required parameters: to, subject, html';
      logEmailEvent('error', error, { to, subject, html });
      return {
        success: false,
        error,
        message: 'Incomplete email parameters'
      };
    }
    
    // CRITICAL: Create a completely flat object with only string values
    // No nested objects, no complex structures - exactly what the Edge Function expects
    const flatPayload = {
      from: String(from),
      to: String(to),
      subject: String(subject),
      html: String(html),
      text: text ? String(text) : ''
    };
    
    logEmailEvent('info', 'Final email payload prepared:', flatPayload);
    console.log('Final email payload to send-email:', JSON.stringify(flatPayload, null, 2));
    
    // Send the properly formatted payload directly to the Edge Function
    return sendViaEdgeFunction('send-email', flatPayload);
  } catch (error) {
    logEmailEvent('error', 'Error preparing email:', error);
    return { 
      success: false, 
      error,
      message: `Error: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};
