
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { cn } from '@/lib/utils';

// Use the MapBox token provided
mapboxgl.accessToken = 'pk.eyJ1IjoiZnJhbmstd2ViYmVyIiwiYSI6ImNscmhkdnhnYjA2N28ya3A3OXVpaHJnMm8ifQ.Ry9YO5UULkwxJH9uQUDyYQ';

interface MapboxMapProps {
  coordinates: [number, number]; // [longitude, latitude]
  isSharing: boolean;
  className?: string;
}

const MapboxMap = ({ coordinates, isSharing, className }: MapboxMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: coordinates,
      zoom: 15,
      pitch: 30,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    
    // Create a custom marker element
    const markerElement = document.createElement('div');
    markerElement.className = 'flex items-center justify-center';
    markerElement.innerHTML = `
      <div class="h-6 w-6 bg-monitoro-500 rounded-full border-2 border-white flex items-center justify-center">
        <span class="text-white text-xs">S</span>
      </div>
    `;
    
    // Add marker to map
    marker.current = new mapboxgl.Marker(markerElement)
      .setLngLat(coordinates)
      .addTo(map.current);
    
    // Cleanup function
    return () => {
      if (map.current) map.current.remove();
    };
  }, []);

  // Update marker position when coordinates change
  useEffect(() => {
    if (marker.current && map.current) {
      marker.current.setLngLat(coordinates);
      map.current.flyTo({
        center: coordinates,
        essential: true,
        duration: 1000
      });
    }
  }, [coordinates]);

  return (
    <div className={cn('relative rounded-lg overflow-hidden', className)}>
      {!isSharing && (
        <div className="absolute inset-0 bg-gray-200/70 dark:bg-gray-800/70 z-10 flex items-center justify-center">
          <div className="text-center px-4">
            <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
              Compartilhamento de localização desativado
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Ative o compartilhamento para visualizar sua localização em tempo real
            </p>
          </div>
        </div>
      )}
      <div ref={mapContainer} className="h-full w-full" />
    </div>
  );
};

export default MapboxMap;
