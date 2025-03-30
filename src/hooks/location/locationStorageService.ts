
export const saveWatchIdToStorage = (watchId: number): void => {
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem('locationWatchId', watchId.toString());
      console.log(`Saved watch ID ${watchId} to localStorage`);
    } catch (e) {
      console.log('Could not store watchId in localStorage');
    }
  }
};

export const getWatchIdFromStorage = (): number | null => {
  if (typeof window !== 'undefined') {
    try {
      const watchId = window.localStorage.getItem('locationWatchId');
      return watchId ? parseInt(watchId, 10) : null;
    } catch (e) {
      console.log('Could not retrieve watchId from localStorage');
      return null;
    }
  }
  return null;
};

export const removeWatchIdFromStorage = (): void => {
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.removeItem('locationWatchId');
      console.log('Removed watchId from localStorage');
    } catch (e) {
      console.log('Could not remove watchId from localStorage');
    }
  }
};

export const saveLocationSettingsToStorage = (settings: {
  enabled: boolean;
  interval?: number;
  highAccuracy?: boolean;
}): void => {
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem('locationSettings', JSON.stringify(settings));
    } catch (e) {
      console.log('Could not store locationSettings in localStorage');
    }
  }
};

export const getLocationSettingsFromStorage = (): {
  enabled: boolean;
  interval?: number;
  highAccuracy?: boolean;
} | null => {
  if (typeof window !== 'undefined') {
    try {
      const settings = window.localStorage.getItem('locationSettings');
      return settings ? JSON.parse(settings) : null;
    } catch (e) {
      console.log('Could not retrieve locationSettings from localStorage');
      return null;
    }
  }
  return null;
};

export const clearLocationDataFromStorage = (): void => {
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.removeItem('locationWatchId');
      window.localStorage.removeItem('locationSettings');
      console.log('Cleared all location data from localStorage');
    } catch (e) {
      console.log('Could not clear location data from localStorage');
    }
  }
};
