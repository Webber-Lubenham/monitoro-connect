
import { toast } from "@/hooks/use-toast";
import { ReactNode } from "react";
import { ToastActionElement } from "@/hooks/use-toast";

interface FallbackNotificationOptions {
  fallbackTitle?: string;
  fallbackMessage?: string;
  retryAction?: () => void;
}

/**
 * A simple fallback notification that can be used when other more specific
 * notifications have failed.
 */
export const showFallbackNotification = (
  error: unknown,
  options?: FallbackNotificationOptions
): void => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  // Default titles and messages if not provided
  const fallbackTitle = options?.fallbackTitle || "Something went wrong";
  const fallbackMessage = options?.fallbackMessage || "We couldn't complete your request. Please try again later.";
  
  let action: ToastActionElement | undefined = undefined;
  
  // If a retry action is provided, create a retry button
  if (options?.retryAction) {
    // Create a React element instead of a plain object
    action = {
      altText: "Try again",
      onClick: options.retryAction,
      children: "Try again"
    } as ToastActionElement;
  }
  
  // Show the toast notification
  toast({
    title: fallbackTitle,
    description: `${fallbackMessage} (${errorMessage})`,
    variant: "destructive",
    action
  });
};

/**
 * Creates a fallback email link for notifications
 */
export const createFallbackEmailLink = (payload: {
  guardianEmail: string;
  studentName: string;
  latitude: number;
  longitude: number;
}): string => {
  const { guardianEmail, studentName, latitude, longitude } = payload;
  
  // Create Google Maps link
  const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
  
  // Create email subject and body
  const subject = `Location update from ${studentName}`;
  const body = `
${studentName} has shared their current location with you.

Current location: ${latitude}, ${longitude}

View on map: ${mapUrl}

This email was sent as a fallback notification from the Monitore application.
`;

  // Create mailto link
  return `mailto:${encodeURIComponent(guardianEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

/**
 * Shows a manual fallback option when automated notification fails
 */
export const showManualFallbackOption = (mailtoLink: string): void => {
  toast({
    title: "Manual notification required",
    description: "Couldn't send automated notification. Please click the button below to send via your email client.",
    action: {
      altText: "Send Email",
      onClick: () => window.open(mailtoLink, '_blank'),
      children: "Send Email"
    } as ToastActionElement
  });
};
