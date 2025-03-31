export interface PrivacySettings {
  sharingSchedule?: {
    startTime: string;
    endTime: string;
  };
  safeZones?: {
    latitude: number;
    longitude: number;
    radius: number; // em metros
  }[];
  precisionLevel?: 'high' | 'medium' | 'low';
  privacyModeEnabled?: boolean;
}

export const defaultPrivacySettings: PrivacySettings = {
  sharingSchedule: {
    startTime: '08:00',
    endTime: '18:00'
  },
  precisionLevel: 'high',
  privacyModeEnabled: false
};

export const isSharingAllowed = (settings: PrivacySettings): boolean => {
  if (settings.privacyModeEnabled) return false;

  if (settings.sharingSchedule) {
    const now = new Date();
    const [startHour, startMinute] = settings.sharingSchedule.startTime.split(':');
    const [endHour, endMinute] = settings.sharingSchedule.endTime.split(':');
    
    const startTime = new Date();
    startTime.setHours(Number(startHour), Number(startMinute), 0, 0);
    
    const endTime = new Date();
    endTime.setHours(Number(endHour), Number(endMinute), 0, 0);
    
    if (now < startTime || now > endTime) {
      return false;
    }
  }
  
  return true;
};

export const adjustPrecision = (location: { latitude: number; longitude: number }, precision: 'high' | 'medium' | 'low') => {
  const factor = precision === 'high' ? 100000 : precision === 'medium' ? 10000 : 1000;
  return {
    latitude: Math.round(location.latitude * factor) / factor,
    longitude: Math.round(location.longitude * factor) / factor
  };
};

export const isInSafeZone = (location: { latitude: number; longitude: number }, safeZones: { latitude: number; longitude: number; radius: number }[]) => {
  for (const zone of safeZones) {
    const distance = calculateDistance(location, zone);
    if (distance <= zone.radius) {
      return true;
    }
  }
  return false;
};

const calculateDistance = (loc1: { latitude: number; longitude: number }, loc2: { latitude: number; longitude: number }) => {
  const R = 6371e3; // raio da Terra em metros
  const φ1 = loc1.latitude * Math.PI/180;
  const φ2 = loc2.latitude * Math.PI/180;
  const Δφ = (loc2.latitude - loc1.latitude) * Math.PI/180;
  const Δλ = (loc2.longitude - loc1.longitude) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
};
