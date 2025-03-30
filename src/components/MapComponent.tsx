
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface MapComponentProps {
  location: { latitude: number; longitude: number } | null;
  className?: string;
}

export const MapComponent = ({ location, className }: MapComponentProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainer.current || !location) return;

    // Ensure container is empty
    if (mapContainer.current.innerHTML) {
      mapContainer.current.innerHTML = '';
    }

    // Use token from docs
    const mapboxToken = "pk.eyJ1IjoidGVjaC1lZHUtbGFiIiwiYSI6ImNtNXR0cGticjBuYnUybHF5ZTV3N3l4bGwifQ.aLJiQ4JlUW1Z-D5C9P2kpg";
    
    try {
      // Initialize map with the token
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [location.longitude, location.latitude],
        zoom: 15,
        transformRequest: (url, resourceType) => {
          // Add cache-control for sprite resources to prevent style rebuild warnings
          if (resourceType === 'SpriteImage' || resourceType === 'SpriteJSON') {
            return {
              url: url,
              headers: {
                'Cache-Control': 'max-age=86400'
              }
            };
          }
          return { url };
        }
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

      // Add marker
      marker.current = new mapboxgl.Marker()
        .setLngLat([location.longitude, location.latitude])
        .addTo(map.current);
      
      // Handle map errors
      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
        setError('Erro ao carregar o mapa. Verifique a conexão e tente novamente.');
      });
    } catch (err) {
      console.error("Error initializing map:", err);
      setError('Não foi possível inicializar o mapa. Verifique se o token é válido.');
    }

    return () => {
      if (map.current) {
        try {
          // Check if map still has container before attempting to remove it
          if (map.current.getContainer()) {
            // Remove all listeners to avoid memory leaks - using try/catch for safety
            try {
              // Use removeEventListener for specific events with proper arguments
              map.current.off('error', () => {});
            } catch (err) {
              console.warn("Could not remove map event listeners:", err);
            }
            
            // Only call remove if the map is valid and not already removed
            if (!map.current._removed) {
              map.current.remove();
            }
          }
        } catch (err) {
          console.error("Error cleaning up map:", err);
        }
      }
    };
  }, []);

  // Update marker position when location changes
  useEffect(() => {
    if (location && marker.current && map.current) {
      try {
        marker.current.setLngLat([location.longitude, location.latitude]);
        
        // Only fly to if the map is fully loaded
        if (map.current.loaded()) {
          map.current.flyTo({
            center: [location.longitude, location.latitude],
            essential: true
          });
        }
      } catch (err) {
        console.error("Error updating location:", err);
      }
    }
  }, [location]);

  return (
    <div className="relative">
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10 rounded-xl">
          <div className="bg-white p-4 rounded-lg shadow-lg text-center">
            <p className="text-red-500">{error}</p>
            <button 
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              onClick={() => window.location.reload()}
            >
              Recarregar
            </button>
          </div>
        </div>
      )}
      <div ref={mapContainer} className={className || "h-[400px] w-full rounded-xl"} />
    </div>
  );
};
