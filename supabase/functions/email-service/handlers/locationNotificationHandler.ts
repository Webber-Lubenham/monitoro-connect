
import { LocationNotificationData } from "../types/index.ts";
import { Resend } from "npm:resend@2.0.0";
import { corsHeaders } from "../config/constants.ts";
import { isValidEmail } from "../utils/validation.ts";
import { createLocationNotificationEmail } from "../templates/locationNotificationEmail.ts";
import { getVerifiedSender, generateMessageId } from "../utils/environment.ts";

/**
 * Handle location notification email requests
 */
export async function handleLocationNotification(
  resend: Resend, 
  data: LocationNotificationData
): Promise<Response> {
  const { studentName, guardianEmail } = data;
  console.log(`Sending location notification email to ${guardianEmail} for student ${studentName}`);

  if (!isValidEmail(guardianEmail)) {
    return new Response(
      JSON.stringify({ success: false, error: 'Invalid guardian email address format' }),
      { 
        headers: corsHeaders, 
        status: 400 
      }
    );
  }

  const htmlContent = createLocationNotificationEmail(data);
  const messageId = generateMessageId();

  try {
    const { data: responseData, error } = await resend.emails.send({
      from: getVerifiedSender(),
      to: guardianEmail,
      subject: `Atualização de Localização: ${studentName}`,
      html: htmlContent,
      tags: [
        { name: 'type', value: 'location-notification' },
        { name: 'student', value: studentName },
        { name: 'message_id', value: messageId }
      ]
    });

    if (error) {
      console.error('Error sending location notification email:', error);
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { 
          headers: corsHeaders, 
          status: 500 
        }
      );
    }

    console.log("Location notification email sent successfully:", responseData);
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
