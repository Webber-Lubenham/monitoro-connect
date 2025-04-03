
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import React from "react";

/**
 * Creates a fallback link for manual email notification
 * @param studentName The name of the student
 * @param guardianEmail The email of the guardian
 * @param latitude The latitude of the student's location
 * @param longitude The longitude of the student's location
 * @returns A mailto link with the guardian's email and location details
 */
export const createFallbackEmailLink = (
  studentName: string,
  guardianEmail: string,
  latitude: number,
  longitude: number
): string => {
  const subject = `Localização atual de ${studentName}`;
  const mapLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
  const body = `Olá,\n\nO aluno ${studentName} compartilhou sua localização atual com você.\n\nVer no mapa: ${mapLink}\n\nCoordenadas: ${latitude}, ${longitude}\n\nEste email foi enviado automaticamente pelo sistema de localização.`;

  return `mailto:${guardianEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

/**
 * Shows a toast notification with a manual fallback option when automated notification fails
 * @param guardianEmail Email address of the guardian
 * @param guardianName Name of the guardian
 * @param studentName Name of the student
 * @param latitude Current latitude
 * @param longitude Current longitude
 */
export const showManualFallbackOption = (
  guardianEmail: string,
  guardianName: string,
  studentName: string,
  latitude: number,
  longitude: number
): void => {
  const mailtoLink = createFallbackEmailLink(studentName, guardianEmail, latitude, longitude);

  toast({
    title: "Falha ao enviar notificação",
    description: `Não foi possível enviar a notificação automaticamente para ${guardianName}. Você pode enviar manualmente clicando no botão abaixo.`,
    variant: "destructive",
    duration: 10000,
    action: (
      <ToastAction altText="Enviar email manualmente" onClick={() => window.open(mailtoLink, "_blank")}>
        Enviar email manualmente
      </ToastAction>
    ) as React.ReactElement,
  });
};

/**
 * Shows a toast notification when a notification has been sent successfully
 * @param guardianEmail Email address of the guardian that was notified
 * @param guardianName Name of the guardian
 */
export const showSuccessNotification = (
  guardianEmail: string,
  guardianName: string
): void => {
  toast({
    title: "Notificação enviada com sucesso",
    description: `${guardianName} (${guardianEmail}) foi notificado sobre sua localização atual.`,
    duration: 5000,
    action: (
      <ToastAction altText="OK" onClick={() => {}}>
        OK
      </ToastAction>
    ) as React.ReactElement,
  });
};

