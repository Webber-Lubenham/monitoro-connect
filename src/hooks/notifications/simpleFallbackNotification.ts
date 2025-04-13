
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import React from "react";

export interface FallbackNotificationOptions {
  title?: string;
  description?: string;
  duration?: number;
  variant?: "default" | "destructive";
  action?: React.ReactNode;
}

/**
 * Simple fallback notification that uses toast when other notification methods fail
 */
export const showFallbackNotification = (
  recipientEmail: string,
  options: FallbackNotificationOptions = {}
) => {
  const {
    title = "Notificação enviada",
    description = `Sua localização foi enviada para ${recipientEmail}`,
    duration = 5000,
    variant = "default",
    action
  } = options;

  try {
    return toast({
      title,
      description,
      duration,
      variant,
      action: action as any // Type cast to avoid TypeScript issues
    });
  } catch (error) {
    console.error("Error showing fallback notification:", error);
    return null;
  }
};

/**
 * Show a location permission error notification with retry action
 */
export const showLocationPermissionError = (onRetry: () => void) => {
  try {
    return toast({
      title: "Permissão de localização negada",
      description: "Para enviar sua localização, permita o acesso à sua localização nas configurações do navegador.",
      variant: "destructive",
      duration: 10000,
      action: React.createElement(
        ToastAction,
        { altText: "Tentar novamente", onClick: onRetry },
        "Tentar novamente"
      ) as any // Type cast to resolve TypeScript issues
    });
  } catch (error) {
    console.error("Error showing location permission error:", error);
    return null;
  }
};

/**
 * Show a notification error with try again action
 */
export const showNotificationError = (errorMessage: string, onRetry: () => void) => {
  try {
    return toast({
      title: "Erro ao enviar notificação",
      description: errorMessage,
      variant: "destructive",
      duration: 10000,
      action: React.createElement(
        ToastAction,
        { altText: "Tentar novamente", onClick: onRetry },
        "Tentar novamente"
      ) as any // Type cast to resolve TypeScript issues
    });
  } catch (error) {
    console.error("Error showing notification error:", error);
    return null;
  }
};
