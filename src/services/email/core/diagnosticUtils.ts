
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { EmailParams, EmailResponse } from "./types";

export interface ResendDomainInfo {
  id: string;
  name: string;
  status: "verified" | "not_started" | "in_progress" | "failed";
  created_at: string;
}

export interface DiagnosticResult {
  success: boolean;
  message?: string;
  error?: string;
  details?: any;
  // Add the missing properties that we're using in our functions
  echo?: any;
  sendEmail?: any;
  validation?: any;
}

/**
 * Test the direct Edge Function without any intermediate code
 */
export const testEdgeFunction = async (functionName: string, payload: any): Promise<DiagnosticResult> => {
  try {
    console.log(`Testing edge function ${functionName} with payload:`, payload);
    
    const { data, error } = await supabase.functions.invoke(functionName, {
      body: payload
    });
    
    if (error) {
      console.error(`Error calling ${functionName}:`, error);
      return {
        success: false,
        error: error.message || `Failed to call ${functionName}`,
        details: error
      };
    }
    
    return {
      success: true,
      message: `Successfully called ${functionName}`,
      details: data
    };
  } catch (error) {
    console.error(`Exception in ${functionName}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      details: error
    };
  }
};

/**
 * Fetch Resend domain information
 */
export const fetchResendDomains = async (): Promise<DiagnosticResult> => {
  try {
    const { data, error } = await supabase.functions.invoke("test-resend-connection");
    
    if (error) {
      return {
        success: false,
        error: `Error fetching Resend domains: ${error.message}`,
        details: error
      };
    }
    
    return {
      success: true,
      message: "Successfully fetched Resend domains",
      details: data
    };
  } catch (error) {
    return {
      success: false,
      error: `Exception fetching Resend domains: ${error instanceof Error ? error.message : String(error)}`,
      details: error
    };
  }
};

/**
 * React hook to test the Resend API key
 */
export const useResendApiTester = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  
  const testResendApiKey = async () => {
    setLoading(true);
    try {
      const domainResult = await fetchResendDomains();
      
      setResult(domainResult);
      
      toast({
        title: domainResult.success ? "Resend API configurada corretamente" : "Problema com a API do Resend",
        description: domainResult.message || domainResult.error,
        variant: domainResult.success ? "default" : "destructive",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setResult({
        success: false,
        error: `Erro ao testar API do Resend: ${errorMessage}`
      });
      
      toast({
        variant: "destructive",
        title: "Erro ao testar API do Resend",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };
  
  return {
    testResendApiKey,
    loading,
    result
  };
};

/**
 * Format an email payload for diagnostic display
 */
export const formatEmailPayload = (payload: any): string => {
  try {
    const formatted = JSON.stringify(payload, null, 2);
    return formatted;
  } catch (e) {
    return String(payload);
  }
};

/**
 * Generate a minimal email payload for testing
 */
export const generateMinimalEmailPayload = (): EmailParams => {
  return {
    to: "test@example.com",
    subject: "Test Email - " + new Date().toISOString(),
    html: "<p>This is a test email from the diagnostic tool.</p>",
    text: "This is a test email from the diagnostic tool.",
    from: "Sistema Monitore <notifications@sistema-monitore.com.br>"
  };
};

/**
 * Validate an email payload
 */
export const validateEmailPayload = (payload: any): {valid: boolean, issues: string[]} => {
  const issues: string[] = [];
  
  if (!payload) {
    issues.push("Payload is empty");
    return { valid: false, issues };
  }
  
  if (!payload.to) {
    issues.push("Missing recipient (to)");
  } else if (typeof payload.to !== 'string' || !payload.to.includes('@')) {
    issues.push("Invalid recipient email format");
  }
  
  if (!payload.subject) {
    issues.push("Missing subject");
  } else if (typeof payload.subject !== 'string') {
    issues.push("Subject must be a string");
  }
  
  if (!payload.html && !payload.text) {
    issues.push("Missing content (html or text)");
  }
  
  if (payload.html && typeof payload.html !== 'string') {
    issues.push("HTML content must be a string");
  }
  
  if (payload.text && typeof payload.text !== 'string') {
    issues.push("Text content must be a string");
  }
  
  return {
    valid: issues.length === 0,
    issues
  };
};

/**
 * Test email sending with an echo function
 */
export const testEmailWithEchoFunction = async (payload: EmailParams): Promise<DiagnosticResult> => {
  try {
    const { data, error } = await supabase.functions.invoke("echo-payload", {
      body: payload
    });
    
    if (error) {
      return {
        success: false,
        error: `Error in echo function: ${error.message}`,
        details: error,
        echo: { success: false, error }
      };
    }
    
    return {
      success: true,
      message: "Echo function successfully received the payload",
      details: data,
      echo: { success: true, data }
    };
  } catch (error) {
    return {
      success: false,
      error: `Exception in echo function: ${error instanceof Error ? error.message : String(error)}`,
      details: error,
      echo: { success: false, error }
    };
  }
};

/**
 * Compare different email sending methods
 */
export const testCompareEmailMethods = async (payload: EmailParams): Promise<DiagnosticResult> => {
  const validation = validateEmailPayload(payload);
  
  if (!validation.valid) {
    return {
      success: false,
      message: "Email payload validation failed",
      validation,
      error: "Invalid payload format"
    };
  }
  
  // Test with echo function first
  const echoResult = await testEmailWithEchoFunction(payload);
  
  let sendEmailResult: DiagnosticResult | null = null;
  
  // Only try send-email if echo worked
  if (echoResult.success) {
    try {
      const { data, error } = await supabase.functions.invoke("send-email", {
        body: payload
      });
      
      if (error) {
        sendEmailResult = {
          success: false,
          error: `Error in send-email function: ${error.message}`,
          details: error
        };
      } else {
        sendEmailResult = {
          success: true,
          message: "Send-email function successfully sent the email",
          details: data
        };
      }
    } catch (error) {
      sendEmailResult = {
        success: false,
        error: `Exception in send-email function: ${error instanceof Error ? error.message : String(error)}`,
        details: error
      };
    }
  }
  
  return {
    success: echoResult.success && (sendEmailResult?.success || false),
    message: echoResult.success 
      ? (sendEmailResult?.success 
          ? "All email sending methods worked successfully" 
          : "Echo function worked but send-email failed")
      : "Echo function failed",
    echo: echoResult,
    sendEmail: sendEmailResult,
    validation
  };
};
