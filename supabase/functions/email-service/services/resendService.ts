
import { Resend } from "npm:resend@2.0.0";

/**
 * Initialize and return a Resend client
 */
export const getResendClient = async (): Promise<Resend | null> => {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  
  if (!apiKey) {
    console.error("RESEND_API_KEY environment variable is not set");
    return null;
  }
  
  console.log("Resend API key is configured");
  return new Resend(apiKey);
};

/**
 * Send an email using the Resend service
 */
export const sendEmail = async (
  resend: Resend,
  to: string,
  subject: string,
  html: string,
  text?: string,
  fromName: string = "Sistema Monitore"
): Promise<{ success: boolean; data?: any; error?: any }> => {
  try {
    // Always use the verified domain
    const fromAddress = "notifications@sistema-monitore.com.br";
    const fromField = `${fromName} <${fromAddress}>`;
    
    console.log(`Sending email to ${to} with subject "${subject}"`);
    
    const result = await resend.emails.send({
      from: fromField,
      to: [to],
      subject,
      html,
      text: text || undefined
    });
    
    if ('error' in result && result.error) {
      console.error("Error sending email with Resend:", result.error);
      return {
        success: false,
        error: result.error
      };
    }
    
    console.log("Email sent successfully:", result.data);
    return {
      success: true,
      data: result.data
    };
  } catch (error) {
    console.error("Exception in sendEmail:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
};
