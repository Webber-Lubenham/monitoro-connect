
import { GuardianNotificationData } from "../types/index.ts";
import { Resend } from "npm:resend@2.0.0";
import { corsHeaders } from "../config/constants.ts";
import { isValidEmail } from "../utils/validation.ts";
import { createGuardianNotificationEmail } from "../templates/guardianNotificationEmail.ts";
import { getVerifiedSender, generateMessageId } from "../utils/environment.ts";

/**
 * Handle guardian notification email requests
 */
export async function handleGuardianNotification(
  resend: Resend, 
  data: GuardianNotificationData
): Promise<Response> {
  const { guardianEmail, guardianName, studentName } = data;
  console.log(`Sending guardian notification email to ${guardianEmail} about ${studentName}`);

  if (!isValidEmail(guardianEmail)) {
    return new Response(
      JSON.stringify({ success: false, error: 'Invalid guardian email address format' }),
      { 
        headers: corsHeaders, 
        status: 400 
      }
    );
  }

  const htmlContent = createGuardianNotificationEmail({
    guardianEmail,
    guardianName,
    studentName
  });
  
  const messageId = generateMessageId();

  try {
    const { data: responseData, error } = await resend.emails.send({
      from: getVerifiedSender(),
      to: guardianEmail,
      subject: `Notificação de Localização: ${studentName}`,
      html: htmlContent,
      tags: [
        { name: 'type', value: 'guardian-notification' },
        { name: 'student', value: studentName },
        { name: 'message_id', value: messageId }
      ]
    });

    if (error) {
      console.error('Error sending guardian notification email:', error);
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { 
          headers: corsHeaders, 
          status: 500 
        }
      );
    }

    console.log("Guardian notification email sent successfully:", responseData);
    return new Response(
      JSON.stringify({ success: true, data: responseData }),
      { 
        headers: corsHeaders, 
        status: 200 
      }
    );
  } catch (sendError) {
    console.error('Error sending email:', sendError);
    return new Response(
      JSON.stringify({ success: false, error: sendError.message }),
      { 
        headers: corsHeaders, 
        status: 500 
      }
    );
  }
}
