
import { logOperation } from '../../base/baseService';
import { getStudentName } from '../fetch';
import { NotificationLocationData } from './notificationTypes';

/**
 * Format the timestamp for notifications
 */
export const formatNotificationTimestamp = (timestamp?: string): string => {
  const date = timestamp ? new Date(timestamp) : new Date();
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Create Google Maps link from location
 */
export const createMapLink = (location: NotificationLocationData): string => {
  return `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
};

/**
 * Get student name with fallback options
 */
export const getStudentNameWithFallback = async (studentId: string): Promise<string> => {
  try {
    logOperation(`Getting student name for notification, ID: ${studentId}`);
    return await getStudentName(studentId) || 'Aluno';
  } catch (error) {
    logOperation(`Error getting student name: ${error instanceof Error ? error.message : String(error)}`);
    return 'Aluno';
  }
};
