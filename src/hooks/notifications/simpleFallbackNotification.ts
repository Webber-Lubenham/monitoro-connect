
import { toast, ToastActionElement } from "@/components/ui/use-toast";

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
    // Create toast action without JSX to avoid type issues
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
