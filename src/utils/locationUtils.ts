
import type { LocationData } from "@/types/location.types";

export const findNearbySchool = (schools: any[], location: LocationData) => {
  return schools.find(school => {
    const R = 6371e3;
    const φ1 = location.latitude * Math.PI/180;
    const φ2 = school.latitude * Math.PI/180;
    const Δφ = (school.latitude - location.latitude) * Math.PI/180;
    const Δλ = (school.longitude - location.longitude) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;

    return distance < school.radius;
  });
};

export const getBatteryLevel = async (): Promise<number | undefined> => {
  if ('getBattery' in navigator) {
    const battery = await (navigator as any).getBattery();
    return battery.level * 100;
  }
  return undefined;
};
