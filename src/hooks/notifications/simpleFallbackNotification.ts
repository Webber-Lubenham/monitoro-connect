
import React from 'react';
import { toast } from '@/hooks/use-toast';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ToastAction } from '@/components/ui/toast';

interface NotificationOptions {
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: 'default' | 'destructive';
}

/**
 * A simple fallback notification system that works even if there's no guardian to notify
 * It uses the toast system to show a notification to the user
 */
export const showLocalFallbackNotification = ({
  title = 'Conectado',
  description = 'Sua localização está sendo monitorada',
  action,
  variant = 'default'
}: NotificationOptions) => {
  try {
    // Show the toast with or without an action
    toast({
      title,
      description,
      variant,
      icon: <MessageCircle className="h-4 w-4" />,
      action: action
        ? React.createElement(
            ToastAction,
            {
              altText: action.label,
              onClick: action.onClick,
            },
            action.label
          )
        : undefined,
    });

    // Also log the notification to console for debugging
    console.info(`[Local Notification] ${title}: ${description}`);
  } catch (error) {
    // If there's an error with the toast system, fallback to alert
    console.error('Failed to show toast notification:', error);
    try {
      alert(`${title}: ${description}`);
    } catch {
      // Last resort - just log it
      console.warn(`[NOTIFICATION] ${title}: ${description}`);
    }
  }
};
