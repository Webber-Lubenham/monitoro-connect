
import { useState, useEffect } from "react";
import { MAP_STYLES } from "./utils/mapboxConfig";
import { MapControls } from "./MapControls";
import { LocationAccuracyInfo } from "./components/LocationAccuracyInfo";
import { LocationLoadingState } from "./components/LocationLoadingState";
import { MapLayerToggle } from "./components/MapLayerToggle";
import MapErrorState from "./components/MapErrorState";
import { useMapInitialization } from "./hooks/useMapInitialization";
import { useLocationUpdate } from "./hooks/useLocationUpdate";
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapContainerProps {
  location: { latitude: number; longitude: number; accuracy?: number } | null;
}

const MapContainer = ({ location }: MapContainerProps) => {
  const [mapStyle, setMapStyle] = useState<string>(MAP_STYLES.STREETS); // Usando estilo de ruas como padrão
  const [customToken, setCustomToken] = useState<string | null>(null);
  
  // Verificar se há um token salvo no localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('mapbox_token');
    if (savedToken) {
      setCustomToken(savedToken);
    }
  }, []);
  
  // Logar atualizações de localização para depuração
  useEffect(() => {
    if (location) {
      console.log("MapContainer: Received location update", {
        lat: location.latitude.toFixed(6),
        lng: location.longitude.toFixed(6),
        accuracy: location.accuracy
      });
    }
  }, [location]);
  
  const { 
    mapContainer, 
    map, 
    marker, 
    hasMapError, 
    isInitialized,
    setMarker 
  } = useMapInitialization({ 
    location, 
    mapStyle,
    customToken
  });

  useLocationUpdate({
    location,
    map,
    marker,
    isInitialized,
    setMarker
  });

  const handleStyleChange = (newStyle: string) => {
    if (map && newStyle !== mapStyle) {
      setMapStyle(newStyle);
      map.setStyle(newStyle);
    }
  };

  const handleTokenUpdate = (token: string) => {
    setCustomToken(token);
  };

  return (
    <div className="relative h-[60vh] rounded-xl overflow-hidden shadow-inner bg-gray-100">
      {hasMapError ? (
        <MapErrorState onTokenUpdate={handleTokenUpdate} />
      ) : (
        <>
          <div ref={mapContainer} className="w-full h-full rounded-xl" />
          {map && <MapControls map={map} />}
          {map && <MapLayerToggle currentStyle={mapStyle} onStyleChange={handleStyleChange} />}
          <LocationAccuracyInfo accuracy={location?.accuracy} />
          <LocationLoadingState isVisible={!location} />
        </>
      )}
    </div>
  );
};

export default MapContainer;
