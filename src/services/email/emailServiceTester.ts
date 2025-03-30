
import { supabase } from '@/integrations/supabase/client';

/**
 * Test connectivity to Edge Functions (without relying on Resend)
 */
export const testEdgeFunctionConnectivity = async (): Promise<{
  success: boolean;
  message: string;
  details?: any;
}> => {
  try {
    console.log('Testing Edge Function connectivity...');
    
    // Test data
    const testData = {
      test: true,
      timestamp: new Date().toISOString()
    };
    
    // Call the test function
    const response = await supabase.functions.invoke('test-connectivity', {
      body: JSON.stringify(testData)
    });
    
    if (response.error) {
      console.error('Error testing connectivity:', response.error);
      return {
        success: false,
        message: `Edge Function connectivity test failed: ${response.error.message}`,
        details: response.error
      };
    }
    
    console.log('Connectivity test response:', response.data);
    
    return {
      success: true,
      message: 'Edge Function connectivity test successful',
      details: response.data
    };
  } catch (error) {
    console.error('Exception testing Edge Function connectivity:', error);
    return {
      success: false,
      message: `Exception in connectivity test: ${error instanceof Error ? error.message : String(error)}`,
      details: error
    };
  }
};

/**
 * Test Resend email API via Edge Function
 */
export const testResendEmail = async (email: string): Promise<{
  success: boolean;
  message: string;
  details?: any;
}> => {
  try {
    console.log(`Testing Resend email delivery to ${email}...`);
    
    // Call the test-email function
    const response = await supabase.functions.invoke('test-email', {
      body: JSON.stringify({
        email,
        testType: 'direct',
        includeDiagnostics: true
      })
    });
    
    if (response.error) {
      console.error('Error testing email delivery:', response.error);
      return {
        success: false,
        message: `Email delivery test failed: ${response.error.message}`,
        details: response.error
      };
    }
    
    console.log('Email test response:', response.data);
    
    return {
      success: true,
      message: 'Email delivery test completed',
      details: response.data
    };
  } catch (error) {
    console.error('Exception testing email delivery:', error);
    return {
      success: false,
      message: `Exception in email test: ${error instanceof Error ? error.message : String(error)}`,
      details: error
    };
  }
};
