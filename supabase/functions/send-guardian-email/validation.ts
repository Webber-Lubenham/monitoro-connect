
import { LocationNotification } from "./types.ts";
import { corsHeaders } from "./utils.ts";

/**
 * Validates request payload
 * @returns Object containing validation result and error response if invalid
 */
export const validateRequest = async (
  req: Request
): Promise<{ isValid: boolean; data?: LocationNotification; errorResponse?: Response }> => {
  // Parse request with validation
  let requestData: LocationNotification;
  
  try {
    // Clone the request to read the body as text
    const requestClone = req.clone();
    const requestText = await requestClone.text();
    console.log("Request body text:", requestText);
    
    if (!requestText || requestText.trim() === '') {
      console.error("Empty request body");
      return {
        isValid: false,
        errorResponse: new Response(
          JSON.stringify({ error: "Empty request body" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        )
      };
    }
    
    try {
      requestData = JSON.parse(requestText) as LocationNotification;
      console.log("Parsed request data:", requestData);
    } catch (parseError) {
      console.error("Error parsing request JSON:", parseError);
      return {
        isValid: false,
        errorResponse: new Response(
          JSON.stringify({ 
            error: "Invalid JSON in request body", 
            details: String(parseError),
            receivedText: requestText.substring(0, 100) + (requestText.length > 100 ? '...' : '')
          }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        )
      };
    }
  } catch (readError) {
    console.error("Error reading request body:", readError);
    return {
      isValid: false,
      errorResponse: new Response(
        JSON.stringify({ 
          error: "Could not read request body", 
          details: String(readError) 
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      )
    };
  }

  const { 
    guardianEmail, 
    latitude, 
    longitude, 
    timestamp,
    studentName,
    guardianName
  } = requestData;
  
  // Validate required fields
  if (!guardianEmail || typeof latitude !== 'number' || typeof longitude !== 'number' || !timestamp) {
    console.error("Missing or invalid required fields:", {
      guardianEmail: !!guardianEmail,
      latitude: typeof latitude === 'number',
      longitude: typeof longitude === 'number',
      timestamp: !!timestamp
    });
    
    return {
      isValid: false,
      errorResponse: new Response(
        JSON.stringify({ 
          error: "Missing or invalid required fields",
          details: {
            guardianEmail: guardianEmail ? "present" : "missing",
            latitude: typeof latitude === 'number' ? "valid" : `invalid type: ${typeof latitude}`,
            longitude: typeof longitude === 'number' ? "valid" : `invalid type: ${typeof longitude}`,
            timestamp: timestamp ? "present" : "missing",
            studentName: studentName ? "present" : "missing (optional)",
            guardianName: guardianName ? "present" : "missing (optional)"
          }
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      )
    };
  }
  
  return { isValid: true, data: requestData };
};
