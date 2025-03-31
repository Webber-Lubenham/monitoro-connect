
import { EmailRequest } from "./types.ts";

// Helper function to parse request body in various formats
export const parseRequestBody = async (req: Request): Promise<{ body: EmailRequest | null; error: string | null }> => {
  try {
    // Get Content-Type for logging
    const contentType = req.headers.get("Content-Type");
    console.log("Content-Type:", contentType);
    
    // Clone request to read the body
    const clonedReq = req.clone();
    let bodyText = await clonedReq.text();
    console.log("Raw request body:", bodyText);
    
    // Parse body based on content
    if (!bodyText) {
      return { body: null, error: "Empty request body" };
    }
    
    let body: EmailRequest;
    
    // Handle JSON or form data
    if (bodyText.trim().startsWith('{')) {
      // JSON body
      try {
        body = JSON.parse(bodyText);
        console.log("Parsed JSON body:", body);
      } catch (e) {
        console.error("JSON parse error:", e);
        return { 
          body: null, 
          error: `Invalid JSON format: ${e instanceof Error ? e.message : String(e)}`
        };
      }
    } else if (bodyText.includes('=')) {
      // Form data
      const params = new URLSearchParams(bodyText);
      body = {
        to: params.get('to') || '',
        subject: params.get('subject') || '',
        html: params.get('html') || '',
        text: params.get('text') || '',
        from: params.get('from') || ''
      };
      console.log("Parsed form data:", body);
    } else {
      // Try to treat it as plain object
      try {
        // If it's not JSON or form data, try to interpret it as key-value pairs
        const keyValuePairs = bodyText.split(',').reduce((acc: Record<string, string>, pair: string) => {
          const [key, value] = pair.split(':').map(s => s.trim());
          if (key && value) acc[key] = value;
          return acc;
        }, {});
        
        body = {
          to: keyValuePairs.to || '',
          subject: keyValuePairs.subject || '',
          html: keyValuePairs.html || '',
          text: keyValuePairs.text || '',
          from: keyValuePairs.from || ''
        };
        
        console.log("Parsed key-value pairs:", body);
      } catch (e) {
        console.error("Unrecognized body format:", bodyText.substring(0, 100));
        return { body: null, error: "Unrecognized body format" };
      }
    }
    
    return { body, error: null };
  } catch (parseError) {
    console.error("Body parse error:", parseError);
    return { 
      body: null, 
      error: `Invalid request format: ${parseError instanceof Error ? parseError.message : String(parseError)}`
    };
  }
};

// Helper function to validate email request parameters
export const validateEmailRequest = (body: EmailRequest): { isValid: boolean; error: string | null } => {
  console.log("Validating email request:", {
    hasTo: !!body.to,
    hasSubject: !!body.subject,
    hasHtml: !!body.html,
    textLength: body.text?.length
  });
  
  if (!body.to) {
    return { isValid: false, error: "Missing required 'to' parameter" };
  }
  
  if (!body.subject) {
    return { isValid: false, error: "Missing required 'subject' parameter" };
  }
  
  if (!body.html) {
    return { isValid: false, error: "Missing required 'html' parameter" };
  }
  
  // Additional validation for email format
  if (!body.to.includes('@')) {
    return { isValid: false, error: "Invalid email address format in 'to' parameter" };
  }
  
  console.log("Email validation passed");
  return { isValid: true, error: null };
};

// Helper function to log email-related events
export const logEmailEvent = (type: string, message: string, data?: any): void => {
  const now = new Date().toISOString();
  
  if (type === "error") {
    console.error(`[${now}] EMAIL ERROR: ${message}`, data || '');
  } else {
    console.log(`[${now}] EMAIL ${type.toUpperCase()}: ${message}`, data || '');
  }
};
