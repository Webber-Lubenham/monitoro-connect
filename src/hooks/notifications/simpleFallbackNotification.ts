
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
        ? <ToastAction altText={action.label} onClick={action.onClick}>
            {action.label}
          </ToastAction>
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

// Helper function to create a fallback email link with location data
export const createFallbackEmailLink = (payload: {
  guardianEmail: string;
  studentName: string;
  latitude: number;
  longitude: number;
}): string => {
  const subject = encodeURIComponent(`Localização de ${payload.studentName}`);
  const body = encodeURIComponent(
    `Olá,\n\nEstou compartilhando minha localização com você:\n\n` +
    `Latitude: ${payload.latitude}\n` +
    `Longitude: ${payload.longitude}\n\n` +
    `Veja no mapa: https://www.google.com/maps?q=${payload.latitude},${payload.longitude}\n\n` +
    `Esta mensagem foi enviada automaticamente pelo Sistema Monitore.`
  );
  
  return `mailto:${payload.guardianEmail}?subject=${subject}&body=${body}`;
};

// Shows a manual option for sending fallback notification
export const showManualFallbackOption = (mailtoLink: string) => {
  showLocalFallbackNotification({
    title: 'Notificação direta falhou',
    description: 'Não foi possível enviar notificação automática. Clique para enviar manualmente.',
    variant: 'destructive',
    action: {
      label: 'Enviar Email',
      onClick: () => {
        window.open(mailtoLink, '_blank');
      }
    }
  });
};
