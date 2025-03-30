
/**
 * Utility functions for handling location accuracy
 */

/**
 * Get a human-readable description of the accuracy level
 */
export const getAccuracyDescription = (accuracyMeters: number): string => {
  if (accuracyMeters < 50) return "Alta precisão";
  if (accuracyMeters < 100) return "Boa precisão";
  if (accuracyMeters < 500) return "Precisão média";
  if (accuracyMeters < 1000) return "Baixa precisão";
  return "Precisão muito baixa";
};

/**
 * Format the accuracy for display
 */
export const formatAccuracy = (accuracy: number): string => {
  return `${Math.round(accuracy)}m`;
};

/**
 * Check if the accuracy is considered low
 */
export const isLowAccuracy = (accuracy: number): boolean => {
  return accuracy > 500;
};
