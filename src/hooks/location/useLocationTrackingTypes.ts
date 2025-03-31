
import { Location } from "./locationTypes";

export interface UseLocationTrackingOptions {
  updateInterval?: number; // ms between DB updates
  highAccuracy?: boolean;
  timeout?: number;
}

export const defaultTrackingOptions: UseLocationTrackingOptions = {
  updateInterval: 30000, // 30 seconds
  highAccuracy: true,
  timeout: 15000,
};

export interface LocationTrackingState {
  location: Location | null;
  error: string | null;
  isSharing: boolean;
  lastSentLocation: Date | null;
  accuracy: number | null;
}

export interface LocationTrackingHandlers {
  startSharing: () => void;
  stopSharing: () => void;
}
