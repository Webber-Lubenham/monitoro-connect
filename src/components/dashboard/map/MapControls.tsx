
import { useEffect } from "react";
import mapboxgl from 'mapbox-gl';

interface MapControlsProps {
  map: mapboxgl.Map;
}

export const MapControls = ({ map }: MapControlsProps) => {
  useEffect(() => {
    // Add navigation controls
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.addControl(new mapboxgl.ScaleControl(), 'bottom-right');

    // Add geolocation control
    const geolocateControl = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000
      },
      trackUserLocation: true,
      showUserHeading: true
    });
    
    map.addControl(geolocateControl, 'top-right');
    
    return () => {
      // Remove controls when component unmounts
      // Mapbox doesn't provide a direct way to remove specific controls,
      // but they will be removed with the map
    };
  }, [map]);

  return null; // This component doesn't render anything, it just adds controls to the map
};
