
import { supabase } from "@/integrations/supabase/client";
import type { StudentStatus } from "@/types/location.types";

export const updateLocationInDatabase = async (
  userId: string,
  latitude: number,
  longitude: number,
  status: StudentStatus,
  accuracy: number
) => {
  const { error } = await supabase.from('location_updates').insert({
    student_id: userId,
    latitude,
    longitude,
    timestamp: new Date().toISOString(),
    status,
    accuracy,
    battery_level: await getBatteryLevel()
  });

  if (error) throw error;
};

export const notifyGuardiansViaFunction = async (
  userId: string,
  location: { latitude: number; longitude: number },
  status: StudentStatus,
  accuracy: number
) => {
  const { error } = await supabase.functions.invoke('notify-location', {
    body: {
      studentId: userId,
      latitude: location.latitude,
      longitude: location.longitude,
      timestamp: new Date().toISOString(),
      status,
      accuracy
    },
  });

  if (error) throw error;
};

export const fetchSchools = async () => {
  const { data: schools, error } = await supabase.from('schools').select('*');
  if (error) throw error;
  return schools;
};

const getBatteryLevel = async (): Promise<number | undefined> => {
  if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
    const battery = await (navigator as any).getBattery();
    return battery.level * 100;
  }
  return undefined;
};
