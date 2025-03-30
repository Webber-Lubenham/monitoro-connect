
import { Resend } from "npm:resend@2.0.0";
import { EmailResponse } from "./types.ts";
import { generateMessageId, getVerifiedSender } from "./utils.ts";

/**
 * Sends email using Resend service
 * @returns Email sending result with success status and details
 */
export const sendEmailWithResend = async (
  resend: Resend,
  to: string,
  subject: string,
  html: string,
  text: string
): Promise<EmailResponse> => {
  try {
    console.log(`Sending email to ${to}`);
    
    // Create a unique message ID
    const messageId = generateMessageId();
    
    // Always use the verified domain from the project
    const fromEmail = "notifications@sistema-monitore.com.br";
    console.log(`Using sender: Sistema Monitore <${fromEmail}>`);
    
    const emailResponse = await resend.emails.send({
      from: `Sistema Monitore <${fromEmail}>`,
      to: [to],
      subject: subject,
      html: html,
      text: text,
      headers: {
        "X-Entity-Ref-ID": messageId
      }
    });

    console.log("Email sending result:", emailResponse);
    
    if (emailResponse.error) {
      throw emailResponse.error;
    }
    
    return {
      success: true, 
      emailId: emailResponse.id,
      sentTo: to,
      messageId
    };
  } catch (emailError) {
    console.error("Error sending email with Resend:", emailError);
    
    // Check if it's a rate limit error
    if (emailError.statusCode === 429 || 
        (emailError.message && emailError.message.includes('rate limit'))) {
      
      return {
        success: false,
        error: "Rate limit exceeded",
        details: "Too many email requests. Try again after a few seconds.",
        rateLimited: true
      };
    }
    
    // Check for domain verification issues
    if (emailError.statusCode === 403 && 
        emailError.message && emailError.message.includes('verify a domain')) {
      return {
        success: false,
        error: "Domain verification required",
        details: "The sender domain is not verified. Please verify your domain in Resend.",
      };
    }
    
    return {
      success: false,
      error: "Failed to send email",
      details: emailError instanceof Error ? emailError.message : String(emailError)
    };
  }
};
