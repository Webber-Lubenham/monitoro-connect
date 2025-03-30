
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, MapPin, RefreshCw } from "lucide-react";
import { useGeolocation } from '@/hooks/location/useGeolocation';

const GeolocationExample = () => {
  const [watchMode, setWatchMode] = useState(false);
  
  const {
    location,
    error,
    loading,
    accuracy,
    timestamp,
    getLocation
  } = useGeolocation({
    watchPosition: watchMode,
    highAccuracy: true,
    timeout: 10000
  });

  const toggleWatchMode = () => {
    setWatchMode(!watchMode);
  };

  const handleRefresh = () => {
    if (!watchMode) {
      getLocation();
    }
  };

  const formatTimestamp = (timestamp: number | null) => {
    if (!timestamp) return "Unknown";
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <Card className="p-4 space-y-4">
      <h2 className="text-xl font-bold flex items-center">
        <MapPin className="mr-2 h-5 w-5" />
        Current Location
      </h2>
      
      <div className="grid gap-2">
        <div className="flex justify-between">
          <span className="text-gray-500">Status:</span>
          <span className="font-medium">
            {loading ? (
              <span className="flex items-center text-blue-500">
                <Loader2 className="h-4 w-4 mr-1 animate-spin" /> Loading...
              </span>
            ) : error ? (
              <span className="text-red-500">Error</span>
            ) : (
              <span className="text-green-500">Available</span>
            )}
          </span>
        </div>
        
        {location && (
          <>
            <div className="flex justify-between">
              <span className="text-gray-500">Latitude:</span>
              <span className="font-medium">{location.latitude.toFixed(6)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Longitude:</span>
              <span className="font-medium">{location.longitude.toFixed(6)}</span>
            </div>
            {accuracy && (
              <div className="flex justify-between">
                <span className="text-gray-500">Accuracy:</span>
                <span className="font-medium">{accuracy.toFixed(1)} meters</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-500">Updated:</span>
              <span className="font-medium">{formatTimestamp(timestamp)}</span>
            </div>
          </>
        )}
        
        {error && (
          <div className="text-red-500 mt-2">
            Error: {error}
          </div>
        )}
      </div>
      
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={handleRefresh}
          disabled={loading || watchMode}
          className="flex-1"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
        
        <Button 
          variant={watchMode ? "destructive" : "default"}
          onClick={toggleWatchMode}
          className="flex-1"
        >
          {watchMode ? "Stop Watching" : "Watch Position"}
        </Button>
      </div>
    </Card>
  );
};

export default GeolocationExample;
