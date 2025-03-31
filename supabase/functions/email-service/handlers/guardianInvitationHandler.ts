
import { GuardianInvitationData } from "../types/index.ts";
import { Resend } from "npm:resend@2.0.0";
import { corsHeaders } from "../config/constants.ts";
import { isValidEmail } from "../utils/validation.ts";
import { createGuardianInvitationEmail } from "../templates/guardianInvitationEmail.ts";
import { getVerifiedSender, generateMessageId } from "../utils/environment.ts";

/**
 * Handle guardian invitation email requests
 */
export async function handleGuardianInvitation(
  resend: Resend, 
  data: GuardianInvitationData
): Promise<Response> {
  const { guardianEmail, guardianName, studentName, tempPassword, confirmationUrl } = data;
  console.log(`Sending guardian invitation email to ${guardianEmail} for student ${studentName}`);
  console.log(`Guardian name: ${guardianName}, Has tempPassword: ${!!tempPassword}`);
  console.log(`Confirmation URL: ${confirmationUrl || "Not provided"}`);

  if (!isValidEmail(guardianEmail)) {
    return new Response(
      JSON.stringify({ success: false, error: 'Invalid guardian email address format' }),
      { 
        headers: corsHeaders, 
        status: 400 
      }
    );
  }

  const htmlContent = createGuardianInvitationEmail({
    guardianName,
    studentName,
    tempPassword,
    confirmationUrl
  });
  
  const messageId = generateMessageId();

  try {
    const { data: responseData, error } = await resend.emails.send({
      from: getVerifiedSender(),
      to: guardianEmail,
      subject: `Convite para ser responsável de ${studentName} no Sistema Monitore`,
      html: htmlContent,
      tags: [
        { name: 'type', value: 'guardian-invitation' },
        { name: 'student', value: studentName },
        { name: 'message_id', value: messageId }
      ]
    });

    if (error) {
      console.error('Error sending guardian invitation email:', error);
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { 
          headers: corsHeaders, 
          status: 500 
        }
      );
    }

    console.log("Guardian invitation email sent successfully:", responseData);
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
