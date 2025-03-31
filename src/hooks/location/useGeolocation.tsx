
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { GeolocationPosition, GeolocationPositionError, Location } from "./locationTypes";
import { requestCurrentPosition } from "./geolocationService";
import { positionToLocation } from "./locationUtils";

interface UseGeolocationOptions {
  highAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  watchPosition?: boolean;
}

interface UseGeolocationReturn {
  location: Location | null;
  error: string | null;
  loading: boolean;
  accuracy: number | null;
  timestamp: number | null;
  getLocation: () => Promise<Location | null>;
}

export const useGeolocation = (options: UseGeolocationOptions = {}): UseGeolocationReturn => {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [timestamp, setTimestamp] = useState<number | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);
  const { toast } = useToast();

  // Default options
  const defaultOptions = {
    highAccuracy: true,
    timeout: 10000,
    maximumAge: 0,
    watchPosition: false,
  };

  // Merge default options with provided options
  const geolocationOptions = {
    ...defaultOptions,
    ...options,
  };

  // Handler for successful geolocation
  const handleSuccess = useCallback((position: GeolocationPosition) => {
    try {
      const newLocation = positionToLocation(position);
      setLocation(newLocation);
      setAccuracy(position.coords.accuracy);
      setTimestamp(position.timestamp);
      setError(null);
      setLoading(false);
      return newLocation;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error processing location";
      setError(errorMessage);
      setLoading(false);
      console.error("Error processing location:", error);
      return null;
    }
  }, []);

  // Handler for geolocation errors
  const handleError = useCallback((error: GeolocationPositionError) => {
    setLoading(false);
    let errorMessage = "Failed to get location";
    
    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = "Location permission denied";
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage = "Location information unavailable";
        break;
      case error.TIMEOUT:
        errorMessage = "Location request timed out";
        break;
    }
    
    setError(errorMessage);
    toast({
      title: "Location Error",
      description: errorMessage,
      variant: "destructive",
    });
    
    return null;
  }, [toast]);

  // Function to get current location on demand
  const getLocation = useCallback(async (): Promise<Location | null> => {
    setLoading(true);
    setError(null);
    
    return new Promise((resolve) => {
      requestCurrentPosition(
        {
          highAccuracy: geolocationOptions.highAccuracy,
          timeout: geolocationOptions.timeout,
        },
        (position) => {
          const locationData = handleSuccess(position);
          resolve(locationData);
        },
        (error) => {
          handleError(error);
          resolve(null);
        }
      );
    });
  }, [geolocationOptions, handleSuccess, handleError]);

  // Set up watch position if enabled
  useEffect(() => {
    if (!geolocationOptions.watchPosition) {
      return;
    }

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser");
      return;
    }

    setLoading(true);

    const id = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      {
        enableHighAccuracy: geolocationOptions.highAccuracy,
        timeout: geolocationOptions.timeout,
        maximumAge: geolocationOptions.maximumAge,
      }
    );

    setWatchId(id);

    // Cleanup function
    return () => {
      if (id !== null) {
        navigator.geolocation.clearWatch(id);
      }
    };
  }, [
    geolocationOptions.watchPosition,
    geolocationOptions.highAccuracy,
    geolocationOptions.timeout,
    geolocationOptions.maximumAge,
    handleSuccess,
    handleError,
  ]);

  // Get location immediately unless watching position
  useEffect(() => {
    if (!geolocationOptions.watchPosition) {
      getLocation();
    }
  }, [getLocation, geolocationOptions.watchPosition]);

  return {
    location,
    error,
    loading,
    accuracy,
    timestamp,
    getLocation,
  };
};
